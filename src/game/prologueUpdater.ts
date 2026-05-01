/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    PROLOGUE UPDATER
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Handles prologue cutscene auto-advance logic.
 * Extracted from loop.ts.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { GameState } from '../types.js';

declare const gameState: GameState;

const PROLOGUE_TIMINGS: number[] = [150, 250, 150, 180, 200, 180, 150, 200, 120];
const PROLOGUE_TOTAL_STEPS = 9;

/**
 * Update prologue cutscene state.
 * Advances step based on frame timings.
 * @returns true if prologue completed and transitioned to intro
 */
export function updatePrologue(): boolean {
  gameState.prologueTimer++;
  const step = gameState.prologueStep;

  if (step < PROLOGUE_TIMINGS.length &&
      gameState.prologueTimer >= PROLOGUE_TIMINGS[step]) {
    gameState.prologueTimer = 0;
    gameState.prologueStep++;

    if (gameState.prologueStep >= PROLOGUE_TOTAL_STEPS) {
      gameState.gamePhase = 'intro';
      gameState.introSlide = 0;
      return true;
    }
  }
  return false;
}

/**
 * Get prologue timings array
 */
export function getPrologueTimings(): number[] {
  return PROLOGUE_TIMINGS;
}

/**
 * Get total prologue steps
 */
export function getPrologueTotalSteps(): number {
  return PROLOGUE_TOTAL_STEPS;
}

// Global exports
if (typeof window !== 'undefined') {
  window.updatePrologue = updatePrologue;
}
