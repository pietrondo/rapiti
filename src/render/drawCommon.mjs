/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * DRAW COMMON - Shared drawing primitives
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Shared drawing helpers used by multiple renderers.
 * Extracted from areas.mjs.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, CANVAS_W, CANVAS_H */

const areaTextures = {
  brick: null,
  wood: null,
  stone: null,
  grass: null,
};

export function getAreaTexture(type) {
  if (!areaTextures[type]) {
    areaTextures[type] = window.TextureGenerator.getOrCreateTexture(type, 400, 250);
  }
  return areaTextures[type];
}

/**
 * Disegna una finestra illuminata con effetto bagliore e dettagli
 */
export function drawLitWindow(ctx, x, y, w, h, warm, t, phase) {
  phase = phase || 0;
  var pulse = 0.5 + Math.sin(t * 2 + phase) * 0.18;
  
  // Sfondo finestra (vetro scuro)
  ctx.fillStyle = window.PALETTE.nightBlue;
  ctx.fillRect(x, y, w, h);
  
  // Bagliore interno
  var glowColor = warm
    ? `rgba(212,168,67,${pulse.toFixed(2)})`
    : `rgba(130,160,220,${pulse.toFixed(2)})`;
    
  ctx.fillStyle = glowColor;
  ctx.fillRect(x + 1, y + 1, w - 2, h - 2);

  // Riflesso diagonale
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.moveTo(x + 1, y + 1);
  ctx.lineTo(x + w * 0.4, y + 1);
  ctx.lineTo(x + 1, y + h * 0.4);
  ctx.closePath();
  ctx.fill();

  // Cornice e infissi
  ctx.fillStyle = '#2A1A0A'; // Legno scuro per infissi
  ctx.fillRect(x, y, w, 2); // Top
  ctx.fillRect(x, y + h - 2, w, 2); // Bottom
  ctx.fillRect(x, y, 2, h); // Left
  ctx.fillRect(x + w - 2, y, 2, h); // Right
  
  // Croce infissi
  ctx.fillRect(x + Math.floor(w / 2) - 1, y, 2, h);
  ctx.fillRect(x, y + Math.floor(h / 2) - 1, w, 2);
}

/**
 * Disegna un tetto a tegole con pattern dettagliato
 */
export function drawTileRoof(ctx, x, y, w, color) {
  // Ombra sottotetto
  ctx.fillStyle = '#1A120A';
  ctx.fillRect(x - 6, y - 2, w + 12, 4);
  
  // Base tetto
  var roofColor = color || window.PALETTE.burntOrange;
  ctx.fillStyle = roofColor;
  ctx.beginPath();
  ctx.moveTo(x - 8, y);
  ctx.lineTo(x + w / 2, y - 30);
  ctx.lineTo(x + w + 8, y);
  ctx.closePath();
  ctx.fill();

  // Pattern tegole (linee orizzontali scure)
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 1;
  for (var h = 0; h < 30; h += 5) {
    var rowW = w + 16 - (h / 30) * (w + 16);
    var rowX = x - 8 + (w + 16 - rowW) / 2;
    ctx.beginPath();
    ctx.moveTo(rowX, y - h);
    ctx.lineTo(rowX + rowW, y - h);
    ctx.stroke();
  }
  
  // Tegole verticali (sfalsate)
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  for (var i = 0; i < w + 16; i += 8) {
    ctx.fillRect(x - 6 + i, y - 4 - (i % 16 === 0 ? 2 : 0), 2, 4);
  }
}

/**
 * Disegna un pattern di mattoni su un'area
 */
export function drawBrickPattern(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
  
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  
  // Linee malta orizzontali
  for (var ry = y + 4; ry < y + h; ry += 8) {
    ctx.beginPath();
    ctx.moveTo(x, ry);
    ctx.lineTo(x + w, ry);
    ctx.stroke();
  }
  
  // Mattoni verticali sfalsati
  for (var row = 0; row < h / 8; row++) {
    var offset = (row % 2) * 8;
    for (var rx = x + offset; rx < x + w; rx += 16) {
      ctx.beginPath();
      ctx.moveTo(rx, y + row * 8);
      ctx.lineTo(rx, y + row * 8 + 8);
      ctx.stroke();
    }
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

// Global exports
if (typeof window !== 'undefined') {
  window.getAreaTexture = getAreaTexture;
  window.drawLitWindow = drawLitWindow;
  window.drawTileRoof = drawTileRoof;
  window.drawBrickPattern = drawBrickPattern;
  window.drawWallTexture = drawWallTexture;
  window.drawVignette = drawVignette;
}
