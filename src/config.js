/* ══════════════════════════════════════════════════════════════
   CONFIGURAZIONE
   ══════════════════════════════════════════════════════════════ */

var PALETTE = {
  nightBlue:   '#1A1C20',
  violetBlue:  '#2D3047',
  darkForest:  '#3D5A3C',
  oliveGreen:  '#5C7A4B',
  greyBrown:   '#8B7D6B',
  fadedBeige:  '#B8A88A',
  earthBrown:  '#6B5B4F',
  burntOrange: '#C4956A',
  lanternYel:  '#D4A843',
  creamPaper:  '#E8DCC8',
  alumGrey:    '#A0A8B0',
  slateGrey:   '#4A5568'
};

var CANVAS_W = 400;
var CANVAS_H = 250;
var PLAYER_SPEED = 1.6;
var PLAYER_W = 10;
var PLAYER_H = 14;

/* ══════════════════════════════════════════════════════════════
   GAME STATE
   ══════════════════════════════════════════════════════════════ */

var gameState = {
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
  // Nuovi campi v2
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
  titleAnim: 0
};
