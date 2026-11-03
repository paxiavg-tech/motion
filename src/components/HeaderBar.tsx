import React from 'react';
import { Film, Sparkles, Download, Layers, CheckCircle2 } from 'lucide-react';

interface HeaderBarProps {
  activeTab: 'studio' | 'marketplace' | 'code' | 'specs';
  setActiveTab: (tab: 'studio' | 'marketplace' | 'code' | 'specs') => void;
  onOpenRender: () => void;
  isRendering: boolean;
  onOpenShutterstockModal?: () => void;
  renderedCount?: number;
  totalTemplates?: number;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  activeTab,
  setActiveTab,
  onOpenRender,
  isRendering,
  onOpenShutterstockModal,
  renderedCount,
  totalTemplates,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-6 py-3.5 bg-neutral-900/90 backdrop-blur-md border-b border-neutral-800 shrink-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('studio');
          }}
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 group"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
            <Film className="w-4 h-4 text-neutral-950 stroke-[2.5]" />
          </div>
          <span className="font-display tracking-tight text-white font-extrabold text-xl">
            AuraMotion <span className="text-amber-400 font-mono text-sm font-semibold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">4K</span>
          </span>
        </a>
      </div>

      {/* Zone 2: 4-5 clean single-line navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
        <button
          onClick={() => setActiveTab('studio')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
            activeTab === 'studio'
              ? 'text-amber-300 border-b-2 border-amber-400 font-semibold'
              : 'text-neutral-400 hover:text-neutral-100'
          }`}
        >
          Motion Studio
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'marketplace'
              ? 'text-amber-300 border-b-2 border-amber-400 font-semibold'
              : 'text-neutral-400 hover:text-neutral-100'
          }`}
        >
          <span>Hitung Mundur 2027</span>
          <span className="text-[11px] font-mono font-normal text-amber-400/90">· Katalog Aset</span>
        </button>

        <button
          onClick={() => setActiveTab('code')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
            activeTab === 'code'
              ? 'text-amber-300 border-b-2 border-amber-400 font-semibold'
              : 'text-neutral-400 hover:text-neutral-100'
          }`}
        >
          Custom HTML / JS Code
        </button>

        <button
          onClick={() => setActiveTab('specs')}
          className={`whitespace-nowrap shrink-0 transition-colors py-1 cursor-pointer ${
            activeTab === 'specs'
              ? 'text-amber-300 border-b-2 border-amber-400 font-semibold'
              : 'text-neutral-400 hover:text-neutral-100'
          }`}
        >
          Spesifikasi Ekspor 4K
        </button>
      </nav>

      {/* Zone 3: Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {typeof renderedCount === 'number' && (
          <div
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono"
            title={`${renderedCount} dari ${totalTemplates || 70} template sudah dirender ke 4K`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-neutral-400">Dirender:</span>
            <span className="text-emerald-400 font-bold">{renderedCount}/{totalTemplates || 70}</span>
          </div>
        )}

        {onOpenShutterstockModal && (
          <button
            onClick={onOpenShutterstockModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
            title="Buka Panduan & Metadata Shutterstock Content Brief sstkVertical"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>sstkVertical Brief</span>
          </button>
        )}

        <button
          onClick={onOpenRender}
          disabled={isRendering}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 rounded-lg shadow-lg shadow-amber-500/20 hover:from-amber-300 hover:to-yellow-300 active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>{isRendering ? 'Sedang Render...' : 'Render 4K MP4'}</span>
        </button>
      </div>
    </header>
  );
};
