/**
 * Tests for ES6+ Classes (AreaManager, RenderManager, GameLoop, InputManager)
 */

import { describe, it, expect, beforeEach } from '@jest/globals';

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
  messageTimer: 0
};

global.CANVAS_W = 400;
global.CANVAS_H = 250;

// Mock DOM
document.getElementById = () => ({
  classList: { add: () => {}, remove: () => {} },
  textContent: ''
});

// Mock systems
global.ScreenShake = { apply: () => {}, update: () => {} };
global.SceneRenderer = {
  renderTitle: () => {},
  renderPrologueCutscene: () => {},
  renderIntroSlide: () => {},
  renderPrologue: () => {},
  renderTutorial: () => {},
  renderEndingScreen: () => {}
};
global.GameRenderer = {
  renderArea: () => {},
  renderPlayer: () => {},
  renderInteractionHint: () => {}
};
global.LightingSystem = { draw: () => {}, update: () => {} };
global.ParticleSystem = { draw: () => {}, update: () => {} };
global.Vignette = { draw: () => {} };
global.UIRenderer = { renderMiniMap: () => {}, renderFade: () => {} };

import { AreaManager, areaManager } from '../src/areas/index.mjs';
import { RenderManager, renderManager } from '../src/render/index.mjs';
import { GameLoop, gameLoop } from '../src/game/loop.mjs';
import { InputManager, inputManager } from '../src/game/input.mjs';

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

    it('should set current area', () => {
      const am = new AreaManager();
      const area = { name: 'Piazza' };
      am.register('piazze', area);
      am.setCurrent('piazze');
      expect(am.getCurrent()).toBe(area);
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

    it('should have default scale', () => {
      const rm = new RenderManager();
      expect(rm.scale).toBe(2);
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

    it('should initialize with context', () => {
      const rm = new RenderManager();
      const mockCtx = {};
      rm.init(mockCtx);
      expect(rm.ctx).toBe(mockCtx);
    });

    it('singleton should exist', () => {
      expect(renderManager).toBeInstanceOf(RenderManager);
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

    it('should have prologue timings', () => {
      const gl = new GameLoop();
      expect(gl.prologueTimings.length).toBe(9);
    });

    it('should calculate delta time', () => {
      const gl = new GameLoop();
      gl.lastTime = performance.now() - 16;
      const dt = gl.getDeltaTime();
      expect(typeof dt).toBe('number');
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

    it('should detect just pressed keys', () => {
      const im = new InputManager();
      im.keys.add('w');
      expect(im.isJustPressed('w')).toBe(true);
      im.update();
      expect(im.isJustPressed('w')).toBe(false);
    });

    it('should handle key down', () => {
      const im = new InputManager();
      const event = { key: 'w', preventDefault: () => {} };
      im.handleKeyDown(event);
      expect(im.isPressed('w')).toBe(true);
    });

    it('should handle key up', () => {
      const im = new InputManager();
      im.keys.add('w');
      const event = { key: 'w' };
      im.handleKeyUp(event);
      expect(im.isPressed('w')).toBe(false);
    });

    it('should track multiple keys', () => {
      const im = new InputManager();
      im.keys.add('w');
      im.keys.add('a');
      expect(im.isPressed('w')).toBe(true);
      expect(im.isPressed('a')).toBe(true);
      expect(im.isPressed('s')).toBe(false);
    });

    it('singleton should exist', () => {
      expect(inputManager).toBeInstanceOf(InputManager);
    });
  });
});
