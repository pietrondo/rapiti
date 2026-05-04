import { beforeEach, describe, expect, it, jest } from '@jest/globals';

const mockGameState = {
  cluesFound: [],
  npcTrust: { osvaldo: 0, gino: 0, anselmo: 0, teresa: 0, neri: 0 },
  puzzlesSolved: {},
  flags: {},
  npcStates: {},
};

// Setup globals
global.gameState = mockGameState;
global.StoryManager = {
  setFlag: jest.fn((f, v = true) => { mockGameState.flags[f] = v; }),
  onClueFound: jest.fn(),
  checkQuestProgress: jest.fn(),
  onPuzzleSolved: jest.fn(),
};
global.showToast = jest.fn();
global.updateHUD = jest.fn();
global.collectClue = jest.fn((id) => { 
  if (!mockGameState.cluesFound.includes(id)) {
    mockGameState.cluesFound.push(id);
  }
});
global.t = (key) => key;
global.storyQuests = {
  osvaldo_delivery: {
    id: 'osvaldo_delivery',
    stages: [
      { id: 'collect_menta', condition: { hasClue: 'menta' }, reward: { setFlag: 'menta_collected' } },
      { id: 'deliver_menta', condition: { talkedTo: 'osvaldo', hasFlag: 'menta_collected' }, reward: { addTrust: { osvaldo: 20 } } }
    ],
    onComplete: { message: 'Done' }
  }
};

// Mock window to redirect to globals
global.window = global;

import questManager from '../src/story/questManager.ts';

describe('Quest Integration', () => {
  beforeEach(() => {
    questManager.init();
    mockGameState.cluesFound = [];
    mockGameState.npcTrust = { osvaldo: 0, gino: 0, anselmo: 0, teresa: 0, neri: 0 };
    mockGameState.flags = {};
    jest.clearAllMocks();
  });

  it('should progress Osvaldo quest when menta is collected', () => {
    questManager.activeQuests['osvaldo_delivery'] = { id: 'osvaldo_delivery', currentStage: 0, stagesCompleted: [] };
    
    // Simulate finding menta
    mockGameState.cluesFound.push('menta');
    
    // Check progress
    questManager.checkQuestProgress((c) => {
      if (c.hasClue === 'menta') return mockGameState.cluesFound.includes('menta');
      return false;
    });

    expect(questManager.activeQuests['osvaldo_delivery'].currentStage).toBe(1);
    expect(mockGameState.flags['menta_collected']).toBe(true);
  });

  it('should complete Osvaldo quest and give trust reward', () => {
    questManager.activeQuests['osvaldo_delivery'] = { id: 'osvaldo_delivery', currentStage: 1, stagesCompleted: ['collect_menta'] };
    mockGameState.flags['menta_collected'] = true;
    
    // Simulate talking to osvaldo
    questManager.checkQuestProgress((c) => {
      if (c.talkedTo === 'osvaldo' && c.hasFlag === 'menta_collected') return true;
      return false;
    });

    expect(questManager.isQuestCompleted('osvaldo_delivery')).toBe(true);
    expect(mockGameState.npcTrust.osvaldo).toBe(20);
    expect(global.showToast).toHaveBeenCalledWith('Done');
  });
});
