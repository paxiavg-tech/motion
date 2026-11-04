/**
 * Silhouette Landscapes Engine
 * 
 * 10 Grounded, Realistic Silhouette Motion Background Plates:
 * 1. silhouette_alpine_winter_pines      — Alpine Winter Mountain Pines & Sleigh Horizon
 * 2. silhouette_cozy_rural_christmas_village — Cozy Rural Countryside Christmas Village
 * 3. silhouette_nordic_pine_forest_lake   — Nordic Pine Forest Lake & Starlight Reflection
 * 4. silhouette_waterfront_ferris_wheel   — Metropolitan Skyline & Waterfront Ferris Wheel Marina
 * 5. silhouette_mountain_sunset_highway   — Mountain Sunset Highway & Winding Alpine Road
 * 6. silhouette_bethlehem_nativity_star   — Christmas Nativity Bethlehem & Radiant Golden Star
 * 7. silhouette_autumn_harvest_windmill   — Autumn Rural Farmstead with Spinning Windmill
 * 8. silhouette_stag_mountain_aurora      — Majestic Forest Mountain Stag & Aurora Solstice
 * 9. silhouette_coastal_lighthouse_harbor — Coastal Lighthouse Harbor & Ocean Waves
 * 10. silhouette_ski_resort_alpine_village — Snowy Mountain Ski Village & Cableway Gondola
 * 
 * Features:
 * - 100% clean, natural, recognizable silhouettes (no weird geometric distortion).
 * - Low horizon (82% - 88%), providing ~60% expansive open sky for copy space.
 * - Gentle atmospheric particles (snowflakes, warm embers, falling leaves, stardust).
 * - NO countdown numbers or laser clutter (pure cinematic motion background plates).
 * - High-performance Canvas 2D math, zero garbage collection, seamless loop at 30 FPS.
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

// ============================================================================
// 1. ALPINE WINTER MOUNTAIN PINES & SLEIGH HORIZON
// ============================================================================
export function drawAlpineWinterPines(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Deep frosty cobalt to twilight blue
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#020714');
  skyGrad.addColorStop(0.5, '#061633');
  skyGrad.addColorStop(0.85, '#0d2856');
  skyGrad.addColorStop(1.0, '#153670');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Luminous Full Moon in Upper Sky
  ctx.save();
  const moonX = width * 0.76;
  const moonY = height * 0.22;
  const moonR = height * 0.055;

  const moonHalo = ctx.createRadialGradient(moonX, moonY, moonR * 0.5, moonX, moonY, moonR * 3.5);
  moonHalo.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
  moonHalo.addColorStop(0.4, 'rgba(219, 234, 254, 0.15)');
  moonHalo.addColorStop(1, 'transparent');
  ctx.fillStyle = moonHalo;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 3.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
  ctx.fill();

  // Santa Flying Sleigh Silhouette crossing the Full Moon
  const sleighT = (time * 0.12) % 1.0;
  const sleighX = (sleighT * (width + 200)) - 100;
  const sleighY = height * 0.20 + Math.sin(time * 2.0) * 8;

  ctx.fillStyle = '#0f172a';
  // Sleigh body
  ctx.beginPath();
  ctx.ellipse(sleighX, sleighY, 14, 6, -0.1, 0, Math.PI * 2);
  ctx.fill();
  // Santa sitting
  ctx.beginPath();
  ctx.arc(sleighX - 4, sleighY - 6, 4, 0, Math.PI * 2);
  ctx.fill();
  // Reindeer pair ahead
  for (let r = 1; r <= 3; r++) {
    const rx = sleighX + r * 22;
    const ry = sleighY + Math.sin(time * 3.0 + r) * 4;
    ctx.beginPath();
    ctx.ellipse(rx, ry, 7, 3, 0.1, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Distant Jagged Alpine Snow Peaks (Layer 0)
  ctx.save();
  ctx.fillStyle = '#061226';
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(0, height * 0.52);
  ctx.lineTo(width * 0.18, height * 0.42);
  ctx.lineTo(width * 0.35, height * 0.58);
  ctx.lineTo(width * 0.52, height * 0.38);
  ctx.lineTo(width * 0.68, height * 0.54);
  ctx.lineTo(width * 0.85, height * 0.44);
  ctx.lineTo(width, height * 0.50);
  ctx.lineTo(width, horizonY);
  ctx.closePath();
  ctx.fill();

  // Snow on Mountain Ridges
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Dense Pine Forest Ridge (Layer 1)
  ctx.fillStyle = '#040b18';
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  const treeCount = 45;
  for (let t = 0; t <= treeCount; t++) {
    const tx = (t / treeCount) * width;
    const th = height * (0.14 + hash(t * 19) * 0.10);
    const ty = horizonY - th;
    ctx.lineTo(tx - width * 0.012, horizonY);
    ctx.lineTo(tx, ty);
    ctx.lineTo(tx + width * 0.012, horizonY);
  }
  ctx.closePath();
  ctx.fill();

  // Snowy Ground
  ctx.fillStyle = '#02060e';
  ctx.fillRect(0, horizonY, width, height - horizonY);

  // Falling Snowflakes
  const snowCount = 120;
  for (let s = 0; s < snowCount; s++) {
    const seed = s * 31.7;
    const sx = (hash(seed) * width + Math.sin(time * 0.8 + s) * 20) % width;
    const speed = 25 + hash(seed * 3) * 35;
    const sy = (time * speed + hash(seed * 5) * height) % height;
    const size = 1.0 + hash(seed * 7) * 2.2;
    const alpha = 0.3 + 0.6 * Math.sin(time * 1.5 + s);

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ============================================================================
// 2. COZY RURAL COUNTRYSIDE CHRISTMAS VILLAGE
// ============================================================================
export function drawCozyRuralVillage(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Peaceful winter evening gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#040817');
  skyGrad.addColorStop(0.55, '#0b1938');
  skyGrad.addColorStop(0.85, '#192b52');
  skyGrad.addColorStop(1.0, '#2b3f6e');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Soft Stars
  ctx.save();
  ctx.fillStyle = '#ffffff';
  for (let s = 0; s < 90; s++) {
    const sx = hash(s * 17.3) * width;
    const sy = hash(s * 41.1) * (horizonY * 0.65);
    const twinkle = 0.3 + 0.7 * Math.sin(time * 2.0 + s * 2);
    ctx.globalAlpha = twinkle * 0.8;
    ctx.fillRect(sx, sy, 1.2, 1.2);
  }
  ctx.restore();

  ctx.save();
  // Rolling Snowy Hills (Layer 0)
  ctx.fillStyle = '#081226';
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.quadraticCurveTo(width * 0.3, horizonY - height * 0.12, width * 0.6, horizonY - height * 0.05);
  ctx.quadraticCurveTo(width * 0.85, horizonY - height * 0.15, width, horizonY - height * 0.08);
  ctx.lineTo(width, horizonY);
  ctx.fill();

  // Traditional Village Architecture (Houses with pitched roofs & church steeple)
  const houses = [
    { x: 0.12, w: 0.08, h: 0.12, roof: 'gable', hasChimney: true },
    { x: 0.24, w: 0.07, h: 0.10, roof: 'gable', hasChimney: true },
    { x: 0.38, w: 0.09, h: 0.28, roof: 'steeple', hasChimney: false }, // Church with tall steeple
    { x: 0.52, w: 0.08, h: 0.11, roof: 'gable', hasChimney: true },
    { x: 0.65, w: 0.09, h: 0.13, roof: 'gable', hasChimney: true },
    { x: 0.78, w: 0.07, h: 0.10, roof: 'gable', hasChimney: true },
    { x: 0.88, w: 0.08, h: 0.11, roof: 'gable', hasChimney: true },
  ];

  houses.forEach((h, idx) => {
    const hx = h.x * width;
    const hw = h.w * width;
    const hh = h.h * height;
    const hy = horizonY - hh;

    // Building silhouette
    ctx.fillStyle = '#050a17';
    ctx.beginPath();
    if (h.roof === 'steeple') {
      // Church body
      ctx.rect(hx - hw * 0.5, horizonY - height * 0.14, hw, height * 0.14);
      // Tall Steeple
      ctx.moveTo(hx - hw * 0.3, horizonY - height * 0.14);
      ctx.lineTo(hx, hy);
      ctx.lineTo(hx + hw * 0.3, horizonY - height * 0.14);
    } else {
      // Cottage base
      ctx.rect(hx - hw * 0.5, horizonY - hh * 0.6, hw, hh * 0.6);
      // Gabled roof
      ctx.moveTo(hx - hw * 0.55, horizonY - hh * 0.6);
      ctx.lineTo(hx, hy);
      ctx.lineTo(hx + hw * 0.55, horizonY - hh * 0.6);
    }
    ctx.fill();

    // Snow on roof
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Warm Amber Glowing Windows
    ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
    if (h.roof === 'steeple') {
      // Rose window / clock
      ctx.beginPath();
      ctx.arc(hx, horizonY - height * 0.11, 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(hx - hw * 0.3, horizonY - hh * 0.45, hw * 0.22, hh * 0.25);
      ctx.fillRect(hx + hw * 0.08, horizonY - hh * 0.45, hw * 0.22, hh * 0.25);
    }

    // Curling Chimney Smoke Plumes
    if (h.hasChimney) {
      const cx = hx + hw * 0.25;
      const cy = hy + 8;
      ctx.fillStyle = '#050a17';
      ctx.fillRect(cx - 3, cy, 6, 12);

      // Smoke puffs
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      for (let s = 0; s < 8; s++) {
        const sTime = time * 0.8 + s * 0.5;
        const sy = cy - ((sTime * 20) % (height * 0.20));
        const sx = cx + Math.sin(sTime * 1.5 + idx) * 12 + (sTime * 6);
        const sSize = 4 + (s * 1.8);
        const sAlpha = Math.max(0, 0.20 - (s / 8) * 0.20);

        ctx.fillStyle = `rgba(254, 240, 138, ${sAlpha})`;
        ctx.beginPath();
        ctx.arc(sx, sy, sSize, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  });

  // Frozen River Bridge in Foreground
  ctx.fillStyle = '#03060e';
  ctx.fillRect(0, horizonY, width, height - horizonY);

  // Soft Falling Snow
  for (let s = 0; s < 100; s++) {
    const seed = s * 23.4;
    const sx = (hash(seed) * width + Math.sin(time * 0.6 + s) * 18) % width;
    const speed = 20 + hash(seed * 2) * 30;
    const sy = (time * speed + hash(seed * 4) * height) % height;
    const size = 1.0 + hash(seed * 6) * 1.8;
    const alpha = 0.3 + 0.5 * Math.sin(time * 1.5 + s);

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// ============================================================================
// 3. NORDIC PINE FOREST LAKE & STARLIGHT REFLECTION
// ============================================================================
export function drawNordicForestLake(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.86;

  // Sky: Pure Scandinavian winter night (Deep indigo to twilight sapphire)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#01030a');
  skyGrad.addColorStop(0.5, '#040d21');
  skyGrad.addColorStop(0.85, '#091c3d');
  skyGrad.addColorStop(1.0, '#102d5c');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Guiding North Star (Polaris) in Upper Sky with Cross Glint
  ctx.save();
  const starX = width * 0.72;
  const starY = height * 0.18;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(starX, starY, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(starX - 12, starY);
  ctx.lineTo(starX + 12, starY);
  ctx.moveTo(starX, starY - 12);
  ctx.lineTo(starX, starY + 12);
  ctx.stroke();

  // Dense Pine Forest Silhouettes across Horizon
  ctx.fillStyle = '#050e1f';
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  const pines = 55;
  for (let p = 0; p <= pines; p++) {
    const px = (p / pines) * width;
    const ph = height * (0.12 + hash(p * 23) * 0.14);
    const py = horizonY - ph;
    ctx.lineTo(px - width * 0.01, horizonY);
    ctx.lineTo(px, py);
    ctx.lineTo(px + width * 0.01, horizonY);
  }
  ctx.closePath();
  ctx.fill();

  // Lake Shoreline Spit with Proud Antlered Stag Silhouette
  ctx.fillStyle = '#030814';
  ctx.beginPath();
  ctx.moveTo(width * 0.15, horizonY);
  ctx.quadraticCurveTo(width * 0.28, horizonY - height * 0.04, width * 0.42, horizonY);
  ctx.fill();

  // Majestic Antlered Stag Silhouette Standing by Lake Shore
  const stagX = width * 0.26;
  const stagY = horizonY - height * 0.038;
  ctx.fillStyle = '#02050e';
  // Stag Body
  ctx.beginPath();
  ctx.ellipse(stagX, stagY, 16, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  // Stag Legs
  ctx.fillRect(stagX - 10, stagY, 3, 16);
  ctx.fillRect(stagX - 5, stagY, 3, 16);
  ctx.fillRect(stagX + 5, stagY, 3, 16);
  ctx.fillRect(stagX + 9, stagY, 3, 16);
  // Neck & Head
  ctx.beginPath();
  ctx.moveTo(stagX + 10, stagY);
  ctx.lineTo(stagX + 16, stagY - 15);
  ctx.lineTo(stagX + 12, stagY - 18);
  ctx.lineTo(stagX + 8, stagY);
  ctx.fill();
  // Antlers
  ctx.strokeStyle = '#02050e';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(stagX + 14, stagY - 18);
  ctx.lineTo(stagX + 18, stagY - 28);
  ctx.lineTo(stagX + 22, stagY - 32);
  ctx.moveTo(stagX + 17, stagY - 24);
  ctx.lineTo(stagX + 12, stagY - 29);
  ctx.stroke();

  // Mirror Lake Water with Star & Forest Reflections
  const lakeGrad = ctx.createLinearGradient(0, horizonY, 0, height);
  lakeGrad.addColorStop(0, '#020713');
  lakeGrad.addColorStop(1, '#010308');
  ctx.fillStyle = lakeGrad;
  ctx.fillRect(0, horizonY, width, height - horizonY);

  // Subtle Star Reflection Shimmer on Lake
  ctx.globalCompositeOperation = 'screen';
  const ripY = horizonY + height * 0.05;
  const ripGrad = ctx.createRadialGradient(starX, ripY, 0, starX, ripY, 40);
  ripGrad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  ripGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = ripGrad;
  ctx.fillRect(starX - 40, ripY - 2, 80, 4);

  ctx.restore();
}

// ============================================================================
// 4. METROPOLITAN SKYLINE & WATERFRONT FERRIS WHEEL MARINA
// ============================================================================
export function drawFerrisWheelSkyline(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Deep midnight blue
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#02040f');
  skyGrad.addColorStop(0.5, '#071029');
  skyGrad.addColorStop(0.85, '#0e224d');
  skyGrad.addColorStop(1.0, '#152f66');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.save();

  // Distant Skyscraper Towers (Layer 0) on Left and Right
  const towers = [0.05, 0.12, 0.18, 0.25, 0.65, 0.72, 0.80, 0.88, 0.94];
  towers.forEach((txNorm, idx) => {
    const tx = txNorm * width;
    const tw = width * 0.05;
    const th = height * (0.22 + hash(idx * 13) * 0.14);
    const ty = horizonY - th;

    ctx.fillStyle = '#060d1f';
    ctx.fillRect(tx - tw * 0.5, ty, tw, th);

    // Cyan/Gold windows
    ctx.fillStyle = 'rgba(56, 189, 248, 0.55)';
    for (let r = 0; r < 12; r++) {
      if (hash(idx * 50 + r) > 0.45) {
        ctx.fillRect(tx - tw * 0.35, ty + r * (th / 12), tw * 0.7, 1.4);
      }
    }
  });

  // Center Waterfront Pier with Giant Rotating Ferris Wheel (London Eye / Marina style)
  const wheelX = width * 0.44;
  const wheelR = height * 0.18;
  const wheelY = horizonY - wheelR - 15;

  // A-Frame Support Leg Silhouettes
  ctx.strokeStyle = '#0a1633';
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(wheelX - 35, horizonY);
  ctx.lineTo(wheelX, wheelY);
  ctx.lineTo(wheelX + 35, horizonY);
  ctx.stroke();

  // Rotating Ferris Wheel Rings & Spokes
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.translate(wheelX, wheelY);
  ctx.rotate(time * 0.15); // Smooth continuous rotation

  // Outer & Inner Wheel Rings
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.75)'; // Golden festival illumination
  ctx.lineWidth = 2.0;
  ctx.beginPath();
  ctx.arc(0, 0, wheelR, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.65)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.arc(0, 0, wheelR * 0.75, 0, Math.PI * 2);
  ctx.stroke();

  // 16 Spokes & Gondola Pods
  const pods = 16;
  for (let p = 0; p < pods; p++) {
    const pAngle = (p / pods) * Math.PI * 2;
    const px = Math.cos(pAngle) * wheelR;
    const py = Math.sin(pAngle) * wheelR;

    // Spoke
    ctx.strokeStyle = 'rgba(254, 240, 138, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(px, py);
    ctx.stroke();

    // Gondola Pod (Illuminated Capsule)
    ctx.fillStyle = p % 2 === 0 ? '#fde047' : '#38bdf8';
    ctx.beginPath();
    ctx.arc(px, py, 3.2, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // Waterfront Highway with Vehicle Light Streaks
  const bridgeY = horizonY - height * 0.02;
  ctx.fillStyle = '#050a18';
  ctx.fillRect(0, bridgeY, width, height * 0.015);

  ctx.globalCompositeOperation = 'screen';
  for (let c = 0; c < 24; c++) {
    const cx = ((time * width * 0.18 + c * 45) % (width + 60)) - 30;
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(cx, bridgeY + 2, 25, 1.5);
  }

  // Harbor Water Reflecting Ferris Wheel & City Lights
  ctx.fillStyle = '#02050e';
  ctx.fillRect(0, horizonY, width, height - horizonY);

  const refGrad = ctx.createLinearGradient(wheelX - wheelR, horizonY, wheelX + wheelR, horizonY);
  refGrad.addColorStop(0, 'transparent');
  refGrad.addColorStop(0.5, 'rgba(254, 240, 138, 0.35)');
  refGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = refGrad;
  ctx.fillRect(wheelX - wheelR, horizonY, wheelR * 2, height * 0.08);

  ctx.restore();
}

// ============================================================================
// 5. MOUNTAIN SUNSET HIGHWAY & WINDING ALPINE ROAD
// ============================================================================
export function drawMountainSunsetHighway(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Inspiring sunset gradient (Violet to warm amber/coral)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#110c28');
  skyGrad.addColorStop(0.4, '#2d1544');
  skyGrad.addColorStop(0.7, '#6b264e');
  skyGrad.addColorStop(0.9, '#c04b32');
  skyGrad.addColorStop(1.0, '#f59e0b');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.save();

  // Layered Mountain Ridges (Back to Front)
  const ridges = [
    { fill: '#33122c', peakY: 0.48 },
    { fill: '#220b22', peakY: 0.58 },
    { fill: '#140618', peakY: 0.68 },
    { fill: '#0a030c', peakY: 0.78 },
  ];

  ridges.forEach((r, idx) => {
    ctx.fillStyle = r.fill;
    ctx.beginPath();
    ctx.moveTo(0, horizonY);
    ctx.lineTo(0, height * (r.peakY + 0.05));
    ctx.lineTo(width * (0.25 + idx * 0.1), height * r.peakY);
    ctx.lineTo(width * 0.55, height * (r.peakY + 0.08));
    ctx.lineTo(width * (0.8 + idx * 0.05), height * (r.peakY + 0.02));
    ctx.lineTo(width, height * (r.peakY + 0.06));
    ctx.lineTo(width, horizonY);
    ctx.closePath();
    ctx.fill();
  });

  // Serpentine Winding Mountain Highway snaking down the pass
  ctx.globalCompositeOperation = 'screen';
  const waypoints = [
    { x: 0.18, y: 0.62 },
    { x: 0.35, y: 0.68 },
    { x: 0.22, y: 0.74 },
    { x: 0.45, y: 0.80 },
    { x: 0.65, y: 0.84 },
    { x: 0.85, y: 0.88 },
  ];

  // Moving Headlights snaking along waypoints
  const carCount = 18;
  for (let c = 0; c < carCount; c++) {
    const tNorm = ((time * 0.15 + c / carCount) % 1.0);
    // Interpolate along waypoints
    const segment = Math.floor(tNorm * (waypoints.length - 1));
    const subT = (tNorm * (waypoints.length - 1)) - segment;
    const p1 = waypoints[segment];
    const p2 = waypoints[segment + 1] || waypoints[segment];

    const cx = (p1.x + (p2.x - p1.x) * subT) * width;
    const cy = (p1.y + (p2.y - p1.y) * subT) * height;

    ctx.fillStyle = c % 2 === 0 ? 'rgba(254, 240, 138, 0.9)' : 'rgba(239, 68, 68, 0.85)';
    ctx.beginPath();
    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Floating Golden Sunset Dust in Evening Breeze
  for (let d = 0; d < 40; d++) {
    const seed = d * 19.3;
    const dx = (hash(seed) * width + time * 20) % width;
    const dy = (hash(seed * 2) * height * 0.65 + time * 10) % (horizonY * 0.85);
    const size = 1.0 + hash(seed * 5) * 1.8;
    const alpha = 0.2 + 0.5 * Math.sin(time * 1.5 + d);

    ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
    ctx.beginPath();
    ctx.arc(dx, dy, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

// ============================================================================
// 6. CHRISTMAS NATIVITY BETHLEHEM & RADIANT GOLDEN STAR
// ============================================================================
export function drawBethlehemNativityStar(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Sacred holy night deep indigo to midnight violet
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#02040d');
  skyGrad.addColorStop(0.5, '#080d26');
  skyGrad.addColorStop(0.85, '#141844');
  skyGrad.addColorStop(1.0, '#242057');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  // Radiant Star of Bethlehem (Epiphany Star) in Center Sky
  const starX = width * 0.50;
  const starY = height * 0.22;
  const pulse = 0.8 + 0.2 * Math.sin(time * 2.0);

  // Vertical Golden Light Shaft illuminating the valley below
  const shaftGrad = ctx.createLinearGradient(starX, starY, starX, horizonY);
  shaftGrad.addColorStop(0, 'rgba(254, 240, 138, 0.75)');
  shaftGrad.addColorStop(0.4, 'rgba(245, 158, 11, 0.25)');
  shaftGrad.addColorStop(1, 'transparent');

  ctx.fillStyle = shaftGrad;
  ctx.beginPath();
  ctx.moveTo(starX - 8, starY);
  ctx.lineTo(starX - 45, horizonY);
  ctx.lineTo(starX + 45, horizonY);
  ctx.lineTo(starX + 8, starY);
  ctx.closePath();
  ctx.fill();

  // Multi-pointed Radiant Star Core
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(starX, starY, 4 * pulse, 0, Math.PI * 2);
  ctx.fill();

  // Long Golden Cross Beams
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.9)';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(starX - 35 * pulse, starY);
  ctx.lineTo(starX + 35 * pulse, starY);
  ctx.moveTo(starX, starY - 50 * pulse);
  ctx.lineTo(starX, starY + 50 * pulse);
  // Diagonal rays
  ctx.moveTo(starX - 20 * pulse, starY - 20 * pulse);
  ctx.lineTo(starX + 20 * pulse, starY + 20 * pulse);
  ctx.moveTo(starX + 20 * pulse, starY - 20 * pulse);
  ctx.lineTo(starX - 20 * pulse, starY + 20 * pulse);
  ctx.stroke();

  ctx.restore();

  // Ancient Bethlehem Rolling Hills (Layer 0)
  ctx.fillStyle = '#06091a';
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.quadraticCurveTo(width * 0.25, horizonY - height * 0.08, width * 0.5, horizonY - height * 0.04);
  ctx.quadraticCurveTo(width * 0.75, horizonY - height * 0.10, width, horizonY - height * 0.06);
  ctx.lineTo(width, horizonY);
  ctx.fill();

  // Date Palm Tree Silhouettes on Left & Right Ridges
  [0.15, 0.85].forEach((pxNorm) => {
    const px = pxNorm * width;
    const py = horizonY - height * 0.05;

    // Curved trunk
    ctx.strokeStyle = '#03050e';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.quadraticCurveTo(px + 8, py - height * 0.08, px + 5, py - height * 0.16);
    ctx.stroke();

    // Palm fronds
    ctx.lineWidth = 2;
    const topX = px + 5;
    const topY = py - height * 0.16;
    for (let f = 0; f < 6; f++) {
      const fAngle = (f / 6) * Math.PI + Math.PI;
      ctx.beginPath();
      ctx.moveTo(topX, topY);
      ctx.quadraticCurveTo(topX + Math.cos(fAngle) * 20, topY + Math.sin(fAngle) * 15, topX + Math.cos(fAngle) * 35, topY + 15);
      ctx.stroke();
    }
  });

  // Holy Stable Silhouette beneath Star Light
  ctx.fillStyle = '#020308';
  const stableX = width * 0.50;
  const stableY = horizonY - height * 0.04;
  // Wooden shelter
  ctx.beginPath();
  ctx.moveTo(stableX - 25, stableY);
  ctx.lineTo(stableX, stableY - 22);
  ctx.lineTo(stableX + 25, stableY);
  ctx.fill();

  // Warm candlelight in manger
  ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
  ctx.beginPath();
  ctx.arc(stableX, stableY - 6, 3, 0, Math.PI * 2);
  ctx.fill();

  // Ground
  ctx.fillStyle = '#010206';
  ctx.fillRect(0, horizonY, width, height - horizonY);
}

// ============================================================================
// 7. AUTUMN RURAL FARMSTEAD WITH SPINNING WINDMILL
// ============================================================================
export function drawAutumnHarvestWindmill(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Warm harvest dusk gradient (Deep amber to rich terracotta)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#1c0a06');
  skyGrad.addColorStop(0.4, '#45170d');
  skyGrad.addColorStop(0.75, '#8c2d15');
  skyGrad.addColorStop(0.95, '#d97706');
  skyGrad.addColorStop(1.0, '#f59e0b');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.save();

  // Rolling Farm Pasture Ridge (Layer 0)
  ctx.fillStyle = '#170603';
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.quadraticCurveTo(width * 0.35, horizonY - height * 0.08, width * 0.65, horizonY - height * 0.04);
  ctx.quadraticCurveTo(width * 0.85, horizonY - height * 0.09, width, horizonY - height * 0.06);
  ctx.lineTo(width, horizonY);
  ctx.fill();

  // Rustic Wooden Barn Silhouette on Left
  const barnX = width * 0.22;
  const barnY = horizonY - height * 0.08;
  const barnW = width * 0.12;
  const barnH = height * 0.10;

  ctx.fillStyle = '#0a0201';
  ctx.beginPath();
  ctx.rect(barnX - barnW * 0.5, barnY - barnH * 0.6, barnW, barnH * 0.6);
  // Gambrel roof
  ctx.moveTo(barnX - barnW * 0.55, barnY - barnH * 0.6);
  ctx.lineTo(barnX - barnW * 0.35, barnY - barnH);
  ctx.lineTo(barnX + barnW * 0.35, barnY - barnH);
  ctx.lineTo(barnX + barnW * 0.55, barnY - barnH * 0.6);
  ctx.fill();

  // Traditional Dutch / Rural Windmill on Right Ridge
  const millX = width * 0.74;
  const millY = horizonY - height * 0.06;
  const millH = height * 0.22;
  const millTopY = millY - millH;

  // Windmill Tower body
  ctx.fillStyle = '#0a0201';
  ctx.beginPath();
  ctx.moveTo(millX - 22, millY);
  ctx.lineTo(millX - 12, millTopY);
  ctx.lineTo(millX + 12, millTopY);
  ctx.lineTo(millX + 22, millY);
  ctx.closePath();
  ctx.fill();

  // Rotating 4 Windmill Blades
  ctx.save();
  ctx.translate(millX, millTopY + 8);
  ctx.rotate(time * 0.4); // Smooth gentle turning

  ctx.strokeStyle = '#050100';
  ctx.lineWidth = 3;
  const bladeLen = height * 0.15;
  for (let b = 0; b < 4; b++) {
    const bAngle = (b / 4) * Math.PI * 2;
    const bx = Math.cos(bAngle) * bladeLen;
    const by = Math.sin(bAngle) * bladeLen;

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(bx, by);
    ctx.stroke();

    // Lattice sail grid
    ctx.fillStyle = 'rgba(217, 119, 6, 0.45)';
    ctx.fillRect(bx * 0.3, by * 0.3, 15, 6);
  }
  ctx.restore();

  // Drifting Autumn Leaves & Warm Harvest Embers
  ctx.globalCompositeOperation = 'screen';
  for (let l = 0; l < 45; l++) {
    const seed = l * 29.7;
    const lx = (hash(seed) * width + time * 35) % width;
    const ly = (hash(seed * 3) * height + Math.sin(time * 1.5 + l) * 20) % (horizonY * 0.95);
    const rot = time * 2.0 + l;

    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(rot);
    ctx.fillStyle = l % 2 === 0 ? 'rgba(245, 158, 11, 0.75)' : 'rgba(239, 68, 68, 0.65)';
    ctx.beginPath();
    ctx.ellipse(0, 0, 4.5, 2.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // Dark ground
  ctx.fillStyle = '#050100';
  ctx.fillRect(0, horizonY, width, height - horizonY);

  ctx.restore();
}

// ============================================================================
// 8. MAJESTIC FOREST MOUNTAIN STAG & AURORA SOLSTICE
// ============================================================================
export function drawStagMountainAurora(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Arctic Night Black to Deep Midnight
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#01030a');
  skyGrad.addColorStop(0.5, '#040d1e');
  skyGrad.addColorStop(0.85, '#081a38');
  skyGrad.addColorStop(1.0, '#0d274f');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  // Waving Aurora Borealis Curtains across Vast Sky
  for (let a = 0; a < 3; a++) {
    const aY = height * (0.20 + a * 0.12);
    const aGrad = ctx.createLinearGradient(0, aY - height * 0.12, 0, aY + height * 0.12);
    aGrad.addColorStop(0, 'transparent');
    aGrad.addColorStop(0.5, a === 1 ? 'rgba(236, 72, 153, 0.22)' : 'rgba(34, 197, 94, 0.28)');
    aGrad.addColorStop(1, 'transparent');

    ctx.fillStyle = aGrad;
    ctx.beginPath();
    ctx.moveTo(0, aY);
    for (let x = 0; x <= width; x += width * 0.04) {
      const dy = Math.sin(x * 0.003 + time * 0.7 + a * 2.1) * (height * 0.06);
      ctx.lineTo(x, aY + dy);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Mountain Cliffs on Left with Noble Antlered Stag on Cliff Peak
  ctx.fillStyle = '#040916';
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(0, height * 0.55);
  ctx.lineTo(width * 0.25, height * 0.62);
  ctx.lineTo(width * 0.45, horizonY);
  ctx.fill();

  // Proud Antlered Stag on Outcrop
  const stagX = width * 0.20;
  const stagY = height * 0.58;
  ctx.fillStyle = '#02050e';
  // Stag Body
  ctx.beginPath();
  ctx.ellipse(stagX, stagY, 18, 10, 0, 0, Math.PI * 2);
  ctx.fill();
  // Stag Legs
  ctx.fillRect(stagX - 12, stagY, 3, 18);
  ctx.fillRect(stagX - 6, stagY, 3, 18);
  ctx.fillRect(stagX + 6, stagY, 3, 18);
  ctx.fillRect(stagX + 11, stagY, 3, 18);
  // Neck & Head
  ctx.beginPath();
  ctx.moveTo(stagX + 12, stagY);
  ctx.lineTo(stagX + 18, stagY - 18);
  ctx.lineTo(stagX + 14, stagY - 22);
  ctx.lineTo(stagX + 9, stagY);
  ctx.fill();
  // Antlers
  ctx.strokeStyle = '#02050e';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(stagX + 16, stagY - 22);
  ctx.lineTo(stagX + 22, stagY - 35);
  ctx.lineTo(stagX + 28, stagY - 40);
  ctx.moveTo(stagX + 20, stagY - 30);
  ctx.lineTo(stagX + 15, stagY - 36);
  ctx.stroke();

  // Valley Forest Ridge on Right
  ctx.fillStyle = '#030713';
  ctx.beginPath();
  ctx.moveTo(width * 0.35, horizonY);
  for (let p = 0; p < 30; p++) {
    const px = width * 0.35 + (p / 30) * (width * 0.65);
    const ph = height * (0.08 + hash(p * 17) * 0.10);
    ctx.lineTo(px, horizonY - ph);
  }
  ctx.lineTo(width, horizonY);
  ctx.fill();

  // Valley base
  ctx.fillStyle = '#010308';
  ctx.fillRect(0, horizonY, width, height - horizonY);
}

// ============================================================================
// 9. COASTAL LIGHTHOUSE HARBOR & OCEAN WAVES
// ============================================================================
export function drawCoastalLighthouseHarbor(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.86;

  // Sky: Coastal maritime night (Deep navy to ocean blue)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#010512');
  skyGrad.addColorStop(0.5, '#040e26');
  skyGrad.addColorStop(0.85, '#0a1d47');
  skyGrad.addColorStop(1.0, '#122c63');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.save();

  // Traditional Stone Lighthouse on Left Headland
  const lightX = width * 0.22;
  const lightY = horizonY - height * 0.08;
  const lightH = height * 0.28;
  const lightTopY = lightY - lightH;

  // Rocky Headland Bluff
  ctx.fillStyle = '#040916';
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(0, horizonY - height * 0.14);
  ctx.quadraticCurveTo(width * 0.18, horizonY - height * 0.12, width * 0.32, horizonY);
  ctx.fill();

  // Rotating 360-Degree Volumetric Light Beam
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const beamAngle = time * 0.75;
  const beamLen = width * 0.95;
  const beamSpread = 0.22;

  const bx1 = lightX + Math.cos(beamAngle - beamSpread) * beamLen;
  const by1 = lightTopY + Math.sin(beamAngle - beamSpread) * (beamLen * 0.35);
  const bx2 = lightX + Math.cos(beamAngle + beamSpread) * beamLen;
  const by2 = lightTopY + Math.sin(beamAngle + beamSpread) * (beamLen * 0.35);

  const beamGrad = ctx.createLinearGradient(lightX, lightTopY, (bx1 + bx2) / 2, (by1 + by2) / 2);
  beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.95)');
  beamGrad.addColorStop(0.2, 'rgba(254, 240, 138, 0.45)');
  beamGrad.addColorStop(0.7, 'rgba(254, 240, 138, 0.08)');
  beamGrad.addColorStop(1, 'transparent');

  ctx.fillStyle = beamGrad;
  ctx.beginPath();
  ctx.moveTo(lightX, lightTopY);
  ctx.lineTo(bx1, by1);
  ctx.lineTo(bx2, by2);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // Lighthouse Tower Silhouette
  ctx.fillStyle = '#02050e';
  ctx.beginPath();
  ctx.moveTo(lightX - 16, lightY);
  ctx.lineTo(lightX - 9, lightTopY);
  ctx.lineTo(lightX + 9, lightTopY);
  ctx.lineTo(lightX + 16, lightY);
  ctx.closePath();
  ctx.fill();

  // Lantern Gallery Room & Cupola
  ctx.fillStyle = '#fde047'; // Bright beacon room
  ctx.fillRect(lightX - 8, lightTopY - 12, 16, 12);
  ctx.fillStyle = '#02050e';
  ctx.beginPath();
  ctx.arc(lightX, lightTopY - 12, 9, Math.PI, 0); // Dome roof
  ctx.fill();

  // Distant Anchored Sailboat Silhouette on Right Horizon
  const boatX = width * 0.75;
  const boatY = horizonY - 4;
  ctx.fillStyle = '#040a18';
  ctx.beginPath();
  ctx.ellipse(boatX, boatY, 14, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // Mast & Sails
  ctx.strokeStyle = '#040a18';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(boatX, boatY);
  ctx.lineTo(boatX, boatY - 22);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(boatX, boatY - 20);
  ctx.lineTo(boatX + 12, boatY - 4);
  ctx.lineTo(boatX, boatY - 4);
  ctx.fill();

  // Ocean Sea Surface with Crashing Foam Waves
  const seaGrad = ctx.createLinearGradient(0, horizonY, 0, height);
  seaGrad.addColorStop(0, '#020817');
  seaGrad.addColorStop(1, '#01030a');
  ctx.fillStyle = seaGrad;
  ctx.fillRect(0, horizonY, width, height - horizonY);

  // Sea wave crests
  ctx.strokeStyle = 'rgba(186, 230, 253, 0.45)';
  ctx.lineWidth = 1.4;
  for (let w = 0; w < 6; w++) {
    const wy = horizonY + (w + 1) * (height * 0.022);
    ctx.beginPath();
    ctx.moveTo(0, wy);
    for (let x = 0; x <= width; x += 40) {
      const dy = Math.sin(x * 0.02 + time * 2.0 + w) * 3;
      ctx.lineTo(x, wy + dy);
    }
    ctx.stroke();
  }

  ctx.restore();
}

// ============================================================================
// 10. SNOWY MOUNTAIN SKI VILLAGE & CABLEWAY GONDOLA
// ============================================================================
export function drawSkiResortAlpineVillage(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
): void {
  const horizonY = height * 0.88;

  // Sky: Alpine winter twilight (Deep cobalt to frosty twilight)
  const skyGrad = ctx.createLinearGradient(0, 0, 0, horizonY);
  skyGrad.addColorStop(0, '#03081a');
  skyGrad.addColorStop(0.5, '#09193d');
  skyGrad.addColorStop(0.85, '#122e66');
  skyGrad.addColorStop(1.0, '#1c428a');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  ctx.save();

  // Towering Snow-Capped Alpine Mountain Peaks (Layer 0)
  ctx.fillStyle = '#081636';
  ctx.beginPath();
  ctx.moveTo(0, horizonY);
  ctx.lineTo(0, height * 0.42);
  ctx.lineTo(width * 0.22, height * 0.32);
  ctx.lineTo(width * 0.45, height * 0.52);
  ctx.lineTo(width * 0.68, height * 0.28);
  ctx.lineTo(width * 0.88, height * 0.48);
  ctx.lineTo(width, height * 0.38);
  ctx.lineTo(width, horizonY);
  ctx.closePath();
  ctx.fill();

  // Snow on Mountain Ridges
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Cableway Overhead Cables spanning across mountain pass
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.2;
  const cableY1 = height * 0.38;
  const cableY2 = height * 0.48;
  ctx.beginPath();
  ctx.moveTo(0, cableY1);
  ctx.quadraticCurveTo(width * 0.5, height * 0.54, width, cableY2);
  ctx.stroke();

  // Moving Ski Gondola Cabin
  const gondolaT = ((time * 0.12) % 1.0);
  const gx = gondolaT * width;
  const gy = height * (0.38 + Math.sin(gondolaT * Math.PI) * 0.12);

  ctx.fillStyle = '#f59e0b'; // Amber warm illuminated cabin
  ctx.fillRect(gx - 5, gy, 10, 7);
  ctx.strokeStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(gx, gy - 5);
  ctx.lineTo(gx, gy);
  ctx.stroke();

  // Alpine Chalet Village at Valley Base
  const chalets = [0.12, 0.26, 0.42, 0.58, 0.74, 0.88];
  chalets.forEach((cxNorm, idx) => {
    const cx = cxNorm * width;
    const cw = width * 0.065;
    const ch = height * 0.09;
    const cy = horizonY - ch;

    // Chalet body
    ctx.fillStyle = '#040b1a';
    ctx.fillRect(cx - cw * 0.5, cy + ch * 0.3, cw, ch * 0.7);
    // Gabled roof
    ctx.beginPath();
    ctx.moveTo(cx - cw * 0.6, cy + ch * 0.3);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx + cw * 0.6, cy + ch * 0.3);
    ctx.fill();

    // Snow on roof
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    // Warm glowing windows
    ctx.fillStyle = 'rgba(254, 240, 138, 0.85)';
    ctx.fillRect(cx - cw * 0.25, cy + ch * 0.45, cw * 0.2, ch * 0.25);
    ctx.fillRect(cx + cw * 0.05, cy + ch * 0.45, cw * 0.2, ch * 0.25);
  });

  // Snowy Ground
  ctx.fillStyle = '#02050e';
  ctx.fillRect(0, horizonY, width, height - horizonY);

  // Soft Alpine Snowfall
  for (let s = 0; s < 110; s++) {
    const seed = s * 37.1;
    const sx = (hash(seed) * width + Math.sin(time * 0.8 + s) * 20) % width;
    const speed = 25 + hash(seed * 2) * 35;
    const sy = (time * speed + hash(seed * 4) * height) % height;
    const size = 1.0 + hash(seed * 6) * 2.0;
    const alpha = 0.3 + 0.6 * Math.sin(time * 1.5 + s);

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.beginPath();
    ctx.arc(sx, sy, size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}
