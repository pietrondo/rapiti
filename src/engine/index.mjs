/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                         ENGINE MODULE INDEX
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Central hub for the modular engine system. Aggregates and exports all
 * engine-related functionality including sprite management, procedural
 * rendering, and building renderers.
 *
 * This module serves as the main entry point for the engine system,
 * extracted from the original monolithic engine.js
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Import submodules (in browser environment, these are loaded via script tags)
// In ES6 module environment, these would be proper imports

/**
 * Engine Module - Central aggregation point
 * Combines: SpriteEngine, ProceduralRenderer, BuildingRenderers
 */
const Engine = {
  // Sprite Engine functionality
  SpriteEngine: typeof SpriteEngine !== 'undefined' ? SpriteEngine : null,

  // Procedural Renderer functionality
  ProceduralRenderer: typeof ProceduralRenderer !== 'undefined' ? ProceduralRenderer : null,

  // Building Renderers functionality
  BuildingRenderers: typeof BuildingRenderers !== 'undefined' ? BuildingRenderers : null,

  /**
   * Initialize all engine subsystems
   */
  init: function () {
    if (this.SpriteEngine && this.SpriteEngine.init) {
      this.SpriteEngine.init();
    }
    if (this.ProceduralRenderer && this.ProceduralRenderer.init) {
      this.ProceduralRenderer.init();
    }
  },

  /**
   * Get complete sprite for an entity
   * @param {string} type - Entity type
   * @param {string} id - Entity ID
   * @returns {Object} Sprite data
   */
  getSprite: function (type, id) {
    if (this.SpriteEngine) {
      return this.SpriteEngine.getSprite(type, id);
    }
    return null;
  },

  /**
   * Generate procedural texture
   * @param {string} type - Texture type
   * @param {Object} options - Generation options
   * @returns {HTMLCanvasElement} Generated texture
   */
  generateTexture: function (type, options) {
    if (this.ProceduralRenderer) {
      return this.ProceduralRenderer.generate(type, options);
    }
    return null;
  },

  /**
   * Draw a building using appropriate renderer
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {string} type - Building type
   * @param {number} x - X position
   * @param {number} y - Y position
   * @param {number} width - Width
   * @param {number} height - Height
   * @param {Object} options - Rendering options
   */
  drawBuilding: function (ctx, type, x, y, width, height, options) {
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
        this.BuildingRenderers.drawStreetLamp(ctx, x, y, options && options.isOn);
        break;
    }
  },

  /**
   * Create a canvas for offscreen rendering
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @returns {HTMLCanvasElement} Created canvas
   */
  createCanvas: (width, height) => {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  },

  /**
   * Get canvas context with common settings
   * @param {HTMLCanvasElement} canvas - Target canvas
   * @param {boolean} willReadFrequently - Whether frequent pixel reading is needed
   * @returns {CanvasRenderingContext2D} Canvas context
   */
  getContext: (canvas, willReadFrequently) => {
    var ctx = canvas.getContext('2d', {
      willReadFrequently: willReadFrequently || false,
    });
    ctx.imageSmoothingEnabled = false;
    return ctx;
  },

  /**
   * Apply pixel art scaling to context
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} scale - Scale factor
   */
  setPixelArtScale: (ctx, scale) => {
    ctx.imageSmoothingEnabled = false;
    ctx.scale(scale, scale);
  },

  /**
   * Clear canvas with optional color
   * @param {CanvasRenderingContext2D} ctx - Canvas context
   * @param {number} width - Canvas width
   * @param {number} height - Canvas height
   * @param {string} color - Clear color (optional)
   */
  clearCanvas: (ctx, width, height, color) => {
    if (color) {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.clearRect(0, 0, width, height);
    }
  },

  /**
   * Utility: Clamp value between min and max
   * @param {number} value - Value to clamp
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Clamped value
   */
  clamp: (value, min, max) => Math.max(min, Math.min(max, value)),

  /**
   * Utility: Linear interpolation
   * @param {number} a - Start value
   * @param {number} b - End value
   * @param {number} t - Interpolation factor (0-1)
   * @returns {number} Interpolated value
   */
  lerp: (a, b, t) => a + (b - a) * t,

  /**
   * Utility: Random integer between min and max (inclusive)
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random integer
   */
  randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

  /**
   * Utility: Random float between min and max
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random float
   */
  randomFloat: (min, max) => Math.random() * (max - min) + min,

  /**
   * Utility: Check if point is in rectangle
   * @param {number} px - Point X
   * @param {number} py - Point Y
   * @param {number} rx - Rectangle X
   * @param {number} ry - Rectangle Y
   * @param {number} rw - Rectangle width
   * @param {number} rh - Rectangle height
   * @returns {boolean} Whether point is inside
   */
  pointInRect: (px, py, rx, ry, rw, rh) => px >= rx && px <= rx + rw && py >= ry && py <= ry + rh,

  /**
   * Utility: Check rectangle collision
   * @param {Object} r1 - First rectangle {x, y, width, height}
   * @param {Object} r2 - Second rectangle {x, y, width, height}
   * @returns {boolean} Whether rectangles collide
   */
  rectCollision: (r1, r2) =>
    r1.x < r2.x + r2.width &&
    r1.x + r1.width > r2.x &&
    r1.y < r2.y + r2.height &&
    r1.y + r1.height > r2.y,

  /**
   * Utility: Distance between two points
   * @param {number} x1 - First point X
   * @param {number} y1 - First point Y
   * @param {number} x2 - Second point X
   * @param {number} y2 - Second point Y
   * @returns {number} Distance
   */
  distance: (x1, y1, x2, y2) => {
    var dx = x2 - x1;
    var dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
  },

  /**
   * Utility: Normalize angle to 0-2π range
   * @param {number} angle - Angle in radians
   * @returns {number} Normalized angle
   */
  normalizeAngle: (angle) => {
    while (angle < 0) angle += Math.PI * 2;
    while (angle >= Math.PI * 2) angle -= Math.PI * 2;
    return angle;
  },

  /**
   * Utility: Convert degrees to radians
   * @param {number} degrees - Angle in degrees
   * @returns {number} Angle in radians
   */
  degToRad: (degrees) => degrees * (Math.PI / 180),

  /**
   * Utility: Convert radians to degrees
   * @param {number} radians - Angle in radians
   * @returns {number} Angle in degrees
   */
  radToDeg: (radians) => radians * (180 / Math.PI),

  /**
   * Utility: Easing functions
   */
  Easing: {
    linear: (t) => t,
    easeIn: (t) => t * t,
    easeOut: (t) => 1 - (1 - t) * (1 - t),
    easeInOut: (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2),
    bounce: (t) => {
      var n1 = 7.5625;
      var d1 = 2.75;
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
  },

  /**
   * Animation helper: Animate value over time
   * @param {Object} options - Animation options
   * @param {number} options.from - Start value
   * @param {number} options.to - End value
   * @param {number} options.duration - Duration in ms
   * @param {Function} options.easing - Easing function
   * @param {Function} options.onUpdate - Callback on each update
   * @param {Function} options.onComplete - Callback on completion
   */
  animate: function (options) {
    var startTime = Date.now();
    var from = options.from;
    var to = options.to;
    var duration = options.duration;
    var easing = options.easing || this.Easing.linear;
    var onUpdate = options.onUpdate;
    var onComplete = options.onComplete;

    function update() {
      var elapsed = Date.now() - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var easedProgress = easing(progress);
      var value = from + (to - from) * easedProgress;

      if (onUpdate) {
        onUpdate(value);
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else if (onComplete) {
        onComplete();
      }
    }

    requestAnimationFrame(update);
  },

  /**
   * Performance: Mark start of performance measurement
   * @param {string} label - Measurement label
   */
  perfStart: (label) => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(label + '-start');
    }
  },

  /**
   * Performance: Mark end and measure
   * @param {string} label - Measurement label
   */
  perfEnd: (label) => {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(label + '-end');
      performance.measure(label, label + '-start', label + '-end');
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

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Engine;
}

export { Engine, engine };
export default Engine;
