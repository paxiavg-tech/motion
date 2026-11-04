import { MotionConfig, CountdownStyle } from '../types/motion';
import * as CommercialStock from './commercialStockEngine';
import * as MascotEngine from './mascotCharacterEngine';
import * as SequentialExplainer from './sequentialExplainerEngine';
import * as ChristmasHoliday from './christmasHolidayEngine';
import * as FireworksPhysics from './fireworksPhysicsEngine';
import * as NordicFolkEngine from './nordicFolkArtEngine';
import * as LivingVectorEngine from './livingVectorMotionEngine';
import * as ChristmasPhysics from './christmasPhysicsEngine';
import * as MetropolisSkyline from './metropolisSkylineEngine';
import * as MetropolisVariations from './metropolisVariationsEngine';
import * as MetropolisExtended from './metropolisExtendedVariationsEngine';
import * as SilhouetteLandscapes from './silhouetteLandscapesEngine';

export interface RenderContext {
  ctx: CanvasRenderingContext2D;
  config: MotionConfig;
  time: number;
  progress: number; // 0.0 to 1.0
  width: number;
  height: number;
  loadedTextures?: Record<string, HTMLImageElement>;
  isExportingOffline?: boolean;
}

// Pseudo-random deterministic hash for particle stability
function hash(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Helper: Convert number to Roman Numeral
function toRoman(num: number): string {
  const romanMap: [number, string][] = [
    [10, 'X'],
    [9, 'IX'],
    [8, 'VIII'],
    [7, 'VII'],
    [6, 'VI'],
    [5, 'V'],
    [4, 'IV'],
    [3, 'III'],
    [2, 'II'],
    [1, 'I'],
  ];
  for (const [v, r] of romanMap) {
    if (num >= v) return r;
  }
  return num.toString();
}

export function drawMotionGraphicFrame({
  ctx,
  config,
  time,
  progress,
  width,
  height,
  loadedTextures,
  isExportingOffline = false,
}: RenderContext) {
  const isSimulatingFootage =
    !isExportingOffline &&
    config.simulationFootage &&
    config.simulationFootage !== 'none';

  // 1. Handle Background
  if (isSimulatingFootage) {
    const bgKey = config.simulationFootage === 'concert' ? 'concert' : 'fireplace';
    let simImg: HTMLImageElement | undefined = undefined;
    if (loadedTextures) {
      for (const key of Object.keys(loadedTextures)) {
        if (key.includes(bgKey)) {
          simImg = loadedTextures[key];
          break;
        }
      }
    }

    if (simImg) {
      ctx.drawImage(simImg, 0, 0, width, height);
    } else {
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, width, height);
    }
    ctx.globalCompositeOperation = 'screen';
  } else {
    ctx.globalCompositeOperation = 'source-over';

    if (config.backgroundMode === 'transparent') {
      ctx.clearRect(0, 0, width, height);
    } else if (config.backgroundMode === 'chroma_green') {
      ctx.fillStyle = '#00FF00';
      ctx.fillRect(0, 0, width, height);
    } else if (config.backgroundMode === 'chroma_blue') {
      ctx.fillStyle = '#0000FF';
      ctx.fillRect(0, 0, width, height);
    } else if (config.backgroundMode === 'custom_gradient') {
      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.1,
        width / 2,
        height / 2,
        width * 0.7
      );
      grad.addColorStop(0, config.gradientStart || '#1e1035');
      grad.addColorStop(1, config.gradientEnd || '#07040d');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else if (
      config.backgroundMode === 'stock_texture' &&
      config.stockTextureUrl &&
      loadedTextures?.[config.stockTextureUrl]
    ) {
      const img = loadedTextures[config.stockTextureUrl];
      ctx.drawImage(img, 0, 0, width, height);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(0, 0, width, height);
    } else {
      // PURE BLACK (#000000) - THE GOLD STANDARD OF MICROSTOCK OVERLAYS!
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, width, height);
    }
  }

  // 2. Route by Countdown Template ID
  switch (config.templateId) {
    // Luxury & Gala 2027
    case 'gold_2027_royal_gala':
    case 'gold_newyear_2027_countdown':
      drawGoldRoyalGalaCountdown(ctx, config, time, progress, width, height);
      break;
    case 'molten_gold_ingot_2027':
    case 'nye_2027_molten_gold_vortex':
      drawMoltenGoldCountdown(ctx, config, time, progress, width, height);
      break;
    case 'oscars_red_carpet_silk_2027':
    case 'nye_2027_gold_silk_caustics':
      drawOscarsSilkCountdown(ctx, config, time, progress, width, height);
      break;
    case 'emerald_diamond_crystal_2027':
      drawEmeraldDiamondCountdown(ctx, config, time, progress, width, height);
      break;
    case 'anamorphic_champagne_flares_2027':
    case 'nye_2027_light_leak_film_burn':
      drawAnamorphicFlaresCountdown(ctx, config, time, progress, width, height);
      break;

    // Cyber & Futuristic 2027
    case 'cyber_neon_2027_vortex':
      drawCyberNeonHudCountdown(ctx, config, time, progress, width, height);
      break;
    case 'synthwave_outrun_grid_2027':
    case 'nye_2027_synthwave_laser_grid':
      drawSynthwaveGridCountdown(ctx, config, time, progress, width, height);
      break;
    case 'quantum_core_hologram_2027':
      drawQuantumCoreCountdown(ctx, config, time, progress, width, height);
      break;
    case 'matrix_code_decryption_2027':
    case 'nye_2027_cyber_matrix_rain':
      drawMatrixDecryptionCountdown(ctx, config, time, progress, width, height);
      break;
    case 'edm_club_laser_strobe_2027':
    case 'nye_2027_prismatic_laser_tunnel':
      drawEdmLaserStrobeCountdown(ctx, config, time, progress, width, height);
      break;

    // Fireworks & Spectacle 2027
    case 'fireworks_realistic_4k_particle_physics':
      FireworksPhysics.drawRealistic4KFireworksPhysics(ctx, config, time, progress, width, height);
      break;
    case 'nye_2027_grand_fireworks':
      drawFireworksClimaxCountdown(ctx, config, time, progress, width, height);
      break;
    case 'japanese_kamuro_willow_2027':
    case 'nye_2027_kamuro_willow_fireworks':
      drawKamuroWillowCountdown(ctx, config, time, progress, width, height);
      break;
    case 'sparkler_waterfall_rain_2027':
    case 'nye_2027_sparkler_waterfall':
      drawSparklerWaterfallCountdown(ctx, config, time, progress, width, height);
      break;
    case 'pyro_fountain_stage_barrage_2027':
      drawPyroFountainsCountdown(ctx, config, time, progress, width, height);
      break;

    // Cinematic & Art Deco 2027
    case 'art_deco_1920_clockwork':
    case 'nye_2027_clockwork_orbit':
      drawArtDecoGatsbyCountdown(ctx, config, time, progress, width, height);
      break;
    case 'times_square_ball_drop_2027':
    case 'nye_2027_times_square_ball_drop':
      drawTimesSquareBallDropCountdown(ctx, config, time, progress, width, height);
      break;
    case 'cinema_35mm_film_leader_2027':
      drawFilmLeaderCountdown(ctx, config, time, progress, width, height);
      break;
    case 'cosmic_nebula_supernova_2027':
      drawCosmicSupernovaCountdown(ctx, config, time, progress, width, height);
      break;
    case 'golden_sand_hourglass_2027':
      drawHourglassCountdown(ctx, config, time, progress, width, height);
      break;
    case 'floating_lanterns_wish_2027':
      drawFloatingLanternsCountdown(ctx, config, time, progress, width, height);
      break;

    // Modern & Kinetic 2027
    case 'kinetic_swiss_minimal_2027':
    case 'nye_2027_zero_hour_clock_sweep':
      drawKineticSwissCountdown(ctx, config, time, progress, width, height);
      break;
    case 'radial_energy_speed_tunnel_2027':
    case 'nye_2027_bokeh_tunnel':
      drawSpeedTunnelCountdown(ctx, config, time, progress, width, height);
      break;
    case 'digital_flip_clock_retro_2027':
      drawFlipClockCountdown(ctx, config, time, progress, width, height);
      break;
    case 'skyline_monolith_laser_2027':
    case 'nye_2027_skyline_monolith_pulse':
      drawSkylineLaserCountdown(ctx, config, time, progress, width, height);
      break;

    // Party & Confetti 2027
    case 'champagne_effervescence_toast_2027':
    case 'champagne_confetti_sparklers':
    case 'nye_2027_champagne_effervescence':
    case 'nye_2027_champagne_clink_burst':
      drawChampagneToastCountdown(ctx, config, time, progress, width, height);
      break;
    case 'stadium_confetti_cannon_2027':
    case 'nye_2027_stadium_confetti_blast':
      drawStadiumConfettiCountdown(ctx, config, time, progress, width, height);
      break;
    case 'golden_serpentine_ribbons_2027':
    case 'nye_2027_curling_ribbons':
      drawSerpentineRibbonsCountdown(ctx, config, time, progress, width, height);
      break;

    // Custom Code
    case 'custom_html_canvas_code':
      drawCustomCode(ctx, config, time, progress, width, height);
      break;

    // ==============================================================
    // 1. Luxury Awards & Gala Backdrops (5 Models)
    // ==============================================================
    case 'awards_royal_silk_caustics':
      CommercialStock.drawAwardsRoyalSilkCaustics(ctx, config, time, progress, width, height);
      break;
    case 'awards_golden_bokeh_curtain':
      CommercialStock.drawAwardsGoldenBokehCurtain(ctx, config, time, progress, width, height);
      break;
    case 'awards_floating_gold_dust_shimmer':
      CommercialStock.drawAwardsFloatingGoldDust(ctx, config, time, progress, width, height);
      break;
    case 'awards_cinematic_pedestal_halo':
      CommercialStock.drawAwardsPedestalHalo(ctx, config, time, progress, width, height);
      break;
    case 'awards_crystal_prism_sparkles':
      CommercialStock.drawAwardsCrystalPrismSparkles(ctx, config, time, progress, width, height);
      break;

    // ==============================================================
    // 2. Corporate & Tech AI Abstract Data (5 Models)
    // ==============================================================
    case 'tech_ai_neural_plexus_nodes':
      CommercialStock.drawTechNeuralPlexusNodes(ctx, config, time, progress, width, height);
      break;
    case 'tech_cyber_wireframe_grid_terrain':
      CommercialStock.drawTechWireframeGridTerrain(ctx, config, time, progress, width, height);
      break;
    case 'tech_fiber_optic_data_wave':
      CommercialStock.drawTechFiberOpticWave(ctx, config, time, progress, width, height);
      break;
    case 'tech_quantum_data_core_matrix':
      CommercialStock.drawTechQuantumCoreCube(ctx, config, time, progress, width, height);
      break;
    case 'tech_digital_security_shield_flow':
      CommercialStock.drawTechBinarySecurityShield(ctx, config, time, progress, width, height);
      break;

    // ==============================================================
    // 3. Wedding & Romance Fairy Lights (5 Models)
    // ==============================================================
    case 'wedding_fairy_dust_golden_bokeh':
      CommercialStock.drawWeddingFairyDustBokeh(ctx, config, time, progress, width, height);
      break;
    case 'wedding_ethereal_floating_hearts':
      CommercialStock.drawWeddingFloatingHearts(ctx, config, time, progress, width, height);
      break;
    case 'wedding_champagne_silk_caustics':
      CommercialStock.drawWeddingChampagneSilk(ctx, config, time, progress, width, height);
      break;
    case 'wedding_sparkling_rings_orbit':
      CommercialStock.drawWeddingSparklingRingsOrbit(ctx, config, time, progress, width, height);
      break;
    case 'wedding_floral_petals_golden_wind':
      CommercialStock.drawWeddingFloralPetalsWind(ctx, config, time, progress, width, height);
      break;

    // ==============================================================
    // 4. Ramadhan & Islamic Luxury Arabian Gala (5 Models)
    // ==============================================================
    case 'islamic_golden_crescent_mosque':
      CommercialStock.drawIslamicCrescentMosque(ctx, config, time, progress, width, height);
      break;
    case 'islamic_arabesque_sacred_mandala':
      CommercialStock.drawIslamicArabesqueMandala(ctx, config, time, progress, width, height);
      break;
    case 'islamic_fanous_lanterns_sway':
      CommercialStock.drawIslamicFanousLanterns(ctx, config, time, progress, width, height);
      break;
    case 'islamic_emerald_gold_ketupat_weave':
      CommercialStock.drawIslamicEmeraldGoldKetupat(ctx, config, time, progress, width, height);
      break;
    case 'islamic_sahara_desert_starry_night':
      CommercialStock.drawIslamicSaharaDesertDunes(ctx, config, time, progress, width, height);
      break;

    // ==============================================================
    // 5. Stage Concert LED Visuals & DJ VJ Loops (5 Models)
    // ==============================================================
    case 'vj_hypnotic_neon_tunnel_128bpm':
      CommercialStock.drawVjHexagonalTunnel128Bpm(ctx, config, time, progress, width, height);
      break;
    case 'vj_prismatic_equalizer_spectrum':
      CommercialStock.drawVjAudioSpectrumBars(ctx, config, time, progress, width, height);
      break;
    case 'vj_kaleidoscopic_fractal_bloom':
      CommercialStock.drawVjKaleidoscopeFractal(ctx, config, time, progress, width, height);
      break;
    case 'vj_cyber_glitch_cube_vortex':
      CommercialStock.drawVjCyberGlitchCubes(ctx, config, time, progress, width, height);
      break;
    case 'vj_strobe_laser_fan_blast':
      CommercialStock.drawVjStrobeLaserFan(ctx, config, time, progress, width, height);
      break;

    // ==============================================================
    // 6. Breaking News & Broadcast Studio HUD (5 Models)
    // ==============================================================
    case 'broadcast_rotating_digital_globe':
      CommercialStock.drawBroadcastHoloGlobe(ctx, config, time, progress, width, height);
      break;
    case 'broadcast_breaking_news_lower_flow':
      CommercialStock.drawBroadcastBreakingNewsStudio(ctx, config, time, progress, width, height);
      break;
    case 'broadcast_radar_satellite_target':
      CommercialStock.drawBroadcastRadarSatellite(ctx, config, time, progress, width, height);
      break;
    case 'broadcast_financial_stock_ticker':
      CommercialStock.drawBroadcastFinancialTicker(ctx, config, time, progress, width, height);
      break;
    case 'broadcast_universal_10s_clock_hud':
      CommercialStock.drawBroadcastClockHud(ctx, config, time, progress, width, height);
      break;

    // ==============================================================
    // 7. Sport, Fitness & Esports Motion (5 Models)
    // ==============================================================
    case 'sport_energy_shockwave_burst':
      CommercialStock.drawSportEnergyShockwaveBurst(ctx, config, time, progress, width, height);
      break;
    case 'sport_speed_velocity_tunnel':
      CommercialStock.drawSportSpeedVelocityTunnel(ctx, config, time, progress, width, height);
      break;
    case 'sport_esports_glitch_hud':
      CommercialStock.drawSportEsportsGlitchHud(ctx, config, time, progress, width, height);
      break;
    case 'sport_stadium_floodlight_dust':
      CommercialStock.drawSportStadiumFloodlightDust(ctx, config, time, progress, width, height);
      break;
    case 'sport_championship_trophy_halos':
      CommercialStock.drawSportChampionshipTrophyHalos(ctx, config, time, progress, width, height);
      break;

    // ==============================================================
    // 8. Commercial Sale, Promo & Black Friday (5 Models)
    // ==============================================================
    case 'sale_golden_confetti_shimmer':
      CommercialStock.drawSaleGoldenConfettiShimmer(ctx, config, time, progress, width, height);
      break;
    case 'sale_electric_neon_flash':
      CommercialStock.drawSaleElectricNeonFlash(ctx, config, time, progress, width, height);
      break;
    case 'sale_luxury_badge_reveal':
      CommercialStock.drawSaleLuxuryBadgeReveal(ctx, config, time, progress, width, height);
      break;
    case 'sale_red_ribbon_waves':
      CommercialStock.drawSaleRedRibbonWaves(ctx, config, time, progress, width, height);
      break;
    case 'sale_price_burst_star_shower':
      CommercialStock.drawSalePriceBurstStarShower(ctx, config, time, progress, width, height);
      break;

    // ==============================================================
    // 9. 2D Mascot & Animated Characters (8 High-Demand Models)
    // ==============================================================
    case 'mascot_zen_onsen_capybara':
      MascotEngine.drawZenOnsenCapybara(ctx, config, time, progress, width, height);
      break;
    case 'mascot_cyber_ai_droid':
    case 'mascot_cyber_mecha_pet':
      MascotEngine.drawCyberAiDroid(ctx, config, time, progress, width, height);
      break;
    case 'mascot_panicking_claw_cat':
      MascotEngine.drawViralTikTokScramblingCat(ctx, config, time, progress, width, height);
      break;
    case 'mascot_bouncing_kawaii_slime':
      MascotEngine.drawBouncingKawaiiSlime(ctx, config, time, progress, width, height);
      break;
    case 'mascot_floating_mischief_ghost':
      MascotEngine.drawFloatingMischiefGhost(ctx, config, time, progress, width, height);
      break;
    case 'mascot_puffy_dream_cloud':
    case 'mascot_running_ninja_stickman':
      MascotEngine.drawPuffyDreamCloud(ctx, config, time, progress, width, height);
      break;
    case 'mascot_bioluminescent_jellyfish':
      MascotEngine.drawBioluminescentJellyfish(ctx, config, time, progress, width, height);
      break;
    case 'mascot_squishy_mochi_bunny':
      MascotEngine.drawSquishyMochiBunny(ctx, config, time, progress, width, height);
      break;

    // ==============================================================
    // 10. Sequential Reveal & Visual Explainers (5 High-End Models)
    // ==============================================================
    case 'reveal_progressive_blueprint_isometric':
      SequentialExplainer.drawProgressiveBlueprintSchematic(ctx, config, time, progress, width, height);
      break;
    case 'reveal_sequential_cards_nodes':
      SequentialExplainer.drawSequentialCardsNodes(ctx, config, time, progress, width, height);
      break;
    case 'reveal_step_by_step_infographic':
      SequentialExplainer.drawStepByStepInfographic(ctx, config, time, progress, width, height);
      break;
    case 'reveal_modular_buildup_composition':
      SequentialExplainer.drawModularBuildupComposition(ctx, config, time, progress, width, height);
      break;
    case 'reveal_animated_visual_explainer':
      SequentialExplainer.drawAnimatedVisualExplainer(ctx, config, time, progress, width, height);
      break;

    // ==============================================================
    // 11. Christmas, Holiday & Festive Flash Sale (5 Models)
    // ==============================================================
    case 'christmas_flash_sale_gold_ornament':
      ChristmasHoliday.drawChristmasFlashSaleOrnament(ctx, config, time, progress, width, height);
      break;
    case 'christmas_gift_box_unboxing_reveal':
      ChristmasHoliday.drawChristmasGiftBoxReveal(ctx, config, time, progress, width, height);
      break;
    case 'christmas_frosted_snow_sale_tag':
      ChristmasHoliday.drawChristmasFrostedIceTag(ctx, config, time, progress, width, height);
      break;
    case 'christmas_golden_ribbon_garland_bokeh':
      ChristmasHoliday.drawChristmasGoldenGarlandRibbon(ctx, config, time, progress, width, height);
      break;
    case 'holiday_new_year_champagne_sparkler':
      ChristmasHoliday.drawHolidayNewYearSparkler(ctx, config, time, progress, width, height);
      break;
    case 'christmas_2026_to_2027_crystal_snowglobe':
      ChristmasHoliday.drawChristmas2026SnowGlobePortal(ctx, config, time, progress, width, height);
      break;
    case 'holiday_2026_2027_golden_hourglass_flip':
      ChristmasHoliday.drawGoldenHourglass2026To2027(ctx, config, time, progress, width, height);
      break;
    case 'christmas_2026_festive_pine_fireworks_sky':
      ChristmasHoliday.drawNordicChristmas2026FireworksSky(ctx, config, time, progress, width, height);
      break;
    case 'christmas_nordic_minimalist_silhouette_sleigh':
      ChristmasHoliday.drawNordicMinimalistSilhouetteSleigh(ctx, config, time, progress, width, height);
      break;
    case 'nordic_winter_alpine_express_train':
      NordicFolkEngine.drawWinterAlpineExpress(ctx, config, time, progress, width, height);
      break;
    case 'nordic_sacred_forest_stag_gathering':
      NordicFolkEngine.drawSacredForestStagGathering(ctx, config, time, progress, width, height);
      break;
    case 'nordic_fjord_guiding_lighthouse_harbor':
      NordicFolkEngine.drawNordicFjordGuidingLighthouse(ctx, config, time, progress, width, height);
      break;
    case 'nordic_living_vector_silhouette_masterpiece':
      LivingVectorEngine.drawLivingVectorSilhouetteMasterpiece(ctx, config, time, progress, width, height);
      break;
    case 'sstk_vertical_nordic_storytelling_plate':
      LivingVectorEngine.drawShutterstockVerticalStorytellingPlate(ctx, config, time, progress, width, height);
      break;

    // ==============================================================
    // 12. Christmas Real-Physics & Parallax Storytelling Models
    // ==============================================================
    case 'christmas_midnight_santa_city_flyover':
      ChristmasPhysics.drawMidnightSantaCityFlyover(ctx, config, time, progress, width, height);
      break;
    case 'christmas_aurora_alpine_chimneys_physics':
      ChristmasPhysics.drawNordicAuroraVillagePhysics(ctx, config, time, progress, width, height);
      break;
    case 'christmas_crystal_pendulum_snowglobe_physics':
      ChristmasPhysics.drawPendulumSnowglobePhysics(ctx, config, time, progress, width, height);
      break;
    case 'christmas_ballistic_ornament_pendulum_chain':
      ChristmasPhysics.drawBallisticOrnamentCascades(ctx, config, time, progress, width, height);
      break;

    // ==============================================================
    // 13. Metropolis City Skyline Beacons & Rooftop Searchlights
    // ==============================================================
    case 'metropolis_city_skyline_beacon':
      MetropolisSkyline.drawMetropolisSkylineBeacon(ctx, config, time, progress, width, height);
      break;

    // ==============================================================
    // 14. Metropolis Cinematic Market Variations (No Countdown, No Central Laser)
    // ==============================================================
    case 'metropolis_eco_smart_city':
      MetropolisVariations.drawEcoSmartCity(ctx, config, time, progress, width, height);
      break;
    case 'metropolis_fintech_bull_market':
      MetropolisVariations.drawFinTechBullMarket(ctx, config, time, progress, width, height);
      break;
    case 'metropolis_quiet_luxury_noir':
      MetropolisVariations.drawQuietLuxuryNoir(ctx, config, time, progress, width, height);
      break;
    case 'metropolis_golden_hour_dawn':
      MetropolisVariations.drawGoldenHourDawn(ctx, config, time, progress, width, height);
      break;
    case 'metropolis_cyberpunk_synthwave':
      MetropolisVariations.drawCyberpunkSynthwave(ctx, config, time, progress, width, height);
      break;
    case 'metropolis_cosmic_orbital_harbor':
      MetropolisVariations.drawCosmicOrbitalHarbor(ctx, config, time, progress, width, height);
      break;

    // ==============================================================
    // 15. Realistic Urban City Skyline Variations (Proven Architecture)
    // ==============================================================
    case 'metropolis_daylight_sunny_skyline':
      MetropolisExtended.drawDaylightSunnySkyline(ctx, config, time, progress, width, height);
      break;
    case 'metropolis_christmas_snow_skyline':
      MetropolisExtended.drawChristmasSnowSkyline(ctx, config, time, progress, width, height);
      break;
    case 'metropolis_new_year_midnight_skyline':
      MetropolisExtended.drawNewYearMidnightSkyline(ctx, config, time, progress, width, height);
      break;
    case 'metropolis_evening_rush_hour_traffic':
      MetropolisExtended.drawEveningRushHourTraffic(ctx, config, time, progress, width, height);
      break;
    case 'metropolis_rainy_evening_skyline':
      MetropolisExtended.drawRainyEveningSkyline(ctx, config, time, progress, width, height);
      break;
    case 'metropolis_golden_hour_corporate':
      MetropolisExtended.drawGoldenHourCorporate(ctx, config, time, progress, width, height);
      break;
    case 'metropolis_winter_twilight_frost':
      MetropolisExtended.drawWinterTwilightFrost(ctx, config, time, progress, width, height);
      break;
    case 'metropolis_foggy_dawn_harbor':
      MetropolisExtended.drawFoggyDawnHarbor(ctx, config, time, progress, width, height);
      break;
    case 'metropolis_clear_midnight_blue':
      MetropolisExtended.drawClearMidnightBlue(ctx, config, time, progress, width, height);
      break;
    case 'metropolis_spring_breeze_cherry':
      MetropolisExtended.drawSpringBreezeCherry(ctx, config, time, progress, width, height);
      break;

    // ==============================================================
    // 16. Silhouette Landscapes (Mountains, Villages, Coast & Christmas)
    // ==============================================================
    case 'silhouette_alpine_winter_pines':
      SilhouetteLandscapes.drawAlpineWinterPines(ctx, config, time, progress, width, height);
      break;
    case 'silhouette_cozy_rural_christmas_village':
      SilhouetteLandscapes.drawCozyRuralVillage(ctx, config, time, progress, width, height);
      break;
    case 'silhouette_nordic_pine_forest_lake':
      SilhouetteLandscapes.drawNordicForestLake(ctx, config, time, progress, width, height);
      break;
    case 'silhouette_waterfront_ferris_wheel':
      SilhouetteLandscapes.drawFerrisWheelSkyline(ctx, config, time, progress, width, height);
      break;
    case 'silhouette_mountain_sunset_highway':
      SilhouetteLandscapes.drawMountainSunsetHighway(ctx, config, time, progress, width, height);
      break;
    case 'silhouette_bethlehem_nativity_star':
      SilhouetteLandscapes.drawBethlehemNativityStar(ctx, config, time, progress, width, height);
      break;
    case 'silhouette_autumn_harvest_windmill':
      SilhouetteLandscapes.drawAutumnHarvestWindmill(ctx, config, time, progress, width, height);
      break;
    case 'silhouette_stag_mountain_aurora':
      SilhouetteLandscapes.drawStagMountainAurora(ctx, config, time, progress, width, height);
      break;
    case 'silhouette_coastal_lighthouse_harbor':
      SilhouetteLandscapes.drawCoastalLighthouseHarbor(ctx, config, time, progress, width, height);
      break;
    case 'silhouette_ski_resort_alpine_village':
      SilhouetteLandscapes.drawSkiResortAlpineVillage(ctx, config, time, progress, width, height);
      break;

    default:
      drawGoldRoyalGalaCountdown(ctx, config, time, progress, width, height);
      break;
  }

  // Reset blend mode
  ctx.globalCompositeOperation = 'source-over';

  // 3. Draw Typography & Countdown Numbers Overlay
  const shouldDrawText =
    config.showText &&
    config.textDisplayMode !== 'clean_no_text' &&
    !config.templateId.startsWith('metropolis_') &&
    !config.templateId.startsWith('silhouette_');
  if (shouldDrawText && config.templateId !== 'custom_html_canvas_code') {
    drawCountdownMasterOverlay(ctx, config, time, progress, width, height);
  }
}

// ======================================================================
// HELPER: CALCULATE CURRENT COUNTDOWN NUMBER & PROGRESS
// ======================================================================
function getCountdownState(progress: number, startNum = 10) {
  const climaxThreshold = 0.82;
  const isClimax = progress >= climaxThreshold;

  if (isClimax) {
    const climaxProgress = (progress - climaxThreshold) / (1 - climaxThreshold);
    return {
      isClimax: true,
      currentNumber: 0,
      secondProgress: climaxProgress,
      climaxProgress,
      tickPulse: 0,
    };
  }

  const countdownNorm = progress / climaxThreshold;
  const remaining = Math.max(1, Math.ceil((1 - countdownNorm) * startNum));
  const currentStep = (1 - countdownNorm) * startNum;
  const secondProgress = 1 - (currentStep - Math.floor(currentStep));
  const tickPulse = Math.max(0, 1 - secondProgress * 3.5);

  return {
    isClimax: false,
    currentNumber: remaining,
    secondProgress,
    climaxProgress: 0,
    tickPulse,
  };
}

// ======================================================================
// 1. LUXURY 24K ROYAL GALA COUNTDOWN 2027
// ======================================================================
function drawGoldRoyalGalaCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const count = config.particleCount;
  const { isClimax, tickPulse, climaxProgress } = getCountdownState(progress, config.countdownStart || 10);

  // Concentric Orbiting Golden Energy Rings & Roman Dial (Responsive to minDim)
  if (config.showCountdownDial !== false) {
    const ringCount = 5;
    for (let r = 0; r < ringCount; r++) {
      const ringRadius = (minDim * 0.22) + (r * minDim * 0.038);
      const ringAngle = (progress * Math.PI * 2 * (r % 2 === 0 ? 1 : -1) * 0.4) + (r * 0.7);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ringAngle);
      ctx.scale(1, 0.52);

      ctx.beginPath();
      ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(245, 158, 11, ${0.18 + (tickPulse * 0.25) + Math.sin(progress * Math.PI * 2 + r) * 0.08})`;
      ctx.lineWidth = (2.5 + tickPulse * 2) * scale;
      ctx.stroke();

      const beads = 12;
      for (let b = 0; b < beads; b++) {
        const beadAngle = (b / beads) * Math.PI * 2 + (progress * Math.PI * 2 * 0.5);
        const bx = Math.cos(beadAngle) * ringRadius;
        const by = Math.sin(beadAngle) * ringRadius;

        ctx.beginPath();
        ctx.arc(bx, by, (3.5 + (b % 3 === 0 ? 2 : 0)) * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#fef08a';
        ctx.shadowColor = '#eab308';
        ctx.shadowBlur = 12 * config.glowIntensity * scale;
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // Climax Shockwave Rings
  if (isClimax) {
    const shockRadius = (climaxProgress * minDim * 0.8) % (minDim * 0.8);
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, shockRadius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(254, 240, 138, ${Math.max(0, 1 - climaxProgress * 1.2)})`;
    ctx.lineWidth = 6 * scale;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 30 * scale;
    ctx.stroke();
    ctx.restore();
  }

  // 3D Stardust Particle Cloud
  for (let i = 0; i < count; i++) {
    const seed = i * 17.13;
    const baseAngle = hash(seed) * Math.PI * 2;
    const baseDist = Math.sqrt(hash(seed + 1)) * (minDim * 0.46);
    const orbitSpeed = (hash(seed + 2) - 0.5) * 1.8 * config.particleSpeed;
    const angle = baseAngle + (progress * Math.PI * 2 * orbitSpeed);
    const yOffset = Math.sin(progress * Math.PI * 2 * 2 + baseAngle) * (35 * scale);

    const x = cx + Math.cos(angle) * baseDist;
    const y = cy + Math.sin(angle) * (baseDist * 0.6) + yOffset;

    const shimmer = Math.sin(progress * Math.PI * 2 * 3 + seed) * 0.5 + 0.5;
    const pSize = (hash(seed + 5) * config.particleSize + 1.2) * scale * (0.8 + shimmer * 0.4);
    const alpha = (hash(seed + 6) * 0.7 + 0.3) * (0.6 + shimmer * 0.4);

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${38 + hash(seed + 7) * 14}, 95%, ${65 + shimmer * 25}%, ${alpha})`;
    if (config.glowIntensity > 0) {
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = pSize * 4 * config.glowIntensity;
    }
    ctx.fill();

    if (hash(seed + 8) > 0.86 && shimmer > 0.6) {
      const fl = pSize * 4;
      ctx.strokeStyle = `rgba(255, 255, 230, ${alpha * 0.9})`;
      ctx.lineWidth = 1 * scale;
      ctx.beginPath();
      ctx.moveTo(x - fl, y);
      ctx.lineTo(x + fl, y);
      ctx.moveTo(x, y - fl);
      ctx.lineTo(x, y + fl);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// ======================================================================
// 2. MOLTEN 24K LIQUID GOLD COUNTDOWN 2027
// ======================================================================
function drawMoltenGoldCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const count = config.particleCount;
  const { tickPulse } = getCountdownState(progress, config.countdownStart || 10);

  const arms = 6;
  for (let a = 0; a < arms; a++) {
    ctx.save();
    ctx.beginPath();
    const armAngle = (a / arms) * Math.PI * 2 + progress * Math.PI * 2 * 0.8;
    for (let step = 0; step < 60; step++) {
      const rad = (step / 60) * (minDim * 0.42);
      const theta = armAngle + Math.sin(step * 0.15 + progress * 6) * 0.4;
      const px = cx + Math.cos(theta) * rad;
      const py = cy + Math.sin(theta) * rad * 0.65;
      if (step === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = `rgba(245, 158, 11, ${0.28 + tickPulse * 0.3})`;
    ctx.lineWidth = (7 + a * 2) * scale;
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 24 * scale * config.glowIntensity;
    ctx.stroke();
    ctx.restore();
  }

  for (let i = 0; i < count; i++) {
    const seed = i * 23.41;
    const angle = hash(seed) * Math.PI * 2 + progress * Math.PI * 2 * (hash(seed + 1) * 0.8 + 0.3);
    const dist = (hash(seed + 2) * 0.38 + (1 - (progress % 1)) * 0.08) * minDim;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist * 0.65;
    const pSize = (hash(seed + 3) * 3 + 2) * scale;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, ${160 + Math.floor(hash(seed + 4) * 80)}, 30, 0.8)`;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = pSize * 4 * config.glowIntensity;
    ctx.fill();
    ctx.restore();
  }
}

// ======================================================================
// 3. OSCARS RED CARPET LIQUID GOLD SILK 2027
// ======================================================================
function drawOscarsSilkCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const count = config.particleCount;

  const waveLayers = 7;
  for (let w = 0; w < waveLayers; w++) {
    const yBase = height * 0.2 + (w / waveLayers) * (height * 0.6);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, height);
    for (let x = 0; x <= width; x += 30 * scale) {
      const nx = x / width;
      const wave = Math.sin(nx * 5 + progress * Math.PI * 2 + w * 0.9) * (40 * scale) +
                   Math.cos(nx * 9 - progress * Math.PI * 2 * 0.6) * (18 * scale);
      ctx.lineTo(x, yBase + wave);
    }
    ctx.lineTo(width, height);
    ctx.closePath();

    const grad = ctx.createLinearGradient(0, yBase - 50 * scale, 0, yBase + 120 * scale);
    grad.addColorStop(0, 'rgba(254, 240, 138, 0.08)');
    grad.addColorStop(0.5, 'rgba(217, 119, 6, 0.05)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fill();

    ctx.strokeStyle = `rgba(254, 240, 138, ${0.12 + Math.sin(progress * 6 + w) * 0.06})`;
    ctx.lineWidth = 2 * scale;
    ctx.stroke();
    ctx.restore();
  }

  for (let i = 0; i < count; i++) {
    const seed = i * 9.87;
    const x = ((hash(seed) + progress * 0.4) % 1) * width;
    const y = hash(seed + 1) * height;
    const pSize = (hash(seed + 2) * 3 + 1.2) * scale;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(254, 240, 138, 0.65)';
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 10 * scale;
    ctx.fill();
    ctx.restore();
  }
}

// ======================================================================
// 4. EMERALD & DIAMOND CRYSTAL COUNTDOWN 2027
// ======================================================================
function drawEmeraldDiamondCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const count = config.particleCount;

  const facets = 12;
  for (let f = 0; f < facets; f++) {
    const angle = (f / facets) * Math.PI * 2 + progress * Math.PI * 0.8;
    const rad = minDim * 0.35;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(0.2) * rad, Math.sin(0.2) * rad);
    ctx.lineTo(rad * 0.7, 0);
    ctx.closePath();
    ctx.fillStyle = f % 2 === 0 ? 'rgba(52, 211, 153, 0.08)' : 'rgba(167, 243, 208, 0.12)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();
    ctx.restore();
  }

  for (let i = 0; i < count; i++) {
    const seed = i * 19.33;
    const x = hash(seed) * width;
    const y = ((hash(seed + 1) + progress * 0.2) % 1) * height;
    const pSize = (hash(seed + 2) * 3 + 1.5) * scale;
    const pulse = Math.sin(progress * 12 + seed) * 0.5 + 0.5;

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = hash(seed + 3) > 0.5 ? '#a7f3d0' : '#ffffff';
    ctx.shadowColor = '#34d399';
    ctx.shadowBlur = 12 * scale * config.glowIntensity;
    ctx.fill();

    if (pulse > 0.7) {
      const fl = pSize * 3.5;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1 * scale;
      ctx.beginPath();
      ctx.moveTo(x - fl, y);
      ctx.lineTo(x + fl, y);
      ctx.moveTo(x, y - fl);
      ctx.lineTo(x, y + fl);
      ctx.stroke();
    }
    ctx.restore();
  }
}

// ======================================================================
// 5. ANAMORPHIC GOLDEN FLARES & BOKEH 2027
// ======================================================================
function drawAnamorphicFlaresCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const count = config.particleCount;

  const streakCount = 5;
  for (let s = 0; s < streakCount; s++) {
    const sy = height * (0.3 + s * 0.1) + Math.sin(progress * 4 + s) * (25 * scale);
    ctx.save();
    const grad = ctx.createLinearGradient(0, sy, width, sy);
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(0.3, 'rgba(245, 158, 11, 0.25)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(0.7, 'rgba(245, 158, 11, 0.25)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, sy - 2 * scale, width, 4 * scale);
    ctx.restore();
  }

  for (let i = 0; i < count; i++) {
    const seed = i * 14.28;
    const x = hash(seed) * width;
    const y = ((hash(seed + 1) - progress * 0.2 + 1) % 1) * height;
    const r = (hash(seed + 2) * 18 + 6) * scale;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 240, 138, ${hash(seed + 3) * 0.15 + 0.05})`;
    ctx.fill();
    ctx.restore();
  }
}

// ======================================================================
// 6. CYBERPUNK SAPPHIRE NEON HUD COUNTDOWN 2027
// ======================================================================
function drawCyberNeonHudCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const count = config.particleCount;
  const { tickPulse } = getCountdownState(progress, config.countdownStart || 10);

  // Rotating Circular HUD rings (Responsive to minDim so never cropped in landscape)
  const hudRings = [0.18, 0.23, 0.29, 0.35];
  hudRings.forEach((rMul, idx) => {
    const radius = minDim * rMul;
    const rot = progress * Math.PI * 2 * (idx % 2 === 0 ? 1 : -1) * (0.3 + idx * 0.2);
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);

    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = idx % 2 === 0 ? 'rgba(56, 189, 248, 0.28)' : 'rgba(236, 72, 153, 0.28)';
    ctx.lineWidth = (2.2 + (idx === 1 ? tickPulse * 3 : 0)) * scale;
    ctx.stroke();

    const ticks = 24;
    for (let t = 0; t < ticks; t++) {
      const tAngle = (t / ticks) * Math.PI * 2;
      const inner = radius - (t % 4 === 0 ? 10 : 4) * scale;
      ctx.beginPath();
      ctx.moveTo(Math.cos(tAngle) * inner, Math.sin(tAngle) * inner);
      ctx.lineTo(Math.cos(tAngle) * radius, Math.sin(tAngle) * radius);
      ctx.strokeStyle = t % 4 === 0 ? '#38bdf8' : 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = (t % 4 === 0 ? 2 : 1) * scale;
      ctx.stroke();
    }
    ctx.restore();
  });

  for (let i = 0; i < count; i++) {
    const seed = i * 29.17;
    const baseAngle = hash(seed) * Math.PI * 2;
    const dist = (hash(seed + 1) * 0.40 + (progress * 0.8) % 0.40) * minDim;
    const angle = baseAngle + (progress * Math.PI * 2 * 1.4);
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;

    const pLen = (hash(seed + 2) * 14 + 6) * scale;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(angle) * pLen, y + Math.sin(angle) * pLen);
    ctx.strokeStyle = hash(seed + 3) > 0.5 ? '#38bdf8' : '#ec4899';
    ctx.lineWidth = (hash(seed + 4) * 2 + 1) * scale;
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 10 * scale;
    ctx.stroke();
    ctx.restore();
  }
}

// ======================================================================
// 7. RETRO 80S SYNTHWAVE HORIZON GRID COUNTDOWN 2027
// ======================================================================
function drawSynthwaveGridCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const horizonY = height * 0.56;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const count = config.particleCount;

  ctx.save();
  const sunRadius = minDim * 0.22;
  const sunGrad = ctx.createLinearGradient(width / 2, horizonY - sunRadius, width / 2, horizonY);
  sunGrad.addColorStop(0, '#fef08a');
  sunGrad.addColorStop(0.5, '#f43f5e');
  sunGrad.addColorStop(1, '#8b5cf6');
  ctx.fillStyle = sunGrad;
  ctx.beginPath();
  ctx.arc(width / 2, horizonY, sunRadius, Math.PI, 0, false);
  ctx.fill();

  const bars = 8;
  for (let b = 1; b < bars; b++) {
    const by = horizonY - (b / bars) * sunRadius;
    ctx.fillStyle = '#000000';
    ctx.fillRect(width / 2 - sunRadius, by, sunRadius * 2, (b * 1.5) * scale);
  }
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = '#ec4899';
  ctx.lineWidth = 2 * scale;
  ctx.shadowColor = '#ec4899';
  ctx.shadowBlur = 10 * scale;

  const horizLines = 14;
  for (let h = 0; h < horizLines; h++) {
    const p = ((h / horizLines + progress * 1.2) % 1);
    const y = horizonY + Math.pow(p, 2.5) * (height - horizonY);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  const perspLines = 24;
  for (let p = 0; p <= perspLines; p++) {
    const bottomX = (p / perspLines) * width;
    ctx.beginPath();
    ctx.moveTo(width / 2, horizonY);
    ctx.lineTo(bottomX, height);
    ctx.stroke();
  }
  ctx.restore();

  for (let i = 0; i < count; i++) {
    const seed = i * 11.19;
    const x = hash(seed) * width;
    const y = hash(seed + 1) * horizonY;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, (hash(seed + 2) * 2 + 1) * scale, 0, Math.PI * 2);
    ctx.fillStyle = hash(seed + 3) > 0.5 ? '#38bdf8' : '#ec4899';
    ctx.fill();
    ctx.restore();
  }
}

// ======================================================================
// 8. QUANTUM CORE OVERLOAD COUNTDOWN 2027
// ======================================================================
function drawQuantumCoreCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const count = config.particleCount;
  const { tickPulse } = getCountdownState(progress, config.countdownStart || 10);

  const coreRadius = (minDim * 0.13) * (1 + tickPulse * 0.15);
  ctx.save();
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreRadius * 2);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.3, '#38bdf8');
  grad.addColorStop(0.7, '#6366f1');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(cx, cy, coreRadius * 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const coils = 4;
  for (let c = 0; c < coils; c++) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(progress * Math.PI * 2 * (c + 1) * 0.6);
    ctx.beginPath();
    ctx.ellipse(0, 0, minDim * 0.35, minDim * 0.15, (c * Math.PI) / coils, 0, Math.PI * 2);
    ctx.strokeStyle = c % 2 === 0 ? 'rgba(56, 189, 248, 0.4)' : 'rgba(168, 85, 247, 0.4)';
    ctx.lineWidth = 3 * scale;
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 15 * scale;
    ctx.stroke();
    ctx.restore();
  }

  for (let i = 0; i < count; i++) {
    const seed = i * 27.81;
    const a = hash(seed) * Math.PI * 2;
    const d = (hash(seed + 1) * 0.32 + 0.08) * minDim;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, (hash(seed + 2) * 2.5 + 1) * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#67e8f9';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 8 * scale;
    ctx.fill();
    ctx.restore();
  }
}

// ======================================================================
// 9. MATRIX CODE DECRYPTION COUNTDOWN 2027
// ======================================================================
function drawMatrixDecryptionCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const cols = 48;
  const colWidth = width / cols;

  ctx.save();
  ctx.font = `${Math.round(18 * scale)}px monospace`;
  ctx.textAlign = 'center';

  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテト';
  for (let c = 0; c < cols; c++) {
    const speed = (hash(c * 13) * 0.8 + 0.4);
    const yHead = ((progress * speed * 2 + hash(c * 7)) % 1) * height;
    const trailLen = 16;
    for (let t = 0; t < trailLen; t++) {
      const yChar = yHead - t * (22 * scale);
      if (yChar > 0 && yChar < height) {
        const charIdx = Math.floor((hash(c * 31 + t * 19 + Math.floor(time * 8)) * chars.length));
        const char = chars[charIdx % chars.length];
        const alpha = 1 - t / trailLen;
        ctx.fillStyle = t === 0 ? '#ffffff' : `rgba(56, 189, 248, ${alpha * 0.8})`;
        ctx.fillText(char, c * colWidth + colWidth / 2, yChar);
      }
    }
  }
  ctx.restore();
}

// ======================================================================
// 10. EDM FESTIVAL LASER BEAM & BASS DROP 2027
// ======================================================================
function drawEdmLaserStrobeCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height * 0.75;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const { tickPulse } = getCountdownState(progress, config.countdownStart || 10);

  const laserBeams = 16;
  for (let b = 0; b < laserBeams; b++) {
    const sweep = Math.sin(progress * 10 + b) * 0.3;
    const baseAngle = -Math.PI / 2 + ((b - laserBeams / 2) / laserBeams) * (Math.PI * 0.8) + sweep;
    const len = Math.max(width, height) * 1.1;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx + Math.cos(baseAngle) * len, cy + Math.sin(baseAngle) * len);
    ctx.strokeStyle = b % 2 === 0 ? `rgba(6, 182, 212, ${0.4 + tickPulse * 0.4})` : `rgba(236, 72, 153, ${0.4 + tickPulse * 0.4})`;
    ctx.lineWidth = (3 + tickPulse * 4) * scale;
    ctx.shadowColor = b % 2 === 0 ? '#06b6d4' : '#ec4899';
    ctx.shadowBlur = 20 * scale;
    ctx.stroke();
    ctx.restore();
  }

  for (let i = 0; i < config.particleCount; i++) {
    const seed = i * 17.51;
    const x = hash(seed) * width;
    const y = hash(seed + 1) * height;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, (hash(seed + 2) * 2.5 + 1) * scale, 0, Math.PI * 2);
    ctx.fillStyle = hash(seed + 3) > 0.5 ? '#38bdf8' : '#f472b6';
    ctx.fill();
    ctx.restore();
  }
}

// ======================================================================
// 11. GRAND MIDNIGHT FIREWORKS CLIMAX 2027
// ======================================================================
function drawFireworksClimaxCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const count = config.particleCount;
  const { isClimax } = getCountdownState(progress, config.countdownStart || 10);

  const bursts = isClimax
    ? [
        { cx: width * 0.5, cy: height * 0.35, tOffset: 0.1, color: '#fef08a' },
        { cx: width * 0.25, cy: height * 0.28, tOffset: 0.3, color: '#f59e0b' },
        { cx: width * 0.75, cy: height * 0.28, tOffset: 0.5, color: '#ec4899' },
        { cx: width * 0.38, cy: height * 0.45, tOffset: 0.7, color: '#38bdf8' },
        { cx: width * 0.62, cy: height * 0.45, tOffset: 0.9, color: '#10b981' },
      ]
    : [
        { cx: width * 0.3, cy: height * 0.35, tOffset: 0.0, color: '#fef08a' },
        { cx: width * 0.7, cy: height * 0.35, tOffset: 0.5, color: '#f59e0b' },
      ];

  bursts.forEach(({ cx, cy, tOffset, color }) => {
    const burstProgress = (progress * 3 + tOffset) % 1;
    const rays = 32;
    for (let r = 0; r < rays; r++) {
      const angle = (r / rays) * Math.PI * 2;
      const dist = burstProgress * (minDim * 0.24);
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist + Math.pow(burstProgress, 2) * (35 * scale);
      const alpha = Math.max(0, 1 - burstProgress);

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, (3.5 * (1 - burstProgress * 0.5)) * scale, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 12 * scale;
      ctx.globalAlpha = alpha;
      ctx.fill();
      ctx.restore();
    }
  });

  for (let i = 0; i < count; i++) {
    const seed = i * 13.91;
    const x = hash(seed) * width;
    const y = ((hash(seed + 1) + progress * 0.6) % 1) * height;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, (hash(seed + 2) * 2.5 + 1) * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#fde68a';
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 8 * scale;
    ctx.fill();
    ctx.restore();
  }
}

// ======================================================================
// 12. JAPANESE KAMURO WILLOW HANABI 2027
// ======================================================================
function drawKamuroWillowCountdown(
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
  const cy = height * 0.26;

  const streams = 48;
  for (let s = 0; s < streams; s++) {
    const angle = (s / streams) * Math.PI * 2;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    const steps = 30;
    for (let st = 1; st <= steps; st++) {
      const t = st / steps;
      const dist = t * (minDim * 0.38);
      const drop = Math.pow(t, 2.4) * (height * 0.42);
      const wx = cx + Math.cos(angle) * dist;
      const wy = cy + Math.sin(angle) * (dist * 0.4) + drop;
      ctx.lineTo(wx, wy);
    }
    ctx.strokeStyle = `rgba(254, 240, 138, ${0.25 + Math.sin(progress * 6 + s) * 0.15})`;
    ctx.lineWidth = 2 * scale;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 10 * scale;
    ctx.stroke();
    ctx.restore();
  }

  for (let i = 0; i < config.particleCount; i++) {
    const seed = i * 21.11;
    const x = hash(seed) * width;
    const y = ((hash(seed + 1) + progress * 0.5) % 1) * height;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, (hash(seed + 2) * 3 + 1) * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#d97706';
    ctx.shadowBlur = 8 * scale;
    ctx.fill();
    ctx.restore();
  }
}

// ======================================================================
// 13. SPARKLER WATERFALL RAIN 2027
// ======================================================================
function drawSparklerWaterfallCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const count = config.particleCount;

  for (let i = 0; i < count; i++) {
    const seed = i * 31.41;
    const x = hash(seed) * width;
    const speed = hash(seed + 1) * 0.6 + 0.7;
    const y = ((hash(seed + 2) + progress * speed) % 1) * height;
    const trailLen = (hash(seed + 3) * 35 + 15) * scale;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + (hash(seed + 4) - 0.5) * 8 * scale, y + trailLen);
    ctx.strokeStyle = `rgba(255, ${200 + Math.floor(hash(seed + 5) * 55)}, 120, ${hash(seed + 6) * 0.6 + 0.4})`;
    ctx.lineWidth = (hash(seed + 7) * 2 + 1) * scale;
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 8 * scale;
    ctx.stroke();
    ctx.restore();
  }
}

// ======================================================================
// 14. ROCK CONCERT PYRO GEYSER FOUNTAINS 2027
// ======================================================================
function drawPyroFountainsCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const nozzles = [width * 0.2, width * 0.35, width * 0.5, width * 0.65, width * 0.8];

  nozzles.forEach((nx) => {
    const sparks = 45;
    for (let s = 0; s < sparks; s++) {
      const seed = s * 7.73 + nx;
      const p = (progress * 2 + hash(seed)) % 1;
      const hMax = (height * 0.6) * (hash(seed + 1) * 0.4 + 0.8);
      const py = height - (Math.sin(p * Math.PI) * hMax);
      const px = nx + (hash(seed + 2) - 0.5) * (width * 0.08) * p;

      ctx.save();
      ctx.beginPath();
      ctx.arc(px, py, (hash(seed + 3) * 3 + 1.2) * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#fef08a';
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 10 * scale;
      ctx.fill();
      ctx.restore();
    }
  });
}

// ======================================================================
// 15. GREAT GATSBY ART DECO & CLOCKWORK GEAR COUNTDOWN 2027
// ======================================================================
function drawArtDecoGatsbyCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const { tickPulse } = getCountdownState(progress, config.countdownStart || 10);

  // Steampunk Brass Gears (Scaled to minDim so never cropped in landscape)
  const gears = [
    { x: cx, y: cy, r: minDim * 0.34, teeth: 24, speed: 0.1 },
    { x: cx - minDim * 0.32, y: cy - minDim * 0.20, r: minDim * 0.15, teeth: 16, speed: -0.2 },
    { x: cx + minDim * 0.32, y: cy + minDim * 0.20, r: minDim * 0.15, teeth: 16, speed: -0.2 },
  ];

  gears.forEach(({ x, y, r, teeth, speed }) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(progress * Math.PI * 2 * speed);

    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(217, 119, 6, ${0.28 + tickPulse * 0.2})`;
    ctx.lineWidth = 4 * scale;
    ctx.stroke();

    for (let t = 0; t < teeth; t++) {
      const angle = (t / teeth) * Math.PI * 2;
      const tx = Math.cos(angle) * r;
      const ty = Math.sin(angle) * r;
      ctx.fillStyle = '#b45309';
      ctx.fillRect(tx - 4 * scale, ty - 6 * scale, 8 * scale, 12 * scale);
    }
    ctx.restore();
  });

  ctx.save();
  ctx.translate(cx, cy);
  const handAngle = -Math.PI / 2 + progress * Math.PI * 2;
  ctx.rotate(handAngle);
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(minDim * 0.28, 0);
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 4 * scale;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 15 * scale;
  ctx.stroke();
  ctx.restore();
}

// ======================================================================
// 16. TIMES SQUARE GEODESIC CRYSTAL BALL DROP 2027
// ======================================================================
function drawTimesSquareBallDropCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const isLandscape = width > height;

  // Adaptive bounds: Never clip rays at the top in landscape mode
  const ballRadius = (isLandscape ? minDim * 0.08 : minDim * 0.11);
  const topLimit = isLandscape ? height * 0.14 : height * 0.18;
  const bottomLimit = isLandscape ? height * 0.65 : height * 0.72;
  const ballY = topLimit + progress * (bottomLimit - topLimit);

  // Spire / Pole with golden mast bracket
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(cx, isLandscape ? height * 0.04 : height * 0.06);
  ctx.lineTo(cx, isLandscape ? height * 0.78 : height * 0.85);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.lineWidth = 4 * scale;
  ctx.stroke();

  // Decorative spire crossbars
  const crossbars = [0.12, 0.28, 0.45, 0.62];
  crossbars.forEach((posRatio) => {
    const yBar = topLimit + (bottomLimit - topLimit) * posRatio;
    const barW = (isLandscape ? minDim * 0.12 : minDim * 0.16);
    ctx.beginPath();
    ctx.moveTo(cx - barW / 2, yBar);
    ctx.lineTo(cx + barW / 2, yBar);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
    ctx.lineWidth = 2 * scale;
    ctx.stroke();
  });
  ctx.restore();

  // Sunburst Rays radiating from Geodesic Ball
  ctx.save();
  const sunburstRays = 24;
  for (let r = 0; r < sunburstRays; r++) {
    const angle = (r / sunburstRays) * Math.PI * 2 + progress * 4;
    const rayLen = ballRadius * (1.3 + Math.sin(progress * 8 + r) * 0.25);
    ctx.beginPath();
    ctx.moveTo(cx, ballY);
    ctx.lineTo(cx + Math.cos(angle) * rayLen, ballY + Math.sin(angle) * rayLen);
    ctx.strokeStyle = `rgba(254, 240, 138, ${0.45 + Math.sin(progress * 10 + r) * 0.35})`;
    ctx.lineWidth = 2 * scale;
    ctx.stroke();
  }

  // Geodesic Crystal Ball Body
  ctx.beginPath();
  ctx.arc(cx, ballY, ballRadius, 0, Math.PI * 2);
  const grad = ctx.createRadialGradient(cx, ballY, 0, cx, ballY, ballRadius);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.4, '#fef08a');
  grad.addColorStop(0.8, '#f59e0b');
  grad.addColorStop(1, '#b45309');
  ctx.fillStyle = grad;
  ctx.shadowColor = '#eab308';
  ctx.shadowBlur = 28 * scale * config.glowIntensity;
  ctx.fill();

  // Crystal facets highlights
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();
  ctx.restore();

  // Confetti and Paparazzi Camera Flashes in Times Square
  for (let f = 0; f < 18; f++) {
    const seed = f * 13.73;
    const flashProgress = (progress * 6 + hash(seed)) % 1;
    if (flashProgress < 0.12) {
      const fx = hash(seed + 1) * width;
      const fy = hash(seed + 2) * height;
      ctx.save();
      ctx.beginPath();
      ctx.arc(fx, fy, (hash(seed + 3) * 3 + 2) * scale, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 16 * scale;
      ctx.fill();
      ctx.restore();
    }
  }
}

// ======================================================================
// 17. HOLLYWOOD 35MM FILM LEADER 2027
// ======================================================================
function drawFilmLeaderCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  const radius = minDim * 0.34;
  const sweepAngle = -Math.PI / 2 + ((progress * 10) % 1) * Math.PI * 2;

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.arc(cx, cy, radius * 0.8, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 3 * scale;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx - radius * 1.15, cy);
  ctx.lineTo(cx + radius * 1.15, cy);
  ctx.moveTo(cx, cy - radius * 1.15);
  ctx.lineTo(cx, cy + radius * 1.15);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, radius * 0.8, -Math.PI / 2, sweepAngle);
  ctx.closePath();
  ctx.fillStyle = 'rgba(254, 240, 138, 0.15)';
  ctx.fill();

  for (let g = 0; g < 40; g++) {
    const gx = Math.random() * width;
    const gy = Math.random() * height;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.fillRect(gx, gy, 2 * scale, (Math.random() * 8 + 2) * scale);
  }
  ctx.restore();
}

// ======================================================================
// 18. COSMIC STELLAR NEBULA & SUPERNOVA 2027
// ======================================================================
function drawCosmicSupernovaCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  const arms = 3;
  for (let a = 0; a < arms; a++) {
    ctx.save();
    ctx.beginPath();
    const armAngle = (a / arms) * Math.PI * 2 + progress * Math.PI * 2 * 0.5;
    for (let st = 0; st < 60; st++) {
      const dist = (st / 60) * (minDim * 0.42);
      const theta = armAngle + (st / 60) * Math.PI * 3;
      const px = cx + Math.cos(theta) * dist;
      const py = cy + Math.sin(theta) * dist * 0.7;
      if (st === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.strokeStyle = a === 0 ? 'rgba(56, 189, 248, 0.25)' : 'rgba(244, 114, 182, 0.25)';
    ctx.lineWidth = 8 * scale;
    ctx.stroke();
    ctx.restore();
  }

  for (let i = 0; i < config.particleCount; i++) {
    const seed = i * 19.87;
    const x = hash(seed) * width;
    const y = hash(seed + 1) * height;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, (hash(seed + 2) * 2.5 + 1) * scale, 0, Math.PI * 2);
    ctx.fillStyle = hash(seed + 3) > 0.6 ? '#67e8f9' : '#ffffff';
    ctx.fill();
    ctx.restore();
  }
}

// ======================================================================
// 19. GRAINS OF TIME HOURGLASS COUNTDOWN 2027
// ======================================================================
function drawHourglassCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  // Responsive Hourglass Glass Bulb Frame
  const glassH = minDim * 0.72;
  const glassW = minDim * 0.42;
  const neckW = minDim * 0.05;

  ctx.save();
  // Hourglass top & bottom brass plates
  ctx.fillStyle = '#b45309';
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.roundRect(cx - glassW * 0.6, cy - glassH / 2 - 12 * scale, glassW * 1.2, 14 * scale, 4 * scale);
  ctx.roundRect(cx - glassW * 0.6, cy + glassH / 2, glassW * 1.2, 14 * scale, 4 * scale);
  ctx.fill();
  ctx.stroke();

  // Glass contours
  ctx.beginPath();
  // Left side bulb curve
  ctx.moveTo(cx - glassW / 2, cy - glassH / 2);
  ctx.bezierCurveTo(cx - glassW / 2, cy - glassH * 0.2, cx - neckW, cy - glassH * 0.05, cx - neckW, cy);
  ctx.bezierCurveTo(cx - neckW, cy + glassH * 0.05, cx - glassW / 2, cy + glassH * 0.2, cx - glassW / 2, cy + glassH / 2);
  // Right side bulb curve
  ctx.moveTo(cx + glassW / 2, cy - glassH / 2);
  ctx.bezierCurveTo(cx + glassW / 2, cy - glassH * 0.2, cx + neckW, cy - glassH * 0.05, cx + neckW, cy);
  ctx.bezierCurveTo(cx + neckW, cy + glassH * 0.05, cx + glassW / 2, cy + glassH * 0.2, cx + glassW / 2, cy + glassH / 2);
  ctx.strokeStyle = 'rgba(254, 240, 138, 0.35)';
  ctx.lineWidth = 2.5 * scale;
  ctx.stroke();
  ctx.restore();

  // Falling Golden Sand Grains Stream
  const count = config.particleCount;
  for (let i = 0; i < count; i++) {
    const seed = i * 23.17;
    const p = (progress + hash(seed)) % 1;
    const streamY = cy - glassH * 0.42 + p * (glassH * 0.84);
    const distFromCenter = Math.abs(p - 0.5) * 2;
    const spread = distFromCenter * (glassW * 0.38) + neckW * 0.8;
    const streamX = cx + (hash(seed + 1) - 0.5) * spread;

    ctx.save();
    ctx.beginPath();
    ctx.arc(streamX, streamY, (hash(seed + 2) * 2.5 + 1) * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 6 * scale;
    ctx.fill();
    ctx.restore();
  }
}

// ======================================================================
// 20. FLOATING SKY LANTERNS COUNTDOWN 2027
// ======================================================================
function drawFloatingLanternsCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const lanterns = 36;

  for (let l = 0; l < lanterns; l++) {
    const seed = l * 18.23;
    const speed = hash(seed) * 0.3 + 0.2;
    const ly = ((hash(seed + 1) - progress * speed + 1) % 1) * height;
    const lx = hash(seed + 2) * width + Math.sin(progress * 4 + l) * (20 * scale);
    const size = (hash(seed + 3) * 16 + 12) * scale;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(lx - size / 2, ly - size * 0.7, size, size * 1.4, 4 * scale);
    const grad = ctx.createRadialGradient(lx, ly, 0, lx, ly, size);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.4, '#f59e0b');
    grad.addColorStop(1, 'rgba(217, 119, 6, 0.1)');
    ctx.fillStyle = grad;
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 20 * scale;
    ctx.fill();
    ctx.restore();
  }
}

// ======================================================================
// 21. MINIMALIST SWISS KINETIC TYPOGRAPHY COUNTDOWN 2027
// ======================================================================
function drawKineticSwissCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const radius = minDim * 0.35; // Perfectly responsive in landscape & portrait

  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 4 * scale;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 6 * scale;
  ctx.stroke();

  const ticks = 60;
  for (let t = 0; t < ticks; t++) {
    const angle = (t / ticks) * Math.PI * 2;
    const isMajor = t % 5 === 0;
    const inner = radius - (isMajor ? 14 : 7) * scale;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * inner, cy + Math.sin(angle) * inner);
    ctx.lineTo(cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius);
    ctx.strokeStyle = isMajor ? '#ffffff' : 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = (isMajor ? 2 : 1) * scale;
    ctx.stroke();
  }
  ctx.restore();
}

// ======================================================================
// 22. INFINITE 3D BOKEH WARP TUNNEL COUNTDOWN 2027
// ======================================================================
function drawSpeedTunnelCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const maxRadius = Math.max(width, height) * 0.65;
  const count = config.particleCount;

  const rings = 14;
  for (let r = 0; r < rings; r++) {
    const p = ((r / rings + progress * 1.5) % 1);
    const radius = Math.pow(p, 2.2) * maxRadius;
    const alpha = Math.sin(p * Math.PI) * 0.4;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(254, 240, 138, ${alpha})`;
    ctx.lineWidth = (2 + p * 6) * scale;
    ctx.stroke();
    ctx.restore();
  }

  for (let i = 0; i < count; i++) {
    const seed = i * 29.43;
    const angle = hash(seed) * Math.PI * 2;
    const p = ((hash(seed + 1) + progress * 1.2) % 1);
    const dist = Math.pow(p, 2.0) * maxRadius;
    const x = cx + Math.cos(angle) * dist;
    const y = cy + Math.sin(angle) * dist;
    const pSize = (hash(seed + 2) * 4 + 1) * scale * (p * 2 + 0.5);

    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, pSize, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(254, 240, 138, ${Math.sin(p * Math.PI)})`;
    ctx.fill();
    ctx.restore();
  }
}

// ======================================================================
// 23. RETRO SPLIT-FLAP CLOCKWORK COUNTDOWN 2027
// ======================================================================
function drawFlipClockCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;

  // Fully responsive Solari flip-flap board width & height
  const cardW = Math.min(width * 0.82, Math.max(minDim * 0.68, 560 * scale));
  const cardH = minDim * 0.44;

  ctx.save();
  // Card base plate
  ctx.beginPath();
  ctx.roundRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 16 * scale);
  ctx.fillStyle = '#111113';
  ctx.strokeStyle = '#3f3f46';
  ctx.lineWidth = 4 * scale;
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 24 * scale;
  ctx.fill();
  ctx.stroke();

  // Corner metallic rivets
  const cornerOffX = cardW / 2 - 16 * scale;
  const cornerOffY = cardH / 2 - 16 * scale;
  const corners = [
    [-cornerOffX, -cornerOffY],
    [cornerOffX, -cornerOffY],
    [-cornerOffX, cornerOffY],
    [cornerOffX, cornerOffY],
  ];
  ctx.fillStyle = '#71717a';
  corners.forEach(([ox, oy]) => {
    ctx.beginPath();
    ctx.arc(cx + ox, cy + oy, 3.5 * scale, 0, Math.PI * 2);
    ctx.fill();
  });

  // Center horizontal split fold line
  ctx.beginPath();
  ctx.moveTo(cx - cardW / 2, cy);
  ctx.lineTo(cx + cardW / 2, cy);
  ctx.strokeStyle = '#09090b';
  ctx.lineWidth = 6 * scale;
  ctx.stroke();

  // Flip mechanical hinge blocks on left and right
  ctx.fillStyle = '#27272a';
  ctx.fillRect(cx - cardW / 2 - 4 * scale, cy - 14 * scale, 8 * scale, 28 * scale);
  ctx.fillRect(cx + cardW / 2 - 4 * scale, cy - 14 * scale, 8 * scale, 28 * scale);
  ctx.restore();
}

// ======================================================================
// 24. METROPOLIS SKYLINE BEACON & LASER PILLAR 2027
// ======================================================================
function drawSkylineLaserCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const { tickPulse } = getCountdownState(progress, config.countdownStart || 10);

  // 1. Dual Sweeping Searchlight Beams across Sky
  const searchlights = [
    { x: width * 0.25, baseA: -Math.PI / 2 + Math.sin(progress * 6) * 0.45 },
    { x: width * 0.75, baseA: -Math.PI / 2 + Math.cos(progress * 6) * 0.45 },
  ];
  searchlights.forEach(({ x, baseA }) => {
    ctx.save();
    const beamLen = Math.max(width, height) * 1.2;
    const endX = x + Math.cos(baseA) * beamLen;
    const endY = height + Math.sin(baseA) * beamLen;
    const grad = ctx.createLinearGradient(x, height, endX, endY);
    grad.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
    grad.addColorStop(0.5, 'rgba(245, 158, 11, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x - 20 * scale, height);
    ctx.lineTo(endX - 80 * scale, endY);
    ctx.lineTo(endX + 80 * scale, endY);
    ctx.lineTo(x + 20 * scale, height);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  });

  // 2. Central Monumental Laser Pillar
  ctx.save();
  const laserW = (32 + tickPulse * 24) * scale;
  const grad = ctx.createLinearGradient(cx - laserW / 2, 0, cx + laserW / 2, 0);
  grad.addColorStop(0, 'rgba(234, 179, 8, 0)');
  grad.addColorStop(0.3, 'rgba(254, 240, 138, 0.5)');
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)');
  grad.addColorStop(0.7, 'rgba(254, 240, 138, 0.5)');
  grad.addColorStop(1, 'rgba(234, 179, 8, 0)');
  ctx.fillStyle = grad;
  ctx.shadowColor = '#eab308';
  ctx.shadowBlur = 35 * scale * config.glowIntensity;
  ctx.fillRect(cx - laserW / 2, 0, laserW, height);
  ctx.restore();

  // 3. Metropolitan City Skyline Silhouettes across the bottom
  const bHeight = minDim * 0.26;
  const bBaseY = height - bHeight;
  const buildings = 18;
  const bWidth = width / buildings;

  ctx.save();
  for (let b = 0; b < buildings; b++) {
    const seed = b * 37.19;
    const bh = bHeight * (0.35 + hash(seed) * 0.65);
    const bx = b * bWidth;
    const by = height - bh;

    // Building silhouette
    ctx.fillStyle = '#0a0a0c';
    ctx.fillRect(bx, by, bWidth + 1, bh);

    // Architectural golden windows grid
    const floors = Math.floor(bh / (14 * scale));
    const winCols = 3;
    for (let f = 1; f < floors; f++) {
      for (let wc = 0; wc < winCols; wc++) {
        const winSeed = seed + f * 5 + wc;
        if (hash(winSeed) > 0.45) {
          const wx = bx + (wc + 0.5) * (bWidth / winCols) - 2 * scale;
          const wy = by + f * (14 * scale);
          ctx.fillStyle = hash(winSeed + 1) > 0.3 ? 'rgba(254, 240, 138, 0.7)' : 'rgba(56, 189, 248, 0.6)';
          ctx.fillRect(wx, wy, 4 * scale, 6 * scale);
        }
      }
    }
  }
  ctx.restore();

  // 4. Starlight Embers
  for (let i = 0; i < config.particleCount; i++) {
    const seed = i * 29.87;
    const px = hash(seed) * width;
    const py = ((hash(seed + 1) - progress * 0.4 + 1) % 1) * height;
    ctx.save();
    ctx.beginPath();
    ctx.arc(px, py, (hash(seed + 2) * 2.5 + 1) * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 8 * scale;
    ctx.fill();
    ctx.restore();
  }
}

// ======================================================================
// 25. CHAMPAGNE FLUTE EFFERVESCENCE & TOAST 2027
// ======================================================================
function drawChampagneToastCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const count = config.particleCount;
  const { isClimax, tickPulse } = getCountdownState(progress, config.countdownStart || 10);

  for (let i = 0; i < count; i++) {
    const seed = i * 15.31;
    const speed = hash(seed) * 0.7 + 0.6;
    const by = ((hash(seed + 1) - progress * speed + 1) % 1) * height;
    const bx = cx + (hash(seed + 2) - 0.5) * (width * 0.45);
    const bSize = (hash(seed + 3) * 4 + 1.5) * scale;

    ctx.save();
    ctx.beginPath();
    ctx.arc(bx, by, bSize, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(254, 240, 138, 0.75)';
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 8 * scale;
    ctx.fill();
    ctx.restore();
  }

  if (isClimax || tickPulse > 0.4) {
    ctx.save();
    const starRays = 16;
    for (let r = 0; r < starRays; r++) {
      const angle = (r / starRays) * Math.PI * 2;
      const rLen = (minDim * 0.22) * (isClimax ? 1.5 : tickPulse);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(angle) * rLen, cy + Math.sin(angle) * rLen);
      ctx.strokeStyle = `rgba(255, 255, 255, ${isClimax ? 0.8 : tickPulse})`;
      ctx.lineWidth = 2 * scale;
      ctx.stroke();
    }
    ctx.restore();
  }
}

// ======================================================================
// 26. MEGA STADIUM CONFETTI CANNON BLAST 2027
// ======================================================================
function drawStadiumConfettiCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const count = config.particleCount;

  for (let i = 0; i < count; i++) {
    const seed = i * 26.43;
    const speed = hash(seed) * 0.8 + 0.5;
    const cy = ((hash(seed + 1) + progress * speed) % 1) * height;
    const cx = hash(seed + 2) * width + Math.sin(progress * 5 + seed) * (40 * scale);
    const w = (hash(seed + 3) * 14 + 8) * scale;
    const h = (hash(seed + 4) * 8 + 4) * scale;
    const rot = progress * Math.PI * 4 * (hash(seed + 5) - 0.5);

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rot);
    ctx.scale(1, Math.sin(rot * 2));
    ctx.beginPath();
    ctx.rect(-w / 2, -h / 2, w, h);
    ctx.fillStyle = hash(seed + 6) > 0.4 ? '#facc15' : '#ef4444';
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 6 * scale;
    ctx.fill();
    ctx.restore();
  }
}

// ======================================================================
// 27. SERPENTINE SPIRAL RIBBONS 2027
// ======================================================================
function drawSerpentineRibbonsCountdown(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const minDim = Math.min(width, height);
  const scale = minDim / 1080;
  const ribbons = 8;

  for (let r = 0; r < ribbons; r++) {
    const rx = (width / ribbons) * (r + 0.5);
    ctx.save();
    ctx.beginPath();
    for (let y = 0; y < height; y += 15 * scale) {
      const p = y / height;
      const xOffset = Math.sin(p * 8 + progress * Math.PI * 2 * 1.5 + r) * (35 * scale);
      if (y === 0) ctx.moveTo(rx + xOffset, y);
      else ctx.lineTo(rx + xOffset, y);
    }
    ctx.strokeStyle = r % 2 === 0 ? '#facc15' : '#f43f5e';
    ctx.lineWidth = 5 * scale;
    ctx.shadowColor = '#eab308';
    ctx.shadowBlur = 8 * scale;
    ctx.stroke();
    ctx.restore();
  }
}

// ======================================================================
// 28. CUSTOM LIVE CODE ENGINE
// ======================================================================
function drawCustomCode(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  if (!config.customCode) return;
  try {
    const renderFn = new Function('ctx', 't', 'progress', 'width', 'height', 'Math', config.customCode);
    renderFn(ctx, time, progress, width, height, Math);
  } catch (err) {
    ctx.save();
    ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
    ctx.font = '20px sans-serif';
    ctx.fillText('Custom Code Error: ' + (err as Error).message, 40, 60);
    ctx.restore();
  }
}

// ======================================================================
// COLOR PALETTE SYSTEM FOR TYPOGRAPHY & COUNTDOWN DIGITS
// ======================================================================
interface TypographyPalette {
  createGradient: (ctx: CanvasRenderingContext2D, y1: number, y2: number) => CanvasGradient;
  glowColor: string;
  rimStroke: string;
  subtitleColor: string;
}

function getTypographyPalette(palette: string): TypographyPalette {
  switch (palette) {
    case 'cyber_neon':
      return {
        createGradient: (ctx, y1, y2) => {
          const g = ctx.createLinearGradient(0, y1, 0, y2);
          g.addColorStop(0, '#ffffff');
          g.addColorStop(0.25, '#38bdf8');
          g.addColorStop(0.65, '#818cf8');
          g.addColorStop(1, '#ec4899');
          return g;
        },
        glowColor: '#06b6d4',
        rimStroke: 'rgba(56, 189, 248, 0.5)',
        subtitleColor: '#7dd3fc',
      };

    case 'ice_aurora':
      return {
        createGradient: (ctx, y1, y2) => {
          const g = ctx.createLinearGradient(0, y1, 0, y2);
          g.addColorStop(0, '#ffffff');
          g.addColorStop(0.22, '#bae6fd');
          g.addColorStop(0.52, '#38bdf8');
          g.addColorStop(0.85, '#0284c7');
          g.addColorStop(1, '#0c4a6e');
          return g;
        },
        glowColor: '#38bdf8',
        rimStroke: 'rgba(56, 189, 248, 0.65)',
        subtitleColor: '#bae6fd',
      };

    case 'emerald_ruby':
      return {
        createGradient: (ctx, y1, y2) => {
          const g = ctx.createLinearGradient(0, y1, 0, y2);
          g.addColorStop(0, '#ffffff');
          g.addColorStop(0.25, '#a7f3d0');
          g.addColorStop(0.55, '#10b981');
          g.addColorStop(0.85, '#047857');
          g.addColorStop(1, '#064e3b');
          return g;
        },
        glowColor: '#10b981',
        rimStroke: 'rgba(16, 185, 129, 0.6)',
        subtitleColor: '#a7f3d0',
      };

    case 'champagne_rose':
      return {
        createGradient: (ctx, y1, y2) => {
          const g = ctx.createLinearGradient(0, y1, 0, y2);
          g.addColorStop(0, '#ffffff');
          g.addColorStop(0.25, '#fce7f3');
          g.addColorStop(0.55, '#f472b6');
          g.addColorStop(0.85, '#e11d48');
          g.addColorStop(1, '#881337');
          return g;
        },
        glowColor: '#fb7185',
        rimStroke: 'rgba(244, 114, 182, 0.6)',
        subtitleColor: '#fbcfe8',
      };

    case 'amber_warm':
      return {
        createGradient: (ctx, y1, y2) => {
          const g = ctx.createLinearGradient(0, y1, 0, y2);
          g.addColorStop(0, '#ffffff');
          g.addColorStop(0.22, '#fed7aa');
          g.addColorStop(0.52, '#fb923c');
          g.addColorStop(0.85, '#ea580c');
          g.addColorStop(1, '#7c2d12');
          return g;
        },
        glowColor: '#f97316',
        rimStroke: 'rgba(249, 115, 22, 0.65)',
        subtitleColor: '#fed7aa',
      };

    case 'gold_luxury':
    default:
      return {
        createGradient: (ctx, y1, y2) => {
          const g = ctx.createLinearGradient(0, y1, 0, y2);
          g.addColorStop(0, '#ffffff');
          g.addColorStop(0.22, '#fef08a');
          g.addColorStop(0.52, '#f59e0b');
          g.addColorStop(0.85, '#d97706');
          g.addColorStop(1, '#78350f');
          return g;
        },
        glowColor: '#eab308',
        rimStroke: 'rgba(217, 119, 6, 0.7)',
        subtitleColor: '#fde68a',
      };
  }
}

// ======================================================================
// MASTER COUNTDOWN & TYPOGRAPHY OVERLAY (100% Responsive to minDim)
// ======================================================================
function drawCountdownMasterOverlay(
  ctx: CanvasRenderingContext2D,
  config: MotionConfig,
  time: number,
  progress: number,
  width: number,
  height: number
) {
  const cx = width / 2;
  const cy = height / 2;
  const minDim = Math.min(width, height);
  const scale = minDim / 1080; // Perfectly scales in 16:9, 9:16, or 1:1!

  let fontFam = "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
  if (config.fontFamily === 'Cinzel') {
    fontFam = "'Cinzel', Georgia, serif";
  } else if (config.fontFamily === 'Plus Jakarta Sans') {
    fontFam = "'Plus Jakarta Sans', -apple-system, sans-serif";
  } else if (config.fontFamily === 'JetBrains Mono') {
    fontFam = "'JetBrains Mono', monospace";
  }

  const textStyle = config.textRenderStyle || 'pure_solid_font';
  const palette = getTypographyPalette(config.colorPalette);

  const { isClimax, currentNumber, tickPulse, climaxProgress } = getCountdownState(
    progress,
    config.countdownStart || 10
  );

  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 1. COUNTDOWN STATE (When counting down: 10, 9, 8... 1)
  if (!isClimax) {
    let displayNum = currentNumber.toString();
    if (config.countdownStyle === 'roman_dial') {
      displayNum = toRoman(currentNumber);
    } else if (config.countdownStyle === 'digital_hud') {
      displayNum = currentNumber < 10 ? `0${currentNumber}` : currentNumber.toString();
    }

    const bounceScale = 1 + tickPulse * 0.16;
    const numFontSize = Math.round(155 * scale * bounceScale);

    ctx.save();
    ctx.translate(cx, cy);

    // Set font size, weight, and family
    ctx.font = `900 ${numFontSize}px ${fontFam}`;

    // Soft dark feathered circular vignette behind the text so background rings/particles never clash with digits
    const maskR = numFontSize * 1.05;
    const vignetteGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, maskR);
    vignetteGrad.addColorStop(0, 'rgba(0, 0, 0, 0.75)');
    vignetteGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0.4)');
    vignetteGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = vignetteGrad;
    ctx.beginPath();
    ctx.arc(0, 0, maskR, 0, Math.PI * 2);
    ctx.fill();

    // Spacing for Roman characters (e.g. VIII, VII) so glyphs have clean breathing space
    if ('letterSpacing' in ctx) {
      const spacingPx = config.countdownStyle === 'roman_dial' ? Math.round(5 * scale) : Math.round(2 * scale);
      (ctx as any).letterSpacing = `${spacingPx}px`;
    }

    // High-end multi-stop gradient for pure solid font typography
    const numGrad = palette.createGradient(ctx, -numFontSize * 0.5, numFontSize * 0.5);

    // If outer rim is chosen, stroke BEHIND the fill with round joins so NO internal seams exist!
    if (textStyle === 'outer_rim_smooth') {
      ctx.save();
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.lineWidth = 6 * scale;
      ctx.strokeStyle = palette.rimStroke;
      ctx.strokeText(displayNum, 0, 0);
      ctx.restore();
    }

    // Celestial glow & ambient drop shadow
    if (config.glowIntensity > 0 || textStyle === 'soft_glow_font') {
      ctx.shadowColor = palette.glowColor;
      ctx.shadowBlur = (textStyle === 'soft_glow_font' ? 35 : 20 + tickPulse * 25) * scale * (config.glowIntensity || 1);
    } else {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 14 * scale;
    }

    // PURE SOLID FONT TYPOGRAPHY (Zero stroke on top = Zero seam lines!)
    ctx.fillStyle = numGrad;
    ctx.fillText(displayNum, 0, 0);

    // Optional specular shimmer core if enabled
    if (config.goldShimmer) {
      ctx.save();
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      const highlightGrad = ctx.createLinearGradient(0, -numFontSize * 0.45, 0, 0);
      highlightGrad.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
      highlightGrad.addColorStop(0.7, 'rgba(255, 255, 255, 0.05)');
      highlightGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = highlightGrad;
      ctx.fillText(displayNum, 0, 0);
      ctx.restore();
    }

    ctx.restore();

    // Top Headline Tag (Only in full_with_year mode)
    if (config.textDisplayMode === 'full_with_year' && config.headlineText) {
      const headY = cy - 125 * scale;
      const headSize = Math.round(24 * scale);
      ctx.font = `700 ${headSize}px ${fontFam}`;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 10 * scale;
      if ('letterSpacing' in ctx) {
        (ctx as any).letterSpacing = `${Math.round(6 * scale)}px`;
      }
      ctx.fillText(config.headlineText, cx, headY);
    }

    // Bottom Subtitle (Only in full_with_year mode)
    if (config.textDisplayMode === 'full_with_year' && config.subtitleText) {
      const subY = cy + 125 * scale;
      const subSize = Math.round(16 * scale);
      ctx.font = `600 ${subSize}px Outfit, sans-serif`;
      ctx.fillStyle = palette.subtitleColor;
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 8 * scale;
      if ('letterSpacing' in ctx) {
        (ctx as any).letterSpacing = `${Math.round(5 * scale)}px`;
      }
      ctx.fillText(config.subtitleText, cx, subY);
    }
  }

  // 2. GRAND CLIMAX REVEAL (When countdown hits 0)
  else {
    if (config.textDisplayMode === 'countdown_only') {
      const zeroSize = Math.round(175 * scale * (1 + Math.sin(climaxProgress * Math.PI) * 0.1));
      ctx.save();
      ctx.translate(cx, cy);
      ctx.font = `900 ${zeroSize}px ${fontFam}`;

      // 0 ALWAYS USES THE EXACT SAME PALETTE AS 10..1 (No more turning into gold on blue/ice themes!)
      const zeroGrad = palette.createGradient(ctx, -zeroSize * 0.5, zeroSize * 0.5);
      ctx.fillStyle = zeroGrad;
      ctx.shadowColor = palette.glowColor;
      ctx.shadowBlur = 35 * scale * config.glowIntensity;

      if (textStyle === 'outer_rim_smooth') {
        ctx.save();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 6 * scale;
        ctx.strokeStyle = palette.rimStroke;
        ctx.strokeText('0', 0, 0);
        ctx.restore();
      }

      ctx.fillText('0', 0, 0);
      ctx.restore();
    } else {
      const yearY = cy - 15 * scale;
      const yearFontSize = Math.round(155 * scale * (1 + Math.sin(climaxProgress * Math.PI) * 0.08));

      ctx.save();
      ctx.font = `900 ${yearFontSize}px ${fontFam}`;

      // Year text also harmonized with current palette!
      const yearGrad = palette.createGradient(ctx, -yearFontSize * 0.5, yearFontSize * 0.5);
      ctx.fillStyle = yearGrad;
      if (config.glowIntensity > 0) {
        ctx.shadowColor = palette.glowColor;
        ctx.shadowBlur = (30 + Math.sin(climaxProgress * Math.PI) * 18) * scale * config.glowIntensity;
      }

      if (textStyle === 'outer_rim_smooth') {
        ctx.save();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 6 * scale;
        ctx.strokeStyle = palette.rimStroke;
        ctx.strokeText(config.yearText || '2027', cx, yearY);
        ctx.restore();
      }

      ctx.fillText(config.yearText || '2027', cx, yearY);
      ctx.restore();

      // Top Headline: "HAPPY NEW YEAR"
      const headY = cy - 120 * scale;
      const headSize = Math.round(30 * scale);
      ctx.font = `800 ${headSize}px ${fontFam}`;
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 12 * scale;
      if ('letterSpacing' in ctx) {
        (ctx as any).letterSpacing = `${Math.round(8 * scale)}px`;
      }
      ctx.fillText('HAPPY NEW YEAR', cx, headY);

      // Bottom Subtitle: "WELCOME THE FUTURE"
      const subY = cy + 105 * scale;
      const subSize = Math.round(17 * scale);
      ctx.font = `600 ${subSize}px Outfit, sans-serif`;
      ctx.fillStyle = palette.subtitleColor;
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 8 * scale;
      if ('letterSpacing' in ctx) {
        (ctx as any).letterSpacing = `${Math.round(6 * scale)}px`;
      }
      ctx.fillText(config.subtitleText || 'WELCOME THE FUTURE', cx, subY);
    }
  }

  ctx.restore();
}
