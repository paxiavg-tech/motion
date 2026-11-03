import { MotionConfig } from '../types/motion';

// ============================================================================
// MATHEMATICAL & PHYSICS UTILITIES
// ============================================================================

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// Deterministic pseudo-random generator (for frame-by-frame offline rendering stability)
function hash(n: number): number {
  const x = Math.sin(n * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// 4-Point Golden Star Sparkle
function drawStar4Point(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  outerR: number,
  innerR: number
) {
  const safeOuter = Math.max(0.01, Math.abs(outerR));
  const safeInner = Math.max(0.01, Math.abs(innerR));
  ctx.beginPath();
  for (let i = 0; i < 8; i++) {
    const r = i % 2 === 0 ? safeOuter : safeInner;
    const a = (i * Math.PI) / 4;
    const x = cx + Math.cos(a) * r;
    const y = cy + Math.sin(a) * r;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

// Draw a realistic 6-branch symmetrical crystalline snowflake
function drawSnowflake(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  rot: number,
  alpha: number
) {
  const safeR = Math.max(0.1, Math.abs(radius));
  const safeAlpha = clamp(alpha, 0, 1);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rot);
  ctx.strokeStyle = `rgba(255, 255, 255, ${safeAlpha})`;
  ctx.lineWidth = Math.max(1, safeR * 0.12);
  ctx.lineCap = 'round';

  for (let b = 0; b < 6; b++) {
    ctx.save();
    ctx.rotate((b * Math.PI) / 3);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -safeR);
    ctx.stroke();

    const barb1 = -safeR * 0.45;
    const barb2 = -safeR * 0.75;
    const barbLen = safeR * 0.28;

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
// VECTOR SILHOUETTE ASSETS (SANTA, SLEIGH & GALLOPING REINDEER)
// ============================================================================

/**
 * Galloping reindeer with authentic quadruped gait cycle:
 * alternating front and hind legs, branched antlers, and Rudolph's glowing nose option
 */
function drawGallopingReindeer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  gallopPhase: number,
  isRudolph: boolean,
  color: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  // Reindeer Torso (Aerodynamic elongated body)
  ctx.beginPath();
  ctx.ellipse(0, 0, 14 * scale, 7.5 * scale, -0.12, 0, Math.PI * 2);
  ctx.fill();

  // Neck and Head angled forward
  ctx.beginPath();
  ctx.moveTo(8 * scale, -3 * scale);
  ctx.lineTo(16 * scale, -13 * scale); // chin
  ctx.lineTo(21 * scale, -12 * scale); // muzzle tip
  ctx.lineTo(19 * scale, -16 * scale); // forehead
  ctx.lineTo(10 * scale, -9 * scale);  // back of neck
  ctx.closePath();
  ctx.fill();

  // Antlers (Majestic branching horns)
  ctx.lineWidth = 1.3 * scale;
  ctx.beginPath();
  // Main beam
  ctx.moveTo(17 * scale, -15 * scale);
  ctx.quadraticCurveTo(18 * scale, -23 * scale, 13 * scale, -27 * scale);
  // Brow tine
  ctx.moveTo(17 * scale, -18 * scale);
  ctx.lineTo(21 * scale, -20 * scale);
  // Trez tine
  ctx.moveTo(16 * scale, -21 * scale);
  ctx.lineTo(12 * scale, -23 * scale);
  // Top fork
  ctx.moveTo(14 * scale, -25 * scale);
  ctx.lineTo(17 * scale, -27 * scale);
  ctx.stroke();

  // Tiny Ear
  ctx.beginPath();
  ctx.ellipse(13 * scale, -13 * scale, 2.8 * scale, 1.4 * scale, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Rudolph's glowing red nose with warm volumetric halo
  if (isRudolph) {
    const noseGlow = ctx.createRadialGradient(
      21 * scale,
      -12 * scale,
      0,
      21 * scale,
      -12 * scale,
      12 * scale
    );
    noseGlow.addColorStop(0, 'rgba(239, 68, 68, 1)');
    noseGlow.addColorStop(0.35, 'rgba(220, 38, 38, 0.8)');
    noseGlow.addColorStop(0.7, 'rgba(185, 28, 28, 0.25)');
    noseGlow.addColorStop(1, 'rgba(239, 68, 68, 0)');
    ctx.fillStyle = noseGlow;
    ctx.beginPath();
    ctx.arc(21 * scale, -12 * scale, 12 * scale, 0, Math.PI * 2);
    ctx.fill();

    // Solid bright nose core
    ctx.fillStyle = '#ff4d4d';
    ctx.beginPath();
    ctx.arc(21 * scale, -12 * scale, 2.2 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = color; // reset
  }

  // Front Galloping Legs (Swinging rhythmically in biomechanical gait)
  const frontSwing = Math.sin(gallopPhase) * 0.75;
  ctx.lineWidth = 2.0 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  // Front Leg 1 (Upper reach)
  ctx.moveTo(8 * scale, 4 * scale);
  ctx.lineTo(
    8 * scale + Math.sin(frontSwing) * 14 * scale,
    4 * scale + Math.cos(frontSwing) * 14 * scale
  );
  // Front Leg 2 (Opposite swing)
  ctx.moveTo(11 * scale, 4 * scale);
  ctx.lineTo(
    11 * scale + Math.sin(frontSwing - 0.6) * 13 * scale,
    4 * scale + Math.cos(frontSwing - 0.6) * 13 * scale
  );
  ctx.stroke();

  // Hind Galloping Legs (Kicking back in athletic propulsion)
  const hindSwing = Math.sin(gallopPhase + Math.PI * 0.85) * 0.75;
  ctx.beginPath();
  // Hind Leg 1
  ctx.moveTo(-9 * scale, 4 * scale);
  ctx.lineTo(
    -9 * scale + Math.sin(hindSwing) * 15 * scale,
    4 * scale + Math.cos(hindSwing) * 15 * scale
  );
  // Hind Leg 2
  ctx.moveTo(-6 * scale, 4 * scale);
  ctx.lineTo(
    -6 * scale + Math.sin(hindSwing + 0.5) * 14 * scale,
    4 * scale + Math.cos(hindSwing + 0.5) * 14 * scale
  );
  ctx.stroke();

  // Upturned tail
  ctx.beginPath();
  ctx.ellipse(-13 * scale, -2 * scale, 2.6 * scale, 1.8 * scale, -0.6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/**
 * Detailed Santa Claus & Antique Sleigh silhouette with curved gold runners,
 * high scroll backrest, Santa steering, and brimming gift sack
 */
function drawSantaSleighWithGifts(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  color: string,
  goldColor: string
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = color;
  ctx.strokeStyle = color;

  // Sleigh Blade Runner (Curling antique gold metal)
  ctx.strokeStyle = goldColor;
  ctx.lineWidth = 2.2 * scale;
  ctx.beginPath();
  ctx.moveTo(-26 * scale, 11 * scale);
  ctx.lineTo(18 * scale, 11 * scale);
  ctx.bezierCurveTo(27 * scale, 11 * scale, 25 * scale, -2 * scale, 20 * scale, -4 * scale);
  ctx.stroke();

  // Support Struts between blade and tub
  ctx.lineWidth = 1.6 * scale;
  ctx.beginPath();
  ctx.moveTo(-16 * scale, 11 * scale);
  ctx.lineTo(-13 * scale, 4 * scale);
  ctx.moveTo(9 * scale, 11 * scale);
  ctx.lineTo(7 * scale, 4 * scale);
  ctx.stroke();

  // Sleigh Body Tub
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(13 * scale, 2 * scale);
  ctx.bezierCurveTo(21 * scale, 2 * scale, 17 * scale, -7 * scale, 13 * scale, -7 * scale);
  ctx.lineTo(-6 * scale, -7 * scale);
  ctx.bezierCurveTo(-17 * scale, -7 * scale, -23 * scale, 0, -21 * scale, 2 * scale);
  ctx.closePath();
  ctx.fill();

  // Big Sack of Toys in the Back
  ctx.beginPath();
  ctx.ellipse(-13 * scale, -12 * scale, 10 * scale, 8.5 * scale, -0.2, 0, Math.PI * 2);
  ctx.fill();

  // Santa Claus Body & Round Fluffy Beard
  ctx.beginPath();
  ctx.ellipse(-1 * scale, -12 * scale, 7.5 * scale, 9.5 * scale, 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Santa Head
  ctx.beginPath();
  ctx.arc(3 * scale, -21 * scale, 5 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Beard extending forward
  ctx.beginPath();
  ctx.ellipse(6 * scale, -19 * scale, 4.5 * scale, 3.8 * scale, 0.3, 0, Math.PI * 2);
  ctx.fill();

  // Santa Hat with Drooping Pom-pom
  ctx.beginPath();
  ctx.moveTo(-1 * scale, -24 * scale);
  ctx.lineTo(5 * scale, -25 * scale);
  ctx.lineTo(-6 * scale, -30 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.arc(-8 * scale, -30 * scale, 2.2 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Arm Holding the Reins Forward
  ctx.lineWidth = 2.2 * scale;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(2 * scale, -12 * scale);
  ctx.lineTo(11 * scale, -10 * scale);
  ctx.stroke();

  // Main Lead Rein from Santa's hand forward
  ctx.strokeStyle = goldColor;
  ctx.lineWidth = 1.1 * scale;
  ctx.beginPath();
  ctx.moveTo(11 * scale, -10 * scale);
  ctx.quadraticCurveTo(24 * scale, -5 * scale, 36 * scale, -3 * scale);
  ctx.stroke();

  ctx.restore();
}

// ============================================================================
// 1. MIDNIGHT CITY PARALLAX: SANTA'S FLIGHT ACROSS LUNAR SKYLINE
// (User's direct requested design: Scrolling city silhouette, moon, clouds, Santa, seamless loop)
// ============================================================================
export function drawMidnightSantaCityFlyover(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  // 1. Deep Midnight Cosmic Backdrop Gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#020617');   // Midnight slate navy
  bgGrad.addColorStop(0.45, '#09152b'); // Deep twilight sapphire
  bgGrad.addColorStop(0.85, '#0f172a'); // Horizon velvet charcoal
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Distant Twinkling Celestial Stars
  const starCount = 65;
  for (let i = 0; i < starCount; i++) {
    const sSeed = i * 43.17;
    const sx = (hash(sSeed) * width);
    const sy = (hash(sSeed + 1) * height * 0.65);
    const twinkle = Math.max(0.05, 0.5 + 0.5 * Math.sin(progress * Math.PI * 2 * 3 + hash(sSeed + 2) * 20));
    const sRadius = Math.max(0.1, (1.0 + hash(sSeed + 3) * 1.8) * scale * twinkle);

    ctx.save();
    if (i % 5 === 0) {
      drawStar4Point(ctx, sx, sy, sRadius * 2.2, sRadius * 0.6);
      ctx.fillStyle = `rgba(253, 224, 71, ${twinkle * 0.85})`;
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(sx, sy, sRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(241, 245, 249, ${twinkle * 0.75})`;
      ctx.fill();
    }
    ctx.restore();
  }

  // 3. Giant Luminous Full Moon with Corona and Lunar Craters
  const moonX = width * 0.68;
  const moonY = height * 0.32;
  const moonR = 115 * scale;

  // Outer Volumetric Lunar Halos
  const haloGrad = ctx.createRadialGradient(moonX, moonY, moonR * 0.8, moonX, moonY, moonR * 2.8);
  haloGrad.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
  haloGrad.addColorStop(0.3, 'rgba(253, 224, 71, 0.18)');
  haloGrad.addColorStop(0.7, 'rgba(56, 189, 248, 0.08)');
  haloGrad.addColorStop(1, 'rgba(2, 6, 23, 0)');
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 2.8, 0, Math.PI * 2);
  ctx.fill();

  // Solid Moon Disk
  const moonDisk = ctx.createRadialGradient(
    moonX - moonR * 0.25,
    moonY - moonR * 0.25,
    moonR * 0.1,
    moonX,
    moonY,
    moonR
  );
  moonDisk.addColorStop(0, '#fffbeb'); // Creamy incandescent center
  moonDisk.addColorStop(0.65, '#fef08a');
  moonDisk.addColorStop(0.92, '#fde047');
  moonDisk.addColorStop(1, '#eab308');
  ctx.fillStyle = moonDisk;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();

  // Lunar Maria & Crater Markings (Procedural subtle texture)
  ctx.save();
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.clip(); // Keep craters strictly inside moon disk

  const craters = [
    { x: -0.3, y: -0.2, r: 0.28, a: 0.12 },
    { x: 0.2, y: -0.4, r: 0.22, a: 0.09 },
    { x: 0.35, y: 0.1, r: 0.32, a: 0.13 },
    { x: -0.15, y: 0.35, r: 0.25, a: 0.11 },
    { x: 0.05, y: 0.2, r: 0.18, a: 0.08 },
    { x: -0.4, y: 0.1, r: 0.15, a: 0.1 },
  ];
  for (const c of craters) {
    const cx = moonX + c.x * moonR;
    const cy = moonY + c.y * moonR;
    const cr = c.r * moonR;
    const craterGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr);
    craterGrad.addColorStop(0, `rgba(161, 98, 7, ${c.a * 1.5})`);
    craterGrad.addColorStop(0.8, `rgba(180, 83, 9, ${c.a})`);
    craterGrad.addColorStop(1, 'rgba(180, 83, 9, 0)');
    ctx.fillStyle = craterGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 4. Volumetric Drifting Clouds Across Moon & Sky (100% Seamless Loop)
  const cloudBands = 4;
  for (let cb = 0; cb < cloudBands; cb++) {
    const cloudSpeed = 0.08 + cb * 0.05;
    const cloudLoop = (progress * cloudSpeed * 3 + cb * 0.25) % 1.0;
    const cloudY = height * (0.2 + cb * 0.12);
    const puffCount = 7;
    const totalSpan = width * 1.4;

    for (let p = 0; p < puffCount; p++) {
      const pOffset = (p / puffCount) * totalSpan;
      const curX = ((cloudLoop * totalSpan + pOffset) % totalSpan) - width * 0.2;
      const puffR = (45 + Math.sin(p * 2.1 + cb) * 20) * scale;
      const puffAlpha = (0.12 + cb * 0.04) * (1 - Math.abs(curX - width / 2) / (width * 0.8));

      if (puffAlpha > 0.01) {
        const cGrad = ctx.createRadialGradient(curX, cloudY, 0, curX, cloudY, puffR * 1.8);
        cGrad.addColorStop(0, `rgba(254, 240, 138, ${puffAlpha * 1.4})`);
        cGrad.addColorStop(0.4, `rgba(226, 232, 240, ${puffAlpha})`);
        cGrad.addColorStop(1, 'rgba(226, 232, 240, 0)');
        ctx.fillStyle = cGrad;
        ctx.beginPath();
        ctx.arc(curX, cloudY, puffR * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  // 5. PARALLAX CITY SILHOUETTE - MULTI-LAYER SYSTEM (100% Seamless Looping)
  const baseY = height * 0.82;

  // --------------------------------------------------------------------------
  // LAYER 1: Far Background Skyline (Speed 0.25x - Slow Distant Spreading)
  // Gothic spires, modern skyscraper blocks, antennas with flashing aircraft lights
  // --------------------------------------------------------------------------
  ctx.save();
  const l1Speed = 0.25;
  const l1Width = width; // seamless repeating unit
  const l1Offset = (progress * l1Speed) % 1.0;
  ctx.fillStyle = '#0f172a'; // Deep slate silhouette

  // Draw 2 copies side by side for seamless wrap
  for (let pass = 0; pass < 2; pass++) {
    const startX = pass * l1Width - l1Offset * l1Width;
    const bCount = 20;
    const colW = l1Width / bCount;

    for (let b = 0; b < bCount; b++) {
      const bx = startX + b * colW;
      const bSeed = b * 19.31;
      const bH = (120 + hash(bSeed) * 160) * scale;
      const by = baseY - bH;
      const bw = colW * 0.94;

      // Building main body
      ctx.fillRect(bx, by, bw, bH + height * 0.2);

      // Gothic Spire or Stepped Roof on every 3rd building
      if (b % 3 === 0) {
        ctx.beginPath();
        ctx.moveTo(bx, by);
        ctx.lineTo(bx + bw / 2, by - 35 * scale);
        ctx.lineTo(bx + bw, by);
        ctx.closePath();
        ctx.fill();

        // Antenna with red aviation warning beacon light
        const antX = bx + bw / 2;
        const antY = by - 35 * scale;
        ctx.lineWidth = 1.2 * scale;
        ctx.strokeStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(antX, antY);
        ctx.lineTo(antX, antY - 20 * scale);
        ctx.stroke();

        const beaconFlash = 0.5 + 0.5 * Math.sin(progress * Math.PI * 2 * 6 + b);
        ctx.fillStyle = `rgba(239, 68, 68, ${beaconFlash * 0.9})`;
        ctx.beginPath();
        ctx.arc(antX, antY - 20 * scale, 2.2 * scale, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0f172a'; // reset
      }

      // Distant micro windows (dim amber grid)
      const winRows = Math.floor(bH / (22 * scale));
      const winCols = Math.max(1, Math.floor(bw / (12 * scale)));
      for (let r = 2; r < winRows; r++) {
        for (let c = 0; c < winCols; c++) {
          const wSeed = bSeed + r * 11 + c;
          if (hash(wSeed) > 0.45) {
            const wx = bx + 3 * scale + c * (10 * scale);
            const wy = by + r * (18 * scale);
            const wFlicker = 0.6 + 0.4 * Math.sin(progress * Math.PI * 2 * 2 + wSeed);
            ctx.fillStyle = `rgba(251, 191, 36, ${0.35 * wFlicker})`;
            ctx.fillRect(wx, wy, 3.5 * scale, 5 * scale);
            ctx.fillStyle = '#0f172a';
          }
        }
      }
    }
  }
  ctx.restore();

  // --------------------------------------------------------------------------
  // LAYER 2: Midground Historic Rooftops & Gables (Speed 0.60x - Rich Architecture)
  // Townhouses, chimney stacks with animated curling convective smoke, dormers
  // --------------------------------------------------------------------------
  ctx.save();
  const l2Speed = 0.60;
  const l2Width = width;
  const l2Offset = (progress * l2Speed) % 1.0;
  ctx.fillStyle = '#020617'; // Rich dark midnight silhouette

  for (let pass = 0; pass < 2; pass++) {
    const startX = pass * l2Width - l2Offset * l2Width;
    const hCount = 12;
    const colW = l2Width / hCount;

    for (let hIndex = 0; hIndex < hCount; hIndex++) {
      const hx = startX + hIndex * colW;
      const hSeed = hIndex * 29.87;
      const houseH = (90 + hash(hSeed) * 85) * scale;
      const hy = baseY - houseH;
      const hw = colW * 0.98;

      // House body
      ctx.fillRect(hx, hy, hw, houseH + height * 0.2);

      // Pitched Gable or Mansard Roof
      const roofType = hIndex % 3;
      const roofH = (26 + hash(hSeed + 1) * 20) * scale;
      if (roofType === 0) {
        // Triangular gable
        ctx.beginPath();
        ctx.moveTo(hx - 2 * scale, hy);
        ctx.lineTo(hx + hw / 2, hy - roofH);
        ctx.lineTo(hx + hw + 2 * scale, hy);
        ctx.closePath();
        ctx.fill();
      } else if (roofType === 1) {
        // Flat roof with decorative balustrade cornice
        ctx.fillRect(hx - 2 * scale, hy - 8 * scale, hw + 4 * scale, 8 * scale);
        // Water tower on wooden stilts
        const wtX = hx + hw * 0.65;
        const wtY = hy - 8 * scale;
        ctx.fillRect(wtX - 2 * scale, wtY - 18 * scale, 18 * scale, 14 * scale);
        // Stilts
        ctx.lineWidth = 1.4 * scale;
        ctx.strokeStyle = '#020617';
        ctx.beginPath();
        ctx.moveTo(wtX - 2 * scale, wtY);
        ctx.lineTo(wtX + 1 * scale, wtY - 4 * scale);
        ctx.moveTo(wtX + 16 * scale, wtY);
        ctx.lineTo(wtX + 13 * scale, wtY - 4 * scale);
        ctx.stroke();
      } else {
        // Step-gabled Dutch roof
        const steps = 3;
        for (let st = 0; st < steps; st++) {
          const stW = hw * (1 - st * 0.28);
          const stX = hx + (hw - stW) / 2;
          const stY = hy - (st + 1) * (roofH / steps);
          ctx.fillRect(stX, stY, stW, roofH / steps + 1);
        }
      }

      // Brick Chimney & Physical Convective Smoke
      const chimX = hx + hw * 0.22;
      const chimY = hy - roofH * 0.8;
      ctx.fillRect(chimX, chimY - 14 * scale, 7 * scale, 16 * scale);

      // Realistic curling smoke puffs (100% Seamless Looping)
      const smokePuffs = 6;
      for (let sm = 0; sm < smokePuffs; sm++) {
        // Deterministic cyclic age
        const smAge = ((progress * 4.0 + (hIndex * 0.3) + sm * (1.0 / smokePuffs)) % 1.0);
        const smRise = smAge * 65 * scale;
        const smDrift = smAge * 32 * scale + Math.sin(smAge * Math.PI * 3 + hIndex) * (10 * scale);
        const smR = (2.5 + smAge * 8.5) * scale;
        const smAlpha = Math.pow(1 - smAge, 1.4) * 0.42;

        const smokeX = chimX + 3.5 * scale + smDrift;
        const smokeY = chimY - 14 * scale - smRise;

        ctx.save();
        ctx.beginPath();
        ctx.arc(smokeX, smokeY, smR, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 232, 240, ${smAlpha})`;
        ctx.fill();
        ctx.restore();
      }

      // Cozy Warm Glowing Windows with Candlelight Flicker
      const winCount = 3;
      for (let w = 0; w < winCount; w++) {
        const wx = hx + 8 * scale + w * (colW * 0.28);
        const wy = hy + 16 * scale;
        const wSeed = hSeed + w * 7;
        const flicker = 0.8 + 0.2 * Math.sin(progress * Math.PI * 2 * 4 + wSeed);

        // Window warm glow
        ctx.fillStyle = `rgba(251, 191, 36, ${0.9 * flicker})`;
        ctx.fillRect(wx, wy, 8 * scale, 12 * scale);

        // Window frame mullions
        ctx.fillStyle = '#020617';
        ctx.fillRect(wx + 3.6 * scale, wy, 0.8 * scale, 12 * scale);
        ctx.fillRect(wx, wy + 5.5 * scale, 8 * scale, 0.8 * scale);
      }
    }
  }
  ctx.restore();

  // --------------------------------------------------------------------------
  // LAYER 3: Foreground Snowbanks & Glowing Victorian Streetlamps (Speed 1.0x)
  // Continuous rolling snow hill line, vintage wrought-iron lamps with volumetric halos
  // --------------------------------------------------------------------------
  ctx.save();
  const l3Speed = 1.0;
  const l3Width = width;
  const l3Offset = (progress * l3Speed) % 1.0;

  // Draw Foreground Snowy Ground Contour
  ctx.fillStyle = '#020617';
  ctx.beginPath();
  ctx.moveTo(0, baseY + 18 * scale);
  for (let x = 0; x <= width; x += 30 * scale) {
    const worldX = x + l3Offset * l3Width;
    const hillY = baseY + 18 * scale + Math.sin(worldX * 0.004) * (14 * scale);
    ctx.lineTo(x, hillY);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Snow Cap Highlights along the foreground ridge
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 2.5 * scale;
  ctx.beginPath();
  for (let x = 0; x <= width; x += 30 * scale) {
    const worldX = x + l3Offset * l3Width;
    const hillY = baseY + 18 * scale + Math.sin(worldX * 0.004) * (14 * scale);
    if (x === 0) ctx.moveTo(x, hillY);
    else ctx.lineTo(x, hillY);
  }
  ctx.stroke();

  // Victorian Gas Streetlamps on the ridge
  const lampSpacing = width * 0.45;
  const totalLamps = 4;
  for (let lp = 0; lp < totalLamps; lp++) {
    const lampWorldX = (lp * lampSpacing - (l3Offset * l3Width) % lampSpacing + width * 2) % (width + lampSpacing) - lampSpacing * 0.5;
    const lampY = baseY + 18 * scale + Math.sin((lampWorldX + l3Offset * l3Width) * 0.004) * (14 * scale);

    if (lampWorldX >= -50 && lampWorldX <= width + 50) {
      // Lamp Post
      ctx.strokeStyle = '#020617';
      ctx.lineWidth = 3.0 * scale;
      ctx.beginPath();
      ctx.moveTo(lampWorldX, lampY);
      ctx.lineTo(lampWorldX, lampY - 48 * scale);
      ctx.stroke();

      // Lamp Head Cage
      ctx.fillStyle = '#020617';
      ctx.beginPath();
      ctx.moveTo(lampWorldX - 6 * scale, lampY - 48 * scale);
      ctx.lineTo(lampWorldX + 6 * scale, lampY - 48 * scale);
      ctx.lineTo(lampWorldX + 4 * scale, lampY - 36 * scale);
      ctx.lineTo(lampWorldX - 4 * scale, lampY - 36 * scale);
      ctx.closePath();
      ctx.fill();

      // Warm Amber Volumetric Light Halo on the snow
      const lampGlow = ctx.createRadialGradient(
        lampWorldX,
        lampY - 42 * scale,
        0,
        lampWorldX,
        lampY - 42 * scale,
        38 * scale
      );
      const lFlicker = 0.85 + 0.15 * Math.sin(progress * Math.PI * 2 * 6 + lp * 2);
      lampGlow.addColorStop(0, `rgba(253, 224, 71, ${0.9 * lFlicker})`);
      lampGlow.addColorStop(0.4, `rgba(245, 158, 11, ${0.35 * lFlicker})`);
      lampGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = lampGlow;
      ctx.beginPath();
      ctx.arc(lampWorldX, lampY - 42 * scale, 38 * scale, 0, Math.PI * 2);
      ctx.fill();

      // Flame center
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(lampWorldX, lampY - 42 * scale, 2.5 * scale, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // ==========================================================================
  // 6. SANTA & 8 REINDEER SOARING ACROSS THE SKY (User's Requested Flight Path)
  // Continuous smooth flight across the moon and sky with realistic biomechanical
  // galloping leg physics and aerodynamic banking angle
  // ==========================================================================
  ctx.save();

  // Santa's flight path: traversing smoothly across the screen from left to right
  // We offset by 0.25 so at progress ~0.4 - 0.7 he is dramatically silhouetted in front of the big moon!
  const span = width + 500 * scale;
  const teamCenterX = ((progress * span + width * 0.15) % span) - 250 * scale;

  // Gentle harmonic sinusoidal flight altitude wave (rising & dipping like a bird)
  const flightWave = Math.sin(progress * Math.PI * 2 * 3) * (24 * scale);
  const flightBaseY = height * 0.32 + flightWave;

  // Flight Banking Angle (pitching nose up when climbing, nose down when descending)
  const flightSlope = Math.cos(progress * Math.PI * 2 * 3) * 0.08;

  // Draw Golden Reindeer Team Reins
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 1.2 * scale;
  ctx.beginPath();
  // Sleigh to Lead Reindeer tether
  ctx.moveTo(teamCenterX - 110 * scale, flightBaseY - 6 * scale);
  ctx.quadraticCurveTo(
    teamCenterX,
    flightBaseY - 2 * scale,
    teamCenterX + 130 * scale,
    flightBaseY - 14 * scale
  );
  ctx.stroke();

  // 8 Reindeer arranged in 4 flying pairs
  const pairCount = 4;
  const silhouetteColor = '#020617';

  for (let pair = 0; pair < pairCount; pair++) {
    const pairX = teamCenterX - 40 * scale + pair * (45 * scale);
    const pairY = flightBaseY - 8 * scale - pair * (3 * scale);
    // Gait cycle phase: each pair has a slight phase offset for natural herd rhythm
    const gallopPhase = progress * Math.PI * 2 * 8 + pair * 0.7;
    const isLeadRudolph = pair === pairCount - 1; // The very front reindeer is Rudolph!

    // Upper Reindeer in pair
    drawGallopingReindeer(
      ctx,
      pairX,
      pairY - 8 * scale,
      scale * 0.88,
      gallopPhase,
      isLeadRudolph,
      silhouetteColor
    );

    // Lower Reindeer in pair (slight lag & depth offset)
    drawGallopingReindeer(
      ctx,
      pairX + 8 * scale,
      pairY + 8 * scale,
      scale * 0.82,
      gallopPhase + 0.3,
      false,
      '#09152b' // Slightly softer silhouette for depth
    );
  }

  // Santa Claus & Antique Sleigh at the rear
  const sleighX = teamCenterX - 120 * scale;
  const sleighY = flightBaseY;
  ctx.save();
  ctx.translate(sleighX, sleighY);
  ctx.rotate(flightSlope);
  drawSantaSleighWithGifts(ctx, 0, 0, scale * 1.05, silhouetteColor, '#fde047');
  ctx.restore();

  // ==========================================================================
  // 7. REALISTIC BALLISTIC GOLDEN STARDUST CONTRAIL (Euler Particle Trajectory)
  // Particles shoot backwards from sleigh runner tips with initial ejection velocity,
  // experience downward gravity parabola, air drag deceleration, and micro-sparkle decay
  // ==========================================================================
  const particleCount = 110;
  for (let p = 0; p < particleCount; p++) {
    const pSeed = p * 17.83;
    // Normalized cyclic age of particle (0 = freshly emitted, 1 = extinct)
    const pAge = ((progress * 3.5 + p * (1.0 / particleCount)) % 1.0);

    // Ballistic flight mechanics:
    // Emission point at sleigh runner rear
    const emitterX = sleighX - 25 * scale;
    const emitterY = sleighY + 12 * scale;

    // Initial velocity vectors: ejected backwards (negative x) with slight spread
    const v0x = (-80 - hash(pSeed) * 60) * scale;
    const v0y = (-15 + (hash(pSeed + 1) - 0.5) * 35) * scale;
    const gravity = 120 * scale; // downward gravitational acceleration
    const dragCoeff = 0.85;

    // Euler ballistic integration:
    // x(t) = x0 + v0x * t * dragFactor
    // y(t) = y0 + v0y * t + 0.5 * g * t^2
    const t = pAge;
    const curPx = emitterX + v0x * t * Math.pow(dragCoeff, t * 10);
    const curPy = emitterY + v0y * t + 0.5 * gravity * t * t;

    // Twinkle & fade factor
    const pFade = Math.max(0, Math.pow(Math.max(0, 1 - pAge), 1.3));
    const pSparkle = 0.5 + 0.5 * Math.sin(progress * Math.PI * 2 * 10 + pSeed);
    const pRadius = Math.max(0.1, (1.5 + hash(pSeed + 2) * 3.2) * scale * pFade);

    if (pFade > 0.02) {
      ctx.save();
      if (p % 4 === 0) {
        // 4-Point Golden Star Sparkle
        drawStar4Point(ctx, curPx, curPy, pRadius * 2.2, pRadius * 0.7);
        ctx.fillStyle = `rgba(253, 224, 71, ${pFade * pSparkle * 0.95})`;
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8 * scale;
        ctx.fill();
      } else {
        // Glowing ember drop
        ctx.beginPath();
        ctx.arc(curPx, curPy, pRadius, 0, Math.PI * 2);
        ctx.fillStyle = p % 2 === 0
          ? `rgba(254, 240, 138, ${pFade * 0.9})`
          : `rgba(245, 158, 11, ${pFade * 0.8})`;
        ctx.fill();
      }
      ctx.restore();
    }
  }

  ctx.restore();

  // ==========================================================================
  // 8. MULTI-DEPTH TURBULENT SNOWFALL (100% Seamless Looping)
  // Gentle snowflakes drifting with aerodynamic wind turbulence
  // ==========================================================================
  ctx.save();
  const snowFlakeCount = 75;
  for (let s = 0; s < snowFlakeCount; s++) {
    const sSeed = s * 31.41;
    const sSpeed = 0.15 + hash(sSeed) * 0.25;
    // Seamless vertical drop
    const sLoopY = ((progress * sSpeed * 4 + hash(sSeed + 1)) % 1.0) * height;
    // Aerodynamic horizontal sway
    const sSway = Math.sin(progress * Math.PI * 2 * 2 + hash(sSeed + 2) * 10) * (20 * scale);
    const sX = (hash(sSeed + 3) * width + sSway + width) % width;
    const isLarge = s % 8 === 0;
    const sRadius = Math.max(0.1, (isLarge ? 3.5 : 1.4 + hash(sSeed + 4) * 1.5) * scale);
    const sAlpha = clamp(isLarge ? 0.65 : 0.35 + hash(sSeed + 5) * 0.35, 0, 1);

    if (isLarge) {
      drawSnowflake(ctx, sX, sLoopY, sRadius * 2.2, progress * Math.PI * 2 + s, sAlpha);
    } else {
      ctx.beginPath();
      ctx.arc(sX, sLoopY, sRadius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${sAlpha})`;
      ctx.fill();
    }
  }
  ctx.restore();

  // 9. Minimalist Typography Overlay (Single-Line Luxury Tracking)
  if (config.showText && config.textDisplayMode !== 'clean_no_text') {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const textY = height * 0.92;

    ctx.font = `800 ${26 * scale}px 'Outfit', 'Cinzel', sans-serif`;
    ctx.letterSpacing = `${8 * scale}px`;
    ctx.fillStyle = '#f8fafc';
    ctx.shadowColor = 'rgba(2, 6, 23, 0.9)';
    ctx.shadowBlur = 12 * scale;
    ctx.fillText('MERRY CHRISTMAS & HAPPY NEW YEAR', width / 2, textY);
    ctx.restore();
  }
}

// ============================================================================
// 2. NORDIC AURORA PEAKS & CHIMNEY SMOKE FLUID DYNAMICS
// (Thermodynamic convection smoke physics, Perlin aurora ribbons, cozy alpine chalets)
// ============================================================================
export function drawNordicAuroraVillagePhysics(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  // 1. Deep Nordic Night Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#020617');   // Polar midnight
  skyGrad.addColorStop(0.5, '#061c28'); // Deep boreal fjord teal
  skyGrad.addColorStop(0.85, '#0b2927');
  skyGrad.addColorStop(1, '#021013');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Stars
  for (let i = 0; i < 60; i++) {
    const sSeed = i * 23.47;
    const sx = hash(sSeed) * width;
    const sy = hash(sSeed + 1) * height * 0.6;
    const tw = Math.max(0.05, 0.5 + 0.5 * Math.sin(progress * Math.PI * 2 * 3 + hash(sSeed + 2) * 15));
    ctx.fillStyle = `rgba(255, 255, 255, ${clamp(tw * 0.75, 0, 1)})`;
    ctx.fillRect(sx, sy, 1.6 * scale, 1.6 * scale);
  }

  // 3. Multi-Layered Aurora Borealis (Wave equation fluid ribbons)
  const auroraBands = [
    { color: 'rgba(16, 185, 129,', maxAlpha: 0.38, baseH: height * 0.28, freq: 2, phase: 0 },
    { color: 'rgba(6, 182, 212,', maxAlpha: 0.32, baseH: height * 0.22, freq: 3, phase: 1.5 },
    { color: 'rgba(139, 92, 246,', maxAlpha: 0.25, baseH: height * 0.16, freq: 1.5, phase: 3.0 },
  ];

  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (const band of auroraBands) {
    ctx.beginPath();
    ctx.moveTo(0, height * 0.6);

    const step = 20 * scale;
    for (let x = 0; x <= width + step; x += step) {
      const normX = x / width;
      // Multi-harmonic sine equation (100% seamless loop)
      const w1 = Math.sin(normX * Math.PI * band.freq + progress * Math.PI * 2 + band.phase);
      const w2 = Math.sin(normX * Math.PI * 4 - progress * Math.PI * 2 * 2 + band.phase * 0.5);
      const waveY = band.baseH + (w1 * 55 + w2 * 25) * scale;
      ctx.lineTo(x, waveY);
    }
    ctx.lineTo(width, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();

    const aGrad = ctx.createLinearGradient(0, band.baseH - 80 * scale, 0, band.baseH + 120 * scale);
    aGrad.addColorStop(0, `${band.color} 0)`);
    aGrad.addColorStop(0.5, `${band.color} ${band.maxAlpha})`);
    aGrad.addColorStop(1, `${band.color} 0)`);
    ctx.fillStyle = aGrad;
    ctx.fill();
  }
  ctx.restore();

  // 4. Majestic Jagged Mountain Silhouette in Background
  ctx.save();
  ctx.fillStyle = '#051319';
  ctx.beginPath();
  ctx.moveTo(0, height * 0.62);
  const mPeaks = [
    { x: 0, y: height * 0.62 },
    { x: width * 0.15, y: height * 0.42 },
    { x: width * 0.28, y: height * 0.56 },
    { x: width * 0.45, y: height * 0.36 },
    { x: width * 0.62, y: height * 0.52 },
    { x: width * 0.78, y: height * 0.38 },
    { x: width * 0.92, y: height * 0.48 },
    { x: width, y: height * 0.58 },
  ];
  for (let p = 0; p < mPeaks.length; p++) {
    ctx.lineTo(mPeaks[p].x, mPeaks[p].y);
  }
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Mountain Snow-caps on peaks
  ctx.fillStyle = '#e2e8f0';
  for (let p = 1; p < mPeaks.length - 1; p += 2) {
    const peak = mPeaks[p];
    ctx.beginPath();
    ctx.moveTo(peak.x - 35 * scale, peak.y + 40 * scale);
    ctx.lineTo(peak.x, peak.y);
    ctx.lineTo(peak.x + 35 * scale, peak.y + 40 * scale);
    ctx.lineTo(peak.x + 15 * scale, peak.y + 30 * scale);
    ctx.lineTo(peak.x, peak.y + 35 * scale);
    ctx.lineTo(peak.x - 15 * scale, peak.y + 30 * scale);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // 5. Alpine Village & Log Cabins with Convective Smoke
  const villageBaseY = height * 0.85;
  const cabinCount = 4;
  const cabinSpacing = width / (cabinCount + 1);

  for (let c = 0; c < cabinCount; c++) {
    const cx = cabinSpacing * (c + 1) + (hash(c * 13.7) - 0.5) * 60 * scale;
    const cw = 75 * scale;
    const ch = 52 * scale;
    const cy = villageBaseY - ch;

    ctx.save();
    // Log Cabin Walls
    ctx.fillStyle = '#061317';
    ctx.fillRect(cx - cw / 2, cy, cw, ch);

    // Steep A-Frame Gabled Roof
    const roofOverhang = 8 * scale;
    const roofApexH = 34 * scale;
    ctx.beginPath();
    ctx.moveTo(cx - cw / 2 - roofOverhang, cy);
    ctx.lineTo(cx, cy - roofApexH);
    ctx.lineTo(cx + cw / 2 + roofOverhang, cy);
    ctx.closePath();
    ctx.fill();

    // Thick Snow Blanket on Roof
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(cx - cw / 2 - roofOverhang - 2 * scale, cy);
    ctx.lineTo(cx, cy - roofApexH - 3 * scale);
    ctx.lineTo(cx + cw / 2 + roofOverhang + 2 * scale, cy);
    ctx.lineTo(cx + cw / 2 + roofOverhang, cy + 5 * scale);
    ctx.lineTo(cx, cy - roofApexH + 4 * scale);
    ctx.lineTo(cx - cw / 2 - roofOverhang, cy + 5 * scale);
    ctx.closePath();
    ctx.fill();

    // Stone Chimney
    const chimX = cx - cw * 0.25;
    const chimY = cy - roofApexH * 0.65;
    ctx.fillStyle = '#061317';
    ctx.fillRect(chimX - 4 * scale, chimY - 18 * scale, 8 * scale, 20 * scale);
    // Chimney snow cap
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(chimX - 5 * scale, chimY - 20 * scale, 10 * scale, 3 * scale);

    // THERMAL CONVECTION SMOKE PARTICLES (100% Seamless Fluid Vortices)
    const smokeCount = 10;
    for (let sm = 0; sm < smokeCount; sm++) {
      const smAge = ((progress * 3.0 + c * 0.4 + sm * (1.0 / smokeCount)) % 1.0);
      const smRise = smAge * 85 * scale;
      // Fluid vortex curl: sinusoidal roll-up
      const vortexAngle = smAge * Math.PI * 4;
      const vortexCurl = Math.sin(vortexAngle) * (14 * scale) * smAge;
      const windDrift = smAge * (25 * scale);
      const smX = chimX + windDrift + vortexCurl;
      const smY = chimY - 20 * scale - smRise;
      const smR = (3.0 + smAge * 14.0) * scale;
      const smAlpha = Math.pow(1 - smAge, 1.2) * 0.45;

      ctx.beginPath();
      ctx.arc(smX, smY, smR, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(241, 245, 249, ${smAlpha})`;
      ctx.fill();

      // Golden Fireplace Embers (Tiny sparks escaping chimney)
      if (sm % 3 === 0 && smAge < 0.6) {
        const emberX = chimX + (hash(sm * 19.3 + c) - 0.5) * 8 * scale + windDrift * 0.5;
        const emberY = chimY - 20 * scale - smRise * 0.7;
        ctx.fillStyle = `rgba(251, 191, 36, ${1 - smAge * 1.5})`;
        ctx.fillRect(emberX, emberY, 2.0 * scale, 2.0 * scale);
      }
    }

    // Cozy Warm Candlelight Windows
    const winW = 12 * scale;
    const winH = 15 * scale;
    const flicker = 0.82 + 0.18 * Math.sin(progress * Math.PI * 2 * 5 + c * 2);

    ctx.fillStyle = `rgba(251, 191, 36, ${flicker})`;
    ctx.fillRect(cx - 16 * scale, cy + 12 * scale, winW, winH);
    ctx.fillRect(cx + 4 * scale, cy + 12 * scale, winW, winH);

    // Warm radial glow leaking onto the snow
    const snowGlow = ctx.createRadialGradient(cx, cy + 20 * scale, 0, cx, cy + 20 * scale, 45 * scale);
    snowGlow.addColorStop(0, `rgba(251, 191, 36, ${0.45 * flicker})`);
    snowGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = snowGlow;
    ctx.beginPath();
    ctx.arc(cx, cy + 20 * scale, 45 * scale, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // 6. Multi-Layer Foreground Snow Drifts with Pine Trees
  ctx.save();
  ctx.fillStyle = '#030c10';
  ctx.beginPath();
  ctx.moveTo(0, villageBaseY);
  ctx.quadraticCurveTo(width * 0.35, villageBaseY - 15 * scale, width * 0.7, villageBaseY + 10 * scale);
  ctx.quadraticCurveTo(width * 0.85, villageBaseY + 20 * scale, width, villageBaseY);
  ctx.lineTo(width, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 7. Ambient Crisp Snowfall
  const snowCount = 60;
  for (let s = 0; s < snowCount; s++) {
    const sSeed = s * 41.2;
    const sy = ((progress * 1.5 + hash(sSeed)) % 1.0) * height;
    const sx = (hash(sSeed + 1) * width + Math.sin(progress * Math.PI * 2 + s) * 15 * scale + width) % width;
    const sr = Math.max(0.1, (1.2 + hash(sSeed + 2) * 2.2) * scale);
    ctx.fillStyle = `rgba(255, 255, 255, ${clamp(0.35 + hash(sSeed + 3) * 0.45, 0, 1)})`;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ============================================================================
// 3. HARMONIC PENDULUM SNOWGLOBE & CENTRIFUGAL FLUID SWIRL
// (Physical pendulum oscillation theta(t) = theta0 * cos(omega*t), fluid vortex inertia, gold confetti)
// ============================================================================
export function drawPendulumSnowglobePhysics(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  // 1. Dark Luxury Velvet Festive Backdrop
  const bgGrad = ctx.createRadialGradient(width / 2, height / 2, 50 * scale, width / 2, height / 2, width * 0.75);
  bgGrad.addColorStop(0, '#1c1917');
  bgGrad.addColorStop(0.5, '#0c0a09');
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft Festive Bokeh Orbs in Background
  const bokehCount = 18;
  for (let b = 0; b < bokehCount; b++) {
    const bSeed = b * 33.19;
    const bx = width * (0.1 + hash(bSeed) * 0.8);
    const by = height * (0.1 + hash(bSeed + 1) * 0.8);
    const bPulse = Math.max(0.01, 0.5 + 0.5 * Math.sin(progress * Math.PI * 2 * 2 + b));
    const bRadius = Math.max(1, (25 + hash(bSeed + 2) * 55) * scale);

    const bGrad = ctx.createRadialGradient(bx, by, 0, bx, by, bRadius);
    const col = b % 2 === 0 ? 'rgba(251, 191, 36,' : 'rgba(239, 68, 68,';
    bGrad.addColorStop(0, `${col} ${0.18 * bPulse})`);
    bGrad.addColorStop(0.7, `${col} ${0.05 * bPulse})`);
    bGrad.addColorStop(1, `${col} 0)`);
    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.arc(bx, by, bRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. PHYSICAL HARMONIC PENDULUM MECHANICS
  // Pivot point at top center of canvas
  const pivotX = width / 2;
  const pivotY = height * 0.04;
  const pendulumArmL = height * 0.46; // String / Chain length

  // Harmonic Pendulum Angle Equation: theta(t) = thetaMax * sin(2 * PI * progress * 2) (2 full swings per loop)
  const thetaMax = 0.22; // ~12.6 degrees max swing
  const theta = thetaMax * Math.sin(progress * Math.PI * 2 * 2);
  const thetaDot = thetaMax * Math.cos(progress * Math.PI * 2 * 2) * (Math.PI * 2 * 2); // angular velocity (for fluid inertia!)

  // Globe Center Position in space
  const globeX = pivotX + pendulumArmL * Math.sin(theta);
  const globeY = pivotY + pendulumArmL * Math.cos(theta);
  const globeR = 145 * scale;

  // 3. Ornate Brass Suspension Chain with Interlocking Links
  ctx.save();
  const linkCount = 20;
  ctx.lineWidth = 3.5 * scale;
  ctx.strokeStyle = '#d97706'; // Burnished bronze/gold

  for (let l = 0; l < linkCount; l++) {
    const t0 = l / linkCount;
    const t1 = (l + 1) / linkCount;
    const lx0 = pivotX + pendulumArmL * Math.sin(theta) * t0;
    const ly0 = pivotY + pendulumArmL * Math.cos(theta) * t0;
    const lx1 = pivotX + pendulumArmL * Math.sin(theta) * t1;
    const ly1 = pivotY + pendulumArmL * Math.cos(theta) * t1;

    ctx.beginPath();
    ctx.moveTo(lx0, ly0);
    ctx.lineTo(lx1, ly1);
    ctx.stroke();

    // Link bead highlight
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(lx0, ly0, 2.8 * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  // Top Brass Mounting Bracket
  ctx.fillStyle = '#b45309';
  ctx.beginPath();
  ctx.arc(pivotX, pivotY, 9 * scale, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 4. Heavy Brass Snowglobe Pedestal Base
  ctx.save();
  ctx.translate(globeX, globeY);
  ctx.rotate(theta); // rotates with the pendulum arm

  // Mahogany & Brass Pedestal
  const baseW = globeR * 1.35;
  const baseY = globeR * 0.82;
  const baseH = 34 * scale;

  const baseGrad = ctx.createLinearGradient(-baseW / 2, baseY, baseW / 2, baseY);
  baseGrad.addColorStop(0, '#78350f');
  baseGrad.addColorStop(0.35, '#b45309');
  baseGrad.addColorStop(0.5, '#fde047'); // Specular metallic sheen
  baseGrad.addColorStop(0.7, '#b45309');
  baseGrad.addColorStop(1, '#451a03');
  ctx.fillStyle = baseGrad;
  ctx.beginPath();
  ctx.roundRect(-baseW / 2, baseY, baseW, baseH, [4 * scale, 4 * scale, 12 * scale, 12 * scale]);
  ctx.fill();

  // Ornate Brass Plaque "2027"
  ctx.fillStyle = '#d97706';
  ctx.fillRect(-28 * scale, baseY + 8 * scale, 56 * scale, 18 * scale);
  ctx.fillStyle = '#020617';
  ctx.font = `bold ${10 * scale}px 'Cinzel', serif`;
  ctx.textAlign = 'center';
  ctx.fillText('NOEL 2027', 0, baseY + 21 * scale);

  // 5. Crystal Glass Sphere Interior
  // Circular clipping region for all internal fluids and scenery
  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, globeR, 0, Math.PI * 2);
  ctx.clip();

  // Inner Globe Background Sky (Winter Twilight)
  const innerSky = ctx.createRadialGradient(0, -globeR * 0.3, 0, 0, 0, globeR);
  innerSky.addColorStop(0, '#1e3a5f');
  innerSky.addColorStop(0.65, '#0f172a');
  innerSky.addColorStop(1, '#020617');
  ctx.fillStyle = innerSky;
  ctx.fillRect(-globeR, -globeR, globeR * 2, globeR * 2);

  // Interior Miniature Snowy Pine Hill
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(0, globeR * 0.9, globeR * 0.7, Math.PI, 0);
  ctx.fill();

  // Miniature Christmas Tree inside globe
  const treeY = globeR * 0.45;
  const treeH = 75 * scale;
  const treeW = 48 * scale;
  ctx.fillStyle = '#064e3b'; // Forest pine green
  for (let t = 0; t < 4; t++) {
    const tierY = treeY - t * (treeH / 4) * 0.8;
    const tierW = treeW * (1 - t * 0.22);
    ctx.beginPath();
    ctx.moveTo(0, tierY - treeH / 3);
    ctx.lineTo(tierW / 2, tierY);
    ctx.lineTo(-tierW / 2, tierY);
    ctx.closePath();
    ctx.fill();
  }

  // Bethlehem Golden Star atop the miniature tree
  drawStar4Point(ctx, 0, treeY - treeH * 0.95, 8 * scale, 3 * scale);
  ctx.fillStyle = '#fde047';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 10 * scale;
  ctx.fill();
  ctx.shadowBlur = 0; // reset

  // 6. CENTRIFUGAL FLUID VORTEX PARTICLES (Swirling Gold Foil & Snow)
  // Particles swirl around the globe with fluid lag proportional to angular velocity thetaDot!
  const fluidParticles = 180;
  for (let p = 0; p < fluidParticles; p++) {
    const pSeed = p * 19.81;
    // Base radius from globe center
    const baseR = (20 + hash(pSeed) * (globeR * 0.75));
    // Base cyclic angle
    const baseAngle = hash(pSeed + 1) * Math.PI * 2;
    // Fluid angular drift driven by pendulum inertia:
    // When pendulum reverses at extreme, fluid swirls strongly!
    const fluidSwirl = -thetaDot * 0.45 * (1.0 - baseR / globeR);
    const curAngle = baseAngle + progress * Math.PI * 2 * 2 + fluidSwirl;

    const px = Math.cos(curAngle) * baseR;
    const py = Math.sin(curAngle) * baseR;

    const pSize = Math.max(0.1, (1.5 + hash(pSeed + 2) * 2.8) * scale);
    const isGold = p % 3 === 0;

    if (isGold) {
      drawStar4Point(ctx, px, py, pSize * 2.0, pSize * 0.6);
      ctx.fillStyle = '#fde047';
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(px, py, pSize, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fill();
    }
  }

  ctx.restore(); // end globe interior clipping

  // 7. Glass Sphere Specular Highlights & Fresnel Lens Arcs
  // 3D Glass curved reflection highlight
  ctx.save();
  ctx.lineWidth = 3.5 * scale;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.beginPath();
  ctx.arc(-globeR * 0.15, -globeR * 0.15, globeR * 0.85, -Math.PI * 0.85, -Math.PI * 0.35);
  ctx.stroke();

  // Glass Rim Refraction Glow
  const rimGrad = ctx.createRadialGradient(0, 0, globeR * 0.85, 0, 0, globeR);
  rimGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
  rimGrad.addColorStop(0.8, 'rgba(56, 189, 248, 0.25)');
  rimGrad.addColorStop(1, 'rgba(255, 255, 255, 0.7)');
  ctx.fillStyle = rimGrad;
  ctx.beginPath();
  ctx.arc(0, 0, globeR, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore(); // end globe rotate
  ctx.restore();
}

// ============================================================================
// 4. NEWTONIAN KINETIC ORNAMENTS & BALLISTIC SPARKLE CASCADES
// (Compound pendulum wave of 24K gold and ruby baubles, parabolic light emitter)
// ============================================================================
export function drawBallisticOrnamentCascades(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  // 1. Dark Vignette Background
  const bgGrad = ctx.createRadialGradient(width / 2, height * 0.45, 100 * scale, width / 2, height / 2, width * 0.75);
  bgGrad.addColorStop(0, '#111827');
  bgGrad.addColorStop(0.6, '#030712');
  bgGrad.addColorStop(1, '#000000');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Compound Pendulum Wave of 5 Ornate Holiday Baubles
  const baubleCount = 5;
  const pivotY = height * 0.05;
  const baubleSpacing = width / (baubleCount + 1);

  for (let b = 0; b < baubleCount; b++) {
    const pivotX = baubleSpacing * (b + 1);
    const armL = (height * 0.35 + b * (25 * scale));
    // Pendulum wave frequency: each bauble oscillates with progressive frequency (pendulum wave)
    const freq = 1 + b * 0.5;
    const maxTheta = 0.28 - b * 0.02;
    const theta = maxTheta * Math.sin(progress * Math.PI * 2 * freq);

    const bX = pivotX + armL * Math.sin(theta);
    const bY = pivotY + armL * Math.cos(theta);
    const bRadius = (32 + (b % 2) * 8) * scale;

    ctx.save();
    // Suspension wire
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.6 * scale;
    ctx.beginPath();
    ctx.moveTo(pivotX, pivotY);
    ctx.lineTo(bX, bY);
    ctx.stroke();

    // 3D Bauble Metallic Shading
    const isRuby = b % 2 === 0;
    const bGrad = ctx.createRadialGradient(
      bX - bRadius * 0.35,
      bY - bRadius * 0.35,
      bRadius * 0.1,
      bX,
      bY,
      bRadius
    );
    if (isRuby) {
      bGrad.addColorStop(0, '#fca5a5');
      bGrad.addColorStop(0.3, '#dc2626');
      bGrad.addColorStop(0.75, '#991b1b');
      bGrad.addColorStop(1, '#450a0a');
    } else {
      bGrad.addColorStop(0, '#fef08a');
      bGrad.addColorStop(0.3, '#eab308');
      bGrad.addColorStop(0.75, '#b45309');
      bGrad.addColorStop(1, '#78350f');
    }

    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.arc(bX, bY, bRadius, 0, Math.PI * 2);
    ctx.fill();

    // Brass Top Cap & Ring
    ctx.fillStyle = '#fde047';
    ctx.fillRect(bX - 6 * scale, bY - bRadius - 6 * scale, 12 * scale, 6 * scale);

    // Ballistic Light Emitter from bottom of bauble
    const sparkCount = 12;
    for (let sp = 0; sp < sparkCount; sp++) {
      const spAge = ((progress * 4.0 + b * 0.2 + sp * (1.0 / sparkCount)) % 1.0);
      const emitterX = bX;
      const emitterY = bY + bRadius;

      // Parabolic fall
      const fallDist = spAge * 140 * scale;
      const swingSway = Math.sin(spAge * Math.PI * 3 + b) * (18 * scale);
      const spX = emitterX + swingSway;
      const spY = emitterY + fallDist;
      const spFade = Math.max(0, Math.pow(Math.max(0, 1 - spAge), 1.4));

      drawStar4Point(ctx, spX, spY, Math.max(0.1, 3.5 * scale * spFade), Math.max(0.05, 1.0 * scale * spFade));
      ctx.fillStyle = `rgba(253, 224, 71, ${spFade * 0.9})`;
      ctx.fill();
    }

    ctx.restore();
  }
}
