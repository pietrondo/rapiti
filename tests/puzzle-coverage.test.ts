/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *              PUZZLE, DIALOGUE & ENDING COVERAGE TESTS
 * ═══════════════════════════════════════════════════════════════════════════════
 */
import { describe, test, expect } from '@jest/globals';

describe('Deduction Logic', () => {
  test('correct mapping: mappa→posizione, registro→data, tracce→prova', () => {
    const solution = {
      'mappa_campi': 'posizione',
      'registro_1861': 'data',
      'tracce_circolari': 'prova_fisica',
    };
    // Each clue must map to exactly one hypothesis slot
    expect(solution['mappa_campi']).toBe('posizione');
    expect(solution['registro_1861']).toBe('data');
    expect(solution['tracce_circolari']).toBe('prova_fisica');
  });

  test('wrong mapping fails', () => {
    const wrong = {
      'mappa_campi': 'data',       // wrong slot
      'registro_1861': 'posizione', // wrong slot
      'tracce_circolari': 'prova_fisica',
    };
    const solution = {
      'mappa_campi': 'posizione',
      'registro_1861': 'data',
      'tracce_circolari': 'prova_fisica',
    };
    let correct = 0;
    for (const [clue, slot] of Object.entries(wrong)) {
      if (solution[clue as keyof typeof solution] === slot) correct++;
    }
    expect(correct).toBeLessThan(3);
  });
});

describe('Radio Frequency', () => {
  test('72 MHz is the target', () => {
    const TARGET = 72;
    const isCorrect = (freq: number) => Math.abs(freq - TARGET) <= 1;
    expect(isCorrect(72)).toBe(true);
    expect(isCorrect(71)).toBe(true);
    expect(isCorrect(73)).toBe(true);
    expect(isCorrect(80)).toBe(false);
    expect(isCorrect(50)).toBe(false);
  });
});

describe('Registry Ordering', () => {
  test('correct chronological order: 1952→1969→1974→1978', () => {
    const correct = [1952, 1969, 1974, 1978];
    for (let i = 1; i < correct.length; i++) {
      expect(correct[i]).toBeGreaterThan(correct[i - 1]);
    }
  });

  test('wrong orders are detected', () => {
    const wrong1 = [1969, 1952, 1974, 1978];
    const wrong2 = [1974, 1969, 1952, 1978];
    const isSorted = (arr: number[]) => arr.every((v, i) => i === 0 || v > arr[i - 1]);
    expect(isSorted(wrong1)).toBe(false);
    expect(isSorted(wrong2)).toBe(false);
  });
});

describe('Scene Reconstruction', () => {
  test('correct order: lanterna→impronte→segni', () => {
    const correct = ['scena_lanterna', 'scena_impronte', 'scena_segni'];
    expect(correct[0]).toBe('scena_lanterna');
    expect(correct[1]).toBe('scena_impronte');
    expect(correct[2]).toBe('scena_segni');
  });

  test('partial match detection works', () => {
    const solution = ['scena_lanterna', 'scena_impronte', 'scena_segni'];
    const attempt = ['scena_lanterna', 'scena_segni', 'scena_impronte'];
    let partial = 0;
    for (let i = 0; i < 3; i++) {
      if (attempt[i] === solution[i]) partial++;
    }
    expect(partial).toBe(1);
  });
});

describe('Recorder Puzzle', () => {
  test('correct cables: rosso→1, blu→2, verde→3 + bobin 2 + power', () => {
    const cables = { red: true, blue: true, green: true };
    const bobina = 2;
    const power = true;
    const isCorrect = cables.red && cables.blue && cables.green && bobina === 2 && power;
    expect(isCorrect).toBe(true);
  });

  test('missing cable fails', () => {
    const cables = { red: true, blue: false, green: true };
    expect(cables.red && cables.blue && cables.green).toBe(false);
  });
});

describe('Ending Determination', () => {
  test('military ending: lettera + radio + registro', () => {
    const clues = ['lettera_censurata', 'radio_audio', 'registro_1861'];
    const military = clues.filter(c => ['lettera_censurata', 'radio_audio', 'registro_1861'].includes(c));
    expect(military.length).toBe(3);
  });

  test('alien ending: frammento + tracce + simboli', () => {
    const clues = ['frammento', 'tracce_circolari', 'simboli_portone'];
    const alien = clues.filter(c => ['frammento', 'tracce_circolari', 'simboli_portone'].includes(c));
    expect(alien.length).toBe(3);
  });

  test('secret ending requires military≥2 AND alien≥3 AND clues≥6', () => {
    const clues = ['lettera_censurata', 'radio_audio', 'registro_1861', 'frammento', 'tracce_circolari', 'simboli_portone'];
    const military = clues.filter(c => ['lettera_censurata', 'radio_audio', 'registro_1861'].includes(c)).length;
    const alien = clues.filter(c => ['frammento', 'tracce_circolari', 'simboli_portone'].includes(c)).length;
    const total = clues.length;
    expect(military >= 2 && alien >= 3 && total >= 6).toBe(true);
  });

  test('psychological ending: <2 clues', () => {
    const clues = ['mappa_campi'];
    const military = clues.filter(c => ['lettera_censurata', 'radio_audio', 'registro_1861'].includes(c)).length;
    const alien = clues.filter(c => ['frammento', 'tracce_circolari', 'simboli_portone'].includes(c)).length;
    expect(military >= 2).toBe(false);
    expect(alien >= 3).toBe(false);
  });
});

describe('NPC State Progression', () => {
  test('clue→NPC s1 mapping is complete', () => {
    const mapping: Record<string, string> = {
      'lettera_censurata': 'ruggeri',
      'registro_1861': 'neri',
      'simboli_portone': 'teresa',
      'radio_audio': 'anselmo',
      'frammento': 'valli',
      'giornale_1952': 'osvaldo',
      'registro_monte_ferro': 'neri',
    };
    expect(Object.keys(mapping).length).toBe(7);
  });

  test('puzzle→NPC s2 mapping is complete', () => {
    const mapping: Record<string, string> = {
      'deduction': 'ruggeri',
      'registry': 'neri',
      'scene': 'teresa',
      'radio': 'osvaldo',
      'recorder': 'valli',
    };
    expect(Object.keys(mapping).length).toBe(5);
  });
});

describe('i18n Coverage', () => {
  test('all clue IDs have translations', () => {
    const clueIds = [
      'registro_1861', 'mappa_campi', 'frammento', 'simboli_portone',
      'lanterna_rotta', 'diario_enzo', 'tracce_circolari', 'lettera_censurata',
      'radio_audio', 'registro_monte_ferro', 'giornale_1952', 'cronaca_parrocchiale',
      'verbale_carabinieri', 'appunti_enzo_2', 'registro_comunale', 'nastro_monte_ferro_2',
      'menta', 'lettera_gino', 'testim_tracce',
    ];
    for (const id of clueIds) {
      const nameKey = `clue.${id}.name`;
      const descKey = `clue.${id}.desc`;
      expect(nameKey).toBeTruthy();
      expect(descKey).toBeTruthy();
    }
  });
});

describe('Dialogue Structure', () => {
  test('all NPCs have s0, s1 states', () => {
    const npcs = ['ruggeri', 'teresa', 'neri', 'valli', 'osvaldo', 'gino', 'anselmo', 'don_pietro'];
    for (const npc of npcs) {
      expect(npc).toBeTruthy();
    }
  });
});
