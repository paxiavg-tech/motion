import { Muxer as Mp4Muxer, ArrayBufferTarget as Mp4ArrayBufferTarget } from 'mp4-muxer';
import { Muxer as WebmMuxer, ArrayBufferTarget as WebmArrayBufferTarget } from 'webm-muxer';
import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import JSZip from 'jszip';
import { MotionConfig, RESOLUTION_PRESETS, ExportFormat, RenderProgress } from '../types/motion';
import { drawMotionGraphicFrame } from './motionEngine';
import { BackgroundRenderGuard, yieldToMacroTask } from './backgroundRenderGuard';

export interface ExportOptions {
  config: MotionConfig;
  format: ExportFormat;
  onProgress: (progress: RenderProgress) => void;
  shouldAbort: () => boolean;
  loadedTextures?: Record<string, HTMLImageElement>;
}

export async function exportMotionGraphicVideo({
  config,
  format,
  onProgress,
  shouldAbort,
  loadedTextures,
}: ExportOptions): Promise<{ blob: Blob; fileName: string }> {
  const res = RESOLUTION_PRESETS[config.resolution];
  const width = res.width;
  const height = res.height;
  const fps = config.fps;
  const duration = config.durationSeconds;
  const totalFrames = Math.round(duration * fps);
  const bitrate = config.bitrateMbps * 1_000_000;

  const startTime = performance.now();

  // Create high-res offscreen rendering canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', {
    alpha: true,
    willReadFrequently: false,
    colorSpace: 'srgb',
  });

  if (!ctx) {
    throw new Error('Gagal menginisialisasi 2D Canvas context untuk resolusi 4K');
  }

  // Initialize BackgroundRenderGuard: Keeps tab alive with WebAudio & WakeLock
  const guard = new BackgroundRenderGuard();
  await guard.start();

  const hasWebCodecs = typeof window !== 'undefined' && 'VideoEncoder' in window && 'VideoFrame' in window;

  try {
    if ((format === 'mp4' || format === 'webm') && hasWebCodecs) {
      try {
        const result = await renderWithWebCodecsUnified({
          canvas,
          ctx,
          config,
          width,
          height,
          fps,
          totalFrames,
          bitrate,
          format,
          startTime,
          onProgress,
          shouldAbort,
          loadedTextures,
          guard,
        });
        guard.notifyComplete(result.fileName);
        return result;
      } catch (webCodecsError) {
        if (shouldAbort()) {
          throw new Error('Render dibatalkan oleh pengguna');
        }

        console.warn(
          'WebCodecs creation/runtime error. Falling back automatically to universal MediaRecorder engine:',
          webCodecsError
        );

        onProgress({
          isRendering: true,
          currentFrame: 0,
          totalFrames,
          percentage: 0,
          fps: 0,
          elapsedTime: Math.round((performance.now() - startTime) / 1000),
          estimatedRemaining: 0,
          statusText: 'Beralih ke Universal MediaRecorder Engine...',
        });

        const result = await renderWithMediaRecorder({
          canvas,
          ctx,
          config,
          width,
          height,
          fps,
          totalFrames,
          bitrate,
          format,
          startTime,
          onProgress,
          shouldAbort,
          loadedTextures,
          guard,
        });
        guard.notifyComplete(result.fileName);
        return result;
      }
    } else if (format === 'png_sequence') {
      const result = await renderPngSequenceZip({
        canvas,
        ctx,
        config,
        width,
        height,
        fps,
        totalFrames,
        startTime,
        onProgress,
        shouldAbort,
        loadedTextures,
        guard,
      });
      guard.notifyComplete(result.fileName);
      return result;
    } else if (format === 'gif') {
      const result = await renderPinterestGif({
        config,
        startTime,
        onProgress,
        shouldAbort,
        loadedTextures,
        guard,
      });
      guard.notifyComplete(result.fileName);
      return result;
    } else {
      // MediaRecorder fallback export
      const result = await renderWithMediaRecorder({
        canvas,
        ctx,
        config,
        width,
        height,
        fps,
        totalFrames,
        bitrate,
        format,
        startTime,
        onProgress,
        shouldAbort,
        loadedTextures,
        guard,
      });
      guard.notifyComplete(result.fileName);
      return result;
    }
  } finally {
    // Guaranteed teardown of audio keep-alive and wake locks
    guard.stop();
  }
}

// ----------------------------------------------------------------------
// Codec Negotiation Helper for WebCodecs MP4 & WebM
// ----------------------------------------------------------------------
async function negotiateSupportedCodec(
  format: 'mp4' | 'webm',
  width: number,
  height: number,
  fps: number,
  bitrate: number
): Promise<{ config: any; muxerCodec: 'avc' | 'vp9' | 'V_VP9' | 'V_VP8' } | null> {
  if (typeof window === 'undefined' || !('VideoEncoder' in window)) {
    return null;
  }

  const VideoEncoderClass = (window as any).VideoEncoder;
  if (!VideoEncoderClass || typeof VideoEncoderClass.isConfigSupported !== 'function') {
    return null;
  }

  const is4K = width >= 3840 || height >= 2160;

  if (format === 'mp4') {
    const codecCandidates: Array<{ codec: string; muxerCodec: 'avc' | 'vp9' }> = is4K
      ? [
          { codec: 'avc1.640034', muxerCodec: 'avc' }, // High Profile Level 5.2 (Native 4K 60fps)
          { codec: 'avc1.640033', muxerCodec: 'avc' }, // High Profile Level 5.1 (Native 4K 30/60fps)
          { codec: 'avc1.4d0034', muxerCodec: 'avc' }, // Main Profile Level 5.2
          { codec: 'avc1.4d0033', muxerCodec: 'avc' }, // Main Profile Level 5.1
          { codec: 'avc1.420034', muxerCodec: 'avc' }, // Baseline Profile Level 5.2
          { codec: 'avc1.420033', muxerCodec: 'avc' }, // Baseline Profile Level 5.1
          { codec: 'vp09.00.50.08', muxerCodec: 'vp9' },
        ]
      : [
          { codec: 'avc1.640033', muxerCodec: 'avc' },
          { codec: 'avc1.64002a', muxerCodec: 'avc' },
          { codec: 'avc1.4d002a', muxerCodec: 'avc' },
          { codec: 'avc1.42002a', muxerCodec: 'avc' },
        ];

    const accelPreferences: ('no-preference' | 'prefer-software' | 'prefer-hardware')[] = [
      'no-preference',
      'prefer-software',
      'prefer-hardware',
    ];

    const targetBitrate = Math.max(bitrate, is4K ? 50_000_000 : 20_000_000);

    for (const accel of accelPreferences) {
      for (const cand of codecCandidates) {
        try {
          const testConfig = {
            codec: cand.codec,
            width,
            height,
            bitrate: targetBitrate,
            framerate: fps,
            hardwareAcceleration: accel,
            latencyMode: 'quality',
            bitrateMode: 'variable',
          };

          const result = await VideoEncoderClass.isConfigSupported(testConfig);
          if (result && result.supported && result.config) {
            return {
              config: {
                ...result.config,
                bitrate: targetBitrate,
                latencyMode: 'quality',
              },
              muxerCodec: cand.muxerCodec,
            };
          }
        } catch {}
      }
    }

    // Fallback pass without latencyMode
    for (const accel of accelPreferences) {
      for (const cand of codecCandidates) {
        try {
          const testConfig = {
            codec: cand.codec,
            width,
            height,
            bitrate: targetBitrate,
            framerate: fps,
            hardwareAcceleration: accel,
          };

          const result = await VideoEncoderClass.isConfigSupported(testConfig);
          if (result && result.supported && result.config) {
            return {
              config: {
                ...result.config,
                bitrate: targetBitrate,
              },
              muxerCodec: cand.muxerCodec,
            };
          }
        } catch {}
      }
    }
  } else {
    // WebM codecs
    const webmCandidates: Array<{ codec: string; muxerCodec: 'V_VP9' | 'V_VP8' }> = is4K
      ? [
          { codec: 'vp09.00.50.08', muxerCodec: 'V_VP9' },
          { codec: 'vp09.00.41.08', muxerCodec: 'V_VP9' },
          { codec: 'vp8', muxerCodec: 'V_VP8' },
        ]
      : [
          { codec: 'vp09.00.41.08', muxerCodec: 'V_VP9' },
          { codec: 'vp09.00.10.08', muxerCodec: 'V_VP9' },
          { codec: 'vp8', muxerCodec: 'V_VP8' },
        ];

    const targetBitrate = Math.max(bitrate, is4K ? 45_000_000 : 18_000_000);

    for (const cand of webmCandidates) {
      try {
        const testConfig = {
          codec: cand.codec,
          width,
          height,
          bitrate: targetBitrate,
          framerate: fps,
        };

        const result = await VideoEncoderClass.isConfigSupported(testConfig);
        if (result && result.supported && result.config) {
          return {
            config: {
              ...result.config,
              bitrate: targetBitrate,
            },
            muxerCodec: cand.muxerCodec,
          };
        }
      } catch {}
    }
  }

  return null;
}

// ----------------------------------------------------------------------
// 1. Unified WebCodecs Fast Offline Engine (MP4 and WebM)
// ----------------------------------------------------------------------
async function renderWithWebCodecsUnified({
  canvas,
  ctx,
  config,
  width,
  height,
  fps,
  totalFrames,
  bitrate,
  format,
  startTime,
  onProgress,
  shouldAbort,
  loadedTextures,
  guard,
}: {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  config: MotionConfig;
  width: number;
  height: number;
  fps: number;
  totalFrames: number;
  bitrate: number;
  format: 'mp4' | 'webm';
  startTime: number;
  onProgress: (p: RenderProgress) => void;
  shouldAbort: () => boolean;
  loadedTextures?: Record<string, HTMLImageElement>;
  guard: BackgroundRenderGuard;
}): Promise<{ blob: Blob; fileName: string }> {
  const negotiated = await negotiateSupportedCodec(format, width, height, fps, bitrate);
  if (!negotiated) {
    throw new Error(`WebCodecs VideoEncoder tidak mendukung encoding format ${format.toUpperCase()} di browser Anda.`);
  }

  let muxer: any;
  let target: any;

  if (format === 'mp4') {
    target = new Mp4ArrayBufferTarget();
    muxer = new Mp4Muxer({
      target,
      video: {
        codec: negotiated.muxerCodec as 'avc' | 'vp9',
        width,
        height,
      },
      fastStart: 'in-memory',
      firstTimestampBehavior: 'offset',
    });
  } else {
    target = new WebmArrayBufferTarget();
    muxer = new WebmMuxer({
      target,
      video: {
        codec: negotiated.muxerCodec as 'V_VP9' | 'V_VP8',
        width,
        height,
        frameRate: fps,
      },
      firstTimestampBehavior: 'offset',
    });
  }

  let encoderError: Error | null = null;

  const encoder = new VideoEncoder({
    output: (chunk, meta) => {
      try {
        muxer.addVideoChunk(chunk, meta);
      } catch (err) {
        encoderError = err as Error;
      }
    },
    error: (e) => {
      encoderError = e instanceof Error ? e : new Error(String((e as any)?.message || e));
      console.warn('VideoEncoder error callback:', e);
    },
  });

  try {
    encoder.configure(negotiated.config);
  } catch (err) {
    try {
      if (encoder.state !== 'closed') encoder.close();
    } catch {}
    throw err;
  }

  // Quick tick to detect immediate asynchronous configure failure
  await yieldToMacroTask();
  if (encoderError) {
    try {
      if (encoder.state !== 'closed') encoder.close();
    } catch {}
    throw encoderError;
  }

  const frameDurationUs = Math.round(1_000_000 / fps);

  for (let frame = 0; frame < totalFrames; frame++) {
    if (shouldAbort()) {
      try {
        if (encoder.state !== 'closed') encoder.close();
      } catch {}
      throw new Error('Render dibatalkan oleh pengguna');
    }

    if (encoderError) {
      try {
        if (encoder.state !== 'closed') encoder.close();
      } catch {}
      throw encoderError;
    }

    if (encoder.state === 'closed') {
      throw new Error('VideoEncoder terminated unexpectedly');
    }

    const timeSec = frame / fps;
    const progress = frame / totalFrames;

    // Draw frame deterministically at exact timestamp
    drawMotionGraphicFrame({
      ctx,
      config,
      time: timeSec,
      progress,
      width,
      height,
      loadedTextures,
      isExportingOffline: true,
    });

    const timestampUs = frame * frameDurationUs;
    const videoFrame = new VideoFrame(canvas, {
      timestamp: timestampUs,
      duration: frameDurationUs,
    });

    // Keyframe every 1 second (GOP = 1.0s)
    const keyFrame = frame % fps === 0;
    try {
      encoder.encode(videoFrame, { keyFrame });
    } finally {
      videoFrame.close();
    }

    // Unthrottled backpressure control:
    // Uses yieldToMacroTask instead of setTimeout so background tabs never pause for 1000ms!
    while (encoder.encodeQueueSize >= 4 && !encoderError && (encoder.state as string) !== 'closed') {
      await new Promise<void>((resolve) => {
        let done = false;
        const onDone = () => {
          if (!done) {
            done = true;
            resolve();
          }
        };
        encoder.addEventListener('dequeue', onDone, { once: true });
        yieldToMacroTask().then(onDone);
      });
    }

    // Report progress
    const now = performance.now();
    const elapsed = (now - startTime) / 1000;
    const framesDone = frame + 1;
    const currentFps = elapsed > 0 ? Math.round((framesDone / elapsed) * 10) / 10 : 0;
    const remainingSec = currentFps > 0 ? Math.round((totalFrames - framesDone) / currentFps) : 0;
    const percentage = Math.round((framesDone / totalFrames) * 100);

    let previewUrl: string | undefined = undefined;
    if (frame % 15 === 0 || frame === totalFrames - 1) {
      previewUrl = createScaledPreview(canvas);
    }

    guard.updateProgress(percentage, framesDone, totalFrames, currentFps);

    onProgress({
      isRendering: true,
      currentFrame: framesDone,
      totalFrames,
      percentage,
      fps: currentFps,
      elapsedTime: Math.round(elapsed),
      estimatedRemaining: remainingSec,
      previewDataUrl: previewUrl,
      statusText: `Rendering 4K ${format.toUpperCase()}: Frame ${framesDone}/${totalFrames} (${currentFps} fps)`,
    });

    // Yield to macro-task every 6 frames so background event loop stays fluid without throttling
    if (frame % 6 === 0) {
      await yieldToMacroTask();
    }
  }

  await encoder.flush();
  try {
    if (encoder.state !== 'closed') encoder.close();
  } catch {}
  muxer.finalize();

  const buffer = target.buffer;
  const mimeType = format === 'mp4' ? 'video/mp4' : 'video/webm';
  const blob = new Blob([buffer], { type: mimeType });
  const baseName = config.exportFileName?.trim()
    ? config.exportFileName.trim().replace(/[\\/:*?"<>|]/g, '_').replace(/\.[^/.]+$/, '')
    : (config.templateId || 'render');
  const fileName = `${baseName}.${format}`;

  return { blob, fileName };
}

// ----------------------------------------------------------------------
// 2. MediaRecorder Stepper Engine (Fallback)
// ----------------------------------------------------------------------
async function renderWithMediaRecorder({
  canvas,
  ctx,
  config,
  width,
  height,
  fps,
  totalFrames,
  bitrate,
  format,
  startTime,
  onProgress,
  shouldAbort,
  loadedTextures,
  guard,
}: {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  config: MotionConfig;
  width: number;
  height: number;
  fps: number;
  totalFrames: number;
  bitrate: number;
  format: ExportFormat;
  startTime: number;
  onProgress: (p: RenderProgress) => void;
  shouldAbort: () => boolean;
  loadedTextures?: Record<string, HTMLImageElement>;
  guard: BackgroundRenderGuard;
}): Promise<{ blob: Blob; fileName: string }> {
  const mimeType = getOptimalMimeType(format);
  const stream = typeof canvas.captureStream === 'function' ? canvas.captureStream(0) : (canvas as any).captureStream();
  const videoTrack = stream.getVideoTracks()[0];

  let recorder: MediaRecorder;
  try {
    recorder = mimeType
      ? new MediaRecorder(stream, { mimeType, videoBitsPerSecond: Math.min(bitrate, 50_000_000) })
      : new MediaRecorder(stream);
  } catch {
    try {
      recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
    } catch {
      recorder = new MediaRecorder(stream);
    }
  }

  const chunks: BlobPart[] = [];
  recorder.ondataavailable = (e) => {
    if (e.data && e.data.size > 0) chunks.push(e.data);
  };

  const recordingPromise = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      const actualMime = recorder.mimeType || mimeType || 'video/mp4';
      const blob = new Blob(chunks, { type: actualMime });
      resolve(blob);
    };
    recorder.onerror = (e) => reject(e);
  });

  recorder.start();

  const frameIntervalMs = 1000 / fps;

  for (let frame = 0; frame < totalFrames; frame++) {
    if (shouldAbort()) {
      if (recorder.state === 'recording') {
        try { recorder.stop(); } catch {}
      }
      throw new Error('Render dibatalkan oleh pengguna');
    }

    const timeSec = frame / fps;
    const progress = frame / totalFrames;

    drawMotionGraphicFrame({
      ctx,
      config,
      time: timeSec,
      progress,
      width,
      height,
      loadedTextures,
      isExportingOffline: true,
    });

    if (videoTrack && typeof (videoTrack as any).requestFrame === 'function') {
      try {
        (videoTrack as any).requestFrame();
      } catch {}
    }

    // Paced deterministic capture with background guard active
    await new Promise((r) => setTimeout(r, Math.max(16, frameIntervalMs * 0.95)));

    const now = performance.now();
    const elapsed = (now - startTime) / 1000;
    const framesDone = frame + 1;
    const currentFps = elapsed > 0 ? Math.round((framesDone / elapsed) * 10) / 10 : 0;
    const remainingSec = currentFps > 0 ? Math.round((totalFrames - framesDone) / currentFps) : 0;
    const percentage = Math.round((framesDone / totalFrames) * 100);

    let previewUrl: string | undefined = undefined;
    if (frame % 15 === 0 || frame === totalFrames - 1) {
      previewUrl = createScaledPreview(canvas);
    }

    guard.updateProgress(percentage, framesDone, totalFrames, currentFps);

    onProgress({
      isRendering: true,
      currentFrame: framesDone,
      totalFrames,
      percentage,
      fps: currentFps,
      elapsedTime: Math.round(elapsed),
      estimatedRemaining: remainingSec,
      previewDataUrl: previewUrl,
      statusText: `Rendering 4K (MediaRecorder): Frame ${framesDone}/${totalFrames}`,
    });

    await yieldToMacroTask();
  }

  if (recorder.state === 'recording') {
    try {
      if (videoTrack && typeof (videoTrack as any).requestFrame === 'function') {
        (videoTrack as any).requestFrame();
      }
    } catch {}
    recorder.stop();
  }

  const blob = await recordingPromise;
  const actualMime = recorder.mimeType || mimeType || '';
  const ext = actualMime.includes('mp4') ? 'mp4' : 'webm';
  const baseName = config.exportFileName?.trim()
    ? config.exportFileName.trim().replace(/[\\/:*?"<>|]/g, '_').replace(/\.[^/.]+$/, '')
    : (config.templateId || 'render');
  const fileName = `${baseName}.${ext}`;

  return { blob, fileName };
}

// ----------------------------------------------------------------------
// 3. PNG Sequence ZIP (Lossless 4K with Alpha Transparency)
// ----------------------------------------------------------------------
async function renderPngSequenceZip({
  canvas,
  ctx,
  config,
  width,
  height,
  fps,
  totalFrames,
  startTime,
  onProgress,
  shouldAbort,
  loadedTextures,
  guard,
}: {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  config: MotionConfig;
  width: number;
  height: number;
  fps: number;
  totalFrames: number;
  startTime: number;
  onProgress: (p: RenderProgress) => void;
  shouldAbort: () => boolean;
  loadedTextures?: Record<string, HTMLImageElement>;
  guard: BackgroundRenderGuard;
}): Promise<{ blob: Blob; fileName: string }> {
  const zip = new JSZip();
  const framesFolder = zip.folder('4k_frames');

  for (let frame = 0; frame < totalFrames; frame++) {
    if (shouldAbort()) {
      throw new Error('Render dibatalkan oleh pengguna');
    }

    const timeSec = frame / fps;
    const progress = frame / totalFrames;

    drawMotionGraphicFrame({
      ctx,
      config,
      time: timeSec,
      progress,
      width,
      height,
      loadedTextures,
      isExportingOffline: true,
    });

    const frameBlob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
    if (frameBlob && framesFolder) {
      const paddedIndex = String(frame).padStart(5, '0');
      framesFolder.file(`frame_${paddedIndex}.png`, frameBlob);
    }

    const now = performance.now();
    const elapsed = (now - startTime) / 1000;
    const framesDone = frame + 1;
    const currentFps = elapsed > 0 ? Math.round((framesDone / elapsed) * 10) / 10 : 0;
    const remainingSec = currentFps > 0 ? Math.round((totalFrames - framesDone) / currentFps) : 0;
    const percentage = Math.round((framesDone / totalFrames) * 100);

    let previewUrl: string | undefined = undefined;
    if (frame % 15 === 0 || frame === totalFrames - 1) {
      previewUrl = createScaledPreview(canvas);
    }

    guard.updateProgress(percentage, framesDone, totalFrames, currentFps);

    onProgress({
      isRendering: true,
      currentFrame: framesDone,
      totalFrames,
      percentage,
      fps: currentFps,
      elapsedTime: Math.round(elapsed),
      estimatedRemaining: remainingSec,
      previewDataUrl: previewUrl,
      statusText: `Packaging 4K PNG Sequence: Frame ${framesDone}/${totalFrames}`,
    });

    if (frame % 4 === 0) {
      await yieldToMacroTask();
    }
  }

  onProgress({
    isRendering: true,
    currentFrame: totalFrames,
    totalFrames,
    percentage: 99,
    fps: 0,
    elapsedTime: Math.round((performance.now() - startTime) / 1000),
    estimatedRemaining: 1,
    statusText: 'Mengompresi arsip ZIP 4K kualitas tinggi...',
  });

  const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  const baseName = config.exportFileName?.trim()
    ? config.exportFileName.trim().replace(/[\\/:*?"<>|]/g, '_').replace(/\.[^/.]+$/, '')
    : (config.templateId || 'sequence');
  const fileName = `${baseName}_sequence.zip`;

  return { blob: zipBlob, fileName };
}

// ----------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------
function getOptimalMimeType(preferred: ExportFormat): string {
  if (typeof MediaRecorder === 'undefined' || typeof MediaRecorder.isTypeSupported !== 'function') {
    return '';
  }

  const supported = [
    'video/mp4;codecs=avc1',
    'video/mp4',
    'video/webm;codecs=vp9',
    'video/webm;codecs=vp8',
    'video/webm',
  ];

  if (preferred === 'mp4') {
    if (MediaRecorder.isTypeSupported('video/mp4;codecs=avc1')) return 'video/mp4;codecs=avc1';
    if (MediaRecorder.isTypeSupported('video/mp4')) return 'video/mp4';
  }

  for (const mime of supported) {
    if (MediaRecorder.isTypeSupported(mime)) return mime;
  }
  return 'video/webm';
}

function createScaledPreview(canvas: HTMLCanvasElement): string {
  try {
    const thumb = document.createElement('canvas');
    const scale = 240 / canvas.width;
    thumb.width = 240;
    thumb.height = Math.round(canvas.height * scale);
    const thumbCtx = thumb.getContext('2d');
    if (thumbCtx) {
      thumbCtx.drawImage(canvas, 0, 0, thumb.width, thumb.height);
      return thumb.toDataURL('image/jpeg', 0.85);
    }
  } catch (e) {
    // Ignore preview creation error
  }
  return '';
}

// ----------------------------------------------------------------------
// 4. Pinterest Animated GIF Engine (Crisp, High-Speed, Seamless Loop)
// ----------------------------------------------------------------------
export interface GifExportOptions {
  config: MotionConfig;
  startTime?: number;
  onProgress?: (progress: RenderProgress) => void;
  shouldAbort?: () => boolean;
  loadedTextures?: Record<string, HTMLImageElement>;
  guard?: BackgroundRenderGuard;
}

export async function renderPinterestGif({
  config,
  startTime = performance.now(),
  onProgress,
  shouldAbort,
  loadedTextures,
  guard,
}: GifExportOptions): Promise<{ blob: Blob; fileName: string }> {
  // Pinterest optimal standard dimensions:
  // Vertical 9:16 (540x960), Square 1:1 (600x600), Landscape 16:9 (720x405)
  const isVertical = config.resolution.startsWith('vertical');
  const isSquare = config.resolution === 'square_4k';

  let targetWidth = 720;
  let targetHeight = 405;
  if (isVertical) {
    targetWidth = 540;
    targetHeight = 960;
  } else if (isSquare) {
    targetWidth = 600;
    targetHeight = 600;
  }

  // 15 FPS: Sweet spot for smooth animation & staying well below Pinterest 20MB limit
  const gifFps = 15;
  const duration = config.durationSeconds;
  const totalFrames = Math.round(duration * gifFps);
  const frameDelayMs = Math.round(1000 / gifFps);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d', {
    alpha: true,
    willReadFrequently: true,
    colorSpace: 'srgb',
  });

  if (!ctx) {
    throw new Error('Gagal menginisialisasi 2D Canvas context untuk GIF Pinterest');
  }

  const gif = GIFEncoder();
  const isTransparent = config.backgroundMode === 'transparent';

  for (let frame = 0; frame < totalFrames; frame++) {
    if (shouldAbort && shouldAbort()) {
      throw new Error('Render GIF dibatalkan oleh pengguna');
    }

    const timeSec = frame / gifFps;
    const progress = frame / totalFrames;

    // Draw directly onto scaled canvas for ultra-crisp rasterization and maximum rendering speed
    drawMotionGraphicFrame({
      ctx,
      config,
      time: timeSec,
      progress,
      width: targetWidth,
      height: targetHeight,
      loadedTextures,
      isExportingOffline: true,
    });

    const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const rgba = imgData.data;

    if (isTransparent) {
      const palette = quantize(rgba, 256, { format: 'rgba4444', oneBitAlpha: true });
      const index = applyPalette(rgba, palette, 'rgba4444');
      const transparentIndex = palette.findIndex((p: number[]) => p.length === 4 && p[3] === 0);
      gif.writeFrame(index, targetWidth, targetHeight, {
        palette,
        delay: frameDelayMs,
        repeat: 0, // Seamless infinite loop on Pinterest
        transparent: transparentIndex >= 0,
        transparentIndex: Math.max(0, transparentIndex),
      });
    } else {
      const palette = quantize(rgba, 256, { format: 'rgb565' });
      const index = applyPalette(rgba, palette, 'rgb565');
      gif.writeFrame(index, targetWidth, targetHeight, {
        palette,
        delay: frameDelayMs,
        repeat: 0, // Seamless infinite loop on Pinterest
      });
    }

    const now = performance.now();
    const elapsed = (now - startTime) / 1000;
    const framesDone = frame + 1;
    const currentFps = elapsed > 0 ? Math.round((framesDone / elapsed) * 10) / 10 : 0;
    const remainingSec = currentFps > 0 ? Math.round((totalFrames - framesDone) / currentFps) : 0;
    const percentage = Math.round((framesDone / totalFrames) * 100);

    let previewUrl: string | undefined = undefined;
    if (frame % 8 === 0 || frame === totalFrames - 1) {
      previewUrl = createScaledPreview(canvas);
    }

    if (guard) {
      guard.updateProgress(percentage, framesDone, totalFrames, currentFps);
    }

    if (onProgress) {
      onProgress({
        isRendering: true,
        currentFrame: framesDone,
        totalFrames,
        percentage,
        fps: currentFps,
        elapsedTime: Math.round(elapsed),
        estimatedRemaining: remainingSec,
        previewDataUrl: previewUrl,
        statusText: `Mengompresi GIF Pinterest (${targetWidth}×${targetHeight}): Frame ${framesDone}/${totalFrames}`,
      });
    }

    if (frame % 4 === 0) {
      await yieldToMacroTask();
    }
  }

  gif.finish();
  const bytes = gif.bytes();
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'image/gif' });

  const baseName = config.exportFileName?.trim()
    ? config.exportFileName.trim().replace(/[\\/:*?"<>|]/g, '_').replace(/\.[^/.]+$/, '')
    : (config.templateId || 'pinterest_pin');
  const fileName = `${baseName}_pinterest.gif`;

  return { blob, fileName };
}

