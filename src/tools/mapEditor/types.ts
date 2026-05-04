/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    MAP EDITOR — TYPES & SCHEMA
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Tipi per l'editor mappe. Descrivono la struttura editabile di aree, collider,
 * exits, NPC spawn e oggetti interattivi. Allineati con le strutture runtime
 * esistenti in src/types.ts, src/areas/*.mjs e src/data/clues.mjs.
 */

/** Collider rettangolare che blocca il movimento del player */
export interface ColliderDef {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Uscita verso un'altra area */
export interface ExitDef {
  to: string;
  dir: 'up' | 'down' | 'left' | 'right';
  xRange: [number, number];
  spawnX: number;
  spawnY: number;
  requiresInteract?: boolean;
  requiresFlag?: string;
}

/** Posizionamento NPC in un'area */
export interface NpcSpawnDef {
  id: string;
  x: number;
  y: number;
}

/** Oggetto interattivo (indizio, radio, recorder, etc.) */
export interface AreaObjectDef {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  type: 'clue' | 'radio' | 'recorder' | 'scene' | 'gatto';
  requires?: string;
  drawHint?: boolean;
}

/** Definizione completa di un'area editabile */
export interface AreaDef {
  name: string;
  walkableTop: number;
  colliders: ColliderDef[];
  exits: ExitDef[];
  npcs: NpcSpawnDef[];
}

/** Dati NPC visuali (per validazione ID) */
export interface NpcDataDef {
  id: string;
  name: string;
}

/** Clue definition (per validazione ID oggetti) */
export interface ClueDef {
  id: string;
  name: string;
  area: string;
}

/** Schema completo esportabile */
export interface EditorExportData {
  version: string;
  areas: Record<string, AreaDef>;
  areaObjects: Record<string, AreaObjectDef[]>;
  npcsData: NpcDataDef[];
  clues?: ClueDef[];
}
