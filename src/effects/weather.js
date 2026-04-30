/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * WEATHER SYSTEMS
 * Sistemi meteo e atmosferici
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Weather System - Pioggia, neve, temporali
 */
function WeatherSystem() {
  this.active = false;
  this.type = 'none'; // none, rain, snow, storm
  this.particles = [];
  this.intensity = 0.5;
  this.windX = 0;
  this.lightningTimer = 0;
  this.lightningActive = false;
  this.screenFlash = 0;
}

WeatherSystem.prototype.init = function () {
  this.active = false;
  this.particles = [];
  this.type = 'none';
};

WeatherSystem.prototype.setWeather = function (type, intensity) {
  this.type = type;
  this.intensity = intensity || 0.5;
  this.active = type !== 'none';
  this.particles = [];

  if (type === 'rain' || type === 'storm') {
    this.windX = (Math.random() - 0.5) * 2;
  }
};

WeatherSystem.prototype.update = function (dt) {
  if (!this.active) return;

  var maxParticles = Math.floor(this.intensity * 100);

  // Spawn nuove particelle
  while (this.particles.length < maxParticles) {
    this.spawnParticle();
  }

  // Update particelle
  for (var i = this.particles.length - 1; i >= 0; i--) {
    var p = this.particles[i];
    p.x += p.vx * dt + this.windX;
    p.y += p.vy * dt;
    p.life -= dt;

    if (p.y > window.CANVAS_H || p.life <= 0) {
      this.particles.splice(i, 1);
    }
  }

  // Fulmini per temporale
  if (this.type === 'storm') {
    this.lightningTimer -= dt;
    if (this.lightningTimer <= 0) {
      this.triggerLightning();
      this.lightningTimer = 3 + Math.random() * 5;
    }

    if (this.lightningActive) {
      this.screenFlash -= dt * 3;
      if (this.screenFlash <= 0) {
        this.lightningActive = false;
        this.screenFlash = 0;
      }
    }
  }
};

WeatherSystem.prototype.spawnParticle = function () {
  var p = {
    x: Math.random() * (window.CANVAS_W + 100) - 50,
    y: -10,
    vx: 0,
    vy: 0,
    life: 3,
    size: 1,
  };

  if (this.type === 'rain' || this.type === 'storm') {
    p.vy = 200 + Math.random() * 100;
    p.vx = this.windX * 20;
    p.size = 1;
  } else if (this.type === 'snow') {
    p.vy = 30 + Math.random() * 20;
    p.vx = (Math.random() - 0.5) * 30;
    p.size = 2 + Math.random() * 2;
  }

  this.particles.push(p);
};

WeatherSystem.prototype.triggerLightning = function () {
  this.lightningActive = true;
  this.screenFlash = 1;
};

WeatherSystem.prototype.draw = function (ctx) {
  if (!this.active) return;

  ctx.save();

  // Flash fulmine
  if (this.screenFlash > 0) {
    ctx.fillStyle = 'rgba(255, 255, 255, ' + this.screenFlash * 0.8 + ')';
    ctx.fillRect(0, 0, window.CANVAS_W, window.CANVAS_H);
  }

  // Particelle
  for (var i = 0; i < this.particles.length; i++) {
    var p = this.particles[i];

    if (this.type === 'rain' || this.type === 'storm') {
      ctx.strokeStyle = 'rgba(180, 200, 220, 0.6)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - this.windX * 3, p.y - 8);
      ctx.stroke();
    } else if (this.type === 'snow') {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Overlay scuro per temporale
  if (this.type === 'storm') {
    ctx.fillStyle = 'rgba(30, 30, 40, 0.3)';
    ctx.fillRect(0, 0, window.CANVAS_W, window.CANVAS_H);
  }

  ctx.restore();
};

WeatherSystem.prototype.getOverlayAlpha = function () {
  if (this.type === 'storm') return 0.3;
  if (this.type === 'rain') return 0.1;
  if (this.type === 'snow') return 0.05;
  return 0;
};

/**
 * Falling Leaves System - Foglie che cadono
 */
function FallingLeavesSystem() {
  this.leaves = [];
  this.maxLeaves = 20;
  this.active = false;
}

FallingLeavesSystem.prototype.init = function () {
  this.leaves = [];
  this.active = false;
};

FallingLeavesSystem.prototype.setActive = function (active) {
  this.active = active;
  if (active && this.leaves.length === 0) {
    for (var i = 0; i < 10; i++) {
      this.spawnLeaf();
    }
  }
};

FallingLeavesSystem.prototype.spawnLeaf = function () {
  if (this.leaves.length >= this.maxLeaves) return;

  var colors = ['#d4a574', '#c49060', '#a07040', '#8b4513'];
  this.leaves.push({
    x: Math.random() * window.CANVAS_W,
    y: -10 - Math.random() * 50,
    vx: (Math.random() - 0.5) * 20,
    vy: 15 + Math.random() * 10,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 2,
    swayPhase: Math.random() * Math.PI * 2,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: 4 + Math.random() * 3,
  });
};

FallingLeavesSystem.prototype.update = function (dt) {
  if (!this.active) return;

  if (this.leaves.length < this.maxLeaves && Math.random() < 0.1) {
    this.spawnLeaf();
  }

  for (var i = this.leaves.length - 1; i >= 0; i--) {
    var l = this.leaves[i];
    l.swayPhase += dt * 3;
    l.x += l.vx * dt + Math.sin(l.swayPhase) * 10 * dt;
    l.y += l.vy * dt;
    l.rotation += l.rotSpeed * dt;

    if (l.y > window.CANVAS_H + 20) {
      this.leaves.splice(i, 1);
    }
  }
};

FallingLeavesSystem.prototype.draw = function (ctx) {
  if (!this.active) return;

  ctx.save();
  for (var i = 0; i < this.leaves.length; i++) {
    var l = this.leaves[i];
    ctx.save();
    ctx.translate(l.x, l.y);
    ctx.rotate(l.rotation);
    ctx.fillStyle = l.color;
    ctx.fillRect(-l.size / 2, -l.size / 2, l.size, l.size);
    ctx.restore();
  }
  ctx.restore();
};

// Esporta i sistemi
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    WeatherSystem: WeatherSystem,
    FallingLeavesSystem: FallingLeavesSystem,
  };
}
