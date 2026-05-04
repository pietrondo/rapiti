/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *              SPAWN POINT VALIDATION TESTS
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Verifica che NESSUNO spawn point metta il giocatore dentro un collider
 * o fuori dal canvas. Per ogni area, controlla tutte le entrate da altre aree.
 */

import { describe, test, expect } from '@jest/globals';

const PLAYER_W = 10;
const PLAYER_H = 14;
const CANVAS_W = 400;
const CANVAS_H = 250;

interface Collider { x: number; y: number; w: number; h: number; }
interface Exit { to: string; dir: string; xRange: [number, number]; spawnX: number; spawnY: number; }
interface Area { name: string; walkableTop?: number; colliders: Collider[]; exits: Exit[]; npcs: { id: string; x: number; y: number }[]; }

/** Simula la collisione AABB player vs collider */
function collides(px: number, py: number, c: Collider): boolean {
  return px + PLAYER_W > c.x && px < c.x + c.w && py + PLAYER_H > c.y && py < c.y + c.h;
}

/** Mock minimale delle aree e dei loro exit */
const AREAS: Record<string, Area> = {
  piazze: {
    name: 'Piazza',
    walkableTop: 125,
    colliders: [
      { x: 125, y: 0, w: 150, h: 120 },
      { x: 302, y: 0, w: 23, h: 160 },
      { x: 349, y: 0, w: 51, h: 160 },
      { x: 82, y: 0, w: 36, h: 160 },
      { x: 240, y: 155, w: 42, h: 28 },
      { x: 0, y: 0, w: 100, h: 120 },
    ],
    exits: [
      { to: 'municipio', dir: 'up', xRange: [180, 220], spawnX: 200, spawnY: 200 },
      { to: 'chiesa', dir: 'up', xRange: [20, 80], spawnX: 200, spawnY: 220 },
      { to: 'bar_exterior', dir: 'up', xRange: [320, 350], spawnX: 130, spawnY: 175 },
      { to: 'residenziale', dir: 'down', xRange: [160, 240], spawnX: 200, spawnY: 140 },
      { to: 'giardini', dir: 'left', xRange: [100, 200], spawnX: 340, spawnY: 175 },
    ],
    npcs: [],
  },
  chiesa: {
    name: 'Chiesa',
    walkableTop: 145,
    colliders: [
      { x: 90, y: 0, w: 220, h: 145 },
      { x: 290, y: 0, w: 50, h: 145 },
    ],
    exits: [
      { to: 'cimitero', dir: 'up', xRange: [175, 225], spawnX: 200, spawnY: 112 },
      { to: 'piazze', dir: 'down', xRange: [150, 250], spawnX: 200, spawnY: 155 },
    ],
    npcs: [{ id: 'don_pietro', x: 200, y: 180 }],
  },
  cimitero: {
    name: 'Cimitero',
    walkableTop: 100,
    colliders: [],
    exits: [
      { to: 'chiesa', dir: 'down', xRange: [150, 250], spawnX: 200, spawnY: 200 },
    ],
    npcs: [],
  },
  giardini: {
    name: 'Giardini',
    walkableTop: 100,
    colliders: [],
    exits: [
      { to: 'piazze', dir: 'right', xRange: [100, 200], spawnX: 35, spawnY: 175 },
      { to: 'campo', dir: 'left', xRange: [100, 200], spawnX: 370, spawnY: 170 },
    ],
    npcs: [{ id: 'anselmo', x: 120, y: 170 }],
  },
  campo: {
    name: 'Campo',
    walkableTop: 88,
    colliders: [],
    exits: [
      { to: 'giardini', dir: 'right', xRange: [135, 200], spawnX: 35, spawnY: 170 },
    ],
    npcs: [{ id: 'teresa', x: 210, y: 160 }],
  },
  bar_exterior: {
    name: 'Bar Esterno',
    walkableTop: 130,
    colliders: [
      { x: 82, y: 0, w: 236, h: 130 },
      { x: 112, y: 150, w: 34, h: 24 },
      { x: 226, y: 150, w: 34, h: 24 },
      { x: 302, y: 138, w: 24, h: 34 },
    ],
    exits: [
      { to: 'piazze', dir: 'down', xRange: [100, 200], spawnX: 337, spawnY: 175 },
      { to: 'bar_interno', dir: 'up', xRange: [180, 220], spawnX: 200, spawnY: 220 },
    ],
    npcs: [{ id: 'osvaldo', x: 280, y: 175 }],
  },
  bar_interno: {
    name: 'Bar Interno',
    walkableTop: 120,
    colliders: [
      { x: 80, y: 50, w: 240, h: 70 },
    ],
    exits: [
      { to: 'bar_exterior', dir: 'down', xRange: [150, 250], spawnX: 200, spawnY: 188 },
    ],
    npcs: [{ id: 'osvaldo', x: 150, y: 120 }],
  },
  municipio: {
    name: 'Municipio',
    walkableTop: 140,
    colliders: [
      { x: 110, y: 65, w: 180, h: 50 },
      { x: 10, y: 15, w: 70, h: 110 },
    ],
    exits: [
      { to: 'piazze', dir: 'down', xRange: [0, 400], spawnX: 200, spawnY: 150 },
    ],
    npcs: [{ id: 'ruggeri', x: 200, y: 135 }],
  },
  residenziale: {
    name: 'Residenziale',
    walkableTop: 110,
    colliders: [
      { x: 0, y: 0, w: 400, h: 110 },
    ],
    exits: [
      { to: 'piazze', dir: 'up', xRange: [160, 240], spawnX: 200, spawnY: 220 },
      { to: 'industriale', dir: 'down', xRange: [0, 400], spawnX: 200, spawnY: 210 },
    ],
    npcs: [{ id: 'gino', x: 200, y: 180 }],
  },
  industriale: {
    name: 'Industriale',
    walkableTop: 80,
    colliders: [
      { x: 80, y: 0, w: 240, h: 118 },
      { x: 20, y: 120, w: 60, h: 40 },
      { x: 310, y: 100, w: 70, h: 50 },
    ],
    exits: [
      { to: 'residenziale', dir: 'up', xRange: [180, 220], spawnX: 200, spawnY: 210 },
      { to: 'polizia', dir: 'down', xRange: [170, 230], spawnX: 200, spawnY: 130 },
    ],
    npcs: [],
  },
  polizia: {
    name: 'Polizia',
    walkableTop: 115,
    colliders: [
      { x: 140, y: 55, w: 120, h: 45 },
      { x: 340, y: 20, w: 40, h: 80 },
      { x: 10, y: 10, w: 60, h: 80 },
    ],
    exits: [
      { to: 'industriale', dir: 'down', xRange: [170, 230], spawnX: 200, spawnY: 130 },
    ],
    npcs: [{ id: 'neri', x: 160, y: 140 }],
  },
};

describe('Spawn Point Safety', () => {
  // Raccogli tutte le entrate: per ogni area A, exit di altre aree che puntano ad A
  const entries: Record<string, { from: string; spawnX: number; spawnY: number }[]> = {};
  for (const [areaId, area] of Object.entries(AREAS)) {
    entries[areaId] = [];
  }
  for (const [fromId, area] of Object.entries(AREAS)) {
    for (const ex of area.exits) {
      if (AREAS[ex.to]) {
        entries[ex.to].push({ from: fromId, spawnX: ex.spawnX, spawnY: ex.spawnY });
      }
    }
  }

  for (const [areaId, spawns] of Object.entries(entries)) {
    const area = AREAS[areaId];
    if (!area) continue;

    for (const sp of spawns) {
      test(`entrata in "${areaId}" da "${sp.from}" a (${sp.spawnX},${sp.spawnY}) non collide`, () => {
        // 1. Dentro il canvas?
        expect(sp.spawnX).toBeGreaterThanOrEqual(0);
        expect(sp.spawnX + PLAYER_W).toBeLessThanOrEqual(CANVAS_W);
        expect(sp.spawnY).toBeGreaterThanOrEqual(0);
        expect(sp.spawnY + PLAYER_H).toBeLessThanOrEqual(CANVAS_H);

        // 2. Non collide con nessun collider dell'area target
        for (const c of area.colliders) {
          expect(collides(sp.spawnX, sp.spawnY, c)).toBe(false);
        }
      });
    }
  }

  test('ogni area ha almeno un ingresso (raggiungibile)', () => {
    for (const [areaId, spawns] of Object.entries(entries)) {
      if (areaId === 'piazze') continue; // piazze è lo start, non ha ingressi
      expect(spawns.length).toBeGreaterThan(0);
    }
  });

  test('nessuno spawn è fuori dal canvas', () => {
    for (const [areaId, spawns] of Object.entries(entries)) {
      for (const sp of spawns) {
        expect(sp.spawnX).toBeGreaterThanOrEqual(0);
        expect(sp.spawnY).toBeGreaterThanOrEqual(0);
        expect(sp.spawnX + PLAYER_W).toBeLessThanOrEqual(CANVAS_W);
        expect(sp.spawnY + PLAYER_H).toBeLessThanOrEqual(CANVAS_H);
      }
    }
  });
});
