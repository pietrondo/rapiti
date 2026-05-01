/* ═══════════════════════════════════════════════════════════════════════════════
   SPRITE MANAGER
   Gestione cache e generazione sprite sheet per player e NPC
   ═══════════════════════════════════════════════════════════════════════════════ */

// === Sprite Sheet Cache ===
const spriteCache = {
  player: null,
  playerColors: null,
  npcs: {},
};

export function getOrCreatePlayerSheet() {
  if (!spriteCache.player || spriteCache.playerColors !== JSON.stringify(gameState.playerColors)) {
    spriteCache.playerColors = JSON.stringify(gameState.playerColors);
    var c = gameState.playerColors;
    spriteCache.player = window.SpriteGenerator.generatePlayerSheet({
      body: c.body,
      bodyLight: _lighten(c.body, 15),
      bodyDark: _darken(c.body, 20),
      detail: c.detail,
      detailLight: _lighten(c.detail, 15),
      legs: c.legs,
      head: c.head,
      headShadow: _darken(c.head, 15),
    });
  }
  return spriteCache.player;
}

export function _lighten(hex, amount) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  r = Math.min(255, r + amount);
  g = Math.min(255, g + amount);
  b = Math.min(255, b + amount);
  return (
    '#' +
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b.toString(16).padStart(2, '0')
  );
}

export function _darken(hex, amount) {
  var r = parseInt(hex.slice(1, 3), 16);
  var g = parseInt(hex.slice(3, 5), 16);
  var b = parseInt(hex.slice(5, 7), 16);
  r = Math.max(0, r - amount);
  g = Math.max(0, g - amount);
  b = Math.max(0, b - amount);
  return (
    '#' +
    r.toString(16).padStart(2, '0') +
    g.toString(16).padStart(2, '0') +
    b.toString(16).padStart(2, '0')
  );
}

export function getOrCreateNPCSheet(npcId) {
  if (!spriteCache.npcs[npcId]) {
    var npcData = null;
    for (var i = 0; i < window.npcsData.length; i++) {
      if (window.npcsData[i].id === npcId) {
        npcData = window.npcsData[i];
        break;
      }
    }
    if (npcData) {
      spriteCache.npcs[npcId] = window.SpriteGenerator.generateNPCSheet(npcData);
    }
  }
  return spriteCache.npcs[npcId] || null;
}

// === Animation state ===
const animState = {
  playerFrame: 0,
  playerTimer: 0,
  isMoving: false,
  lastX: 0,
  lastY: 0,
};

// Export for other modules
window.SpriteManager = {
  getOrCreatePlayerSheet: getOrCreatePlayerSheet,
  getOrCreateNPCSheet: getOrCreateNPCSheet,
  lighten: _lighten,
  darken: _darken,
  animState: animState,
  spriteCache: spriteCache,
};
