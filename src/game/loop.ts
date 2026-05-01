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

import type { GameState } from '../types.js';

declare const gameState: GameState;
declare function updateFade(): void;
declare function updatePlayerPosition(): void;
declare function checkAreaExits(): void;
declare function checkInteractions(): void;
declare const ParticleSystem: any;
declare const LightingSystem: any;
declare const ScreenShake: any;
declare function render(ctx: CanvasRenderingContext2D): void;

class GameLoop {
  ctx: CanvasRenderingContext2D | null;
  isRunning: boolean;
  animationId: number | null;
  lastTime: number;
  deltaTime: number;
  prologueTimings: number[];

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
   */
  init(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx;
    console.log('[GameLoop] Initialized');
  }

  /**
   * Start the game loop
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.tick();
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Main tick - called every frame
   */
  tick(): void {
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
  update(): void {
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
   */
  private _updatePrologue(): void {
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
   */
  private _updatePlaying(): void {
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
   */
  private _updateToast(): void {
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
  render(): void {
    if (this.ctx) {
      render(this.ctx);
    }
  }

  /**
   * Get delta time
   */
  getDeltaTime(): number {
    return this.deltaTime;
  }

  /**
   * Check if loop is running
   */
  isActive(): boolean {
    return this.isRunning;
  }
}

// Singleton instance
const gameLoop = new GameLoop();

// Backward compatibility functions
export function gameLoopFn(): void {
  gameLoop.tick();
}

// Global exports
if (typeof window !== 'undefined') {
  window.GameLoop = GameLoop;
  window.gameLoop = gameLoop;
}

export { GameLoop, gameLoop };
export default gameLoop;
