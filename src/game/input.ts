/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    INPUT MANAGER (ES6+ CLASS)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Centralized input handling with ES6+ class syntax.
 * Manages keyboard, touch, and gamepad input.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { GameState } from '../types.js';

declare const gameState: GameState;
declare const PLAYER_SPEED: number;
declare const CANVAS_W: number;
declare const CANVAS_H: number;
declare const areas: Record<string, any>;
declare function rectCollision(
  x1: number, y1: number, w1: number, h1: number,
  x2: number, y2: number, w2: number, h2: number
): boolean;
declare function handleInteract(): void;
declare function openJournal(): void;
declare function openInventory(): void;
declare function canOpenDeduction(): boolean;
declare function openDeduction(): void;
declare function toggleMusic(): void;
declare function showToast(msg: string): void;
declare function closeDialogue(): void;
declare function closePanels(): void;
declare function closeDeduction(): void;
declare function closeRadioPuzzle(): void;
declare function closeScenePuzzle(): void;
declare function closeRecorderPuzzle(): void;
declare function openCustomize(): void;
declare function updateHUD(): void;
declare function resetGame(): void;

interface TouchPoint {
  x: number;
  y: number;
}

class InputManager {
  keys: Set<string>;
  previousKeys: Set<string>;
  touchStart: TouchPoint | null;
  touchEnabled: boolean;

  constructor() {
    this.keys = new Set();
    this.previousKeys = new Set();
    this.touchStart = null;
    this.touchEnabled = 'ontouchstart' in window;
  }

  /**
   * Initialize input listeners
   */
  init(): void {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));

    if (this.touchEnabled) {
      this._initTouch();
    }

    console.log('[InputManager] Initialized');
  }

  /**
   * Handle key down events
   */
  handleKeyDown(e: KeyboardEvent): void {
    const ph = gameState.gamePhase;
    const key = e.key;

    this.keys.add(key);

    // Phase transitions
    if (this._handlePhaseTransitions(ph, key)) return;

    // Playing state
    if (ph === 'playing') {
      this._handlePlayingKeys(key, e);
    }

    // Overlay close keys
    this._handleOverlayKeys(ph, key, e);
  }

  /**
   * Handle key up events
   */
  handleKeyUp(e: KeyboardEvent): void {
    this.keys.delete(e.key);
    gameState.keys[e.key] = false;
  }

  /**
   * Check if key is pressed
   */
  isPressed(key: string): boolean {
    return this.keys.has(key);
  }

  /**
   * Check if key was just pressed this frame
   */
  isJustPressed(key: string): boolean {
    return this.keys.has(key) && !this.previousKeys.has(key);
  }

  /**
   * Update previous key state (call at end of frame)
   */
  update(): void {
    this.previousKeys = new Set(this.keys);
  }

  /**
   * Handle phase transition keys
   */
  private _handlePhaseTransitions(ph: string, key: string): boolean {
    if (key !== 'Enter') return false;

    const transitions: Record<string, () => void> = {
      title: () => {
        gameState.gamePhase = 'prologue_cutscene';
        gameState.prologueStep = 0;
        gameState.prologueTimer = 0;
      },
      prologue_cutscene: () => {
        gameState.gamePhase = 'intro';
        gameState.introSlide = 0;
      },
      intro: () => {
        if (gameState.introSlide >= 3) {
          gameState.gamePhase = 'tutorial';
        } else {
          gameState.introSlide++;
          if (gameState.introSlide >= 2) openCustomize();
        }
      },
      prologue: () => { gameState.gamePhase = 'tutorial'; },
      tutorial: () => {
        gameState.gamePhase = 'playing';
        updateHUD();
      },
      ending: () => { resetGame(); }
    };

    if (transitions[ph]) {
      transitions[ph]();
      return true;
    }

    return false;
  }

  /**
   * Handle playing state keys
   */
  private _handlePlayingKeys(key: string, e: KeyboardEvent): void {
    gameState.keys[key] = true;

    const actions: Record<string, () => void> = {
      'e': () => { handleInteract(); e.preventDefault(); },
      'E': () => { handleInteract(); e.preventDefault(); },
      'j': () => { openJournal(); e.preventDefault(); },
      'J': () => { openJournal(); e.preventDefault(); },
      'i': () => { openInventory(); e.preventDefault(); },
      'I': () => { openInventory(); e.preventDefault(); },
      't': () => { if (canOpenDeduction()) { openDeduction(); e.preventDefault(); } },
      'T': () => { if (canOpenDeduction()) { openDeduction(); e.preventDefault(); } },
      'n': () => { this._toggleMiniMap(e); },
      'N': () => { this._toggleMiniMap(e); },
      'm': () => { toggleMusic(); e.preventDefault(); },
      'M': () => { toggleMusic(); e.preventDefault(); }
    };

    if (actions[key]) {
      actions[key]();
    }
  }

  /**
   * Toggle minimap
   */
  private _toggleMiniMap(e: KeyboardEvent): void {
    gameState.showMiniMap = !gameState.showMiniMap;
    showToast(gameState.showMiniMap ? 'Minimappa visibile' : 'Minimappa nascosta');
    e.preventDefault();
  }

  /**
   * Handle overlay close keys
   */
  private _handleOverlayKeys(ph: string, key: string, e: KeyboardEvent): void {
    if (key !== 'Escape') return;

    const closeActions: Record<string, () => void> = {
      dialogue: () => closeDialogue(),
      journal: () => closePanels(),
      inventory: () => closePanels(),
      deduction: () => closeDeduction(),
      radio: () => closeRadioPuzzle(),
      scene: () => closeScenePuzzle(),
      recorder: () => closeRecorderPuzzle()
    };

    if (closeActions[ph]) {
      closeActions[ph]();
      e.preventDefault();
    }
  }

  /**
   * Initialize touch controls
   */
  private _initTouch(): void {
    document.addEventListener('touchstart', (e) => {
      this.touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    document.addEventListener('touchmove', (e) => {
      if (!this.touchStart) return;
      const dx = e.touches[0].clientX - this.touchStart.x;
      const dy = e.touches[0].clientY - this.touchStart.y;

      // Virtual joystick simulation
      gameState.keys['w'] = dy < -20;
      gameState.keys['s'] = dy > 20;
      gameState.keys['a'] = dx < -20;
      gameState.keys['d'] = dx > 20;
    });

    document.addEventListener('touchend', () => {
      this.touchStart = null;
      gameState.keys['w'] = false;
      gameState.keys['s'] = false;
      gameState.keys['a'] = false;
      gameState.keys['d'] = false;
    });
  }
}

// Singleton instance
const inputManager = new InputManager();

// Backward compatibility exports
export function handleKeyDown(e: KeyboardEvent): void { inputManager.handleKeyDown(e); }
export function handleKeyUp(e: KeyboardEvent): void { inputManager.handleKeyUp(e); }

function _resolveCollisions(area: any, nx: number, ny: number, p: any): { x: number; y: number } {
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

// Legacy player movement function (preserved for compatibility)
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

  const area = areas[gameState.currentArea];
  if (area?.walkableTop && ny < area.walkableTop) ny = area.walkableTop;

  const resolved = _resolveCollisions(area, nx, ny, p);
  p.x = resolved.x;
  p.y = resolved.y;
  if (dx !== 0 || dy !== 0) p.frame = (p.frame + 0.15) % 4;
}

// Global exports
if (typeof window !== 'undefined') {
  window.InputManager = InputManager;
  window.inputManager = inputManager;
}

export { InputManager, inputManager };
export default inputManager;
