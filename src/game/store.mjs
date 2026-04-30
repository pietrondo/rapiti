/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    GAME STORE (REACTIVE STATE MANAGEMENT)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Central reactive state store with observer pattern.
 * Replaces direct gameState mutations for better debuggability.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class GameStore {
  constructor() {
    /** @type {Object} Internal state */
    this._state = {};

    /** @type {Map<string, Set<Function>>} Change listeners by key */
    this._listeners = new Map();

    /** @type {Set<Function>} Global change listeners */
    this._globalListeners = new Set();

    /** @type {boolean} Enable history tracking */
    this.trackHistory = false;

    /** @type {Array<{timestamp: number, key: string, oldValue: *, newValue: *}>} */
    this._history = [];

    /** @type {number} Max history entries */
    this.maxHistory = 100;
  }

  /**
   * Initialize store with default state
   * @param {Object} initialState
   */
  init(initialState) {
    this._state = { ...initialState };
    console.log('[GameStore] Initialized');
  }

  /**
   * Get state value
   * @param {string} key
   * @returns {*}
   */
  get(key) {
    return this._state[key];
  }

  /**
   * Get entire state (shallow copy)
   * @returns {Object}
   */
  getState() {
    return { ...this._state };
  }

  /**
   * Set state value (reactive)
   * @param {string} key
   * @param {*} value
   */
  set(key, value) {
    const oldValue = this._state[key];
    if (oldValue === value) return;

    this._state[key] = value;
    this._notify(key, oldValue, value);
    this._trackHistory(key, oldValue, value);
  }

  /**
   * Set multiple values at once
   * @param {Object} updates
   */
  setMultiple(updates) {
    for (const [key, value] of Object.entries(updates)) {
      this.set(key, value);
    }
  }

  /**
   * Update nested property using dot notation
   * @param {string} path - Dot notation path (e.g., 'player.x')
   * @param {*} value
   */
  setPath(path, value) {
    const keys = path.split('.');
    let current = this._state;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }

    const lastKey = keys[keys.length - 1];
    const oldValue = current[lastKey];
    current[lastKey] = value;
    this._notify(path, oldValue, value);
  }

  /**
   * Subscribe to specific key changes
   * @param {string} key
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  subscribe(key, callback) {
    if (!this._listeners.has(key)) {
      this._listeners.set(key, new Set());
    }
    this._listeners.get(key).add(callback);

    return () => {
      this._listeners.get(key)?.delete(callback);
    };
  }

  /**
   * Subscribe to all changes
   * @param {Function} callback
   * @returns {Function} Unsubscribe function
   */
  subscribeGlobal(callback) {
    this._globalListeners.add(callback);
    return () => {
      this._globalListeners.delete(callback);
    };
  }

  /**
   * Notify listeners of change
   * @param {string} key
   * @param {*} oldValue
   * @param {*} newValue
   * @private
   */
  _notify(key, oldValue, newValue) {
    // Key-specific listeners
    this._listeners.get(key)?.forEach((cb) => {
      try {
        cb(newValue, oldValue, key);
      } catch (err) {
        console.error(`[GameStore] Listener error for ${key}:`, err);
      }
    });

    // Global listeners
    this._globalListeners.forEach((cb) => {
      try {
        cb(key, newValue, oldValue);
      } catch (err) {
        console.error('[GameStore] Global listener error:', err);
      }
    });
  }

  /**
   * Track history
   * @param {string} key
   * @param {*} oldValue
   * @param {*} newValue
   * @private
   */
  _trackHistory(key, oldValue, newValue) {
    if (!this.trackHistory) return;

    this._history.push({
      timestamp: Date.now(),
      key,
      oldValue,
      newValue
    });

    if (this._history.length > this.maxHistory) {
      this._history.shift();
    }
  }

  /**
   * Get change history
   * @returns {Array}
   */
  getHistory() {
    return [...this._history];
  }

  /**
   * Clear history
   */
  clearHistory() {
    this._history = [];
  }

  /**
   * Reset store to initial values
   * @param {Object} initialState
   */
  reset(initialState) {
    const oldState = { ...this._state };
    this._state = { ...initialState };

    // Notify all keys
    for (const key of Object.keys(initialState)) {
      this._notify(key, oldState[key], initialState[key]);
    }
  }

  /**
   * Create a computed property
   * @param {string} name
   * @param {Function} computeFn
   * @param {Array<string>} deps - Dependencies
   */
  computed(name, computeFn, deps) {
    const update = () => {
      const values = deps.map((d) => this.get(d));
      this.set(name, computeFn(...values));
    };

    deps.forEach((dep) => this.subscribe(dep, update));
    update();
  }
}

// Singleton instance
const gameStore = new GameStore();

// Global exports
if (typeof window !== 'undefined') {
  window.GameStore = GameStore;
  window.gameStore = gameStore;
}

export { GameStore, gameStore };
export default gameStore;
