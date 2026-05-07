"use strict";

/**
 * Tests for Ending Determination System
 *
 * Covers:
 *   - src/game/endings.mjs       (facade: determineEnding)
 *   - src/story/storyEngine.ts   (StoryEngine.determineEnding with storyEndingConditions)
 */

import { beforeEach, describe, expect, it } from '@jest/globals';

/* ── Setup window globals BEFORE importing modules that read them ── */

global.window = Object.create(null);
window.gameState = null; // placeholder; tests set it per-scenario
window.storyEndingConditions = null;
window.storyChapters = { intro: { id: 'intro', order: 1, objectives: [] } };

import * as endingsModule from '../src/game/endings.mjs';
import { StoryEngine } from '../src/story/storyEngine.ts';

/* ═══════════════════════════════════════════════════════════════
   SHARED HELPERS
   ═══════════════════════════════════════════════════════════════ */

function makeGS(overrides) {
  var gs = {
    currentArea: 'piazze',
    gamePhase: 'playing',
    previousPhase: null,
    player: { x: 195, y: 188, w: 10, h: 14, dir: 'down', frame: 0 },
    cluesFound: [],
    npcStates: { ruggeri: 0, teresa: 0, neri: 0, valli: 0, anselmo: 0, don_pietro: 0 },
    playerName: 'Detective Maurizio',
    playerColors: { body: '#8B7355', head: '#D4A84B', legs: '#3D3025', detail: '#2D3047' },
    musicEnabled: true,
    puzzleSolved: false,
    puzzleAttempts: 0,
    puzzlesSolved: {},
    introSlide: 0,
    introText: '',
    introCharIndex: 0,
    endingType: null,
    prologueStep: 0,
    prologueTimer: 0,
    radioFrequency: 0,
    radioTarget: 72,
    radioSolved: false,
    npcTrust: { ruggeri: 0, neri: 0, teresa: 0, anselmo: 0 },
    screenShake: 0,
    keys: {},
    dialogueNpcId: null,
    message: '',
    messageTimer: 0,
    fadeAlpha: 0,
    fadeDir: 0,
    fadeCallback: null,
    transitionDir: '',
    showMiniMap: true,
    titleAnim: 0,
    gameTime: 1200,
    gameDate: "Venerdì, 21 Luglio 1978",
    confirmedHypotheses: [],
    locale: 'it',
  };
  if (overrides) {
    for (var k in overrides) {
      gs[k] = overrides[k];
    }
  }
  return gs;
}

function makeEndingConditions() {
  return {
    secret: {
      id: 'secret',
      title: 'NON È ARRIVATO. È STATO APERTO.',
      description: 'Hai capito tutto.',
      priority: 100,
      conditions: {
        hasHypotheses: ['falle_dimensionali', 'segnale_risposta'],
        cluesMin: 8,
      },
    },
    military: {
      id: 'military',
      title: 'Dossier "Progetto SIRIO"',
      description: 'Hai dimostrato che le luci sono esperimenti radar.',
      priority: 50,
      conditions: { hasHypothesis: 'esperimento_militare' },
    },
    alien: {
      id: 'alien',
      title: 'Incontro del Terzo Tipo',
      description: 'San Celeste è una stazione di raccolta aliena.',
      priority: 40,
      conditions: { hasHypothesis: 'tecnologia_aliena', hasClue: 'tracce_circolari' },
    },
    corruption: {
      id: 'corruption',
      title: 'Silenzio Assordante',
      description: 'Accordo col Sindaco.',
      priority: 80,
      conditions: { hasFlag: 'ending_corruzione' },
    },
    conspiracy: {
      id: 'conspiracy',
      title: 'Infiltrazione Istituzionale',
      description: 'Complotto comunale.',
      priority: 30,
      conditions: { hasHypothesis: 'complotto_comunale' },
    },
    psychological: {
      id: 'psychological',
      title: 'Nebbia Padana',
      description: 'Non hai raccolto abbastanza prove.',
      priority: 0,
      conditions: {},
    },
  };
}

/* ═══════════════════════════════════════════════════════════════
   TESTS — endings.mjs FACADE
   ═══════════════════════════════════════════════════════════════ */

describe('endings.mjs (facade)', function () {
  beforeEach(function () {
    delete window.StoryManager;
    window.gameState = makeGS();
  });

  describe('determineEnding', function () {
    it('is a function', function () {
      expect(typeof endingsModule.determineEnding).toBe('function');
    });

    it('returns "psychological" when StoryManager is not available', function () {
      expect(endingsModule.determineEnding()).toBe('psychological');
    });

    it('returns "psychological" when StoryManager.determineEnding is not a function', function () {
      window.StoryManager = {};
      expect(endingsModule.determineEnding()).toBe('psychological');
    });

    it('returns ending.id when StoryManager returns an object', function () {
      window.StoryManager = {
        determineEnding: function () {
          return { id: 'military', title: 'Dossier', priority: 50, conditions: {} };
        },
      };
      expect(endingsModule.determineEnding()).toBe('military');
    });

    it('falls back to "psychological" when StoryManager returns null', function () {
      window.StoryManager = {
        determineEnding: function () { return null; },
      };
      expect(endingsModule.determineEnding()).toBe('psychological');
    });

    it('returns undefined when StoryManager returns object without id property', function () {
      window.StoryManager = {
        determineEnding: function () { return { title: 'no-id' }; },
      };
      expect(endingsModule.determineEnding()).toBeUndefined();
    });

    it('returns "alien" when StoryManager returns alien ending', function () {
      window.StoryManager = {
        determineEnding: function () {
          return { id: 'alien', title: 'Incontro', priority: 40, conditions: {} };
        },
      };
      expect(endingsModule.determineEnding()).toBe('alien');
    });

    it('returns "secret" when StoryManager returns secret ending', function () {
      window.StoryManager = {
        determineEnding: function () {
          return { id: 'secret', title: 'Segreto', priority: 100, conditions: {} };
        },
      };
      expect(endingsModule.determineEnding()).toBe('secret');
    });
  });
});

/* ═══════════════════════════════════════════════════════════════
   TESTS — StoryEngine.determineEnding() DEEP LOGIC
   ═══════════════════════════════════════════════════════════════ */

describe('StoryEngine.determineEnding (deep logic)', function () {
  var engine;

  beforeEach(function () {
    window.gameState = makeGS();
    window.storyEndingConditions = makeEndingConditions();
    window.storyChapters = { intro: { id: 'intro', order: 1, objectives: [] } };
    engine = new StoryEngine();
    engine.init();
  });

  afterEach(function () {
    engine.reset();
  });

  /* ── psychological (default) ── */

  it('returns psychological ending when no clues or hypotheses', function () {
    var result = engine.determineEnding();
    expect(result).not.toBeNull();
    expect(result.id).toBe('psychological');
  });

  it('returns psychological when clues are below all thresholds', function () {
    window.gameState.cluesFound = ['registro_1861', 'mappa_campi'];
    var result = engine.determineEnding();
    expect(result.id).toBe('psychological');
  });

  /* ── military ending ── */

  it('returns military ending when esperimento_militare hypothesis is confirmed', function () {
    window.gameState.confirmedHypotheses = ['esperimento_militare'];
    var result = engine.determineEnding();
    expect(result).not.toBeNull();
    expect(result.id).toBe('military');
  });

  it('military beats alien (priority 50 > 40)', function () {
    window.gameState.confirmedHypotheses = ['esperimento_militare', 'tecnologia_aliena'];
    window.gameState.cluesFound = ['tracce_circolari'];
    var result = engine.determineEnding();
    expect(result.id).toBe('military');
  });

  /* ── alien ending ── */

  it('returns alien ending with tecnologia_aliena hypothesis + tracce_circolari clue', function () {
    window.gameState.confirmedHypotheses = ['tecnologia_aliena'];
    window.gameState.cluesFound = ['tracce_circolari'];
    var result = engine.determineEnding();
    expect(result.id).toBe('alien');
  });

  it('returns psychological if alien hypothesis present but tracce_circolari missing', function () {
    window.gameState.confirmedHypotheses = ['tecnologia_aliena'];
    // cluesFound is empty
    var result = engine.determineEnding();
    expect(result.id).toBe('psychological');
  });

  /* ── secret ending ── */

  it('returns secret ending when both required hypotheses and 8 clues', function () {
    window.gameState.confirmedHypotheses = ['falle_dimensionali', 'segnale_risposta'];
    window.gameState.cluesFound = [
      'registro_1861', 'mappa_campi', 'tracce_circolari', 'lanterna_rotta',
      'frammento', 'simboli_portone', 'lettera_censurata', 'radio_audio',
    ];
    var result = engine.determineEnding();
    expect(result.id).toBe('secret');
  });

  it('returns psychological if secret hypotheses present but not enough clues (< 8)', function () {
    window.gameState.confirmedHypotheses = ['falle_dimensionali', 'segnale_risposta'];
    window.gameState.cluesFound = ['registro_1861', 'mappa_campi']; // 2 < 8
    var result = engine.determineEnding();
    expect(result.id).toBe('psychological');
  });

  it('returns psychological if 8 clues but only one secret hypothesis', function () {
    window.gameState.confirmedHypotheses = ['falle_dimensionali']; // missing segnale_risposta
    window.gameState.cluesFound = [
      'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8',
    ];
    var result = engine.determineEnding();
    expect(result.id).toBe('psychological');
  });

  it('secret beats corruption (100 > 80) when both conditions met', function () {
    window.gameState.confirmedHypotheses = ['falle_dimensionali', 'segnale_risposta'];
    window.gameState.cluesFound = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8'];
    engine.setFlag('ending_corruzione', true);
    var result = engine.determineEnding();
    expect(result.id).toBe('secret');
  });

  /* ── corruption ending ── */

  it('returns corruption ending when ending_corruzione flag is set', function () {
    engine.setFlag('ending_corruzione', true);
    var result = engine.determineEnding();
    expect(result.id).toBe('corruption');
  });

  /* ── conspiracy ending ── */

  it('returns conspiracy ending with complotto_comunale hypothesis', function () {
    window.gameState.confirmedHypotheses = ['complotto_comunale'];
    var result = engine.determineEnding();
    expect(result.id).toBe('conspiracy');
  });

  /* ── Priority order ── */

  it('respects priority: secret > corruption > military > alien > conspiracy > psychological', function () {
    window.gameState.confirmedHypotheses = [
      'falle_dimensionali', 'segnale_risposta',
      'esperimento_militare', 'tecnologia_aliena', 'complotto_comunale',
    ];
    window.gameState.cluesFound = [
      'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'tracce_circolari',
    ];
    engine.setFlag('ending_corruzione', true);
    var result = engine.determineEnding();
    expect(result.id).toBe('secret');
  });

  it('falls through to military when secret/corruption fail but military is met', function () {
    window.gameState.confirmedHypotheses = ['esperimento_militare', 'tecnologia_aliena', 'complotto_comunale'];
    window.gameState.cluesFound = ['tracce_circolari'];
    var result = engine.determineEnding();
    expect(result.id).toBe('military');
  });
});
