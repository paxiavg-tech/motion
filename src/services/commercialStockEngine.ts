import { MotionConfig } from '../types/motion';

function hash(n: number): number {
  const x = Math.sin(n) * 43758.5453123;
  return x - Math.floor(x);
}

// ============================================================================
// 1. LUXURY AWARDS & GALA (5 MODELS)
// ============================================================================

export function drawAwardsRoyalSilkCaustics(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const waves = 8;

  for (let w = 0; w < waves; w++) {
    const yBase = height * 0.15 + (w / waves) * (height * 0.7);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x += 30 * scale) {
      const nx = x / width;
      const wave =
        Math.sin(nx * 4 + progress * Math.PI * 2 + w * 0.8) * (50 * scale) +
        Math.cos(nx * 7 - progress * Math.PI * 2 * 0.5 + w) * (25 * scale);
      ctx.lineTo(x, yBase + wave);
    }
    ctx.lineTo(width, height);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, yBase - 60 * scale, 0, yBase + 140 * scale);
    grad.addColorStop(0, 'rgba(254, 240, 138, 0.12)');
    grad.addColorStop(0.4, 'rgba(217, 119, 6, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = `rgba(254, 240, 138, ${0.16 + Math.sin(progress * Math.PI * 2 + w) * 0.06})`;
    ctx.lineWidth = (2.5 + w * 0.4) * scale;
    ctx.stroke();
    ctx.restore();
  }

  // Floating Micro Gold Sparkles
  for (let i = 0; i < config.particleCount; i++) {
    const seed = i * 11.23;
    const x = ((hash(seed) + progress * 0.2) % 1) * width;
    const y = ((hash(seed + 1) + Math.sin(progress * Math.PI * 2 + seed) * 0.05 + 1) % 1) * height;
    const pSize = (hash(seed + 2) * 2.8 + 1.2) * scale;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(254, 240, 138, 0.75)';
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 8 * scale * config.glowIntensity;
    ctx.fill();
    ctx.restore();
  }
}

export function drawAwardsGoldenBokehCurtain(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const count = config.particleCount;

  // Vertical Godray Beams
  const beams = 7;
  for (let b = 0; b < beams; b++) {
    const bx = (width / beams) * (b + 0.5);
    const bProg = (progress * 0.8 + b * 0.15) % 1;
    const alpha = Math.sin(bProg * Math.PI) * 0.12;
    ctx.save();
    const grad = ctx.createLinearGradient(bx, 0, bx + (b % 2 === 0 ? 60 : -60) * scale, height);
    grad.addColorStop(0, `rgba(254, 240, 138, ${alpha * 1.5})`);
    grad.addColorStop(0.5, `rgba(245, 158, 11, ${alpha})`);
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(bx - 30 * scale, 0);
    ctx.lineTo(bx + 30 * scale, 0);
    ctx.lineTo(bx + 160 * scale, height);
    ctx.lineTo(bx - 160 * scale, height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Large Out-of-Focus Golden Bokeh Orbs
  for (let i = 0; i < count; i++) {
    const seed = i * 19.41;
    const speed = hash(seed + 1) * 0.4 + 0.3;
    const y = ((hash(seed + 2) - progress * speed + 1) % 1) * height;
    const x = hash(seed) * width + Math.sin(progress * Math.PI * 2 + seed) * (20 * scale);
    const r = (hash(seed + 3) * 28 + 6) * scale;
    const alpha = hash(seed + 4) * 0.2 + 0.08;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(255, 255, 255, ${alpha * 1.6})`);
    grad.addColorStop(0.4, `rgba(254, 240, 138, ${alpha})`);
    grad.addColorStop(1, 'rgba(217, 119, 6, 0)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }
}

export function drawAwardsFloatingGoldDust(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const count = config.particleCount;

  for (let i = 0; i < count; i++) {
    const seed = i * 27.13;
    const speed = hash(seed + 1) * 0.5 + 0.2;
    const y = ((hash(seed + 2) - progress * speed + 1) % 1) * height;
    const x = hash(seed) * width + Math.sin(progress * Math.PI * 4 + seed) * (18 * scale);
    const pSize = (hash(seed + 3) * 3 + 1) * scale;
    const shimmer = Math.sin(progress * Math.PI * 4 + seed * 2) * 0.5 + 0.5;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 240, 138, ${0.4 + shimmer * 0.5})`;
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = pSize * 5 * config.glowIntensity;
    ctx.fill();

    // Occasional starburst twinkle
    if (hash(seed + 4) > 0.88 && shimmer > 0.7) {
      const fl = pSize * 4;
      ctx.strokeStyle = `rgba(255, 255, 240, ${shimmer * 0.8})`;
      ctx.lineWidth = 1 * scale;
      ctx.beginPath();
      ctx.moveTo(x - fl, y);
      ctx.lineTo(x + fl, y);
      ctx.moveTo(x, y - fl);
      ctx.lineTo(x, y + fl);
      ctx.stroke();
    }
    ctx.restore();
  }
}

export function drawAwardsPedestalHalo(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height * 0.62;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  // Orbital Pedestal Stage Rings
  const rings = 5;
  for (let r = 0; r < rings; r++) {
    const rx = (minDim * 0.32) + (r * minDim * 0.05);
    const ry = rx * 0.32;
    const rot = progress * Math.PI * 2 * (r % 2 === 0 ? 0.3 : -0.3) + r;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot * 0.2);
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(254, 240, 138, ${0.25 - r * 0.03})`;
    ctx.lineWidth = (3 - r * 0.4) * scale;
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 12 * scale * config.glowIntensity;
    ctx.stroke();

    // Orbiting gems
    const gems = 8;
    for (let g = 0; g < gems; g++) {
      const gAngle = (g / gems) * Math.PI * 2 + rot;
      const gx = Math.cos(gAngle) * rx;
      const gy = Math.sin(gAngle) * ry;
      ctx.beginPath();
      ctx.arc(gx, gy, (3 + (g % 2 === 0 ? 1.5 : 0)) * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10 * scale;
      ctx.fill();
    }
    ctx.restore();
  }

  // Upward Gold Light Cone from Pedestal
  ctx.save();
  const coneGrad = ctx.createLinearGradient(cx, cy, cx, 0);
  coneGrad.addColorStop(0, 'rgba(254, 240, 138, 0.28)');
  coneGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.10)');
  coneGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = coneGrad;
  ctx.beginPath();
  ctx.moveTo(cx - minDim * 0.25, cy);
  ctx.lineTo(cx + minDim * 0.25, cy);
  ctx.lineTo(cx + minDim * 0.45, 0);
  ctx.lineTo(cx - minDim * 0.45, 0);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function drawAwardsCrystalPrismSparkles(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const count = config.particleCount;

  // Prismatic Chandelier Light Flares
  const prisms = 6;
  for (let p = 0; p < prisms; p++) {
    const px = width * (0.2 + (p / prisms) * 0.6);
    const py = height * (0.25 + (p % 3) * 0.2);
    const flareLen = (180 + Math.sin(progress * Math.PI * 2 + p) * 50) * scale;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(progress * Math.PI + p);

    // Spectrum horizontal rainbow dispersion
    const rGrad = ctx.createLinearGradient(-flareLen, 0, flareLen, 0);
    rGrad.addColorStop(0, 'rgba(56, 189, 248, 0)');
    rGrad.addColorStop(0.3, 'rgba(168, 85, 247, 0.4)');
    rGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.9)');
    rGrad.addColorStop(0.7, 'rgba(250, 204, 21, 0.4)');
    rGrad.addColorStop(1, 'rgba(244, 63, 94, 0)');
    ctx.fillStyle = rGrad;
    ctx.fillRect(-flareLen, -2 * scale, flareLen * 2, 4 * scale);

    // Vertical glint
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillRect(-1.5 * scale, -flareLen * 0.4, 3 * scale, flareLen * 0.8);
    ctx.restore();
  }

  for (let i = 0; i < count; i++) {
    const seed = i * 23.89;
    const x = hash(seed) * width;
    const y = ((hash(seed + 1) + progress * 0.3) % 1) * height;
    const pSize = (hash(seed + 2) * 3 + 1.2) * scale;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = hash(seed + 3) > 0.5 ? '#ffffff' : '#fef08a';
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 8 * scale;
    ctx.fill();
    ctx.restore();
  }
}

// ============================================================================
// 2. CORPORATE & TECH AI ABSTRACT DATA (5 MODELS)
// ============================================================================

export function drawTechNeuralPlexusNodes(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const nodeCount = 55;
  const nodes: { x: number; y: number }[] = [];

  for (let i = 0; i < nodeCount; i++) {
    const seed = i * 31.17;
    const speedX = (hash(seed + 1) - 0.5) * 0.8;
    const speedY = (hash(seed + 2) - 0.5) * 0.8;
    const x = ((hash(seed) + progress * speedX + 1) % 1) * width;
    const y = ((hash(seed + 3) + progress * speedY + 1) % 1) * height;
    nodes.push({ x, y });
  }

  // Draw connecting plexus lines
  ctx.save();
  for (let i = 0; i < nodeCount; i++) {
    for (let j = i + 1; j < nodeCount; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 200 * scale;

      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.45;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        ctx.lineWidth = 1.2 * scale;
        ctx.stroke();
      }
    }
  }

  // Draw nodes
  for (let i = 0; i < nodeCount; i++) {
    const { x, y } = nodes[i];
    ctx.beginPath();
    ctx.arc(x, y, (3.5 + (i % 3 === 0 ? 2 : 0)) * scale, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#818cf8';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 10 * scale * config.glowIntensity;
    ctx.fill();
  }
  ctx.restore();
}

export function drawTechWireframeGridTerrain(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const horizonY = height * 0.50;
  const linesH = 22;

  ctx.save();
  // Perspective lines to horizon
  const cols = 28;
  for (let c = 0; c <= cols; c++) {
    const bottomX = (width / cols) * c;
    const topX = width * 0.5 + (bottomX - width * 0.5) * 0.05;
    ctx.beginPath();
    ctx.moveTo(topX, horizonY);
    ctx.lineTo(bottomX, height);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();
  }

  // Horizontal scanlines moving forward
  for (let l = 0; l < linesH; l++) {
    const p = ((l / linesH + progress) % 1);
    const y = horizonY + Math.pow(p, 2.2) * (height - horizonY);
    const alpha = Math.sin(p * Math.PI) * 0.7;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
    ctx.lineWidth = (1 + p * 3) * scale;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 8 * scale;
    ctx.stroke();
  }

  // Horizon Glowing Sun / Core
  const coreGrad = ctx.createRadialGradient(width / 2, horizonY, 0, width / 2, horizonY, minDim * 0.28);
  coreGrad.addColorStop(0, 'rgba(56, 189, 248, 0.45)');
  coreGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.2)');
  coreGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = coreGrad;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

export function drawTechFiberOpticWave(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const strands = 12;

  ctx.save();
  for (let s = 0; s < strands; s++) {
    const yBase = height * 0.3 + (s / strands) * (height * 0.4);
    ctx.beginPath();
    for (let x = 0; x <= width; x += 25 * scale) {
      const nx = x / width;
      const y =
        yBase +
        Math.sin(nx * 6 + progress * Math.PI * 2 * 1.5 + s * 0.5) * (70 * scale) +
        Math.cos(nx * 10 - progress * Math.PI * 2 + s) * (30 * scale);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    const color = s % 3 === 0 ? '#38bdf8' : s % 3 === 1 ? '#818cf8' : '#ec4899';
    ctx.strokeStyle = color;
    ctx.lineWidth = (3 + (s % 2) * 2) * scale;
    ctx.shadowColor = color;
    ctx.shadowBlur = 18 * scale * config.glowIntensity;
    ctx.stroke();
  }

  // Fast pulse beads traveling along strands
  for (let b = 0; b < 24; b++) {
    const seed = b * 17.31;
    const s = b % strands;
    const nx = ((progress * 2 + hash(seed)) % 1);
    const x = nx * width;
    const yBase = height * 0.3 + (s / strands) * (height * 0.4);
    const y =
      yBase +
      Math.sin(nx * 6 + progress * Math.PI * 2 * 1.5 + s * 0.5) * (70 * scale) +
      Math.cos(nx * 10 - progress * Math.PI * 2 + s) * (30 * scale);

    ctx.beginPath();
    ctx.arc(x, y, 5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 16 * scale;
    ctx.fill();
  }
  ctx.restore();
}

export function drawTechQuantumCoreCube(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  // 3D Isometric Quantum Cube wireframes
  const cubeCount = 4;
  for (let c = 0; c < cubeCount; c++) {
    const size = (minDim * 0.15) * (c + 1) * 0.6;
    const rot = progress * Math.PI * 2 * (c % 2 === 0 ? 0.4 : -0.4) + c * 0.4;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    ctx.beginPath();
    ctx.rect(-size / 2, -size / 2, size, size);
    ctx.strokeStyle = c % 2 === 0 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(129, 140, 248, 0.45)';
    ctx.lineWidth = 3 * scale;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 14 * scale;
    ctx.stroke();

    // Corner nodes
    const corners = [
      [-size / 2, -size / 2],
      [size / 2, -size / 2],
      [size / 2, size / 2],
      [-size / 2, size / 2],
    ];
    corners.forEach(([ox, oy]) => {
      ctx.beginPath();
      ctx.arc(ox, oy, 4 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#67e8f9';
      ctx.fill();
    });
    ctx.restore();
  }
}

export function drawTechBinarySecurityShield(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  // Matrix binary digital rain streams
  const cols = 36;
  const colW = width / cols;
  ctx.save();
  ctx.font = `${Math.round(15 * scale)}px monospace`;
  ctx.textAlign = 'center';
  for (let c = 0; c < cols; c++) {
    const speed = hash(c * 17) * 0.6 + 0.4;
    const yHead = ((progress * speed * 2 + hash(c * 7)) % 1) * height;
    for (let t = 0; t < 12; t++) {
      const yChar = yHead - t * (18 * scale);
      if (yChar > 0 && yChar < height) {
        const bin = hash(c * 19 + t * 7 + Math.floor(time * 6)) > 0.5 ? '1' : '0';
        ctx.fillStyle = t === 0 ? '#ffffff' : `rgba(56, 189, 248, ${1 - t / 12})`;
        ctx.fillText(bin, c * colW + colW / 2, yChar);
      }
    }
  }

  // Central Hologram Security Shield
  const shieldW = minDim * 0.32;
  const shieldH = minDim * 0.42;
  ctx.beginPath();
  ctx.moveTo(cx, cy - shieldH / 2);
  ctx.lineTo(cx + shieldW / 2, cy - shieldH * 0.25);
  ctx.lineTo(cx + shieldW / 2, cy + shieldH * 0.1);
  ctx.quadraticCurveTo(cx + shieldW * 0.3, cy + shieldH / 2, cx, cy + shieldH / 2);
  ctx.quadraticCurveTo(cx - shieldW * 0.3, cy + shieldH / 2, cx - shieldW / 2, cy + shieldH * 0.1);
  ctx.lineTo(cx - shieldW / 2, cy - shieldH * 0.25);
  ctx.closePath();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
  ctx.lineWidth = 4 * scale;
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 24 * scale;
  ctx.stroke();
  ctx.restore();
}

// ============================================================================
// 3. WEDDING & ROMANCE FAIRY LIGHTS (5 MODELS)
// ============================================================================

export function drawWeddingFairyDustBokeh(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const count = config.particleCount;

  // Soft romantic champagne pink ambient vignetting
  ctx.save();
  const grad = ctx.createRadialGradient(width / 2, height / 2, minDim * 0.1, width / 2, height / 2, minDim * 0.7);
  grad.addColorStop(0, 'rgba(251, 191, 36, 0.08)');
  grad.addColorStop(0.5, 'rgba(244, 114, 182, 0.05)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  for (let i = 0; i < count; i++) {
    const seed = i * 29.83;
    const speed = hash(seed + 1) * 0.3 + 0.15;
    const y = ((hash(seed + 2) - progress * speed + 1) % 1) * height;
    const x = hash(seed) * width + Math.sin(progress * Math.PI * 2 + seed) * (25 * scale);
    const pSize = (hash(seed + 3) * 4.5 + 1.5) * scale;
    const shimmer = Math.sin(progress * Math.PI * 3 + seed) * 0.5 + 0.5;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = hash(seed + 4) > 0.4 ? `rgba(254, 240, 138, ${0.5 + shimmer * 0.4})` : `rgba(251, 207, 232, ${0.5 + shimmer * 0.4})`;
    ctx.shadowColor = '#f472b6';
    ctx.shadowBlur = pSize * 4 * config.glowIntensity;
    ctx.fill();
    ctx.restore();
  }
}

export function drawWeddingFloatingHearts(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const hearts = 32;

  ctx.save();
  for (let h = 0; h < hearts; h++) {
    const seed = h * 19.17;
    const speed = hash(seed + 1) * 0.35 + 0.15;
    const y = ((hash(seed + 2) - progress * speed + 1) % 1) * height;
    const x = hash(seed) * width + Math.sin(progress * Math.PI * 2 + h) * (25 * scale);
    const hSize = (hash(seed + 3) * 22 + 10) * scale;
    const rot = Math.sin(progress * Math.PI + h) * 0.25;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    // Smooth Bezier Heart Shape
    ctx.beginPath();
    ctx.moveTo(0, -hSize * 0.2);
    ctx.bezierCurveTo(-hSize * 0.5, -hSize * 0.7, -hSize, -hSize * 0.2, 0, hSize * 0.7);
    ctx.bezierCurveTo(hSize, -hSize * 0.2, hSize * 0.5, -hSize * 0.7, 0, -hSize * 0.2);

    const grad = ctx.createLinearGradient(0, -hSize * 0.5, 0, hSize * 0.5);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    grad.addColorStop(0.5, 'rgba(251, 113, 133, 0.45)');
    grad.addColorStop(1, 'rgba(254, 240, 138, 0.2)');
    ctx.fillStyle = grad;
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 12 * scale * config.glowIntensity;
    ctx.fill();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 1.2 * scale;
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

export function drawWeddingChampagneSilk(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const layers = 6;

  for (let l = 0; l < layers; l++) {
    const yBase = height * 0.2 + (l / layers) * (height * 0.6);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x += 30 * scale) {
      const nx = x / width;
      const wave = Math.sin(nx * 4 + progress * Math.PI * 2 + l) * (45 * scale);
      ctx.lineTo(x, yBase + wave);
    }
    ctx.lineTo(width, height);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, yBase - 40 * scale, 0, yBase + 100 * scale);
    grad.addColorStop(0, 'rgba(253, 230, 138, 0.12)');
    grad.addColorStop(0.5, 'rgba(244, 114, 182, 0.08)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }
}

export function drawWeddingSparklingRingsOrbit(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const ringRadius = minDim * 0.22;

  ctx.save();
  // Twin interlocking rings
  const ringOffsets = [-ringRadius * 0.45, ringRadius * 0.45];
  ringOffsets.forEach((ox, idx) => {
    ctx.save();
    ctx.translate(cx + ox, cy);
    ctx.rotate(progress * Math.PI * (idx === 0 ? 0.2 : -0.2));
    ctx.beginPath();
    ctx.ellipse(0, 0, ringRadius, ringRadius * 0.65, idx === 0 ? 0.3 : -0.3, 0, Math.PI * 2);
    ctx.strokeStyle = idx === 0 ? '#fef08a' : '#fbcfe8';
    ctx.lineWidth = 5 * scale;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 20 * scale * config.glowIntensity;
    ctx.stroke();

    // Solitaire Diamond Glint on the top of the ring
    const gx = 0;
    const gy = -ringRadius * 0.65;
    ctx.beginPath();
    ctx.arc(gx, gy, 6 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 25 * scale;
    ctx.fill();
    ctx.restore();
  });
  ctx.restore();
}

export function drawWeddingFloralPetalsWind(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const petals = 40;

  ctx.save();
  for (let p = 0; p < petals; p++) {
    const seed = p * 21.43;
    const speed = hash(seed + 1) * 0.4 + 0.3;
    const y = ((hash(seed + 2) + progress * speed) % 1) * height;
    const x = ((hash(seed) + Math.sin(progress * Math.PI * 3 + p) * 0.15 + 1) % 1) * width;
    const pLen = (hash(seed + 3) * 16 + 10) * scale;
    const rot = progress * Math.PI * 2 + p;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.beginPath();
    ctx.ellipse(0, 0, pLen, pLen * 0.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = p % 2 === 0 ? 'rgba(254, 240, 138, 0.75)' : 'rgba(251, 207, 232, 0.75)';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 8 * scale;
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}

// ============================================================================
// 4. RAMADHAN & ISLAMIC LUXURY ARABIAN GALA (5 MODELS)
// ============================================================================

export function drawIslamicCrescentMosque(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height * 0.42;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const moonR = minDim * 0.22;

  ctx.save();
  // 1. Golden 3D Crescent Moon
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(Math.sin(progress * Math.PI * 2) * 0.05);

  ctx.beginPath();
  ctx.arc(0, 0, moonR, 0, Math.PI * 2);
  const mGrad = ctx.createRadialGradient(-moonR * 0.2, -moonR * 0.2, 0, 0, 0, moonR);
  mGrad.addColorStop(0, '#ffffff');
  mGrad.addColorStop(0.3, '#fef08a');
  mGrad.addColorStop(0.7, '#f59e0b');
  mGrad.addColorStop(1, '#b45309');
  ctx.fillStyle = mGrad;
  ctx.shadowColor = '#eab308';
  ctx.shadowBlur = 30 * scale * config.glowIntensity;
  ctx.fill();

  // Subtract inner moon circle for crescent
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(moonR * 0.42, -moonR * 0.15, moonR * 0.88, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 2. 8-Pointed Star of Al-Quds
  ctx.save();
  ctx.translate(cx + moonR * 0.45, cy - moonR * 0.35);
  ctx.rotate(progress * Math.PI * 0.5);
  const starR = moonR * 0.22;
  ctx.beginPath();
  for (let s = 0; s < 8; s++) {
    const a = (s / 8) * Math.PI * 2;
    const r = s % 2 === 0 ? starR : starR * 0.45;
    const sx = Math.cos(a) * r;
    const sy = Math.sin(a) * r;
    if (s === 0) ctx.moveTo(sx, sy);
    else ctx.lineTo(sx, sy);
  }
  ctx.closePath();
  ctx.fillStyle = '#fef08a';
  ctx.shadowColor = '#eab308';
  ctx.shadowBlur = 20 * scale;
  ctx.fill();
  ctx.restore();

  // 3. Mosque Domes & Minarets Silhouette at the bottom
  const mosqueH = minDim * 0.28;
  const mosqueY = height - mosqueH;
  ctx.fillStyle = '#070b10';
  ctx.beginPath();
  ctx.rect(0, mosqueY + mosqueH * 0.4, width, mosqueH * 0.6);
  // Center large dome
  ctx.arc(cx, mosqueY + mosqueH * 0.4, minDim * 0.18, Math.PI, 0);
  // Left minaret
  ctx.rect(cx - minDim * 0.32, mosqueY, minDim * 0.05, mosqueH);
  // Right minaret
  ctx.rect(cx + minDim * 0.27, mosqueY, minDim * 0.05, mosqueH);
  ctx.fill();

  ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();
  ctx.restore();
}

export function drawIslamicArabesqueMandala(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const petals = 12;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(progress * Math.PI * 0.4);

  for (let layer = 1; layer <= 4; layer++) {
    const lRad = (minDim * 0.1) * layer;
    for (let p = 0; p < petals; p++) {
      const angle = (p / petals) * Math.PI * 2;
      ctx.save();
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(lRad * 0.5, lRad * 0.5, 0, lRad);
      ctx.quadraticCurveTo(-lRad * 0.5, lRad * 0.5, 0, 0);
      ctx.strokeStyle = layer % 2 === 0 ? 'rgba(52, 211, 153, 0.45)' : 'rgba(254, 240, 138, 0.45)';
      ctx.lineWidth = 2 * scale;
      ctx.stroke();
      ctx.restore();
    }
  }
  ctx.restore();
}

export function drawIslamicFanousLanterns(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const lanterns = [
    { x: width * 0.25, len: height * 0.35, size: 45 * scale, offset: 0 },
    { x: width * 0.50, len: height * 0.25, size: 60 * scale, offset: 0.5 },
    { x: width * 0.75, len: height * 0.38, size: 45 * scale, offset: 1.0 },
  ];

  ctx.save();
  lanterns.forEach(({ x, len, size, offset }) => {
    const sway = Math.sin(progress * Math.PI * 2 + offset) * 0.08;
    ctx.save();
    ctx.translate(x, 0);
    ctx.rotate(sway);

    // Suspension cord
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, len);
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    // Brass Fanous body
    ctx.translate(0, len);
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(-size * 0.4, 0);
    ctx.lineTo(size * 0.4, 0);
    ctx.lineTo(size * 0.6, size * 0.6);
    ctx.lineTo(0, size * 1.2);
    ctx.lineTo(-size * 0.6, size * 0.6);
    ctx.closePath();
    ctx.fill();

    // Inner glowing candle
    const candleGrad = ctx.createRadialGradient(0, size * 0.5, 0, 0, size * 0.5, size * 0.8);
    candleGrad.addColorStop(0, '#ffffff');
    candleGrad.addColorStop(0.4, '#fef08a');
    candleGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = candleGrad;
    ctx.beginPath();
    ctx.arc(0, size * 0.5, size * 0.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  ctx.restore();
}

export function drawIslamicEmeraldGoldKetupat(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const count = config.particleCount;

  // Flowing woven ribbons across screen
  const ribbons = 6;
  for (let r = 0; r < ribbons; r++) {
    const yBase = height * 0.2 + (r / ribbons) * (height * 0.6);
    ctx.save();
    ctx.beginPath();
    for (let x = 0; x <= width; x += 30 * scale) {
      const nx = x / width;
      const y = yBase + Math.sin(nx * 5 + progress * Math.PI * 2 + r) * (40 * scale);
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = r % 2 === 0 ? '#10b981' : '#f59e0b';
    ctx.lineWidth = 4 * scale;
    ctx.shadowColor = r % 2 === 0 ? '#34d399' : '#fbbf24';
    ctx.shadowBlur = 12 * scale;
    ctx.stroke();
    ctx.restore();
  }

  // Floating golden embers
  for (let i = 0; i < count; i++) {
    const seed = i * 29.11;
    const x = hash(seed) * width;
    const y = ((hash(seed + 1) - progress * 0.4 + 1) % 1) * height;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, (hash(seed + 2) * 2.5 + 1) * scale, 0, Math.PI * 2);
    ctx.fillStyle = hash(seed + 3) > 0.5 ? '#fef08a' : '#6ee7b7';
    ctx.fill();
    ctx.restore();
  }
}

export function drawIslamicSaharaDesertDunes(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  // Sahara rolling golden dunes in the moonlight
  const dunes = 4;
  for (let d = 0; d < dunes; d++) {
    const dY = height * 0.55 + (d / dunes) * (height * 0.4);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x += 40 * scale) {
      const nx = x / width;
      const y = dY + Math.sin(nx * 3 + d * 1.5) * (35 * scale);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, dY - 40 * scale, 0, height);
    grad.addColorStop(0, d % 2 === 0 ? '#b45309' : '#78350f');
    grad.addColorStop(1, '#0c0a09');
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }
}

// ============================================================================
// 5. STAGE CONCERT & DJ VJ LOOPS (5 MODELS)
// ============================================================================

export function drawVjHexagonalTunnel128Bpm(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const rings = 12;

  ctx.save();
  for (let r = 0; r < rings; r++) {
    const p = ((r / rings + progress * 2) % 1);
    const radius = Math.pow(p, 2.5) * (minDim * 0.65);
    const rot = progress * Math.PI + r * 0.2;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    // Hexagonal ring
    ctx.beginPath();
    for (let s = 0; s < 6; s++) {
      const a = (s / 6) * Math.PI * 2;
      const x = Math.cos(a) * radius;
      const y = Math.sin(a) * radius;
      if (s === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.strokeStyle = r % 2 === 0 ? '#06b6d4' : '#ec4899';
    ctx.lineWidth = (2 + p * 6) * scale;
    ctx.shadowColor = r % 2 === 0 ? '#06b6d4' : '#ec4899';
    ctx.shadowBlur = 18 * scale;
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

export function drawVjAudioSpectrumBars(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const bars = 48;
  const radius = minDim * 0.24;

  ctx.save();
  ctx.translate(cx, cy);
  for (let b = 0; b < bars; b++) {
    const angle = (b / bars) * Math.PI * 2;
    const barAmp = Math.abs(Math.sin(b * 0.5 + progress * Math.PI * 8)) * (minDim * 0.16);
    const x1 = Math.cos(angle) * radius;
    const y1 = Math.sin(angle) * radius;
    const x2 = Math.cos(angle) * (radius + barAmp);
    const y2 = Math.sin(angle) * (radius + barAmp);

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = `hsl(${(b / bars) * 360}, 90%, 65%)`;
    ctx.lineWidth = 4 * scale;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10 * scale;
    ctx.stroke();
  }
  ctx.restore();
}

export function drawVjKaleidoscopeFractal(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const sectors = 12;

  ctx.save();
  ctx.translate(cx, cy);
  for (let s = 0; s < sectors; s++) {
    ctx.save();
    ctx.rotate((s / sectors) * Math.PI * 2);
    for (let r = 0; r < 4; r++) {
      const dist = (r + 1) * (minDim * 0.08);
      ctx.beginPath();
      ctx.arc(dist, 0, (12 + r * 4) * scale, 0, Math.PI * 2);
      ctx.strokeStyle = r % 2 === 0 ? '#f43f5e' : '#38bdf8';
      ctx.lineWidth = 2 * scale;
      ctx.stroke();
    }
    ctx.restore();
  }
  ctx.restore();
}

export function drawVjCyberGlitchCubes(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const cubes = 10;
  const distX = width * 0.36;
  const distY = height * 0.28;

  ctx.save();
  for (let c = 0; c < cubes; c++) {
    const angle = (c / cubes) * Math.PI * 2 + progress * Math.PI * 2;
    const x = cx + Math.cos(angle) * distX;
    const y = cy + Math.sin(angle) * distY;
    const sz = 38 * scale;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(progress * Math.PI * 4 + c);
    ctx.beginPath();
    ctx.rect(-sz / 2, -sz / 2, sz, sz);
    ctx.strokeStyle = c % 2 === 0 ? '#38bdf8' : '#ec4899';
    ctx.lineWidth = 3.5 * scale;
    ctx.shadowColor = c % 2 === 0 ? '#06b6d4' : '#f43f5e';
    ctx.shadowBlur = 14 * scale;
    ctx.stroke();

    // Inner wireframe diagonals
    ctx.beginPath();
    ctx.moveTo(-sz / 2, -sz / 2);
    ctx.lineTo(sz / 2, sz / 2);
    ctx.moveTo(sz / 2, -sz / 2);
    ctx.lineTo(-sz / 2, sz / 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1 * scale;
    ctx.stroke();
    ctx.restore();
  }
  ctx.restore();
}

export function drawVjStrobeLaserFan(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height * 0.85;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const lasers = 18;

  ctx.save();
  for (let l = 0; l < lasers; l++) {
    const sweep = Math.sin(progress * 12 + l) * 0.35;
    const baseA = -Math.PI / 2 + ((l - lasers / 2) / lasers) * (Math.PI * 0.8) + sweep;
    const len = Math.max(width, height) * 1.2;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(baseA) * len, cy + Math.sin(baseA) * len);
    ctx.strokeStyle = l % 2 === 0 ? 'rgba(56, 189, 248, 0.85)' : 'rgba(236, 72, 153, 0.85)';
    ctx.lineWidth = 4 * scale;
    ctx.shadowColor = l % 2 === 0 ? '#38bdf8' : '#ec4899';
    ctx.shadowBlur = 24 * scale;
    ctx.stroke();
  }
  ctx.restore();
}

// ============================================================================
// 6. NEWS & BROADCAST HUD (5 MODELS)
// ============================================================================

export function drawBroadcastHoloGlobe(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const globeR = minDim * 0.28;

  ctx.save();
  // Globe outer circle
  ctx.beginPath();
  ctx.arc(cx, cy, globeR, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
  ctx.lineWidth = 3 * scale;
  ctx.shadowColor = '#0284c7';
  ctx.shadowBlur = 20 * scale;
  ctx.stroke();

  // Rotating Latitude and Longitude ellipses
  const lines = 6;
  for (let l = 1; l <= lines; l++) {
    const rx = globeR * Math.cos((l / (lines + 1) - 0.5) * Math.PI);
    const ry = (l / lines) * globeR * 0.8;
    ctx.beginPath();
    ctx.ellipse(cx, cy, globeR, ry, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();
  }

  // Vertical revolving longitude
  for (let m = 0; m < 4; m++) {
    const rot = (progress + m * 0.25) % 1;
    const rx = Math.sin(rot * Math.PI) * globeR;
    ctx.beginPath();
    ctx.ellipse(cx, cy, Math.abs(rx), globeR, 0, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();
  }

  // Telemetry dots
  for (let d = 0; d < 12; d++) {
    const a = (d / 12) * Math.PI * 2 + progress * Math.PI * 2;
    const dx = cx + Math.cos(a) * (globeR * 1.15);
    const dy = cy + Math.sin(a) * (globeR * 1.15);
    ctx.beginPath();
    ctx.arc(dx, dy, 3 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
  }
  ctx.restore();
}

export function drawBroadcastBreakingNewsStudio(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  ctx.save();
  // Curved studio floor red & deep blue sweeps
  const sweepH = height * 0.35;
  const sy = height - sweepH;
  const grad = ctx.createLinearGradient(0, sy, width, height);
  grad.addColorStop(0, 'rgba(220, 38, 38, 0.45)');
  grad.addColorStop(0.5, 'rgba(30, 58, 138, 0.45)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0.8)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.moveTo(0, height);
  ctx.lineTo(0, sy);
  ctx.bezierCurveTo(width * 0.4, sy - 40 * scale, width * 0.7, sy + 30 * scale, width, sy - 20 * scale);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  // News ticker grid lines
  for (let l = 0; l < 5; l++) {
    const ly = sy + l * (20 * scale);
    ctx.beginPath();
    ctx.moveTo(0, ly);
    ctx.lineTo(width, ly);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();
  }
  ctx.restore();
}

export function drawBroadcastRadarSatellite(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const radarR = minDim * 0.32;

  ctx.save();
  // Radar concentric rings
  for (let r = 1; r <= 3; r++) {
    ctx.beginPath();
    ctx.arc(cx, cy, (radarR / 3) * r, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.35)';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();
  }

  // Crosshair
  ctx.beginPath();
  ctx.moveTo(cx - radarR * 1.1, cy);
  ctx.lineTo(cx + radarR * 1.1, cy);
  ctx.moveTo(cx, cy - radarR * 1.1);
  ctx.lineTo(cx, cy + radarR * 1.1);
  ctx.strokeStyle = 'rgba(34, 197, 94, 0.25)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Sweeping Radar Line
  const sweepAngle = progress * Math.PI * 2;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, radarR, sweepAngle - 0.5, sweepAngle);
  ctx.closePath();
  ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + Math.cos(sweepAngle) * radarR, cy + Math.sin(sweepAngle) * radarR);
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 3 * scale;
  ctx.shadowColor = '#22c55e';
  ctx.shadowBlur = 12 * scale;
  ctx.stroke();
  ctx.restore();
}

export function drawBroadcastFinancialTicker(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const bars = 24;
  const barW = (width * 0.8) / bars;
  const startX = width * 0.1;

  ctx.save();
  for (let b = 0; b < bars; b++) {
    const bx = startX + b * barW;
    const seed = b * 13.87;
    const val = Math.sin(b * 0.4 + progress * Math.PI * 2) * 0.4 + 0.5;
    const bh = val * (height * 0.35);
    const by = height * 0.65 - bh;

    // Candlestick bar
    ctx.fillStyle = val > 0.45 ? 'rgba(34, 197, 94, 0.75)' : 'rgba(239, 68, 68, 0.75)';
    ctx.fillRect(bx + 4 * scale, by, barW - 8 * scale, bh);

    // Wick line
    ctx.strokeStyle = val > 0.45 ? '#22c55e' : '#ef4444';
    ctx.lineWidth = 2 * scale;
    ctx.beginPath();
    ctx.moveTo(bx + barW / 2, by - 12 * scale);
    ctx.lineTo(bx + barW / 2, by + bh + 12 * scale);
    ctx.stroke();
  }
  ctx.restore();
}

export function drawBroadcastClockHud(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const clockR = minDim * 0.32;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, clockR, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 4 * scale;
  ctx.stroke();

  // Progress sweep arc
  ctx.beginPath();
  ctx.arc(cx, cy, clockR, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 6 * scale;
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 18 * scale;
  ctx.stroke();

  // 60 tick marks
  for (let t = 0; t < 60; t++) {
    const a = (t / 60) * Math.PI * 2;
    const isMajor = t % 5 === 0;
    const inR = clockR - (isMajor ? 14 : 6) * scale;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * inR, cy + Math.sin(a) * inR);
    ctx.lineTo(cx + Math.cos(a) * clockR, cy + Math.sin(a) * clockR);
    ctx.strokeStyle = isMajor ? '#ffffff' : 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = (isMajor ? 2.5 : 1) * scale;
    ctx.stroke();
  }
  ctx.restore();
}

// ============================================================================
// 7. SPORT, FITNESS & ESPORTS MOTION (5 MODELS)
// ============================================================================

export function drawSportEnergyShockwaveBurst(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const maxDim = Math.hypot(width, height);
  const scale = minDim / 1080;

  // Horizontal kinetic flare beams (anamorphic lens burst on 16:9)
  const flarePulse = Math.sin(progress * Math.PI * 4) * 0.3 + 0.7;
  ctx.save();
  const flareGrad = ctx.createLinearGradient(0, cy, width, cy);
  flareGrad.addColorStop(0, 'rgba(249, 115, 22, 0)');
  flareGrad.addColorStop(0.35, 'rgba(249, 115, 22, 0.25)');
  flareGrad.addColorStop(0.5, `rgba(255, 255, 255, ${0.85 * flarePulse})`);
  flareGrad.addColorStop(0.65, 'rgba(249, 115, 22, 0.25)');
  flareGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
  ctx.fillStyle = flareGrad;
  ctx.fillRect(0, cy - 6 * scale, width, 12 * scale);
  ctx.restore();

  // Expanding shockwave rings (sweeps across full 16:9 widescreen)
  const ringCount = 5;
  for (let r = 0; r < ringCount; r++) {
    const cycle = (progress * 2 + r / ringCount) % 1;
    const ringRadius = cycle * (maxDim * 0.65);
    const alpha = (1 - cycle) * 0.85;

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(249, 115, 22, ${alpha})`;
    ctx.lineWidth = (16 * (1 - cycle) + 2) * scale;
    ctx.shadowColor = '#ea580c';
    ctx.shadowBlur = 32 * scale;
    ctx.stroke();

    // Secondary inner cyan/white sharp ring
    if (cycle < 0.65) {
      ctx.beginPath();
      ctx.arc(cx, cy, ringRadius * 0.94, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
      ctx.lineWidth = 3.5 * scale;
      ctx.stroke();
    }
    ctx.restore();
  }

  // Blazing embers & sparks flying outward to widescreen edges
  const sparkCount = config.particleCount || 400;
  for (let i = 0; i < sparkCount; i++) {
    const seed = i * 19.31;
    const angle = (hash(seed) * Math.PI * 2) + Math.sin(time * 0.5) * 0.2;
    const speed = hash(seed + 1) * 0.8 + 0.3;
    const sparkProg = (progress * 2 * speed + hash(seed + 2)) % 1;
    const dist = sparkProg * (maxDim * 0.7);

    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist + (sparkProg * sparkProg * 80 * scale);
    const pSize = (hash(seed + 3) * 4.5 + 1.5) * (1 - sparkProg * 0.7) * scale;
    const alpha = (1 - sparkProg) * 0.95;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = hash(seed + 4) > 0.4 ? `rgba(251, 146, 60, ${alpha})` : `rgba(254, 240, 138, ${alpha})`;
    ctx.shadowColor = '#f97316';
    ctx.shadowBlur = 12 * scale;
    ctx.fill();
    ctx.restore();
  }
}

export function drawSportSpeedVelocityTunnel(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const maxDim = Math.hypot(width, height);
  const scale = minDim / 1080;
  const streakCount = 140;

  for (let i = 0; i < streakCount; i++) {
    const seed = i * 23.47;
    const angle = hash(seed) * Math.PI * 2;
    const cycle = (progress * 3.5 + hash(seed + 1)) % 1;
    const rStart = Math.pow(cycle, 2.2) * (maxDim * 0.68);
    const rEnd = rStart + (50 + cycle * 220) * scale;

    const x1 = cx + Math.cos(angle) * rStart;
    const y1 = cy + Math.sin(angle) * rStart;
    const x2 = cx + Math.cos(angle) * rEnd;
    const y2 = cy + Math.sin(angle) * rEnd;

    const alpha = Math.min(cycle * 2, 1) * (1 - cycle * 0.25);
    const isCyan = hash(seed + 2) > 0.5;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = isCyan ? `rgba(6, 182, 212, ${alpha})` : `rgba(239, 68, 68, ${alpha})`;
    ctx.lineWidth = (hash(seed + 3) * 3.5 + 1.5) * (cycle + 0.5) * scale;
    ctx.shadowColor = isCyan ? '#06b6d4' : '#ef4444';
    ctx.shadowBlur = 12 * scale;
    ctx.stroke();
    ctx.restore();
  }
}

export function drawSportEsportsGlitchHud(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  // Glitch strobe trigger
  const glitchTrigger = Math.sin(progress * Math.PI * 18) > 0.86;
  const jitterX = glitchTrigger ? (Math.random() - 0.5) * 28 * scale : 0;
  const jitterY = glitchTrigger ? (Math.random() - 0.5) * 14 * scale : 0;

  ctx.save();
  ctx.translate(jitterX, jitterY);

  // 1. WIDESCREEN 16:9 CORNER FRAMING BRACKETS (Framing the actual 16:9 landscape bounds)
  const bDistX = width * 0.44;
  const bDistY = height * 0.40;
  const bracketW = 60 * scale;
  const bracketH = 40 * scale;
  const corners = [
    [-bDistX, -bDistY, 1, 1],
    [bDistX, -bDistY, -1, 1],
    [-bDistX, bDistY, 1, -1],
    [bDistX, bDistY, -1, -1],
  ];

  corners.forEach(([bx, by, dirX, dirY]) => {
    ctx.save();
    ctx.translate(cx + bx, cy + by);
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3 * scale;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 10 * scale;
    ctx.beginPath();
    ctx.moveTo(0, dirY * bracketH);
    ctx.lineTo(0, 0);
    ctx.lineTo(dirX * bracketW, 0);
    ctx.stroke();

    // Corner targeting dot & tick
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(dirX * 8 * scale - 2 * scale, dirY * 8 * scale - 2 * scale, 5 * scale, 5 * scale);
    ctx.restore();
  });

  // 2. TOP TOURNAMENT MATCH BANNER (Widescreen 16:9 Header)
  const topY = height * 0.12;
  ctx.save();
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.45)';
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(width * 0.22, topY);
  ctx.lineTo(width * 0.35, topY);
  ctx.lineTo(width * 0.38, topY - 12 * scale);
  ctx.lineTo(width * 0.62, topY - 12 * scale);
  ctx.lineTo(width * 0.65, topY);
  ctx.lineTo(width * 0.78, topY);
  ctx.stroke();

  // Top header text & status
  ctx.fillStyle = '#22d3ee';
  ctx.font = `900 ${11 * scale}px monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('⚡ TOURNAMENT MATCH INTRO // ROUND 01 ⚡', cx, topY - 2 * scale);

  // Match live pulse dot
  const livePulse = Math.sin(progress * Math.PI * 8) > 0;
  ctx.fillStyle = livePulse ? '#ef4444' : '#7f1d1d';
  ctx.beginPath();
  ctx.arc(cx - 150 * scale, topY - 5 * scale, 4 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = `bold ${9 * scale}px monospace`;
  ctx.textAlign = 'left';
  ctx.fillText('LIVE 60FPS', cx - 140 * scale, topY - 2 * scale);
  ctx.restore();

  // 3. LEFT WING: TEAM 01 (ALPHA SQUAD / CYAN HUD)
  const leftX = width * 0.16;
  ctx.save();
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.7)';
  ctx.lineWidth = 2 * scale;
  ctx.strokeRect(leftX - 70 * scale, cy - 80 * scale, 140 * scale, 160 * scale);

  // Team 01 Header
  ctx.fillStyle = '#22d3ee';
  ctx.font = `bold ${11 * scale}px monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('TEAM 01 [ALPHA]', leftX, cy - 60 * scale);

  // Player Slot Level Bars
  for (let slot = 0; slot < 4; slot++) {
    const slotY = cy - 35 * scale + slot * 26 * scale;
    const barFill = 0.5 + Math.sin(progress * Math.PI * 4 + slot * 1.5) * 0.45;
    ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
    ctx.fillRect(leftX - 55 * scale, slotY, 110 * scale, 12 * scale);
    ctx.fillStyle = '#22d3ee';
    ctx.fillRect(leftX - 55 * scale, slotY, 110 * scale * barFill, 12 * scale);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${8 * scale}px monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(`P${slot + 1} 99%`, leftX - 50 * scale, slotY + 9 * scale);
  }
  ctx.restore();

  // 4. RIGHT WING: TEAM 02 (OMEGA CORPS / MAGENTA-RED HUD)
  const rightX = width * 0.84;
  ctx.save();
  ctx.strokeStyle = 'rgba(244, 63, 94, 0.7)';
  ctx.lineWidth = 2 * scale;
  ctx.strokeRect(rightX - 70 * scale, cy - 80 * scale, 140 * scale, 160 * scale);

  // Team 02 Header
  ctx.fillStyle = '#f43f5e';
  ctx.font = `bold ${11 * scale}px monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('TEAM 02 [OMEGA]', rightX, cy - 60 * scale);

  // Player Slot Level Bars
  for (let slot = 0; slot < 4; slot++) {
    const slotY = cy - 35 * scale + slot * 26 * scale;
    const barFill = 0.5 + Math.sin(progress * Math.PI * 4 + slot * 1.5 + 2) * 0.45;
    ctx.fillStyle = 'rgba(244, 63, 94, 0.2)';
    ctx.fillRect(rightX - 55 * scale, slotY, 110 * scale, 12 * scale);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(rightX - 55 * scale, slotY, 110 * scale * barFill, 12 * scale);
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${8 * scale}px monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(`P${slot + 1} 99%`, rightX - 50 * scale, slotY + 9 * scale);
  }
  ctx.restore();

  // 5. CENTER BATTLE RETICLE: DUAL ROTATING HEXAGONS & "VS" BADGE
  ctx.save();
  ctx.translate(cx, cy);
  const hexR = minDim * 0.26;

  // Outer rotating tech hex ring
  for (let layer = 0; layer < 2; layer++) {
    const r = hexR * (layer === 0 ? 1 : 0.82);
    const color = layer === 0 ? 'rgba(168, 85, 247, 0.85)' : 'rgba(34, 211, 238, 0.9)';
    ctx.beginPath();
    for (let a = 0; a < 6; a++) {
      const rad = (a * Math.PI) / 3 + (layer === 0 ? progress * 0.8 : -progress * 0.8);
      const px = Math.cos(rad) * r;
      const py = Math.sin(rad) * r;
      if (a === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = (layer === 0 ? 3 : 2) * scale;
    ctx.shadowColor = layer === 0 ? '#a855f7' : '#22d3ee';
    ctx.shadowBlur = 18 * scale;
    ctx.stroke();
  }

  // Target Crosshairs (Center Reticle)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(-hexR * 0.6, 0);
  ctx.lineTo(-hexR * 0.2, 0);
  ctx.moveTo(hexR * 0.2, 0);
  ctx.lineTo(hexR * 0.6, 0);
  ctx.moveTo(0, -hexR * 0.6);
  ctx.lineTo(0, -hexR * 0.2);
  ctx.moveTo(0, hexR * 0.2);
  ctx.lineTo(0, hexR * 0.6);
  ctx.stroke();

  // Central Glowing "VS" Match Emblem
  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${28 * scale}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = '#22d3ee';
  ctx.shadowBlur = 14 * scale;
  ctx.fillText('VS', 0, 0);
  ctx.restore();

  // 6. BOTTOM TELEMETRY & FREQUENCY WAVE
  const botY = height * 0.88;
  ctx.save();
  ctx.strokeStyle = 'rgba(34, 211, 238, 0.4)';
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(width * 0.15, botY);
  ctx.lineTo(width * 0.85, botY);
  ctx.stroke();

  // Frequency wave bars in the center bottom
  const waveBars = 32;
  const waveW = 12 * scale;
  const waveStartX = cx - (waveBars * waveW) / 2;
  for (let w = 0; w < waveBars; w++) {
    const h = Math.abs(Math.sin(w * 0.35 + progress * Math.PI * 6)) * (20 * scale) + 4 * scale;
    ctx.fillStyle = w < 16 ? 'rgba(34, 211, 238, 0.8)' : 'rgba(244, 63, 94, 0.8)';
    ctx.fillRect(waveStartX + w * waveW, botY - h - 4 * scale, waveW - 3 * scale, h);
  }

  // Latency & System status text
  ctx.fillStyle = '#a1a1aa';
  ctx.font = `bold ${9 * scale}px monospace`;
  ctx.textAlign = 'center';
  ctx.fillText('LATENCY: 12ms · TICKRATE: 128Hz · RGB GLITCH SYNC BROADCAST OVERLAY', cx, botY + 16 * scale);
  ctx.restore();

  // 7. FULL-WIDESCREEN RGB CHROMATIC GLITCH SCANLINES & SLICES
  if (glitchTrigger) {
    const sliceCount = 10;
    for (let s = 0; s < sliceCount; s++) {
      const sy = ((hash(s * 7.1 + time) - 0.5) * 2) * (height * 0.45);
      const sh = (hash(s * 9.3) * 20 + 8) * scale;
      const sw = width * 0.95;
      const offsetRed = (Math.random() - 0.5) * 50 * scale;

      ctx.save();
      ctx.fillStyle = 'rgba(239, 68, 68, 0.45)';
      ctx.fillRect(cx - sw / 2 + offsetRed, cy + sy, sw, sh);
      ctx.fillStyle = 'rgba(6, 182, 212, 0.45)';
      ctx.fillRect(cx - sw / 2 - offsetRed * 0.6, cy + sy, sw, sh);
      ctx.restore();
    }
  }

  ctx.restore();
}

export function drawSportStadiumFloodlightDust(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  // 4 Top Volumetric Light Beams (Stadium Floodlights)
  const beamCount = 4;
  for (let b = 0; b < beamCount; b++) {
    const originX = width * (0.15 + (b / (beamCount - 1)) * 0.7);
    const originY = -50 * scale;
    const targetX = width * (0.35 + Math.sin(progress * Math.PI * 2 + b * 1.2) * 0.25);
    const targetY = height + 100 * scale;
    const beamSpread = (180 + Math.sin(progress * Math.PI * 2 + b) * 40) * scale;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(originX - 20 * scale, originY);
    ctx.lineTo(originX + 20 * scale, originY);
    ctx.lineTo(targetX + beamSpread, targetY);
    ctx.lineTo(targetX - beamSpread, targetY);
    ctx.closePath();

    const grad = ctx.createLinearGradient(originX, originY, targetX, targetY);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    grad.addColorStop(0.3, 'rgba(219, 234, 254, 0.18)');
    grad.addColorStop(1, 'rgba(30, 58, 138, 0)');

    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();
  }

  // Floating arena dust particles drifting through the light rays
  const dustCount = config.particleCount || 350;
  for (let i = 0; i < dustCount; i++) {
    const seed = i * 17.81;
    const x = ((hash(seed) + Math.sin(time * 0.4 + seed) * 0.05 + 1) % 1) * width;
    const y = ((hash(seed + 1) - progress * 0.2 + 1) % 1) * height;
    const pSize = (hash(seed + 2) * 3.5 + 1) * scale;
    const alpha = (Math.sin(progress * Math.PI * 2 + seed) * 0.3 + 0.6);

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 8 * scale;
    ctx.fill();
    ctx.restore();
  }
}

export function drawSportChampionshipTrophyHalos(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height * 0.48;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  // Interlocking 3D Golden Halo Rings (Trophy Glory)
  const ringCount = 3;
  for (let r = 0; r < ringCount; r++) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((r * Math.PI) / 3 + progress * Math.PI * 2 * (r % 2 === 0 ? 0.3 : -0.3));
    ctx.scale(1, 0.38);

    ctx.beginPath();
    ctx.arc(0, 0, minDim * (0.3 + r * 0.08), 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(234, 179, 8, ${0.7 - r * 0.15})`;
    ctx.lineWidth = (6 - r * 1) * scale;
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 24 * scale;
    ctx.stroke();
    ctx.restore();
  }

  // Championship Golden Stardust and Sparkle Rays
  const starCount = 8;
  for (let s = 0; s < starCount; s++) {
    const angle = (s * Math.PI * 2) / starCount + progress * Math.PI * 0.5;
    const len = (minDim * 0.45) * (0.8 + Math.sin(progress * Math.PI * 4 + s) * 0.2);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(angle) * len, cy + Math.sin(angle) * len);
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.4)';
    ctx.lineWidth = 2 * scale;
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 14 * scale;
    ctx.stroke();
    ctx.restore();
  }

  // Sparkling golden victory particles
  for (let i = 0; i < (config.particleCount || 300); i++) {
    const seed = i * 29.17;
    const rad = ((hash(seed) + progress * 0.3) % 1) * (minDim * 0.6);
    const a = hash(seed + 1) * Math.PI * 2;
    const x = cx + Math.cos(a) * rad;
    const y = cy + Math.sin(a) * rad * 0.6;
    const pSize = (hash(seed + 2) * 3.5 + 1.2) * scale;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 240, 138, ${0.5 + hash(seed + 3) * 0.5})`;
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 10 * scale;
    ctx.fill();
    ctx.restore();
  }
}

// ============================================================================
// 8. COMMERCIAL SALE, PROMO & BLACK FRIDAY (5 MODELS)
// ============================================================================

export function drawSaleGoldenConfettiShimmer(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const count = config.particleCount || 380;

  for (let i = 0; i < count; i++) {
    const seed = i * 31.41;
    const x = ((hash(seed) + Math.sin(progress * Math.PI * 2 + seed) * 0.08 + 1) % 1) * width;
    const y = ((hash(seed + 1) + progress * 0.6) % 1) * (height + 100 * scale) - 50 * scale;

    const rot = progress * Math.PI * 6 + hash(seed + 2) * Math.PI * 2;
    const w = (hash(seed + 3) * 14 + 8) * scale;
    const h = (hash(seed + 4) * 8 + 4) * scale;
    const isGold = hash(seed + 5) > 0.3;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.scale(Math.cos(rot * 1.5), 1); // 3D tumbling effect

    ctx.fillStyle = isGold
      ? `rgba(250, 204, 21, ${0.75 + Math.sin(rot) * 0.25})`
      : `rgba(244, 63, 94, ${0.75 + Math.sin(rot) * 0.25})`;
    ctx.shadowColor = isGold ? '#eab308' : '#f43f5e';
    ctx.shadowBlur = 8 * scale;
    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.restore();
  }
}

export function drawSaleElectricNeonFlash(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  // Pulsing neon sale rectangular border
  const margin = minDim * 0.08;
  const rectW = width - margin * 2;
  const rectH = height - margin * 2;

  // Strobe intensity
  const strobe = 0.7 + Math.sin(progress * Math.PI * 12) * 0.3;

  ctx.save();
  ctx.strokeStyle = `rgba(239, 68, 68, ${strobe})`;
  ctx.lineWidth = 6 * scale;
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 28 * scale;
  ctx.strokeRect(margin, margin, rectW, rectH);

  // Inner yellow warning dash line
  ctx.beginPath();
  ctx.setLineDash([20 * scale, 14 * scale]);
  ctx.lineDashOffset = -progress * 300 * scale;
  ctx.strokeStyle = `rgba(250, 204, 21, ${strobe * 0.9})`;
  ctx.lineWidth = 3 * scale;
  ctx.shadowColor = '#eab308';
  ctx.shadowBlur = 12 * scale;
  ctx.strokeRect(margin + 16 * scale, margin + 16 * scale, rectW - 32 * scale, rectH - 32 * scale);
  ctx.restore();

  // Corner Sale Flash Badges
  const cornerR = 40 * scale;
  const corners = [
    [margin, margin],
    [width - margin, margin],
    [margin, height - margin],
    [width - margin, height - margin],
  ];

  corners.forEach(([bx, by]) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(bx, by, cornerR, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(239, 68, 68, ${strobe * 0.3})`;
    ctx.fill();
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();
    ctx.restore();
  });
}

export function drawSaleLuxuryBadgeReveal(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  // Rotating octagonal / 16-point gold rosette badge
  const points = 16;
  const outerR = minDim * 0.32;
  const innerR = minDim * 0.28;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(progress * Math.PI * 0.4);

  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i * Math.PI) / points;
    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.85)';
  ctx.lineWidth = 4 * scale;
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 24 * scale;
  ctx.stroke();

  // Inner concentric circular gold beads
  ctx.beginPath();
  ctx.arc(0, 0, innerR * 0.82, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.6)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  const beadCount = 32;
  for (let b = 0; b < beadCount; b++) {
    const ba = (b * Math.PI * 2) / beadCount;
    const bx = Math.cos(ba) * (innerR * 0.72);
    const by = Math.sin(ba) * (innerR * 0.72);
    ctx.beginPath();
    ctx.arc(bx, by, 3 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#fde047';
    ctx.fill();
  }
  ctx.restore();
}

export function drawSaleRedRibbonWaves(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const ribbons = 6;

  for (let r = 0; r < ribbons; r++) {
    const yBase = height * 0.25 + (r / ribbons) * (height * 0.55);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, height);

    for (let x = 0; x <= width; x += 30 * scale) {
      const nx = x / width;
      const wave =
        Math.sin(nx * 3.5 + progress * Math.PI * 2 + r * 0.9) * (65 * scale) +
        Math.cos(nx * 6 - progress * Math.PI * 2 * 0.6 + r) * (30 * scale);
      ctx.lineTo(x, yBase + wave);
    }
    ctx.lineTo(width, height);
    ctx.closePath();

    const isGoldTrim = r % 2 === 1;
    const grad = ctx.createLinearGradient(0, yBase - 80 * scale, 0, yBase + 120 * scale);
    if (isGoldTrim) {
      grad.addColorStop(0, 'rgba(234, 179, 8, 0.18)');
      grad.addColorStop(0.5, 'rgba(180, 83, 9, 0.1)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    } else {
      grad.addColorStop(0, 'rgba(239, 68, 68, 0.22)');
      grad.addColorStop(0.5, 'rgba(153, 27, 27, 0.12)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    }

    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = isGoldTrim
      ? `rgba(250, 204, 21, ${0.4 + Math.sin(progress * Math.PI * 2 + r) * 0.2})`
      : `rgba(248, 113, 113, ${0.4 + Math.sin(progress * Math.PI * 2 + r) * 0.2})`;
    ctx.lineWidth = (3 + r * 0.5) * scale;
    ctx.stroke();
    ctx.restore();
  }
}

export function drawSalePriceBurstStarShower(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const maxDim = Math.hypot(width, height);
  const scale = minDim / 1080;

  // Exploding golden stars bursting outward to widescreen corners
  const starCount = 65;
  for (let s = 0; s < starCount; s++) {
    const seed = s * 37.19;
    const angle = hash(seed) * Math.PI * 2;
    const cycle = (progress * 2.5 + hash(seed + 1)) % 1;
    const dist = Math.pow(cycle, 0.8) * (maxDim * 0.62);

    const sx = cx + Math.cos(angle) * dist;
    const sy = cy + Math.sin(angle) * dist + (cycle * cycle * 40 * scale);
    const starR = (hash(seed + 2) * 14 + 7) * (1 - cycle * 0.4) * scale;
    const rot = cycle * Math.PI * 4 + hash(seed + 3);

    // 5-point star
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(rot);
    ctx.beginPath();
    for (let p = 0; p < 10; p++) {
      const a = (p * Math.PI) / 5;
      const r = p % 2 === 0 ? starR : starR * 0.42;
      const px = Math.cos(a) * r;
      const py = Math.sin(a) * r;
      if (p === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(250, 204, 21, ${(1 - cycle) * 0.9})`;
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 14 * scale;
    ctx.fill();
    ctx.restore();
  }
}

