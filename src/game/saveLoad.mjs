/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    SAVE / LOAD SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Persistent save/load system with localStorage support.
 * Handles serialization of game state, story progress, and player data.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

class SaveLoadSystem {
  constructor() {
    /** @type {string} Storage key prefix */
    this.prefix = 'sanceleste_';

    /** @type {string} Current save slot */
    this.currentSlot = 'slot1';

    /** @type {number} Auto-save interval in ms */
    this.autoSaveInterval = 60000; // 1 minute

    /** @type {number|null} Auto-save timer ID */
    this.autoSaveTimer = null;
  }

  /**
   * Initialize save/load system
   */
  init() {
    console.log('[SaveLoadSystem] Initialized');
  }

  /**
   * Get full storage key for slot
   * @param {string} [slot]
   * @returns {string}
   */
  _getKey(slot) {
    return `${this.prefix}save_${slot || this.currentSlot}`;
  }

  /**
   * Save current game state
   * @param {string} [slot] - Save slot name
   * @returns {boolean}
   */
  save(slot) {
    try {
      const saveData = this._createSaveData();
      const key = this._getKey(slot);
      localStorage.setItem(key, JSON.stringify(saveData));

      // Update save metadata
      this._updateMeta(slot, saveData.timestamp);

      showToast?.('Gioco salvato');
      return true;
    } catch (err) {
      console.error('[SaveLoadSystem] Save failed:', err);
      showToast?.('Errore nel salvataggio');
      return false;
    }
  }

  /**
   * Load game from slot
   * @param {string} [slot]
   * @returns {boolean}
   */
  load(slot) {
    try {
      const key = this._getKey(slot);
      const data = localStorage.getItem(key);

      if (!data) {
        console.warn('[SaveLoadSystem] No save found');
        return false;
      }

      const saveData = JSON.parse(data);
      this._applySaveData(saveData);

      showToast?.('Gioco caricato');
      return true;
    } catch (err) {
      console.error('[SaveLoadSystem] Load failed:', err);
      showToast?.('Errore nel caricamento');
      return false;
    }
  }

  /**
   * Create save data object
   * @returns {Object}
   * @private
   */
  _createSaveData() {
    return {
      version: '2.0.0',
      timestamp: Date.now(),
      gameState: {
        currentArea: gameState.currentArea,
        player: { ...gameState.player },
        cluesFound: [...gameState.cluesFound],
        npcStates: { ...gameState.npcStates },
        playerName: gameState.playerName,
        playerColors: { ...gameState.playerColors },
        puzzleSolved: gameState.puzzleSolved,
        puzzleAttempts: gameState.puzzleAttempts,
        radioSolved: gameState.radioSolved,
        npcTrust: { ...gameState.npcTrust },
      },
      story: StoryManager?.serialize?.() ?? {},
      stats: StoryManager?.getStats?.() ?? {},
      playTime: StoryManager?.stats?.totalPlayTime ?? 0,
    };
  }

  /**
   * Apply save data to game
   * @param {Object} saveData
   * @private
   */
  _applySaveData(saveData) {
    if (!saveData.gameState) return;

    const gs = saveData.gameState;

    // Apply game state
    gameState.currentArea = gs.currentArea;
    gameState.player = { ...gs.player };
    gameState.cluesFound = [...gs.cluesFound];
    gameState.npcStates = { ...gs.npcStates };
    gameState.playerName = gs.playerName;
    gameState.playerColors = { ...gs.playerColors };
    gameState.puzzleSolved = gs.puzzleSolved;
    gameState.puzzleAttempts = gs.puzzleAttempts;
    gameState.radioSolved = gs.radioSolved;
    gameState.npcTrust = { ...gs.npcTrust };

    // Apply story state
    if (saveData.story) {
      StoryManager?.deserialize?.(saveData.story);
    }
  }

  /**
   * Check if save exists
   * @param {string} [slot]
   * @returns {boolean}
   */
  hasSave(slot) {
    const key = this._getKey(slot);
    return localStorage.getItem(key) !== null;
  }

  /**
   * Delete save slot
   * @param {string} [slot]
   * @returns {boolean}
   */
  deleteSave(slot) {
    try {
      const key = this._getKey(slot);
      localStorage.removeItem(key);
      this._updateMeta(slot, null, true);
      return true;
    } catch (err) {
      console.error('[SaveLoadSystem] Delete failed:', err);
      return false;
    }
  }

  /**
   * Get all save slots info
   * @returns {Array<{slot: string, timestamp: number|null, exists: boolean}>}
   */
  getAllSaves() {
    const meta = this._getMeta();
    const slots = ['slot1', 'slot2', 'slot3'];

    return slots.map((slot) => ({
      slot,
      timestamp: meta[slot]?.timestamp || null,
      exists: this.hasSave(slot)
    }));
  }

  /**
   * Get save metadata
   * @returns {Object}
   * @private
   */
  _getMeta() {
    try {
      const meta = localStorage.getItem(`${this.prefix}meta`);
      return meta ? JSON.parse(meta) : {};
    } catch {
      return {};
    }
  }

  /**
   * Update save metadata
   * @param {string} slot
   * @param {number|null} timestamp
   * @param {boolean} [remove]
   * @private
   */
  _updateMeta(slot, timestamp, remove = false) {
    const meta = this._getMeta();

    if (remove) {
      delete meta[slot];
    } else {
      meta[slot] = { timestamp };
    }

    localStorage.setItem(`${this.prefix}meta`, JSON.stringify(meta));
  }

  /**
   * Start auto-save
   */
  startAutoSave() {
    this.stopAutoSave();
    this.autoSaveTimer = setInterval(() => {
      this.save();
    }, this.autoSaveInterval);
  }

  /**
   * Stop auto-save
   */
  stopAutoSave() {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /**
   * Export save as JSON string (for sharing)
   * @param {string} [slot]
   * @returns {string|null}
   */
  exportSave(slot) {
    const key = this._getKey(slot);
    return localStorage.getItem(key);
  }

  /**
   * Import save from JSON string
   * @param {string} jsonString
   * @param {string} [slot]
   * @returns {boolean}
   */
  importSave(jsonString, slot) {
    try {
      // Validate JSON
      const data = JSON.parse(jsonString);
      if (!data.version || !data.gameState) {
        throw new Error('Invalid save data');
      }

      const key = this._getKey(slot);
      localStorage.setItem(key, jsonString);
      this._updateMeta(slot, data.timestamp);
      return true;
    } catch (err) {
      console.error('[SaveLoadSystem] Import failed:', err);
      return false;
    }
  }

  /**
   * Clear all saves
   */
  clearAll() {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(this.prefix)) {
        localStorage.removeItem(key);
      }
    }
  }
}

// Singleton instance
const saveLoad = new SaveLoadSystem();

// Global exports
if (typeof window !== 'undefined') {
  window.SaveLoadSystem = SaveLoadSystem;
  window.saveLoad = saveLoad;
}

export { SaveLoadSystem, saveLoad };
export default saveLoad;
