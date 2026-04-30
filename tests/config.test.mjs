/**
 * Tests for Configuration Module
 */

import { beforeEach, describe, expect, it } from '@jest/globals';
import {
  CANVAS_H,
  CANVAS_W,
  gameState,
  PALETTE,
  PLAYER_H,
  PLAYER_SPEED,
  PLAYER_W,
  resetGameState,
  VERSION,
} from '../src/config.mjs';

describe('Configuration Module', () => {
  describe('PALETTE', () => {
    it('should be frozen', () => {
      expect(Object.isFrozen(PALETTE)).toBe(true);
    });

    it('should have all required colors', () => {
      expect(PALETTE.nightBlue).toBe('#1A1C20');
      expect(PALETTE.violetBlue).toBe('#2D3047');
      expect(PALETTE.darkForest).toBe('#3D5A3C');
      expect(PALETTE.oliveGreen).toBe('#5C7A4B');
      expect(PALETTE.greyBrown).toBe('#8B7D6B');
      expect(PALETTE.fadedBeige).toBe('#B8A88A');
      expect(PALETTE.earthBrown).toBe('#6B5B4F');
      expect(PALETTE.burntOrange).toBe('#C4956A');
      expect(PALETTE.lanternYel).toBe('#D4A843');
      expect(PALETTE.creamPaper).toBe('#E8DCC8');
      expect(PALETTE.alumGrey).toBe('#A0A8B0');
      expect(PALETTE.slateGrey).toBe('#4A5568');
    });

    it('should have exactly 12 colors', () => {
      expect(Object.keys(PALETTE).length).toBe(12);
    });
  });

  describe('Constants', () => {
    it('should have correct canvas dimensions', () => {
      expect(CANVAS_W).toBe(400);
      expect(CANVAS_H).toBe(250);
    });

    it('should have correct player constants', () => {
      expect(PLAYER_SPEED).toBe(1.6);
      expect(PLAYER_W).toBe(10);
      expect(PLAYER_H).toBe(14);
    });

    it('should have version string', () => {
      expect(typeof VERSION).toBe('string');
      expect(VERSION).toContain('es6');
    });
  });

  describe('gameState', () => {
    beforeEach(() => {
      resetGameState();
    });

    it('should have initial area as piazze', () => {
      expect(gameState.currentArea).toBe('piazze');
    });

    it('should have initial phase as title', () => {
      expect(gameState.gamePhase).toBe('title');
    });

    it('should have empty cluesFound array', () => {
      expect(Array.isArray(gameState.cluesFound)).toBe(true);
      expect(gameState.cluesFound.length).toBe(0);
    });

    it('should have default player name', () => {
      expect(gameState.playerName).toBe('Detective Maurizio');
    });

    it('should have player with correct dimensions', () => {
      expect(gameState.player.w).toBe(PLAYER_W);
      expect(gameState.player.h).toBe(PLAYER_H);
    });

    it('should have all NPC states initialized to 0', () => {
      expect(gameState.npcStates.ruggeri).toBe(0);
      expect(gameState.npcStates.teresa).toBe(0);
      expect(gameState.npcStates.neri).toBe(0);
      expect(gameState.npcStates.valli).toBe(0);
      expect(gameState.npcStates.anselmo).toBe(0);
      expect(gameState.npcStates.don_pietro).toBe(0);
    });

    it('should have music enabled by default', () => {
      expect(gameState.musicEnabled).toBe(true);
    });

    it('should have puzzleSolved as false initially', () => {
      expect(gameState.puzzleSolved).toBe(false);
    });

    it('should show minimap by default', () => {
      expect(gameState.showMiniMap).toBe(true);
    });
  });

  describe('resetGameState', () => {
    it('should reset modified state to initial values', () => {
      gameState.cluesFound.push('test-clue');
      gameState.gamePhase = 'playing';
      gameState.puzzleSolved = true;

      resetGameState();

      expect(gameState.cluesFound).toEqual([]);
      expect(gameState.gamePhase).toBe('title');
      expect(gameState.puzzleSolved).toBe(false);
    });

    it('should reset player position', () => {
      gameState.player.x = 999;
      gameState.player.y = 999;

      resetGameState();

      expect(gameState.player.x).toBe(195);
      expect(gameState.player.y).toBe(188);
    });

    it('should reset NPC states', () => {
      gameState.npcStates.ruggeri = 2;
      gameState.npcStates.teresa = 1;

      resetGameState();

      expect(gameState.npcStates.ruggeri).toBe(0);
      expect(gameState.npcStates.teresa).toBe(0);
    });
  });
});
