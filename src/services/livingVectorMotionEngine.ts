import { MotionConfig } from '../types/motion';
import * as VectorData from './vectorSilhouettesData';

// Cache compiled Path2D objects for peak 60 FPS performance
let cachedPanoramaPath: Path2D | null = null;
let cachedSleighPath: Path2D | null = null;
let cachedStagPath: Path2D | null = null;
let cachedPinesPath: Path2D | null = null;

function getPanoramaPath(): Path2D {
  if (!cachedPanoramaPath) {
    cachedPanoramaPath = new Path2D();
    for (const d of VectorData.NORDIC_PANORAMA_HILL_VILLAGE.paths) {
      cachedPanoramaPath.addPath(new Path2D(d));
    }
  }
  return cachedPanoramaPath;
}

function getSleighPath(): Path2D {
  if (!cachedSleighPath) {
    cachedSleighPath = new Path2D();
    for (const d of VectorData.NORDIC_SANTA_SLEIGH_QUAD_REINDEER.paths) {
      cachedSleighPath.addPath(new Path2D(d));
    }
  }
  return cachedSleighPath;
}

function getStagPath(): Path2D {
  if (!cachedStagPath) {
    cachedStagPath = new Path2D();
    for (const d of VectorData.NORDIC_MAJESTIC_STAG_SILHOUETTE.paths) {
      cachedStagPath.addPath(new Path2D(d));
    }
  }
  return cachedStagPath;
}

function getPinesPath(): Path2D {
  if (!cachedPinesPath) {
    cachedPinesPath = new Path2D();
    for (const d of VectorData.NORDIC_SCANDI_PINES.paths) {
      cachedPinesPath.addPath(new Path2D(d));
    }
  }
  return cachedPinesPath;
}

// Pseudo-random deterministic hash
function hash(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453123;
  return x - Math.floor(x);
}

// 8-point Nordic folk star
function drawNordicStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, outerR: number, innerR: number) {
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

/**
 * 1. LIVING HYBRID VECTOR SILHOUETTE MASTERPIECE (Adaptive 16:9 / 1:1 / 9:16)
 */
export function drawLivingVectorSilhouetteMasterpiece(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const isVertical = height > width * 1.15;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const isDarkOverlay = config.backgroundMode === 'black' || config.backgroundMode === 'transparent';

  // Palette definition
  const colorPaperBg = '#fcfaf2';
  const colorSpruceDark = '#1b4332';
  const colorSpruceMid = '#2d6a4f';
  const colorGoldGlow = '#f59e0b';
  const colorGoldPale = '#fbbf24';

  const silhouetteColor = isDarkOverlay ? '#10b981' : colorSpruceDark;
  const frameColor = isDarkOverlay ? 'rgba(251, 191, 36, 0.45)' : colorSpruceDark;

  // 1. Draw Paper Background (if not black/transparent)
  if (!isDarkOverlay) {
    ctx.fillStyle = colorPaperBg;
    ctx.fillRect(0, 0, width, height);

    // Subtle warm paper grain / vignette
    const vig = ctx.createRadialGradient(
      width / 2, height / 2, minDim * 0.2,
      width / 2, height / 2, minDim * 0.85
    );
    vig.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    vig.addColorStop(1, 'rgba(226, 220, 203, 0.4)');
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, width, height);
  }

  // 2. Dashed Postal Stamp Border with Scandinavian Corner Crosses
  ctx.save();
  const pad = 36 * scale;
  ctx.strokeStyle = frameColor;
  ctx.lineWidth = 1.6 * scale;
  ctx.setLineDash([8 * scale, 6 * scale]);
  ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);
  ctx.setLineDash([]);

  const cornerSize = 12 * scale;
  const corners = [
    { x: pad, y: pad },
    { x: width - pad, y: pad },
    { x: pad, y: height - pad },
    { x: width - pad, y: height - pad }
  ];
  ctx.lineWidth = 1.4 * scale;
  corners.forEach(c => {
    ctx.beginPath();
    ctx.moveTo(c.x - cornerSize, c.y);
    ctx.lineTo(c.x + cornerSize, c.y);
    ctx.moveTo(c.x, c.y - cornerSize);
    ctx.lineTo(c.x, c.y + cornerSize);
    ctx.stroke();
  });
  ctx.restore();

  // 3. Volumetric Backlit Moon Halo
  const moonX = width * 0.5;
  const moonY = isVertical ? height * 0.26 : height * 0.42;
  const moonR = 140 * scale;

  ctx.save();
  const moonPulse = 1.0 + Math.sin(time * 1.8) * 0.04;
  const moonGrad = ctx.createRadialGradient(
    moonX, moonY, moonR * 0.15,
    moonX, moonY, moonR * 2.2 * moonPulse
  );
  if (isDarkOverlay) {
    moonGrad.addColorStop(0, 'rgba(245, 158, 11, 0.35)');
    moonGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.12)');
    moonGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  } else {
    moonGrad.addColorStop(0, 'rgba(254, 243, 199, 0.9)');
    moonGrad.addColorStop(0.5, 'rgba(253, 230, 138, 0.35)');
    moonGrad.addColorStop(1, 'rgba(252, 250, 242, 0)');
  }
  ctx.fillStyle = moonGrad;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 2.2 * moonPulse, 0, Math.PI * 2);
  ctx.fill();

  // Moon disc
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 0.85, 0, Math.PI * 2);
  ctx.fillStyle = isDarkOverlay ? 'rgba(253, 230, 138, 0.2)' : 'rgba(255, 253, 245, 0.85)';
  ctx.fill();
  ctx.strokeStyle = isDarkOverlay ? 'rgba(245, 158, 11, 0.5)' : 'rgba(217, 119, 6, 0.25)';
  ctx.lineWidth = 1.2 * scale;
  ctx.stroke();
  ctx.restore();

  // 4. Grounded Terrain & Alpine Village
  ctx.save();
  const villagePath = getPanoramaPath();
  const villageAspect = 1280 / 640;
  const villageWidth = isVertical ? width * 1.5 : width * 1.05;
  const villageX = (width - villageWidth) / 2;
  const villageY = isVertical ? height * 0.68 : height * 0.58;

  ctx.translate(villageX, villageY);
  const potraceScale = (villageWidth / 1280) * 0.1;
  ctx.scale(potraceScale, -potraceScale);
  ctx.translate(0, -6400);

  ctx.fillStyle = silhouetteColor;
  if (isDarkOverlay) {
    ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';
    ctx.shadowBlur = 15 * scale;
  }
  ctx.fill(villagePath);
  ctx.restore();

  // 5. Solid Base Fill
  const baseFillY = isVertical ? height * 0.72 : height * 0.62;
  ctx.save();
  ctx.fillStyle = silhouetteColor;
  ctx.beginPath();
  ctx.rect(0, baseFillY, width, height - baseFillY);
  ctx.fill();
  ctx.restore();

  // 6. Living Village Windows & Smoke
  const cabinAnchors = isVertical
    ? [
        { x: width * 0.35, y: height * 0.69 },
        { x: width * 0.52, y: height * 0.70 },
        { x: width * 0.68, y: height * 0.67 },
      ]
    : [
        { x: width * 0.485, y: height * 0.575 },
        { x: width * 0.515, y: height * 0.578 },
        { x: width * 0.585, y: height * 0.565 },
        { x: width * 0.625, y: height * 0.585 },
      ];

  cabinAnchors.forEach((c, idx) => {
    const flicker = 0.75 + Math.sin(time * 6 + idx * 3.7) * 0.25;
    ctx.save();
    ctx.fillStyle = `rgba(245, 158, 11, ${0.85 * flicker})`;
    ctx.shadowColor = 'rgba(251, 191, 36, 0.9)';
    ctx.shadowBlur = 8 * scale;
    ctx.fillRect(c.x - 3.5 * scale, c.y - 3.5 * scale, 7 * scale, 7 * scale);
    ctx.restore();

    ctx.save();
    for (let s = 0; s < 5; s++) {
      const smokeAge = ((time * 0.9 + s * 0.45 + idx * 0.3) % 2.0) / 2.0;
      const smokeY = c.y - 12 * scale - smokeAge * 38 * scale;
      const smokeX = c.x + 4 * scale + Math.sin(smokeAge * 4 + time * 1.5) * (6 * scale);
      const smokeR = (3 + smokeAge * 9) * scale;
      const smokeAlpha = (1 - smokeAge) * (isDarkOverlay ? 0.35 : 0.22);

      ctx.fillStyle = isDarkOverlay
        ? `rgba(254, 243, 199, ${smokeAlpha})`
        : `rgba(45, 106, 79, ${smokeAlpha})`;
      ctx.beginPath();
      ctx.arc(smokeX, smokeY, smokeR, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  // 7. Stag Mascot with Breathing Physics
  ctx.save();
  const stagPath = getStagPath();
  const stagCenterX = isVertical ? width * 0.28 : width * 0.34;
  const stagBaseY = isVertical ? height * 0.73 : height * 0.60;
  const stagTargetWidth = (isVertical ? 155 : 140) * scale;
  const stagTargetHeight = stagTargetWidth * (960 / 1280);

  const breathCycle = Math.sin(time * 2.2);
  const breathScaleY = 1.0 + breathCycle * 0.018;
  const breathScaleX = 1.0 - breathCycle * 0.008;

  ctx.translate(stagCenterX, stagBaseY);
  ctx.scale(breathScaleX, breathScaleY);

  ctx.shadowColor = isDarkOverlay ? 'rgba(245, 158, 11, 0.85)' : 'rgba(245, 158, 11, 0.45)';
  ctx.shadowBlur = 22 * scale;

  const stagPotraceScale = (stagTargetWidth / 1280) * 0.1;
  ctx.scale(stagPotraceScale, -stagPotraceScale);
  ctx.translate(-1280 / 2, -960);

  ctx.fillStyle = silhouetteColor;
  ctx.fill(stagPath);
  ctx.restore();

  // Antler stardust
  ctx.save();
  const antlerX = stagCenterX + 10 * scale;
  const antlerY = stagBaseY - stagTargetHeight * 0.88;
  for (let i = 0; i < 18; i++) {
    const seed = i * 47.19;
    const pAge = ((time * 0.8 + hash(seed) * 2) % 2.0) / 2.0;
    const px = antlerX + (hash(seed + 1) - 0.4) * 45 * scale + pAge * 25 * scale;
    const py = antlerY - pAge * 35 * scale + Math.sin(pAge * 5 + time) * 6 * scale;
    const pSize = (1.5 + hash(seed + 2) * 2.5) * (1 - pAge * 0.4) * scale;
    const pAlpha = (1 - pAge) * (0.4 + Math.sin(time * 8 + seed) * 0.3);

    ctx.fillStyle = `rgba(245, 158, 11, ${pAlpha})`;
    ctx.shadowColor = 'rgba(251, 191, 36, 0.9)';
    ctx.shadowBlur = 6 * scale;
    drawNordicStar(ctx, px, py, pSize, pSize * 0.45);
    ctx.fill();
  }
  ctx.restore();

  // 8. Flying Santa Sleigh & Quad Reindeer
  ctx.save();
  const sleighPath = getSleighPath();
  const flightSpan = width + 500 * scale;
  const flightSpeed = 55 * scale;
  const flightProgress = ((time * flightSpeed) % flightSpan);
  const sleighX = flightProgress - 250 * scale;
  const sleighWaveY = (isVertical ? height * 0.18 : height * 0.28) + Math.sin(time * 2.4) * 14 * scale;
  const sleighPitch = Math.cos(time * 2.4) * 0.035;

  ctx.translate(sleighX, sleighWaveY);
  ctx.rotate(sleighPitch);

  const sleighTargetWidth = (isVertical ? 280 : 320) * scale;
  const sleighPotraceScale = (sleighTargetWidth / 1280) * 0.1;
  ctx.scale(sleighPotraceScale, -sleighPotraceScale);
  ctx.translate(-1280 / 2, -671 / 2);

  ctx.fillStyle = silhouetteColor;
  if (isDarkOverlay) {
    ctx.shadowColor = 'rgba(16, 185, 129, 0.7)';
    ctx.shadowBlur = 16 * scale;
  }
  ctx.fill(sleighPath);
  ctx.restore();

  // Sleigh trail
  ctx.save();
  const trailOriginX = sleighX - sleighTargetWidth * 0.48;
  const trailOriginY = sleighWaveY + 10 * scale;
  for (let i = 0; i < 55; i++) {
    const seed = i * 29.31;
    const pProgress = ((time * 1.4 + hash(seed) * 2) % 2.0) / 2.0;
    const px = trailOriginX - pProgress * 220 * scale + (hash(seed + 1) - 0.5) * 18 * scale;
    const py = trailOriginY + (hash(seed + 2) - 0.5) * 24 * scale + Math.sin(pProgress * 4 + time * 2) * 12 * scale;
    const pSize = (1.2 + hash(seed + 3) * 2.8) * (1 - pProgress * 0.6) * scale;
    const twinkle = 0.5 + Math.sin(time * 10 + seed) * 0.5;
    const pAlpha = (1 - pProgress) * twinkle * (isDarkOverlay ? 0.9 : 0.75);

    ctx.fillStyle = `rgba(245, 158, 11, ${pAlpha})`;
    ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
    ctx.shadowBlur = 8 * scale;
    drawNordicStar(ctx, px, py, pSize * 1.3, pSize * 0.5);
    ctx.fill();
  }
  ctx.restore();

  // 9. Foreground Nordic Pines
  const drawFlankingTree = (tx: number, ty: number, tScale: number, flip: boolean) => {
    ctx.save();
    ctx.translate(tx, ty);
    if (flip) ctx.scale(-1, 1);
    const sway = Math.sin(time * 1.6 + tx * 0.01) * 0.015;
    ctx.rotate(sway);

    const treePath = getPinesPath();
    const treeW = 180 * tScale * scale;
    const tPotraceScale = (treeW / 1280) * 0.1;
    ctx.scale(tPotraceScale, -tPotraceScale);
    ctx.translate(-1280 / 2, -640);

    ctx.fillStyle = silhouetteColor;
    ctx.fill(treePath);
    ctx.restore();
  };

  if (isVertical) {
    drawFlankingTree(width * 0.10, height * 0.73, 1.25, false);
    drawFlankingTree(width * 0.88, height * 0.72, 1.35, true);
  } else {
    drawFlankingTree(width * 0.08, height * 0.62, 1.35, false);
    drawFlankingTree(width * 0.16, height * 0.61, 1.1, true);
    drawFlankingTree(width * 0.84, height * 0.61, 1.15, false);
    drawFlankingTree(width * 0.92, height * 0.62, 1.4, true);
  }

  // 10. Multi-Depth Parallax Snowfall
  ctx.save();
  const snowLayers = [
    { count: 35, speed: 28, maxR: 2.0, alpha: 0.35, blur: 0 },
    { count: 45, speed: 45, maxR: 3.2, alpha: 0.65, blur: 0 },
    { count: 20, speed: 65, maxR: 5.5, alpha: 0.85, blur: 3 },
  ];

  snowLayers.forEach((layer, lIdx) => {
    for (let i = 0; i < layer.count; i++) {
      const seed = lIdx * 1000 + i * 37.13;
      const xBase = hash(seed) * width;
      const drift = Math.sin(time * 1.2 + seed) * (20 * scale);
      const x = (xBase + drift) % width;
      const y = ((time * layer.speed * scale + hash(seed + 1) * height) % height);
      const r = (1.0 + hash(seed + 2) * (layer.maxR - 1.0)) * scale;

      ctx.fillStyle = isDarkOverlay
        ? `rgba(255, 255, 255, ${layer.alpha})`
        : `rgba(27, 67, 50, ${layer.alpha * 0.55})`;

      if (layer.blur > 0) {
        ctx.shadowColor = isDarkOverlay ? 'rgba(255, 255, 255, 0.8)' : 'rgba(27, 67, 50, 0.4)';
        ctx.shadowBlur = layer.blur * scale;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.restore();

  // 11. Typography (Bottom Center)
  ctx.save();
  const textCenterY = isVertical ? height * 0.88 : height * 0.78;
  const textColor = isDarkOverlay ? '#fef3c7' : colorSpruceDark;
  const goldColor = colorGoldGlow;

  ctx.fillStyle = goldColor;
  drawNordicStar(ctx, width / 2, textCenterY - 45 * scale, 4.5 * scale, 1.8 * scale);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = textColor;
  ctx.font = `700 ${32 * scale}px "Cinzel", "Playfair Display", "Times New Roman", serif`;
  ctx.letterSpacing = `${8 * scale}px`;
  ctx.fillText('MERRY CHRISTMAS', width / 2, textCenterY - 12 * scale);

  ctx.fillStyle = isDarkOverlay ? '#fde68a' : colorSpruceMid;
  ctx.font = `600 ${14 * scale}px "Cinzel", "Playfair Display", sans-serif`;
  ctx.letterSpacing = `${6 * scale}px`;
  ctx.fillText('HAPPY NEW YEAR 2027', width / 2, textCenterY + 28 * scale);

  ctx.fillStyle = goldColor;
  drawNordicStar(ctx, width / 2, textCenterY + 56 * scale, 3.5 * scale, 1.5 * scale);
  ctx.fill();
  ctx.restore();
}

/**
 * 2. SHUTTERSTOCK OFFICIAL VERTICAL (9:16) STORYTELLING BACKGROUND PLATE
 * Built strictly according to the Shutterstock Content Brief specifications:
 * - 9:16 Vertical format (1080x1920 / 2160x3840 4K)
 * - 100% Seamless Looping 10-second cycle
 * - Prime Central Copy Space for client titles, logos, or video ads without distraction
 * - Top Nordic Pine Theatre Proscenium arch framing
 * - Aerodynamic soaring Santa & quad-reindeer in upper sky
 * - Living Alpine Village with candlelit windows & billowing chimney smoke
 * - Majestic Nordic Stag mascot with natural organic micro-breathing
 * - 3-Depth parallax snowfall and ambient warm light orbs (never hampa!)
 */
export function drawShutterstockVerticalStorytellingPlate(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  // Enforce harmonic 10-second seamless looping cycle
  const loopDuration = config.durationSeconds || 10;
  const loopT = (time % loopDuration);
  const loopProgress = loopT / loopDuration;
  const loopPhase = loopProgress * Math.PI * 2;

  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const isDarkOverlay = config.backgroundMode === 'black' || config.backgroundMode === 'transparent';
  const isCustomBlue = config.backgroundMode === 'custom_gradient';

  // Palette definitions
  const colorPaperBg = '#fcfaf2';
  const colorNocturneDeep = '#07111e';
  const colorNocturneMid = '#0f243c';
  const colorSpruceDark = '#1b4332';
  const colorGoldAmber = '#f59e0b';
  const colorGoldPale = '#fbbf24';

  let silhouetteColor = colorSpruceDark;
  if (isDarkOverlay) {
    silhouetteColor = '#10b981';
  } else if (isCustomBlue) {
    silhouetteColor = '#061727';
  }

  // 1. Render Background Plate Canvas
  if (!isDarkOverlay) {
    if (isCustomBlue) {
      // Midnight Nordic Sky with Soft Aurora Glow
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      skyGrad.addColorStop(0, colorNocturneDeep);
      skyGrad.addColorStop(0.4, colorNocturneMid);
      skyGrad.addColorStop(0.75, '#13354c');
      skyGrad.addColorStop(1, '#0b1d2e');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle atmospheric aurora curtain
      const auroraWave = Math.sin(loopPhase + 1.2) * 0.05;
      const auroraGrad = ctx.createRadialGradient(
        width * 0.5, height * 0.25, width * 0.1,
        width * 0.5, height * 0.25, width * 0.9
      );
      auroraGrad.addColorStop(0, `rgba(52, 211, 153, ${0.12 + auroraWave})`);
      auroraGrad.addColorStop(0.5, `rgba(56, 189, 248, ${0.08 + auroraWave})`);
      auroraGrad.addColorStop(1, 'rgba(7, 17, 30, 0)');
      ctx.fillStyle = auroraGrad;
      ctx.fillRect(0, 0, width, height * 0.5);
    } else {
      // Premium Scandinavian Kraft Paper Canvas
      ctx.fillStyle = colorPaperBg;
      ctx.fillRect(0, 0, width, height);

      // Ambient warm radial lighting focused on center copy space
      const kraftVig = ctx.createRadialGradient(
        width * 0.5, height * 0.45, width * 0.15,
        width * 0.5, height * 0.45, width * 0.95
      );
      kraftVig.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      kraftVig.addColorStop(0.6, 'rgba(245, 240, 226, 0.4)');
      kraftVig.addColorStop(1, 'rgba(224, 216, 196, 0.6)');
      ctx.fillStyle = kraftVig;
      ctx.fillRect(0, 0, width, height);
    }
  }

  // 2. Dashed Scandinavian Postal Border with Corner Crosses
  ctx.save();
  const pad = 36 * scale;
  ctx.strokeStyle = isDarkOverlay
    ? 'rgba(251, 191, 36, 0.4)'
    : isCustomBlue
    ? 'rgba(251, 191, 36, 0.35)'
    : 'rgba(27, 67, 50, 0.35)';
  ctx.lineWidth = 1.6 * scale;
  ctx.setLineDash([8 * scale, 6 * scale]);
  ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);
  ctx.setLineDash([]);

  const cornerCrossSize = 12 * scale;
  const frameCorners = [
    { x: pad, y: pad },
    { x: width - pad, y: pad },
    { x: pad, y: height - pad },
    { x: width - pad, y: height - pad },
  ];
  ctx.lineWidth = 1.4 * scale;
  frameCorners.forEach((c) => {
    ctx.beginPath();
    ctx.moveTo(c.x - cornerCrossSize, c.y);
    ctx.lineTo(c.x + cornerCrossSize, c.y);
    ctx.moveTo(c.x, c.y - cornerCrossSize);
    ctx.lineTo(c.x, c.y + cornerCrossSize);
    ctx.stroke();
  });
  ctx.restore();

  // 3. ZONE 1: TOP 25% - High Luminous Moon & Scandinavian Folk Stars
  const moonX = width * 0.68;
  const moonY = height * 0.14;
  const moonR = 110 * scale;

  ctx.save();
  const moonBreath = 1.0 + Math.sin(loopPhase) * 0.05;
  const moonHalo = ctx.createRadialGradient(
    moonX, moonY, moonR * 0.15,
    moonX, moonY, moonR * 2.4 * moonBreath
  );
  if (isDarkOverlay || isCustomBlue) {
    moonHalo.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
    moonHalo.addColorStop(0.5, 'rgba(245, 158, 11, 0.15)');
    moonHalo.addColorStop(1, 'rgba(0, 0, 0, 0)');
  } else {
    moonHalo.addColorStop(0, 'rgba(254, 243, 199, 0.95)');
    moonHalo.addColorStop(0.5, 'rgba(253, 230, 138, 0.35)');
    moonHalo.addColorStop(1, 'rgba(252, 250, 242, 0)');
  }
  ctx.fillStyle = moonHalo;
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 2.4 * moonBreath, 0, Math.PI * 2);
  ctx.fill();

  // Crisp Moon Disc with Scandinavian Ring Outline
  ctx.beginPath();
  ctx.arc(moonX, moonY, moonR * 0.85, 0, Math.PI * 2);
  ctx.fillStyle = (isDarkOverlay || isCustomBlue) ? 'rgba(254, 243, 199, 0.25)' : 'rgba(255, 254, 248, 0.9)';
  ctx.fill();
  ctx.strokeStyle = (isDarkOverlay || isCustomBlue) ? 'rgba(251, 191, 36, 0.6)' : 'rgba(217, 119, 6, 0.3)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();
  ctx.restore();

  // Constellation Stars Scattered in Sky Zone
  const starAnchors = [
    { x: width * 0.18, y: height * 0.09, s: 4.2 },
    { x: width * 0.32, y: height * 0.06, s: 3.0 },
    { x: width * 0.45, y: height * 0.11, s: 5.0 },
    { x: width * 0.85, y: height * 0.08, s: 3.5 },
    { x: width * 0.88, y: height * 0.22, s: 4.0 },
    { x: width * 0.14, y: height * 0.24, s: 3.2 },
  ];
  ctx.save();
  starAnchors.forEach((st, idx) => {
    const twinkle = 0.5 + Math.sin(loopPhase * 2 + idx * 1.5) * 0.5;
    ctx.fillStyle = (isDarkOverlay || isCustomBlue)
      ? `rgba(251, 191, 36, ${0.4 + twinkle * 0.55})`
      : `rgba(217, 119, 6, ${0.45 + twinkle * 0.45})`;
    drawNordicStar(ctx, st.x, st.y, st.s * scale, st.s * 0.4 * scale);
    ctx.fill();
  });
  ctx.restore();

  // 4. Flying Santa Sleigh & Quad-Reindeer across Upper Sky
  // Trajectory: Flies from Left (-20% width) to Right (+120% width) in exact 10s loop
  ctx.save();
  const sleighPath = getSleighPath();
  const flightSpan = width * 1.5;
  const currentSleighX = ((loopProgress * flightSpan) % flightSpan) - width * 0.25;
  // Sinusoidal flight wave path
  const sleighY = height * 0.22 + Math.sin(loopPhase * 2) * (18 * scale);
  const sleighPitch = Math.cos(loopPhase * 2) * 0.04;

  ctx.translate(currentSleighX, sleighY);
  ctx.rotate(sleighPitch);

  const sleighTargetWidth = 300 * scale;
  const sleighPotraceScale = (sleighTargetWidth / 1280) * 0.1;
  ctx.scale(sleighPotraceScale, -sleighPotraceScale);
  ctx.translate(-1280 / 2, -671 / 2);

  ctx.fillStyle = silhouetteColor;
  if (isDarkOverlay) {
    ctx.shadowColor = 'rgba(16, 185, 129, 0.7)';
    ctx.shadowBlur = 18 * scale;
  }
  ctx.fill(sleighPath);
  ctx.restore();

  // Magical Stardust Wake Stream
  ctx.save();
  const trailOriginX = currentSleighX - sleighTargetWidth * 0.48;
  const trailOriginY = sleighY + 8 * scale;
  const trailCount = 50;

  for (let i = 0; i < trailCount; i++) {
    const seed = i * 31.41;
    const pFrac = ((loopProgress * 3.0 + hash(seed)) % 1.0);
    const px = trailOriginX - pFrac * (240 * scale) + (hash(seed + 1) - 0.5) * (20 * scale);
    const py = trailOriginY + (hash(seed + 2) - 0.5) * (28 * scale) + Math.sin(pFrac * 6 + loopPhase) * (14 * scale);
    const pSize = (1.5 + hash(seed + 3) * 3.0) * (1 - pFrac * 0.5) * scale;
    const pAlpha = (1 - pFrac) * (0.6 + Math.sin(loopPhase * 3 + seed) * 0.4);

    ctx.fillStyle = `rgba(245, 158, 11, ${pAlpha})`;
    ctx.shadowColor = 'rgba(251, 191, 36, 0.85)';
    ctx.shadowBlur = 8 * scale;
    drawNordicStar(ctx, px, py, pSize * 1.2, pSize * 0.45);
    ctx.fill();
  }
  ctx.restore();

  // 5. TOP THEATRE PROSCENIUM: Hanging Nordic Pine Canopies
  // Creates an elegant arch framing the top corners without blocking the sky center
  const drawPineTree = (tx: number, ty: number, tScale: number, flip: boolean) => {
    ctx.save();
    ctx.translate(tx, ty);
    if (flip) ctx.scale(-1, 1);
    const pineSway = Math.sin(loopPhase + tx * 0.01) * 0.015;
    ctx.rotate(pineSway);

    const treePath = getPinesPath();
    const treeW = 260 * tScale * scale;
    const tPotraceScale = (treeW / 1280) * 0.1;
    ctx.scale(tPotraceScale, -tPotraceScale);
    ctx.translate(-1280 / 2, -640);

    ctx.fillStyle = silhouetteColor;
    if (isDarkOverlay) {
      ctx.shadowColor = 'rgba(16, 185, 129, 0.4)';
      ctx.shadowBlur = 12 * scale;
    }
    ctx.fill(treePath);
    ctx.restore();
  };

  // Top Left & Top Right overhang framing
  drawPineTree(width * 0.04, height * 0.12, 1.4, false);
  drawPineTree(width * 0.96, height * 0.12, 1.45, true);

  // 6. ZONE 2: MIDDLE PRIME COPY SPACE (Height 0.28 to 0.65)
  // Clean, unobstructed zone. If text is toggled on, show elegant typography.
  if (config.showText && config.textDisplayMode !== 'clean_no_text') {
    ctx.save();
    const copyCenterY = height * 0.46;
    const titleColor = (isDarkOverlay || isCustomBlue) ? '#fef3c7' : colorSpruceDark;

    // Top ornamental 8-point Nordic star
    ctx.fillStyle = colorGoldAmber;
    drawNordicStar(ctx, width / 2, copyCenterY - 60 * scale, 6 * scale, 2.5 * scale);
    ctx.fill();

    // Main Greeting Typography
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = titleColor;
    ctx.font = `700 ${36 * scale}px "Cinzel", "Playfair Display", "Times New Roman", serif`;
    ctx.letterSpacing = `${8 * scale}px`;
    const headline = config.headlineText || 'MERRY CHRISTMAS';
    ctx.fillText(headline, width / 2, copyCenterY - 14 * scale);

    // Subtitle / Year
    ctx.fillStyle = (isDarkOverlay || isCustomBlue) ? '#fde68a' : '#2d6a4f';
    ctx.font = `600 ${16 * scale}px "Cinzel", "Playfair Display", sans-serif`;
    ctx.letterSpacing = `${7 * scale}px`;
    const subtitle = config.subtitleText || 'AND HAPPY NEW YEAR 2027';
    ctx.fillText(subtitle, width / 2, copyCenterY + 34 * scale);

    // Bottom ornamental 8-point Nordic star
    ctx.fillStyle = colorGoldAmber;
    drawNordicStar(ctx, width / 2, copyCenterY + 70 * scale, 4.5 * scale, 1.8 * scale);
    ctx.fill();
    ctx.restore();
  }

  // 7. ZONE 3: BOTTOM LIVING ALPINE RIDGELINE & VILLAGE
  // Potrace Vector Village Panorama spanning the lower third
  ctx.save();
  const villagePath = getPanoramaPath();
  const villageWidth = width * 1.65;
  const villageX = (width - villageWidth) / 2;
  const villageY = height * 0.68;

  ctx.translate(villageX, villageY);
  const vScale = (villageWidth / 1280) * 0.1;
  ctx.scale(vScale, -vScale);
  ctx.translate(0, -6400);

  ctx.fillStyle = silhouetteColor;
  if (isDarkOverlay) {
    ctx.shadowColor = 'rgba(16, 185, 129, 0.6)';
    ctx.shadowBlur = 18 * scale;
  }
  ctx.fill(villagePath);
  ctx.restore();

  // Solid Base Fill down to bottom border
  ctx.save();
  ctx.fillStyle = silhouetteColor;
  ctx.beginPath();
  ctx.rect(0, height * 0.73, width, height * 0.27);
  ctx.fill();
  ctx.restore();

  // Living Village Lights & Chimney Smoke (Harmonized to loop)
  const verticalCabins = [
    { x: width * 0.32, y: height * 0.70 },
    { x: width * 0.49, y: height * 0.71 },
    { x: width * 0.65, y: height * 0.685 }, // Church tower
    { x: width * 0.78, y: height * 0.715 },
  ];

  verticalCabins.forEach((c, idx) => {
    // Window candlelight flicker
    const flicker = 0.75 + Math.sin(loopPhase * 4 + idx * 2.3) * 0.25;
    ctx.save();
    ctx.fillStyle = `rgba(245, 158, 11, ${0.85 * flicker})`;
    ctx.shadowColor = 'rgba(251, 191, 36, 0.95)';
    ctx.shadowBlur = 9 * scale;
    ctx.fillRect(c.x - 4 * scale, c.y - 4 * scale, 8 * scale, 8 * scale);
    ctx.restore();

    // Billowing Chimney Smoke
    ctx.save();
    for (let s = 0; s < 5; s++) {
      const sFrac = ((loopProgress * 2.5 + s * 0.2 + idx * 0.15) % 1.0);
      const smokeY = c.y - 14 * scale - sFrac * (45 * scale);
      const smokeX = c.x + 5 * scale + Math.sin(sFrac * 6 + loopPhase) * (8 * scale);
      const smokeR = (3.5 + sFrac * 10) * scale;
      const smokeAlpha = (1 - sFrac) * ((isDarkOverlay || isCustomBlue) ? 0.35 : 0.22);

      ctx.fillStyle = (isDarkOverlay || isCustomBlue)
        ? `rgba(254, 243, 199, ${smokeAlpha})`
        : `rgba(45, 106, 79, ${smokeAlpha})`;
      ctx.beginPath();
      ctx.arc(smokeX, smokeY, smokeR, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  });

  // 8. THE MASCOT: Majestic Nordic Stag Silhouette with Organic Breathing
  ctx.save();
  const stagPath = getStagPath();
  const stagCenterX = width * 0.28;
  const stagBaseY = height * 0.75;
  const stagTargetWidth = 170 * scale;
  const stagTargetHeight = stagTargetWidth * (960 / 1280);

  // Micro-breathing oscillation (subtle natural chest rise)
  const breathSin = Math.sin(loopPhase * 2);
  const breathScaleY = 1.0 + breathSin * 0.02;
  const breathScaleX = 1.0 - breathSin * 0.009;

  ctx.translate(stagCenterX, stagBaseY);
  ctx.scale(breathScaleX, breathScaleY);

  ctx.shadowColor = (isDarkOverlay || isCustomBlue) ? 'rgba(245, 158, 11, 0.9)' : 'rgba(245, 158, 11, 0.5)';
  ctx.shadowBlur = 24 * scale;

  const stagPotraceScale = (stagTargetWidth / 1280) * 0.1;
  ctx.scale(stagPotraceScale, -stagPotraceScale);
  ctx.translate(-1280 / 2, -960);

  ctx.fillStyle = silhouetteColor;
  ctx.fill(stagPath);
  ctx.restore();

  // Floating Stardust from Mascot Stag's Antlers
  ctx.save();
  const antlerX = stagCenterX + 12 * scale;
  const antlerY = stagBaseY - stagTargetHeight * 0.88;
  for (let i = 0; i < 20; i++) {
    const seed = i * 53.71;
    const pFrac = ((loopProgress * 2.0 + hash(seed)) % 1.0);
    const px = antlerX + (hash(seed + 1) - 0.4) * (50 * scale) + pFrac * (30 * scale);
    const py = antlerY - pFrac * (42 * scale) + Math.sin(pFrac * 6 + loopPhase) * (8 * scale);
    const pSize = (1.5 + hash(seed + 2) * 2.5) * (1 - pFrac * 0.4) * scale;
    const pAlpha = (1 - pFrac) * (0.45 + Math.sin(loopPhase * 4 + seed) * 0.35);

    ctx.fillStyle = `rgba(245, 158, 11, ${pAlpha})`;
    ctx.shadowColor = 'rgba(251, 191, 36, 0.9)';
    ctx.shadowBlur = 7 * scale;
    drawNordicStar(ctx, px, py, pSize, pSize * 0.45);
    ctx.fill();
  }
  ctx.restore();

  // 9. Foreground Pines Flanking Bottom Corners (Framing the Scene)
  drawPineTree(width * 0.08, height * 0.75, 1.4, false);
  drawPineTree(width * 0.92, height * 0.74, 1.45, true);

  // 10. MULTI-DEPTH PARALLAX SNOWFALL (3 Layers - Pure Seamless Looping)
  // Ensures the copy space remains dynamic and breathing without distracting
  ctx.save();
  const verticalSnowLayers = [
    { count: 40, speed: 1.0, maxR: 2.2, alpha: 0.35, blur: 0 },
    { count: 55, speed: 1.6, maxR: 3.5, alpha: 0.65, blur: 0 },
    { count: 25, speed: 2.4, maxR: 6.0, alpha: 0.85, blur: 3 },
  ];

  verticalSnowLayers.forEach((layer, lIdx) => {
    for (let i = 0; i < layer.count; i++) {
      const seed = lIdx * 2000 + i * 41.17;
      const xBase = hash(seed) * width;
      const drift = Math.sin(loopPhase + seed) * (24 * scale);
      const x = (xBase + drift) % width;
      // Seamless modulo wrap using loopProgress
      const yOffset = hash(seed + 1);
      const y = (((loopProgress * layer.speed + yOffset) % 1.0) * height);
      const r = (1.2 + hash(seed + 2) * (layer.maxR - 1.2)) * scale;

      ctx.fillStyle = (isDarkOverlay || isCustomBlue)
        ? `rgba(255, 255, 255, ${layer.alpha})`
        : `rgba(27, 67, 50, ${layer.alpha * 0.55})`;

      if (layer.blur > 0) {
        ctx.shadowColor = (isDarkOverlay || isCustomBlue) ? 'rgba(255, 255, 255, 0.85)' : 'rgba(27, 67, 50, 0.45)';
        ctx.shadowBlur = layer.blur * scale;
      } else {
        ctx.shadowBlur = 0;
      }

      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
  ctx.restore();
}
