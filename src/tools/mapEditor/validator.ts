/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    MAP EDITOR — VALIDATOR
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Valida i dati dell'editor mappe: coordinate, ID, riferimenti incrociati.
 */

import type {
  AreaDef,
  AreaObjectDef,
  ColliderDef,
  ExitDef,
  NpcSpawnDef,
  NpcDataDef,
  ClueDef,
  EditorExportData,
} from './types.ts';

export interface ValidationError {
  area: string;
  field: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

const CANVAS_W = 400;
const CANVAS_H = 250;

function err(area: string, field: string, message: string): ValidationError {
  return { area, field, message };
}

/** Valida un singolo collider */
export function validateCollider(c: ColliderDef, areaId: string, index: number): ValidationError[] {
  const e: ValidationError[] = [];
  const prefix = `colliders[${index}]`;
  if (typeof c.x !== 'number' || c.x < 0 || c.x > CANVAS_W) e.push(err(areaId, prefix, `X=${c.x} fuori canvas [0,${CANVAS_W}]`));
  if (typeof c.y !== 'number' || c.y < 0 || c.y > CANVAS_H) e.push(err(areaId, prefix, `Y=${c.y} fuori canvas [0,${CANVAS_H}]`));
  if (typeof c.w !== 'number' || c.w <= 0) e.push(err(areaId, prefix, `w=${c.w} deve essere >0`));
  if (typeof c.h !== 'number' || c.h <= 0) e.push(err(areaId, prefix, `h=${c.h} deve essere >0`));
  if (c.x + c.w > CANVAS_W) e.push(err(areaId, prefix, `x+w=${c.x + c.w} eccede canvas ${CANVAS_W}`));
  if (c.y + c.h > CANVAS_H) e.push(err(areaId, prefix, `y+h=${c.y + c.h} eccede canvas ${CANVAS_H}`));
  return e;
}

/** Valida una singola exit */
export function validateExit(ex: ExitDef, areaId: string, index: number, allAreaIds: string[]): ValidationError[] {
  const e: ValidationError[] = [];
  const prefix = `exits[${index}]`;
  if (!ex.to || typeof ex.to !== 'string') e.push(err(areaId, prefix, 'campo "to" mancante'));
  else if (!allAreaIds.includes(ex.to)) e.push(err(areaId, prefix, `exit verso area "${ex.to}" non registrata`));
  if (!['up', 'down', 'left', 'right'].includes(ex.dir)) e.push(err(areaId, prefix, `dir="${ex.dir}" non valida (up/down/left/right)`));
  if (!Array.isArray(ex.xRange) || ex.xRange.length !== 2 || typeof ex.xRange[0] !== 'number' || typeof ex.xRange[1] !== 'number')
    e.push(err(areaId, prefix, 'xRange deve essere [number, number]'));
  else {
    if (ex.xRange[0] < 0 || ex.xRange[0] > CANVAS_W) e.push(err(areaId, prefix, `xRange[0]=${ex.xRange[0]} fuori [0,${CANVAS_W}]`));
    if (ex.xRange[1] < 0 || ex.xRange[1] > CANVAS_H) e.push(err(areaId, prefix, `xRange[1]=${ex.xRange[1]} fuori [0,${CANVAS_H}]`));
    if (ex.xRange[0] >= ex.xRange[1]) e.push(err(areaId, prefix, `xRange[0]>=xRange[1] (${ex.xRange[0]}>=${ex.xRange[1]})`));
  }
  if (typeof ex.spawnX !== 'number' || ex.spawnX < 0 || ex.spawnX > CANVAS_W) e.push(err(areaId, prefix, `spawnX=${ex.spawnX} fuori [0,${CANVAS_W}]`));
  if (typeof ex.spawnY !== 'number' || ex.spawnY < 0 || ex.spawnY > CANVAS_H) e.push(err(areaId, prefix, `spawnY=${ex.spawnY} fuori [0,${CANVAS_H}]`));
  return e;
}

/** Valida un singolo NPC spawn */
export function validateNpcSpawn(npc: NpcSpawnDef, areaId: string, index: number, knownNpcIds: string[]): ValidationError[] {
  const e: ValidationError[] = [];
  const prefix = `npcs[${index}]`;
  if (!npc.id || typeof npc.id !== 'string') e.push(err(areaId, prefix, 'campo "id" mancante'));
  else if (!knownNpcIds.includes(npc.id)) e.push(err(areaId, prefix, `NPC id="${npc.id}" non trovato in npcsData`));
  if (typeof npc.x !== 'number' || npc.x < 0 || npc.x > CANVAS_W) e.push(err(areaId, prefix, `X=${npc.x} fuori [0,${CANVAS_W}]`));
  if (typeof npc.y !== 'number' || npc.y < 0 || npc.y > CANVAS_H) e.push(err(areaId, prefix, `Y=${npc.y} fuori [0,${CANVAS_H}]`));
  return e;
}

/** Valida un singolo areaObject */
export function validateAreaObject(obj: AreaObjectDef, areaId: string, index: number, knownClueIds: string[]): ValidationError[] {
  const e: ValidationError[] = [];
  const prefix = `areaObjects[${index}]`;
  if (!obj.id || typeof obj.id !== 'string') e.push(err(areaId, prefix, 'campo "id" mancante'));
  if (typeof obj.x !== 'number' || obj.x < 0 || obj.x > CANVAS_W) e.push(err(areaId, prefix, `X=${obj.x} fuori [0,${CANVAS_W}]`));
  if (typeof obj.y !== 'number' || obj.y < 0 || obj.y > CANVAS_H) e.push(err(areaId, prefix, `Y=${obj.y} fuori [0,${CANVAS_H}]`));
  if (typeof obj.w !== 'number' || obj.w <= 0) e.push(err(areaId, prefix, `w=${obj.w} deve essere >0`));
  if (typeof obj.h !== 'number' || obj.h <= 0) e.push(err(areaId, prefix, `h=${obj.h} deve essere >0`));
  if (obj.x + obj.w > CANVAS_W) e.push(err(areaId, prefix, `x+w=${obj.x + obj.w} eccede canvas`));
  if (obj.y + obj.h > CANVAS_H) e.push(err(areaId, prefix, `y+h=${obj.y + obj.h} eccede canvas`));
  if (!['clue', 'radio', 'recorder', 'scene', 'gatto'].includes(obj.type))
    e.push(err(areaId, prefix, `type="${obj.type}" non valido`));
  if (obj.type === 'clue' && obj.id && knownClueIds.length > 0 && !knownClueIds.includes(obj.id))
    e.push(err(areaId, prefix, `oggetto clue id="${obj.id}" non trovato in clues`));
  if (obj.requires && typeof obj.requires !== 'string')
    e.push(err(areaId, prefix, 'requires deve essere una stringa (clue id)'));
  return e;
}

/** Valida un'area completa */
export function validateArea(
  area: AreaDef,
  areaId: string,
  allAreaIds: string[],
  knownNpcIds: string[],
): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!area.name || typeof area.name !== 'string') errors.push(err(areaId, 'name', 'nome area mancante'));
  if (typeof area.walkableTop !== 'number' || area.walkableTop < 0 || area.walkableTop > CANVAS_H)
    errors.push(err(areaId, 'walkableTop', `walkableTop=${area.walkableTop} fuori [0,${CANVAS_H}]`));
  if (!Array.isArray(area.colliders)) errors.push(err(areaId, 'colliders', 'colliders deve essere un array'));
  else area.colliders.forEach((c, i) => errors.push(...validateCollider(c, areaId, i)));
  if (!Array.isArray(area.exits)) errors.push(err(areaId, 'exits', 'exits deve essere un array'));
  else area.exits.forEach((ex, i) => errors.push(...validateExit(ex, areaId, i, allAreaIds)));
  if (!Array.isArray(area.npcs)) errors.push(err(areaId, 'npcs', 'npcs deve essere un array'));
  else area.npcs.forEach((n, i) => errors.push(...validateNpcSpawn(n, areaId, i, knownNpcIds)));
  return errors;
}

/** Valida l'intero export data (aree + areaObjects + npcsData) */
export function validateExportData(data: EditorExportData): ValidationResult {
  const errors: ValidationError[] = [];
  if (!data.version) errors.push(err('*', 'version', 'campo version mancante'));

  const allAreaIds = Object.keys(data.areas || {});
  if (allAreaIds.length === 0) errors.push(err('*', 'areas', 'nessuna area definita'));

  const knownNpcIds = (data.npcsData || []).map((n: NpcDataDef) => n.id);

  const knownClueIds: string[] = (data.clues || []).map((c: ClueDef) => c.id);
  if (data.areaObjects) {
    for (const [areaId, objects] of Object.entries(data.areaObjects)) {
      if (!Array.isArray(objects)) {
        errors.push(err(areaId, 'areaObjects', 'deve essere un array'));
        continue;
      }
      objects.forEach((obj: AreaObjectDef, i: number) => {
        errors.push(...validateAreaObject(obj, areaId, i, knownClueIds));
      });
    }
  }

  if (data.areas) {
    for (const [areaId, area] of Object.entries(data.areas)) {
      errors.push(...validateArea(area, areaId, allAreaIds, knownNpcIds));
    }
    if (data.areaObjects) {
      for (const areaId of Object.keys(data.areaObjects)) {
        if (!data.areas[areaId]) errors.push(err(areaId, 'areaObjects', `areaObjects per "${areaId}" ma l'area non esiste in areas`));
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
