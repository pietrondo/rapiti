/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                         CONFIGURATION MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Central game configuration and state management.
 * Migrated to ES6+ module system.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════════════════════════
// PALETTE
// ═══════════════════════════════════════════════════════════════════════════════

/** @type {Object<string, string>} Game color palette */
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
});

// ═══════════════════════════════════════════════════════════════════════════════
// CANVAS & PLAYER CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

/** @type {number} Canvas logical width in pixels */
export const CANVAS_W = 400;

/** @type {number} Canvas logical height in pixels */
export const CANVAS_H = 250;

/** @type {number} Player movement speed */
export const PLAYER_SPEED = 1.6;

/** @type {number} Player width in pixels */
export const PLAYER_W = 10;

/** @type {number} Player height in pixels */
export const PLAYER_H = 14;

// ═══════════════════════════════════════════════════════════════════════════════
// GAME STATE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * @typedef {Object} Player
 * @property {number} x
 * @property {number} y
 * @property {number} w
 * @property {number} h
 * @property {string} dir
 * @property {number} frame
 */

/**
 * @typedef {Object} GameState
 * @property {string} currentArea
 * @property {string} gamePhase
 * @property {string|null} previousPhase
 * @property {Player} player
 * @property {Array<string>} cluesFound
 * @property {Object<string, number>} npcStates
 * @property {string} playerName
 * @property {Object<string, string>} playerColors
 * @property {boolean} musicEnabled
 * @property {boolean} puzzleSolved
 * @property {number} puzzleAttempts
 * @property {number} introSlide
 * @property {string} introText
 * @property {number} introCharIndex
 * @property {string|null} endingType
 */

/** @type {GameState} Global game state */
export const gameState = {
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
  introSlide: 0,
  introText: '',
  introCharIndex: 0,
  endingType: null,
  // v2 fields
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
  showMiniMap: true,
  titleAnim: 0,
  gameTime: 1200, // Inizio alle 20:00 (20 * 60)
  gameDate: "Venerdì, 21 Luglio 1978",
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY: Reset game state to initial values
// ═══════════════════════════════════════════════════════════════════════════════

export function resetGameState() {
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
}

// ═══════════════════════════════════════════════════════════════════════════════
// VERSION
// ═══════════════════════════════════════════════════════════════════════════════

export const VERSION = '2.0.0-es6';
export const BUILD_DATE = new Date().toISOString();
