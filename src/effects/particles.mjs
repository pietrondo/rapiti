/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PARTICLE SYSTEMS
 * Sistemi di particelle per effetti ambientali
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Particle System - Base per tutti gli effetti particellari
 */
export function ParticleSystem(config) {
  this.particles = [];
  this.config = config || {};
  this.active = true;
}

ParticleSystem.prototype.update = function (dt) {
  if (!this.active) return;

  for (var i = this.particles.length - 1; i >= 0; i--) {
    var p = this.particles[i];
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    if (p.life <= 0) {
      this.particles.splice(i, 1);
    }
  }
};

ParticleSystem.prototype.draw = function (ctx) {
  if (!this.active) return;

  for (var i = 0; i < this.particles.length; i++) {
    var p = this.particles[i];
    var alpha = p.life / p.maxLife;
    ctx.fillStyle = p.color.replace('ALPHA', alpha);
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
};

ParticleSystem.prototype.emit = function (x, y, count, config) {
  for (var i = 0; i < count; i++) {
    this.particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * (config.speed || 20),
      vy: (Math.random() - 0.5) * (config.speed || 20),
      life: config.life || 1,
      maxLife: config.life || 1,
      size: config.size || 2,
      color: config.color || 'rgba(255,255,255,ALPHA)',
    });
  }
};

/**
 * Fireflies - Lucciole per aree esterne
 */
export function FireflySystem() {
  ParticleSystem.call(this);
  this.fireflies = [];
  this.maxFireflies = 15;
  this.spawnTimer = 0;
}

FireflySystem.prototype = Object.create(ParticleSystem.prototype);
FireflySystem.prototype.constructor = FireflySystem;

FireflySystem.prototype.init = function (area) {
  this.fireflies = [];
  this.area = area;
  // Spawn iniziale
  for (var i = 0; i < 8; i++) {
    this.spawnFirefly();
  }
};

FireflySystem.prototype.spawnFirefly = function () {
  if (this.fireflies.length >= this.maxFireflies) return;

  this.fireflies.push({
    x: Math.random() * window.CANVAS_W,
    y: Math.random() * (window.CANVAS_H - 100) + 50,
    vx: (Math.random() - 0.5) * 10,
    vy: (Math.random() - 0.5) * 5,
    phase: Math.random() * Math.PI * 2,
    glowSpeed: 2 + Math.random() * 2,
  });
};

FireflySystem.prototype.update = function (dt) {
  this.spawnTimer += dt;
  if (this.spawnTimer > 1 && this.fireflies.length < this.maxFireflies) {
    this.spawnFirefly();
    this.spawnTimer = 0;
  }

  for (var i = 0; i < this.fireflies.length; i++) {
    var f = this.fireflies[i];
    f.phase += dt * f.glowSpeed;
    f.x += f.vx * dt;
    f.y += f.vy * dt;

    // Bounce sui bordi
    if (f.x < 0 || f.x > window.CANVAS_W) f.vx *= -1;
    if (f.y < 0 || f.y > window.CANVAS_H) f.vy *= -1;
  }
};

FireflySystem.prototype.draw = function (ctx) {
  ctx.save();
  for (var i = 0; i < this.fireflies.length; i++) {
    var f = this.fireflies[i];
    var glow = 0.3 + Math.sin(f.phase) * 0.3;

    ctx.fillStyle = `rgba(200, 255, 100, ${glow})`;
    ctx.beginPath();
    ctx.arc(f.x, f.y, 2, 0, Math.PI * 2);
    ctx.fill();

    // Alone
    ctx.fillStyle = `rgba(200, 255, 100, ${glow * 0.3})`;
    ctx.beginPath();
    ctx.arc(f.x, f.y, 6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

/**
 * Dust System - Polvere per aree interne
 */
export function DustSystem() {
  ParticleSystem.call(this);
  this.particles = [];
  this.maxParticles = 30;
}

DustSystem.prototype = Object.create(ParticleSystem.prototype);
DustSystem.prototype.constructor = DustSystem;

DustSystem.prototype.init = function () {
  this.particles = [];
  for (var i = 0; i < this.maxParticles; i++) {
    this.spawnParticle();
  }
};

DustSystem.prototype.spawnParticle = function () {
  this.particles.push({
    x: Math.random() * window.CANVAS_W,
    y: Math.random() * window.CANVAS_H,
    vx: (Math.random() - 0.5) * 2,
    vy: Math.random() * 1 + 0.5,
    size: Math.random() * 2 + 1,
    alpha: Math.random() * 0.3 + 0.1,
  });
};

DustSystem.prototype.update = function (dt) {
  for (var i = this.particles.length - 1; i >= 0; i--) {
    var p = this.particles[i];
    p.x += p.vx * dt;
    p.y += p.vy * dt;

    if (p.y > window.CANVAS_H) {
      p.y = 0;
      p.x = Math.random() * window.CANVAS_W;
    }
    if (p.x < 0) p.x = window.CANVAS_W;
    if (p.x > window.CANVAS_W) p.x = 0;
  }
};

DustSystem.prototype.draw = function (ctx) {
  ctx.save();
  for (var i = 0; i < this.particles.length; i++) {
    var p = this.particles[i];
    ctx.fillStyle = `rgba(200, 200, 180, ${p.alpha})`;
    ctx.fillRect(p.x, p.y, p.size, p.size);
  }
  ctx.restore();
};

/**
 * Sparkle System - Scintille per raccolta indizi
 */
export function SparkleSystem() {
  ParticleSystem.call(this);
  this.sparkles = [];
}

SparkleSystem.prototype = Object.create(ParticleSystem.prototype);
SparkleSystem.prototype.constructor = SparkleSystem;

SparkleSystem.prototype.burst = function (x, y, color) {
  for (var i = 0; i < 12; i++) {
    var angle = ((Math.PI * 2) / 12) * i;
    this.sparkles.push({
      x: x,
      y: y,
      vx: Math.cos(angle) * 50,
      vy: Math.sin(angle) * 50,
      life: 0.5,
      maxLife: 0.5,
      color: color || '#ffd700',
      size: 3,
    });
  }
};

SparkleSystem.prototype.update = function (dt) {
  for (var i = this.sparkles.length - 1; i >= 0; i--) {
    var s = this.sparkles[i];
    s.life -= dt;
    s.x += s.vx * dt;
    s.y += s.vy * dt;
    s.vx *= 0.95;
    s.vy *= 0.95;

    if (s.life <= 0) {
      this.sparkles.splice(i, 1);
    }
  }
};

SparkleSystem.prototype.draw = function (ctx) {
  ctx.save();
  for (var i = 0; i < this.sparkles.length; i++) {
    var s = this.sparkles[i];
    var alpha = s.life / s.maxLife;
    ctx.fillStyle = s.color;
    ctx.globalAlpha = alpha;
    ctx.fillRect(s.x - s.size / 2, s.y - s.size / 2, s.size, s.size);
  }
  ctx.restore();
};

/**
 * Steam System - Fumo per ciminiere industriali
 */
export function SteamSystem() {
  ParticleSystem.call(this);
  this.active = true;
}

SteamSystem.prototype = Object.create(ParticleSystem.prototype);
SteamSystem.prototype.constructor = SteamSystem;

SteamSystem.prototype.emitSteam = function (x, y) {
  if (Math.random() > 0.15) return;
  this.particles.push({
    x: x,
    y: y,
    vx: (Math.random() - 0.2) * 5,
    vy: -15 - Math.random() * 10,
    life: 2.5,
    maxLife: 2.5,
    size: 8 + Math.random() * 8,
    color: 'rgba(150,150,150,ALPHA)',
  });
};

SteamSystem.prototype.update = function (dt) {
  for (var i = this.particles.length - 1; i >= 0; i--) {
    var p = this.particles[i];
    p.life -= dt;
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    p.size += dt * 5; // Expand as it rises
    p.vx += Math.sin(Date.now() * 0.001 + i) * 0.1; // Slight swaying

    if (p.life <= 0) {
      this.particles.splice(i, 1);
    }
  }
};

SteamSystem.prototype.draw = function (ctx) {
  ctx.save();
  for (var i = 0; i < this.particles.length; i++) {
    var p = this.particles[i];
    var alpha = (p.life / p.maxLife) * 0.4;
    ctx.fillStyle = p.color.replace('ALPHA', alpha.toFixed(2));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

/**
 * Fog System - Nebbia bassa volumetrica per cimitero/campi
 */
export function FogSystem() {
  ParticleSystem.call(this);
  this.maxFog = 12;
}

FogSystem.prototype = Object.create(ParticleSystem.prototype);
FogSystem.prototype.constructor = FogSystem;

FogSystem.prototype.init = function () {
  this.particles = [];
  for (var i = 0; i < this.maxFog; i++) {
    this.spawnFog();
  }
};

FogSystem.prototype.spawnFog = function () {
  this.particles.push({
    x: Math.random() * window.CANVAS_W,
    y: window.CANVAS_H - 40 - Math.random() * 40,
    vx: (Math.random() - 0.5) * 4,
    vy: (Math.random() - 0.5) * 1,
    size: 40 + Math.random() * 40,
    alpha: 0.05 + Math.random() * 0.1,
    phase: Math.random() * Math.PI * 2,
  });
};

FogSystem.prototype.update = function (dt) {
  for (var i = 0; i < this.particles.length; i++) {
    var p = this.particles[i];
    p.phase += dt * 0.5;
    p.x += (p.vx + Math.sin(p.phase) * 2) * dt;
    p.y += (p.vy + Math.cos(p.phase * 0.7) * 1) * dt;

    if (p.x < -100) p.x = window.CANVAS_W + 100;
    if (p.x > window.CANVAS_W + 100) p.x = -100;
  }
};

FogSystem.prototype.draw = function (ctx) {
  ctx.save();
  for (var i = 0; i < this.particles.length; i++) {
    var p = this.particles[i];
    var grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
    grad.addColorStop(0, `rgba(180, 200, 220, ${p.alpha})`);
    grad.addColorStop(1, 'rgba(180, 200, 220, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

// Esporta i sistemi
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ParticleSystem: ParticleSystem,
    FireflySystem: FireflySystem,
    DustSystem: DustSystem,
    SparkleSystem: SparkleSystem,
    SteamSystem: SteamSystem,
    FogSystem: FogSystem,
  };
}
