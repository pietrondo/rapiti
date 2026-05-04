/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *  I18N COVERAGE TESTS
 *  ═══════════════════════════════════════════════════════════════════════════════
 *
 * Verifies that every clue, area, NPC, and dialogue node
 * has complete i18n translations in both Italian and English.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { describe, expect, it } from '@jest/globals';
import itDict from '../src/i18n/locales/it.mjs';
import enDict from '../src/i18n/locales/en.mjs';

// ═══════════════════════════════════════════════════════════════════════════════
// EXPECTED DATA SETS
// ═══════════════════════════════════════════════════════════════════════════════

/** All clue IDs from src/data/clues.mjs (19 total incl. quest clues) */
const ALL_CLUE_IDS = [
  // Core investigation clues
  'registro_1861',
  'mappa_campi',
  'frammento',
  'simboli_portone',
  'lanterna_rotta',
  'diario_enzo',
  'testim_tracce',
  'tracce_circolari',
  'lettera_censurata',
  'radio_audio',
  'registro_monte_ferro',
  'giornale_1952',
  'cronaca_parrocchiale',
  'verbale_carabinieri',
  'appunti_enzo_2',
  'registro_comunale',
  'nastro_monte_ferro_2',
  // Quest clues
  'menta',
  'lettera_gino',
];

/** All area IDs with player-navigable zones */
const ALL_AREA_IDS = [
  'piazze',
  'municipio',
  'chiesa',
  'bar_exterior',
  'bar_interno',
  'cimitero',
  'giardini',
  'residenziale',
  'industriale',
  'campo',
  'polizia',
];

/** All NPC IDs from npcData.mjs */
const ALL_NPC_IDS = [
  'ruggeri',
  'teresa',
  'osvaldo',
  'gino',
  'don_pietro',
  'neri',
  'valli',
  'anselmo',
];

/** All hypothesis IDs from clues.mjs */
const ALL_HYPOTHESIS_IDS = [
  'esperimento_militare',
  'rapimento_ciclico',
  'tecnologia_aliena',
  'falle_dimensionali',
  'complotto_comunale',
  'segnale_risposta',
];

// ═══════════════════════════════════════════════════════════════════════════════
// HELPER
// ═══════════════════════════════════════════════════════════════════════════════

function checkKeysExist(
  dict: Record<string, string>,
  prefix: string,
  ids: string[],
  suffixes: string[]
): string[] {
  const missing: string[] = [];
  for (const id of ids) {
    for (const suffix of suffixes) {
      const key = `${prefix}${id}${suffix}`;
      if (!(key in dict)) {
        missing.push(key);
      }
    }
  }
  return missing;
}

// ═══════════════════════════════════════════════════════════════════════════════
// TESTS
// ═══════════════════════════════════════════════════════════════════════════════

describe('I18N Clue Coverage', () => {
  it('every clue ID should have clue.<id>.name in IT dictionary', () => {
    const missing = checkKeysExist(itDict, 'clue.', ALL_CLUE_IDS, ['.name']);
    if (missing.length > 0) {
      console.warn('Missing IT clue name keys:', missing);
    }
    expect(missing).toEqual([]);
  });

  it('every clue ID should have clue.<id>.desc in IT dictionary', () => {
    const missing = checkKeysExist(itDict, 'clue.', ALL_CLUE_IDS, ['.desc']);
    if (missing.length > 0) {
      console.warn('Missing IT clue desc keys:', missing);
    }
    expect(missing).toEqual([]);
  });

  it('every clue ID should have clue.<id>.name in EN dictionary', () => {
    const missing = checkKeysExist(enDict, 'clue.', ALL_CLUE_IDS, ['.name']);
    if (missing.length > 0) {
      console.warn('Missing EN clue name keys:', missing);
    }
    expect(missing).toEqual([]);
  });

  it('every clue ID should have clue.<id>.desc in EN dictionary', () => {
    const missing = checkKeysExist(enDict, 'clue.', ALL_CLUE_IDS, ['.desc']);
    if (missing.length > 0) {
      console.warn('Missing EN clue desc keys:', missing);
    }
    expect(missing).toEqual([]);
  });

  it('all clue translations should be non-empty strings', () => {
    const emptyKeys: string[] = [];
    for (const id of ALL_CLUE_IDS) {
      for (const suffix of ['.name', '.desc']) {
        const key = `clue.${id}${suffix}`;
        // Check IT
        if (key in itDict && (!itDict[key] || (itDict[key] as string).trim() === '')) {
          emptyKeys.push(`IT:${key}`);
        }
        // Check EN
        if (key in enDict && (!enDict[key] || (enDict[key] as string).trim() === '')) {
          emptyKeys.push(`EN:${key}`);
        }
      }
    }
    if (emptyKeys.length > 0) {
      console.warn('Empty clue translation values:', emptyKeys);
    }
    expect(emptyKeys).toEqual([]);
  });
});

describe('I18N Area Coverage', () => {
  it('every area ID should have area.<id> in IT dictionary', () => {
    const missing = checkKeysExist(itDict, 'area.', ALL_AREA_IDS, ['']);
    if (missing.length > 0) {
      console.warn('Missing IT area keys:', missing);
    }
    expect(missing).toEqual([]);
  });

  it('every area ID should have area.<id> in EN dictionary', () => {
    const missing = checkKeysExist(enDict, 'area.', ALL_AREA_IDS, ['']);
    if (missing.length > 0) {
      console.warn('Missing EN area keys:', missing);
    }
    expect(missing).toEqual([]);
  });

  it('all area translations should be non-empty', () => {
    const emptyKeys: string[] = [];
    for (const id of ALL_AREA_IDS) {
      const key = `area.${id}`;
      if (key in itDict && (!itDict[key] || (itDict[key] as string).trim() === '')) {
        emptyKeys.push(`IT:${key}`);
      }
      if (key in enDict && (!enDict[key] || (enDict[key] as string).trim() === '')) {
        emptyKeys.push(`EN:${key}`);
      }
    }
    if (emptyKeys.length > 0) {
      console.warn('Empty area translation values:', emptyKeys);
    }
    expect(emptyKeys).toEqual([]);
  });
});

describe('I18N NPC Coverage', () => {
  it('every NPC ID should have npc.<id> in IT dictionary', () => {
    const missing = checkKeysExist(itDict, 'npc.', ALL_NPC_IDS, ['']);
    if (missing.length > 0) {
      console.warn('Missing IT NPC keys:', missing);
    }
    expect(missing).toEqual([]);
  });

  it('every NPC ID should have npc.<id> in EN dictionary', () => {
    const missing = checkKeysExist(enDict, 'npc.', ALL_NPC_IDS, ['']);
    if (missing.length > 0) {
      console.warn('Missing EN NPC keys:', missing);
    }
    expect(missing).toEqual([]);
  });

  it('all NPC name translations should be non-empty', () => {
    const emptyKeys: string[] = [];
    for (const id of ALL_NPC_IDS) {
      const key = `npc.${id}`;
      if (key in itDict && (!itDict[key] || (itDict[key] as string).trim() === '')) {
        emptyKeys.push(`IT:${key}`);
      }
      if (key in enDict && (!enDict[key] || (enDict[key] as string).trim() === '')) {
        emptyKeys.push(`EN:${key}`);
      }
    }
    if (emptyKeys.length > 0) {
      console.warn('Empty NPC translation values:', emptyKeys);
    }
    expect(emptyKeys).toEqual([]);
  });
});

describe('I18N Hypothesis Coverage', () => {
  it('every hypothesis ID should have hypo.<id>.name in IT dictionary', () => {
    const missing = checkKeysExist(itDict, 'hypo.', ALL_HYPOTHESIS_IDS, ['.name']);
    if (missing.length > 0) {
      console.warn('Missing IT hypothesis name keys:', missing);
    }
    expect(missing).toEqual([]);
  });

  it('every hypothesis ID should have hypo.<id>.desc in IT dictionary', () => {
    const missing = checkKeysExist(itDict, 'hypo.', ALL_HYPOTHESIS_IDS, ['.desc']);
    if (missing.length > 0) {
      console.warn('Missing IT hypothesis desc keys:', missing);
    }
    expect(missing).toEqual([]);
  });

  it('every hypothesis ID should have hypo.<id>.name in EN dictionary', () => {
    const missing = checkKeysExist(enDict, 'hypo.', ALL_HYPOTHESIS_IDS, ['.name']);
    if (missing.length > 0) {
      console.warn('Missing EN hypothesis name keys:', missing);
    }
    expect(missing).toEqual([]);
  });

  it('every hypothesis ID should have hypo.<id>.desc in EN dictionary', () => {
    const missing = checkKeysExist(enDict, 'hypo.', ALL_HYPOTHESIS_IDS, ['.desc']);
    if (missing.length > 0) {
      console.warn('Missing EN hypothesis desc keys:', missing);
    }
    expect(missing).toEqual([]);
  });
});

describe('I18N Cross-Locale Key Parity', () => {
  it('IT and EN should have exactly the same set of keys', () => {
    const itKeys = Object.keys(itDict).sort();
    const enKeys = Object.keys(enDict).sort();

    const missingInEn = itKeys.filter((k) => !enKeys.includes(k));
    const missingInIt = enKeys.filter((k) => !itKeys.includes(k));

    if (missingInEn.length > 0) {
      console.warn('Keys in IT but missing in EN:', missingInEn);
    }
    if (missingInIt.length > 0) {
      console.warn('Keys in EN but missing in IT:', missingInIt);
    }

    expect(missingInEn).toEqual([]);
    expect(missingInIt).toEqual([]);
  });
});
