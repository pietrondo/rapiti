"use strict";

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
  '../src/areas/archivio.mjs',
  '../src/areas/cascina.mjs',
  '../src/areas/cascina_interno.mjs',
  '../src/areas/monte_ferro.mjs',
  '../src/areas/fienile.mjs',
];

var OPPOSITE_DIR = { up: 'down', down: 'up', left: 'right', right: 'left' };

var SYMMETRY_PAIRS = [
  ['piazze', 'archivio'],
  ['giardini', 'cascina'],
  ['cascina', 'cascina_interno'],
  ['cascina', 'fienile'],
  ['industriale', 'monte_ferro'],
];

var ALL_16_IDS = [
  'piazze', 'chiesa', 'cimitero', 'giardini', 'campo',
  'bar_exterior', 'bar_interno', 'municipio', 'residenziale',
  'industriale', 'polizia', 'archivio', 'cascina',
  'cascina_interno', 'monte_ferro', 'fienile',
];

describe('area structure integrity', () => {
  beforeAll(async () => {
    for (var i = 0; i < areaModulePaths.length; i++) {
      await import(areaModulePaths[i]);
    }
    await import(`../src/areas/index.mjs?areaStructure=${Date.now()}`);
  });

  it('registers all 16 areas', () => {
    expect(window.areaManager.getIds().sort()).toEqual([...ALL_16_IDS].sort());
  });

  describe('required properties', () => {
    for (let a = 0; a < ALL_16_IDS.length; a++) {
      let areaId = ALL_16_IDS[a];

      it(`${areaId} has name (string)`, () => {
        var area = window.areaManager.get(areaId);
        expect(typeof area.name).toBe('string');
      });

      it(`${areaId} has walkableTop (number)`, () => {
        var area = window.areaManager.get(areaId);
        expect(typeof area.walkableTop).toBe('number');
      });

      it(`${areaId} has colliders (array)`, () => {
        var area = window.areaManager.get(areaId);
        expect(Array.isArray(area.colliders)).toBe(true);
      });

      it(`${areaId} has npcs (array)`, () => {
        var area = window.areaManager.get(areaId);
        expect(Array.isArray(area.npcs)).toBe(true);
      });

      it(`${areaId} has exits (array)`, () => {
        var area = window.areaManager.get(areaId);
        expect(Array.isArray(area.exits)).toBe(true);
      });

      it(`${areaId} has draw (function)`, () => {
        var area = window.areaManager.get(areaId);
        expect(typeof area.draw).toBe('function');
      });
    }
  });

  describe('collider validity', () => {
    for (let a = 0; a < ALL_16_IDS.length; a++) {
      let areaId = ALL_16_IDS[a];

      it(`${areaId} colliders have x, y, w, h as numbers`, () => {
        var area = window.areaManager.get(areaId);
        if (!area.colliders || area.colliders.length === 0) return;
        for (var c = 0; c < area.colliders.length; c++) {
          var collider = area.colliders[c];
          expect(typeof collider.x).toBe('number');
          expect(typeof collider.y).toBe('number');
          expect(typeof collider.w).toBe('number');
          expect(typeof collider.h).toBe('number');
        }
      });
    }
  });

  describe('npc validity', () => {
    for (let a = 0; a < ALL_16_IDS.length; a++) {
      let areaId = ALL_16_IDS[a];

      it(`${areaId} NPCs have id (string), x (number), y (number)`, () => {
        var area = window.areaManager.get(areaId);
        if (!area.npcs || area.npcs.length === 0) return;
        for (var n = 0; n < area.npcs.length; n++) {
          var npc = area.npcs[n];
          expect(typeof npc.id).toBe('string');
          expect(typeof npc.x).toBe('number');
          expect(typeof npc.y).toBe('number');
        }
      });
    }
  });

  describe('exit target validity', () => {
    for (let a = 0; a < ALL_16_IDS.length; a++) {
      let areaId = ALL_16_IDS[a];

      it(`${areaId} exits point to registered areas`, () => {
        var area = window.areaManager.get(areaId);
        var registered = new Set(window.areaManager.getIds());
        if (!area.exits || area.exits.length === 0) return;
        for (var e = 0; e < area.exits.length; e++) {
          expect(registered.has(area.exits[e].to)).toBe(true);
        }
      });
    }
  });

  describe('exit symmetry', () => {
    for (let p = 0; p < SYMMETRY_PAIRS.length; p++) {
      var pair = SYMMETRY_PAIRS[p];
      let a = pair[0];
      let b = pair[1];

      it(`${a} <-> ${b} have bidirectional exits`, () => {
        var areaA = window.areaManager.get(a);
        var areaB = window.areaManager.get(b);
        var aToB = areaA.exits.filter(function (e) { return e.to === b; });
        var bToA = areaB.exits.filter(function (e) { return e.to === a; });
        expect(aToB.length).toBeGreaterThanOrEqual(1);
        expect(bToA.length).toBeGreaterThanOrEqual(1);
      });

      it(`${a} <-> ${b} have opposite dirs`, () => {
        var areaA = window.areaManager.get(a);
        var areaB = window.areaManager.get(b);
        for (var i = 0; i < areaA.exits.length; i++) {
          var aExit = areaA.exits[i];
          if (aExit.to !== b) continue;
          var reverse = null;
          for (var j = 0; j < areaB.exits.length; j++) {
            if (areaB.exits[j].to === a) { reverse = areaB.exits[j]; break; }
          }
          if (reverse) {
            expect(reverse.dir).toBe(OPPOSITE_DIR[aExit.dir]);
          }
        }
      });
    }
  });

  describe('new area content', () => {
    it('archivio has neri NPC', () => {
      var archivio = window.areaManager.get('archivio');
      var found = false;
      for (var n = 0; n < archivio.npcs.length; n++) {
        if (archivio.npcs[n].id === 'neri') found = true;
      }
      expect(found).toBe(true);
    });

    it('cascina has no NPCs', () => {
      var cascina = window.areaManager.get('cascina');
      expect(cascina.npcs.length).toBe(0);
    });

    it('cascina_interno has teresa NPC', () => {
      var cascinaInterno = window.areaManager.get('cascina_interno');
      var found = false;
      for (var n = 0; n < cascinaInterno.npcs.length; n++) {
        if (cascinaInterno.npcs[n].id === 'teresa') found = true;
      }
      expect(found).toBe(true);
    });

    it('monte_ferro has no NPCs', () => {
      var monteFerro = window.areaManager.get('monte_ferro');
      expect(monteFerro.npcs.length).toBe(0);
    });

    it('fienile has no NPCs', () => {
      var fienile = window.areaManager.get('fienile');
      expect(fienile.npcs.length).toBe(0);
    });
  });

  describe('puzzle area exits', () => {
    it('cascina has requiresInteract exit to cascina_interno', () => {
      var cascina = window.areaManager.get('cascina');
      var exit = null;
      for (var e = 0; e < cascina.exits.length; e++) {
        if (cascina.exits[e].to === 'cascina_interno') { exit = cascina.exits[e]; break; }
      }
      expect(exit).not.toBeNull();
      expect(exit.requiresInteract).toBe(true);
    });
  });
});
