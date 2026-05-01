/**
 * Tests for Input Handling Module
 */

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { CANVAS_H, CANVAS_W, gameState, PLAYER_SPEED, resetGameState } from '../src/config.mjs';

// Setup global variables BEFORE importing modules that use them
global.gameState = gameState;
global.CANVAS_W = CANVAS_W;
global.CANVAS_H = CANVAS_H;
global.PLAYER_SPEED = PLAYER_SPEED;

// Mock DOM methods (jsdom already provides document)
document.getElementById = jest.fn(() => ({
  classList: { add: jest.fn(), remove: jest.fn() },
  innerHTML: '',
  textContent: '',
}));

// Mock global clues array
global.clues = [];

// Mock delle dipendenze globali
global.areas = {
  piazze: {
    walkableTop: 80,
    colliders: [],
    npcs: [],
    exits: [],
  },
};

global.cluesMap = {};

global.rectCollision = (x1, y1, w1, h1, x2, y2, w2, h2) => {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
};

global.showToast = jest.fn();
global.openCustomize = jest.fn();
global.updateHUD = jest.fn();
global.resetGame = jest.fn();
global.openJournal = jest.fn();
global.openInventory = jest.fn();
global.canOpenDeduction = jest.fn(() => false);
global.openDeduction = jest.fn();
global.toggleMusic = jest.fn();
global.closeDialogue = jest.fn();
global.closePanels = jest.fn();
global.closeDeduction = jest.fn();
global.closeRadioPuzzle = jest.fn();
global.closeScenePuzzle = jest.fn();
global.closeRecorderPuzzle = jest.fn();
global.handleInteract = jest.fn();

// Import functions to test
import { handleKeyDown, handleKeyUp, updatePlayerPosition, InputManager } from '../src/game/input.ts';

describe('Input Handling', () => {
  beforeEach(() => {
    resetGameState();
    // Re-sync global after reset
    global.gameState = gameState;
    areas.piazze.colliders = [];
    areas.piazze.npcs = [];
    jest.clearAllMocks();
  });

  describe('handleKeyDown', () => {
    it('should start prologue from title on Enter', () => {
      gameState.gamePhase = 'title';
      const event = { key: 'Enter', preventDefault: jest.fn() };
      handleKeyDown(event);
      expect(gameState.gamePhase).toBe('prologue_cutscene');
      expect(gameState.prologueStep).toBe(0);
    });

    it('should skip cutscene on Enter during prologue_cutscene', () => {
      gameState.gamePhase = 'prologue_cutscene';
      const event = { key: 'Enter', preventDefault: jest.fn() };
      handleKeyDown(event);
      expect(gameState.gamePhase).toBe('intro');
    });

    it('should advance intro slides on Enter', () => {
      gameState.gamePhase = 'intro';
      gameState.introSlide = 0;
      const event = { key: 'Enter', preventDefault: jest.fn() };
      handleKeyDown(event);
      expect(gameState.introSlide).toBe(1);
    });

    it('should transition to tutorial after last intro slide', () => {
      gameState.gamePhase = 'intro';
      gameState.introSlide = 3;
      const event = { key: 'Enter', preventDefault: jest.fn() };
      handleKeyDown(event);
      expect(gameState.gamePhase).toBe('tutorial');
    });

    it('should start playing from tutorial on Enter', () => {
      gameState.gamePhase = 'tutorial';
      const event = { key: 'Enter', preventDefault: jest.fn() };
      handleKeyDown(event);
      expect(gameState.gamePhase).toBe('playing');
      expect(updateHUD).toHaveBeenCalled();
    });

    it('should reset game on Enter during ending', () => {
      gameState.gamePhase = 'ending';
      const event = { key: 'Enter', preventDefault: jest.fn() };
      handleKeyDown(event);
      expect(resetGame).toHaveBeenCalled();
    });

    it('should handle E key for interaction during playing', () => {
      gameState.gamePhase = 'playing';
      const event = { key: 'e', preventDefault: jest.fn() };
      handleKeyDown(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should handle J key for journal during playing', () => {
      gameState.gamePhase = 'playing';
      const event = { key: 'J', preventDefault: jest.fn() };
      handleKeyDown(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should handle I key for inventory during playing', () => {
      gameState.gamePhase = 'playing';
      const event = { key: 'i', preventDefault: jest.fn() };
      handleKeyDown(event);
      expect(event.preventDefault).toHaveBeenCalled();
    });

    it('should handle N key to toggle minimap', () => {
      gameState.gamePhase = 'playing';
      gameState.showMiniMap = true;
      const event = { key: 'n', preventDefault: jest.fn() };
      handleKeyDown(event);
      expect(gameState.showMiniMap).toBe(false);
      expect(showToast).toHaveBeenCalledWith('Minimappa nascosta');
    });

    it('should handle N key to show minimap again', () => {
      gameState.gamePhase = 'playing';
      gameState.showMiniMap = false;
      const event = { key: 'n', preventDefault: jest.fn() };
      handleKeyDown(event);
      expect(gameState.showMiniMap).toBe(true);
      expect(showToast).toHaveBeenCalledWith('Minimappa visibile');
    });
  });

  describe('handleKeyUp', () => {
    it('should clear key state', () => {
      gameState.keys.w = true;
      const event = { key: 'w' };
      handleKeyUp(event);
      expect(gameState.keys.w).toBe(false);
    });
  });

  describe('updatePlayerPosition', () => {
    beforeEach(() => {
      gameState.gamePhase = 'playing';
      gameState.player = { x: 100, y: 100, w: 10, h: 14, dir: 'down', frame: 0 };
      areas.piazze.colliders = [];
      areas.piazze.npcs = [];
    });

    it('should move player up when W is pressed', () => {
      gameState.keys.w = true;
      updatePlayerPosition();
      expect(gameState.player.y).toBeLessThan(100);
      expect(gameState.player.dir).toBe('up');
    });

    it('should move player down when S is pressed', () => {
      gameState.keys.s = true;
      updatePlayerPosition();
      expect(gameState.player.y).toBeGreaterThan(100);
      expect(gameState.player.dir).toBe('down');
    });

    it('should move player left when A is pressed', () => {
      gameState.keys.a = true;
      updatePlayerPosition();
      expect(gameState.player.x).toBeLessThan(100);
      expect(gameState.player.dir).toBe('left');
    });

    it('should move player right when D is pressed', () => {
      gameState.keys.d = true;
      updatePlayerPosition();
      expect(gameState.player.x).toBeGreaterThan(100);
      expect(gameState.player.dir).toBe('right');
    });

    it('should apply diagonal speed reduction', () => {
      gameState.keys.w = true;
      gameState.keys.d = true;
      const prevX = gameState.player.x;
      const prevY = gameState.player.y;
      updatePlayerPosition();
      const dx = Math.abs(gameState.player.x - prevX);
      const dy = Math.abs(gameState.player.y - prevY);
      expect(dx).toBeLessThan(PLAYER_SPEED);
      expect(dy).toBeLessThan(PLAYER_SPEED);
    });

    it('should keep player within canvas bounds (left/top)', () => {
      gameState.player.x = 5;
      gameState.player.y = 5;
      gameState.keys.a = true;
      gameState.keys.w = true;
      updatePlayerPosition();
      expect(gameState.player.x).toBeGreaterThanOrEqual(2);
      expect(gameState.player.y).toBeGreaterThanOrEqual(2);
    });

    it('should keep player within right/bottom bounds', () => {
      gameState.player.x = CANVAS_W - 15;
      gameState.player.y = CANVAS_H - 16;
      gameState.keys.d = true;
      gameState.keys.s = true;
      updatePlayerPosition();
      expect(gameState.player.x).toBeLessThanOrEqual(CANVAS_W - 12);
      expect(gameState.player.y).toBeLessThanOrEqual(CANVAS_H - 16);
    });

    it('should respect walkableTop boundary', () => {
      gameState.player.y = 85;
      gameState.keys.w = true;
      updatePlayerPosition();
      expect(gameState.player.y).toBeGreaterThanOrEqual(80);
    });

    it('should stop at colliders', () => {
      areas.piazze.colliders = [{ x: 90, y: 90, w: 30, h: 30 }];
      gameState.player.x = 80;
      gameState.player.y = 100;
      gameState.keys.d = true;
      updatePlayerPosition();
      // Player should not move into collider
      expect(gameState.player.x).toBe(80);
    });

    it('should stop at NPCs', () => {
      areas.piazze.npcs = [{ x: 110, y: 107 }];
      gameState.player.x = 100;
      gameState.player.y = 100;
      gameState.keys.d = true;
      updatePlayerPosition();
      expect(gameState.player.x).toBe(100);
    });

    it('should animate player frame when moving', () => {
      gameState.keys.w = true;
      updatePlayerPosition();
      expect(gameState.player.frame).toBeGreaterThan(0);
    });

    it('should not animate when standing still', () => {
      gameState.player.frame = 0;
      updatePlayerPosition();
      expect(gameState.player.frame).toBe(0);
    });

    it('should handle ArrowUp key', () => {
      gameState.keys.ArrowUp = true;
      updatePlayerPosition();
      expect(gameState.player.y).toBeLessThan(100);
      expect(gameState.player.dir).toBe('up');
    });

    it('should handle ArrowDown key', () => {
      gameState.keys.ArrowDown = true;
      updatePlayerPosition();
      expect(gameState.player.y).toBeGreaterThan(100);
      expect(gameState.player.dir).toBe('down');
    });
  });
});
