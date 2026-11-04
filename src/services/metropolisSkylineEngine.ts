/**
 * Metropolis City Skyline Beacon Engine (Wide Panoramic Landscape Edition)
 * 
 * Cinematic architectural metropolis skyline with zoomed-out camera perspective,
 * providing generous expansive night sky space (~55-60% upper canvas) for searchlight
 * beams, celestial stars, drifting atmospheric clouds, and commercial copy space.
 * 
 * Features:
 * - Wide pulled-back perspective ("agak menjauh") with low horizon (horizonY ~ 0.88).
 * - Multi-point sweeping rooftop searchlight beacons crossing harmonically.
 * - NO countdown numbers or dials (clean cinematic plate).
 * - NO central laser beam column (leaving middle sky uncluttered & cinematic).
 * - Distant waterfront harbor reflections & double-decker bridge traffic light streaks.
 * - Realistic animated office window grids and pulsing aviation warning lights.
 */

import { MotionConfig } from '../types/motion';

// Pseudo-random deterministic hash
function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

interface Building {
  x: number; // 0.0 to 1.0 relative
  width: number; // relative
  height: number; // relative to screen height
  layer: number; // 0 = far, 1 = mid, 2 = near
  style: 'box' | 'spire' | 'stepped' | 'diagonal' | 'antenna' | 'twin_spire';
  windowCols: number;
  windowRows: number;
  hasBeacon?: boolean;
  beaconAngleOffset?: number;
  beaconColor?: string;
  beaconSpeed?: number;
  beaconArc?: number;
}

// Sprawling zoomed-out panoramic city layout (Heights scaled down to 0.12 - 0.38 for ample sky space)
function getWideCityLayout(): Building[] {
  return [
    // --- Far Background Silhouettes (Layer 0) - Distant Megatowers & Antenna Masts ---
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

    // --- Midground Skyscraper Heroes with Sweeping Rooftop Beacons (Layer 1) ---
    // Beacon Tower 1 (West Horizon): Sweeping cyan/gold searchlight
    {
      x: 0.04,
      width: 0.060,
      height: 0.27,
      layer: 1,
      style: 'spire',
      windowCols: 5,
      windowRows: 18,
      hasBeacon: true,
      beaconAngleOffset: 0.4,
      beaconSpeed: 0.85,
      beaconArc: 0.65,
      beaconColor: 'cyan',
    },
    { x: 0.11, width: 0.050, height: 0.21, layer: 1, style: 'box', windowCols: 4, windowRows: 14 },
    
    // Beacon Tower 2 (Mid-West): Tall iconic skyscraper with sky tracker
    {
      x: 0.18,
      width: 0.065,
      height: 0.35,
      layer: 1,
      style: 'stepped',
      windowCols: 5,
      windowRows: 22,
      hasBeacon: true,
      beaconAngleOffset: 1.9,
      beaconSpeed: 0.75,
      beaconArc: 0.60,
      beaconColor: 'blue',
    },
    { x: 0.26, width: 0.055, height: 0.24, layer: 1, style: 'diagonal', windowCols: 4, windowRows: 16 },
    { x: 0.33, width: 0.060, height: 0.29, layer: 1, style: 'box', windowCols: 5, windowRows: 18 },

    // Central Towers: NO CENTRAL LASER! (Clean open center space)
    { x: 0.41, width: 0.055, height: 0.26, layer: 1, style: 'box', windowCols: 4, windowRows: 16 },
    { x: 0.48, width: 0.060, height: 0.25, layer: 1, style: 'stepped', windowCols: 5, windowRows: 15 },
    { x: 0.55, width: 0.050, height: 0.23, layer: 1, style: 'diagonal', windowCols: 4, windowRows: 14 },

    // Beacon Tower 3 (Mid-East): Golden sky-tracker searchlight
    {
      x: 0.62,
      width: 0.065,
      height: 0.34,
      layer: 1,
      style: 'spire',
      windowCols: 5,
      windowRows: 21,
      hasBeacon: true,
      beaconAngleOffset: 3.3,
      beaconSpeed: 0.90,
      beaconArc: 0.70,
      beaconColor: 'gold',
    },
    { x: 0.70, width: 0.055, height: 0.22, layer: 1, style: 'box', windowCols: 4, windowRows: 14 },

    // Beacon Tower 4 (East Horizon): High-altitude dual beacon
    {
      x: 0.77,
      width: 0.065,
      height: 0.36,
      layer: 1,
      style: 'antenna',
      windowCols: 5,
      windowRows: 23,
      hasBeacon: true,
      beaconAngleOffset: 4.8,
      beaconSpeed: 0.80,
      beaconArc: 0.65,
      beaconColor: 'cyan',
    },
    { x: 0.85, width: 0.055, height: 0.23, layer: 1, style: 'stepped', windowCols: 4, windowRows: 15 },
    { x: 0.91, width: 0.060, height: 0.20, layer: 1, style: 'box', windowCols: 4, windowRows: 13 },

    // --- Foreground Lower Waterfront & Pier Blocks (Layer 2) ---
    { x: 0.00, width: 0.08, height: 0.14, layer: 2, style: 'box', windowCols: 6, windowRows: 8 },
    { x: 0.14, width: 0.09, height: 0.12, layer: 2, style: 'box', windowCols: 7, windowRows: 7 },
    { x: 0.29, width: 0.09, height: 0.13, layer: 2, style: 'box', windowCols: 7, windowRows: 8 },
    { x: 0.44, width: 0.08, height: 0.11, layer: 2, style: 'box', windowCols: 6, windowRows: 6 },
    { x: 0.58, width: 0.09, height: 0.12, layer: 2, style: 'box', windowCols: 7, windowRows: 7 },
    { x: 0.73, width: 0.08, height: 0.13, layer: 2, style: 'box', windowCols: 6, windowRows: 8 },
    { x: 0.86, width: 0.09, height: 0.14, layer: 2, style: 'box', windowCols: 7, windowRows: 8 },
  ];
}

const WIDE_CITY_BUILDINGS = getWideCityLayout();

export function drawMetropolisSkylineBeacon(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const duration = config.durationSeconds || 10;
  const loopT = (time % duration) / duration;
  const cycleRad = loopT * Math.PI * 2;

  // Determine Palette
  const isGold = config.colorPalette === 'gold_luxury' || config.colorPalette === 'amber_warm';
  const isCyber = config.colorPalette === 'cyber_neon';

  const skyTopColor = isGold ? '#05050a' : isCyber ? '#02040d' : '#030612';
  const skyMidColor = isGold ? '#161122' : isCyber ? '#0a122e' : '#0a1632';
  const skyBottomColor = isGold ? '#281c38' : isCyber ? '#122452' : '#12254d';
  const fogColor = isGold ? 'rgba(212, 175, 55, 0.07)' : 'rgba(56, 189, 248, 0.08)';

  const primaryBeaconHex = isGold ? '#ffdf78' : isCyber ? '#00f0ff' : '#60a5fa';
  const secondaryBeaconHex = isGold ? '#ffd23f' : isCyber ? '#f43f5e' : '#38bdf8';

  // Horizon position: 88% down, creating a wide, low skyline with expansive sky above
  const horizonY = height * 0.88;

  // 1. Expansive Deep Midnight Sky Gradient (Smooth multi-stop atmospheric gradient)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, skyTopColor);
  skyGrad.addColorStop(0.40, skyMidColor);
  skyGrad.addColorStop(0.75, skyBottomColor);
  skyGrad.addColorStop(1.0, isGold ? '#1a1224' : '#0c1a3b');

  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Distant Celestial Starfield & Shimmering Upper Atmosphere
  drawExpansiveStarfield(ctx, width, height, horizonY, time);

  // 3. Subtle Crescent Moon & Luminous Sky Halo (In the upper right sky)
  drawCelestialCrescentMoon(ctx, width, height, isGold);

  // 4. Volumetric Drifting Clouds Across the Upper Sky Space
  drawExpansiveNightClouds(ctx, width, height, time, isGold);

  // 5. Far Background Layer (Layer 0) Silhouettes
  drawWideSkylineLayer(ctx, WIDE_CITY_BUILDINGS.filter(b => b.layer === 0), width, height, horizonY, 0, time, isGold);

  // 6. Volumetric Rooftop Searchlight Beacons (SWEEPING INTO THE VAST SKY - NO CENTRAL LASER)
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  drawWideRooftopSearchlightBeacons(
    ctx,
    WIDE_CITY_BUILDINGS.filter(b => b.hasBeacon),
    width,
    height,
    horizonY,
    time,
    cycleRad,
    primaryBeaconHex,
    secondaryBeaconHex
  );
  ctx.restore();

  // 7. Midground Skyline Layer (Layer 1) Detailed Towers with Illuminated Window Grids
  drawWideSkylineLayer(ctx, WIDE_CITY_BUILDINGS.filter(b => b.layer === 1), width, height, horizonY, 1, time, isGold);

  // 8. Flashing Spire Aviation Warning Beacons (Red & White Strobe)
  drawAviationWarningLights(ctx, WIDE_CITY_BUILDINGS, width, height, horizonY, time);

  // 9. Foreground Lower Blocks & Waterfront Piers (Layer 2)
  drawWideSkylineLayer(ctx, WIDE_CITY_BUILDINGS.filter(b => b.layer === 2), width, height, horizonY, 2, time, isGold);

  // 10. Elevated Expressway Bridge with Traffic Light Streaks (Headlights & Taillights)
  drawWideHighwayTrafficStreaks(ctx, width, height, horizonY, time, isGold);

  // 11. Waterfront Harbor Basin & Dynamic Rippling Water Reflections
  drawWideWaterfrontReflections(ctx, width, height, horizonY, time, primaryBeaconHex, secondaryBeaconHex, isGold);

  // 12. Low Atmospheric City Fog & Harbor Mist
  drawAtmosphericCityFog(ctx, width, height, horizonY, fogColor);

  // 13. Subtle Night Bokeh Dust Particles in the Air
  drawAtmosphericAirDust(ctx, width, height, time, isGold);
}

// ----------------------------------------------------------------------
// Sub-renderers (Optimized for Wide Zoomed-Out Perspective)
// ----------------------------------------------------------------------

function drawExpansiveStarfield(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  horizonY: number,
  time: number
): void {
  ctx.save();
  // 150 stars distributed across the expansive upper sky (upper 60%)
  const starCount = 150;
  for (let i = 0; i < starCount; i++) {
    const sx = hash(i * 19.31) * width;
    const sy = hash(i * 71.73) * (horizonY * 0.65);
    const size = 0.5 + hash(i * 3.7) * 1.4;
    const twinkle = 0.35 + 0.65 * Math.sin(time * (1.1 + hash(i * 5.1) * 2.2) + i * 2.1);

    ctx.fillStyle = `rgba(235, 245, 255, ${Math.max(0.1, twinkle * 0.85)})`;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawCelestialCrescentMoon(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  isGold: boolean
): void {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const moonX = width * 0.78;
  const moonY = height * 0.16;
  const moonRadius = Math.max(14, width * 0.016);

  // Subtle lunar atmospheric halo
  const haloGrad = ctx.createRadialGradient(moonX, moonY, moonRadius * 0.8, moonX, moonY, moonRadius * 4.5);
  haloGrad.addColorStop(0, isGold ? 'rgba(255, 235, 175, 0.22)' : 'rgba(215, 235, 255, 0.25)');
  haloGrad.addColorStop(0.5, isGold ? 'rgba(255, 215, 120, 0.08)' : 'rgba(160, 205, 255, 0.09)');
  haloGrad.addColorStop(1, 'transparent');

  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonRadius * 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Crescent Moon Shape
  ctx.fillStyle = isGold ? '#fff4d0' : '#f0f7ff';
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonRadius, -Math.PI * 0.45, Math.PI * 0.75, false);
  ctx.bezierCurveTo(
    moonX - moonRadius * 0.3,
    moonY + moonRadius * 0.5,
    moonX - moonRadius * 0.3,
    moonY - moonRadius * 0.4,
    moonX + moonRadius * Math.cos(-Math.PI * 0.45),
    moonY + moonRadius * Math.sin(-Math.PI * 0.45)
  );
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawExpansiveNightClouds(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  isGold: boolean
): void {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const cloudColor1 = isGold ? 'rgba(85, 60, 110, 0.10)' : 'rgba(35, 65, 125, 0.12)';
  const cloudColor2 = isGold ? 'rgba(135, 100, 45, 0.07)' : 'rgba(45, 95, 175, 0.08)';

  const cloudCount = 6;
  for (let i = 0; i < cloudCount; i++) {
    const drift = ((time * 10 + i * (width / cloudCount) * 1.2) % (width * 1.6)) - width * 0.3;
    const cy = height * (0.10 + (i % 3) * 0.12);
    const radX = width * (0.24 + hash(i * 11) * 0.18);
    const radY = height * (0.07 + hash(i * 17) * 0.05);

    const grad = ctx.createRadialGradient(drift, cy, radY * 0.1, drift, cy, radX);
    grad.addColorStop(0, i % 2 === 0 ? cloudColor1 : cloudColor2);
    grad.addColorStop(1, 'transparent');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(drift, cy, radX, radY, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawWideRooftopSearchlightBeacons(
  ctx: CanvasRenderingContext2D,
  beaconBuildings: Building[],
  width: number,
  height: number,
  horizonY: number,
  time: number,
  cycleRad: number,
  primaryColor: string,
  secondaryColor: string
): void {
  // Beacons sweep across the vast expansive sky from individual skyscraper spires.
  // CRITICAL CONSTRAINT: NO CENTRAL LASER COLUMN! Center sky remains open & clear.

  beaconBuildings.forEach((b, idx) => {
    const towerX = (b.x + b.width / 2) * width;
    const towerTopY = horizonY - b.height * height;
    const speed = b.beaconSpeed || 1.0;
    const arc = b.beaconArc || 0.65;
    const offset = b.beaconAngleOffset || 0;

    // Harmonic sweep angle (-PI/2 is straight up)
    // Left towers lean slightly rightwards; right towers lean slightly leftwards
    const baseTilt = (b.x - 0.5) * -0.55;
    const sweep = Math.sin(time * speed * 0.75 + offset) * arc;
    const beamAngle = -Math.PI / 2 + baseTilt + sweep;

    // Longer beam stretching high into the vast upper sky
    const beamLength = height * 1.45;
    const beamSpread = 0.055 + (idx % 2) * 0.02;

    const beamColor = idx % 2 === 0 ? primaryColor : secondaryColor;

    // 1. Volumetric Beam Cone
    const endX1 = towerX + Math.cos(beamAngle - beamSpread) * beamLength;
    const endY1 = towerTopY + Math.sin(beamAngle - beamSpread) * beamLength;
    const endX2 = towerX + Math.cos(beamAngle + beamSpread) * beamLength;
    const endY2 = towerTopY + Math.sin(beamAngle + beamSpread) * beamLength;

    const beamGrad = ctx.createLinearGradient(towerX, towerTopY, (endX1 + endX2) / 2, (endY1 + endY2) / 2);
    beamGrad.addColorStop(0, hexToRgba(beamColor, 0.90));
    beamGrad.addColorStop(0.15, hexToRgba(beamColor, 0.50));
    beamGrad.addColorStop(0.50, hexToRgba(beamColor, 0.20));
    beamGrad.addColorStop(0.85, hexToRgba(beamColor, 0.04));
    beamGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(towerX, towerTopY);
    ctx.lineTo(endX1, endY1);
    ctx.lineTo(endX2, endY2);
    ctx.closePath();
    ctx.fill();

    // 2. High-intensity Central Core Shaft
    const midX = towerX + Math.cos(beamAngle) * beamLength;
    const midY = towerTopY + Math.sin(beamAngle) * beamLength;

    ctx.strokeStyle = hexToRgba('#ffffff', 0.65);
    ctx.lineWidth = Math.max(1.2, width * 0.0014);
    ctx.beginPath();
    ctx.moveTo(towerX, towerTopY);
    ctx.lineTo(midX, midY);
    ctx.stroke();

    // 3. Searchlight Illumination Halo on High Clouds
    const spotDist = height * 0.95;
    const spotX = towerX + Math.cos(beamAngle) * spotDist;
    const spotY = towerTopY + Math.sin(beamAngle) * spotDist;
    if (spotY < height * 0.40) {
      const spotGrad = ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, width * 0.10);
      spotGrad.addColorStop(0, hexToRgba(beamColor, 0.24));
      spotGrad.addColorStop(0.45, hexToRgba(beamColor, 0.08));
      spotGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(spotX, spotY, width * 0.10, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Rooftop Lens Bulb Flare
    const flareGrad = ctx.createRadialGradient(towerX, towerTopY, 0, towerX, towerTopY, width * 0.025);
    flareGrad.addColorStop(0, '#ffffff');
    flareGrad.addColorStop(0.3, hexToRgba(beamColor, 0.85));
    flareGrad.addColorStop(0.7, hexToRgba(beamColor, 0.22));
    flareGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = flareGrad;
    ctx.beginPath();
    ctx.arc(towerX, towerTopY, width * 0.025, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawWideSkylineLayer(
  ctx: CanvasRenderingContext2D,
  buildings: Building[],
  width: number,
  height: number,
  horizonY: number,
  layer: number,
  time: number,
  isGold: boolean
): void {
  ctx.save();

  let baseFill = '#070b16';
  if (layer === 0) {
    baseFill = isGold ? '#0e0a16' : '#080d20';
  } else if (layer === 1) {
    baseFill = isGold ? '#090710' : '#040815';
  } else {
    baseFill = isGold ? '#050308' : '#02040c';
  }

  buildings.forEach((b, bIdx) => {
    const bx = b.x * width;
    const bw = b.width * width;
    const bh = b.height * height;
    const by = horizonY - bh;

    // 1. Draw Architectural Silhouette
    ctx.fillStyle = baseFill;
    ctx.beginPath();

    if (b.style === 'spire') {
      ctx.moveTo(bx, horizonY);
      ctx.lineTo(bx, by + bh * 0.16);
      ctx.lineTo(bx + bw * 0.20, by + bh * 0.10);
      ctx.lineTo(bx + bw * 0.45, by + bh * 0.04);
      ctx.lineTo(bx + bw * 0.50, by); // Spire peak
      ctx.lineTo(bx + bw * 0.55, by + bh * 0.04);
      ctx.lineTo(bx + bw * 0.80, by + bh * 0.10);
      ctx.lineTo(bx + bw, by + bh * 0.16);
      ctx.lineTo(bx + bw, horizonY);
    } else if (b.style === 'twin_spire') {
      // Modern twin-spire high-rise
      ctx.moveTo(bx, horizonY);
      ctx.lineTo(bx, by + bh * 0.12);
      ctx.lineTo(bx + bw * 0.25, by); // Left spire
      ctx.lineTo(bx + bw * 0.35, by + bh * 0.08);
      ctx.lineTo(bx + bw * 0.50, by + bh * 0.12);
      ctx.lineTo(bx + bw * 0.65, by + bh * 0.08);
      ctx.lineTo(bx + bw * 0.75, by); // Right spire
      ctx.lineTo(bx + bw, by + bh * 0.12);
      ctx.lineTo(bx + bw, horizonY);
    } else if (b.style === 'stepped') {
      // Art Deco stepped crown
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
      // Radio transmission needle
      ctx.rect(bx + bw * 0.47, by, bw * 0.06, bh * 0.07);
    } else {
      ctx.rect(bx, by, bw, bh);
    }

    ctx.closePath();
    ctx.fill();

    // 2. Subtle Architectural Edge Rim Lighting
    ctx.strokeStyle = layer === 0 ? 'rgba(56, 189, 248, 0.08)' : 'rgba(125, 211, 252, 0.16)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 3. Illuminated Office Windows (Layer 1 & Layer 2)
    if (layer >= 1) {
      drawWideWindowGrid(ctx, bx, by, bw, bh, b, time, bIdx, isGold);
    }
  });

  ctx.restore();
}

function drawWideWindowGrid(
  ctx: CanvasRenderingContext2D,
  bx: number,
  by: number,
  bw: number,
  bh: number,
  b: Building,
  time: number,
  buildingSeed: number,
  isGold: boolean
): void {
  const cols = b.windowCols || 5;
  const rows = b.windowRows || 18;

  const padX = bw * 0.10;
  const padY = bh * 0.08;
  const winW = ((bw - padX * 2) / cols) * 0.65;
  const winH = ((bh - padY * 2) / rows) * 0.55;
  const stepX = (bw - padX * 2) / cols;
  const stepY = (bh - padY * 2) / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const seed = buildingSeed * 997 + r * 31 + c * 7;
      const isLit = hash(seed) > 0.40;
      if (!isLit) continue;

      const wx = bx + padX + c * stepX;
      const wy = by + padY + r * stepY;

      const isWarm = hash(seed * 3) > 0.45;
      const flicker = 0.85 + 0.15 * Math.sin(time * 2.0 + hash(seed * 7) * 10);

      if (isWarm) {
        ctx.fillStyle = isGold
          ? `rgba(255, 215, 120, ${0.65 * flicker})`
          : `rgba(254, 240, 138, ${0.60 * flicker})`;
      } else {
        ctx.fillStyle = `rgba(186, 230, 253, ${0.70 * flicker})`;
      }

      ctx.fillRect(wx, wy, Math.max(1, winW), Math.max(1, winH));
    }
  }
}

function drawAviationWarningLights(
  ctx: CanvasRenderingContext2D,
  buildings: Building[],
  width: number,
  height: number,
  horizonY: number,
  time: number
): void {
  ctx.save();
  buildings.forEach((b, idx) => {
    if (b.height > 0.28) {
      const topX = (b.x + b.width / 2) * width;
      const topY = horizonY - b.height * height;

      // Red aircraft warning strobe (1.2 Hz pulse)
      const flash = Math.sin(time * 3.5 + idx * 1.7) > 0.4 ? 1.0 : 0.1;
      ctx.fillStyle = `rgba(239, 68, 68, ${flash})`;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = flash > 0.5 ? 6 : 0;
      ctx.beginPath();
      ctx.arc(topX, topY, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.restore();
}

function drawWideHighwayTrafficStreaks(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  horizonY: number,
  time: number,
  isGold: boolean
): void {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const bridgeY = horizonY - height * 0.025;
  const bridgeHeight = height * 0.015;

  // Bridge deck silhouette
  ctx.fillStyle = '#050812';
  ctx.fillRect(0, bridgeY, width, bridgeHeight);

  // Guardrail accent line
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.20)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, bridgeY);
  ctx.lineTo(width, bridgeY);
  ctx.stroke();

  // Traffic Light Trails (Long Exposure Streaks)
  // Lane 1: White/Golden Headlights moving Left to Right
  const headCount = 32;
  for (let i = 0; i < headCount; i++) {
    const streakLength = width * 0.065;
    const speed = width * 0.20;
    const hx = ((time * speed + i * (width / headCount)) % (width + streakLength * 2)) - streakLength;
    const hy = bridgeY + height * 0.005;

    const headGrad = ctx.createLinearGradient(hx - streakLength, hy, hx, hy);
    headGrad.addColorStop(0, 'transparent');
    headGrad.addColorStop(0.7, isGold ? 'rgba(255, 235, 175, 0.5)' : 'rgba(224, 242, 254, 0.55)');
    headGrad.addColorStop(1, '#ffffff');

    ctx.strokeStyle = headGrad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(hx - streakLength, hy);
    ctx.lineTo(hx, hy);
    ctx.stroke();
  }

  // Lane 2: Ruby Red Taillights moving Right to Left
  const tailCount = 30;
  for (let i = 0; i < tailCount; i++) {
    const streakLength = width * 0.055;
    const speed = width * 0.16;
    const tx = width - (((time * speed + i * (width / tailCount)) % (width + streakLength * 2)) - streakLength);
    const ty = bridgeY + height * 0.010;

    const tailGrad = ctx.createLinearGradient(tx + streakLength, ty, tx, ty);
    tailGrad.addColorStop(0, 'transparent');
    tailGrad.addColorStop(0.7, 'rgba(239, 68, 68, 0.55)');
    tailGrad.addColorStop(1, 'rgba(255, 90, 90, 0.90)');

    ctx.strokeStyle = tailGrad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(tx + streakLength, ty);
    ctx.lineTo(tx, ty);
    ctx.stroke();
  }

  ctx.restore();
}

function drawWideWaterfrontReflections(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  horizonY: number,
  time: number,
  primaryColor: string,
  secondaryColor: string,
  isGold: boolean
): void {
  ctx.save();
  const waterHeight = height - horizonY;
  
  // Water dark surface
  const waterGrad = ctx.createLinearGradient(0, horizonY, 0, height);
  waterGrad.addColorStop(0, isGold ? '#090710' : '#030713');
  waterGrad.addColorStop(0.5, isGold ? '#06040a' : '#02050e');
  waterGrad.addColorStop(1, '#010206');

  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, horizonY, width, waterHeight);

  // Dynamic Horizontal Ripple Highlights
  ctx.globalCompositeOperation = 'screen';
  const rippleRows = 24;

  for (let r = 0; r < rippleRows; r++) {
    const ry = horizonY + (r / rippleRows) * waterHeight;
    const rippleWidth = width * (0.035 + (r / rippleRows) * 0.06);
    const waveOffset = Math.sin(time * 2.2 + r * 0.45) * (width * 0.008);

    const reflectionXs = [0.04, 0.18, 0.62, 0.77];
    reflectionXs.forEach((rx, idx) => {
      const centerX = rx * width + waveOffset;
      const color = idx % 2 === 0 ? primaryColor : secondaryColor;
      const alpha = Math.max(0.02, (1 - r / rippleRows) * 0.20);

      const ripGrad = ctx.createLinearGradient(centerX - rippleWidth, ry, centerX + rippleWidth, ry);
      ripGrad.addColorStop(0, 'transparent');
      ripGrad.addColorStop(0.5, hexToRgba(color, alpha));
      ripGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = ripGrad;
      ctx.fillRect(centerX - rippleWidth, ry, rippleWidth * 2, 1.2 + (r / rippleRows) * 1.6);
    });
  }

  ctx.restore();
}

function drawAtmosphericCityFog(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  horizonY: number,
  fogColor: string
): void {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const fogGrad = ctx.createLinearGradient(0, horizonY - height * 0.10, 0, horizonY + height * 0.06);
  fogGrad.addColorStop(0, 'transparent');
  fogGrad.addColorStop(0.55, fogColor);
  fogGrad.addColorStop(1, 'transparent');

  ctx.fillStyle = fogGrad;
  ctx.fillRect(0, horizonY - height * 0.10, width, height * 0.16);
  ctx.restore();
}

function drawAtmosphericAirDust(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  isGold: boolean
): void {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  const dustCount = 45;
  for (let i = 0; i < dustCount; i++) {
    const dx = ((hash(i * 37.1) * width + time * 12 * (hash(i * 13) - 0.5)) % width + width) % width;
    const dy = ((hash(i * 53.7) * height + time * 18) % (height * 0.70));
    const size = 0.8 + hash(i * 7.9) * 1.8;
    const alpha = 0.12 + 0.22 * Math.sin(time * 1.4 + i);

    ctx.fillStyle = isGold
      ? `rgba(255, 230, 160, ${alpha})`
      : `rgba(186, 230, 253, ${alpha})`;

    ctx.beginPath();
    ctx.arc(dx, dy, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
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
