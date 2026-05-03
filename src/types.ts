/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                         SHARED TYPES
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Central type definitions for Le Luci di San Celeste.
 * Imported by all TypeScript modules.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CORE GAME TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Player position and state */
export interface Player {
  x: number;
  y: number;
  w: number;
  h: number;
  dir: 'up' | 'down' | 'left' | 'right';
  frame: number;
  targetX?: number | null;
  targetY?: number | null;
  targetAction?: (() => void) | null;
  discoveryJump?: number;
}

/** Player customization colors */
export interface PlayerColors {
  body: string;
  head: string;
  legs: string;
  detail: string;
}

/** NPC trust levels */
export interface NPCTrust {
  ruggeri: number;
  neri: number;
  teresa: number;
  anselmo: number;
  [key: string]: number;
}

/** NPC state values */
export interface NPCStates {
  ruggeri: number;
  teresa: number;
  neri: number;
  valli: number;
  anselmo: number;
  don_pietro: number;
  [key: string]: number;
}

/** Game phase identifiers */
export type GamePhase =
  | 'title'
  | 'prologue_cutscene'
  | 'intro'
  | 'prologue'
  | 'tutorial'
  | 'playing'
  | 'dialogue'
  | 'journal'
  | 'inventory'
  | 'deduction'
  | 'radio'
  | 'scene'
  | 'recorder'
  | 'customize'
  | 'ending';

/** Global game state */
export interface GameState {
  currentArea: string;
  gamePhase: GamePhase;
  previousPhase: GamePhase | null;
  player: Player;
  cluesFound: string[];
  npcStates: NPCStates;
  playerName: string;
  playerColors: PlayerColors;
  musicEnabled: boolean;
  puzzleSolved: boolean;
  puzzleAttempts: number;
  introSlide: number;
  introText: string;
  introCharIndex: number;
  endingType: string | null;
  prologueStep: number;
  prologueTimer: number;
  radioFrequency: number;
  radioTarget: number;
  radioSolved: boolean;
  npcTrust: NPCTrust;
  screenShake: number;
  keys: Record<string, boolean>;
  dialogueNpcId: string | null;
  message: string;
  messageTimer: number;
  fadeAlpha: number;
  fadeDir: number;
  fadeCallback: (() => void) | null;
  showMiniMap: boolean;
  titleAnim: number;
  gameTime: number; // In minuti dall'inizio
  gameDate: string; // Es. "Venerdì, 21 Luglio 1978"
  confirmedHypotheses: string[];
}

// ═══════════════════════════════════════════════════════════════════════════════
// AREA TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Area exit definition */
export interface AreaExit {
  to: string;
  dir: 'up' | 'down' | 'left' | 'right';
  xRange: [number, number];
  spawnX: number;
  spawnY: number;
  requiresPuzzle?: boolean;
  requiresInteract?: boolean;
  requiresFlag?: string;
}

/** Area collider */
export interface Collider {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** NPC instance in area */
export interface AreaNPC {
  id: string;
  x: number;
  y: number;
}

/** Game area definition */
export interface Area {
  name: string;
  walkableTop?: number;
  colliders: Collider[];
  npcs: AreaNPC[];
  exits: AreaExit[];
  objects?: AreaObject[];
  draw(ctx: CanvasRenderingContext2D): void;
  init?(): void;
  update?(): void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STORY TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Story chapter */
export interface Chapter {
  id: string;
  title: string;
  order: number;
  objectives: Objective[];
  requiredObjectives: string[];
  onComplete?: {
    setFlag?: string;
    unlockChapter?: string;
    message?: string;
  };
}

/** Story objective */
export interface Objective {
  id: string;
  description: string;
  condition?: Condition;
}

/** Condition for triggers/objectives */
export interface Condition {
  chapter?: string;
  chapterAtMost?: string;
  chapterAtLeast?: string;
  hasFlag?: string;
  missingFlag?: string;
  hasClue?: string;
  missingClue?: string;
  hasClues?: string[];
  cluesMin?: number;
  cluesMax?: number;
  cluesFound?: 'all' | number;
  talkedTo?: string;
  talkedToCount?: number;
  talkedToAll?: string[];
  puzzleSolved?: string | string[];
  puzzlesSolved?: string[];
  visitedArea?: string;
  trustAtLeast?: Record<string, number>;
  trustAtMost?: Record<string, number>;
  trustMin?: Record<string, number>; // Legacy support
  trustMax?: Record<string, number>; // Legacy support
  hasHypothesis?: string;
  hasHypotheses?: string[];
}

/** Quest definition */
export interface Quest {
  id: string;
  title: string;
  description: string;
  chapter: string;
  stages: QuestStage[];
  onComplete?: {
    message?: string;
    reward?: Reward;
  };
}

/** Quest stage */
export interface QuestStage {
  id: string;
  description: string;
  condition: Condition;
  reward?: Reward;
}

/** Reward for quest completion */
export interface Reward {
  setFlag?: string;
  updateNPCState?: Record<string, number>;
  giveClue?: string;
  giveClueHint?: string;
  xp?: number;
  unlockArea?: string;
  addTrust?: Record<string, number>;
  subTrust?: Record<string, number>;
  setTrust?: Record<string, number>;
  action?: () => void;
}

/** Story event */
export interface StoryEvent {
  trigger: Condition;
  action?: () => void;
  once?: boolean;
}

/** Ending condition */
export interface Ending {
  id: string;
  title: string;
  description: string;
  priority: number;
  conditions: Condition;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLUE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Clue/item definition */
export interface Clue {
  id: string;
  name: string;
  description: string;
  area: string;
  type?: 'document' | 'object' | 'audio' | 'symbol';
}

/** Interactive area object */
export interface AreaObject {
  id: string;
  clueId?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  type?: string;
  requires?: string[];
  drawHint?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ENGINE TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Sprite sheet data */
export interface SpriteSheet {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  frameWidth: number;
  frameHeight: number;
}

/** Rectangle for collision */
export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Easing function type */
export type EasingFunction = (t: number) => number;

/** Animation options */
export interface AnimationOptions {
  from: number;
  to: number;
  duration: number;
  easing?: EasingFunction;
  onUpdate: (value: number) => void;
  onComplete?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SAVE/LOAD TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Save data structure */
export interface SaveData {
  version: string;
  timestamp: number;
  gameState: Partial<GameState>;
  story: StorySaveData;
  stats: GameStats;
  playTime: number;
}

/** Story serialization data */
export interface StorySaveData {
  chapters?: SerializedChapters;
  quests?: SerializedQuests;
  engine?: SerializedEngine;
}

export interface SerializedChapters {
  currentChapter: string | null;
  completedChapters: string[];
  completedObjectives: Record<string, string[]>;
}

export interface SerializedQuests {
  activeQuests: Record<string, { currentStage: number; stagesCompleted: string[] }>;
  completedQuests: string[];
}

export interface SerializedEngine {
  flags: Record<string, unknown>;
  triggeredEvents: string[];
  stats: GameStats;
  unlockedAchievements: string[];
}

/** Game statistics */
export interface GameStats {
  talkedTo: Record<string, boolean>;
  visitedAreas: Record<string, boolean>;
  cluesFound: number;
  puzzlesSolved: Record<string, boolean>;
  totalPlayTime: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// INPUT TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Key binding definition */
export interface KeyBinding {
  key: string;
  action: string;
  phase?: GamePhase[];
}

/** Touch input state */
export interface TouchState {
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  active: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// RENDER TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** Render layer */
export type RenderLayer = 'background' | 'entities' | 'effects' | 'ui';

/** Camera/viewport state */
export interface Camera {
  x: number;
  y: number;
  scale: number;
  shakeX: number;
  shakeY: number;
}

/** Particle effect definition */
export interface ParticleEffect {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// PALETTE TYPE
// ═══════════════════════════════════════════════════════════════════════════════

/** Color palette keys */
export type PaletteKey =
  | 'nightBlue'
  | 'violetBlue'
  | 'darkForest'
  | 'oliveGreen'
  | 'greyBrown'
  | 'fadedBeige'
  | 'earthBrown'
  | 'burntOrange'
  | 'lanternYel'
  | 'creamPaper'
  | 'alumGrey'
  | 'slateGrey';
