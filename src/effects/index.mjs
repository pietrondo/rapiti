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
    // Particle Systems
    this.ParticleSystem = typeof ParticleSystem !== 'undefined' ? ParticleSystem : null;
    this.FireflySystem = typeof FireflySystem !== 'undefined' ? FireflySystem : null;
    this.DustSystem = typeof DustSystem !== 'undefined' ? DustSystem : null;
    this.SparkleSystem = typeof SparkleSystem !== 'undefined' ? SparkleSystem : null;

    // Lighting Systems
    this.LightingSystem = typeof LightingSystem !== 'undefined' ? LightingSystem : null;
    this.TorchSystem = typeof TorchSystem !== 'undefined' ? TorchSystem : null;
    this.ShadowSystem = typeof ShadowSystem !== 'undefined' ? ShadowSystem : null;

    // Weather Systems
    this.WeatherSystem = typeof WeatherSystem !== 'undefined' ? WeatherSystem : null;
    this.FallingLeavesSystem =
      typeof FallingLeavesSystem !== 'undefined' ? FallingLeavesSystem : null;

    // Animation Systems
    this.DoorSystem = typeof DoorSystem !== 'undefined' ? DoorSystem : null;
    this.WindowSystem = typeof WindowSystem !== 'undefined' ? WindowSystem : null;
    this.WildlifeSystem = typeof WildlifeSystem !== 'undefined' ? WildlifeSystem : null;

    // UI Systems
    this.UITransitions = typeof UITransitions !== 'undefined' ? UITransitions : null;
    this.MenuAnimations = typeof MenuAnimations !== 'undefined' ? MenuAnimations : null;
    this.PuzzleAnimations = typeof PuzzleAnimations !== 'undefined' ? PuzzleAnimations : null;

    // Active systems
    this.systems = [];
    this.particleSystem = null;
    this.lightingSystem = null;
    this.weatherSystem = null;
  }

  /**
   * Initialize all effect systems
   * @returns {EffectsManager}
   */
  init() {
    this.systems = [];

    if (this.ParticleSystem) {
      this.particleSystem = new this.ParticleSystem();
      this.systems.push(this.particleSystem);
    }
    if (this.LightingSystem) {
      this.lightingSystem = new this.LightingSystem();
      this.systems.push(this.lightingSystem);
    }
    if (this.WeatherSystem) {
      this.weatherSystem = new this.WeatherSystem();
      this.systems.push(this.weatherSystem);
    }

    console.log('[EffectsManager] Initialized');
    return this;
  }

  /**
   * Update all active systems
   * @param {number} dt - Delta time
   */
  update(dt) {
    for (const system of this.systems) {
      system?.update?.(dt);
    }
  }

  /**
   * Draw all active systems
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  draw(ctx) {
    for (const system of this.systems) {
      system?.draw?.(ctx);
    }
  }

  /**
   * Get all active systems
   * @returns {Array}
   */
  getAll() {
    return this.systems.slice();
  }

  /**
   * Add a system manually
   * @param {Object} system - System instance
   */
  addSystem(system) {
    if (system) {
      this.systems.push(system);
    }
  }

  /**
   * Remove a system
   * @param {Object} system - System to remove
   */
  removeSystem(system) {
    const idx = this.systems.indexOf(system);
    if (idx >= 0) {
      this.systems.splice(idx, 1);
    }
  }

  /**
   * Clear all systems
   */
  clear() {
    this.systems = [];
    this.particleSystem = null;
    this.lightingSystem = null;
    this.weatherSystem = null;
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
