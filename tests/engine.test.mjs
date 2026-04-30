/**
 * Tests for Engine Module
 */

import { describe, expect, it } from '@jest/globals';
import { Engine, engine } from '../src/engine/index.mjs';

describe('Engine Module', () => {
  describe('Engine object', () => {
    it('should be defined', () => {
      expect(Engine).toBeDefined();
      expect(typeof Engine).toBe('object');
    });

    it('should have version', () => {
      expect(Engine.version).toBeDefined();
      expect(typeof Engine.version).toBe('string');
    });

    it('should have buildDate', () => {
      expect(Engine.buildDate).toBeDefined();
    });
  });

  describe('Math utilities', () => {
    it('clamp should constrain values', () => {
      expect(Engine.clamp(5, 0, 10)).toBe(5);
      expect(Engine.clamp(-5, 0, 10)).toBe(0);
      expect(Engine.clamp(15, 0, 10)).toBe(10);
    });

    it('lerp should interpolate', () => {
      expect(Engine.lerp(0, 10, 0.5)).toBe(5);
      expect(Engine.lerp(0, 10, 0)).toBe(0);
      expect(Engine.lerp(0, 10, 1)).toBe(10);
    });

    it('randomInt should return integers in range', () => {
      const val = Engine.randomInt(1, 10);
      expect(Number.isInteger(val)).toBe(true);
      expect(val).toBeGreaterThanOrEqual(1);
      expect(val).toBeLessThanOrEqual(10);
    });

    it('randomFloat should return floats in range', () => {
      const val = Engine.randomFloat(0, 1);
      expect(val).toBeGreaterThanOrEqual(0);
      expect(val).toBeLessThanOrEqual(1);
    });
  });

  describe('Geometry utilities', () => {
    it('pointInRect should detect points inside', () => {
      expect(Engine.pointInRect(5, 5, 0, 0, 10, 10)).toBe(true);
      expect(Engine.pointInRect(15, 5, 0, 0, 10, 10)).toBe(false);
    });

    it('rectCollision should detect overlaps', () => {
      const r1 = { x: 0, y: 0, width: 10, height: 10 };
      const r2 = { x: 5, y: 5, width: 10, height: 10 };
      const r3 = { x: 20, y: 20, width: 10, height: 10 };

      expect(Engine.rectCollision(r1, r2)).toBe(true);
      expect(Engine.rectCollision(r1, r3)).toBe(false);
    });

    it('distance should calculate correctly', () => {
      expect(Engine.distance(0, 0, 3, 4)).toBe(5);
      expect(Engine.distance(0, 0, 0, 0)).toBe(0);
    });
  });

  describe('Angle utilities', () => {
    it('normalizeAngle should wrap angles', () => {
      expect(Engine.normalizeAngle(0)).toBe(0);
      expect(Engine.normalizeAngle(Math.PI * 2)).toBe(0);
      expect(Engine.normalizeAngle(-Math.PI)).toBe(Math.PI);
    });

    it('degToRad should convert correctly', () => {
      expect(Engine.degToRad(180)).toBe(Math.PI);
      expect(Engine.degToRad(90)).toBe(Math.PI / 2);
    });

    it('radToDeg should convert correctly', () => {
      expect(Engine.radToDeg(Math.PI)).toBe(180);
      expect(Engine.radToDeg(Math.PI / 2)).toBe(90);
    });
  });

  describe('Easing functions', () => {
    it('linear should return t', () => {
      expect(Engine.Easing.linear(0.5)).toBe(0.5);
    });

    it('easeIn should accelerate', () => {
      expect(Engine.Easing.easeIn(0.5)).toBe(0.25);
    });

    it('easeOut should decelerate', () => {
      const val = Engine.Easing.easeOut(0.5);
      expect(val).toBeGreaterThan(0.5);
    });

    it('bounce should return values in range', () => {
      expect(Engine.Easing.bounce(0)).toBe(0);
      expect(Engine.Easing.bounce(1)).toBeCloseTo(1, 5);
    });
  });

  describe('engine singleton', () => {
    it('should be same as Engine', () => {
      expect(engine).toBe(Engine);
    });
  });
});
