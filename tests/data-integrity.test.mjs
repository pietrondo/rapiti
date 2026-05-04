import { beforeAll, describe, expect, it } from '@jest/globals';

const areaModulePaths = [
  '../src/areas/piazze.mjs',
  '../src/areas/chiesa.mjs',
  '../src/areas/cimitero.mjs',
  '../src/areas/giardini.mjs',
  '../src/areas/campo.mjs',
  '../src/areas/barExterior.mjs',
  '../src/areas/barInterno.mjs',
  '../src/areas/municipio.mjs',
  '../src/areas/residenziale.mjs',
  '../src/areas/industriale.mjs',
  '../src/areas/polizia.mjs',
];

describe('data integrity', () => {
  beforeAll(async () => {
    await import('../src/data/clues.mjs');
    for (const modulePath of areaModulePaths) {
      await import(modulePath);
    }
    await import(`../src/areas/index.mjs?dataIntegrity=${Date.now()}`);
  });

  it('registers every runtime area module, including the final field', () => {
    expect(window.areaManager.getIds().sort()).toEqual([
      'bar_exterior',
      'bar_interno',
      'campo',
      'chiesa',
      'cimitero',
      'giardini',
      'industriale',
      'municipio',
      'piazze',
      'polizia',
      'residenziale',
    ]);
  });

  it('keeps clue areas and areaObjects aligned with registered areas', () => {
    const areaIds = new Set(window.areaManager.getIds());
    const clueAreas = window.clues
      .filter((clue) => !areaIds.has(clue.area))
      .map((clue) => `${clue.id}:${clue.area}`);
    const objectAreas = Object.keys(window.areaObjects).filter((areaId) => !areaIds.has(areaId));

    expect(clueAreas).toEqual([]);
    expect(objectAreas).toEqual([]);
  });

  it('keeps areaObjects clue references valid', () => {
    const specialTypes = new Set(['radio', 'recorder', 'gatto']);
    const missingClues = [];

    for (const [areaId, objects] of Object.entries(window.areaObjects)) {
      for (const object of objects) {
        if (object.type === 'clue' && !window.cluesMap[object.id]) {
          missingClues.push(`${areaId}:${object.id}`);
        }
        if (object.requires && !window.cluesMap[object.requires]) {
          missingClues.push(`${areaId}:${object.id}.requires:${object.requires}`);
        }
        if (object.type !== 'clue' && !specialTypes.has(object.type)) {
          missingClues.push(`${areaId}:${object.id}.type:${object.type}`);
        }
      }
    }

    expect(missingClues).toEqual([]);
  });

  it('keeps exits pointing to registered areas', () => {
    const areaIds = new Set(window.areaManager.getIds());
    const invalidExits = [];

    for (const areaId of areaIds) {
      const area = window.areaManager.get(areaId);
      for (const exit of area.exits || []) {
        if (!areaIds.has(exit.to)) invalidExits.push(`${areaId}->${exit.to}`);
      }
    }

    expect(invalidExits).toEqual([]);
  });

  it('keeps NPCs aligned with npcsData and placed in areas', async () => {
    const npcData = (await import('../src/data/npcData.mjs')).default;
    const registeredNpcIds = new Set(npcData.map((n) => n.id));
    const placedNpcIds = new Set();
    const areaIds = window.areaManager.getIds();
    const invalidNpcs = [];

    for (const areaId of areaIds) {
      const area = window.areaManager.get(areaId);
      for (const npc of area.npcs || []) {
        if (!registeredNpcIds.has(npc.id)) {
          invalidNpcs.push(`${areaId}:unknown_npc:${npc.id}`);
        }
        placedNpcIds.add(npc.id);
      }
    }

    expect(invalidNpcs).toEqual([]);
    // Ensure all registered NPCs are placed somewhere
    const unplacedNpcs = [...registeredNpcIds].filter((id) => !placedNpcIds.has(id));
    expect(unplacedNpcs).toEqual([]);
  });

  it('gates the Campo delle Luci behind deduction completion', () => {
    const giardini = window.areaManager.get('giardini');
    const campoExit = giardini.exits.find((exit) => exit.to === 'campo');

    expect(campoExit).toMatchObject({
      dir: 'left',
      requiresFlag: 'deduction_complete',
    });
    expect(window.cluesMap.tracce_circolari.area).toBe('campo');
    expect(window.areaObjects.campo.some((object) => object.id === 'tracce_circolari')).toBe(true);
  });
});
