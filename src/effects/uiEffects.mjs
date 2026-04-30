/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * UI EFFECTS SYSTEMS
 * Effetti e animazioni per l'interfaccia utente
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/**
 * UI Transitions - Transizioni tra schermate
 */
export function UITransitions() {
  this.active = false;
  this.type = 'fade';
  this.progress = 0;
  this.duration = 0.5;
  this.callback = null;
  this.direction = 'in';
}

UITransitions.prototype.start = function (type, duration, direction, callback) {
  this.active = true;
  this.type = type || 'fade';
  this.progress = direction === 'in' ? 0 : 1;
  this.duration = duration || 0.5;
  this.direction = direction || 'in';
  this.callback = callback;
};

UITransitions.prototype.update = function (dt) {
  if (!this.active) return;

  var delta = dt / this.duration;
  if (this.direction === 'in') {
    this.progress += delta;
    if (this.progress >= 1) {
      this.progress = 1;
      this.active = false;
      if (this.callback) this.callback();
    }
  } else {
    this.progress -= delta;
    if (this.progress <= 0) {
      this.progress = 0;
      this.active = false;
      if (this.callback) this.callback();
    }
  }
};

UITransitions.prototype.draw = function (ctx) {
  if (!this.active && this.progress <= 0) return;

  ctx.save();
  var alpha = this.type === 'fade' ? this.progress : 0;

  if (this.type === 'wipe') {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, window.CANVAS_W * this.progress, window.CANVAS_H);
  } else if (this.type === 'circle') {
    ctx.fillStyle = '#000';
    ctx.beginPath();
    var radius = Math.max(window.CANVAS_W, window.CANVAS_H) * this.progress;
    ctx.arc(window.CANVAS_W / 2, window.CANVAS_H / 2, radius, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillStyle = `rgba(0,0,0,${alpha})`;
    ctx.fillRect(0, 0, window.CANVAS_W, window.CANVAS_H);
  }
  ctx.restore();
};

UITransitions.prototype.isActive = function () {
  return this.active;
};

/**
 * Menu Animations - Animazioni per menu e bottoni
 */
export function MenuAnimations() {
  this.buttons = [];
  this.selectedIndex = -1;
}

MenuAnimations.prototype.init = function () {
  this.buttons = [];
  this.selectedIndex = -1;
};

MenuAnimations.prototype.addButton = function (x, y, w, h, text) {
  this.buttons.push({
    x: x,
    y: y,
    w: w,
    h: h,
    text: text,
    hover: false,
    scale: 1,
    glow: 0,
  });
};

MenuAnimations.prototype.update = function (dt, mouseX, mouseY) {
  for (var i = 0; i < this.buttons.length; i++) {
    var btn = this.buttons[i];
    var wasHover = btn.hover;
    btn.hover =
      mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h;

    if (btn.hover) {
      btn.scale += (1.05 - btn.scale) * dt * 10;
      btn.glow += (1 - btn.glow) * dt * 5;
      if (!wasHover) this.selectedIndex = i;
    } else {
      btn.scale += (1 - btn.scale) * dt * 10;
      btn.glow += (0 - btn.glow) * dt * 5;
    }
  }
};

MenuAnimations.prototype.draw = function (ctx, palette) {
  for (var i = 0; i < this.buttons.length; i++) {
    var btn = this.buttons[i];
    ctx.save();
    ctx.translate(btn.x + btn.w / 2, btn.y + btn.h / 2);
    ctx.scale(btn.scale, btn.scale);

    if (btn.glow > 0) {
      ctx.shadowColor = palette ? palette.accent : '#d4af37';
      ctx.shadowBlur = btn.glow * 15;
    }

    ctx.fillStyle = btn.hover
      ? palette
        ? palette.accent
        : '#d4af37'
      : palette
        ? palette.uiBg
        : '#1a1a2e';
    ctx.fillRect(-btn.w / 2, -btn.h / 2, btn.w, btn.h);

    ctx.fillStyle = btn.hover ? '#000' : palette ? palette.textLight : '#e0e0e0';
    ctx.font = '12px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(btn.text, 0, 0);

    ctx.restore();
  }
};

MenuAnimations.prototype.click = function (mouseX, mouseY) {
  for (var i = 0; i < this.buttons.length; i++) {
    var btn = this.buttons[i];
    if (mouseX > btn.x && mouseX < btn.x + btn.w && mouseY > btn.y && mouseY < btn.y + btn.h) {
      return i;
    }
  }
  return -1;
};

MenuAnimations.prototype.clear = function () {
  this.buttons = [];
  this.selectedIndex = -1;
};

/**
 * Puzzle Animations - Animazioni per puzzle
 */
export function PuzzleAnimations() {
  this.pieces = [];
}

PuzzleAnimations.prototype.init = function () {
  this.pieces = [];
};

PuzzleAnimations.prototype.addPiece = function (x, y, w, h, type) {
  this.pieces.push({
    x: x,
    y: y,
    w: w,
    h: h,
    type: type,
    selected: false,
    solved: false,
    floatOffset: Math.random() * Math.PI * 2,
    rotation: 0,
    scale: 1,
  });
};

PuzzleAnimations.prototype.update = function (dt) {
  for (var i = 0; i < this.pieces.length; i++) {
    var piece = this.pieces[i];
    piece.floatOffset += dt * 2;

    if (piece.selected) {
      piece.scale += (1.1 - piece.scale) * dt * 8;
    } else if (piece.solved) {
      piece.scale += (1.05 - piece.scale) * dt * 4;
    } else {
      piece.scale += (1 - piece.scale) * dt * 8;
    }
  }
};

PuzzleAnimations.prototype.draw = function (ctx, palette) {
  for (var i = 0; i < this.pieces.length; i++) {
    var piece = this.pieces[i];
    var floatY = Math.sin(piece.floatOffset) * 3;

    ctx.save();
    ctx.translate(piece.x + piece.w / 2, piece.y + piece.h / 2 + floatY);
    ctx.scale(piece.scale, piece.scale);

    if (piece.selected) {
      ctx.shadowColor = palette ? palette.accent : '#d4af37';
      ctx.shadowBlur = 15;
    } else if (piece.solved) {
      ctx.shadowColor = '#0f0';
      ctx.shadowBlur = 10;
    }

    if (piece.type === 'gear') {
      ctx.fillStyle = piece.solved ? '#6a5' : '#8a7';
      ctx.beginPath();
      ctx.arc(0, 0, piece.w / 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#443';
      ctx.beginPath();
      ctx.arc(0, 0, piece.w / 6, 0, Math.PI * 2);
      ctx.fill();
    } else if (piece.type === 'switch') {
      ctx.fillStyle = '#555';
      ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
      ctx.fillStyle = piece.solved ? '#0f0' : '#f00';
      ctx.fillRect(-piece.w / 4, -piece.h / 4, piece.w / 2, piece.h / 2);
    } else {
      ctx.fillStyle = piece.solved
        ? palette
          ? palette.accent
          : '#d4af37'
        : palette
          ? palette.uiBg
          : '#1a1a2e';
      ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
    }

    ctx.restore();
  }
};

PuzzleAnimations.prototype.select = function (index) {
  for (var i = 0; i < this.pieces.length; i++) {
    this.pieces[i].selected = i === index;
  }
};

PuzzleAnimations.prototype.markSolved = function (index) {
  if (this.pieces[index]) {
    this.pieces[index].solved = true;
    this.pieces[index].selected = false;
  }
};

PuzzleAnimations.prototype.clear = function () {
  this.pieces = [];
};

// Esporta i sistemi
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    UITransitions: UITransitions,
    MenuAnimations: MenuAnimations,
    PuzzleAnimations: PuzzleAnimations,
  };
}
