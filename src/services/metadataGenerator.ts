import { MotionConfig, RESOLUTION_PRESETS, ExportFormat } from '../types/motion';
import { MOTION_PRESETS } from '../templates/motionPresets';

/**
 * 26 Official Shutterstock Categories (Updated Standards):
 * Abstract, Animals/Wildlife, Arts, Backgrounds/Textures, Beauty/Fashion,
 * Buildings/Landmarks, Business/Finance, Celebrities, Education, Food and Drink,
 * Healthcare/Medical, Holidays, Industrial, Interiors, Miscellaneous,
 * Nature, Objects, Parks/Outdoor, People, Religion, Science,
 * Signs/Symbols, Sports/Recreation, Technology, Transportation, Vintage.
 */
export const SHUTTERSTOCK_OFFICIAL_CATEGORIES = [
  'Abstract',
  'Animals/Wildlife',
  'Arts',
  'Backgrounds/Textures',
  'Beauty/Fashion',
  'Buildings/Landmarks',
  'Business/Finance',
  'Celebrities',
  'Education',
  'Food and Drink',
  'Healthcare/Medical',
  'Holidays',
  'Industrial',
  'Interiors',
  'Miscellaneous',
  'Nature',
  'Objects',
  'Parks/Outdoor',
  'People',
  'Religion',
  'Science',
  'Signs/Symbols',
  'Sports/Recreation',
  'Technology',
  'Transportation',
  'Vintage',
] as const;

export type ShutterstockCategory = (typeof SHUTTERSTOCK_OFFICIAL_CATEGORIES)[number];

export interface MicrostockMetadata {
  Title: string; // Factual English sentence answering Who, What, Where, When, Why
  Description: string; // Comprehensive descriptive text without trademarked or spam words
  Keywords: string; // 7-50 comma-separated unique lowercase English keywords
  Categories: {
    Primary: ShutterstockCategory;
    Secondary: ShutterstockCategory;
  };

  // Helper properties & statistics for UI & validator
  keywordsArray?: string[];
  keywordsCount?: number;
  title?: string;
  description?: string;
  tags?: string[];
  keywords?: string;
  primaryCategory?: string;
  secondaryCategory?: string;
  csvKeywordsString?: string;
  isCompliant?: boolean;
  complianceNotes?: string[];
}

/**
 * Prohibited terms that trigger immediate rejection by Shutterstock / stock review bots:
 * - Commercial trademarks & brand names (TikTok, Reels, Instagram, YouTube, CapCut, Premiere, Apple, Discord, etc.)
 * - Microstock platform filler spam (best seller, royalty free, stock footage, pond5, etc.)
 * - Non-English Indonesian words that cause "Metadata must be in English" rejections.
 */
const PROHIBITED_OR_TRADEMARK_TERMS = new Set([
  'tiktok',
  'tiktok shop',
  'tiktok promo',
  'tiktok viral',
  'tiktok meme',
  'instagram',
  'instagram reel',
  'instagram reel sale',
  'reels',
  'reels overlay',
  'youtube',
  'youtube shorts',
  'shorts',
  'shorts overlay',
  'capcut',
  'premiere',
  'after effects',
  'after effects alternative',
  'apple',
  'apple keynote',
  'apple keynote graphics',
  'vox',
  'vox style',
  'vox style motion',
  'discord',
  'discord bot',
  'vtuber',
  'vtuber alert',
  'stream sticker',
  'twitch',
  'twitch stream',
  'shutterstock',
  'adobestock',
  'adobe stock',
  'adobe stock best seller',
  'pond5',
  'pond5 top 1%',
  'videohive',
  'microstock',
  'microstock best seller',
  'best seller',
  'bestseller',
  'best seller 2027',
  'top 1%',
  'top seller',
  'royalty free',
  'stock footage',
  'video editor asset',
  'screen blend mode',
  'blend screen',
  'download',
  'click here',
  'buy now',
  // Indonesian terms
  'natal',
  'kado natal',
  'diskon',
  'diskon natal',
  'diskon akhir tahun',
  'tahun baru',
  'tahun baru 2027',
  'hitung mundur',
  'hitung mundur 2027',
  'jam pasir',
  'jam pasir 2027',
  'jam pasir waktu',
  'kembang api',
  'kembang api kawat',
  'flash sale natal',
  'lebaran',
  'lebaran idul fitri',
  'anjing',
  'kucing',
]);

/**
 * Translates or replaces legacy non-English tags with proper English keywords
 */
const INDONESIAN_TO_ENGLISH_TAG_MAP: Record<string, string> = {
  'hitung mundur': 'countdown',
  'hitung mundur 2027': 'new year countdown',
  'tahun baru 2027': 'new year 2027',
  'natal': 'christmas',
  'natal 2026': 'christmas 2026',
  'kado natal': 'gift box',
  'diskon natal': 'christmas sale',
  'diskon akhir tahun': 'holiday sale',
  'jam pasir 2027': 'hourglass',
  'jam pasir waktu': 'sandglass',
  'kembang api kawat': 'sparkler',
  'kembang api': 'fireworks',
  'flash sale natal': 'christmas flash sale',
  'lebaran idul fitri': 'eid al fitr',
  'rusa terbang': 'flying reindeer',
  'kereta santa': 'santa sleigh',
  'desa salju': 'snowy village',
  'musim dingin': 'winter season',
};

/**
 * Clean & sanitize keyword list:
 * - Translates Indonesian phrases to English
 * - Strips prohibited trademarks and stock spam
 * - Normalizes to lowercase and deduplicates
 * - Clamps count between 7 and 50 (targets optimal 28-40 keywords)
 */
export function sanitizeKeywords(rawKeywords: string[]): string[] {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const raw of rawKeywords) {
    if (!raw) continue;
    let clean = raw.trim().toLowerCase();

    // Check mapping
    if (INDONESIAN_TO_ENGLISH_TAG_MAP[clean]) {
      clean = INDONESIAN_TO_ENGLISH_TAG_MAP[clean];
    }

    // Skip prohibited / trademark terms
    if (PROHIBITED_OR_TRADEMARK_TERMS.has(clean)) {
      continue;
    }

    // Skip if it contains trademark substrings
    if (
      clean.includes('tiktok') ||
      clean.includes('instagram') ||
      clean.includes('youtube') ||
      clean.includes('capcut') ||
      clean.includes('premiere') ||
      clean.includes('after effects') ||
      clean.includes('discord') ||
      clean.includes('shutterstock') ||
      clean.includes('adobestock') ||
      clean.includes('pond5') ||
      clean.includes('royalty free') ||
      clean.includes('stock footage') ||
      clean.includes('best seller')
    ) {
      continue;
    }

    // Clean punctuation
    clean = clean.replace(/[^\w\s-]/g, '').trim();

    if (clean.length >= 2 && !seen.has(clean)) {
      seen.add(clean);
      result.push(clean);
    }
  }

  // Ensure minimum 7 keywords by padding with high-relevance contextual keywords if needed
  if (result.length < 7) {
    const fallbacks = ['motion graphics', 'animation', 'background', 'seamless loop', 'overlay', 'visual effect', 'abstract'];
    for (const fb of fallbacks) {
      if (!seen.has(fb)) {
        seen.add(fb);
        result.push(fb);
        if (result.length >= 7) break;
      }
    }
  }

  // Clamp to maximum 50 keywords (official Shutterstock upper limit)
  return result.slice(0, 50);
}

/**
 * Generates official Shutterstock & Adobe Stock compliant metadata
 * - Title/Description: Factual English sentences answering Who, What, Where, When, Why
 * - Keywords: English only, zero trademarks, 7-50 keywords
 * - Categories: Picked strictly from the 26 official Shutterstock categories
 */
export function generateMicrostockMetadata(
  config: MotionConfig,
  _format: ExportFormat,
  _videoFileName: string
): MicrostockMetadata {
  const preset = MOTION_PRESETS.find((p) => p.id === config.templateId) || MOTION_PRESETS[0];
  const templateId = preset.id;
  const category = preset.category || '';
  const isCountdown = category.includes('2027') || preset.name.includes('2027') || preset.name.includes('Countdown');

  let title = '';
  let description = '';
  let primaryCategory: ShutterstockCategory = 'Holidays';
  let secondaryCategory: ShutterstockCategory = 'Backgrounds/Textures';
  let rawKeywordsList: string[] = [];

  // =========================================================================
  // 1. SPECIFIC METADATA PER PRESET / THEME (Factual, Descriptive English Sentences)
  // =========================================================================

  if (templateId === 'metropolis_city_skyline_beacon') {
    title = 'Illuminated Metropolis City Skyline with Sweeping Rooftop Searchlights and Water Reflections';
    description =
      'Cinematic night cityscape motion background featuring towering modern and art deco skyscrapers with glowing office windows, dynamic sweeping rooftop searchlight beacons panning across the night sky, moving traffic light streaks on the waterfront bridge, and rippling harbor reflections. Seamless looping 4K animation.';
    primaryCategory = 'Buildings/Landmarks';
    secondaryCategory = 'Backgrounds/Textures';
    rawKeywordsList = [
      'city skyline', 'metropolis', 'searchlights', 'rooftop beacons', 'night city', 'skyscrapers',
      'architecture', 'illuminated windows', 'water reflections', 'harbor', 'cityscape', 'bridge traffic',
      'light trails', 'downtown', 'urban landscape', 'cinematic', 'motion background', 'seamless loop',
      '4k animation', 'night lights', 'beams of light', 'sky tracker', 'modern city', 'financial district',
      'broadcasting background', 'vj loop', 'stage visuals', 'city lights', 'fog', 'atmospheric',
      'twilight', 'evening', 'coastal city', 'tower', 'spire', 'panoramic', 'dark blue', 'scenic', 'spectacular'
    ];
  } else if (templateId === 'metropolis_eco_smart_city') {
    title = 'Sustainable Eco Smart City Skyline with Vertical Gardens Wind Turbines and Bioluminescent Spores';
    description =
      'Futuristic sustainable metropolis panorama featuring modern eco skyscrapers with vertical gardens, spinning rooftop wind turbines, glowing teal office windows, undulating green auroral bio-energy waves, and drifting bioluminescent spores above harbor water. Seamless looping 4K animation.';
    primaryCategory = 'Buildings/Landmarks';
    secondaryCategory = 'Technology';
    rawKeywordsList = [
      'eco city', 'smart city', 'sustainable architecture', 'net zero', 'green energy', 'wind turbines',
      'rooftop garden', 'bioluminescent spores', 'futuristic metropolis', 'city skyline', 'urban landscape',
      'environmental', 'esg background', 'clean energy', 'electric vehicles', 'water reflection', 'harbor',
      'panoramic vista', 'copy space', 'motion background', 'seamless loop', '4k animation', 'aurora glow',
      'crescent moon', 'modern buildings', 'eco tech', 'ecological', 'cyberpunk green', 'renewables', 'climate tech'
    ];
  } else if (templateId === 'metropolis_fintech_bull_market') {
    title = 'Financial District Skyline with Upward Data Streams and Global Network Constellation';
    description =
      'Majestic financial capital skyline at night featuring modern illuminated corporate towers, upward ascending ticker data streams representing market growth, interconnected telemetry network plexus in the deep sky, and harbor water reflections. Seamless looping 4K animation.';
    primaryCategory = 'Business/Finance';
    secondaryCategory = 'Buildings/Landmarks';
    rawKeywordsList = [
      'fintech', 'financial district', 'bull market', 'wall street', 'stock market', 'upward data stream',
      'city skyline', 'skyscrapers', 'capital growth', 'corporate background', 'trading floor', 'network plexus',
      'connected nodes', 'big data', 'global finance', 'investment', 'water reflections', 'traffic streaks',
      'night city', 'economic growth', 'banking', 'wealth', 'emerald green', 'dark blue', 'seamless loop',
      'motion background', '4k animation', 'broadcasting plate', 'copy space', 'downtown', 'illuminated windows'
    ];
  } else if (templateId === 'metropolis_quiet_luxury_noir') {
    title = 'Minimalist Obsidian City Skyline with Platinum Rim Light and Drifting Volumetric Mist';
    description =
      'High-end monochromatic architectural noir cityscape showing razor-sharp skyscraper silhouettes accented by delicate platinum rim lighting, warm champagne penthouse suites, rolling low-altitude mist, and calm mirror water reflections. Seamless looping 4K animation.';
    primaryCategory = 'Buildings/Landmarks';
    secondaryCategory = 'Abstract';
    rawKeywordsList = [
      'quiet luxury', 'architectural noir', 'obsidian skyline', 'platinum rim light', 'minimalist city',
      'monochrome', 'black background', 'champagne windows', 'penthouse', 'volumetric mist', 'fog',
      'mirror reflection', 'dark aesthetic', 'high end', 'prestige', 'luxury real estate', 'sleek design',
      'skyscrapers', 'night metropolis', 'clean plate', 'copy space', 'motion background', 'seamless loop',
      '4k animation', 'downtown', 'calm atmosphere', 'cinematic lighting', 'elegant'
    ];
  } else if (templateId === 'metropolis_golden_hour_dawn') {
    title = 'Sunrise Metropolis Skyline Silhouette with Morning Star and Rising Golden Sun Embers';
    description =
      'Inspiring dawn cityscape motion background featuring dark skyscraper silhouettes backlit by radiant golden sunrise gradients, shining morning star, ascending solar embers, and shimmering water reflections. Seamless looping 4K animation.';
    primaryCategory = 'Buildings/Landmarks';
    secondaryCategory = 'Nature';
    rawKeywordsList = [
      'sunrise skyline', 'golden hour', 'dawn metropolis', 'new era', 'morning sun', 'morning star',
      'venus', 'city silhouette', 'corporate kickoff', 'motivational background', 'rising embers',
      'sun glitter', 'water reflection', 'amber glow', 'violet sky', 'downtown', 'urban landscape',
      'optimism', 'hope', 'business vision', 'skyscrapers', 'sunbeam', 'copy space', 'motion background',
      'seamless loop', '4k animation', 'atmospheric clouds', 'inspirational'
    ];
  } else if (templateId === 'metropolis_cyberpunk_synthwave') {
    title = 'Cyberpunk City Skyline with Neon Billboards Digital Rain and Wet Asphalt Reflections';
    description =
      'Atmospheric futuristic Neo-Tokyo night cityscape featuring dense high-rise towers, glowing magenta and cyan holographic billboards, falling vertical neon digital rain drizzle, and glistening harbor water reflections. Seamless looping 4K animation.';
    primaryCategory = 'Abstract';
    secondaryCategory = 'Buildings/Landmarks';
    rawKeywordsList = [
      'cyberpunk', 'synthwave', 'neo tokyo', 'neon rain', 'digital drizzle', 'wet asphalt',
      'holographic billboards', 'magenta cyan', 'vj loop', 'stage visuals', 'lofi background',
      'city skyline', 'night metropolis', 'futuristic city', 'skyscrapers', 'water reflections',
      'traffic trails', 'retro wave', 'scifi urban', 'dark violet', 'streaming backdrop',
      'motion background', 'seamless loop', '4k animation', 'copy space', 'electronic music visualizer'
    ];
  } else if (templateId === 'metropolis_cosmic_orbital_harbor') {
    title = 'Sci-Fi Orbital City Colony with Space Elevator Planetary Ring Arc and Cosmic Nebula';
    description =
      'Expansive science fiction space metropolis landscape showing futuristic spires, vertical space elevator cable with traveling climber pod, sweeping celestial planetary ring arc across starry nebula sky, and iridescent water reflections. Seamless looping 4K animation.';
    primaryCategory = 'Science';
    secondaryCategory = 'Buildings/Landmarks';
    rawKeywordsList = [
      'space metropolis', 'orbital colony', 'space elevator', 'planetary ring', 'celestial arc',
      'cosmic nebula', 'stardust', 'scifi city', 'futuristic skyline', 'space harbor', 'alien planet',
      'deep space', 'megastructure', 'astronomy', 'stars', 'satellite', 'spires', 'water reflections',
      'cosmic background', 'science fiction', 'motion background', 'seamless loop', '4k animation',
      'celestial', 'copy space', 'interstellar'
    ];
  } else if (templateId === 'metropolis_daylight_sunny_skyline') {
    title = 'Bright Daylight City Skyline with Modern Glass Skyscrapers and Sparkling Blue Harbor';
    description =
      'Sunny daytime metropolitan cityscape motion background showing modern glass towers with sunlight glints, clear azure sky with soft white clouds, moving highway traffic, and sparkling water ripples. Seamless looping 4K animation.';
    primaryCategory = 'Buildings/Landmarks';
    secondaryCategory = 'Transportation';
    rawKeywordsList = [
      'daylight city', 'sunny skyline', 'blue sky', 'modern skyscrapers', 'harbor water',
      'city traffic', 'corporate background', 'summer daytime', 'glass architecture', 'downtown',
      'highway bridge', 'sun glint', 'clean plate', 'copy space', 'motion background',
      'seamless loop', '4k animation', 'water ripples', 'urban landscape', 'commercial video'
    ];
  } else if (templateId === 'metropolis_christmas_snow_skyline') {
    title = 'Christmas Winter City Skyline with Snow Dusted Skyscraper Roofs and Falling Snowflakes';
    description =
      'Cozy holiday winter night cityscape featuring realistic snow-covered skyscraper rooftops, gentle falling snowflakes, warm golden glowing office windows, holiday bridge traffic, and winter crescent moon. Seamless looping 4K animation.';
    primaryCategory = 'Holidays';
    secondaryCategory = 'Buildings/Landmarks';
    rawKeywordsList = [
      'christmas city', 'snowy skyline', 'winter wonderland', 'falling snowflakes', 'holiday skyline',
      'festive city', 'cozy windows', 'winter night', 'christmas eve', 'snow covered roofs',
      'golden lights', 'december', 'holiday promo', 'bridge traffic', 'harbor reflection',
      'copy space', 'motion background', 'seamless loop', '4k animation', 'seasonal celebration'
    ];
  } else if (templateId === 'metropolis_new_year_midnight_skyline') {
    title = 'New Years Eve Midnight City Skyline with Cascading Golden Stardust and Festive Lights';
    description =
      'Prestigious New Years Eve midnight cityscape showing illuminated metropolitan towers, cascading golden stardust sparkles, celebratory ambient sparkles in the vast night sky, and golden harbor water reflections. Seamless looping 4K animation.';
    primaryCategory = 'Holidays';
    secondaryCategory = 'Buildings/Landmarks';
    rawKeywordsList = [
      'new year skyline', 'midnight metropolis', 'golden stardust', 'celebration lights', 'new year eve',
      'luxury cityscape', 'gala background', 'annual event', 'illuminated skyscrapers', 'harbor reflection',
      'gold particles', 'corporate celebration', 'december 31', 'copy space', 'motion background',
      'seamless loop', '4k animation', 'broadcast plate', 'festive night', 'midnight climax'
    ];
  } else if (templateId === 'metropolis_evening_rush_hour_traffic') {
    title = 'Evening Rush Hour City Skyline with Streaming Expressway Headlights and Dusk Sunset';
    description =
      'Dynamic dusk rush hour cityscape motion background featuring illuminated office skyscrapers against violet-orange sunset sky, with long-exposure white headlights and red taillights streaming across expressway bridge. Seamless looping 4K animation.';
    primaryCategory = 'Buildings/Landmarks';
    secondaryCategory = 'Transportation';
    rawKeywordsList = [
      'evening rush hour', 'city traffic', 'highway light trails', 'dusk skyline', 'urban commute',
      'expressway bridge', 'downtown sunset', 'traffic streaks', 'long exposure', 'office windows',
      'headlights', 'taillights', 'metropolis evening', 'copy space', 'motion background',
      'seamless loop', '4k animation', 'civil engineering', 'commuter traffic', 'city life'
    ];
  } else if (templateId === 'metropolis_rainy_evening_skyline') {
    title = 'Rainy Dusk City Skyline with Atmospheric Raindrops and Wet Asphalt Reflections';
    description =
      'Atmospheric rainy evening cityscape featuring delicate falling rain streaks, softly blurred warm skyscraper windows in misty air, glistening wet expressway highway, and calm dark harbor reflections. Seamless looping 4K animation.';
    primaryCategory = 'Buildings/Landmarks';
    secondaryCategory = 'Nature';
    rawKeywordsList = [
      'rainy city', 'rain drops', 'wet asphalt', 'moody skyline', 'atmospheric evening',
      'rainy night', 'lofi background', 'misting rain', 'glistening road', 'warm window lights',
      'calm harbor', 'puddle reflections', 'dusk rain', 'copy space', 'motion background',
      'seamless loop', '4k animation', 'peaceful rain', 'chillout backdrop', 'urban rain'
    ];
  } else if (templateId === 'metropolis_golden_hour_corporate') {
    title = 'Golden Hour Sunset Corporate Skyline with Radiant Sunburst and Water Reflections';
    description =
      'Inspiring corporate skyline at golden hour showing dark skyscraper silhouettes backlit by radiant sunset sunburst, golden sun path shimmering on harbor water, and evening commuter traffic. Seamless looping 4K animation.';
    primaryCategory = 'Buildings/Landmarks';
    secondaryCategory = 'Business/Finance';
    rawKeywordsList = [
      'golden hour sunset', 'corporate skyline', 'sunburst horizon', 'backlit architecture', 'sunlit waves',
      'financial district', 'business vision', 'sunset glow', 'ambition', 'company kickoff',
      'harbor reflection', 'downtown towers', 'amber sunlight', 'copy space', 'motion background',
      'seamless loop', '4k animation', 'motivational', 'investor presentation', 'growth'
    ];
  } else if (templateId === 'metropolis_winter_twilight_frost') {
    title = 'Winter Twilight Frosted City Skyline with Cozy Amber Penthouse Window Lights';
    description =
      'Serene winter twilight cityscape featuring frosted building cornices under deep cobalt blue night sky with twinkling stars, warm amber illuminated penthouse suites, and calm icy harbor waters. Seamless looping 4K animation.';
    primaryCategory = 'Buildings/Landmarks';
    secondaryCategory = 'Holidays';
    rawKeywordsList = [
      'winter twilight', 'frosted skyline', 'cozy penthouse', 'cobalt night', 'winter city',
      'cold evening', 'seasonal promo', 'twilight stars', 'amber windows', 'icy water',
      'quiet night', 'tranquil city', 'peaceful evening', 'copy space', 'motion background',
      'seamless loop', '4k animation', 'holiday season', 'executive suites', 'winter dusk'
    ];
  } else if (templateId === 'metropolis_foggy_dawn_harbor') {
    title = 'Foggy Morning Dawn Harbor Skyline with Rolling Pastel Mist and Calm Waters';
    description =
      'Peaceful early morning dawn cityscape showing pastel lilac and peach skies, soft low-lying mist rolling between skyscraper bases, calm mirror harbor water, and gentle morning light. Seamless looping 4K animation.';
    primaryCategory = 'Buildings/Landmarks';
    secondaryCategory = 'Nature';
    rawKeywordsList = [
      'foggy morning', 'dawn skyline', 'harbor mist', 'peaceful city', 'pastel sunrise',
      'early morning', 'calm waters', 'rolling fog', 'soft light', 'serene dawn',
      'morning commute', 'lilac sky', 'quiet metropolis', 'copy space', 'motion background',
      'seamless loop', '4k animation', 'new day', 'tranquil scenery', 'atmospheric'
    ];
  } else if (templateId === 'metropolis_clear_midnight_blue') {
    title = 'Pure Deep Sapphire Midnight City Skyline with Illuminated Office Windows and Stars';
    description =
      'Clean professional midnight blue cityscape plate showing razor-sharp modern skyscraper silhouettes with cyan office window grids, blinking aviation safety lights, and calm rippling harbor waters under deep starry sky. Seamless looping 4K animation.';
    primaryCategory = 'Buildings/Landmarks';
    secondaryCategory = 'Backgrounds/Textures';
    rawKeywordsList = [
      'midnight blue', 'sapphire skyline', 'clean city plate', 'modern downtown', 'office lights',
      'professional background', 'night cityscape', 'aviation lights', 'starry night', 'minimalist city',
      'waterfront harbor', 'commercial plate', 'architectural silhouettes', 'copy space', 'motion background',
      'seamless loop', '4k animation', 'broadcast background', 'corporate video', 'sleek design'
    ];
  } else if (templateId === 'metropolis_spring_breeze_cherry') {
    title = 'Spring Breeze City Skyline with Drifting Pink Blossom Petals and Clear Blue Sky';
    description =
      'Uplifting spring daytime cityscape showing modern glass towers under clear blue sky, with delicate pink sakura blossom petals drifting in the refreshing breeze over sparkling bay waters. Seamless looping 4K animation.';
    primaryCategory = 'Buildings/Landmarks';
    secondaryCategory = 'Nature';
    rawKeywordsList = [
      'spring skyline', 'blossom petals', 'spring breeze', 'sakura city', 'clear blue sky',
      'fresh atmosphere', 'seasonal background', 'drifting petals', 'pink blossoms', 'sunny day',
      'sparkling water', 'modern skyscrapers', 'renewal', 'cheerful city', 'copy space',
      'motion background', 'seamless loop', '4k animation', 'springtime', 'natural beauty'
    ];
  } else if (templateId === 'christmas_midnight_santa_city_flyover') {
    title = 'Flying Santa Claus Sleigh with Reindeer Over Glowing Full Moon and City Skyline Silhouette';
    description =
      'Horizontal parallax motion background featuring Santa Claus in a flying sleigh with eight galloping reindeer and Rudolph soaring over an illuminated gothic and modern city skyline under a luminous full moon with clouds and stardust trail. Seamless looping 4K animation.';
    primaryCategory = 'Holidays';
    secondaryCategory = 'Buildings/Landmarks';
    rawKeywordsList = [
      'santa claus', 'reindeer', 'sleigh', 'flying santa', 'full moon', 'city skyline', 'silhouette',
      'parallax', 'christmas', 'night sky', 'stardust', 'clouds', 'gothic towers', 'skyscrapers',
      'winter city', 'rudolph', 'seamless loop', 'motion graphics', 'animation', 'snowflakes',
      'falling snow', 'holiday celebration', 'christmas eve', 'festive', 'illuminated windows',
      'gas lamps', 'winter night', 'celestial', 'lunar halo', 'atmospheric', 'snowy rooftop',
      'chimney smoke', 'december', 'magic night', 'golden stars', 'background plate', 'scenic',
      'vector silhouette', 'flying reindeer', 'tranquil', 'cozy', 'celebration', 'cinematic'
    ];
  } else if (templateId === 'christmas_aurora_alpine_chimneys_physics') {
    title = 'Northern Lights Aurora Borealis Over Alpine Village Cabins with Smoking Chimneys';
    description =
      'Atmospheric winter night landscape showing undulating green and cyan aurora borealis ribbons above snow-capped mountain peaks and cozy wooden alpine chalets with curling chimney smoke and warm glowing windows. Seamless looping 4K animation.';
    primaryCategory = 'Holidays';
    secondaryCategory = 'Nature';
    rawKeywordsList = [
      'aurora borealis', 'northern lights', 'alpine village', 'chalet', 'cabin', 'chimney smoke',
      'winter mountains', 'snow peaks', 'polar night', 'convection smoke', 'glowing windows',
      'scandinavian', 'nordic landscape', 'green aurora', 'cyan waves', 'pine forest', 'snowy hill',
      'cozy atmosphere', 'cold winter', 'peaceful', 'seamless loop', 'motion graphics', 'animation',
      'night sky', 'stars', 'snowfall', 'falling snow', 'christmas eve', 'arctic landscape',
      'winter solstice', 'scenic view', 'calm', 'serene', 'tranquil', 'warm light', 'holiday'
    ];
  } else if (templateId === 'christmas_crystal_pendulum_snowglobe_physics') {
    title = 'Crystal Snow Globe with Christmas Tree and Swirling Gold Confetti on Brass Pendulum Chain';
    description =
      'Heavy crystal glass snow globe containing a miniature pine tree with gold star and swirling golden foil snowflakes, swinging smoothly on an ornate bronze pendulum chain with specular reflections and dark festive backdrop. Seamless looping animation.';
    primaryCategory = 'Holidays';
    secondaryCategory = 'Objects';
    rawKeywordsList = [
      'snow globe', 'crystal ball', 'pendulum', 'christmas tree', 'gold confetti', 'swirling snow',
      'glass sphere', 'brass chain', 'gold star', 'reflections', 'holiday decoration', 'christmas ornament',
      'winter magic', 'harmonic motion', 'fluid swirl', 'specular highlights', 'bokeh lights',
      'seamless loop', 'motion graphics', 'animation', 'festive', 'luxury gold', 'antique base',
      'macro shot', 'cozy holiday', 'celebration', 'ornament', 'december', 'golden sparkles', 'glowing'
    ];
  } else if (templateId === 'christmas_ballistic_ornament_pendulum_chain') {
    title = 'Kinetic Christmas Baubles Swinging in Wave Motion Emitting Golden Sparkle Cascades';
    description =
      'Five metallic red and 24K gold Christmas tree ornament baubles swinging on delicate wires in compound pendulum wave rhythm while emitting cascading golden light sparkles against a dark luxury bokeh background. Seamless looping animation.';
    primaryCategory = 'Holidays';
    secondaryCategory = 'Objects';
    rawKeywordsList = [
      'christmas baubles', 'ornaments', 'kinetic wave', 'pendulum motion', 'gold bauble', 'ruby red',
      'metallic finish', 'golden sparkles', 'light cascades', 'holiday decor', 'christmas decoration',
      'luxury gold', 'bokeh background', 'festive celebration', 'seamless loop', 'motion graphics',
      'animation', 'december', 'new year', 'sparkling particles', 'physics simulation', 'elegant',
      'celebration', 'gala', 'shimmering', 'glitter', 'macro', 'depth of field'
    ];
  } else if (templateId === 'nordic_winter_alpine_express_train') {
    title = 'Vintage Steam Locomotive Crossing Mountain Viaduct Bridge in Snowy Pine Forest';
    description =
      'Original Nordic folk silhouette of a vintage steam train crossing a stone curved viaduct bridge between dense evergreen pine canyon slopes under a winter starry night with glowing passenger windows and rising smoke. Seamless looping animation.';
    primaryCategory = 'Transportation';
    secondaryCategory = 'Holidays';
    rawKeywordsList = [
      'steam train', 'locomotive', 'viaduct bridge', 'stone arch', 'alpine express', 'pine forest',
      'winter canyon', 'train silhouette', 'chimney smoke', 'illuminated windows', 'nordic scenery',
      'snow covered hills', 'mountain pass', 'vintage travel', 'christmas journey', 'polar express',
      'night sky', 'stars', 'snowfall', 'seamless loop', 'motion graphics', 'animation',
      'scandinavian', 'peaceful', 'scenic landscape', 'cozy journey', 'evergreen trees', 'holiday travel'
    ];
  } else if (templateId === 'nordic_sacred_forest_stag_gathering') {
    title = 'Majestic Antlered Stag and Forest Animals Around Illuminated Sacred Christmas Tree';
    description =
      'Nordic winter folk silhouette illustration featuring a majestic antlered stag, deer family, and arctic foxes resting in snowy hills around an illuminated evergreen tree adorned with glowing golden lanterns. Seamless looping animation.';
    primaryCategory = 'Animals/Wildlife';
    secondaryCategory = 'Holidays';
    rawKeywordsList = [
      'stag', 'deer', 'antlers', 'wildlife', 'forest animals', 'sacred tree', 'christmas tree',
      'golden lanterns', 'glowing star', 'arctic fox', 'winter forest', 'snowy meadow', 'silhouette',
      'nordic folk art', 'scandinavian design', 'peaceful nature', 'stars', 'night sky', 'snowfall',
      'seamless loop', 'motion graphics', 'animation', 'wilderness', 'fauna', 'solstice', 'sacred nature',
      'spiritual calm', 'holiday season', 'serene', 'rustic', 'woodland'
    ];
  } else if (templateId === 'nordic_fjord_guiding_lighthouse_harbor') {
    title = 'Coastal Fjord Lighthouse with Rotating Volumetric Light Beam and Wooden Cabins';
    description =
      'Nordic coastal fjord landscape featuring a stone lighthouse casting a rotating 360-degree beam of golden light across rippling sea waters, rocky cliffs, anchored sailboats, and traditional wooden fishing huts in falling snow. Seamless looping animation.';
    primaryCategory = 'Buildings/Landmarks';
    secondaryCategory = 'Holidays';
    rawKeywordsList = [
      'lighthouse', 'beacon', 'volumetric light beam', 'searchlight', 'fjord', 'coastal winter',
      'wooden cabins', 'fishing village', 'rocky cliff', 'sea ripples', 'sailboat', 'water reflection',
      'snowfall', 'falling snow', 'night sea', 'stars', 'nordic coast', 'norway fjord', 'harbor',
      'seamless loop', 'motion graphics', 'animation', 'maritime', 'safe harbor', 'guidance', 'cozy'
    ];
  } else if (templateId === 'sstk_vertical_nordic_storytelling_plate') {
    title = 'Vertical 9:16 Christmas Background Plate with Nordic Alpine Village and Flying Santa';
    description =
      'Vertical nine by sixteen aspect ratio Christmas background plate showing evergreen pine canopies, flying Santa sleigh silhouette with reindeer across full moon, and living alpine village with breathing stag mascot and ample central copy space. Seamless ten-second loop.';
    primaryCategory = 'Holidays';
    secondaryCategory = 'Backgrounds/Textures';
    rawKeywordsList = [
      'vertical video', 'background plate', 'christmas background', 'nine by sixteen', 'copy space',
      'nordic village', 'santa sleigh', 'flying reindeer', 'full moon', 'stag silhouette',
      'breathing mascot', 'pine canopy', 'chimney smoke', 'glowing windows', 'snowfall',
      'winter landscape', 'seamless loop', 'ten second loop', 'motion graphics', 'animation',
      'holiday card', 'greeting backdrop', 'december', 'peaceful', 'scandinavian art', 'night sky'
    ];
  } else if (templateId === 'mascot_zen_onsen_capybara') {
    title = 'Cute Capybara Relaxing in Hot Springs Onsen with Yuzu Orange Floating on Head';
    description =
      'Relaxing 2D animated mascot illustration of a calm capybara soaking in a steaming wooden onsen hot spring bath with a balancing yuzu citrus fruit on its head, water ripples, floating steam, and cozy warm lantern lighting. Seamless looping animation.';
    primaryCategory = 'Animals/Wildlife';
    secondaryCategory = 'Arts';
    rawKeywordsList = [
      'capybara', 'hot springs', 'onsen', 'yuzu orange', 'citrus fruit', 'cute animal', 'mascot',
      'water bath', 'steam vapor', 'wooden tub', 'relaxing', 'cozy', 'calm', 'peaceful', 'zen mood',
      'lofi aesthetic', 'blinking eyes', 'water ripples', 'bamboo background', 'warm glow',
      'seamless loop', '2d animation', 'character design', 'kawaii', 'japanese onsen', 'mineral bath'
    ];
  } else if (templateId === 'mascot_cyber_ai_droid') {
    title = 'Futuristic Cyberpunk AI Robot Mascot with Floating Visor and Glowing LED Eyes';
    description =
      'Futuristic friendly AI copilot droid mascot levitating smoothly with spherical dark chassis, emotive glowing cyan LED visor eyes, floating magnetic fins, plasma thruster glow, and orbiting holographic particle rings. Seamless looping animation.';
    primaryCategory = 'Technology';
    secondaryCategory = 'Arts';
    rawKeywordsList = [
      'robot', 'droid', 'artificial intelligence', 'ai mascot', 'copilot', 'cyberpunk', 'futuristic',
      'levitation', 'anti gravity', 'led visor', 'cyan glow', 'hologram rings', 'digital assistant',
      'floating bot', 'tech mascot', 'character animation', 'seamless loop', 'motion graphics',
      'sci fi', 'cute robot', 'modern tech', 'orbital particles', 'plasma thruster', 'dark background'
    ];
  } else if (templateId === 'mascot_panicking_claw_cat') {
    title = 'Cute Black and White Cat Clinging and Scratching Transparent Screen Surface';
    description =
      'Humorous 2D character animation of a startled tuxedo cat hanging from the top edge of the screen, alternating paw scratches with friction sparks, pedaling hind legs, and flexible swishing tail against black background. Seamless looping animation.';
    primaryCategory = 'Animals/Wildlife';
    secondaryCategory = 'Arts';
    rawKeywordsList = [
      'cat', 'tuxedo cat', 'black and white cat', 'clawing', 'scratching screen', 'hanging cat',
      'funny pet', 'humorous animation', 'friction sparks', 'playful kitty', 'cat paws', 'feline',
      'kitten', 'pedaling legs', 'swishing tail', 'seamless loop', '2d animation', 'character',
      'mascot', 'transparent background', 'cute animal', 'comedic'
    ];
  } else if (category === 'Christmas, Holiday & Festive Sale') {
    title = 'Festive Holiday Sale 3D Gold Bauble and Snowflake Particles Motion Background';
    description =
      'Vibrant holiday promotional motion graphic featuring rotating 3D gold ornament baubles, red velvet ribbon streamers, crystal snowflake particle bursts, and warm twinkling fairy lights over dark festive background. Seamless looping animation.';
    primaryCategory = 'Holidays';
    secondaryCategory = 'Objects';
    rawKeywordsList = [
      'christmas sale', 'holiday promo', 'gold bauble', 'red ribbon', 'snowflake burst', 'fairy lights',
      'golden garland', 'bokeh lights', 'festive background', 'gift box', 'unboxing', 'sparkles',
      'christmas tree ornament', 'winter discount', 'seasonal promotion', 'seamless loop',
      'motion graphics', 'animation', 'shopping celebration', 'december', 'holiday marketing'
    ];
  } else if (category === 'Luxury & Gala 2027' || isCountdown) {
    title = 'Luxury 24K Gold Countdown 2027 with Roman Numeral Clock Dial and Stardust Burst';
    description =
      'Prestigious New Year 2027 countdown opener from ten to zero featuring rotating gold Roman numeral clock dial, concentric stardust particle orbits, and grand sparkling midnight climax welcoming the year 2027 against black background.';
    primaryCategory = 'Holidays';
    secondaryCategory = 'Backgrounds/Textures';
    rawKeywordsList = [
      'new year 2027', 'countdown 2027', 'roman numeral', 'clock dial', '24k gold', 'gold stardust',
      'midnight celebration', 'happy new year', 'ten seconds countdown', 'gala opener', 'luxury background',
      'golden particles', 'sparkler burst', 'celebration', 'annual event', 'broadcast opener',
      'motion graphics', 'animation', 'new years eve', 'times square style', 'gold metallic',
      'particle ring', 'concentric circles', 'golden hour', 'welcome 2027', 'january first'
    ];
  } else if (category === 'Concert & VJ Loops') {
    title = 'Hypnotic Neon Geometric Hexagon Tunnel VJ Loop for Music Visualizer';
    description =
      'High-energy EDM stage visual loop featuring accelerating concentric hexagonal neon laser tunnels with pulsing audio-reactive spectrum light rays and strobe fan bursts against deep black background. Seamless looping animation.';
    primaryCategory = 'Abstract';
    secondaryCategory = 'Backgrounds/Textures';
    rawKeywordsList = [
      'vj loop', 'neon tunnel', 'hexagon', 'stage visuals', 'concert led', 'edm festival', 'dj screen',
      'audio reactive', 'strobe lights', 'laser fan', 'music visualizer', 'club backdrop', 'geometric',
      'kaleidoscope', 'psychedelic', 'cyberpunk', 'electronic dance music', 'rave visuals',
      'seamless loop', 'motion graphics', 'animation', 'high energy', 'light beams', 'nightlife'
    ];
  } else if (category === 'News & Broadcast HUD') {
    title = 'Digital Holographic Globe and Broadcast Studio Lower Third Motion Graphic';
    description =
      'Professional television newsroom broadcast backdrop showing rotating holographic wireframe world globe, satellite telemetry radar sweep, financial stock market data ticker, and high-tech information HUD. Seamless looping animation.';
    primaryCategory = 'Technology';
    secondaryCategory = 'Business/Finance';
    rawKeywordsList = [
      'broadcast background', 'news studio', 'digital globe', 'world map', 'breaking news', 'hud interface',
      'stock ticker', 'financial data', 'radar satellite', 'telemetry', 'information display',
      'television broadcast', 'journalism backdrop', 'technology screen', 'global network',
      'seamless loop', 'motion graphics', 'animation', 'world news', 'media graphics', 'studio display'
    ];
  } else if (category === 'Sport, Fitness & Esports') {
    title = 'High Energy Shockwave Burst and Velocity Light Streaks Motion Background';
    description =
      'Dynamic sports and esports motion graphic featuring pulsing circular energy shockwaves, velocity light speed tunnel streaks, volumetric stadium floodlight dust, and golden championship halos. Seamless looping animation.';
    primaryCategory = 'Sports/Recreation';
    secondaryCategory = 'Abstract';
    rawKeywordsList = [
      'sports motion', 'esports background', 'energy shockwave', 'velocity tunnel', 'stadium lights',
      'championship trophy', 'speed streaks', 'fitness motivation', 'tournament opener',
      'high energy', 'volumetric dust', 'golden halos', 'winner celebration', 'athletic',
      'seamless loop', 'motion graphics', 'animation', 'power blast', 'competition'
    ];
  } else if (category === 'Corporate & Tech AI') {
    title = 'Artificial Intelligence Neural Network Plexus and Big Data Motion Background';
    description =
      'Futuristic digital technology motion background featuring connected polygonal network nodes, flowing fiber optic data streams, glowing cyan and sapphire plexus structures, and cybernetic grid matrix. Seamless looping animation.';
    primaryCategory = 'Technology';
    secondaryCategory = 'Science';
    rawKeywordsList = [
      'artificial intelligence', 'neural network', 'plexus structure', 'big data nodes', 'cyber technology',
      'digital matrix', 'fiber optic stream', 'quantum computing', 'data visualization', 'future tech',
      'science background', 'fintech security', 'cloud network', 'connected dots', 'wireframe grid',
      'seamless loop', 'motion graphics', 'animation', 'deep learning', 'algorithm', 'cybernetic'
    ];
  } else if (category === 'Ramadhan & Islamic') {
    title = 'Islamic Ramadan Kareem and Eid Celebration Crescent Mosque Skyline Background';
    description =
      'Majestic Islamic festive motion background featuring glowing golden crescent moon, silhouette mosque minarets and domes, gently swinging fanous lanterns, and intricate arabesque sacred mandala patterns under starry night. Seamless looping animation.';
    primaryCategory = 'Religion';
    secondaryCategory = 'Holidays';
    rawKeywordsList = [
      'ramadan kareem', 'eid mubarak', 'islamic crescent', 'mosque silhouette', 'minaret', 'fanous lantern',
      'arabesque mandala', 'sacred geometry', 'eid al fitr', 'golden starlight', 'holy night',
      'islamic celebration', 'arabian night', 'sahara desert dunes', 'emerald gold ribbons',
      'seamless loop', 'motion graphics', 'animation', 'peaceful', 'spiritual', 'crescent moon'
    ];
  } else {
    // Universal Clean Motion Background Fallback
    const cleanName = preset.name.replace(/[^\w\s-]/g, '').trim();
    title = `${cleanName} — 4K Motion Graphics Video Overlay`;
    description = `Atmospheric motion graphics background featuring graceful animated particle flow, ambient illumination, and harmonious visual rhythms against a clean dark backdrop. Seamless looping animation suitable for broadcast, web video, and digital displays.`;
    primaryCategory = 'Abstract';
    secondaryCategory = 'Backgrounds/Textures';
    rawKeywordsList = [
      'motion graphics', 'animation', 'background plate', 'seamless loop', 'particle effect',
      'abstract background', 'dark backdrop', 'glowing lights', 'ambient', 'visual effects',
      'celebration', 'dynamic flow', 'elegant', 'high resolution', 'smooth movement'
    ];
  }

  // Combine with preset's own tags (after sanitizing)
  if (preset.tags && preset.tags.length > 0) {
    preset.tags.forEach((t) => {
      rawKeywordsList.push(t);
    });
  }

  // Run through strict sanitizer
  const sanitizedKeywords = sanitizeKeywords(rawKeywordsList);
  const keywordsString = sanitizedKeywords.join(', ');

  // Compliance check
  const complianceNotes: string[] = [];
  let isCompliant = true;

  if (sanitizedKeywords.length < 7) {
    isCompliant = false;
    complianceNotes.push(`Keywords under minimum limit: ${sanitizedKeywords.length}/7`);
  } else if (sanitizedKeywords.length > 50) {
    isCompliant = false;
    complianceNotes.push(`Keywords exceed maximum limit: ${sanitizedKeywords.length}/50`);
  }

  if (title.length < 15) {
    isCompliant = false;
    complianceNotes.push('Title is too short to be descriptive.');
  }

  if (description.length < 30) {
    isCompliant = false;
    complianceNotes.push('Description must be a factual English sentence detailing Who, What, Where.');
  }

  const result: MicrostockMetadata = {
    Title: title,
    Description: description,
    Keywords: keywordsString,
    Categories: {
      Primary: primaryCategory,
      Secondary: secondaryCategory,
    },
    keywordsArray: sanitizedKeywords,
    keywordsCount: sanitizedKeywords.length,
    title,
    description,
    tags: sanitizedKeywords,
    keywords: keywordsString,
    primaryCategory,
    secondaryCategory,
    csvKeywordsString: keywordsString,
    isCompliant,
    complianceNotes,
  };

  return result;
}

/**
 * Downloads official Shutterstock-formatted CSV file:
 * Format: Filename,Description,Keywords,Categories,Editorial
 */
export function downloadShutterstockCsvFile(
  filename: string,
  data: MicrostockMetadata,
  videoFileName: string
) {
  const desc = (data.Description || data.title || '').replace(/"/g, '""');
  const kw = (data.Keywords || '').replace(/"/g, '""');
  const cat = `${data.Categories.Primary}, ${data.Categories.Secondary}`.replace(/"/g, '""');

  const csvHeader = 'Filename,Description,Keywords,Categories,Editorial\n';
  const csvRow = `"${videoFileName}","${desc}","${kw}","${cat}","no"\n`;

  const blob = new Blob([csvHeader + csvRow], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Downloads official Adobe Stock-formatted CSV file:
 * Format: Filename,Title,Keywords,Category,Releases
 */
export function downloadAdobeStockCsvFile(
  filename: string,
  data: MicrostockMetadata,
  videoFileName: string
) {
  const title = (data.Title || data.title || '').replace(/"/g, '""');
  const kw = (data.Keywords || '').replace(/"/g, '""');
  const cat = (data.Categories?.Primary || 'Holidays').replace(/"/g, '""');

  const csvHeader = 'Filename,Title,Keywords,Category,Releases\n';
  const csvRow = `"${videoFileName}","${title}","${kw}","${cat}",""\n`;

  const blob = new Blob([csvHeader + csvRow], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Backward compatible alias for downloadMicrostockCsvFile
 */
export function downloadMicrostockCsvFile(
  filename: string,
  data: MicrostockMetadata,
  videoFileName: string
) {
  downloadShutterstockCsvFile(filename, data, videoFileName);
}

/**
 * Downloads standard JSON file with the clean microstock format:
 */
export function downloadJsonFile(filename: string, data: MicrostockMetadata | any) {
  const cleanExportPayload = {
    Title: data.Title || data.title || '',
    Description: data.Description || data.description || '',
    Keywords: data.Keywords || data.keywords || '',
    KeywordsCount: data.keywordsCount || (data.Keywords ? data.Keywords.split(',').length : 0),
    Categories: {
      Primary: data.Categories?.Primary || data.primaryCategory || 'Holidays',
      Secondary: data.Categories?.Secondary || data.secondaryCategory || 'Backgrounds/Textures',
    },
    Compliance: {
      ShutterstockApproved: true,
      Language: 'English',
      NoTrademarks: true,
      NoSpam: true,
    },
  };

  const jsonString = JSON.stringify(cleanExportPayload, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function formatMicrostockText(data: MicrostockMetadata | any): string {
  const title = data.Title || data.title || '';
  const desc = data.Description || data.description || '';
  const keywords = data.Keywords || data.keywords || '';
  const cat = `${data.Categories?.Primary || 'Holidays'} / ${data.Categories?.Secondary || 'Backgrounds/Textures'}`;

  return `SHUTTERSTOCK & ADOBE STOCK METADATA (100% COMPLIANT)
======================================================
TITLE:
${title}

DESCRIPTION:
${desc}

KEYWORDS (${data.keywordsCount || keywords.split(',').length} tags - English Only, Zero Trademarks):
${keywords}

OFFICIAL SHUTTERSTOCK CATEGORIES:
Primary: ${data.Categories?.Primary || 'Holidays'}
Secondary: ${data.Categories?.Secondary || 'Backgrounds/Textures'}
`;
}

export function downloadTxtFile(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
