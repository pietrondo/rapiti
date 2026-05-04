/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *              MAP EDITOR — VALIDATOR TESTS
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { describe, test, expect } from '@jest/globals';
import {
  validateCollider,
  validateExit,
  validateNpcSpawn,
  validateAreaObject,
  validateArea,
  validateExportData,
} from '../src/tools/mapEditor/validator.ts';
import type {
  ColliderDef,
  ExitDef,
  NpcSpawnDef,
  AreaObjectDef,
  AreaDef,
  EditorExportData,
} from '../src/tools/mapEditor/types.ts';

function makeValidCollider(): ColliderDef {
  return { x: 10, y: 20, w: 30, h: 40 };
}

function makeValidExit(): ExitDef {
  return { to: 'piazze', dir: 'down', xRange: [150, 250], spawnX: 200, spawnY: 188 };
}

function makeValidNpcSpawn(): NpcSpawnDef {
  return { id: 'ruggeri', x: 200, y: 180 };
}

function makeValidAreaObject(): AreaObjectDef {
  return { id: 'mappa_campi', x: 94, y: 151, w: 18, h: 14, type: 'clue' };
}

function makeValidArea(): AreaDef {
  return {
    name: 'Test Area',
    walkableTop: 100,
    colliders: [makeValidCollider()],
    exits: [makeValidExit()],
    npcs: [makeValidNpcSpawn()],
  };
}

function makeValidExportData(): EditorExportData {
  return {
    version: '1.0.0',
    areas: {
      piazze: {
        name: 'Piazza',
        walkableTop: 125,
        colliders: [{ x: 125, y: 0, w: 150, h: 120 }],
        exits: [{ to: 'municipio', dir: 'up', xRange: [180, 220], spawnX: 200, spawnY: 200, requiresInteract: true }],
        npcs: [],
      },
      municipio: {
        name: 'Municipio',
        walkableTop: 120,
        colliders: [{ x: 100, y: 0, w: 200, h: 120 }],
        exits: [{ to: 'piazze', dir: 'down', xRange: [150, 250], spawnX: 200, spawnY: 188 }],
        npcs: [{ id: 'ruggeri', x: 200, y: 135 }],
      },
    },
    areaObjects: {
      piazze: [{ id: 'mappa_campi', x: 94, y: 151, w: 18, h: 14, type: 'clue' }],
    },
    npcsData: [{ id: 'ruggeri', name: 'Sindaco Ruggeri' }],
  };
}

describe('validateCollider', () => {
  test('valid collider passes', () => {
    expect(validateCollider(makeValidCollider(), 'test', 0)).toEqual([]);
  });

  test('rejects x out of bounds', () => {
    const c = { ...makeValidCollider(), x: -1 };
    const errors = validateCollider(c, 'test', 0);
    expect(errors.length).toBe(1);
    expect(errors[0].field).toContain('colliders');
  });

  test('rejects y out of bounds', () => {
    const c = { ...makeValidCollider(), y: 260 };
    const errors = validateCollider(c, 'test', 0);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('rejects zero width', () => {
    const c = { ...makeValidCollider(), w: 0 };
    const errors = validateCollider(c, 'test', 0);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('rejects negative height', () => {
    const c = { ...makeValidCollider(), h: -5 };
    const errors = validateCollider(c, 'test', 0);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('rejects collider extending beyond canvas right', () => {
    const c = { x: 380, y: 10, w: 50, h: 20 };
    const errors = validateCollider(c, 'test', 0);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('validateExit', () => {
  const allAreas = ['piazze', 'municipio', 'chiesa'];

  test('valid exit passes', () => {
    expect(validateExit(makeValidExit(), 'test', 0, allAreas)).toEqual([]);
  });

  test('rejects missing target area', () => {
    const ex = { ...makeValidExit(), to: '' };
    const errors = validateExit(ex, 'test', 0, allAreas);
    expect(errors.some(e => e.message.includes('mancante'))).toBe(true);
  });

  test('rejects exit to unknown area', () => {
    const ex = { ...makeValidExit(), to: 'atlantide' };
    const errors = validateExit(ex, 'test', 0, allAreas);
    expect(errors.some(e => e.message.includes('non registrata'))).toBe(true);
  });

  test('rejects invalid direction', () => {
    const ex = { ...makeValidExit(), dir: 'nord' as any };
    const errors = validateExit(ex, 'test', 0, allAreas);
    expect(errors.some(e => e.message.includes('non valida'))).toBe(true);
  });

  test('rejects invalid xRange format', () => {
    const ex = { ...makeValidExit(), xRange: [10] as any };
    const errors = validateExit(ex, 'test', 0, allAreas);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('rejects xRange[0] >= xRange[1]', () => {
    const ex = { ...makeValidExit(), xRange: [250, 150] as [number, number] };
    const errors = validateExit(ex, 'test', 0, allAreas);
    expect(errors.some(e => e.message.includes('>='))).toBe(true);
  });

  test('rejects spawnX out of bounds', () => {
    const ex = { ...makeValidExit(), spawnX: 450 };
    const errors = validateExit(ex, 'test', 0, allAreas);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('rejects spawnY out of bounds', () => {
    const ex = { ...makeValidExit(), spawnY: -5 };
    const errors = validateExit(ex, 'test', 0, allAreas);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('validateNpcSpawn', () => {
  const knownNpcs = ['ruggeri', 'teresa', 'neri'];

  test('valid NPC spawn passes', () => {
    expect(validateNpcSpawn(makeValidNpcSpawn(), 'test', 0, knownNpcs)).toEqual([]);
  });

  test('rejects missing id', () => {
    const n = { ...makeValidNpcSpawn(), id: '' };
    const errors = validateNpcSpawn(n, 'test', 0, knownNpcs);
    expect(errors.some(e => e.message.includes('mancante'))).toBe(true);
  });

  test('rejects unknown NPC id', () => {
    const n = { ...makeValidNpcSpawn(), id: 'marco' };
    const errors = validateNpcSpawn(n, 'test', 0, knownNpcs);
    expect(errors.some(e => e.message.includes('non trovato'))).toBe(true);
  });

  test('rejects x out of bounds', () => {
    const n = { ...makeValidNpcSpawn(), x: 500 };
    const errors = validateNpcSpawn(n, 'test', 0, knownNpcs);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('validateAreaObject', () => {
  const knownClues: string[] = [];

  test('valid object passes', () => {
    expect(validateAreaObject(makeValidAreaObject(), 'test', 0, knownClues)).toEqual([]);
  });

  test('rejects missing id', () => {
    const o = { ...makeValidAreaObject(), id: '' };
    const errors = validateAreaObject(o, 'test', 0, knownClues);
    expect(errors.some(e => e.message.includes('mancante'))).toBe(true);
  });

  test('rejects invalid type', () => {
    const o = { ...makeValidAreaObject(), type: 'portal' as any };
    const errors = validateAreaObject(o, 'test', 0, knownClues);
    expect(errors.some(e => e.message.includes('non valido'))).toBe(true);
  });

  test('rejects x out of bounds', () => {
    const o = { ...makeValidAreaObject(), x: -10 };
    const errors = validateAreaObject(o, 'test', 0, knownClues);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('rejects zero width', () => {
    const o = { ...makeValidAreaObject(), w: 0 };
    const errors = validateAreaObject(o, 'test', 0, knownClues);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('rejects object extending beyond canvas', () => {
    const o = { ...makeValidAreaObject(), x: 390, w: 20 };
    const errors = validateAreaObject(o, 'test', 0, knownClues);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('allows valid types: clue, radio, recorder, scene, gatto', () => {
    const types = ['clue', 'radio', 'recorder', 'scene', 'gatto'] as const;
    for (const t of types) {
      const o = { ...makeValidAreaObject(), type: t };
      const errors = validateAreaObject(o, 'test', 0, knownClues);
      expect(errors.filter(e => e.message.includes('type')).length).toBe(0);
    }
  });
});

describe('validateArea', () => {
  const allAreas = ['piazze', 'municipio'];
  const knownNpcs = ['ruggeri'];

  test('valid area passes', () => {
    const errors = validateArea(makeValidArea(), 'test', allAreas, knownNpcs);
    expect(errors).toEqual([]);
  });

  test('rejects missing name', () => {
    const a = { ...makeValidArea(), name: '' };
    const errors = validateArea(a, 'test', allAreas, knownNpcs);
    expect(errors.some(e => e.field === 'name')).toBe(true);
  });

  test('rejects invalid walkableTop', () => {
    const a = { ...makeValidArea(), walkableTop: 999 };
    const errors = validateArea(a, 'test', allAreas, knownNpcs);
    expect(errors.some(e => e.field === 'walkableTop')).toBe(true);
  });

  test('validates all colliders in array', () => {
    const a = { ...makeValidArea(), colliders: [{ x: -1, y: 0, w: 10, h: 10 }] };
    const errors = validateArea(a, 'test', allAreas, knownNpcs);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('validates all exits in array', () => {
    const a = { ...makeValidArea(), exits: [{ ...makeValidExit(), to: 'unknown' }] };
    const errors = validateArea(a, 'test', allAreas, knownNpcs);
    expect(errors.length).toBeGreaterThan(0);
  });

  test('validates all npcs in array', () => {
    const a = { ...makeValidArea(), npcs: [{ id: 'ghost', x: 0, y: 0 }] };
    const errors = validateArea(a, 'test', allAreas, knownNpcs);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('validateExportData', () => {
  test('valid full export passes', () => {
    const result = validateExportData(makeValidExportData());
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  test('rejects empty areas', () => {
    const d = { ...makeValidExportData(), areas: {} };
    const result = validateExportData(d);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.message.includes('nessuna area'))).toBe(true);
  });

  test('rejects areaObjects for non-existent area', () => {
    const d = {
      ...makeValidExportData(),
      areaObjects: { fantasia: [{ id: 'x', x: 0, y: 0, w: 10, h: 10, type: 'clue' as const }] },
    };
    const result = validateExportData(d);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.message.includes("l'area non esiste"))).toBe(true);
  });

  test('rejects missing version', () => {
    const d = { ...makeValidExportData(), version: '' };
    const result = validateExportData(d);
    expect(result.valid).toBe(false);
  });

  test('catches invalid collider in area', () => {
    const d = makeValidExportData();
    d.areas.piazze.colliders[0] = { x: -50, y: -10, w: 10, h: 10 };
    const result = validateExportData(d);
    expect(result.valid).toBe(false);
  });

  test('catches exit to unknown area', () => {
    const d = makeValidExportData();
    d.areas.piazze.exits[0].to = 'narnia';
    const result = validateExportData(d);
    expect(result.valid).toBe(false);
  });

  test('catches NPC with unknown id', () => {
    const d = makeValidExportData();
    d.areas.municipio.npcs[0].id = 'phantom';
    const result = validateExportData(d);
    expect(result.valid).toBe(false);
  });
});
