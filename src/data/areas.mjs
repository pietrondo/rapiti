/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREAS - Helper Functions
 * Funzioni di supporto condivise per il disegno delle aree
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global PALETTE, CANVAS_W, CANVAS_H, TextureGenerator */

const areaTextures = {
  brick: null,
  wood: null,
  stone: null,
  grass: null,
};

export function getAreaTexture(type) {
  if (!areaTextures[type]) {
    areaTextures[type] = TextureGenerator.getOrCreateTexture(type, 400, 250);
  }
  return areaTextures[type];
}

/* ── Helper condivisi ── */

export function drawLitWindow(ctx, x, y, w, h, warm, t, phase) {
  var pulse = 0.5 + Math.sin(t * 2 + phase) * 0.18;
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = warm
    ? `rgba(212,168,67,${pulse.toFixed(2)})`
    : `rgba(130,160,220,${pulse.toFixed(2)})`;
  ctx.fillRect(x + 2, y + 2, w - 4, h - 4);
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.fillRect(x, y, w, 2);
  ctx.fillRect(x, y + h - 2, w, 2);
  ctx.fillRect(x, y, 2, h);
  ctx.fillRect(x + w - 2, y, 2, h);
  ctx.fillRect(x + Math.floor(w / 2) - 1, y, 2, h);
  ctx.fillRect(x, y + Math.floor(h / 2) - 1, w, 2);
}

export function drawTileRoof(ctx, x, y, w, color) {
  ctx.fillStyle = '#35241D';
  ctx.fillRect(x - 5, y - 3, w + 10, 4);
  ctx.fillStyle = color || PALETTE.burntOrange;
  ctx.beginPath();
  ctx.moveTo(x - 8, y);
  ctx.lineTo(x + w / 2, y - 24);
  ctx.lineTo(x + w + 8, y);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  for (var i = 0; i < w + 12; i += 8) {
    ctx.fillRect(x - 6 + i, y - 4 - (i % 16 === 0 ? 2 : 0), 6, 2);
  }
}

export function drawWallTexture(ctx, x, y, w, h, base, alt) {
  ctx.fillStyle = base;
  ctx.fillRect(x, y, w, h);
  for (var i = 0; i < 34; i++) {
    var tx = x + ((i * 17) % Math.max(1, w));
    var ty = y + ((i * 11) % Math.max(1, h));
    ctx.fillStyle = i % 3 === 0 ? alt : 'rgba(255,255,255,0.06)';
    ctx.fillRect(tx, ty, 4 + (i % 3), 2);
  }
}

export function drawMunicipioFacade(ctx, x, y, w, h, t) {
  drawWallTexture(ctx, x, y, w, h, PALETTE.fadedBeige, 'rgba(107,91,79,0.22)');
  ctx.fillStyle = PALETTE.greyBrown;
  ctx.fillRect(x - 6, y + h - 8, w + 12, 8);
  ctx.fillStyle = PALETTE.burntOrange;
  ctx.fillRect(x - 4, y - 8, w + 8, 8);
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.fillRect(x - 8, y - 12, w + 16, 5);
  ctx.fillStyle = PALETTE.fadedBeige;
  ctx.fillRect(x + w / 2 - 16, y - 30, 32, 24);
  drawTileRoof(ctx, x + w / 2 - 18, y - 30, 36, PALETTE.greyBrown);
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.beginPath();
  ctx.arc(x + w / 2, y - 17, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.fillRect(x + w / 2 - 1, y - 22, 2, 6);
  ctx.fillRect(x + w / 2 - 1, y - 18, 6, 2);
  drawLitWindow(ctx, x + 12, y + 16, 16, 20, true, t, 0);
  drawLitWindow(ctx, x + w - 28, y + 16, 16, 20, true, t, 1);
  drawLitWindow(ctx, x + 38, y + 16, 14, 18, false, t, 2);
  drawLitWindow(ctx, x + w - 52, y + 16, 14, 18, false, t, 3);
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.fillRect(x + w / 2 - 13, y + h - 36, 26, 34);
  ctx.fillStyle = PALETTE.slateGrey;
  ctx.fillRect(x + w / 2 - 10, y + h - 32, 8, 14);
  ctx.fillRect(x + w / 2 + 2, y + h - 32, 8, 14);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.fillRect(x + w / 2 + 6, y + h - 18, 3, 3);
  ctx.fillStyle = PALETTE.alumGrey;
  ctx.fillRect(x + w / 2 - 22, y + h - 2, 44, 3);
  ctx.fillRect(x + w / 2 - 18, y + h - 6, 36, 4);
  ctx.fillStyle = '#00853E';
  ctx.fillRect(x + w + 6, y + 12, 4, 14);
  ctx.fillStyle = '#F4F0E8';
  ctx.fillRect(x + w + 10, y + 12, 4, 14);
  ctx.fillStyle = '#C83737';
  ctx.fillRect(x + w + 14, y + 12, 4, 14);
  ctx.fillStyle = PALETTE.slateGrey;
  ctx.fillRect(x + w + 5, y + 10, 2, 18);
}

export function drawChurchFacade(ctx, x, y, w, h, t) {
  drawWallTexture(ctx, x, y, w, h, PALETTE.greyBrown, 'rgba(232,220,200,0.12)');
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.lineTo(x + w / 2, y - 28);
  ctx.lineTo(x + w + 10, y);
  ctx.fill();
  ctx.fillStyle = PALETTE.greyBrown;
  ctx.fillRect(x + w / 2 - 22, y - 50, 44, 50);
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.beginPath();
  ctx.moveTo(x + w / 2 - 25, y - 50);
  ctx.lineTo(x + w / 2, y - 74);
  ctx.lineTo(x + w / 2 + 25, y - 50);
  ctx.fill();
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.fillRect(x + w / 2 - 2, y - 66, 4, 18);
  ctx.fillRect(x + w / 2 - 9, y - 59, 18, 4);
  ctx.fillStyle = 'rgba(212,168,67,0.18)';
  ctx.beginPath();
  ctx.arc(x + w / 2, y + 56, 30 + Math.sin(t * 1.5) * 4, 0, Math.PI * 2);
  ctx.fill();
  drawLitWindow(ctx, x + 24, y + 22, 16, 30, true, t, 0);
  drawLitWindow(ctx, x + w - 40, y + 22, 16, 30, true, t, 1);
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.fillRect(x + w / 2 - 14, y + h - 42, 28, 40);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.fillRect(x + w / 2 - 5, y + h - 34, 10, 10);
  ctx.fillStyle = PALETTE.alumGrey;
  ctx.fillRect(x - 10, y + h, w + 20, 8);
  for (var p = 0; p < 5; p++) {
    ctx.fillStyle = p % 2 ? PALETTE.greyBrown : PALETTE.earthBrown;
    ctx.fillRect(x + 8 + p * 22, y + h + 8, 16, 60);
  }
}

export function drawBarFacade(ctx, x, y, w, h, t) {
  drawWallTexture(ctx, x, y, w, h, '#BBA07A', 'rgba(80,54,38,0.18)');
  ctx.fillStyle = '#442B1F';
  ctx.fillRect(x - 8, y + h - 8, w + 16, 10);
  ctx.fillStyle = '#6B2F25';
  ctx.fillRect(x - 10, y - 10, w + 20, 12);
  ctx.fillStyle = '#2B1D18';
  ctx.fillRect(x - 14, y - 15, w + 28, 6);

  var neon = 0.62 + Math.sin(t * 4) * 0.28;
  ctx.fillStyle = 'rgba(110,18,18,0.72)';
  ctx.fillRect(x + 24, y - 33, w - 48, 25);
  ctx.fillStyle = `rgba(220,54,42,${neon.toFixed(2)})`;
  ctx.fillRect(x + 28, y - 29, w - 56, 17);
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.font = 'bold 11px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BAR SAN CELESTE', x + w / 2, y - 16);
  ctx.textAlign = 'start';

  ctx.fillStyle = 'rgba(212,168,67,0.12)';
  ctx.fillRect(x + 14, y + 18, w - 28, 54);
  drawBarWindow(ctx, x + 18, y + 20, 46, 42, t, 0);
  drawBarWindow(ctx, x + w - 64, y + 20, 46, 42, t, 1);

  ctx.fillStyle = '#5A382A';
  ctx.fillRect(x + w / 2 - 18, y + h - 49, 36, 47);
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(x + w / 2 - 14, y + h - 45, 28, 34);
  ctx.fillStyle = 'rgba(130,160,220,0.38)';
  ctx.fillRect(x + w / 2 - 11, y + h - 42, 22, 27);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.fillRect(x + w / 2 + 9, y + h - 27, 3, 3);

  drawStripedAwning(ctx, x + 14, y + 66, w - 28, t);
  ctx.fillStyle = '#4A2F24';
  ctx.fillRect(x + 18, y + h - 4, w - 36, 4);
}

export function drawBarWindow(ctx, x, y, w, h, t, phase) {
  ctx.fillStyle = '#35241D';
  ctx.fillRect(x - 3, y - 3, w + 6, h + 6);
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = `rgba(212,168,67,${(0.42 + Math.sin(t * 2 + phase) * 0.12).toFixed(2)})`;
  ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
  ctx.fillStyle = '#4A2F24';
  ctx.fillRect(x + Math.floor(w / 2) - 1, y, 2, h);
  ctx.fillRect(x, y + Math.floor(h / 2) - 1, w, 2);
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.fillRect(x + 5, y + 6, 10, 2);
}

export function drawStripedAwning(ctx, x, y, w, _t) {
  ctx.fillStyle = '#6B2F25';
  ctx.fillRect(x - 6, y, w + 12, 3);
  var stripes = Math.floor(w / 12);
  for (var s = 0; s < stripes; s++) {
    ctx.fillStyle = s % 2 ? '#C83737' : '#F4F0E8';
    ctx.beginPath();
    ctx.moveTo(x + s * 12, y + 3);
    ctx.lineTo(x + s * 12 + 12, y + 3);
    ctx.lineTo(x + s * 12 + 8, y + 18);
    ctx.lineTo(x + s * 12 - 4, y + 18);
    ctx.closePath();
    ctx.fill();
  }
}

export function drawPiazzaFountain(ctx, x, y, t) {
  ctx.fillStyle = PALETTE.stoneGrey;
  ctx.fillRect(x - 20, y + 10, 40, 12);
  ctx.fillStyle = PALETTE.darkForest;
  ctx.beginPath();
  ctx.moveTo(x - 24, y + 10);
  ctx.lineTo(x + 24, y + 10);
  ctx.lineTo(x, y - 18);
  ctx.fill();
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.globalAlpha = 0.8;
  ctx.fillRect(x - 4, y - 14, 8, 8);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#6fa';
  ctx.globalAlpha = 0.6 + Math.sin(t * 3) * 0.2;
  ctx.fillRect(x - 14, y + 14, 28, 6);
  ctx.globalAlpha = 1;
}

export function drawNoticeBoard(ctx, x, y, _t) {
  ctx.fillStyle = '#5A4030';
  ctx.fillRect(x - 2, y - 2, 44, 54);
  ctx.fillStyle = '#3A2820';
  ctx.fillRect(x, y, 40, 50);
  ctx.fillStyle = '#D4C4A8';
  ctx.fillRect(x + 4, y + 4, 32, 42);
  ctx.fillStyle = '#2A1C18';
  ctx.font = '9px monospace';
  ctx.fillText('AVVISI', x + 8, y + 14);
  ctx.fillRect(x + 6, y + 18, 28, 1);
  ctx.fillRect(x + 6, y + 22, 24, 1);
  ctx.fillRect(x + 6, y + 26, 26, 1);
  ctx.fillRect(x + 6, y + 30, 20, 1);
}

export function drawBench(ctx, x, y) {
  ctx.fillStyle = '#5A4030';
  ctx.fillRect(x - 2, y - 4, 44, 8);
  ctx.fillRect(x, y + 4, 4, 14);
  ctx.fillRect(x + 36, y + 4, 4, 14);
  ctx.fillStyle = '#3A2820';
  ctx.fillRect(x + 4, y - 2, 32, 4);
}

export function drawVignette(ctx) {
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
}

// Esporta
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getAreaTexture: getAreaTexture,
    drawLitWindow: drawLitWindow,
    drawTileRoof: drawTileRoof,
    drawWallTexture: drawWallTexture,
    drawMunicipioFacade: drawMunicipioFacade,
    drawChurchFacade: drawChurchFacade,
    drawBarFacade: drawBarFacade,
    drawBarWindow: drawBarWindow,
    drawStripedAwning: drawStripedAwning,
    drawPiazzaFountain: drawPiazzaFountain,
    drawNoticeBoard: drawNoticeBoard,
    drawBench: drawBench,
    drawVignette: drawVignette,
  };
} else if (typeof window !== 'undefined') {
  window.getAreaTexture = getAreaTexture;
  window.drawLitWindow = drawLitWindow;
  window.drawTileRoof = drawTileRoof;
  window.drawWallTexture = drawWallTexture;
  window.drawMunicipioFacade = drawMunicipioFacade;
  window.drawChurchFacade = drawChurchFacade;
  window.drawBarFacade = drawBarFacade;
  window.drawBarWindow = drawBarWindow;
  window.drawStripedAwning = drawStripedAwning;
  window.drawPiazzaFountain = drawPiazzaFountain;
  window.drawNoticeBoard = drawNoticeBoard;
  window.drawBench = drawBench;
  window.drawVignette = drawVignette;
}
