import React, { useState } from 'react';
import { Code, Play, RefreshCw, Zap, Check, Sparkles, BookOpen } from 'lucide-react';
import { MotionConfig } from '../types/motion';

interface CustomCodeEditorProps {
  config: MotionConfig;
  onUpdateCode: (code: string) => void;
  onRunPreview: () => void;
  onRender4K: () => void;
}

const CODE_EXAMPLES = [
  {
    name: '2027 Cyber Rings (Pusaran Neon)',
    code: `// 2027 Cyber Rings Particle Loop
const cx = width / 2;
const cy = height / 2;

// Background
ctx.fillStyle = '#05070d';
ctx.fillRect(0, 0, width, height);

// 16 Concentric pulsing neon rings
const rings = 16;
for (let i = 0; i < rings; i++) {
  const p = (progress + i / rings) % 1;
  const radius = p * (width * 0.48);
  const alpha = Math.sin(p * Math.PI) * 0.85;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = \`hsla(\${180 + i * 15}, 95%, 65%, \${alpha})\`;
  ctx.lineWidth = 3 + (1 - p) * 8;
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 25 * alpha;
  ctx.stroke();
  ctx.restore();
}

// Center Glowing 2027
ctx.save();
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.font = 'bold ' + Math.round(width * 0.08) + 'px Outfit, sans-serif';
ctx.fillStyle = '#ffffff';
ctx.shadowColor = '#38bdf8';
ctx.shadowBlur = 40;
ctx.fillText('2027', cx, cy);
ctx.restore();`,
  },
  {
    name: 'Fireworks Blast & Golden Sparks (Kembang Api 2027)',
    code: `// Fireworks Blast & Golden Sparks
const cx = width / 2;
const cy = height / 2;

// Dark gradient
const bg = ctx.createRadialGradient(cx, cy, 0, cx, cy, width * 0.7);
bg.addColorStop(0, '#130d04');
bg.addColorStop(1, '#020202');
ctx.fillStyle = bg;
ctx.fillRect(0, 0, width, height);

// Fireworks burst particles
const sparkCount = 300;
for (let i = 0; i < sparkCount; i++) {
  const angle = (i / sparkCount) * Math.PI * 2;
  const speed = (0.3 + (i % 7) * 0.1) * (width * 0.4);
  const distance = progress * speed;
  const gravity = progress * progress * (height * 0.15);

  const x = cx + Math.cos(angle) * distance;
  const y = cy + Math.sin(angle) * distance * 0.8 + gravity;

  const alpha = Math.max(0, 1 - progress);
  const size = (3 + (i % 4) * 2) * alpha;

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = \`hsla(\${40 + (i % 20)}, 100%, 70%, \${alpha})\`;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 12 * alpha;
  ctx.fill();
  ctx.restore();
}

// Typography
ctx.save();
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.font = '800 ' + Math.round(width * 0.07) + 'px Cinzel, serif';
ctx.fillStyle = '#fef08a';
ctx.shadowColor = '#eab308';
ctx.shadowBlur = 30;
ctx.fillText('HAPPY NEW YEAR 2027', cx, cy);
ctx.restore();`,
  },
  {
    name: 'Golden Christmas Tree Fractal Spiral',
    code: `// Golden Christmas Tree Fractal Spiral
const cx = width / 2;
const treeTop = height * 0.2;
const treeBase = height * 0.85;

ctx.fillStyle = '#040b06';
ctx.fillRect(0, 0, width, height);

const points = 500;
for (let i = 0; i < points; i++) {
  const norm = i / points;
  const y = treeTop + norm * (treeBase - treeTop);
  const coneRadius = norm * (width * 0.22);
  const angle = norm * Math.PI * 20 + progress * Math.PI * 2;
  const x = cx + Math.cos(angle) * coneRadius;

  const alpha = 0.4 + (Math.sin(angle) + 1) * 0.3;
  const size = 3 + norm * 4;

  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fillStyle = \`rgba(250, 204, 21, \${alpha})\`;
  ctx.shadowColor = '#eab308';
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.restore();
}

// Glowing Top Star
ctx.save();
ctx.translate(cx, treeTop - 20);
ctx.rotate(progress * Math.PI * 2 * 0.3);
ctx.fillStyle = '#fef08a';
ctx.shadowColor = '#facc15';
ctx.shadowBlur = 40;
ctx.beginPath();
ctx.arc(0, 0, 18, 0, Math.PI * 2);
ctx.fill();
ctx.restore();`,
  },
  {
    name: '🐱 Pure Canvas Chibi Cat Mascot (100% Code - No AI)',
    code: `// Pure Canvas Chibi Cat Mascot (100% Procedural Code - Zero AI)
const cx = width / 2;
const cy = height * 0.52;
const scale = Math.min(width, height) / 800;

// Dark backdrop
ctx.fillStyle = '#09090b';
ctx.fillRect(0, 0, width, height);

// Breathing & Floating dynamics
const breathe = Math.sin(time * 4) * (0.04 * scale);
const floatY = Math.sin(time * 3) * (14 * scale);

ctx.save();
ctx.translate(cx, cy + floatY);
ctx.scale(1 + breathe, 1 - breathe);

// 1. Soft Shadow
ctx.beginPath();
ctx.ellipse(0, 150 * scale - floatY * 0.8, 120 * scale, 24 * scale, 0, 0, Math.PI * 2);
ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
ctx.fill();

// 2. Feline Ears & Head (Unified Continuous Bézier Contour)
ctx.beginPath();
ctx.moveTo(-70 * scale, -40 * scale);
// Left Ear
ctx.lineTo(-110 * scale, -140 * scale);
ctx.lineTo(-30 * scale, -95 * scale);
// Top of skull
ctx.lineTo(30 * scale, -95 * scale);
// Right Ear
ctx.lineTo(110 * scale, -140 * scale);
ctx.lineTo(70 * scale, -40 * scale);
// Chubby Cheeks & Chin
ctx.bezierCurveTo(150 * scale, 30 * scale, 90 * scale, 130 * scale, 0, 130 * scale);
ctx.bezierCurveTo(-90 * scale, 130 * scale, -150 * scale, 30 * scale, -70 * scale, -40 * scale);
ctx.closePath();

// Gradient Body Fill
const catGrad = ctx.createLinearGradient(0, -140 * scale, 0, 130 * scale);
catGrad.addColorStop(0, '#27272a');
catGrad.addColorStop(1, '#09090b');
ctx.fillStyle = catGrad;
ctx.fill();

ctx.lineWidth = 4 * scale;
ctx.strokeStyle = '#ffffff';
ctx.stroke();

// 3. Pink Inner Ears
for (const s of [-1, 1]) {
  ctx.beginPath();
  ctx.moveTo(s * 60 * scale, -45 * scale);
  ctx.lineTo(s * 95 * scale, -125 * scale);
  ctx.lineTo(s * 35 * scale, -85 * scale);
  ctx.closePath();
  ctx.fillStyle = '#f43f5e';
  ctx.fill();
}

// 4. Sparkling Anime Eyes
const isBlink = (time * 0.4) % 1 > 0.9;
for (const s of [-1, 1]) {
  const ex = s * 45 * scale;
  const ey = 5 * scale;
  if (isBlink) {
    ctx.beginPath();
    ctx.arc(ex, ey, 14 * scale, Math.PI * 1.15, Math.PI * 1.85);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 4 * scale;
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.arc(ex, ey, 18 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    // Pupil
    ctx.beginPath();
    ctx.arc(ex, ey, 9 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#09090b';
    ctx.fill();

    // Catchlight shine
    ctx.beginPath();
    ctx.arc(ex - 4 * scale, ey - 4 * scale, 4 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }
}

// 5. Rosy Cheeks
for (const s of [-1, 1]) {
  ctx.beginPath();
  ctx.ellipse(s * 75 * scale, 30 * scale, 18 * scale, 10 * scale, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(244, 63, 94, 0.55)';
  ctx.fill();
}

// 6. Cute Cat Snout & Whisker :3
ctx.beginPath();
ctx.arc(0, 32 * scale, 4 * scale, 0, Math.PI * 2);
ctx.fillStyle = '#fda4af';
ctx.fill();

ctx.beginPath();
ctx.arc(-8 * scale, 40 * scale, 8 * scale, 0, Math.PI);
ctx.arc(8 * scale, 40 * scale, 8 * scale, 0, Math.PI);
ctx.strokeStyle = '#ffffff';
ctx.lineWidth = 3.5 * scale;
ctx.lineCap = 'round';
ctx.stroke();

// Whiskers
for (const s of [-1, 1]) {
  for (let w = -1; w <= 1; w++) {
    ctx.beginPath();
    ctx.moveTo(s * 85 * scale, 30 * scale + w * 10 * scale);
    ctx.lineTo(s * 150 * scale, 25 * scale + w * 22 * scale);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.lineWidth = 2.5 * scale;
    ctx.stroke();
  }
}

ctx.restore();`,
  },
  {
    name: '⭐ Pure Canvas Glowing Vector Icon (Star & Sparkle)',
    code: `// Pure Vector Icon & Sparkle (No AI, 100% Canvas Geometry)
const cx = width / 2;
const cy = height / 2;
const scale = Math.min(width, height) / 600;

ctx.fillStyle = '#030712';
ctx.fillRect(0, 0, width, height);

// Draw 4-point Diamond Star Icon
ctx.save();
ctx.translate(cx, cy);
const pulse = 1 + Math.sin(time * 4) * 0.08;
ctx.scale(pulse * scale, pulse * scale);

// Multi-layered glow
ctx.shadowColor = '#38bdf8';
ctx.shadowBlur = 45;

ctx.beginPath();
const starR = 130;
const innerR = 32;
for (let i = 0; i < 8; i++) {
  const r = i % 2 === 0 ? starR : innerR;
  const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
  const px = Math.cos(a) * r;
  const py = Math.sin(a) * r;
  if (i === 0) ctx.moveTo(px, py);
  else ctx.lineTo(px, py);
}
ctx.closePath();

const grad = ctx.createLinearGradient(-starR, -starR, starR, starR);
grad.addColorStop(0, '#38bdf8');
grad.addColorStop(0.5, '#ffffff');
grad.addColorStop(1, '#818cf8');
ctx.fillStyle = grad;
ctx.fill();

ctx.lineWidth = 4;
ctx.strokeStyle = '#ffffff';
ctx.stroke();

// Surrounding floating sparkle particles
for (let s = 0; s < 12; s++) {
  const ang = (s / 12) * Math.PI * 2 + time * 0.5;
  const dist = 180 + Math.sin(time * 3 + s) * 20;
  const sx = Math.cos(ang) * dist;
  const sy = Math.sin(ang) * dist;
  ctx.beginPath();
  ctx.arc(sx, sy, 3 + Math.sin(time * 5 + s) * 1.5, 0, Math.PI * 2);
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#60a5fa';
  ctx.shadowBlur = 12;
  ctx.fill();
}

ctx.restore();`,
  },
];

export const CustomCodeEditor: React.FC<CustomCodeEditorProps> = ({
  config,
  onUpdateCode,
  onRunPreview,
  onRender4K,
}) => {
  const [code, setCode] = useState<string>(
    config.customCode || CODE_EXAMPLES[0].code
  );

  const handleApplyCode = (newCode: string) => {
    setCode(newCode);
    onUpdateCode(newCode);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-neutral-950 text-neutral-100 select-none overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center gap-2.5">
          <Code className="w-4 h-4 text-amber-400" />
          <h2 className="text-sm font-bold text-white font-display">
            Custom HTML5 Canvas & Motion Graphic Engine
          </h2>
          <span className="text-[11px] font-mono text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
            Live Scripting
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              onUpdateCode(code);
              onRunPreview();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer border border-neutral-700"
          >
            <Play className="w-3.5 h-3.5 text-amber-400 fill-current" />
            <span>Terapkan & Uji di Kanvas</span>
          </button>

          <button
            onClick={() => {
              onUpdateCode(code);
              onRender4K();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-neutral-950 rounded-lg text-xs font-bold transition-all shadow-md shadow-amber-500/10 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Render Kode Ini ke 4K MP4</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Code Examples & Variable Reference */}
        <div className="w-full md:w-80 bg-neutral-900/60 border-r border-neutral-800 p-4 overflow-y-auto space-y-5 text-xs">
          <div className="space-y-2">
            <label className="text-neutral-300 font-semibold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              <span>Pilih Template Kode Jadi</span>
            </label>
            <div className="space-y-1.5">
              {CODE_EXAMPLES.map((ex, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplyCode(ex.code)}
                  className="w-full text-left p-2.5 rounded-lg border border-neutral-800 bg-neutral-950 hover:border-amber-500/50 hover:bg-neutral-900 text-neutral-300 transition-colors cursor-pointer"
                >
                  <div className="font-semibold text-xs text-white">{ex.name}</div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    Klik untuk memuat kode ke editor
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 space-y-2">
            <div className="font-semibold text-neutral-200">Variabel Global yang Tersedia:</div>
            <ul className="space-y-1.5 text-neutral-400 font-mono text-[11px]">
              <li>
                <span className="text-amber-400">ctx</span>: CanvasRenderingContext2D
              </li>
              <li>
                <span className="text-amber-400">t</span>: waktu berjalan dalam detik
              </li>
              <li>
                <span className="text-amber-400">progress</span>: siklus loop (0.0 s/d 1.0)
              </li>
              <li>
                <span className="text-amber-400">width, height</span>: dimensi kanvas aktif (misal 3840×2160)
              </li>
              <li>
                <span className="text-amber-400">Math</span>: library matematika JS
              </li>
            </ul>
          </div>

          <div className="p-3.5 bg-amber-950/20 rounded-xl border border-amber-900/40 text-neutral-300 text-[11px] leading-relaxed">
            <span className="font-semibold text-amber-300">Tips Seamless Looping:</span> Gunakan fungsi periodik{' '}
            <code className="text-amber-200 font-mono">Math.sin(progress * Math.PI * 2)</code> agar posisi dan animasi partikel di awal (0.0) dan akhir (1.0) tersambung mulus tanpa patahan.
          </div>
        </div>

        {/* Right: Code Editor Box */}
        <div className="flex-1 flex flex-col bg-neutral-950">
          <div className="px-4 py-2 bg-neutral-900/40 border-b border-neutral-800/80 text-[11px] font-mono text-neutral-400 flex items-center justify-between">
            <span>motion-graphic-render.js (Deterministic Frame-by-Frame)</span>
            <span>UTF-8 · ES6+</span>
          </div>

          <textarea
            value={code}
            onChange={(e) => handleApplyCode(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full bg-neutral-950 text-neutral-100 font-mono text-xs p-4 leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-amber-500/40 selection:bg-amber-500/30 selection:text-amber-200"
          />
        </div>
      </div>
    </div>
  );
};
