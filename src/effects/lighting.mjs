/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LIGHTING SYSTEMS
 * Sistemi di illuminazione dinamica
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * DayNight System - Ciclo giorno/notte e illuminazione globale
 */
export function DayNightSystem() {
  this.time = 0; // 0.0 to 1.0 (24h)
  this.cycleSpeed = 0.005; // Velocità ciclo
  this.phases = {
    DAWN: { start: 0.2, color: 'rgba(255, 150, 100, 0.2)', ambient: 0.5 },
    DAY: { start: 0.3, color: 'rgba(255, 255, 255, 0)', ambient: 1.0 },
    DUSK: { start: 0.7, color: 'rgba(200, 100, 150, 0.25)', ambient: 0.4 },
    NIGHT: { start: 0.85, color: 'rgba(20, 20, 40, 0.7)', ambient: 0.15 },
  };
}

DayNightSystem.prototype.update = function (dt) {
  this.time = (this.time + this.cycleSpeed * dt) % 1.0;
};

DayNightSystem.prototype.getAmbient = function () {
  if (this.time < 0.2 || this.time > 0.85) return this.phases.NIGHT.ambient;
  if (this.time < 0.3) return this.phases.DAWN.ambient;
  if (this.time < 0.7) return this.phases.DAY.ambient;
  return this.phases.DUSK.ambient;
};

DayNightSystem.prototype.getOverlayColor = function () {
  var t = this.time;
  if (t < 0.2 || t > 0.85) return this.phases.NIGHT.color;
  if (t < 0.3) return this.phases.DAWN.color;
  if (t < 0.7) return this.phases.DAY.color;
  return this.phases.DUSK.color;
};

DayNightSystem.prototype.drawOverlay = function (ctx) {
  var color = this.getOverlayColor();
  if (color === 'rgba(255, 255, 255, 0)') return;

  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, window.CANVAS_W, window.CANVAS_H);

  // Moltiplicazione per scurire realmente
  if (this.time > 0.8 || this.time < 0.25) {
    ctx.globalCompositeOperation = 'multiply';
    ctx.fillStyle = 'rgba(10, 15, 30, 0.4)';
    ctx.fillRect(0, 0, window.CANVAS_W, window.CANVAS_H);
  }
  ctx.restore();
};

/**
 * Lighting System - Gestione luci dinamiche migliorata
 */
export function LightingSystem() {
  this.lights = [];
  this.dayNight = new DayNightSystem();
}

LightingSystem.prototype.init = function () {
  this.lights = [];
  this.dayNight.time = 0.9; // Inizia di notte per atmosfera
};

LightingSystem.prototype.addLight = function (x, y, radius, color, flicker) {
  this.lights.push({
    x: x,
    y: y,
    radius: radius,
    color: color || 'rgba(255, 170, 68, ALPHA)',
    flicker: flicker || 0,
    flickerPhase: Math.random() * Math.PI * 2,
    intensity: 1,
  });
};

LightingSystem.prototype.update = function (dt) {
  this.dayNight.update(dt);

  for (var i = 0; i < this.lights.length; i++) {
    var light = this.lights[i];
    if (light.flicker > 0) {
      light.flickerPhase += dt * 12;
      light.intensity = 0.85 + Math.sin(light.flickerPhase) * 0.15 * light.flicker;
    }
  }
};

LightingSystem.prototype.draw = function (ctx) {
  // Disegna overlay ambientale prima delle luci
  this.dayNight.drawOverlay(ctx);

  ctx.save();
  // Effetto "additivo" per le luci sul buio
  ctx.globalCompositeOperation = 'screen';

  for (var i = 0; i < this.lights.length; i++) {
    var light = this.lights[i];
    var radius = light.radius * light.intensity;
    var gradient = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, radius);

    var alpha = 0.5 * light.intensity;
    // Se è giorno, le luci sono meno visibili
    if (this.dayNight.time > 0.3 && this.dayNight.time < 0.7) alpha *= 0.2;

    var color = light.color.replace('ALPHA', alpha.toFixed(2));
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.4, light.color.replace('ALPHA', (alpha * 0.3).toFixed(2)));
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(light.x, light.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};

LightingSystem.prototype.setupAreaLights = function (areaId) {
  this.lights = [];

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
  }
};

LightingSystem.prototype.clear = function () {
  this.lights = [];
};

/**
 * Torch System - Torcia del giocatore
 */
export function TorchSystem() {
  this.active = false;
  this.x = 0;
  this.y = 0;
  this.angle = 0;
  this.radius = 80;
}

TorchSystem.prototype.init = function () {
  this.active = false;
};

TorchSystem.prototype.setPosition = function (x, y, angle) {
  this.x = x;
  this.y = y;
  this.angle = angle;
  this.active = true;
};

TorchSystem.prototype.update = function (_dt) {
  // Flicker casuale
  this.flicker = 0.9 + Math.random() * 0.2;
};

TorchSystem.prototype.draw = function (ctx) {
  if (!this.active) return;

  ctx.save();
  ctx.globalCompositeOperation = 'screen';

  var gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);

  gradient.addColorStop(0, 'rgba(255, 200, 100, 0.5)');
  gradient.addColorStop(0.5, 'rgba(255, 180, 80, 0.2)');
  gradient.addColorStop(1, 'transparent');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  ctx.fill();

  // Cono di luce direzionale
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.angle);

  var coneGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 1.5);
  coneGradient.addColorStop(0, 'rgba(255, 220, 150, 0.3)');
  coneGradient.addColorStop(1, 'transparent');

  ctx.fillStyle = coneGradient;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, this.radius * 1.5, -0.5, 0.5);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
  ctx.restore();
};

TorchSystem.prototype.toggle = function () {
  this.active = !this.active;
};

/**
 * Shadow System - Ombre dinamiche
 */
export function ShadowSystem() {
  this.shadows = [];
  this.lightSource = { x: 200, y: -100 };
}

ShadowSystem.prototype.init = function () {
  this.shadows = [];
};

ShadowSystem.prototype.addShadowCaster = function (x, y, w, h, height) {
  this.shadows.push({
    x: x,
    y: y,
    w: w,
    h: h,
    height: height || 20,
  });
};

ShadowSystem.prototype.setLightSource = function (x, y) {
  this.lightSource = { x: x, y: y };
};

ShadowSystem.prototype.update = function (_dt) {
  // Movimento luce per simulare giorno
  this.lightSource.x = 200 + Math.sin(Date.now() / 10000) * 150;
};

ShadowSystem.prototype.draw = function (ctx) {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';

  for (var i = 0; i < this.shadows.length; i++) {
    var s = this.shadows[i];
    var dx = s.x + s.w / 2 - this.lightSource.x;
    var dy = s.y + s.h / 2 - this.lightSource.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    var shadowLen = (s.height / dist) * 50;

    var nx = dx / dist;
    var ny = dy / dist;

    ctx.beginPath();
    ctx.moveTo(s.x, s.y);
    ctx.lineTo(s.x + s.w, s.y);
    ctx.lineTo(s.x + s.w + nx * shadowLen, s.y + s.h + ny * shadowLen);
    ctx.lineTo(s.x + nx * shadowLen, s.y + s.h + ny * shadowLen);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
};

ShadowSystem.prototype.clear = function () {
  this.shadows = [];
};

// Esporta i sistemi
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LightingSystem: LightingSystem,
    TorchSystem: TorchSystem,
    ShadowSystem: ShadowSystem,
  };
}
