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

import type { GameState, SaveData, StorySaveData, GameStats } from '../types.js';

interface SaveMeta {
  timestamp?: number;
}

interface SaveSlotInfo {
  slot: string;
  timestamp: number | null;
  exists: boolean;
}

class SaveLoadSystem {
  /** Storage key prefix */
  prefix: string;

  /** Current save slot */
  currentSlot: string;

  /** Auto-save interval in ms */
  autoSaveInterval: number;

  /** Auto-save timer ID */
  autoSaveTimer: ReturnType<typeof setInterval> | null;

  constructor() {
    this.prefix = 'sanceleste_';
    this.currentSlot = 'slot1';
    this.autoSaveInterval = 60000; // 1 minute
    this.autoSaveTimer = null;
  }

  /**
   * Initialize save/load system
   */
  init(): void {
    console.log('[SaveLoadSystem] Initialized');
  }

  /**
   * Get full storage key for slot
   */
  private _getKey(slot?: string): string {
    return `${this.prefix}save_${slot || this.currentSlot}`;
  }

  /**
   * Save current game state
   */
  save(slot?: string): boolean {
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
   */
  load(slot?: string): boolean {
    try {
      const key = this._getKey(slot);
      const data = localStorage.getItem(key);

      if (!data) {
        console.warn('[SaveLoadSystem] No save found');
        return false;
      }

      const saveData: SaveData = JSON.parse(data);
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
   */
  private _createSaveData(): SaveData {
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
      story: (StoryManager?.serialize?.() ?? {}) as StorySaveData,
      stats: (StoryManager?.getStats?.() ?? {}) as GameStats,
      playTime: StoryManager?.stats?.totalPlayTime ?? 0,
    };
  }

  /**
   * Apply save data to game
   */
  private _applySaveData(saveData: SaveData): void {
    if (!saveData.gameState) return;

    const gs = saveData.gameState;

    // Apply game state
    gameState.currentArea = gs.currentArea ?? gameState.currentArea;
    gameState.player = { ...gs.player } as GameState['player'];
    gameState.cluesFound = [...(gs.cluesFound ?? [])];
    gameState.npcStates = { ...(gs.npcStates ?? {}) } as GameState['npcStates'];
    gameState.playerName = gs.playerName ?? gameState.playerName;
    gameState.playerColors = { ...(gs.playerColors ?? {}) } as GameState['playerColors'];
    gameState.puzzleSolved = gs.puzzleSolved ?? gameState.puzzleSolved;
    gameState.puzzleAttempts = gs.puzzleAttempts ?? gameState.puzzleAttempts;
    gameState.radioSolved = gs.radioSolved ?? gameState.radioSolved;
    gameState.npcTrust = { ...(gs.npcTrust ?? {}) } as GameState['npcTrust'];

    // Apply story state
    if (saveData.story) {
      StoryManager?.deserialize?.(saveData.story);
    }
  }

  /**
   * Check if save exists
   */
  hasSave(slot?: string): boolean {
    const key = this._getKey(slot);
    return localStorage.getItem(key) !== null;
  }

  /**
   * Delete save slot
   */
  deleteSave(slot?: string): boolean {
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
   */
  getAllSaves(): SaveSlotInfo[] {
    const meta = this._getMeta();
    const slots = ['slot1', 'slot2', 'slot3'];

    return slots.map((slot) => ({
      slot,
      timestamp: meta[slot]?.timestamp || null,
      exists: this.hasSave(slot),
    }));
  }

  /**
   * Get save metadata
   */
  private _getMeta(): Record<string, SaveMeta> {
    try {
      const meta = localStorage.getItem(`${this.prefix}meta`);
      return meta ? JSON.parse(meta) : {};
    } catch {
      return {};
    }
  }

  /**
   * Update save metadata
   */
  private _updateMeta(slot: string | undefined, timestamp: number | null, remove = false): void {
    const meta = this._getMeta();
    const slotKey = slot || this.currentSlot;

    if (remove) {
      delete meta[slotKey];
    } else {
      meta[slotKey] = { timestamp: timestamp ?? undefined };
    }

    localStorage.setItem(`${this.prefix}meta`, JSON.stringify(meta));
  }

  /**
   * Start auto-save
   */
  startAutoSave(): void {
    this.stopAutoSave();
    this.autoSaveTimer = setInterval(() => {
      this.save();
    }, this.autoSaveInterval);
  }

  /**
   * Stop auto-save
   */
  stopAutoSave(): void {
    if (this.autoSaveTimer) {
      clearInterval(this.autoSaveTimer);
      this.autoSaveTimer = null;
    }
  }

  /**
   * Export save as JSON string (for sharing)
   */
  exportSave(slot?: string): string | null {
    const key = this._getKey(slot);
    return localStorage.getItem(key);
  }

  /**
   * Import save from JSON string
   */
  importSave(jsonString: string, slot?: string): boolean {
    try {
      // Validate JSON
      const data = JSON.parse(jsonString) as SaveData;
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
  clearAll(): void {
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
