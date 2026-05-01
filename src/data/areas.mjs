/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREAS - Facade re-exporting draw helpers
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Backward compatibility facade.
 * Common primitives moved to drawCommon.mjs.
 * Civic facades moved to civicDraw.mjs.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export {
  drawBarFacade,
  drawBarWindow,
  drawBench,
  drawChurchFacade,
  drawMunicipioFacade,
  drawNoticeBoard,
  drawPiazzaFountain,
  drawStripedAwning,
} from '../render/civicDraw.mjs';
export {
  drawLitWindow,
  drawTileRoof,
  drawVignette,
  drawWallTexture,
  getAreaTexture,
} from '../render/drawCommon.mjs';

import * as civicDraw from '../render/civicDraw.mjs';
// Global re-exports for backward compatibility
import * as drawCommon from '../render/drawCommon.mjs';

if (typeof window !== 'undefined') {
  Object.assign(window, drawCommon, civicDraw);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ...drawCommon, ...civicDraw };
}
