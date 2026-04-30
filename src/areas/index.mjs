/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    AREA MANAGER (ES6+ CLASS)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Central management for all game areas with ES6+ class syntax.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class AreaManager {
  constructor() {
    this.areas = new Map();
    this.currentArea = null;
  }

  /**
   * Register an area
   * @param {string} id - Area identifier
   * @param {Object} area - Area object
   */
  register(id, area) {
    this.areas.set(id, area);
  }

  /**
   * Get area by ID
   * @param {string} areaId
   * @returns {Object|null}
   */
  get(areaId) {
    return this.areas.get(areaId) || null;
  }

  /**
   * Get all registered areas
   * @returns {Array}
   */
  getAll() {
    return Array.from(this.areas.values()).filter((a) => a !== null);
  }

  /**
   * Get area names
   * @returns {Array<string>}
   */
  getIds() {
    return Array.from(this.areas.keys());
  }

  /**
   * Initialize all areas
   * @returns {AreaManager}
   */
  init() {
    for (const area of this.areas.values()) {
      area?.init?.();
    }
    console.log('[AreaManager] Initialized');
    return this;
  }

  /**
   * Update current area
   */
  update() {
    this.currentArea?.update?.();
  }

  /**
   * Draw current area
   * @param {CanvasRenderingContext2D} ctx
   */
  draw(ctx) {
    this.currentArea?.draw?.(ctx);
  }

  /**
   * Set current area
   * @param {string} areaId
   */
  setCurrent(areaId) {
    this.currentArea = this.get(areaId);
  }

  /**
   * Get current area
   * @returns {Object|null}
   */
  getCurrent() {
    return this.currentArea;
  }

  /**
   * Check if area exists
   * @param {string} areaId
   * @returns {boolean}
   */
  has(areaId) {
    return this.areas.has(areaId);
  }

  /**
   * Get area count
   * @returns {number}
   */
  count() {
    return this.areas.size;
  }
}

// Singleton instance
const areaManager = new AreaManager();

// Backward compatibility - register global areas
if (typeof PiazzeArea !== 'undefined') areaManager.register('piazze', PiazzeArea);
if (typeof ChiesaArea !== 'undefined') areaManager.register('chiesa', ChiesaArea);
if (typeof CimiteroArea !== 'undefined') areaManager.register('cimitero', CimiteroArea);
if (typeof GiardiniArea !== 'undefined') areaManager.register('giardini', GiardiniArea);
if (typeof BarExteriorArea !== 'undefined') areaManager.register('bar_exterior', BarExteriorArea);
if (typeof ResidenzialeArea !== 'undefined') areaManager.register('residenziale', ResidenzialeArea);
if (typeof IndustrialeArea !== 'undefined') areaManager.register('industriale', IndustrialeArea);
if (typeof PoliziaArea !== 'undefined') areaManager.register('polizia', PoliziaArea);

// Global exports
if (typeof window !== 'undefined') {
  window.AreaManager = AreaManager;
  window.areaManager = areaManager;
  window.Areas = areaManager; // backward compatibility
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { AreaManager, areaManager };
}

export { AreaManager, areaManager };
export default areaManager;
