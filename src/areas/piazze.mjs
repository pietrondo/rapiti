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
        window.drawLitWindow(ctx, wx, wy, 16, 20, true, t, (i * 2 + j));
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
  if (window.BuildingRenderers && window.BuildingRenderers.drawFountain) {
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
  walkableTop: 140,
  colliders: [
    { x: 125, y: 0, w: 150, h: 140 }, // Municipio
    { x: 302, y: 0, w: 23, h: 175 },  // Bar (Parte Sinistra)
    { x: 349, y: 0, w: 51, h: 175 },  // Bar (Parte Destra)
    { x: 82, y: 0, w: 36, h: 175 },   // Bacheca e muro SX
    { x: 240, y: 155, w: 42, h: 28 }, // Fontana (Spostata a DX della porta)
  ],
  exits: [
    { dir: 'up', xRange: [125, 275], to: 'municipio', spawnX: 200, spawnY: 210, requiresInteract: true }, // Municipio (Porta Principale)
    { dir: 'up', xRange: [40, 110], to: 'chiesa', spawnX: 200, spawnY: 220 }, // Chiesa spostata a SX (logica visiva)
    { dir: 'up', xRange: [302, 372], to: 'bar_exterior', spawnX: 130, spawnY: 175, requiresInteract: true }, // Porta Bar
    { dir: 'down', xRange: [0, 400], to: 'residenziale', spawnX: 200, spawnY: 140 },
    { dir: 'left', xRange: [0, 400], to: 'giardini', spawnX: 340, spawnY: 175 },
  ],

  draw: (ctx) => {
    window.PF.nightSky(ctx, 14);
    // ... (Luna code remains same) ...
    window.PF.mountains(ctx);
    var t = Date.now() * 0.001;
    
    // ... (Terreno/Piazza code remains same) ...
    
    drawMunicipioFacade(ctx, 125, 48, 150, 86, t);
    drawPiazzaFountain(ctx, 240, 155, t); 
    drawBarFacade(ctx, 302, 112, 70, 56, t);
    drawNoticeBoard(ctx, 82, 136, t);
    drawBench(ctx, 260, 166);

    // CARTELLI / INSEGNE TESTUALI PER CHIAREZZA
    ctx.font = 'bold 9px "Courier New", monospace';
    ctx.textAlign = 'center';
    
    // Municipio
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(175, 125, 50, 12);
    ctx.fillStyle = window.PALETTE.lanternYel;
    ctx.fillText('MUNICIPIO', 200, 134);

    // Bar
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(322, 158, 30, 12);
    ctx.fillStyle = '#ff6666';
    ctx.fillText('BAR', 337, 167);

    // Chiesa (Indicatore a SX)
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(60, 125, 45, 12);
    ctx.fillStyle = '#aaa';
    ctx.fillText('CHIESA', 82, 134);

    window.PF.lamp(ctx, 48, 142);
    window.PF.lamp(ctx, 160, 140);
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
