/* ═══════════════════════════════════════════════════════════════════════════════
   GAME RENDERER
   Rendering gameplay: aree, player, NPC, oggetti, hint interazione
   ═══════════════════════════════════════════════════════════════════════════════ */

export function renderArea(ctx) {
  var area = areas[gameState.currentArea];
  area.draw(ctx);
  UIRenderer.renderAreaExitMarkers(ctx, area);

  // Render NPCs
  for (var i = 0; i < area.npcs.length; i++) {
    var n = area.npcs[i];
    var npc = null;
    for (var j = 0; j < npcsData.length; j++) {
      if (npcsData[j].id === n.id) {
        npc = npcsData[j];
        break;
      }
    }
    if (!npc) continue;

    // Draw shadow
    ctx.fillStyle = 'rgba(0,0,0,0.34)';
    ctx.beginPath();
    ctx.ellipse(n.x, n.y + 2, 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    var npcSheet = SpriteManager.getOrCreateNPCSheet(
      npc.id || npc.name.toLowerCase().replace(/[^a-z]/g, '')
    );
    if (npcSheet) {
      var npcDir = n.facing || 'down';
      var npcFrame = (n.animFrame || 0) % 2;
      var npcDirIdx = { down: 0, up: 1, left: 2, right: 3 }[npcDir] || 0;
      var npcSrcX = npcFrame * 32;
      var npcSrcY = npcDirIdx * 32;
      ctx.drawImage(
        npcSheet,
        npcSrcX,
        npcSrcY,
        32,
        32,
        Math.round(n.x - 16),
        Math.round(n.y - 32),
        32,
        32
      );
    } else {
      drawSprite(ctx, n.x, n.y, npc.colors, npc.details, 'npc', n.facing);
    }
    ctx.font = '7px "Courier New",monospace';
    var tw = ctx.measureText(npc.name).width + 12;
    ctx.fillStyle = 'rgba(8,9,14,0.76)';
    ctx.fillRect(n.x - tw / 2, n.y - 42, tw, 12);
    ctx.strokeStyle = 'rgba(212,168,67,0.55)';
    ctx.strokeRect(n.x - tw / 2 + 1, n.y - 41, tw - 2, 10);
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.textAlign = 'center';
    ctx.fillText(npc.name, n.x, n.y - 33);
    ctx.textAlign = 'start';
  }

  // Render interactable objects
  var objs = areaObjects[gameState.currentArea] || [];
  for (var k = 0; k < objs.length; k++) {
    var o = objs[k];
    if (o.type === 'gatto') {
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      ctx.fillRect(o.x - 1, o.y + o.h - 1, o.w + 3, 2);
      ctx.fillStyle = '#C4956A';
      ctx.fillRect(o.x, o.y + 2, o.w, o.h - 2);
      ctx.fillStyle = '#D4A843';
      ctx.fillRect(o.x + 1, o.y, 3, 3);
      ctx.fillRect(o.x + 5, o.y, 2, 3);
      ctx.fillStyle = '#1A1C20';
      ctx.fillRect(o.x + 2, o.y + 2, 1, 1);
      ctx.fillRect(o.x + 5, o.y + 2, 1, 1);
      ctx.fillStyle = '#E8DCC8';
      ctx.fillRect(o.x + 7, o.y + 3, 4, 1);
      continue;
    }
    if (o.type === 'radio') {
      var pulse = Math.sin(Date.now() * 0.006) * 0.3 + 0.5;
      ctx.fillStyle = 'rgba(212,168,67,' + pulse.toFixed(2) + ')';
      ctx.beginPath();
      ctx.arc(o.x + o.w / 2, o.y + o.h / 2, 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(o.x + 1, o.y + o.h, o.w, 3);
      ctx.fillStyle = PALETTE.slateGrey;
      ctx.fillRect(o.x + 2, o.y, o.w - 4, o.h);
      ctx.fillStyle = PALETTE.nightBlue;
      ctx.fillRect(o.x + 5, o.y + 3, 7, 5);
      ctx.fillStyle = PALETTE.lanternYel;
      ctx.fillRect(o.x + 14, o.y + 3, 2, 2);
      ctx.fillStyle = PALETTE.creamPaper;
      ctx.fillRect(o.x + 5, o.y - 4, 1, 4);
      ctx.fillRect(o.x + 6, o.y - 6, 1, 2);
      continue;
    }
    if (o.type === 'recorder') {
      var rp = Math.sin(Date.now() * 0.005) * 0.25 + 0.55;
      ctx.fillStyle = 'rgba(145,183,255,' + (rp * 0.2).toFixed(2) + ')';
      ctx.beginPath();
      ctx.arc(o.x + o.w / 2, o.y + o.h / 2, 17, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.35)';
      ctx.fillRect(o.x + 2, o.y + o.h, o.w - 2, 3);
      ctx.fillStyle = '#2C313B';
      ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.fillStyle = '#11141B';
      ctx.fillRect(o.x + 3, o.y + 3, 8, 8);
      ctx.fillRect(o.x + 16, o.y + 3, 8, 8);
      ctx.fillStyle = PALETTE.alumGrey;
      ctx.fillRect(o.x + 5, o.y + 5, 4, 4);
      ctx.fillRect(o.x + 18, o.y + 5, 4, 4);
      ctx.fillStyle = PALETTE.lanternYel;
      ctx.fillRect(o.x + 12, o.y + 11, 6, 2);
      continue;
    }
    if (gameState.cluesFound.indexOf(o.id) >= 0) continue;
    if (o.requires && gameState.cluesFound.indexOf(o.requires) < 0) continue;
    if (!o.drawHint) continue;
    UIRenderer.drawObjectIcon(ctx, o);
  }
}

export function renderPlayer(ctx) {
  var p = gameState.player;

  // Update animation state
  if (p.x !== SpriteManager.animState.lastX || p.y !== SpriteManager.animState.lastY) {
    SpriteManager.animState.isMoving = true;
    SpriteManager.animState.lastX = p.x;
    SpriteManager.animState.lastY = p.y;
  } else {
    SpriteManager.animState.isMoving = false;
  }

  if (SpriteManager.animState.isMoving) {
    SpriteManager.animState.playerTimer++;
    if (SpriteManager.animState.playerTimer % 8 === 0) {
      SpriteManager.animState.playerFrame = (SpriteManager.animState.playerFrame + 1) % 4;
    }
  } else {
    SpriteManager.animState.playerFrame = 0;
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
  var sheet = SpriteManager.getOrCreatePlayerSheet();
  if (!sheet) return;

  var dirIndex = { down: 0, up: 1, left: 2, right: 3 }[p.dir] || 0;
  var srcX = SpriteManager.animState.playerFrame * 32;
  var srcY = dirIndex * 32;

  ctx.drawImage(sheet, srcX, srcY, 32, 32, Math.round(p.x), Math.round(p.y - 16), 32, 32);
}

// Legacy drawSprite (kept for fallback)
export function drawSprite(ctx, cx, cy, colors, details, type, dir) {
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

export function renderInteractionHint(ctx) {
  var t = gameState.interactionTarget;
  if (!t) return;
  var px = gameState.player.x + gameState.player.w / 2;
  var py = gameState.player.y - 16;
  var label = '???';
  if (t.type === 'npc') label = 'Parla';
  else if (t.type === 'object') label = 'Raccogli';
  else if (t.type === 'door') label = 'Entra / Esci';
  else if (t.type === 'radio') label = 'Accendi Radio';
  else if (t.type === 'recorder') label = 'Usa Registratore';
  else if (t.type === 'scene') label = 'Esamina';
  else if (t.type === 'gatto') label = 'Accarezza';
  ctx.font = '8px "Courier New",monospace';
  var text = '[E] ' + label;
  var w = ctx.measureText(text).width + 18;
  ctx.fillStyle = 'rgba(8,9,14,0.86)';
  ctx.fillRect(px - w / 2, py - 13, w, 16);
  ctx.strokeStyle = 'rgba(212,168,67,0.75)';
  ctx.strokeRect(px - w / 2 + 1, py - 12, w - 2, 14);
  ctx.fillStyle = 'rgba(212,168,67,0.24)';
  ctx.fillRect(px - 3, py + 5, 6, 5);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.textAlign = 'center';
  ctx.fillText(text, px, py - 2);
  ctx.textAlign = 'start';
}

// Export for other modules
window.GameRenderer = {
  renderArea: renderArea,
  renderPlayer: renderPlayer,
  drawSprite: drawSprite,
  renderInteractionHint: renderInteractionHint,
};
