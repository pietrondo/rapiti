/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                         CONFIGURATION MODULE (COMPATIBILITY)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * This module is a compatibility re-export of src/config.ts.
 * It ensures that legacy .mjs and .js files share the SAME gameState instance
 * as the new TypeScript modules.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as config from './config.ts';

export const {
  PALETTE,
  CANVAS_W,
  CANVAS_H,
  PLAYER_SPEED,
  PLAYER_W,
  PLAYER_H,
  gameState,
  resetGameState,
  VERSION,
  BUILD_DATE,
  defaultPlayerColors,
  getColor,
} = config;

// Default export for commonjs/module mix if needed
export default config;
