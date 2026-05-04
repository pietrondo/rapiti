/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    TRANSITION SYSTEM (TypeScript)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Gestisce i cambi d'area, il fading e lo spawn del player.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { gameState as configGameState, CANVAS_W, CANVAS_H } from '../config.ts';
import { saveLoad } from './saveLoad.ts';

function getGameState(): any {
  return (window as any).gameState || configGameState;
}

function getAreas(): any {
  return (window as any).areas || {};
}

function canUseExit(ex: any): boolean {
  if (!ex.requiresFlag) return true;
  const storyManager = (window as any).StoryManager;
  if (storyManager?.hasFlag) return storyManager.hasFlag(ex.requiresFlag);
  return false;
}

function runChangeArea(areaId: string, spawnX: number, spawnY: number): void {
  const globalChangeArea = (window as any).changeArea;
  if (typeof globalChangeArea === 'function' && globalChangeArea !== changeArea) {
    globalChangeArea(areaId, spawnX, spawnY);
    return;
  }
  changeArea(areaId, spawnX, spawnY);
}

/** Controlla se il player tocca un'uscita automatica */
export function checkAreaExits(): void {
  const gameState = getGameState();
  if (gameState.fadeDir !== 0) return;
  const p = gameState.player;
  const area = getAreas()[gameState.currentArea];
  if (!area || !area.exits) return;

  for (let i = 0; i < area.exits.length; i++) {
    const ex = area.exits[i];
    if (ex.requiresInteract || ex.requiresPuzzle) continue;
    if (!canUseExit(ex)) continue;
    
    let triggered = false;
    if (ex.dir === 'up' && p.y <= (area.walkableTop || 2) + 2 && p.x >= ex.xRange[0] && p.x <= ex.xRange[1]) triggered = true;
    if (ex.dir === 'down' && p.y >= CANVAS_H - p.h - 2 && p.x >= ex.xRange[0] && p.x <= ex.xRange[1]) triggered = true;
    if (ex.dir === 'left' && p.x <= 2 && p.y >= ex.xRange[0] && p.y <= ex.xRange[1]) triggered = true;
    if (ex.dir === 'right' && p.x >= CANVAS_W - p.w - 2 && p.y >= ex.xRange[0] && p.y <= ex.xRange[1]) triggered = true;
    
    if (triggered) {
      console.log(`[Transition] Auto-exit triggered to ${ex.to} at pos ${p.x},${p.y}`);
      runChangeArea(ex.to, ex.spawnX, ex.spawnY);
      return;
    }
  }
}

/** Triggera un'uscita manuale (es. via tasto E) */
export function triggerInteractExit(): boolean {
  const gameState = getGameState();
  const p = gameState.player;
  const area = getAreas()[gameState.currentArea];
  if (!area || !area.exits) return false;

  console.log(`[Transition] Manual interaction check at ${p.x},${p.y} in ${gameState.currentArea}`);

  for (let i = 0; i < area.exits.length; i++) {
    const ex = area.exits[i];
    if (!ex.requiresInteract) continue;
    if (!canUseExit(ex)) continue;

    if (ex.dir === 'up' || ex.dir === 'down') {
       if (p.x >= ex.xRange[0] && p.x <= ex.xRange[1]) {
          if (ex.dir === 'up' && p.y <= (area.walkableTop || 0) + 15) {
             console.log(`[Transition] Manual exit UP to ${ex.to}`);
             runChangeArea(ex.to, ex.spawnX, ex.spawnY);
             return true;
          }
          if (ex.dir === 'down' && p.y >= CANVAS_H - p.h - 15) {
             console.log(`[Transition] Manual exit DOWN to ${ex.to}`);
             runChangeArea(ex.to, ex.spawnX, ex.spawnY);
             return true;
          }
       }
    } else {
       if (p.y >= ex.xRange[0] && p.y <= ex.xRange[1]) {
          if (ex.dir === 'right' && p.x >= CANVAS_W - p.w - 80) {
             console.log(`[Transition] Manual exit RIGHT to ${ex.to}`);
             runChangeArea(ex.to, ex.spawnX, ex.spawnY);
             return true;
          }
          if (ex.dir === 'left' && p.x <= 40) {
             console.log(`[Transition] Manual exit LEFT to ${ex.to}`);
             runChangeArea(ex.to, ex.spawnX, ex.spawnY);
             return true;
          }
       }
    }
  }
  return false;
}

/** Esegue il cambio area con effetto fade e AUTO-SAVE */
export function changeArea(areaId: string, spawnX: number, spawnY: number): void {
  const gameState = getGameState();
  console.log(`[Transition] Changing area to ${areaId} (spawn: ${spawnX},${spawnY})`);
  
  gameState.fadeDir = 1;
  gameState.transitionDir = (window as any).areas?.[areaId]?.name || areaId;
  gameState.fadeCallback = () => {
    gameState.currentArea = areaId;
    gameState.player.x = spawnX;
    gameState.player.y = spawnY;
    gameState.player.targetX = null;
    gameState.player.targetY = null;

    // AUTO-SAVE alla transizione
    console.log('[Transition] Auto-saving progress...');
    saveLoad.save('autosave', `Auto: ${areaId}`);

    // Notifica StoryManager
    if ((window as any).StoryManager) {
      (window as any).StoryManager.onAreaVisited(areaId);
    }

    // Inizializza effetti per la nuova area
    if ((window as any).ParticleSystem) {
      (window as any).ParticleSystem.clear();
      if (areaId === 'giardini' || areaId === 'piazze' || areaId === 'residenziale') {
        (window as any).ParticleSystem.createFireflies(spawnX, spawnY);
      } else if (areaId === 'chiesa' || areaId === 'cimitero' || areaId === 'polizia') {
        (window as any).ParticleSystem.createDust(spawnX, spawnY);
      }
    }
    
    if ((window as any).LightingSystem) {
      (window as any).LightingSystem.setupAreaLights(areaId);
    }
    
    updateHUD();
    
    gameState.fadeDir = -1;
    gameState.fadeCallback = () => {
      gameState.fadeDir = 0;
      gameState.fadeCallback = null;
    };
  };
}

/** Gestisce l'animazione del fade */
export function updateFade(): void {
  const gameState = getGameState();
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

/** Aggiorna l'HUD (usando i18n se disponibile) */
export function updateHUD(): void {
  const gameState = getGameState();
  const areaEl = document.getElementById('hud-area');
  if (areaEl) {
     const areaId = gameState.currentArea;
     let areaName = areaId;
     if ((window as any).t) {
        areaName = (window as any).t(`area.${areaId}`);
        if (areaName === `[area.${areaId}]`) areaName = areaId;
        areaEl.textContent = (window as any).t('hud.area', { area: areaName });
     } else {
        areaEl.textContent = areaName;
     }
  }
  
  const cluesEl = document.getElementById('hud-clues');
  if (cluesEl) {
     if ((window as any).t) {
        cluesEl.textContent = (window as any).t('hud.clues', {
          found: gameState.cluesFound.length,
          total: 9
        });
     } else {
        cluesEl.textContent = `${gameState.cluesFound.length}/9`;
     }
  }
  
  const timeEl = document.getElementById('hud-time');
  if (timeEl) {
    const totalMinutes = Math.floor(gameState.gameTime || 0);
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    timeEl.textContent = (hours < 10 ? '0' : '') + hours + ':' + (minutes < 10 ? '0' : '') + minutes;
  }
}

// Global exports per retrocompatibilità
if (typeof window !== 'undefined') {
  (window as any).updateHUD = updateHUD;
  (window as any).checkAreaExits = checkAreaExits;
  (window as any).changeArea = changeArea;
  (window as any).updateFade = updateFade;
  (window as any).triggerInteractExit = triggerInteractExit;
}
