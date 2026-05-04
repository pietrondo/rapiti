/* ═══════════════════════════════════════════════════════════════════════════════
   UI RENDERER (Facade)
   Primitive UI, pannelli, effetti visivi, title landscape, fade
   ═══════════════════════════════════════════════════════════════════════════════ */

const VISUAL = {
  ink: '#0B0C12',
  panel: '#15161B',
  panel2: '#222631',
  gold: '#D4A843',
  amber: '#F0C15A',
  paper: '#E8DCC8',
  rust: '#C4956A',
  signal: '#91B7FF',
  danger: '#CC4444',
};

export function fillGradientRect(ctx, x, y, w, h, topColor, bottomColor) {
  var grad = ctx.createLinearGradient(0, y, 0, y + h);
  grad.addColorStop(0, topColor);
  grad.addColorStop(1, bottomColor);
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);
}

export function drawPixelPanel(ctx, x, y, w, h, title) {
  ctx.fillStyle = 'rgba(5,6,10,0.45)';
  ctx.fillRect(x + 4, y + 5, w, h);
  ctx.fillStyle = VISUAL.panel;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = VISUAL.panel2;
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fillRect(x + 4, y + 4, w - 8, 10);
  ctx.strokeStyle = VISUAL.gold;
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(232,220,200,0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 4, y + 4, w - 8, h - 8);
  if (title) {
    ctx.fillStyle = VISUAL.gold;
    ctx.fillRect(x + 12, y - 6, Math.min(w - 24, title.length * 7 + 14), 12);
    ctx.fillStyle = VISUAL.ink;
    ctx.font = '8px "Courier New",monospace';
    ctx.fillText(title, x + 18, y + 3);
  }
}

export function drawFilmGrain(ctx) {
  ctx.fillStyle = 'rgba(255,255,255,0.035)';
  for (var i = 0; i < 70; i++) {
    var x = (i * 37 + Math.floor(Date.now() * 0.02)) % CANVAS_W;
    var y = (i * 61 + Math.floor(Date.now() * 0.015)) % CANVAS_H;
    ctx.fillRect(x, y, 1, 1);
  }
  ctx.fillStyle = 'rgba(0,0,0,0.08)';
  for (var s = 0; s < CANVAS_H; s += 4) {
    ctx.fillRect(0, s, CANVAS_W, 1);
  }
}

export function drawPrompt(ctx, text, x, y) {
  var t = Date.now() * 0.001;
  var alpha = 0.55 + Math.sin(t * 3) * 0.35;
  var tw = ctx.measureText(text).width + 24;
  ctx.fillStyle = 'rgba(10,11,18,0.78)';
  ctx.fillRect(x - tw / 2, y - 10, tw, 16);
  ctx.strokeStyle = `rgba(212,168,67,${alpha.toFixed(2)})`;
  ctx.strokeRect(x - tw / 2 + 1, y - 9, tw - 2, 14);
  ctx.fillStyle = `rgba(232,220,200,${alpha.toFixed(2)})`;
  ctx.fillText(text, x, y + 2);
}

function _drawNightSky(ctx, t) {
  fillGradientRect(ctx, 0, 0, CANVAS_W, CANVAS_H, '#060714', '#1A1C20');
  ctx.fillStyle = window.PALETTE.creamPaper;
  for (var i = 0; i < 70; i++) {
    var sx = (i * 97) % CANVAS_W;
    var sy = (i * 43 + Math.sin(t + i) * 2) % 118;
    var size = i % 11 === 0 ? 2 : 1;
    ctx.globalAlpha = 0.25 + (i % 5) * 0.12;
    ctx.fillRect(sx, sy, size, size);
  }
  ctx.globalAlpha = 1;
}

function _drawMoon(ctx, t) {
  ctx.fillStyle = 'rgba(120,150,255,0.12)';
  ctx.beginPath();
  ctx.arc(210 + Math.sin(t * 0.7) * 12, 48, 34 + Math.sin(t * 1.7) * 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(232,240,255,0.82)';
  ctx.beginPath();
  ctx.arc(210 + Math.sin(t * 0.7) * 12, 48, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(145,183,255,0.12)';
  ctx.beginPath();
  ctx.moveTo(198, 62);
  ctx.lineTo(170 + Math.sin(t) * 8, 168);
  ctx.lineTo(246 + Math.sin(t * 1.2) * 8, 168);
  ctx.lineTo(222, 62);
  ctx.fill();
}

function _drawMountains(ctx) {
  ctx.fillStyle = '#111824';
  ctx.beginPath();
  ctx.moveTo(0, 134);
  ctx.lineTo(45, 100);
  ctx.lineTo(105, 122);
  ctx.lineTo(162, 88);
  ctx.lineTo(232, 118);
  ctx.lineTo(295, 92);
  ctx.lineTo(400, 132);
  ctx.lineTo(400, 170);
  ctx.lineTo(0, 170);
  ctx.fill();
  ctx.fillStyle = '#17251E';
  ctx.fillRect(0, 150, CANVAS_W, 100);
}

function _drawBuildingSilhouette(ctx) {
  ctx.fillStyle = '#202735';
  ctx.fillRect(130, 110, 140, 54);
  ctx.fillStyle = '#4F3428';
  ctx.fillRect(122, 104, 156, 9);
  ctx.fillStyle = '#131722';
  ctx.fillRect(195, 70, 10, 42);
  ctx.fillStyle = '#4F3428';
  ctx.fillRect(188, 64, 24, 7);
  ctx.fillStyle = window.PALETTE.lanternYel;
  ctx.fillRect(150, 126, 8, 10);
  ctx.fillRect(240, 126, 8, 10);
  ctx.fillStyle = 'rgba(212,168,67,0.18)';
  ctx.fillRect(144, 120, 20, 22);
  ctx.fillRect(234, 120, 20, 22);
}

function _drawGrassField(ctx) {
  for (var g = 0; g < 32; g++) {
    ctx.fillStyle = g % 2 === 0 ? '#21351F' : '#2B4426';
    ctx.fillRect(g * 13, 170 + (g % 3) * 4, 9, 80);
  }
}

export function drawTitleLandscape(ctx, t) {
  _drawNightSky(ctx, t);
  _drawMoon(ctx, t);
  _drawMountains(ctx);
  _drawBuildingSilhouette(ctx);
  _drawGrassField(ctx);
  drawFilmGrain(ctx);
}

export function renderFade(ctx) {
  var alpha = gameState.fadeAlpha / 100;
  ctx.fillStyle = `rgba(0,0,0,${alpha.toFixed(2)})`;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Mostra nome area durante la transizione
  if (alpha > 0.3 && alpha < 0.9 && gameState.transitionDir) {
    ctx.fillStyle = '#D4A843';
    ctx.font = 'bold 14px "Courier New", monospace';
    ctx.textAlign = 'center';
    ctx.globalAlpha = alpha < 0.5 ? (alpha - 0.3) * 5 : (0.9 - alpha) * 5;
    ctx.fillText(gameState.transitionDir.toUpperCase(), CANVAS_W / 2, CANVAS_H / 2 - 4);
    ctx.fillStyle = '#A0A8B0';
    ctx.font = '8px "Courier New", monospace';
    ctx.fillText('Caricamento...', CANVAS_W / 2, CANVAS_H / 2 + 10);
    ctx.globalAlpha = 1;
  }
}

// Export for other modules
window.UIRenderer = window.UIRenderer || {};
Object.assign(window.UIRenderer, {
  VISUAL: VISUAL,
  fillGradientRect: fillGradientRect,
  drawPixelPanel: drawPixelPanel,
  drawFilmGrain: drawFilmGrain,
  drawPrompt: drawPrompt,
  drawTitleLandscape: drawTitleLandscape,
  renderFade: renderFade,
});
