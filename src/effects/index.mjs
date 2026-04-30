/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EFFECTS MODULE - Index
 * Esporta tutti i sistemi di effetti
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Importa i moduli (per browser, saranno caricati separatamente)
// In ambiente Node.js, usa require()

const Effects = {
  // Particle Systems
  ParticleSystem: typeof ParticleSystem !== 'undefined' ? ParticleSystem : null,
  FireflySystem: typeof FireflySystem !== 'undefined' ? FireflySystem : null,
  DustSystem: typeof DustSystem !== 'undefined' ? DustSystem : null,
  SparkleSystem: typeof SparkleSystem !== 'undefined' ? SparkleSystem : null,

  // Lighting Systems
  LightingSystem: typeof LightingSystem !== 'undefined' ? LightingSystem : null,
  TorchSystem: typeof TorchSystem !== 'undefined' ? TorchSystem : null,
  ShadowSystem: typeof ShadowSystem !== 'undefined' ? ShadowSystem : null,

  // Weather Systems
  WeatherSystem: typeof WeatherSystem !== 'undefined' ? WeatherSystem : null,
  FallingLeavesSystem: typeof FallingLeavesSystem !== 'undefined' ? FallingLeavesSystem : null,

  // Animation Systems
  DoorSystem: typeof DoorSystem !== 'undefined' ? DoorSystem : null,
  WindowSystem: typeof WindowSystem !== 'undefined' ? WindowSystem : null,
  WildlifeSystem: typeof WildlifeSystem !== 'undefined' ? WildlifeSystem : null,

  // UI Systems
  UITransitions: typeof UITransitions !== 'undefined' ? UITransitions : null,
  MenuAnimations: typeof MenuAnimations !== 'undefined' ? MenuAnimations : null,
  PuzzleAnimations: typeof PuzzleAnimations !== 'undefined' ? PuzzleAnimations : null,

  // Manager per inizializzare tutto
  init: function () {
    this.systems = [];

    // Inizializza i sistemi principali
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

    return this;
  },

  update: function (dt) {
    for (var i = 0; i < this.systems.length; i++) {
      if (this.systems[i] && this.systems[i].update) {
        this.systems[i].update(dt);
      }
    }
  },

  draw: function (ctx) {
    for (var i = 0; i < this.systems.length; i++) {
      if (this.systems[i] && this.systems[i].draw) {
        this.systems[i].draw(ctx);
      }
    }
  },
};

// Esporta
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Effects;
} else if (typeof window !== 'undefined') {
  window.Effects = Effects;
}

export default Effects;
