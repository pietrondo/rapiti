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
 * Carica uno script dinamicamente come modulo o script classico
 * @param {string} src - Percorso dello script
 * @param {boolean} asModule - Se caricare come ES6 module
 * @returns {Promise}
 */
function loadScript(src, asModule = false) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    if (asModule) {
      script.type = 'module';
    }
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

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

// ═══════════════════════════════════════════════════════════════════════════════
// INITIALIZATION SEQUENCE
// ═══════════════════════════════════════════════════════════════════════════════

async function initializeGame() {
  console.log('[Main] Initializing game...');

  try {
    // Phase 1: Load data modules
    await loadScript('src/data/clues.js');
    await loadScript('src/data/npcs.js');
    await loadScript('src/data/areas.js');
    await loadScript('src/data/puzzles.js');

    // Phase 2: Load engine modules
    await loadScript('src/engine/spriteEngine.js');
    await loadScript('src/engine/proceduralRenderer.js');
    await loadScript('src/engine/buildingRenderers.js');
    await loadScript('src/engine/index.js');

    // Phase 3: Load texture & sprite generators
    await loadScript('src/game/textureGenerator.js');
    await loadScript('src/game/spriteGenerator.js');

    // Phase 4: Load effects modules
    await loadScript('src/effects/ambient.js');
    await loadScript('src/effects/particles.js');
    await loadScript('src/effects/lighting.js');
    await loadScript('src/effects/weather.js');
    await loadScript('src/effects/animations.js');
    await loadScript('src/effects/uiEffects.js');
    await loadScript('src/effects/index.js');

    // Phase 5: Load area modules
    await loadScript('src/areas/piazze.js');
    await loadScript('src/areas/chiesa.js');
    await loadScript('src/areas/cimitero.js');
    await loadScript('src/areas/giardini.js');
    await loadScript('src/areas/barExterior.js');
    await loadScript('src/areas/residenziale.js');
    await loadScript('src/areas/industriale.js');
    await loadScript('src/areas/polizia.js');
    await loadScript('src/areas/index.js');

    // Phase 6: Load render modules
    await loadScript('src/render/spriteManager.js');
    await loadScript('src/render/uiRenderer.js');
    await loadScript('src/render/sceneRenderer.js');
    await loadScript('src/render/gameRenderer.js');
    await loadScript('src/render/index.js');

    // Phase 7: Load story modules
    await loadScript('src/story/chapterManager.js');
    await loadScript('src/story/questManager.js');
    await loadScript('src/story/storyEngine.js');
    await loadScript('src/story/index.js');

    // Phase 8: Load game modules
    await loadScript('src/game/engine.js');
    await loadScript('src/game/init.js');
    await loadScript('src/game/audio.js');
    await loadScript('src/game/customize.js');
    await loadScript('src/game/input.js');
    await loadScript('src/game/render.js');
    await loadScript('src/game/dialogue.js');
    await loadScript('src/game/radio.js');
    await loadScript('src/game/registry.js');
    await loadScript('src/game/scene.js');
    await loadScript('src/game/recorder.js');
    await loadScript('src/game/deduction.js');
    await loadScript('src/game/transition.js');
    await loadScript('src/game/endings.js');
    await loadScript('src/game/loop.js');

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
