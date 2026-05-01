/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    MOVEMENT & COLLISION
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Player movement and collision resolution.
 * Extracted from input.ts to separate concerns.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { GameState } from '../types.js';

declare const gameState: GameState;
declare const PLAYER_SPEED: number;
declare const CANVAS_W: number;
declare const CANVAS_H: number;
declare function rectCollision(
  x1: number, y1: number, w1: number, h1: number,
  x2: number, y2: number, w2: number, h2: number
): boolean;

/**
 * Resolve collisions against area colliders and NPCs
 */
export function resolveCollisions(area: any, nx: number, ny: number, p: any): { x: number; y: number } {
  if (area?.colliders) {
    for (const col of area.colliders) {
      if (rectCollision(nx, ny, p.w, p.h, col.x, col.y, col.w, col.h)) {
        return { x: p.x, y: p.y };
      }
    }
  }
  if (area?.npcs) {
    for (const npc of area.npcs) {
      if (rectCollision(nx, ny, p.w, p.h, npc.x - 6, npc.y - 6, 12, 18)) {
        return { x: p.x, y: p.y };
      }
    }
  }
  return { x: nx, y: ny };
}

/**
 * Update player position based on input keys
 */
export function updatePlayerPosition(): void {
  const p = gameState.player;
  let dx = 0;
  let dy = 0;
  const k = gameState.keys;

  if (k['w'] || k['W'] || k['ArrowUp']) { dy = -PLAYER_SPEED; p.dir = 'up'; }
  if (k['s'] || k['S'] || k['ArrowDown']) { dy = PLAYER_SPEED; p.dir = 'down'; }
  if (k['a'] || k['A'] || k['ArrowLeft']) { dx = -PLAYER_SPEED; p.dir = 'left'; }
  if (k['d'] || k['D'] || k['ArrowRight']) { dx = PLAYER_SPEED; p.dir = 'right'; }

  if (dx !== 0 && dy !== 0) {
    dx *= 0.707;
    dy *= 0.707;
  }

  let nx = p.x + dx;
  let ny = p.y + dy;
  nx = Math.max(2, Math.min(CANVAS_W - p.w - 2, nx));
  ny = Math.max(2, Math.min(CANVAS_H - p.h - 2, ny));

  const area = (window as any).areas[gameState.currentArea];
  if (area?.walkableTop && ny < area.walkableTop) ny = area.walkableTop;

  const resolved = resolveCollisions(area, nx, ny, p);
  p.x = resolved.x;
  p.y = resolved.y;
  if (dx !== 0 || dy !== 0) p.frame = (p.frame + 0.15) % 4;
}

// Global exports
if (typeof window !== 'undefined') {
  window.resolveCollisions = resolveCollisions;
  window.updatePlayerPosition = updatePlayerPosition;
}
