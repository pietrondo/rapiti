/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    AMBIENT EFFECTS SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Singleton effetti ambientali usati dal game loop e dalle aree.
 * Include: ParticleSystem (particelle), LightingSystem (luci dinamiche),
 * ScreenShake (scuotimento schermo), Vignette (oscuratura bordi).
 *
 * NOTA: Questo modulo definisce i globali su window.* usati da loop.ts,
 * render/index.ts, transition.mjs e storyData.mjs.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* ── PARTICLE SYSTEM ── */
var ParticleSystem = {
  particles: [],
  maxParticles: 200,

  create: function (x, y, type, options) {
    if (this.particles.length >= this.maxParticles) {
      this.particles.shift();
    }

    var particle = {
      x: x,
      y: y,
      type: type,
      life: options.life || 60,
      maxLife: options.life || 60,
      vx: options.vx || (Math.random() - 0.5) * 0.5,
      vy: options.vy || (Math.random() - 0.5) * 0.5,
      size: options.size || 2,
      color: options.color || '#FFFFFF',
      alpha: options.alpha || 1,
      gravity: options.gravity || 0,
      friction: options.friction || 0.98,
    };

    this.particles.push(particle);
    return particle;
  },

  createFireflies: function (x, y) {
    for (var i = 0; i < 15; i++) {
      this.create(x + Math.random() * 300, y + Math.random() * 200, 'firefly', {
        life: 120 + Math.random() * 60,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: 1 + Math.random() * 2,
        color: '#CCFF00',
        alpha: 0.8,
      });
    }
  },

  createDust: function (x, y) {
    for (var i = 0; i < 10; i++) {
      this.create(x + Math.random() * 200, y + Math.random() * 150, 'dust', {
        life: 180 + Math.random() * 120,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        size: 1 + Math.random(),
        color: '#AAAAAA',
        alpha: 0.4,
      });
    }
  },

  createSparkles: function (x, y, color) {
    for (var i = 0; i < 20; i++) {
      var angle = ((Math.PI * 2) / 20) * i;
      this.create(x, y, 'sparkle', {
        life: 30 + Math.random() * 20,
        vx: Math.cos(angle) * 2,
        vy: Math.sin(angle) * 2,
        size: 2 + Math.random() * 2,
        color: color || '#FFD700',
        alpha: 1,
        friction: 0.95,
      });
    }
  },

  update: function () {
    for (var i = this.particles.length - 1; i >= 0; i--) {
      var p = this.particles[i];
      p.life--;
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.vy *= p.friction;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  },

  draw: function (ctx) {
    ctx.save();
    for (var i = 0; i < this.particles.length; i++) {
      var p = this.particles[i];
      var alpha = (p.life / p.maxLife) * p.alpha;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
    }
    ctx.restore();
  },

  clear: function () {
    this.particles = [];
  },
};

/* ── LIGHTING SYSTEM ── */
var LightingSystem = {
  lights: [],
  ambientLight: 0.3,

  addLight: function (x, y, radius, color, intensity) {
    this.lights.push({
      x: x,
      y: y,
      radius: radius,
      color: color || '#ffaa44',
      intensity: intensity || 0.5,
      flicker: Math.random() * Math.PI * 2,
    });
  },

  update: function () {
    for (var i = 0; i < this.lights.length; i++) {
      this.lights[i].flicker += 0.1;
    }
  },

  draw: function (ctx) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    for (var i = 0; i < this.lights.length; i++) {
      var light = this.lights[i];
      var flicker = 0.9 + Math.sin(light.flicker) * 0.1;
      var gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.radius);
      gradient.addColorStop(0, light.color);
      gradient.addColorStop(1, 'transparent');

      ctx.globalAlpha = light.intensity * flicker;
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  },

  clear: function () {
    this.lights = [];
  },

  setupAreaLights: function (areaId) {
    this.clear();
    if (!areaId) return;

    switch (areaId) {
      case 'piazze':
        this.addLight(100, 80, 60, '#ffaa44', 0.3);
        this.addLight(300, 80, 60, '#ffaa44', 0.3);
        this.addLight(200, 150, 50, '#ffdd88', 0.2);
        break;
      case 'cimitero':
        this.addLight(350, 100, 40, '#88aaff', 0.5);
        break;
      case 'giardini':
        this.addLight(150, 100, 70, '#ffdd66', 0.2);
        break;
      case 'bar_exterior':
        this.addLight(280, 90, 50, '#ff8844', 0.4);
        break;
      case 'residenziale':
        this.addLight(120, 80, 45, '#ffcc88', 0.3);
        this.addLight(280, 80, 45, '#ffcc88', 0.3);
        break;
      case 'chiesa':
        this.addLight(200, 100, 60, '#ffdd88', 0.25);
        break;
      case 'industriale':
        this.addLight(320, 90, 50, '#ffaa44', 0.35);
        break;
      case 'polizia':
        this.addLight(200, 100, 55, '#88bbff', 0.3);
        break;
    }
  },
};

/* ── SCREEN SHAKE ── */
var ScreenShake = {
  intensity: 0,
  duration: 0,

  shake: function (intensity, duration) {
    this.intensity = intensity;
    this.duration = duration;
  },

  update: function () {
    if (this.duration > 0) {
      this.duration--;
      this.intensity *= 0.9;
    } else {
      this.intensity = 0;
    }
  },

  apply: function (ctx) {
    if (this.intensity <= 0) return;
    var offset = this.getOffset();
    ctx.translate(offset.x, offset.y);
  },

  getOffset: function () {
    if (this.intensity <= 0) return { x: 0, y: 0 };
    return {
      x: (Math.random() - 0.5) * this.intensity,
      y: (Math.random() - 0.5) * this.intensity,
    };
  },
};

/* ── VIGNETTE ── */
var Vignette = {
  draw: function (ctx) {
    var grad = ctx.createRadialGradient(
      CANVAS_W / 2,
      CANVAS_H / 2,
      80,
      CANVAS_W / 2,
      CANVAS_H / 2,
      Math.max(CANVAS_W, CANVAS_H)
    );
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(0.6, 'rgba(10,12,18,0.35)');
    grad.addColorStop(1, 'rgba(10,12,18,0.72)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  },
};

/* ── ESPORTAZIONI ── */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ParticleSystem: ParticleSystem,
    LightingSystem: LightingSystem,
    ScreenShake: ScreenShake,
    Vignette: Vignette,
  };
} else if (typeof window !== 'undefined') {
  window.ParticleSystem = ParticleSystem;
  window.LightingSystem = LightingSystem;
  window.ScreenShake = ScreenShake;
  window.Vignette = Vignette;
}
