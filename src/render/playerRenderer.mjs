/* ═══════════════════════════════════════════════════════════════════════════════
   PLAYER RENDERER
   Rendering player sprite and legacy fallback
   ═══════════════════════════════════════════════════════════════════════════════ */

export function renderPlayer(ctx) {
  var p = gameState.player;
  var sm = window.SpriteManager;

  // Update animation state
  if (p.x !== sm.animState.lastX || p.y !== sm.animState.lastY) {
    sm.animState.isMoving = true;
    sm.animState.lastX = p.x;
    sm.animState.lastY = p.y;
  } else {
    sm.animState.isMoving = false;
  }

  var t = Date.now() * 0.001;
  var scaleX = 1;
  var scaleY = 1;
  var offsetY = 0;

  if (sm.animState.isMoving) {
    sm.animState.playerTimer++;
    if (sm.animState.playerTimer % 8 === 0) {
      sm.animState.playerFrame = (sm.animState.playerFrame + 1) % 4;
    }
    // Bounce effect (Squash & Stretch)
    scaleY = 1 + Math.sin(t * 12) * 0.05;
    scaleX = 1 / scaleY;
    offsetY = Math.abs(Math.sin(t * 12)) * -2;
  } else {
    sm.animState.playerFrame = 0;
    // Idle breathing
    scaleY = 1 + Math.sin(t * 2) * 0.02;
    scaleX = 1 / scaleY;
  }

  // Effect discovery "jump" (Squash & Stretch)
  if (p.discoveryJump > 0) {
     var jumpProgress = p.discoveryJump / 20;
     scaleY = 1 + Math.sin(jumpProgress * Math.PI) * 0.3;
     scaleX = 1 / scaleY;
     offsetY = -Math.sin(jumpProgress * Math.PI) * 10;
     p.discoveryJump--;
  } else if (window.gameState.screenShake > 0) {
     scaleY = 1.1;
     scaleX = 0.9;
  }

  // Draw shadow
  ctx.save();
  ctx.fillStyle = 'rgba(0,0,0,0.3)';
  ctx.beginPath();
  ctx.ellipse(p.x + 16, p.y + 14, 14 * scaleX, 4 * scaleY, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Draw from sprite sheet
  var sheet = sm.getOrCreatePlayerSheet();
  if (!sheet) return;

  var dirIndex = { down: 0, up: 1, left: 2, right: 3 }[p.dir] || 0;
  var srcX = sm.animState.playerFrame * 32;
  var srcY = dirIndex * 32;

  ctx.save();
  ctx.translate(p.x + 16, p.y + 16);
  ctx.scale(scaleX, scaleY);
  ctx.drawImage(sheet, srcX, srcY, 32, 32, -16, -32 + offsetY, 32, 32);
  ctx.restore();
}

// Legacy drawSprite (kept for fallback)
export function drawSprite(ctx, cx, cy, colors, _details, type, dir) {
  var s = type === 'player' ? 1 : 0.85;
  dir = dir || 'down';
  var isLeft = dir === 'left';
  var isUp = dir === 'up';
  
  // Ombra
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 10 * s, 7 * s, 3 * s, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Gambe
  ctx.fillStyle = '#1A1410';
  ctx.fillRect(cx - 3 * s, cy + 3 * s, 2.5 * s, 6 * s);
  ctx.fillRect(cx + 0.5 * s, cy + 3 * s, 2.5 * s, 6 * s);
  ctx.fillStyle = colors.legs;
  ctx.fillRect(cx - 2.5 * s, cy + 3 * s, 2 * s, 5.5 * s);
  ctx.fillRect(cx + 0.5 * s, cy + 3 * s, 2 * s, 5.5 * s);
  
  // Scarpe
  ctx.fillStyle = '#1A1410';
  ctx.fillRect(cx - 3.5 * s, cy + 8 * s, 3.5 * s, 2 * s);
  ctx.fillRect(cx + 0.5 * s, cy + 8 * s, 3.5 * s, 2 * s);
  
  // Corpo (cappotto)
  ctx.fillStyle = colors.body;
  ctx.fillRect(cx - 4.5 * s, cy - 2 * s, 9 * s, 7 * s);
  // Colletto
  ctx.fillStyle = colors.detail;
  ctx.fillRect(cx - 1.5 * s, cy - 2 * s, 3 * s, 1.5 * s);
  
  // Bottoni
  ctx.fillStyle = '#D4A843';
  ctx.fillRect(cx - 0.5 * s, cy + 1 * s, 1 * s, 1 * s);
  ctx.fillRect(cx - 0.5 * s, cy + 3 * s, 1 * s, 1 * s);
  
  // Cintura
  ctx.fillStyle = '#2A2018';
  ctx.fillRect(cx - 3.5 * s, cy + 3.5 * s, 7 * s, 1 * s);
  
  // Braccia
  ctx.fillStyle = colors.body;
  if (isLeft) {
    ctx.fillRect(cx - 6 * s, cy - 1 * s, 2.5 * s, 5 * s);
    ctx.fillRect(cx + 2.5 * s, cy - 1 * s, 2 * s, 5 * s);
  } else {
    ctx.fillRect(cx - 4.5 * s, cy - 1 * s, 2 * s, 5 * s);
    ctx.fillRect(cx + 4 * s, cy - 1 * s, 2.5 * s, 5 * s);
  }
  
  // Mani
  ctx.fillStyle = '#C4956A';
  if (isLeft) {
    ctx.fillRect(cx - 6.5 * s, cy + 3 * s, 2.5 * s, 2 * s);
  } else {
    ctx.fillRect(cx + 4.5 * s, cy + 3 * s, 2.5 * s, 2 * s);
  }
  
  // Testa
  ctx.fillStyle = colors.head;
  ctx.fillRect(cx - 3 * s, cy - 8 * s, 6 * s, 7 * s);
  
  // Capelli
  ctx.fillStyle = '#2A2018';
  ctx.fillRect(cx - 3.5 * s, cy - 9 * s, 7 * s, 2.5 * s);
  ctx.fillRect(cx - 3.5 * s, cy - 8.5 * s, 1.5 * s, 3 * s);
  ctx.fillRect(cx + 2.5 * s, cy - 8.5 * s, 1.5 * s, 3 * s);
  
  // Occhiali / occhi
  if (!isUp) {
    ctx.fillStyle = '#1A1C20';
    if (isLeft) {
      ctx.fillRect(cx - 2.5 * s, cy - 5.5 * s, 2 * s, 2 * s);
      ctx.fillRect(cx - 0.5 * s, cy - 5.5 * s, 2 * s, 2 * s);
      // Lente
      ctx.fillStyle = 'rgba(200,200,220,0.3)';
      ctx.fillRect(cx - 2.3 * s, cy - 5.3 * s, 1.6 * s, 1.6 * s);
    } else {
      ctx.fillRect(cx + 0.5 * s, cy - 5.5 * s, 2 * s, 2 * s);
      ctx.fillRect(cx + 2.5 * s, cy - 5.5 * s, 2 * s, 2 * s);
      // Lente
      ctx.fillStyle = 'rgba(200,200,220,0.3)';
      ctx.fillRect(cx + 0.7 * s, cy - 5.3 * s, 1.6 * s, 1.6 * s);
    }
  }
  
  // Cappello (detective)
  if (type === 'player') {
    ctx.fillStyle = colors.detail;
    // Tesa
    ctx.fillRect(cx - 6 * s, cy - 8.5 * s, 12 * s, 1.5 * s);
    // Cupola
    ctx.fillRect(cx - 3.5 * s, cy - 11.5 * s, 7 * s, 3.5 * s);
    // Nastro
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(cx - 3.5 * s, cy - 9.5 * s, 7 * s, 1 * s);
  }
}
