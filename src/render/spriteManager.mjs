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

/**
 * CharacterArtist - Logica di disegno centralizzata per Player e NPC
 * Assicura che la preview e gli sprite in-game siano identici.
 */
const CharacterArtist = {
  drawHead: function (ctx, x, y, colors, options) {
    var head = colors.head || '#F5DEB3';
    var headShadow = colors.headShadow || this.darken(head, 15);

    // Base testa
    this.drawPixelRect(ctx, x + 11, y, 10, 9, head);
    this.drawPixelRect(ctx, x + 11, y, 10, 2, headShadow); // Ombra sotto cappello

    if (options.id === 'anselmo') {
      this.drawPixelRect(ctx, x + 11, y + 5, 10, 4, '#EEEEEE'); // Barba
    }
  },

  drawEyes: function (ctx, x, y, dir, options) {
    if (dir === 'up') return;
    var isSide = dir === 'left' || dir === 'right';

    if (!isSide) {
      this.drawPixelRect(ctx, x + 13, y + 3, 2, 2, '#FFFFFF');
      this.drawPixelRect(ctx, x + 17, y + 3, 2, 2, '#FFFFFF');
      this.drawPixelRect(ctx, x + 13.5, y + 3.5, 1, 1, '#1A1A2A');
      this.drawPixelRect(ctx, x + 17.5, y + 3.5, 1, 1, '#1A1A2A');
    } else {
      var ex = dir === 'left' ? x + 11 : x + 19;
      this.drawPixelRect(ctx, ex, y + 3, 2, 2, '#FFFFFF');
      this.drawPixelRect(ctx, ex + 0.5, y + 3.5, 1, 1, '#1A1A2A');
    }

    if (options.id === 'neri') {
      this.drawPixelRect(ctx, x + 12, y + 3, 8, 1, '#1A1A1A'); // Montatura occhiali
    }
  },

  drawHat: function (ctx, x, y, dir, colors, options) {
    var detail = colors.detail || '#2D3047';
    var detailLight = this.lighten(detail, 15);
    var isSide = dir === 'left' || dir === 'right';

    if (options.type === 'player' || options.id === 'fedora') {
      if (isSide) {
        var hox = dir === 'left' ? -1 : 1;
        this.drawPixelRect(ctx, x + 10 + hox, y + 4, 12, 3, detail);
        this.drawPixelRect(ctx, x + 12 + hox, y + 1, 8, 4, detail);
        this.drawPixelRect(ctx, x + 12 + hox, y + 2, 8, 1, detailLight);
      } else {
        this.drawPixelRect(ctx, x + 9, y + 4, 14, 3, detail);
        this.drawPixelRect(ctx, x + 11, y + 1, 10, 4, detail);
        this.drawPixelRect(ctx, x + 11, y + 2, 10, 1, detailLight);
      }
    }

    if (options.id === 'gino') {
      // Cappello Postino
      this.drawPixelRect(ctx, x + 11, y - 4, 10, 4, '#1A237E');
      this.drawPixelRect(ctx, x + 10, y - 1, 12, 1, '#FFD700');
    }
  },

  drawBody: function (ctx, x, y, dir, colors, options) {
    var body = colors.body || '#8B7355';
    var bodyLight = this.lighten(body, 15);
    var bodyDark = this.darken(body, 20);

    this.drawPixelRect(ctx, x + 10, y, 12, 10, body);
    this.drawPixelRect(ctx, x + 10, y, 2, 10, bodyDark);
    this.drawPixelRect(ctx, x + 20, y, 2, 10, bodyLight);

    if (dir !== 'up') {
      if (options.type === 'player') {
        this.drawPixelRect(ctx, x + 13, y - 2, 6, 2, '#E8E0D0'); // Camicia
        this.drawPixelRect(ctx, x + 15, y - 2, 2, 3, '#8B1A1A'); // Cravatta
        this.drawPixelRect(ctx, x + 15, y + 2, 2, 1, bodyLight); // Bottoni
      }
      if (options.id === 'osvaldo') {
        this.drawPixelRect(ctx, x + 12, y + 2, 8, 7, '#F5F5F5'); // Grembiule
      }
    }
  },

  drawPixelRect: (ctx, x, y, w, h, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  },

  lighten: (hex, amount) => {
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
  },

  darken: (hex, amount) => {
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
  },
};

export function getOrCreatePlayerSheet() {
  if (!spriteCache.player || spriteCache.playerColors !== JSON.stringify(gameState.playerColors)) {
    spriteCache.playerColors = JSON.stringify(gameState.playerColors);
    var c = gameState.playerColors;
    spriteCache.player = window.SpriteGenerator.generatePlayerSheet({
      body: c.body,
      bodyLight: CharacterArtist.lighten(c.body, 15),
      bodyDark: CharacterArtist.darken(c.body, 20),
      detail: c.detail,
      detailLight: CharacterArtist.lighten(c.detail, 15),
      legs: c.legs,
      head: c.head,
      headShadow: CharacterArtist.darken(c.head, 15),
    });
  }
  return spriteCache.player;
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
  artist: CharacterArtist,
  lighten: CharacterArtist.lighten,
  darken: CharacterArtist.darken,
  animState: animState,
  spriteCache: spriteCache,
};
