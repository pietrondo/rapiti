/**
 * Tests for Dialogue System
 */

import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { gameState, resetGameState } from '../src/config.ts';

// ── Setup global mocks before importing dialogue module ──

global.gameState = gameState;

global.StoryManager = {
  getDialogueNodeForNPC: jest.fn(),
  onDialogueStarted: jest.fn(),
  onClueFound: jest.fn(),
  checkQuestProgress: jest.fn(),
};

global.npcsData = [
  { id: 'ruggeri', name: 'Sindaco Ruggeri' },
  { id: 'neri', name: 'Neri' },
  { id: 'teresa', name: 'Teresa' },
];

global.cluesMap = {
  frammento: { id: 'frammento', name: 'Frammento metallico' },
  lettera_censurata: { id: 'lettera_censurata', name: 'Lettera militare' },
};

global.showToast = jest.fn();
global.updateHUD = jest.fn();
global.updateNPCStates = jest.fn();

global.dialogueEffects = {
  hint_chiesa: jest.fn(),
  give_frammento: jest.fn(),
  give_lettera: jest.fn(),
  hint_diario_enzo: jest.fn(),
  hint_mappa: jest.fn(),
};

// Minimal dialogueNodes: two NPCs with s0 fallback
global.dialogueNodes = {
  ruggeri_s0: {
    text: 'Benvenuto a San Celeste, ispettore.',
    choices: [
      {
        text: 'Mi parli delle luci.',
        next: 'ruggeri_s0_luci',
        effect: { subTrust: { ruggeri: 5 } },
      },
      {
        text: 'Ci sono stati altri casi?',
        next: 'ruggeri_s0_casi',
        effect: { addTrust: { ruggeri: 10 }, giveClue: 'frammento' },
      },
    ],
  },
  ruggeri_s0_luci: {
    text: 'Ancora con queste fandonie.',
  },
  ruggeri_s0_casi: {
    text: 'Due persone sparirono nel 1861.',
    effect: { hint: 'chiesa' },
  },
  ruggeri_s1: {
    text: 'Quella lettera militare...',
    choices: [
      { text: 'Che cosa nasconde?', next: 'ruggeri_s1_nasconde' },
    ],
  },
  ruggeri_s1_nasconde: {
    text: 'Io proteggo questo paese.',
  },
  neri_s0: {
    text: "L'archivio è aperto, ispettore.",
    choices: [
      { text: 'Cerco un registro del 1861.', effect: { giveClue: 'lettera_censurata' } },
    ],
  },
  teresa_s0: {
    text: 'Dov\'è finito mio figlio...',
    choices: [
      {
        text: 'Aiutami.',
        effect: { giveClue: 'frammento' },
      },
    ],
    memoryCorrupt: false,
  },
  noparent_s0: {
    text: '???',
    choices: [{ text: 'Nulla.' }],
  },
};

// Shared mock DOM elements reference
var mockDOMElements = {};

function setupDocumentMock() {
  mockDOMElements = {};
  // Use jsdom's real document; spy getElementById and add elements to the registry
  const overlay = document.createElement('div');
  overlay.id = 'dialogue-overlay';
  jest.spyOn(overlay.classList, 'add').mockImplementation(() => {});
  jest.spyOn(overlay.classList, 'remove').mockImplementation(() => {});
  mockDOMElements['dialogue-overlay'] = overlay;

  const npcName = document.createElement('div');
  npcName.id = 'dialogue-npc-name';
  mockDOMElements['dialogue-npc-name'] = npcName;

  const dlgText = document.createElement('div');
  dlgText.id = 'dialogue-text';
  jest.spyOn(dlgText, 'appendChild').mockImplementation(() => {});
  mockDOMElements['dialogue-text'] = dlgText;

  const choices = document.createElement('div');
  choices.id = 'dialogue-choices';
  mockDOMElements['dialogue-choices'] = choices;

  jest.spyOn(document, 'getElementById').mockImplementation((id) => {
    return mockDOMElements[id] || null;
  });

  jest.spyOn(document, 'createElement').mockImplementation((tag) => {
    const el = {
      tagName: tag.toUpperCase(),
      textContent: '',
      innerHTML: '',
      className: '',
      style: {},
      draggable: false,
      setAttribute: jest.fn(),
      addEventListener: jest.fn(),
      appendChild: jest.fn(),
    };
    el.classList = { add: jest.fn(), remove: jest.fn(), contains: jest.fn(), toggle: jest.fn() };
    return el;
  });

  document.createDocumentFragment = jest.fn(() => ({
    appendChild: jest.fn(),
  }));
}

// Initial setup
setupDocumentMock();

// ── Import dialogue module ──

import {
  startDialogue,
  closeDialogue,
  applyDialogueEffect,
} from '../src/game/dialogue.ts';

// ── Helper: find an export if not directly importable ──
// selectDialogueChoice is a local helper, exported as named export.
// We re-import from the module; if not directly imported, we use the
// global set by the module's side-effect.
import {
  selectDialogueChoice,
} from '../src/game/dialogue.ts';

describe('Dialogue System', () => {
  beforeEach(() => {
    resetGameState();
    global.gameState = gameState;
    jest.clearAllMocks();
    setupDocumentMock();
  });

  describe('startDialogue', () => {
    it('should set dialogueNpcId and gamePhase to dialogue', () => {
      global.StoryManager.getDialogueNodeForNPC.mockReturnValue('ruggeri_s0');

      startDialogue('ruggeri');

      expect(gameState.dialogueNpcId).toBe('ruggeri');
      expect(gameState.gamePhase).toBe('dialogue');
      expect(gameState.previousPhase).toBe('title');
    });

    it('should call StoryManager.getDialogueNodeForNPC and onDialogueStarted', () => {
      global.StoryManager.getDialogueNodeForNPC.mockReturnValue('ruggeri_s0');

      startDialogue('ruggeri');

      expect(global.StoryManager.getDialogueNodeForNPC).toHaveBeenCalledWith('ruggeri');
      expect(global.StoryManager.onDialogueStarted).toHaveBeenCalledWith('ruggeri');
    });

    it('should fallback to s0 when node not found', () => {
      global.StoryManager.getDialogueNodeForNPC.mockReturnValue('ruggeri_s99');

      startDialogue('ruggeri');

      expect(gameState.dialogueTree).toBe(global.dialogueNodes.ruggeri_s0);
    });

    it('should call renderDialogueHTML and show overlay', () => {
      global.StoryManager.getDialogueNodeForNPC.mockReturnValue('ruggeri_s0');

      startDialogue('ruggeri');

      const overlay = document.getElementById('dialogue-overlay');
      expect(overlay).not.toBeNull();
      expect(overlay.classList.add).toHaveBeenCalledWith('active');
    });
  });

  describe('closeDialogue', () => {
    it('should restore gamePhase and clear dialogue state', () => {
      gameState.gamePhase = 'dialogue';
      gameState.previousPhase = 'playing';
      gameState.dialogueNpcId = 'ruggeri';
      gameState.dialogueTree = global.dialogueNodes.ruggeri_s0;

      closeDialogue();

      expect(gameState.gamePhase).toBe('playing');
      expect(gameState.dialogueNpcId).toBeNull();
      expect(gameState.dialogueTree).toBeNull();

      const overlay = document.getElementById('dialogue-overlay');
      expect(overlay.classList.remove).toHaveBeenCalledWith('active');
    });

    it('should default to playing phase when previousPhase is null', () => {
      gameState.previousPhase = null;
      gameState.gamePhase = 'dialogue';

      closeDialogue();

      expect(gameState.gamePhase).toBe('playing');
    });
  });

  describe('selectDialogueChoice', () => {
    it('should advance to next node when choice has next', () => {
      gameState.dialogueTree = global.dialogueNodes.ruggeri_s0;
      gameState.gamePhase = 'dialogue';

      selectDialogueChoice(0);

      // Choice 0: next='ruggeri_s0_luci', has subTrust effect
      expect(gameState.dialogueTree).toBe(global.dialogueNodes.ruggeri_s0_luci);
    });

    it('should apply effects from the selected choice', () => {
      gameState.dialogueTree = global.dialogueNodes.ruggeri_s0;
      gameState.dialogueNpcId = 'ruggeri';
      gameState.npcTrust.ruggeri = 50;

      // Choice 1: addTrust { ruggeri: 10 }, giveClue 'frammento'
      selectDialogueChoice(1);

      expect(gameState.npcTrust.ruggeri).toBe(60);
      expect(gameState.cluesFound).toContain('frammento');
      expect(global.StoryManager.onClueFound).toHaveBeenCalledWith('frammento');
    });

    it('should close dialogue when choice has no next', () => {
      gameState.dialogueTree = global.dialogueNodes.teresa_s0;
      gameState.gamePhase = 'dialogue';
      gameState.previousPhase = 'playing';

      // Choice 0 has effect with giveClue but no next
      selectDialogueChoice(0);

      expect(gameState.gamePhase).toBe('playing');
      expect(gameState.dialogueNpcId).toBeNull();
    });

    it('should handle invalid index gracefully', () => {
      gameState.dialogueTree = global.dialogueNodes.ruggeri_s0;
      gameState.gamePhase = 'dialogue';
      gameState.previousPhase = 'playing';

      // Should not throw
      expect(() => selectDialogueChoice(99)).not.toThrow();
      expect(gameState.gamePhase).toBe('dialogue');
    });

    it('should handle null dialogueTree gracefully', () => {
      gameState.dialogueTree = null;

      expect(() => selectDialogueChoice(0)).not.toThrow();
    });
  });

  describe('applyDialogueEffect', () => {
    it('should add trust from effect.addTrust', () => {
      gameState.npcTrust.ruggeri = 20;

      applyDialogueEffect({ addTrust: { ruggeri: 10, neri: 5 } });

      expect(gameState.npcTrust.ruggeri).toBe(30);
      expect(gameState.npcTrust.neri).toBe(5);
    });

    it('should subtract trust from effect.subTrust', () => {
      gameState.npcTrust.ruggeri = 50;

      applyDialogueEffect({ subTrust: { ruggeri: 15 } });

      expect(gameState.npcTrust.ruggeri).toBe(35);
    });

    it('should give clue from effect.giveClue', () => {
      applyDialogueEffect({ giveClue: 'frammento' });

      expect(gameState.cluesFound).toContain('frammento');
      expect(global.StoryManager.onClueFound).toHaveBeenCalledWith('frammento');
    });

    it('should not add duplicate clue', () => {
      gameState.cluesFound = ['frammento'];

      applyDialogueEffect({ giveClue: 'frammento' });

      expect(gameState.cluesFound.length).toBe(1);
      expect(global.StoryManager.onClueFound).not.toHaveBeenCalled();
    });

    it('should trigger give_frammento effect for frammento clue', () => {
      applyDialogueEffect({ giveClue: 'frammento' });

      expect(global.dialogueEffects.give_frammento).toHaveBeenCalled();
    });

    it('should trigger give_lettera effect for lettera_censurata clue', () => {
      applyDialogueEffect({ giveClue: 'lettera_censurata' });

      expect(global.dialogueEffects.give_lettera).toHaveBeenCalled();
    });

    it('should trigger hint_chiesa effect', () => {
      applyDialogueEffect({ hint: 'chiesa' });

      expect(global.dialogueEffects.hint_chiesa).toHaveBeenCalled();
    });

    it('should trigger hint_diario_enzo effect for giveClueHint', () => {
      applyDialogueEffect({ giveClueHint: 'diario_enzo' });

      expect(global.dialogueEffects.hint_diario_enzo).toHaveBeenCalled();
    });

    it('should trigger hint_mappa effect for giveClueHint', () => {
      applyDialogueEffect({ giveClueHint: 'mappa_campi' });

      expect(global.dialogueEffects.hint_mappa).toHaveBeenCalled();
    });

    it('should call StoryManager.checkQuestProgress after effects', () => {
      applyDialogueEffect({ addTrust: { ruggeri: 5 } });

      expect(global.StoryManager.checkQuestProgress).toHaveBeenCalled();
    });

    it('should call updateNPCStates for backwards compatibility', () => {
      applyDialogueEffect({});

      expect(global.updateNPCStates).toHaveBeenCalled();
    });

    it('should handle empty effect object', () => {
      expect(() => applyDialogueEffect({})).not.toThrow();
    });

    it('should inc/dec trust from a single effect containing both', () => {
      gameState.npcTrust.ruggeri = 40;
      gameState.npcTrust.teresa = 30;

      applyDialogueEffect({
        addTrust: { ruggeri: 20 },
        subTrust: { teresa: 10 },
      });

      expect(gameState.npcTrust.ruggeri).toBe(60);
      expect(gameState.npcTrust.teresa).toBe(20);
    });
  });
});
