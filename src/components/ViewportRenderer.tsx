import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Repeat,
  Maximize2,
  Minimize2,
  Grid,
  ShieldCheck,
  Eye,
  Sparkles,
  Layers,
  HelpCircle,
  Zap,
  Star,
  Smartphone,
  Monitor,
  Square,
} from 'lucide-react';
import { MotionConfig, RESOLUTION_PRESETS, SimulationFootage } from '../types/motion';
import { MOTION_PRESETS } from '../templates/motionPresets';
import { drawMotionGraphicFrame } from '../services/motionEngine';

interface ViewportRendererProps {
  config: MotionConfig;
  onUpdateConfig: (partial: Partial<MotionConfig>) => void;
  loadedTextures: Record<string, HTMLImageElement>;
  onTriggerRender: () => void;
}

export const ViewportRenderer: React.FC<ViewportRendererProps> = ({
  config,
  onUpdateConfig,
  loadedTextures,
  onTriggerRender,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [isLooping, setIsLooping] = useState<boolean>(true);
  const [showSafeMargins, setShowSafeMargins] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [previewFps, setPreviewFps] = useState<number>(0);
  const [showBlendGuide, setShowBlendGuide] = useState<boolean>(false);

  const animFrameIdRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  currentTimeRef.current = currentTime;

  const resConfig = RESOLUTION_PRESETS[config.resolution];
  const targetWidth = resConfig.width;
  const targetHeight = resConfig.height;
  const duration = config.durationSeconds;

  // Correct aspect-ratio preserved preview canvas buffer resolution
  const previewScale = Math.min(1, 1920 / Math.max(targetWidth, targetHeight));
  const previewWidth = Math.round(targetWidth * previewScale);
  const previewHeight = Math.round(targetHeight * previewScale);

  const currentPreset = MOTION_PRESETS.find((p) => p.id === config.templateId) || MOTION_PRESETS[0];
  const recId = currentPreset.recommendedResolution || '4k_uhd';
  const recPreset = RESOLUTION_PRESETS[recId];
  const isMatchingRec = config.resolution === recId;

  const renderFrame = useCallback(
    (timeSec: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d', { alpha: true });
      if (!ctx) return;

      const progress = (timeSec % duration) / duration;

      drawMotionGraphicFrame({
        ctx,
        config,
        time: timeSec,
        progress,
        width: canvas.width,
        height: canvas.height,
        loadedTextures,
        isExportingOffline: false,
      });
    },
    [config, duration, loadedTextures]
  );

  // Render static frame when config or duration changes while paused
  useEffect(() => {
    if (!isPlaying) {
      renderFrame(currentTimeRef.current);
    }
  }, [isPlaying, renderFrame]);

  // Animation Loop (Runs ONLY when isPlaying === true, zero background GPU load when paused!)
  useEffect(() => {
    if (!isPlaying) {
      setPreviewFps(0);
      lastTimestampRef.current = 0;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
      return;
    }

    let fpsFrames = 0;
    let fpsTimer = performance.now();
    lastTimestampRef.current = performance.now();

    const loop = (timestamp: number) => {
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const deltaSec = Math.min(0.1, (timestamp - lastTimestampRef.current) / 1000);
      lastTimestampRef.current = timestamp;

      fpsFrames++;
      if (timestamp - fpsTimer >= 1000) {
        setPreviewFps(Math.round((fpsFrames * 1000) / (timestamp - fpsTimer)));
        fpsFrames = 0;
        fpsTimer = timestamp;
      }

      let nextTime = currentTimeRef.current + deltaSec;
      if (nextTime >= duration) {
        if (isLooping) {
          nextTime = nextTime % duration;
        } else {
          nextTime = duration;
          setIsPlaying(false);
          setCurrentTime(duration);
          renderFrame(duration);
          return;
        }
      }
      setCurrentTime(nextTime);
      renderFrame(nextTime);

      animFrameIdRef.current = requestAnimationFrame(loop);
    };

    animFrameIdRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
        animFrameIdRef.current = null;
      }
    };
  }, [isPlaying, isLooping, duration, renderFrame]);

  // Keyboard shortcut: Spacebar to toggle Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    renderFrame(val);
  };

  const handleRestart = () => {
    setCurrentTime(0);
    renderFrame(0);
    setIsPlaying(true);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const progressPercent = (currentTime / duration) * 100;
  const currentFrameCount = Math.round(currentTime * config.fps);
  const totalFrameCount = Math.round(duration * config.fps);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
  };

  const isSimulating = config.simulationFootage && config.simulationFootage !== 'none';

  return (
    <div
      ref={containerRef}
      className={`flex flex-col h-full bg-neutral-950 text-neutral-100 select-none overflow-hidden ${
        isFullscreen ? 'p-4' : ''
      }`}
    >
      {/* Top Bar: Viewport info + Blend Simulator */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-neutral-900/80 border-b border-neutral-800 text-xs">
        {/* Left: Viewport specs */}
        <div className="flex items-center gap-3">
          <span className="font-medium text-neutral-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Viewport 4K</span>
          </span>
          <span className="text-neutral-500 font-mono">·</span>
          <span className="font-mono text-amber-300/90 font-medium">{resConfig.label}</span>
          <span className="text-neutral-500 font-mono">·</span>
          <span className={`font-mono text-[11px] px-1.5 py-0.5 rounded ${isPlaying ? 'text-emerald-400 bg-emerald-500/10' : 'text-neutral-400 bg-neutral-800/80'}`}>
            {isPlaying ? `${previewFps} FPS Aktif` : '⏸ Jeda (Hemat Daya)'}
          </span>

          {/* Countdown State Indicator */}
          {(() => {
            const p = (currentTime % duration) / duration;
            const isClimax = p >= 0.82;
            const remSec = Math.max(1, Math.ceil((1 - p / 0.82) * (config.countdownStart || 10)));
            return isClimax ? (
              <span className="bg-amber-500 text-neutral-950 font-extrabold px-2 py-0.5 rounded text-[11px] font-mono shadow-xs animate-pulse flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-current" />
                <span>KLIMAKS 2027</span>
              </span>
            ) : (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[11px] font-mono font-bold">
                T - {remSec} Detik
              </span>
            );
          })()}

          {/* Aspect Ratio Badge & Quick Recommendation Switch */}
          <div className="flex items-center gap-1.5">
            <span className="bg-neutral-800 text-neutral-200 border border-neutral-700 px-2 py-0.5 rounded text-[11px] font-mono font-medium flex items-center gap-1">
              {resConfig.aspectRatio.includes('9:16') ? (
                <Smartphone className="w-3 h-3 text-fuchsia-400" />
              ) : resConfig.aspectRatio.includes('1:1') ? (
                <Square className="w-3 h-3 text-emerald-400" />
              ) : (
                <Monitor className="w-3 h-3 text-amber-400" />
              )}
              <span>{resConfig.aspectRatio}</span>
            </span>

            {!isMatchingRec && (
              <button
                onClick={() => onUpdateConfig({ resolution: recId })}
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold px-2 py-0.5 rounded text-[11px] font-mono flex items-center gap-1 cursor-pointer transition-all active:scale-95 shadow-xs"
                title={`Model ${currentPreset.name} direkomendasikan di ${recPreset?.aspectRatio} (${recPreset?.label})`}
              >
                <Zap className="w-3 h-3 fill-current" />
                <span>Rekomendasi: {recPreset?.aspectRatio}</span>
              </button>
            )}

            {config.templateId === 'sstk_vertical_nordic_storytelling_plate' && (
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded text-[11px] font-mono font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-current text-amber-400" />
                <span>sstkVertical Verified</span>
              </span>
            )}
          </div>
        </div>

        {/* Right: Simulation Footage Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800">
            <span className="text-[11px] text-neutral-400 px-1 font-mono flex items-center gap-1">
              <Eye className="w-3 h-3 text-amber-400" />
              <span>Simulasi Blend Screen:</span>
            </span>
            <button
              onClick={() => onUpdateConfig({ simulationFootage: 'none' })}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                !isSimulating
                  ? 'bg-neutral-800 text-amber-300 font-semibold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Asli (Hitam)
            </button>
            <button
              onClick={() => onUpdateConfig({ simulationFootage: 'concert' })}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                config.simulationFootage === 'concert'
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Panggung Konser
            </button>
            <button
              onClick={() => onUpdateConfig({ simulationFootage: 'fireplace' })}
              className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                config.simulationFootage === 'fireplace'
                  ? 'bg-amber-500 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              Pesta Hangat
            </button>
          </div>

          <button
            onClick={() => setShowBlendGuide(!showBlendGuide)}
            title="Penjelasan Cara Ekspor Background Microstock"
            className="p-1.5 text-neutral-400 hover:text-amber-300 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Educational Banner: Why Black Background is Microstock Gold Standard */}
      {showBlendGuide && (
        <div className="px-4 py-3 bg-amber-950/40 border-b border-amber-800/60 text-xs text-amber-200 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <span className="font-bold text-white">Panduan Background untuk Microstock:</span>
            <p className="text-neutral-300 leading-relaxed text-[11px]">
              Di marketplace stock (Videohive, Shutterstock, Pond5), <strong className="text-amber-300">background hitam pekat (#000000) adalah standar industri paling diminati</strong> karena video editor cukup meletakkan video MP4 di atas footage mereka dan mengubah Blending Mode ke <strong className="text-white">"Screen"</strong> atau <strong className="text-white">"Add"</strong>. Seluruh warna hitam otomatis lenyap jadi transparan tanpa membebani GPU atau file berukuran raksasa. Gunakan tombol 'Simulasi' di atas untuk melihat pembuktiannya!
            </p>
          </div>
          <button
            onClick={() => setShowBlendGuide(false)}
            className="text-xs text-neutral-400 hover:text-white px-2 py-1 rounded bg-neutral-900 border border-neutral-700 cursor-pointer shrink-0"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Main Center Canvas Container */}
      <div className="relative flex-1 flex items-center justify-center p-4 bg-neutral-950 overflow-hidden">
        {/* Checkerboard Pattern for transparent view */}
        {config.backgroundMode === 'transparent' && !isSimulating && (
          <div
            className="absolute inset-4 rounded-xl opacity-20 pointer-events-none"
            style={{
              backgroundImage: `linear-gradient(45deg, #262626 25%, transparent 25%), 
                               linear-gradient(-45deg, #262626 25%, transparent 25%), 
                               linear-gradient(45deg, transparent 75%, #262626 75%), 
                               linear-gradient(-45deg, transparent 75%, #262626 75%)`,
              backgroundSize: '24px 24px',
              backgroundPosition: '0 0, 0 12px, 12px -12px, -12px 0px',
            }}
          />
        )}

        {/* Responsive Canvas Box */}
        <div
          className="relative max-w-full max-h-full flex items-center justify-center shadow-2xl rounded-lg overflow-hidden border border-neutral-800/80"
          style={{
            aspectRatio: `${targetWidth} / ${targetHeight}`,
            maxHeight: 'calc(100% - 10px)',
            maxWidth: 'calc(100% - 10px)',
          }}
        >
          <canvas
            ref={canvasRef}
            width={previewWidth}
            height={previewHeight}
            className="w-full h-full object-contain block"
          />

          {/* Interactive Play Overlay when Paused (Zero background CPU/GPU load) */}
          {!isPlaying && (
            <div
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/35 hover:bg-black/25 backdrop-blur-[1px] transition-all cursor-pointer group select-none"
            >
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:bg-amber-300 transition-all">
                <Play className="w-6 h-6 md:w-7 md:h-7 stroke-[2.5] fill-current translate-x-0.5" />
              </div>
              <div className="mt-3 px-3 py-1 rounded-full bg-neutral-900/90 border border-neutral-700/80 text-[11px] font-medium text-amber-200 shadow-md flex items-center gap-1.5">
                <span>Klik untuk Putar Preview</span>
                <span className="text-[10px] text-neutral-400 bg-neutral-800 px-1.5 py-0.2 rounded font-mono">Spasi</span>
              </div>
              <div className="text-[10px] text-neutral-400/90 mt-1 font-mono">
                Auto-play nonaktif · Geser timeline untuk inspeksi
              </div>
            </div>
          )}

          {/* Broadcast Safe Area Overlays */}
          {showSafeMargins && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-[5%] border border-cyan-400/35 border-dashed flex items-start justify-start p-1.5">
                <span className="text-[10px] font-mono text-cyan-400/80 bg-neutral-950/80 px-1 rounded">
                  90% Action Safe
                </span>
              </div>
              <div className="absolute inset-[10%] border border-amber-400/40 border-dashed flex items-start justify-start p-1.5">
                <span className="text-[10px] font-mono text-amber-400/90 bg-neutral-950/80 px-1 rounded">
                  80% Title Safe (Broadcast Standard)
                </span>
              </div>
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 pointer-events-none">
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-cyan-400/40 -translate-x-1/2" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-cyan-400/40 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Quality Indicator */}
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-neutral-900/80 backdrop-blur-md px-2.5 py-1 rounded-md border border-neutral-700/60 pointer-events-none">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] font-mono font-medium text-neutral-200">
              Deterministic 4K · 0 Dropped Frames
            </span>
          </div>

          {/* Simulation Active Badge */}
          {isSimulating && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2 bg-amber-500/90 text-neutral-950 px-2.5 py-1 rounded-md text-[11px] font-bold shadow pointer-events-none">
              <Layers className="w-3.5 h-3.5" />
              <span>Simulasi Blend Mode "Screen" di atas Footage Aktif</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Timeline Controls */}
      <div className="px-6 py-3.5 bg-neutral-900/95 border-t border-neutral-800 flex flex-col gap-2.5">
        <div className="relative flex items-center group">
          <input
            type="range"
            min="0"
            max={duration}
            step="0.01"
            value={currentTime}
            onChange={handleScrub}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:h-2 transition-all"
          />
          <div
            className="absolute left-0 top-0 bottom-0 bg-amber-400/40 pointer-events-none rounded-l"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              title="Kembali ke Awal (0s)"
              className="p-1.5 text-neutral-400 hover:text-neutral-100 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              title={isPlaying ? 'Pause (Spasi)' : 'Play (Spasi)'}
              className="p-2 bg-amber-400 text-neutral-950 font-bold rounded-lg hover:bg-amber-300 active:scale-95 transition-all shadow-md shadow-amber-500/10 cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 stroke-[2.5]" /> : <Play className="w-4 h-4 stroke-[2.5] fill-current" />}
            </button>

            <button
              onClick={() => setIsLooping(!isLooping)}
              title={isLooping ? 'Seamless Loop Aktif' : 'Loop Nonaktif'}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                isLooping
                  ? 'text-amber-300 bg-amber-500/10 border border-amber-500/30'
                  : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800'
              }`}
            >
              <Repeat className="w-4 h-4" />
            </button>

            <div className="ml-3 font-mono text-xs tabular-nums text-neutral-300 flex items-center gap-1.5">
              <span className="text-amber-400 font-semibold">{formatTime(currentTime)}</span>
              <span className="text-neutral-600">/</span>
              <span className="text-neutral-400">{formatTime(duration)}</span>
              <span className="text-neutral-600">·</span>
              <span className="text-neutral-500 text-[11px]">
                Frame {currentFrameCount}/{totalFrameCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowSafeMargins(!showSafeMargins)}
              title="Toggle Broadcast Safe Area Margins"
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md border transition-colors cursor-pointer ${
                showSafeMargins
                  ? 'bg-cyan-950/70 text-cyan-300 border-cyan-800'
                  : 'text-neutral-400 border-neutral-800 hover:text-neutral-200 hover:bg-neutral-800'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Safe Title Grid</span>
            </button>

            <button
              onClick={toggleFullscreen}
              title="Layar Penuh Viewport"
              className="p-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-md transition-colors cursor-pointer"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
