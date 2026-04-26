"use strict";

/* ══════════════════════════════════════════════════════════════
   SEZIONE 6: RENDERING
   ══════════════════════════════════════════════════════════════ */

function render(ctx) {
  ctx.save();
  ctx.scale(2, 2);
  ctx.imageSmoothingEnabled = false;
  var ph = gameState.gamePhase;

  if (ph === 'title') { renderTitle(ctx); }
  else if (ph === 'prologue') { renderPrologue(ctx); }
  else if (ph === 'tutorial') { renderTutorial(ctx); }
  else if (ph === 'playing' || ph === 'dialogue' || ph === 'journal' || ph === 'inventory' || ph === 'deduction') {
    renderArea(ctx);
    renderPlayer(ctx);
    renderInteractionHint(ctx);
  }
  else if (ph === 'ending') { renderEndingScreen(ctx); }
  if (ph === 'customize') { renderTitle(ctx); } // Background durante customize
  if (gameState.fadeDir !== 0) renderFade(ctx);

  ctx.restore();
}

function renderTitle(ctx) {
  ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  var t = Date.now() * 0.001;
  ctx.fillStyle = PALETTE.creamPaper;
  for (var i = 0; i < 40; i++) {
    ctx.fillRect((i * 97) % CANVAS_W, (i * 43 + Math.sin(t + i) * 2) % CANVAS_H, 1 + ((i * 3) % 2), 1 + ((i * 7) % 2));
  }
  ctx.fillStyle = PALETTE.lanternYel + '55';
  ctx.beginPath(); ctx.arc(200, 40, 20 + Math.sin(t * 1.5) * 6, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = PALETTE.creamPaper + '77';
  ctx.beginPath(); ctx.arc(200, 40, 8, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = PALETTE.lanternYel + '33';
  ctx.beginPath(); ctx.arc(140, 60, 14 + Math.sin(t * 2 + 1) * 4, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(260, 55, 16 + Math.sin(t * 1.8 + 2) * 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = PALETTE.violetBlue; ctx.fillRect(0, 130, CANVAS_W, 120);
  ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(130, 115, 140, 50);
  ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(130, 108, 140, 8);
  ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(150, 128, 6, 8); ctx.fillRect(240, 128, 6, 8);
  ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(195, 70, 10, 50);
  ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(190, 65, 20, 6);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.font = 'bold 22px "Courier New",monospace'; ctx.textAlign = 'center';
  ctx.fillText('LE LUCI DI SAN CELESTE', 200, 185);
  ctx.font = '11px "Courier New",monospace';
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.fillText('Italia Settentrionale — Estate 1978', 200, 205);
  var alpha = 0.4 + Math.sin(t * 3) * 0.4;
  ctx.fillStyle = 'rgba(232,220,200,' + alpha.toFixed(2) + ')';
  ctx.fillText('Premi ENTER per iniziare', 200, 230);
  ctx.textAlign = 'start';
}

function renderPrologue(ctx) {
  ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = 'rgba(26,28,32,0.88)'; ctx.fillRect(20, 8, 360, 234);
  ctx.strokeStyle = PALETTE.lanternYel; ctx.lineWidth = 2; ctx.strokeRect(20, 8, 360, 234);
  ctx.lineWidth = 1;
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.font = 'bold 14px "Courier New",monospace'; ctx.textAlign = 'center';
  ctx.fillText('LE LUCI DI SAN CELESTE', 200, 35);
  ctx.font = '10px "Courier New",monospace';
  var name = gameState.playerName || 'Detective Maurizio';
  var text = [
    'Estate 1978.',
    'San Celeste, un piccolo borgo',
    'tra Parma e Piacenza.',
    '',
    'Strane luci nel cielo.',
    'Persone scomparse nel nulla.',
    'La prefettura ha inviato',
    'il suo miglior investigatore:',
    '',
    name.toUpperCase(),
    '',
    '"Le luci sono tornate,',
    'come nel 1861, come nel 1961.',
    'Scopri la verita\'."',
    '',
    '...E non dimenticare che al Bar',
    'Centrale fanno un caffe\' niente male.'
  ];
  for (var i = 0; i < text.length; i++) {
    if (text[i].indexOf('"') === 0 || text[i] === name.toUpperCase()) {
      ctx.fillStyle = PALETTE.lanternYel;
    } else {
      ctx.fillStyle = PALETTE.creamPaper;
    }
    if (text[i] === name.toUpperCase()) {
      ctx.font = 'bold 10px "Courier New",monospace';
    } else {
      ctx.font = '9px "Courier New",monospace';
    }
    ctx.fillText(text[i], 200, 60 + i * 13);
  }
  var alpha = 0.4 + Math.sin(Date.now() * 0.003) * 0.4;
  ctx.font = '10px "Courier New",monospace';
  ctx.fillStyle = 'rgba(212,168,67,' + alpha.toFixed(2) + ')';
  ctx.fillText('Premi ENTER per continuare', 200, 238);
  ctx.textAlign = 'start';
}

function renderTutorial(ctx) {
  ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = 'rgba(26,28,32,0.8)'; ctx.fillRect(30, 15, 340, 220);
  ctx.strokeStyle = PALETTE.lanternYel; ctx.lineWidth = 2; ctx.strokeRect(30, 15, 340, 220);
  ctx.lineWidth = 1;
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.font = 'bold 16px "Courier New",monospace'; ctx.textAlign = 'center';
  ctx.fillText('ISTRUZIONI', 200, 45);
  ctx.font = '11px "Courier New",monospace'; ctx.textAlign = 'start';
  var lines = [
    ['WASD / Frecce', 'Muovi il detective'],
    ['E', 'Interagisci / Parla / Raccogli'],
    ['J', 'Apri il Diario (indizi raccolti)'],
    ['I', 'Apri l\'Inventario'],
    ['T', 'Pannello Teoria (quando disponibile)'],
    ['M', 'Musica ON / OFF'],
    ['ESC', 'Chiudi pannelli'],
    ['', ''],
    ['Obiettivo:', 'Scopri la verita\' dietro'],
    ['', 'le luci misteriose di San Celeste.']
  ];
  for (var i = 0; i < lines.length; i++) {
    ctx.fillStyle = PALETTE.lanternYel; ctx.fillText(lines[i][0], 60, 75 + i * 15);
    ctx.fillStyle = PALETTE.creamPaper;
    ctx.fillText(lines[i][1], 60 + ctx.measureText(lines[i][0]).width + 8, 75 + i * 15);
  }
  var alpha2 = 0.4 + Math.sin(Date.now() * 0.003) * 0.4;
  ctx.fillStyle = 'rgba(212,168,67,' + alpha2.toFixed(2) + ')'; ctx.textAlign = 'center';
  ctx.fillText('Premi ENTER per iniziare l\'indagine', 200, 230);
  ctx.textAlign = 'start';
}

function renderArea(ctx) {
  var area = areas[gameState.currentArea];
  area.draw(ctx);
  // Render NPCs
  for (var i = 0; i < area.npcs.length; i++) {
    var n = area.npcs[i];
    var npc = null;
    for (var j = 0; j < npcsData.length; j++) { if (npcsData[j].id === n.id) { npc = npcsData[j]; break; } }
    if (!npc) continue;
    drawSprite(ctx, n.x, n.y, npc.colors, npc.details, 'npc');
    ctx.fillStyle = PALETTE.nightBlue + '88';
    var tw = ctx.measureText(npc.name).width + 8;
    ctx.fillRect(n.x - tw / 2, n.y - 22, tw, 10);
    ctx.fillStyle = PALETTE.lanternYel; ctx.font = '7px "Courier New",monospace';
    ctx.textAlign = 'center'; ctx.fillText(npc.name, n.x, n.y - 14); ctx.textAlign = 'start';
  }
  // Render interactable objects
  var objs = areaObjects[gameState.currentArea] || [];
  for (var k = 0; k < objs.length; k++) {
    var o = objs[k];
    if (o.type === 'gatto') {
      // Draw orange cat
      ctx.fillStyle = '#C4956A'; ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.fillStyle = '#D4A843'; ctx.fillRect(o.x + 1, o.y, 3, 2);
      ctx.fillStyle = '#1A1C20'; ctx.fillRect(o.x + 2, o.y + 1, 1, 1); ctx.fillRect(o.x + 5, o.y + 1, 1, 1);
      continue;
    }
    if (gameState.cluesFound.indexOf(o.id) >= 0) continue;
    if (o.requires && gameState.cluesFound.indexOf(o.requires) < 0) continue;
    if (!o.drawHint) continue;
    var pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.5;
    ctx.fillStyle = 'rgba(212,168,67,' + pulse.toFixed(2) + ')';
    ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + o.h / 2, 6, 0, Math.PI * 2); ctx.fill();
  }
}

function renderPlayer(ctx) {
  var p = gameState.player;
  drawSprite(ctx, Math.round(p.x + p.w / 2), Math.round(p.y + p.h / 2),
    gameState.playerColors, [['trenchcoat', 'fedora']], 'player', p.dir);
}

function drawSprite(ctx, cx, cy, colors, details, type, dir) {
  var s = type === 'player' ? 1 : 0.85;
  dir = dir || 'down';
  var isLeft = (dir === 'left');
  var isUp = (dir === 'up');
  ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(cx - 4 * s, cy + 8 * s, 8 * s, 3 * s);
  ctx.fillStyle = colors.legs;
  ctx.fillRect(cx - 3 * s, cy + 4 * s, 2 * s, 5 * s); ctx.fillRect(cx + 1 * s, cy + 4 * s, 2 * s, 5 * s);
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(cx - 4 * s, cy + 8 * s, 3 * s, 2 * s); ctx.fillRect(cx + 1 * s, cy + 8 * s, 3 * s, 2 * s);
  ctx.fillStyle = colors.body; ctx.fillRect(cx - 4 * s, cy - s, 8 * s, 6 * s);
  ctx.fillStyle = colors.detail;
  if (isLeft) { ctx.fillRect(cx - 4 * s, cy - s, 2 * s, 6 * s); }
  else { ctx.fillRect(cx + 2 * s, cy - s, 2 * s, 6 * s); }
  ctx.fillStyle = colors.head; ctx.fillRect(cx - 3 * s, cy - 7 * s, 6 * s, 7 * s);
  if (!isUp) {
    ctx.fillStyle = '#1A1C20';
    if (isLeft) {
      ctx.fillRect(cx - 3 * s, cy - 5 * s, 2 * s, 2 * s); ctx.fillRect(cx - 1 * s, cy - 5 * s, 2 * s, 2 * s);
    } else {
      ctx.fillRect(cx + 1 * s, cy - 5 * s, 2 * s, 2 * s); ctx.fillRect(cx + 3 * s, cy - 5 * s, 2 * s, 2 * s);
    }
  }
  if (type === 'player') {
    ctx.fillStyle = colors.detail;
    ctx.fillRect(cx - 4 * s, cy - 9 * s, 9 * s, 2 * s); ctx.fillRect(cx - 3 * s, cy - 10 * s, 7 * s, 2 * s);
  }
}

function renderInteractionHint(ctx) {
  var t = gameState.interactionTarget;
  if (!t) return;
  var px = gameState.player.x + gameState.player.w / 2;
  var py = gameState.player.y - 16;
  var label = '???';
  if (t.type === 'npc') label = 'Parla';
  else if (t.type === 'object') label = 'Raccogli';
  else if (t.type === 'gatto') label = 'Accarezza';
  ctx.fillStyle = PALETTE.nightBlue + 'CC'; ctx.fillRect(px - 35, py - 10, 70, 12);
  ctx.fillStyle = PALETTE.lanternYel; ctx.font = '8px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('[E] ' + label, px, py);
  ctx.textAlign = 'start';
}

function renderFade(ctx) {
  ctx.fillStyle = 'rgba(0,0,0,' + (gameState.fadeAlpha / 100).toFixed(2) + ')';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

function renderEndingScreen(ctx) {
  ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  var t = Date.now() * 0.001;
  ctx.fillStyle = PALETTE.creamPaper + '22';
  for (var i = 0; i < 30; i++) {
    ctx.fillRect((i * 117) % CANVAS_W, (i * 53 + Math.sin(t + i) * 3) % CANVAS_H, 2, 2);
  }
}
