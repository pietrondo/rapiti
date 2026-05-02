/**
 * Tests for Area Transitions
 */

import { beforeEach, describe, expect, it, jest } from '@jest/globals';

// Mock globals
beforeEach(() => {
  global.window = global;
  global.CANVAS_W = 400;
  global.CANVAS_H = 250;
  
  global.gameState = {
    currentArea: 'piazze',
    player: { x: 100, y: 100, w: 32, h: 32, dir: 'down' },
    fadeDir: 0,
    fadeAlpha: 0,
    cluesFound: [],
  };

  global.areas = {
    piazze: {
      walkableTop: 140,
      exits: [
        { dir: 'up', xRange: [170, 230], to: 'municipio', requiresInteract: true },
        { dir: 'up', xRange: [320, 355], to: 'bar_exterior', requiresInteract: true }
      ],
    },
    bar_exterior: {
      walkableTop: 130,
      exits: [
        { dir: 'up', xRange: [180, 220], to: 'bar_interno', requiresInteract: true }
      ]
    }
  };

  global.changeArea = jest.fn();
  global.updateHUD = jest.fn();
});

describe('Transition Logic', () => {
  let triggerInteractExit;

  beforeEach(async () => {
    const mod = await import('../src/game/transition.ts');
    triggerInteractExit = mod.triggerInteractExit;
    // Re-mock because the module overwrites window.changeArea
    global.changeArea = jest.fn();
  });

  it('should trigger Municipio exit when player is in front of it', async () => {
    // Player at x=200, y=140 (just at the door)
    global.gameState.player.x = 200 - 16; // Center at 200
    global.gameState.player.y = 140;
    
    const result = triggerInteractExit();
    expect(result).toBe(true);
    expect(global.changeArea).toHaveBeenCalledWith('municipio', undefined, undefined);
  });

  it('should trigger Bar exit from Piazze when player is in front of it', async () => {
    // Bar door is at 320-355. Center at 337.
    global.gameState.player.x = 337 - 16;
    global.gameState.player.y = 140;
    
    const result = triggerInteractExit();
    expect(result).toBe(true);
    expect(global.changeArea).toHaveBeenCalledWith('bar_exterior', undefined, undefined);
  });

  it('should trigger Bar Interno exit from Bar Exterior', async () => {
    global.gameState.currentArea = 'bar_exterior';
    // Door at 180-220. Center at 200.
    global.gameState.player.x = 200 - 16;
    global.gameState.player.y = 130;
    
    const result = triggerInteractExit();
    expect(result).toBe(true);
    expect(global.changeArea).toHaveBeenCalledWith('bar_interno', undefined, undefined);
  });

  it('should NOT trigger exit if player is too far (x)', async () => {
    global.gameState.player.x = 100;
    global.gameState.player.y = 140;
    
    const result = triggerInteractExit();
    expect(result).toBe(false);
    expect(global.changeArea).not.toHaveBeenCalled();
  });

  it('should NOT trigger exit if player is too far (y)', async () => {
    global.gameState.player.x = 200 - 16;
    global.gameState.player.y = 160; // Beyond walkableTop + 15
    
    const result = triggerInteractExit();
    expect(result).toBe(false);
    expect(global.changeArea).not.toHaveBeenCalled();
  });
});
