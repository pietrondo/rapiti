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
// DYNAMIC MODULE LOADING (Vite import.meta.glob)
// ═══════════════════════════════════════════════════════════════════════════════

const moduleMap = import.meta.glob([
  './data/*.mjs',
  './engine/*.{mjs,ts}',
  './game/*.{mjs,ts}',
  './effects/*.mjs',
  './areas/*.mjs',
  './render/*.{mjs,ts}',
  './story/*.{mjs,ts}',
]);

/**
 * Carica un modulo ES6 dinamicamente tramite Vite glob
 * @param {string} src - Percorso del modulo (relativo a src/)
 * @returns {Promise<*>}
 */
async function loadModule(src) {
  try {
    const loader = moduleMap[src];
    if (!loader) {
      throw new Error(`Module ${src} not found in glob map`);
    }
    const module = await loader();
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
    await loadModule('./data/clues.mjs');
    await loadModule('./data/npcData.mjs');
    await loadModule('./data/dialogueNodes.mjs');
    await loadModule('./data/dialogueEffects.mjs');
    await loadModule('./data/areas.mjs');
    await loadModule('./data/puzzles.mjs');

    // Phase 2: Load engine modules
    await loadModule('./engine/spriteEngine.mjs');
    await loadModule('./engine/proceduralRenderer.mjs');
    await loadModule('./engine/civicBuildings.mjs');
    await loadModule('./engine/industrialBuildings.mjs');
    await loadModule('./engine/buildingDecorations.mjs');
    await loadModule('./engine/buildingRenderers.mjs');
    await loadModule('./engine/index.ts');

    // Phase 3: Load texture & sprite generators
    await loadModule('./game/textureGenerator.mjs');
    await loadModule('./game/spriteGenerator.mjs');

    // Phase 4: Load effects modules
    await loadModule('./effects/ambient.mjs');
    await loadModule('./effects/particles.mjs');
    await loadModule('./effects/lighting.mjs');
    await loadModule('./effects/weather.mjs');
    await loadModule('./effects/animations.mjs');
    await loadModule('./effects/uiEffects.mjs');
    await loadModule('./effects/index.mjs');

    // Phase 5: Load area modules
    await loadModule('./areas/piazze.mjs');
    await loadModule('./areas/chiesa.mjs');
    await loadModule('./areas/cimitero.mjs');
    await loadModule('./areas/giardini.mjs');
    await loadModule('./areas/barExterior.mjs');
    await loadModule('./areas/residenziale.mjs');
    await loadModule('./areas/industriale.mjs');
    await loadModule('./areas/polizia.mjs');
    await loadModule('./areas/index.mjs');

    // Phase 6: Load render modules
    await loadModule('./render/spriteManager.mjs');
    await loadModule('./render/uiRenderer.mjs');
    await loadModule('./render/objectRenderer.mjs');
    await loadModule('./render/mapRenderer.mjs');
    await loadModule('./render/prologueRenderer.mjs');
    await loadModule('./render/introRenderer.mjs');
    await loadModule('./render/endingRenderer.mjs');
    await loadModule('./render/sceneRenderer.mjs');
    await loadModule('./render/gameRenderer.mjs');
    await loadModule('./render/index.ts');

    // Phase 7: Load story modules
    await loadModule('./story/storyChapters.mjs');
    await loadModule('./story/storyQuests.mjs');
    await loadModule('./story/storyDialogues.mjs');
    await loadModule('./story/storyEndings.mjs');
    await loadModule('./story/storyEvents.mjs');
    await loadModule('./story/storyAchievements.mjs');
    await loadModule('./story/flagManager.mjs');
    await loadModule('./story/statsManager.mjs');
    await loadModule('./story/dialogueSystem.mjs');
    await loadModule('./story/conditionSystem.mjs');
    await loadModule('./story/eventSystem.mjs');
    await loadModule('./story/endingSystem.mjs');
    await loadModule('./story/achievementSystem.mjs');
    await loadModule('./story/chapterManager.mjs');
    await loadModule('./story/questManager.mjs');
    await loadModule('./story/storyEngine.mjs');
    await loadModule('./story/index.ts');

    // Phase 8: Load game modules
    await loadModule('./game/engine.mjs');
    await loadModule('./game/init.mjs');
    await loadModule('./game/audio.mjs');
    await loadModule('./game/customize.mjs');
    await loadModule('./game/input.ts');
    await loadModule('./game/dialogue.mjs');
    await loadModule('./game/radio.mjs');
    await loadModule('./game/registry.mjs');
    await loadModule('./game/scene.mjs');
    await loadModule('./game/recorder.mjs');
    await loadModule('./game/deduction.mjs');
    await loadModule('./game/transition.mjs');
    await loadModule('./game/endings.mjs');
    await loadModule('./game/loop.ts');

    console.log('[Main] All modules loaded successfully');

    // Initialize game systems
    var ctx = null;
    if (typeof initCanvas === 'function') {
      ctx = initCanvas();
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

    // Initialize render manager and game loop with canvas context
    if (ctx && typeof window !== 'undefined') {
      if (window.renderManager && typeof window.renderManager.init === 'function') {
        window.renderManager.init(ctx);
      }
      if (window.gameLoop && typeof window.gameLoop.init === 'function') {
        window.gameLoop.init(ctx);
      }
    }

    // Start game loop
    if (typeof window !== 'undefined' && window.gameLoop && typeof window.gameLoop.start === 'function') {
      window.gameLoop.start();
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
