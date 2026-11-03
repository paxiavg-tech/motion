export type ResolutionPreset = '4k_uhd' | '2k_qhd' | '1080p_fhd' | 'vertical_4k' | 'vertical_1080p' | 'square_4k';

export interface ResolutionConfig {
  id: ResolutionPreset;
  label: string;
  width: number;
  height: number;
  aspectRatio: string;
  category: 'Landscape' | 'Vertical / Social' | 'Square';
}

export const RESOLUTION_PRESETS: Record<ResolutionPreset, ResolutionConfig> = {
  '4k_uhd': {
    id: '4k_uhd',
    label: '4K UHD Cinema (3840 × 2160)',
    width: 3840,
    height: 2160,
    aspectRatio: '16:9',
    category: 'Landscape',
  },
  '2k_qhd': {
    id: '2k_qhd',
    label: '2K QHD (2560 × 1440)',
    width: 2560,
    height: 1440,
    aspectRatio: '16:9',
    category: 'Landscape',
  },
  '1080p_fhd': {
    id: '1080p_fhd',
    label: '1080p Full HD (1920 × 1080)',
    width: 1920,
    height: 1080,
    aspectRatio: '16:9',
    category: 'Landscape',
  },
  'vertical_4k': {
    id: 'vertical_4k',
    label: 'Vertical 4K TikTok / Reels (2160 × 3840)',
    width: 2160,
    height: 3840,
    aspectRatio: '9:16',
    category: 'Vertical / Social',
  },
  'vertical_1080p': {
    id: 'vertical_1080p',
    label: 'Vertical 1080p Stories (1080 × 1920)',
    width: 1080,
    height: 1920,
    aspectRatio: '9:16',
    category: 'Vertical / Social',
  },
  'square_4k': {
    id: 'square_4k',
    label: 'Square Post 4K (2160 × 2160)',
    width: 2160,
    height: 2160,
    aspectRatio: '1:1',
    category: 'Square',
  },
};

export type BackgroundMode = 'black' | 'transparent' | 'chroma_green' | 'chroma_blue' | 'custom_gradient' | 'stock_texture';

export type ExportFormat = 'mp4' | 'webm' | 'png_sequence' | 'gif';

export type SimulationFootage = 'none' | 'concert' | 'fireplace';

export type CountdownStyle = 'roman_dial' | 'digital_hud' | 'cinematic_bold' | 'ring_gauge' | 'particle_digits' | 'minimalist_swiss';

export type PresetCategory =
  | 'Christmas, Holiday & Festive Sale'
  | 'Sequential Reveal & Visual Explainer'
  | 'Luxury & Gala 2027'
  | 'Cyber & Futuristic 2027'
  | 'Fireworks & Spectacle 2027'
  | 'Cinematic & Art Deco 2027'
  | 'Modern & Kinetic 2027'
  | 'Party & Confetti 2027'
  | 'Luxury Awards & Gala'
  | 'Corporate & Tech AI'
  | 'Wedding & Romance'
  | 'Ramadhan & Islamic'
  | 'Concert & VJ Loops'
  | 'News & Broadcast HUD'
  | 'Sport, Fitness & Esports'
  | 'Commercial Sale & Promo'
  | '2D Mascot & Animated Characters'
  | 'Custom Code';

export type TextDisplayMode = 'countdown_only' | 'clean_no_text' | 'full_with_year';

export type TextRenderStyle = 'pure_solid_font' | 'soft_glow_font' | 'outer_rim_smooth';

export interface MotionConfig {
  templateId: string;
  exportFileName?: string; // Custom clean export filename without extension
  resolution: ResolutionPreset;
  fps: 30 | 60;
  durationSeconds: number;
  bitrateMbps: number;
  backgroundMode: BackgroundMode;
  gradientStart: string;
  gradientEnd: string;
  stockTextureUrl?: string;

  // Particle & Physics parameters
  particleCount: number;
  particleSpeed: number;
  particleSize: number;
  glowIntensity: number;
  turbulence: number;
  colorPalette: 'gold_luxury' | 'emerald_ruby' | 'cyber_neon' | 'ice_aurora' | 'champagne_rose' | 'amber_warm';

  // Countdown & Typography parameters
  showText: boolean;
  textDisplayMode: TextDisplayMode; // 'countdown_only' | 'clean_no_text' | 'full_with_year'
  countdownStart: number; // e.g. 10, 5, 20
  countdownStyle: CountdownStyle;
  showCountdownDial: boolean;
  textRenderStyle?: TextRenderStyle; // 'pure_solid_font' (Font Murni Bersih Tanpa Garis Sambungan) | 'soft_glow_font' | 'outer_rim_smooth'
  headlineText: string;
  subtitleText: string;
  yearText: string;
  fontFamily: 'Cinzel' | 'Outfit' | 'Plus Jakarta Sans' | 'JetBrains Mono';
  goldShimmer: boolean;

  // Microstock Blend Mode Simulator (for testing on real footage in preview)
  simulationFootage?: SimulationFootage;

  // Custom Code option
  customCode?: string;
}

export interface MotionPreset {
  id: string;
  name: string;
  category: PresetCategory;
  countdownStyleLabel: string;
  description: string;
  tags: string[];
  thumbnail: string;
  defaultConfig: Partial<MotionConfig>;
  isCommercialHot: boolean;
  licensePrice?: string;
  loopSeamless: boolean;
  recommendedBlendMode: 'Screen / Add' | 'Direct Alpha' | 'Luma Key';
  recommendedResolution?: ResolutionPreset;
  recommendedAspectLabel?: string;
  aspectRatioNotice?: string;
  recommendedFps?: 30 | 60;
  fpsRationale?: string;
}

export interface RenderedDesignRecord {
  templateId: string;
  templateName: string;
  renderedAt: number; // timestamp in ms
  resolution: ResolutionPreset;
  fps: 30 | 60;
  format: ExportFormat;
  fileName: string;
}

export interface CommercialAssetItem {
  id: string;
  title: string;
  sku: string;
  theme: string;
  category: string;
  specs: string;
  previewImage: string;
  estimatedEarnings: string;
  downloadsCount: number;
  tags: string[];
  description: string;
  presetId: string;
  blendModeTip: string;
}

export interface RenderProgress {
  isRendering: boolean;
  currentFrame: number;
  totalFrames: number;
  percentage: number;
  fps: number;
  elapsedTime: number;
  estimatedRemaining: number;
  previewDataUrl?: string;
  statusText: string;
  error?: string;
  downloadUrl?: string;
  downloadFileName?: string;
  downloadType?: ExportFormat;
  metadata?: any;
  metadataJsonUrl?: string;
  metadataFileName?: string;
}
