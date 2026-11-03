import { MotionConfig } from '../types/motion';

// ============================================================================
// NORDIC MINIMALIST FOLK-ART MOTION ENGINE
// Three Original Concepts in Scandinavian Warm Minimalism:
// 1. The Winter Alpine Express (Vintage Steam Train on Viaduct Bridge)
// 2. The Sacred Forest Gathering (Ancient Tree of Light & Wild Animal Silhouettes)
// 3. The Nordic Fjord Guiding Lighthouse (Coastal Harbor & 360° Light Beam)
// ============================================================================

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

// Draw 4-point or 8-point celestial star
function drawStarFolk(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerR: number, innerR: number, points = 4) {
  ctx.beginPath();
  const total = points * 2;
  for (let i = 0; i < total; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const a = (i * Math.PI) / points;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

// Draw Nordic dashed postal stamp frame with corner crosses
function drawNordicStampFrame(ctx: CanvasRenderingContext2D, width: number, height: number, scale: number, frameColor: string) {
  ctx.save();
  const pad = 38 * scale;
  ctx.strokeStyle = frameColor;
  ctx.lineWidth = 1.6 * scale;
  ctx.setLineDash([8 * scale, 6 * scale]);
  ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);
  ctx.setLineDash([]);

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
}

// Draw stylized serrated conifer pine tree
function drawStylizedPineTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  sway: number,
  scale: number,
  color: string
) {
  const tiers = 5;
  const tierH = h / tiers;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(sway);
  ctx.fillStyle = color;

  for (let tr = 0; tr < tiers; tr++) {
    const topY = -h + tr * tierH * 0.72;
    const botY = topY + tierH * 1.35;
    const curW = (w * (tr + 1.2)) / (tiers + 1);

    ctx.beginPath();
    ctx.moveTo(0, topY);
    ctx.lineTo(curW / 2, botY);
    ctx.lineTo(curW * 0.32, botY - 3 * scale);
    ctx.lineTo(0, botY);
    ctx.lineTo(-curW * 0.32, botY - 3 * scale);
    ctx.lineTo(-curW / 2, botY);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

// ============================================================================
// CONCEPT 1: THE WINTER ALPINE EXPRESS (STEAM TRAIN ON VIADUCT BRIDGE)
// ============================================================================
export function drawWinterAlpineExpress(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const isDark = config.backgroundMode === 'black';

  const bgColor = isDark ? '#02060c' : '#fcfaf2';
  const silMain = isDark ? '#f1f5f9' : '#1b4332';
  const silMtn = isDark ? 'rgba(51, 65, 85, 0.45)' : 'rgba(74, 104, 86, 0.42)';
  const warmAmber = '#f59e0b';
  const frameColor = isDark ? 'rgba(241, 245, 249, 0.35)' : 'rgba(27, 67, 50, 0.45)';

  // 1. Background Fill & Vignette
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  if (!isDark) {
    const bgGrad = ctx.createRadialGradient(width / 2, height * 0.4, minDim * 0.2, width / 2, height * 0.5, width * 0.75);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(0.65, '#faf6ec');
    bgGrad.addColorStop(1, '#ebe3d1');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Dashed Stamp Postal Frame
  drawNordicStampFrame(ctx, width, height, scale, frameColor);

  // 3. Layered Alpine Mountain Ridges
  ctx.save();
  const mtnY = height * 0.38;
  ctx.beginPath();
  ctx.moveTo(0, mtnY + 60 * scale);
  ctx.bezierCurveTo(width * 0.2, mtnY - 70 * scale, width * 0.4, mtnY + 20 * scale, width * 0.6, mtnY - 55 * scale);
  ctx.bezierCurveTo(width * 0.8, mtnY + 30 * scale, width * 0.92, mtnY - 40 * scale, width, mtnY + 50 * scale);
  ctx.lineTo(width, height * 0.75);
  ctx.lineTo(0, height * 0.75);
  ctx.closePath();
  ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.4)' : 'rgba(216, 207, 190, 0.65)';
  ctx.fill();

  // Mid Mountain peaks
  ctx.beginPath();
  ctx.moveTo(0, mtnY + 70 * scale);
  ctx.bezierCurveTo(width * 0.25, mtnY - 20 * scale, width * 0.5, mtnY + 35 * scale, width * 0.72, mtnY - 25 * scale);
  ctx.lineTo(width, mtnY + 80 * scale);
  ctx.lineTo(width, height * 0.75);
  ctx.lineTo(0, height * 0.75);
  ctx.closePath();
  ctx.fillStyle = silMtn;
  ctx.fill();
  ctx.restore();

  // Crescent Moon in upper sky
  ctx.save();
  const moonX = width * 0.22;
  const moonY = height * 0.16;
  ctx.fillStyle = isDark ? '#fef08a' : '#d97706';
  ctx.beginPath();
  ctx.arc(moonX, moonY, 16 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.arc(moonX + 7 * scale, moonY - 3 * scale, 14 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4. Snowy Valley & River Base
  const groundY = height * 0.60;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, groundY - 20 * scale);
  ctx.bezierCurveTo(width * 0.3, groundY + 40 * scale, width * 0.7, groundY + 20 * scale, width, groundY - 15 * scale);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fillStyle = isDark ? '#040914' : '#faf5eb';
  ctx.fill();

  // Frozen river ribbon winding between canyon piers
  ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.18)' : 'rgba(74, 104, 86, 0.25)';
  ctx.beginPath();
  ctx.moveTo(width * 0.44, groundY + 15 * scale);
  ctx.bezierCurveTo(width * 0.48, groundY + 60 * scale, width * 0.55, groundY + 90 * scale, width * 0.52, height);
  ctx.lineTo(width * 0.58, height);
  ctx.bezierCurveTo(width * 0.62, groundY + 90 * scale, width * 0.54, groundY + 60 * scale, width * 0.49, groundY + 15 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 5. Grand Stone Arch Viaduct Bridge
  // Curving sweeping railway bridge across canyon
  const bridgeY = height * 0.52;
  const arches = 6;
  const archSpan = width * 0.12;
  const bridgeStartX = width * 0.18;

  ctx.save();
  ctx.fillStyle = silMain;

  // Bridge deck track slab
  ctx.beginPath();
  ctx.moveTo(width * 0.14, bridgeY - 18 * scale);
  ctx.bezierCurveTo(width * 0.45, bridgeY + 8 * scale, width * 0.75, bridgeY - 6 * scale, width * 0.94, bridgeY - 22 * scale);
  ctx.lineTo(width * 0.94, bridgeY - 12 * scale);
  ctx.bezierCurveTo(width * 0.75, bridgeY + 4 * scale, width * 0.45, bridgeY + 18 * scale, width * 0.14, bridgeY - 8 * scale);
  ctx.closePath();
  ctx.fill();

  // Viaduct Piers & Arches
  for (let a = 0; a < arches; a++) {
    const ax = bridgeStartX + a * archSpan;
    const ay = bridgeY + Math.sin(a * 0.4) * (8 * scale);
    const pierH = (height * 0.75) - ay;
    const pierW = 18 * scale;

    // Stone pier legs
    ctx.fillRect(ax - pierW / 2, ay, pierW, pierH);

    // Semi-circular arch opening between piers
    if (a < arches - 1) {
      const nextX = ax + archSpan;
      const midX = (ax + nextX) / 2;
      const archR = (archSpan - pierW) * 0.5;

      ctx.save();
      ctx.fillStyle = isDark ? '#040914' : '#faf5eb';
      ctx.beginPath();
      ctx.arc(midX, ay + archR + 4 * scale, archR, Math.PI, 0);
      ctx.lineTo(nextX - pierW / 2, ay + pierH);
      ctx.lineTo(ax + pierW / 2, ay + pierH);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  // Stone viaduct parapet railing
  ctx.strokeStyle = isDark ? '#ffffff' : '#fcfaf2';
  ctx.lineWidth = 1.6 * scale;
  ctx.beginPath();
  ctx.moveTo(width * 0.14, bridgeY - 16 * scale);
  ctx.bezierCurveTo(width * 0.45, bridgeY + 10 * scale, width * 0.75, bridgeY - 4 * scale, width * 0.94, bridgeY - 20 * scale);
  ctx.stroke();
  ctx.restore();

  // 6. Pine Forests Framing Left and Right Valley Slopes
  ctx.save();
  const leftTrees = [
    { x: width * 0.04, w: 34 * scale, h: 210 * scale, s: 0.2 },
    { x: width * 0.08, w: 38 * scale, h: 235 * scale, s: 0.8 },
    { x: width * 0.12, w: 32 * scale, h: 185 * scale, s: 1.4 },
    { x: width * 0.16, w: 26 * scale, h: 155 * scale, s: 0.5 },
    { x: width * 0.20, w: 22 * scale, h: 120 * scale, s: 1.9 },
  ];
  leftTrees.forEach(t => drawStylizedPineTree(ctx, t.x, groundY + 15 * scale, t.w, t.h, Math.sin(time * 2 + t.s) * 0.02, scale, silMain));

  const rightTrees = [
    { x: width * 0.82, w: 24 * scale, h: 135 * scale, s: 0.7 },
    { x: width * 0.86, w: 32 * scale, h: 180 * scale, s: 1.3 },
    { x: width * 0.90, w: 38 * scale, h: 220 * scale, s: 0.4 },
    { x: width * 0.94, w: 34 * scale, h: 195 * scale, s: 1.8 },
    { x: width * 0.98, w: 30 * scale, h: 165 * scale, s: 1.0 },
  ];
  rightTrees.forEach(t => drawStylizedPineTree(ctx, t.x, groundY + 20 * scale, t.w, t.h, Math.sin(time * 2 + t.s) * 0.02, scale, silMain));
  ctx.restore();

  // 7. Vintage Steam Train Chugging Across Bridge
  // Moves smoothly along track with progress loop
  ctx.save();
  const trainCycle = (progress * 1.0) % 1.0;
  const trainStartX = width * -0.25;
  const trainEndX = width * 1.25;
  const trainX = trainStartX + (trainEndX - trainStartX) * trainCycle;

  // Track height calculation along the bridge curve
  const getTrackY = (x: number) => {
    const t = clamp((x - width * 0.14) / (width * 0.80), 0, 1);
    return bridgeY - 14 * scale + Math.sin(t * Math.PI) * (20 * scale);
  };

  const locoY = getTrackY(trainX);

  // Draw Locomotive
  ctx.save();
  ctx.translate(trainX, locoY);
  ctx.fillStyle = silMain;

  // Locomotive Body & Boiler
  ctx.fillRect(-35 * scale, -24 * scale, 55 * scale, 22 * scale);
  // Cab
  ctx.fillRect(-55 * scale, -38 * scale, 24 * scale, 36 * scale);
  // Cab roof curve
  ctx.beginPath();
  ctx.moveTo(-58 * scale, -38 * scale);
  ctx.lineTo(-30 * scale, -38 * scale);
  ctx.lineTo(-31 * scale, -41 * scale);
  ctx.lineTo(-57 * scale, -41 * scale);
  ctx.closePath();
  ctx.fill();

  // Cab window (glowing warm amber with driver silhouette)
  ctx.fillStyle = isDark ? '#fef08a' : warmAmber;
  ctx.fillRect(-51 * scale, -32 * scale, 14 * scale, 12 * scale);

  // Chimney Smokestack
  ctx.fillStyle = silMain;
  ctx.beginPath();
  ctx.moveTo(8 * scale, -24 * scale);
  ctx.lineTo(6 * scale, -44 * scale);
  ctx.lineTo(16 * scale, -44 * scale);
  ctx.lineTo(14 * scale, -24 * scale);
  ctx.closePath();
  ctx.fill();

  // Steam Dome
  ctx.beginPath();
  ctx.arc(-8 * scale, -24 * scale, 6 * scale, Math.PI, 0);
  ctx.fill();

  // Cowcatcher plow on front
  ctx.beginPath();
  ctx.moveTo(20 * scale, -2 * scale);
  ctx.lineTo(32 * scale, -2 * scale);
  ctx.lineTo(20 * scale, -14 * scale);
  ctx.closePath();
  ctx.fill();

  // Front Headlight (Shooting beam forward)
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(22 * scale, -16 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Headlight light cone
  const lightBeam = ctx.createRadialGradient(22 * scale, -16 * scale, 0, 80 * scale, -16 * scale, 120 * scale);
  lightBeam.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
  lightBeam.addColorStop(1, 'rgba(254, 240, 138, 0)');
  ctx.fillStyle = lightBeam;
  ctx.beginPath();
  ctx.moveTo(22 * scale, -16 * scale);
  ctx.lineTo(160 * scale, -40 * scale);
  ctx.lineTo(160 * scale, 8 * scale);
  ctx.closePath();
  ctx.fill();

  // Locomotive Wheels & Piston Rods
  const wheelCount = 4;
  const wheelR = 6.5 * scale;
  const wheelCycle = time * 18;
  ctx.fillStyle = silMain;
  for (let w = 0; w < wheelCount; w++) {
    const wx = -40 * scale + w * (15 * scale);
    ctx.beginPath();
    ctx.arc(wx, 0, wheelR, 0, Math.PI * 2);
    ctx.fill();

    // Wheel spokes and counterweight
    ctx.save();
    ctx.translate(wx, 0);
    ctx.rotate(wheelCycle);
    ctx.strokeStyle = isDark ? '#ffffff' : '#fcfaf2';
    ctx.lineWidth = 1.0 * scale;
    ctx.beginPath();
    ctx.moveTo(-wheelR, 0);
    ctx.lineTo(wheelR, 0);
    ctx.moveTo(0, -wheelR);
    ctx.lineTo(0, wheelR);
    ctx.stroke();
    ctx.restore();
  }

  // Connecting Piston Rod
  const rodOffset = Math.sin(wheelCycle) * (4 * scale);
  ctx.strokeStyle = isDark ? '#ffffff' : '#fcfaf2';
  ctx.lineWidth = 2.0 * scale;
  ctx.beginPath();
  ctx.moveTo(-40 * scale + Math.cos(wheelCycle) * (4 * scale), rodOffset);
  ctx.lineTo(5 * scale + Math.cos(wheelCycle) * (4 * scale), rodOffset);
  ctx.stroke();

  // Tender (Coal Car)
  ctx.fillStyle = silMain;
  ctx.fillRect(-98 * scale, -22 * scale, 38 * scale, 20 * scale);

  // Passenger Carriages (2 vintage lit coaches)
  for (let c = 0; c < 2; c++) {
    const cx = -170 * scale - c * (75 * scale);
    // Carriage body
    ctx.fillStyle = silMain;
    ctx.fillRect(cx, -26 * scale, 68 * scale, 24 * scale);
    // Carriage roof
    ctx.beginPath();
    ctx.moveTo(cx - 2 * scale, -26 * scale);
    ctx.lineTo(cx + 70 * scale, -26 * scale);
    ctx.lineTo(cx + 68 * scale, -29 * scale);
    ctx.lineTo(cx, -29 * scale);
    ctx.closePath();
    ctx.fill();

    // Carriage glowing warm windows (4 windows per carriage)
    for (let win = 0; win < 4; win++) {
      const winX = cx + 8 * scale + win * (15 * scale);
      ctx.fillStyle = isDark ? '#fef08a' : warmAmber;
      ctx.fillRect(winX, -20 * scale, 9 * scale, 10 * scale);
    }
  }

  ctx.restore();

  // 8. Billowing Clouds of Locomotive Steam/Smoke (Drifting Dynamically Backward)
  ctx.save();
  const smokePuffs = 28;
  for (let sp = 0; sp < smokePuffs; sp++) {
    const spAge = ((time * 0.8 + (sp / smokePuffs)) % 1);
    const chimneyGlobalX = trainX + 11 * scale;
    const chimneyGlobalY = locoY - 44 * scale;

    // Billows drift backward and float up in soft spiral
    const smX = chimneyGlobalX - spAge * (180 * scale) - Math.sin(spAge * 4 + sp) * (15 * scale);
    const smY = chimneyGlobalY - spAge * (75 * scale) - Math.pow(spAge, 1.4) * (45 * scale);
    const smR = (6 + spAge * 28) * scale;
    const smAlpha = Math.sin(spAge * Math.PI) * (isDark ? 0.65 : 0.75);

    ctx.beginPath();
    ctx.arc(smX, smY, smR, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? `rgba(241, 245, 249, ${smAlpha * 0.7})` : `rgba(238, 233, 218, ${smAlpha})`;
    ctx.fill();
  }
  ctx.restore();

  // 9. Falling Snow & Celestial Stars
  ctx.save();
  const snowCount = 50;
  for (let s = 0; s < snowCount; s++) {
    const seed = s * 37.19;
    const sx = ((hash(seed) + Math.sin(time * 0.5 + seed) * 0.08) % 1) * width;
    const sy = ((hash(seed + 1) + time * 0.06) % 1) * height;
    const sr = (hash(seed + 2) * 2.2 + 1.2) * scale;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? 'rgba(241, 245, 249, 0.6)' : 'rgba(27, 67, 50, 0.4)';
    ctx.fill();
  }
  ctx.restore();

  // 10. Minimalist Clean Typography
  ctx.save();
  ctx.textAlign = 'center';
  const textCenterY = height * 0.90;
  ctx.font = `800 ${28 * scale}px 'Outfit', 'Cinzel', serif`;
  ctx.letterSpacing = `${8 * scale}px`;
  ctx.fillStyle = silMain;
  ctx.fillText('THE WINTER ALPINE EXPRESS', width / 2, textCenterY - 14 * scale);

  ctx.font = `600 ${14 * scale}px 'Outfit', sans-serif`;
  ctx.letterSpacing = `${6 * scale}px`;
  ctx.fillStyle = isDark ? '#94a3b8' : 'rgba(27, 67, 50, 0.75)';
  ctx.fillText('MERRY CHRISTMAS & HAPPY NEW YEAR 2027', width / 2, textCenterY + 16 * scale);
  ctx.restore();
}

// ============================================================================
// CONCEPT 2: THE SACRED FOREST GATHERING (ANCIENT STARLIGHT PINE & WILD ANIMALS)
// ============================================================================
export function drawSacredForestStagGathering(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  _progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const isDark = config.backgroundMode === 'black';

  const bgColor = isDark ? '#02060c' : '#fcfaf2';
  const silMain = isDark ? '#f1f5f9' : '#1b4332';
  const warmGold = '#f59e0b';
  const frameColor = isDark ? 'rgba(241, 245, 249, 0.35)' : 'rgba(27, 67, 50, 0.45)';

  // 1. Background Fill & Vignette
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  if (!isDark) {
    const bgGrad = ctx.createRadialGradient(width / 2, height * 0.45, minDim * 0.15, width / 2, height * 0.5, width * 0.75);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(0.65, '#faf6ec');
    bgGrad.addColorStop(1, '#ede5d4');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Dashed Stamp Postal Frame
  drawNordicStampFrame(ctx, width, height, scale, frameColor);

  // 3. Layered Misty Forest Hills Backdrop
  ctx.save();
  const mtnY = height * 0.45;
  ctx.beginPath();
  ctx.moveTo(0, mtnY + 30 * scale);
  ctx.bezierCurveTo(width * 0.3, mtnY - 45 * scale, width * 0.7, mtnY - 30 * scale, width, mtnY + 40 * scale);
  ctx.lineTo(width, height * 0.8);
  ctx.lineTo(0, height * 0.8);
  ctx.closePath();
  ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(216, 207, 190, 0.65)';
  ctx.fill();

  // Distant conifer needles on ridge
  for (let d = 0; d < 22; d++) {
    const dx = width * (d / 22);
    const dy = mtnY - Math.sin((d / 22) * Math.PI) * (35 * scale);
    ctx.beginPath();
    ctx.moveTo(dx, dy - 22 * scale);
    ctx.lineTo(dx + 7 * scale, dy);
    ctx.lineTo(dx - 7 * scale, dy);
    ctx.closePath();
    ctx.fillStyle = isDark ? 'rgba(51, 65, 85, 0.5)' : 'rgba(74, 104, 86, 0.45)';
    ctx.fill();
  }
  ctx.restore();

  // 4. Snowy Valley Clearing Base
  const groundY = height * 0.68;
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(0, groundY - 10 * scale);
  ctx.bezierCurveTo(width * 0.35, groundY + 25 * scale, width * 0.65, groundY + 15 * scale, width, groundY - 8 * scale);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fillStyle = isDark ? '#050c18' : '#faf6ed';
  ctx.fill();
  ctx.restore();

  // 5. Pine Tree Amphitheater (Left & Right Flanks)
  ctx.save();
  const leftFlank = [
    { x: width * 0.05, w: 36 * scale, h: 220 * scale, s: 0.2 },
    { x: width * 0.10, w: 40 * scale, h: 245 * scale, s: 0.9 },
    { x: width * 0.15, w: 32 * scale, h: 190 * scale, s: 1.5 },
    { x: width * 0.20, w: 26 * scale, h: 145 * scale, s: 0.4 },
  ];
  leftFlank.forEach(p => drawStylizedPineTree(ctx, p.x, groundY + 12 * scale, p.w, p.h, Math.sin(time * 2 + p.s) * 0.02, scale, silMain));

  const rightFlank = [
    { x: width * 0.80, w: 26 * scale, h: 150 * scale, s: 0.6 },
    { x: width * 0.85, w: 34 * scale, h: 200 * scale, s: 1.2 },
    { x: width * 0.90, w: 42 * scale, h: 250 * scale, s: 0.3 },
    { x: width * 0.95, w: 36 * scale, h: 215 * scale, s: 1.7 },
  ];
  rightFlank.forEach(p => drawStylizedPineTree(ctx, p.x, groundY + 15 * scale, p.w, p.h, Math.sin(time * 2 + p.s) * 0.02, scale, silMain));
  ctx.restore();

  // 6. Central Sacred Starlight Christmas Tree (Ancient Majesty)
  const treeX = width * 0.50;
  const treeY = groundY + 20 * scale;
  const treeW = 90 * scale;
  const treeH = 260 * scale;

  ctx.save();
  drawStylizedPineTree(ctx, treeX, treeY, treeW, treeH, Math.sin(time * 1.5) * 0.015, scale, silMain);

  // Shining 8-Point Bethlehem Star at Peak
  const starPeakY = treeY - treeH - 8 * scale;
  const starPulse = 1 + 0.25 * Math.sin(time * 4.5);
  ctx.save();
  drawStarFolk(ctx, treeX, starPeakY, 14 * scale * starPulse, 5 * scale * starPulse, 8);
  ctx.fillStyle = warmGold;
  ctx.shadowColor = warmGold;
  ctx.shadowBlur = 18 * scale;
  ctx.fill();

  // Star Rays
  ctx.strokeStyle = `rgba(251, 191, 36, ${0.4 + 0.3 * Math.sin(time * 4.5)})`;
  ctx.lineWidth = 1.2 * scale;
  ctx.beginPath();
  ctx.moveTo(treeX, starPeakY - 26 * scale);
  ctx.lineTo(treeX, starPeakY + 26 * scale);
  ctx.moveTo(treeX - 26 * scale, starPeakY);
  ctx.lineTo(treeX + 26 * scale, starPeakY);
  ctx.stroke();
  ctx.restore();

  // Glowing Hanging Golden Lantern Orbs on branches
  const lanterns = [
    { tier: 0.85, offset: -0.32, id: 1 },
    { tier: 0.85, offset: 0.32, id: 2 },
    { tier: 0.65, offset: -0.28, id: 3 },
    { tier: 0.65, offset: 0.28, id: 4 },
    { tier: 0.45, offset: -0.22, id: 5 },
    { tier: 0.45, offset: 0.22, id: 6 },
    { tier: 0.25, offset: -0.15, id: 7 },
    { tier: 0.25, offset: 0.15, id: 8 },
  ];

  lanterns.forEach(lt => {
    const ly = treeY - treeH * lt.tier;
    const lx = treeX + lt.offset * (treeW * lt.tier);
    const lflicker = 0.8 + 0.2 * Math.sin(time * 5 + lt.id * 2);

    // Cord
    ctx.strokeStyle = isDark ? '#ffffff' : '#fcfaf2';
    ctx.lineWidth = 1.0 * scale;
    ctx.beginPath();
    ctx.moveTo(lx, ly - 8 * scale);
    ctx.lineTo(lx, ly);
    ctx.stroke();

    // Lantern glowing bulb
    ctx.save();
    ctx.beginPath();
    ctx.arc(lx, ly + 4 * scale, 3.8 * scale, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(251, 191, 36, ${lflicker})`;
    ctx.shadowColor = warmGold;
    ctx.shadowBlur = 10 * scale;
    ctx.fill();
    ctx.restore();
  });
  ctx.restore();

  // 7. Wild Forest Creatures Gathered in the Snow
  ctx.save();
  ctx.fillStyle = silMain;

  // A. Majestic Stag with Branching Antlers (Standing Regally on the Left)
  const stagX = width * 0.34;
  const stagY = groundY + 12 * scale;
  drawMajesticStag(ctx, stagX, stagY, scale, time, silMain);

  // B. Gentle Doe and Fawn (Beside the Stag)
  const doeX = width * 0.26;
  const doeY = groundY + 10 * scale;
  drawGentleDoe(ctx, doeX, doeY, scale, time, silMain);

  // C. Resting Arctic Fox (Sitting Alertly on the Right)
  const foxX = width * 0.64;
  const foxY = groundY + 16 * scale;
  drawArcticFox(ctx, foxX, foxY, scale, time, silMain);

  // D. Second Reindeer / Caribou (Grazing peacefully on the Right)
  const reinX = width * 0.72;
  const reinY = groundY + 14 * scale;
  drawPeacefulReindeer(ctx, reinX, reinY, scale, time, silMain);
  ctx.restore();

  // 8. Floating Golden Fairy Fireflies & Magical Ember Particles
  ctx.save();
  const fireflyCount = 34;
  for (let ff = 0; ff < fireflyCount; ff++) {
    const fSeed = ff * 47.19;
    const fx = treeX + (hash(fSeed) - 0.5) * (treeW * 2.2) + Math.sin(time * 1.5 + ff) * (20 * scale);
    const fy = treeY - treeH * (0.1 + hash(fSeed + 1) * 0.85) + Math.cos(time * 2 + ff * 1.2) * (15 * scale);
    const fPulse = 0.4 + 0.6 * Math.sin(time * 4 + ff * 3);
    const fR = (1.5 + hash(fSeed + 2) * 2.5) * scale;

    ctx.save();
    ctx.beginPath();
    ctx.arc(fx, fy, fR, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(251, 191, 36, ${fPulse})`;
    ctx.shadowColor = warmGold;
    ctx.shadowBlur = 8 * scale;
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // 9. Falling Gentle Snowfall
  ctx.save();
  const snowCount = 45;
  for (let s = 0; s < snowCount; s++) {
    const seed = s * 29.83;
    const sx = ((hash(seed) + Math.sin(time * 0.5 + seed) * 0.06) % 1) * width;
    const sy = ((hash(seed + 1) + time * 0.05) % 1) * height;
    const sr = (hash(seed + 2) * 2.0 + 1.2) * scale;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? 'rgba(241, 245, 249, 0.6)' : 'rgba(27, 67, 50, 0.4)';
    ctx.fill();
  }
  ctx.restore();

  // 10. Minimalist Typography
  ctx.save();
  ctx.textAlign = 'center';
  const textCenterY = height * 0.90;
  ctx.font = `800 ${28 * scale}px 'Outfit', 'Cinzel', serif`;
  ctx.letterSpacing = `${8 * scale}px`;
  ctx.fillStyle = silMain;
  ctx.fillText('PEACE ON EARTH & SACRED WINTER', width / 2, textCenterY - 14 * scale);

  ctx.font = `600 ${14 * scale}px 'Outfit', sans-serif`;
  ctx.letterSpacing = `${6 * scale}px`;
  ctx.fillStyle = isDark ? '#94a3b8' : 'rgba(27, 67, 50, 0.75)';
  ctx.fillText('MERRY CHRISTMAS & HAPPY NEW YEAR 2027', width / 2, textCenterY + 16 * scale);
  ctx.restore();
}

// ----------------------------------------------------------------------------
// VECTOR HELPER: DRAW MAJESTIC STAG SILHOUETTE
// ----------------------------------------------------------------------------
function drawMajesticStag(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  time: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;

  // Breathing movement
  const breathe = Math.sin(time * 2.5) * (0.8 * scale);

  // Stag Body
  ctx.beginPath();
  ctx.ellipse(0, -28 * scale + breathe, 24 * scale, 14 * scale, -0.05, 0, Math.PI * 2);
  ctx.fill();

  // Strong Neck
  ctx.beginPath();
  ctx.moveTo(14 * scale, -32 * scale + breathe);
  ctx.lineTo(24 * scale, -54 * scale + breathe);
  ctx.lineTo(16 * scale, -58 * scale + breathe);
  ctx.lineTo(6 * scale, -36 * scale + breathe);
  ctx.closePath();
  ctx.fill();

  // Stag Head
  ctx.beginPath();
  ctx.moveTo(18 * scale, -58 * scale + breathe);
  ctx.lineTo(30 * scale, -56 * scale + breathe); // snout
  ctx.lineTo(24 * scale, -64 * scale + breathe); // forehead
  ctx.closePath();
  ctx.fill();

  // Tall Ears
  ctx.beginPath();
  ctx.ellipse(17 * scale, -63 * scale + breathe, 4 * scale, 2 * scale, 0.6, 0, Math.PI * 2);
  ctx.fill();

  // Magnificent Branching Antlers
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.0 * scale;
  ctx.beginPath();
  // Main Beam
  ctx.moveTo(20 * scale, -62 * scale + breathe);
  ctx.quadraticCurveTo(24 * scale, -84 * scale + breathe, 14 * scale, -95 * scale + breathe);
  // Brow Tine
  ctx.moveTo(21 * scale, -68 * scale + breathe);
  ctx.lineTo(28 * scale, -72 * scale + breathe);
  // Bez Tine
  ctx.moveTo(20 * scale, -75 * scale + breathe);
  ctx.lineTo(28 * scale, -81 * scale + breathe);
  // Crown Prongs
  ctx.moveTo(17 * scale, -88 * scale + breathe);
  ctx.lineTo(22 * scale, -92 * scale + breathe);
  ctx.moveTo(15 * scale, -92 * scale + breathe);
  ctx.lineTo(10 * scale, -94 * scale + breathe);
  ctx.stroke();

  // Legs (Standing Proudly in snow)
  ctx.lineWidth = 2.8 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  // Forelegs
  ctx.moveTo(15 * scale, -18 * scale);
  ctx.lineTo(16 * scale, 0);
  ctx.moveTo(10 * scale, -18 * scale);
  ctx.lineTo(9 * scale, 0);
  // Hindlegs
  ctx.moveTo(-16 * scale, -18 * scale);
  ctx.lineTo(-14 * scale, 0);
  ctx.moveTo(-20 * scale, -18 * scale);
  ctx.lineTo(-19 * scale, 0);
  ctx.stroke();

  ctx.restore();
}

// ----------------------------------------------------------------------------
// VECTOR HELPER: DRAW GENTLE DOE SILHOUETTE
// ----------------------------------------------------------------------------
function drawGentleDoe(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  time: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;

  const breathe = Math.sin(time * 2.5 + 1) * (0.6 * scale);

  // Body
  ctx.beginPath();
  ctx.ellipse(0, -22 * scale + breathe, 18 * scale, 11 * scale, 0.05, 0, Math.PI * 2);
  ctx.fill();

  // Neck and Head (Lowered gently)
  ctx.beginPath();
  ctx.moveTo(10 * scale, -24 * scale + breathe);
  ctx.lineTo(19 * scale, -38 * scale + breathe);
  ctx.lineTo(24 * scale, -36 * scale + breathe);
  ctx.lineTo(14 * scale, -22 * scale + breathe);
  ctx.closePath();
  ctx.fill();

  // Slender Legs
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.2 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(10 * scale, -14 * scale);
  ctx.lineTo(12 * scale, 0);
  ctx.moveTo(-12 * scale, -14 * scale);
  ctx.lineTo(-10 * scale, 0);
  ctx.stroke();

  ctx.restore();
}

// ----------------------------------------------------------------------------
// VECTOR HELPER: DRAW ARCTIC FOX SILHOUETTE
// ----------------------------------------------------------------------------
function drawArcticFox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  time: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;

  // Fox sitting alertly
  ctx.beginPath();
  ctx.ellipse(0, -12 * scale, 12 * scale, 9 * scale, -0.4, 0, Math.PI * 2);
  ctx.fill();

  // Head and Pointy Muzzle
  ctx.beginPath();
  ctx.moveTo(4 * scale, -16 * scale);
  ctx.lineTo(16 * scale, -18 * scale);
  ctx.lineTo(8 * scale, -25 * scale);
  ctx.closePath();
  ctx.fill();

  // Pointy Fox Ears
  ctx.beginPath();
  ctx.moveTo(5 * scale, -24 * scale);
  ctx.lineTo(7 * scale, -31 * scale);
  ctx.lineTo(10 * scale, -24 * scale);
  ctx.closePath();
  ctx.fill();

  // Big Bushy Tail Curled Round
  const tailSway = Math.sin(time * 3) * 0.1;
  ctx.save();
  ctx.translate(-8 * scale, -6 * scale);
  ctx.rotate(tailSway);
  ctx.beginPath();
  ctx.ellipse(-6 * scale, -2 * scale, 13 * scale, 6 * scale, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();
}

// ----------------------------------------------------------------------------
// VECTOR HELPER: DRAW PEACEFUL GRAZING REINDEER
// ----------------------------------------------------------------------------
function drawPeacefulReindeer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  _time: number,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;

  // Reindeer body
  ctx.beginPath();
  ctx.ellipse(0, -24 * scale, 20 * scale, 12 * scale, 0.05, 0, Math.PI * 2);
  ctx.fill();

  // Lowered Head (Grazing on lichen)
  ctx.beginPath();
  ctx.moveTo(12 * scale, -22 * scale);
  ctx.lineTo(22 * scale, -14 * scale);
  ctx.lineTo(18 * scale, -8 * scale);
  ctx.lineTo(8 * scale, -16 * scale);
  ctx.closePath();
  ctx.fill();

  // Backward curved antlers
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.8 * scale;
  ctx.beginPath();
  ctx.moveTo(18 * scale, -18 * scale);
  ctx.quadraticCurveTo(14 * scale, -32 * scale, 4 * scale, -36 * scale);
  ctx.moveTo(14 * scale, -28 * scale);
  ctx.lineTo(8 * scale, -31 * scale);
  ctx.stroke();

  // Sturdy Legs
  ctx.lineWidth = 2.5 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(11 * scale, -14 * scale);
  ctx.lineTo(10 * scale, 0);
  ctx.moveTo(-13 * scale, -14 * scale);
  ctx.lineTo(-12 * scale, 0);
  ctx.stroke();

  ctx.restore();
}

// ============================================================================
// CONCEPT 3: THE NORDIC FJORD & GUIDING LIGHTHOUSE HARBOR
// ============================================================================
export function drawNordicFjordGuidingLighthouse(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  _progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const isDark = config.backgroundMode === 'black';

  const bgColor = isDark ? '#02060c' : '#fcfaf2';
  const silMain = isDark ? '#f1f5f9' : '#1b4332';
  const warmGold = '#f59e0b';
  const waterColor = isDark ? '#040b17' : '#eaf0ec';
  const frameColor = isDark ? 'rgba(241, 245, 249, 0.35)' : 'rgba(27, 67, 50, 0.45)';

  // 1. Background Fill & Night Sky Vignette
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  if (!isDark) {
    const bgGrad = ctx.createRadialGradient(width * 0.45, height * 0.35, minDim * 0.15, width / 2, height * 0.5, width * 0.8);
    bgGrad.addColorStop(0, '#ffffff');
    bgGrad.addColorStop(0.65, '#faf6ec');
    bgGrad.addColorStop(1, '#ede5d4');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Dashed Stamp Postal Frame
  drawNordicStampFrame(ctx, width, height, scale, frameColor);

  // 3. Layered Fjord Mountain Cliffs Backdrop
  ctx.save();
  const fjordMtnY = height * 0.42;
  // Left mountain slope
  ctx.beginPath();
  ctx.moveTo(0, fjordMtnY - 50 * scale);
  ctx.lineTo(width * 0.28, fjordMtnY + 20 * scale);
  ctx.lineTo(width * 0.42, fjordMtnY - 20 * scale);
  ctx.lineTo(width * 0.52, fjordMtnY + 40 * scale);
  ctx.lineTo(0, fjordMtnY + 60 * scale);
  ctx.closePath();
  ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(216, 207, 190, 0.65)';
  ctx.fill();

  // Right towering sheer fjord cliff
  ctx.beginPath();
  ctx.moveTo(width * 0.72, fjordMtnY + 60 * scale);
  ctx.lineTo(width * 0.84, fjordMtnY - 80 * scale);
  ctx.lineTo(width, fjordMtnY - 40 * scale);
  ctx.lineTo(width, height * 0.7);
  ctx.lineTo(width * 0.72, height * 0.7);
  ctx.closePath();
  ctx.fillStyle = isDark ? 'rgba(51, 65, 85, 0.55)' : 'rgba(74, 104, 86, 0.48)';
  ctx.fill();
  ctx.restore();

  // 4. Calm Fjord Sea Water Base
  const waterY = height * 0.56;
  ctx.save();
  ctx.fillStyle = waterColor;
  ctx.fillRect(0, waterY, width, height - waterY);

  // Subtle water reflection shimmer lines
  const ripples = 14;
  for (let r = 0; r < ripples; r++) {
    const ry = waterY + (r / ripples) * (height * 0.32);
    const rWidth = (width * 0.3 + Math.sin(time * 2 + r) * (40 * scale));
    const rx = width * 0.5 - rWidth * 0.5;
    ctx.fillStyle = isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(27, 67, 50, 0.15)';
    ctx.fillRect(rx, ry, rWidth, 1.8 * scale);
  }
  ctx.restore();

  // 5. Left Snowy Shore & Rorbu Fisherman Cabins on Stilts
  ctx.save();
  const shoreY = waterY;
  ctx.beginPath();
  ctx.moveTo(0, shoreY - 30 * scale);
  ctx.lineTo(width * 0.48, shoreY + 10 * scale);
  ctx.lineTo(width * 0.45, shoreY + 35 * scale);
  ctx.lineTo(0, shoreY + 50 * scale);
  ctx.closePath();
  ctx.fillStyle = isDark ? '#050c18' : '#faf6ed';
  ctx.fill();

  // Rorbu Cabins with glowing windows
  const rorbuX = [width * 0.12, width * 0.20, width * 0.29, width * 0.37];
  for (let rb = 0; rb < 4; rb++) {
    const rx = rorbuX[rb];
    const rw = (28 + (rb % 2) * 6) * scale;
    const rh = (32 + (rb % 2) * 8) * scale;
    const ry = shoreY - 14 * scale;

    // Wooden stilts over water
    ctx.strokeStyle = silMain;
    ctx.lineWidth = 1.6 * scale;
    ctx.beginPath();
    ctx.moveTo(rx + 4 * scale, ry);
    ctx.lineTo(rx + 4 * scale, ry + 16 * scale);
    ctx.moveTo(rx + rw - 4 * scale, ry);
    ctx.lineTo(rx + rw - 4 * scale, ry + 16 * scale);
    ctx.stroke();

    // Cabin Body
    ctx.fillStyle = silMain;
    ctx.fillRect(rx, ry - rh, rw, rh);

    // Gabled Roof with Snow Cap
    ctx.beginPath();
    ctx.moveTo(rx - 3 * scale, ry - rh);
    ctx.lineTo(rx + rw / 2, ry - rh - 16 * scale);
    ctx.lineTo(rx + rw + 3 * scale, ry - rh);
    ctx.closePath();
    ctx.fill();

    // Snow on roof
    ctx.fillStyle = isDark ? '#ffffff' : '#fcfaf2';
    ctx.beginPath();
    ctx.moveTo(rx - 4 * scale, ry - rh);
    ctx.lineTo(rx + rw / 2, ry - rh - 18 * scale);
    ctx.lineTo(rx + rw + 4 * scale, ry - rh);
    ctx.lineTo(rx + rw + 2 * scale, ry - rh + 3 * scale);
    ctx.lineTo(rx + rw / 2, ry - rh - 15 * scale);
    ctx.lineTo(rx - 2 * scale, ry - rh + 3 * scale);
    ctx.closePath();
    ctx.fill();

    // Glowing warm interior window
    ctx.fillStyle = isDark ? '#fef08a' : warmGold;
    ctx.fillRect(rx + rw * 0.3, ry - rh * 0.65, 8 * scale, 8 * scale);
  }
  ctx.restore();

  // 6. Coastal Lighthouse on Rocky Promontory
  const lhX = width * 0.44;
  const lhY = waterY;
  const lhH = 135 * scale;
  const lhW = 28 * scale;

  ctx.save();
  // Rocky reef base
  ctx.fillStyle = silMain;
  ctx.beginPath();
  ctx.ellipse(lhX, lhY + 8 * scale, 34 * scale, 14 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tapered stone lighthouse tower
  ctx.beginPath();
  ctx.moveTo(lhX - lhW * 0.5, lhY);
  ctx.lineTo(lhX - lhW * 0.35, lhY - lhH * 0.75);
  ctx.lineTo(lhX + lhW * 0.35, lhY - lhH * 0.75);
  ctx.lineTo(lhX + lhW * 0.5, lhY);
  ctx.closePath();
  ctx.fill();

  // Lantern room gallery deck
  ctx.fillRect(lhX - lhW * 0.42, lhY - lhH * 0.78, lhW * 0.84, 4 * scale);

  // Lantern glass room
  ctx.fillStyle = isDark ? '#fef08a' : warmGold;
  ctx.fillRect(lhX - lhW * 0.32, lhY - lhH * 0.92, lhW * 0.64, 18 * scale);

  // Lighthouse cupola dome & finial
  ctx.fillStyle = silMain;
  ctx.beginPath();
  ctx.arc(lhX, lhY - lhH * 0.92, lhW * 0.35, Math.PI, 0);
  ctx.fill();
  ctx.fillRect(lhX - 1.5 * scale, lhY - lhH - 4 * scale, 3 * scale, 8 * scale);

  // 7. Rotating 360° Volumetric Light Beam
  // Sweeps continuously across the winter sea and sky
  const beamAngle = time * 0.8;
  const beamCos = Math.cos(beamAngle);
  const beamSin = Math.sin(beamAngle);
  const lanternCenterY = lhY - lhH * 0.84;

  if (beamCos > -0.2) {
    ctx.save();
    ctx.globalCompositeOperation = isDark ? 'lighter' : 'source-over';
    const beamLength = width * 0.55;
    const beamSpread = 32 * scale;

    const bTargetX = lhX + beamCos * beamLength;
    const bTargetY = lanternCenterY + beamSin * (40 * scale) + (35 * scale);

    const beamGrad = ctx.createRadialGradient(lhX, lanternCenterY, 4 * scale, bTargetX, bTargetY, beamLength);
    beamGrad.addColorStop(0, 'rgba(251, 191, 36, 0.85)');
    beamGrad.addColorStop(0.35, 'rgba(245, 158, 11, 0.45)');
    beamGrad.addColorStop(1, 'rgba(251, 191, 36, 0)');

    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(lhX, lanternCenterY);
    ctx.lineTo(bTargetX - beamSpread * 0.5, bTargetY - beamSpread);
    ctx.lineTo(bTargetX + beamSpread * 0.5, bTargetY + beamSpread);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Water reflection of lighthouse
  ctx.save();
  ctx.fillStyle = isDark ? 'rgba(241, 245, 249, 0.15)' : 'rgba(27, 67, 50, 0.2)';
  ctx.fillRect(lhX - 6 * scale, waterY + 4 * scale, 12 * scale, 38 * scale);
  ctx.restore();

  ctx.restore();

  // 8. Classic Wooden Sailboat Gliding on Water
  ctx.save();
  const boatX = width * 0.70 + Math.sin(time * 0.8) * (20 * scale);
  const boatY = waterY + 45 * scale;
  const boatBob = Math.sin(time * 3) * (2 * scale);

  ctx.translate(boatX, boatY + boatBob);
  ctx.fillStyle = silMain;

  // Boat Hull
  ctx.beginPath();
  ctx.moveTo(-22 * scale, 0);
  ctx.lineTo(26 * scale, 0);
  ctx.bezierCurveTo(24 * scale, 8 * scale, -18 * scale, 8 * scale, -22 * scale, 0);
  ctx.closePath();
  ctx.fill();

  // Mast
  ctx.strokeStyle = silMain;
  ctx.lineWidth = 1.8 * scale;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, -48 * scale);
  ctx.stroke();

  // Triangular Sail
  ctx.fillStyle = isDark ? '#ffffff' : '#faf6ed';
  ctx.beginPath();
  ctx.moveTo(1 * scale, -44 * scale);
  ctx.lineTo(20 * scale, -10 * scale);
  ctx.lineTo(1 * scale, -8 * scale);
  ctx.closePath();
  ctx.fill();

  // Water Wake Ripples behind boat
  ctx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.35)' : 'rgba(27, 67, 50, 0.35)';
  ctx.lineWidth = 1.2 * scale;
  ctx.beginPath();
  ctx.moveTo(-24 * scale, 4 * scale);
  ctx.lineTo(-45 * scale, 8 * scale);
  ctx.stroke();

  ctx.restore();

  // 9. Constellations & Falling Snow in Starry Sky
  ctx.save();
  const stars = [
    { x: 0.15, y: 0.12 }, { x: 0.22, y: 0.08 }, { x: 0.28, y: 0.14 },
    { x: 0.65, y: 0.10 }, { x: 0.75, y: 0.06 }, { x: 0.82, y: 0.12 }, { x: 0.88, y: 0.09 }
  ];
  stars.forEach((st, idx) => {
    const pulse = 0.5 + 0.5 * Math.sin(time * 3 + idx);
    drawStarFolk(ctx, width * st.x, height * st.y, 4 * scale * pulse, 1.8 * scale * pulse, 4);
    ctx.fillStyle = isDark ? warmGold : '#d97706';
    ctx.fill();
  });

  const snowCount = 40;
  for (let s = 0; s < snowCount; s++) {
    const seed = s * 31.7;
    const sx = ((hash(seed) + Math.sin(time * 0.5 + seed) * 0.06) % 1) * width;
    const sy = ((hash(seed + 1) + time * 0.05) % 1) * height;
    const sr = (hash(seed + 2) * 1.8 + 1.0) * scale;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fillStyle = isDark ? 'rgba(241, 245, 249, 0.5)' : 'rgba(27, 67, 50, 0.35)';
    ctx.fill();
  }
  ctx.restore();

  // 10. Minimalist Typography
  ctx.save();
  ctx.textAlign = 'center';
  const textCenterY = height * 0.90;
  ctx.font = `800 ${28 * scale}px 'Outfit', 'Cinzel', serif`;
  ctx.letterSpacing = `${8 * scale}px`;
  ctx.fillStyle = silMain;
  ctx.fillText('THE GUIDING LIGHT OF TIME', width / 2, textCenterY - 14 * scale);

  ctx.font = `600 ${14 * scale}px 'Outfit', sans-serif`;
  ctx.letterSpacing = `${6 * scale}px`;
  ctx.fillStyle = isDark ? '#94a3b8' : 'rgba(27, 67, 50, 0.75)';
  ctx.fillText('MERRY CHRISTMAS & HAPPY NEW YEAR 2027', width / 2, textCenterY + 16 * scale);
  ctx.restore();
}
