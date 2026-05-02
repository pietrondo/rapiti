export function checkAreaExits() {
  if (window.gameState.fadeDir !== 0) return;
  var p = window.gameState.player;
  var area = window.areas[window.gameState.currentArea];
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
      p.y >= window.CANVAS_H - p.h - 2 &&
      p.x >= ex.xRange[0] &&
      p.x <= ex.xRange[1]
    )
      triggered = true;
    if (ex.dir === 'left' && p.x <= 2 && p.y >= ex.xRange[0] && p.y <= ex.xRange[1])
      triggered = true;
    if (
      ex.dir === 'right' &&
      p.x >= window.CANVAS_W - p.w - 2 &&
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
  window.gameState.fadeDir = 1;
  window.gameState.fadeCallback = () => {
    window.gameState.currentArea = areaId;
    window.gameState.player.x = spawnX;
    window.gameState.player.y = spawnY;

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
    window.updateHUD();
    window.gameState.fadeDir = -1;
    window.gameState.fadeCallback = () => {
      window.gameState.fadeDir = 0;
      window.gameState.fadeCallback = null;
    };
  };
}

export function updateFade() {
  if (window.gameState.fadeDir === 1) {
    window.gameState.fadeAlpha += 4;
    if (window.gameState.fadeAlpha >= 100) {
      window.gameState.fadeAlpha = 100;
      if (window.gameState.fadeCallback) window.gameState.fadeCallback();
    }
  } else if (window.gameState.fadeDir === -1) {
    window.gameState.fadeAlpha -= 4;
    if (window.gameState.fadeAlpha <= 0) {
      window.gameState.fadeAlpha = 0;
      window.gameState.fadeDir = 0;
      if (window.gameState.fadeCallback) window.gameState.fadeCallback();
    }
  }
}

/** Stub — HUD update is handled by individual game state changes */
export function updateHUD() {
  var areaEl = document.getElementById('hud-area');
  if (areaEl) areaEl.textContent = window.gameState.currentArea;
  var cluesEl = document.getElementById('hud-clues');
  if (cluesEl) cluesEl.textContent = window.gameState.cluesFound.length + '/9';
}

// Global exports for dynamic module loading compatibility
if (typeof window !== 'undefined') {
  window.updateHUD = updateHUD;
  window.checkAreaExits = checkAreaExits;
  window.changeArea = changeArea;
  window.updateFade = updateFade;
}
