"use strict";

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
    // Inizializza effetti per la nuova area
    ParticleSystem.clear();
    LightingSystem.setupAreaLights(areaId);
    if (areaId === 'campo') {
      ParticleSystem.createFireflies(spawnX, spawnY);
    } else if (areaId === 'archivio' || areaId === 'cascina_interno') {
      ParticleSystem.createDust(spawnX, spawnY);
    }
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
