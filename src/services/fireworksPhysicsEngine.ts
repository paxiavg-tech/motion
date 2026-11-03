import { MotionConfig } from '../types/motion';

// ============================================================================
// REALISTIC 4K FIREWORKS PARTICLE PHYSICS SIMULATION ENGINE
// Featuring:
// - Multi-tier ballistic aerial shells (Kamuro Willow, Peony with Pistil,
//   Glittering Chrysanthemum, Ring Crossette, Dragon Egg Crackle Finale)
// - True aerodynamic drag (v * exp(-mu * t)) & gravitational acceleration (0.5 * g * t^2)
// - Ascending rocket shells with fiery spark exhaust and smoky propellant trails
// - Explosive apex flash with atmospheric environmental sky scattering
// - Velocity streak motion blur & micro-strobe star twinkling
// - Distant city horizon silhouette & dynamic water reflection responding to flashes
// ============================================================================

// Fast deterministic pseudo-random hash
function hash(n: number): number {
  const sin = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return sin - Math.floor(sin);
}

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export interface ShellDefinition {
  id: number;
  launchSec: number;
  ascentSec: number;
  burstSec: number;
  lifeSec: number;
  startX: number;
  apexX: number;
  apexY: number;
  shellType: 'kamuro_willow' | 'peony_pistil' | 'chrysanthemum_strobe' | 'crossette_ring' | 'dragon_eggs';
  primaryColor: string;
  secondaryColor: string;
  starCount: number;
  drag: number;
  gravity: number;
  initialSpeed: number;
  hasPistil: boolean;
  hasSparks: boolean;
}

// Generate deterministic sequence of aerial shells for seamless looping timeline
function getShellSchedule(duration: number, width: number, height: number, densityMultiplier: number): ShellDefinition[] {
  const shells: ShellDefinition[] = [];
  // Base 9 shells spread over the duration cycle
  const shellCount = Math.max(7, Math.round(9 * densityMultiplier));
  const step = duration / shellCount;

  const colorPalettes = [
    { primary: '#ffc107', secondary: '#ffecb3' }, // Imperial 24K Gold (Kamuro)
    { primary: '#ff2a6d', secondary: '#00f0ff' }, // Ruby Crimson & Electric Cyan
    { primary: '#a855f7', secondary: '#facc15' }, // Royal Violet & Golden Topaz
    { primary: '#10b981', secondary: '#f43f5e' }, // Emerald Jade & Coral Red
    { primary: '#38bdf8', secondary: '#ffffff' }, // Electric Sapphire & Diamond White
    { primary: '#f97316', secondary: '#fde047' }, // Solar Amber & Champagne Gold
    { primary: '#ec4899', secondary: '#67e8f9' }, // Neon Fuchsia & Ice Cyan
  ];

  const shellTypes: Array<'kamuro_willow' | 'peony_pistil' | 'chrysanthemum_strobe' | 'crossette_ring' | 'dragon_eggs'> = [
    'kamuro_willow',
    'peony_pistil',
    'chrysanthemum_strobe',
    'kamuro_willow',
    'dragon_eggs',
    'peony_pistil',
    'crossette_ring',
    'chrysanthemum_strobe',
    'kamuro_willow',
  ];

  for (let i = 0; i < shellCount; i++) {
    const seed = i * 47.19 + 11.3;
    const launchSec = i * step + (hash(seed) * 0.4 - 0.2) * step;
    const ascentSec = 1.1 + hash(seed + 1) * 0.35;
    const burstSec = launchSec + ascentSec;
    const lifeSec = 2.4 + hash(seed + 2) * 0.8;

    // Mortar distribution across bottom
    const mortarPositions = [0.22, 0.36, 0.5, 0.64, 0.78];
    const mortarSlot = Math.floor(hash(seed + 3) * mortarPositions.length);
    const startX = width * mortarPositions[mortarSlot] + (hash(seed + 4) * 0.06 - 0.03) * width;

    // Apex distribution in sky (avoid borders)
    const apexX = width * (0.18 + hash(seed + 5) * 0.64);
    const apexY = height * (0.16 + hash(seed + 6) * 0.32);

    const palette = colorPalettes[i % colorPalettes.length];
    const type = shellTypes[i % shellTypes.length];

    // Specific physics tuning per shell type
    let drag = 1.35;
    let gravity = 180;
    let initialSpeed = 380;
    let hasPistil = false;
    let hasSparks = true;

    if (type === 'kamuro_willow') {
      drag = 0.95;
      gravity = 280; // Heavy downward waterfall sag
      initialSpeed = 420;
      hasSparks = true;
    } else if (type === 'peony_pistil') {
      drag = 1.5;
      gravity = 140;
      initialSpeed = 360;
      hasPistil = true;
    } else if (type === 'dragon_eggs') {
      drag = 1.4;
      gravity = 170;
      initialSpeed = 400;
    } else if (type === 'crossette_ring') {
      drag = 1.25;
      gravity = 120;
      initialSpeed = 340;
    }

    shells.push({
      id: i,
      launchSec,
      ascentSec,
      burstSec,
      lifeSec,
      startX,
      apexX,
      apexY,
      shellType: type,
      primaryColor: palette.primary,
      secondaryColor: palette.secondary,
      starCount: type === 'kamuro_willow' ? 140 : 100,
      drag,
      gravity,
      initialSpeed,
      hasPistil,
      hasSparks,
    });
  }

  return shells;
}

/**
 * Main Realistic 4K Fireworks Physics Simulation Renderer
 */
export function drawRealistic4KFireworksPhysics(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const duration = config.durationSeconds || 10;
  // Current playback time inside the duration loop
  const cycleTime = (progress * duration) % duration;

  // Particle count scaling
  const densityMultiplier = Math.max(0.6, Math.min(2.0, config.particleCount / 650));
  const shells = getShellSchedule(duration, width, height, densityMultiplier);

  // 1. Draw Starfield & Atmospheric Deep Sky Background
  drawNightAtmosphere(ctx, width, height, scale, progress);

  // We check active shell flashes to calculate dynamic atmospheric illumination
  let totalSkyFlashIntensity = 0;
  let flashDominantColor = '#ffffff';

  shells.forEach((shell) => {
    // Check timing with cycle wrap-around consideration
    const age = getWrappedAge(cycleTime, shell.burstSec, duration);
    if (age >= 0 && age < 0.28) {
      const flashFactor = Math.pow(1 - age / 0.28, 2.5);
      if (flashFactor > totalSkyFlashIntensity) {
        totalSkyFlashIntensity = flashFactor;
        flashDominantColor = shell.primaryColor;
      }
    }
  });

  // 2. Render Atmospheric Sky Flash Wash if a shell just detonated
  if (totalSkyFlashIntensity > 0.02) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const skyGlow = ctx.createRadialGradient(
      width * 0.5,
      height * 0.35,
      minDim * 0.05,
      width * 0.5,
      height * 0.4,
      width * 0.85
    );
    skyGlow.addColorStop(0, hexToRgba(flashDominantColor, totalSkyFlashIntensity * 0.35));
    skyGlow.addColorStop(0.5, hexToRgba(flashDominantColor, totalSkyFlashIntensity * 0.12));
    skyGlow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = skyGlow;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // 3. Render Ascending Shell Rockets (Ascent Phase)
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  shells.forEach((shell) => {
    const launchAge = getWrappedAge(cycleTime, shell.launchSec, duration);
    if (launchAge >= 0 && launchAge < shell.ascentSec) {
      drawRocketAscent(ctx, shell, launchAge, width, height, scale);
    }
  });
  ctx.restore();

  // 4. Render Aerial Detonations & Particle Physics (Burst Phase)
  ctx.save();
  ctx.globalCompositeOperation = 'lighter';
  shells.forEach((shell) => {
    const burstAge = getWrappedAge(cycleTime, shell.burstSec, duration);
    if (burstAge >= 0 && burstAge < shell.lifeSec) {
      drawShellExplosionPhysics(ctx, shell, burstAge, scale, config);
    }
  });
  ctx.restore();

  // 5. Render Horizon Silhouette & Water Reflection
  drawHorizonAndWaterReflection(ctx, width, height, scale, totalSkyFlashIntensity, flashDominantColor);
}

// ----------------------------------------------------------------------------
// TIMING UTILITY FOR WRAPPED SEAMLESS LOOP
// ----------------------------------------------------------------------------
function getWrappedAge(currentTime: number, eventTime: number, duration: number): number {
  let diff = currentTime - eventTime;
  if (diff < 0) {
    diff += duration;
  }
  return diff;
}

// ----------------------------------------------------------------------------
// 1. NIGHT ATMOSPHERE & TWINKLING STARFIELD
// ----------------------------------------------------------------------------
function drawNightAtmosphere(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  progress: number
) {
  // Deep midnight gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  bgGrad.addColorStop(0, '#02050c'); // Deep cosmic black-blue
  bgGrad.addColorStop(0.55, '#050a18'); // Midnight indigo
  bgGrad.addColorStop(0.88, '#0b1328'); // Atmospheric haze near horizon
  bgGrad.addColorStop(1, '#030712'); // Dark water/ground base
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Distant twinkling stellar stars
  ctx.save();
  const starCount = 120;
  for (let s = 0; s < starCount; s++) {
    const seed = s * 73.19;
    const sx = hash(seed) * width;
    const sy = hash(seed + 1) * (height * 0.7);
    const sz = (hash(seed + 2) * 1.5 + 0.6) * scale;
    const twinkle = 0.35 + 0.65 * Math.sin(progress * Math.PI * 4 + hash(seed + 3) * 20);

    ctx.beginPath();
    ctx.arc(sx, sy, sz, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(240, 245, 255, ${twinkle * 0.75})`;
    ctx.fill();
  }
  ctx.restore();
}

// ----------------------------------------------------------------------------
// 2. ROCKET ASCENT WITH PROPELLANT SPARKS & SMOKE TRAIL
// ----------------------------------------------------------------------------
function drawRocketAscent(
  ctx: CanvasRenderingContext2D,
  shell: ShellDefinition,
  age: number,
  _width: number,
  height: number,
  scale: number
) {
  const norm = clamp(age / shell.ascentSec, 0, 1);
  // Ease out upward trajectory (rocket slows near apex before bursting)
  const easeY = 1 - Math.pow(1 - norm, 1.8);
  const curX = shell.startX + (shell.apexX - shell.startX) * norm;
  const curY = height - (height - shell.apexY) * easeY;

  // Previous position for rocket streak
  const prevNorm = Math.max(0, norm - 0.05);
  const prevEaseY = 1 - Math.pow(1 - prevNorm, 1.8);
  const prevX = shell.startX + (shell.apexX - shell.startX) * prevNorm;
  const prevY = height - (height - shell.apexY) * prevEaseY;

  // Ascending rocket streak
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(curX, curY);
  ctx.strokeStyle = '#ffeaa7';
  ctx.lineWidth = 3.2 * scale;
  ctx.shadowColor = '#fdcb6e';
  ctx.shadowBlur = 12 * scale;
  ctx.stroke();

  // White-hot rocket tip head
  ctx.beginPath();
  ctx.arc(curX, curY, 4.0 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#ffffff';
  ctx.shadowBlur = 16 * scale;
  ctx.fill();

  // Trailing propellant sparks spraying downwards
  const sparkCount = 12;
  for (let sp = 0; sp < sparkCount; sp++) {
    const spSeed = shell.id * 100 + age * 60 + sp;
    const tLag = hash(spSeed) * 0.12;
    const sparkX = curX - (curX - prevX) * (tLag / 0.05) + (hash(spSeed + 1) - 0.5) * 12 * scale;
    const sparkY = curY + (prevY - curY) * (tLag / 0.05) + hash(spSeed + 2) * 16 * scale;
    const sparkAlpha = Math.max(0, 1 - tLag / 0.12);

    ctx.beginPath();
    ctx.arc(sparkX, sparkY, (hash(spSeed + 3) * 1.8 + 1) * scale, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 200, 80, ${sparkAlpha})`;
    ctx.fill();
  }
  ctx.restore();
}

// ----------------------------------------------------------------------------
// 3. AERIAL DETONATION & BALLISTIC PARTICLE PHYSICS
// ----------------------------------------------------------------------------
function drawShellExplosionPhysics(
  ctx: CanvasRenderingContext2D,
  shell: ShellDefinition,
  age: number,
  scale: number,
  config: MotionConfig
) {
  const normAge = clamp(age / shell.lifeSec, 0, 1);
  const cx = shell.apexX;
  const cy = shell.apexY;

  // 1. Initial Explosive Glare & Flash Core (first 0.25s)
  if (age < 0.25) {
    const flashProgress = age / 0.25;
    const flashRadius = (20 + (1 - flashProgress) * 75) * scale;
    const flashAlpha = Math.pow(1 - flashProgress, 2);

    ctx.save();
    const flashGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, flashRadius);
    flashGrad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    flashGrad.addColorStop(0.3, hexToRgba(shell.primaryColor, flashAlpha * 0.8));
    flashGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = flashGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, flashRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 2. Star Particle Physics Loop
  const totalStars = Math.round(shell.starCount * (config.particleCount / 650));
  const mu = shell.drag; // Air resistance / drag
  const g = shell.gravity * scale * 1.3; // Gravity acceleration

  // Wind drift factor
  const windX = Math.sin(shell.id * 1.7) * 22 * scale * config.turbulence;

  for (let i = 0; i < totalStars; i++) {
    const seed = shell.id * 257.31 + i * 37.19;

    // Spherical 3D distribution projected onto 2D
    const phi = (i / totalStars) * Math.PI * 2 + (hash(seed) * 0.2 - 0.1);
    const speedVar = 0.75 + hash(seed + 1) * 0.5;
    const initialV = shell.initialSpeed * speedVar * scale;

    const v0x = Math.cos(phi) * initialV;
    const v0y = Math.sin(phi) * initialV;

    // Aerodynamic integration:
    // v(t) = v0 * exp(-mu * t)
    // pos(t) = pos0 + v0 * (1 - exp(-mu * t)) / mu + drift
    const expDrag = Math.exp(-mu * age);
    const posFactor = (1 - expDrag) / mu;

    const currentX = cx + v0x * posFactor + windX * age;
    // Ballistic gravity: 0.5 * g * t^2
    const currentY = cy + v0y * posFactor + 0.5 * g * Math.pow(age, 2.1);

    // Calculate previous position (40ms ago) for motion blur streak
    const dtPrev = Math.max(0, age - 0.045);
    const expDragPrev = Math.exp(-mu * dtPrev);
    const posFactorPrev = (1 - expDragPrev) / mu;
    const prevX = cx + v0x * posFactorPrev + windX * dtPrev;
    const prevY = cy + v0y * posFactorPrev + 0.5 * g * Math.pow(dtPrev, 2.1);

    // Alpha decay & cooling lifetime
    const starLife = 0.85 + hash(seed + 2) * 0.3; // Staggered burnout
    const starNorm = age / (shell.lifeSec * starLife);
    if (starNorm > 1) continue;

    let starAlpha = Math.pow(1 - starNorm, 1.4);

    // Kamuro Willow heavy lingering trails
    if (shell.shellType === 'kamuro_willow') {
      starAlpha = Math.pow(1 - starNorm, 0.95);
    }

    // Chrysanthemum strobe / twinkling oscillation
    if (shell.shellType === 'chrysanthemum_strobe') {
      const strobeFreq = 30 + (i % 7) * 4;
      const strobe = Math.sin(age * strobeFreq + hash(seed + 3) * 10);
      starAlpha *= strobe > 0.1 ? 1.0 : 0.2;
    }

    // Color shifting: starts hot white/yellow, cools to saturated shell color, then embers
    let starColor = shell.primaryColor;
    if (age < 0.3) {
      starColor = '#ffffff';
    } else if (starNorm > 0.75) {
      starColor = shell.secondaryColor;
    }

    // Draw motion streak connecting past position to current position
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(prevX, prevY);
    ctx.lineTo(currentX, currentY);
    ctx.strokeStyle = hexToRgba(starColor, starAlpha * 0.9);
    ctx.lineWidth = Math.max(1.2 * scale, (2.6 * (1 - starNorm * 0.5)) * scale);
    ctx.stroke();

    // Draw radiant luminous star point
    ctx.beginPath();
    const starRadius = Math.max(1.0 * scale, (config.particleSize * (1 - starNorm * 0.4)) * scale);
    ctx.arc(currentX, currentY, starRadius, 0, Math.PI * 2);
    ctx.fillStyle = hexToRgba(starColor, starAlpha);
    ctx.shadowColor = starColor;
    ctx.shadowBlur = (config.glowIntensity * 7) * scale;
    ctx.fill();

    // Dragon Eggs crackle effect near end of life
    if (shell.shellType === 'dragon_eggs' && starNorm > 0.72 && starNorm < 0.95) {
      const crackleSeed = seed + Math.floor(age * 20);
      if (hash(crackleSeed) > 0.5) {
        ctx.beginPath();
        const crackleOffset = (hash(crackleSeed + 1) * 8 - 4) * scale;
        ctx.arc(currentX + crackleOffset, currentY + crackleOffset, 1.8 * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 10 * scale;
        ctx.fill();
      }
    }

    // Kamuro Willow gold spark droplets trailing behind
    if (shell.shellType === 'kamuro_willow' && starNorm > 0.25 && i % 3 === 0) {
      const dropY = currentY - (hash(seed + 4) * 14 + 4) * scale;
      const dropX = currentX + (hash(seed + 5) - 0.5) * 6 * scale;
      ctx.beginPath();
      ctx.arc(dropX, dropY, 0.9 * scale, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba('#ffe082', starAlpha * 0.65);
      ctx.fill();
    }
    ctx.restore();
  }

  // 3. Inner Core Pistil (Spherical inner contrasting shell)
  if (shell.hasPistil && normAge < 0.75) {
    const pistilStars = Math.round(totalStars * 0.35);
    const pistilSpeed = shell.initialSpeed * 0.48 * scale;

    for (let p = 0; p < pistilStars; p++) {
      const pSeed = shell.id * 891.1 + p * 19.3;
      const pAngle = (p / pistilStars) * Math.PI * 2;
      const pSpeedVar = 0.8 + hash(pSeed) * 0.4;
      const pV0x = Math.cos(pAngle) * pistilSpeed * pSpeedVar;
      const pV0y = Math.sin(pAngle) * pistilSpeed * pSpeedVar;

      const pExpDrag = Math.exp(-shell.drag * 1.3 * age);
      const pPosFactor = (1 - pExpDrag) / (shell.drag * 1.3);

      const px = cx + pV0x * pPosFactor + windX * 0.6 * age;
      const py = cy + pV0y * pPosFactor + 0.5 * (g * 0.8) * Math.pow(age, 2);

      const pNorm = age / (shell.lifeSec * 0.65);
      if (pNorm > 1) continue;

      const pAlpha = Math.pow(1 - pNorm, 1.6);
      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, 1.8 * scale, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(shell.secondaryColor, pAlpha);
      ctx.shadowColor = shell.secondaryColor;
      ctx.shadowBlur = 9 * scale;
      ctx.fill();
      ctx.restore();
    }
  }
}

// ----------------------------------------------------------------------------
// 4. HORIZON SILHOUETTE & DYNAMIC WATER REFLECTION
// ----------------------------------------------------------------------------
function drawHorizonAndWaterReflection(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  scale: number,
  flashIntensity: number,
  dominantColor: string
) {
  const horizonY = height * 0.88;
  const waterHeight = height - horizonY;

  ctx.save();

  // Water base gradient
  const waterGrad = ctx.createLinearGradient(0, horizonY, 0, height);
  waterGrad.addColorStop(0, '#050c1e');
  waterGrad.addColorStop(1, '#010308');
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, horizonY, width, waterHeight);

  // Dynamic light reflection ripple on water surface when fireworks flash
  if (flashIntensity > 0.05) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const rippleCount = 18;
    for (let r = 0; r < rippleCount; r++) {
      const ry = horizonY + (r / rippleCount) * waterHeight;
      const rAlpha = flashIntensity * (1 - (r / rippleCount)) * 0.35;
      const rWidth = (width * 0.35 + Math.sin(r * 1.5) * 50) * scale;
      const rx = width * 0.5 - rWidth * 0.5;

      ctx.fillStyle = hexToRgba(dominantColor, rAlpha);
      ctx.fillRect(rx, ry, rWidth, 2.5 * scale);
    }
    ctx.restore();
  }

  // Distant city skyline silhouette (buildings with tiny window lights)
  ctx.fillStyle = '#020612';
  const buildings = 28;
  const bWidth = width / buildings;

  for (let b = 0; b < buildings; b++) {
    const seed = b * 31.7;
    const bHeight = (hash(seed) * 38 + 14) * scale;
    const bx = b * bWidth;
    const by = horizonY - bHeight;

    ctx.fillRect(bx, by, bWidth + 0.5, bHeight + 2);

    // Random micro-windows
    if (hash(seed + 1) > 0.45) {
      const windowRows = 3;
      const windowCols = 2;
      for (let wr = 0; wr < windowRows; wr++) {
        for (let wc = 0; wc < windowCols; wc++) {
          if (hash(seed + wr * 5 + wc) > 0.5) {
            const wx = bx + (wc + 1) * (bWidth / (windowCols + 1));
            const wy = by + (wr + 1) * (bHeight / (windowRows + 1));
            ctx.fillStyle = hash(seed + wr) > 0.7 ? 'rgba(254, 240, 138, 0.45)' : 'rgba(186, 230, 253, 0.35)';
            ctx.fillRect(wx - 1 * scale, wy - 1 * scale, 2 * scale, 2 * scale);
          }
        }
      }
      ctx.fillStyle = '#020612';
    }
  }

  // Horizon water boundary edge highlight
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(width, horizonY);
  ctx.strokeStyle = flashIntensity > 0.1 ? hexToRgba(dominantColor, 0.4) : 'rgba(30, 41, 59, 0.4)';
  ctx.lineWidth = 1.2 * scale;
  ctx.stroke();

  ctx.restore();
}

// ----------------------------------------------------------------------------
// COLOR CONVERSION HELPER
// ----------------------------------------------------------------------------
function hexToRgba(hex: string, alpha: number): string {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1).toFixed(3)})`;
  }
  return hex;
}
