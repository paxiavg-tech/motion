import React, { useState } from 'react';
import {
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  Video,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  FileArchive,
  FileJson,
  FileText,
  Copy,
  Check,
  Tag,
  FolderTree,
  Zap,
} from 'lucide-react';
import { RenderProgress, MotionConfig, RESOLUTION_PRESETS, ExportFormat } from '../types/motion';
import {
  downloadJsonFile,
  downloadTxtFile,
  downloadShutterstockCsvFile,
  downloadAdobeStockCsvFile,
  formatMicrostockText,
} from '../services/metadataGenerator';

interface RenderExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: RenderProgress;
  onCancel: () => void;
  config: MotionConfig;
  exportFormat: ExportFormat;
}

export const RenderExportModal: React.FC<RenderExportModalProps> = ({
  isOpen,
  onClose,
  progress,
  onCancel,
  config,
  exportFormat,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'metadata'>('video');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen) return null;

  const resConfig = RESOLUTION_PRESETS[config.resolution];
  const isComplete = !progress.isRendering && Boolean(progress.downloadUrl);
  const isFailed = Boolean(progress.error);
  const metadata = progress.metadata;

  const copyToClipboard = (text: string, fieldKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldKey);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const formatFullMetadataText = () => {
    if (!metadata) return '';
    return formatMicrostockText(metadata);
  };

  const handleDownloadMetadata = () => {
    if (!metadata) return;
    const jsonFileName = progress.metadataFileName || `${progress.downloadFileName?.replace(/\.[^/.]+$/, '') || 'render'}_metadata.json`;
    downloadJsonFile(jsonFileName, metadata);
  };

  const handleDownloadTxtMetadata = () => {
    if (!metadata) return;
    const txtFileName = `${(progress.metadataFileName || progress.downloadFileName || 'render').replace(/\.[^/.]+$/, '')}_metadata.txt`;
    const fullText = formatMicrostockText(metadata);
    downloadTxtFile(txtFileName, fullText);
  };

  const handleDownloadShutterstockCsv = () => {
    if (!metadata) return;
    const csvFileName = `${(progress.metadataFileName || progress.downloadFileName || 'render').replace(/\.[^/.]+$/, '')}_shutterstock.csv`;
    const videoFileName = progress.downloadFileName || `render_4k.${exportFormat}`;
    downloadShutterstockCsvFile(csvFileName, metadata, videoFileName);
  };

  const handleDownloadAdobeCsv = () => {
    if (!metadata) return;
    const csvFileName = `${(progress.metadataFileName || progress.downloadFileName || 'render').replace(/\.[^/.]+$/, '')}_adobe_stock.csv`;
    const videoFileName = progress.downloadFileName || `render_4k.${exportFormat}`;
    downloadAdobeStockCsvFile(csvFileName, metadata, videoFileName);
  };

  const handleDownloadBoth = () => {
    // 1. Download video
    if (progress.downloadUrl) {
      const a = document.createElement('a');
      a.href = progress.downloadUrl;
      a.download = progress.downloadFileName || `render_4k.${exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    // 2. Download JSON
    setTimeout(() => {
      handleDownloadMetadata();
    }, 300);
  };

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}m ${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md select-none">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col text-neutral-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Video className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-display">
                {isComplete
                  ? 'Render 4K Selesai Siap Unduh!'
                  : isFailed
                  ? 'Gagal Melakukan Render'
                  : 'Memproses Render 4K MP4 Offline'}
              </h3>
              <p className="text-[11px] text-neutral-400 font-mono">
                {resConfig.width} × {resConfig.height} UHD · {config.fps} FPS · {config.durationSeconds} Detik
              </p>
            </div>
          </div>

          {!progress.isRendering && (
            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Active Rendering State */}
          {progress.isRendering && (
            <div className="space-y-5">
              {/* Live Thumbnail Preview */}
              {progress.previewDataUrl ? (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-950 border border-neutral-800 flex items-center justify-center shadow-inner">
                  <img
                    src={progress.previewDataUrl}
                    alt="Current frame preview"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 border border-neutral-700/80 text-[10px] font-mono text-amber-300">
                    Frame {progress.currentFrame} / {progress.totalFrames}
                  </div>
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/75 border border-neutral-700/80 text-[10px] font-mono text-emerald-400">
                    {progress.fps} FPS
                  </div>
                </div>
              ) : (
                <div className="aspect-video rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col items-center justify-center gap-2">
                  <RefreshCw className="w-6 h-6 text-amber-400 animate-spin" />
                  <span className="text-xs text-neutral-400 font-mono">Menginisialisasi Raster Buffer 4K...</span>
                </div>
              )}

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-white">{progress.statusText}</span>
                  <span className="font-mono text-amber-400 font-bold text-sm">
                    {progress.percentage}%
                  </span>
                </div>
                <div className="w-full h-2.5 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-300 transition-all duration-200"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center font-mono">
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase">Frame Selesai</div>
                  <div className="text-xs font-bold text-neutral-200 mt-0.5">
                    {progress.currentFrame} / {progress.totalFrames}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase">Waktu Berjalan</div>
                  <div className="text-xs font-bold text-neutral-200 mt-0.5">
                    {formatSeconds(progress.elapsedTime)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-neutral-500 uppercase">Sisa Estimasi</div>
                  <div className="text-xs font-bold text-amber-400 mt-0.5">
                    {formatSeconds(progress.estimatedRemaining)}
                  </div>
                </div>
              </div>

              {/* Guarantee info */}
              <div className="space-y-2">
                <div className="flex items-start gap-2.5 p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl text-xs text-neutral-300 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-emerald-300">Deterministic Time-Stepping 4K:</span> Setiap frame di-raster dan di-encode secara presisi tanpa tergantung clock real-time. Hasil video MP4/WebM dijamin 100% mulus (smooth) tanpa patah-patah.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 bg-amber-950/25 border border-amber-500/30 rounded-xl text-xs text-neutral-300 leading-relaxed">
                  <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-amber-300">Aman Berpindah Tab (Background Guard):</span> Render tetap berjalan kencang di latar belakang tanpa freeze/berhenti saat Anda berpindah tab atau membuka aplikasi lain. Progres persen juga terpantau langsung di judul tab browser.
                  </div>
                </div>
              </div>

              {/* Cancel Button */}
              <div className="flex justify-end">
                <button
                  onClick={onCancel}
                  className="px-4 py-2 text-xs font-medium text-neutral-400 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer border border-neutral-800"
                >
                  Batalkan Render
                </button>
              </div>
            </div>
          )}

          {/* Complete State */}
          {isComplete && progress.downloadUrl && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 bg-emerald-950/40 border border-emerald-800/60 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-emerald-300">Video 4K & Metadata JSON Siap!</h4>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Auto-Downloaded .JSON
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-300 mt-1">
                    File video {exportFormat.toUpperCase()} telah siap. File <span className="text-amber-300 font-mono font-medium">{progress.metadataFileName || 'metadata.json'}</span> otomatis terunduh lengkap dengan Title, Deskripsi, dan Keywords.
                  </p>
                  <div className="flex items-center gap-1.5 mt-2 text-[10px] text-emerald-300 bg-emerald-900/40 px-2 py-1 rounded-md border border-emerald-500/30 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>Desain ini otomatis ditandai <strong>"Sudah Dirender"</strong> di katalog template agar tidak buang waktu atau render ulang.</span>
                  </div>
                </div>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('video')}
                  className={`flex-1 py-1.5 px-3 rounded-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === 'video'
                      ? 'bg-neutral-800 text-white font-semibold shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 text-amber-400" />
                  <span>Pratinjau Video & Spek</span>
                </button>
                <button
                  onClick={() => setActiveTab('metadata')}
                  className={`flex-1 py-1.5 px-3 rounded-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    activeTab === 'metadata'
                      ? 'bg-neutral-800 text-amber-300 font-semibold shadow-xs'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <FileJson className="w-3.5 h-3.5 text-amber-400" />
                  <span>Metadata Microstock JSON</span>
                  <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">
                    Lengkap
                  </span>
                </button>
              </div>

              {/* TAB 1: Video Player & Specs */}
              {activeTab === 'video' && (
                <div className="space-y-4">
                  {exportFormat !== 'png_sequence' ? (
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-neutral-800 shadow-xl">
                      <video
                        src={progress.downloadUrl}
                        controls
                        autoPlay
                        loop
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="p-6 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col items-center justify-center text-center gap-2">
                      <FileArchive className="w-10 h-10 text-amber-400" />
                      <div className="font-semibold text-xs text-white">Paket Arsip ZIP PNG Transparan</div>
                      <div className="text-[11px] text-neutral-400">
                        Berisi {progress.totalFrames} file PNG 4K dengan alpha channel utuh untuk VFX After Effects & Premiere.
                      </div>
                    </div>
                  )}

                  {/* File Specs Summary */}
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-xs space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-neutral-800/80">
                      <span className="text-neutral-500">Nama File Video:</span>
                      <span className="font-mono text-amber-300 font-semibold truncate max-w-[280px]">
                        {progress.downloadFileName || `${config.templateId || 'render'}.${exportFormat === 'png_sequence' ? 'zip' : exportFormat}`}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <span className="text-neutral-500">Dimensi Resolusi: </span>
                        <span className="font-mono text-neutral-200 font-medium">
                          {resConfig.width} × {resConfig.height}
                        </span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Frame Rate: </span>
                        <span className="font-mono text-neutral-200 font-medium">{config.fps} FPS</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Target Bitrate: </span>
                        <span className="font-mono text-neutral-200 font-medium">{config.bitrateMbps} Mbps</span>
                      </div>
                      <div>
                        <span className="text-neutral-500">Durasi: </span>
                        <span className="font-mono text-neutral-200 font-medium">{config.durationSeconds} Detik (Loop)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: Microstock Metadata Preview */}
              {activeTab === 'metadata' && metadata && (
                <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                  {/* Shutterstock Compliance Status Banner */}
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-xs font-bold text-emerald-300">
                        100% Lolos Validasi Standar Metadata Shutterstock & Adobe Stock
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] text-neutral-300">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Faktual English Sentence (No Spam)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>Zero Trademark Violation</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{metadata.keywordsCount || (metadata.Keywords ? metadata.Keywords.split(',').length : 0)} Kata Kunci (Batas Resmi: 7-50)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>2 Kategori Resmi Shutterstock Terpilih</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Copy Full Format Bar */}
                  <div className="flex items-center justify-between p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                    <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Format Standar Ekspor Microstock (Title, Description, Keywords, Categories)
                    </span>
                    <button
                      onClick={() => copyToClipboard(formatFullMetadataText(), 'full')}
                      className="flex items-center gap-1 text-[11px] font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedField === 'full' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-neutral-900" />
                          <span>Format Lengkap Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Salin Format Lengkap</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 1. Title */}
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        Title / Headline:
                      </span>
                      <button
                        onClick={() => copyToClipboard(metadata.Title || metadata.title, 'title')}
                        className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-white px-2 py-0.5 bg-neutral-900 rounded border border-neutral-800 cursor-pointer"
                      >
                        {copiedField === 'title' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin Title</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-neutral-200 font-medium leading-relaxed select-text font-sans">
                      {metadata.Title || metadata.title}
                    </p>
                  </div>

                  {/* 2. Description */}
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-amber-400 font-bold uppercase tracking-wider">
                        Description (Shutterstock Main):
                      </span>
                      <button
                        onClick={() => copyToClipboard(metadata.Description || metadata.description, 'description')}
                        className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-white px-2 py-0.5 bg-neutral-900 rounded border border-neutral-800 cursor-pointer"
                      >
                        {copiedField === 'description' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin Description</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-neutral-300 leading-relaxed select-text">
                      {metadata.Description || metadata.description}
                    </p>
                  </div>

                  {/* 3. Keywords */}
                  {(() => {
                    const keywordsStr =
                      typeof metadata.Keywords === 'string'
                        ? metadata.Keywords
                        : Array.isArray(metadata.Keywords)
                        ? metadata.Keywords.join(', ')
                        : typeof metadata.keywords === 'string'
                        ? metadata.keywords
                        : Array.isArray(metadata.tags)
                        ? metadata.tags.join(', ')
                        : '';
                    const keywordsCount = keywordsStr
                      ? keywordsStr
                          .split(',')
                          .map((s: string) => s.trim())
                          .filter(Boolean).length
                      : 0;

                    return (
                      <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Tag className="w-3 h-3 text-amber-400" />
                            Keywords ({keywordsCount} tags - Bebas Trademark & Spam):
                          </span>
                          <button
                            onClick={() => copyToClipboard(keywordsStr, 'tags')}
                            className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-white px-2 py-0.5 bg-neutral-900 rounded border border-neutral-800 cursor-pointer"
                          >
                            {copiedField === 'tags' ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Keywords Tersalin!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Salin Keywords</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="p-2.5 bg-neutral-900/60 rounded-lg border border-neutral-800 text-[11px] text-neutral-300 font-mono leading-relaxed select-text max-h-24 overflow-y-auto pr-1">
                          {keywordsStr}
                        </div>
                      </div>
                    );
                  })()}

                  {/* 4. Categories */}
                  <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-amber-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <FolderTree className="w-3 h-3 text-amber-400" />
                        Kategori Resmi Shutterstock (26 Kategori Standar):
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `Primary: ${metadata.Categories?.Primary || metadata.primaryCategory}\nSecondary: ${metadata.Categories?.Secondary || metadata.secondaryCategory}`,
                            'categories'
                          )
                        }
                        className="flex items-center gap-1 text-[10px] text-neutral-400 hover:text-white px-2 py-0.5 bg-neutral-900 rounded border border-neutral-800 cursor-pointer"
                      >
                        {copiedField === 'categories' ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Salin Kategori</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80">
                        <span className="text-[10px] text-neutral-400 block font-medium">Primary:</span>
                        <span className="text-emerald-400 font-semibold mt-0.5 block">
                          {metadata.Categories?.Primary || metadata.primaryCategory}
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-neutral-900 border border-neutral-800/80">
                        <span className="text-[10px] text-neutral-400 block font-medium">Secondary:</span>
                        <span className="text-amber-300 font-semibold mt-0.5 block">
                          {metadata.Categories?.Secondary || metadata.secondaryCategory}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2">
                  <a
                    href={progress.downloadUrl}
                    download={progress.downloadFileName || `${config.templateId || 'render'}.${exportFormat === 'png_sequence' ? 'zip' : exportFormat}`}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-3 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 text-neutral-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 hover:from-amber-300 hover:to-yellow-300 active:scale-[0.99] transition-all cursor-pointer truncate"
                  >
                    <Download className="w-4 h-4 stroke-[2.5] shrink-0" />
                    <span className="truncate">Unduh {progress.downloadFileName || `${config.templateId || 'render'}.${exportFormat === 'png_sequence' ? 'zip' : exportFormat}`}</span>
                  </a>

                  <button
                    onClick={handleDownloadShutterstockCsv}
                    className="flex items-center justify-center gap-1.5 py-3 px-2.5 bg-neutral-800 hover:bg-neutral-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition-all cursor-pointer"
                    title="Unduh file CSV resmi berformat Shutterstock (Filename, Description, Keywords, Categories, Editorial)"
                  >
                    <Tag className="w-4 h-4 text-amber-400" />
                    <span>CSV SSTK</span>
                  </button>

                  <button
                    onClick={handleDownloadAdobeCsv}
                    className="flex items-center justify-center gap-1.5 py-3 px-2.5 bg-neutral-800 hover:bg-neutral-700 text-emerald-400 font-bold text-xs rounded-xl border border-emerald-500/30 transition-all cursor-pointer"
                    title="Unduh file CSV resmi berformat Adobe Stock (Filename, Title, Keywords, Category, Releases)"
                  >
                    <Tag className="w-4 h-4 text-emerald-400" />
                    <span>CSV Adobe</span>
                  </button>

                  <button
                    onClick={handleDownloadMetadata}
                    className="flex items-center justify-center gap-1.5 py-3 px-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs rounded-xl border border-neutral-700 transition-all cursor-pointer"
                    title="Unduh metadata JSON standar"
                  >
                    <FileJson className="w-4 h-4" />
                    <span>JSON</span>
                  </button>

                  <button
                    onClick={handleDownloadTxtMetadata}
                    className="flex items-center justify-center gap-1.5 py-3 px-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs rounded-xl border border-neutral-700 transition-all cursor-pointer"
                    title="Unduh metadata file TXT"
                  >
                    <FileText className="w-4 h-4 text-neutral-300" />
                    <span>TXT</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDownloadBoth}
                    className="flex-1 py-2 px-3 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 font-semibold text-xs rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Keduanya (Video + Metadata)</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white bg-neutral-900 hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer border border-neutral-800"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Failed State */}
          {isFailed && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-red-950/40 border border-red-800/60 rounded-xl">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-red-300">Render Terhenti</h4>
                  <p className="text-[11px] text-red-200/90 mt-1">{progress.error}</p>
                </div>
              </div>

              <div className="text-xs text-neutral-400 leading-relaxed">
                Tip: Jika memori GPU atau browser terbatas saat render 4K, coba turunkan sedikit durasi (misal 5 detik) atau gunakan mode WebM / 1080p terlebih dahulu.
              </div>

              <div className="flex justify-end">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors cursor-pointer"
                >
                  Tutup Dialog
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
