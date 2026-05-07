/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: ARCHIVIO COMUNALE
 * Archivio Storico — Scaffali polverosi, lampada a olio, Neri l'archivista
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.drawVignette */

export function drawArchivioArea(ctx, t) {
  var _PAL = window.PALETTE;

  // Sfondo interno scuro
  ctx.fillStyle = '#0D0F14';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Parete di fondo con scaffali
  ctx.fillStyle = '#1E2030';
  ctx.fillRect(0, 0, CANVAS_W, 100);
  for (var col = 0; col < 8; col++) {
    ctx.fillStyle = col % 2 === 0 ? '#1E2030' : '#232538';
    ctx.fillRect(col * 50, 0, 48, 100);
    // Ripiani
    ctx.fillStyle = '#2A1F1A';
    ctx.fillRect(col * 50, 25, 48, 3);
    ctx.fillRect(col * 50, 50, 48, 3);
    ctx.fillRect(col * 50, 75, 48, 3);
    // Libri/faldoni sui ripiani
    for (var l = 0; l < 4; l++) {
      var bw = 4 + ((col + l) % 6);
      ctx.fillStyle = ['#4A3428', '#5C4030', '#3E2723', '#6B4226'][l % 4];
      ctx.fillRect(col * 50 + 4 + l * 10, 27 + (l % 2) * 25, bw, 22);
      ctx.fillRect(col * 50 + 4 + l * 10, 52 + (l % 2) * 25, bw, 22);
    }
  }

  // Scrivania di Neri (sinistra)
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(20, 70, 80, 40);
  ctx.fillStyle = '#4E342E';
  ctx.fillRect(22, 72, 76, 4);
  // Lampada a olio sulla scrivania
  var flicker = 0.6 + Math.sin(t * 8) * 0.2;
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(55, 62, 6, 10);
  ctx.fillStyle = `rgba(255,200,100,${flicker})`;
  ctx.beginPath();
  ctx.arc(58, 60, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `rgba(255,180,80,${flicker * 0.3})`;
  ctx.beginPath();
  ctx.arc(58, 60, 18, 0, Math.PI * 2);
  ctx.fill();
  // Documenti sulla scrivania
  ctx.fillStyle = '#E8DCC8';
  ctx.fillRect(30, 78, 20, 12);
  ctx.fillRect(68, 80, 18, 10);
  ctx.fillStyle = '#A0A8B0';
  ctx.fillRect(34, 82, 12, 1);
  ctx.fillRect(70, 83, 14, 1);

  // Armadio archivio (destra)
  ctx.fillStyle = '#2E1F18';
  ctx.fillRect(310, 20, 70, 60);
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(315, 24, 12, 52);
  ctx.fillRect(332, 24, 12, 52);
  ctx.fillRect(349, 24, 12, 52);
  ctx.fillRect(366, 24, 12, 52);
  ctx.fillStyle = '#D4A843';
  ctx.fillRect(318, 40, 6, 4);
  ctx.fillRect(335, 40, 6, 4);
  ctx.fillRect(352, 40, 6, 4);
  ctx.fillRect(369, 40, 6, 4);
  ctx.fillRect(318, 60, 6, 4);
  ctx.fillRect(335, 60, 6, 4);
  ctx.fillRect(352, 60, 6, 4);
  ctx.fillRect(369, 60, 6, 4);

  // Pavimento in legno scuro
  for (var row = 0; row < 6; row++) {
    for (var col2 = 0; col2 < 10; col2++) {
      ctx.fillStyle = (row + col2) % 2 === 0 ? '#1A1A20' : '#22242C';
      ctx.fillRect(col2 * 40 + (row % 2) * 20, 100 + row * 25, 38, 25);
    }
  }

  // Luce calda dalla lampada
  var amb = ctx.createRadialGradient(58, 60, 5, 58, 60, 200);
  amb.addColorStop(0, `rgba(255,180,80,${0.12 + Math.sin(t * 3) * 0.03})`);
  amb.addColorStop(0.4, 'rgba(200,120,50,0.04)');
  amb.addColorStop(1, 'transparent');
  ctx.fillStyle = amb;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Polvere sospesa nella luce
  for (var d = 0; d < 15; d++) {
    var dx = 30 + ((t * 12 + d * 23) % 140);
    var dy = 30 + Math.sin(t * 2 + d) * 20;
    ctx.fillStyle = `rgba(255,200,120,${0.08 + Math.sin(t * 3 + d) * 0.04})`;
    ctx.fillRect(dx, dy, 1, 1);
  }
}

const ArchivioArea = {
  name: 'Archivio Comunale',
  walkableTop: 70,
  colliders: [
    { x: 20, y: 70, w: 80, h: 40 }, // Scrivania
    { x: 310, y: 20, w: 70, h: 60 }, // Armadio
  ],
  npcs: [{ id: 'neri', x: 120, y: 170 }],
  exits: [{ dir: 'down', xRange: [170, 230], to: 'piazze', spawnX: 200, spawnY: 195 }],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawArchivioArea(ctx, t);
    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ArchivioArea;
} else if (typeof window !== 'undefined') {
  window.ArchivioArea = ArchivioArea;
}
