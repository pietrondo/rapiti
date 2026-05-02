/**
 * Tests for PixiJS Renderer Prototype
 */

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { gameState } from '../src/config.mjs';

describe('PixiRenderer Prototype', () => {
  let pixiRenderer;

  beforeEach(async () => {
    // Reset globals for each test
    global.window.CANVAS_W = 400;
    global.window.CANVAS_H = 250;
    
    // Modify the REAL gameState object used by renderer
    gameState.player = { x: 195, y: 188, dir: 'down', discoveryJump: 0 };
    gameState.currentArea = 'piazze';
    gameState.gamePhase = 'playing';
    
    global.window.gameState = gameState;
    global.window.areas = {
      piazze: { npcs: [], draw: jest.fn() }
    };
    global.window.UIRenderer = {
      drawTitleLandscape: jest.fn(),
    };
    global.window.SpriteManager = {
      getOrCreatePlayerSheet: jest.fn().mockReturnValue({}),
      getOrCreateNPCSheet: jest.fn().mockReturnValue({}),
      artist: {
         lighten: (c) => c,
         darken: (c) => c
      },
      animState: { playerFrame: 0 }
    };

    // Fix for JSDOM getContext not implemented
    HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      imageSmoothingEnabled: false,
      createLinearGradient: jest.fn().mockReturnValue({ addColorStop: jest.fn() }),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
    });

    const module = await import('../src/render/pixiRenderer.ts');
    pixiRenderer = module.pixiRenderer;
  });

  it('should initialize successfully', async () => {
    await pixiRenderer.init();
    expect(pixiRenderer.app).toBeDefined();
  });

  it('should toggle enabled state and hide/show canvases', () => {
    const mockLegacy = { style: { display: 'block', pointerEvents: 'auto' } };
    const mockPixi = { style: { display: 'block', visibility: 'hidden' } };
    
    document.getElementById = jest.fn((id) => {
      if (id === 'gameCanvas') return mockLegacy;
      if (id === 'pixi-canvas') return mockPixi;
      return null;
    });

    pixiRenderer.setEnabled(true);
    expect(mockLegacy.style.pointerEvents).toBe('none');
    expect(mockPixi.style.visibility).toBe('visible');
  });

  it('should synchronize player position during render', async () => {
    await pixiRenderer.init();
    pixiRenderer.render();
    
    expect(pixiRenderer.sprites.player).toBeDefined();
    // Default x from config is 195. 195 + 16 (centered) = 211
    // Default y from config is 188. 188 + 16 (centered) = 204
    expect(pixiRenderer.sprites.player.x).toBe(211);
    expect(pixiRenderer.sprites.player.y).toBe(204);
  });
});
