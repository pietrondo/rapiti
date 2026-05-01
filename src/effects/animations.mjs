/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ANIMATION SYSTEMS
 * Sistemi di animazione per oggetti ambientali
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* ── COSTANTI COLORI ── */
var C = {
  doorWood: '#4a3728',
  doorMetal: '#3a3a3a',
  doorDefault: '#5a4a3a',
  goldHandle: '#d4af37',
  windowWarm: '#fff8e1',
  windowLight: '#ffe4b5',
  butterflyRed: '#ff6b6b',
  butterflyTeal: '#4ecdc4',
  butterflyYellow: '#ffe66d',
  birdDark: '#333',
  catFur: '#d4a574',
  catEye: '#333',
};

/**
 * Door System - Porte animate
 */
export function DoorSystem() {
  this.doors = [];
}

DoorSystem.prototype.init = function () {
  this.doors = [];
};

DoorSystem.prototype.addDoor = function (x, y, w, h, type) {
  this.doors.push({
    x: x,
    y: y,
    w: w,
    h: h,
    type: type || 'wood',
    state: 'closed',
    openProgress: 0,
    isLocked: false,
  });
};

DoorSystem.prototype.update = function (dt) {
  for (var i = 0; i < this.doors.length; i++) {
    var door = this.doors[i];
    if (door.state === 'opening') {
      door.openProgress += dt * 2;
      if (door.openProgress >= 1) {
        door.openProgress = 1;
        door.state = 'open';
      }
    } else if (door.state === 'closing') {
      door.openProgress -= dt * 2;
      if (door.openProgress <= 0) {
        door.openProgress = 0;
        door.state = 'closed';
      }
    }
  }
};

DoorSystem.prototype.draw = function (ctx) {
  for (var i = 0; i < this.doors.length; i++) {
    var door = this.doors[i];
    var openAmount = door.openProgress;

    ctx.save();
    ctx.translate(door.x + door.w / 2, door.y + door.h / 2);

    if (door.type === 'wood') {
      ctx.fillStyle = C.doorWood;
    } else if (door.type === 'metal') {
      ctx.fillStyle = C.doorMetal;
    } else {
      ctx.fillStyle = C.doorDefault;
    }

    var width = door.w * (1 - openAmount * 0.7);
    var skew = openAmount * 20;

    ctx.beginPath();
    ctx.moveTo(-width / 2, -door.h / 2);
    ctx.lineTo(width / 2, -door.h / 2 + skew);
    ctx.lineTo(width / 2, door.h / 2 + skew);
    ctx.lineTo(-width / 2, door.h / 2);
    ctx.closePath();
    ctx.fill();

    // Maniglia
    ctx.fillStyle = C.goldHandle;
    ctx.fillRect(width / 2 - 8, -5, 6, 10);

    ctx.restore();
  }
};

DoorSystem.prototype.interact = function (px, py) {
  for (var i = 0; i < this.doors.length; i++) {
    var door = this.doors[i];
    if (
      px > door.x - 20 &&
      px < door.x + door.w + 20 &&
      py > door.y - 20 &&
      py < door.y + door.h + 20
    ) {
      if (door.state === 'closed') door.state = 'opening';
      else if (door.state === 'open') door.state = 'closing';
      return true;
    }
  }
  return false;
};

DoorSystem.prototype.clear = function () {
  this.doors = [];
};

/**
 * Window System - Luci nelle finestre
 */
export function WindowSystem() {
  this.windows = [];
}

WindowSystem.prototype.init = function () {
  this.windows = [];
};

WindowSystem.prototype.addWindow = function (x, y, w, h) {
  this.windows.push({
    x: x,
    y: y,
    w: w,
    h: h,
    lit: Math.random() > 0.5,
    flickerTimer: 0,
    color: Math.random() > 0.7 ? C.windowWarm : C.windowLight,
  });
};

WindowSystem.prototype.update = function (dt) {
  for (var i = 0; i < this.windows.length; i++) {
    var win = this.windows[i];
    if (win.lit) {
      win.flickerTimer += dt;
      if (Math.random() < 0.01) {
        win.flickerTimer = Math.random() * 0.1;
      }
    }
  }
};

WindowSystem.prototype.draw = function (ctx) {
  for (var i = 0; i < this.windows.length; i++) {
    var win = this.windows[i];
    if (!win.lit) continue;

    var flicker = Math.sin(win.flickerTimer * 20) * 0.1 + 0.9;

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.globalAlpha = 0.6 * flicker;

    var gradient = ctx.createRadialGradient(
      win.x + win.w / 2,
      win.y + win.h / 2,
      0,
      win.x + win.w / 2,
      win.y + win.h / 2,
      win.w
    );
    gradient.addColorStop(0, win.color);
    gradient.addColorStop(1, 'transparent');

    ctx.fillStyle = gradient;
    ctx.fillRect(win.x - 5, win.y - 5, win.w + 10, win.h + 10);

    ctx.globalAlpha = 0.9 * flicker;
    ctx.fillStyle = win.color;
    ctx.fillRect(win.x, win.y, win.w, win.h);

    ctx.restore();
  }
};

WindowSystem.prototype.setWindowLit = function (index, lit) {
  if (this.windows[index]) {
    this.windows[index].lit = lit;
  }
};

WindowSystem.prototype.clear = function () {
  this.windows = [];
};

/**
 * Wildlife System - Animali ambientali
 */
export function WildlifeSystem() {
  this.creatures = [];
}

WildlifeSystem.prototype.init = function () {
  this.creatures = [];
};

WildlifeSystem.prototype.addBird = function (x, y) {
  this.creatures.push({
    type: 'bird',
    x: x,
    y: y,
    vx: (Math.random() - 0.5) * 2,
    vy: -Math.random() * 2 - 1,
    wingPhase: 0,
    life: 300,
  });
};

WildlifeSystem.prototype.addButterfly = function (x, y) {
  this.creatures.push({
    type: 'butterfly',
    x: x,
    y: y,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    wingPhase: Math.random() * Math.PI * 2,
    color: [C.butterflyRed, C.butterflyTeal, C.butterflyYellow][Math.floor(Math.random() * 3)],
    life: 600,
  });
};

WildlifeSystem.prototype.addCat = function (x, y) {
  this.creatures.push({
    type: 'cat',
    x: x,
    y: y,
    vx: 0,
    vy: 0,
    state: 'idle',
    timer: 0,
    facing: 1,
  });
};

WildlifeSystem.prototype.update = function (dt) {
  for (var i = this.creatures.length - 1; i >= 0; i--) {
    var c = this.creatures[i];
    c.life -= dt * 60;

    if (c.type === 'bird') {
      c.x += c.vx;
      c.y += c.vy;
      c.wingPhase += dt * 15;
      if (c.life <= 0 || c.y < -50) {
        this.creatures.splice(i, 1);
      }
    } else if (c.type === 'butterfly') {
      c.x += c.vx + Math.sin(c.wingPhase) * 0.3;
      c.y += c.vy + Math.cos(c.wingPhase * 0.7) * 0.2;
      c.wingPhase += dt * 8;
      if (c.life <= 0) {
        this.creatures.splice(i, 1);
      }
    } else if (c.type === 'cat') {
      c.timer += dt;
      if (c.state === 'idle' && c.timer > 2) {
        c.state = 'walking';
        c.vx = (Math.random() - 0.5) * 1;
        c.timer = 0;
      } else if (c.state === 'walking') {
        c.x += c.vx;
        if (c.vx > 0) c.facing = 1;
        else if (c.vx < 0) c.facing = -1;
        if (c.timer > 3 || c.x < 50 || c.x > window.CANVAS_W - 50) {
          c.state = 'idle';
          c.vx = 0;
          c.timer = 0;
        }
      }
    }
  }
};

WildlifeSystem.prototype.draw = function (ctx) {
  for (var i = 0; i < this.creatures.length; i++) {
    var c = this.creatures[i];
    ctx.save();
    ctx.translate(c.x, c.y);

    if (c.type === 'bird') {
      var wingY = Math.sin(c.wingPhase) * 5;
      ctx.fillStyle = C.birdDark;
      ctx.beginPath();
      ctx.moveTo(-6, -wingY);
      ctx.lineTo(0, 2);
      ctx.lineTo(6, -wingY);
      ctx.fill();
    } else if (c.type === 'butterfly') {
      var wingScale = Math.abs(Math.sin(c.wingPhase));
      ctx.fillStyle = c.color;
      ctx.save();
      ctx.scale(wingScale, 1);
      ctx.beginPath();
      ctx.ellipse(-3, 0, 4, 3, 0, 0, Math.PI * 2);
      ctx.ellipse(3, 0, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (c.type === 'cat') {
      ctx.scale(c.facing, 1);
      ctx.fillStyle = C.catFur;
      ctx.fillRect(-8, -6, 16, 10);
      ctx.fillRect(-10, -8, 4, 6);
      ctx.fillRect(6, -8, 4, 6);
      ctx.fillStyle = C.catEye;
      ctx.fillRect(4, -4, 2, 2);
    }

    ctx.restore();
  }
};

WildlifeSystem.prototype.clear = function () {
  this.creatures = [];
};

// Esporta i sistemi
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DoorSystem: DoorSystem,
    WindowSystem: WindowSystem,
    WildlifeSystem: WildlifeSystem,
  };
}
