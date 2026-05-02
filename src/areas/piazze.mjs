/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: PIAZZE
 * Piazza del Paese - Centro hub del gioco
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H */

const areaTextures = {};

export function getAreaTexture(type) {
  if (!areaTextures[type]) {
    areaTextures[type] = window.TextureGenerator.getOrCreateTexture(type, 400, 250);
  }
  return areaTextures[type];
}

// Helper functions per piazze
export function drawMunicipioFacade(ctx, x, y, w, h, t) {
  var windowGlow = 0.6 + Math.sin(t * 2) * 0.1;
  // Base con texture mattoni
  ctx.fillStyle = '#3A3028';
  ctx.fillRect(x, y, w, h);
  // Mattoni
  ctx.fillStyle = '#4A3E32';
  for (var by = 0; by < Math.floor(h / 8); by++) {
    for (var bx = 0; bx < Math.floor(w / 12); bx++) {
      var offset = (by % 2) * 6;
      ctx.fillRect(x + bx * 12 + offset + 1, y + by * 8 + 1, 10, 6);
    }
  }
  // Cornice
  ctx.fillStyle = window.PALETTE.greyBrown;
  ctx.fillRect(x - 2, y + h - 8, w + 4, 8);
  ctx.fillRect(x - 2, y, w + 4, 4);
  ctx.fillRect(x - 2, y, 4, h);
  ctx.fillRect(x + w - 2, y, 4, h);
  // Tetto
  ctx.fillStyle = window.PALETTE.darkForest;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y - 12);
  ctx.lineTo(x + w + 8, y + 28);
  ctx.lineTo(x - 8, y + 28);
  ctx.fill();
  // Finestre con cornice
  ctx.fillStyle = window.PALETTE.lanternYel;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 2; j++) {
      var wx = x + 18 + i * 42;
      var wy = y + 32 + j * 26;
      // Cornice finestra
      ctx.fillStyle = window.PALETTE.greyBrown;
      ctx.fillRect(wx - 2, wy - 2, 19, 22);
      // Luce
      ctx.fillStyle = `rgba(212,168,67,${windowGlow})`;
      ctx.fillRect(wx, wy, 15, 18);
      // Crociera
      ctx.fillStyle = window.PALETTE.greyBrown;
      ctx.fillRect(wx + 7, wy, 1, 18);
      ctx.fillRect(wx, wy + 9, 15, 1);
    }
  }
  // Portone
  ctx.fillStyle = '#2A2018';
  ctx.fillRect(x + w / 2 - 14, y + h - 38, 28, 36);
  ctx.fillStyle = '#1A1410';
  ctx.fillRect(x + w / 2 - 10, y + h - 34, 20, 30);
  // Maniglia
  ctx.fillStyle = window.PALETTE.lanternYel;
  ctx.fillRect(x + w / 2 + 6, y + h - 22, 3, 3);
  // Gradini
  ctx.fillStyle = window.PALETTE.stoneGrey;
  ctx.fillRect(x + w / 2 - 18, y + h - 4, 36, 4);
  ctx.fillRect(x + w / 2 - 22, y + h - 2, 44, 2);
}

export function drawPiazzaFountain(ctx, x, y, t) {
  // Base vasca
  ctx.fillStyle = '#5A5A5A';
  ctx.fillRect(x - 18, y + 12, 48, 6);
  ctx.fillRect(x - 20, y + 18, 52, 4);
  // Acqua
  ctx.fillStyle = '#4A7A8A';
  ctx.globalAlpha = 0.7 + Math.sin(t * 3) * 0.1;
  ctx.fillRect(x - 16, y + 14, 44, 4);
  ctx.globalAlpha = 1;
  // Riflessi acqua
  ctx.fillStyle = '#6AAABA';
  ctx.globalAlpha = 0.4 + Math.sin(t * 2.5) * 0.15;
  ctx.fillRect(x - 12, y + 15, 8, 1);
  ctx.fillRect(x + 4, y + 15, 12, 1);
  ctx.globalAlpha = 1;
  // Colonna centrale
  ctx.fillStyle = '#6A6A6A';
  ctx.fillRect(x + 2, y - 8, 8, 20);
  ctx.fillRect(x, y - 12, 12, 6);
  // Getto acqua
  ctx.fillStyle = '#8ACAEA';
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(x + 4, y - 10);
  ctx.lineTo(x + 8, y - 10);
  ctx.lineTo(x + 6, y - 22);
  ctx.fill();
  ctx.globalAlpha = 1;
  // Gocce
  ctx.fillStyle = '#9ADAFB';
  ctx.globalAlpha = 0.8;
  ctx.fillRect(x + 3 + Math.sin(t * 4) * 2, y - 18 + Math.sin(t * 3) * 2, 2, 2);
  ctx.fillRect(x + 7 + Math.cos(t * 3.5) * 2, y - 16 + Math.cos(t * 4) * 2, 2, 2);
  ctx.globalAlpha = 1;
  // Bordo superiore
  ctx.fillStyle = '#7A7A7A';
  ctx.fillRect(x - 2, y - 4, 16, 4);
}

export function drawBarFacade(ctx, x, y, w, h, t) {
  // Parete legno
  ctx.fillStyle = '#4A3528';
  ctx.fillRect(x, y, w, h);
  // Assi verticali
  ctx.fillStyle = '#3A2518';
  for (var i = 0; i < 5; i++) {
    ctx.fillRect(x + i * 16, y, 2, h);
  }
  // Tettoia
  ctx.fillStyle = '#5A2A1A';
  ctx.fillRect(x - 4, y - 6, w + 8, 6);
  // Insegna neon
  var neonPulse = 0.65 + Math.sin(t * 3) * 0.15;
  ctx.fillStyle = `rgba(200,40,40,${neonPulse})`;
  ctx.fillRect(x + 4, y - 18, w - 8, 12);
  ctx.fillStyle = `rgba(255,200,100,${neonPulse})`;
  ctx.font = 'bold 8px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BAR', x + w / 2, y - 8);
  ctx.textAlign = 'start';
  // Finestre
  ctx.fillStyle = '#2A1D15';
  ctx.fillRect(x + 6, y + 10, 20, 18);
  ctx.fillRect(x + 34, y + 10, 20, 18);
  ctx.fillStyle = `rgba(212,168,67,${0.5 + Math.sin(t * 2) * 0.1})`;
  ctx.fillRect(x + 8, y + 12, 16, 14);
  ctx.fillRect(x + 36, y + 12, 16, 14);
  // Cornici finestre
  ctx.fillStyle = '#5A3A28';
  ctx.fillRect(x + 6, y + 10, 20, 2);
  ctx.fillRect(x + 6, y + 26, 20, 2);
  ctx.fillRect(x + 34, y + 10, 20, 2);
  ctx.fillRect(x + 34, y + 26, 20, 2);
  // Porta
  ctx.fillStyle = '#2A1D15';
  ctx.fillRect(x + 24, y + h - 30, 18, 28);
  ctx.fillStyle = '#3A2D20';
  ctx.fillRect(x + 26, y + h - 28, 14, 24);
  // Maniglia
  ctx.fillStyle = window.PALETTE.lanternYel;
  ctx.fillRect(x + 36, y + h - 18, 2, 2);
}

export function drawNoticeBoard(ctx, x, y, _t) {
  ctx.fillStyle = window.PALETTE.greyBrown;
  ctx.fillRect(x, y, 28, 38);
  ctx.fillStyle = '#dcb';
  ctx.fillRect(x + 3, y + 4, 22, 24);
  ctx.fillStyle = '#333';
  for (var i = 0; i < 4; i++) {
    ctx.fillRect(x + 5, y + 7 + i * 6, 18, 1);
  }
}

export function drawBench(ctx, x, y) {
  // Gambe
  ctx.fillStyle = '#3A3028';
  ctx.fillRect(x + 2, y + 8, 4, 10);
  ctx.fillRect(x + 30, y + 8, 4, 10);
  // Seduta
  ctx.fillStyle = '#5A4030';
  ctx.fillRect(x, y + 4, 36, 6);
  // Listelli
  ctx.fillStyle = '#6A5040';
  for (var i = 0; i < 4; i++) {
    ctx.fillRect(x + 2 + i * 9, y + 4, 7, 5);
  }
  // Schienale
  ctx.fillStyle = '#5A4030';
  ctx.fillRect(x, y - 6, 36, 8);
  // Listelli schienale
  ctx.fillStyle = '#6A5040';
  for (var i = 0; i < 4; i++) {
    ctx.fillRect(x + 2 + i * 9, y - 5, 7, 6);
  }
  // Ombra
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fillRect(x - 2, y + 16, 40, 4);
}

const PiazzeArea = {
  name: 'Piazza del Paese',
  walkableTop: 105,
  colliders: [
    { x: 125, y: 48, w: 150, h: 86 },
    { x: 182, y: 145, w: 42, h: 28 },
    { x: 302, y: 112, w: 70, h: 56 },
    { x: 82, y: 136, w: 36, h: 34 },
  ],
  npcs: [],
  exits: [
    { dir: 'up', xRange: [168, 232], to: 'chiesa', spawnX: 200, spawnY: 210 },
    { dir: 'down', xRange: [170, 230], to: 'residenziale', spawnX: 200, spawnY: 132 },
    { dir: 'left', xRange: [100, 140], to: 'giardini', spawnX: 360, spawnY: 125 },
    { dir: 'right', xRange: [122, 176], to: 'bar_exterior', spawnX: 40, spawnY: 145 },
  ],

  draw: (ctx) => {
    window.PF.nightSky(ctx, 14);
    // Luna con alone
    ctx.fillStyle = 'rgba(212,168,67,0.08)';
    ctx.beginPath();
    ctx.arc(340, 22, 28, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(212,168,67,0.15)';
    ctx.beginPath();
    ctx.arc(340, 22, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = window.PALETTE.lanternYel;
    ctx.beginPath();
    ctx.arc(340, 22, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = window.PALETTE.nightBlue;
    ctx.beginPath();
    ctx.arc(346, 18, 9, 0, Math.PI * 2);
    ctx.fill();
    window.PF.mountains(ctx);
    var t = Date.now() * 0.001;
    
    // Terreno base
    ctx.fillStyle = '#2D3A1E';
    ctx.fillRect(0, 104, window.CANVAS_W, 146);
    ctx.fillStyle = '#253216';
    ctx.fillRect(0, 102, window.CANVAS_W, 4);
    
    // Erba variegata
    ctx.fillStyle = '#354A24';
    for (var i = 0; i < 40; i++) {
      var gx = (i * 47) % window.CANVAS_W;
      var gy = 108 + (i * 13) % 40;
      ctx.fillRect(gx, gy, 8, 3);
      ctx.fillRect(gx + 4, gy + 2, 6, 2);
    }
    
    // Pavimentazione piazza
    ctx.fillStyle = '#5A5045';
    ctx.fillRect(0, 130, window.CANVAS_W, 120);
    // Ciottoli
    ctx.fillStyle = '#6A6055';
    for (var r = 0; r < 12; r++) {
      for (var c = 0; c < 20; c++) {
        var cx = c * 22 + (r % 2) * 11;
        var cy = 134 + r * 10;
        ctx.fillRect(cx, cy, 18, 6);
        // Bordo ciottolo
        ctx.fillStyle = '#4A4038';
        ctx.fillRect(cx, cy + 5, 18, 1);
        ctx.fillStyle = '#6A6055';
      }
    }
    // Ombre sotto gli edifici
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(120, 130, 160, 8);
    ctx.fillRect(298, 165, 78, 6);
    ctx.fillRect(78, 168, 32, 4);

    drawMunicipioFacade(ctx, 125, 48, 150, 86, t);
    drawPiazzaFountain(ctx, 182, 145, t);
    drawBarFacade(ctx, 302, 112, 70, 56, t);
    drawNoticeBoard(ctx, 82, 136, t);
    drawBench(ctx, 260, 166);
    window.PF.lamp(ctx, 48, 142);
    window.PF.lamp(ctx, 198, 138);
    window.PF.lamp(ctx, 352, 142);
    window.PF.tree(ctx, 36, 142);
    window.PF.tree(ctx, 292, 150);
    window.drawVignette(ctx);
  },
};

// Esporta
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PiazzeArea;
} else if (typeof window !== 'undefined') {
  window.PiazzeArea = PiazzeArea;
}
