/**
 * Tests for GameStore and SaveLoad System
 */

import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { GameStore, gameStore } from '../src/game/store.mjs';
import { SaveLoadSystem, saveLoad } from '../src/game/saveLoad.mjs';

describe('GameStore (Reactive State)', () => {
  let store;

  beforeEach(() => {
    // Create fresh instance for each test
    store = new GameStore();
    store.init({ health: 100, score: 0 });
    store.trackHistory = false;
  });

  it('should initialize with state', () => {
    expect(store.get('health')).toBe(100);
    expect(store.get('score')).toBe(0);
  });

  it('should get state value', () => {
    expect(store.get('health')).toBe(100);
  });

  it('should set state value', () => {
    store.set('health', 80);
    expect(store.get('health')).toBe(80);
  });

  it('should not notify if value unchanged', () => {
    const callback = jest.fn();
    store.subscribe('health', callback);
    store.set('health', 100);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should notify subscribers on change', () => {
    const callback = jest.fn();
    store.subscribe('health', callback);
    store.set('health', 80);
    expect(callback).toHaveBeenCalledWith(80, 100, 'health');
  });

  it('should notify global subscribers', () => {
    const callback = jest.fn();
    store.subscribeGlobal(callback);
    store.set('score', 10);
    expect(callback).toHaveBeenCalledWith('score', 10, 0);
  });

  it('should support multiple subscribers', () => {
    const cb1 = jest.fn();
    const cb2 = jest.fn();
    store.subscribe('health', cb1);
    store.subscribe('health', cb2);
    store.set('health', 50);
    expect(cb1).toHaveBeenCalled();
    expect(cb2).toHaveBeenCalled();
  });

  it('should unsubscribe correctly', () => {
    const callback = jest.fn();
    const unsub = store.subscribe('health', callback);
    unsub();
    store.set('health', 50);
    expect(callback).not.toHaveBeenCalled();
  });

  it('should set multiple values', () => {
    store.setMultiple({ health: 90, score: 5 });
    expect(store.get('health')).toBe(90);
    expect(store.get('score')).toBe(5);
  });

  it('should get full state', () => {
    const state = store.getState();
    expect(state.health).toBe(100);
    expect(state.score).toBe(0);
  });

  it('should reset state', () => {
    store.set('health', 50);
    store.reset({ health: 100, score: 0 });
    expect(store.get('health')).toBe(100);
  });

  it('should track history when enabled', () => {
    store.trackHistory = true;
    store.set('health', 80);
    const history = store.getHistory();
    expect(history.length).toBe(1);
    expect(history[0].key).toBe('health');
    expect(history[0].oldValue).toBe(100);
    expect(history[0].newValue).toBe(80);
  });

  it('should clear history', () => {
    store.trackHistory = true;
    store.set('health', 80);
    store.clearHistory();
    expect(store.getHistory().length).toBe(0);
  });

  it('should set nested path', () => {
    store.init({ player: { x: 0, y: 0 } });
    store.setPath('player.x', 100);
    expect(store.get('player').x).toBe(100);
  });

  it('should create computed property', () => {
    store.init({ a: 10, b: 20 });
    store.computed('sum', (a, b) => a + b, ['a', 'b']);
    expect(store.get('sum')).toBe(30);
  });
});

describe('SaveLoad System', () => {
  beforeEach(() => {
    // Clear localStorage
    localStorage.clear();
    saveLoad.currentSlot = 'slot1';
    global.showToast = () => {};
    global.gameState = {
      currentArea: 'piazze',
      player: { x: 100, y: 100 },
      cluesFound: [],
      npcStates: {},
      playerName: 'Test',
      playerColors: {},
      puzzleSolved: false,
      puzzleAttempts: 0,
      radioSolved: false,
      npcTrust: {}
    };
    global.StoryManager = {
      serialize: () => ({}),
      deserialize: () => {},
      getStats: () => ({}),
      stats: { totalPlayTime: 0 }
    };
  });

  it('should be instantiable', () => {
    const sls = new SaveLoadSystem();
    expect(sls).toBeInstanceOf(SaveLoadSystem);
  });

  it('should have default slot', () => {
    expect(saveLoad.currentSlot).toBe('slot1');
  });

  it('should not have save initially', () => {
    expect(saveLoad.hasSave('slot1')).toBe(false);
  });

  it('should save game state', () => {
    const result = saveLoad.save('slot1');
    expect(result).toBe(true);
    expect(saveLoad.hasSave('slot1')).toBe(true);
  });

  it('should load game state', () => {
    saveLoad.save('slot1');
    const result = saveLoad.load('slot1');
    expect(result).toBe(true);
  });

  it('should return false for non-existent save', () => {
    const result = saveLoad.load('nonexistent');
    expect(result).toBe(false);
  });

  it('should delete save', () => {
    saveLoad.save('slot1');
    expect(saveLoad.hasSave('slot1')).toBe(true);
    saveLoad.deleteSave('slot1');
    expect(saveLoad.hasSave('slot1')).toBe(false);
  });

  it('should list all saves', () => {
    const saves = saveLoad.getAllSaves();
    expect(Array.isArray(saves)).toBe(true);
    expect(saves.length).toBe(3); // slot1, slot2, slot3
  });

  it('should export save as string', () => {
    saveLoad.save('slot1');
    const exported = saveLoad.exportSave('slot1');
    expect(typeof exported).toBe('string');
    expect(JSON.parse(exported).version).toBeDefined();
  });

  it('should import valid save', () => {
    const saveData = {
      version: '2.0.0',
      timestamp: Date.now(),
      gameState: {
        currentArea: 'piazze',
        player: { x: 100, y: 100 },
        cluesFound: [],
        npcStates: {},
        playerName: 'Test',
        playerColors: {},
        puzzleSolved: false,
        puzzleAttempts: 0,
        radioSolved: false,
        npcTrust: {}
      },
      story: {},
      stats: {},
      playTime: 0
    };
    const result = saveLoad.importSave(JSON.stringify(saveData), 'slot2');
    expect(result).toBe(true);
    expect(saveLoad.hasSave('slot2')).toBe(true);
  });

  it('should reject invalid import', () => {
    const result = saveLoad.importSave('invalid json', 'slot2');
    expect(result).toBe(false);
  });

  it('should clear all saves', () => {
    saveLoad.save('slot1');
    saveLoad.save('slot2');
    saveLoad.clearAll();
    expect(saveLoad.hasSave('slot1')).toBe(false);
    expect(saveLoad.hasSave('slot2')).toBe(false);
  });
});
