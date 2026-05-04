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
import { updatePrologue } from './prologueUpdater.ts';
import { updateFade, checkAreaExits } from './transition.ts';
import { updatePlayerPosition } from './movement.ts';
import { render as renderFrame } from '../render/index.ts';

// Side-effect imports to ensure window globals are initialized
import '../effects/ambient.mjs';

/** Stub — interaction checking is handled by input handlers */
function checkInteractions(): void {
  /* no-op: interactions triggered by keypress, not per-frame polling */
}

declare const gameState: GameState;

class GameLoop {
  ctx: CanvasRenderingContext2D | null;
  isRunning: boolean;
  animationId: number | null;
  lastTime: number;
  deltaTime: number;
  constructor() {
    this.ctx = null;
    this.isRunning = false;
    this.animationId = null;
    this.lastTime = 0;
    this.deltaTime = 0;
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
    updatePrologue();
  }

  /**
   * Update playing state
   */
  private _updatePlaying(): void {
    updatePlayerPosition();
    checkAreaExits();
    checkInteractions();

    // Step sounds (random, ~every 20 frames)
    if (Math.random() < 0.05) {
      var area = gameState.currentArea;
      var stepType = 'step_stone';
      if (area === 'giardini' || area === 'campo' || area === 'cimitero') stepType = 'step_grass';
      else if (area === 'chiesa' || area === 'municipio' || area === 'bar_interno') stepType = 'step_wood';
      else if (area === 'industriale' || area === 'residenziale') stepType = 'step_gravel';
      window.playSFX?.(stepType, { volume: 0.3 });
    }

    // Advance game time (1 minute game = 10 seconds real)
    gameState.gameTime += this.deltaTime / 10000;
    if (Math.floor(gameState.gameTime / 1) % 60 === 0) {
       (window as any).updateHUD();
    }

    // Update effect systems (window globals initialized by ambient.mjs)
    (window as any).ParticleSystem?.update?.();
    (window as any).LightingSystem?.update?.();
    (window as any).ScreenShake?.update?.();
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
      renderFrame(this.ctx);
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
