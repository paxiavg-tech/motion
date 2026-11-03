import React, { useState } from 'react';
import {
  Sliders,
  Sparkles,
  Type,
  Video,
  Layers,
  Palette,
  ShieldCheck,
  Check,
  Zap,
  HelpCircle,
  EyeOff,
  Flame,
  Smartphone,
  Monitor,
  Square,
  Star,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Gauge,
  Film,
} from 'lucide-react';
import {
  MotionConfig,
  RESOLUTION_PRESETS,
  ResolutionPreset,
  ExportFormat,
  BackgroundMode,
  RenderedDesignRecord,
} from '../types/motion';
import { MOTION_PRESETS } from '../templates/motionPresets';
import { getPresetFpsRecommendation } from '../services/fpsRecommendationService';
import { formatRenderedTime } from '../services/renderTrackerService';

interface InspectorControlsProps {
  config: MotionConfig;
  onChangeConfig: (partial: Partial<MotionConfig>) => void;
  exportFormat: ExportFormat;
  onChangeExportFormat: (fmt: ExportFormat) => void;
  onStartRender: () => void;
  isRendering: boolean;
  renderedRecord?: RenderedDesignRecord;
}

export const InspectorControls: React.FC<InspectorControlsProps> = ({
  config,
  onChangeConfig,
  exportFormat,
  onChangeExportFormat,
  onStartRender,
  isRendering,
  renderedRecord,
}) => {
  const [activeTab, setActiveTab] = useState<'output' | 'visuals' | 'text'>('output');

  const selectedTemplate = MOTION_PRESETS.find((p) => p.id === config.templateId) || MOTION_PRESETS[0];
  const selectedFpsRec = getPresetFpsRecommendation(selectedTemplate);

  return (
    <div className="flex flex-col h-full bg-neutral-900 border-l border-neutral-800 w-80 md:w-96 shrink-0 text-neutral-100 select-none overflow-hidden">
      {/* Top Header */}
      <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold tracking-tight text-white font-display">Kontrol Animasi & Render</h2>
        </div>
        <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
          Hitung Mundur 2027
        </span>
      </div>

      {/* Rendered Status Banner if design already rendered */}
      {renderedRecord && (
        <div className="mx-4 mt-3 p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <div>
              <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                <span>Desain Ini Sudah Dirender</span>
                <span className="text-[9px] bg-emerald-500/30 text-emerald-200 px-1.5 py-0.2 rounded font-mono font-bold">
                  ✓ Selesai
                </span>
              </div>
              <div className="text-[10px] text-emerald-400/80 font-mono">
                {renderedRecord.resolution === 'vertical_4k' ? 'Vertical 4K' : '4K UHD'} · {renderedRecord.fps} FPS · {formatRenderedTime(renderedRecord.renderedAt)}
              </div>
            </div>
          </div>
          <span className="text-[9px] text-neutral-400 font-mono">
            Bisa di-render ulang kapan saja
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center border-b border-neutral-800 bg-neutral-950/60 p-1 gap-1 text-xs font-medium">
        <button
          onClick={() => setActiveTab('output')}
          className={`flex-1 py-1.5 px-2 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'output'
              ? 'bg-neutral-800 text-amber-300 font-semibold shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Output & 4K</span>
        </button>

        <button
          onClick={() => setActiveTab('visuals')}
          className={`flex-1 py-1.5 px-2 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'visuals'
              ? 'bg-neutral-800 text-amber-300 font-semibold shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Partikel & FX</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-1.5 px-2 rounded-md transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'text'
              ? 'bg-neutral-800 text-amber-300 font-semibold shadow-sm'
              : 'text-neutral-400 hover:text-neutral-200'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Countdown 2027</span>
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* ============================================================== */}
        {/* TAB 1: OUTPUT & EXPORT SETTINGS */}
        {/* ============================================================== */}
        {activeTab === 'output' && (
          <div className="space-y-4">
            {/* Quick 1-Click Microstock Preset */}
            <div className="p-3 bg-gradient-to-r from-amber-950/40 via-neutral-950 to-neutral-950 rounded-xl border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-amber-300 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>Preset Standar Microstock (1-Klik):</span>
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => {
                    onChangeConfig({
                      backgroundMode: 'black',
                      showText: false,
                      resolution: '4k_uhd',
                      fps: 60,
                      durationSeconds: 10,
                      bitrateMbps: 50,
                    });
                    onChangeExportFormat('mp4');
                  }}
                  className="p-1.5 text-left rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/60 text-[11px] text-white cursor-pointer"
                >
                  <div className="font-semibold text-amber-300">Clean 4K 60FPS</div>
                  <div className="text-[9px] text-neutral-400">Hitam Pekat · Blend Screen</div>
                </button>

                <button
                  onClick={() => {
                    onChangeConfig({
                      backgroundMode: 'chroma_green',
                      showText: false,
                      resolution: '4k_uhd',
                      fps: 60,
                      durationSeconds: 10,
                    });
                    onChangeExportFormat('mp4');
                  }}
                  className="p-1.5 text-left rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/60 text-[11px] text-white cursor-pointer"
                >
                  <div className="font-semibold text-emerald-400">Green Screen</div>
                  <div className="text-[9px] text-neutral-400">CapCut / Chroma Key</div>
                </button>
              </div>
            </div>

            {/* Background Mode Selector with Microstock Guidance */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-neutral-300 font-semibold">Background untuk Render</label>
                <span className="text-[10px] text-amber-400 font-mono">
                  {config.backgroundMode === 'black' ? '★ Standar Stock' : ''}
                </span>
              </div>

              <div className="space-y-1.5">
                {[
                  {
                    id: 'black',
                    label: 'Hitam Pekat #000000 (Rekomendasi Utama Microstock)',
                    desc: 'Video editor di Premiere/CapCut tinggal atur Blend Mode ke "Screen". Hitam otomatis transparan!',
                    isBest: true,
                  },
                  {
                    id: 'transparent',
                    label: 'Alpha Transparan (VFX PNG Sequence / WebM)',
                    desc: 'Langsung tembus tanpa blending mode, cocok untuk pengguna After Effects & DaVinci.',
                    isBest: false,
                  },
                  {
                    id: 'chroma_green',
                    label: 'Green Screen #00FF00',
                    desc: 'Bagus untuk pemula di CapCut ponsel yang memakai fitur kunci kroma (Chroma Key).',
                    isBest: false,
                  },
                  {
                    id: 'chroma_blue',
                    label: 'Blue Screen #0000FF',
                    desc: 'Alternatif kunci kroma jika partikel memiliki unsur warna hijau.',
                    isBest: false,
                  },
                  {
                    id: 'custom_gradient',
                    label: 'Full Background Gelap (Stage / Backdrop)',
                    desc: 'Jika ingin video utuh langsung tayang di panggung LED tanpa video lain di bawahnya.',
                    isBest: false,
                  },
                ].map((bg) => (
                  <button
                    key={bg.id}
                    onClick={() => onChangeConfig({ backgroundMode: bg.id as BackgroundMode })}
                    className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                      config.backgroundMode === bg.id
                        ? 'bg-amber-500/10 border-amber-500/50 text-amber-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-white">{bg.label}</span>
                      {config.backgroundMode === bg.id && <Check className="w-3.5 h-3.5 text-amber-400" />}
                    </div>
                    <p className="text-[10px] text-neutral-400 mt-0.5 leading-relaxed">{bg.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution Selector with Model-Specific Recommendation */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-neutral-300 font-semibold text-xs flex items-center gap-1.5">
                  <span>Resolusi Kanvas & Ekspor</span>
                </label>
                <span className="text-[10px] text-amber-400 font-mono font-medium">Bebas Stutter</span>
              </div>

              {/* Dynamic Model Recommendation Card */}
              {(() => {
                const recId = selectedTemplate.recommendedResolution || '4k_uhd';
                const recPreset = RESOLUTION_PRESETS[recId];
                const isMatching = config.resolution === recId;
                const isVerticalModel = recId.startsWith('vertical');
                const isSquareModel = recId === 'square_4k';

                return (
                  <div
                    className={`p-2.5 rounded-xl border text-xs space-y-2 transition-all ${
                      isMatching
                        ? 'bg-emerald-950/25 border-emerald-500/35 text-emerald-200'
                        : 'bg-gradient-to-r from-amber-950/40 to-neutral-900 border-amber-500/40 text-amber-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Star className={`w-3.5 h-3.5 shrink-0 ${isMatching ? 'text-emerald-400 fill-emerald-400' : 'text-amber-400 fill-amber-400 animate-pulse'}`} />
                        <span className="font-bold text-[11px] text-white">
                          Rekomendasi Model "{selectedTemplate.name.split(' Countdown')[0]}":
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          isMatching
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {recPreset?.aspectRatio} {isVerticalModel ? 'Vertikal' : isSquareModel ? 'Square' : 'Landscape'}
                      </span>
                    </div>

                    <p className="text-[10px] text-neutral-300 leading-relaxed">
                      {selectedTemplate.aspectRatioNotice ||
                        (isVerticalModel
                          ? 'Model ini memiliki komposisi vertikal atas-ke-bawah (cocok untuk TikTok / Reels).'
                          : isSquareModel
                          ? 'Model ini memiliki komposisi mandala simetris (cocok untuk Instagram Post / Feed).'
                          : 'Model ini memiliki komposisi layar lebar sinematik (cocok untuk TV / YouTube / Stage LED).')}
                    </p>

                    {!isMatching ? (
                      <button
                        onClick={() => onChangeConfig({ resolution: recId })}
                        className="w-full mt-1 py-1.5 px-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 cursor-pointer transition-all active:scale-[0.98]"
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Terapkan Rekomendasi: {recPreset?.label.split(' (')[0]} ({recPreset?.aspectRatio})</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono font-semibold pt-0.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Resolusi saat ini sudah sesuai dengan orientasi terbaik model ini</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Resolution Button Options */}
              <div className="space-y-1.5">
                {(Object.keys(RESOLUTION_PRESETS) as ResolutionPreset[]).map((resKey) => {
                  const item = RESOLUTION_PRESETS[resKey];
                  const isSelected = config.resolution === resKey;
                  const isRecommendedForModel = (selectedTemplate.recommendedResolution || '4k_uhd') === resKey;

                  return (
                    <button
                      key={resKey}
                      onClick={() => onChangeConfig({ resolution: resKey })}
                      className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer relative ${
                        isSelected
                          ? 'bg-amber-500/10 border-amber-500/50 text-amber-200 shadow-sm'
                          : isRecommendedForModel
                          ? 'bg-neutral-950 border-amber-500/30 hover:border-amber-500/60 text-neutral-200'
                          : 'bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5">
                            {item.category === 'Landscape' ? (
                              <Monitor className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                            ) : item.category === 'Vertical / Social' ? (
                              <Smartphone className="w-3.5 h-3.5 text-fuchsia-400 shrink-0" />
                            ) : (
                              <Square className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            )}
                            <span className="font-semibold text-xs text-white">{item.label}</span>
                          </div>

                          <div className="text-[10px] text-neutral-400 font-mono">
                            {item.width} × {item.height} ({item.aspectRatio}) · {item.category}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                          {isRecommendedForModel && (
                            <span className="text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/40 flex items-center gap-1">
                              <Star className="w-2.5 h-2.5 fill-current text-amber-400" />
                              <span>Rekomendasi</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Frame Rate Section with Design-Specific Recommendation */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-neutral-300 font-semibold text-xs flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Frame Rate Video</span>
                </label>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {config.fps === 30 ? '30 FPS Sinematik' : '60 FPS Ultra-Smooth'}
                </span>
              </div>

              {/* Dynamic Design-Specific FPS Recommendation Card */}
              {(() => {
                const isMatchingFps = config.fps === selectedFpsRec.fps;

                return (
                  <div
                    className={`p-3 rounded-xl border text-xs space-y-2 transition-all ${
                      isMatchingFps
                        ? 'bg-emerald-950/25 border-emerald-500/35 text-emerald-200'
                        : selectedFpsRec.fps === 60
                        ? 'bg-gradient-to-r from-cyan-950/40 to-neutral-900 border-cyan-500/40 text-cyan-100'
                        : 'bg-gradient-to-r from-amber-950/40 to-neutral-900 border-amber-500/40 text-amber-100'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Gauge
                          className={`w-3.5 h-3.5 shrink-0 ${
                            isMatchingFps
                              ? 'text-emerald-400'
                              : selectedFpsRec.fps === 60
                              ? 'text-cyan-400 animate-pulse'
                              : 'text-amber-400 animate-pulse'
                          }`}
                        />
                        <span className="font-bold text-[11px] text-white">
                          Rekomendasi Desain Ini: <strong className={selectedFpsRec.fps === 60 ? 'text-cyan-300' : 'text-amber-300'}>{selectedFpsRec.fps} FPS</strong>
                        </span>
                      </div>
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded shrink-0 ${
                          isMatchingFps
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : selectedFpsRec.fps === 60
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        }`}
                      >
                        {selectedFpsRec.fps === 60 ? 'Action / Super Mulus' : 'Cinematic / Efisien'}
                      </span>
                    </div>

                    <p className="text-[10px] text-neutral-300 leading-relaxed">
                      {selectedFpsRec.rationale}
                    </p>

                    <div className="text-[9px] text-neutral-400 font-mono flex items-center gap-1">
                      <span>⚡ Keuntungan:</span>
                      <span className="text-neutral-200">{selectedFpsRec.renderTimeBenefit}</span>
                    </div>

                    {!isMatchingFps ? (
                      <button
                        onClick={() => onChangeConfig({ fps: selectedFpsRec.fps })}
                        className={`w-full mt-1 py-1.5 px-2.5 rounded-lg font-extrabold text-[11px] flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-[0.98] ${
                          selectedFpsRec.fps === 60
                            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-neutral-950 shadow-cyan-500/10'
                            : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-amber-500/10'
                        }`}
                      >
                        <Zap className="w-3.5 h-3.5 fill-current" />
                        <span>Terapkan Rekomendasi ({selectedFpsRec.fps} FPS)</span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono font-semibold pt-0.5">
                        <Check className="w-3.5 h-3.5" />
                        <span>Frame rate saat ini sudah sesuai rekomendasi desain ({config.fps} FPS)</span>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Frame Rate Buttons & Durasi Loop */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <div className="flex bg-neutral-950 rounded-lg p-1 border border-neutral-800">
                    <button
                      onClick={() => onChangeConfig({ fps: 30 })}
                      className={`flex-1 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors relative ${
                        config.fps === 30
                          ? 'bg-neutral-800 text-amber-300 shadow-xs'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>30 FPS</span>
                        {selectedFpsRec.fps === 30 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Rekomendasi untuk desain ini" />
                        )}
                      </div>
                    </button>
                    <button
                      onClick={() => onChangeConfig({ fps: 60 })}
                      className={`flex-1 py-1.5 rounded text-xs font-semibold cursor-pointer transition-colors relative ${
                        config.fps === 60
                          ? 'bg-neutral-800 text-cyan-300 shadow-xs'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>60 FPS</span>
                        {selectedFpsRec.fps === 60 && (
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" title="Rekomendasi untuk desain ini" />
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <select
                    value={config.durationSeconds}
                    onChange={(e) => onChangeConfig({ durationSeconds: parseInt(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg p-2 text-xs font-medium focus:outline-none focus:border-amber-400"
                  >
                    <option value={5}>5s (Batas Minimum)</option>
                    <option value={10}>10s (⭐ Standar Emas)</option>
                    <option value={15}>15s (Broadcast)</option>
                    <option value={20}>20s (Extended)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Export Format */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-neutral-300 font-semibold">Format Output Media</label>
                <span className="text-[10px] text-rose-400 font-medium">⭐ Pinterest Ready</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onChangeExportFormat('mp4')}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    exportFormat === 'mp4'
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>MP4 (H.264)</span>
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded font-mono">4K UHD</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">Universal Stock 4K</div>
                </button>

                <button
                  onClick={() => onChangeExportFormat('gif')}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    exportFormat === 'gif'
                      ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 font-bold shadow-md shadow-rose-950/30'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold text-rose-300 flex items-center justify-between">
                    <span>GIF (Pinterest)</span>
                    <span className="text-[9px] bg-rose-500/20 text-rose-300 px-1 rounded font-mono">Loop Pin</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">Animasi Pinterest & Web</div>
                </button>

                <button
                  onClick={() => onChangeExportFormat('webm')}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    exportFormat === 'webm'
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>WebM (VP9)</span>
                    <span className="text-[9px] bg-neutral-800 text-neutral-300 px-1 rounded font-mono">Fast</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">High Speed Alpha</div>
                </button>

                <button
                  onClick={() => onChangeExportFormat('png_sequence')}
                  className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    exportFormat === 'png_sequence'
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-bold'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  <div className="text-xs font-bold text-white flex items-center justify-between">
                    <span>PNG ZIP</span>
                    <span className="text-[9px] bg-neutral-800 text-neutral-300 px-1 rounded font-mono">VFX</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 font-mono mt-0.5">Alpha VFX Pro 4K</div>
                </button>
              </div>
            </div>

            {/* Custom Output Filename */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-neutral-300 font-semibold">Nama File Unduhan</label>
                <span className="text-[10px] text-amber-400 font-mono">
                  .{exportFormat === 'png_sequence' ? 'zip' : exportFormat}
                </span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={config.exportFileName ?? config.templateId}
                  onChange={(e) => onChangeConfig({ exportFileName: e.target.value })}
                  placeholder={config.templateId}
                  className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg py-2 px-3 text-xs font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
              <p className="text-[10px] text-neutral-400 leading-tight">
                File terunduh langsung menggunakan nama ini tanpa teks &apos;auramotion&apos;.
              </p>
            </div>

            {/* Bitrate Control */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-neutral-300">
                <span className="font-semibold">Bitrate Video 4K</span>
                <span className="font-mono text-amber-400">{config.bitrateMbps} Mbps</span>
              </div>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={config.bitrateMbps}
                onChange={(e) => onChangeConfig({ bitrateMbps: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: PARTICLE PHYSICS & VISUAL FX */}
        {/* ============================================================== */}
        {activeTab === 'visuals' && (
          <div className="space-y-4">
            {/* Color Palette Presets */}
            <div className="space-y-2">
              <label className="text-neutral-300 font-semibold flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                <span>Palet Warna Partikel</span>
              </label>
              <div className="space-y-1.5">
                {[
                  { id: 'gold_luxury', label: '24K Gold & Champagne (Tahun Baru)', colors: ['#fef08a', '#f59e0b', '#d97706'] },
                  { id: 'emerald_ruby', label: 'Christmas Emerald & Ruby (Natal)', colors: ['#10b981', '#ef4444', '#fde047'] },
                  { id: 'amber_warm', label: 'Warm Amber & Gold (Lampu Natal)', colors: ['#fbbf24', '#f59e0b', '#d97706'] },
                  { id: 'ice_aurora', label: 'Arctic Frost & White Snow', colors: ['#ffffff', '#38bdf8', '#e0f2fe'] },
                  { id: 'cyber_neon', label: 'Cyber Sapphire & Magenta 2027', colors: ['#06b6d4', '#ec4899', '#8b5cf6'] },
                  { id: 'champagne_rose', label: 'Rose Gold & Confetti', colors: ['#fda4af', '#f59e0b', '#ffffff'] },
                ].map((palette) => (
                  <button
                    key={palette.id}
                    onClick={() => onChangeConfig({ colorPalette: palette.id as any })}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border transition-all cursor-pointer ${
                      config.colorPalette === palette.id
                        ? 'bg-neutral-800 border-amber-500/50 text-amber-300'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <span className="font-medium">{palette.label}</span>
                    <div className="flex items-center gap-1">
                      {palette.colors.map((c, i) => (
                        <div key={i} className="w-3 h-3 rounded-full border border-black/40" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Particle Count Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-neutral-300">
                <span className="font-semibold">Jumlah Partikel</span>
                <span className="font-mono text-amber-400">{config.particleCount} Partikel</span>
              </div>
              <input
                type="range"
                min="100"
                max="1500"
                step="50"
                value={config.particleCount}
                onChange={(e) => onChangeConfig({ particleCount: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Particle Speed */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-neutral-300">
                <span className="font-semibold">Kecepatan Gerak (Velocity)</span>
                <span className="font-mono text-amber-400">{config.particleSpeed.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.3"
                max="2.5"
                step="0.1"
                value={config.particleSpeed}
                onChange={(e) => onChangeConfig({ particleSpeed: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Particle Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-neutral-300">
                <span className="font-semibold">Ukuran Partikel (Scale)</span>
                <span className="font-mono text-amber-400">{config.particleSize.toFixed(1)} px</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="8.0"
                step="0.5"
                value={config.particleSize}
                onChange={(e) => onChangeConfig({ particleSize: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Glow Intensity */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-neutral-300">
                <span className="font-semibold">Intensitas Glow Bloom</span>
                <span className="font-mono text-amber-400">{config.glowIntensity.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={config.glowIntensity}
                onChange={(e) => onChangeConfig({ glowIntensity: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>

            {/* Turbulence */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-neutral-300">
                <span className="font-semibold">Turbulensi & Gelombang</span>
                <span className="font-mono text-amber-400">{config.turbulence.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={config.turbulence}
                onChange={(e) => onChangeConfig({ turbulence: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-neutral-950 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: COUNTDOWN 2027 & TYPOGRAPHY SETTINGS */}
        {/* ============================================================== */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            {/* 3-Way Mode Selection: Universal vs Clean vs Full 2027 */}
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-white font-bold text-xs">Pilihan Mode Teks & Angka</label>
                <span className="text-amber-400 text-[10px] font-mono">Fleksibilitas</span>
              </div>

              <div className="space-y-2">
                {/* Option 1: Universal Countdown Only */}
                <button
                  type="button"
                  onClick={() => onChangeConfig({ showText: true, textDisplayMode: 'countdown_only' })}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    config.showText && config.textDisplayMode === 'countdown_only'
                      ? 'bg-amber-500/15 border-amber-500/60 text-amber-300 shadow-xs'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>1. Universal Countdown (Hanya Angka 10 - 0)</span>
                    </span>
                    <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded">Rekomendasi</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1 leading-relaxed">
                    Hanya angka hitung mundur murni tanpa tulisan bahasa Inggris dan tanpa angka 2027. Netral, universal, dan cocok untuk semua acara/bahasa.
                  </div>
                </button>

                {/* Option 2: Clean Overlay (No Text At All) */}
                <button
                  type="button"
                  onClick={() => onChangeConfig({ showText: false, textDisplayMode: 'clean_no_text' })}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    !config.showText || config.textDisplayMode === 'clean_no_text'
                      ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-300 shadow-xs'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <EyeOff className="w-3.5 h-3.5 text-emerald-400" />
                      <span>2. Clean Background (Tanpa Teks & Angka)</span>
                    </span>
                    <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded">Microstock</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1 leading-relaxed">
                    Hanya visual gerak atmosfer, kembang api, dial jam, dan partikel. Video editor bebas memasukkan font 3D mereka sendiri di Premiere/CapCut.
                  </div>
                </button>

                {/* Option 3: Full 2027 Celebration */}
                <button
                  type="button"
                  onClick={() => onChangeConfig({ showText: true, textDisplayMode: 'full_with_year' })}
                  className={`w-full p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                    config.showText && config.textDisplayMode === 'full_with_year'
                      ? 'bg-sky-500/15 border-sky-500/60 text-sky-300 shadow-xs'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <div className="font-bold text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Type className="w-3.5 h-3.5 text-sky-400" />
                      <span>3. Paket Lengkap Tahun Baru 2027</span>
                    </span>
                    <span className="text-[10px] font-mono bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded">Siap Tayang</span>
                  </div>
                  <div className="text-[10px] text-neutral-400 mt-1 leading-relaxed">
                    Lengkap dengan angka hitung mundur + klimaks teks "HAPPY NEW YEAR 2027" siap tayang tanpa perlu diedit lagi.
                  </div>
                </button>
              </div>
            </div>

            {/* Sub-controls based on active mode */}
            {config.showText && config.textDisplayMode !== 'clean_no_text' && (
              <div className="space-y-3.5 p-3 bg-neutral-950/80 rounded-xl border border-neutral-800">
                {/* Countdown Start Number */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-neutral-300">
                    <label className="font-semibold">Mulai Hitung Dari:</label>
                    <span className="font-mono text-amber-400 font-bold">{config.countdownStart || 10} Detik</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[3, 5, 10, 20].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => onChangeConfig({ countdownStart: num })}
                        className={`py-1.5 rounded-lg border font-mono text-xs font-semibold cursor-pointer transition-all ${
                          (config.countdownStart || 10) === num
                            ? 'bg-amber-500 text-neutral-950 border-amber-400 shadow-sm'
                            : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                        }`}
                      >
                        {num} Detik
                      </button>
                    ))}
                  </div>
                </div>

                {/* Text Render Style: Pure Solid Font vs Outer Rim vs Soft Glow */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-neutral-300 font-semibold">Gaya Gambar Font Angka</label>
                    <span className="text-[10px] text-emerald-400 font-mono font-medium">Bebas Garis Sambungan</span>
                  </div>
                  <select
                    value={config.textRenderStyle || 'pure_solid_font'}
                    onChange={(e) => onChangeConfig({ textRenderStyle: e.target.value as any })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-amber-300 rounded-lg p-2 text-xs font-medium focus:outline-none focus:border-amber-400"
                  >
                    <option value="pure_solid_font">★ Solid Font Murni (Bersih 100% Tanpa Garis Sambungan)</option>
                    <option value="soft_glow_font">Pendaran Cahaya Lembut (Soft Ambient Glow)</option>
                    <option value="outer_rim_smooth">Bingkai Luar Halus (Outer Rim di Belakang Font)</option>
                  </select>
                  <p className="text-[10px] text-neutral-400 leading-tight">
                    <span className="text-emerald-400 font-semibold">Solid Font Murni:</span> Angka ditulis menggunakan font vektor murni tanpa garis tepi (stroke) yang saling bertumpuk, sehingga 100% bersih, padat, dan bebas sambungan garis.
                  </p>
                </div>

                {/* Countdown Numeral Style */}
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-semibold">Format Angka Hitung Mundur</label>
                  <select
                    value={config.countdownStyle || 'roman_dial'}
                    onChange={(e) => onChangeConfig({ countdownStyle: e.target.value as any })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-amber-300 rounded-lg p-2 text-xs font-medium focus:outline-none focus:border-amber-400"
                  >
                    <option value="cinematic_bold">Angka Modern Standar (10, 9, 8...) [Paling Jelas & Bersih]</option>
                    <option value="roman_dial">Angka Romawi Emas (X, IX, VIII...)</option>
                    <option value="digital_hud">Digital Glitch HUD (10, 09, 08...)</option>
                    <option value="ring_gauge">Lingkaran Pengukur Arc & Presisi</option>
                    <option value="particle_digits">Partikel Debu Konstelasi</option>
                    <option value="minimalist_swiss">Swiss Minimalist Bauhaus</option>
                  </select>
                </div>

                {/* Font Selection */}
                <div className="space-y-1.5">
                  <label className="text-neutral-300 font-semibold">Font Tipografi</label>
                  <select
                    value={config.fontFamily}
                    onChange={(e) => onChangeConfig({ fontFamily: e.target.value as any })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-lg p-2 text-xs font-medium focus:outline-none focus:border-amber-400"
                  >
                    <option value="Outfit">Outfit (Modern Bold Sans - Huruf Mulus Tanpa Sambungan)</option>
                    <option value="Cinzel">Cinzel (Regal Luxury Roman Serif)</option>
                    <option value="Plus Jakarta Sans">Plus Jakarta Sans (Geometric Clean Sans)</option>
                    <option value="JetBrains Mono">JetBrains Mono (Digital Tech HUD)</option>
                  </select>
                </div>

                {/* Full Year & Text Fields only shown if mode is full_with_year */}
                {config.textDisplayMode === 'full_with_year' && (
                  <div className="pt-2 border-t border-neutral-800 space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-neutral-300 font-semibold">Tahun Puncak (Climax)</label>
                        <span className="text-[10px] text-sky-400 font-mono">Kustomisasi</span>
                      </div>
                      <input
                        type="text"
                        value={config.yearText}
                        onChange={(e) => onChangeConfig({ yearText: e.target.value })}
                        placeholder="2027"
                        className="w-full bg-neutral-900 border border-neutral-800 text-amber-300 font-mono text-base font-bold rounded-lg p-2 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-300 font-semibold">Judul Hitung Mundur</label>
                      <input
                        type="text"
                        value={config.headlineText}
                        onChange={(e) => onChangeConfig({ headlineText: e.target.value })}
                        placeholder="COUNTDOWN TO 2027"
                        className="w-full bg-neutral-900 border border-neutral-800 text-white rounded-lg p-2 focus:outline-none focus:border-amber-400 font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-neutral-300 font-semibold">Subjudul / Slogan Perayaan</label>
                      <input
                        type="text"
                        value={config.subtitleText}
                        onChange={(e) => onChangeConfig({ subtitleText: e.target.value })}
                        placeholder="WELCOME THE GOLDEN FUTURE"
                        className="w-full bg-neutral-900 border border-neutral-800 text-neutral-300 rounded-lg p-2 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Clean Overlay Information Box */}
            {(!config.showText || config.textDisplayMode === 'clean_no_text') && (
              <div className="p-4 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-2 text-neutral-300 leading-relaxed">
                <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Mode Clean Background Aktif</span>
                </div>
                <p className="text-[11px] text-neutral-300">
                  Video dirender tanpa teks angka apa pun, fokus 100% pada efek gerak partikel, cincin energi, dan kembang api.
                </p>
                <div className="text-[10px] text-amber-300 font-mono bg-neutral-950/80 p-2 rounded border border-neutral-800">
                  ✓ Format paling dicari di Videohive, Shutterstock, dan Pond5 karena pembeli dapat menambahkan teks mereka sendiri!
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Primary CTA Bottom Bar */}
      <div className="p-4 bg-neutral-950 border-t border-neutral-800">
        <button
          onClick={onStartRender}
          disabled={isRendering}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-neutral-950 font-bold text-sm rounded-lg shadow-xl shadow-amber-500/20 hover:from-amber-300 hover:to-yellow-300 active:scale-[0.99] transition-all cursor-pointer disabled:opacity-50"
        >
          <Zap className="w-4 h-4 fill-current" />
          <span>{isRendering ? 'Sedang Render 4K...' : 'Mulai Render 4K MP4'}</span>
        </button>
        <div className="text-center mt-2 text-[10px] text-neutral-400 font-mono">
          {!config.showText ? 'Clean Overlay (Tanpa Teks)' : 'Dengan Teks'} · {RESOLUTION_PRESETS[config.resolution].width}×{RESOLUTION_PRESETS[config.resolution].height} · {config.fps} FPS
        </div>
      </div>
    </div>
  );
};
