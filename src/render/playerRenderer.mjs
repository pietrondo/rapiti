/* ═══════════════════════════════════════════════════════════════════════════════
   PLAYER RENDERER
   Rendering player sprite and legacy fallback
   ═══════════════════════════════════════════════════════════════════════════════ */

export function renderPlayer(ctx) {
  var p = gameState.player;

  // Update animation state
  if (p.x !== window.SpriteManager.animState.lastX || p.y !== window.SpriteManager.animState.lastY) {
    window.SpriteManager.animState.isMoving = true;
    window.SpriteManager.animState.lastX = p.x;
    window.SpriteManager.animState.lastY = p.y;
  } else {
    window.SpriteManager.animState.isMoving = false;
  }

  if (window.SpriteManager.animState.isMoving) {
    window.SpriteManager.animState.playerTimer++;
    if (window.SpriteManager.animState.playerTimer % 8 === 0) {
      window.SpriteManager.animState.playerFrame = (window.SpriteManager.animState.playerFrame + 1) % 4;
    }
  } else {
    window.SpriteManager.animState.playerFrame = 0;
  }

  // Draw shadow
  ctx.fillStyle = 'rgba(0,0,0,0.34)';
  ctx.beginPath();
  ctx.ellipse(p.x + 16, p.y + 16, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(212,168,67,0.10)';
  ctx.beginPath();
  ctx.ellipse(p.x + 16, p.y + 14, 16, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Draw from sprite sheet
  var sheet = window.SpriteManager.getOrCreatePlayerSheet();
  if (!sheet) return;

  var dirIndex = { down: 0, up: 1, left: 2, right: 3 }[p.dir] || 0;
  var srcX = window.SpriteManager.animState.playerFrame * 32;
  var srcY = dirIndex * 32;

  ctx.drawImage(sheet, srcX, srcY, 32, 32, Math.round(p.x), Math.round(p.y - 16), 32, 32);
}

// Legacy drawSprite (kept for fallback)
export function drawSprite(ctx, cx, cy, colors, _details, type, dir) {
  var s = type === 'player' ? 1 : 0.85;
  dir = dir || 'down';
  var isLeft = dir === 'left';
  var isUp = dir === 'up';
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.fillRect(cx - 4 * s, cy + 8 * s, 8 * s, 3 * s);
  ctx.fillStyle = colors.legs;
  ctx.fillRect(cx - 3 * s, cy + 4 * s, 2 * s, 5 * s);
  ctx.fillRect(cx + 1 * s, cy + 4 * s, 2 * s, 5 * s);
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(cx - 4 * s, cy + 8 * s, 3 * s, 2 * s);
  ctx.fillRect(cx + 1 * s, cy + 8 * s, 3 * s, 2 * s);
  ctx.fillStyle = colors.body;
  ctx.fillRect(cx - 4 * s, cy - s, 8 * s, 6 * s);
  ctx.fillStyle = colors.detail;
  if (isLeft) {
    ctx.fillRect(cx - 4 * s, cy - s, 2 * s, 6 * s);
  } else {
    ctx.fillRect(cx + 2 * s, cy - s, 2 * s, 6 * s);
  }
  ctx.fillStyle = colors.head;
  ctx.fillRect(cx - 3 * s, cy - 7 * s, 6 * s, 7 * s);
  if (!isUp) {
    ctx.fillStyle = '#1A1C20';
    if (isLeft) {
      ctx.fillRect(cx - 3 * s, cy - 5 * s, 2 * s, 2 * s);
      ctx.fillRect(cx - 1 * s, cy - 5 * s, 2 * s, 2 * s);
    } else {
      ctx.fillRect(cx + 1 * s, cy - 5 * s, 2 * s, 2 * s);
      ctx.fillRect(cx + 3 * s, cy - 5 * s, 2 * s, 2 * s);
    }
  }
  if (type === 'player') {
    ctx.fillStyle = colors.detail;
    ctx.fillRect(cx - 4 * s, cy - 9 * s, 9 * s, 2 * s);
    ctx.fillRect(cx - 3 * s, cy - 10 * s, 7 * s, 2 * s);
  }
}
