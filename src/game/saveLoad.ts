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
  area?: string;
  name?: string;
  playTime?: number;
}

interface SaveSlotInfo {
  slot: string;
  timestamp: number | null;
  exists: boolean;
  meta?: SaveMeta;
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
  save(slot?: string, slotName?: string): boolean {
    try {
      const saveData = this._createSaveData();
      const key = this._getKey(slot);
      localStorage.setItem(key, JSON.stringify(saveData));

      // Update save metadata
      this._updateMeta(slot, {
         timestamp: saveData.timestamp,
         area: (window as any).gameState.currentArea,
         name: slotName || `Salvataggio ${new Date().toLocaleTimeString()}`,
         playTime: saveData.playTime
      });

      (window as any).showToast?.('Gioco salvato');
      return true;
    } catch (err) {
      console.error('[SaveLoadSystem] Save failed:', err);
      (window as any).showToast?.('Errore nel salvataggio');
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

      (window as any).showToast?.('Gioco caricato');
      return true;
    } catch (err) {
      console.error('[SaveLoadSystem] Load failed:', err);
      (window as any).showToast?.('Errore nel caricamento');
      return false;
    }
  }

  /**
   * Create save data object
   */
  private _createSaveData(): SaveData {
    const gs = (window as any).gameState;
    const sm = (window as any).StoryManager;
    return {
      version: '2.0.0',
      timestamp: Date.now(),
      gameState: {
        currentArea: gs.currentArea,
        player: { ...gs.player },
        cluesFound: [...gs.cluesFound],
        npcStates: { ...gs.npcStates },
        playerName: gs.playerName,
        playerColors: { ...gs.playerColors },
        puzzleSolved: gs.puzzleSolved,
        puzzleAttempts: gs.puzzleAttempts,
        radioSolved: gs.radioSolved,
        npcTrust: { ...gs.npcTrust },
        gameTime: gs.gameTime,
        gameDate: gs.gameDate
      },
      story: (sm?.serialize?.() ?? {}) as StorySaveData,
      stats: (sm?.getStats?.() ?? {}) as GameStats,
      playTime: sm?.stats?.totalPlayTime ?? 0,
    };
  }

  /**
   * Apply save data to game
   */
  private _applySaveData(saveData: SaveData): void {
    if (!saveData.gameState) return;

    const gs = (window as any).gameState;
    const saveGs = saveData.gameState;

    // Apply game state
    gs.currentArea = saveGs.currentArea ?? gs.currentArea;
    gs.player = { ...saveGs.player } as GameState['player'];
    gs.cluesFound = [...(saveGs.cluesFound ?? [])];
    gs.npcStates = { ...(saveGs.npcStates ?? {}) } as GameState['npcStates'];
    gs.playerName = saveGs.playerName ?? gs.playerName;
    gs.playerColors = { ...(saveGs.playerColors ?? {}) } as GameState['playerColors'];
    gs.puzzleSolved = saveGs.puzzleSolved ?? gs.puzzleSolved;
    gs.puzzleAttempts = saveGs.puzzleAttempts ?? gs.puzzleAttempts;
    gs.radioSolved = saveGs.radioSolved ?? gs.radioSolved;
    gs.npcTrust = { ...(saveGs.npcTrust ?? {}) } as GameState['npcTrust'];
    gs.gameTime = saveGs.gameTime ?? gs.gameTime;
    gs.gameDate = saveGs.gameDate ?? gs.gameDate;

    // Apply story state
    if (saveData.story) {
      (window as any).StoryManager?.deserialize?.(saveData.story);
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
      meta: meta[slot]
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
  private _updateMeta(slot: string | undefined, data: SaveMeta | null, remove = false): void {
    const meta = this._getMeta();
    const slotKey = slot || this.currentSlot;

    if (remove) {
      delete meta[slotKey];
    } else if (data) {
      meta[slotKey] = data;
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
   * Simulated Cloud Sync (Tauri Stub)
   */
  async syncCloud(): Promise<boolean> {
     console.log('[SaveLoadSystem] Syncing with cloud...');
     // Simula delay di rete
     await new Promise(resolve => setTimeout(resolve, 1500));
     (window as any).showToast?.('Sincronizzazione cloud completata');
     return true;
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
      this._updateMeta(slot, {
         timestamp: data.timestamp,
         area: data.gameState.currentArea,
         name: `Importato ${new Date().toLocaleDateString()}`
      });
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
