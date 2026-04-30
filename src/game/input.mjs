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

class InputManager {
  constructor() {
    this.keys = new Set();
    this.previousKeys = new Set();
    this.touchStart = null;
    this.touchEnabled = 'ontouchstart' in window;
  }

  /**
   * Initialize input listeners
   */
  init() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));

    if (this.touchEnabled) {
      this._initTouch();
    }

    console.log('[InputManager] Initialized');
  }

  /**
   * Handle key down events
   * @param {KeyboardEvent} e
   */
  handleKeyDown(e) {
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
   * @param {KeyboardEvent} e
   */
  handleKeyUp(e) {
    this.keys.delete(e.key);
    gameState.keys[e.key] = false;
  }

  /**
   * Check if key is pressed
   * @param {string} key
   * @returns {boolean}
   */
  isPressed(key) {
    return this.keys.has(key);
  }

  /**
   * Check if key was just pressed this frame
   * @param {string} key
   * @returns {boolean}
   */
  isJustPressed(key) {
    return this.keys.has(key) && !this.previousKeys.has(key);
  }

  /**
   * Update previous key state (call at end of frame)
   */
  update() {
    this.previousKeys = new Set(this.keys);
  }

  /**
   * Handle phase transition keys
   * @param {string} ph
   * @param {string} key
   * @returns {boolean} Whether a transition was handled
   * @private
   */
  _handlePhaseTransitions(ph, key) {
    if (key !== 'Enter') return false;

    const transitions = {
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
   * @param {string} key
   * @param {KeyboardEvent} e
   * @private
   */
  _handlePlayingKeys(key, e) {
    gameState.keys[key] = true;

    const actions = {
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
   * @param {KeyboardEvent} e
   * @private
   */
  _toggleMiniMap(e) {
    gameState.showMiniMap = !gameState.showMiniMap;
    showToast(gameState.showMiniMap ? 'Minimappa visibile' : 'Minimappa nascosta');
    e.preventDefault();
  }

  /**
   * Handle overlay close keys
   * @param {string} ph
   * @param {string} key
   * @param {KeyboardEvent} e
   * @private
   */
  _handleOverlayKeys(ph, key, e) {
    if (key !== 'Escape') return;

    const closeActions = {
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
   * @private
   */
  _initTouch() {
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
export function handleKeyDown(e) { inputManager.handleKeyDown(e); }
export function handleKeyUp(e) { inputManager.handleKeyUp(e); }

// Legacy player movement function (preserved for compatibility)
export function updatePlayerPosition() {
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

  // Check collider collisions
  if (area?.colliders) {
    for (const col of area.colliders) {
      if (rectCollision(nx, ny, p.w, p.h, col.x, col.y, col.w, col.h)) {
        nx = p.x;
        ny = p.y;
        break;
      }
    }
  }

  // Check NPC collisions
  if (area?.npcs) {
    for (const npc of area.npcs) {
      if (rectCollision(nx, ny, p.w, p.h, npc.x - 6, npc.y - 6, 12, 18)) {
        nx = p.x;
        ny = p.y;
        break;
      }
    }
  }

  p.x = nx;
  p.y = ny;
  if (dx !== 0 || dy !== 0) p.frame = (p.frame + 0.15) % 4;
}

// Global exports
if (typeof window !== 'undefined') {
  window.InputManager = InputManager;
  window.inputManager = inputManager;
}

export { InputManager, inputManager };
export default inputManager;
