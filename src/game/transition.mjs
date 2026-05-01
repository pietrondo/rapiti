export function checkAreaExits() {
  if (gameState.fadeDir !== 0) return;
  var p = gameState.player;
  var area = areas[gameState.currentArea];
  for (var i = 0; i < area.exits.length; i++) {
    var ex = area.exits[i];
    if (ex.requiresPuzzle) continue;
    var triggered = false;
    if (
      ex.dir === 'up' &&
      p.y <= (area.walkableTop || 2) + 2 &&
      p.x >= ex.xRange[0] &&
      p.x <= ex.xRange[1]
    )
      triggered = true;
    if (
      ex.dir === 'down' &&
      p.y >= CANVAS_H - p.h - 2 &&
      p.x >= ex.xRange[0] &&
      p.x <= ex.xRange[1]
    )
      triggered = true;
    if (ex.dir === 'left' && p.x <= 2 && p.y >= ex.xRange[0] && p.y <= ex.xRange[1])
      triggered = true;
    if (
      ex.dir === 'right' &&
      p.x >= CANVAS_W - p.w - 2 &&
      p.y >= ex.xRange[0] &&
      p.y <= ex.xRange[1]
    )
      triggered = true;
    if (triggered) {
      changeArea(ex.to, ex.spawnX, ex.spawnY);
      return;
    }
  }
}

export function changeArea(areaId, spawnX, spawnY) {
  gameState.fadeDir = 1;
  gameState.fadeCallback = () => {
    gameState.currentArea = areaId;
    gameState.player.x = spawnX;
    gameState.player.y = spawnY;

    // Notifica StoryManager
    if (typeof StoryManager !== 'undefined') {
      StoryManager.onAreaVisited(areaId);
    }

    // Inizializza effetti per la nuova area
    ParticleSystem.clear();
    LightingSystem.setupAreaLights(areaId);
    if (areaId === 'giardini' || areaId === 'piazze' || areaId === 'residenziale') {
      ParticleSystem.createFireflies(spawnX, spawnY);
    } else if (areaId === 'chiesa' || areaId === 'cimitero' || areaId === 'polizia') {
      ParticleSystem.createDust(spawnX, spawnY);
    }
    updateHUD();
    gameState.fadeDir = -1;
    gameState.fadeCallback = () => {
      gameState.fadeDir = 0;
      gameState.fadeCallback = null;
    };
  };
}

export function updateFade() {
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

/** Stub — HUD update is handled by individual game state changes */
export function updateHUD() {
  var areaEl = document.getElementById('hud-area');
  if (areaEl) areaEl.textContent = gameState.currentArea;
  var cluesEl = document.getElementById('hud-clues');
  if (cluesEl) cluesEl.textContent = gameState.cluesFound.length + '/9';
}
