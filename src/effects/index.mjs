/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    EFFECTS MANAGER (ES6+ CLASS)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Central effects management system with ES6+ class syntax.
 * Aggregates particle, lighting, weather, animation, and UI systems.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class EffectsManager {
  constructor() {
    this.particles = [];
    this.systems = {};
  }

  init() {
    // Instantiate all systems
    if (typeof FireflySystem !== 'undefined') this.systems.fireflies = new FireflySystem();
    if (typeof DustSystem !== 'undefined') this.systems.dust = new DustSystem();
    if (typeof SparkleSystem !== 'undefined') this.systems.sparkles = new SparkleSystem();
    if (typeof SteamSystem !== 'undefined') this.systems.steam = new SteamSystem();
    if (typeof FogSystem !== 'undefined') this.systems.fog = new FogSystem();
    
    if (typeof WeatherSystem !== 'undefined') this.systems.weather = new WeatherSystem();
    if (typeof FallingLeavesSystem !== 'undefined') this.systems.leaves = new FallingLeavesSystem();
    if (typeof LightingSystem !== 'undefined') this.systems.lighting = new LightingSystem();

    // Initialize systems that need it
    this.systems.fireflies?.init();
    this.systems.dust?.init();
    this.systems.fog?.init();
    this.systems.weather?.init();
    this.systems.leaves?.init();

    console.log('[EffectsManager] Sistemi inizializzati');
    return this;
  }

  update(dt) {
    const area = window.gameState?.currentArea;

    // Aggiorna sempre
    this.systems.sparkles?.update(dt);
    this.systems.lighting?.update(dt);
    
    if (typeof ScreenShake !== 'undefined') ScreenShake.update(dt);

    // Aggiorna in base all'area
    if (area === 'industriale') {
       this.systems.steam?.update(dt);
       // Emissione automatica per ciminiere (posizioni fisse in IndustrialeArea)
       this.systems.steam?.emitSteam(110, 20);
       this.systems.steam?.emitSteam(290, 15);
    }
    
    if (area === 'cimitero' || area === 'giardini' || area === 'giardini_tracce') {
       this.systems.fog?.update(dt);
       this.systems.fireflies?.update(dt);
    }
    
    if (area === 'cimitero') {
       this.systems.leaves?.setActive(true);
       this.systems.leaves?.update(dt);
    } else {
       this.systems.leaves?.setActive(false);
    }

    if (this.systems.weather?.active) this.systems.weather.update(dt);
  }

  draw(ctx) {
    const area = window.gameState?.currentArea;

    // Background FX
    if (area === 'industriale') this.systems.steam?.draw(ctx);
    if (area === 'cimitero' || area === 'giardini' || area === 'giardini_tracce') {
       this.systems.fog?.draw(ctx);
       this.systems.fireflies?.draw(ctx);
    }
    
    // Foreground FX
    this.systems.leaves?.draw(ctx);
    this.systems.weather?.draw(ctx);
    this.systems.sparkles?.draw(ctx);
    
    // Vignetta (da ambient.mjs)
    if (typeof Vignette !== 'undefined') Vignette.draw(ctx);
  }

  /**
   * Get all active systems
   * @returns {Array}
   */
  getAll() {
    return Object.values(this.systems);
  }

  /**
   * Add a system manually
   * @param {string} name - System name
   * @param {Object} system - System instance
   */
  addSystem(name, system) {
    if (system) {
      this.systems[name] = system;
    }
  }

  /**
   * Remove a system
   * @param {string} name - System name
   */
  removeSystem(name) {
    delete this.systems[name];
  }

  /**
   * Clear all systems
   */
  clear() {
    this.systems = {};
  }
}

// Singleton instance
const effectsManager = new EffectsManager();

// Global exports
if (typeof window !== 'undefined') {
  window.Effects = effectsManager;
  window.EffectsManager = EffectsManager;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EffectsManager, effectsManager };
}

export { EffectsManager, effectsManager };
export default effectsManager;
