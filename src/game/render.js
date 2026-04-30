"use strict";

// === Sprite Sheet Cache ===
var spriteCache = {
  player: null,
  playerColors: null,
  npcs: {}
};

function getOrCreatePlayerSheet() {
  if (!spriteCache.player || spriteCache.playerColors !== JSON.stringify(gameState.playerColors)) {
    spriteCache.playerColors = JSON.stringify(gameState.playerColors);
    var c = gameState.playerColors;
    spriteCache.player = SpriteGenerator.generatePlayerSheet({
      body: c.body,
      bodyLight: _lighten(c.body, 15),
      bodyDark: _darken(c.body, 20),
      detail: c.detail,
      detailLight: _lighten(c.detail, 15),
      legs: c.legs,
      head: c.head,
      headShadow: _darken(c.head, 15)
    });
  }
  return spriteCache.player;
}

function _lighten(hex, amount) {
  var r = parseInt(hex.slice(1,3), 16);
  var g = parseInt(hex.slice(3,5), 16);
  var b = parseInt(hex.slice(5,7), 16);
  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);
  return '#' + r.toString(16).padStart(2,'0') + g.toString(16).padStart(2,'0') + b.toString(16).padStart(2,'0');
}

function _darken(hex, amount) {
  var r = parseInt(hex.slice(1,3), 16);
  var g = parseInt(hex.slice(3,5), 16);
  var b = parseInt(hex.slice(5,7), 16);
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);
  return '#' + r.toString(16).padStart(2,'0') + g.toString(16).padStart(2,'0') + b.toString(16).padStart(2,'0');
}

function getOrCreateNPCSheet(npcId) {
  if (!spriteCache.npcs[npcId]) {
    var npcData = null;
    for (var i = 0; i < npcsData.length; i++) {
      if (npcsData[i].id === npcId) { npcData = npcsData[i]; break; }
    }
    if (npcData) {
      spriteCache.npcs[npcId] = SpriteGenerator.generateNPCSheet(npcData);
    }
  }
  return spriteCache.npcs[npcId] || null;
}

// === Animation state ===
var animState = {
  playerFrame: 0,
  playerTimer: 0,
  isMoving: false,
  lastX: 0,
  lastY: 0
};

var VISUAL = {
  ink: '#0B0C12',
  panel: '#15161B',
  panel2: '#222631',
  gold: '#D4A843',
  amber: '#F0C15A',
  paper: '#E8DCC8',
  rust: '#C4956A',
  signal: '#91B7FF',
  danger: '#CC4444'
};

function fillGradientRect(ctx, x, y, w, h, topColor, bottomColor) {
  var grad = ctx.createLinearGradient(0, y, 0, y + h);
  grad.addColorStop(0, topColor);
  grad.addColorStop(1, bottomColor);
  ctx.fillStyle = grad;
  ctx.fillRect(x, y, w, h);
}

function drawPixelPanel(ctx, x, y, w, h, title) {
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

function drawFilmGrain(ctx) {
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

function drawPrompt(ctx, text, x, y) {
  var t = Date.now() * 0.001;
  var alpha = 0.55 + Math.sin(t * 3) * 0.35;
  var tw = ctx.measureText(text).width + 24;
  ctx.fillStyle = 'rgba(10,11,18,0.78)';
  ctx.fillRect(x - tw / 2, y - 10, tw, 16);
  ctx.strokeStyle = 'rgba(212,168,67,' + alpha.toFixed(2) + ')';
  ctx.strokeRect(x - tw / 2 + 1, y - 9, tw - 2, 14);
  ctx.fillStyle = 'rgba(232,220,200,' + alpha.toFixed(2) + ')';
  ctx.fillText(text, x, y + 2);
}

function drawTitleLandscape(ctx, t) {
  fillGradientRect(ctx, 0, 0, CANVAS_W, CANVAS_H, '#060714', '#1A1C20');
  ctx.fillStyle = PALETTE.creamPaper;
  for (var i = 0; i < 70; i++) {
    var sx = (i * 97) % CANVAS_W;
    var sy = (i * 43 + Math.sin(t + i) * 2) % 118;
    var size = i % 11 === 0 ? 2 : 1;
    ctx.globalAlpha = 0.25 + (i % 5) * 0.12;
    ctx.fillRect(sx, sy, size, size);
  }
  ctx.globalAlpha = 1;

  ctx.fillStyle = 'rgba(120,150,255,0.12)';
  ctx.beginPath(); ctx.arc(210 + Math.sin(t * 0.7) * 12, 48, 34 + Math.sin(t * 1.7) * 7, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(232,240,255,0.82)';
  ctx.beginPath(); ctx.arc(210 + Math.sin(t * 0.7) * 12, 48, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(145,183,255,0.12)';
  ctx.beginPath();
  ctx.moveTo(198, 62);
  ctx.lineTo(170 + Math.sin(t) * 8, 168);
  ctx.lineTo(246 + Math.sin(t * 1.2) * 8, 168);
  ctx.lineTo(222, 62);
  ctx.fill();

  ctx.fillStyle = '#111824';
  ctx.beginPath();
  ctx.moveTo(0, 134); ctx.lineTo(45, 100); ctx.lineTo(105, 122); ctx.lineTo(162, 88);
  ctx.lineTo(232, 118); ctx.lineTo(295, 92); ctx.lineTo(400, 132); ctx.lineTo(400, 170); ctx.lineTo(0, 170); ctx.fill();
  ctx.fillStyle = '#17251E';
  ctx.fillRect(0, 150, CANVAS_W, 100);

  ctx.fillStyle = '#202735';
  ctx.fillRect(130, 110, 140, 54);
  ctx.fillStyle = '#4F3428';
  ctx.fillRect(122, 104, 156, 9);
  ctx.fillStyle = '#131722';
  ctx.fillRect(195, 70, 10, 42);
  ctx.fillStyle = '#4F3428';
  ctx.fillRect(188, 64, 24, 7);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.fillRect(150, 126, 8, 10);
  ctx.fillRect(240, 126, 8, 10);
  ctx.fillStyle = 'rgba(212,168,67,0.18)';
  ctx.fillRect(144, 120, 20, 22);
  ctx.fillRect(234, 120, 20, 22);

  for (var g = 0; g < 32; g++) {
    ctx.fillStyle = g % 2 === 0 ? '#21351F' : '#2B4426';
    ctx.fillRect(g * 13, 170 + (g % 3) * 4, 9, 80);
  }
  drawFilmGrain(ctx);
}

function drawObjectIcon(ctx, o) {
  var cx = Math.round(o.x + o.w / 2);
  var cy = Math.round(o.y + o.h / 2);
  var pulse = Math.sin(Date.now() * 0.005) * 0.25 + 0.55;
  ctx.fillStyle = 'rgba(212,168,67,' + (pulse * 0.22).toFixed(2) + ')';
  ctx.beginPath(); ctx.arc(cx, cy, 13, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(232,220,200,0.18)';
  ctx.beginPath(); ctx.arc(cx, cy, 7 + Math.sin(Date.now() * 0.006) * 2, 0, Math.PI * 2); ctx.fill();

  if (o.id === 'mappa_campi') {
    ctx.fillStyle = '#CDBB86'; ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.fillStyle = '#8B7355'; ctx.fillRect(o.x + 2, o.y + 3, o.w - 4, 1); ctx.fillRect(o.x + 4, o.y + 7, o.w - 6, 1);
    ctx.fillStyle = '#3D5A3C'; ctx.fillRect(o.x + 3, o.y + 9, 5, 3);
  } else if (o.id === 'lanterna_rotta') {
    ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(o.x + 3, o.y, 5, 7);
    ctx.fillStyle = PALETTE.alumGrey; ctx.fillRect(o.x, o.y + 7, 10, 2); ctx.fillRect(o.x + 9, o.y + 4, 3, 2);
    ctx.fillStyle = VISUAL.danger; ctx.fillRect(o.x + 1, o.y + 9, 2, 1); ctx.fillRect(o.x + 8, o.y + 9, 2, 1);
  } else if (o.id === 'registro_1861' || o.id === 'diario_enzo') {
    ctx.fillStyle = o.id === 'registro_1861' ? '#6B3F2A' : '#7A2323';
    ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(o.x + 3, o.y + 3, o.w - 6, 2);
    ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(o.x + 2, o.y, 2, o.h);
  } else if (o.id === 'lettera_censurata') {
    ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.fillStyle = '#1A1C20'; ctx.fillRect(o.x + 2, o.y + 3, o.w - 4, 2); ctx.fillRect(o.x + 2, o.y + 8, o.w - 7, 1);
    ctx.fillStyle = VISUAL.danger; ctx.fillRect(o.x + o.w - 5, o.y + 2, 3, 3);
  } else if (o.id === 'simboli_portone') {
    ctx.strokeStyle = VISUAL.signal; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, 8, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy, 4, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(cx - 1, cy - 8, 2, 16); ctx.fillRect(cx - 8, cy - 1, 16, 2);
  } else if (o.id === 'frammento') {
    ctx.fillStyle = '#C8D0DA'; ctx.fillRect(o.x + 1, o.y, 7, 3); ctx.fillRect(o.x, o.y + 3, 9, 3); ctx.fillRect(o.x + 2, o.y + 6, 5, 2);
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(o.x + 2, o.y + 1, 4, 1);
  } else if (o.id === 'tracce_circolari') {
    ctx.strokeStyle = PALETTE.lanternYel; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(cx, cy, 20, 10, 0, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.ellipse(cx, cy, 12, 6, 0, 0, Math.PI * 2); ctx.stroke();
  } else {
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.fillRect(cx - 4, cy - 4, 8, 8);
  }
  ctx.lineWidth = 1;
}

function getAreaShortName(areaId) {
  var names = {
    piazze: 'Piazza',
    chiesa: 'Chiesa',
    cimitero: 'Cimitero',
    giardini: 'Giardini',
    bar_exterior: 'Bar',
    residenziale: 'Case',
    industriale: 'Industria',
    polizia: 'Polizia'
  };
  return names[areaId] || areaId;
}

function drawArrow(ctx, dir, x, y) {
  ctx.beginPath();
  if (dir === 'up') {
    ctx.moveTo(x, y - 5); ctx.lineTo(x - 6, y + 4); ctx.lineTo(x + 6, y + 4);
  } else if (dir === 'down') {
    ctx.moveTo(x, y + 5); ctx.lineTo(x - 6, y - 4); ctx.lineTo(x + 6, y - 4);
  } else if (dir === 'left') {
    ctx.moveTo(x - 5, y); ctx.lineTo(x + 4, y - 6); ctx.lineTo(x + 4, y + 6);
  } else {
    ctx.moveTo(x + 5, y); ctx.lineTo(x - 4, y - 6); ctx.lineTo(x - 4, y + 6);
  }
  ctx.closePath();
  ctx.fill();
}

function renderAreaExitMarkers(ctx, area) {
  if (!area || !area.exits) return;
  var tick = Date.now() * 0.006;
  for (var i = 0; i < area.exits.length; i++) {
    var ex = area.exits[i];
    var mid = Math.round((ex.xRange[0] + ex.xRange[1]) / 2);
    var label = getAreaShortName(ex.to);
    var x = mid;
    var y = Math.max(area.walkableTop + 10, 112);
    var boxW = Math.max(44, label.length * 7 + 25);
    var alpha = 0.2 + Math.sin(tick + i) * 0.08;

    if (ex.dir === 'up') {
      ctx.fillStyle = 'rgba(212,168,67,' + alpha.toFixed(2) + ')';
      ctx.fillRect(ex.xRange[0], area.walkableTop - 2, ex.xRange[1] - ex.xRange[0], 8);
      y = area.walkableTop + 62;
    } else if (ex.dir === 'down') {
      ctx.fillStyle = 'rgba(212,168,67,' + alpha.toFixed(2) + ')';
      ctx.fillRect(ex.xRange[0], CANVAS_H - 10, ex.xRange[1] - ex.xRange[0], 10);
      y = CANVAS_H - 18;
    } else if (ex.dir === 'left') {
      x = 36;
      y = mid;
      ctx.fillStyle = 'rgba(212,168,67,' + alpha.toFixed(2) + ')';
      ctx.fillRect(0, ex.xRange[0], 10, ex.xRange[1] - ex.xRange[0]);
    } else {
      x = CANVAS_W - 36;
      y = mid;
      ctx.fillStyle = 'rgba(212,168,67,' + alpha.toFixed(2) + ')';
      ctx.fillRect(CANVAS_W - 10, ex.xRange[0], 10, ex.xRange[1] - ex.xRange[0]);
    }

    ctx.fillStyle = 'rgba(8,9,14,0.84)';
    ctx.fillRect(x - boxW / 2, y - 9, boxW, 18);
    ctx.strokeStyle = 'rgba(212,168,67,0.82)';
    ctx.strokeRect(x - boxW / 2 + 1, y - 8, boxW - 2, 16);
    ctx.fillStyle = PALETTE.lanternYel;
    drawArrow(ctx, ex.dir, x - boxW / 2 + 11, y);
    ctx.fillStyle = PALETTE.creamPaper;
    ctx.font = '7px "Courier New",monospace';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + 7, y + 3);
    ctx.textAlign = 'start';
  }
}

function renderMiniMap(ctx) {
  var nodes = {
    cimitero: { x: 45, y: 9 },
    chiesa: { x: 45, y: 24 },
    piazze: { x: 45, y: 44 },
    giardini: { x: 17, y: 44 },
    bar_exterior: { x: 73, y: 44 },
    residenziale: { x: 45, y: 64 },
    industriale: { x: 45, y: 84 },
    polizia: { x: 45, y: 101 }
  };
  var x = 8;
  var y = 8;
  var w = 90;
  var h = 116;
  var current = gameState.currentArea;
  drawPixelPanel(ctx, x, y, w, h, 'MAPPA');
  ctx.strokeStyle = 'rgba(160,168,176,0.36)';
  ctx.lineWidth = 1;
  drawMapLink(ctx, nodes, x, y, 'cimitero', 'chiesa');
  drawMapLink(ctx, nodes, x, y, 'chiesa', 'piazze');
  drawMapLink(ctx, nodes, x, y, 'piazze', 'giardini');
  drawMapLink(ctx, nodes, x, y, 'piazze', 'bar_exterior');
  drawMapLink(ctx, nodes, x, y, 'piazze', 'residenziale');
  drawMapLink(ctx, nodes, x, y, 'residenziale', 'industriale');
  drawMapLink(ctx, nodes, x, y, 'industriale', 'polizia');
  for (var id in nodes) {
    var n = nodes[id];
    var active = id === current;
    ctx.fillStyle = active ? PALETTE.lanternYel : 'rgba(232,220,200,0.82)';
    ctx.fillRect(x + n.x - 3, y + n.y - 3, 6, 6);
    if (active) {
      ctx.strokeStyle = 'rgba(212,168,67,0.9)';
      ctx.strokeRect(x + n.x - 5, y + n.y - 5, 10, 10);
    }
  }
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.font = '7px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText(getAreaShortName(current), x + w / 2, y + h - 8);
  ctx.textAlign = 'start';
}

function drawMapLink(ctx, nodes, ox, oy, a, b) {
  ctx.beginPath();
  ctx.moveTo(ox + nodes[a].x, oy + nodes[a].y);
  ctx.lineTo(ox + nodes[b].x, oy + nodes[b].y);
  ctx.stroke();
}

function render(ctx) {
  ctx.save();
  ctx.scale(2, 2);
  ctx.imageSmoothingEnabled = false;
  
  // Applica screen shake
  ScreenShake.apply(ctx);
  
  var ph = gameState.gamePhase;

  if (ph === 'title') { renderTitle(ctx); }
  else if (ph === 'prologue_cutscene') { renderPrologueCutscene(ctx); }
  else if (ph === 'intro') { renderIntroSlide(ctx); }
  else if (ph === 'prologue') { renderPrologue(ctx); }
  else if (ph === 'tutorial') { renderTutorial(ctx); }
  else if (ph === 'playing' || ph === 'dialogue' || ph === 'journal' || ph === 'inventory' || ph === 'deduction') {
    renderArea(ctx);
    renderPlayer(ctx);
    renderInteractionHint(ctx);
    // Effetti visivi avanzati
    LightingSystem.draw(ctx, gameState.player.x, gameState.player.y);
    ParticleSystem.draw(ctx);
    Vignette.draw(ctx, CANVAS_W, CANVAS_H);
    if (gameState.showMiniMap) renderMiniMap(ctx);
  }
  else if (ph === 'ending') { renderEndingScreen(ctx); }
  if (ph === 'customize') { renderTitle(ctx); } // Background durante customize
  if (gameState.fadeDir !== 0) renderFade(ctx);

  ctx.restore();
}

/** Prologo cutscene — Elena nel campo, luci, cerchi, frammento */
function renderPrologueCutscene(ctx) {
  var step = gameState.prologueStep;
  var t = gameState.prologueTimer * 0.016; // ~60fps timer

  // Step 0-1: campo notturno, erba ondulata
  if (step <= 1) {
    ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
    // Stelle
    ctx.fillStyle = PALETTE.creamPaper;
    [30,80,140,200,260,310,360,50,120,180,340,380].forEach(function(x,i){
      ctx.fillRect(x, 8+(i*23)%40, 1+((i*3)%2), 1+((i*7)%2));
    });
    // Luna
    ctx.fillStyle = PALETTE.lanternYel; ctx.beginPath(); ctx.arc(60,25,12,0,Math.PI*2); ctx.fill();
    // Montagne
    ctx.fillStyle = PALETTE.violetBlue;
    ctx.beginPath(); ctx.moveTo(0,80); ctx.lineTo(50,50); ctx.lineTo(130,65); ctx.lineTo(200,45);
    ctx.lineTo(300,60); ctx.lineTo(400,78); ctx.lineTo(400,90); ctx.lineTo(0,90); ctx.fill();
    // Terreno / erba (ondulata)
    ctx.fillStyle = PALETTE.oliveGreen;
    ctx.fillRect(0,95,CANVAS_W,155);
    // Erba alta ondulata (animazione)
    ctx.fillStyle = PALETTE.darkForest;
    for(var g=0; g<CANVAS_W; g+=6){
      var wave = Math.sin(g*0.05 + t*3) * 4;
      ctx.fillRect(g, 93+wave, 3, 20+Math.abs(wave));
    }
    // Sentiero
    ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(180,90,40,160);
  }

  // Step 2: luce dal terreno
  if (step >= 2) {
    // Aggiungi luce pulsante dal terreno
    var pulse = Math.sin(t * 4) * 0.3 + 0.7;
    var glowIntensity = Math.min(1, (step - 2) * 0.5 + pulse * 0.3);
    ctx.fillStyle = 'rgba(200,220,255,' + (glowIntensity * 0.6).toFixed(2) + ')';
    ctx.beginPath(); ctx.arc(200, 130, 50 + Math.sin(t*3) * 15, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,' + (glowIntensity * 0.8).toFixed(2) + ')';
    ctx.beginPath(); ctx.arc(200, 130, 20 + Math.sin(t*2) * 8, 0, Math.PI*2); ctx.fill();
    // Raggi di luce verso l'alto
    ctx.fillStyle = 'rgba(200,220,255,' + (glowIntensity * 0.3).toFixed(2) + ')';
    for(var r=0; r<8; r++){
      ctx.fillRect(198 + r*2, 70 + Math.sin(r+t*2)*5, 2, 60);
    }
  }

  // Step 4: 3 cerchi concentrici
  if (step >= 4) {
    var circleAlpha = Math.min(1, (step - 4) * 0.4 + Math.sin(t*2)*0.1);
    ctx.strokeStyle = 'rgba(212,168,67,' + circleAlpha.toFixed(2) + ')';
    ctx.lineWidth = 2;
    for(var c=0; c<3; c++){
      var radius = 15 + c * 18 + Math.sin(t*3 + c)*3;
      ctx.beginPath(); ctx.arc(200, 130, radius, 0, Math.PI*2); ctx.stroke();
    }
    ctx.lineWidth = 1;
    // Erba piegata dentro i cerchi
    ctx.fillStyle = PALETTE.oliveGreen + 'AA';
    for(var a=0; a<24; a++){
      var rad = a * Math.PI / 12;
      for(var r2=0; r2<3; r2++){
        var rv = 20 + r2 * 16;
        ctx.fillRect(198 + Math.cos(rad)*rv, 128 + Math.sin(rad)*rv, 3, 2);
      }
    }
  }

  // Step 5: Elena (sprite che corre)
  if (step >= 1 && step <= 5) {
    var elenaX = step >= 5 ? 200 : 50 + t * 20 % 150;
    var elenaY = 115;
    // Sprite di Elena (sagoma femminile semplice)
    ctx.fillStyle = 'rgba(0,0,0,0.3)'; ctx.fillRect(elenaX-3, elenaY+8, 7, 2);
    ctx.fillStyle = '#6B4E3D'; ctx.fillRect(elenaX-2, elenaY+4, 1, 5); ctx.fillRect(elenaX+1, elenaY+4, 1, 5); // gambe
    ctx.fillStyle = '#3D5A3C'; ctx.fillRect(elenaX-3, elenaY, 6, 5); // vestito
    ctx.fillStyle = '#D4A84B'; ctx.fillRect(elenaX-2, elenaY-6, 5, 6); // testa
    ctx.fillStyle = '#1A1C20'; ctx.fillRect(elenaX-1, elenaY-4, 1, 1); ctx.fillRect(elenaX+1, elenaY-4, 1, 1); // occhi
    // Lanterna
    ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(elenaX-6, elenaY-2, 3, 6);
    ctx.fillStyle = 'rgba(212,168,67,0.25)'; ctx.beginPath(); ctx.arc(elenaX-5, elenaY+1, 10, 0, Math.PI*2); ctx.fill();
  }

  // Step 6: raccoglie frammento
  if (step >= 6) {
    ctx.fillStyle = PALETTE.alumGrey; ctx.fillRect(196, 132, 6, 4);
    ctx.fillStyle = PALETTE.creamPaper + '88'; ctx.fillRect(197, 131, 4, 2);
  }

  // Step 7-8: schermo si illumina / fade to white
  if (step >= 7) {
    var flash = Math.min(1, (step - 7) * 0.4 + (gameState.prologueTimer - (step === 7 ? 60 : 0)) * 0.02);
    ctx.fillStyle = 'rgba(255,255,255,' + Math.min(0.9, flash).toFixed(2) + ')';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  }

  // Step 8: titolo su bianco
  if (step >= 8) {
    ctx.fillStyle = PALETTE.nightBlue;
    ctx.font = 'bold 20px "Courier New",monospace'; ctx.textAlign = 'center';
    ctx.fillText('LE LUCI DI SAN CELESTE', 200, 120);
    ctx.font = '11px "Courier New",monospace';
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillText('1979 — Un\'indagine della Prefettura', 200, 140);
    ctx.textAlign = 'start';
  }

  // Testo didascalico in basso
  if (step < 8) {
    var subtitles = [
      'San Celeste, 25 luglio 1979. Ore 23:40.',
      'Elena Bellandi corre tra l\'erba alta.',
      '',
      'Una luce si accende dal terreno... non dal cielo.',
      '',
      'Tre cerchi appaiono nel grano.',
      'Elena si ferma.',
      'Raccoglie un piccolo oggetto metallico.',
      'La luce diventa accecante.',
      ''
    ];
    var txt = subtitles[step] || '';
    if (txt) {
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(50, 210, 300, 22);
      ctx.fillStyle = PALETTE.creamPaper; ctx.font = '9px "Courier New",monospace'; ctx.textAlign = 'center';
      ctx.fillText(txt, 200, 226);
      ctx.textAlign = 'start';
    }
  }
  if (step === 8) {
    var alpha = 0.4 + Math.sin(Date.now()*0.003)*0.4;
    ctx.fillStyle = 'rgba(212,168,67,' + alpha.toFixed(2) + ')';
    ctx.font = '9px "Courier New",monospace'; ctx.textAlign = 'center';
    ctx.fillText('Attendi...', 200, 230);
    ctx.textAlign = 'start';
  }
}

function renderTitle(ctx) {
  var t = Date.now() * 0.001;
  drawTitleLandscape(ctx, t);
  drawPixelPanel(ctx, 34, 154, 332, 74, null);
  ctx.fillStyle = VISUAL.gold;
  ctx.font = 'bold 22px "Courier New",monospace'; ctx.textAlign = 'center';
  ctx.fillText('LE LUCI', 200, 180);
  ctx.fillStyle = VISUAL.paper;
  ctx.fillText('DI SAN CELESTE', 200, 200);
  ctx.fillStyle = PALETTE.burntOrange;
  ctx.font = '10px "Courier New",monospace';
  ctx.fillText('Italia Settentrionale / Estate 1978', 200, 216);
  drawPrompt(ctx, 'Premi ENTER per iniziare', 200, 238);
  ctx.textAlign = 'start';
}

function renderIntroSlide(ctx) {
  var slide = gameState.introSlide;
  var t = Date.now() * 0.001;
  drawTitleLandscape(ctx, t * 0.8);
  drawPixelPanel(ctx, 24, 54, 352, 178, 'DOSSIER PREFETTURA');

  var name = gameState.playerName || 'Detective Maurizio';
  var lines = [];

  if (slide === 0) {
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.font = 'bold 13px "Courier New",monospace'; ctx.textAlign = 'center';
    ctx.fillText('SAN CELESTE', 200, 82);
    ctx.fillText('28 LUGLIO 1978', 200, 98);
    lines = [
      '',
      'Un piccolo borgo tra Parma e Piacenza.',
      '800 anime, una piazza,',
      'un campanile, un bar.',
      '',
      'Da tre notti, strane luci appaiono',
      'nel cielo sopra i campi a nord.',
      '',
      'Non sono stelle. Non sono aerei.',
      '',
      'Il paese ha paura.'
    ];
  } else if (slide === 1) {
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.font = 'bold 13px "Courier New",monospace'; ctx.textAlign = 'center';
    ctx.fillText('LE SPARIZIONI', 200, 82);
    lines = [
      '',
      'Tre persone sono scomparse.',
      '',
      'Enzo Bellandi, 19 anni.',
      'Era uscito a guardare le luci.',
      '',
      'Sua nonna Teresa',
      'non dorme piu\' da tre giorni.',
      '',
      'La Prefettura di Parma',
      'ha mandato il suo miglior uomo.'
    ];
  } else if (slide === 2) {
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.font = 'bold 13px "Courier New",monospace'; ctx.textAlign = 'center';
    ctx.fillText('IL DETECTIVE', 200, 82);
    lines = [
      '',
      'Quell\'uomo sei tu,',
      name + '.',
      '',
      'Un detective pragmatico, razionale,',
      'con un debole per il caffe\'',
      'e un sesto senso per i misteri.',
      '',
      'Fuori ti aspettano',
      'la piazza, l\'archivio, la cascina.',
      '',
      'E il Campo delle Luci.'
    ];
  } else {
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.font = 'bold 13px "Courier New",monospace'; ctx.textAlign = 'center';
    ctx.fillText('L\'INCARICO', 200, 82);
    lines = [
      '',
      '"Detective ' + name + ',',
      'vada a San Celeste.',
      'Scopra cosa sta succedendo.',
      'E torni con delle risposte."',
      '',
      'Non sai ancora',
      'che quelle risposte',
      'ti cambieranno per sempre.',
      '',
      'Le luci sono tornate.',
      'Come nel 1861. Come nel 1961.',
      '',
      'La verita\' ti aspetta.'
    ];
  }

  ctx.font = '10px "Courier New",monospace';
  for (var i = 0; i < lines.length; i++) {
    var ln = lines[i];
    if (ln.indexOf('"') === 0 || ln === name.toUpperCase() || ln.indexOf(name) === 0) {
      ctx.fillStyle = PALETTE.lanternYel;
    } else {
      ctx.fillStyle = PALETTE.creamPaper;
    }
    if (ln === name.toUpperCase()) ctx.font = 'bold 10px "Courier New",monospace';
    else ctx.font = '10px "Courier New",monospace';
    ctx.fillText(ln, 200, 114 + i * 13);
  }

  ctx.font = '10px "Courier New",monospace';
  var prompt = slide < 2 ? 'Premi ENTER per continuare' : (slide === 2 ? 'Premi ENTER per personalizzare il detective' : 'Premi ENTER per iniziare');
  drawPrompt(ctx, prompt, 200, 222);
  ctx.textAlign = 'start';
}

function renderPrologue(ctx) { renderIntroSlide(ctx); }

function renderTutorial(ctx) {
  fillGradientRect(ctx, 0, 0, CANVAS_W, CANVAS_H, '#080A13', '#1B211C');
  drawFilmGrain(ctx);
  drawPixelPanel(ctx, 30, 15, 340, 220, 'TACCUINO OPERATIVO');
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
    ['N', 'Mostra / nascondi minimappa'],
    ['M', 'Musica ON / OFF'],
    ['ESC', 'Chiudi pannelli'],
    ['', ''],
    ['Obiettivo:', 'Scopri la verita\' dietro'],
    ['', 'le luci misteriose di San Celeste.']
  ];
  for (var i = 0; i < lines.length; i++) {
    if (lines[i][0] !== '') {
      ctx.fillStyle = 'rgba(212,168,67,0.18)';
      ctx.fillRect(54, 66 + i * 15, 86, 12);
    }
    ctx.fillStyle = PALETTE.lanternYel; ctx.fillText(lines[i][0], 60, 75 + i * 15);
    ctx.fillStyle = PALETTE.creamPaper;
    ctx.fillText(lines[i][1], 60 + ctx.measureText(lines[i][0]).width + 8, 75 + i * 15);
  }
  ctx.textAlign = 'center';
  drawPrompt(ctx, 'Premi ENTER per iniziare l\'indagine', 200, 230);
  ctx.textAlign = 'start';
}

function renderArea(ctx) {
  var area = areas[gameState.currentArea];
  area.draw(ctx);
  renderAreaExitMarkers(ctx, area);
  // Render NPCs
  for (var i = 0; i < area.npcs.length; i++) {
    var n = area.npcs[i];
    var npc = null;
    for (var j = 0; j < npcsData.length; j++) { if (npcsData[j].id === n.id) { npc = npcsData[j]; break; } }
    if (!npc) continue;
    
    // Draw shadow — anchored at sprite bottom (n.y)
    ctx.fillStyle = 'rgba(0,0,0,0.34)';
    ctx.beginPath();
    ctx.ellipse(n.x, n.y + 2, 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    
    var npcSheet = getOrCreateNPCSheet(npc.id || npc.name.toLowerCase().replace(/[^a-z]/g, ''));
    if (npcSheet) {
      var npcDir = n.facing || 'down';
      var npcFrame = (n.animFrame || 0) % 2;
      var npcDirIdx = {'down': 0, 'up': 1, 'left': 2, 'right': 3}[npcDir] || 0;
      var npcSrcX = npcFrame * 32;
      var npcSrcY = npcDirIdx * 32;
      ctx.drawImage(npcSheet, npcSrcX, npcSrcY, 32, 32,
                    Math.round(n.x - 16), Math.round(n.y - 32), 32, 32);
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
    ctx.textAlign = 'center'; ctx.fillText(npc.name, n.x, n.y - 33); ctx.textAlign = 'start';
  }
  // Render interactable objects
  var objs = areaObjects[gameState.currentArea] || [];
  for (var k = 0; k < objs.length; k++) {
    var o = objs[k];
    if (o.type === 'gatto') {
      ctx.fillStyle = 'rgba(0,0,0,0.28)'; ctx.fillRect(o.x - 1, o.y + o.h - 1, o.w + 3, 2);
      ctx.fillStyle = '#C4956A'; ctx.fillRect(o.x, o.y + 2, o.w, o.h - 2);
      ctx.fillStyle = '#D4A843'; ctx.fillRect(o.x + 1, o.y, 3, 3); ctx.fillRect(o.x + 5, o.y, 2, 3);
      ctx.fillStyle = '#1A1C20'; ctx.fillRect(o.x + 2, o.y + 2, 1, 1); ctx.fillRect(o.x + 5, o.y + 2, 1, 1);
      ctx.fillStyle = '#E8DCC8'; ctx.fillRect(o.x + 7, o.y + 3, 4, 1);
      continue;
    }
    if (o.type === 'radio') {
      var pulse = Math.sin(Date.now() * 0.006) * 0.3 + 0.5;
      ctx.fillStyle = 'rgba(212,168,67,' + pulse.toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(o.x + o.w/2, o.y + o.h/2, 13, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(o.x + 1, o.y + o.h, o.w, 3);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(o.x+2, o.y, o.w-4, o.h);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(o.x+5, o.y+3, 7, 5);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(o.x+14, o.y+3, 2, 2);
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(o.x+5, o.y-4, 1, 4); ctx.fillRect(o.x+6, o.y-6, 1, 2);
      continue;
    }
    if (o.type === 'recorder') {
      var rp = Math.sin(Date.now() * 0.005) * 0.25 + 0.55;
      ctx.fillStyle = 'rgba(145,183,255,' + (rp * 0.2).toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(o.x + o.w / 2, o.y + o.h / 2, 17, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(o.x + 2, o.y + o.h, o.w - 2, 3);
      ctx.fillStyle = '#2C313B'; ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.fillStyle = '#11141B'; ctx.fillRect(o.x + 3, o.y + 3, 8, 8); ctx.fillRect(o.x + 16, o.y + 3, 8, 8);
      ctx.fillStyle = PALETTE.alumGrey; ctx.fillRect(o.x + 5, o.y + 5, 4, 4); ctx.fillRect(o.x + 18, o.y + 5, 4, 4);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(o.x + 12, o.y + 11, 6, 2);
      continue;
    }
    if (gameState.cluesFound.indexOf(o.id) >= 0) continue;
    if (o.requires && gameState.cluesFound.indexOf(o.requires) < 0) continue;
    if (!o.drawHint) continue;
    drawObjectIcon(ctx, o);
  }
}

function renderPlayer(ctx) {
  var p = gameState.player;
  
  // === Update animation state ===
  if (p.x !== animState.lastX || p.y !== animState.lastY) {
    animState.isMoving = true;
    animState.lastX = p.x;
    animState.lastY = p.y;
  } else {
    animState.isMoving = false;
  }
  
  if (animState.isMoving) {
    animState.playerTimer++;
    if (animState.playerTimer % 8 === 0) { // Change frame every 8 ticks
      animState.playerFrame = (animState.playerFrame + 1) % 4;
    }
  } else {
    animState.playerFrame = 0; // Idle frame
  }
  
  // === Draw shadow first ===
  ctx.fillStyle = 'rgba(0,0,0,0.34)';
  ctx.beginPath();
  ctx.ellipse(p.x + 16, p.y + 16, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(212,168,67,0.10)';
  ctx.beginPath();
  ctx.ellipse(p.x + 16, p.y + 14, 16, 5, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // === Draw from sprite sheet ===
  var sheet = getOrCreatePlayerSheet();
  if (!sheet) return;
  
  var dirIndex = {'down': 0, 'up': 1, 'left': 2, 'right': 3}[p.dir] || 0;
  var srcX = animState.playerFrame * 32;
  var srcY = dirIndex * 32;
  
  ctx.drawImage(sheet, srcX, srcY, 32, 32,
                Math.round(p.x), Math.round(p.y - 16), 32, 32);
}

// === Legacy drawSprite (kept for fallback) ===
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
