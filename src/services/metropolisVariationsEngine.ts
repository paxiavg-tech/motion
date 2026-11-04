/**
 * Metropolis Variations Engine
 * 
 * 6 Market-Driven Cinematic Urban Cityscape Motion Background Plates:
 * 1. metropolis_eco_smart_city       — The ESG & Eco-Smart City: Net-Zero Metropolis
 * 2. metropolis_fintech_bull_market  — Global FinTech & Bull Market Skyline
 * 3. metropolis_quiet_luxury_noir    — Quiet Luxury & Architectural Noir
 * 4. metropolis_golden_hour_dawn     — Golden Hour Dawn: "New Era" Sunrise Skyline
 * 5. metropolis_cyberpunk_synthwave  — Cyberpunk Synthwave / Neo-Tokyo Wet Asphalt
 * 6. metropolis_cosmic_orbital_harbor — Cosmic Orbital Harbor: Sci-Fi Space Metropolis
 * 
 * All variations feature:
 * - Wide panoramic landscape vista with low horizon (88% height), leaving ~60% expansive sky space
 * - NO countdown numbers or timer overlays (pure motion graphics background plates)
 * - NO central laser pillar (uncluttered copy space for corporate titles/logos)
 * - Seamless looping with high-performance Canvas 2D rendering
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

interface Building {
  x: number;
  width: number;
  height: number;
  layer: number; // 0 = far, 1 = mid, 2 = near
  style: 'box' | 'spire' | 'stepped' | 'diagonal' | 'antenna' | 'twin_spire' | 'dome' | 'terrace';
  windowCols: number;
  windowRows: number;
  hasBeacon?: boolean;
  beaconAngleOffset?: number;
  beaconSpeed?: number;
  beaconArc?: number;
}

// Sprawling panoramic skyline layout scaled for wide vista (~0.12 - 0.38 height)
function getBaseBuildings(): Building[] {
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

    // Layer 1 (Midground hero towers)
    { x: 0.04, width: 0.060, height: 0.27, layer: 1, style: 'spire', windowCols: 5, windowRows: 18, hasBeacon: true, beaconAngleOffset: 0.4, beaconSpeed: 0.85, beaconArc: 0.65 },
    { x: 0.11, width: 0.050, height: 0.21, layer: 1, style: 'box', windowCols: 4, windowRows: 14 },
    { x: 0.18, width: 0.065, height: 0.35, layer: 1, style: 'stepped', windowCols: 5, windowRows: 22, hasBeacon: true, beaconAngleOffset: 1.9, beaconSpeed: 0.75, beaconArc: 0.60 },
    { x: 0.26, width: 0.055, height: 0.24, layer: 1, style: 'diagonal', windowCols: 4, windowRows: 16 },
    { x: 0.33, width: 0.060, height: 0.29, layer: 1, style: 'box', windowCols: 5, windowRows: 18 },
    { x: 0.41, width: 0.055, height: 0.26, layer: 1, style: 'terrace', windowCols: 4, windowRows: 16 },
    { x: 0.48, width: 0.060, height: 0.25, layer: 1, style: 'stepped', windowCols: 5, windowRows: 15 },
    { x: 0.55, width: 0.050, height: 0.23, layer: 1, style: 'diagonal', windowCols: 4, windowRows: 14 },
    { x: 0.62, width: 0.065, height: 0.34, layer: 1, style: 'spire', windowCols: 5, windowRows: 21, hasBeacon: true, beaconAngleOffset: 3.3, beaconSpeed: 0.90, beaconArc: 0.70 },
    { x: 0.70, width: 0.055, height: 0.22, layer: 1, style: 'box', windowCols: 4, windowRows: 14 },
    { x: 0.77, width: 0.065, height: 0.36, layer: 1, style: 'antenna', windowCols: 5, windowRows: 23, hasBeacon: true, beaconAngleOffset: 4.8, beaconSpeed: 0.80, beaconArc: 0.65 },
    { x: 0.85, width: 0.055, height: 0.23, layer: 1, style: 'stepped', windowCols: 4, windowRows: 15 },
    { x: 0.91, width: 0.060, height: 0.20, layer: 1, style: 'box', windowCols: 4, windowRows: 13 },

    // Layer 2 (Waterfront pier blocks)
    { x: 0.00, width: 0.08, height: 0.14, layer: 2, style: 'box', windowCols: 6, windowRows: 8 },
    { x: 0.14, width: 0.09, height: 0.12, layer: 2, style: 'box', windowCols: 7, windowRows: 7 },
    { x: 0.29, width: 0.09, height: 0.13, layer: 2, style: 'box', windowCols: 7, windowRows: 8 },
    { x: 0.44, width: 0.08, height: 0.11, layer: 2, style: 'box', windowCols: 6, windowRows: 6 },
    { x: 0.58, width: 0.09, height: 0.12, layer: 2, style: 'box', windowCols: 7, windowRows: 7 },
    { x: 0.73, width: 0.08, height: 0.13, layer: 2, style: 'box', windowCols: 6, windowRows: 8 },
    { x: 0.86, width: 0.09, height: 0.14, layer: 2, style: 'box', windowCols: 7, windowRows: 8 },
  ];
}

const COMMON_BUILDINGS = getBaseBuildings();

// ============================================================================
// SHARED DRAWING PRIMITIVES
// ============================================================================

function drawSkylineBuildings(
  ctx: CanvasRenderingContext2D,
  buildings: Building[],
  width: number,
  height: number,
  horizonY: number,
  baseColor: string,
  windowColor: string,
  time: number,
  drawWindows: boolean = true,
  edgeGlowColor?: string
): void {
  ctx.save();

  buildings.forEach((b, idx) => {
    const bx = b.x * width;
    const bw = b.width * width;
    const bh = b.height * height;
    const by = horizonY - bh;

    // Building Main Shape
    ctx.fillStyle = baseColor;
    ctx.beginPath();

    if (b.style === 'spire') {
      ctx.moveTo(bx, horizonY);
      ctx.lineTo(bx, by + bh * 0.25);
      ctx.lineTo(bx + bw * 0.5, by);
      ctx.lineTo(bx + bw, by + bh * 0.25);
      ctx.lineTo(bx + bw, horizonY);
    } else if (b.style === 'stepped') {
      ctx.moveTo(bx, horizonY);
      ctx.lineTo(bx, by + bh * 0.4);
      ctx.lineTo(bx + bw * 0.15, by + bh * 0.4);
      ctx.lineTo(bx + bw * 0.15, by + bh * 0.15);
      ctx.lineTo(bx + bw * 0.35, by + bh * 0.15);
      ctx.lineTo(bx + bw * 0.35, by);
      ctx.lineTo(bx + bw * 0.65, by);
      ctx.lineTo(bx + bw * 0.65, by + bh * 0.15);
      ctx.lineTo(bx + bw * 0.85, by + bh * 0.15);
      ctx.lineTo(bx + bw * 0.85, by + bh * 0.4);
      ctx.lineTo(bx + bw, by + bh * 0.4);
      ctx.lineTo(bx + bw, horizonY);
    } else if (b.style === 'diagonal') {
      ctx.moveTo(bx, horizonY);
      ctx.lineTo(bx, by + bh * 0.2);
      ctx.lineTo(bx + bw * 0.85, by);
      ctx.lineTo(bx + bw, by + bh * 0.05);
      ctx.lineTo(bx + bw, horizonY);
    } else if (b.style === 'terrace') {
      ctx.moveTo(bx, horizonY);
      ctx.lineTo(bx, by + bh * 0.3);
      ctx.lineTo(bx + bw * 0.25, by + bh * 0.3);
      ctx.lineTo(bx + bw * 0.25, by);
      ctx.lineTo(bx + bw * 0.75, by);
      ctx.lineTo(bx + bw * 0.75, by + bh * 0.3);
      ctx.lineTo(bx + bw, by + bh * 0.3);
      ctx.lineTo(bx + bw, horizonY);
    } else {
      ctx.rect(bx, by, bw, bh);
    }
    ctx.closePath();
    ctx.fill();

    // Optional Edge Rim Highlight (e.g. for Quiet Luxury Noir)
    if (edgeGlowColor) {
      ctx.strokeStyle = edgeGlowColor;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Windows
    if (drawWindows) {
      const padX = bw * 0.10;
      const padY = bh * 0.08;
      const usableW = bw - padX * 2;
      const usableH = bh - padY * 2;
      const cellW = usableW / b.windowCols;
      const cellH = usableH / b.windowRows;
      const winW = Math.max(1, cellW * 0.55);
      const winH = Math.max(1.5, cellH * 0.65);

      ctx.fillStyle = windowColor;
      for (let r = 0; r < b.windowRows; r++) {
        for (let c = 0; c < b.windowCols; c++) {
          const winSeed = idx * 1000 + r * 37 + c;
          const isLit = hash(winSeed) > 0.42;
          if (!isLit) continue;

          const wx = bx + padX + c * cellW + (cellW - winW) / 2;
          const wy = by + padY + r * cellH + (cellH - winH) / 2;

          // Gentle flicker
          const flicker = 0.5 + 0.5 * Math.sin(time * 1.5 + winSeed * 10);
          ctx.globalAlpha = 0.35 + flicker * 0.45;
          ctx.fillRect(wx, wy, winW, winH);
        }
      }
      ctx.globalAlpha = 1.0;
    }

    // Aviation Warning Beacon Light on top of spires
    if (b.hasBeacon || b.style === 'spire' || b.style === 'antenna') {
      const beaconX = bx + bw * 0.5;
      const beaconY = by - 1;
      const flash = (Math.sin(time * 3.5 + idx * 2.1) > 0.4) ? 1.0 : 0.15;
      ctx.fillStyle = `rgba(239, 68, 68, ${flash * 0.85})`;
      ctx.beginPath();
      ctx.arc(beaconX, beaconY, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  ctx.restore();
}

function drawWaterReflections(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  horizonY: number,
  time: number,
  waterBaseColor: string,
  primaryColor: string,
  secondaryColor: string
): void {
  ctx.save();
  const waterHeight = height - horizonY;

  // Dark water gradient
  const waterGrad = ctx.createLinearGradient(0, horizonY, 0, height);
  waterGrad.addColorStop(0, waterBaseColor);
  waterGrad.addColorStop(0.5, '#05070f');
  waterGrad.addColorStop(1, '#010206');
  ctx.fillStyle = waterGrad;
  ctx.fillRect(0, horizonY, width, waterHeight);

  // Shimmering horizontal ripples
  ctx.globalCompositeOperation = 'screen';
  const rippleRows = 20;

  for (let r = 0; r < rippleRows; r++) {
    const ry = horizonY + (r / rippleRows) * waterHeight;
    const rippleWidth = width * (0.04 + (r / rippleRows) * 0.08);
    const waveOffset = Math.sin(time * 2.0 + r * 0.5) * (width * 0.006);

    const reflectionXs = [0.08, 0.22, 0.45, 0.65, 0.82];
    reflectionXs.forEach((rx, idx) => {
      const centerX = rx * width + waveOffset;
      const color = idx % 2 === 0 ? primaryColor : secondaryColor;
      const alpha = Math.max(0.03, (1 - r / rippleRows) * 0.22);

      const ripGrad = ctx.createLinearGradient(centerX - rippleWidth, ry, centerX + rippleWidth, ry);
      ripGrad.addColorStop(0, 'transparent');
      ripGrad.addColorStop(0.5, hexToRgba(color, alpha));
      ripGrad.addColorStop(1, 'transparent');

      ctx.fillStyle = ripGrad;
      ctx.fillRect(centerX - rippleWidth, ry, rippleWidth * 2, 1.2 + (r / rippleRows) * 1.5);
    });
  }

  ctx.restore();
}

function drawWaterfrontHighway(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  horizonY: number,
  time: number,
  headColor: string,
  tailColor: string
): void {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const bridgeY = horizonY - height * 0.022;

  // Bridge deck silhouette
  ctx.fillStyle = '#060814';
  ctx.fillRect(0, bridgeY, width, height * 0.014);

  // Headlights (Left to Right)
  const headCount = 28;
  for (let i = 0; i < headCount; i++) {
    const streakLength = width * 0.055;
    const speed = width * 0.18;
    const hx = ((time * speed + i * (width / headCount)) % (width + streakLength * 2)) - streakLength;
    const hy = bridgeY + height * 0.004;

    const grad = ctx.createLinearGradient(hx - streakLength, hy, hx, hy);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.7, headColor);
    grad.addColorStop(1, '#ffffff');

    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(hx - streakLength, hy);
    ctx.lineTo(hx, hy);
    ctx.stroke();
  }

  // Taillights (Right to Left)
  const tailCount = 26;
  for (let i = 0; i < tailCount; i++) {
    const streakLength = width * 0.048;
    const speed = width * 0.14;
    const tx = width - (((time * speed + i * (width / tailCount)) % (width + streakLength * 2)) - streakLength);
    const ty = bridgeY + height * 0.009;

    const grad = ctx.createLinearGradient(tx + streakLength, ty, tx, ty);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(0.7, tailColor);
    grad.addColorStop(1, '#ff8888');

    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(tx + streakLength, ty);
    ctx.lineTo(tx, ty);
    ctx.stroke();
  }

  ctx.restore();
}

// ============================================================================
// 1. ECO-SMART CITY: NET-ZERO METROPOLIS
// ============================================================================
export function drawEcoSmartCity(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Forest teal to deep night cyan
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#010c12');
  skyGrad.addColorStop(0.45, '#031f24');
  skyGrad.addColorStop(0.80, '#063435');
  skyGrad.addColorStop(1.0, '#0a423d');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft atmospheric bio-aurora in upper sky
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let a = 0; a < 2; a++) {
    const waveY = height * (0.22 + a * 0.15);
    const waveGrad = ctx.createLinearGradient(0, waveY - height * 0.12, 0, waveY + height * 0.12);
    waveGrad.addColorStop(0, 'transparent');
    waveGrad.addColorStop(0.5, a === 0 ? 'rgba(16, 185, 129, 0.10)' : 'rgba(45, 212, 191, 0.08)');
    waveGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = waveGrad;
    ctx.beginPath();
    ctx.moveTo(0, waveY);
    for (let x = 0; x <= width; x += width * 0.05) {
      const dy = Math.sin(x * 0.003 + time * 0.8 + a * 2) * (height * 0.04);
      ctx.lineTo(x, waveY + dy);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Celestial crescent moon with soft cyan-emerald corona halo
  ctx.save();
  const moonX = width * 0.84;
  const moonY = height * 0.22;
  const moonR = height * 0.038;

  const corona = ctx.createRadialGradient(moonX, moonY, moonR * 0.5, moonX, moonY, moonR * 2.8);
  corona.addColorStop(0, 'rgba(52, 211, 153, 0.18)');
  corona.addColorStop(0.6, 'rgba(16, 185, 129, 0.05)');
  corona.addColorStop(1, 'transparent');
  ctx.fillStyle = corona;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 2.8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#e6fffa';
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#010c12';
  ctx.beginPath();
  ctx.arc(moonX + moonR * 0.42, moonY - moonR * 0.22, moonR * 0.95, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Distant twinkling eco-stars
  ctx.save();
  ctx.fillStyle = 'rgba(209, 250, 229, 0.85)';
  for (let i = 0; i < 90; i++) {
    const sx = hash(i * 17.3) * width;
    const sy = hash(i * 31.7) * (horizonY * 0.75);
    const twinkle = 0.3 + 0.7 * Math.sin(time * 2.5 + i * 4);
    ctx.globalAlpha = twinkle * 0.8;
    ctx.fillRect(sx, sy, 1.2, 1.2);
  }
  ctx.restore();

  // Far Layer 0 Buildings (Dark forest silhouettes)
  drawSkylineBuildings(
    ctx,
    COMMON_BUILDINGS.filter(b => b.layer === 0),
    width,
    height,
    horizonY,
    '#05181b',
    'rgba(52, 211, 153, 0.3)',
    time,
    true
  );

  // Midground Layer 1 Buildings (Modern Eco-Glass Towers with Rooftop Wind Turbines)
  drawSkylineBuildings(
    ctx,
    COMMON_BUILDINGS.filter(b => b.layer === 1),
    width,
    height,
    horizonY,
    '#072426',
    'rgba(167, 243, 208, 0.65)',
    time,
    true
  );

  // Rooftop Spinning Wind Turbines on Selected Spire Towers
  ctx.save();
  const turbineTowers = [0.18, 0.62, 0.77];
  turbineTowers.forEach((txNorm, idx) => {
    const tx = txNorm * width;
    const ty = horizonY - height * 0.35;
    const mastH = height * 0.035;
    const rotorR = height * 0.022;

    // Mast
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(tx, ty - mastH);
    ctx.stroke();

    // 3 Spinning Blades
    const rotSpeed = 2.4 + idx * 0.3;
    const baseAngle = time * rotSpeed;
    const hubY = ty - mastH;

    ctx.strokeStyle = 'rgba(209, 250, 229, 0.9)';
    ctx.lineWidth = 1.4;
    for (let blade = 0; blade < 3; blade++) {
      const angle = baseAngle + blade * ((Math.PI * 2) / 3);
      const bx = tx + Math.cos(angle) * rotorR;
      const by = hubY + Math.sin(angle) * rotorR;
      ctx.beginPath();
      ctx.moveTo(tx, hubY);
      ctx.lineTo(bx, by);
      ctx.stroke();
    }
  });
  ctx.restore();

  // Foreground Layer 2 Buildings
  drawSkylineBuildings(
    ctx,
    COMMON_BUILDINGS.filter(b => b.layer === 2),
    width,
    height,
    horizonY,
    '#041416',
    'rgba(52, 211, 153, 0.45)',
    time,
    true
  );

  // Highway with Clean Electric Vehicle Traffic
  drawWaterfrontHighway(ctx, width, height, horizonY, time, 'rgba(52, 211, 153, 0.65)', 'rgba(16, 185, 129, 0.75)');

  // Water reflections with emerald glow
  drawWaterReflections(ctx, width, height, horizonY, time, '#020f12', '#10b981', '#34d399');

  // Rising Bioluminescent Bio-Spores & Energy Particles drifting into the vast sky
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const sporeCount = 95;
  for (let i = 0; i < sporeCount; i++) {
    const seed = i * 29.13;
    const initX = hash(seed) * width;
    const speed = 18 + hash(seed * 3) * 28;
    const py = ((horizonY + 20 - (time * speed + hash(seed * 7) * height)) % height + height) % height;
    const sway = Math.sin(time * 1.6 + i) * (width * 0.015);
    const px = (initX + sway + width) % width;
    const size = 1.2 + hash(seed * 5) * 2.2;
    const alpha = 0.25 + 0.55 * Math.sin(time * 2.0 + i);

    const sporeGrad = ctx.createRadialGradient(px, py, 0, px, py, size * 2.5);
    sporeGrad.addColorStop(0, `rgba(209, 250, 229, ${alpha})`);
    sporeGrad.addColorStop(0.5, `rgba(52, 211, 153, ${alpha * 0.5})`);
    sporeGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = sporeGrad;
    ctx.beginPath();
    ctx.arc(px, py, size * 2.5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ============================================================================
// 2. GLOBAL FINTECH BULL MARKET SKYLINE
// ============================================================================
export function drawFinTechBullMarket(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Royal financial midnight navy
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#010614');
  skyGrad.addColorStop(0.50, '#051336');
  skyGrad.addColorStop(0.85, '#091c49');
  skyGrad.addColorStop(1.0, '#0b245e');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Financial Constellation: Connected node plexus in upper sky (representing global capital network)
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const nodes = [
    { x: 0.15, y: 0.18 },
    { x: 0.28, y: 0.25 },
    { x: 0.38, y: 0.16 },
    { x: 0.52, y: 0.22 },
    { x: 0.68, y: 0.15 },
    { x: 0.80, y: 0.26 },
    { x: 0.88, y: 0.18 },
  ];

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.22)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  nodes.forEach((n, idx) => {
    const nx = n.x * width;
    const ny = n.y * height + Math.sin(time * 1.2 + idx) * (height * 0.012);
    if (idx === 0) ctx.moveTo(nx, ny);
    else ctx.lineTo(nx, ny);
  });
  ctx.stroke();

  // Nodes with pulse halos
  nodes.forEach((n, idx) => {
    const nx = n.x * width;
    const ny = n.y * height + Math.sin(time * 1.2 + idx) * (height * 0.012);
    const pulse = 0.5 + 0.5 * Math.sin(time * 3.0 + idx * 1.5);

    ctx.fillStyle = 'rgba(16, 185, 129, 0.9)';
    ctx.beginPath();
    ctx.arc(nx, ny, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(52, 211, 153, ${pulse * 0.4})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(nx, ny, 6 + pulse * 6, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();

  // Background Layer 0
  drawSkylineBuildings(
    ctx,
    COMMON_BUILDINGS.filter(b => b.layer === 0),
    width,
    height,
    horizonY,
    '#030d22',
    'rgba(56, 189, 248, 0.3)',
    time,
    true
  );

  // Midground Layer 1
  drawSkylineBuildings(
    ctx,
    COMMON_BUILDINGS.filter(b => b.layer === 1),
    width,
    height,
    horizonY,
    '#051538',
    'rgba(245, 158, 11, 0.75)',
    time,
    true
  );

  // Foreground Layer 2
  drawSkylineBuildings(
    ctx,
    COMMON_BUILDINGS.filter(b => b.layer === 2),
    width,
    height,
    horizonY,
    '#02091a',
    'rgba(56, 189, 248, 0.4)',
    time,
    true
  );

  // High-Frequency Financial Highway
  drawWaterfrontHighway(ctx, width, height, horizonY, time, 'rgba(245, 158, 11, 0.8)', 'rgba(16, 185, 129, 0.85)');

  // Water reflections with emerald-gold bull market highlights
  drawWaterReflections(ctx, width, height, horizonY, time, '#020716', '#10b981', '#f59e0b');

  // Vertical Bull Market Data Streams (Ascending vertical ticker particle pulses)
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const streamCount = 42;
  for (let i = 0; i < streamCount; i++) {
    const seed = i * 43.19;
    const sx = hash(seed) * width;
    const speed = 65 + hash(seed * 2) * 85;
    const length = height * (0.04 + hash(seed * 5) * 0.08);
    const sy = ((horizonY - (time * speed + hash(seed * 7) * height)) % height + height) % height;
    const isBullGreen = hash(seed * 9) > 0.35;
    const color = isBullGreen ? 'rgba(16, 185, 129, 0.85)' : 'rgba(56, 189, 248, 0.75)';

    const streamGrad = ctx.createLinearGradient(sx, sy, sx, sy + length);
    streamGrad.addColorStop(0, color);
    streamGrad.addColorStop(1, 'transparent');

    ctx.strokeStyle = streamGrad;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx, sy + length);
    ctx.stroke();

    // Bright tip
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sx, sy, 1.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ============================================================================
// 3. QUIET LUXURY & ARCHITECTURAL NOIR
// ============================================================================
export function drawQuietLuxuryNoir(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Ultra-clean deep obsidian to charcoal slate
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#020204');
  skyGrad.addColorStop(0.55, '#07080c');
  skyGrad.addColorStop(0.88, '#0f1118');
  skyGrad.addColorStop(1.0, '#151722');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Vast peaceful starlight (subtle & refined)
  ctx.save();
  ctx.fillStyle = '#f8fafc';
  for (let i = 0; i < 75; i++) {
    const sx = hash(i * 19.3) * width;
    const sy = hash(i * 37.1) * (horizonY * 0.70);
    const twinkle = 0.2 + 0.6 * Math.sin(time * 1.5 + i * 2);
    ctx.globalAlpha = twinkle * 0.6;
    ctx.fillRect(sx, sy, 1.1, 1.1);
  }
  ctx.restore();

  // Background Layer 0
  drawSkylineBuildings(
    ctx,
    COMMON_BUILDINGS.filter(b => b.layer === 0),
    width,
    height,
    horizonY,
    '#05060a',
    'rgba(241, 245, 249, 0.15)',
    time,
    true,
    'rgba(241, 245, 249, 0.08)' // Platinum rim
  );

  // Midground Layer 1 (With Razor-sharp Platinum Rim Lines & Champagne Warm Windows)
  drawSkylineBuildings(
    ctx,
    COMMON_BUILDINGS.filter(b => b.layer === 1),
    width,
    height,
    horizonY,
    '#090b12',
    'rgba(254, 243, 199, 0.65)', // Warm champagne penthouse windows
    time,
    true,
    'rgba(226, 232, 240, 0.28)' // Crisp platinum rim light
  );

  // Foreground Layer 2
  drawSkylineBuildings(
    ctx,
    COMMON_BUILDINGS.filter(b => b.layer === 2),
    width,
    height,
    horizonY,
    '#040508',
    'rgba(254, 243, 199, 0.35)',
    time,
    true,
    'rgba(226, 232, 240, 0.15)'
  );

  // Rolling Low-Altitude Volumetric Mist hovering at harbor waterline
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let m = 0; m < 2; m++) {
    const mistY = horizonY - height * (0.04 + m * 0.03);
    const mistGrad = ctx.createLinearGradient(0, mistY - height * 0.06, 0, mistY + height * 0.06);
    mistGrad.addColorStop(0, 'transparent');
    mistGrad.addColorStop(0.5, 'rgba(226, 232, 240, 0.06)');
    mistGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = mistGrad;
    ctx.fillRect(0, mistY - height * 0.06, width, height * 0.12);
  }
  ctx.restore();

  // Highway with minimalist platinum headlights and amber taillights
  drawWaterfrontHighway(ctx, width, height, horizonY, time, 'rgba(248, 250, 252, 0.55)', 'rgba(217, 119, 6, 0.55)');

  // Mirror-finish dark obsidian water reflections
  drawWaterReflections(ctx, width, height, horizonY, time, '#020306', '#e2e8f0', '#fef3c7');

  // Slow drifting champagne & platinum dust motes (ultra subtle, 40 motes floating with tranquility)
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const dustCount = 40;
  for (let i = 0; i < dustCount; i++) {
    const seed = i * 31.7;
    const dx = ((hash(seed) * width + Math.sin(time * 0.5 + i) * 30) % width + width) % width;
    const dy = ((hash(seed * 2) * height + time * 12) % (horizonY * 0.85));
    const size = 0.9 + hash(seed * 3) * 1.5;
    const alpha = 0.15 + 0.35 * Math.sin(time * 1.2 + i);

    ctx.fillStyle = i % 2 === 0 ? `rgba(254, 243, 199, ${alpha})` : `rgba(241, 245, 249, ${alpha})`;
    ctx.beginPath();
    ctx.arc(dx, dy, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ============================================================================
// 4. GOLDEN HOUR DAWN: NEW ERA SUNRISE SKYLINE
// ============================================================================
export function drawGoldenHourDawn(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Breathtaking Dawn Sunrise Sky Gradient (Violet -> Magenta-Coral -> Rich Amber -> Golden Sunrise)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#0d0826'); // Deep twilight violet at top
  skyGrad.addColorStop(0.35, '#251347');
  skyGrad.addColorStop(0.60, '#662249'); // Rich magenta coral
  skyGrad.addColorStop(0.82, '#c2410c'); // Warm amber
  skyGrad.addColorStop(0.95, '#f59e0b'); // Golden dawn
  skyGrad.addColorStop(1.0, '#fbbf24'); // Sun horizon blaze
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Radiant Sunrise Glow at Horizon (Sun breaking through behind central-east towers)
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const sunX = width * 0.60;
  const sunY = horizonY - height * 0.04;
  const sunRadius = height * 0.28;

  const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, sunRadius);
  sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.65)');
  sunGlow.addColorStop(0.3, 'rgba(245, 158, 11, 0.40)');
  sunGlow.addColorStop(0.7, 'rgba(225, 29, 72, 0.15)');
  sunGlow.addColorStop(1, 'transparent');

  ctx.fillStyle = sunGlow;
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Morning Star (Venus) shining bright in the violet upper sky
  ctx.save();
  const starX = width * 0.25;
  const starY = height * 0.16;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(starX, starY, 2.4, 0, Math.PI * 2);
  ctx.fill();

  // Cross flare
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(starX - 8, starY);
  ctx.lineTo(starX + 8, starY);
  ctx.moveTo(starX, starY - 8);
  ctx.lineTo(starX, starY + 8);
  ctx.stroke();
  ctx.restore();

  // Drifting Dawn Clouds catching warm underbelly light
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  for (let c = 0; c < 3; c++) {
    const cloudY = height * (0.28 + c * 0.12);
    const cloudX = ((time * 15 * (c + 1) + c * width * 0.35) % (width + width * 0.4)) - width * 0.2;
    const cloudW = width * 0.35;
    const cloudH = height * 0.05;

    const cGrad = ctx.createRadialGradient(cloudX, cloudY, 0, cloudX, cloudY, cloudW * 0.5);
    cGrad.addColorStop(0, 'rgba(251, 191, 36, 0.14)');
    cGrad.addColorStop(0.5, 'rgba(244, 63, 94, 0.08)');
    cGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = cGrad;
    ctx.beginPath();
    ctx.ellipse(cloudX, cloudY, cloudW * 0.5, cloudH, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Backlit Dark Silhouette Buildings against Dawn
  drawSkylineBuildings(
    ctx,
    COMMON_BUILDINGS.filter(b => b.layer === 0),
    width,
    height,
    horizonY,
    '#1a091e',
    'rgba(251, 191, 36, 0.4)',
    time,
    true
  );

  drawSkylineBuildings(
    ctx,
    COMMON_BUILDINGS.filter(b => b.layer === 1),
    width,
    height,
    horizonY,
    '#220b24',
    'rgba(254, 240, 138, 0.75)',
    time,
    true
  );

  drawSkylineBuildings(
    ctx,
    COMMON_BUILDINGS.filter(b => b.layer === 2),
    width,
    height,
    horizonY,
    '#140516',
    'rgba(251, 191, 36, 0.5)',
    time,
    true
  );

  // Highway with warm morning headlights
  drawWaterfrontHighway(ctx, width, height, horizonY, time, 'rgba(254, 240, 138, 0.85)', 'rgba(239, 68, 68, 0.75)');

  // Water reflections with golden sunrise specular path
  drawWaterReflections(ctx, width, height, horizonY, time, '#130414', '#fbbf24', '#f59e0b');

  // Rising Golden Solar Motes & Warm Morning Embers in atmospheric updrafts
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const emberCount = 85;
  for (let i = 0; i < emberCount; i++) {
    const seed = i * 27.89;
    const ex = hash(seed) * width + Math.sin(time * 1.4 + i) * (width * 0.015);
    const speed = 22 + hash(seed * 2) * 35;
    const ey = ((horizonY - (time * speed + hash(seed * 4) * height)) % height + height) % height;
    const size = 1.1 + hash(seed * 6) * 2.2;
    const alpha = 0.2 + 0.6 * Math.sin(time * 1.8 + i);

    ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
    ctx.beginPath();
    ctx.arc(ex, ey, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ============================================================================
// 5. CYBERPUNK SYNTHWAVE / NEO-TOKYO WET ASPHALT
// ============================================================================
export function drawCyberpunkSynthwave(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Cyber Noir Violet & Neon Fog
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#060112');
  skyGrad.addColorStop(0.50, '#15032b');
  skyGrad.addColorStop(0.85, '#2e0854');
  skyGrad.addColorStop(1.0, '#4a0e4e');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Neon Magenta / Cyan Atmospheric glow near horizon
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const fogGrad = ctx.createLinearGradient(0, horizonY - height * 0.20, 0, horizonY);
  fogGrad.addColorStop(0, 'transparent');
  fogGrad.addColorStop(0.5, 'rgba(244, 63, 94, 0.15)'); // Neon pink
  fogGrad.addColorStop(1, 'rgba(6, 182, 212, 0.20)'); // Cyan
  ctx.fillStyle = fogGrad;
  ctx.fillRect(0, horizonY - height * 0.20, width, height * 0.20);
  ctx.restore();

  // Background Layer 0
  drawSkylineBuildings(
    ctx,
    COMMON_BUILDINGS.filter(b => b.layer === 0),
    width,
    height,
    horizonY,
    '#0e021a',
    'rgba(6, 182, 212, 0.45)', // Cyan windows
    time,
    true
  );

  // Midground Layer 1
  drawSkylineBuildings(
    ctx,
    COMMON_BUILDINGS.filter(b => b.layer === 1),
    width,
    height,
    horizonY,
    '#1a042e',
    'rgba(244, 63, 94, 0.75)', // Hot pink windows
    time,
    true
  );

  // Holographic Neon Billboards / Cyber Vertical Barcodes on select towers
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const holoTowers = [0.11, 0.33, 0.70];
  holoTowers.forEach((hxNorm, idx) => {
    const hx = hxNorm * width;
    const hy = horizonY - height * 0.18;
    const hw = width * 0.035;
    const hh = height * 0.08;

    ctx.fillStyle = idx % 2 === 0 ? 'rgba(6, 182, 212, 0.18)' : 'rgba(244, 63, 94, 0.18)';
    ctx.fillRect(hx, hy, hw, hh);

    // Scanlines
    ctx.fillStyle = idx % 2 === 0 ? 'rgba(6, 182, 212, 0.75)' : 'rgba(244, 63, 94, 0.75)';
    for (let s = 0; s < 6; s++) {
      const sy = hy + s * (hh / 6) + ((time * 20) % (hh / 6));
      ctx.fillRect(hx + 2, sy, hw - 4, 1.5);
    }
  });
  ctx.restore();

  // Foreground Layer 2
  drawSkylineBuildings(
    ctx,
    COMMON_BUILDINGS.filter(b => b.layer === 2),
    width,
    height,
    horizonY,
    '#080112',
    'rgba(6, 182, 212, 0.55)',
    time,
    true
  );

  // Highway with electric cyan & hot pink speed streaks
  drawWaterfrontHighway(ctx, width, height, horizonY, time, 'rgba(6, 182, 212, 0.85)', 'rgba(244, 63, 94, 0.90)');

  // Wet Asphalt / Water reflections with intense neon bleeding
  drawWaterReflections(ctx, width, height, horizonY, time, '#04010a', '#f43f5e', '#06b6d4');

  // Vertical Digital Rain / Cyber Drizzle (Falling with subtle 7-degree tilt)
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const dropCount = 110;
  for (let i = 0; i < dropCount; i++) {
    const seed = i * 23.41;
    const rx = (hash(seed) * width + time * 35) % width;
    const speed = 280 + hash(seed * 3) * 160;
    const length = height * (0.02 + hash(seed * 5) * 0.035);
    const ry = ((time * speed + hash(seed * 7) * height) % height);
    const isCyan = hash(seed * 2) > 0.4;
    const color = isCyan ? 'rgba(6, 182, 212, 0.45)' : 'rgba(244, 63, 94, 0.40)';

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(rx, ry);
    ctx.lineTo(rx - length * 0.12, ry + length);
    ctx.stroke();
  }
  ctx.restore();
}

// ============================================================================
// 6. COSMIC ORBITAL HARBOR: SCI-FI SPACE METROPOLIS
// ============================================================================
export function drawCosmicOrbitalHarbor(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Deep Cosmic Void to Stellar Indigo
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#02010a');
  skyGrad.addColorStop(0.45, '#07041a');
  skyGrad.addColorStop(0.80, '#0d092d');
  skyGrad.addColorStop(1.0, '#150e42');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Vast Multi-Magnitude Cosmic Starfield (160 Stars)
  ctx.save();
  for (let i = 0; i < 160; i++) {
    const sx = hash(i * 13.7) * width;
    const sy = hash(i * 29.3) * (horizonY * 0.82);
    const twinkle = 0.3 + 0.7 * Math.sin(time * 2.0 + i * 3);
    const isBlue = hash(i * 5) > 0.6;
    ctx.fillStyle = isBlue ? 'rgba(199, 210, 254, 0.9)' : 'rgba(255, 255, 255, 0.85)';
    ctx.globalAlpha = twinkle;
    ctx.fillRect(sx, sy, 1.2, 1.2);
  }
  ctx.restore();

  // Cosmic Nebula Cloud (Soft Violet & Rose Stardust)
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const nebX = width * 0.40;
  const nebY = height * 0.24;
  const nebGrad = ctx.createRadialGradient(nebX, nebY, 0, nebX, nebY, width * 0.45);
  nebGrad.addColorStop(0, 'rgba(168, 85, 247, 0.14)');
  nebGrad.addColorStop(0.4, 'rgba(244, 63, 94, 0.08)');
  nebGrad.addColorStop(0.8, 'rgba(56, 189, 248, 0.04)');
  nebGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = nebGrad;
  ctx.beginPath();
  ctx.ellipse(nebX, nebY, width * 0.45, height * 0.20, -0.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Majestic Planetary Ring Arc Spanning Diagonally Across the Expansive Upper Sky
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const ringCenterX = width * 0.88;
  const ringCenterY = height * 0.75;
  const ringRadius = width * 0.62;

  for (let rBand = 0; rBand < 3; rBand++) {
    const rOffset = rBand * 9;
    const bandAlpha = (0.28 - rBand * 0.07);
    ctx.strokeStyle = `rgba(224, 231, 255, ${bandAlpha})`;
    ctx.lineWidth = 4.5 - rBand * 1.0;
    ctx.beginPath();
    ctx.arc(ringCenterX, ringCenterY, ringRadius + rOffset, Math.PI * 1.05, Math.PI * 1.48);
    ctx.stroke();
  }
  ctx.restore();

  // Background Layer 0
  drawSkylineBuildings(
    ctx,
    COMMON_BUILDINGS.filter(b => b.layer === 0),
    width,
    height,
    horizonY,
    '#050314',
    'rgba(199, 210, 254, 0.35)',
    time,
    true
  );

  // Midground Layer 1 with Space Elevator Tether & Orbital Transmission Spire
  drawSkylineBuildings(
    ctx,
    COMMON_BUILDINGS.filter(b => b.layer === 1),
    width,
    height,
    horizonY,
    '#0a0724',
    'rgba(199, 210, 254, 0.65)',
    time,
    true
  );

  // Space Elevator Cable reaching into the stars from the central spire
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const tetherX = width * 0.50;
  const tetherGrad = ctx.createLinearGradient(tetherX, 0, tetherX, horizonY);
  tetherGrad.addColorStop(0, 'rgba(199, 210, 254, 0.8)');
  tetherGrad.addColorStop(0.5, 'rgba(168, 85, 247, 0.4)');
  tetherGrad.addColorStop(1, 'rgba(56, 189, 248, 0.6)');
  ctx.strokeStyle = tetherGrad;
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(tetherX, 0);
  ctx.lineTo(tetherX, horizonY - height * 0.38);
  ctx.stroke();

  // Climber pod traveling along space elevator
  const climberY = ((time * 40) % (horizonY - height * 0.38));
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(tetherX, climberY, 2.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Foreground Layer 2
  drawSkylineBuildings(
    ctx,
    COMMON_BUILDINGS.filter(b => b.layer === 2),
    width,
    height,
    horizonY,
    '#04020e',
    'rgba(199, 210, 254, 0.45)',
    time,
    true
  );

  // Cosmic Highway with ion thruster streaks
  drawWaterfrontHighway(ctx, width, height, horizonY, time, 'rgba(199, 210, 254, 0.85)', 'rgba(168, 85, 247, 0.85)');

  // Water reflections of the planetary ring and futuristic city
  drawWaterReflections(ctx, width, height, horizonY, time, '#02010c', '#c084fc', '#60a5fa');

  // Drifting Zero-G Stardust & Cosmic Particle Specks
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const stardustCount = 80;
  for (let i = 0; i < stardustCount; i++) {
    const seed = i * 37.11;
    const px = ((hash(seed) * width + Math.sin(time * 0.8 + i) * 20) % width + width) % width;
    const py = ((hash(seed * 2) * height + time * 14) % (horizonY * 0.85));
    const size = 0.9 + hash(seed * 4) * 2.0;
    const alpha = 0.2 + 0.5 * Math.sin(time * 1.5 + i);

    ctx.fillStyle = i % 2 === 0 ? `rgba(199, 210, 254, ${alpha})` : `rgba(244, 114, 182, ${alpha})`;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
