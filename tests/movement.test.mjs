"use strict";

/**
 * Tests for Movement & Collision Module
 */

import { beforeEach, describe, expect, it, jest } from '@jest/globals';

// 1. Setup global mocks FIRST
global.areas = {
  piazze: {
    walkableTop: 80,
    colliders: [],
    npcs: [],
    exits: [],
  },
};

global.rectCollision = jest.fn((x1, y1, w1, h1, x2, y2, w2, h2) => {
  return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2;
});

// Attach to window for modules that use window.xxx
if (typeof window !== 'undefined') {
  window.areas = global.areas;
  window.rectCollision = global.rectCollision;
}

// 2. Import config and types
import { CANVAS_H, CANVAS_W, gameState, PLAYER_SPEED, resetGameState } from '../src/config.ts';
global.gameState = gameState;
global.CANVAS_W = CANVAS_W;
global.CANVAS_H = CANVAS_H;
global.PLAYER_SPEED = PLAYER_SPEED;

// 3. Import modules under test
import { resolveCollisions, updatePlayerPosition } from '../src/game/movement.ts';

describe('Movement & Collision', () => {
  beforeEach(() => {
    resetGameState();
    global.gameState = gameState;
    gameState.gamePhase = 'playing';
    if (global.areas) {
      global.areas.piazze.colliders = [];
      global.areas.piazze.npcs = [];
      global.areas.piazze.walkableTop = 80;
    }
    jest.clearAllMocks();
  });

  describe('resolveCollisions', () => {
    it('should return new position when no colliders or NPCs present', () => {
      const area = {};
      const p = { x: 100, y: 100, w: 10, h: 14 };
      const result = resolveCollisions(area, 110, 110, p);
      expect(result).toEqual({ x: 110, y: 110 });
    });

    it('should return original position (blocked) when colliding with a collider', () => {
      const area = {
        colliders: [{ x: 50, y: 50, w: 100, h: 100 }],
      };
      const p = { x: 30, y: 70, w: 10, h: 14 };
      // nx=45: right edge 45+10=55 > collider left 50 → collision
      const result = resolveCollisions(area, 45, 70, p);
      expect(result).toEqual({ x: 30, y: 70 });
    });

    it('should allow movement when new position does not touch collider', () => {
      const area = {
        colliders: [{ x: 50, y: 50, w: 100, h: 100 }],
      };
      const p = { x: 10, y: 10, w: 10, h: 14 };
      const result = resolveCollisions(area, 15, 10, p);
      expect(result).toEqual({ x: 15, y: 10 });
    });

    it('should return original position when colliding with an NPC', () => {
      const area = {
        npcs: [{ x: 110, y: 107 }],
      };
      const p = { x: 100, y: 100, w: 10, h: 14 };
      const result = resolveCollisions(area, 105, 100, p);
      expect(result).toEqual({ x: 100, y: 100 });
    });

    it('should allow movement when not colliding with NPC', () => {
      const area = {
        npcs: [{ x: 200, y: 200 }],
      };
      const p = { x: 100, y: 100, w: 10, h: 14 };
      const result = resolveCollisions(area, 105, 100, p);
      expect(result).toEqual({ x: 105, y: 100 });
    });

    it('should check colliders before NPCs (collider takes priority)', () => {
      const area = {
        colliders: [{ x: 100, y: 90, w: 20, h: 20 }],
        npcs: [{ x: 250, y: 250 }],
      };
      const p = { x: 80, y: 95, w: 10, h: 14 };
      const result = resolveCollisions(area, 95, 95, p);
      expect(result).toEqual({ x: 80, y: 95 });
    });

    it('should handle area without colliders property (undefined/empty)', () => {
      const area = { npcs: [] };
      const p = { x: 50, y: 50, w: 10, h: 14 };
      const result = resolveCollisions(area, 60, 60, p);
      expect(result).toEqual({ x: 60, y: 60 });
    });

    it('should handle area without npcs property (undefined/empty)', () => {
      const area = { colliders: [] };
      const p = { x: 50, y: 50, w: 10, h: 14 };
      const result = resolveCollisions(area, 60, 60, p);
      expect(result).toEqual({ x: 60, y: 60 });
    });

    it('should handle null/undefined area gracefully', () => {
      const p = { x: 50, y: 50, w: 10, h: 14 };
      const result = resolveCollisions(null, 60, 60, p);
      expect(result).toEqual({ x: 60, y: 60 });
    });

    it('should accurately compute AABB collision (right edge touching left edge of collider)', () => {
      const area = {
        colliders: [{ x: 50, y: 0, w: 50, h: 200 }],
      };
      const p = { x: 30, y: 50, w: 10, h: 14 };
      // nx=40: right edge 40+10=50 touches collider left edge 50
      // AABB: 40 < 50+50=true, 40+10>50=false → no collision
      const result = resolveCollisions(area, 40, 50, p);
      expect(result).toEqual({ x: 40, y: 50 });
    });

    it('should accurately compute AABB collision (overlapping by 1px)', () => {
      const area = {
        colliders: [{ x: 50, y: 0, w: 50, h: 200 }],
      };
      const p = { x: 30, y: 50, w: 10, h: 14 };
      // nx=41: right edge 41+10=51 > collider left 50 → collision
      const result = resolveCollisions(area, 41, 50, p);
      expect(result).toEqual({ x: 30, y: 50 });
    });

    it('should handle multiple colliders (blocked by second collider)', () => {
      const area = {
        colliders: [
          { x: 0, y: 0, w: 10, h: 250 },
          { x: 70, y: 60, w: 20, h: 20 },
        ],
      };
      const p = { x: 55, y: 65, w: 10, h: 14 };
      const result = resolveCollisions(area, 65, 65, p);
      expect(result).toEqual({ x: 55, y: 65 });
    });

    it('should return the exact same position object shape', () => {
      const area = { colliders: [] };
      const p = { x: 0, y: 0, w: 12, h: 16 };
      const result = resolveCollisions(area, 20, 30, p);
      expect(result).toHaveProperty('x');
      expect(result).toHaveProperty('y');
      expect(Object.keys(result).length).toBe(2);
    });
  });

  describe('updatePlayerPosition', () => {
    beforeEach(() => {
      gameState.player = { x: 100, y: 100, w: 10, h: 14, dir: 'down', frame: 0 };
      gameState.currentArea = 'piazze';
      if (global.areas) {
        global.areas.piazze.colliders = [];
        global.areas.piazze.npcs = [];
        global.areas.piazze.walkableTop = 80;
      }
    });

    it('should exist and be callable', () => {
      expect(typeof updatePlayerPosition).toBe('function');
      updatePlayerPosition();
      // Should not throw
    });

    it('should move player up when W key is pressed', () => {
      gameState.keys = { w: true };
      updatePlayerPosition();
      expect(gameState.player.y).toBeLessThan(100);
      expect(gameState.player.dir).toBe('up');
    });

    it('should move player down when S key is pressed', () => {
      gameState.keys = { s: true };
      updatePlayerPosition();
      expect(gameState.player.y).toBeGreaterThan(100);
      expect(gameState.player.dir).toBe('down');
    });

    it('should move player left when A key is pressed', () => {
      gameState.keys = { a: true };
      updatePlayerPosition();
      expect(gameState.player.x).toBeLessThan(100);
      expect(gameState.player.dir).toBe('left');
    });

    it('should move player right when D key is pressed', () => {
      gameState.keys = { d: true };
      updatePlayerPosition();
      expect(gameState.player.x).toBeGreaterThan(100);
      expect(gameState.player.dir).toBe('right');
    });

    it('should handle uppercase key variants (W key)', () => {
      gameState.keys = { W: true };
      updatePlayerPosition();
      expect(gameState.player.y).toBeLessThan(100);
    });

    it('should handle Arrow keys (ArrowUp/ArrowDown/ArrowLeft/ArrowRight)', () => {
      gameState.keys = { ArrowUp: true };
      updatePlayerPosition();
      expect(gameState.player.y).toBeLessThan(100);
      expect(gameState.player.dir).toBe('up');
    });

    it('should apply diagonal speed reduction factor (≈0.707)', () => {
      gameState.keys = { w: true, d: true };
      const prevX = gameState.player.x;
      const prevY = gameState.player.y;
      updatePlayerPosition();
      const dx = Math.abs(gameState.player.x - prevX);
      const dy = Math.abs(gameState.player.y - prevY);
      expect(dx).toBeLessThan(PLAYER_SPEED);
      expect(dy).toBeLessThan(PLAYER_SPEED);
      expect(dx).toBeCloseTo(dy, 5);
    });

    it('should clamp player within canvas left boundary', () => {
      gameState.player.x = 5;
      gameState.keys = { a: true };
      updatePlayerPosition();
      expect(gameState.player.x).toBeGreaterThanOrEqual(2);
    });

    it('should clamp player within canvas top boundary', () => {
      gameState.player.y = 5;
      gameState.keys = { w: true };
      updatePlayerPosition();
      expect(gameState.player.y).toBeGreaterThanOrEqual(2);
    });

    it('should clamp player within canvas right boundary', () => {
      gameState.player.x = CANVAS_W - 15;
      gameState.keys = { d: true };
      updatePlayerPosition();
      expect(gameState.player.x).toBeLessThanOrEqual(CANVAS_W - 12);
    });

    it('should clamp player within canvas bottom boundary', () => {
      gameState.player.y = CANVAS_H - 16;
      gameState.keys = { s: true };
      updatePlayerPosition();
      expect(gameState.player.y).toBeLessThanOrEqual(CANVAS_H - 16);
    });

    it('should respect walkableTop boundary (cannot go above walkableTop)', () => {
      gameState.player.y = 85;
      gameState.keys = { w: true };
      if (global.areas) {
        global.areas.piazze.walkableTop = 80;
      }
      updatePlayerPosition();
      expect(gameState.player.y).toBeGreaterThanOrEqual(80);
    });

    it('should allow movement above walkableTop if area has no walkableTop', () => {
      gameState.player.y = 50;
      gameState.keys = { w: true };
      if (global.areas) {
        delete global.areas.piazze.walkableTop;
      }
      updatePlayerPosition();
      expect(gameState.player.y).toBeLessThan(50);
    });

    it('should be blocked by collider and not move into it', () => {
      gameState.player.x = 80;
      gameState.player.y = 100;
      gameState.keys = { d: true };
      if (global.areas) {
        global.areas.piazze.colliders = [{ x: 90, y: 90, w: 30, h: 30 }];
      }
      updatePlayerPosition();
      expect(gameState.player.x).toBe(80);
    });

    it('should be blocked by NPC and not walk through it', () => {
      gameState.player.x = 100;
      gameState.player.y = 100;
      gameState.keys = { d: true };
      if (global.areas) {
        global.areas.piazze.npcs = [{ x: 110, y: 107 }];
      }
      updatePlayerPosition();
      expect(gameState.player.x).toBe(100);
    });

    it('should increment player frame when moving (animation)', () => {
      gameState.player.frame = 0;
      gameState.keys = { w: true };
      updatePlayerPosition();
      expect(gameState.player.frame).toBeGreaterThan(0);
    });

    it('should not change player frame when no keys are pressed', () => {
      gameState.player.frame = 0;
      gameState.keys = {};
      updatePlayerPosition();
      expect(gameState.player.frame).toBe(0);
    });

    it('should update direction based on last horizontal key', () => {
      gameState.keys = { d: true };
      updatePlayerPosition();
      expect(gameState.player.dir).toBe('right');
    });

    it('should not crash with empty keys object', () => {
      gameState.keys = {};
      expect(() => updatePlayerPosition()).not.toThrow();
    });

    it('should not move when no keys are pressed', () => {
      const prevX = gameState.player.x;
      const prevY = gameState.player.y;
      gameState.keys = {};
      updatePlayerPosition();
      expect(gameState.player.x).toBe(prevX);
      expect(gameState.player.y).toBe(prevY);
    });
  });
});
