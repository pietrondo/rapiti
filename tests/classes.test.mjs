/**
 * Tests for ES6+ Classes (AreaManager, RenderManager, GameLoop, InputManager)
 */

import { describe, expect, it } from '@jest/globals';

// Mock globals
global.gameState = {
  gamePhase: 'title',
  currentArea: 'piazze',
  player: { x: 100, y: 100 },
  showMiniMap: true,
  fadeDir: 0,
  keys: {},
  prologueStep: 0,
  prologueTimer: 0,
  messageTimer: 0,
};

global.CANVAS_W = 400;
global.CANVAS_H = 250;

// Mock DOM
document.getElementById = () => ({
  classList: { add: () => {}, remove: () => {} },
  textContent: '',
});

// Mock systems
global.ScreenShake = { apply: () => {}, update: () => {} };
global.SceneRenderer = {
  renderTitle: () => {},
  renderPrologueCutscene: () => {},
  renderIntroSlide: () => {},
  renderPrologue: () => {},
  renderTutorial: () => {},
  renderEndingScreen: () => {},
};
global.GameRenderer = {
  renderArea: () => {},
  renderPlayer: () => {},
  renderInteractionHint: () => {},
};
global.LightingSystem = { draw: () => {}, update: () => {} };
global.ParticleSystem = { draw: () => {}, update: () => {} };
global.Vignette = { draw: () => {} };
global.UIRenderer = { renderMiniMap: () => {}, renderFade: () => {} };

import { AreaManager, areaManager } from '../src/areas/index.mjs';
import { InputManager, inputManager } from '../src/game/input.ts';
import { GameLoop, gameLoop } from '../src/game/loop.ts';
import { getPrologueTimings } from '../src/game/prologueUpdater.ts';
import { RenderManager, renderManager } from '../src/render/index.ts';

describe('ES6+ Classes', () => {
  describe('AreaManager', () => {
    it('should be instantiable', () => {
      const am = new AreaManager();
      expect(am).toBeInstanceOf(AreaManager);
    });

    it('should register areas', () => {
      const am = new AreaManager();
      const mockArea = { name: 'Test', init: () => {} };
      am.register('test', mockArea);
      expect(am.get('test')).toBe(mockArea);
    });

    it('should return null for unknown areas', () => {
      const am = new AreaManager();
      expect(am.get('unknown')).toBeNull();
    });

    it('should get all areas', () => {
      const am = new AreaManager();
      am.register('a', { name: 'A' });
      am.register('b', { name: 'B' });
      expect(am.getAll().length).toBe(2);
    });

    it('should track area count', () => {
      const am = new AreaManager();
      expect(am.count()).toBe(0);
      am.register('a', {});
      expect(am.count()).toBe(1);
    });

    it('should check if area exists', () => {
      const am = new AreaManager();
      am.register('test', {});
      expect(am.has('test')).toBe(true);
      expect(am.has('other')).toBe(false);
    });

    it('singleton should exist', () => {
      expect(areaManager).toBeInstanceOf(AreaManager);
    });
  });

  describe('RenderManager', () => {
    it('should be instantiable', () => {
      const rm = new RenderManager();
      expect(rm).toBeInstanceOf(RenderManager);
    });

    it('should set scale', () => {
      const rm = new RenderManager();
      rm.setScale(3);
      expect(rm.scale).toBe(3);
    });

    it('should toggle debug mode', () => {
      const rm = new RenderManager();
      expect(rm.debug).toBe(false);
      rm.toggleDebug();
      expect(rm.debug).toBe(true);
    });
  });

  describe('GameLoop', () => {
    it('should be instantiable', () => {
      const gl = new GameLoop();
      expect(gl).toBeInstanceOf(GameLoop);
    });

    it('should not be running initially', () => {
      const gl = new GameLoop();
      expect(gl.isActive()).toBe(false);
    });

    it('should initialize with context', () => {
      const gl = new GameLoop();
      const mockCtx = {};
      gl.init(mockCtx);
      expect(gl.ctx).toBe(mockCtx);
    });

    it('singleton should exist', () => {
      expect(gameLoop).toBeInstanceOf(GameLoop);
    });
  });

  describe('InputManager', () => {
    it('should be instantiable', () => {
      const im = new InputManager();
      expect(im).toBeInstanceOf(InputManager);
    });

    it('should track pressed keys', () => {
      const im = new InputManager();
      expect(im.isPressed('w')).toBe(false);
      im.keys.add('w');
      expect(im.isPressed('w')).toBe(true);
    });

    it('singleton should exist', () => {
      expect(inputManager).toBeInstanceOf(InputManager);
    });
  });
});
