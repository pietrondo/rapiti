var ctx;

export function gameLoop() {
  var ph = gameState.gamePhase;

  // Prologo auto-avanzamento
  if (ph === 'prologue_cutscene') {
    gameState.prologueTimer++;
    var adv = [150, 250, 150, 180, 200, 180, 150, 200, 120];
    if (
      gameState.prologueStep < adv.length &&
      gameState.prologueTimer >= adv[gameState.prologueStep]
    ) {
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
    checkAreaExits();
    checkInteractions();
    // Aggiorna sistemi effetti
    ParticleSystem.update();
    LightingSystem.update();
    ScreenShake.update();
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

export function rectCollision(x1, y1, w1, h1, x2, y2, w2, h2) {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
}

export function showToast(msg) {
  document.getElementById('toast').textContent = msg;
  document.getElementById('toast').classList.add('visible');
  gameState.messageTimer = 150;
}

export function updateHUD() {
  var area = areas[gameState.currentArea];
  document.getElementById('hud-area').textContent = area ? area.name : '???';
  document.getElementById('hud-clues').textContent =
    `${gameState.cluesFound.length}/${clues.length}`;
  var dedHint = document.getElementById('hud-ded-hint');
  if (canOpenDeduction()) {
    dedHint.style.display = 'inline';
  } else {
    dedHint.style.display = 'none';
  }
}

export function resetGame() {
  gameState.currentArea = 'piazze';
  gameState.gamePhase = 'title';
  gameState.previousPhase = null;
  gameState.player = { x: 195, y: 188, w: PLAYER_W, h: PLAYER_H, dir: 'down', frame: 0 };
  gameState.cluesFound = [];
  gameState.npcStates = { ruggeri: 0, teresa: 0, neri: 0, valli: 0, anselmo: 0, don_pietro: 0 };
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
  gameState.showMiniMap = true;
  // Clear sprite cache
  spriteCache.player = null;
  spriteCache.playerColors = null;
  spriteCache.npcs = {};
  // Reset area objects
  var reqs = {
    cimitero: [['frammento', 'simboli_portone']],
    chiesa: [['lettera_censurata', 'registro_1861']],
    giardini: [['tracce_circolari', 'diario_enzo']],
  };
  for (var ar in reqs) {
    for (var i = 0; i < reqs[ar].length; i++) {
      var obj = areaObjects[ar].find((o) => o.id === reqs[ar][i][0]);
      if (obj) obj.requires = reqs[ar][i][1];
    }
  }
  // Hide all overlays
  var overlays = [
    'ending-overlay',
    'dialogue-overlay',
    'journal-overlay',
    'inventory-overlay',
    'deduction-overlay',
    'customize-overlay',
  ];
  for (var o = 0; o < overlays.length; o++) {
    document.getElementById(overlays[o]).classList.remove('active');
  }
  // Reset StoryManager
  if (typeof StoryManager !== 'undefined') {
    StoryManager.reset();
  }
  updateHUD();
}

window.onload = () => {
  ctx = initCanvas();

  // Inizializza StoryManager
  if (typeof initStoryManager === 'function') {
    initStoryManager();
  }

  initAudio();
  initEventListeners();
  updateHUD();
  updateMuteButton();

  // Override collectClue: trigger finale dopo aver raccolto le tracce al Campo
  var origCollect = collectClue;
  collectClue = (obj) => {
    origCollect(obj);
    if (
      obj.id === 'tracce_circolari' &&
      gameState.puzzleSolved &&
      gameState.currentArea === 'giardini'
    ) {
      setTimeout(() => {
        triggerEnding();
      }, 2500);
    }
  };

  requestAnimationFrame(gameLoop);
};
