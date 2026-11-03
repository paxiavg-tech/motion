import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Sparkles,
  Smartphone,
  ShieldCheck,
  FileText,
  ExternalLink,
  Layers,
  Zap,
  Tag,
  Palette,
  CheckCircle2,
} from 'lucide-react';
import { MotionConfig, ResolutionPreset } from '../types/motion';

interface ShutterstockBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: MotionConfig;
  onUpdateConfig: (partial: Partial<MotionConfig>) => void;
}

export const ShutterstockBriefModal: React.FC<ShutterstockBriefModalProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
}) => {
  const [copiedKeywords, setCopiedKeywords] = useState(false);
  const [copiedTitle, setCopiedTitle] = useState(false);
  const [copiedDesc, setCopiedDesc] = useState(false);

  if (!isOpen) return null;

  // Exact 50 keywords combining Literal & Conceptual lists directly from page 9 of Shutterstock Content Brief
  const sstkKeywords = [
    'sstkVertical',
    'background',
    'background plate',
    'animation',
    'animated',
    'snow',
    'winter',
    'christmas',
    'holiday',
    'new year',
    '2027',
    '2026',
    'landscape',
    'forest',
    'mountains',
    'hills',
    'woodland',
    'trees',
    'pine',
    'rustic',
    'nordic',
    'scandinavian',
    'silhouette',
    'stag',
    'deer',
    'reindeer',
    'santa claus',
    'sleigh',
    'starry',
    'sky',
    'moon',
    'village',
    'cabin',
    'lights',
    'reflections',
    'particle',
    'flow',
    'dynamic',
    'atmosphere',
    'calm',
    'depth',
    'harmony',
    'immersion',
    'inspiration',
    'mood',
    'motion',
    'natural',
    'scenic',
    'style',
    'warmth',
  ];

  const keywordsString = sstkKeywords.join(', ');
  const titleString = 'Nordic Living Silhouette Winter Background Looping Vertical 9:16';
  const descString =
    'Seamless looping vertical 9:16 Christmas winter background plate with Nordic village, flying Santa sleigh, antlered stag silhouette, and gentle snowfall.';

  const handleCopyKeywords = () => {
    navigator.clipboard.writeText(keywordsString);
    setCopiedKeywords(true);
    setTimeout(() => setCopiedKeywords(false), 2200);
  };

  const handleCopyTitle = () => {
    navigator.clipboard.writeText(titleString);
    setCopiedTitle(true);
    setTimeout(() => setCopiedTitle(false), 2200);
  };

  const handleCopyDesc = () => {
    navigator.clipboard.writeText(descString);
    setCopiedDesc(true);
    setTimeout(() => setCopiedDesc(false), 2200);
  };

  const applyShutterstockTemplate = (mode: 'transparent' | 'custom_gradient' | 'black') => {
    onUpdateConfig({
      templateId: 'sstk_vertical_nordic_storytelling_plate',
      resolution: 'vertical_1080p',
      backgroundMode: mode,
      durationSeconds: 10,
      showText: false,
      textDisplayMode: 'clean_no_text',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-neutral-900 border border-neutral-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/70">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-neutral-950 flex items-center justify-center shadow-lg shadow-amber-500/20 font-bold">
              <Smartphone className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Shutterstock Contributor Brief: <span className="text-amber-400">sstkVertical</span>
                </h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  100% Terverifikasi
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Panduan resmi & metadata otomatis siap salin sesuai Content Brief Shutterstock
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Quick Apply Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-transparent border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>Preset Standar Shutterstock Brief</span>
              </span>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Terapkan preset <strong>Vertical 9:16 Nordic Living Silhouette</strong> dengan ruang <em>copy space</em> lapang, loop 10 detik, dan partikel salju halus.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                onClick={() => applyShutterstockTemplate('transparent')}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>Nordic Kraft (9:16)</span>
              </button>
              <button
                onClick={() => applyShutterstockTemplate('custom_gradient')}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700 text-xs font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>Midnight Blue</span>
              </button>
              <button
                onClick={() => applyShutterstockTemplate('black')}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-semibold transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
                title="Black background untuk overlay blend mode Screen di Premiere / CapCut"
              >
                <span>Alpha Matte</span>
              </button>
            </div>
          </div>

          {/* 3 Core Rules Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1.5">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
                <Smartphone className="w-4 h-4" />
                <span>1. Rasio Vertikal 9:16</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Format utama untuk Reels, Shorts, dan TikTok Ads. Dimensi HD (1080×1920) atau 4K (2160×3840).
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
                <Layers className="w-4 h-4" />
                <span>2. Clean Copy Space</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Bagian tengah video bersih dari objek menonjol agar pembeli leluasa menaruh teks promo dan judul.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800 space-y-1.5">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>3. 100% Commercial Safe</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Bebas merek dagang (trademarks), siluet alam dan maskot original, tidak memerlukan model release.
              </p>
            </div>
          </div>

          {/* Metadata Auto Generator for Submission */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-400" />
                <span>Metadata Siap Pakai untuk Submit ke Shutterstock</span>
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                Sesuai Halaman 8 & 9 Content Brief
              </span>
            </div>

            {/* Title Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-neutral-300">
                <span className="font-medium">Judul Video (Title):</span>
                <button
                  onClick={handleCopyTitle}
                  className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer font-medium"
                >
                  {copiedTitle ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedTitle ? 'Tersalin!' : 'Salin Judul'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-xs text-neutral-200">
                {titleString}
              </div>
            </div>

            {/* Description Field */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs text-neutral-300">
                <span className="font-medium">
                  Deskripsi Faktual (Maksimal 2048 Karakter — Terpakai: <span className="text-amber-400 font-mono">{descString.length}</span>/2048):
                </span>
                <button
                  onClick={handleCopyDesc}
                  className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 cursor-pointer font-medium"
                >
                  {copiedDesc ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedDesc ? 'Tersalin!' : 'Salin Deskripsi'}</span>
                </button>
              </div>
              <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 leading-relaxed font-sans">
                {descString}
              </div>
            </div>

            {/* Official Shutterstock Categories */}
            <div className="p-2.5 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">Kategori Resmi Shutterstock:</span>
                <span className="text-emerald-400 font-bold font-mono">Holidays</span>
                <span className="text-neutral-600">/</span>
                <span className="text-amber-300 font-bold font-mono">Backgrounds/Textures</span>
              </div>
              <span className="text-[10px] text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 font-medium">
                ✓ 100% Sesuai 26 Kategori Standar
              </span>
            </div>

            {/* 50 Keywords Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Daftar 50 Keyword Resmi Shutterstock:</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Wajib ada 'sstkVertical'
                  </span>
                </div>
                <button
                  onClick={handleCopyKeywords}
                  className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-all shadow-sm active:scale-95 cursor-pointer"
                >
                  {copiedKeywords ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKeywords ? 'Semua 50 Keywords Tersalin!' : 'Salin Semua 50 Keywords'}</span>
                </button>
              </div>

              {/* Keyword Badges Cloud */}
              <div className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 max-h-40 overflow-y-auto flex flex-wrap gap-1.5 text-xs">
                {sstkKeywords.map((kw, idx) => (
                  <span
                    key={kw}
                    className={`px-2 py-0.5 rounded text-[11px] font-mono border ${
                      idx === 0
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold'
                        : 'bg-neutral-900 text-neutral-300 border-neutral-800'
                    }`}
                  >
                    {idx + 1}. {kw}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Format video 60 FPS / 23.98p siap diekspor via tombol 'Render 4K MP4'</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg transition-colors cursor-pointer text-xs font-semibold"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
