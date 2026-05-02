/**
 * Tests for Renderer Modules
 */

import { beforeEach, describe, expect, it, jest } from '@jest/globals';

// Mock canvas context
function createMockCtx() {
  return {
    fillRect: jest.fn(),
    fillText: jest.fn(),
    strokeRect: jest.fn(),
    beginPath: jest.fn(),
    arc: jest.fn(),
    ellipse: jest.fn(),
    fill: jest.fn(),
    closePath: jest.fn(),
    moveTo: jest.fn(),
    lineTo: jest.fn(),
    drawImage: jest.fn(),
    save: jest.fn(),
    restore: jest.fn(),
    translate: jest.fn(),
    scale: jest.fn(),
    measureText: jest.fn(() => ({ width: 50 })),
    createRadialGradient: jest.fn(() => ({
      addColorStop: jest.fn()
    })),
    fillStyle: '',
    strokeStyle: '',
    font: '',
    textAlign: '',
    globalAlpha: 1,
  };
}

// Mock globals
beforeEach(() => {
  global.gameState = {
    currentArea: 'piazze',
    player: { x: 100, y: 100, w: 32, h: 32, dir: 'down', frame: 0 },
    interactionTarget: null,
    cluesFound: [],
    prologueStep: 0,
    prologueTimer: 0,
    messageTimer: 0,
    keys: {},
  };

  global.areas = {
    piazze: {
      draw: jest.fn(),
      npcs: [],
      exits: [],
    },
  };

  global.npcsData = [
    { id: 'test_npc', name: 'Test NPC', colors: { body: '#000', detail: '#fff', head: '#000', legs: '#000' } }
  ];

  global.areaObjects = {
    piazze: [],
  };

  global.PALETTE = {
    nightBlue: '#1a1c20',
    slateGrey: '#4a5568',
    lanternYel: '#d4a843',
    creamPaper: '#f4f0e8',
    alumGrey: '#a0a0a0',
    earthBrown: '#5a4030',
    burntOrange: '#cc5500',
    fadedBeige: '#d4c4a8',
    greyBrown: '#6b5b4f',
    darkForest: '#2d3a2d',
    stoneGrey: '#7a7a7a',
  };

  global.SpriteManager = {
    getOrCreateNPCSheet: jest.fn(() => ({
      width: 64,
      height: 128,
    })),
    getOrCreatePlayerSheet: jest.fn(() => ({
      width: 128,
      height: 128,
    })),
    animState: {
      lastX: 100,
      lastY: 100,
      isMoving: false,
      playerTimer: 0,
      playerFrame: 0,
    },
  };

  global.UIRenderer = {
    renderAreaExitMarkers: jest.fn(),
    drawObjectIcon: jest.fn(),
  };
  
  if (typeof window !== 'undefined') {
    window.t = jest.fn((key) => `[${key}]`);
  }
});

// Import renderers after globals are set
describe('Area Renderer', () => {
  let renderArea;

  beforeEach(async () => {
    const mod = await import('../src/render/areaRenderer.mjs');
    renderArea = mod.renderArea;
  });

  it('should render area background', async () => {
    const ctx = createMockCtx();
    await renderArea(ctx);
    expect(global.areas.piazze.draw).toHaveBeenCalledWith(ctx);
  });

  it('should render area exit markers', async () => {
    const ctx = createMockCtx();
    await renderArea(ctx);
    expect(global.UIRenderer.renderAreaExitMarkers).toHaveBeenCalledWith(ctx, global.areas.piazze);
  });

  it('should render NPCs', async () => {
    global.areas.piazze.npcs = [{ id: 'test_npc', x: 150, y: 150, facing: 'down', animFrame: 0 }];
    const ctx = createMockCtx();
    await renderArea(ctx);
    expect(global.SpriteManager.getOrCreateNPCSheet).toHaveBeenCalledWith('test_npc');
    expect(ctx.drawImage).toHaveBeenCalled();
  });

  it('should render NPC name label', async () => {
    global.areas.piazze.npcs = [{ id: 'test_npc', x: 150, y: 150, facing: 'down', animFrame: 0 }];
    const ctx = createMockCtx();
    await renderArea(ctx);
    expect(ctx.fillText).toHaveBeenCalledWith('Test NPC', 150, 117);
  });

  it('should skip collected clues', async () => {
    global.areaObjects.piazze = [{ id: 'test_clue', x: 50, y: 50, w: 10, h: 10, type: 'clue', drawHint: true }];
    global.gameState.cluesFound = ['test_clue'];
    const ctx = createMockCtx();
    await renderArea(ctx);
    expect(global.UIRenderer.drawObjectIcon).not.toHaveBeenCalled();
  });

  it('should render radio object with pulse', async () => {
    global.areaObjects.piazze = [{ id: 'radio', x: 50, y: 50, w: 20, h: 20, type: 'radio', drawHint: true }];
    const ctx = createMockCtx();
    await renderArea(ctx);
    expect(ctx.arc).toHaveBeenCalled();
  });

  it('should render recorder object', async () => {
    global.areaObjects.piazze = [{ id: 'recorder', x: 50, y: 50, w: 24, h: 20, type: 'recorder', drawHint: true }];
    const ctx = createMockCtx();
    await renderArea(ctx);
    expect(ctx.fillRect).toHaveBeenCalled();
  });

  it('should render cat object', async () => {
    global.areaObjects.piazze = [{ id: 'gatto', x: 50, y: 50, w: 12, h: 10, type: 'gatto', drawHint: true }];
    const ctx = createMockCtx();
    await renderArea(ctx);
    expect(ctx.fillRect).toHaveBeenCalled();
  });
});

describe('Player Renderer', () => {
  let renderPlayer;

  beforeEach(async () => {
    const mod = await import('../src/render/playerRenderer.mjs');
    renderPlayer = mod.renderPlayer;
  });

  it('should update animation state when moving', async () => {
    global.gameState.player.x = 101;
    const ctx = createMockCtx();
    await renderPlayer(ctx);
    expect(global.SpriteManager.animState.isMoving).toBe(true);
  });

  it('should not update animation when standing still', async () => {
    global.SpriteManager.animState.lastX = 100;
    global.SpriteManager.animState.lastY = 100;
    const ctx = createMockCtx();
    await renderPlayer(ctx);
    expect(global.SpriteManager.animState.isMoving).toBe(false);
  });

  it('should draw player shadow', async () => {
    const ctx = createMockCtx();
    await renderPlayer(ctx);
    expect(ctx.ellipse).toHaveBeenCalled();
  });

  it('should draw player from sprite sheet', async () => {
    const ctx = createMockCtx();
    await renderPlayer(ctx);
    expect(global.SpriteManager.getOrCreatePlayerSheet).toHaveBeenCalled();
    expect(ctx.drawImage).toHaveBeenCalled();
  });

  it('should handle missing sprite sheet gracefully', async () => {
    global.SpriteManager.getOrCreatePlayerSheet = jest.fn(() => null);
    const ctx = createMockCtx();
    await renderPlayer(ctx);
    expect(ctx.drawImage).not.toHaveBeenCalled();
  });

  it('should reset frame when standing still', async () => {
    global.SpriteManager.animState.playerFrame = 2;
    const ctx = createMockCtx();
    await renderPlayer(ctx);
    expect(global.SpriteManager.animState.playerFrame).toBe(0);
  });
});

describe('Hint Renderer', () => {
  let renderInteractionHint;

  beforeEach(async () => {
    const mod = await import('../src/render/hintRenderer.mjs');
    renderInteractionHint = mod.renderInteractionHint;
  });

  it('should not render when no interaction target', async () => {
    global.gameState.interactionTarget = null;
    const ctx = createMockCtx();
    await renderInteractionHint(ctx);
    expect(ctx.fillRect).not.toHaveBeenCalled();
  });

  it('should render NPC interaction hint', async () => {
    global.gameState.interactionTarget = { type: 'npc' };
    const ctx = createMockCtx();
    await renderInteractionHint(ctx);
    expect(ctx.fillText).toHaveBeenCalledWith('[E] Parla', expect.any(Number), expect.any(Number));
  });

  it('should render object interaction hint', async () => {
    global.gameState.interactionTarget = { type: 'object' };
    const ctx = createMockCtx();
    await renderInteractionHint(ctx);
    expect(ctx.fillText).toHaveBeenCalledWith('[E] Raccogli', expect.any(Number), expect.any(Number));
  });

  it('should render door interaction hint', async () => {
    global.gameState.interactionTarget = { type: 'door' };
    const ctx = createMockCtx();
    await renderInteractionHint(ctx);
    expect(ctx.fillText).toHaveBeenCalledWith('[E] Entra / Esci', expect.any(Number), expect.any(Number));
  });

  it('should render radio interaction hint', async () => {
    global.gameState.interactionTarget = { type: 'radio' };
    const ctx = createMockCtx();
    await renderInteractionHint(ctx);
    expect(ctx.fillText).toHaveBeenCalledWith('[E] Accendi Radio', expect.any(Number), expect.any(Number));
  });

  it('should render recorder interaction hint', async () => {
    global.gameState.interactionTarget = { type: 'recorder' };
    const ctx = createMockCtx();
    await renderInteractionHint(ctx);
    expect(ctx.fillText).toHaveBeenCalledWith('[E] Usa Registratore', expect.any(Number), expect.any(Number));
  });

  it('should render scene interaction hint', async () => {
    global.gameState.interactionTarget = { type: 'scene' };
    const ctx = createMockCtx();
    await renderInteractionHint(ctx);
    expect(ctx.fillText).toHaveBeenCalledWith('[E] Esamina', expect.any(Number), expect.any(Number));
  });

  it('should render cat interaction hint', async () => {
    global.gameState.interactionTarget = { type: 'gatto' };
    const ctx = createMockCtx();
    await renderInteractionHint(ctx);
    expect(ctx.fillText).toHaveBeenCalledWith('[E] Accarezza', expect.any(Number), expect.any(Number));
  });

  it('should render unknown interaction hint', async () => {
    global.gameState.interactionTarget = { type: 'unknown' };
    const ctx = createMockCtx();
    await renderInteractionHint(ctx);
    expect(ctx.fillText).toHaveBeenCalledWith('[E] ???', expect.any(Number), expect.any(Number));
  });
});
