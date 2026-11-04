/**
 * Metropolis Extended Variations Engine (Realistic Urban Cityscape Edition)
 * 
 * 10 100% Realistic, Grounded City Skyline Variations using the identical,
 * proven skyscraper architectural geometry from Wide Metropolis City Skyline:
 * 
 * 1. metropolis_daylight_sunny_skyline     — Bright Daytime Sunny City Skyline & Sparkling Water
 * 2. metropolis_christmas_snow_skyline      — Christmas Winter Wonderland Snow-Dusted Skyline
 * 3. metropolis_new_year_midnight_skyline   — New Year's Eve Midnight Gala Skyline & Golden Stardust
 * 4. metropolis_evening_rush_hour_traffic   — Evening Rush Hour Skyline & Double-Decker Bridge Traffic
 * 5. metropolis_rainy_evening_skyline       — Rainy Dusk City Skyline & Wet Asphalt Reflections
 * 6. metropolis_golden_hour_corporate       — Golden Hour Sunset Corporate Skyline
 * 7. metropolis_winter_twilight_frost       — Winter Twilight Frost & Warm Amber Penthouse Lights
 * 8. metropolis_foggy_dawn_harbor           — Foggy Morning Dawn Harbor Skyline & Rising Commuters
 * 9. metropolis_clear_midnight_blue         — Pure Deep Sapphire Midnight City Plate
 * 10. metropolis_spring_breeze_cherry       — Spring Breeze City Skyline with Drifting Blossom Petals
 * 
 * All variations:
 * - Feature REALISTIC skyscrapers (spires, stepped art-deco crowns, twin spires, window grids, antennas).
 * - Low horizon (~88%), preserving ~60% expansive sky copy space.
 * - NO weird shapes, NO sci-fi bubbles, NO floating islands.
 * - NO countdown numbers or central laser beams (clean motion graphic background plate).
 * - High-performance Canvas 2D seamless loops at 30 FPS.
 */

import { MotionConfig } from '../types/motion';

function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

function hexToRgba(hex: string, alpha: number): string {
  if (hex.startsWith('#')) {
    const c = hex.substring(1);
    if (c.length === 6) {
      const r = parseInt(c.substring(0, 2), 16);
      const g = parseInt(c.substring(2, 4), 16);
      const b = parseInt(c.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  }
  return hex;
}

export interface BuildingDef {
  x: number;
  width: number;
  height: number;
  layer: number;
  style: 'box' | 'spire' | 'stepped' | 'diagonal' | 'antenna' | 'twin_spire';
  windowCols: number;
  windowRows: number;
}

// 26 Realistic, iconic skyscrapers across 3 layers (identical to Wide Metropolis Skyline)
export function getRealisticCityLayout(): BuildingDef[] {
  return [
    // Layer 0 (Far silhouettes)
    { x: 0.01, width: 0.055, height: 0.28, layer: 0, style: 'stepped', windowCols: 4, windowRows: 16 },
    { x: 0.07, width: 0.045, height: 0.34, layer: 0, style: 'antenna', windowCols: 3, windowRows: 20 },
    { x: 0.13, width: 0.060, height: 0.26, layer: 0, style: 'box', windowCols: 5, windowRows: 15 },
    { x: 0.20, width: 0.065, height: 0.37, layer: 0, style: 'spire', windowCols: 5, windowRows: 22 },
    { x: 0.28, width: 0.050, height: 0.29, layer: 0, style: 'diagonal', windowCols: 4, windowRows: 18 },
    { x: 0.34, width: 0.060, height: 0.33, layer: 0, style: 'box', windowCols: 5, windowRows: 19 },
    { x: 0.42, width: 0.055, height: 0.38, layer: 0, style: 'stepped', windowCols: 4, windowRows: 21 },
    { x: 0.49, width: 0.060, height: 0.31, layer: 0, style: 'box', windowCols: 5, windowRows: 18 },
    { x: 0.57, width: 0.050, height: 0.35, layer: 0, style: 'antenna', windowCols: 4, windowRows: 20 },
    { x: 0.63, width: 0.070, height: 0.39, layer: 0, style: 'twin_spire', windowCols: 5, windowRows: 23 },
    { x: 0.72, width: 0.055, height: 0.32, layer: 0, style: 'diagonal', windowCols: 4, windowRows: 18 },
    { x: 0.79, width: 0.065, height: 0.36, layer: 0, style: 'spire', windowCols: 5, windowRows: 21 },
    { x: 0.87, width: 0.050, height: 0.30, layer: 0, style: 'stepped', windowCols: 4, windowRows: 17 },
    { x: 0.93, width: 0.060, height: 0.27, layer: 0, style: 'box', windowCols: 4, windowRows: 15 },

    // Layer 1 (Midground Hero Towers)
    { x: 0.04, width: 0.060, height: 0.27, layer: 1, style: 'spire', windowCols: 5, windowRows: 18 },
    { x: 0.11, width: 0.050, height: 0.21, layer: 1, style: 'box', windowCols: 4, windowRows: 14 },
    { x: 0.18, width: 0.065, height: 0.35, layer: 1, style: 'stepped', windowCols: 5, windowRows: 22 },
    { x: 0.26, width: 0.055, height: 0.24, layer: 1, style: 'diagonal', windowCols: 4, windowRows: 16 },
    { x: 0.33, width: 0.060, height: 0.29, layer: 1, style: 'box', windowCols: 5, windowRows: 18 },
    { x: 0.41, width: 0.055, height: 0.26, layer: 1, style: 'box', windowCols: 4, windowRows: 16 },
    { x: 0.48, width: 0.060, height: 0.25, layer: 1, style: 'stepped', windowCols: 5, windowRows: 15 },
    { x: 0.55, width: 0.050, height: 0.23, layer: 1, style: 'diagonal', windowCols: 4, windowRows: 14 },
    { x: 0.62, width: 0.065, height: 0.34, layer: 1, style: 'spire', windowCols: 5, windowRows: 21 },
    { x: 0.70, width: 0.055, height: 0.22, layer: 1, style: 'box', windowCols: 4, windowRows: 14 },
    { x: 0.77, width: 0.065, height: 0.36, layer: 1, style: 'antenna', windowCols: 5, windowRows: 23 },
    { x: 0.85, width: 0.055, height: 0.23, layer: 1, style: 'stepped', windowCols: 4, windowRows: 15 },
    { x: 0.91, width: 0.060, height: 0.20, layer: 1, style: 'box', windowCols: 4, windowRows: 13 },

    // Layer 2 (Waterfront Pier Blocks)
    { x: 0.00, width: 0.08, height: 0.14, layer: 2, style: 'box', windowCols: 6, windowRows: 8 },
    { x: 0.14, width: 0.09, height: 0.12, layer: 2, style: 'box', windowCols: 7, windowRows: 7 },
    { x: 0.29, width: 0.09, height: 0.13, layer: 2, style: 'box', windowCols: 7, windowRows: 8 },
    { x: 0.44, width: 0.08, height: 0.11, layer: 2, style: 'box', windowCols: 6, windowRows: 6 },
    { x: 0.58, width: 0.09, height: 0.12, layer: 2, style: 'box', windowCols: 7, windowRows: 7 },
    { x: 0.73, width: 0.08, height: 0.13, layer: 2, style: 'box', windowCols: 6, windowRows: 8 },
    { x: 0.86, width: 0.09, height: 0.14, layer: 2, style: 'box', windowCols: 7, windowRows: 8 },
  ];
}

const CITY_BUILDINGS = getRealisticCityLayout();

// ----------------------------------------------------------------------------
// REALISTIC BUILDING RENDERER
// ----------------------------------------------------------------------------
function drawRealisticBuildings(
  ctx: CanvasRenderingContext2D,
  buildings: BuildingDef[],
  width: number,
  height: number,
  horizonY: number,
  baseFill: string,
  edgeColor: string,
  windowColor: string,
  time: number,
  isDaylight: boolean = false,
  snowCover: boolean = false
): void {
  ctx.save();

  buildings.forEach((b, bIdx) => {
    const bx = b.x * width;
    const bw = b.width * width;
    const bh = b.height * height;
    const by = horizonY - bh;

    // Building Main Shape
    ctx.fillStyle = baseFill;
    ctx.beginPath();

    if (b.style === 'spire') {
      ctx.moveTo(bx, horizonY);
      ctx.lineTo(bx, by + bh * 0.16);
      ctx.lineTo(bx + bw * 0.20, by + bh * 0.10);
      ctx.lineTo(bx + bw * 0.45, by + bh * 0.04);
      ctx.lineTo(bx + bw * 0.50, by);
      ctx.lineTo(bx + bw * 0.55, by + bh * 0.04);
      ctx.lineTo(bx + bw * 0.80, by + bh * 0.10);
      ctx.lineTo(bx + bw, by + bh * 0.16);
      ctx.lineTo(bx + bw, horizonY);
    } else if (b.style === 'twin_spire') {
      ctx.moveTo(bx, horizonY);
      ctx.lineTo(bx, by + bh * 0.12);
      ctx.lineTo(bx + bw * 0.25, by);
      ctx.lineTo(bx + bw * 0.35, by + bh * 0.08);
      ctx.lineTo(bx + bw * 0.50, by + bh * 0.12);
      ctx.lineTo(bx + bw * 0.65, by + bh * 0.08);
      ctx.lineTo(bx + bw * 0.75, by);
      ctx.lineTo(bx + bw, by + bh * 0.12);
      ctx.lineTo(bx + bw, horizonY);
    } else if (b.style === 'stepped') {
      ctx.moveTo(bx, horizonY);
      ctx.lineTo(bx, by + bh * 0.14);
      ctx.lineTo(bx + bw * 0.14, by + bh * 0.14);
      ctx.lineTo(bx + bw * 0.14, by + bh * 0.07);
      ctx.lineTo(bx + bw * 0.30, by + bh * 0.07);
      ctx.lineTo(bx + bw * 0.30, by);
      ctx.lineTo(bx + bw * 0.70, by);
      ctx.lineTo(bx + bw * 0.70, by + bh * 0.07);
      ctx.lineTo(bx + bw * 0.86, by + bh * 0.07);
      ctx.lineTo(bx + bw * 0.86, by + bh * 0.14);
      ctx.lineTo(bx + bw, by + bh * 0.14);
      ctx.lineTo(bx + bw, horizonY);
    } else if (b.style === 'diagonal') {
      ctx.moveTo(bx, horizonY);
      ctx.lineTo(bx, by);
      ctx.lineTo(bx + bw, by + bh * 0.10);
      ctx.lineTo(bx + bw, horizonY);
    } else if (b.style === 'antenna') {
      ctx.moveTo(bx, horizonY);
      ctx.lineTo(bx, by + bh * 0.07);
      ctx.lineTo(bx + bw, by + bh * 0.07);
      ctx.lineTo(bx + bw, horizonY);
      ctx.rect(bx + bw * 0.47, by, bw * 0.06, bh * 0.07);
    } else {
      ctx.rect(bx, by, bw, bh);
    }

    ctx.closePath();
    ctx.fill();

    // Subtle edge rim light
    ctx.strokeStyle = edgeColor;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Snow Dusting on Roof Edges (for Christmas / Winter)
    if (snowCover) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.90)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(bx, by + bh * 0.16);
      ctx.lineTo(bx + bw * 0.50, by);
      ctx.lineTo(bx + bw, by + bh * 0.16);
      ctx.stroke();
    }

    // Windows
    const cols = b.windowCols || 5;
    const rows = b.windowRows || 18;
    const padX = bw * 0.10;
    const padY = bh * 0.08;
    const cellW = (bw - padX * 2) / cols;
    const cellH = (bh - padY * 2) / rows;
    const winW = Math.max(1, cellW * 0.60);
    const winH = Math.max(1.5, cellH * 0.55);

    ctx.fillStyle = windowColor;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const seed = bIdx * 500 + r * 37 + c;
        const isLit = isDaylight ? hash(seed) > 0.65 : hash(seed) > 0.42;
        if (!isLit) continue;

        const wx = bx + padX + c * cellW + (cellW - winW) / 2;
        const wy = by + padY + r * cellH + (cellH - winH) / 2;

        if (isDaylight) {
          // Daytime glass reflection glint
          ctx.globalAlpha = 0.5 + 0.3 * Math.sin(time * 0.8 + seed);
        } else {
          // Night office glow
          ctx.globalAlpha = 0.4 + 0.5 * Math.sin(time * 1.5 + seed * 5);
        }

        ctx.fillRect(wx, wy, winW, winH);
      }
    }
    ctx.globalAlpha = 1.0;

    // Aviation Red Warning Beacon on top of spires
    if (b.style === 'spire' || b.style === 'antenna') {
      const flash = Math.sin(time * 3.5 + bIdx * 2.1) > 0.4 ? 1.0 : 0.15;
      ctx.fillStyle = `rgba(239, 68, 68, ${flash * 0.85})`;
      ctx.beginPath();
      ctx.arc(bx + bw * 0.5, by - 1, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.restore();
}

// ----------------------------------------------------------------------------
// REALISTIC WATERFRONT HIGHWAY TRAFFIC
// ----------------------------------------------------------------------------
function drawRealisticHighway(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  horizonY: number,
  time: number,
  isDaytime: boolean = false
): void {
  ctx.save();
  const bridgeY = horizonY - height * 0.024;
  const bridgeH = height * 0.015;

  // Bridge deck silhouette
  ctx.fillStyle = isDaytime ? '#cbd5e1' : '#050812';
  ctx.fillRect(0, bridgeY, width, bridgeH);

  // Guardrail
  ctx.strokeStyle = isDaytime ? '#94a3b8' : 'rgba(56, 189, 248, 0.25)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, bridgeY);
  ctx.lineTo(width, bridgeY);
  ctx.stroke();

  if (isDaytime) {
    // Daytime Moving Vehicles (Colored cars, yellow cabs, buses)
    const carCount = 35;
    for (let i = 0; i < carCount; i++) {
      const speed = width * (0.12 + hash(i * 7) * 0.08);
      const cx = ((time * speed + i * (width / carCount)) % (width + 40)) - 20;
      const cy = bridgeY + height * 0.003;
      const isBus = i % 5 === 0;
      const carW = isBus ? 14 : 7;
      const carH = isBus ? 4.5 : 3;

      // Car colors: Yellow cabs, red, dark blue, silver
      const colSeed = i % 4;
      ctx.fillStyle = colSeed === 0 ? '#f59e0b' : colSeed === 1 ? '#ef4444' : colSeed === 2 ? '#3b82f6' : '#ffffff';
      ctx.fillRect(cx, cy, carW, carH);
    }
  } else {
    // Night Headlight Trails (White/Gold moving Left to Right)
    ctx.globalCompositeOperation = 'screen';
    const headCount = 32;
    for (let i = 0; i < headCount; i++) {
      const streakLen = width * 0.065;
      const speed = width * 0.20;
      const hx = ((time * speed + i * (width / headCount)) % (width + streakLen * 2)) - streakLen;
      const hy = bridgeY + height * 0.005;

      const grad = ctx.createLinearGradient(hx - streakLen, hy, hx, hy);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.7, 'rgba(254, 243, 199, 0.6)');
      grad.addColorStop(1, '#ffffff');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(hx - streakLen, hy);
      ctx.lineTo(hx, hy);
      ctx.stroke();
    }

    // Taillight Trails (Ruby Red moving Right to Left)
    const tailCount = 30;
    for (let i = 0; i < tailCount; i++) {
      const streakLen = width * 0.055;
      const speed = width * 0.16;
      const tx = width - (((time * speed + i * (width / tailCount)) % (width + streakLen * 2)) - streakLen);
      const ty = bridgeY + height * 0.010;

      const grad = ctx.createLinearGradient(tx + streakLen, ty, tx, ty);
      grad.addColorStop(0, 'transparent');
      grad.addColorStop(0.7, 'rgba(239, 68, 68, 0.6)');
      grad.addColorStop(1, 'rgba(255, 100, 100, 0.95)');

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(tx + streakLen, ty);
      ctx.lineTo(tx, ty);
      ctx.stroke();
    }
  }

  ctx.restore();
}

// ----------------------------------------------------------------------------
// REALISTIC HARBOR WATER REFLECTIONS
// ----------------------------------------------------------------------------
function drawRealisticWater(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  horizonY: number,
  time: number,
  waterTopColor: string,
  waterBottomColor: string,
  highlightColor: string,
  isDaytime: boolean = false
): void {
  ctx.save();
  const waterH = height - horizonY;

  const grad = ctx.createLinearGradient(0, horizonY, 0, height);
  grad.addColorStop(0, waterTopColor);
  grad.addColorStop(1, waterBottomColor);
  ctx.fillStyle = grad;
  ctx.fillRect(0, horizonY, width, waterH);

  // Horizontal Wave Shimmer Ripples
  ctx.globalCompositeOperation = isDaytime ? 'source-over' : 'screen';
  const rows = 22;
  for (let r = 0; r < rows; r++) {
    const ry = horizonY + (r / rows) * waterH;
    const rippleW = width * (0.04 + (r / rows) * 0.07);
    const waveShift = Math.sin(time * 2.2 + r * 0.45) * (width * 0.008);

    const refXs = [0.08, 0.22, 0.45, 0.65, 0.82];
    refXs.forEach((rx) => {
      const cx = rx * width + waveShift;
      const alpha = Math.max(0.04, (1 - r / rows) * (isDaytime ? 0.35 : 0.22));

      const ripGrad = ctx.createLinearGradient(cx - rippleW, ry, cx + rippleW, ry);
      ripGrad.addColorStop(0, 'transparent');
      ripGrad.addColorStop(0.5, hexToRgba(highlightColor, alpha));
      ripGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = ripGrad;
      ctx.fillRect(cx - rippleW, ry, rippleW * 2, 1.2 + (r / rows) * 1.5);
    });
  }

  ctx.restore();
}

// ============================================================================
// 1. BRIGHT DAYLIGHT SUNNY CITY SKYLINE & SPARKLING WATER
// ============================================================================
export function drawDaylightSunnySkyline(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Clear crisp blue daylight gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#1d4ed8'); // Deep azure blue at zenith
  skyGrad.addColorStop(0.50, '#38bdf8'); // Sky blue
  skyGrad.addColorStop(0.85, '#93c5fd'); // Horizon haze
  skyGrad.addColorStop(1.0, '#e0f2fe'); // Bright horizon glow
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Radiant Golden Sun in Upper Right Sky
  ctx.save();
  const sunX = width * 0.82;
  const sunY = height * 0.18;
  const sunR = height * 0.045;

  const sunCorona = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, width * 0.22);
  sunCorona.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  sunCorona.addColorStop(0.15, 'rgba(254, 240, 138, 0.65)');
  sunCorona.addColorStop(0.5, 'rgba(56, 189, 248, 0.18)');
  sunCorona.addColorStop(1, 'transparent');
  ctx.fillStyle = sunCorona;
  ctx.beginPath();
  ctx.arc(sunX, sunY, width * 0.22, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunR, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Gentle Drifting White Summer Clouds
  ctx.save();
  for (let c = 0; c < 3; c++) {
    const cy = height * (0.24 + c * 0.12);
    const cx = ((time * 12 * (c + 1) + c * width * 0.35) % (width + width * 0.4)) - width * 0.2;
    const cw = width * 0.35;

    const cGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, cw * 0.5);
    cGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
    cGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.15)');
    cGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = cGrad;
    ctx.beginPath();
    ctx.ellipse(cx, cy, cw * 0.5, height * 0.04, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Layer 0 Far Silhouettes (Muted distant blue-gray)
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 0),
    width,
    height,
    horizonY,
    '#64748b',
    'rgba(255, 255, 255, 0.25)',
    'rgba(255, 255, 255, 0.4)',
    time,
    true
  );

  // Layer 1 Midground Realistic Modern Glass Towers
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 1),
    width,
    height,
    horizonY,
    '#334155',
    '#94a3b8',
    'rgba(254, 240, 138, 0.65)',
    time,
    true
  );

  // Layer 2 Foreground Waterfront Blocks
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 2),
    width,
    height,
    horizonY,
    '#1e293b',
    '#64748b',
    'rgba(255, 255, 255, 0.55)',
    time,
    true
  );

  // Daytime Highway with Moving Colored Cars & Yellow Cabs
  drawRealisticHighway(ctx, width, height, horizonY, time, true);

  // Sparkling Blue Harbor Water with Sun Glitter
  drawRealisticWater(ctx, width, height, horizonY, time, '#0284c7', '#0369a1', '#ffffff', true);

  // Floating Sunlight Motes in Warm Afternoon Air (Natural dust motes)
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let d = 0; d < 45; d++) {
    const seed = d * 29.3;
    const dx = (hash(seed) * width + Math.sin(time * 0.6 + d) * 20) % width;
    const dy = (hash(seed * 2) * height + time * 15) % (horizonY * 0.85);
    const size = 1.0 + hash(seed * 5) * 1.8;
    const alpha = 0.2 + 0.4 * Math.sin(time * 1.5 + d);

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(dx, dy, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ============================================================================
// 2. CHRISTMAS WINTER WONDERLAND SNOW-DUSTED SKYLINE
// ============================================================================
export function drawChristmasSnowSkyline(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Festive deep navy winter twilight
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#03071e');
  skyGrad.addColorStop(0.5, '#071638');
  skyGrad.addColorStop(0.85, '#0d2754');
  skyGrad.addColorStop(1.0, '#13356b');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Winter Twilight Stars & Subtle Luminous Christmas Crescent Moon
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (let s = 0; s < 110; s++) {
    const sx = hash(s * 19.3) * width;
    const sy = hash(s * 37.1) * (horizonY * 0.70);
    const twinkle = 0.3 + 0.7 * Math.sin(time * 2.0 + s * 3);
    ctx.globalAlpha = twinkle;
    ctx.fillRect(sx, sy, 1.2, 1.2);
  }

  // Golden Christmas Crescent Moon
  const moonX = width * 0.80;
  const moonY = height * 0.17;
  const moonR = height * 0.032;
  ctx.globalAlpha = 1.0;
  ctx.fillStyle = '#fffbeb';
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#03071e';
  ctx.beginPath();
  ctx.arc(moonX + moonR * 0.45, moonY - moonR * 0.2, moonR * 0.95, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Layer 0 Far Silhouettes
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 0),
    width,
    height,
    horizonY,
    '#051126',
    'rgba(255, 255, 255, 0.25)',
    'rgba(254, 240, 138, 0.35)',
    time,
    false,
    true // Snow dusting on roof
  );

  // Layer 1 Midground Towers with Warm Festive Gold Windows & Snow Dusting
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 1),
    width,
    height,
    horizonY,
    '#091b3b',
    '#e2e8f0',
    'rgba(254, 240, 138, 0.85)', // Warm cozy golden holiday windows
    time,
    false,
    true
  );

  // Layer 2 Foreground Waterfront Blocks
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 2),
    width,
    height,
    horizonY,
    '#050e1f',
    'rgba(255, 255, 255, 0.35)',
    'rgba(254, 240, 138, 0.65)',
    time,
    false,
    true
  );

  // Festive Holiday Highway with Moving Vehicle Light Trails
  drawRealisticHighway(ctx, width, height, horizonY, time, false);

  // Dark Icy Winter Harbor Water with Warm Gold Window Reflections
  drawRealisticWater(ctx, width, height, horizonY, time, '#020914', '#01040a', '#fef08a', false);

  // Gentle Falling Snowflakes Drifting across the Scene
  ctx.save();
  const snowCount = 130;
  for (let s = 0; s < snowCount; s++) {
    const seed = s * 31.7;
    const sx = (hash(seed) * width + Math.sin(time * 0.8 + s) * 25) % width;
    const speed = 25 + hash(seed * 3) * 35;
    const sy = (time * speed + hash(seed * 5) * height) % height;
    const size = 1.0 + hash(seed * 7) * 2.2;
    const alpha = 0.35 + 0.55 * Math.sin(time * 1.8 + s);

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ============================================================================
// 3. NEW YEAR'S EVE MIDNIGHT GALA SKYLINE & GOLDEN STARDUST
// ============================================================================
export function drawNewYearMidnightSkyline(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Midnight Black to Deep Royal Navy
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#020206');
  skyGrad.addColorStop(0.55, '#070a1a');
  skyGrad.addColorStop(0.85, '#0e142e');
  skyGrad.addColorStop(1.0, '#181e3a');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Layer 0 Far Silhouettes
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 0),
    width,
    height,
    horizonY,
    '#060814',
    'rgba(254, 240, 138, 0.25)',
    'rgba(254, 240, 138, 0.3)',
    time,
    false
  );

  // Layer 1 Midground Towers with Fully Illuminated Celebration Windows
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 1),
    width,
    height,
    horizonY,
    '#090d1f',
    'rgba(254, 240, 138, 0.45)',
    'rgba(254, 240, 138, 0.85)',
    time,
    false
  );

  // Layer 2 Foreground Waterfront Blocks
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 2),
    width,
    height,
    horizonY,
    '#04060e',
    'rgba(254, 240, 138, 0.3)',
    'rgba(254, 240, 138, 0.65)',
    time,
    false
  );

  // Highway Celebration Traffic Streaks
  drawRealisticHighway(ctx, width, height, horizonY, time, false);

  // Harbor Water with 24K Gold Shimmer Reflections
  drawRealisticWater(ctx, width, height, horizonY, time, '#03050c', '#010206', '#fbbf24', false);

  // Elegant Cascading Golden Stardust & Midnight Celebration Sparkles in Expansive Sky
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const sparkCount = 120;
  for (let s = 0; s < sparkCount; s++) {
    const seed = s * 41.7;
    const sx = hash(seed) * width + Math.sin(time * 1.5 + s) * 15;
    const speed = 20 + hash(seed * 2) * 35;
    const sy = (time * speed + hash(seed * 4) * height) % (horizonY * 0.90);
    const size = 1.1 + hash(seed * 6) * 2.4;
    const alpha = 0.25 + 0.65 * Math.sin(time * 2.2 + s);

    ctx.fillStyle = s % 3 === 0 ? `rgba(254, 240, 138, ${alpha})` : `rgba(245, 158, 11, ${alpha})`;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();

    // Cross glint on hero sparkles
    if (s % 8 === 0) {
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(sx - 6, sy);
      ctx.lineTo(sx + 6, sy);
      ctx.moveTo(sx, sy - 6);
      ctx.lineTo(sx, sy + 6);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// ============================================================================
// 4. EVENING RUSH HOUR SKYLINE & HIGHWAY TRAFFIC
// ============================================================================
export function drawEveningRushHourTraffic(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Rich twilight gradient (Deep indigo to warm dusk amber)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#0c102a');
  skyGrad.addColorStop(0.45, '#1e204c');
  skyGrad.addColorStop(0.75, '#4a2545');
  skyGrad.addColorStop(0.92, '#85373a');
  skyGrad.addColorStop(1.0, '#c2532d');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Layer 0 Far Silhouettes
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 0),
    width,
    height,
    horizonY,
    '#131024',
    'rgba(244, 63, 94, 0.2)',
    'rgba(254, 240, 138, 0.4)',
    time,
    false
  );

  // Layer 1 Midground Towers with Office Lights Switching On at Dusk
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 1),
    width,
    height,
    horizonY,
    '#1a1530',
    'rgba(251, 146, 60, 0.35)',
    'rgba(254, 240, 138, 0.75)',
    time,
    false
  );

  // Layer 2 Foreground Waterfront Blocks
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 2),
    width,
    height,
    horizonY,
    '#0e0b1a',
    'rgba(251, 146, 60, 0.2)',
    'rgba(254, 240, 138, 0.55)',
    time,
    false
  );

  // High-Density Rush Hour Highway Traffic (Bright streaming lights)
  drawRealisticHighway(ctx, width, height, horizonY, time, false);

  // Water with Dusk Warm Reflections
  drawRealisticWater(ctx, width, height, horizonY, time, '#0a0714', '#040208', '#fb923c', false);
}

// ============================================================================
// 5. RAINY DUSK CITY SKYLINE & WET REFLECTIONS
// ============================================================================
export function drawRainyEveningSkyline(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Moody rainy overcast slate
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#050a14');
  skyGrad.addColorStop(0.5, '#0c1626');
  skyGrad.addColorStop(0.85, '#162236');
  skyGrad.addColorStop(1.0, '#1e2d44');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Layer 0 Far Silhouettes
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 0),
    width,
    height,
    horizonY,
    '#0a121e',
    'rgba(148, 163, 184, 0.2)',
    'rgba(254, 240, 138, 0.35)',
    time,
    false
  );

  // Layer 1 Midground Towers with Softly Blurred Rainy Windows
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 1),
    width,
    height,
    horizonY,
    '#0f1a2c',
    '#64748b',
    'rgba(254, 240, 138, 0.65)',
    time,
    false
  );

  // Layer 2 Foreground Waterfront Blocks
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 2),
    width,
    height,
    horizonY,
    '#070d18',
    '#475569',
    'rgba(254, 240, 138, 0.45)',
    time,
    false
  );

  // Wet Highway with Enhanced Glare Streaks
  drawRealisticHighway(ctx, width, height, horizonY, time, false);

  // Wet Mirror-like Harbor Water
  drawRealisticWater(ctx, width, height, horizonY, time, '#03070f', '#010307', '#38bdf8', false);

  // Vertical Rain Streaks Falling at 5-Degree Angle
  ctx.save();
  ctx.strokeStyle = 'rgba(186, 230, 253, 0.40)';
  ctx.lineWidth = 1.2;
  const rainCount = 140;
  for (let r = 0; r < rainCount; r++) {
    const seed = r * 37.1;
    const rx = (hash(seed) * width + time * 30) % width;
    const speed = 320 + hash(seed * 2) * 160;
    const len = height * (0.025 + hash(seed * 4) * 0.035);
    const ry = (time * speed + hash(seed * 6) * height) % height;

    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - len * 0.08, ry + len);
    ctx.stroke();
  }
  ctx.restore();
}

// ============================================================================
// 6. GOLDEN HOUR SUNSET CORPORATE SKYLINE
// ============================================================================
export function drawGoldenHourCorporate(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Breathtaking golden hour sunset gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#1e1b4b'); // Twilight violet
  skyGrad.addColorStop(0.35, '#431407'); // Deep bronze
  skyGrad.addColorStop(0.65, '#9a3412'); // Amber orange
  skyGrad.addColorStop(0.88, '#f59e0b'); // Golden sun
  skyGrad.addColorStop(1.0, '#fbbf24'); // Horizon blaze
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Sun Setting on the Horizon
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const sunX = width * 0.58;
  const sunY = horizonY - height * 0.05;
  const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, width * 0.35);
  sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.85)');
  sunGlow.addColorStop(0.3, 'rgba(245, 158, 11, 0.45)');
  sunGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, width * 0.35, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Layer 0 Far Silhouettes (Backlit crisp dark silhouettes)
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 0),
    width,
    height,
    horizonY,
    '#1c0a06',
    'rgba(251, 191, 36, 0.3)',
    'rgba(254, 240, 138, 0.4)',
    time,
    false
  );

  // Layer 1 Midground Towers Backlit by Sun
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 1),
    width,
    height,
    horizonY,
    '#250e09',
    '#f59e0b',
    'rgba(254, 240, 138, 0.75)',
    time,
    false
  );

  // Layer 2 Foreground Waterfront Blocks
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 2),
    width,
    height,
    horizonY,
    '#170704',
    'rgba(251, 191, 36, 0.4)',
    'rgba(254, 240, 138, 0.55)',
    time,
    false
  );

  // Highway with Sunset Headlights
  drawRealisticHighway(ctx, width, height, horizonY, time, false);

  // Golden Sunpath Water Reflections
  drawRealisticWater(ctx, width, height, horizonY, time, '#130402', '#080201', '#fbbf24', false);
}

// ============================================================================
// 7. WINTER TWILIGHT FROST & WARM PENTHOUSE LIGHTS
// ============================================================================
export function drawWinterTwilightFrost(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Deep Cobalt Winter Twilight
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#020617');
  skyGrad.addColorStop(0.5, '#0a1936');
  skyGrad.addColorStop(0.85, '#152b57');
  skyGrad.addColorStop(1.0, '#1e3a73');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Crisp Winter Stars
  ctx.save();
  ctx.fillStyle = '#ffffff';
  for (let s = 0; s < 100; s++) {
    const sx = hash(s * 23.1) * width;
    const sy = hash(s * 41.3) * (horizonY * 0.70);
    const twinkle = 0.3 + 0.7 * Math.sin(time * 2.2 + s);
    ctx.globalAlpha = twinkle * 0.85;
    ctx.fillRect(sx, sy, 1.2, 1.2);
  }
  ctx.restore();

  // Layer 0 Far Silhouettes
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 0),
    width,
    height,
    horizonY,
    '#050e20',
    '#38bdf8',
    'rgba(254, 240, 138, 0.3)',
    time,
    false,
    true
  );

  // Layer 1 Midground Towers with Frosted Cornices & Warm Amber Penthouses
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 1),
    width,
    height,
    horizonY,
    '#091733',
    '#7dd3fc',
    'rgba(254, 240, 138, 0.75)',
    time,
    false,
    true
  );

  // Layer 2 Foreground Waterfront Blocks
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 2),
    width,
    height,
    horizonY,
    '#040a17',
    '#38bdf8',
    'rgba(254, 240, 138, 0.55)',
    time,
    false,
    true
  );

  drawRealisticHighway(ctx, width, height, horizonY, time, false);
  drawRealisticWater(ctx, width, height, horizonY, time, '#020612', '#010309', '#fef08a', false);
}

// ============================================================================
// 8. FOGGY MORNING DAWN HARBOR SKYLINE
// ============================================================================
export function drawFoggyDawnHarbor(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Soft pastel dawn gradient (Muted lilac to soft peach)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#1e1b38');
  skyGrad.addColorStop(0.5, '#3b2d54');
  skyGrad.addColorStop(0.82, '#704464');
  skyGrad.addColorStop(1.0, '#bd6b73');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Layer 0 Far Silhouettes (Softly shrouded in mist)
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 0),
    width,
    height,
    horizonY,
    '#251d36',
    'rgba(255, 255, 255, 0.15)',
    'rgba(254, 240, 138, 0.3)',
    time,
    false
  );

  // Layer 1 Midground Towers
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 1),
    width,
    height,
    horizonY,
    '#2e2442',
    '#f472b6',
    'rgba(254, 240, 138, 0.65)',
    time,
    false
  );

  // Rolling Morning Dawn Mist hovering over water
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let m = 0; m < 2; m++) {
    const mistY = horizonY - height * (0.05 + m * 0.04);
    const mistGrad = ctx.createLinearGradient(0, mistY - 30, 0, mistY + 30);
    mistGrad.addColorStop(0, 'transparent');
    mistGrad.addColorStop(0.5, 'rgba(253, 164, 175, 0.14)');
    mistGrad.addColorStop(1, 'transparent');
    ctx.fillStyle = mistGrad;
    ctx.fillRect(0, mistY - 30, width, 60);
  }
  ctx.restore();

  // Layer 2 Foreground Waterfront Blocks
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 2),
    width,
    height,
    horizonY,
    '#191224',
    '#cbd5e1',
    'rgba(254, 240, 138, 0.45)',
    time,
    false
  );

  drawRealisticHighway(ctx, width, height, horizonY, time, false);
  drawRealisticWater(ctx, width, height, horizonY, time, '#100a17', '#06030a', '#fbcfe8', false);
}

// ============================================================================
// 9. PURE DEEP SAPPHIRE MIDNIGHT CITY PLATE
// ============================================================================
export function drawClearMidnightBlue(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Ultra-Clean Deep Sapphire Midnight Sky
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#01040d');
  skyGrad.addColorStop(0.50, '#030c22');
  skyGrad.addColorStop(0.85, '#071638');
  skyGrad.addColorStop(1.0, '#0c224e');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // 120 Subtle Deep Space Stars in Expansive Sky
  ctx.save();
  ctx.fillStyle = '#f8fafc';
  for (let s = 0; s < 120; s++) {
    const sx = hash(s * 17.3) * width;
    const sy = hash(s * 43.1) * (horizonY * 0.68);
    const twinkle = 0.35 + 0.65 * Math.sin(time * 1.8 + s * 2.5);
    ctx.globalAlpha = twinkle * 0.8;
    ctx.fillRect(sx, sy, 1.2, 1.2);
  }
  ctx.restore();

  // Layer 0 Far Silhouettes
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 0),
    width,
    height,
    horizonY,
    '#050d22',
    'rgba(56, 189, 248, 0.15)',
    'rgba(56, 189, 248, 0.3)',
    time,
    false
  );

  // Layer 1 Midground Realistic Towers
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 1),
    width,
    height,
    horizonY,
    '#081433',
    '#38bdf8',
    'rgba(224, 242, 254, 0.75)',
    time,
    false
  );

  // Layer 2 Foreground Waterfront Blocks
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 2),
    width,
    height,
    horizonY,
    '#030918',
    'rgba(56, 189, 248, 0.25)',
    'rgba(224, 242, 254, 0.55)',
    time,
    false
  );

  drawRealisticHighway(ctx, width, height, horizonY, time, false);
  drawRealisticWater(ctx, width, height, horizonY, time, '#020713', '#010309', '#38bdf8', false);
}

// ============================================================================
// 10. SPRING BREEZE CITY SKYLINE WITH DRIFTING BLOSSOM PETALS
// ============================================================================
export function drawSpringBreezeCherry(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Crisp refreshing spring blue sky with soft morning warmth
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#2563eb');
  skyGrad.addColorStop(0.50, '#60a5fa');
  skyGrad.addColorStop(0.85, '#bae6fd');
  skyGrad.addColorStop(1.0, '#f0fdf4');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Layer 0 Far Silhouettes
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 0),
    width,
    height,
    horizonY,
    '#64748b',
    '#cbd5e1',
    'rgba(255, 255, 255, 0.4)',
    time,
    true
  );

  // Layer 1 Midground Realistic Towers
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 1),
    width,
    height,
    horizonY,
    '#334155',
    '#94a3b8',
    'rgba(255, 255, 255, 0.65)',
    time,
    true
  );

  // Layer 2 Foreground Waterfront Blocks
  drawRealisticBuildings(
    ctx,
    CITY_BUILDINGS.filter(b => b.layer === 2),
    width,
    height,
    horizonY,
    '#1e293b',
    '#64748b',
    'rgba(255, 255, 255, 0.5)',
    time,
    true
  );

  // Daytime Moving Highway Vehicles
  drawRealisticHighway(ctx, width, height, horizonY, time, true);

  // Clear Sparkling Spring Water
  drawRealisticWater(ctx, width, height, horizonY, time, '#0284c7', '#0369a1', '#ffffff', true);

  // Gentle Pink Blossom Petals Drifting in the Spring Air Breeze
  ctx.save();
  const petalCount = 45;
  for (let p = 0; p < petalCount; p++) {
    const seed = p * 27.9;
    const px = (hash(seed) * width + time * 45) % width;
    const py = (hash(seed * 3) * height + Math.sin(time * 1.5 + p) * 20) % (horizonY * 0.95);
    const rot = time * 2.0 + p;

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(rot);
    ctx.fillStyle = 'rgba(251, 182, 206, 0.85)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 4.5, 2.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();
}
