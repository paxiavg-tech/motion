/**
 * Background Render Guard Service
 * 
 * Solves the critical issue where browser tabs throttle timers, pause WebCodecs, 
 * or freeze canvas rendering when the user switches tabs or minimizes the window.
 * 
 * Mechanisms employed:
 * 1. Web Audio Keep-Alive: Browsers (Chrome, Edge, Firefox, Safari) strictly 
 *    exempt tabs with active audio playback from background CPU/timer throttling.
 *    A zero-volume imperceptible audio tone is played during render.
 * 2. Screen & System WakeLock: Prevents the monitor and operating system from 
 *    entering sleep/standby mode while exporting 4K media.
 * 3. Dynamic Document Title: Shows real-time percentage in the browser tab bar 
 *    so creators can monitor progress while multitasking in other applications.
 */

export class BackgroundRenderGuard {
  private audioCtx: AudioContext | null = null;
  private oscillator: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private wakeLock: any = null;
  private originalTitle: string = '';
  private isActive: boolean = false;

  public async start(): Promise<void> {
    if (this.isActive) return;
    this.isActive = true;

    if (typeof document !== 'undefined') {
      this.originalTitle = document.title;
    }

    // 1. Initialize Web Audio Keep-Alive (Zero Volume / Inaudible)
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
        if (this.audioCtx.state === 'suspended') {
          await this.audioCtx.resume();
        }

        this.oscillator = this.audioCtx.createOscillator();
        this.gainNode = this.audioCtx.createGain();

        // Frequency well outside harsh range, gain at 0.00001 (inaudible, but registers as active stream to browser engine)
        this.oscillator.type = 'sine';
        this.oscillator.frequency.setValueAtTime(440, this.audioCtx.currentTime);
        this.gainNode.gain.setValueAtTime(0.00001, this.audioCtx.currentTime);

        this.oscillator.connect(this.gainNode);
        this.gainNode.connect(this.audioCtx.destination);
        this.oscillator.start();
      }
    } catch (audioErr) {
      console.warn('[BackgroundRenderGuard] Web Audio keep-alive initialization skipped:', audioErr);
    }

    // 2. Request Screen WakeLock if supported
    try {
      if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
        this.wakeLock = await (navigator as any).wakeLock.request('screen');
        this.wakeLock.addEventListener('release', () => {
          // Re-acquire if released while render is still active
          if (this.isActive) {
            (navigator as any).wakeLock?.request('screen').then((lock: any) => {
              this.wakeLock = lock;
            }).catch(() => {});
          }
        });
      }
    } catch (wakeErr) {
      console.warn('[BackgroundRenderGuard] Screen WakeLock unavailable:', wakeErr);
    }
  }

  public updateProgress(percentage: number, currentFrame: number, totalFrames: number, fps: number): void {
    if (typeof document === 'undefined') return;
    document.title = `[${percentage}%] Rendering 4K (${fps} fps) · Frame ${currentFrame}/${totalFrames}`;
  }

  public notifyComplete(fileName: string): void {
    if (typeof document === 'undefined') return;
    document.title = `✅ [SELESAI 100%] ${fileName}`;

    // Gentle completion chime using the audio context before teardown
    try {
      if (this.audioCtx && this.audioCtx.state !== 'closed') {
        const chimeOsc = this.audioCtx.createOscillator();
        const chimeGain = this.audioCtx.createGain();
        chimeOsc.type = 'triangle';
        chimeOsc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime); // D5
        chimeOsc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.15); // A5
        chimeGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
        chimeGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.4);
        chimeOsc.connect(chimeGain);
        chimeGain.connect(this.audioCtx.destination);
        chimeOsc.start();
        chimeOsc.stop(this.audioCtx.currentTime + 0.45);
      }
    } catch {}
  }

  public stop(): void {
    if (!this.isActive) return;
    this.isActive = false;

    // Restore title
    if (typeof document !== 'undefined' && this.originalTitle) {
      document.title = this.originalTitle;
    }

    // Release audio
    try {
      if (this.oscillator) {
        this.oscillator.stop();
        this.oscillator.disconnect();
        this.oscillator = null;
      }
      if (this.gainNode) {
        this.gainNode.disconnect();
        this.gainNode = null;
      }
      if (this.audioCtx && this.audioCtx.state !== 'closed') {
        this.audioCtx.close();
        this.audioCtx = null;
      }
    } catch {}

    // Release wakeLock
    try {
      if (this.wakeLock) {
        this.wakeLock.release();
        this.wakeLock = null;
      }
    } catch {}
  }
}

/**
 * High performance yielding utility using MessageChannel.
 * Unlike setTimeout(fn, 0), MessageChannel port messages are NOT throttled 
 * to 1,000ms by Chromium/WebKit when the tab is hidden or backgrounded!
 */
export function yieldToMacroTask(): Promise<void> {
  if (typeof MessageChannel !== 'undefined') {
    return new Promise<void>((resolve) => {
      const channel = new MessageChannel();
      channel.port1.onmessage = () => {
        channel.port1.close();
        channel.port2.close();
        resolve();
      };
      channel.port2.postMessage(null);
    });
  }
  return new Promise<void>((resolve) => setTimeout(resolve, 0));
}
