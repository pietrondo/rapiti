/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                         CONFIGURATION MODULE (TypeScript)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Central game configuration and state management.
 * Fully typed with TypeScript.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { GameState, PaletteKey, PlayerColors } from './types';

// ═══════════════════════════════════════════════════════════════════════════════
// PALETTE
// ═══════════════════════════════════════════════════════════════════════════════

export const PALETTE = Object.freeze({
  nightBlue: '#1A1C20',
  violetBlue: '#2D3047',
  darkForest: '#3D5A3C',
  oliveGreen: '#5C7A4B',
  greyBrown: '#8B7D6B',
  fadedBeige: '#B8A88A',
  earthBrown: '#6B5B4F',
  burntOrange: '#C4956A',
  lanternYel: '#D4A843',
  creamPaper: '#E8DCC8',
  alumGrey: '#A0A8B0',
  slateGrey: '#4A5568',
} as const);

export type Palette = typeof PALETTE;

// ═══════════════════════════════════════════════════════════════════════════════
// CANVAS & PLAYER CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

/** Canvas logical width in pixels */
export const CANVAS_W = 400 as const;

/** Canvas logical height in pixels */
export const CANVAS_H = 250 as const;

/** Player movement speed */
export const PLAYER_SPEED = 1.6 as const;

/** Player width in pixels */
export const PLAYER_W = 10 as const;

/** Player height in pixels */
export const PLAYER_H = 14 as const;

// ═══════════════════════════════════════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════════════════════════════════════

export const gameState: GameState = {
  currentArea: 'piazze',
  gamePhase: 'title',
  previousPhase: null,
  player: { x: 195, y: 188, w: PLAYER_W, h: PLAYER_H, dir: 'down', frame: 0 },
  cluesFound: [],
  npcStates: { ruggeri: 0, teresa: 0, neri: 0, valli: 0, anselmo: 0, don_pietro: 0 },
  playerName: 'Detective Maurizio',
  playerColors: { body: '#8B7355', head: '#D4A84B', legs: '#3D3025', detail: '#2D3047' },
  musicEnabled: true,
  puzzleSolved: false,
  puzzleAttempts: 0,
  puzzlesSolved: {},
  introSlide: 0,
  introText: '',
  introCharIndex: 0,
  endingType: null,
  prologueStep: 0,
  prologueTimer: 0,
  radioFrequency: 0,
  radioTarget: 72,
  radioSolved: false,
  npcTrust: { ruggeri: 0, neri: 0, teresa: 0, anselmo: 0 },
  screenShake: 0,
  keys: {},
  dialogueNpcId: null,
  message: '',
  messageTimer: 0,
  fadeAlpha: 0,
  fadeDir: 0,
  fadeCallback: null,
  transitionDir: '',
  showMiniMap: true,
  titleAnim: 0,
  gameTime: 1200,
  gameDate: "Venerdì, 21 Luglio 1978",
  confirmedHypotheses: [],
  locale: 'it',
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY: Reset game state to initial values
// ═══════════════════════════════════════════════════════════════════════════════

export function resetGameState(): void {
  gameState.currentArea = 'piazze';
  gameState.gamePhase = 'title';
  gameState.previousPhase = null;
  gameState.player = { x: 195, y: 188, w: PLAYER_W, h: PLAYER_H, dir: 'down', frame: 0 };
  gameState.cluesFound = [];
  gameState.npcStates = { ruggeri: 0, teresa: 0, neri: 0, valli: 0, anselmo: 0, don_pietro: 0 };
  gameState.playerName = 'Detective Maurizio';
  gameState.playerColors = { body: '#8B7355', head: '#D4A84B', legs: '#3D3025', detail: '#2D3047' };
  gameState.musicEnabled = true;
  gameState.puzzleSolved = false;
  gameState.puzzleAttempts = 0;
  gameState.puzzlesSolved = {};
  gameState.introSlide = 0;
  gameState.introText = '';
  gameState.introCharIndex = 0;
  gameState.endingType = null;
  gameState.prologueStep = 0;
  gameState.prologueTimer = 0;
  gameState.radioFrequency = 0;
  gameState.radioTarget = 72;
  gameState.radioSolved = false;
  gameState.npcTrust = { ruggeri: 0, neri: 0, teresa: 0, anselmo: 0 };
  gameState.screenShake = 0;
  gameState.keys = {};
  gameState.dialogueNpcId = null;
  gameState.message = '';
  gameState.messageTimer = 0;
  gameState.fadeAlpha = 0;
  gameState.fadeDir = 0;
  gameState.fadeCallback = null;
  gameState.showMiniMap = true;
  gameState.titleAnim = 0;
  gameState.gameTime = 1200;
  gameState.gameDate = "Venerdì, 21 Luglio 1978";
  gameState.confirmedHypotheses = [];
  gameState.locale = 'it';
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERSION
// ═══════════════════════════════════════════════════════════════════════════════

export const VERSION = '2.1.0-typescript' as const;
export const BUILD_DATE = new Date().toISOString();

// ═══════════════════════════════════════════════════════════════════════════════
// TYPE GUARDS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Check if a string is a valid palette key
 * @param key - Key to check
 */
export function isPaletteKey(key: string): key is PaletteKey {
  return key in PALETTE;
}

/**
 * Get a color from the palette safely
 * @param key - Palette key
 * @returns Hex color string
 */
export function getColor(key: PaletteKey): string {
  return PALETTE[key];
}

/**
 * Default player colors
 */
export const defaultPlayerColors: PlayerColors = {
  body: '#8B7355',
  head: '#D4A84B',
  legs: '#3D3025',
  detail: '#2D3047',
};
