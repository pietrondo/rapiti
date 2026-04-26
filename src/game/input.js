"use strict";

/* ══════════════════════════════════════════════════════════════
   SEZIONE 5: INPUT
   ══════════════════════════════════════════════════════════════ */

function handleKeyDown(e) {
  var ph = gameState.gamePhase;
  var key = e.key;

  // Fasi cinematiche
  if (ph === 'title' && key === 'Enter') {
    openCustomize();
    return;
  }
  if (ph === 'prologue' && key === 'Enter') {
    gameState.gamePhase = 'tutorial';
    gameState.previousPhase = 'prologue';
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
