/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    GAME LOOP (ES6+ CLASS)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Main game loop controller with ES6+ class syntax.
 * Manages update/render cycle and game state transitions.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class GameLoop {
  constructor() {
    this.ctx = null;
    this.isRunning = false;
    this.animationId = null;
    this.lastTime = 0;
    this.deltaTime = 0;
    this.prologueTimings = [150, 250, 150, 180, 200, 180, 150, 200, 120];
  }

  /**
   * Initialize game loop
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   */
  init(ctx) {
    this.ctx = ctx;
    console.log('[GameLoop] Initialized');
  }

  /**
   * Start the game loop
   */
  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.tick();
  }

  /**
   * Stop the game loop
   */
  stop() {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Main tick - called every frame
   */
  tick() {
    if (!this.isRunning) return;

    const now = performance.now();
    this.deltaTime = now - this.lastTime;
    this.lastTime = now;

    this.update();
    this.render();

    this.animationId = requestAnimationFrame(() => this.tick());
  }

  /**
   * Update game state
   */
  update() {
    const ph = gameState.gamePhase;

    // Prologue auto-advance
    if (ph === 'prologue_cutscene') {
      this._updatePrologue();
    }

    if (ph === 'playing') {
      this._updatePlaying();
    }

    updateFade();
    this._updateToast();
  }

  /**
   * Update prologue cutscene
   * @private
   */
  _updatePrologue() {
    gameState.prologueTimer++;
    const step = gameState.prologueStep;

    if (step < this.prologueTimings.length &&
        gameState.prologueTimer >= this.prologueTimings[step]) {
      gameState.prologueTimer = 0;
      gameState.prologueStep++;

      if (gameState.prologueStep >= 9) {
        gameState.gamePhase = 'intro';
        gameState.introSlide = 0;
      }
    }
  }

  /**
   * Update playing state
   * @private
   */
  _updatePlaying() {
    updatePlayerPosition();
    checkAreaExits();
    checkInteractions();

    // Update effect systems
    ParticleSystem?.update?.();
    LightingSystem?.update?.();
    ScreenShake?.update?.();
  }

  /**
   * Update toast timer
   * @private
   */
  _updateToast() {
    if (gameState.messageTimer > 0) {
      gameState.messageTimer--;
      if (gameState.messageTimer <= 0) {
        document.getElementById('toast')?.classList.remove('visible');
      }
    }
  }

  /**
   * Render frame
   */
  render() {
    if (this.ctx) {
      render(this.ctx);
    }
  }

  /**
   * Get delta time
   * @returns {number}
   */
  getDeltaTime() {
    return this.deltaTime;
  }

  /**
   * Check if loop is running
   * @returns {boolean}
   */
  isActive() {
    return this.isRunning;
  }
}

// Singleton instance
const gameLoop = new GameLoop();

// Backward compatibility functions
export function gameLoopFn() {
  gameLoop.tick();
}

// Global exports
if (typeof window !== 'undefined') {
  window.GameLoop = GameLoop;
  window.gameLoop = gameLoop;
}

export { GameLoop, gameLoop };
export default gameLoop;
