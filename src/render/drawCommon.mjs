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

/* global PALETTE, CANVAS_W, CANVAS_H */

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
  window.drawWallTexture = drawWallTexture;
  window.drawVignette = drawVignette;
}
