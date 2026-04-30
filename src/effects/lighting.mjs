/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * LIGHTING SYSTEMS
 * Sistemi di illuminazione dinamica
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * Lighting System - Gestione luci dinamiche
 */
export function LightingSystem() {
  this.lights = [];
  this.ambientLight = 0.3;
}

LightingSystem.prototype.init = function() {
  this.lights = [];
};

LightingSystem.prototype.addLight = function(x, y, radius, color, flicker) {
  this.lights.push({
    x: x,
    y: y,
    radius: radius,
    color: color || '#ffaa44',
    flicker: flicker || 0,
    flickerPhase: Math.random() * Math.PI * 2,
    intensity: 1
  });
};

LightingSystem.prototype.update = function(dt) {
  for (var i = 0; i < this.lights.length; i++) {
    var light = this.lights[i];
    if (light.flicker > 0) {
      light.flickerPhase += dt * 10;
      light.intensity = 0.8 + Math.sin(light.flickerPhase) * 0.2 * light.flicker;
    }
  }
};

LightingSystem.prototype.draw = function(ctx) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  
  for (var i = 0; i < this.lights.length; i++) {
    var light = this.lights[i];
    var gradient = ctx.createRadialGradient(
      light.x, light.y, 0,
      light.x, light.y, light.radius
    );
    
    var alpha = 0.4 * light.intensity;
    gradient.addColorStop(0, light.color.replace(')', ', ' + alpha + ')').replace('rgb', 'rgba'));
    gradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(light.x, light.y, light.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
};

LightingSystem.prototype.setupAreaLights = function(areaId) {
  this.lights = [];
  
  switch(areaId) {
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

LightingSystem.prototype.clear = function() {
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

TorchSystem.prototype.init = function() {
  this.active = false;
};

TorchSystem.prototype.setPosition = function(x, y, angle) {
  this.x = x;
  this.y = y;
  this.angle = angle;
  this.active = true;
};

TorchSystem.prototype.update = function(dt) {
  // Flicker casuale
  this.flicker = 0.9 + Math.random() * 0.2;
};

TorchSystem.prototype.draw = function(ctx) {
  if (!this.active) return;
  
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  
  var gradient = ctx.createRadialGradient(
    this.x, this.y, 0,
    this.x, this.y, this.radius
  );
  
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

TorchSystem.prototype.toggle = function() {
  this.active = !this.active;
};

/**
 * Shadow System - Ombre dinamiche
 */
export function ShadowSystem() {
  this.shadows = [];
  this.lightSource = { x: 200, y: -100 };
}

ShadowSystem.prototype.init = function() {
  this.shadows = [];
};

ShadowSystem.prototype.addShadowCaster = function(x, y, w, h, height) {
  this.shadows.push({
    x: x, y: y, w: w, h: h,
    height: height || 20
  });
};

ShadowSystem.prototype.setLightSource = function(x, y) {
  this.lightSource = { x: x, y: y };
};

ShadowSystem.prototype.update = function(dt) {
  // Movimento luce per simulare giorno
  this.lightSource.x = 200 + Math.sin(Date.now() / 10000) * 150;
};

ShadowSystem.prototype.draw = function(ctx) {
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  
  for (var i = 0; i < this.shadows.length; i++) {
    var s = this.shadows[i];
    var dx = s.x + s.w/2 - this.lightSource.x;
    var dy = s.y + s.h/2 - this.lightSource.y;
    var dist = Math.sqrt(dx*dx + dy*dy);
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

ShadowSystem.prototype.clear = function() {
  this.shadows = [];
};

// Esporta i sistemi
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LightingSystem: LightingSystem,
    TorchSystem: TorchSystem,
    ShadowSystem: ShadowSystem
  };
}
