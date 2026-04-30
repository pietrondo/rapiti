export function handleKeyDown(e) {
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
    if (key === 'e' || key === 'E') {
      handleInteract();
      e.preventDefault();
    }
    if (key === 'j' || key === 'J') {
      openJournal();
      e.preventDefault();
    }
    if (key === 'i' || key === 'I') {
      openInventory();
      e.preventDefault();
    }
    if ((key === 't' || key === 'T') && canOpenDeduction()) {
      openDeduction();
      e.preventDefault();
    }
    if (key === 'n' || key === 'N') {
      gameState.showMiniMap = !gameState.showMiniMap;
      showToast(gameState.showMiniMap ? 'Minimappa visibile' : 'Minimappa nascosta');
      e.preventDefault();
    }
    if (key === 'm' || key === 'M') {
      toggleMusic();
      e.preventDefault();
    }
  }

  // Dialogue — ESC to close
  if (ph === 'dialogue') {
    if (key === 'Escape') {
      closeDialogue();
      e.preventDefault();
    }
  }

  // Journal / Inventory — ESC to close
  if (ph === 'journal' || ph === 'inventory') {
    if (key === 'Escape') {
      closePanels();
      e.preventDefault();
    }
  }

  // Deduction — ESC to close
  if (ph === 'deduction' && key === 'Escape') {
    closeDeduction();
    e.preventDefault();
  }
  if (ph === 'radio' && key === 'Escape') {
    closeRadioPuzzle();
    e.preventDefault();
  }
  if (ph === 'scene' && key === 'Escape') {
    closeScenePuzzle();
    e.preventDefault();
  }
  if (ph === 'recorder' && key === 'Escape') {
    closeRecorderPuzzle();
    e.preventDefault();
  }
}

export function handleKeyUp(e) {
  gameState.keys[e.key] = false;
}

/** Aggiorna la posizione del giocatore */
export function updatePlayerPosition() {
  var p = gameState.player;
  var dx = 0,
    dy = 0;
  var k = gameState.keys;
  if (k.w || k.W || k.ArrowUp) {
    dy = -PLAYER_SPEED;
    p.dir = 'up';
  }
  if (k.s || k.S || k.ArrowDown) {
    dy = PLAYER_SPEED;
    p.dir = 'down';
  }
  if (k.a || k.A || k.ArrowLeft) {
    dx = -PLAYER_SPEED;
    p.dir = 'left';
  }
  if (k.d || k.D || k.ArrowRight) {
    dx = PLAYER_SPEED;
    p.dir = 'right';
  }
  if (dx !== 0 && dy !== 0) {
    dx *= Math.SQRT1_2;
    dy *= Math.SQRT1_2;
  }
  var nx = p.x + dx,
    ny = p.y + dy;
  nx = Math.max(2, Math.min(CANVAS_W - p.w - 2, nx));
  ny = Math.max(2, Math.min(CANVAS_H - p.h - 2, ny));
  var area = areas[gameState.currentArea];
  // Blocca camminata in cielo (walkableTop)
  if (area.walkableTop && ny < area.walkableTop) ny = area.walkableTop;
  // Blocca collisioni edifici
  if (area.colliders) {
    for (var ci = 0; ci < area.colliders.length; ci++) {
      var col = area.colliders[ci];
      if (rectCollision(p.x, p.y, p.w, p.h, col.x, col.y, col.w, col.h)) {
        continue;
      }
      if (rectCollision(nx, ny, p.w, p.h, col.x, col.y, col.w, col.h)) {
        // Prova solo asse X
        if (!rectCollision(nx, p.y, p.w, p.h, col.x, col.y, col.w, col.h)) {
          ny = p.y;
        }
        // Prova solo asse Y
        else if (!rectCollision(p.x, ny, p.w, p.h, col.x, col.y, col.w, col.h)) {
          nx = p.x;
        } else {
          nx = p.x;
          ny = p.y;
        }
        break;
      }
    }
  }
  // Collisioni NPC
  for (var i = 0; i < area.npcs.length; i++) {
    var npc = area.npcs[i];
    if (rectCollision(nx, ny, p.w, p.h, npc.x - 6, npc.y - 6, 12, 18)) {
      nx = p.x;
      ny = p.y;
      break;
    }
  }
  p.x = nx;
  p.y = ny;
  if (dx !== 0 || dy !== 0) p.frame = (p.frame + 0.15) % 4;
}

export function checkInteractions() {
  var p = gameState.player;
  var px = p.x + p.w / 2,
    py = p.y + p.h / 2;
  var area = areas[gameState.currentArea];
  if (area.exits) {
    for (var ei = 0; ei < area.exits.length; ei++) {
      var ex = area.exits[ei];
      if (ex.requiresPuzzle) continue;
      if (
        ex.dir === 'up' &&
        px >= ex.xRange[0] &&
        px <= ex.xRange[1] &&
        py <= (area.walkableTop || 0) + 72
      ) {
        gameState.interactionTarget = {
          type: 'door',
          obj: { toArea: ex.to, toSpawnX: ex.spawnX, toSpawnY: ex.spawnY },
        };
        return;
      }
      if (ex.dir === 'down' && px >= ex.xRange[0] && px <= ex.xRange[1] && py >= CANVAS_H - 34) {
        gameState.interactionTarget = {
          type: 'door',
          obj: { toArea: ex.to, toSpawnX: ex.spawnX, toSpawnY: ex.spawnY },
        };
        return;
      }
      if (ex.dir === 'left' && py >= ex.xRange[0] && py <= ex.xRange[1] && px <= 34) {
        gameState.interactionTarget = {
          type: 'door',
          obj: { toArea: ex.to, toSpawnX: ex.spawnX, toSpawnY: ex.spawnY },
        };
        return;
      }
      if (ex.dir === 'right' && py >= ex.xRange[0] && py <= ex.xRange[1] && px >= CANVAS_W - 34) {
        gameState.interactionTarget = {
          type: 'door',
          obj: { toArea: ex.to, toSpawnX: ex.spawnX, toSpawnY: ex.spawnY },
        };
        return;
      }
    }
  }
  // NPC detection
  for (var i = 0; i < area.npcs.length; i++) {
    var n = area.npcs[i];
    if (Math.abs(px - n.x) < 20 && Math.abs(py - n.y) < 20) {
      gameState.interactionTarget = { type: 'npc', id: n.id };
      return;
    }
  }
  // Objects detection
  var objs = areaObjects[gameState.currentArea] || [];
  for (var j = 0; j < objs.length; j++) {
    var o = objs[j];
    if (o.type === 'scene') {
      if (rectCollision(px - 8, py - 8, 16, 16, o.x - 4, o.y - 4, o.w + 8, o.h + 8)) {
        gameState.interactionTarget = { type: 'scene', obj: o };
        return;
      }
      continue;
    }
    if (o.type === 'recorder') {
      if (rectCollision(px - 8, py - 8, 16, 16, o.x - 4, o.y - 4, o.w + 8, o.h + 8)) {
        gameState.interactionTarget = { type: 'recorder', obj: o };
        return;
      }
      continue;
    }
    if (o.type === 'door') {
      if (rectCollision(px - 8, py - 8, 16, 16, o.x - 4, o.y - 4, o.w + 8, o.h + 8)) {
        gameState.interactionTarget = { type: 'door', obj: o };
        return;
      }
      continue;
    }
    if (o.type === 'radio') {
      if (rectCollision(px - 8, py - 8, 16, 16, o.x - 4, o.y - 4, o.w + 8, o.h + 8)) {
        gameState.interactionTarget = { type: 'radio', obj: o };
        return;
      }
      continue;
    }
    if (o.type === 'gatto') {
      if (rectCollision(px - 8, py - 8, 16, 16, o.x - 4, o.y - 4, o.w + 8, o.h + 8)) {
        gameState.interactionTarget = { type: 'gatto' };
        return;
      }
      continue;
    }
    if (gameState.cluesFound.indexOf(o.id) >= 0) continue;
    if (o.requires && gameState.cluesFound.indexOf(o.requires) < 0) continue;
    if (rectCollision(px - 8, py - 8, 16, 16, o.x - 4, o.y - 4, o.w + 8, o.h + 8)) {
      gameState.interactionTarget = { type: 'object', obj: o };
      return;
    }
  }
  gameState.interactionTarget = null;
}

export function handleInteract() {
  var t = gameState.interactionTarget;
  if (!t) return;
  if (t.type === 'npc') {
    startDialogue(t.id);
  } else if (t.type === 'object') {
    collectClue(t.obj);
  } else if (t.type === 'door') {
    changeArea(t.obj.toArea, t.obj.toSpawnX, t.obj.toSpawnY);
  } else if (t.type === 'radio') {
    openRadioPuzzle();
  } else if (t.type === 'recorder') {
    openRecorderPuzzle();
  } else if (t.type === 'scene') {
    collectClue(t.obj);
    if (gameState.cluesFound.filter((c) => c.indexOf('scena_') === 0).length >= 3)
      openScenePuzzle();
  } else if (t.type === 'gatto') {
    showToast('Miao. (Il gatto ti ignora con eleganza.)');
  }
}

export function collectClue(obj) {
  if (gameState.cluesFound.indexOf(obj.id) >= 0) return;
  gameState.cluesFound.push(obj.id);

  // Notifica StoryManager
  if (typeof StoryManager !== 'undefined') {
    StoryManager.onClueFound(obj.id);
  }

  updateHUD();
  var c = cluesMap[obj.id];
  showToast(`Hai raccolto: ${c.name}`);
  // Effetti visivi quando si raccoglie un indizio
  var px = gameState.player.x + gameState.player.w / 2;
  var py = gameState.player.y + gameState.player.h / 2;
  ParticleSystem.createSparkles(px, py);
  ScreenShake.shake(2, 8);
  updateNPCStates();
}

export function updateNPCStates() {
  var cf = gameState.cluesFound;
  var ns = gameState.npcStates;
  if (cf.indexOf('simboli_portone') >= 0 && ns.teresa < 1) ns.teresa = 1;
  if (cf.indexOf('registro_1861') >= 0 && ns.neri < 1) ns.neri = 1;
  if (cf.indexOf('lettera_censurata') >= 0 && ns.ruggeri < 1) ns.ruggeri = 1;
  if (cf.indexOf('frammento') >= 0 && ns.valli < 1) ns.valli = 1;
  if (cf.indexOf('radio_audio') >= 0 && ns.anselmo < 1) ns.anselmo = 1;
  if (gameState.puzzleSolved) {
    for (var k in ns) {
      ns[k] = 2;
    }
  }
}

export function openJournal() {
  if (gameState.gamePhase !== 'playing') return;
  gameState.previousPhase = 'playing';
  gameState.gamePhase = 'journal';
  var content = document.getElementById('journal-content');
  content.innerHTML = '';
  for (var i = 0; i < clues.length; i++) {
    var c = clues[i];
    var found = gameState.cluesFound.indexOf(c.id) >= 0;
    var div = document.createElement('div');
    div.className = `clue-item${found ? ' found' : ''}`;
    div.innerHTML =
      '<strong>' +
      (found ? '✓ ' : '? ') +
      c.name +
      '</strong>' +
      '<div class="clue-status">' +
      (found ? 'RACCOLTO' : 'Non ancora trovato') +
      '</div>' +
      (found ? `<div style="margin-top:4px;font-size:12px;color:#a0a8b0">${c.desc}</div>` : '');
    content.appendChild(div);
  }
  document.getElementById('journal-overlay').classList.add('active');
}

export function closeJournal() {
  document.getElementById('journal-overlay').classList.remove('active');
  gameState.gamePhase = 'playing';
}

export function openInventory() {
  if (gameState.gamePhase !== 'playing') return;
  gameState.previousPhase = 'playing';
  gameState.gamePhase = 'inventory';
  var content = document.getElementById('inventory-content');
  content.innerHTML = '';
  var foundClues = clues.filter((c) => gameState.cluesFound.indexOf(c.id) >= 0);
  if (foundClues.length === 0) {
    content.innerHTML = '<p style="color:#6b7b6b;text-align:center">Nessun oggetto raccolto.</p>';
  } else {
    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:8px';
    for (var i = 0; i < foundClues.length; i++) {
      var item = document.createElement('div');
      item.style.cssText =
        'background:#2d3047;border:1px solid #d4a843;padding:8px;text-align:center;font-size:11px';
      item.textContent = foundClues[i].name;
      grid.appendChild(item);
    }
    content.appendChild(grid);
  }
  document.getElementById('inventory-overlay').classList.add('active');
}

export function closeInventory() {
  document.getElementById('inventory-overlay').classList.remove('active');
  gameState.gamePhase = 'playing';
}

export function closePanels() {
  if (gameState.gamePhase === 'journal') closeJournal();
  if (gameState.gamePhase === 'inventory') closeInventory();
}
