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

type ListenerCallback = (newValue: unknown, oldValue: unknown, key: string) => void;
type GlobalListenerCallback = (key: string, newValue: unknown, oldValue: unknown) => void;

interface HistoryEntry {
  timestamp: number;
  key: string;
  oldValue: unknown;
  newValue: unknown;
}

class GameStore {
  private _state: Record<string, unknown>;
  private _listeners: Map<string, Set<ListenerCallback>>;
  private _globalListeners: Set<GlobalListenerCallback>;
  private _history: HistoryEntry[];

  /** Enable history tracking */
  trackHistory: boolean;

  /** Max history entries */
  maxHistory: number;

  constructor() {
    this._state = {};
    this._listeners = new Map();
    this._globalListeners = new Set();
    this.trackHistory = false;
    this._history = [];
    this.maxHistory = 100;
  }

  /**
   * Initialize store with default state
   */
  init(initialState: Record<string, unknown>): void {
    this._state = { ...initialState };
    console.log('[GameStore] Initialized');
  }

  /**
   * Get state value
   */
  get(key: string): unknown {
    return this._state[key];
  }

  /**
   * Get entire state (shallow copy)
   */
  getState(): Record<string, unknown> {
    return { ...this._state };
  }

  /**
   * Set state value (reactive)
   */
  set(key: string, value: unknown): void {
    const oldValue = this._state[key];
    if (oldValue === value) return;

    this._state[key] = value;
    this._notify(key, oldValue, value);
    this._trackHistory(key, oldValue, value);
  }

  /**
   * Set multiple values at once
   */
  setMultiple(updates: Record<string, unknown>): void {
    for (const [key, value] of Object.entries(updates)) {
      this.set(key, value);
    }
  }

  /**
   * Update nested property using dot notation
   */
  setPath(path: string, value: unknown): void {
    const keys = path.split('.');
    let current = this._state;

    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current)) {
        current[keys[i]] = {};
      }
      current = current[keys[i]] as Record<string, unknown>;
    }

    const lastKey = keys[keys.length - 1];
    const oldValue = current[lastKey];
    current[lastKey] = value;
    this._notify(path, oldValue, value);
  }

  /**
   * Subscribe to specific key changes
   * @returns Unsubscribe function
   */
  subscribe(key: string, callback: ListenerCallback): () => void {
    if (!this._listeners.has(key)) {
      this._listeners.set(key, new Set());
    }
    this._listeners.get(key)!.add(callback);

    return () => {
      this._listeners.get(key)?.delete(callback);
    };
  }

  /**
   * Subscribe to all changes
   * @returns Unsubscribe function
   */
  subscribeGlobal(callback: GlobalListenerCallback): () => void {
    this._globalListeners.add(callback);
    return () => {
      this._globalListeners.delete(callback);
    };
  }

  /**
   * Notify listeners of change
   */
  private _notify(key: string, oldValue: unknown, newValue: unknown): void {
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
   */
  private _trackHistory(key: string, oldValue: unknown, newValue: unknown): void {
    if (!this.trackHistory) return;

    this._history.push({
      timestamp: Date.now(),
      key,
      oldValue,
      newValue,
    });

    if (this._history.length > this.maxHistory) {
      this._history.shift();
    }
  }

  /**
   * Get change history
   */
  getHistory(): HistoryEntry[] {
    return [...this._history];
  }

  /**
   * Clear history
   */
  clearHistory(): void {
    this._history = [];
  }

  /**
   * Reset store to initial values
   */
  reset(initialState: Record<string, unknown>): void {
    const oldState = { ...this._state };
    this._state = { ...initialState };

    // Notify all keys
    for (const key of Object.keys(initialState)) {
      this._notify(key, oldState[key], initialState[key]);
    }
  }

  /**
   * Create a computed property
   */
  computed(name: string, computeFn: (...args: unknown[]) => unknown, deps: string[]): void {
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
