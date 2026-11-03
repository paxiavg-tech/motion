import { MotionConfig } from '../types/motion';

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeOutBack(t: number, overshoot = 1.35): number {
  const c1 = overshoot;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

function hash(n: number): number {
  const x = Math.sin(n) * 43758.5453123;
  return x - Math.floor(x);
}

// Draw a realistic 6-branch symmetrical crystalline snowflake
function drawSnowflake(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, rot: number, alpha: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
  ctx.lineWidth = Math.max(1, radius * 0.12);
  ctx.lineCap = 'round';

  for (let b = 0; b < 6; b++) {
    ctx.save();
    ctx.rotate((b * Math.PI) / 3);
    // Main stem
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -radius);
    ctx.stroke();

    // Side barbs
    const barb1 = -radius * 0.45;
    const barb2 = -radius * 0.75;
    const barbLen = radius * 0.28;

    ctx.beginPath();
    ctx.moveTo(0, barb1);
    ctx.lineTo(-barbLen, barb1 - barbLen * 0.6);
    ctx.moveTo(0, barb1);
    ctx.lineTo(barbLen, barb1 - barbLen * 0.6);

    ctx.moveTo(0, barb2);
    ctx.lineTo(-barbLen * 0.7, barb2 - barbLen * 0.4);
    ctx.moveTo(0, barb2);
    ctx.lineTo(barbLen * 0.7, barb2 - barbLen * 0.4);
    ctx.stroke();

    ctx.restore();
  }
  ctx.restore();
}

// ============================================================================
// 1. CHRISTMAS FLASH SALE: 3D GOLD BAUBLE & SNOWFLAKE STARBURST
// ============================================================================
// Features: Spinning luxury 3D Christmas bauble with golden filigree, velvet red
// silk ribbons orbiting with physics, crystalline snowflakes bursting, and
// flashing golden discount starburst rings.
// ============================================================================

export function drawChristmasFlashSaleOrnament(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const cx = width / 2;
  const cy = height * 0.46;

  // 1. Drifting Background Snowflakes
  const snowCount = 45;
  for (let s = 0; s < snowCount; s++) {
    const seed = s * 13.37;
    const speed = (0.04 + hash(seed) * 0.08) * (config.particleSpeed || 1);
    const sx = ((hash(seed + 1) + Math.sin(time * 0.5 + seed) * 0.05) % 1) * width;
    const sy = ((hash(seed + 2) + time * speed) % 1) * height;
    const sRadius = (6 + hash(seed + 3) * 16) * scale;
    const sAlpha = 0.2 + hash(seed + 4) * 0.45;
    const sRot = time * (hash(seed + 5) - 0.5) * 2;
    drawSnowflake(ctx, sx, sy, sRadius, sRot, sAlpha);
  }

  // 2. Festive Red & Gold Orbiting Silk Ribbons
  ctx.save();
  const ribbonCount = 2;
  for (let r = 0; r < ribbonCount; r++) {
    const rDir = r === 0 ? 1 : -1;
    ctx.beginPath();
    for (let t = -Math.PI; t <= Math.PI; t += 0.05) {
      const radX = (280 + r * 40) * scale;
      const radY = (90 + r * 20) * scale;
      const rx = cx + Math.cos(t + time * 1.5 * rDir) * radX;
      const ry = cy + Math.sin(t + time * 1.5 * rDir) * radY + Math.cos(t * 3 + time * 2) * 25 * scale;
      if (t === -Math.PI) ctx.moveTo(rx, ry);
      else ctx.lineTo(rx, ry);
    }
    ctx.strokeStyle = r === 0 ? 'rgba(239, 68, 68, 0.75)' : 'rgba(251, 191, 36, 0.85)';
    ctx.lineWidth = (8 - r * 2) * scale;
    ctx.shadowColor = r === 0 ? '#ef4444' : '#f59e0b';
    ctx.shadowBlur = 12 * scale;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }
  ctx.restore();

  // 3. Central 3D Hanging Golden Christmas Bauble
  const baubleR = 120 * scale;
  const swing = Math.sin(time * 2.2) * 0.06;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(swing);

  // Hanging Golden Cap & Cord
  ctx.beginPath();
  ctx.moveTo(0, -baubleR - 80 * scale);
  ctx.lineTo(0, -baubleR);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // Metal Crown Cap
  ctx.beginPath();
  ctx.roundRect(-22 * scale, -baubleR - 18 * scale, 44 * scale, 20 * scale, 4 * scale);
  ctx.fillStyle = '#eab308';
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Bauble Body - 3D Spherical Radial Gradient
  ctx.beginPath();
  ctx.arc(0, 0, baubleR, 0, Math.PI * 2);
  const sphereGrad = ctx.createRadialGradient(
    -baubleR * 0.35,
    -baubleR * 0.35,
    baubleR * 0.05,
    0,
    0,
    baubleR
  );
  sphereGrad.addColorStop(0, '#ffffff'); // Specular highlight
  sphereGrad.addColorStop(0.2, '#fef08a'); // Warm champagne
  sphereGrad.addColorStop(0.5, '#eab308'); // Pure 24K gold
  sphereGrad.addColorStop(0.85, '#92400e'); // Deep amber shadow
  sphereGrad.addColorStop(1, '#451a03'); // Velvet occlusion
  ctx.fillStyle = sphereGrad;
  ctx.fill();

  // Rotating Surface Filigree (Intricate Snowflakes etched on gold)
  ctx.save();
  ctx.rotate(time * 0.6);
  drawSnowflake(ctx, 0, 0, baubleR * 0.65, time * 0.3, 0.4);
  ctx.restore();

  // Outer Shimmer Edge
  ctx.beginPath();
  ctx.arc(0, 0, baubleR, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.8)';
  ctx.lineWidth = 2.5 * scale;
  ctx.stroke();

  ctx.restore();

  // 4. "FLASH SALE" Holiday Banner & Rosette Badge
  const bannerY = height * 0.74;
  const pulse = Math.sin(time * 6) * 0.04 + 1.0;

  ctx.save();
  ctx.translate(cx, bannerY);
  ctx.scale(pulse, pulse);

  // Red Ribbon Banner Base
  const bW = Math.min(width * 0.78, 460 * scale);
  const bH = 56 * scale;
  ctx.beginPath();
  ctx.roundRect(-bW / 2, -bH / 2, bW, bH, 12 * scale);
  const redGrad = ctx.createLinearGradient(-bW / 2, 0, bW / 2, 0);
  redGrad.addColorStop(0, '#b91c1c');
  redGrad.addColorStop(0.5, '#dc2626');
  redGrad.addColorStop(1, '#991b1b');
  ctx.fillStyle = redGrad;
  ctx.fill();

  // Gold Trim Border
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2.5 * scale;
  ctx.stroke();

  // Corner Holly Berries Accent
  [-bW / 2 + 18 * scale, bW / 2 - 18 * scale].forEach((hx) => {
    ctx.beginPath();
    ctx.arc(hx, 0, 6 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ef4444';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hx + 6 * scale, -4 * scale, 5 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(hx - 5 * scale, -3 * scale, 5 * scale, 0, Math.PI * 2);
    ctx.fill();
  });

  // Banner Text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${22 * scale}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🎄 CHRISTMAS FLASH SALE 🎄', 0, -2 * scale);

  ctx.restore();

  // Subtitle / Percentage Callout below banner
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = `800 ${15 * scale}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = '#fef08a';
  ctx.fillText('UP TO 70% OFF // LIMITED HOLIDAY EDITION', cx, bannerY + 48 * scale);
  ctx.restore();
}

// ============================================================================
// 2. CHRISTMAS GIFT BOX UNBOXING: VELVET PRESENT & GOLDEN SPARKLE REVEAL
// ============================================================================
// Features: 3D isometric velvet red gift box with gold ribbon, ribbon untying,
// box lid popping off, golden stars and crystal confetti exploding upwards,
// casting radiant rays from within.
// ============================================================================

export function drawChristmasGiftBoxReveal(
  ctx: CanvasRenderingContext2D,
  _config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const cx = width / 2;
  const cy = height * 0.54;

  // Unboxing cycle stages over progress:
  // 0.0 - 0.25: Box idling with tension pulse
  // 0.25 - 0.50: Ribbon untying & expanding
  // 0.50 - 0.80: Lid lifting off & starry burst
  // 0.80 - 1.00: Radiant golden light beams illuminating upwards
  const unboxProgress = clamp((progress - 0.25) / 0.55, 0, 1);
  const lidLiftT = easeOutBack(unboxProgress, 1.4);
  const lidY = -lidLiftT * 180 * scale;
  const lidRot = -lidLiftT * 0.22;

  // 1. Radiant Beams Emitting from Inside the Box
  if (unboxProgress > 0.3) {
    const rayAlpha = easeOutCubic((unboxProgress - 0.3) / 0.7) * 0.65;
    ctx.save();
    ctx.translate(cx, cy - 40 * scale);
    for (let r = 0; r < 12; r++) {
      const angle = (r / 12) * Math.PI * 2 + time * 0.4;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(angle - 0.12) * 380 * scale, Math.sin(angle - 0.12) * 380 * scale);
      ctx.lineTo(Math.cos(angle + 0.12) * 380 * scale, Math.sin(angle + 0.12) * 380 * scale);
      ctx.closePath();
      const beamGrad = ctx.createRadialGradient(0, 0, 10 * scale, 0, 0, 380 * scale);
      beamGrad.addColorStop(0, `rgba(254, 240, 138, ${rayAlpha})`);
      beamGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = beamGrad;
      ctx.fill();
    }
    ctx.restore();
  }

  // 2. Exploding Golden Stars & Christmas Confetti Shower
  if (unboxProgress > 0.2) {
    const burstP = (unboxProgress - 0.2) / 0.8;
    ctx.save();
    for (let i = 0; i < 40; i++) {
      const seed = i * 19.82;
      const angle = hash(seed) * Math.PI * 2;
      const dist = (hash(seed + 1) * 260 + burstP * 140) * scale;
      const px = cx + Math.cos(angle) * dist;
      const py = cy - 40 * scale - Math.sin(burstP * Math.PI) * (180 + hash(seed + 2) * 120) * scale;
      const starR = (hash(seed + 3) * 6 + 4) * scale;
      const starAlpha = (1 - burstP) * 0.9;

      // Draw 4-point star glint
      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(time * 3 + seed);
      ctx.fillStyle = i % 2 === 0 ? `rgba(254, 240, 138, ${starAlpha})` : `rgba(239, 68, 68, ${starAlpha})`;
      ctx.beginPath();
      ctx.moveTo(-starR, 0);
      ctx.lineTo(-starR * 0.2, -starR * 0.2);
      ctx.lineTo(0, -starR);
      ctx.lineTo(starR * 0.2, -starR * 0.2);
      ctx.lineTo(starR, 0);
      ctx.lineTo(starR * 0.2, starR * 0.2);
      ctx.lineTo(0, starR);
      ctx.lineTo(-starR * 0.2, starR * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  // 3. Isometric 3D Velvet Red Gift Box Base
  const boxW = 200 * scale;
  const boxH = 140 * scale;

  ctx.save();
  ctx.translate(cx, cy);

  // Left Face (Shadowed velvet)
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-boxW * 0.86, -boxH * 0.5);
  ctx.lineTo(-boxW * 0.86, boxH * 0.5);
  ctx.lineTo(0, boxH);
  ctx.closePath();
  ctx.fillStyle = '#7f1d1d';
  ctx.fill();
  ctx.strokeStyle = '#991b1b';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Left Face Gold Ribbon Band
  ctx.beginPath();
  ctx.moveTo(-boxW * 0.43, -boxH * 0.25);
  ctx.lineTo(-boxW * 0.43 + 24 * scale, -boxH * 0.25 + 14 * scale);
  ctx.lineTo(-boxW * 0.43 + 24 * scale, boxH * 0.75 + 14 * scale);
  ctx.lineTo(-boxW * 0.43, boxH * 0.75);
  ctx.closePath();
  ctx.fillStyle = '#f59e0b';
  ctx.fill();

  // Right Face (Lit velvet)
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(boxW * 0.86, -boxH * 0.5);
  ctx.lineTo(boxW * 0.86, boxH * 0.5);
  ctx.lineTo(0, boxH);
  ctx.closePath();
  ctx.fillStyle = '#b91c1c';
  ctx.fill();
  ctx.strokeStyle = '#dc2626';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Right Face Gold Ribbon Band
  ctx.beginPath();
  ctx.moveTo(boxW * 0.43, -boxH * 0.25);
  ctx.lineTo(boxW * 0.43 - 24 * scale, -boxH * 0.25 + 14 * scale);
  ctx.lineTo(boxW * 0.43 - 24 * scale, boxH * 0.75 + 14 * scale);
  ctx.lineTo(boxW * 0.43, boxH * 0.75);
  ctx.closePath();
  ctx.fillStyle = '#fbbf24';
  ctx.fill();

  // 4. Detached 3D Box Lid (Lifting & Tilting Off)
  ctx.save();
  ctx.translate(0, lidY);
  ctx.rotate(lidRot);

  const lidW = boxW * 1.08;
  const lidH = boxH * 0.25;

  // Top Face of Lid
  ctx.beginPath();
  ctx.moveTo(0, -lidH * 2);
  ctx.lineTo(lidW * 0.86, -lidH * 3);
  ctx.lineTo(0, -lidH * 4);
  ctx.lineTo(-lidW * 0.86, -lidH * 3);
  ctx.closePath();
  ctx.fillStyle = '#dc2626';
  ctx.fill();

  // Gold Cross Ribbons on Top Face
  ctx.beginPath();
  ctx.moveTo(0, -lidH * 2);
  ctx.lineTo(0, -lidH * 4);
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 20 * scale;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-lidW * 0.86, -lidH * 3);
  ctx.lineTo(lidW * 0.86, -lidH * 3);
  ctx.stroke();

  // Golden Ribbon Bow on Top of Lid
  ctx.beginPath();
  ctx.arc(-20 * scale, -lidH * 3.3, 18 * scale, 0, Math.PI * 2);
  ctx.arc(20 * scale, -lidH * 3.3, 18 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#fde047';
  ctx.fill();
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  ctx.restore(); // Lid
  ctx.restore(); // Box base

  // Header Title
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = `800 ${24 * scale}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🎁 HOLIDAY GIFT UNBOXING REVEAL 🎁', cx, height * 0.12);
  ctx.font = `600 ${14 * scale}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = '#fef08a';
  ctx.fillText('SPECIAL CHRISTMAS SURPRISE & EXCLUSIVE PROMO', cx, height * 0.15 + 10 * scale);
  ctx.restore();
}

// ============================================================================
// 3. CHRISTMAS FROSTED ICE SALE TAG: REAL GRAVITY PENDULUM SWING
// ============================================================================
// Features: Translucent frosted ice glass tag hanging by a golden Christmas cord,
// realistic pendulum swing physics, crystallizing frost spreading on edges,
// and 3D drifting crystalline snowflakes.
// ============================================================================

export function drawChristmasFrostedIceTag(
  ctx: CanvasRenderingContext2D,
  _config: MotionConfig,
  time: number,
  _progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const cx = width / 2;
  const anchorY = 0;

  // Real Pendulum Physics
  const swingAngle = Math.sin(time * 2.4) * 0.14;
  const cordLen = 220 * scale;

  // Background Drifting Snowflakes
  for (let s = 0; s < 30; s++) {
    const seed = s * 17.51;
    const sx = ((hash(seed) + Math.sin(time * 0.6 + seed) * 0.04) % 1) * width;
    const sy = ((hash(seed + 1) + time * 0.06) % 1) * height;
    drawSnowflake(ctx, sx, sy, (8 + hash(seed + 2) * 14) * scale, time * 0.5 + seed, 0.35);
  }

  ctx.save();
  ctx.translate(cx, anchorY);
  ctx.rotate(swingAngle);

  // Golden Christmas Braided Cord
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, cordLen);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 3 * scale;
  ctx.setLineDash([6 * scale, 3 * scale]);
  ctx.stroke();
  ctx.setLineDash([]);

  // Tag Eyelet Grommet (Gold metal ring)
  ctx.beginPath();
  ctx.arc(0, cordLen, 12 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#eab308';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, cordLen, 6 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#0f172a';
  ctx.fill();

  // Ice Tag Body
  const tagW = 280 * scale;
  const tagH = 420 * scale;
  ctx.translate(0, cordLen + 20 * scale);

  ctx.beginPath();
  // Luggage tag shape with chamfered top shoulders
  ctx.moveTo(-tagW * 0.25, 0);
  ctx.lineTo(tagW * 0.25, 0);
  ctx.lineTo(tagW / 2, tagH * 0.18);
  ctx.lineTo(tagW / 2, tagH);
  ctx.lineTo(-tagW / 2, tagH);
  ctx.lineTo(-tagW / 2, tagH * 0.18);
  ctx.closePath();

  // Frosted Ice Translucent Glass Gradient
  const iceGrad = ctx.createLinearGradient(-tagW / 2, 0, tagW / 2, tagH);
  iceGrad.addColorStop(0, 'rgba(224, 242, 254, 0.45)');
  iceGrad.addColorStop(0.5, 'rgba(186, 230, 253, 0.25)');
  iceGrad.addColorStop(1, 'rgba(125, 211, 252, 0.4)');
  ctx.fillStyle = iceGrad;
  ctx.fill();

  // Crystalline Frost Rim Border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 2.5 * scale;
  ctx.stroke();

  // Festive Holly Leaves & Berries Embellishment
  ctx.beginPath();
  ctx.arc(0, tagH * 0.32, 42 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#dc2626';
  ctx.fill();
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // Big Bold Discount Stamp inside badge
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `900 ${28 * scale}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('50%', 0, tagH * 0.30);
  ctx.font = `800 ${14 * scale}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillText('OFF', 0, tagH * 0.36);

  // Tag Typography
  ctx.font = `800 ${22 * scale}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('WINTER SALE', 0, tagH * 0.58);

  ctx.font = `600 ${12 * scale}px 'Plus Jakarta Sans', monospace`;
  ctx.fillStyle = '#e0f2fe';
  ctx.fillText('SPECIAL CHRISTMAS DEAL', 0, tagH * 0.68);

  // Barcode lines at bottom of tag
  const barStart = -tagW * 0.35;
  const barEnd = tagW * 0.35;
  const barY = tagH * 0.84;
  for (let b = barStart; b <= barEnd; b += 8 * scale) {
    const isThick = hash(b) > 0.4;
    ctx.beginPath();
    ctx.moveTo(b, barY);
    ctx.lineTo(b, barY + 30 * scale);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = (isThick ? 3.5 : 1.5) * scale;
    ctx.stroke();
  }

  ctx.restore();
}

// ============================================================================
// 4. CHRISTMAS GOLDEN GARLAND RIBBON & FAIRY LIGHT BOKEH
// ============================================================================
// Features: Sweeping velvet red and gold foil ribbons flowing across the screen,
// warm glowing fairy lights strung across pine garland with pulsating halos,
// and floating luxury champagne bokeh.
// ============================================================================

export function drawChristmasGoldenGarlandRibbon(
  ctx: CanvasRenderingContext2D,
  _config: MotionConfig,
  time: number,
  _progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  // 1. Warm Glowing Fairy Light Bokeh Orbs
  for (let b = 0; b < 25; b++) {
    const seed = b * 23.41;
    const bx = ((hash(seed) + Math.sin(time * 0.3 + seed) * 0.05) % 1) * width;
    const by = ((hash(seed + 1) + Math.cos(time * 0.3 + seed) * 0.05) % 1) * height;
    const bRadius = (25 + hash(seed + 2) * 55) * scale;
    const bPulse = 0.15 + Math.sin(time * 2 + seed) * 0.08;

    const bGrad = ctx.createRadialGradient(bx, by, 0, bx, by, bRadius);
    bGrad.addColorStop(0, b % 2 === 0 ? 'rgba(254, 240, 138, 0.4)' : 'rgba(239, 68, 68, 0.35)');
    bGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.arc(bx, by, bRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Flowing Velvet Red & Gold Foil Ribbon Waves
  const waves = 4;
  for (let w = 0; w < waves; w++) {
    const yCenter = height * (0.3 + (w / waves) * 0.45);
    ctx.save();
    ctx.beginPath();
    for (let x = 0; x <= width; x += 20 * scale) {
      const nx = x / width;
      const waveY =
        yCenter +
        Math.sin(nx * 5 + time * 1.5 + w * 1.2) * 55 * scale +
        Math.cos(nx * 8 - time * 0.8 + w) * 30 * scale;
      if (x === 0) ctx.moveTo(x, waveY);
      else ctx.lineTo(x, waveY);
    }
    ctx.strokeStyle = w % 2 === 0 ? 'rgba(185, 28, 28, 0.85)' : 'rgba(234, 179, 8, 0.9)';
    ctx.lineWidth = (16 - w * 2.5) * scale;
    ctx.shadowColor = w % 2 === 0 ? '#dc2626' : '#fde047';
    ctx.shadowBlur = 18 * scale;
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
  }

  // 3. Strung Holiday Fairy Lights along top arch
  const bulbCount = 14;
  for (let bl = 0; bl < bulbCount; bl++) {
    const bx = (bl / (bulbCount - 1)) * width;
    const by = 80 * scale + Math.sin((bl / bulbCount) * Math.PI) * 120 * scale;
    const bulbGlow = 0.5 + Math.sin(time * 5 + bl * 0.9) * 0.4;

    // Glowing halo
    ctx.beginPath();
    ctx.arc(bx, by, 22 * scale, 0, Math.PI * 2);
    ctx.fillStyle = bl % 3 === 0 ? `rgba(239, 68, 68, ${bulbGlow * 0.4})` : bl % 3 === 1 ? `rgba(234, 179, 8, ${bulbGlow * 0.5})` : `rgba(34, 197, 94, ${bulbGlow * 0.4})`;
    ctx.fill();

    // Bulb glass bead
    ctx.beginPath();
    ctx.arc(bx, by, 7 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }
}

// ============================================================================
// 5. HOLIDAY & NEW YEAR SPARKLER: GOLDEN SPARKS & DANCING CELEBRATION TRAILS
// ============================================================================
// Features: Dancing Christmas & New Year sparkler light trails, energetic burning
// sparks flying outwards, starry festive embers, and rich midnight celebration warmth.
// ============================================================================

export function drawHolidayNewYearSparkler(
  ctx: CanvasRenderingContext2D,
  _config: MotionConfig,
  time: number,
  _progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const cx = width / 2;
  const cy = height * 0.48;

  // Dancing Figure-Eight Sparkler Tip Path
  const t = time * 2.2;
  const tipX = cx + Math.sin(t) * 180 * scale;
  const tipY = cy + Math.sin(t * 2) * 80 * scale;

  // Background Golden Dust & Twinkling Night Stars
  for (let st = 0; st < 50; st++) {
    const seed = st * 31.17;
    const sx = hash(seed) * width;
    const sy = hash(seed + 1) * height;
    const sAlpha = 0.2 + Math.sin(time * 4 + seed) * 0.3;
    ctx.beginPath();
    ctx.arc(sx, sy, (1.5 + hash(seed + 2) * 2) * scale, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 240, 138, ${sAlpha})`;
    ctx.fill();
  }

  // Burning Sparkler Head (Intense White Center)
  ctx.save();
  ctx.beginPath();
  ctx.arc(tipX, tipY, 12 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#fde047';
  ctx.shadowBlur = 30 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Flying Sparkler Sparks in All Directions
  const sparkCount = 65;
  for (let sp = 0; sp < sparkCount; sp++) {
    const seed = sp * 7.77 + Math.floor(time * 30);
    const angle = hash(seed) * Math.PI * 2;
    const dist = (hash(seed + 1) * 90 + 20) * scale;
    const sparkX = tipX + Math.cos(angle) * dist;
    const sparkY = tipY + Math.sin(angle) * dist;
    const sparkLen = (hash(seed + 2) * 12 + 6) * scale;

    ctx.beginPath();
    ctx.moveTo(sparkX, sparkY);
    ctx.lineTo(sparkX + Math.cos(angle) * sparkLen, sparkY + Math.sin(angle) * sparkLen);
    ctx.strokeStyle = sp % 3 === 0 ? '#ffffff' : '#fde047';
    ctx.lineWidth = (hash(seed + 3) * 2 + 1) * scale;
    ctx.stroke();
  }

  // Celebratory Header Text
  ctx.textAlign = 'center';
  ctx.font = `900 ${24 * scale}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('✨ HOLIDAY & NEW YEAR SPARKLER CELEBRATION ✨', cx, height * 0.16);
  ctx.font = `600 ${14 * scale}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = '#fef08a';
  ctx.fillText('FESTIVE AMBIENCE // MERRY CHRISTMAS & HAPPY NEW YEAR', cx, height * 0.16 + 26 * scale);

  ctx.restore();
}

// ============================================================================
// 6. OBJECT: CHRISTMAS 2026 MIRACLE SNOW GLOBE & 2027 AURORA PORTAL
// ============================================================================
// High-Demand 3D Crystal Snow Globe Object:
// Crystal sphere with refraction, mahogany & brass engraved base plate,
// illuminated mini Christmas tree 2026 inside, swirling vortex blizzard snow,
// and glowing holographic "2026" morphing into "2027" with aurora borealis ribbons.
// ============================================================================

export function drawChristmas2026SnowGlobePortal(
  ctx: CanvasRenderingContext2D,
  _config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const cx = width / 2;
  const cy = height * 0.44;
  const globeR = 190 * scale;

  // 1. Ambient Background Drifting Snowflakes
  for (let s = 0; s < 30; s++) {
    const seed = s * 14.17;
    const sx = ((hash(seed) + Math.sin(time * 0.3 + seed) * 0.05) % 1) * width;
    const sy = ((hash(seed + 1) + time * 0.04) % 1) * height;
    ctx.beginPath();
    ctx.arc(sx, sy, (hash(seed + 2) * 2 + 1) * scale, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(254, 240, 138, 0.35)';
    ctx.fill();
  }

  // 2. Snow Globe Base Pedestal (Mahogany Wood & Brass Trim)
  const baseTopY = cy + globeR * 0.82;
  const baseBotY = baseTopY + 80 * scale;
  const baseTopW = 260 * scale;
  const baseBotW = 320 * scale;

  ctx.save();
  // Mahogany Base Body
  ctx.beginPath();
  ctx.moveTo(cx - baseTopW / 2, baseTopY);
  ctx.lineTo(cx + baseTopW / 2, baseTopY);
  ctx.lineTo(cx + baseBotW / 2, baseBotY);
  ctx.lineTo(cx - baseBotW / 2, baseBotY);
  ctx.closePath();
  const woodGrad = ctx.createLinearGradient(cx - baseBotW / 2, baseTopY, cx + baseBotW / 2, baseBotY);
  woodGrad.addColorStop(0, '#3f1d0b');
  woodGrad.addColorStop(0.3, '#7c2d12');
  woodGrad.addColorStop(0.7, '#451a03');
  woodGrad.addColorStop(1, '#1c0a00');
  ctx.fillStyle = woodGrad;
  ctx.fill();

  // Brass Plaque Trim on Pedestal
  const plaqueW = 210 * scale;
  const plaqueH = 34 * scale;
  const plaqueY = baseTopY + 24 * scale;
  ctx.beginPath();
  ctx.roundRect(cx - plaqueW / 2, plaqueY, plaqueW, plaqueH, 4 * scale);
  const brassGrad = ctx.createLinearGradient(cx - plaqueW / 2, plaqueY, cx + plaqueW / 2, plaqueY);
  brassGrad.addColorStop(0, '#ca8a04');
  brassGrad.addColorStop(0.5, '#fef08a');
  brassGrad.addColorStop(1, '#a16207');
  ctx.fillStyle = brassGrad;
  ctx.fill();
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Plaque Inscription
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `800 ${11 * scale}px 'Plus Jakarta Sans', monospace`;
  ctx.fillStyle = '#451a03';
  ctx.fillText('NATAL 2026 ★ TAHUN BARU 2027', cx, plaqueY + plaqueH / 2);
  ctx.restore();

  // 3. Inside Globe: Aurora Borealis Sky & Swirling Blizzard
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, globeR - 4 * scale, 0, Math.PI * 2);
  ctx.clip(); // Restrict internal elements to inside the crystal glass

  // Internal Sky Gradient (Deep Midnight Blue to Pine Green)
  const skyGrad = ctx.createRadialGradient(cx, cy - 60 * scale, 20 * scale, cx, cy, globeR);
  skyGrad.addColorStop(0, '#064e3b');
  skyGrad.addColorStop(0.5, '#0f172a');
  skyGrad.addColorStop(1, '#020617');
  ctx.fillStyle = skyGrad;
  ctx.fill();

  // Dancing Green & Violet Aurora Waves Inside Globe
  for (let aw = 0; aw < 3; aw++) {
    ctx.beginPath();
    ctx.moveTo(cx - globeR, cy - 40 * scale);
    for (let ax = cx - globeR; ax <= cx + globeR; ax += 15 * scale) {
      const nax = (ax - (cx - globeR)) / (globeR * 2);
      const wave = Math.sin(nax * 5 + time * 1.8 + aw * 1.2) * 28 * scale;
      ctx.lineTo(ax, cy - 80 * scale + wave + aw * 20 * scale);
    }
    ctx.strokeStyle = aw === 0 ? 'rgba(52, 211, 153, 0.45)' : aw === 1 ? 'rgba(167, 139, 250, 0.35)' : 'rgba(254, 240, 138, 0.3)';
    ctx.lineWidth = 14 * scale;
    ctx.stroke();
  }

  // Snowy Ground Hill Inside
  ctx.beginPath();
  ctx.ellipse(cx, cy + globeR * 0.72, globeR * 0.9, 50 * scale, 0, 0, Math.PI * 2);
  const snowHillGrad = ctx.createLinearGradient(0, cy + globeR * 0.5, 0, cy + globeR);
  snowHillGrad.addColorStop(0, '#ffffff');
  snowHillGrad.addColorStop(0.5, '#e0f2fe');
  snowHillGrad.addColorStop(1, '#94a3b8');
  ctx.fillStyle = snowHillGrad;
  ctx.fill();

  // Illuminated Mini Pine Christmas Tree 2026 Inside
  const treeBaseY = cy + globeR * 0.70;
  const treeH = 110 * scale;
  const treeW = 75 * scale;
  ctx.beginPath();
  ctx.moveTo(cx, treeBaseY - treeH);
  ctx.lineTo(cx + treeW * 0.35, treeBaseY - treeH * 0.55);
  ctx.lineTo(cx + treeW * 0.22, treeBaseY - treeH * 0.55);
  ctx.lineTo(cx + treeW * 0.45, treeBaseY - treeH * 0.25);
  ctx.lineTo(cx + treeW * 0.3, treeBaseY - treeH * 0.25);
  ctx.lineTo(cx + treeW * 0.5, treeBaseY);
  ctx.lineTo(cx - treeW * 0.5, treeBaseY);
  ctx.lineTo(cx - treeW * 0.3, treeBaseY - treeH * 0.25);
  ctx.lineTo(cx - treeW * 0.45, treeBaseY - treeH * 0.25);
  ctx.lineTo(cx - treeW * 0.22, treeBaseY - treeH * 0.55);
  ctx.lineTo(cx - treeW * 0.35, treeBaseY - treeH * 0.55);
  ctx.closePath();
  ctx.fillStyle = '#065f46';
  ctx.fill();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Glowing Gold Star atop the Tree
  ctx.beginPath();
  ctx.arc(cx, treeBaseY - treeH - 4 * scale, 6 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#fef08a';
  ctx.shadowColor = '#eab308';
  ctx.shadowBlur = 10 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Swirling Blizzard Snow Particles (Vortex Physics Inside Crystal Sphere)
  const blizzardCount = 50;
  for (let b = 0; b < blizzardCount; b++) {
    const bSeed = b * 9.31;
    const bAngle = time * 2.5 + bSeed;
    const bDist = (hash(bSeed + 1) * (globeR * 0.75)) * scale;
    const bx = cx + Math.cos(bAngle) * bDist;
    const by = cy + Math.sin(bAngle * 0.7) * bDist * 0.8;
    const bSize = (hash(bSeed + 2) * 2.5 + 1.2) * scale;
    ctx.beginPath();
    ctx.arc(bx, by, bSize, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fill();
  }

  // Levitating 2026 -> 2027 Year Morph Hologram Inside
  const isYearTransition = (time * 0.4) % 1 > 0.5;
  const yearText = isYearTransition ? '2027' : '2026';
  const yearSub = isYearTransition ? 'NEW YEAR' : 'NATAL';
  const yearAlpha = 0.85 + Math.sin(time * 6) * 0.15;

  ctx.textAlign = 'center';
  ctx.font = `900 ${28 * scale}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = `rgba(254, 240, 138, ${yearAlpha})`;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 16 * scale;
  ctx.fillText(yearText, cx, cy - 25 * scale);
  ctx.shadowBlur = 0;

  ctx.font = `800 ${10 * scale}px 'Plus Jakarta Sans', monospace`;
  ctx.fillStyle = '#6ee7b7';
  ctx.fillText(yearSub, cx, cy - 5 * scale);

  ctx.restore(); // End clipping inside globe

  // 4. Optical Crystal Glass Surface Reflections & Bevels (Drawn Outside Clip)
  ctx.save();
  // Outer Glass Rim
  ctx.beginPath();
  ctx.arc(cx, cy, globeR, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 3 * scale;
  ctx.stroke();

  // Curved Specular Glint (Top-Left Crescent Highlight)
  ctx.beginPath();
  ctx.arc(cx - 20 * scale, cy - 20 * scale, globeR * 0.85, -Math.PI * 0.75, -Math.PI * 0.25);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.lineWidth = 7 * scale;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Secondary Bottom-Right Subtle Reflection
  ctx.beginPath();
  ctx.arc(cx + 15 * scale, cy + 15 * scale, globeR * 0.9, Math.PI * 0.25, Math.PI * 0.45);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 4 * scale;
  ctx.stroke();
  ctx.restore();

  // Header Title
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = `900 ${24 * scale}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('🎄 CHRISTMAS 2026 & NEW YEAR 2027 🎆', cx, height * 0.10);
  ctx.font = `600 ${13 * scale}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = '#fef08a';
  ctx.fillText('3D CRYSTAL SNOW GLOBE // DUAL-HOLIDAY CELEBRATION', cx, height * 0.10 + 26 * scale);
  ctx.restore();
}

// ============================================================================
// 7. OBJECT / OVERLAY: GOLDEN HOURGLASS 2026 TO 2027 STARDUST TIME FLIP
// ============================================================================
// Features: Ornate mechanical brass & crystal hourglass, golden luminescent
// sand of time flowing down from December 2026 into Welcome 2027, rotating
// celestial zodiac ring, and warm champagne celebration glints.
// ============================================================================

export function drawGoldenHourglass2026To2027(
  ctx: CanvasRenderingContext2D,
  _config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const cx = width / 2;
  const cy = height * 0.48;

  // 1. Rotating Celestial Roman Ring & Halo in Background
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(time * 0.25);
  const ringR = 260 * scale;
  ctx.beginPath();
  ctx.arc(0, 0, ringR, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(234, 179, 8, 0.35)';
  ctx.lineWidth = 2 * scale;
  ctx.setLineDash([8 * scale, 6 * scale]);
  ctx.stroke();

  // 12 Celestial Marker Dots
  for (let m = 0; m < 12; m++) {
    const ma = (m / 12) * Math.PI * 2;
    ctx.beginPath();
    ctx.arc(Math.cos(ma) * ringR, Math.sin(ma) * ringR, 4 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.fill();
  }
  ctx.restore();

  // 2. Brass Hourglass Frame (Top & Bottom Plates, Columns)
  const bulbH = 150 * scale;
  const bulbW = 120 * scale;
  const plateW = 280 * scale;
  const plateH = 22 * scale;

  ctx.save();
  ctx.translate(cx, cy);

  // Top Brass Plate
  ctx.beginPath();
  ctx.roundRect(-plateW / 2, -bulbH - plateH, plateW, plateH, 6 * scale);
  const brassGrad = ctx.createLinearGradient(-plateW / 2, 0, plateW / 2, 0);
  brassGrad.addColorStop(0, '#ca8a04');
  brassGrad.addColorStop(0.5, '#fef08a');
  brassGrad.addColorStop(1, '#854d0e');
  ctx.fillStyle = brassGrad;
  ctx.fill();
  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Bottom Brass Plate
  ctx.beginPath();
  ctx.roundRect(-plateW / 2, bulbH, plateW, plateH, 6 * scale);
  ctx.fillStyle = brassGrad;
  ctx.fill();
  ctx.stroke();

  // Brass Supporting Columns (Left & Right)
  [-plateW * 0.4, plateW * 0.4].forEach((colX) => {
    ctx.beginPath();
    ctx.roundRect(colX - 8 * scale, -bulbH, 16 * scale, bulbH * 2, 8 * scale);
    ctx.fillStyle = brassGrad;
    ctx.fill();
    ctx.stroke();
  });

  // 3. Double-Bulb Crystal Glass Body
  ctx.beginPath();
  // Top bulb
  ctx.moveTo(-bulbW, -bulbH);
  ctx.bezierCurveTo(-bulbW * 0.9, -bulbH * 0.3, -20 * scale, -20 * scale, -10 * scale, 0);
  // Bottom bulb
  ctx.bezierCurveTo(-20 * scale, 20 * scale, -bulbW * 0.9, bulbH * 0.3, -bulbW, bulbH);
  ctx.lineTo(bulbW, bulbH);
  ctx.bezierCurveTo(bulbW * 0.9, bulbH * 0.3, 20 * scale, 20 * scale, 10 * scale, 0);
  ctx.bezierCurveTo(20 * scale, -20 * scale, bulbW * 0.9, -bulbH * 0.3, bulbW, -bulbH);
  ctx.closePath();

  const glassGrad = ctx.createLinearGradient(-bulbW, 0, bulbW, 0);
  glassGrad.addColorStop(0, 'rgba(255, 255, 255, 0.18)');
  glassGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
  glassGrad.addColorStop(1, 'rgba(255, 255, 255, 0.18)');
  ctx.fillStyle = glassGrad;
  ctx.fill();
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.65)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  // 4. Stardust Sand of Time Flowing Down
  // Top Bulb: Sand Level Decreasing (Natal 2026 draining)
  const flowT = (time * 0.8) % 1;
  const topSandY = -bulbH + (flowT * (bulbH * 0.65));
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-bulbW * 0.8, topSandY);
  ctx.bezierCurveTo(-bulbW * 0.4, topSandY + 20 * scale, bulbW * 0.4, topSandY + 20 * scale, bulbW * 0.8, topSandY);
  ctx.bezierCurveTo(bulbW * 0.7, -20 * scale, 20 * scale, -15 * scale, 10 * scale, 0);
  ctx.lineTo(-10 * scale, 0);
  ctx.bezierCurveTo(-20 * scale, -15 * scale, -bulbW * 0.7, -20 * scale, -bulbW * 0.8, topSandY);
  ctx.closePath();
  ctx.fillStyle = 'rgba(234, 179, 8, 0.85)';
  ctx.fill();
  ctx.restore();

  // Center Stardust Stream Pouring Through Neck
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, bulbH - 30 * scale);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3 * scale;
  ctx.shadowColor = '#fef08a';
  ctx.shadowBlur = 12 * scale;
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Stream Spray Droplets
  for (let sp = 0; sp < 15; sp++) {
    const spY = (sp / 15) * (bulbH - 30 * scale);
    const spX = (hash(sp + time * 10) - 0.5) * 8 * scale;
    ctx.beginPath();
    ctx.arc(spX, spY, 2 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#fde047';
    ctx.fill();
  }

  // Bottom Bulb: Sand Mound Accumulating (Tahun Baru 2027 filling)
  const botSandHeight = 30 * scale + (flowT * 40 * scale);
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(-bulbW * 0.85, bulbH);
  ctx.lineTo(bulbW * 0.85, bulbH);
  ctx.lineTo(bulbW * 0.6, bulbH - botSandHeight);
  ctx.quadraticCurveTo(0, bulbH - botSandHeight - 25 * scale, -bulbW * 0.6, bulbH - botSandHeight);
  ctx.closePath();
  ctx.fillStyle = '#f59e0b';
  ctx.fill();
  ctx.restore();

  // Labels on Top and Bottom Bulbs
  ctx.textAlign = 'center';
  ctx.font = `800 ${14 * scale}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('NATAL 2026', 0, -bulbH * 0.65);

  ctx.font = `900 ${16 * scale}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = '#fde047';
  ctx.fillText('TAHUN BARU 2027', 0, bulbH * 0.6);

  ctx.restore();

  // Title Banner
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = `900 ${24 * scale}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('⏳ TRANSISI WAKTU: NATAL 2026 ➔ 2027 ⏳', cx, height * 0.12);
  ctx.font = `600 ${13 * scale}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = '#fde047';
  ctx.fillText('HOURGLASS OF TIME // COUNTDOWN TO NEW YEAR 2027', cx, height * 0.12 + 26 * scale);
  ctx.restore();
}

// ============================================================================
// 8. SCENIC OVERLAY: NORDIC CHRISTMAS 2026 PINE & MIDNIGHT 2027 FIREWORKS SKY
// ============================================================================
// Panoramic Scenic Video Overlay:
// Snow-capped Nordic pine silhouettes, animated emerald & violet Aurora Borealis,
// gently drifting 3D snowfall, and celebratory midnight fireworks shells blooming.
// ============================================================================

export function drawNordicChristmas2026FireworksSky(
  ctx: CanvasRenderingContext2D,
  _config: MotionConfig,
  time: number,
  _progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  // 1. Dancing Aurora Borealis Curtains across the Upper Sky
  const curtains = 3;
  for (let c = 0; c < curtains; c++) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, height * 0.45);
    for (let x = 0; x <= width; x += 25 * scale) {
      const nx = x / width;
      const wave =
        Math.sin(nx * 4 + time * 1.2 + c * 1.5) * 60 * scale +
        Math.cos(nx * 7 - time * 0.8) * 35 * scale;
      ctx.lineTo(x, height * 0.15 + wave + c * 40 * scale);
    }
    ctx.lineTo(width, height * 0.5);
    ctx.closePath();

    const aurGrad = ctx.createLinearGradient(0, 0, 0, height * 0.5);
    aurGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    aurGrad.addColorStop(0.4, c === 0 ? 'rgba(52, 211, 153, 0.35)' : c === 1 ? 'rgba(167, 139, 250, 0.3)' : 'rgba(56, 189, 248, 0.25)');
    aurGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aurGrad;
    ctx.fill();
    ctx.restore();
  }

  // 2. Midnight Fireworks Aerial Shells Blooming in Sky
  const shellPositions = [
    { x: width * 0.25, y: height * 0.24, color: '#f59e0b', period: 2.8, offset: 0 },
    { x: width * 0.52, y: height * 0.18, color: '#ef4444', period: 3.2, offset: 1.1 },
    { x: width * 0.78, y: height * 0.26, color: '#10b981', period: 3.0, offset: 2.2 },
  ];

  shellPositions.forEach((shell) => {
    const cycle = (time + shell.offset) % shell.period;
    const burstT = cycle / shell.period;
    if (burstT < 0.65) {
      const pCount = 32;
      const bRadius = easeOutCubic(burstT / 0.65) * 110 * scale;
      const alpha = (1 - burstT / 0.65) * 0.95;

      ctx.save();
      for (let p = 0; p < pCount; p++) {
        const a = (p / pCount) * Math.PI * 2;
        const px = shell.x + Math.cos(a) * bRadius;
        const py = shell.y + Math.sin(a) * bRadius + (burstT * 25 * scale); // Gravity droop

        ctx.beginPath();
        ctx.arc(px, py, (2.5 + hash(p) * 2) * scale, 0, Math.PI * 2);
        ctx.fillStyle = shell.color;
        ctx.shadowColor = shell.color;
        ctx.shadowBlur = 8 * scale;
        ctx.fill();
      }
      ctx.restore();
    }
  });

  // 3. Falling Snow Crystals (Drifting down with wind physics)
  for (let s = 0; s < 45; s++) {
    const seed = s * 16.71;
    const sx = ((hash(seed) + Math.sin(time * 0.8 + seed) * 0.08) % 1) * width;
    const sy = ((hash(seed + 1) + time * 0.06) % 1) * height;
    const sR = (hash(seed + 2) * 2.5 + 1.2) * scale;
    ctx.beginPath();
    ctx.arc(sx, sy, sR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fill();
  }

  // 4. Nordic Snow-Capped Pine Tree Silhouettes at Bottom Horizon
  const treeCount = Math.ceil(width / (55 * scale)) + 2;
  const horizonY = height * 0.88;

  ctx.save();
  for (let t = 0; t <= treeCount; t++) {
    const seed = t * 29.83;
    const tx = t * 55 * scale;
    const tH = (110 + hash(seed) * 80) * scale;
    const tW = (40 + hash(seed + 1) * 25) * scale;

    ctx.beginPath();
    ctx.moveTo(tx, horizonY - tH);
    ctx.lineTo(tx + tW / 2, horizonY);
    ctx.lineTo(tx - tW / 2, horizonY);
    ctx.closePath();
    ctx.fillStyle = '#022c22'; // Deep Nordic forest green silhouette
    ctx.fill();

    // Snow frosting on pine boughs
    ctx.beginPath();
    ctx.moveTo(tx, horizonY - tH);
    ctx.lineTo(tx + tW * 0.35, horizonY - tH * 0.6);
    ctx.lineTo(tx - tW * 0.35, horizonY - tH * 0.6);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.fill();
  }
  ctx.restore();

  // 5. Festive Celebration Text Banner
  ctx.save();
  ctx.textAlign = 'center';
  ctx.font = `900 ${26 * scale}px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 18 * scale;
  ctx.fillText('MERRY CHRISTMAS 2026 ★ HAPPY NEW YEAR 2027', width / 2, height * 0.82);
  ctx.shadowBlur = 0;

  ctx.font = `700 ${13 * scale}px 'Plus Jakarta Sans', monospace`;
  ctx.fillStyle = '#fef08a';
  ctx.fillText('NORDIC WINTER AURORA & CELEBRATION FIREWORKS OVERLAY', width / 2, height * 0.82 + 28 * scale);
  ctx.restore();
}

// ============================================================================
// 9. NORDIC MINIMALIST CHRISTMAS SILHOUETTE: SANTA SLEIGH & ALPINE VILLAGE
// Masterwork of Warm Scandinavian Minimalism (Folk-Art Storytelling Silhouette)
// Solving "Hampa" via:
// - Multi-layered rolling mountain ridges & foreground snow banks
// - Cohesive, clustered Alpine village with connected chalets, church tower,
//   glowing gaslamps, stone bridge, fences, and rich layered pine forests
// - Flowing cinematic Santa flight arc with gravity-drifting golden stardust onto rooftops
// - Breathing candlelight window glow, chimney smoke curls, and layered crystalline snow
// ============================================================================
export function drawNordicMinimalistSilhouetteSleigh(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const isDarkOverlay = config.backgroundMode === 'black';

  // 1. Color Palette Setup
  // Signature Nordic: Deep Forest Pine (#153e30 / #1b4332) on Warm Alabaster Ivory (#faf8f3), OR Pure Starlight White/Gold on Midnight Black
  const bgColor = isDarkOverlay ? '#02060c' : '#fcfaf2';
  const silhouetteMain = isDarkOverlay ? '#f1f5f9' : '#1b4332';
  const silhouetteDistant = isDarkOverlay ? 'rgba(241, 245, 249, 0.35)' : 'rgba(27, 67, 50, 0.42)';
  const silhouetteMid = isDarkOverlay ? 'rgba(241, 245, 249, 0.7)' : 'rgba(27, 67, 50, 0.78)';
  const warmGlow = '#f59e0b'; // Warm interior candlelight
  const stardustGold = isDarkOverlay ? '#fde047' : '#d97706';
  const frameColor = isDarkOverlay ? 'rgba(241, 245, 249, 0.35)' : 'rgba(27, 67, 50, 0.45)';

  // Fill Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // Soft atmospheric vignette
  if (!isDarkOverlay) {
    const bgGrad = ctx.createRadialGradient(width / 2, height * 0.45, minDim * 0.15, width / 2, height * 0.5, width * 0.75);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(0.65, '#faf6ec');
    bgGrad.addColorStop(1, '#ede5d4');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Dashed Stamp Border & Corner Crosses (Nordic Heritage Postal Frame)
  ctx.save();
  const pad = 40 * scale;
  ctx.strokeStyle = frameColor;
  ctx.lineWidth = 1.6 * scale;
  ctx.setLineDash([8 * scale, 6 * scale]);
  ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);
  ctx.setLineDash([]); // Reset dash

  // Decorative corner crosses
  const cornerLen = 12 * scale;
  const corners = [
    { x: pad, y: pad },
    { x: width - pad, y: pad },
    { x: pad, y: height - pad },
    { x: width - pad, y: height - pad }
  ];
  ctx.lineWidth = 1.5 * scale;
  corners.forEach(c => {
    ctx.beginPath();
    ctx.moveTo(c.x - cornerLen, c.y);
    ctx.lineTo(c.x + cornerLen, c.y);
    ctx.moveTo(c.x, c.y - cornerLen);
    ctx.lineTo(c.x, c.y + cornerLen);
    ctx.stroke();
  });
  ctx.restore();

  // 3. LAYER 1: Distant Warm Alpine Mountain Ranges (Upper-Mid Horizon)
  // Fills the sky background so there are no empty voids
  ctx.save();
  const mtnY = height * 0.42;
  ctx.beginPath();
  ctx.moveTo(0, mtnY + 60 * scale);
  ctx.bezierCurveTo(width * 0.18, mtnY - 50 * scale, width * 0.35, mtnY + 30 * scale, width * 0.52, mtnY - 40 * scale);
  ctx.bezierCurveTo(width * 0.70, mtnY + 20 * scale, width * 0.88, mtnY - 60 * scale, width, mtnY + 40 * scale);
  ctx.lineTo(width, height * 0.7);
  ctx.lineTo(0, height * 0.7);
  ctx.closePath();
  ctx.fillStyle = isDarkOverlay ? 'rgba(30, 41, 59, 0.45)' : 'rgba(216, 207, 190, 0.65)';
  ctx.fill();

  // Mid Mountain Ridge
  const midMtnY = height * 0.48;
  ctx.beginPath();
  ctx.moveTo(0, midMtnY + 40 * scale);
  ctx.bezierCurveTo(width * 0.22, midMtnY - 30 * scale, width * 0.45, midMtnY + 25 * scale, width * 0.68, midMtnY - 35 * scale);
  ctx.bezierCurveTo(width * 0.82, midMtnY + 15 * scale, width * 0.94, midMtnY - 20 * scale, width, midMtnY + 30 * scale);
  ctx.lineTo(width, height * 0.7);
  ctx.lineTo(0, height * 0.7);
  ctx.closePath();
  ctx.fillStyle = isDarkOverlay ? 'rgba(51, 65, 85, 0.55)' : 'rgba(74, 104, 86, 0.48)';
  ctx.fill();
  ctx.restore();

  // 4. LAYER 2: Rolling Valley Snow Hill (Solid Grounding Base)
  // Reaches all the way to the bottom border so the composition is solid & grounded
  const valleyY = height * 0.58;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, valleyY - 20 * scale);
  ctx.bezierCurveTo(
    width * 0.28, valleyY + 32 * scale,
    width * 0.65, valleyY + 18 * scale,
    width, valleyY - 24 * scale
  );
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fillStyle = isDarkOverlay ? '#050c18' : '#faf6ed';
  ctx.fill();

  // Subtle soft snowdrift shadow line
  ctx.strokeStyle = isDarkOverlay ? 'rgba(255, 255, 255, 0.08)' : 'rgba(216, 207, 190, 0.5)';
  ctx.lineWidth = 1.8 * scale;
  ctx.stroke();
  ctx.restore();

  // Helper to get exact surface ground Y at any X coordinate
  const getValleyGroundY = (x: number) => {
    const t = clamp(x / width, 0, 1);
    return valleyY - Math.sin(t * Math.PI) * (26 * scale) + (t - 0.5) * (10 * scale) + 12 * scale;
  };

  // 5. LAYER 3: Dense Pine Forest Theater Framing (Left & Right Flanks)
  // Eliminates hollow side spaces completely with tall, magnificent conifers
  ctx.save();
  ctx.fillStyle = silhouetteMain;

  // Left Flank (Spanning from 0 to 0.32)
  const leftForest = [
    { x: width * 0.02, w: 32 * scale, h: 180 * scale, sway: 0.1 },
    { x: width * 0.05, w: 38 * scale, h: 220 * scale, sway: 0.7 },
    { x: width * 0.085, w: 34 * scale, h: 195 * scale, sway: 1.2 },
    { x: width * 0.12, w: 42 * scale, h: 240 * scale, sway: 0.3 },
    { x: width * 0.155, w: 36 * scale, h: 205 * scale, sway: 1.8 },
    { x: width * 0.19, w: 32 * scale, h: 175 * scale, sway: 0.9 },
    { x: width * 0.225, w: 28 * scale, h: 150 * scale, sway: 2.1 },
    { x: width * 0.26, w: 24 * scale, h: 125 * scale, sway: 1.4 },
    { x: width * 0.29, w: 20 * scale, h: 100 * scale, sway: 0.5 },
  ];
  leftForest.forEach(p => drawStylizedPine(ctx, p.x, getValleyGroundY(p.x), p.w, p.h, time, p.sway, scale, silhouetteMain));

  // Right Flank (Spanning from 0.68 to 1.0)
  const rightForest = [
    { x: width * 0.71, w: 20 * scale, h: 105 * scale, sway: 0.4 },
    { x: width * 0.74, w: 25 * scale, h: 130 * scale, sway: 1.5 },
    { x: width * 0.775, w: 30 * scale, h: 165 * scale, sway: 0.8 },
    { x: width * 0.81, w: 36 * scale, h: 210 * scale, sway: 2.2 },
    { x: width * 0.845, w: 42 * scale, h: 245 * scale, sway: 1.1 },
    { x: width * 0.88, w: 36 * scale, h: 200 * scale, sway: 0.6 },
    { x: width * 0.915, w: 38 * scale, h: 225 * scale, sway: 1.9 },
    { x: width * 0.95, w: 34 * scale, h: 190 * scale, sway: 1.3 },
    { x: width * 0.98, w: 30 * scale, h: 170 * scale, sway: 0.2 },
  ];
  rightForest.forEach(p => drawStylizedPine(ctx, p.x, getValleyGroundY(p.x), p.w, p.h, time, p.sway, scale, silhouetteMain));
  ctx.restore();

  // 6. LAYER 4: Clustered Alpine Storybook Village (Center Valley)
  // Nestled tightly together with snow-covered roofs, church tower, and smoking chimneys
  ctx.save();
  const churchX = width * 0.56;
  const churchY = getValleyGroundY(churchX);

  // Village Chalets tightly clustered around Church
  const chalets = [
    // Left side of church
    { x: width * 0.32, w: 36 * scale, h: 44 * scale, roofH: 22 * scale, hasChimney: true, id: 1 },
    { x: width * 0.355, w: 32 * scale, h: 40 * scale, roofH: 20 * scale, hasChimney: false, id: 2 },
    { x: width * 0.385, w: 42 * scale, h: 52 * scale, roofH: 26 * scale, hasChimney: true, id: 3 },
    { x: width * 0.425, w: 38 * scale, h: 46 * scale, roofH: 24 * scale, hasChimney: false, id: 4 },
    { x: width * 0.46, w: 46 * scale, h: 56 * scale, roofH: 28 * scale, hasChimney: true, id: 5 },
    { x: width * 0.505, w: 40 * scale, h: 48 * scale, roofH: 24 * scale, hasChimney: false, id: 6 },
    // Right side of church
    { x: width * 0.615, w: 44 * scale, h: 52 * scale, roofH: 26 * scale, hasChimney: true, id: 7 },
    { x: width * 0.655, w: 36 * scale, h: 42 * scale, roofH: 22 * scale, hasChimney: false, id: 8 },
    { x: width * 0.685, w: 32 * scale, h: 38 * scale, roofH: 20 * scale, hasChimney: true, id: 9 },
  ];

  // Draw chalets with Snow-Covered Roofs & Glowing Windows
  chalets.forEach(c => {
    const cY = getValleyGroundY(c.x + c.w / 2);
    drawSnowCappedChalet(ctx, c.x, cY, c.w, c.h, c.roofH, c.hasChimney, c.id, time, scale, silhouetteMain, isDarkOverlay, warmGlow);
  });

  // Central Grand Alpine Church
  drawGrandAlpineChurchWithSnow(ctx, churchX, churchY, time, scale, silhouetteMain, isDarkOverlay, warmGlow);

  // Gaslamp street lamps glowing along the village lane
  drawGlowingGaslamp(ctx, width * 0.38, getValleyGroundY(width * 0.38), scale, time, 0, isDarkOverlay);
  drawGlowingGaslamp(ctx, width * 0.50, getValleyGroundY(width * 0.50), scale, time, 1, isDarkOverlay);
  drawGlowingGaslamp(ctx, width * 0.65, getValleyGroundY(width * 0.65), scale, time, 2, isDarkOverlay);

  ctx.restore();

  // 7. LAYER 5: Santa Claus & 4 Reindeer Flying Across Sky
  // Dramatic curving flight path swooping across the valley
  ctx.save();
  const flyCycle = (progress * 1.0) % 1.0;
  const flightStartX = width * -0.18;
  const flightEndX = width * 1.18;
  const teamX = flightStartX + (flightEndX - flightStartX) * flyCycle;

  // Graceful swoop across sky
  const tNorm = (teamX / width);
  const arcDip = Math.sin(tNorm * Math.PI) * (42 * scale);
  const teamY = height * 0.26 + arcDip + Math.sin(time * 3.5) * (6 * scale);
  const teamTilt = (0.5 - tNorm) * 0.18 + Math.cos(time * 3.5) * 0.03;

  ctx.translate(teamX, teamY);
  ctx.rotate(teamTilt);

  const gallopSpeed = time * 13;
  const deerSpacing = 42 * scale;
  const deerCount = 4;

  ctx.fillStyle = silhouetteMain;
  ctx.strokeStyle = silhouetteMain;

  // 4 Galloping Reindeer
  for (let d = 0; d < deerCount; d++) {
    const deerX = (deerCount - d) * deerSpacing + 38 * scale;
    const deerLegPhase = gallopSpeed + d * 0.75;
    const deerBob = Math.sin(deerLegPhase) * (4 * scale);

    drawSilhouetteReindeer(ctx, deerX, deerBob, scale, deerLegPhase, silhouetteMain);

    // Reins
    ctx.save();
    ctx.strokeStyle = silhouetteMain;
    ctx.lineWidth = 1.3 * scale;
    ctx.beginPath();
    const nextX = (deerCount - d - 1) * deerSpacing + 38 * scale;
    const sag = 4 * scale + Math.sin(gallopSpeed + d) * (2 * scale);
    ctx.moveTo(deerX - 10 * scale, deerBob - 4 * scale);
    ctx.quadraticCurveTo(
      (deerX + nextX) / 2, deerBob + sag,
      nextX + 14 * scale, deerBob - 2 * scale
    );
    ctx.stroke();
    ctx.restore();
  }

  // Santa Sleigh Silhouette
  drawSilhouetteSantaSleigh(ctx, 0, 0, scale, silhouetteMain);
  ctx.restore();

  // 8. Cascading Golden Stardust Trail (Swirling & Drifting Downward onto Village)
  ctx.save();
  const trailCount = 70;
  for (let p = 0; p < trailCount; p++) {
    const pSeed = p * 23.19;
    const pLag = (p / trailCount) * 0.32;
    const pProgress = (progress - pLag + 1.0) % 1.0;
    const pTeamX = flightStartX + (flightEndX - flightStartX) * pProgress;

    const ptNorm = (pTeamX / width);
    const pArcDip = Math.sin(ptNorm * Math.PI) * (42 * scale);
    const pBaseY = height * 0.26 + pArcDip;

    // Golden dust falls gently towards the village
    const driftFall = (p / trailCount) * (75 * scale);
    const pX = pTeamX - (16 + hash(pSeed) * 26) * scale;
    const pY = pBaseY + driftFall + Math.sin(time * 6 + p * 1.2) * (14 * scale) + (hash(pSeed + 1) - 0.5) * (22 * scale);
    const pAlpha = Math.pow(1 - p / trailCount, 1.2) * (isDarkOverlay ? 0.95 : 0.85);
    const pRadius = (1.4 + hash(pSeed + 2) * 3.6) * scale;

    ctx.save();
    if (p % 3 === 0) {
      drawStar4Point(ctx, pX, pY, pRadius * 1.9, pRadius * 0.7);
      ctx.fillStyle = isDarkOverlay ? `rgba(253, 224, 71, ${pAlpha})` : `rgba(217, 119, 6, ${pAlpha})`;
      ctx.shadowColor = warmGlow;
      ctx.shadowBlur = 8 * scale;
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(pX, pY, pRadius, 0, Math.PI * 2);
      ctx.fillStyle = isDarkOverlay ? `rgba(254, 240, 138, ${pAlpha})` : `rgba(27, 67, 50, ${pAlpha * 0.9})`;
      ctx.fill();
    }
    ctx.restore();
  }
  ctx.restore();

  // 9. Floating Celestial Golden Stars in Sky
  ctx.save();
  const skyStars = 22;
  for (let st = 0; st < skyStars; st++) {
    const sSeed = st * 41.73;
    const stX = width * (0.08 + hash(sSeed) * 0.84);
    const stY = height * (0.08 + hash(sSeed + 1) * 0.28);
    const stPulse = 0.5 + 0.5 * Math.sin(time * 3 + st);
    const stR = (2.0 + hash(sSeed + 2) * 2.5) * scale * stPulse;

    drawStar4Point(ctx, stX, stY, stR, stR * 0.4);
    ctx.fillStyle = isDarkOverlay ? `rgba(253, 224, 71, ${0.4 + stPulse * 0.5})` : `rgba(217, 119, 6, ${0.35 + stPulse * 0.45})`;
    ctx.fill();
  }
  ctx.restore();

  // 10. Multi-Layered Gentle Snowfall
  ctx.save();
  const snowCount = 60;
  for (let s = 0; s < snowCount; s++) {
    const seed = s * 37.19;
    const sx = ((hash(seed) + Math.sin(time * 0.6 + seed) * 0.08) % 1) * width;
    const sy = ((hash(seed + 1) + time * 0.05) % 1) * height;
    const isLarge = s % 8 === 0;
    const sr = (isLarge ? 3.2 : 1.4 + hash(seed + 2) * 1.2) * scale;
    const sAlpha = isLarge ? 0.45 : (0.25 + hash(seed + 3) * 0.4);

    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = isDarkOverlay ? `rgba(241, 245, 249, ${sAlpha})` : `rgba(27, 67, 50, ${sAlpha * 0.55})`;
    ctx.fill();
  }
  ctx.restore();

  // 11. Balanced Minimalist Typography Seated on the Lower Snow Base
  ctx.save();
  ctx.textAlign = 'center';
  const textCenterY = height * 0.88;

  // MERRY CHRISTMAS & HAPPY NEW YEAR (Cinematic Single-Line Luxury Tracking)
  ctx.font = `800 ${28 * scale}px 'Outfit', 'Cinzel', serif`;
  ctx.letterSpacing = `${8 * scale}px`;
  ctx.fillStyle = silhouetteMain;
  ctx.fillText('MERRY CHRISTMAS & HAPPY NEW YEAR', width / 2, textCenterY);

  ctx.restore();
}

// ----------------------------------------------------------------------------
// VECTOR HELPER: DRAW SNOW-CAPPED CHALET WITH GLOWING WINDOWS & SMOKE
// ----------------------------------------------------------------------------
function drawSnowCappedChalet(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  roofH: number,
  hasChimney: boolean,
  id: number,
  time: number,
  scale: number,
  silColor: string,
  isDark: boolean,
  glowColor: string
) {
  ctx.save();

  // House Walls (Solid Dark Pine Green)
  ctx.fillStyle = silColor;
  ctx.fillRect(x, y - h, w, h);

  // Gabled Roof
  ctx.beginPath();
  ctx.moveTo(x - 4 * scale, y - h);
  ctx.lineTo(x + w / 2, y - h - roofH);
  ctx.lineTo(x + w + 4 * scale, y - h);
  ctx.closePath();
  ctx.fill();

  // Snow Cap on Roof (White / Crisp Cream Layer on Roof slope)
  ctx.fillStyle = isDark ? '#ffffff' : '#fcfaf2';
  ctx.beginPath();
  ctx.moveTo(x - 6 * scale, y - h);
  ctx.lineTo(x + w / 2, y - h - roofH - 3 * scale);
  ctx.lineTo(x + w + 6 * scale, y - h);
  ctx.lineTo(x + w + 4 * scale, y - h + 4 * scale);
  ctx.lineTo(x + w / 2, y - h - roofH + 3 * scale);
  ctx.lineTo(x - 4 * scale, y - h + 4 * scale);
  ctx.closePath();
  ctx.fill();

  // Chimney & Smoke
  if (hasChimney) {
    const chimX = x + w * 0.22;
    const chimY = y - h - roofH * 0.65;
    ctx.fillStyle = silColor;
    ctx.fillRect(chimX, chimY - 14 * scale, 6.5 * scale, 18 * scale);

    // Chimney snow rim
    ctx.fillStyle = isDark ? '#ffffff' : '#fcfaf2';
    ctx.fillRect(chimX - 1 * scale, chimY - 15 * scale, 8.5 * scale, 3 * scale);

    // Warm curling smoke puffs
    const smokeCount = 5;
    for (let sm = 0; sm < smokeCount; sm++) {
      const smAge = ((time * 0.75 + sm * 0.22) % 1);
      const smY = chimY - 18 * scale - smAge * 45 * scale;
      const smX = chimX + 3 * scale + Math.sin(smAge * Math.PI * 2 + sm) * (7 * scale) + smAge * (10 * scale);
      const smR = (2.2 + smAge * 5.8) * scale;
      const smAlpha = (1 - smAge) * (isDark ? 0.45 : 0.6);

      ctx.beginPath();
      ctx.arc(smX, smY, smR, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? `rgba(241, 245, 249, ${smAlpha})` : `rgba(45, 106, 79, ${smAlpha * 0.7})`;
      ctx.fill();
    }
  }

  // Windows with Warm Candlelight Flicker
  const winRows = 2;
  const winCols = 2;
  for (let r = 0; r < winRows; r++) {
    for (let c = 0; c < winCols; c++) {
      const wx = x + 6 * scale + c * (14 * scale);
      const wy = y - h + 8 * scale + r * (15 * scale);
      const flicker = 0.8 + 0.2 * Math.sin(time * 5.5 + id * 2.7 + r * 3 + c);

      ctx.fillStyle = isDark ? `rgba(251, 191, 36, ${flicker})` : `rgba(254, 240, 138, ${flicker})`;
      ctx.fillRect(wx, wy, 5 * scale, 7 * scale);

      // Window mullion pane
      ctx.fillStyle = silColor;
      ctx.fillRect(wx + 2.2 * scale, wy, 0.8 * scale, 7 * scale);
      ctx.fillRect(wx, wy + 3.2 * scale, 5 * scale, 0.8 * scale);
    }
  }

  ctx.restore();
}

// ----------------------------------------------------------------------------
// VECTOR HELPER: DRAW GRAND ALPINE CHURCH WITH SNOW
// ----------------------------------------------------------------------------
function drawGrandAlpineChurchWithSnow(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number,
  scale: number,
  silColor: string,
  isDark: boolean,
  glowColor: string
) {
  ctx.save();
  ctx.fillStyle = silColor;

  const towerW = 34 * scale;
  const towerH = 120 * scale;
  const naveW = 62 * scale;
  const naveH = 54 * scale;

  // Bell Tower Body
  ctx.fillRect(x - towerW / 2, y - towerH * 0.68, towerW, towerH * 0.68);

  // Tower Steeple Spire
  ctx.beginPath();
  ctx.moveTo(x - towerW / 2 - 2 * scale, y - towerH * 0.68);
  ctx.lineTo(x, y - towerH);
  ctx.lineTo(x + towerW / 2 + 2 * scale, y - towerH * 0.68);
  ctx.closePath();
  ctx.fill();

  // Snow Cap on Steeple Spire
  ctx.fillStyle = isDark ? '#ffffff' : '#fcfaf2';
  ctx.beginPath();
  ctx.moveTo(x - 2 * scale, y - towerH * 0.85);
  ctx.lineTo(x, y - towerH);
  ctx.lineTo(x + 2 * scale, y - towerH * 0.85);
  ctx.closePath();
  ctx.fill();

  // Steeple Cross
  ctx.strokeStyle = silColor;
  ctx.lineWidth = 1.8 * scale;
  ctx.beginPath();
  ctx.moveTo(x, y - towerH);
  ctx.lineTo(x, y - towerH - 14 * scale);
  ctx.moveTo(x - 6 * scale, y - towerH - 9 * scale);
  ctx.lineTo(x + 6 * scale, y - towerH - 9 * scale);
  ctx.stroke();

  // Clock Face on Tower
  const clockY = y - towerH * 0.52;
  ctx.fillStyle = isDark ? 'rgba(251, 191, 36, 0.9)' : 'rgba(254, 240, 138, 0.95)';
  ctx.beginPath();
  ctx.arc(x, clockY, 7 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = silColor;
  ctx.lineWidth = 1.2 * scale;
  ctx.beginPath();
  ctx.moveTo(x, clockY);
  ctx.lineTo(x, clockY - 5 * scale); // 12 o'clock
  ctx.moveTo(x, clockY);
  ctx.lineTo(x + 2.5 * scale, clockY - 1 * scale);
  ctx.stroke();

  // Arched Belfry Window
  const belfryY = y - towerH * 0.32;
  ctx.fillStyle = isDark ? 'rgba(251, 191, 36, 0.85)' : 'rgba(254, 240, 138, 0.9)';
  ctx.beginPath();
  ctx.arc(x, belfryY, 5.5 * scale, Math.PI, 0);
  ctx.lineTo(x + 5.5 * scale, belfryY + 15 * scale);
  ctx.lineTo(x - 5.5 * scale, belfryY + 15 * scale);
  ctx.closePath();
  ctx.fill();

  // Church Nave & Pitched Roof
  const naveX = x + towerW / 2;
  ctx.fillStyle = silColor;
  ctx.fillRect(naveX, y - naveH, naveW, naveH);

  ctx.beginPath();
  ctx.moveTo(naveX, y - naveH);
  ctx.lineTo(naveX + naveW * 0.5, y - naveH - 24 * scale);
  ctx.lineTo(naveX + naveW + 2 * scale, y - naveH);
  ctx.closePath();
  ctx.fill();

  // Snow Cap on Nave Roof
  ctx.fillStyle = isDark ? '#ffffff' : '#fcfaf2';
  ctx.beginPath();
  ctx.moveTo(naveX - 2 * scale, y - naveH);
  ctx.lineTo(naveX + naveW * 0.5, y - naveH - 26 * scale);
  ctx.lineTo(naveX + naveW + 4 * scale, y - naveH);
  ctx.lineTo(naveX + naveW + 2 * scale, y - naveH + 4 * scale);
  ctx.lineTo(naveX + naveW * 0.5, y - naveH - 21 * scale);
  ctx.lineTo(naveX, y - naveH + 4 * scale);
  ctx.closePath();
  ctx.fill();

  // Row of 4 Gothic Arched Stained Glass Windows on Nave
  for (let nw = 0; nw < 4; nw++) {
    const nwx = naveX + 9 * scale + nw * (14 * scale);
    const nwy = y - naveH + 15 * scale;
    const flicker = 0.82 + 0.18 * Math.sin(time * 4 + nw * 1.5);

    ctx.fillStyle = isDark ? `rgba(251, 191, 36, ${flicker})` : `rgba(254, 240, 138, ${flicker})`;
    ctx.beginPath();
    ctx.arc(nwx, nwy, 4 * scale, Math.PI, 0);
    ctx.lineTo(nwx + 4 * scale, nwy + 15 * scale);
    ctx.lineTo(nwx - 4 * scale, nwy + 15 * scale);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

// ----------------------------------------------------------------------------
// VECTOR HELPER: DRAW DETAILED STYLIZED PINE TREE
// ----------------------------------------------------------------------------
function drawStylizedPine(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  time: number,
  swaySeed: number,
  scale: number,
  color: string
) {
  const tiers = 5;
  const tierH = h / tiers;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.sin(time * 2.2 + swaySeed) * 0.025);
  ctx.fillStyle = color;

  for (let tr = 0; tr < tiers; tr++) {
    const topY = -h + tr * tierH * 0.72;
    const botY = topY + tierH * 1.35;
    const curW = (w * (tr + 1.2)) / (tiers + 1);

    ctx.beginPath();
    ctx.moveTo(0, topY);
    ctx.lineTo(curW / 2, botY);
    // Serrated scalloped needle branches
    ctx.lineTo(curW * 0.32, botY - 3 * scale);
    ctx.lineTo(0, botY);
    ctx.lineTo(-curW * 0.32, botY - 3 * scale);
    ctx.lineTo(-curW / 2, botY);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

// ----------------------------------------------------------------------------
// VECTOR HELPER: DRAW ALPINE CHALET WITH DORMERS, CHIMNEY & SMOKE
// ----------------------------------------------------------------------------
function drawAlpineChalet(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  roofH: number,
  hasChimney: boolean,
  id: number,
  time: number,
  scale: number,
  silColor: string,
  isDark: boolean,
  glowColor: string
) {
  ctx.save();
  ctx.fillStyle = silColor;

  // Main Chalet Body
  ctx.fillRect(x, y - h, w, h);

  // Steep Pitched Gabled Roof (Classic Swiss/Nordic A-Frame)
  ctx.beginPath();
  ctx.moveTo(x - 4 * scale, y - h);
  ctx.lineTo(x + w / 2, y - h - roofH);
  ctx.lineTo(x + w + 4 * scale, y - h);
  ctx.closePath();
  ctx.fill();

  // Chimney & Animated Curly Smoke
  if (hasChimney) {
    const chimX = x + w * 0.22;
    const chimY = y - h - roofH * 0.65;
    ctx.fillRect(chimX, chimY - 15 * scale, 6.5 * scale, 18 * scale);

    // Warm curly smoke puffs
    const smokeCount = 5;
    for (let sm = 0; sm < smokeCount; sm++) {
      const smAge = ((time * 0.75 + sm * 0.22) % 1);
      const smY = chimY - 18 * scale - smAge * 48 * scale;
      const smX = chimX + 3 * scale + Math.sin(smAge * Math.PI * 2 + sm) * (7 * scale) + smAge * (12 * scale);
      const smR = (2.2 + smAge * 5.8) * scale;
      const smAlpha = (1 - smAge) * (isDark ? 0.45 : 0.65);

      ctx.beginPath();
      ctx.arc(smX, smY, smR, 0, Math.PI * 2);
      ctx.fillStyle = isDark ? `rgba(241, 245, 249, ${smAlpha})` : `rgba(45, 106, 79, ${smAlpha * 0.7})`;
      ctx.fill();
    }
  }

  // Windows with Warm Candlelight Flicker
  const winRows = 2;
  const winCols = 2;
  for (let r = 0; r < winRows; r++) {
    for (let c = 0; c < winCols; c++) {
      const wx = x + 6 * scale + c * (14 * scale);
      const wy = y - h + 8 * scale + r * (15 * scale);
      const flicker = 0.8 + 0.2 * Math.sin(time * 5.5 + id * 2.7 + r * 3 + c);

      ctx.fillStyle = isDark ? `rgba(251, 191, 36, ${flicker})` : `rgba(254, 240, 138, ${flicker})`;
      ctx.fillRect(wx, wy, 5 * scale, 7 * scale);

      // Window mullion pane
      ctx.fillStyle = silColor;
      ctx.fillRect(wx + 2.2 * scale, wy, 0.8 * scale, 7 * scale);
      ctx.fillRect(wx, wy + 3.2 * scale, 5 * scale, 0.8 * scale);
    }
  }

  // Attic Dormer Triangle Window
  const dormerX = x + w / 2;
  const dormerY = y - h - roofH * 0.35;
  ctx.fillStyle = isDark ? 'rgba(251, 191, 36, 0.85)' : 'rgba(254, 240, 138, 0.9)';
  ctx.beginPath();
  ctx.arc(dormerX, dormerY, 2.5 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ----------------------------------------------------------------------------
// VECTOR HELPER: DRAW GRAND ALPINE CHURCH (STEEPLE, BELFRY & CROSS)
// ----------------------------------------------------------------------------
function drawGrandAlpineChurch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  time: number,
  scale: number,
  silColor: string,
  isDark: boolean,
  glowColor: string
) {
  ctx.save();
  ctx.fillStyle = silColor;

  const towerW = 32 * scale;
  const towerH = 104 * scale;
  const naveW = 58 * scale;
  const naveH = 50 * scale;

  // Bell Tower Body
  ctx.fillRect(x - towerW / 2, y - towerH * 0.68, towerW, towerH * 0.68);

  // Tower Steeple Spire
  ctx.beginPath();
  ctx.moveTo(x - towerW / 2 - 2 * scale, y - towerH * 0.68);
  ctx.lineTo(x, y - towerH);
  ctx.lineTo(x + towerW / 2 + 2 * scale, y - towerH * 0.68);
  ctx.closePath();
  ctx.fill();

  // Steeple Cross
  ctx.strokeStyle = silColor;
  ctx.lineWidth = 1.8 * scale;
  ctx.beginPath();
  ctx.moveTo(x, y - towerH);
  ctx.lineTo(x, y - towerH - 12 * scale);
  ctx.moveTo(x - 5 * scale, y - towerH - 8 * scale);
  ctx.lineTo(x + 5 * scale, y - towerH - 8 * scale);
  ctx.stroke();

  // Clock Face on Tower
  const clockY = y - towerH * 0.52;
  ctx.fillStyle = isDark ? 'rgba(251, 191, 36, 0.9)' : 'rgba(254, 240, 138, 0.95)';
  ctx.beginPath();
  ctx.arc(x, clockY, 6.5 * scale, 0, Math.PI * 2);
  ctx.fill();
  // Clock hands pointing to midnight
  ctx.strokeStyle = silColor;
  ctx.lineWidth = 1.1 * scale;
  ctx.beginPath();
  ctx.moveTo(x, clockY);
  ctx.lineTo(x, clockY - 4.5 * scale); // 12 o'clock
  ctx.moveTo(x, clockY);
  ctx.lineTo(x + 2 * scale, clockY - 1 * scale);
  ctx.stroke();

  // Arched Belfry Window
  const belfryY = y - towerH * 0.32;
  ctx.fillStyle = isDark ? 'rgba(251, 191, 36, 0.85)' : 'rgba(254, 240, 138, 0.9)';
  ctx.beginPath();
  ctx.arc(x, belfryY, 5 * scale, Math.PI, 0);
  ctx.lineTo(x + 5 * scale, belfryY + 14 * scale);
  ctx.lineTo(x - 5 * scale, belfryY + 14 * scale);
  ctx.closePath();
  ctx.fill();

  // Church Nave & Pitched Roof
  const naveX = x + towerW / 2;
  ctx.fillStyle = silColor;
  ctx.fillRect(naveX, y - naveH, naveW, naveH);

  ctx.beginPath();
  ctx.moveTo(naveX, y - naveH);
  ctx.lineTo(naveX + naveW * 0.5, y - naveH - 22 * scale);
  ctx.lineTo(naveX + naveW + 2 * scale, y - naveH);
  ctx.closePath();
  ctx.fill();

  // Row of 4 Gothic Arched Stained Glass Windows on Nave
  for (let nw = 0; nw < 4; nw++) {
    const nwx = naveX + 9 * scale + nw * (13 * scale);
    const nwy = y - naveH + 14 * scale;
    const flicker = 0.82 + 0.18 * Math.sin(time * 4 + nw * 1.5);

    ctx.fillStyle = isDark ? `rgba(251, 191, 36, ${flicker})` : `rgba(254, 240, 138, ${flicker})`;
    ctx.beginPath();
    ctx.arc(nwx, nwy, 3.8 * scale, Math.PI, 0);
    ctx.lineTo(nwx + 3.8 * scale, nwy + 14 * scale);
    ctx.lineTo(nwx - 3.8 * scale, nwy + 14 * scale);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

// ----------------------------------------------------------------------------
// VECTOR HELPER: DRAW GLOWING STREET GASLAMP
// ----------------------------------------------------------------------------
function drawGlowingGaslamp(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  time: number,
  lampId: number,
  isDark: boolean
) {
  const lampH = 34 * scale;
  const lampY = y - lampH;

  ctx.save();
  // Post & bracket
  ctx.strokeStyle = isDark ? '#f1f5f9' : '#1b4332';
  ctx.lineWidth = 1.8 * scale;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, lampY);
  ctx.stroke();

  // Lamp lantern cage
  ctx.fillStyle = isDark ? '#f1f5f9' : '#1b4332';
  ctx.beginPath();
  ctx.moveTo(x - 4 * scale, lampY);
  ctx.lineTo(x + 4 * scale, lampY);
  ctx.lineTo(x + 3 * scale, lampY + 7 * scale);
  ctx.lineTo(x - 3 * scale, lampY + 7 * scale);
  ctx.closePath();
  ctx.fill();

  // Soft glowing warm amber halo on snow
  const flicker = 0.85 + 0.15 * Math.sin(time * 6 + lampId * 3);
  const glowGrad = ctx.createRadialGradient(x, lampY + 3 * scale, 0, x, lampY + 3 * scale, 16 * scale);
  glowGrad.addColorStop(0, `rgba(251, 191, 36, ${flicker * 0.9})`);
  glowGrad.addColorStop(0.5, `rgba(245, 158, 11, ${flicker * 0.3})`);
  glowGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');

  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(x, lampY + 3 * scale, 16 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Tiny lantern flame
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, lampY + 3 * scale, 1.8 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ----------------------------------------------------------------------------
// VECTOR HELPER: DRAW WOODEN RAIL FENCE
// ----------------------------------------------------------------------------
function drawNordicWoodenFence(
  ctx: CanvasRenderingContext2D,
  x1: number,
  x2: number,
  getY: (x: number) => number,
  scale: number,
  color: string
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.4 * scale;

  const postSpacing = 12 * scale;
  const count = Math.floor((x2 - x1) / postSpacing);

  // Horizontal rails
  ctx.beginPath();
  for (let i = 0; i <= count; i++) {
    const px = x1 + i * postSpacing;
    const py = getY(px);
    if (i === 0) ctx.moveTo(px, py - 10 * scale);
    else ctx.lineTo(px, py - 10 * scale);
  }
  ctx.stroke();

  ctx.beginPath();
  for (let i = 0; i <= count; i++) {
    const px = x1 + i * postSpacing;
    const py = getY(px);
    if (i === 0) ctx.moveTo(px, py - 5 * scale);
    else ctx.lineTo(px, py - 5 * scale);
  }
  ctx.stroke();

  // Vertical posts
  for (let i = 0; i <= count; i++) {
    const px = x1 + i * postSpacing;
    const py = getY(px);
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.lineTo(px, py - 14 * scale);
    ctx.stroke();
  }
  ctx.restore();
}

// ----------------------------------------------------------------------------
// VECTOR HELPER: DRAW COMMUNITY FESTIVE CHRISTMAS TREE
// ----------------------------------------------------------------------------
function drawFestiveCommunityTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  time: number,
  scale: number,
  color: string,
  glowColor: string
) {
  // Base pine tree
  drawStylizedPine(ctx, x, y, w, h, time, 0.4, scale, color);

  // Shining Bethlehem Star at the top
  ctx.save();
  const starY = y - h - 5 * scale;
  const starPulse = 1 + 0.25 * Math.sin(time * 5);
  drawStar4Point(ctx, x, starY, 7.5 * scale * starPulse, 3 * scale * starPulse);
  ctx.fillStyle = glowColor;
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = 12 * scale;
  ctx.fill();
  ctx.restore();

  // Glowing Baubles on tree branches
  ctx.save();
  const baubleCount = 9;
  for (let b = 0; b < baubleCount; b++) {
    const bProg = (b + 1) / (baubleCount + 1);
    const by = y - h * (1 - bProg * 0.85);
    const bx = x + Math.sin(b * 2.3) * (w * 0.38 * bProg);
    const bFlicker = 0.75 + 0.25 * Math.sin(time * 6 + b * 2);

    ctx.beginPath();
    ctx.arc(bx, by, 2.2 * scale, 0, Math.PI * 2);
    ctx.fillStyle = b % 2 === 0 ? `rgba(251, 191, 36, ${bFlicker})` : `rgba(239, 68, 68, ${bFlicker})`;
    ctx.fill();
  }

  // Gift boxes under tree
  const giftX = [x - 22 * scale, x - 10 * scale, x + 8 * scale, x + 20 * scale];
  const giftW = [11 * scale, 9 * scale, 12 * scale, 10 * scale];
  const giftH = [10 * scale, 8 * scale, 11 * scale, 9 * scale];
  for (let g = 0; g < 4; g++) {
    ctx.fillStyle = color;
    ctx.fillRect(giftX[g], y - giftH[g], giftW[g], giftH[g]);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(giftX[g] + giftW[g] / 2 - 0.7 * scale, y - giftH[g], 1.4 * scale, giftH[g]);
    ctx.fillRect(giftX[g], y - giftH[g] / 2 - 0.7 * scale, giftW[g], 1.4 * scale);
  }
  ctx.restore();
}

// ----------------------------------------------------------------------------
// VECTOR HELPER: DRAW 4-POINT MAGIC STAR
// ----------------------------------------------------------------------------
function drawStar4Point(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerR: number, innerR: number) {
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i * Math.PI) / 4;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

// ----------------------------------------------------------------------------
// VECTOR HELPER: DRAW DETAILED REINDEER SILHOUETTE (GALLOPING LEGS)
// ----------------------------------------------------------------------------
function drawSilhouetteReindeer(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  phase: number,
  color: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;

  // Reindeer Torso
  ctx.beginPath();
  ctx.ellipse(0, 0, 15 * scale, 8 * scale, -0.15, 0, Math.PI * 2);
  ctx.fill();

  // Neck and Head angled forward
  ctx.beginPath();
  ctx.moveTo(8 * scale, -4 * scale);
  ctx.lineTo(17 * scale, -14 * scale); // chin
  ctx.lineTo(21 * scale, -13 * scale); // muzzle tip
  ctx.lineTo(19 * scale, -17 * scale); // forehead
  ctx.lineTo(10 * scale, -10 * scale); // back of neck
  ctx.closePath();
  ctx.fill();

  // Antlers (Multi-prong branching horns)
  ctx.lineWidth = 1.4 * scale;
  ctx.strokeStyle = color;
  ctx.beginPath();
  // Main beam
  ctx.moveTo(17 * scale, -16 * scale);
  ctx.quadraticCurveTo(18 * scale, -24 * scale, 13 * scale, -28 * scale);
  // Brow tine
  ctx.moveTo(17 * scale, -19 * scale);
  ctx.lineTo(21 * scale, -21 * scale);
  // Trez tine
  ctx.moveTo(16 * scale, -22 * scale);
  ctx.lineTo(12 * scale, -24 * scale);
  // Top fork
  ctx.moveTo(14 * scale, -26 * scale);
  ctx.lineTo(17 * scale, -28 * scale);
  ctx.stroke();

  // Tiny Ear
  ctx.beginPath();
  ctx.ellipse(13 * scale, -14 * scale, 3 * scale, 1.5 * scale, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Front Galloping Legs (Swinging rhythmically)
  const frontSwing = Math.sin(phase) * 0.7;
  ctx.lineWidth = 2.2 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  // Front Leg 1
  ctx.moveTo(9 * scale, 4 * scale);
  ctx.lineTo(9 * scale + Math.sin(frontSwing) * 14 * scale, 4 * scale + Math.cos(frontSwing) * 15 * scale);
  // Front Leg 2
  ctx.moveTo(12 * scale, 4 * scale);
  ctx.lineTo(12 * scale + Math.sin(frontSwing - 0.5) * 13 * scale, 4 * scale + Math.cos(frontSwing - 0.5) * 14 * scale);
  ctx.stroke();

  // Hind Galloping Legs (Kicking back)
  const hindSwing = Math.sin(phase + Math.PI * 0.8) * 0.7;
  ctx.beginPath();
  // Hind Leg 1
  ctx.moveTo(-10 * scale, 4 * scale);
  ctx.lineTo(-10 * scale + Math.sin(hindSwing) * 15 * scale, 4 * scale + Math.cos(hindSwing) * 16 * scale);
  // Hind Leg 2
  ctx.moveTo(-7 * scale, 4 * scale);
  ctx.lineTo(-7 * scale + Math.sin(hindSwing + 0.4) * 14 * scale, 4 * scale + Math.cos(hindSwing + 0.4) * 15 * scale);
  ctx.stroke();

  // Little upturned tail
  ctx.beginPath();
  ctx.ellipse(-14 * scale, -3 * scale, 3 * scale, 2 * scale, -0.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ----------------------------------------------------------------------------
// VECTOR HELPER: DRAW DETAILED SANTA & SLEIGH SILHOUETTE
// ----------------------------------------------------------------------------
function drawSilhouetteSantaSleigh(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  scale: number,
  color: string
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  // Sleigh Runner (Curved blade bottom)
  ctx.lineWidth = 2.2 * scale;
  ctx.beginPath();
  ctx.moveTo(-28 * scale, 12 * scale);
  ctx.lineTo(18 * scale, 12 * scale);
  // Elegant curl at the front
  ctx.bezierCurveTo(28 * scale, 12 * scale, 26 * scale, -2 * scale, 22 * scale, -4 * scale);
  ctx.stroke();

  // Sleigh Body Struts
  ctx.lineWidth = 1.6 * scale;
  ctx.beginPath();
  ctx.moveTo(-18 * scale, 12 * scale);
  ctx.lineTo(-15 * scale, 4 * scale);
  ctx.moveTo(10 * scale, 12 * scale);
  ctx.lineTo(8 * scale, 4 * scale);
  ctx.stroke();

  // Sleigh Body Tub (Curved antique shape)
  ctx.beginPath();
  ctx.moveTo(14 * scale, 2 * scale);
  ctx.bezierCurveTo(22 * scale, 2 * scale, 18 * scale, -8 * scale, 14 * scale, -8 * scale);
  ctx.lineTo(-6 * scale, -8 * scale);
  // High curved backrest
  ctx.bezierCurveTo(-18 * scale, -8 * scale, -24 * scale, 0, -22 * scale, 2 * scale);
  ctx.closePath();
  ctx.fill();

  // Big Sack of Toys in the Back
  ctx.beginPath();
  ctx.ellipse(-14 * scale, -13 * scale, 11 * scale, 9 * scale, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Santa Claus Body Silhouette
  // Torso
  ctx.beginPath();
  ctx.ellipse(-1 * scale, -13 * scale, 8 * scale, 10 * scale, 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Santa Head & Round Beard
  ctx.beginPath();
  ctx.arc(3 * scale, -22 * scale, 5.5 * scale, 0, Math.PI * 2);
  ctx.fill();
  // Fluffy bushy beard extending forward
  ctx.beginPath();
  ctx.ellipse(6 * scale, -20 * scale, 5 * scale, 4 * scale, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Santa Hat with Pom-pom drooping back
  ctx.beginPath();
  ctx.moveTo(-1 * scale, -25 * scale);
  ctx.lineTo(6 * scale, -26 * scale);
  ctx.lineTo(-6 * scale, -32 * scale);
  ctx.closePath();
  ctx.fill();
  // Hat pom-pom
  ctx.beginPath();
  ctx.arc(-8 * scale, -32 * scale, 2.5 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Arm Holding the Reins forward
  ctx.lineWidth = 2.4 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(2 * scale, -13 * scale);
  ctx.lineTo(12 * scale, -11 * scale);
  ctx.stroke();

  // Main Lead Rein from Santa's hand stretching to first reindeer
  ctx.lineWidth = 1.2 * scale;
  ctx.beginPath();
  ctx.moveTo(12 * scale, -11 * scale);
  ctx.quadraticCurveTo(25 * scale, -6 * scale, 38 * scale, -4 * scale);
  ctx.stroke();

  ctx.restore();
}


