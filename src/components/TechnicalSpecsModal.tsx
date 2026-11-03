import React from 'react';
import { ShieldCheck, Video, Cpu, CheckCircle2, X, Download, Flame, Layers } from 'lucide-react';

interface TechnicalSpecsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalSpecsModal: React.FC<TechnicalSpecsModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">
                Spesifikasi Teknis & Blueprint Anti Patah-Patah 4K
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono">
                Architecture Standard for Broadcast Motion Graphics
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-neutral-300 leading-relaxed">
          {/* Section 1: Mengapa Tidak Patah-Patah Saat di Render ke 4K? */}
          <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm font-display">
              <Cpu className="w-4 h-4" />
              <span>Mengapa Video 4K di AuraMotion Tidak Pernah Patah-Patah?</span>
            </div>
            <p>
              Pada perekam layar biasa (real-time screen recorder), browser dipaksa merender 3840×2160 (8,3 juta piksel) tiap 16 milidetik. Jika komputer melambat walau 5 milidetik saja, frame akan di-drop, mengakibatkan video patah-patah (stuttering).
            </p>
            <p className="text-amber-200/90 font-medium">
              Solusi AuraMotion: <span className="text-white font-bold">Deterministic Offline Time-Stepping</span>. Setiap frame dihitung di kanvas beresolusi penuh pada waktu matematis yang presisi (<code className="text-amber-300 font-mono">t = frameIndex / fps</code>). Encoder menunggu hingga piksel selesai digambar sempurna sebelum melanjutkan ke frame berikutnya. Hasil video MP4 yang diunduh diputar dengan kehalusan 60 FPS mentah tanpa kehilangan 1 frame pun!
            </p>
          </div>

          {/* Section 2: Spesifikasi Output */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-sm">Spesifikasi Standar Ekspor Video:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-[11px]">
              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1">
                <span className="text-neutral-500">Resolusi Cinema 4K</span>
                <div className="text-white font-bold text-xs">3840 × 2160 UHD (16:9)</div>
                <div className="text-neutral-400">8.294.400 Piksel per Frame</div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1">
                <span className="text-neutral-500">Resolusi Vertical Social</span>
                <div className="text-white font-bold text-xs">2160 × 3840 4K / 1080 × 1920</div>
                <div className="text-neutral-400">Optimal untuk TikTok, IG Reels, Shorts</div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1">
                <span className="text-neutral-500">Codec Video MP4</span>
                <div className="text-white font-bold text-xs">H.264 / AVC (High Profile Level 5.1)</div>
                <div className="text-neutral-400">Kompatibel di semua pemutar & NLE</div>
              </div>

              <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 space-y-1">
                <span className="text-neutral-500">Alpha & Compositing</span>
                <div className="text-white font-bold text-xs">Transparent RGBA / Green Screen</div>
                <div className="text-neutral-400">Mudah di-overlay di CapCut, Premiere, AE</div>
              </div>
            </div>
          </div>

          {/* Section 3: Standar Penjualan Stock Footage */}
          <div className="p-4 bg-amber-950/20 border border-amber-900/40 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>Standar Kurasi Stock Footage (Videohive, Motion Array, Pond5)</span>
            </div>
            <ul className="space-y-1 text-neutral-300 list-disc list-inside">
              <li>Pilih opsi <span className="text-white font-semibold">60 FPS</span> untuk memperbesar peluang diterima sebagai stock footage premium.</li>
              <li>Untuk tema perayaan Natal & Tahun Baru 2027, selalu sediakan varian warna emas (Gold Luxury) dan emerald ruby.</li>
              <li>Sediakan opsi transparan (Green screen atau PNG sequence) untuk kategori video overlay.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-neutral-950/80 border-t border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 text-xs font-bold rounded-lg transition-colors cursor-pointer"
          >
            Mengerti, Kembali ke Studio
          </button>
        </div>
      </div>
    </div>
  );
};
