/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                         ENGINE MODULE INDEX
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Central hub for the modular engine system. Aggregates and exports all
 * engine-related functionality including sprite management, procedural
 * rendering, and building renderers.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { AnimationOptions, EasingFunction, Rect } from '../types.js';

interface EasingFunctions {
  linear: EasingFunction;
  easeIn: EasingFunction;
  easeOut: EasingFunction;
  easeInOut: EasingFunction;
  bounce: EasingFunction;
}

const Engine = {
  SpriteEngine: typeof SpriteEngine !== 'undefined' ? SpriteEngine : null,
  ProceduralRenderer: typeof ProceduralRenderer !== 'undefined' ? ProceduralRenderer : null,
  BuildingRenderers: typeof BuildingRenderers !== 'undefined' ? BuildingRenderers : null,

  /**
   * Initialize all engine subsystems
   */
  init(): void {
    if (this.SpriteEngine?.init) {
      this.SpriteEngine.init();
    }
    if (this.ProceduralRenderer?.init) {
      this.ProceduralRenderer.init();
    }
  },

  /**
   * Get complete sprite for an entity
   */
  getSprite(type: string, id: string): unknown {
    if (this.SpriteEngine) {
      return this.SpriteEngine.getSprite(type, id);
    }
    return null;
  },

  /**
   * Generate procedural texture
   */
  generateTexture(type: string, options?: Record<string, unknown>): HTMLCanvasElement | null {
    if (this.ProceduralRenderer) {
      return this.ProceduralRenderer.generate(type, options);
    }
    return null;
  },

  /**
   * Draw a building using appropriate renderer
   */
  drawBuilding(
    ctx: CanvasRenderingContext2D,
    type: string,
    x: number,
    y: number,
    width: number,
    height: number,
    options?: Record<string, unknown>
  ): void {
    if (!this.BuildingRenderers) return;

    switch (type) {
      case 'detailed':
        this.BuildingRenderers.drawBuildingDetailed(ctx, x, y, width, height, options);
        break;
      case 'church':
        this.BuildingRenderers.drawChurch(ctx, x, y, width, height);
        break;
      case 'residential':
        this.BuildingRenderers.drawResidentialHouse(ctx, x, y, width, height, options);
        break;
      case 'shop':
        this.BuildingRenderers.drawShopFront(ctx, x, y, width, height, options);
        break;
      case 'industrial':
        this.BuildingRenderers.drawIndustrialBuilding(ctx, x, y, width, height);
        break;
      case 'police':
        this.BuildingRenderers.drawPoliceStation(ctx, x, y, width, height);
        break;
      case 'fountain':
        this.BuildingRenderers.drawFountain(ctx, x, y, width);
        break;
      case 'lamp':
        this.BuildingRenderers.drawStreetLamp(ctx, x, y, (options as Record<string, boolean>)?.isOn);
        break;
    }
  },

  /**
   * Create a canvas for offscreen rendering
   */
  createCanvas(width: number, height: number): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  },

  /**
   * Get canvas context with common settings
   */
  getContext(canvas: HTMLCanvasElement, willReadFrequently?: boolean): CanvasRenderingContext2D {
    const ctx = canvas.getContext('2d', {
      willReadFrequently: willReadFrequently || false,
    })!;
    ctx.imageSmoothingEnabled = false;
    return ctx;
  },

  /**
   * Apply pixel art scaling to context
   */
  setPixelArtScale(ctx: CanvasRenderingContext2D, scale: number): void {
    ctx.imageSmoothingEnabled = false;
    ctx.scale(scale, scale);
  },

  /**
   * Clear canvas with optional color
   */
  clearCanvas(ctx: CanvasRenderingContext2D, width: number, height: number, color?: string): void {
    if (color) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  },

  /**
   * Utility: Clamp value between min and max
   */
  clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, value));
  },

  /**
   * Utility: Linear interpolation
   */
  lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  },

  /**
   * Utility: Random integer between min and max (inclusive)
   */
  randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Utility: Random float between min and max
   */
  randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  },

  /**
   * Utility: Check if point is in rectangle
   */
  pointInRect(px: number, py: number, rx: number, ry: number, rw: number, rh: number): boolean {
    return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
  },

  /**
   * Utility: Check rectangle collision
   */
  rectCollision(r1: Rect, r2: Rect): boolean {
    return (
      r1.x < r2.x + r2.width &&
      r1.x + r1.width > r2.x &&
      r1.y < r2.y + r2.height &&
      r1.y + r1.height > r2.y
    );
  },

  /**
   * Utility: Distance between two points
   */
  distance(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  },

  /**
   * Utility: Normalize angle to 0-2π range
   */
  normalizeAngle(angle: number): number {
    while (angle < 0) angle += Math.PI * 2;
    while (angle >= Math.PI * 2) angle -= Math.PI * 2;
    return angle;
  },

  /**
   * Utility: Convert degrees to radians
   */
  degToRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  },

  /**
   * Utility: Convert radians to degrees
   */
  radToDeg(radians: number): number {
    return radians * (180 / Math.PI);
  },

  /**
   * Utility: Easing functions
   */
  Easing: {
    linear: (t: number) => t,
    easeIn: (t: number) => t * t,
    easeOut: (t: number) => 1 - (1 - t) * (1 - t),
    easeInOut: (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
    bounce: (t: number) => {
      const n1 = 7.5625;
      const d1 = 2.75;
      if (t < 1 / d1) {
        return n1 * t * t;
      } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
      } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
      } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
      }
    },
  } as EasingFunctions,

  /**
   * Animation helper: Animate value over time
   */
  animate(options: AnimationOptions): void {
    const startTime = Date.now();
    const from = options.from;
    const to = options.to;
    const duration = options.duration;
    const easing = options.easing || this.Easing.linear;
    const onUpdate = options.onUpdate;
    const onComplete = options.onComplete;

    const update = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);
      const value = from + (to - from) * easedProgress;

      if (onUpdate) {
        onUpdate(value);
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else if (onComplete) {
        onComplete();
      }
    };

    requestAnimationFrame(update);
  },

  /**
   * Performance: Mark start of performance measurement
   */
  perfStart(label: string): void {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${label}-start`);
    }
  },

  /**
   * Performance: Mark end and measure
   */
  perfEnd(label: string): void {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(`${label}-end`);
      performance.measure(label, `${label}-start`, `${label}-end`);
    }
  },

  /**
   * Version info
   */
  version: '2.0.0-modular',
  buildDate: new Date().toISOString(),
};

// Make available globally for browser environment
if (typeof window !== 'undefined') {
  window.Engine = Engine;
}

// Singleton instance for convenience
const engine = Engine;

export { Engine, engine };
export default Engine;
