/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                         MAIN ENTRY POINT (ES6+)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Entry point per l'applicazione con supporto ES6 modules.
 * Importa e inizializza tutti i sistemi di gioco.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CORE CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

import {
  CANVAS_H,
  CANVAS_W,
  gameState,
  PALETTE,
  PLAYER_H,
  PLAYER_SPEED,
  PLAYER_W,
  resetGameState,
  VERSION,
} from './config.mjs';

// Esporta globalmente per retrocompatibilità durante la transizione
window.PALETTE = PALETTE;
window.CANVAS_W = CANVAS_W;
window.CANVAS_H = CANVAS_H;
window.PLAYER_SPEED = PLAYER_SPEED;
window.PLAYER_W = PLAYER_W;
window.PLAYER_H = PLAYER_H;
window.gameState = gameState;
window.resetGameState = resetGameState;
window.VERSION = VERSION;

console.log(`[Main] Le Luci di San Celeste v${VERSION} - ES6+ Module System`);

// ═══════════════════════════════════════════════════════════════════════════════
// DYNAMIC MODULE LOADING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Carica un modulo ES6 dinamicamente
 * @param {string} src - Percorso del modulo
 * @returns {Promise<*>}
 */
async function loadModule(src) {
  try {
    const module = await import(src);
    console.log(`[Main] Module loaded: ${src}`);
    return module;
  } catch (error) {
    console.error(`[Main] Failed to load module: ${src}`, error);
    throw error;
  }
}

/**
 * Carica uno script dinamicamente come script classico (legacy fallback)
 * @param {string} src - Percorso dello script
 * @returns {Promise}
 */
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION SEQUENCE
// ═══════════════════════════════════════════════════════════════════════════════

async function initializeGame() {
  console.log('[Main] Initializing game...');

  try {
    // Phase 1: Load data modules
    await loadModule('src/data/clues.mjs');
    await loadModule('src/data/npcData.mjs');
    await loadModule('src/data/dialogueNodes.mjs');
    await loadModule('src/data/dialogueEffects.mjs');
    await loadModule('src/data/areas.mjs');
    await loadModule('src/data/puzzles.mjs');

    // Phase 2: Load engine modules
    await loadModule('src/engine/spriteEngine.mjs');
    await loadModule('src/engine/proceduralRenderer.mjs');
    await loadModule('src/engine/civicBuildings.mjs');
    await loadModule('src/engine/industrialBuildings.mjs');
    await loadModule('src/engine/buildingDecorations.mjs');
    await loadModule('src/engine/buildingRenderers.mjs');
    await loadModule('src/engine/index.ts');

    // Phase 3: Load texture & sprite generators
    await loadModule('src/game/textureGenerator.mjs');
    await loadModule('src/game/spriteGenerator.mjs');

    // Phase 4: Load effects modules
    await loadModule('src/effects/ambient.mjs');
    await loadModule('src/effects/particles.mjs');
    await loadModule('src/effects/lighting.mjs');
    await loadModule('src/effects/weather.mjs');
    await loadModule('src/effects/animations.mjs');
    await loadModule('src/effects/uiEffects.mjs');
    await loadModule('src/effects/index.mjs');

    // Phase 5: Load area modules
    await loadModule('src/areas/piazze.mjs');
    await loadModule('src/areas/chiesa.mjs');
    await loadModule('src/areas/cimitero.mjs');
    await loadModule('src/areas/giardini.mjs');
    await loadModule('src/areas/barExterior.mjs');
    await loadModule('src/areas/residenziale.mjs');
    await loadModule('src/areas/industriale.mjs');
    await loadModule('src/areas/polizia.mjs');
    await loadModule('src/areas/index.mjs');

    // Phase 6: Load render modules
    await loadModule('src/render/spriteManager.mjs');
    await loadModule('src/render/uiRenderer.mjs');
    await loadModule('src/render/objectRenderer.mjs');
    await loadModule('src/render/mapRenderer.mjs');
    await loadModule('src/render/prologueRenderer.mjs');
    await loadModule('src/render/introRenderer.mjs');
    await loadModule('src/render/endingRenderer.mjs');
    await loadModule('src/render/sceneRenderer.mjs');
    await loadModule('src/render/gameRenderer.mjs');
    await loadModule('src/render/index.ts');

    // Phase 7: Load story modules
    await loadModule('src/story/storyChapters.mjs');
    await loadModule('src/story/storyQuests.mjs');
    await loadModule('src/story/storyDialogues.mjs');
    await loadModule('src/story/storyEndings.mjs');
    await loadModule('src/story/storyEvents.mjs');
    await loadModule('src/story/storyAchievements.mjs');
    await loadModule('src/story/flagManager.mjs');
    await loadModule('src/story/statsManager.mjs');
    await loadModule('src/story/dialogueSystem.mjs');
    await loadModule('src/story/conditionSystem.mjs');
    await loadModule('src/story/eventSystem.mjs');
    await loadModule('src/story/endingSystem.mjs');
    await loadModule('src/story/achievementSystem.mjs');
    await loadModule('src/story/chapterManager.mjs');
    await loadModule('src/story/questManager.mjs');
    await loadModule('src/story/storyEngine.mjs');
    await loadModule('src/story/index.ts');

    // Phase 8: Load game modules
    await loadModule('src/game/engine.mjs');
    await loadModule('src/game/init.mjs');
    await loadModule('src/game/audio.mjs');
    await loadModule('src/game/customize.mjs');
    await loadModule('src/game/input.ts');
    await loadModule('src/game/dialogue.mjs');
    await loadModule('src/game/radio.mjs');
    await loadModule('src/game/registry.mjs');
    await loadModule('src/game/scene.mjs');
    await loadModule('src/game/recorder.mjs');
    await loadModule('src/game/deduction.mjs');
    await loadModule('src/game/transition.mjs');
    await loadModule('src/game/endings.mjs');
    await loadModule('src/game/loop.ts');

    console.log('[Main] All modules loaded successfully');

    // Initialize game systems
    if (typeof initCanvas === 'function') {
      initCanvas();
    }
    if (typeof initAudio === 'function') {
      initAudio();
    }
    if (typeof initEventListeners === 'function') {
      initEventListeners();
    }
    if (typeof initStoryManager === 'function') {
      initStoryManager();
    }

    // Start game loop
    if (typeof gameLoop === 'function') {
      requestAnimationFrame(gameLoop);
      console.log('[Main] Game loop started');
    }
  } catch (error) {
    console.error('[Main] Initialization failed:', error);
    document.body.innerHTML = `
      <div style="color: white; text-align: center; padding: 50px; font-family: monospace;">
        <h2>Errore di Inizializzazione</h2>
        <p>Impossibile avviare il gioco.</p>
        <pre style="text-align: left; background: #222; padding: 20px; overflow: auto;">${error.stack}</pre>
      </div>
    `;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOOTSTRAP
// ═══════════════════════════════════════════════════════════════════════════════

// Attendi che il DOM sia pronto
document.addEventListener('DOMContentLoaded', () => {
  console.log('[Main] DOM ready, starting initialization...');
  initializeGame();
});

// Esporta funzioni utili per debugging
export { CANVAS_H, CANVAS_W, gameState, initializeGame, loadModule, loadScript, PALETTE, VERSION };
