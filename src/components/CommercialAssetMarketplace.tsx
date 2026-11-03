import React, { useState } from 'react';
import {
  Flame,
  Download,
  Sparkles,
  DollarSign,
  TrendingUp,
  Tag,
  ShieldCheck,
  Play,
  ArrowRight,
  Layers,
  Check,
  EyeOff,
  HelpCircle,
  CheckCircle2,
  Clock,
  Gauge,
  Film,
} from 'lucide-react';
import { COMMERCIAL_ASSETS_CATALOG, MOTION_PRESETS } from '../templates/motionPresets';
import { MotionPreset, RenderedDesignRecord } from '../types/motion';
import { getPresetFpsRecommendation } from '../services/fpsRecommendationService';
import { formatRenderedTime } from '../services/renderTrackerService';

interface CommercialAssetMarketplaceProps {
  onLoadPreset: (preset: MotionPreset) => void;
  onQuickRenderPreset: (preset: MotionPreset) => void;
  renderedDesigns: Record<string, RenderedDesignRecord>;
}

export const CommercialAssetMarketplace: React.FC<CommercialAssetMarketplaceProps> = ({
  onLoadPreset,
  onQuickRenderPreset,
  renderedDesigns,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [renderStatusFilter, setRenderStatusFilter] = useState<'all' | 'unrendered' | 'rendered'>('all');

  const filteredAssets = COMMERCIAL_ASSETS_CATALOG.filter((asset) => {
    if (filterCategory === 'newyear' && asset.category !== 'New Year 2027') return false;
    if (filterCategory === 'christmas' && asset.category !== 'Christmas 2026') return false;

    const isRendered = Boolean(renderedDesigns[asset.presetId]);
    if (renderStatusFilter === 'unrendered' && isRendered) return false;
    if (renderStatusFilter === 'rendered' && !isRendered) return false;

    return true;
  });

  const renderedCount = COMMERCIAL_ASSETS_CATALOG.filter((a) => Boolean(renderedDesigns[a.presetId])).length;
  const unrenderedCount = COMMERCIAL_ASSETS_CATALOG.length - renderedCount;

  return (
    <div className="flex-1 overflow-y-auto bg-neutral-950 text-neutral-100 p-6 md:p-8 space-y-8 select-none">
      {/* Hero Showcase Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-amber-950/40 p-6 md:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>Koleksi Aset Hitung Mundur Tahun Baru 2027 Siap Jual (Videohive, Shutterstock, Pond5)</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-display">
            Aset Video Hitung Mundur Tahun Baru 2027 4K Multi-Gaya
          </h1>

          <p className="text-sm text-neutral-300 leading-relaxed">
            <strong className="text-amber-300">Format Siap Siar & Microstock:</strong> Semua template video hitung mundur dibuat dalam format 4K dengan rekomendasi frame rate otomatis: <strong className="text-cyan-300">60 FPS</strong> untuk partikel cepat & VJ action, dan <strong className="text-amber-300">30 FPS</strong> untuk tema sinematik & stardust emas. Setiap aset yang sudah dirender otomatis ditandai agar tidak tertukar.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-neutral-400 font-mono">
            <span className="flex items-center gap-1.5 text-neutral-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Bebas Royalti & Hak Cipta Komersial</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>Estimasi Harga Lisensi: $55 - $125 / Download</span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400 font-bold">
              Status Anda: {renderedCount} dari {COMMERCIAL_ASSETS_CATALOG.length} Selesai Dirender
            </span>
          </div>
        </div>

        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Microstock Strategy Guide Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <EyeOff className="w-4 h-4" />
            <span>1. Kenapa Harus Dibuat Tanpa Teks (Clean Overlay)?</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Jika kamu mencantumkan teks mati di dalam video, pembeli hanya bisa menggunakannya untuk 1 bahasa saja. Tetapi dengan <strong>Overlay Bersih (Tanpa Teks)</strong>, video editor di seluruh dunia bisa menggunakannya untuk iklan TV, bumper YouTube, konser panggung, dan billboard LED!
          </p>
        </div>

        <div className="p-4 bg-neutral-900/80 border border-neutral-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <Gauge className="w-4 h-4" />
            <span>2. Panduan Frame Rate (30 FPS vs 60 FPS):</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Gunakan <strong className="text-amber-300">30 FPS</strong> untuk gaya sinematik, stardust emas mengapung, dan karakter 2D (waktu render 2x lebih cepat). Gunakan <strong className="text-cyan-300">60 FPS</strong> untuk aksi partikel cepat, kembang api, dan VJ loop agar bebas judder.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between border-b border-neutral-800 pb-3 gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterCategory === 'all'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800'
            }`}
          >
            Semua Aset ({COMMERCIAL_ASSETS_CATALOG.length})
          </button>
          <button
            onClick={() => setFilterCategory('newyear')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterCategory === 'newyear'
                ? 'bg-amber-400 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800'
            }`}
          >
            Tahun Baru 2027
          </button>
          <button
            onClick={() => setFilterCategory('christmas')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              filterCategory === 'christmas'
                ? 'bg-emerald-400 text-neutral-950 font-bold shadow-md'
                : 'text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800'
            }`}
          >
            Natal 2026
          </button>

          {/* Render status filter separator */}
          <div className="h-4 w-px bg-neutral-800 mx-1 hidden sm:block" />

          {/* Render status filters */}
          <div className="flex items-center gap-1 bg-neutral-900 p-0.5 rounded-lg border border-neutral-800 text-xs">
            <button
              onClick={() => setRenderStatusFilter('all')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer ${
                renderStatusFilter === 'all'
                  ? 'bg-neutral-800 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Semua Status
            </button>
            <button
              onClick={() => setRenderStatusFilter('unrendered')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer flex items-center gap-1 ${
                renderStatusFilter === 'unrendered'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Clock className="w-3 h-3 text-amber-400" />
              <span>Belum Dirender ({unrenderedCount})</span>
            </button>
            <button
              onClick={() => setRenderStatusFilter('rendered')}
              className={`px-2.5 py-1 rounded font-medium cursor-pointer flex items-center gap-1 ${
                renderStatusFilter === 'rendered'
                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Sudah Dirender ({renderedCount})</span>
            </button>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-neutral-500 font-mono">
          <span>Potensi Royalti Rata-rata: </span>
          <span className="text-emerald-400 font-semibold">$1,500+/bulan</span>
        </div>
      </div>

      {/* Asset Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssets.map((asset) => {
          const matchingPreset =
            MOTION_PRESETS.find((p) => p.id === asset.presetId) || MOTION_PRESETS[0];
          const renderRecord = renderedDesigns[asset.presetId];
          const isRendered = Boolean(renderRecord);
          const fpsRec = getPresetFpsRecommendation(matchingPreset);

          return (
            <div
              key={asset.id}
              className={`group rounded-2xl border overflow-hidden flex flex-col transition-all ${
                isRendered
                  ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg shadow-emerald-950/20'
                  : 'bg-neutral-900/90 border-neutral-800 hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-500/5'
              }`}
            >
              {/* Preview Image Frame */}
              <div className="relative aspect-video bg-neutral-950 overflow-hidden">
                <img
                  src={asset.previewImage}
                  alt={asset.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />

                {/* SKU Code */}
                <div className="absolute top-2.5 left-2.5 bg-neutral-950/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-neutral-300 border border-neutral-800">
                  {asset.sku}
                </div>

                {/* Status Badges */}
                <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
                  {/* Recommended FPS badge */}
                  <div
                    className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold shadow ${
                      fpsRec.fps === 60
                        ? 'bg-cyan-950/90 text-cyan-300 border border-cyan-500/50'
                        : 'bg-amber-950/90 text-amber-300 border border-amber-500/50'
                    }`}
                  >
                    <Gauge className="w-2.5 h-2.5" />
                    <span>{fpsRec.fps} FPS</span>
                  </div>

                  {isRendered ? (
                    <div className="flex items-center gap-1 bg-emerald-600 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-md border border-emerald-400/40">
                      <Check className="w-3 h-3 stroke-[3]" />
                      <span>SUDAH DIRENDER</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-amber-500 text-neutral-950 px-2 py-0.5 rounded text-[10px] font-bold shadow">
                      <Flame className="w-3 h-3 fill-current" />
                      <span>Laku Tinggi</span>
                    </div>
                  )}
                </div>

                {/* Estimated Earnings Bar */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-mono bg-neutral-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-neutral-700/60">
                  <span className="text-neutral-400 text-[11px]">Est. Pendapatan:</span>
                  <span className="text-emerald-400 font-bold">{asset.estimatedEarnings}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-amber-400 font-semibold">{asset.theme}</span>
                    <span className="text-neutral-500">{asset.category}</span>
                  </div>
                  <h3 className="font-bold text-sm text-white leading-snug group-hover:text-amber-200 transition-colors">
                    {asset.title}
                  </h3>
                  <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                    {asset.description}
                  </p>
                </div>

                {/* Recommended FPS rationale */}
                <div className="p-2 bg-neutral-950 rounded-lg border border-neutral-800 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-300 font-semibold">
                    <Film className="w-3 h-3 text-amber-400" />
                    <span>Rekomendasi Frame Rate: </span>
                    <strong className={fpsRec.fps === 60 ? 'text-cyan-300' : 'text-amber-300'}>
                      {fpsRec.fps} FPS
                    </strong>
                  </div>
                  <p className="text-[10px] text-neutral-400 leading-tight">
                    {fpsRec.rationale}
                  </p>
                </div>

                {/* Blend Mode Tip */}
                <div className="p-2 bg-neutral-950/70 rounded-lg border border-neutral-800 text-[11px] text-amber-300/90 font-mono">
                  💡 {asset.blendModeTip}
                </div>

                {/* Render Record if already rendered */}
                {isRendered && (
                  <div className="flex items-center justify-between text-[11px] font-mono bg-emerald-950/30 p-2 rounded-lg border border-emerald-500/30 text-emerald-300">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Telah Dirender:</span>
                    </span>
                    <span className="font-bold">
                      {renderRecord.fps} FPS · {formatRenderedTime(renderRecord.renderedAt)}
                    </span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => onLoadPreset(matchingPreset)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-neutral-700/60"
                  >
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>Buka di Studio</span>
                  </button>

                  <button
                    onClick={() => onQuickRenderPreset(matchingPreset)}
                    className="flex items-center justify-center gap-1 py-2 px-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-neutral-950 rounded-lg text-xs font-bold transition-all shadow-md shadow-amber-500/10 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>{isRendered ? 'Render Ulang' : 'Render 4K Master'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
