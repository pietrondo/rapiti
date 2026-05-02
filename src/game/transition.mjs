export function checkAreaExits() {
  if (window.gameState.fadeDir !== 0) return;
  var p = window.gameState.player;
  var area = window.areas[window.gameState.currentArea];
  if (!area || !area.exits) return;

  for (var i = 0; i < area.exits.length; i++) {
    var ex = area.exits[i];
    // Skip if it needs interaction (handled by handleInteract) or puzzle
    if (ex.requiresInteract || ex.requiresPuzzle) continue;
    
    var triggered = false;
    if (ex.dir === 'up' && p.y <= (area.walkableTop || 2) + 2 && p.x >= ex.xRange[0] && p.x <= ex.xRange[1]) triggered = true;
    if (ex.dir === 'down' && p.y >= window.CANVAS_H - p.h - 2 && p.x >= ex.xRange[0] && p.x <= ex.xRange[1]) triggered = true;
    if (ex.dir === 'left' && p.x <= 2 && p.y >= ex.xRange[0] && p.y <= ex.xRange[1]) triggered = true;
    if (ex.dir === 'right' && p.x >= window.CANVAS_W - p.w - 2 && p.y >= ex.xRange[0] && p.y <= ex.xRange[1]) triggered = true;
    
    if (triggered) {
      console.log(`[Transition] Auto-exit triggered to ${ex.to} at pos ${p.x},${p.y}`);
      if (window.changeArea) window.changeArea(ex.to, ex.spawnX, ex.spawnY);
      else changeArea(ex.to, ex.spawnX, ex.spawnY);
      return;
    }
  }
}

/** Triggera un'uscita manuale (es. via tasto E) */
export function triggerInteractExit() {
  var p = window.gameState.player;
  var area = window.areas[window.gameState.currentArea];
  if (!area || !area.exits) return false;

  console.log(`[Transition] Manual interaction check at ${p.x},${p.y} in ${window.gameState.currentArea}`);

  for (var i = 0; i < area.exits.length; i++) {
    var ex = area.exits[i];
    if (!ex.requiresInteract) continue;

    // Check vicinanza in base alla direzione
    if (ex.dir === 'up' || ex.dir === 'down') {
       if (p.x >= ex.xRange[0] && p.x <= ex.xRange[1]) {
          if (ex.dir === 'up' && p.y <= (area.walkableTop || 0) + 15) {
             console.log(`[Transition] Manual exit UP to ${ex.to}`);
             if (window.changeArea) window.changeArea(ex.to, ex.spawnX, ex.spawnY);
             else changeArea(ex.to, ex.spawnX, ex.spawnY);
             return true;
          }
          if (ex.dir === 'down' && p.y >= window.CANVAS_H - p.h - 15) {
             console.log(`[Transition] Manual exit DOWN to ${ex.to}`);
             if (window.changeArea) window.changeArea(ex.to, ex.spawnX, ex.spawnY);
             else changeArea(ex.to, ex.spawnX, ex.spawnY);
             return true;
          }
       }
    } else { // left o right
       if (p.y >= ex.xRange[0] && p.y <= ex.xRange[1]) {
          if (ex.dir === 'right' && p.x >= window.CANVAS_W - p.w - 80) {
             console.log(`[Transition] Manual exit RIGHT to ${ex.to}`);
             if (window.changeArea) window.changeArea(ex.to, ex.spawnX, ex.spawnY);
             else changeArea(ex.to, ex.spawnX, ex.spawnY);
             return true;
          }
          if (ex.dir === 'left' && p.x <= 40) {
             console.log(`[Transition] Manual exit LEFT to ${ex.to}`);
             if (window.changeArea) window.changeArea(ex.to, ex.spawnX, ex.spawnY);
             else changeArea(ex.to, ex.spawnX, ex.spawnY);
             return true;
          }
       }
    }
  }
  return false;
}

export function changeArea(areaId, spawnX, spawnY) {
  console.log(`[Transition] Changing area to ${areaId} (spawn: ${spawnX},${spawnY})`);
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
    if (window.ParticleSystem) {
      window.ParticleSystem.clear();
      if (areaId === 'giardini' || areaId === 'piazze' || areaId === 'residenziale') {
        window.ParticleSystem.createFireflies(spawnX, spawnY);
      } else if (areaId === 'chiesa' || areaId === 'cimitero' || areaId === 'polizia') {
        window.ParticleSystem.createDust(spawnX, spawnY);
      }
    }
    if (window.LightingSystem) {
      window.LightingSystem.setupAreaLights(areaId);
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
