/* ═══════════════════════════════════════════════════════════════════════════════
   GAME RENDERER - Facade
   Backward compatibility re-exports.
   ═══════════════════════════════════════════════════════════════════════════════ */

export { renderArea } from './areaRenderer.mjs';
export { renderInteractionHint } from './hintRenderer.mjs';
export { drawSprite, renderPlayer } from './playerRenderer.mjs';

// Global re-export for backward compatibility
import * as areaRenderer from './areaRenderer.mjs';
import * as hintRenderer from './hintRenderer.mjs';
import * as playerRenderer from './playerRenderer.mjs';

window.GameRenderer = {
  renderArea: areaRenderer.renderArea,
  renderPlayer: playerRenderer.renderPlayer,
  drawSprite: playerRenderer.drawSprite,
  renderInteractionHint: hintRenderer.renderInteractionHint,
};
