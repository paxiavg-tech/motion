import { MotionPreset } from '../types/motion';

export interface FpsRecommendation {
  fps: 30 | 60;
  tag: string;
  badgeColor: 'amber' | 'cyan' | 'emerald';
  rationale: string;
  renderTimeBenefit: string;
  recommendedUseCases: string[];
}

/**
 * Memberikan rekomendasi frame rate cerdas (30 FPS vs 60 FPS) berdasarkan
 * karakteristik gerak visual di dalam desain (kecepatan partikel, elemen dinamis, tema).
 */
export function getPresetFpsRecommendation(preset: MotionPreset): FpsRecommendation {
  // Jika preset memiliki rekomendasi eksplisit
  if (preset.recommendedFps) {
    if (preset.recommendedFps === 60) {
      return {
        fps: 60,
        tag: '60 FPS Ultra-Smooth',
        badgeColor: 'cyan',
        rationale:
          preset.fpsRationale ||
          'Pergerakan partikel cepat dan visual kinetik membutuhkan 60 FPS agar transisi buttery smooth tanpa judder.',
        renderTimeBenefit: 'Ultra smooth untuk preview web modern & video berkecepatan tinggi.',
        recommendedUseCases: ['VJ Loop', 'Sports Motion', 'Cyber / Neon', 'High-Speed Particle'],
      };
    } else {
      return {
        fps: 30,
        tag: '30 FPS Cinematic & Efisien',
        badgeColor: 'amber',
        rationale:
          preset.fpsRationale ||
          'Animasi berkarakter ambient/sinematik elegan. 30 FPS menghemat waktu render 2x lipat dan hemat bandwidth pembeli stock.',
        renderTimeBenefit: 'Waktu render 2x lebih cepat, ukuran file lebih hemat untuk microstock.',
        recommendedUseCases: ['Microstock Standar', 'Cinematic Backdrop', 'Luxury Gala', 'Mascot Loop'],
      };
    }
  }

  // Rekomendasi otomatis berdasarkan kategori & karakteristik gerak desain
  const cat = preset.category;
  const name = preset.name.toLowerCase();
  const desc = preset.description.toLowerCase();

  // Kategori & Desain yang MEMBUTUHKAN 60 FPS (Fast dynamic motion, rapid particles, energetic rhythm)
  const isHighVelocity =
    cat === 'Cyber & Futuristic 2027' ||
    cat === 'Fireworks & Spectacle 2027' ||
    cat === 'Sport, Fitness & Esports' ||
    cat === 'Concert & VJ Loops' ||
    cat === 'Party & Confetti 2027' ||
    cat === 'Modern & Kinetic 2027' ||
    name.includes('cyber') ||
    name.includes('firework') ||
    name.includes('vortex') ||
    name.includes('glitch') ||
    name.includes('confetti') ||
    name.includes('lightning') ||
    name.includes('storm') ||
    desc.includes('berkecepatan tinggi') ||
    desc.includes('dinamis');

  if (isHighVelocity) {
    return {
      fps: 60,
      tag: '60 FPS Ultra-Smooth Action',
      badgeColor: 'cyan',
      rationale:
        'Desain ini memiliki elemen berkecepatan tinggi (partikel cepat, glitch data neon, ledakan kembang api, atau hentakan musik). 60 FPS menghasilkan gerakan super mulus tanpa garis berbayang (judder) di layar modern.',
      renderTimeBenefit: 'Frame rate maksimal untuk visual dinamis berkualitas tinggi.',
      recommendedUseCases: [
        'Layar Panggung / VJ Konser',
        'Video Gaming & Esports',
        'Intro YouTube / TikTok Cepat',
        'Visualizer Musik',
      ],
    };
  }

  // Kategori & Desain yang LEBIH COCOK 30 FPS (Cinematic, ambient luxury, organic mascot, steady countdown)
  let specificRationale =
    'Desain ini berkarakter ambient sinematik dengan pergerakan partikel yang mengalir santai. 30 FPS adalah standar emas bioskop dan microstock, dengan keunggulan waktu render 2x lebih cepat.';

  if (cat === '2D Mascot & Animated Characters') {
    specificRationale =
      'Animasi maskot 2D memiliki estetika frame kartun yang ekspresif. 30 FPS memberikan tempo pernapasan dan gerak idle yang sangat natural tanpa beban rendering berlebih.';
  } else if (cat === 'Luxury & Gala 2027' || cat === 'Luxury Awards & Gala') {
    specificRationale =
      'Partikel stardust emas bergerak mengapung perlahan secara megah. 30 FPS memberikan nuansa filmis (cinematic frame pacing) yang mewah dan disukai pembeli video gala.';
  } else if (cat === 'Wedding & Romance') {
    specificRationale =
      'Kilau lampu peri (fairy lights) lembut dan bokeh romantis. 30 FPS menghasilkan nuansa dreamlike yang hangat dan file video ringan untuk diedit ulang klien.';
  } else if (cat === 'Ramadhan & Islamic') {
    specificRationale =
      'Pendaran lentera fanous dan kaligrafi bulan sabit yang mengapung tenang. Standar 30 FPS sangat pas untuk tayangan ucapan Idul Fitri / Ramadhan.';
  } else if (cat === 'Commercial Sale & Promo') {
    specificRationale =
      'Format standar penyiaran iklan komersial TV & media sosial (30p). Render jauh lebih cepat sehingga Anda bisa memproduksi banyak variasi promo.';
  } else if (cat === 'Sequential Reveal & Visual Explainer') {
    specificRationale =
      'Eksplanasi visual bertahap. 30 FPS memastikan alur pembacaan diagram/step tetap nyaman di mata dan ukuran file ideal untuk video presentasi.';
  }

  return {
    fps: 30,
    tag: '30 FPS Cinematic & Efisien',
    badgeColor: 'amber',
    rationale: specificRationale,
    renderTimeBenefit: 'Waktu render 2x lebih hemat waktu & ukuran file sangat ramah pembeli stock.',
    recommendedUseCases: [
      'Standar Microstock Shutterstock',
      'Video Bumper & Iklan TV',
      'Cinematic Backdrop',
      'Efisien Waktu Produksi',
    ],
  };
}
