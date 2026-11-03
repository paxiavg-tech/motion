import { MotionConfig } from '../types/motion';

// Deterministic pseudo-random hash for stable floating particles
function hash(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Palette helper
function getPaletteColors(palette: string) {
  switch (palette) {
    case 'cyber_neon':
      return { primary: '#06b6d4', secondary: '#ec4899', accent: '#a855f7', glow: 'rgba(6, 182, 212, 0.7)' };
    case 'gold_luxury':
      return { primary: '#facc15', secondary: '#fbbf24', accent: '#f59e0b', glow: 'rgba(250, 204, 21, 0.7)' };
    case 'emerald_ruby':
      return { primary: '#10b981', secondary: '#ef4444', accent: '#059669', glow: 'rgba(16, 185, 129, 0.7)' };
    case 'ice_aurora':
      return { primary: '#38bdf8', secondary: '#818cf8', accent: '#c084fc', glow: 'rgba(56, 189, 248, 0.7)' };
    default:
      return { primary: '#ffffff', secondary: '#38bdf8', accent: '#fbbf24', glow: 'rgba(255, 255, 255, 0.7)' };
  }
}

// ============================================================================
// 1. KAWAII BOUNCING JELLY SLIME MASCOT
// Soft-body squash-and-stretch jelly droplet, glossy bubble caustics,
// sparkling anime eyes with blinking cycle, rosy cheeks, and golden star sparks.
// ============================================================================
export function drawBouncingKawaiiSlime(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const groundY = height * 0.72;
  const minDim = Math.min(width, height);
  const scale = minDim / 950;
  const speed = config.particleSpeed || 1.0;
  const colors = getPaletteColors(config.colorPalette);

  // Harmonic Bounce Physics
  const bounceTime = time * 3.8 * speed;
  const rawBounce = Math.abs(Math.sin(bounceTime));
  const jumpHeight = 220 * scale;
  const slimeY = groundY - rawBounce * jumpHeight;

  // Elastic Squash & Stretch factors
  let stretchX = 1.0;
  let stretchY = 1.0;
  if (rawBounce < 0.18) {
    const squash = (1 - rawBounce / 0.18) * 0.42;
    stretchX = 1 + squash;
    stretchY = 1 - squash * 0.65;
  } else {
    const stretch = (rawBounce - 0.18) * 0.2;
    stretchX = 1 - stretch;
    stretchY = 1 + stretch;
  }

  // Dynamic ground drop shadow
  ctx.save();
  const shadowAlpha = 0.55 * (1 - (rawBounce * jumpHeight) / (jumpHeight * 1.4));
  const shadowR = 105 * scale * (1 - rawBounce * 0.35);
  ctx.beginPath();
  ctx.ellipse(cx, groundY + 10 * scale, Math.max(10, shadowR), Math.max(4, shadowR * 0.26), 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
  ctx.fill();
  ctx.restore();

  // Floating Star Sparkles
  const sparkCount = 10;
  for (let s = 0; s < sparkCount; s++) {
    const seed = s * 23.45;
    const cycle = (time * 1.5 * speed + hash(seed)) % 1;
    const sx = cx + (hash(seed + 1) - 0.5) * 360 * scale;
    const sy = groundY - 60 * scale - cycle * 300 * scale;
    const sSize = (7 + hash(seed + 2) * 8) * (1 - cycle) * scale;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(cycle * Math.PI * 2);
    ctx.beginPath();
    for (let p = 0; p < 8; p++) {
      const a = (p * Math.PI) / 4;
      const r = p % 2 === 0 ? sSize : sSize * 0.4;
      if (p === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(251, 191, 36, ${(1 - cycle) * 0.85})`;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 8 * scale;
    ctx.fill();
    ctx.restore();
  }

  // Draw Jelly Slime Body with Pure Smooth Bézier Teardrop Curves
  ctx.save();
  ctx.translate(cx, slimeY);
  ctx.scale(stretchX, stretchY);

  const baseW = 105 * scale;
  const baseH = 92 * scale;

  ctx.beginPath();
  ctx.moveTo(0, -baseH);
  ctx.bezierCurveTo(baseW * 0.8, -baseH * 0.9, baseW * 1.15, baseH * 0.3, baseW * 0.95, baseH);
  ctx.quadraticCurveTo(0, baseH + 12 * scale, -baseW * 0.95, baseH);
  ctx.bezierCurveTo(-baseW * 1.15, baseH * 0.3, -baseW * 0.8, -baseH * 0.9, 0, -baseH);
  ctx.closePath();

  // Translucent Jelly Radial Gradient
  const grad = ctx.createRadialGradient(0, -baseH * 0.35, baseW * 0.1, 0, 0, baseW * 1.25);
  grad.addColorStop(0, '#67e8f9');
  grad.addColorStop(0.65, '#06b6d4');
  grad.addColorStop(1, '#0891b2');
  ctx.fillStyle = grad;
  ctx.fill();

  // Glowing white rim
  ctx.lineWidth = 6 * scale;
  ctx.strokeStyle = '#ffffff';
  ctx.shadowColor = colors.primary;
  ctx.shadowBlur = 16 * scale;
  ctx.stroke();

  // Glossy Caustic Highlight Bubble
  ctx.beginPath();
  ctx.ellipse(-32 * scale, -baseH * 0.5, 32 * scale, 16 * scale, -0.35, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.fill();

  // Cute Little Sprout on Top
  const sproutWave = Math.sin(bounceTime * 1.5) * 0.25;
  ctx.save();
  ctx.translate(0, -baseH);
  ctx.rotate(sproutWave);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.quadraticCurveTo(6 * scale, -22 * scale, 0, -38 * scale);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 5 * scale;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, -42 * scale, 10 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#facc15';
  ctx.shadowColor = '#facc15';
  ctx.shadowBlur = 8 * scale;
  ctx.fill();
  ctx.restore();

  // Anime Eyes & Face
  const isBlink = (time * 0.35) % 1 > 0.93;
  const eyeX = 42 * scale;
  const eyeY = 8 * scale;

  if (isBlink) {
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(side * eyeX, eyeY, 14 * scale, Math.PI * 1.15, Math.PI * 1.85);
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 4.5 * scale;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  } else {
    for (const side of [-1, 1]) {
      const ex = side * eyeX;
      ctx.beginPath();
      ctx.ellipse(ex, eyeY, 18 * scale, 24 * scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#09090b';
      ctx.fill();

      // Big shine
      ctx.beginPath();
      ctx.arc(ex - 5 * scale, eyeY - 6 * scale, 6.5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
  }

  // Rosy Cheek Blush
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(side * (eyeX + 26 * scale), eyeY + 12 * scale, 14 * scale, 8 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244, 63, 94, 0.65)';
    ctx.fill();
  }

  // Cute :3 Cat Smile
  ctx.beginPath();
  ctx.arc(-5 * scale, eyeY + 14 * scale, 6 * scale, 0, Math.PI);
  ctx.arc(5 * scale, eyeY + 14 * scale, 6 * scale, 0, Math.PI);
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 3.5 * scale;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();
}

// ============================================================================
// 2. MISCHIEVOUS FLOATING PHANTOM GHOST
// Ethereal levitation, silky 5-wave undulating hem, playful winking & "boo" face,
// floating mitten hands, and stardust wisps.
// ============================================================================
export function drawFloatingMischiefGhost(
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
  const scale = minDim / 950;
  const speed = config.particleSpeed || 1.0;
  const colors = getPaletteColors(config.colorPalette);

  // Buoyant Float
  const floatTime = time * 2.4 * speed;
  const floatY = cy + Math.sin(floatTime) * 26 * scale;
  const floatTilt = Math.sin(floatTime * 0.7) * 0.08;

  // Stardust Wisps
  const wispCount = 14;
  for (let w = 0; w < wispCount; w++) {
    const seed = w * 33.7;
    const wCycle = (time * 0.8 * speed + hash(seed)) % 1;
    const wAngle = wCycle * Math.PI * 2;
    const wDist = (110 + hash(seed + 1) * 70) * scale;
    const wx = cx + Math.cos(wAngle) * wDist;
    const wy = floatY + Math.sin(wAngle) * (wDist * 0.5) + (hash(seed + 2) - 0.5) * 35 * scale;
    const wSize = (4 + hash(seed + 3) * 6) * (1 - Math.abs(wCycle - 0.5) * 1.2) * scale;

    ctx.save();
    ctx.beginPath();
    ctx.arc(wx, wy, Math.max(1, wSize), 0, Math.PI * 2);
    ctx.fillStyle = colors.primary;
    ctx.shadowColor = colors.primary;
    ctx.shadowBlur = 10 * scale;
    ctx.fill();
    ctx.restore();
  }

  // Soft Drop Shadow
  ctx.save();
  const shadowDist = cy + 220 * scale - floatY;
  const shadowScale = Math.max(0.3, 1 - shadowDist / (300 * scale));
  ctx.beginPath();
  ctx.ellipse(cx, cy + 220 * scale, 115 * scale * shadowScale, 28 * scale * shadowScale, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(0, 0, 0, ${0.45 * shadowScale})`;
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(cx, floatY);
  ctx.rotate(floatTilt);

  // Smooth Ghost Sheet Body with 5 Harmonic Bottom Waves
  const bodyW = 105 * scale;
  const bodyH = 135 * scale;

  ctx.beginPath();
  ctx.arc(0, -55 * scale, bodyW, Math.PI, 0, false);
  ctx.lineTo(bodyW, bodyH);

  // 5 Undulating Silk Waves along Bottom
  const hemWaves = 5;
  const hemStep = (bodyW * 2) / hemWaves;
  for (let h = 0; h < hemWaves; h++) {
    const startX = bodyW - h * hemStep;
    const endX = startX - hemStep;
    const wavePhase = floatTime * 2.2 + h * 1.2;
    const waveY = bodyH + Math.sin(wavePhase) * 16 * scale;
    const cpX = (startX + endX) / 2;
    const cpY = waveY + 20 * scale;
    ctx.quadraticCurveTo(cpX, cpY, endX, waveY);
  }
  ctx.lineTo(-bodyW, -55 * scale);
  ctx.closePath();

  // Ethereal Ghost Gradient
  const ghostGrad = ctx.createLinearGradient(0, -150 * scale, 0, bodyH + 20 * scale);
  ghostGrad.addColorStop(0, '#ffffff');
  ghostGrad.addColorStop(0.7, '#f4f4f5');
  ghostGrad.addColorStop(1, 'rgba(228, 228, 231, 0.7)');
  ctx.fillStyle = ghostGrad;
  ctx.fill();

  ctx.lineWidth = 5.5 * scale;
  ctx.strokeStyle = '#ffffff';
  ctx.shadowColor = colors.glow;
  ctx.shadowBlur = 16 * scale;
  ctx.stroke();

  // Facial Expression: Playful Wink
  const faceCycle = (time * 0.4) % 1;
  const isWink = faceCycle > 0.65 && faceCycle < 0.85;

  // Left Eye
  ctx.beginPath();
  ctx.ellipse(-36 * scale, -42 * scale, 16 * scale, 22 * scale, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#09090b';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-32 * scale, -48 * scale, 5.5 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Right Eye
  if (isWink) {
    ctx.beginPath();
    ctx.arc(36 * scale, -40 * scale, 16 * scale, Math.PI * 1.15, Math.PI * 1.85);
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 5 * scale;
    ctx.lineCap = 'round';
    ctx.stroke();
  } else {
    ctx.beginPath();
    ctx.ellipse(36 * scale, -42 * scale, 16 * scale, 22 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#09090b';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(40 * scale, -48 * scale, 5.5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }

  // Rosy Cheeks
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(side * 58 * scale, -25 * scale, 13 * scale, 8 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244, 63, 94, 0.55)';
    ctx.fill();
  }

  // Cheeky Smirk
  ctx.beginPath();
  ctx.arc(-5 * scale, -12 * scale, 7 * scale, 0.1, Math.PI * 0.9);
  ctx.arc(5 * scale, -12 * scale, 7 * scale, 0.1, Math.PI * 0.9);
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 3.5 * scale;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Floating Mitten Hands
  const handFloatL = Math.sin(floatTime * 2) * 10 * scale;
  const handFloatR = Math.sin(floatTime * 2 + Math.PI) * 10 * scale;

  ctx.save();
  ctx.translate(-120 * scale, -22 * scale + handFloatL);
  ctx.rotate(-0.35 + Math.sin(floatTime * 1.5) * 0.2);
  drawGhostHand(ctx, scale);
  ctx.restore();

  ctx.save();
  ctx.translate(120 * scale, -26 * scale + handFloatR);
  ctx.rotate(0.35 + Math.sin(floatTime * 3) * 0.3);
  drawGhostHand(ctx, scale);
  ctx.restore();

  ctx.restore();
}

// Helper: Ghost hand
function drawGhostHand(ctx: CanvasRenderingContext2D, scale: number) {
  ctx.beginPath();
  ctx.ellipse(0, 0, 22 * scale, 15 * scale, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 4 * scale;
  ctx.strokeStyle = '#e4e4e7';
  ctx.stroke();

  // Thumb
  ctx.beginPath();
  ctx.ellipse(0, -9 * scale, 8 * scale, 6 * scale, 0.4, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.stroke();
}

// ============================================================================
// 3. PUFFY DREAM CLOUD & NIMBUS SPIRIT MASCOT
// Soft buoyant cloud creature that gently bobs, breathes with elastic squish,
// has sleepy/happy blushing face, floating pastel raindrops & rainbow star sparkles.
// ============================================================================
export function drawPuffyDreamCloud(
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
  const scale = minDim / 950;
  const speed = config.particleSpeed || 1.0;
  const colors = getPaletteColors(config.colorPalette);

  // Buoyant Gentle Floating & Breathing
  const floatTime = time * 2.2 * speed;
  const floatY = cy + Math.sin(floatTime) * 22 * scale;
  const breathSquish = 1 + Math.sin(floatTime * 1.8) * 0.04;

  // Ambient Floating Pastel Raindrops (Drifting softly downwards)
  const dropCount = 12;
  for (let d = 0; d < dropCount; d++) {
    const seed = d * 27.83;
    const cycle = (time * 1.2 * speed + hash(seed)) % 1;
    const dx = cx + (hash(seed + 1) - 0.5) * 320 * scale;
    const startY = floatY + 90 * scale;
    const dy = startY + cycle * 220 * scale;
    const dSize = (5 + hash(seed + 2) * 5) * (1 - cycle * 0.3) * scale;

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(dx, dy, dSize * 0.6, dSize, 0, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(125, 211, 252, ${(1 - cycle) * 0.75})`;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 6 * scale;
    ctx.fill();
    ctx.restore();
  }

  // Floating Star Sparkles
  const sparkCount = 8;
  for (let s = 0; s < sparkCount; s++) {
    const seed = s * 41.5;
    const cycle = (time * 0.9 * speed + hash(seed)) % 1;
    const sx = cx + (hash(seed + 1) - 0.5) * 380 * scale;
    const sy = floatY - 140 * scale + (hash(seed + 2) - 0.5) * 160 * scale;
    const sSize = (6 + hash(seed + 3) * 6) * Math.sin(cycle * Math.PI) * scale;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(cycle * Math.PI * 2);
    ctx.beginPath();
    for (let p = 0; p < 4; p++) {
      const a = (p * Math.PI) / 2;
      const r = sSize;
      if (p === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fillStyle = `rgba(253, 224, 71, ${Math.sin(cycle * Math.PI) * 0.9})`;
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 8 * scale;
    ctx.fill();
    ctx.restore();
  }

  // Soft Cloud Drop Shadow
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(cx, cy + 210 * scale, 140 * scale, 30 * scale, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.fill();
  ctx.restore();

  // Draw Puffy Cloud Body using Interlocking Soft Lobes
  ctx.save();
  ctx.translate(cx, floatY);
  ctx.scale(1 / breathSquish, breathSquish);

  // Cloud multi-lobe path
  ctx.beginPath();
  // Bottom base line
  ctx.moveTo(-110 * scale, 55 * scale);
  // Left bottom cheek puff
  ctx.arc(-110 * scale, 10 * scale, 55 * scale, Math.PI * 0.6, Math.PI * 1.5, false);
  // Left upper dome
  ctx.arc(-55 * scale, -50 * scale, 65 * scale, Math.PI * 1.05, Math.PI * 1.75, false);
  // Center main high dome
  ctx.arc(15 * scale, -70 * scale, 75 * scale, Math.PI * 1.25, Math.PI * 1.95, false);
  // Right upper dome
  ctx.arc(95 * scale, -30 * scale, 60 * scale, Math.PI * 1.5, Math.PI * 2.2, false);
  // Right bottom cheek puff
  ctx.arc(120 * scale, 15 * scale, 50 * scale, Math.PI * 1.8, Math.PI * 0.5, false);
  // Flat puffy bottom connecting back to start
  ctx.quadraticCurveTo(0, 75 * scale, -110 * scale, 55 * scale);
  ctx.closePath();

  // Cloud gradient (Puffy pure white to soft dreamy lavender-cyan)
  const cloudGrad = ctx.createLinearGradient(0, -145 * scale, 0, 75 * scale);
  cloudGrad.addColorStop(0, '#ffffff');
  cloudGrad.addColorStop(0.65, '#f8fafc');
  cloudGrad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = cloudGrad;
  ctx.fill();

  // Luminous white outline
  ctx.lineWidth = 6 * scale;
  ctx.strokeStyle = '#ffffff';
  ctx.shadowColor = colors.glow;
  ctx.shadowBlur = 18 * scale;
  ctx.stroke();

  // Facial Expression: Cute Smiling Closed Anime Eyes (^ ^)
  const eyeSpan = 40 * scale;
  const eyeY = 0;

  for (const side of [-1, 1]) {
    const ex = side * eyeSpan;
    ctx.beginPath();
    ctx.arc(ex, eyeY, 15 * scale, Math.PI * 1.15, Math.PI * 1.85);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 4.5 * scale;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // Peach Cheeks
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(side * (eyeSpan + 24 * scale), eyeY + 12 * scale, 14 * scale, 8 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(251, 113, 133, 0.65)';
    ctx.fill();
  }

  // Cute Little W Cat Mouth :3
  ctx.beginPath();
  ctx.arc(-5 * scale, eyeY + 12 * scale, 6 * scale, 0, Math.PI);
  ctx.arc(5 * scale, eyeY + 12 * scale, 6 * scale, 0, Math.PI);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 3.5 * scale;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();
}

// ============================================================================
// 4. BIOLUMINESCENT DEEP-SEA JELLYFISH MASCOT (AURELIA)
// Translucent glowing umbrella dome pulsing rhythmically with soothing expansion/
// contraction, trailing silky ribbon tentacles waving in ocean currents, ambient floating bubbles.
// ============================================================================
export function drawBioluminescentJellyfish(
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
  const scale = minDim / 950;
  const speed = config.particleSpeed || 1.0;
  const colors = getPaletteColors(config.colorPalette);

  // Rhythmic Swimming Pulse Physics
  const pulseFreq = time * 3.2 * speed;
  const pulseRaw = Math.sin(pulseFreq);
  // Bell contracts to thrust, then expands and glides gently
  const isThrust = pulseRaw > 0;
  const pulseProgress = (pulseRaw + 1) * 0.5;

  const thrustUp = Math.pow(Math.max(0, pulseRaw), 2) * 35 * scale;
  const jellyY = cy - thrustUp + Math.sin(time * 1.2 * speed) * 15 * scale;

  // Bell deformation: Narrows & elongates during thrust, flares wide when relaxing
  const bellStretchX = 1 - pulseRaw * 0.18;
  const bellStretchY = 1 + pulseRaw * 0.22;

  // Ambient Rising Bioluminescent Air Bubbles
  const bubbleCount = 14;
  for (let b = 0; b < bubbleCount; b++) {
    const seed = b * 37.19;
    const cycle = (time * 0.8 * speed + hash(seed)) % 1;
    const bx = cx + (hash(seed + 1) - 0.5) * 340 * scale;
    const by = height * 0.85 - cycle * (height * 0.7);
    const bSize = (4 + hash(seed + 2) * 6) * scale;

    ctx.save();
    ctx.beginPath();
    ctx.arc(bx, by, bSize, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(103, 232, 249, ${(1 - cycle) * 0.65})`;
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();

    // Tiny glint
    ctx.beginPath();
    ctx.arc(bx - bSize * 0.3, by - bSize * 0.3, bSize * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${(1 - cycle) * 0.7})`;
    ctx.fill();
    ctx.restore();
  }

  // 1. Trailing Silky Ribbon Tentacles (6 fluid trailing streamers)
  ctx.save();
  const tentacleCount = 6;
  const tentacleSpan = 110 * scale * bellStretchX;
  const tentacleLength = 220 * scale;

  for (let t = 0; t < tentacleCount; t++) {
    const tFrac = t / (tentacleCount - 1);
    const tx = cx - tentacleSpan * 0.5 + tFrac * tentacleSpan;
    const startY = jellyY + 45 * scale * bellStretchY;

    ctx.beginPath();
    ctx.moveTo(tx, startY);

    const nodes = 10;
    const nodeStep = tentacleLength / nodes;
    let currX = tx;
    let currY = startY;

    for (let n = 1; n <= nodes; n++) {
      const wavePhase = pulseFreq * 0.8 - n * 0.5 + t * 0.6;
      const waveAmp = (6 + n * 2.8) * scale;
      currX += Math.sin(wavePhase) * waveAmp;
      currY += nodeStep;
      ctx.lineTo(currX, currY);
    }

    // Outer Glow Ribbon
    ctx.strokeStyle = t % 2 === 0 ? 'rgba(56, 189, 248, 0.45)' : 'rgba(192, 132, 252, 0.45)';
    ctx.lineWidth = (4 - tFrac * 1.5) * scale;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Bright core line
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8 * scale;
    ctx.stroke();
  }
  ctx.restore();

  // 2. Main Jellyfish Umbrella Dome (Smooth Translucent Bézier Bell)
  ctx.save();
  ctx.translate(cx, jellyY);
  ctx.scale(bellStretchX, bellStretchY);

  const domeW = 115 * scale;
  const domeH = 80 * scale;

  ctx.beginPath();
  // Dome Top Peak
  ctx.moveTo(0, -domeH);
  // Right Umbrella Curve
  ctx.bezierCurveTo(domeW * 0.85, -domeH * 0.85, domeW * 1.15, domeH * 0.1, domeW, domeH * 0.55);
  // Bottom Ruffled Rim with 6 scalloped frills
  const frills = 6;
  const frillStep = (domeW * 2) / frills;
  for (let f = 0; f < frills; f++) {
    const fx1 = domeW - f * frillStep;
    const fx2 = fx1 - frillStep;
    const fMid = (fx1 + fx2) / 2;
    const fDip = domeH * 0.55 + Math.sin(time * 4 + f) * 6 * scale;
    ctx.quadraticCurveTo(fMid, fDip + 14 * scale, fx2, fDip);
  }
  // Left Umbrella Curve back to Top
  ctx.bezierCurveTo(-domeW * 1.15, domeH * 0.1, -domeW * 0.85, -domeH * 0.85, 0, -domeH);
  ctx.closePath();

  // Translucent Bioluminescent Radial Gradient
  const domeGrad = ctx.createRadialGradient(0, -domeH * 0.2, domeW * 0.1, 0, 0, domeW * 1.2);
  domeGrad.addColorStop(0, 'rgba(165, 243, 252, 0.95)'); // Cyan heart
  domeGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.7)');
  domeGrad.addColorStop(0.85, 'rgba(129, 140, 248, 0.45)');
  domeGrad.addColorStop(1, 'rgba(192, 132, 252, 0.2)');
  ctx.fillStyle = domeGrad;
  ctx.fill();

  // Luminous glowing rim
  ctx.lineWidth = 5 * scale;
  ctx.strokeStyle = '#ffffff';
  ctx.shadowColor = colors.primary;
  ctx.shadowBlur = 18 * scale;
  ctx.stroke();

  // Internal Clover Nodes (Aurelia 4-leaf clover organs)
  const cloverR = 18 * scale;
  for (let i = 0; i < 4; i++) {
    const ang = (i * Math.PI) / 2 + Math.PI / 4;
    const clovX = Math.cos(ang) * 26 * scale;
    const clovY = -domeH * 0.2 + Math.sin(ang) * 18 * scale;

    ctx.beginPath();
    ctx.arc(clovX, clovY, cloverR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fill();
    ctx.lineWidth = 2 * scale;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }

  // Cute Chibi Face on the Bell
  const eyeSpan = 32 * scale;
  const eyeY = -domeH * 0.15;

  for (const side of [-1, 1]) {
    const ex = side * eyeSpan;
    ctx.beginPath();
    ctx.ellipse(ex, eyeY, 12 * scale, 16 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();

    // Eye highlight
    ctx.beginPath();
    ctx.arc(ex - 3.5 * scale, eyeY - 4 * scale, 4.5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }

  // Cheek blush
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(side * (eyeSpan + 20 * scale), eyeY + 10 * scale, 11 * scale, 7 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244, 63, 94, 0.65)';
    ctx.fill();
  }

  // Cute Tiny Smile
  ctx.beginPath();
  ctx.arc(0, eyeY + 10 * scale, 6 * scale, 0.2, Math.PI - 0.2);
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 3 * scale;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();
}

// ============================================================================
// 5. SQUISHY MOCHI BUN & BLOB BUNNY MASCOT
// Ultra-satisfying squishy dough dumpling with soft-body jiggle physics,
// bouncy floppy bunny ears with momentum lag, blushing face, powdered sugar dust.
// ============================================================================
export function drawSquishyMochiBunny(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const groundY = height * 0.70;
  const minDim = Math.min(width, height);
  const scale = minDim / 950;
  const speed = config.particleSpeed || 1.0;
  const colors = getPaletteColors(config.colorPalette);

  // Soft-body Elastic Jiggle Physics
  const jiggleTime = time * 4.2 * speed;
  const jiggleHop = Math.abs(Math.sin(jiggleTime));
  const hopHeight = 130 * scale;
  const mochiY = groundY - jiggleHop * hopHeight;

  // Squash & Stretch
  let squishX = 1.0;
  let squishY = 1.0;
  if (jiggleHop < 0.2) {
    const sq = (1 - jiggleHop / 0.2) * 0.38;
    squishX = 1 + sq;
    squishY = 1 - sq * 0.6;
  } else {
    const st = (jiggleHop - 0.2) * 0.16;
    squishX = 1 - st;
    squishY = 1 + st;
  }

  // Ground Shadow
  ctx.save();
  const shadowAlpha = 0.5 * (1 - (jiggleHop * hopHeight) / (hopHeight * 1.5));
  const shadowR = 110 * scale * (1 - jiggleHop * 0.3);
  ctx.beginPath();
  ctx.ellipse(cx, groundY + 10 * scale, shadowR, shadowR * 0.28, 0, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(0, 0, 0, ${shadowAlpha})`;
  ctx.fill();
  ctx.restore();

  // Floating Powdered Sugar & Sakura Blossom Sparkles
  const sugarCount = 10;
  for (let s = 0; s < sugarCount; s++) {
    const seed = s * 29.41;
    const cycle = (time * 1.4 * speed + hash(seed)) % 1;
    const sx = cx + (hash(seed + 1) - 0.5) * 350 * scale;
    const sy = groundY - 40 * scale - cycle * 260 * scale;
    const sSize = (5 + hash(seed + 2) * 6) * (1 - cycle) * scale;

    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(cycle * Math.PI * 2);
    ctx.beginPath();
    ctx.arc(0, 0, sSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 205, 211, ${(1 - cycle) * 0.8})`;
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur = 6 * scale;
    ctx.fill();
    ctx.restore();
  }

  ctx.save();
  ctx.translate(cx, mochiY);
  ctx.scale(squishX, squishY);

  const mochiW = 108 * scale;
  const mochiH = 88 * scale;

  // 1. Floppy Bunny Ears with Dynamic Lag
  const earLag = Math.sin(jiggleTime - 0.6) * 0.28;
  for (const side of [-1, 1]) {
    ctx.save();
    const earBaseX = side * 38 * scale;
    const earBaseY = -mochiH * 0.85;
    ctx.translate(earBaseX, earBaseY);
    ctx.rotate(side * 0.35 + earLag * side);

    // Outer Ear
    ctx.beginPath();
    ctx.moveTo(-14 * scale, 0);
    ctx.quadraticCurveTo(-18 * scale, -55 * scale, 0, -75 * scale);
    ctx.quadraticCurveTo(18 * scale, -55 * scale, 14 * scale, 0);
    ctx.closePath();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 5 * scale;
    ctx.strokeStyle = '#f4f4f5';
    ctx.stroke();

    // Inner Pink Ear
    ctx.beginPath();
    ctx.moveTo(-7 * scale, -10 * scale);
    ctx.quadraticCurveTo(-10 * scale, -45 * scale, 0, -62 * scale);
    ctx.quadraticCurveTo(10 * scale, -45 * scale, 7 * scale, -10 * scale);
    ctx.closePath();
    ctx.fillStyle = '#fda4af';
    ctx.fill();

    ctx.restore();
  }

  // 2. Main Squishy Mochi Dumpling Body
  ctx.beginPath();
  // Dome Top
  ctx.moveTo(0, -mochiH);
  ctx.bezierCurveTo(mochiW * 0.8, -mochiH * 0.95, mochiW * 1.15, mochiH * 0.2, mochiW, mochiH * 0.85);
  // Squishy flat bottom
  ctx.quadraticCurveTo(0, mochiH + 12 * scale, -mochiW, mochiH * 0.85);
  ctx.bezierCurveTo(-mochiW * 1.15, mochiH * 0.2, -mochiW * 0.8, -mochiH * 0.95, 0, -mochiH);
  ctx.closePath();

  // Creamy White Mochi Gradient Fill
  const mochiGrad = ctx.createRadialGradient(0, -mochiH * 0.3, mochiW * 0.1, 0, 0, mochiW * 1.2);
  mochiGrad.addColorStop(0, '#ffffff');
  mochiGrad.addColorStop(0.7, '#fafafa');
  mochiGrad.addColorStop(1, '#f4f4f5');
  ctx.fillStyle = mochiGrad;
  ctx.fill();

  // Soft luminous outline
  ctx.lineWidth = 6 * scale;
  ctx.strokeStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.6)';
  ctx.shadowBlur = 14 * scale;
  ctx.stroke();

  // 3. Two Tiny Front Dough Paws
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(side * 28 * scale, mochiH * 0.52, 14 * scale, 10 * scale, side * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 3.5 * scale;
    ctx.strokeStyle = '#e4e4e7';
    ctx.stroke();
  }

  // 4. Sparkling Anime Face
  const eyeSpan = 38 * scale;
  const eyeY = 6 * scale;
  const isBlink = (time * 0.3) % 1 > 0.92;

  if (isBlink) {
    for (const side of [-1, 1]) {
      ctx.beginPath();
      ctx.arc(side * eyeSpan, eyeY, 13 * scale, Math.PI * 1.15, Math.PI * 1.85);
      ctx.strokeStyle = '#09090b';
      ctx.lineWidth = 4 * scale;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  } else {
    for (const side of [-1, 1]) {
      const ex = side * eyeSpan;
      ctx.beginPath();
      ctx.ellipse(ex, eyeY, 16 * scale, 21 * scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#09090b';
      ctx.fill();

      // Big shine
      ctx.beginPath();
      ctx.arc(ex - 4.5 * scale, eyeY - 5 * scale, 6 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
  }

  // Rosy Cheek Blushes
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.ellipse(side * (eyeSpan + 24 * scale), eyeY + 12 * scale, 14 * scale, 8 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(244, 63, 94, 0.65)';
    ctx.fill();
  }

  // Cute Little Bunny Nose & Mouth
  ctx.beginPath();
  ctx.arc(0, eyeY + 11 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#fda4af';
  ctx.fill();

  ctx.beginPath();
  ctx.arc(-4 * scale, eyeY + 17 * scale, 5 * scale, 0, Math.PI);
  ctx.arc(4 * scale, eyeY + 17 * scale, 5 * scale, 0, Math.PI);
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 3 * scale;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.restore();
}

// ============================================================================
// 6. VIRAL TIKTOK SCRAMBLING CLAW CAT (BLACK & WHITE / CHIBI SILHOUETTE)
// The iconic TikTok sensation: A panicked cat hanging by its claws on the
// screen glass, frantically scratching downward with friction sparks, pedaling
// its hind legs in a bicycle kick, and whipping its tail in an S-curve.
// ============================================================================
export function drawViralTikTokScramblingCat(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 900;
  const speed = config.particleSpeed || 1.0;

  // The glass screen grab line (where claws catch)
  const glassY = height * 0.28;

  // Body hanging tension physics (slight vertical elasticity and sway)
  const swayAngle = Math.sin(time * 6 * speed) * 0.045;
  const bodyBob = Math.sin(time * 12 * speed) * (6 * scale);

  // Scratching cycle: left and right paws alternate frantic scratch strokes
  const scratchSpeed = time * 13 * speed;
  const leftPhase = scratchSpeed % (Math.PI * 2);
  const rightPhase = (scratchSpeed + Math.PI) % (Math.PI * 2);

  // Helper for paw position in scratch cycle
  const getPawState = (phase: number) => {
    const isContact = Math.sin(phase) >= -0.2;
    const slipDown = Math.max(0, Math.sin(phase)) * (42 * scale);
    const slipX = (Math.cos(phase) * 6) * scale;
    return { isContact, slipDown, slipX };
  };

  const leftPaw = getPawState(leftPhase);
  const rightPaw = getPawState(rightPhase);

  // -------------------------------------------------------------------------
  // 1. BACKGROUND ACTION / SPEED LINES & SCRATCH MARKS ON GLASS
  // -------------------------------------------------------------------------
  ctx.save();

  // Glass scratch streaks left behind by claws
  for (let s = -2; s <= 2; s++) {
    const streakX = cx + s * (32 * scale);
    const streakAlpha = 0.25 + 0.15 * Math.sin(time * 8 + s * 1.5);
    ctx.strokeStyle = `rgba(255, 255, 255, ${streakAlpha})`;
    ctx.lineWidth = 2 * scale;
    ctx.setLineDash([12 * scale, 8 * scale]);
    ctx.beginPath();
    ctx.moveTo(streakX, glassY - 50 * scale);
    ctx.lineTo(streakX, glassY + 110 * scale);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  // Cartoon action lines radiating upward to emphasize the falling sensation
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.8 * scale;
  for (let i = 0; i < 7; i++) {
    const actionX = cx + (i - 3) * (95 * scale);
    const lineY = (height * 0.1) + ((time * 300 + i * 80) % (height * 0.35));
    ctx.beginPath();
    ctx.moveTo(actionX, lineY);
    ctx.lineTo(actionX, lineY + 45 * scale);
    ctx.stroke();
  }

  ctx.restore();

  // -------------------------------------------------------------------------
  // 2. MAIN FELINE BODY STRUCTURE (Unified Silhouette with Sway)
  // -------------------------------------------------------------------------
  ctx.save();
  ctx.translate(cx, glassY + bodyBob);
  ctx.rotate(swayAngle);

  // Body Dimensions
  const headW = 72 * scale;
  const headH = 62 * scale;
  const bodyTopY = 48 * scale;
  const bodyBottomY = 240 * scale;
  const bodyW = 84 * scale;

  // --- TAIL (Fluently undulating S-curve whip) ---
  const tailSegments = 8;
  const tailBaseX = 0;
  const tailBaseY = bodyBottomY - 15 * scale;
  const tailPoints: { x: number; y: number }[] = [{ x: tailBaseX, y: tailBaseY }];

  for (let i = 1; i <= tailSegments; i++) {
    const tFrac = i / tailSegments;
    const wave1 = Math.sin(time * 7 * speed + i * 0.7) * (36 * scale * tFrac);
    const wave2 = Math.cos(time * 4 * speed + i * 0.4) * (18 * scale * tFrac);
    tailPoints.push({
      x: tailBaseX + wave1 + wave2,
      y: tailBaseY + i * (22 * scale)
    });
  }

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(tailPoints[0].x, tailPoints[0].y);
  for (let i = 1; i < tailPoints.length; i++) {
    const prev = tailPoints[i - 1];
    const curr = tailPoints[i];
    const midX = (prev.x + curr.x) / 2;
    const midY = (prev.y + curr.y) / 2;
    ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
  }
  const last = tailPoints[tailPoints.length - 1];
  ctx.lineTo(last.x, last.y);
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 22 * scale;
  ctx.lineCap = 'round';
  ctx.stroke();

  // White tail tip (classic cartoon aesthetic)
  ctx.beginPath();
  const tipPrev = tailPoints[tailPoints.length - 2];
  ctx.moveTo(tipPrev.x, tipPrev.y);
  ctx.lineTo(last.x, last.y);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 14 * scale;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();

  // --- HIND LEGS (Frantic Cycling / Bicycle Kick) ---
  const hindCycle = time * 14 * speed;
  for (const [idx, side] of [-1, 1].entries()) {
    const legPhase = hindCycle + (idx === 0 ? 0 : Math.PI);
    const kickX = side * (45 * scale) + Math.cos(legPhase) * (20 * scale);
    const kickY = bodyBottomY + (Math.sin(legPhase) * 28 + 15) * scale;
    const hipX = side * (42 * scale);
    const hipY = bodyBottomY - 25 * scale;

    ctx.save();
    // Leg limb
    ctx.beginPath();
    ctx.moveTo(hipX, hipY);
    ctx.quadraticCurveTo(side * (75 * scale), hipY + 30 * scale, kickX, kickY);
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 24 * scale;
    ctx.lineCap = 'round';
    ctx.stroke();

    // White Paw Foot
    ctx.beginPath();
    ctx.ellipse(kickX, kickY, 15 * scale, 12 * scale, side * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 2.5 * scale;
    ctx.strokeStyle = '#e4e4e7';
    ctx.stroke();

    // Pink Toe Beans
    for (let b = -1; b <= 1; b++) {
      ctx.beginPath();
      ctx.arc(kickX + b * (7 * scale), kickY - 4 * scale, 3 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#f43f5e';
      ctx.fill();
    }
    // Main pad
    ctx.beginPath();
    ctx.ellipse(kickX, kickY + 3 * scale, 6 * scale, 4.5 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#f43f5e';
    ctx.fill();
    ctx.restore();
  }

  // --- MAIN TORSO SILHOUETTE (Teardrop / Pear Shape with Chibi Chub) ---
  ctx.save();
  ctx.beginPath();
  // Start at neck left
  ctx.moveTo(-headW * 0.65, bodyTopY);
  // Curve down to left hip
  ctx.bezierCurveTo(-bodyW * 1.15, bodyTopY + 70 * scale, -bodyW * 1.25, bodyBottomY - 40 * scale, -bodyW * 0.75, bodyBottomY);
  // Bottom rump curve
  ctx.quadraticCurveTo(0, bodyBottomY + 28 * scale, bodyW * 0.75, bodyBottomY);
  // Curve up right hip to neck right
  ctx.bezierCurveTo(bodyW * 1.25, bodyBottomY - 40 * scale, bodyW * 1.15, bodyTopY + 70 * scale, headW * 0.65, bodyTopY);
  ctx.closePath();

  // Glossy Black Coat Gradient
  const coatGrad = ctx.createLinearGradient(0, bodyTopY, 0, bodyBottomY);
  coatGrad.addColorStop(0, '#18181b');
  coatGrad.addColorStop(0.5, '#09090b');
  coatGrad.addColorStop(1, '#000000');
  ctx.fillStyle = coatGrad;
  ctx.fill();

  // Subtle clean rim light
  ctx.lineWidth = 3.5 * scale;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.stroke();

  // --- WHITE BELLY PATCH (High-contrast Tuxedo Style) ---
  ctx.beginPath();
  ctx.moveTo(-bodyW * 0.35, bodyTopY + 40 * scale);
  ctx.bezierCurveTo(-bodyW * 0.65, bodyTopY + 90 * scale, -bodyW * 0.55, bodyBottomY - 30 * scale, 0, bodyBottomY - 10 * scale);
  ctx.bezierCurveTo(bodyW * 0.55, bodyBottomY - 30 * scale, bodyW * 0.65, bodyTopY + 90 * scale, bodyW * 0.35, bodyTopY + 40 * scale);
  ctx.closePath();
  ctx.fillStyle = '#f8fafc';
  ctx.fill();
  ctx.restore();

  // -------------------------------------------------------------------------
  // 3. CHIBI CAT HEAD & EXPRESSIVE PANIC FACE
  // -------------------------------------------------------------------------
  const headCenterY = bodyTopY - 24 * scale;

  ctx.save();
  ctx.translate(0, headCenterY);

  // Ears & Head unified path (Zero ugly seams!)
  const earTwitch = Math.sin(time * 24) * (0.07 * scale);
  ctx.beginPath();
  // Skull top
  ctx.moveTo(-headW * 0.45, -headH * 0.7);
  // Left Ear
  ctx.quadraticCurveTo(-headW * 0.75, -headH * 1.45 + earTwitch, -headW * 1.05, -headH * 1.35);
  ctx.bezierCurveTo(-headW * 1.0, -headH * 0.6, -headW * 1.15, -headH * 0.1, -headW, headH * 0.25);
  // Left Cheek Fluff
  ctx.bezierCurveTo(-headW * 1.25, headH * 0.65, -headW * 0.8, headH * 1.05, 0, headH * 0.95);
  // Right Cheek Fluff
  ctx.bezierCurveTo(headW * 0.8, headH * 1.05, headW * 1.25, headH * 0.65, headW, headH * 0.25);
  // Right Ear
  ctx.bezierCurveTo(headW * 1.15, -headH * 0.1, headW * 1.0, -headH * 0.6, headW * 1.05, -headH * 1.35);
  ctx.quadraticCurveTo(headW * 0.75, -headH * 1.45 - earTwitch, headW * 0.45, -headH * 0.7);
  ctx.closePath();

  ctx.fillStyle = '#09090b';
  ctx.fill();
  ctx.lineWidth = 3.5 * scale;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.stroke();

  // Pink Inner Ears
  for (const side of [-1, 1]) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(side * headW * 0.48, -headH * 0.65);
    ctx.lineTo(side * headW * 0.98, -headH * 1.2);
    ctx.lineTo(side * headW * 0.88, -headH * 0.25);
    ctx.closePath();
    ctx.fillStyle = '#f43f5e';
    ctx.fill();
    ctx.restore();
  }

  // --- PANICKED ANIME EYES ---
  // Large circular white sclera with trembling pupils
  const eyeSpan = 38 * scale;
  const eyeY = 5 * scale;
  const eyeR = 21 * scale;
  const pupilJitterX = Math.sin(time * 36) * (3.5 * scale);
  const pupilJitterY = Math.cos(time * 30) * (2.5 * scale);

  for (const side of [-1, 1]) {
    const ex = side * eyeSpan;

    // Sclera
    ctx.beginPath();
    ctx.arc(ex, eyeY, eyeR, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 3 * scale;
    ctx.strokeStyle = '#09090b';
    ctx.stroke();

    // Trembling Pupil
    ctx.beginPath();
    ctx.arc(ex + pupilJitterX, eyeY + pupilJitterY, 8.5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#09090b';
    ctx.fill();

    // Glint highlight
    ctx.beginPath();
    ctx.arc(ex + pupilJitterX - 2.5 * scale, eyeY + pupilJitterY - 3 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }

  // Comic furrowed panic eyebrows
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(side * (eyeSpan - 12 * scale), eyeY - 24 * scale);
    ctx.lineTo(side * (eyeSpan + 14 * scale), eyeY - 20 * scale);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3.5 * scale;
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  // --- OPEN PANIC TRIANGLE MOUTH & LITTLE FANGS ---
  const mouthY = eyeY + 24 * scale;
  ctx.beginPath();
  ctx.moveTo(-16 * scale, mouthY);
  ctx.lineTo(16 * scale, mouthY);
  ctx.quadraticCurveTo(0, mouthY + 28 * scale, -16 * scale, mouthY);
  ctx.fillStyle = '#881337';
  ctx.fill();
  ctx.lineWidth = 2.5 * scale;
  ctx.strokeStyle = '#ffffff';
  ctx.stroke();

  // Little pink tongue
  ctx.beginPath();
  ctx.arc(0, mouthY + 16 * scale, 9 * scale, 0, Math.PI);
  ctx.fillStyle = '#f43f5e';
  ctx.fill();

  // Two tiny sharp white fangs
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(side * 9 * scale, mouthY);
    ctx.lineTo(side * 6 * scale, mouthY + 7 * scale);
    ctx.lineTo(side * 3 * scale, mouthY);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }

  // --- RAPIDLY VIBRATING WHISKERS ---
  const whiskerJitter = Math.sin(time * 42) * (3 * scale);
  for (const side of [-1, 1]) {
    const wx = side * (headW * 0.72);
    for (let w = -1; w <= 1; w++) {
      ctx.beginPath();
      ctx.moveTo(wx, eyeY + 14 * scale + w * (6 * scale));
      ctx.lineTo(wx + side * (46 * scale), eyeY + 10 * scale + w * (14 * scale) + whiskerJitter);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.2 * scale;
      ctx.lineCap = 'round';
      ctx.stroke();
    }
  }

  // --- COMIC PANIC SWEAT DROPS ---
  for (let s = 0; s < 3; s++) {
    const dropTime = (time * 2.5 + s * 0.7) % 1;
    const dropX = (s % 2 === 0 ? 1 : -1) * (headW * 1.05 + s * (15 * scale));
    const dropY = -headH * 0.3 + dropTime * (50 * scale);
    const dropAlpha = 1 - dropTime;

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(dropX, dropY, 6 * scale, 10 * scale, s % 2 === 0 ? 0.35 : -0.35, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(56, 189, 248, ${dropAlpha})`;
    ctx.fill();
    ctx.restore();
  }

  ctx.restore(); // end head

  ctx.restore(); // end body sway

  // -------------------------------------------------------------------------
  // 4. FRONT SCRAMBLING PAWS & HOOKED CLAWS (Anchored to Glass Edge)
  // -------------------------------------------------------------------------
  const pawOffsetSides = [
    { side: -1, x: cx - 62 * scale, paw: leftPaw, label: 'L' },
    { side: 1, x: cx + 62 * scale, paw: rightPaw, label: 'R' }
  ];

  for (const item of pawOffsetSides) {
    const pawX = item.x + item.paw.slipX;
    const pawY = glassY + item.paw.slipDown - 15 * scale;

    ctx.save();
    // Arm sleeve stretching down from body to paw
    ctx.beginPath();
    ctx.moveTo(item.side * 28 * scale + cx, glassY + 45 * scale + bodyBob);
    ctx.lineTo(pawX, pawY + 12 * scale);
    ctx.strokeStyle = '#09090b';
    ctx.lineWidth = 26 * scale;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Round White Mitten Paw
    ctx.beginPath();
    ctx.ellipse(pawX, pawY, 18 * scale, 15 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.lineWidth = 3 * scale;
    ctx.strokeStyle = '#e4e4e7';
    ctx.stroke();

    // 3 Rounded toe lobes
    for (let lobe = -1; lobe <= 1; lobe++) {
      ctx.beginPath();
      ctx.arc(pawX + lobe * (9 * scale), pawY - 9 * scale, 5.5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    // 3 Sharp Hooked Claws Digging into Glass
    for (let claw = -1; claw <= 1; claw++) {
      const clawBaseX = pawX + claw * (9 * scale);
      const clawBaseY = pawY - 11 * scale;
      ctx.beginPath();
      ctx.moveTo(clawBaseX - 2.5 * scale, clawBaseY);
      ctx.lineTo(clawBaseX + 2.5 * scale, clawBaseY);
      // Hook curve pointing up/digging into glass
      ctx.quadraticCurveTo(clawBaseX + (claw * 2) * scale, clawBaseY - 18 * scale, clawBaseX, clawBaseY - 16 * scale);
      ctx.closePath();
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      ctx.strokeStyle = '#a1a1aa';
      ctx.lineWidth = 1.2 * scale;
      ctx.stroke();
    }

    // Friction Sparks scattering when claw slips along glass!
    if (item.paw.isContact) {
      for (let sp = 0; sp < 4; sp++) {
        const seed = Math.sin(time * 50 + item.side * 10 + sp);
        const sparkX = pawX + (seed * 22) * scale;
        const sparkY = pawY - (14 + Math.abs(seed) * 16) * scale;
        ctx.beginPath();
        ctx.arc(sparkX, sparkY, (2 + Math.abs(seed) * 2.5) * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 8 * scale;
        ctx.fill();
      }
    }

    ctx.restore();
  }
}

// ============================================================================
// 7. ZEN ONsen CHILL CAPYBARA WITH YUZU (MARKET GAP #1: LOFI / POMODORO / RELAX)
// Market Demand: #capybara has 15B+ views; Lofi study, Pomodoro timer & stream overlays
// have massive search volume, but virtually NO pure-code 2D procedural Capybaras exist!
// Features: Warm wooden onsen tub, undulating mineral water ripples, contented breathing,
// balanced wobbling Yuzu citrus on head with physics inertia, sleepy blink cycle,
// ear micro-twitches, and curling ambient steam vapor.
// ============================================================================
export function drawZenOnsenCapybara(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height * 0.52;
  const minDim = Math.min(width, height);
  const scale = minDim / 900;
  const speed = config.particleSpeed || 1.0;

  // Relaxation breathing rhythm
  const breathTime = time * 2.0 * speed;
  const breath = Math.sin(breathTime);
  const bodyBob = breath * (5 * scale);

  // Sleepy slow blink cycle (blinks every ~4.5 seconds for a soft half-second)
  const blinkCycle = (time * 0.28 * speed) % 1;
  const isBlinking = blinkCycle > 0.88;

  // Ear twitch inertia (twitch occasionally every ~3.5s)
  const twitchCycle = (time * 0.35 * speed) % 1;
  const earTwitch = twitchCycle > 0.92 ? Math.sin(time * 35) * 0.12 : 0;

  // -------------------------------------------------------------------------
  // 1. RISING WARM ONSEN STEAM PARTICLES (VAPOR DRIFT)
  // -------------------------------------------------------------------------
  ctx.save();
  const steamCount = 18;
  for (let s = 0; s < steamCount; s++) {
    const seed = s * 47.19;
    const sCycle = (time * 0.25 * speed + hash(seed)) % 1;
    const startX = cx + (hash(seed + 1) - 0.5) * 260 * scale;
    const sY = cy + 60 * scale - sCycle * (340 * scale);
    const wave = Math.sin(time * 1.8 + s) * (28 * scale) * sCycle;
    const sX = startX + wave;
    const sRadius = (16 + sCycle * 42) * scale;
    const alpha = Math.sin(sCycle * Math.PI) * 0.18;

    const steamGrad = ctx.createRadialGradient(sX, sY, 0, sX, sY, sRadius);
    steamGrad.addColorStop(0, `rgba(255, 255, 255, ${alpha})`);
    steamGrad.addColorStop(0.6, `rgba(224, 242, 254, ${alpha * 0.5})`);
    steamGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = steamGrad;
    ctx.beginPath();
    ctx.arc(sX, sY, sRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // -------------------------------------------------------------------------
  // 2. WOODEN ONSEN BATH TUB (BACK RIM)
  // -------------------------------------------------------------------------
  const tubY = cy + 90 * scale;
  const tubRx = 190 * scale;
  const tubRy = 55 * scale;

  ctx.save();
  // Back lip of wooden bucket
  ctx.beginPath();
  ctx.ellipse(cx, tubY - 6 * scale, tubRx, tubRy, 0, Math.PI, 0);
  ctx.fillStyle = '#451a03';
  ctx.fill();
  ctx.strokeStyle = '#271003';
  ctx.lineWidth = 4 * scale;
  ctx.stroke();
  ctx.restore();

  // -------------------------------------------------------------------------
  // 3. CAPYBARA BODY & SHOULDERS (PEACEFULLY SUBMERGED)
  // -------------------------------------------------------------------------
  ctx.save();
  const shoulderY = tubY - 20 * scale + bodyBob;

  // Submerged chest / body silhouette
  ctx.beginPath();
  ctx.ellipse(cx, shoulderY + 30 * scale, 125 * scale, 85 * scale, 0, 0, Math.PI * 2);
  const furGrad = ctx.createLinearGradient(cx, shoulderY - 60 * scale, cx, shoulderY + 80 * scale);
  furGrad.addColorStop(0, '#9a3412');
  furGrad.addColorStop(0.5, '#78350f');
  furGrad.addColorStop(1, '#451a03');
  ctx.fillStyle = furGrad;
  ctx.fill();

  // -------------------------------------------------------------------------
  // 4. CAPYBARA HEAD & ICONIC SNOUT (PRECISION CHIBI CURVES)
  // -------------------------------------------------------------------------
  const headY = cy - 25 * scale + bodyBob;

  // Main head block (signature rounded-box capybara skull)
  ctx.beginPath();
  // Top flat skull
  ctx.moveTo(cx - 70 * scale, headY - 45 * scale);
  ctx.quadraticCurveTo(cx, headY - 50 * scale, cx + 70 * scale, headY - 45 * scale);
  // Right cheek curving out to wide snout
  ctx.bezierCurveTo(cx + 90 * scale, headY - 25 * scale, cx + 96 * scale, headY + 15 * scale, cx + 88 * scale, headY + 45 * scale);
  // Wide blunt muzzle (rounded chin)
  ctx.quadraticCurveTo(cx + 80 * scale, headY + 75 * scale, cx + 55 * scale, headY + 82 * scale);
  ctx.quadraticCurveTo(cx, headY + 86 * scale, cx - 55 * scale, headY + 82 * scale);
  // Left chin and cheek
  ctx.quadraticCurveTo(cx - 80 * scale, headY + 75 * scale, cx - 88 * scale, headY + 45 * scale);
  ctx.bezierCurveTo(cx - 96 * scale, headY + 15 * scale, cx - 90 * scale, headY - 25 * scale, cx - 70 * scale, headY - 45 * scale);
  ctx.closePath();

  // Rich warm fur shading
  const headGrad = ctx.createLinearGradient(cx, headY - 50 * scale, cx, headY + 85 * scale);
  headGrad.addColorStop(0, '#b45309');
  headGrad.addColorStop(0.3, '#92400e');
  headGrad.addColorStop(0.7, '#78350f');
  headGrad.addColorStop(1, '#58240c');
  ctx.fillStyle = headGrad;
  ctx.fill();
  ctx.strokeStyle = '#381607';
  ctx.lineWidth = 4 * scale;
  ctx.stroke();

  // Subtle highlight on snout top
  ctx.beginPath();
  ctx.ellipse(cx, headY - 10 * scale, 50 * scale, 25 * scale, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(217, 119, 6, 0.25)';
  ctx.fill();

  // -------------------------------------------------------------------------
  // 5. CUTE ROUND EARS WITH INERTIAL TWITCH
  // -------------------------------------------------------------------------
  const earSides = [
    { side: -1, x: cx - 62 * scale, angle: -0.25 + earTwitch },
    { side: 1, x: cx + 62 * scale, angle: 0.25 - earTwitch * 0.7 }
  ];

  for (const ear of earSides) {
    ctx.save();
    ctx.translate(ear.x, headY - 42 * scale);
    ctx.rotate(ear.angle);

    // Outer ear
    ctx.beginPath();
    ctx.ellipse(0, 0, 16 * scale, 22 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#78350f';
    ctx.fill();
    ctx.strokeStyle = '#381607';
    ctx.lineWidth = 3.5 * scale;
    ctx.stroke();

    // Inner ear notch
    ctx.beginPath();
    ctx.ellipse(0, 2 * scale, 9 * scale, 13 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#f87171';
    ctx.fill();

    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // 6. BLISSFUL SLEEPY EYES & CHEEK BLUSH
  // -------------------------------------------------------------------------
  // Pink blush spots
  ctx.beginPath();
  ctx.ellipse(cx - 58 * scale, headY + 22 * scale, 15 * scale, 10 * scale, 0, 0, Math.PI * 2);
  ctx.ellipse(cx + 58 * scale, headY + 22 * scale, 15 * scale, 10 * scale, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(244, 63, 94, 0.35)';
  ctx.fill();

  // Eyes: calm, content crescent curves (or closed line if blinking)
  const eyeY = headY + 2 * scale;
  const eyeDistance = 46 * scale;

  ctx.strokeStyle = '#1c0d05';
  ctx.lineWidth = 4.2 * scale;
  ctx.lineCap = 'round';

  for (const dir of [-1, 1]) {
    const eyeX = cx + dir * eyeDistance;
    ctx.beginPath();
    if (isBlinking) {
      // Flat relaxed closed line
      ctx.moveTo(eyeX - 12 * scale, eyeY);
      ctx.lineTo(eyeX + 12 * scale, eyeY);
    } else {
      // Contented peaceful crescent curve (^_^)
      ctx.moveTo(eyeX - 13 * scale, eyeY + 2 * scale);
      ctx.quadraticCurveTo(eyeX, eyeY - 8 * scale, eyeX + 13 * scale, eyeY + 2 * scale);
    }
    ctx.stroke();

    // Two tiny eyelashes on outer eye
    ctx.beginPath();
    ctx.moveTo(eyeX + dir * 11 * scale, eyeY);
    ctx.lineTo(eyeX + dir * 17 * scale, eyeY - 5 * scale);
    ctx.stroke();
  }

  // -------------------------------------------------------------------------
  // 7. WIDE BLUNT NOSE & NOSTRILS WITH BREATH EXHALE
  // -------------------------------------------------------------------------
  const noseY = headY + 48 * scale;
  // Nose pad
  ctx.beginPath();
  ctx.ellipse(cx, noseY, 26 * scale, 14 * scale, 0, 0, Math.PI * 2);
  ctx.fillStyle = '#291307';
  ctx.fill();

  // Nostrils that expand subtly on breathing
  const nostrilSpread = (11 + breath * 1.5) * scale;
  ctx.beginPath();
  ctx.ellipse(cx - nostrilSpread, noseY + 2 * scale, 4 * scale, 5.5 * scale, -0.2, 0, Math.PI * 2);
  ctx.ellipse(cx + nostrilSpread, noseY + 2 * scale, 4 * scale, 5.5 * scale, 0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#100602';
  ctx.fill();

  // Gentle center Philtrum groove
  ctx.beginPath();
  ctx.moveTo(cx, noseY + 12 * scale);
  ctx.lineTo(cx, noseY + 22 * scale);
  ctx.strokeStyle = '#1c0d05';
  ctx.lineWidth = 3 * scale;
  ctx.stroke();

  // Subtle serene smile curve
  ctx.beginPath();
  ctx.moveTo(cx - 18 * scale, noseY + 23 * scale);
  ctx.quadraticCurveTo(cx, noseY + 28 * scale, cx + 18 * scale, noseY + 23 * scale);
  ctx.strokeStyle = '#1c0d05';
  ctx.lineWidth = 3.5 * scale;
  ctx.stroke();

  // -------------------------------------------------------------------------
  // 8. ICONIC BALANCED YUZU ORANGE ON HEAD (WITH PHYSICS WOBBLE)
  // -------------------------------------------------------------------------
  // Inertial tilt opposite to breath bobbing
  const yuzuTilt = Math.sin(breathTime - 0.6) * 0.14;
  const yuzuX = cx;
  const yuzuY = headY - 56 * scale;

  ctx.save();
  ctx.translate(yuzuX, yuzuY);
  ctx.rotate(yuzuTilt);

  // Yuzu shadow on head
  ctx.beginPath();
  ctx.ellipse(0, 14 * scale, 18 * scale, 5 * scale, 0, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fill();

  // Golden Yuzu citrus body
  ctx.beginPath();
  ctx.arc(0, 0, 22 * scale, 0, Math.PI * 2);
  const yuzuGrad = ctx.createRadialGradient(-5 * scale, -6 * scale, 2 * scale, 0, 0, 24 * scale);
  yuzuGrad.addColorStop(0, '#fef08a');
  yuzuGrad.addColorStop(0.35, '#facc15');
  yuzuGrad.addColorStop(0.85, '#eab308');
  yuzuGrad.addColorStop(1, '#ca8a04');
  ctx.fillStyle = yuzuGrad;
  ctx.fill();
  ctx.strokeStyle = '#a16207';
  ctx.lineWidth = 2.5 * scale;
  ctx.stroke();

  // Citrus stem dimple
  ctx.beginPath();
  ctx.arc(0, -18 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#713f12';
  ctx.fill();

  // Fresh green leaf
  ctx.beginPath();
  ctx.moveTo(0, -18 * scale);
  ctx.quadraticCurveTo(14 * scale, -28 * scale, 20 * scale, -24 * scale);
  ctx.quadraticCurveTo(14 * scale, -16 * scale, 0, -18 * scale);
  ctx.fillStyle = '#22c55e';
  ctx.fill();
  ctx.strokeStyle = '#15803d';
  ctx.lineWidth = 1.8 * scale;
  ctx.stroke();

  ctx.restore();

  // -------------------------------------------------------------------------
  // 9. HOT SPRING MINERAL WATER & SHIMMER RIPPLES
  // -------------------------------------------------------------------------
  // Front bath tub wooden lip and water surface
  ctx.beginPath();
  ctx.ellipse(cx, tubY, tubRx, tubRy, 0, 0, Math.PI * 2);
  const waterGrad = ctx.createLinearGradient(cx, tubY - tubRy, cx, tubY + tubRy);
  waterGrad.addColorStop(0, 'rgba(6, 182, 212, 0.85)');
  waterGrad.addColorStop(0.5, 'rgba(8, 145, 178, 0.92)');
  waterGrad.addColorStop(1, 'rgba(14, 116, 144, 0.98)');
  ctx.fillStyle = waterGrad;
  ctx.fill();

  // Animated harmonic water ripples emanating from Capybara
  for (let r = 0; r < 4; r++) {
    const ripPhase = (time * 0.8 * speed + r * 0.25) % 1;
    const ripRx = (60 + ripPhase * 115) * scale;
    const ripRy = ripRx * 0.32;
    const ripAlpha = (1 - ripPhase) * 0.55;

    ctx.beginPath();
    ctx.ellipse(cx, tubY + (12 * scale), ripRx, ripRy, 0, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(207, 250, 254, ${ripAlpha})`;
    ctx.lineWidth = 2.5 * scale;
    ctx.stroke();
  }

  // Floating Yuzu slice in bath water
  const sliceX = cx - 110 * scale + Math.sin(time * 1.5) * (8 * scale);
  const sliceY = tubY + 12 * scale + Math.cos(time * 1.2) * (4 * scale);
  ctx.beginPath();
  ctx.ellipse(sliceX, sliceY, 14 * scale, 7 * scale, 0.2, 0, Math.PI * 2);
  ctx.fillStyle = '#facc15';
  ctx.fill();
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // -------------------------------------------------------------------------
  // 10. FRONT WOODEN TUB RIM & COPPER HOOP BANDS
  // -------------------------------------------------------------------------
  // Bottom wall of bucket
  ctx.beginPath();
  ctx.moveTo(cx - tubRx, tubY);
  ctx.lineTo(cx - tubRx * 0.88, tubY + 110 * scale);
  ctx.quadraticCurveTo(cx, tubY + 140 * scale, cx + tubRx * 0.88, tubY + 110 * scale);
  ctx.lineTo(cx + tubRx, tubY);
  ctx.quadraticCurveTo(cx, tubY + tubRy * 1.8, cx - tubRx, tubY);
  ctx.closePath();

  const woodGrad = ctx.createLinearGradient(cx - tubRx, tubY, cx + tubRx, tubY);
  woodGrad.addColorStop(0, '#58240c');
  woodGrad.addColorStop(0.2, '#78350f');
  woodGrad.addColorStop(0.5, '#92400e');
  woodGrad.addColorStop(0.8, '#78350f');
  woodGrad.addColorStop(1, '#58240c');
  ctx.fillStyle = woodGrad;
  ctx.fill();
  ctx.strokeStyle = '#271003';
  ctx.lineWidth = 4 * scale;
  ctx.stroke();

  // Dark metallic iron hoops on wooden barrel
  for (const hoopYOffset of [38, 85]) {
    ctx.beginPath();
    ctx.ellipse(cx, tubY + hoopYOffset * scale, tubRx * 0.94, tubRy * 0.9, 0, 0, Math.PI);
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 5 * scale;
    ctx.stroke();

    // Rivet studs
    for (const rx of [-80, 0, 80]) {
      ctx.beginPath();
      ctx.arc(cx + rx * scale, tubY + (hoopYOffset + 18) * scale, 3 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fill();
    }
  }

  ctx.restore();
}

// ============================================================================
// 8. CYBERPUNK AI COPILOT DROID (MARKET GAP #2: SAAS / DEV / TECH AI MASCOT)
// Market Demand: Massive commercial demand from AI startups, Discord bots, Dev tools,
// and Tech YouTubers looking for a high-end glowing AI companion mascot overlay.
// Features: Floating anti-gravity chassis, curved dark sapphire visor with glowing
// cyan/magenta LED emotion matrix (^ _ ^ blinks & audio visualizer waves), floating
// magnetic detached ear fins, pulsating plasma thruster ring, and orbiting data bits.
// ============================================================================
export function drawCyberAiDroid(
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
  const scale = minDim / 900;
  const speed = config.particleSpeed || 1.0;

  // Anti-gravity levitation physics
  const hoverTime = time * 2.8 * speed;
  const hoverY = cy + Math.sin(hoverTime) * (18 * scale);
  const hoverTilt = Math.sin(hoverTime * 0.5) * 0.05;

  // LED facial expression blink / audio reaction
  const blinkCycle = (time * 0.45 * speed) % 1;
  const isBlinking = blinkCycle > 0.88;

  ctx.save();
  ctx.translate(cx, hoverY);
  ctx.rotate(hoverTilt);

  // -------------------------------------------------------------------------
  // 1. ORBITING HOLOGRAPHIC DATA RINGS & PARTICLES
  // -------------------------------------------------------------------------
  ctx.save();
  const ringTilt = 0.45;
  const ringCount = 2;

  for (let r = 0; r < ringCount; r++) {
    const ringSpeed = (r === 0 ? 1 : -0.7) * time * 1.5 * speed;
    const ringRadius = (165 + r * 35) * scale;

    ctx.save();
    ctx.rotate(r === 0 ? 0.35 : -0.35);

    // Glowing dashed orbit ring
    ctx.beginPath();
    ctx.ellipse(0, 0, ringRadius, ringRadius * ringTilt, 0, 0, Math.PI * 2);
    ctx.strokeStyle = r === 0 ? 'rgba(6, 182, 212, 0.4)' : 'rgba(236, 72, 153, 0.35)';
    ctx.lineWidth = 2 * scale;
    ctx.setLineDash([8 * scale, 12 * scale]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Orbiting glowing data node
    const nodeAngle = ringSpeed;
    const nodeX = Math.cos(nodeAngle) * ringRadius;
    const nodeY = Math.sin(nodeAngle) * (ringRadius * ringTilt);

    ctx.beginPath();
    ctx.arc(nodeX, nodeY, (4 + r) * scale, 0, Math.PI * 2);
    ctx.fillStyle = r === 0 ? '#38bdf8' : '#f472b6';
    ctx.shadowColor = r === 0 ? '#06b6d4' : '#ec4899';
    ctx.shadowBlur = 12 * scale;
    ctx.fill();

    ctx.restore();
  }
  ctx.restore();

  // -------------------------------------------------------------------------
  // 2. PLASMA PROPULSION THRUSTER RING (ANTIGRAVITY JET)
  // -------------------------------------------------------------------------
  const jetY = 100 * scale;
  const jetPulse = Math.sin(time * 12 * speed) * 0.15 + 0.85;

  ctx.save();
  // Outer thruster exhaust glow
  const jetGrad = ctx.createRadialGradient(0, jetY, 0, 0, jetY + 45 * scale, 55 * scale);
  jetGrad.addColorStop(0, `rgba(6, 182, 212, ${0.8 * jetPulse})`);
  jetGrad.addColorStop(0.4, `rgba(168, 85, 247, ${0.5 * jetPulse})`);
  jetGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
  ctx.fillStyle = jetGrad;
  ctx.beginPath();
  ctx.ellipse(0, jetY + 30 * scale, 65 * scale * jetPulse, 45 * scale * jetPulse, 0, 0, Math.PI * 2);
  ctx.fill();

  // Floating Ion exhaust particles dropping down
  for (let p = 0; p < 8; p++) {
    const seed = p * 19.3;
    const pCycle = (time * 3.0 * speed + hash(seed)) % 1;
    const px = (hash(seed + 1) - 0.5) * 45 * scale;
    const py = jetY + (10 + pCycle * 80) * scale;
    const pAlpha = (1 - pCycle) * 0.8;

    ctx.beginPath();
    ctx.arc(px, py, (2.5 * (1 - pCycle * 0.5)) * scale, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(56, 189, 248, ${pAlpha})`;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 8 * scale;
    ctx.fill();
  }
  ctx.restore();

  // -------------------------------------------------------------------------
  // 3. DETACHED FLOATING MAGNETIC EAR PODS (INERTIAL LAG)
  // -------------------------------------------------------------------------
  const earLag = Math.sin(hoverTime - 0.4) * 0.08;
  const earPods = [
    { side: -1, x: -110 * scale, angle: -0.15 + earLag },
    { side: 1, x: 110 * scale, angle: 0.15 - earLag }
  ];

  for (const pod of earPods) {
    ctx.save();
    ctx.translate(pod.x, -10 * scale);
    ctx.rotate(pod.angle);

    // Magnetic energy arc between head and ear pod
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(pod.side * -18 * scale, 0);
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.65)';
    ctx.lineWidth = 3 * scale;
    ctx.stroke();

    // Sleek aerodynamic pod shell
    ctx.beginPath();
    ctx.ellipse(0, 0, 18 * scale, 38 * scale, 0, 0, Math.PI * 2);
    const podGrad = ctx.createLinearGradient(-18 * scale, 0, 18 * scale, 0);
    podGrad.addColorStop(0, '#f8fafc');
    podGrad.addColorStop(0.7, '#cbd5e1');
    podGrad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = podGrad;
    ctx.fill();
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 2.5 * scale;
    ctx.stroke();

    // Glowing cyan center audio ring
    ctx.beginPath();
    ctx.ellipse(0, 0, 8 * scale, 18 * scale, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10 * scale;
    ctx.fill();

    ctx.restore();
  }

  // -------------------------------------------------------------------------
  // 4. MAIN DROID HEAD & CHASSIS (PORCELAIN WHITE & TITANIUM ACCENTS)
  // -------------------------------------------------------------------------
  // Drop shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 24 * scale;
  ctx.shadowOffsetY = 12 * scale;

  ctx.beginPath();
  // Smooth chibi rounded capsule body
  ctx.ellipse(0, 0, 95 * scale, 90 * scale, 0, 0, Math.PI * 2);
  const chassisGrad = ctx.createRadialGradient(-25 * scale, -30 * scale, 10 * scale, 0, 0, 105 * scale);
  chassisGrad.addColorStop(0, '#ffffff');
  chassisGrad.addColorStop(0.6, '#f1f5f9');
  chassisGrad.addColorStop(0.9, '#e2e8f0');
  chassisGrad.addColorStop(1, '#94a3b8');
  ctx.fillStyle = chassisGrad;
  ctx.fill();

  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 3 * scale;
  ctx.stroke();

  // Antenna top fin with cyan beacon
  ctx.beginPath();
  ctx.moveTo(-10 * scale, -90 * scale);
  ctx.lineTo(0, -118 * scale);
  ctx.lineTo(10 * scale, -90 * scale);
  ctx.closePath();
  ctx.fillStyle = '#e2e8f0';
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(0, -120 * scale, 6 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#38bdf8';
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 12 * scale;
  ctx.fill();
  ctx.shadowColor = 'transparent';

  // -------------------------------------------------------------------------
  // 5. CURVED GLOSS VISOR (DARK SAPPHIRE GLASS)
  // -------------------------------------------------------------------------
  const visorW = 75 * scale;
  const visorH = 50 * scale;
  const visorY = 2 * scale;

  ctx.beginPath();
  ctx.ellipse(0, visorY, visorW, visorH, 0, 0, Math.PI * 2);
  const visorGrad = ctx.createLinearGradient(0, visorY - visorH, 0, visorY + visorH);
  visorGrad.addColorStop(0, '#090d16');
  visorGrad.addColorStop(0.5, '#0f172a');
  visorGrad.addColorStop(1, '#020617');
  ctx.fillStyle = visorGrad;
  ctx.fill();
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 3.5 * scale;
  ctx.stroke();

  // Glass specular reflection highlight arc
  ctx.beginPath();
  ctx.ellipse(-20 * scale, visorY - 22 * scale, 38 * scale, 12 * scale, -0.25, 0, Math.PI);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 3 * scale;
  ctx.stroke();

  // -------------------------------------------------------------------------
  // 6. LED HOLOGRAPHIC EMOTION DISPLAY (^ _ ^ & AUDIO BARS)
  // -------------------------------------------------------------------------
  ctx.save();
  ctx.shadowColor = '#06b6d4';
  ctx.shadowBlur = 14 * scale;
  ctx.strokeStyle = '#22d3ee';
  ctx.fillStyle = '#22d3ee';
  ctx.lineWidth = 4 * scale;
  ctx.lineCap = 'round';

  const ledEyeDist = 28 * scale;
  const ledEyeY = visorY - 4 * scale;

  for (const dir of [-1, 1]) {
    const eyeX = dir * ledEyeDist;
    ctx.beginPath();
    if (isBlinking) {
      // Sleek horizontal blink beam
      ctx.moveTo(eyeX - 12 * scale, ledEyeY);
      ctx.lineTo(eyeX + 12 * scale, ledEyeY);
    } else {
      // Tech happy chevron anime eyes ( ^ ^ )
      ctx.moveTo(eyeX - 12 * scale, ledEyeY + 4 * scale);
      ctx.lineTo(eyeX, ledEyeY - 9 * scale);
      ctx.lineTo(eyeX + 12 * scale, ledEyeY + 4 * scale);
    }
    ctx.stroke();
  }

  // Audio equalizer bars beneath visor eyes (speech simulator)
  const barCount = 7;
  const barW = 3.2 * scale;
  for (let b = 0; b < barCount; b++) {
    const bOffset = (b - (barCount - 1) / 2) * (7 * scale);
    const bHeight = (4 + Math.abs(Math.sin(time * 8 + b * 1.2)) * 12) * scale;
    ctx.fillRect(bOffset - barW / 2, visorY + 20 * scale - bHeight / 2, barW, bHeight);
  }

  // Subtle CRT horizontal scanline beam sweeping down visor
  const scanSweep = ((time * 65 * speed) % (visorH * 2)) - visorH;
  ctx.beginPath();
  ctx.moveTo(-visorW * 0.7, visorY + scanSweep);
  ctx.lineTo(visorW * 0.7, visorY + scanSweep);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  ctx.restore();

  ctx.restore();
}

