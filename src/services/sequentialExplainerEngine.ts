import { MotionConfig } from '../types/motion';

// ============================================================================
// EASING & MATH UTILITIES FOR TIMELINE SEQUENCING
// ============================================================================

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

// Normalized stage progress [0.0 - 1.0] from a time window [startProgress, endProgress]
function getStageProgress(globalProgress: number, start: number, end: number): number {
  if (globalProgress <= start) return 0;
  if (globalProgress >= end) return 1;
  return (globalProgress - start) / (end - start);
}

// Ease out cubic: fast start, smooth gentle landing
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

// Ease in out quad: smooth acceleration and deceleration
function easeInOutQuad(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Spring overshoot bounce (crisp tactile pop-in)
function easeOutBack(t: number, overshoot = 1.35): number {
  const c1 = overshoot;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// Pseudo-random deterministic hash
function hash(n: number): number {
  const x = Math.sin(n) * 43758.5453123;
  return x - Math.floor(x);
}

// ============================================================================
// 1. UNIVERSAL PROGRESSIVE REVEAL: PURE GEOMETRIC BLUEPRINT & WIREFRAME WRITE-ON
// ============================================================================
// 100% Text-Free & Neutral: Technical drafting grid, precision calipers, laser
// stylus tracing isometric geometric structures, volume glass fills, and radar sweep.
// Usable for architecture, engineering, gaming, tech, or any visual overlay.
// ============================================================================

export function drawProgressiveBlueprintSchematic(
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
  const cy = height / 2;

  // 1. Technical Drafting Grid Background (progressive expansion)
  const gridAlpha = easeOutCubic(clamp(progress / 0.15, 0, 1)) * 0.16;
  const gridSize = 48 * scale;
  ctx.save();
  ctx.strokeStyle = `rgba(56, 189, 248, ${gridAlpha})`;
  ctx.lineWidth = 1 * scale;

  const cols = Math.ceil(width / gridSize);
  const rows = Math.ceil(height / gridSize);
  for (let c = 0; c <= cols; c++) {
    const x = c * gridSize;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let r = 0; r <= rows; r++) {
    const y = r * gridSize;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Crosshair coordinate marks in 4 corners
  const crossSize = 14 * scale;
  const margin = 60 * scale;
  const corners = [
    [margin, margin],
    [width - margin, margin],
    [margin, height - margin],
    [width - margin, height - margin],
  ];
  ctx.strokeStyle = `rgba(56, 189, 248, ${gridAlpha * 2.2})`;
  ctx.lineWidth = 1.5 * scale;
  corners.forEach(([kx, ky]) => {
    ctx.beginPath();
    ctx.moveTo(kx - crossSize, ky);
    ctx.lineTo(kx + crossSize, ky);
    ctx.moveTo(kx, ky - crossSize);
    ctx.lineTo(kx, ky + crossSize);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(kx, ky, 4 * scale, 0, Math.PI * 2);
    ctx.stroke();
  });
  ctx.restore();

  // 2. Isometric Projection Conversion (30-degree technical projection)
  const isoAngles = {
    x: { dx: Math.cos(Math.PI / 6), dy: Math.sin(Math.PI / 6) },
    y: { dx: -Math.cos(Math.PI / 6), dy: Math.sin(Math.PI / 6) },
    z: { dx: 0, dy: -1 },
  };

  const toScreen = (ix: number, iy: number, iz: number): [number, number] => {
    const sx = cx + (ix * isoAngles.x.dx + iy * isoAngles.y.dx + iz * isoAngles.z.dx) * scale;
    const sy = cy + 30 * scale + (ix * isoAngles.x.dy + iy * isoAngles.y.dy + iz * isoAngles.z.dy) * scale;
    return [sx, sy];
  };

  // Pure geometric segments: Platform, pillars, central multi-tiered pedestal, and levitating core
  type LineSegment = [[number, number, number], [number, number, number]];
  const segments: LineSegment[] = [
    // Outer Base Perimeter
    [[-240, -240, -50], [240, -240, -50]],
    [[240, -240, -50], [240, 240, -50]],
    [[240, 240, -50], [-240, 240, -50]],
    [[-240, 240, -50], [-240, -240, -50]],

    // Vertical riser legs
    [[-240, -240, -50], [-240, -240, 0]],
    [[240, -240, -50], [240, -240, 0]],
    [[240, 240, -50], [240, 240, 0]],
    [[-240, 240, -50], [-240, 240, 0]],

    // Middle Platform Ring
    [[-240, -240, 0], [240, -240, 0]],
    [[240, -240, 0], [240, 240, 0]],
    [[240, 240, 0], [-240, 240, 0]],
    [[-240, 240, 0], [-240, -240, 0]],

    // Inward Geometric Conduits
    [[-240, 0, 0], [-130, 0, 0]],
    [[240, 0, 0], [130, 0, 0]],
    [[0, -240, 0], [0, -130, 0]],
    [[0, 240, 0], [0, 130, 0]],

    // Central Cube Foundation
    [[-130, -130, 0], [130, -130, 0]],
    [[130, -130, 0], [130, 130, 0]],
    [[130, 130, 0], [-130, 130, 0]],
    [[-130, 130, 0], [-130, -130, 0]],

    // Central Cube Risers
    [[-130, -130, 0], [-130, -130, 140]],
    [[130, -130, 0], [130, -130, 140]],
    [[130, 130, 0], [130, 130, 140]],
    [[-130, 130, 0], [-130, 130, 140]],

    // Central Cube Top Face
    [[-130, -130, 140], [130, -130, 140]],
    [[130, -130, 140], [130, 130, 140]],
    [[130, 130, 140], [-130, 130, 140]],
    [[-130, 130, 140], [-130, -130, 140]],

    // Floating Geometric Gem / Prism Ring (Levitating above core)
    [[-65, -65, 210], [65, -65, 210]],
    [[65, -65, 210], [65, 65, 210]],
    [[65, 65, 210], [-65, 65, 210]],
    [[-65, 65, 210], [-65, -65, 210]],
    [[-65, -65, 210], [-65, -65, 250]],
    [[65, -65, 210], [65, -65, 250]],
    [[65, 65, 210], [65, 65, 250]],
    [[-65, 65, 210], [-65, 65, 250]],
    [[-65, -65, 250], [65, -65, 250]],
    [[65, -65, 250], [65, 65, 250]],
    [[65, 65, 250], [-65, 65, 250]],
    [[-65, 65, 250], [-65, -65, 250]],
  ];

  // Progressive Write-on Window: Progress 0.05 to 0.75
  const revealProg = clamp((progress - 0.05) / 0.70, 0, 1);
  const totalSegs = segments.length;
  const currentTotalFloat = revealProg * totalSegs;
  const completedSegs = Math.floor(currentTotalFloat);
  const activeFraction = currentTotalFloat - completedSegs;

  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  let stylusTip: [number, number] | null = null;

  for (let i = 0; i < totalSegs; i++) {
    if (i > completedSegs) break;

    const [p1, p2] = segments[i];
    const [s1x, s1y] = toScreen(p1[0], p1[1], p1[2]);
    const [s2x, s2y] = toScreen(p2[0], p2[1], p2[2]);

    ctx.beginPath();
    ctx.moveTo(s1x, s1y);

    if (i < completedSegs) {
      // Completed line
      ctx.lineTo(s2x, s2y);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
      ctx.lineWidth = 2 * scale;
      ctx.stroke();
    } else {
      // Line actively being traced right now
      const currX = s1x + (s2x - s1x) * activeFraction;
      const currY = s1y + (s2y - s1y) * activeFraction;
      ctx.lineTo(currX, currY);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
      ctx.lineWidth = 2.8 * scale;
      ctx.stroke();

      stylusTip = [currX, currY];
    }
  }

  // Laser Stylus Glow & Sparks at the active drawing tip
  if (stylusTip && revealProg < 0.99) {
    const [tx, ty] = stylusTip;
    ctx.beginPath();
    ctx.arc(tx, ty, 5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 14 * scale;
    ctx.fill();

    for (let s = 0; s < 4; s++) {
      const angle = time * 9 + s * 1.57;
      const sparkDist = (10 + hash(s + time * 12) * 12) * scale;
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tx + Math.cos(angle) * sparkDist, ty + Math.sin(angle) * sparkDist);
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.75)';
      ctx.lineWidth = 1.2 * scale;
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
  }
  ctx.restore();

  // 3. Shaded Geometric Volume Fills (Fade-in progressively)
  const volumeProgress = getStageProgress(progress, 0.45, 0.80);
  if (volumeProgress > 0) {
    const volAlpha = easeOutCubic(volumeProgress) * 0.22;

    const pTop1 = toScreen(-130, -130, 140);
    const pTop2 = toScreen(130, -130, 140);
    const pTop3 = toScreen(130, 130, 140);
    const pTop4 = toScreen(-130, 130, 140);

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pTop1[0], pTop1[1]);
    ctx.lineTo(pTop2[0], pTop2[1]);
    ctx.lineTo(pTop3[0], pTop3[1]);
    ctx.lineTo(pTop4[0], pTop4[1]);
    ctx.closePath();
    ctx.fillStyle = `rgba(14, 165, 233, ${volAlpha * 1.6})`;
    ctx.fill();

    const pR1 = toScreen(130, -130, 0);
    const pR2 = toScreen(130, 130, 0);
    const pR3 = toScreen(130, 130, 140);
    const pR4 = toScreen(130, -130, 140);
    ctx.beginPath();
    ctx.moveTo(pR1[0], pR1[1]);
    ctx.lineTo(pR2[0], pR2[1]);
    ctx.lineTo(pR3[0], pR3[1]);
    ctx.lineTo(pR4[0], pR4[1]);
    ctx.closePath();
    ctx.fillStyle = `rgba(2, 132, 199, ${volAlpha * 0.9})`;
    ctx.fill();

    // Levitating Core Orb Glow
    const orbCenter = toScreen(0, 0, 230);
    const orbGlow = ctx.createRadialGradient(
      orbCenter[0],
      orbCenter[1],
      0,
      orbCenter[0],
      orbCenter[1],
      80 * scale
    );
    orbGlow.addColorStop(0, `rgba(56, 189, 248, ${volAlpha * 2.5})`);
    orbGlow.addColorStop(1, 'rgba(56, 189, 248, 0)');
    ctx.fillStyle = orbGlow;
    ctx.beginPath();
    ctx.arc(orbCenter[0], orbCenter[1], 80 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 4. Clean Dimension Calipers & Geometric Measurement Guides (No text, pure geometric ticks)
  const caliperProgress = getStageProgress(progress, 0.60, 0.85);
  if (caliperProgress > 0) {
    const cAlpha = easeOutCubic(caliperProgress);
    const pR = toScreen(240, 0, 0);
    const pL = toScreen(-240, 0, 0);

    ctx.save();
    ctx.strokeStyle = `rgba(125, 211, 252, ${cAlpha * 0.7})`;
    ctx.lineWidth = 1 * scale;
    ctx.setLineDash([4 * scale, 4 * scale]);

    // Right Guide Ticks
    ctx.beginPath();
    ctx.moveTo(pR[0], pR[1]);
    ctx.lineTo(pR[0] + 60 * scale, pR[1] - 25 * scale);
    ctx.lineTo(pR[0] + 120 * scale, pR[1] - 25 * scale);
    ctx.stroke();

    // Caliper end marks
    ctx.beginPath();
    ctx.arc(pR[0] + 120 * scale, pR[1] - 25 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(224, 242, 254, ${cAlpha})`;
    ctx.fill();

    // Left Guide Ticks
    ctx.beginPath();
    ctx.moveTo(pL[0], pL[1]);
    ctx.lineTo(pL[0] - 60 * scale, pL[1] - 25 * scale);
    ctx.lineTo(pL[0] - 120 * scale, pL[1] - 25 * scale);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(pL[0] - 120 * scale, pL[1] - 25 * scale, 3 * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 5. Final Stage Radar Sweep & Concentric Target Rings
  const finalProgress = getStageProgress(progress, 0.80, 1.0);
  if (finalProgress > 0) {
    const ringRadius = (finalProgress * 380 + 40) * scale;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy + 30 * scale, ringRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - finalProgress) * 0.85})`;
    ctx.lineWidth = 2.5 * scale;
    ctx.stroke();
    ctx.restore();
  }

  // Optional Custom Text if user enabled it in controls
  if (config.showText && config.headlineText) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = `700 ${22 * scale}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillText(config.headlineText, cx, 80 * scale);
    if (config.subtitleText) {
      ctx.font = `500 ${13 * scale}px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillStyle = 'rgba(125, 211, 252, 0.8)';
      ctx.fillText(config.subtitleText, cx, 110 * scale);
    }
    ctx.restore();
  }
}

// ============================================================================
// 2. UNIVERSAL SEQUENTIAL OBJECT REVEAL: 3-SLOT STAGGERED GLASS CARDS & CIRCUITS
// ============================================================================
// 100% Neutral: 3 clean, beautiful frosted glass cards that pop in sequentially
// with spring overshoot bounce (01, 02, 03). Inside are universal motion design
// placeholders (animated waveform, pulse gauge, rising mini equalizer).
// Perfect for any 3-step process, 3 product features, or 3-part sequence.
// ============================================================================

export function drawSequentialCardsNodes(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const isVertical = height > width;

  // Staggered node timing windows
  const nodeWindows = [
    { start: 0.05, end: 0.30, num: '01' },
    { start: 0.28, end: 0.53, num: '02' },
    { start: 0.51, end: 0.76, num: '03' },
  ];

  interface NodeCoord {
    x: number;
    y: number;
    w: number;
    h: number;
  }
  const nodes: NodeCoord[] = isVertical
    ? [
        { x: width * 0.5, y: height * 0.23, w: width * 0.84, h: 150 * scale },
        { x: width * 0.5, y: height * 0.45, w: width * 0.84, h: 150 * scale },
        { x: width * 0.5, y: height * 0.67, w: width * 0.84, h: 150 * scale },
      ]
    : [
        { x: width * 0.21, y: height * 0.50, w: 290 * scale, h: 320 * scale },
        { x: width * 0.50, y: height * 0.50, w: 290 * scale, h: 320 * scale },
        { x: width * 0.79, y: height * 0.50, w: 290 * scale, h: 320 * scale },
      ];

  // 1. Ambient Background Particles
  ctx.save();
  for (let p = 0; p < 20; p++) {
    const pSeed = p * 19.41;
    const px = ((hash(pSeed) + time * 0.02) % 1) * width;
    const py = ((hash(pSeed + 1) + Math.sin(time + p) * 0.04 + 1) % 1) * height;
    ctx.beginPath();
    ctx.arc(px, py, (hash(pSeed + 2) * 2 + 1) * scale, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
    ctx.fill();
  }
  ctx.restore();

  // 2. Animated Connector Circuits Between Slots
  for (let i = 0; i < 2; i++) {
    const fromNode = nodes[i];
    const toNode = nodes[i + 1];
    const linkStart = nodeWindows[i].start + 0.12;
    const linkEnd = nodeWindows[i + 1].start + 0.12;
    const linkProg = easeInOutQuad(clamp((progress - linkStart) / (linkEnd - linkStart), 0, 1));

    if (linkProg > 0) {
      ctx.save();
      const x1 = isVertical ? fromNode.x : fromNode.x + fromNode.w / 2;
      const y1 = isVertical ? fromNode.y + fromNode.h / 2 : fromNode.y;
      const x2 = isVertical ? toNode.x : toNode.x - toNode.w / 2;
      const y2 = isVertical ? toNode.y - toNode.h / 2 : toNode.y;

      const currX = x1 + (x2 - x1) * linkProg;
      const currY = y1 + (y2 - y1) * linkProg;

      // Base track
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(currX, currY);
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.45)';
      ctx.lineWidth = 3 * scale;
      ctx.stroke();

      // Traveling speed packet
      const packetCycle = (progress * 10 + i * 2) % 1;
      const packetX = x1 + (currX - x1) * packetCycle;
      const packetY = y1 + (currY - y1) * packetCycle;

      ctx.beginPath();
      ctx.arc(packetX, packetY, 5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 12 * scale;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    }
  }

  // 3. Render the 3 Sequential Glass Cards with Spring Bounce
  nodes.forEach((node, idx) => {
    const win = nodeWindows[idx];
    const rawP = clamp((progress - win.start) / (win.end - win.start), 0, 1);
    if (rawP <= 0) return;

    const springP = easeOutBack(rawP, 1.3);
    const alpha = clamp(rawP * 1.5, 0, 1);
    const currentScale = 0.72 + springP * 0.28;
    const offsetY = (1 - springP) * 45 * scale;

    ctx.save();
    ctx.translate(node.x, node.y + offsetY);
    ctx.scale(currentScale, currentScale);

    const hw = node.w / 2;
    const hh = node.h / 2;
    const r = 18 * scale;

    // Glass Card Body
    ctx.beginPath();
    ctx.roundRect(-hw, -hh, node.w, node.h, r);
    const cardGrad = ctx.createLinearGradient(-hw, -hh, hw, hh);
    cardGrad.addColorStop(0, `rgba(30, 27, 75, ${alpha * 0.85})`);
    cardGrad.addColorStop(1, `rgba(15, 23, 42, ${alpha * 0.94})`);
    ctx.fillStyle = cardGrad;
    ctx.fill();

    // Vibrant Neon Border
    const isActivelyFiring = rawP >= 0.95 && progress < nodeWindows[idx].end + 0.15;
    const borderGlow = isActivelyFiring ? 0.3 * Math.sin(time * 10) + 0.7 : 0.45;
    ctx.strokeStyle = `rgba(192, 132, 252, ${alpha * borderGlow})`;
    ctx.lineWidth = (isActivelyFiring ? 2.5 : 1.5) * scale;
    ctx.stroke();

    // Universal Number Badge in Corner: 01, 02, 03
    const badgeX = -hw + 28 * scale;
    const badgeY = -hh + 28 * scale;
    ctx.beginPath();
    ctx.arc(badgeX, badgeY, 14 * scale, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(168, 85, 247, ${alpha * 0.35})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(216, 180, 254, ${alpha * 0.85})`;
    ctx.lineWidth = 1.2 * scale;
    ctx.stroke();

    ctx.font = `800 ${11 * scale}px monospace`;
    ctx.fillStyle = `rgba(243, 232, 255, ${alpha})`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(win.num, badgeX, badgeY);

    // Universal Neutral Visual Content inside the card
    if (idx === 0) {
      // Slot 1: Pulsing Concentric Radar Target & Waveform
      const centerX = isVertical ? hw - 80 * scale : 0;
      const centerY = isVertical ? 0 : -10 * scale;
      ctx.save();
      ctx.translate(centerX, centerY);
      for (let cr = 1; cr <= 3; cr++) {
        const ringR = (cr * 18 + (time * 15) % 18) * scale;
        const ringAlpha = (1 - (ringR / (54 * scale))) * alpha * 0.6;
        ctx.beginPath();
        ctx.arc(0, 0, ringR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(192, 132, 252, ${ringAlpha})`;
        ctx.lineWidth = 1.2 * scale;
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(0, 0, 5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#c084fc';
      ctx.fill();
      ctx.restore();
    } else if (idx === 1) {
      // Slot 2: Smooth Fluid Sine Wave
      const centerX = isVertical ? hw - 80 * scale : 0;
      const centerY = isVertical ? 0 : -10 * scale;
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.beginPath();
      const waveW = 120 * scale;
      ctx.moveTo(-waveW / 2, 0);
      for (let wx = -waveW / 2; wx <= waveW / 2; wx += 4 * scale) {
        const nx = (wx + waveW / 2) / waveW;
        const wy = Math.sin(nx * Math.PI * 4 - time * 6) * 16 * scale;
        ctx.lineTo(wx, wy);
      }
      ctx.strokeStyle = `rgba(96, 165, 250, ${alpha * 0.9})`;
      ctx.lineWidth = 2.5 * scale;
      ctx.stroke();
      ctx.restore();
    } else {
      // Slot 3: Ascending Equalizer Bars
      const centerX = isVertical ? hw - 80 * scale : 0;
      const centerY = isVertical ? 0 : -10 * scale;
      ctx.save();
      ctx.translate(centerX, centerY);
      const barCount = 5;
      const barW = 10 * scale;
      const barSpacing = 16 * scale;
      const totalW = barCount * barSpacing;
      for (let b = 0; b < barCount; b++) {
        const bH = (20 + 25 * Math.abs(Math.sin(time * 5 + b * 0.8))) * scale;
        const bx = -totalW / 2 + b * barSpacing;
        ctx.beginPath();
        ctx.roundRect(bx, -bH / 2, barW, bH, 3 * scale);
        ctx.fillStyle = `rgba(168, 85, 247, ${alpha * 0.85})`;
        ctx.fill();
      }
      ctx.restore();
    }

    // Universal Skeleton Progress Bar at bottom of card
    const barW = node.w - 56 * scale;
    const barH = 5 * scale;
    const barY = hh - 24 * scale;
    ctx.beginPath();
    ctx.roundRect(-hw + 28 * scale, barY, barW, barH, 2.5 * scale);
    ctx.fillStyle = 'rgba(51, 65, 85, 0.5)';
    ctx.fill();

    const loadP = clamp((progress - win.start) / 0.16, 0, 1);
    ctx.beginPath();
    ctx.roundRect(-hw + 28 * scale, barY, barW * loadP, barH, 2.5 * scale);
    const loadGrad = ctx.createLinearGradient(-hw + 28 * scale, 0, -hw + 28 * scale + barW, 0);
    loadGrad.addColorStop(0, '#c084fc');
    loadGrad.addColorStop(1, '#60a5fa');
    ctx.fillStyle = loadGrad;
    ctx.fill();

    ctx.restore();
  });

  // 4. Synchronized Completion Wave (progress > 0.80)
  const finishProgress = getStageProgress(progress, 0.80, 1.0);
  if (finishProgress > 0) {
    const fAlpha = easeOutCubic(finishProgress);
    const bannerY = isVertical ? height * 0.86 : height * 0.84;

    ctx.save();
    const bW = Math.min(width * 0.65, 380 * scale);
    const bH = 38 * scale;
    ctx.beginPath();
    ctx.roundRect(width / 2 - bW / 2, bannerY - bH / 2, bW, bH, 19 * scale);
    ctx.fillStyle = `rgba(88, 28, 135, ${fAlpha * 0.55})`;
    ctx.fill();
    ctx.strokeStyle = `rgba(216, 180, 254, ${fAlpha * 0.85})`;
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();

    // Universal 3-point sync dots
    for (let dot = -1; dot <= 1; dot++) {
      ctx.beginPath();
      ctx.arc(width / 2 + dot * 32 * scale, bannerY, (4 + Math.sin(time * 6 + dot) * 2) * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }
    ctx.restore();
  }

  // Optional Custom Text if user enabled it in controls
  if (config.showText && config.headlineText) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = `700 ${22 * scale}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillText(config.headlineText, width / 2, 75 * scale);
    ctx.restore();
  }
}

// ============================================================================
// 3. UNIVERSAL STEP-BY-STEP INFOGRAPHIC: 4-STAGE PIPELINE & PROGRESS RAIL
// ============================================================================
// 100% Neutral: Liquid neon rail connecting 4 milestone stations (01, 02, 03, 04).
// Features real-time numerical counter (0% -> 100%), animated gauges, and checkmarks.
// Zero domain-specific jargon; works for any tutorial, business presentation,
// video milestone, or process explanation.
// ============================================================================

export function drawStepByStepInfographic(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const isVertical = height > width;

  const stageIntervals = [
    { start: 0.05, end: 0.26, num: '01' },
    { start: 0.26, end: 0.50, num: '02' },
    { start: 0.50, end: 0.74, num: '03' },
    { start: 0.74, end: 0.95, num: '04' },
  ];

  interface StepPos {
    x: number;
    y: number;
  }
  const positions: StepPos[] = [];
  if (isVertical) {
    const startY = height * 0.18;
    const endY = height * 0.82;
    for (let i = 0; i < 4; i++) {
      positions.push({
        x: width * 0.5,
        y: startY + (i / 3) * (endY - startY),
      });
    }
  } else {
    const startX = width * 0.15;
    const endX = width * 0.85;
    const laneY = height * 0.52;
    for (let i = 0; i < 4; i++) {
      positions.push({
        x: startX + (i / 3) * (endX - startX),
        y: laneY,
      });
    }
  }

  // 1. Draw Connecting Timeline Pipeline Rail
  ctx.save();
  for (let i = 0; i < 3; i++) {
    const p1 = positions[i];
    const p2 = positions[i + 1];
    const interval = stageIntervals[i];
    const railProg = easeInOutQuad(clamp((progress - interval.start) / (interval.end - interval.start), 0, 1));

    // Base groove
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = 'rgba(30, 41, 59, 0.65)';
    ctx.lineWidth = 6 * scale;
    ctx.stroke();

    // Active liquid emerald glow
    if (railProg > 0) {
      const targetX = p1.x + (p2.x - p1.x) * railProg;
      const targetY = p1.y + (p2.y - p1.y) * railProg;

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(targetX, targetY);
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 6 * scale;
      ctx.stroke();

      // Leading speed packet
      ctx.beginPath();
      ctx.arc(targetX, targetY, 6 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 14 * scale;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }
  ctx.restore();

  // 2. Draw Milestone Stations & Dynamic Visual Gauges
  stageIntervals.forEach((interval, idx) => {
    const pos = positions[idx];
    const stageP = clamp((progress - interval.start) / (interval.end - interval.start), 0, 1);
    const hasStarted = progress >= interval.start;
    const hasFinished = progress >= interval.end;

    const ringScale = hasStarted ? 0.72 + easeOutBack(stageP, 1.35) * 0.28 : 0.72;

    ctx.save();
    ctx.translate(pos.x, pos.y);
    ctx.scale(ringScale, ringScale);

    // Station Ring Circle
    const radius = 36 * scale;
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.fillStyle = hasFinished ? 'rgba(6, 78, 59, 0.92)' : 'rgba(15, 23, 42, 0.95)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = hasFinished ? '#10b981' : hasStarted ? '#34d399' : 'rgba(71, 85, 105, 0.5)';
    ctx.lineWidth = (hasStarted ? 3 : 2) * scale;
    ctx.stroke();

    // Station Number or Completed Checkmark
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (hasFinished) {
      ctx.font = `800 ${20 * scale}px 'Plus Jakarta Sans', sans-serif`;
      ctx.fillStyle = '#6ee7b7';
      ctx.fillText('✓', 0, 0);
    } else {
      ctx.font = `800 ${16 * scale}px 'Plus Jakarta Sans', monospace`;
      ctx.fillStyle = hasStarted ? '#ffffff' : 'rgba(148, 163, 184, 0.6)';
      ctx.fillText(interval.num, 0, 0);
    }

    // Dynamic Mini Gauge Card (Offset below milestone)
    if (hasStarted) {
      const cardAlpha = easeOutCubic(stageP);
      const isCardBelow = !isVertical;
      const cardOffX = isVertical ? 65 * scale : 0;
      const cardOffY = isVertical ? 0 : 70 * scale;

      ctx.save();
      ctx.translate(cardOffX, cardOffY);
      ctx.textAlign = isVertical ? 'left' : 'center';

      // Dynamic Percentage Metric Ticker (0% -> 100%)
      const currentPercent = Math.round(stageP * 100);
      ctx.font = `800 ${18 * scale}px 'Plus Jakarta Sans', monospace`;
      ctx.fillStyle = `rgba(52, 211, 153, ${cardAlpha})`;
      ctx.fillText(`${currentPercent}%`, 0, 0);

      // Mini skeleton bar below metric
      const barW = 60 * scale;
      const barH = 4 * scale;
      const barStartX = isVertical ? 0 : -barW / 2;
      ctx.beginPath();
      ctx.roundRect(barStartX, 10 * scale, barW, barH, 2 * scale);
      ctx.fillStyle = 'rgba(51, 65, 85, 0.5)';
      ctx.fill();

      ctx.beginPath();
      ctx.roundRect(barStartX, 10 * scale, barW * stageP, barH, 2 * scale);
      ctx.fillStyle = '#34d399';
      ctx.fill();

      ctx.restore();
    }

    ctx.restore();
  });

  // 3. Climax Golden Finish Pulse (progress > 0.90)
  const finishP = getStageProgress(progress, 0.90, 1.0);
  if (finishP > 0) {
    const fAlpha = easeOutCubic(finishP);
    ctx.save();
    positions.forEach((pos) => {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, (36 + finishP * 24) * scale, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(52, 211, 153, ${(1 - finishP) * 0.8})`;
      ctx.lineWidth = 2 * scale;
      ctx.stroke();
    });
    ctx.restore();
  }

  // Optional Custom Text if user enabled it in controls
  if (config.showText && config.headlineText) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = `700 ${22 * scale}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillText(config.headlineText, width / 2, 75 * scale);
    ctx.restore();
  }
}

// ============================================================================
// 4. UNIVERSAL BUILD-UP ANIMATION: MODULAR GRID ASSEMBLY & COMPOSITION LOCK
// ============================================================================
// 100% Neutral: 4 floating modular glass window frames assemble from outside
// into an immaculate golden-ratio grid composition, magnetic guide tracks pull them
// inward, snapping together with laser alignment crosshairs, finished with a 45°
// specular lens flare sweep.
// Essential for split screens, video intros, software layouts, and product reveals.
// ============================================================================

export function drawModularBuildupComposition(
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
  const cy = height / 2;

  interface ModuleConfig {
    id: string;
    finalX: number;
    finalY: number;
    w: number;
    h: number;
    initOffsetX: number;
    initOffsetY: number;
    initRot: number;
  }

  const modules: ModuleConfig[] = [
    // Top Bar Frame
    {
      id: 'top_bar',
      finalX: 0,
      finalY: -210 * scale,
      w: 640 * scale,
      h: 60 * scale,
      initOffsetX: 0,
      initOffsetY: -380 * scale,
      initRot: 0.08,
    },
    // Left Square Tile Frame
    {
      id: 'left_tile',
      finalX: -165 * scale,
      finalY: 0,
      w: 290 * scale,
      h: 300 * scale,
      initOffsetX: -480 * scale,
      initOffsetY: -50 * scale,
      initRot: -0.18,
    },
    // Right Chart Tile Frame
    {
      id: 'right_tile',
      finalX: 165 * scale,
      finalY: 0,
      w: 290 * scale,
      h: 300 * scale,
      initOffsetX: 480 * scale,
      initOffsetY: 60 * scale,
      initRot: 0.16,
    },
    // Bottom Dock Frame
    {
      id: 'bottom_dock',
      finalX: 0,
      finalY: 200 * scale,
      w: 640 * scale,
      h: 70 * scale,
      initOffsetX: 0,
      initOffsetY: 380 * scale,
      initRot: -0.06,
    },
  ];

  // Convergence Phase: Progress 0.08 -> 0.70
  const assembleProgress = clamp((progress - 0.08) / 0.62, 0, 1);
  const snapT = easeOutBack(assembleProgress, 1.25);
  const lockProgress = getStageProgress(progress, 0.75, 1.0);

  // Background Alignment Grid Waves
  ctx.save();
  const bgGridAlpha = 0.12 + Math.sin(time * 2) * 0.04;
  ctx.strokeStyle = `rgba(99, 102, 241, ${bgGridAlpha})`;
  ctx.lineWidth = 1 * scale;
  const gridStep = 52 * scale;
  for (let x = 0; x < width; x += gridStep) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridStep) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();

  // Draw Magnetic Guide Tracks
  if (assembleProgress < 0.98) {
    ctx.save();
    modules.forEach((mod) => {
      const curX = cx + mod.finalX + mod.initOffsetX * (1 - snapT);
      const curY = cy + mod.finalY + mod.initOffsetY * (1 - snapT);
      const targetX = cx + mod.finalX;
      const targetY = cy + mod.finalY;

      ctx.beginPath();
      ctx.moveTo(curX, curY);
      ctx.lineTo(targetX, targetY);
      ctx.strokeStyle = 'rgba(129, 140, 248, 0.35)';
      ctx.lineWidth = 1.5 * scale;
      ctx.setLineDash([5 * scale, 5 * scale]);
      ctx.stroke();
    });
    ctx.restore();
  }

  // Draw Each Modular Component Building Up
  modules.forEach((mod) => {
    const curX = cx + mod.finalX + mod.initOffsetX * (1 - snapT);
    const curY = cy + mod.finalY + mod.initOffsetY * (1 - snapT);
    const curRot = mod.initRot * (1 - snapT);
    const alpha = clamp(assembleProgress * 1.6, 0, 1);

    ctx.save();
    ctx.translate(curX, curY);
    ctx.rotate(curRot);

    const hw = mod.w / 2;
    const hh = mod.h / 2;
    const r = 12 * scale;

    // Glass Card Body
    ctx.beginPath();
    ctx.roundRect(-hw, -hh, mod.w, mod.h, r);
    const cardGrad = ctx.createLinearGradient(-hw, -hh, hw, hh);
    cardGrad.addColorStop(0, `rgba(30, 27, 75, ${alpha * 0.88})`);
    cardGrad.addColorStop(1, `rgba(15, 23, 42, ${alpha * 0.94})`);
    ctx.fillStyle = cardGrad;
    ctx.fill();

    // Border Glow
    const isLocked = assembleProgress >= 0.95;
    ctx.strokeStyle = isLocked ? 'rgba(99, 102, 241, 0.85)' : `rgba(165, 180, 252, ${alpha * 0.5})`;
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();

    // Corner Brackets for Clean High-Tech Framing
    const bLen = 12 * scale;
    ctx.strokeStyle = `rgba(199, 210, 254, ${alpha * 0.9})`;
    ctx.lineWidth = 2 * scale;
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(-hw + bLen, -hh);
    ctx.lineTo(-hw, -hh);
    ctx.lineTo(-hw, -hh + bLen);
    ctx.stroke();
    // Top-Right
    ctx.beginPath();
    ctx.moveTo(hw - bLen, -hh);
    ctx.lineTo(hw, -hh);
    ctx.lineTo(hw, -hh + bLen);
    ctx.stroke();
    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(-hw, hh - bLen);
    ctx.lineTo(-hw, hh);
    ctx.lineTo(-hw + bLen, hh);
    ctx.stroke();
    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(hw - bLen, hh);
    ctx.lineTo(hw, hh);
    ctx.lineTo(hw, hh - bLen);
    ctx.stroke();

    // Universal Abstract Motion Graphics Inside Modules
    if (mod.id === 'right_tile') {
      // Dynamic Rising Bar Graph
      const barCount = 6;
      const bW = 26 * scale;
      const bMaxH = 120 * scale;
      const startBx = -hw + 30 * scale;
      const baseBy = hh - 30 * scale;

      for (let b = 0; b < barCount; b++) {
        const barProg = clamp((assembleProgress - 0.25) / 0.65, 0, 1);
        const bH = (0.25 + 0.65 * hash(b * 14.1)) * bMaxH * barProg;
        ctx.fillStyle = `rgba(99, 102, 241, ${alpha * 0.85})`;
        ctx.beginPath();
        ctx.roundRect(startBx + b * 40 * scale, baseBy - bH, bW, bH, 4 * scale);
        ctx.fill();
      }
    } else if (mod.id === 'left_tile') {
      // Dynamic Pulse Waveform
      const ekgProg = clamp((assembleProgress - 0.25) / 0.65, 0, 1);
      ctx.beginPath();
      ctx.moveTo(-hw + 25 * scale, 0);
      for (let ex = 0; ex < mod.w - 50 * scale; ex += 4 * scale) {
        const nx = ex / (mod.w - 50 * scale);
        const pulse = Math.sin(nx * 12 - time * 6) * 22 * scale * ekgProg;
        ctx.lineTo(-hw + 25 * scale + ex, pulse);
      }
      ctx.strokeStyle = `rgba(244, 63, 94, ${alpha * 0.9})`;
      ctx.lineWidth = 2.2 * scale;
      ctx.stroke();
    } else if (mod.id === 'top_bar') {
      // Universal Skeleton Shimmer Line
      ctx.beginPath();
      ctx.roundRect(-hw + 25 * scale, -4 * scale, mod.w * 0.4, 8 * scale, 4 * scale);
      ctx.fillStyle = `rgba(165, 180, 252, ${alpha * 0.4})`;
      ctx.fill();
    } else if (mod.id === 'bottom_dock') {
      // 3 Action Pips
      for (let pip = -1; pip <= 1; pip++) {
        ctx.beginPath();
        ctx.arc(pip * 45 * scale, 0, 6 * scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99, 102, 241, ${alpha * 0.75})`;
        ctx.fill();
      }
    }

    ctx.restore();
  });

  // Stage 4: Specular Light Beam 45° Sweep across Completed Composition
  if (lockProgress > 0) {
    const lAlpha = easeOutCubic(lockProgress);

    ctx.save();
    const sweepX = -width * 0.2 + lockProgress * width * 1.4;
    const sweepGrad = ctx.createLinearGradient(sweepX - 120 * scale, 0, sweepX + 120 * scale, height);
    sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    sweepGrad.addColorStop(0.5, `rgba(255, 255, 255, ${lAlpha * 0.32})`);
    sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = sweepGrad;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // Optional Custom Text if user enabled it in controls
  if (config.showText && config.headlineText) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = `700 ${22 * scale}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillText(config.headlineText, width / 2, 75 * scale);
    ctx.restore();
  }
}

// ============================================================================
// 5. THE CHAMPION ASSET: VISIONOS PRISMATIC TARGETING CALLOUT & GYROSCOPIC RETICLE
// ============================================================================
// Market Leader: The #1 most bought motion graphic category worldwide (used by
// Vox, Johnny Harris, Apple Keynote, MKBHD, and corporate film editors).
// Why buyers choose THIS over 1,000 generic competitors:
// 1. Gyroscopic 3D Gimbal Reticle with degree azimuth bearings & quantum lock
// 2. Anamorphic Chromatic Dispersion (RGB Laser Separation + Ionized sparks)
// 3. VisionOS Frosted Optical Glass Card with dynamic specular caustic reflections
// 4. Elastic Overshoot Spring Physics with tactile physical mass
// 5. Living Ambient Oscilloscope Waveform & Diamond Specular Glints
// 6. 100% Neutral: Directable to any face, product, gadget, car, map, or doc!
// ============================================================================

export function drawAnimatedVisualExplainer(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const isVertical = height > width;

  // Adaptive Target Focal Coordinates
  const targetX = isVertical ? width * 0.5 : width * 0.30;
  const targetY = isVertical ? height * 0.32 : height * 0.50;

  // Callout Card Destination
  const cardX = isVertical ? width * 0.5 : width * 0.69;
  const cardY = isVertical ? height * 0.67 : height * 0.50;
  const cardW = isVertical ? width * 0.84 : 380 * scale;
  const cardH = 230 * scale;

  // Staged Progression Windows
  const p1 = clamp(progress / 0.20, 0, 1);
  const p2 = clamp((progress - 0.20) / 0.28, 0, 1);
  const p3 = clamp((progress - 0.48) / 0.28, 0, 1);
  const p4 = clamp((progress - 0.76) / 0.16, 0, 1);

  // --------------------------------------------------------------------------
  // 1. GYROSCOPIC 3D GIMBAL TARGETING RETICLE (Phase 1)
  // --------------------------------------------------------------------------
  ctx.save();
  ctx.translate(targetX, targetY);

  const reticleScale = 0.4 + easeOutBack(p1, 1.45) * 0.6;
  ctx.scale(reticleScale, reticleScale);

  // Outer Azimuth Compass Ring with 12 Precision Tick Marks
  ctx.save();
  ctx.rotate(time * 0.8);
  ctx.beginPath();
  ctx.arc(0, 0, 48 * scale, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 1.2 * scale;
  ctx.stroke();

  for (let tk = 0; tk < 12; tk++) {
    const a = (tk / 12) * Math.PI * 2;
    const isMajor = tk % 3 === 0;
    const rIn = (isMajor ? 40 : 44) * scale;
    const rOut = 48 * scale;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * rIn, Math.sin(a) * rIn);
    ctx.lineTo(Math.cos(a) * rOut, Math.sin(a) * rOut);
    ctx.strokeStyle = isMajor ? '#ffffff' : 'rgba(125, 211, 252, 0.7)';
    ctx.lineWidth = (isMajor ? 1.8 : 1.0) * scale;
    ctx.stroke();
  }
  ctx.restore();

  // Middle Gyroscopic Gimbal Ellipse (Simulated 3D Tilt)
  ctx.save();
  const tiltAngle = Math.sin(time * 2.5) * 0.25;
  ctx.rotate(time * 2.2);
  ctx.beginPath();
  ctx.ellipse(0, 0, 36 * scale, (24 + Math.sin(time * 3) * 8) * scale, tiltAngle, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(125, 211, 252, 0.85)';
  ctx.lineWidth = 1.5 * scale;
  ctx.setLineDash([5 * scale, 5 * scale]);
  ctx.stroke();
  ctx.restore();

  // Precision Crosshair Brackets
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
  ctx.lineWidth = 2 * scale;
  const brk = 18 * scale;
  const gap = 8 * scale;
  // Left & Right
  ctx.beginPath();
  ctx.moveTo(-brk, 0);
  ctx.lineTo(-gap, 0);
  ctx.moveTo(gap, 0);
  ctx.lineTo(brk, 0);
  // Top & Bottom
  ctx.moveTo(0, -brk);
  ctx.lineTo(0, -gap);
  ctx.moveTo(0, gap);
  ctx.lineTo(0, brk);
  ctx.stroke();

  // Quantum Focal Bead with Multi-layered Ionized Pulse
  ctx.beginPath();
  ctx.arc(0, 0, 4.5 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = '#38bdf8';
  ctx.shadowBlur = 16 * scale;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Expanding Ambient Lock Pulse Wave
  const lockPulse = (time * 45) % (75 * scale);
  ctx.beginPath();
  ctx.arc(0, 0, lockPulse, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(56, 189, 248, ${(1 - lockPulse / (75 * scale)) * 0.7})`;
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  ctx.restore();

  // --------------------------------------------------------------------------
  // 2. ANAMORPHIC CHROMATIC DISPERSION LEADER LINE (Phase 2)
  // --------------------------------------------------------------------------
  if (p2 > 0) {
    const kneeX = isVertical ? targetX + 45 * scale : targetX + (cardX - cardW / 2 - targetX) * 0.42;
    const kneeY = isVertical ? targetY + (cardY - cardH / 2 - targetY) * 0.45 : targetY - 45 * scale;
    const anchorX = isVertical ? cardX : cardX - cardW / 2;
    const anchorY = isVertical ? cardY - cardH / 2 : cardY;

    // Split progress into 2 segments
    const s1Prog = clamp(p2 / 0.5, 0, 1);
    const s2Prog = clamp((p2 - 0.5) / 0.5, 0, 1);

    const curKneeX = targetX + (kneeX - targetX) * s1Prog;
    const curKneeY = targetY + (kneeY - targetY) * s1Prog;

    const curEndX = s2Prog > 0 ? kneeX + (anchorX - kneeX) * s2Prog : curKneeX;
    const curEndY = s2Prog > 0 ? kneeY + (anchorY - kneeY) * s2Prog : curKneeY;

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // A. Cyan Chromatic Shift (+1.5px offset)
    ctx.save();
    ctx.translate(1.5 * scale, 0.8 * scale);
    ctx.beginPath();
    ctx.moveTo(targetX, targetY);
    ctx.lineTo(curKneeX, curKneeY);
    if (s2Prog > 0) ctx.lineTo(curEndX, curEndY);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
    ctx.lineWidth = 2.5 * scale;
    ctx.stroke();
    ctx.restore();

    // B. Magenta / Ruby Chromatic Shift (-1.5px offset)
    ctx.save();
    ctx.translate(-1.5 * scale, -0.8 * scale);
    ctx.beginPath();
    ctx.moveTo(targetX, targetY);
    ctx.lineTo(curKneeX, curKneeY);
    if (s2Prog > 0) ctx.lineTo(curEndX, curEndY);
    ctx.strokeStyle = 'rgba(244, 63, 94, 0.45)';
    ctx.lineWidth = 2.2 * scale;
    ctx.stroke();
    ctx.restore();

    // C. Intense Pure White Core Beam
    ctx.beginPath();
    ctx.moveTo(targetX, targetY);
    ctx.lineTo(curKneeX, curKneeY);
    if (s2Prog > 0) ctx.lineTo(curEndX, curEndY);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.2 * scale;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 10 * scale;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // Laser Spark Ejection at Active Tip
    if (p2 < 0.98) {
      const tipX = s2Prog > 0 ? curEndX : curKneeX;
      const tipY = s2Prog > 0 ? curEndY : curKneeY;

      ctx.beginPath();
      ctx.arc(tipX, tipY, 4.5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 14 * scale;
      ctx.fill();

      for (let sp = 0; sp < 4; sp++) {
        const spAngle = time * 12 + sp * 1.57;
        const spDist = (8 + hash(sp + time * 14) * 12) * scale;
        ctx.beginPath();
        ctx.moveTo(tipX, tipY);
        ctx.lineTo(tipX + Math.cos(spAngle) * spDist, tipY + Math.sin(spAngle) * spDist);
        ctx.strokeStyle = 'rgba(224, 242, 254, 0.85)';
        ctx.lineWidth = 1.2 * scale;
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
    }

    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // 3. VISIONOS PRISMATIC OPTICAL GLASS CARD (Phase 3)
  // --------------------------------------------------------------------------
  if (p3 > 0) {
    const cardScale = 0.72 + easeOutBack(p3, 1.38) * 0.28;
    const cardAlpha = clamp(p3 * 1.6, 0, 1);

    ctx.save();
    ctx.translate(cardX, cardY);
    ctx.scale(cardScale, cardScale);

    const hw = cardW / 2;
    const hh = cardH / 2;
    const r = 16 * scale;

    // 1. Frosted Glass Deep Obsidian Base
    ctx.beginPath();
    ctx.roundRect(-hw, -hh, cardW, cardH, r);
    const cardGrad = ctx.createLinearGradient(-hw, -hh, hw, hh);
    cardGrad.addColorStop(0, `rgba(15, 23, 42, ${cardAlpha * 0.90})`);
    cardGrad.addColorStop(1, `rgba(3, 7, 18, ${cardAlpha * 0.96})`);
    ctx.fillStyle = cardGrad;
    ctx.fill();

    // 2. Inner Inset Refraction Glow
    ctx.beginPath();
    ctx.roundRect(-hw + 2 * scale, -hh + 2 * scale, cardW - 4 * scale, cardH - 4 * scale, r - 2 * scale);
    ctx.strokeStyle = `rgba(255, 255, 255, ${cardAlpha * 0.14})`;
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();

    // 3. Prismatic Double-Beveled Border
    ctx.beginPath();
    ctx.roundRect(-hw, -hh, cardW, cardH, r);
    ctx.strokeStyle = `rgba(56, 189, 248, ${cardAlpha * 0.85})`;
    ctx.lineWidth = 2 * scale;
    ctx.stroke();

    // 4. Diamond Specular Glints on the 4 Chamfered Corners
    const glintSize = 8 * scale;
    const chamfers = [
      [-hw + 8 * scale, -hh + 8 * scale],
      [hw - 8 * scale, -hh + 8 * scale],
      [-hw + 8 * scale, hh - 8 * scale],
      [hw - 8 * scale, hh - 8 * scale],
    ];
    ctx.fillStyle = `rgba(255, 255, 255, ${cardAlpha * 0.95})`;
    chamfers.forEach(([gx, gy]) => {
      ctx.beginPath();
      ctx.moveTo(gx - glintSize, gy);
      ctx.lineTo(gx, gy - 2 * scale);
      ctx.lineTo(gx + glintSize, gy);
      ctx.lineTo(gx, gy + 2 * scale);
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(gx, gy - glintSize);
      ctx.lineTo(gx + 2 * scale, gy);
      ctx.lineTo(gx, gy + glintSize);
      ctx.lineTo(gx - 2 * scale, gy);
      ctx.fill();
    });

    // 5. High-Tech Precision Corner HUD Brackets
    const brkLen = 16 * scale;
    ctx.strokeStyle = `rgba(224, 242, 254, ${cardAlpha * 0.95})`;
    ctx.lineWidth = 2.5 * scale;
    // Top-Left
    ctx.beginPath();
    ctx.moveTo(-hw + brkLen, -hh);
    ctx.lineTo(-hw, -hh);
    ctx.lineTo(-hw, -hh + brkLen);
    ctx.stroke();
    // Top-Right
    ctx.beginPath();
    ctx.moveTo(hw - brkLen, -hh);
    ctx.lineTo(hw, -hh);
    ctx.lineTo(hw, -hh + brkLen);
    ctx.stroke();
    // Bottom-Left
    ctx.beginPath();
    ctx.moveTo(-hw, hh - brkLen);
    ctx.lineTo(-hw, hh);
    ctx.lineTo(-hw + brkLen, hh);
    ctx.stroke();
    // Bottom-Right
    ctx.beginPath();
    ctx.moveTo(hw - brkLen, hh);
    ctx.lineTo(hw, hh);
    ctx.lineTo(hw, hh - brkLen);
    ctx.stroke();

    // 6. Universal Clean Layout Inside Card (No Baked-In Text)
    // A. Header Skeleton Capsule Pill
    ctx.beginPath();
    ctx.roundRect(-hw + 28 * scale, -hh + 26 * scale, cardW * 0.44, 12 * scale, 6 * scale);
    ctx.fillStyle = `rgba(125, 211, 252, ${cardAlpha * 0.6})`;
    ctx.fill();

    // B. Subtitle Skeleton Line
    ctx.beginPath();
    ctx.roundRect(-hw + 28 * scale, -hh + 48 * scale, cardW * 0.68, 8 * scale, 4 * scale);
    ctx.fillStyle = `rgba(148, 163, 184, ${cardAlpha * 0.4})`;
    ctx.fill();

    // C. Top-Right Telemetry Mini Radar Dial
    const dialX = hw - 42 * scale;
    const dialY = -hh + 40 * scale;
    ctx.beginPath();
    ctx.arc(dialX, dialY, 14 * scale, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(56, 189, 248, ${cardAlpha * 0.6})`;
    ctx.lineWidth = 1.2 * scale;
    ctx.stroke();

    const sweepAngle = time * 4;
    ctx.beginPath();
    ctx.moveTo(dialX, dialY);
    ctx.lineTo(dialX + Math.cos(sweepAngle) * 14 * scale, dialY + Math.sin(sweepAngle) * 14 * scale);
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();

    // D. Dynamic Live Oscilloscope Soundwave Scanner
    ctx.beginPath();
    ctx.moveTo(-hw + 28 * scale, hh - 50 * scale);
    const waveWidth = cardW - 56 * scale;
    for (let wx = 0; wx <= waveWidth; wx += 4 * scale) {
      const nwx = wx / waveWidth;
      const wy = Math.sin(nwx * 18 - time * 9) * 15 * scale * p3;
      ctx.lineTo(-hw + 28 * scale + wx, hh - 50 * scale + wy);
    }
    ctx.strokeStyle = `rgba(56, 189, 248, ${cardAlpha * 0.9})`;
    ctx.lineWidth = 2.2 * scale;
    ctx.stroke();

    // E. Diagonal Specular Glass Reflection Sweep
    const sweepProgress = (time * 0.4) % 1;
    const sweepX = -hw - 100 * scale + sweepProgress * (cardW + 200 * scale);
    const sweepGrad = ctx.createLinearGradient(sweepX - 40 * scale, -hh, sweepX + 40 * scale, hh);
    sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    sweepGrad.addColorStop(0.5, `rgba(255, 255, 255, ${cardAlpha * 0.22})`);
    sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sweepGrad;
    ctx.roundRect(-hw, -hh, cardW, cardH, r);
    ctx.fill();

    ctx.restore();
  }

  // --------------------------------------------------------------------------
  // 4. SECONDARY AUXILIARY PROBE BRANCHES (Phase 4)
  // --------------------------------------------------------------------------
  if (p4 > 0) {
    const bAlpha = easeOutCubic(p4);
    ctx.save();
    for (let b = 0; b < 2; b++) {
      const bY = cardY + (b === 0 ? -65 * scale : 65 * scale);
      const bEndX = isVertical ? cardX + (b === 0 ? -95 * scale : 95 * scale) : cardX + cardW / 2 + 55 * scale;

      ctx.beginPath();
      ctx.moveTo(cardX + (isVertical ? 0 : cardW / 2), bY);
      ctx.lineTo(bEndX, bY);
      ctx.strokeStyle = `rgba(56, 189, 248, ${bAlpha * 0.7})`;
      ctx.lineWidth = 1.5 * scale;
      ctx.setLineDash([4 * scale, 4 * scale]);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(bEndX, bY, 4.5 * scale, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(224, 242, 254, ${bAlpha})`;
      ctx.fill();
    }
    ctx.restore();
  }

  // Optional Custom Text if user enabled it in controls
  if (config.showText && config.headlineText) {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = `700 ${22 * scale}px 'Plus Jakarta Sans', sans-serif`;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillText(config.headlineText, width / 2, 75 * scale);
    ctx.restore();
  }
}
