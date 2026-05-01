/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    GLOBAL DECLARATIONS (MIGRATION HELPERS)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Temporary global declarations for legacy variables that are not yet
 * fully modularized. These allow TypeScript compilation during the
 * gradual migration from global scripts to ES modules.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { GameState } from './types.js';

declare global {
  /** Legacy global game state (managed by config.ts but accessed globally) */
  var gameState: GameState;

  /** Toast notification helper */
  function showToast(msg: string): void;

  /** Story manager singleton instance (attached to window) */
  var StoryManager: any;

  /** Chapter manager submodule (global script) */
  var ChapterManager: any;

  /** Quest manager submodule (global script) */
  var QuestManager: any;

  /** Core story engine submodule (global script) */
  var StoryEngine: any;

  /** Story chapters data (global) */
  var storyChapters: Record<string, any>;

  /** Sprite engine submodule (global script) */
  var SpriteEngine: any;

  /** Procedural texture renderer (global script) */
  var ProceduralRenderer: any;

  /** Building renderers collection (global script) */
  var BuildingRenderers: any;

  /** Engine singleton */
  var Engine: any;

  /** SaveLoadSystem class/singleton */
  var SaveLoadSystem: any;
  var saveLoad: any;

  /** GameStore class/singleton */
  var GameStore: any;
  var gameStore: any;

  /** Story manager helpers */
  var initStoryManager: () => void;
  var resetStoryManager: () => void;

  /** Game loop */
  var GameLoop: any;
  var gameLoop: any;

  /** Input manager */
  var InputManager: any;
  var inputManager: any;

  /** Render manager */
  var RenderManager: any;
  var renderManager: any;
  var RenderModule: { render: (ctx: CanvasRenderingContext2D) => void };
}

export {};
