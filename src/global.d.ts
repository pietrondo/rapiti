/**
 * Global Declarations — window.* API Inventory
 *
 * Status: Transizione .mjs -> .ts in corso.
 * - "IMPORT" = disponibile come `import { X } from 'path'`
 * - "WINDOW" = solo su window (legacy .mjs)
 * - "BOTH" = entrambi disponibili (bridge attivo)
 */

import type { GameState, Area, ClueItem, AreaObject } from './types.js';

declare global {
  /** [BOTH] Game state singleton (config.ts + window.gameState) */
  var gameState: GameState;

  /** [BOTH] Static config */
  var PALETTE: Record<string, string>;
  var CANVAS_W: number;
  var CANVAS_H: number;
  var PLAYER_SPEED: number;
  var PLAYER_W: number;
  var PLAYER_H: number;

  /** [BOTH] Core game actions (init.mjs + window.*) */
  function showToast(msg: string, params?: any): void;
  function updateHUD(): void;
  function collectClue(clue: string | { id: string; name?: string }): void;
  function updateNPCStates(): void;
  function handleInteract(): void;
  function openJournal(): void;
  function openInventory(): void;
  function openSaveMenu(): void;
  function openSettings(): void;
  function closePanels(): void;

  /** [BOTH] Story system (story/index.ts + window.*) */
  var StoryManager: any;
  var StoryEngine: any;
  var ChapterManager: any;
  var QuestManager: any;
  var initStoryManager: () => void;
  var resetStoryManager: () => void;

  /** [WINDOW] Story data (.mjs modules) */
  var storyChapters: Record<string, any>;
  var storyQuests: Record<string, any>;
  var storyEvents: Record<string, any>;
  var storyDialogueTriggers: Record<string, any>;
  var storyEndingConditions: Record<string, any>;

  /** [WINDOW] Game data (.mjs modules) */
  var clues: ClueItem[];
  var cluesMap: Record<string, ClueItem>;
  var hypotheses: any[];
  var npcsData: any[];
  var dialogueNodes: Record<string, any>;
  var dialogueEffects: Record<string, any>;
  var areas: Record<string, Area>;
  var areaObjects: Record<string, AreaObject[]>;

  /** [WINDOW] Rendering / Effects (.mjs modules) */
  var SpriteManager: any;
  var UIRenderer: any;
  var GameRenderer: any;
  var SceneRenderer: any;
  var ParticleSystem: any;
  var LightingSystem: any;
  var ScreenShake: any;
  var Vignette: any;
  var drawVignette: (ctx: CanvasRenderingContext2D) => void;
  var PF: any;

  /** [BOTH] Pixi renderer (pixiRenderer.ts + window.pixiRenderer) */
  var pixiRenderer: any;

  /** [BOTH] Render manager (render/index.ts + window.renderManager) */
  var renderManager: any;
  var RenderModule: { render: (ctx: CanvasRenderingContext2D) => void };

  /** [BOTH] Game loop / input (loop.ts, input.ts + window.*) */
  var GameLoop: any;
  var gameLoop: any;
  var InputManager: any;
  var inputManager: any;

  /** [BOTH] State management (store.ts, saveLoad.ts, settings.ts + window.*) */
  var GameStore: any;
  var gameStore: any;
  var SaveLoadSystem: any;
  var saveLoad: any;
  var settingsManager: any;

  /** [BOTH] Audio */
  var audioManager: any;
  function playSFX(sfx: string): void;

  /** [BOTH] i18n */
  var t: (key: string, params?: any) => string;
  var i18n: any;

  /** [BOTH] Map editor (dev tool, dynamic import) */
  var toggleEditor: () => void;
  var openEditor: () => void;
  var closeEditor: () => void;

  /** [BOTH] Engine helpers */
  var Engine: any;
  var rectCollision: (r1: any, r2: any) => boolean;

  /** [BOTH] Puzzle systems */
  var openRadioPuzzle: () => void;
  var closeRadioPuzzle: () => void;
  var openRegistryPuzzle: () => void;
  var closeRegistryPuzzle: () => void;
  var checkRegistry: () => void;
  var openScenePuzzle: () => void;
  var closeScenePuzzle: () => void;
  var checkScene: () => void;
  var openRecorderPuzzle: () => void;
  var closeRecorderPuzzle: () => void;
  var playRecorder: () => void;
  var openDeduction: () => void;
  var closeDeduction: () => void;
  var checkDeduction: () => void;
  var canOpenDeduction: () => boolean;

  /** [BOTH] Dialogue system */
  var startDialogue: (npcId: string) => void;
  var closeDialogue: () => void;

  /** [BOTH] Customization */
  var openCustomize: () => void;
  var renderCustomizePreview: () => void;

  /** [BOTH] Audio */
  var toggleMusic: () => void;

  /** [BOTH] Transition system */
  var changeArea: (areaId: string, spawnX: number, spawnY: number) => void;
  var checkAreaExits: () => void;
  var updateFade: () => void;
  var triggerInteractExit: () => boolean;

  /** [BOTH] Movement */
  var updatePlayerPosition: (gs: any, dt: number) => void;
  var resolveCollisions: (p: any, area: any) => void;

  /** [BOTH] Prologue */
  var updatePrologue: () => void;

  /** [BOTH] Reset */
  var resetGame: () => void;
  var resetGameState: () => void;

  /** [BOTH] Version */
  var VERSION: string;

  /** [WINDOW] Dynamic area modules */
  var GiardiniArea: any;
  var ChiesaArea: any;
  var CimiteroArea: any;
  var CampoArea: any;
}

export {};
