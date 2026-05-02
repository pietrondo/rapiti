/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    INPUT MANAGER (ES6+ CLASS)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Centralized input handling with ES6+ class syntax.
 * Manages keyboard, touch, and mouse movement.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { GameState } from '../types.js';
import { updatePlayerPosition } from './movement.ts';

declare const gameState: GameState;
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

    // Mouse/Touch movement toward destination
    const canvas = document.getElementById('gameCanvas') || document.getElementById('pixi-canvas');
    if (canvas) {
       canvas.addEventListener('mousedown', (e) => this.handleMouseClick(e));
    }

    if (this.touchEnabled) {
      this._initTouch();
    }

    console.log('[InputManager] Initialized with Mouse support');
  }

  /**
   * Click to move player and interact
   */
  handleMouseClick(e: MouseEvent): void {
     if (gameState.gamePhase !== 'playing') return;
     const canvas = e.target as HTMLCanvasElement;
     const rect = canvas.getBoundingClientRect();
     const scale = (window as any).renderManager?.scale || 2;
     
     const clickX = (e.clientX - rect.left) / scale;
     const clickY = (e.clientY - rect.top) / scale;
     
     const p = gameState.player;
     const area = (window as any).areas[gameState.currentArea];
     
     // Check if clicked on NPC
     if (area?.npcs) {
        for (const n of area.npcs) {
           if (Math.abs(clickX - n.x) < 20 && Math.abs(clickY - n.y) < 25) {
              p.targetX = n.x - 16;
              p.targetY = n.y;
              (p as any).autoInteract = true;
              return;
           }
        }
     }
     
     // Check if clicked on Object
     const objects = (window as any).areaObjects?.[gameState.currentArea];
     if (objects) {
        for (const o of objects) {
           if (clickX > o.x && clickX < o.x + (o.w || 20) &&
               clickY > o.y && clickY < o.y + (o.h || 20)) {
              p.targetX = o.x + (o.w || 20) / 2 - 16;
              p.targetY = o.y + (o.h || 20) / 2;
              (p as any).autoInteract = true;
              return;
           }
        }
     }

     p.targetX = clickX - 16;
     p.targetY = clickY - 16;
     (p as any).autoInteract = false;
  }

  /**
   * Handle key down events
   */
  handleKeyDown(e: KeyboardEvent): void {
    const ph = gameState.gamePhase;
    const key = e.key;

    this.keys.add(key);

    // Cancel mouse movement if key is pressed
    if (['w', 'a', 's', 'd', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(key) >= 0) {
       (gameState.player as any).targetX = null;
       (gameState.player as any).autoInteract = false;
    }

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
   * Update previous key state and handle mouse pathfinding
   */
  update(): void {
    if (gameState.gamePhase === 'playing') {
       this._updateMouseMovement();
    }
    this.previousKeys = new Set(this.keys);
  }

  private _updateMouseMovement(): void {
     const p = gameState.player;
     if (p.targetX === null || p.targetX === undefined) return;
     
     const distThreshold = 4;
     let dx = 0;
     let dy = 0;
     
     if (Math.abs(p.x - (p.targetX as number)) > distThreshold) {
        dx = p.x < (p.targetX as number) ? 1 : -1;
        p.dir = dx > 0 ? 'right' : 'left';
     }
     if (Math.abs(p.y - (p.targetY as number)) > distThreshold) {
        dy = p.y < (p.targetY as number) ? 1 : -1;
        if (Math.abs(dy) > Math.abs(dx)) p.dir = dy > 0 ? 'down' : 'up';
     }
     
     if (dx === 0 && dy === 0) {
        if ((p as any).autoInteract) {
           (window as any).handleInteract();
           (p as any).autoInteract = false;
        }
        p.targetX = null;
        p.targetY = null;
     } else {
        updatePlayerPosition(dx, dy);
     }
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
          if (gameState.introSlide >= 2) (window as any).openCustomize();
        }
      },
      prologue: () => { gameState.gamePhase = 'tutorial'; },
      tutorial: () => {
        gameState.gamePhase = 'playing';
        (window as any).updateHUD();
      },
      ending: () => { (window as any).resetGame(); }
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
      'e': () => { (window as any).handleInteract(); e.preventDefault(); },
      'E': () => { (window as any).handleInteract(); e.preventDefault(); },
      'j': () => { (window as any).openJournal(); e.preventDefault(); },
      'J': () => { (window as any).openJournal(); e.preventDefault(); },
      'i': () => { (window as any).openInventory(); e.preventDefault(); },
      'I': () => { (window as any).openInventory(); e.preventDefault(); },
      't': () => { if ((window as any).canOpenDeduction()) { (window as any).openDeduction(); e.preventDefault(); } },
      'T': () => { if ((window as any).canOpenDeduction()) { (window as any).openDeduction(); e.preventDefault(); } },
      'n': () => { this._toggleMiniMap(e); },
      'N': () => { this._toggleMiniMap(e); },
      'm': () => { (window as any).toggleMusic(); e.preventDefault(); },
      'M': () => { (window as any).toggleMusic(); e.preventDefault(); }
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
    (window as any).showToast(gameState.showMiniMap ? 'Minimappa visibile' : 'Minimappa nascosta');
    e.preventDefault();
  }

  /**
   * Handle overlay close keys
   */
  private _handleOverlayKeys(ph: string, key: string, e: KeyboardEvent): void {
    if (key !== 'Escape') return;

    const closeActions: Record<string, () => void> = {
      dialogue: () => (window as any).closeDialogue(),
      journal: () => (window as any).closePanels(),
      inventory: () => (window as any).closePanels(),
      deduction: () => (window as any).closeDeduction(),
      radio: () => (window as any).closeRadioPuzzle(),
      scene: () => (window as any).closeScenePuzzle(),
      recorder: () => (window as any).closeRecorderPuzzle()
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
// Re-export for backward compatibility
export { updatePlayerPosition } from './movement.ts';

// Global exports
if (typeof window !== 'undefined') {
  window.InputManager = InputManager;
  window.inputManager = inputManager;
}

export { InputManager, inputManager };
export default inputManager;
