/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    RENDER MANAGER (ES6+ CLASS)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Central rendering dispatcher with ES6+ class syntax.
 * Manages the main render loop and delegates to sub-renderers.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { GameState } from '../types.js';

declare const gameState: GameState;
declare const CANVAS_W: number;
declare const CANVAS_H: number;
declare const ScreenShake: any;
declare const SceneRenderer: any;
declare const GameRenderer: any;
declare const UIRenderer: any;
declare const LightingSystem: any;
declare const ParticleSystem: any;
declare const Vignette: any;

class RenderManager {
  ctx: CanvasRenderingContext2D | null;
  scale: number;
  debug: boolean;
  frameCount: number;
  lastFpsTime: number;
  fps: number;

  constructor() {
    this.ctx = null;
    this.scale = 2;
    this.debug = false;
    this.frameCount = 0;
    this.lastFpsTime = 0;
    this.fps = 0;
  }

  /**
   * Initialize renderer with canvas context
   */
  init(ctx: CanvasRenderingContext2D): void {
    this.ctx = ctx;
    console.log('[RenderManager] Initialized');
  }

  /**
   * Main render dispatch
   */
  render(ctx?: CanvasRenderingContext2D): void {
    const renderCtx = ctx || this.ctx;
    if (!renderCtx) return;

    renderCtx.save();
    renderCtx.scale(this.scale, this.scale);
    renderCtx.imageSmoothingEnabled = false;

    // Apply screen shake
    ScreenShake?.apply?.(renderCtx);

    const ph = gameState.gamePhase;

    // Phase-based rendering
    switch (ph) {
      case 'title':
        SceneRenderer?.renderTitle?.(renderCtx);
        break;
      case 'prologue_cutscene':
        SceneRenderer?.renderPrologueCutscene?.(renderCtx);
        break;
      case 'intro':
        SceneRenderer?.renderIntroSlide?.(renderCtx);
        break;
      case 'prologue':
        SceneRenderer?.renderPrologue?.(renderCtx);
        break;
      case 'tutorial':
        SceneRenderer?.renderTutorial?.(renderCtx);
        break;
      case 'playing':
      case 'dialogue':
      case 'journal':
      case 'inventory':
      case 'deduction':
        this._renderGameplay(renderCtx);
        break;
      case 'ending':
        SceneRenderer?.renderEndingScreen?.(renderCtx);
        break;
    }

    if (ph === 'customize') {
      SceneRenderer?.renderTitle?.(renderCtx);
    }

    if (gameState.fadeDir !== 0) {
      UIRenderer?.renderFade?.(renderCtx);
    }

    // Debug FPS
    if (this.debug) {
      this._renderDebugInfo(renderCtx);
    }

    renderCtx.restore();

    // Update FPS counter
    this.frameCount++;
    const now = performance.now();
    if (now - this.lastFpsTime >= 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsTime = now;
    }
  }

  /**
   * Render gameplay scene
   */
  private _renderGameplay(ctx: CanvasRenderingContext2D): void {
    GameRenderer?.renderArea?.(ctx);
    GameRenderer?.renderPlayer?.(ctx);
    GameRenderer?.renderInteractionHint?.(ctx);

    // Visual effects
    LightingSystem?.draw?.(ctx, gameState.player.x, gameState.player.y);
    ParticleSystem?.draw?.(ctx);
    Vignette?.draw?.(ctx, CANVAS_W, CANVAS_H);

    if (gameState.showMiniMap) {
      UIRenderer?.renderMiniMap?.(ctx);
    }
  }

  /**
   * Render debug info
   */
  private _renderDebugInfo(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#00ff00';
    ctx.font = '10px monospace';
    ctx.fillText(`FPS: ${this.fps}`, 5, 10);
    ctx.fillText(`Phase: ${gameState.gamePhase}`, 5, 20);
    ctx.fillText(`Area: ${gameState.currentArea}`, 5, 30);
  }

  /**
   * Toggle debug mode
   */
  toggleDebug(): void {
    this.debug = !this.debug;
  }

  /**
   * Set render scale
   */
  setScale(scale: number): void {
    this.scale = scale;
  }

  /**
   * Get current FPS
   */
  getFps(): number {
    return this.fps;
  }
}

// Singleton instance
const renderManager = new RenderManager();

// Convenience function for backward compatibility
export function render(ctx?: CanvasRenderingContext2D): void {
  renderManager.render(ctx);
}

// Global exports
if (typeof window !== 'undefined') {
  window.RenderManager = RenderManager;
  window.renderManager = renderManager;
  window.RenderModule = { render: (ctx: CanvasRenderingContext2D) => renderManager.render(ctx) };
}

export { RenderManager, renderManager };
export default renderManager;
