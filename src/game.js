"use strict";

/* ══════════════════════════════════════════════════════════════
   SEZIONE 4: INIZIALIZZAZIONE
   ══════════════════════════════════════════════════════════════ */

function initCanvas() {
  var c = document.getElementById('gameCanvas');
  c.width = CANVAS_W * 2; c.height = CANVAS_H * 2;
  return c.getContext('2d');
}

function initEventListeners() {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);
  document.getElementById('journal-close').addEventListener('click', closeJournal);
  document.getElementById('inventory-close').addEventListener('click', closeInventory);
  document.getElementById('deduction-close').addEventListener('click', closeDeduction);
  document.getElementById('deduction-confirm').addEventListener('click', checkDeduction);
  document.getElementById('radio-close').addEventListener('click', closeRadioPuzzle);
  document.getElementById('customize-start').addEventListener('click', applyCustomization);
  setupColorSwatches('coat-colors', 'body');
  setupColorSwatches('detail-colors', 'detail');
  setupDragDrop();
  setupRadio();
}

/** Collega i click dei color-swatch al gameState.playerColors */
function setupColorSwatches(containerId, colorKey) {
  var container = document.getElementById(containerId);
  if (!container) return;
  container.addEventListener('click', function(e) {
    var swatch = e.target.closest('.color-swatch');
    if (!swatch) return;
    // Deselect all
    var all = container.querySelectorAll('.color-swatch');
    for (var i = 0; i < all.length; i++) { all[i].classList.remove('selected'); }
    swatch.classList.add('selected');
    gameState.playerColors[colorKey] = swatch.getAttribute('data-color');
    renderCustomizePreview();
  });
}

/* ══════════════════════════════════════════════════════════════
   SEZIONE 4B: AUDIO
   ══════════════════════════════════════════════════════════════ */

var bgMusic;

function initAudio() {
  bgMusic = document.getElementById('bg-music');
  bgMusic.volume = 0.35;
}

function startMusic() {
  if (!bgMusic) return;
  var playPromise = bgMusic.play();
  if (playPromise !== undefined) {
    playPromise.catch(function() {
      // Autoplay blocked — will start on next user interaction
    });
  }
  updateMuteButton();
}

function toggleMusic() {
  gameState.musicEnabled = !gameState.musicEnabled;
  if (!bgMusic) return;
  if (gameState.musicEnabled) {
    bgMusic.play().catch(function(){});
  } else {
    bgMusic.pause();
  }
  updateMuteButton();
}

function updateMuteButton() {
  var btn = document.getElementById('mute-btn');
  if (!btn) return;
  btn.textContent = gameState.musicEnabled ? '\uD83D\uDD0A' : '\uD83D\uDD07'; // 🔊 : 🔇
  if (!gameState.musicEnabled) btn.classList.add('muted');
  else btn.classList.remove('muted');
}

/* ══════════════════════════════════════════════════════════════
   SEZIONE 4C: CUSTOMIZZAZIONE PERSONAGGIO
   ══════════════════════════════════════════════════════════════ */

function openCustomize() {
  gameState.gamePhase = 'customize';
  document.getElementById('custom-name').value = gameState.playerName;
  updateCustomizeSwatches();
  renderCustomizePreview();
  document.getElementById('customize-overlay').classList.add('active');
}

function updateCustomizeSwatches() {
  var containers = { 'coat-colors': 'body', 'detail-colors': 'detail' };
  for (var cid in containers) {
    var key = containers[cid];
    var container = document.getElementById(cid);
    if (!container) continue;
    var swatches = container.querySelectorAll('.color-swatch');
    for (var i = 0; i < swatches.length; i++) {
      var s = swatches[i];
      if (s.getAttribute('data-color') === gameState.playerColors[key]) {
        s.classList.add('selected');
      } else {
        s.classList.remove('selected');
      }
    }
  }
}

function applyCustomization() {
  var nameInput = document.getElementById('custom-name');
  var name = nameInput.value.trim();
  if (!name) name = 'Detective Maurizio';
  gameState.playerName = name;
  document.getElementById('customize-overlay').classList.remove('active');
  gameState.gamePhase = 'intro';
  gameState.introSlide = 3; // ultima slide narrativa
  startMusic();
}

function renderCustomizePreview() {
  var pv = document.getElementById('previewCanvas');
  if (!pv) return;
  var pctx = pv.getContext('2d');
  pctx.clearRect(0, 0, 48, 56);
  pctx.imageSmoothingEnabled = false;
  var s = 1;
  var cx = 24, cy = 28;
  var colors = gameState.playerColors;
  // Shadow
  pctx.fillStyle = 'rgba(0,0,0,0.3)'; pctx.fillRect(cx - 4*s, cy + 8*s, 8*s, 3*s);
  // Legs
  pctx.fillStyle = colors.legs;
  pctx.fillRect(cx - 3*s, cy + 4*s, 2*s, 5*s); pctx.fillRect(cx + 1*s, cy + 4*s, 2*s, 5*s);
  // Shoes
  pctx.fillStyle = '#1A1C20';
  pctx.fillRect(cx - 4*s, cy + 8*s, 3*s, 2*s); pctx.fillRect(cx + 1*s, cy + 8*s, 3*s, 2*s);
  // Body
  pctx.fillStyle = colors.body; pctx.fillRect(cx - 4*s, cy - s, 8*s, 6*s);
  // Detail
  pctx.fillStyle = colors.detail; pctx.fillRect(cx + 2*s, cy - s, 2*s, 6*s);
  // Head
  pctx.fillStyle = colors.head; pctx.fillRect(cx - 3*s, cy - 7*s, 6*s, 7*s);
  // Eyes
  pctx.fillStyle = '#1A1C20';
  pctx.fillRect(cx + 1*s, cy - 5*s, 2*s, 2*s); pctx.fillRect(cx + 3*s, cy - 5*s, 2*s, 2*s);
  // Hat
  pctx.fillStyle = colors.detail;
  pctx.fillRect(cx - 4*s, cy - 9*s, 9*s, 2*s); pctx.fillRect(cx - 3*s, cy - 10*s, 7*s, 2*s);
}

/* ══════════════════════════════════════════════════════════════
   SEZIONE 5: INPUT
   ══════════════════════════════════════════════════════════════ */

function handleKeyDown(e) {
  var ph = gameState.gamePhase;
  var key = e.key;

  // Fasi cinematiche
  if (ph === 'title' && key === 'Enter') {
    gameState.gamePhase = 'prologue_cutscene';
    gameState.prologueStep = 0;
    gameState.prologueTimer = 0;
    return;
  }
  if (ph === 'prologue_cutscene' && key === 'Enter') {
    // Skip cutscene
    gameState.gamePhase = 'intro';
    gameState.introSlide = 0;
    return;
  }
  if (ph === 'intro' && key === 'Enter') {
    if (gameState.introSlide >= 3) {
      gameState.gamePhase = 'tutorial';
      return;
    }
    gameState.introSlide++;
    if (gameState.introSlide >= 2) {
      openCustomize();
    }
    return;
  }
  if (ph === 'prologue' && key === 'Enter') {
    gameState.gamePhase = 'tutorial';
    return;
  }
  if (ph === 'tutorial' && key === 'Enter') {
    gameState.gamePhase = 'playing';
    updateHUD();
    return;
  }
  if (ph === 'ending' && key === 'Enter') {
    resetGame();
    return;
  }

  // Playing — multiplayer keys
  if (ph === 'playing') {
    gameState.keys[key] = true;
    if (key === 'e' || key === 'E') { handleInteract(); e.preventDefault(); }
    if (key === 'j' || key === 'J') { openJournal(); e.preventDefault(); }
    if (key === 'i' || key === 'I') { openInventory(); e.preventDefault(); }
    if ((key === 't' || key === 'T') && canOpenDeduction()) { openDeduction(); e.preventDefault(); }
    if (key === 'm' || key === 'M') { toggleMusic(); e.preventDefault(); }
  }

  // Dialogue — ESC to close
  if (ph === 'dialogue') {
    if (key === 'Escape') { closeDialogue(); e.preventDefault(); }
  }

  // Journal / Inventory — ESC to close
  if (ph === 'journal' || ph === 'inventory') {
    if (key === 'Escape') { closePanels(); e.preventDefault(); }
  }

  // Deduction — ESC to close
  if (ph === 'deduction' && key === 'Escape') {
    closeDeduction(); e.preventDefault();
  }
  if (ph === 'radio' && key === 'Escape') {
    closeRadioPuzzle(); e.preventDefault();
  }
}

function handleKeyUp(e) {
  gameState.keys[e.key] = false;
}

/** Aggiorna la posizione del giocatore */
function updatePlayerPosition() {
  var p = gameState.player;
  var dx = 0, dy = 0;
  var k = gameState.keys;
  if (k['w'] || k['W'] || k['ArrowUp'])    { dy = -PLAYER_SPEED; p.dir = 'up'; }
  if (k['s'] || k['S'] || k['ArrowDown'])  { dy = PLAYER_SPEED;  p.dir = 'down'; }
  if (k['a'] || k['A'] || k['ArrowLeft'])  { dx = -PLAYER_SPEED; p.dir = 'left'; }
  if (k['d'] || k['D'] || k['ArrowRight']) { dx = PLAYER_SPEED;  p.dir = 'right'; }
  if (dx !== 0 && dy !== 0) { dx *= 0.707; dy *= 0.707; }
  var nx = p.x + dx, ny = p.y + dy;
  nx = Math.max(2, Math.min(CANVAS_W - p.w - 2, nx));
  ny = Math.max(2, Math.min(CANVAS_H - p.h - 2, ny));
  var area = areas[gameState.currentArea];
  // Blocca camminata in cielo (walkableTop)
  if (area.walkableTop && ny < area.walkableTop) ny = area.walkableTop;
  // Blocca collisioni edifici
  if (area.colliders) {
    for (var ci = 0; ci < area.colliders.length; ci++) {
      var col = area.colliders[ci];
      if (rectCollision(nx, ny, p.w, p.h, col.x, col.y, col.w, col.h)) {
        // Prova solo asse X
        if (!rectCollision(nx, p.y, p.w, p.h, col.x, col.y, col.w, col.h)) { ny = p.y; }
        // Prova solo asse Y
        else if (!rectCollision(p.x, ny, p.w, p.h, col.x, col.y, col.w, col.h)) { nx = p.x; }
        else { nx = p.x; ny = p.y; }
        break;
      }
    }
  }
  // Collisioni NPC
  for (var i = 0; i < area.npcs.length; i++) {
    var npc = area.npcs[i];
    if (rectCollision(nx, ny, p.w, p.h, npc.x - 6, npc.y - 6, 12, 18)) { nx = p.x; ny = p.y; break; }
  }
  p.x = nx; p.y = ny;
  if (dx !== 0 || dy !== 0) p.frame = (p.frame + 0.15) % 4;
}

function checkInteractions() {
  var p = gameState.player;
  var px = p.x + p.w / 2, py = p.y + p.h / 2;
  var area = areas[gameState.currentArea];
  // NPC detection
  for (var i = 0; i < area.npcs.length; i++) {
    var n = area.npcs[i];
    if (Math.abs(px - n.x) < 20 && Math.abs(py - n.y) < 20) {
      gameState.interactionTarget = { type: 'npc', id: n.id }; return;
    }
  }
  // Objects detection
  var objs = areaObjects[gameState.currentArea] || [];
  for (var j = 0; j < objs.length; j++) {
    var o = objs[j];
    if (o.type === 'door') {
      if (rectCollision(px - 8, py - 8, 16, 16, o.x - 4, o.y - 4, o.w + 8, o.h + 8)) {
        gameState.interactionTarget = { type: 'door', obj: o }; return;
      }
      continue;
    }
    if (o.type === 'radio') {
      if (rectCollision(px - 8, py - 8, 16, 16, o.x - 4, o.y - 4, o.w + 8, o.h + 8)) {
        gameState.interactionTarget = { type: 'radio', obj: o }; return;
      }
      continue;
    }
    if (o.type === 'gatto') {
      if (rectCollision(px - 8, py - 8, 16, 16, o.x - 4, o.y - 4, o.w + 8, o.h + 8)) {
        gameState.interactionTarget = { type: 'gatto' }; return;
      }
      continue;
    }
    if (gameState.cluesFound.indexOf(o.id) >= 0) continue;
    if (o.requires && gameState.cluesFound.indexOf(o.requires) < 0) continue;
    if (rectCollision(px - 8, py - 8, 16, 16, o.x - 4, o.y - 4, o.w + 8, o.h + 8)) {
      gameState.interactionTarget = { type: 'object', obj: o }; return;
    }
  }
  gameState.interactionTarget = null;
}

function handleInteract() {
  var t = gameState.interactionTarget;
  if (!t) return;
  if (t.type === 'npc') { startDialogue(t.id); }
  else if (t.type === 'object') { collectClue(t.obj); }
  else if (t.type === 'door') { changeArea(t.obj.toArea, t.obj.toSpawnX, t.obj.toSpawnY); }
  else if (t.type === 'radio') { openRadioPuzzle(); }
  else if (t.type === 'gatto') { showToast('Miao. (Il gatto ti ignora con eleganza.)'); }
}

function collectClue(obj) {
  if (gameState.cluesFound.indexOf(obj.id) >= 0) return;
  gameState.cluesFound.push(obj.id);
  updateHUD();
  var c = cluesMap[obj.id];
  showToast('Hai raccolto: ' + c.name);
  updateNPCStates();
}

function updateNPCStates() {
  var cf = gameState.cluesFound;
  var ns = gameState.npcStates;
  if (cf.indexOf('simboli_portone') >= 0 && ns.teresa < 1) ns.teresa = 1;
  if (cf.indexOf('registro_1861') >= 0 && ns.neri < 1) ns.neri = 1;
  if (cf.indexOf('lettera_censurata') >= 0 && ns.ruggeri < 1) ns.ruggeri = 1;
  if (cf.indexOf('frammento') >= 0 && ns.valli < 1) ns.valli = 1;
  if (gameState.puzzleSolved) {
    for (var k in ns) { ns[k] = 2; }
  }
}

/* ══════════════════════════════════════════════════════════════
   SEZIONE 6: RENDERING
   ══════════════════════════════════════════════════════════════ */

function render(ctx) {
  ctx.save();
  ctx.scale(2, 2);
  ctx.imageSmoothingEnabled = false;
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

function renderIntroSlide(ctx) {
  var slide = gameState.introSlide;
  ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Stelle fisse di sfondo
  ctx.fillStyle = PALETTE.creamPaper + '44';
  [30,80,140,200,260,310,360,50,120,180,340,380,95,220,290,160,70,350].forEach(function(x,i){
    ctx.fillRect(x, 10+(i*27)%55, 1+((i*3)%2), 1+((i*7)%2));
  });

  // Luci animate sempre visibili
  var t = Date.now() * 0.001;
  ctx.fillStyle = PALETTE.lanternYel + '33';
  ctx.beginPath(); ctx.arc(200, 30, 16 + Math.sin(t * 2) * 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = PALETTE.lanternYel + '22';
  ctx.beginPath(); ctx.arc(140, 45, 10 + Math.sin(t * 1.5 + 1) * 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(260, 40, 12 + Math.sin(t * 1.8 + 2) * 3, 0, Math.PI * 2); ctx.fill();

  // Pannello narrativo
  ctx.fillStyle = 'rgba(26,28,32,0.85)'; ctx.fillRect(25, 60, 350, 170);
  ctx.strokeStyle = PALETTE.lanternYel; ctx.lineWidth = 2; ctx.strokeRect(25, 60, 350, 170);
  ctx.lineWidth = 1;

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

  // Prompt ENTER
  var alpha = 0.4 + Math.sin(Date.now() * 0.003) * 0.4;
  ctx.fillStyle = 'rgba(212,168,67,' + alpha.toFixed(2) + ')';
  ctx.font = '10px "Courier New",monospace';
  var prompt = slide < 2 ? 'Premi ENTER per continuare' : (slide === 2 ? 'Premi ENTER per personalizzare il detective' : 'Premi ENTER per iniziare');
  ctx.fillText(prompt, 200, 222);
  ctx.textAlign = 'start';
}

function renderPrologue(ctx) { renderIntroSlide(ctx); }

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
      ctx.fillStyle = '#C4956A'; ctx.fillRect(o.x, o.y, o.w, o.h);
      ctx.fillStyle = '#D4A843'; ctx.fillRect(o.x + 1, o.y, 3, 2);
      ctx.fillStyle = '#1A1C20'; ctx.fillRect(o.x + 2, o.y + 1, 1, 1); ctx.fillRect(o.x + 5, o.y + 1, 1, 1);
      continue;
    }
    if (o.type === 'radio') {
      var pulse = Math.sin(Date.now() * 0.006) * 0.3 + 0.5;
      ctx.fillStyle = 'rgba(212,168,67,' + pulse.toFixed(2) + ')';
      ctx.beginPath(); ctx.arc(o.x + o.w/2, o.y + o.h/2, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(o.x+2, o.y, o.w-4, o.h);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(o.x+4, o.y+2, 2, 2);
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
  else if (t.type === 'door') label = 'Entra / Esci';
  else if (t.type === 'radio') label = 'Accendi Radio';
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

/* ══════════════════════════════════════════════════════════════
   SEZIONE 7: DIALOGHI
   ══════════════════════════════════════════════════════════════ */

function startDialogue(npcId) {
  gameState.dialogueNpcId = npcId;
  gameState.previousPhase = gameState.gamePhase;
  gameState.gamePhase = 'dialogue';
  // Osvaldo e Gino hanno solo stato 0
  if (npcId === 'osvaldo' || npcId === 'gino') {
    gameState.dialogueTree = dialogueNodes[npcId + '_s0'];
  } else {
    var state = gameState.npcStates[npcId];
    var nodeKey = npcId + '_s' + state;
    var node = dialogueNodes[nodeKey];
    if (!node) node = dialogueNodes[npcId + '_s0'];
    gameState.dialogueTree = node;
  }
  renderDialogueHTML();
  document.getElementById('dialogue-overlay').classList.add('active');
}

function renderDialogueHTML() {
  var node = gameState.dialogueTree;
  if (!node) {
    document.getElementById('dialogue-overlay').classList.remove('active');
    gameState.gamePhase = gameState.previousPhase || 'playing';
    return;
  }
  var npcId = gameState.dialogueNpcId;
  var npcData = npcsData.find(function(n) { return n.id === npcId; });
  var npcName = npcData ? npcData.name : '???';
  document.getElementById('dialogue-npc-name').textContent = npcName;
  document.getElementById('dialogue-text').textContent = node.text;
  var choicesDiv = document.getElementById('dialogue-choices');
  choicesDiv.innerHTML = '';
  if (node.choices && node.choices.length > 0) {
    for (var i = 0; i < node.choices.length; i++) {
      var ch = node.choices[i];
      var btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = (i + 1) + '. ' + ch.text;
      btn.addEventListener('click', (function(idx) {
        return function() { selectDialogueChoice(idx); };
      })(i));
      choicesDiv.appendChild(btn);
    }
  } else {
    var closeBtn = document.createElement('button');
    closeBtn.className = 'choice-btn';
    closeBtn.textContent = '[Continua]';
    closeBtn.addEventListener('click', closeDialogue);
    choicesDiv.appendChild(closeBtn);
  }
}

function selectDialogueChoice(index) {
  var node = gameState.dialogueTree;
  if (!node || !node.choices || index >= node.choices.length) return;
  var ch = node.choices[index];
  if (ch.effect) applyDialogueEffect(ch.effect);
  if (ch.next) {
    var nextNode = dialogueNodes[ch.next];
    if (nextNode) {
      if (nextNode.effect) applyDialogueEffect(nextNode.effect);
      gameState.dialogueTree = nextNode;
      renderDialogueHTML();
      return;
    }
  }
  closeDialogue();
}

function applyDialogueEffect(effect) {
  if (effect.hint && effect.hint === 'archivio') { dialogueEffects.hint_archivio(); }
  if (effect.giveClue) {
    var cid = effect.giveClue;
    if (gameState.cluesFound.indexOf(cid) === -1) {
      gameState.cluesFound.push(cid);
      var action = cid === 'frammento' ? 'give_frammento' : cid === 'lettera_censurata' ? 'give_lettera' : null;
      if (action && dialogueEffects[action]) dialogueEffects[action]();
      else { updateHUD(); showToast('Hai raccolto: ' + cluesMap[cid].name); }
    }
  }
  if (effect.giveClueHint) {
    if (effect.giveClueHint === 'diario_enzo') dialogueEffects.hint_diario_enzo();
    if (effect.giveClueHint === 'mappa_campi') dialogueEffects.hint_mappa();
  }
  updateNPCStates();
}

function closeDialogue() {
  document.getElementById('dialogue-overlay').classList.remove('active');
  gameState.gamePhase = gameState.previousPhase || 'playing';
  gameState.dialogueNpcId = null;
  gameState.dialogueTree = null;
}

/* ══════════════════════════════════════════════════════════════
   SEZIONE 8: DIARIO E INVENTARIO
   ══════════════════════════════════════════════════════════════ */

function openJournal() {
  if (gameState.gamePhase !== 'playing') return;
  gameState.previousPhase = 'playing';
  gameState.gamePhase = 'journal';
  var content = document.getElementById('journal-content');
  content.innerHTML = '';
  for (var i = 0; i < clues.length; i++) {
    var c = clues[i];
    var found = gameState.cluesFound.indexOf(c.id) >= 0;
    var div = document.createElement('div');
    div.className = 'clue-item' + (found ? ' found' : '');
    div.innerHTML = '<strong>' + (found ? '✓ ' : '? ') + c.name + '</strong>' +
      '<div class="clue-status">' + (found ? 'RACCOLTO' : 'Non ancora trovato') + '</div>' +
      (found ? '<div style="margin-top:4px;font-size:12px;color:#a0a8b0">' + c.desc + '</div>' : '');
    content.appendChild(div);
  }
  document.getElementById('journal-overlay').classList.add('active');
}

function closeJournal() {
  document.getElementById('journal-overlay').classList.remove('active');
  gameState.gamePhase = 'playing';
}

function openInventory() {
  if (gameState.gamePhase !== 'playing') return;
  gameState.previousPhase = 'playing';
  gameState.gamePhase = 'inventory';
  var content = document.getElementById('inventory-content');
  content.innerHTML = '';
  var foundClues = clues.filter(function(c) { return gameState.cluesFound.indexOf(c.id) >= 0; });
  if (foundClues.length === 0) {
    content.innerHTML = '<p style="color:#6b7b6b;text-align:center">Nessun oggetto raccolto.</p>';
  } else {
    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:8px';
    for (var i = 0; i < foundClues.length; i++) {
      var item = document.createElement('div');
      item.style.cssText = 'background:#2d3047;border:1px solid #d4a843;padding:8px;text-align:center;font-size:11px';
      item.textContent = foundClues[i].name;
      grid.appendChild(item);
    }
    content.appendChild(grid);
  }
  document.getElementById('inventory-overlay').classList.add('active');
}

function closeInventory() {
  document.getElementById('inventory-overlay').classList.remove('active');
  gameState.gamePhase = 'playing';
}

function closePanels() {
  if (gameState.gamePhase === 'journal') closeJournal();
  if (gameState.gamePhase === 'inventory') closeInventory();
}

/* ══════════════════════════════════════════════════════════════
   SEZIONE 9: DEDUZIONE (ENIGMA)
   ══════════════════════════════════════════════════════════════ */

function canOpenDeduction() {
  var needed = ['registro_1861', 'mappa_campi', 'tracce_circolari'];
  for (var i = 0; i < needed.length; i++) {
    if (gameState.cluesFound.indexOf(needed[i]) < 0) return false;
  }
  return !gameState.puzzleSolved;
}

function openDeduction() {
  gameState.previousPhase = 'playing';
  gameState.gamePhase = 'deduction';
  var cluesDiv = document.getElementById('deduction-clues');
  cluesDiv.innerHTML = '';
  var keyClues = ['registro_1861', 'mappa_campi', 'tracce_circolari'];
  for (var i = 0; i < keyClues.length; i++) {
    var c = cluesMap[keyClues[i]];
    var el = document.createElement('div');
    el.className = 'draggable-clue';
    el.textContent = c.name;
    el.draggable = true;
    el.setAttribute('data-clue-id', c.id);
    el.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', e.target.getAttribute('data-clue-id'));
    });
    cluesDiv.appendChild(el);
  }
  var slots = document.querySelectorAll('.deduction-slot');
  for (var s = 0; s < slots.length; s++) {
    var label = slots[s].getAttribute('data-slot') === 'posizione' ? 'Posizione' :
      slots[s].getAttribute('data-slot') === 'data' ? 'Data / Cronologia' : 'Prova fisica';
    slots[s].innerHTML = label;
    slots[s].classList.remove('filled');
    slots[s].removeAttribute('data-placed-clue');
  }
  document.getElementById('deduction-confirm').disabled = true;
  document.getElementById('deduction-overlay').classList.add('active');
}

function closeDeduction() {
  document.getElementById('deduction-overlay').classList.remove('active');
  gameState.gamePhase = 'playing';
}

function setupDragDrop() {
  var slots = document.querySelectorAll('.deduction-slot');
  for (var i = 0; i < slots.length; i++) {
    var slot = slots[i];
    slot.addEventListener('dragover', function(e) {
      e.preventDefault();
      var s = e.target.closest('.deduction-slot');
      if (s) s.classList.add('drag-over');
    });
    slot.addEventListener('dragleave', function(e) {
      var s = e.target.closest('.deduction-slot');
      if (s) s.classList.remove('drag-over');
    });
    slot.addEventListener('drop', function(e) {
      e.preventDefault();
      var s = e.target.closest('.deduction-slot');
      if (!s) return;
      s.classList.remove('drag-over');
      var clueId = e.dataTransfer.getData('text/plain');
      if (!clueId) return;
      var allSlots = document.querySelectorAll('.deduction-slot');
      for (var j = 0; j < allSlots.length; j++) {
        if (allSlots[j].getAttribute('data-placed-clue') === clueId) {
          allSlots[j].removeAttribute('data-placed-clue');
          allSlots[j].classList.remove('filled');
          var lbl = allSlots[j].getAttribute('data-slot') === 'posizione' ? 'Posizione' :
            allSlots[j].getAttribute('data-slot') === 'data' ? 'Data / Cronologia' : 'Prova fisica';
          allSlots[j].innerHTML = lbl;
        }
      }
      if (s.getAttribute('data-placed-clue')) {
        var oldId = s.getAttribute('data-placed-clue');
        s.removeAttribute('data-placed-clue');
      }
      var c = cluesMap[clueId];
      s.setAttribute('data-placed-clue', clueId);
      s.classList.add('filled');
      s.innerHTML = '✓ ' + c.name;
      updateDeductionConfirmButton();
    });
  }
}

function updateDeductionConfirmButton() {
  var slots = document.querySelectorAll('.deduction-slot');
  var allFilled = true;
  for (var i = 0; i < slots.length; i++) {
    if (!slots[i].getAttribute('data-placed-clue')) { allFilled = false; break; }
  }
  document.getElementById('deduction-confirm').disabled = !allFilled;
}

function checkDeduction() {
  var solution = { posizione: 'mappa_campi', data: 'registro_1861', prova: 'tracce_circolari' };
  var slots = document.querySelectorAll('.deduction-slot');
  var correct = true;
  for (var i = 0; i < slots.length; i++) {
    var slotType = slots[i].getAttribute('data-slot');
    var placed = slots[i].getAttribute('data-placed-clue');
    if (placed !== solution[slotType]) { correct = false; break; }
  }
  gameState.puzzleAttempts++;
  if (correct) {
    gameState.puzzleSolved = true;
    document.getElementById('deduction-overlay').classList.remove('active');
    gameState.gamePhase = 'playing';
    updateNPCStates();
    showToast('Ipotesi confermata! Torna al Campo delle Luci per la verifica finale.');
    updateHUD();
  } else {
    showToast('Ipotesi errata. Riprova a collegare gli indizi.');
    if (gameState.puzzleAttempts >= 3) {
      showToast('Suggerimento: parlane con l\'Archivista Neri.');
    }
  }
}

/* ══════════════════════════════════════════════════════════════
   SEZIONE 9B: RADIO PUZZLE
   ══════════════════════════════════════════════════════════════ */

function openRadioPuzzle() {
  if (gameState.gamePhase !== 'playing') return;
  gameState.previousPhase = 'playing';
  gameState.gamePhase = 'radio';
  gameState.radioFrequency = 0;
  updateRadioKnob(0);
  document.getElementById('radio-message').textContent = '';
  document.getElementById('radio-overlay').classList.add('active');
}

function closeRadioPuzzle() {
  document.getElementById('radio-overlay').classList.remove('active');
  gameState.gamePhase = 'playing';
}

function setupRadio() {
  var bar = document.getElementById('radio-bar');
  var knob = document.getElementById('radio-knob');
  if (!bar || !knob) return;
  var dragging = false;

  var moveKnob = function(clientX) {
    var rect = bar.getBoundingClientRect();
    var pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
    updateRadioKnob(pct);
  };

  bar.addEventListener('mousedown', function(e) { dragging = true; moveKnob(e.clientX); });
  document.addEventListener('mousemove', function(e) { if (dragging) moveKnob(e.clientX); });
  document.addEventListener('mouseup', function() { dragging = false; });
  // Touch support
  bar.addEventListener('touchstart', function(e) { dragging = true; moveKnob(e.touches[0].clientX); });
  document.addEventListener('touchmove', function(e) { if (dragging) moveKnob(e.touches[0].clientX); });
  document.addEventListener('touchend', function() { dragging = false; });
}

function updateRadioKnob(pct) {
  gameState.radioFrequency = pct;
  var knob = document.getElementById('radio-knob');
  var fill = document.getElementById('radio-fill');
  if (!knob) return;
  knob.style.left = pct + '%';
  if (fill) fill.style.width = pct + '%';
  document.getElementById('radio-value').textContent = (pct / 10).toFixed(1);

  // Status: 0-69 static, 70-74 interference, 75+ clear
  var statusEl = document.getElementById('radio-status');
  var target = gameState.radioTarget;
  var dist = Math.abs(pct - target);

  if (dist < 3) {
    statusEl.textContent = '🟢 Segnale chiaro';
    statusEl.className = 'radio-status clear';
    if (!gameState.radioSolved) {
      gameState.radioSolved = true;
      document.getElementById('radio-message').textContent = '"...non guardare... quando si ferma..."';
      document.getElementById('radio-message').className = 'radio-message-found';
      // Aggiungi indizio audio al diario
      if (gameState.cluesFound.indexOf('radio_audio') === -1) {
        gameState.cluesFound.push('radio_audio');
        updateHUD();
        setTimeout(function() { showToast('Registrazione radio salvata nel diario.'); }, 600);
      }
    }
  } else if (dist < 10) {
    statusEl.textContent = '🟡 Interferenza';
    statusEl.className = 'radio-status interference';
  } else {
    statusEl.textContent = '🔴 Statico';
    statusEl.className = 'radio-status static';
  }
}

/* ══════════════════════════════════════════════════════════════
   SEZIONE 10: AREE E TRANSIZIONI
   ══════════════════════════════════════════════════════════════ */

function checkAreaExits() {
  if (gameState.fadeDir !== 0) return;
  var p = gameState.player;
  var area = areas[gameState.currentArea];
  for (var i = 0; i < area.exits.length; i++) {
    var ex = area.exits[i];
    if (ex.requiresPuzzle) continue;
    var triggered = false;
    if (ex.dir === 'up' && p.y <= 2 && p.x >= ex.xRange[0] && p.x <= ex.xRange[1]) triggered = true;
    if (ex.dir === 'down' && p.y >= CANVAS_H - p.h - 2 && p.x >= ex.xRange[0] && p.x <= ex.xRange[1]) triggered = true;
    if (ex.dir === 'left' && p.x <= 2 && p.y >= ex.xRange[0] && p.y <= ex.xRange[1]) triggered = true;
    if (ex.dir === 'right' && p.x >= CANVAS_W - p.w - 2 && p.y >= ex.xRange[0] && p.y <= ex.xRange[1]) triggered = true;
    if (triggered) { changeArea(ex.to, ex.spawnX, ex.spawnY); return; }
  }
}

function changeArea(areaId, spawnX, spawnY) {
  gameState.fadeDir = 1;
  gameState.fadeCallback = function() {
    gameState.currentArea = areaId;
    gameState.player.x = spawnX;
    gameState.player.y = spawnY;
    updateHUD();
    gameState.fadeDir = -1;
    gameState.fadeCallback = function() { gameState.fadeDir = 0; gameState.fadeCallback = null; };
  };
}

function updateFade() {
  if (gameState.fadeDir === 1) {
    gameState.fadeAlpha += 4;
    if (gameState.fadeAlpha >= 100) {
      gameState.fadeAlpha = 100;
      if (gameState.fadeCallback) gameState.fadeCallback();
    }
  } else if (gameState.fadeDir === -1) {
    gameState.fadeAlpha -= 4;
    if (gameState.fadeAlpha <= 0) {
      gameState.fadeAlpha = 0;
      gameState.fadeDir = 0;
      if (gameState.fadeCallback) gameState.fadeCallback();
    }
  }
}

/* ══════════════════════════════════════════════════════════════
   SEZIONE 11: FINALI
   ══════════════════════════════════════════════════════════════ */

function determineEnding() {
  var cf = gameState.cluesFound;
  var alienScore = 0, humanScore = 0;
  var alienClues = ['registro_1861', 'mappa_campi', 'frammento', 'simboli_portone', 'tracce_circolari'];
  var humanClues = ['lettera_censurata', 'lanterna_rotta', 'diario_enzo'];
  for (var i = 0; i < alienClues.length; i++) { if (cf.indexOf(alienClues[i]) >= 0) alienScore++; }
  for (var j = 0; j < humanClues.length; j++) { if (cf.indexOf(humanClues[j]) >= 0) humanScore++; }
  if (cf.length < 3) return 'ambiguous';
  if (alienScore > humanScore) return 'alien';
  if (humanScore > alienScore) return 'human';
  return 'ambiguous';
}

function triggerEnding() {
  gameState.endingType = determineEnding();
  gameState.previousPhase = gameState.gamePhase;
  gameState.gamePhase = 'ending';
  showEndingOverlay();
}

function showEndingOverlay() {
  var et = gameState.endingType;
  var name = gameState.playerName || 'Maurizio';
  var endings = {
    alien: {
      title: 'Finale: Loro Sono Tornati',
      text: 'Il cielo si illumina. Luci silenziose scendono sul campo. Le tracce circolari pulsano di una luce azzurra. Il frammento metallico nella tua tasca vibra, sempre più forte.\n\n' +
        'Il ciclo di 116 anni è reale. Nel 1861 come nel 1978, entità non umane visitano San Celeste. I simboli sulla cascina sono il loro messaggio. Le persone scomparse non sono morte — sono state "raccolte".\n\n' +
        'Tra le luci vedi una figura familiare: Enzo, il nipote di Teresa. Sorride. Ti guarda. Poi svanisce. Le luci si allontanano nel cielo, lasciando il campo nel silenzio.\n\n' +
        '"Non posso spiegare razionalmente ciò che ho visto. Allego prove fisiche. La Prefettura valuti."\n' +
        '— ' + name + '\n\n' +
        'Mentre chiudi il taccuino, il frammento metallico smette di vibrare. È caldo, adesso. Forse per la prima volta.'
    },
    human: {
      title: 'Finale: Esperimento SIRIO',
      text: 'Al campo trovi detriti meccanici. Non sono alieni. Sono droni sperimentali. Progetto SIRIO, Aeronautica Militare, testato in segreto dal 1961.\n\n' +
        'La lettera censurata è la prova definitiva. Il Capitano Valli confessa: era una guardia del perimetro. Le persone scomparse? Contadini che si sono avvicinati troppo, "ricollocati" con nuove identità.\n\n' +
        'La lanterna rotta è di un drone precipitato. Il diario di Enzo parla di "uomini in tuta scura", non alieni. Il Ministero della Difesa ha usato la superstizione popolare come copertura per testare velivoli sperimentali sui civili ignari.\n\n' +
        '"Esperimenti militari non autorizzati su territorio civile. Coinvolgo la magistratura. Il caso San Celeste non è un mistero — è un crimine."\n' +
        '— ' + name
    },
    ambiguous: {
      title: 'Finale: Rapporto Incompleto',
      text: 'Arrivi al campo. Vedi qualcosa — forse luci, forse riflessi di lampioni lontani sulle nuvole basse. Non puoi determinare cosa sia.\n\n' +
        'Forse gas di palude, come dice Neri. Forse un fenomeno atmosferico raro. Forse altro.\n\n' +
        'Non hai elementi sufficienti. Scrivi il rapporto: "Caso n. 78-034. Raccomando ulteriori indagini." Il caso viene archiviato.\n\n' +
        'Mentre lasci San Celeste, guardi il cielo e ti chiedi: e se fossero davvero loro? E se tornassero?\n\n' +
        'Sul fascicolo, un timbro: "Riapertura prevista — 2093."\n' +
        '— ' + name + '\n\n' +
        'Forse Osvaldo aveva ragione. Forse erano i bergamaschi.'
    }
  };
  var e = endings[et];
  document.getElementById('ending-title').textContent = e.title;
  document.getElementById('ending-text').innerHTML = e.text.replace(/\n/g, '<br>');
  document.getElementById('ending-overlay').classList.add('active');
}

/* ══════════════════════════════════════════════════════════════
   SEZIONE 12: GAME LOOP
   ══════════════════════════════════════════════════════════════ */

var ctx;

function gameLoop() {
  var ph = gameState.gamePhase;

  // Prologo auto-avanzamento
  if (ph === 'prologue_cutscene') {
    gameState.prologueTimer++;
    var adv = [150, 250, 150, 180, 200, 180, 150, 200, 120];
    if (gameState.prologueStep < adv.length && gameState.prologueTimer >= adv[gameState.prologueStep]) {
      gameState.prologueTimer = 0;
      gameState.prologueStep++;
      if (gameState.prologueStep >= 9) {
        gameState.gamePhase = 'intro';
        gameState.introSlide = 0;
      }
    }
  }

  if (ph === 'playing') {
    updatePlayerPosition();
    checkInteractions();
  }
  updateFade();
  if (gameState.messageTimer > 0) {
    gameState.messageTimer--;
    if (gameState.messageTimer <= 0) {
      document.getElementById('toast').classList.remove('visible');
    }
  }
  render(ctx);
  requestAnimationFrame(gameLoop);
}

/* ══════════════════════════════════════════════════════════════
   SEZIONE 13: UTILITY
   ══════════════════════════════════════════════════════════════ */

function rectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

function showToast(msg) {
  document.getElementById('toast').textContent = msg;
  document.getElementById('toast').classList.add('visible');
  gameState.messageTimer = 150;
}

function updateHUD() {
  var area = areas[gameState.currentArea];
  document.getElementById('hud-area').textContent = area ? area.name : '???';
  document.getElementById('hud-clues').textContent = gameState.cluesFound.length + '/8';
  var dedHint = document.getElementById('hud-ded-hint');
  if (canOpenDeduction()) { dedHint.style.display = 'inline'; }
  else { dedHint.style.display = 'none'; }
}

function resetGame() {
  gameState.currentArea = 'piazza';
  gameState.gamePhase = 'title';
  gameState.previousPhase = null;
  gameState.player = { x: 195, y: 125, w: PLAYER_W, h: PLAYER_H, dir: 'down', frame: 0 };
  gameState.cluesFound = [];
  gameState.npcStates = { ruggeri: 0, teresa: 0, neri: 0, valli: 0 };
  gameState.puzzleSolved = false;
  gameState.puzzleAttempts = 0;
  gameState.endingType = null;
  gameState.keys = {};
  gameState.dialogueNpcId = null;
  gameState.message = '';
  gameState.messageTimer = 0;
  gameState.fadeAlpha = 0;
  gameState.fadeDir = 0;
  gameState.fadeCallback = null;
  // Reset area objects
  var reqs = {
    cascina: [['frammento', 'simboli_portone'], ['diario_enzo', 'frammento']],
    archivio: [['lettera_censurata', 'registro_1861']],
    campo: [['tracce_circolari', 'mappa_campi']]
  };
  for (var ar in reqs) {
    for (var i = 0; i < reqs[ar].length; i++) {
      var obj = areaObjects[ar].find(function(o) { return o.id === reqs[ar][i][0]; });
      if (obj) obj.requires = reqs[ar][i][1];
    }
  }
  // Hide all overlays
  var overlays = ['ending-overlay', 'dialogue-overlay', 'journal-overlay', 'inventory-overlay', 'deduction-overlay', 'customize-overlay'];
  for (var o = 0; o < overlays.length; o++) {
    document.getElementById(overlays[o]).classList.remove('active');
  }
  updateHUD();
}

/* ══════════════════════════════════════════════════════════════
   SEZIONE 14: AVVIO
   ══════════════════════════════════════════════════════════════ */

window.onload = function() {
  ctx = initCanvas();
  initAudio();
  initEventListeners();
  updateHUD();
  updateMuteButton();
  // Override collectClue: trigger finale dopo aver raccolto le tracce al Campo
  var origCollect = collectClue;
  collectClue = function(obj) {
    origCollect(obj);
    if (obj.id === 'tracce_circolari' && gameState.puzzleSolved && gameState.currentArea === 'campo') {
      setTimeout(function() { triggerEnding(); }, 2500);
    }
  };
  requestAnimationFrame(gameLoop);
};
