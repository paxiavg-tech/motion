import React, { useState, useMemo } from 'react';
import {
  Layers,
  Check,
  Flame,
  Sparkles,
  Smartphone,
  Monitor,
  Square,
  CheckCircle2,
  Clock,
  RotateCcw,
  Gauge,
  Film,
} from 'lucide-react';
import { MOTION_PRESETS } from '../templates/motionPresets';
import { MotionPreset, RenderedDesignRecord } from '../types/motion';
import { getPresetFpsRecommendation } from '../services/fpsRecommendationService';
import { formatRenderedTime } from '../services/renderTrackerService';

interface TemplateSidebarProps {
  currentTemplateId: string;
  onSelectTemplate: (preset: MotionPreset) => void;
  renderedDesigns: Record<string, RenderedDesignRecord>;
  onUnmarkRendered?: (templateId: string) => void;
  onClearAllRendered?: () => void;
}

export const TemplateSidebar: React.FC<TemplateSidebarProps> = ({
  currentTemplateId,
  onSelectTemplate,
  renderedDesigns,
  onUnmarkRendered,
  onClearAllRendered,
}) => {
  const [themeFilter, setThemeFilter] = useState<'all' | 'evergreen' | 'countdown'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [ratioFilter, setRatioFilter] = useState<'all' | '16:9' | '9:16' | '1:1'>('all');
  const [renderStatusFilter, setRenderStatusFilter] = useState<'all' | 'unrendered' | 'rendered'>('all');
  const [fpsFilter, setFpsFilter] = useState<'all' | '30' | '60'>('all');

  const totalCount = MOTION_PRESETS.length;

  const renderedCount = useMemo(() => {
    return MOTION_PRESETS.filter((p) => Boolean(renderedDesigns[p.id])).length;
  }, [renderedDesigns]);

  const unrenderedCount = totalCount - renderedCount;
  const progressPercent = Math.round((renderedCount / totalCount) * 100);

  const evergreenCount = useMemo(
    () =>
      MOTION_PRESETS.filter(
        (p) =>
          p.category === 'Christmas, Holiday & Festive Sale' ||
          p.category === 'Sequential Reveal & Visual Explainer' ||
          p.category === 'Luxury Awards & Gala' ||
          p.category === 'Corporate & Tech AI' ||
          p.category === 'Wedding & Romance' ||
          p.category === 'Ramadhan & Islamic' ||
          p.category === 'Concert & VJ Loops' ||
          p.category === 'News & Broadcast HUD' ||
          p.category === 'Sport, Fitness & Esports' ||
          p.category === 'Commercial Sale & Promo' ||
          p.category === '2D Mascot & Animated Characters' ||
          p.id.startsWith('metropolis_') ||
          p.id.startsWith('silhouette_')
      ).length,
    []
  );
  const countdownCount = totalCount - evergreenCount;

  const filteredPresets = useMemo(() => {
    return MOTION_PRESETS.filter((p) => {
      // 1. Theme Filter
      const isEvergreen =
        p.category === 'Christmas, Holiday & Festive Sale' ||
        p.category === 'Sequential Reveal & Visual Explainer' ||
        p.category === 'Luxury Awards & Gala' ||
        p.category === 'Corporate & Tech AI' ||
        p.category === 'Wedding & Romance' ||
        p.category === 'Ramadhan & Islamic' ||
        p.category === 'Concert & VJ Loops' ||
        p.category === 'News & Broadcast HUD' ||
        p.category === 'Sport, Fitness & Esports' ||
        p.category === 'Commercial Sale & Promo' ||
        p.category === '2D Mascot & Animated Characters' ||
        p.id.startsWith('metropolis_') ||
        p.id.startsWith('silhouette_');

      if (themeFilter === 'evergreen' && !isEvergreen) return false;
      if (themeFilter === 'countdown' && isEvergreen) return false;

      // 2. Category Filter
      if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;

      // 3. Aspect Ratio Filter
      if (ratioFilter === '16:9') {
        const isNot169 = p.recommendedResolution?.startsWith('vertical') || p.recommendedResolution === 'square_4k';
        if (isNot169) return false;
      } else if (ratioFilter === '9:16') {
        if (!p.recommendedResolution?.startsWith('vertical')) return false;
      } else if (ratioFilter === '1:1') {
        if (p.recommendedResolution !== 'square_4k') return false;
      }

      // 4. Render Status Filter (User request: agar tidak bingung mana yang sudah mana yang belum)
      const isRendered = Boolean(renderedDesigns[p.id]);
      if (renderStatusFilter === 'unrendered' && isRendered) return false;
      if (renderStatusFilter === 'rendered' && !isRendered) return false;

      // 5. FPS Filter
      if (fpsFilter !== 'all') {
        const fpsRec = getPresetFpsRecommendation(p);
        if (String(fpsRec.fps) !== fpsFilter) return false;
      }

      return true;
    });
  }, [themeFilter, categoryFilter, ratioFilter, renderStatusFilter, fpsFilter, renderedDesigns]);

  return (
    <div className="flex flex-col h-full bg-neutral-900 border-r border-neutral-800 w-80 md:w-88 shrink-0 text-neutral-100 select-none overflow-hidden">
      {/* Header */}
      <div className="p-3.5 border-b border-neutral-800 space-y-2.5 bg-neutral-900/90 backdrop-blur-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-bold tracking-tight text-white font-display">Katalog Template</h2>
          </div>
          <span className="text-xs text-amber-300 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{totalCount} Aset Siap Jual</span>
          </span>
        </div>

        {/* Status Tracker Banner (Menandai Desain yang Sudah Dirender) */}
        <div className="p-2.5 rounded-xl bg-neutral-950 border border-neutral-800/90 space-y-2">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-semibold text-neutral-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kemajuan Produksi:</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-emerald-400">
                {renderedCount} / {totalCount} Selesai ({progressPercent}%)
              </span>
              {renderedCount > 0 && onClearAllRendered && (
                <button
                  onClick={() => {
                    if (window.confirm('Hapus semua tanda status render dan reset daftar riwayat?')) {
                      onClearAllRendered();
                    }
                  }}
                  title="Reset Semua Tanda Sudah Dirender"
                  className="text-neutral-500 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Render Status Quick Filter (Solusi: jangan buang waktu render ulang) */}
          <div className="grid grid-cols-3 gap-1 pt-0.5 text-[10px]">
            <button
              onClick={() => setRenderStatusFilter('all')}
              className={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
                renderStatusFilter === 'all'
                  ? 'bg-neutral-800 text-white font-semibold shadow-xs'
                  : 'text-neutral-400 hover:text-white bg-neutral-900/60'
              }`}
            >
              Semua ({totalCount})
            </button>
            <button
              onClick={() => setRenderStatusFilter('unrendered')}
              className={`py-1 rounded font-medium transition-colors cursor-pointer text-center flex items-center justify-center gap-1 ${
                renderStatusFilter === 'unrendered'
                  ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                  : 'text-neutral-400 hover:text-white bg-neutral-900/60'
              }`}
            >
              <Clock className="w-2.5 h-2.5 text-amber-400" />
              <span>Belum ({unrenderedCount})</span>
            </button>
            <button
              onClick={() => setRenderStatusFilter('rendered')}
              className={`py-1 rounded font-medium transition-colors cursor-pointer text-center flex items-center justify-center gap-1 ${
                renderStatusFilter === 'rendered'
                  ? 'bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/40'
                  : 'text-neutral-400 hover:text-white bg-neutral-900/60'
              }`}
            >
              <Check className="w-2.5 h-2.5 text-emerald-400" />
              <span>Sudah ({renderedCount})</span>
            </button>
          </div>
        </div>

        {/* Master Theme Filter: Evergreen vs Countdown */}
        <div className="grid grid-cols-3 gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-[10px]">
          <button
            onClick={() => {
              setThemeFilter('all');
              setCategoryFilter('all');
            }}
            className={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
              themeFilter === 'all'
                ? 'bg-neutral-800 text-amber-300 font-semibold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Tema: Semua
          </button>
          <button
            onClick={() => {
              setThemeFilter('evergreen');
              setCategoryFilter('all');
            }}
            className={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
              themeFilter === 'evergreen'
                ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/40'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            🌟 Evergreen ({evergreenCount})
          </button>
          <button
            onClick={() => {
              setThemeFilter('countdown');
              setCategoryFilter('all');
            }}
            className={`py-1 rounded font-medium transition-colors cursor-pointer text-center ${
              themeFilter === 'countdown'
                ? 'bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/40'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            ⏱️ Countdown ({countdownCount})
          </button>
        </div>

        {/* Category Dropdown Filter */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-neutral-400">
            <span>Kategori Tema:</span>
            {categoryFilter !== 'all' && (
              <button
                onClick={() => setCategoryFilter('all')}
                className="text-amber-400 hover:underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-neutral-950 border border-neutral-800 text-neutral-200 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:border-amber-400 cursor-pointer"
          >
            <option value="all">Semua Kategori (Tampilkan Semua)</option>
            <optgroup label="🌟 Evergreen Microstock (Laris Sepanjang Tahun)">
              <option value="Christmas, Holiday & Festive Sale">🎄 Christmas, Holiday & Festive Sale (14 Model)</option>
              <option value="Sequential Reveal & Visual Explainer">💡 Sequential Reveal & Visual Explainer (5 Model)</option>
              <option value="Luxury Awards & Gala">🏆 Luxury Awards & Gala Backdrops (5 Model)</option>
              <option value="Sport, Fitness & Esports">🥊 Sport, Fitness & Esports Motion (5 Model)</option>
              <option value="Commercial Sale & Promo">🛍️ Commercial Sale, Promo & Black Friday (5 Model)</option>
              <option value="2D Mascot & Animated Characters">🐱 2D Mascot & Animated Characters (5 Model)</option>
              <option value="Corporate & Tech AI">💼 Corporate & Tech AI Data (5 Model)</option>
              <option value="Wedding & Romance">💍 Wedding & Romance Fairy Lights (5 Model)</option>
              <option value="Ramadhan & Islamic">🕌 Ramadhan & Islamic Arabian Gala (5 Model)</option>
              <option value="Concert & VJ Loops">🎶 Stage Concert & DJ VJ Loops (5 Model)</option>
              <option value="News & Broadcast HUD">📺 News & Broadcast Studio HUD (5 Model)</option>
            </optgroup>
            <optgroup label="⏱️ Hitung Mundur Tahun Baru 2027">
              <option value="Luxury & Gala 2027">✨ Luxury & Gala 2027</option>
              <option value="Cyber & Futuristic 2027">🤖 Cyber & Futuristic 2027</option>
              <option value="Fireworks & Spectacle 2027">🎆 Fireworks & Spectacle 2027</option>
              <option value="Cinematic & Art Deco 2027">🎭 Cinematic & Art Deco 2027</option>
              <option value="Modern & Kinetic 2027">⚡ Modern & Kinetic 2027</option>
              <option value="Party & Confetti 2027">🎉 Party & Confetti 2027</option>
            </optgroup>
          </select>
        </div>

        {/* Orientation & Frame Rate Quick Toggles */}
        <div className="grid grid-cols-2 gap-2 text-[10px]">
          {/* Orientation Aspect Ratio Filter */}
          <div className="space-y-1">
            <span className="text-neutral-400 font-medium">Orientasi:</span>
            <div className="grid grid-cols-3 gap-0.5 bg-neutral-950 p-0.5 rounded border border-neutral-800">
              <button
                onClick={() => setRatioFilter(ratioFilter === '16:9' ? 'all' : '16:9')}
                className={`py-0.5 rounded font-mono text-center cursor-pointer ${
                  ratioFilter === '16:9' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
                title="Filter 16:9 Landscape"
              >
                16:9
              </button>
              <button
                onClick={() => setRatioFilter(ratioFilter === '9:16' ? 'all' : '9:16')}
                className={`py-0.5 rounded font-mono text-center cursor-pointer ${
                  ratioFilter === '9:16' ? 'bg-fuchsia-500/20 text-fuchsia-300 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
                title="Filter 9:16 Vertical"
              >
                9:16
              </button>
              <button
                onClick={() => setRatioFilter(ratioFilter === '1:1' ? 'all' : '1:1')}
                className={`py-0.5 rounded font-mono text-center cursor-pointer ${
                  ratioFilter === '1:1' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
                title="Filter 1:1 Square"
              >
                1:1
              </button>
            </div>
          </div>

          {/* FPS Recommendation Filter */}
          <div className="space-y-1">
            <span className="text-neutral-400 font-medium">Rekomendasi FPS:</span>
            <div className="grid grid-cols-3 gap-0.5 bg-neutral-950 p-0.5 rounded border border-neutral-800">
              <button
                onClick={() => setFpsFilter('all')}
                className={`py-0.5 rounded font-mono text-center cursor-pointer ${
                  fpsFilter === 'all' ? 'bg-neutral-800 text-white font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFpsFilter(fpsFilter === '30' ? 'all' : '30')}
                className={`py-0.5 rounded font-mono text-center cursor-pointer ${
                  fpsFilter === '30' ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
                title="Filter Desain yang Direkomendasikan 30 FPS"
              >
                30p
              </button>
              <button
                onClick={() => setFpsFilter(fpsFilter === '60' ? 'all' : '60')}
                className={`py-0.5 rounded font-mono text-center cursor-pointer ${
                  fpsFilter === '60' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-neutral-400 hover:text-white'
                }`}
                title="Filter Desain yang Direkomendasikan 60 FPS"
              >
                60p
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preset List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredPresets.length === 0 ? (
          <div className="p-6 text-center text-neutral-500 space-y-2">
            <p className="text-xs">Tidak ada desain dengan filter ini.</p>
            <button
              onClick={() => {
                setThemeFilter('all');
                setCategoryFilter('all');
                setRatioFilter('all');
                setRenderStatusFilter('all');
                setFpsFilter('all');
              }}
              className="text-amber-400 hover:underline text-xs cursor-pointer"
            >
              Reset semua filter
            </button>
          </div>
        ) : (
          filteredPresets.map((preset) => {
            const isSelected = preset.id === currentTemplateId;
            const isVertical = preset.recommendedResolution?.startsWith('vertical');
            const isSquare = preset.recommendedResolution === 'square_4k';
            const renderRecord = renderedDesigns[preset.id];
            const isRendered = Boolean(renderRecord);
            const fpsRec = getPresetFpsRecommendation(preset);

            return (
              <div
                key={preset.id}
                onClick={() => onSelectTemplate(preset)}
                className={`group p-2.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/5 ring-1 ring-amber-500/40'
                    : isRendered
                    ? 'bg-emerald-950/20 border-emerald-500/30 hover:border-emerald-500/50 hover:bg-emerald-950/30'
                    : 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700 hover:bg-neutral-950'
                }`}
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-video rounded-lg overflow-hidden bg-neutral-900 mb-2 border border-neutral-800/60">
                  <img
                    src={preset.thumbnail}
                    alt={preset.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/85 via-neutral-950/20 to-transparent" />

                  {/* PROMINENT RENDERED STATUS BADGE (Jawaban langsung ke user request) */}
                  {isRendered ? (
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-emerald-600/95 text-white px-2 py-0.5 rounded text-[10px] font-extrabold shadow-md border border-emerald-400/40 backdrop-blur-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>SUDAH DIRENDER</span>
                    </div>
                  ) : preset.isCommercialHot ? (
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-1 bg-amber-500/90 text-neutral-950 px-1.5 py-0.5 rounded text-[10px] font-bold shadow">
                      <Flame className="w-3 h-3 fill-current" />
                      <span>Laris 2027</span>
                    </div>
                  ) : null}

                  {/* Top Right: Badges for Aspect Ratio & Recommended FPS */}
                  <div className="absolute top-1.5 right-1.5 flex items-center gap-1">
                    {/* Recommended FPS Badge */}
                    <div
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded backdrop-blur-sm flex items-center gap-0.5 shadow-xs ${
                        fpsRec.fps === 60
                          ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/60'
                          : 'bg-amber-950/90 text-amber-300 border border-amber-500/60'
                      }`}
                      title={`Rekomendasi Frame Rate: ${fpsRec.tag}. ${fpsRec.rationale}`}
                    >
                      <Gauge className="w-2.5 h-2.5" />
                      <span>{fpsRec.fps} FPS</span>
                    </div>

                    {/* Aspect Ratio Badge */}
                    <div
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded backdrop-blur-sm flex items-center gap-1 font-bold shadow-xs ${
                        isVertical
                          ? 'bg-fuchsia-950/90 text-fuchsia-300 border border-fuchsia-500/50'
                          : isSquare
                          ? 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/50'
                          : 'bg-neutral-950/90 text-neutral-200 border border-neutral-700/60'
                      }`}
                    >
                      {isVertical ? (
                        <>
                          <Smartphone className="w-2.5 h-2.5" />
                          <span>9:16</span>
                        </>
                      ) : isSquare ? (
                        <>
                          <Square className="w-2.5 h-2.5" />
                          <span>1:1</span>
                        </>
                      ) : (
                        <>
                          <Monitor className="w-2.5 h-2.5" />
                          <span>16:9</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Countdown style badge */}
                  <div className="absolute bottom-1.5 left-1.5 text-[9px] font-mono text-amber-300 bg-neutral-950/90 px-1.5 py-0.5 rounded backdrop-blur-sm border border-amber-500/30">
                    {preset.countdownStyleLabel}
                  </div>

                  {/* Recommended Blend mode tag */}
                  <div className="absolute bottom-1.5 right-1.5 text-[9px] font-mono text-neutral-200 bg-neutral-900/90 px-1.5 py-0.5 rounded backdrop-blur-sm border border-neutral-700/60">
                    Blend: {preset.recommendedBlendMode}
                  </div>
                </div>

                {/* Title & Category */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-semibold font-mono text-amber-400">
                      {preset.category}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {isRendered && (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                          {renderRecord.fps}fps · {renderRecord.resolution === 'vertical_4k' ? '9:16' : '4K'}
                        </span>
                      )}
                      {isSelected && (
                        <div className="flex items-center gap-1 text-[11px] text-amber-300 font-semibold font-mono">
                          <Check className="w-3.5 h-3.5" />
                          <span>Aktif</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <h3 className="font-semibold text-xs text-white leading-snug group-hover:text-amber-200 transition-colors">
                    {preset.name}
                  </h3>

                  <p className="text-[11px] text-neutral-400 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>

                  {/* FPS & Render Recommendation Context Pill */}
                  <div className="flex items-center justify-between text-[10px] pt-1 border-t border-neutral-800/80">
                    <span
                      className={`font-medium flex items-center gap-1 ${
                        fpsRec.fps === 60 ? 'text-cyan-400' : 'text-amber-300'
                      }`}
                      title={fpsRec.rationale}
                    >
                      <Film className="w-2.5 h-2.5" />
                      <span>Cocok: <strong>{fpsRec.fps} FPS</strong> ({fpsRec.fps === 60 ? 'Action/Smooth' : 'Cinematic'})</span>
                    </span>

                    {isRendered ? (
                      <div className="flex items-center gap-1 text-emerald-400 font-mono text-[9px]">
                        <span>{formatRenderedTime(renderRecord.renderedAt)}</span>
                        {onUnmarkRendered && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUnmarkRendered(preset.id);
                            }}
                            title="Hapus tanda sudah dirender"
                            className="text-neutral-500 hover:text-neutral-300 ml-1 cursor-pointer"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ) : (
                      <span className="text-[9px] font-mono text-neutral-500">
                        Belum dirender
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
