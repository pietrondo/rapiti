/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: PIAZZE
 * Piazza del Paese - Centro hub del gioco
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.TextureGenerator, window.drawBrickPattern, window.drawTileRoof, window.drawLitWindow, window.drawStripedAwning, window.BuildingRenderers, window.PF, window.drawVignette */

const areaTextures = {};

export function getAreaTexture(type) {
  if (!areaTextures[type]) {
    areaTextures[type] = window.TextureGenerator.getOrCreateTexture(type, 400, 250);
  }
  return areaTextures[type];
}

// Helper functions per piazze
export function drawMunicipioFacade(ctx, x, y, w, h, t) {
  // Base con texture mattoni avanzata
  if (window.drawBrickPattern) {
    window.drawBrickPattern(ctx, x, y, w, h, '#3A3028');
  } else {
    ctx.fillStyle = '#3A3028';
    ctx.fillRect(x, y, w, h);
  }

  // Cornice
  ctx.fillStyle = window.PALETTE.greyBrown;
  ctx.fillRect(x - 4, y + h - 8, w + 8, 10);
  ctx.fillStyle = window.PALETTE.burntOrange;
  ctx.fillRect(x - 2, y, w + 4, 6);

  // Tetto con tegole
  if (window.drawTileRoof) {
    window.drawTileRoof(ctx, x, y, w, window.PALETTE.darkForest);
  } else {
    ctx.fillStyle = window.PALETTE.darkForest;
    ctx.beginPath();
    ctx.moveTo(x + w / 2, y - 20);
    ctx.lineTo(x + w + 8, y + 5);
    ctx.lineTo(x - 8, y + 5);
    ctx.fill();
  }

  // Finestre illuminate
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 2; j++) {
      var wx = x + 18 + i * 42;
      var wy = y + 25 + j * 26;
      if (window.drawLitWindow) {
        window.drawLitWindow(ctx, wx, wy, 16, 20, true, t, i * 2 + j);
      } else {
        ctx.fillStyle = window.PALETTE.lanternYel;
        ctx.fillRect(wx, wy, 15, 18);
      }
    }
  }

  // Portone
  ctx.fillStyle = '#2A2018';
  ctx.beginPath();
  ctx.roundRect(x + w / 2 - 14, y + h - 38, 28, 38, [10, 10, 0, 0]);
  ctx.fill();

  // Maniglia oro
  ctx.fillStyle = window.PALETTE.lanternYel;
  ctx.beginPath();
  ctx.arc(x + w / 2 + 8, y + h - 20, 2, 0, Math.PI * 2);
  ctx.fill();

  // Gradini
  ctx.fillStyle = window.PALETTE.stoneGrey;
  ctx.fillRect(x + w / 2 - 20, y + h - 4, 40, 4);
  ctx.fillRect(x + w / 2 - 24, y + h - 2, 48, 2);
}

export function drawPiazzaFountain(ctx, x, y, t) {
  if (window.BuildingRenderers?.drawFountain) {
    window.BuildingRenderers.drawFountain(ctx, x, y, 22, t);
  } else {
    // Fallback base
    ctx.fillStyle = '#5A5A5A';
    ctx.fillRect(x - 18, y + 12, 48, 6);
    ctx.fillStyle = '#4A7A8A';
    ctx.fillRect(x - 16, y + 14, 44, 4);
  }
}

export function drawBarFacade(ctx, x, y, w, h, t) {
  // Parete mattoni caldi
  if (window.drawBrickPattern) {
    window.drawBrickPattern(ctx, x, y, w, h, '#4A3528');
  } else {
    ctx.fillStyle = '#4A3528';
    ctx.fillRect(x, y, w, h);
  }

  // Tettoia a strisce (Awning)
  if (window.drawStripedAwning) {
    window.drawStripedAwning(ctx, x - 5, y + 10, w + 10, t);
  } else {
    ctx.fillStyle = '#5A2A1A';
    ctx.fillRect(x - 4, y - 6, w + 8, 6);
  }

  // Insegna neon
  var neonPulse = 0.65 + Math.sin(t * 3) * 0.15;
  ctx.fillStyle = '#1A1A1A';
  ctx.fillRect(x + 4, y - 22, w - 8, 16);
  ctx.strokeStyle = `rgba(200,40,40,${neonPulse})`;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 5, y - 21, w - 10, 14);

  ctx.fillStyle = `rgba(255,200,100,${neonPulse})`;
  ctx.font = 'bold 8px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BAR', x + w / 2, y - 11);
  ctx.textAlign = 'start';

  // Finestre illuminate
  if (window.drawLitWindow) {
    window.drawLitWindow(ctx, x + 8, y + 15, 18, 22, true, t, 0);
    window.drawLitWindow(ctx, x + w - 26, y + 15, 18, 22, true, t, 1);
  } else {
    ctx.fillStyle = `rgba(212,168,67,0.6)`;
    ctx.fillRect(x + 8, y + 15, 18, 22);
    ctx.fillRect(x + w - 26, y + 15, 18, 22);
  }

  // Porta
  ctx.fillStyle = '#2A1D15';
  ctx.fillRect(x + w / 2 - 12, y + h - 35, 24, 35);
  ctx.fillStyle = '#3A2D20';
  ctx.fillRect(x + w / 2 - 10, y + h - 33, 20, 31);
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
  walkableTop: 125, // Portato a 125 per permettere di toccare le porte (prima era 140)
  colliders: [
    { x: 125, y: 0, w: 150, h: 120 }, // Municipio (Ridotto h per accessibilità)
    { x: 302, y: 0, w: 23, h: 160 }, // Bar SX
    { x: 349, y: 0, w: 51, h: 160 }, // Bar DX
    { x: 82, y: 0, w: 36, h: 160 }, // Bacheca
    { x: 240, y: 155, w: 42, h: 28 }, // Fontana
    { x: 0, y: 0, w: 100, h: 120 }, // Chiesa
  ],
  exits: [
    {
      dir: 'up',
      xRange: [180, 220],
      to: 'municipio',
      spawnX: 200,
      spawnY: 200,
      requiresInteract: true,
    },
    { dir: 'up', xRange: [20, 80], to: 'chiesa', spawnX: 200, spawnY: 220 },
    {
      dir: 'up',
      xRange: [320, 350],
      to: 'bar_exterior',
      spawnX: 130,
      spawnY: 175,
      requiresInteract: true,
    },
    { dir: 'down', xRange: [160, 240], to: 'residenziale', spawnX: 200, spawnY: 140 },
    { dir: 'left', xRange: [100, 200], to: 'giardini', spawnX: 340, spawnY: 175 },
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
      var gy = 108 + ((i * 13) % 40);
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

    // CHIESA (Facciata a sinistra)
    ctx.fillStyle = '#2A2A2A';
    ctx.fillRect(0, 40, 80, 100);
    ctx.fillStyle = '#444';
    ctx.fillRect(20, 90, 40, 50); // Porta chiesa

    drawMunicipioFacade(ctx, 125, 48, 150, 86, t);
    drawPiazzaFountain(ctx, 240, 155, t);
    drawBarFacade(ctx, 302, 112, 70, 56, t);
    drawNoticeBoard(ctx, 82, 136, t);
    drawBench(ctx, 260, 166);
    drawFlowerPot(ctx, 120, 195);
    drawFlowerPot(ctx, 288, 188);
    drawCat(ctx, 276, 162, t);

    // INDICATORI DI PASSAGGIO (FRECCE)
    function drawArrow(x, y, dir, color) {
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = color || 'rgba(212,168,67,0.6)';
      ctx.beginPath();
      if (dir === 'up') {
        ctx.moveTo(0, 0);
        ctx.lineTo(5, 5);
        ctx.lineTo(-5, 5);
      } else if (dir === 'down') {
        ctx.moveTo(0, 5);
        ctx.lineTo(5, 0);
        ctx.lineTo(-5, 0);
      } else if (dir === 'left') {
        ctx.moveTo(-5, 0);
        ctx.lineTo(0, 5);
        ctx.lineTo(0, -5);
      } else if (dir === 'right') {
        ctx.moveTo(5, 0);
        ctx.lineTo(0, 5);
        ctx.lineTo(0, -5);
      }
      ctx.fill();
      ctx.restore();
    }

    // Frecce per uscite
    drawArrow(200, 145, 'up'); // Municipio
    drawArrow(45, 145, 'up'); // Chiesa
    drawArrow(337, 172, 'up'); // Bar
    drawArrow(200, 240, 'down'); // Residenziale
    drawArrow(10, 150, 'left'); // Giardini

    // CARTELLI / INSEGNE TESTUALI PER CHIAREZZA
    ctx.font = 'bold 9px "Courier New", monospace';
    ctx.textAlign = 'center';

    // Municipio
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(180, 130, 40, 10);
    ctx.fillStyle = window.PALETTE.lanternYel;
    ctx.fillText('MUNICIPIO', 200, 138);

    // Bar
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(322, 158, 30, 10);
    ctx.fillStyle = '#ff6666';
    ctx.fillText('BAR', 337, 166);

    // Chiesa (Sopra la porta a SX)
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(25, 130, 40, 10);
    ctx.fillStyle = '#aaa';
    ctx.fillText('CHIESA', 45, 138);

    window.PF.lamp(ctx, 48, 142);
    window.PF.lamp(ctx, 160, 140);
    window.PF.lamp(ctx, 352, 142);
    window.PF.tree(ctx, 36, 142);
    window.PF.tree(ctx, 292, 150);

    // Helper: vaso di fiori
    function drawFlowerPot(c, fx, fy) {
      c.fillStyle = '#6B4E3D';
      c.fillRect(fx, fy, 10, 8);
      c.fillRect(fx + 1, fy - 2, 8, 3);
      c.fillStyle = '#8B7355';
      c.fillRect(fx + 1, fy, 8, 3);
      c.fillStyle = '#D4A843';
      c.fillRect(fx + 2, fy - 3, 2, 3);
      c.fillRect(fx + 6, fy - 4, 2, 4);
      c.fillStyle = '#CC4444';
      c.fillRect(fx + 4, fy - 3, 2, 2);
      c.fillStyle = '#5C7A4B';
      c.fillRect(fx + 1, fy - 5, 3, 3);
      c.fillRect(fx + 6, fy - 5, 3, 2);
    }

    // Helper: gatto
    function drawCat(c, cx, cy, tt) {
      var tail = Math.sin(tt * 4) * 2;
      c.fillStyle = '#3A3A3A';
      c.fillRect(cx, cy, 8, 6);
      c.fillRect(cx + 1, cy - 3, 5, 3);
      c.fillStyle = '#6EEBFF';
      c.fillRect(cx + 4, cy - 2, 2, 1);
      c.fillRect(cx + 5, cy - 2, 1, 1);
      c.fillStyle = '#3A3A3A';
      c.fillRect(cx - 3 + tail, cy + 1, 4, 2);
    }

    window.drawVignette(ctx);
  },
};

// Esporta
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PiazzeArea;
} else if (typeof window !== 'undefined') {
  window.PiazzeArea = PiazzeArea;
}
