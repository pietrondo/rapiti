"use strict";

/* ══════════════════════════════════════════════════════════════
   SEZIONE 12: GAME LOOP
   ══════════════════════════════════════════════════════════════ */

var ctx;

function gameLoop() {
  var ph = gameState.gamePhase;
  if (ph === 'playing') {
    updatePlayerPosition();
    checkAreaExits();
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
