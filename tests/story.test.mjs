import { describe, expect, it, jest } from '@jest/globals';

// Mock window
global.window = {
  StoryManager: {},
  storyEngine: {},
  storyChapters: {
    intro: { id: 'intro', order: 1, objectives: [] }
  },
  gameState: {
     cluesFound: [],
     confirmedHypotheses: [],
     npcTrust: {}
  }
};

import { StoryManager } from '../src/story/index.ts';
import { StoryEngine } from '../src/story/storyEngine.ts';

describe('Story System', () => {
  describe('StoryEngine', () => {
    it('should delegate onAreaVisited to statsManager', () => {
      const engine = new StoryEngine();
      engine.init();
      
      // onAreaVisited is expected to be a function now
      expect(typeof engine.onAreaVisited).toBe('function');
      
      engine.onAreaVisited('piazze');
      
      const stats = engine.getStats();
      expect(stats.visitedAreas['piazze']).toBe(true);
      expect(stats.visitedAreasCount).toBe(1);
    });

    it('should provide talkedToCount in getStats', () => {
      const engine = new StoryEngine();
      engine.init();
      
      engine.onDialogueStarted('ruggeri');
      
      const stats = engine.getStats();
      expect(stats.talkedTo['ruggeri']).toBe(true);
      expect(stats.talkedToCount).toBe(1);
    });

    it('should delegate onClueFound to statsManager', () => {
      const engine = new StoryEngine();
      engine.init();
      engine.onClueFound();
      const stats = engine.getStats();
      expect(stats.cluesFound).toBe(1);
    });

    it('should delegate onPuzzleSolved to statsManager', () => {
      const engine = new StoryEngine();
      engine.init();
      engine.onPuzzleSolved('test-puzzle');
      const stats = engine.getStats();
      expect(stats.puzzlesSolved['test-puzzle']).toBe(true);
    });
  });

  describe('StoryManager', () => {
    it('should call engine.onAreaVisited', () => {
      const sm = new StoryManager();
      // Mock engine
      sm.engine = {
        onAreaVisited: jest.fn(),
        getStats: () => ({ talkedToCount: 0 }),
        checkEvents: () => {},
        checkCondition: () => true,
        setFlag: () => {}
      };
      
      sm.onAreaVisited('test-area');
      expect(sm.engine.onAreaVisited).toHaveBeenCalledWith('test-area');
    });
  });
});
