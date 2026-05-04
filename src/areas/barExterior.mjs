/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: BAR EXTERIOR
 * Bar - Esterno
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.PF, window.drawVignette */

export function drawBarExteriorArea(ctx, t) {
  window.PF.nightSky(ctx, 11);
  window.PF.mountains(ctx);

  // Terreno: Marciapiede in cemento davanti al bar
  ctx.fillStyle = '#454B56';
  ctx.fillRect(0, 130, window.CANVAS_W, 120);

  // Bordi marciapiede
  ctx.fillStyle = '#2C313B';
  for (var i = 0; i < 8; i++) {
    ctx.fillRect(i * 50, 130, 2, 120);
    ctx.fillRect(0, 130 + i * 20, window.CANVAS_W, 1);
  }

  // Edificio bar (Mattone Scuro)
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(82, 34, 236, 96);

  // Dettagli mattoni
  if (window.drawBrickPattern) {
    window.drawBrickPattern(ctx, 82, 34, 236, 96, '#4E342E');
  }

  // Tetto
  ctx.fillStyle = window.PALETTE.burntOrange;
  ctx.beginPath();
  ctx.moveTo(78, 34);
  ctx.lineTo(200, 10);
  ctx.lineTo(322, 34);
  ctx.fill();

  // Insegna neon
  var neon = 0.62 + Math.sin(t * 4) * 0.28;
  ctx.fillStyle = 'rgba(110,18,18,0.72)';
  ctx.fillRect(120, 40, 160, 25);
  ctx.fillStyle = `rgba(220,54,42,${neon.toFixed(2)})`;
  ctx.fillRect(124, 44, 152, 17);
  ctx.fillStyle = window.PALETTE.creamPaper;
  ctx.font = 'bold 11px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BAR SAN CELESTE', 200, 55);
  ctx.textAlign = 'start';

  // Finestre
  var glow1 = 0.42 + Math.sin(t * 2) * 0.12;
  var glow2 = 0.42 + Math.sin(t * 2 + 1) * 0.12;

  ctx.fillStyle = window.PALETTE.nightBlue;
  ctx.fillRect(112, 70, 34, 42);
  ctx.fillRect(226, 70, 34, 42);

  ctx.fillStyle = `rgba(212,168,67,${glow1.toFixed(2)})`;
  ctx.fillRect(115, 73, 28, 36);
  ctx.fillStyle = `rgba(212,168,67,${glow2.toFixed(2)})`;
  ctx.fillRect(229, 73, 28, 36);

  // Porta
  ctx.fillStyle = window.PALETTE.earthBrown;
  ctx.fillRect(185, 100, 30, 30);
  ctx.fillStyle = window.PALETTE.lanternYel;
  ctx.fillRect(210, 115, 3, 3);

  // Tavolini esterni
  ctx.fillStyle = window.PALETTE.greyBrown;
  ctx.fillRect(112, 150, 34, 24);
  ctx.fillRect(226, 150, 34, 24);

  // Albero
  window.PF.tree(ctx, 302, 138);

  // Lampioni
  window.PF.lamp(ctx, 50, 120);
  window.PF.lamp(ctx, 350, 120);
}

const BarExteriorArea = {
  name: 'Bar — Esterno',
  walkableTop: 130, // Alzato per bloccare l'accesso alla facciata
  colliders: [
    { x: 82, y: 0, w: 103, h: 250 }, // Edificio (Parte SX) — esteso per bloccare accesso al tetto
    { x: 215, y: 0, w: 103, h: 250 }, // Edificio (Parte DX) — esteso per bloccare accesso al tetto
    { x: 112, y: 150, w: 34, h: 24 }, // Tavolino
    { x: 226, y: 150, w: 34, h: 24 }, // Tavolino
    { x: 302, y: 138, w: 24, h: 34 }, // Albero
  ],
  npcs: [{ id: 'osvaldo', x: 280, y: 175 }],
  exits: [
    { dir: 'down', xRange: [100, 200], to: 'piazze', spawnX: 337, spawnY: 175 },
    {
      dir: 'up',
      xRange: [180, 220],
      to: 'bar_interno',
      spawnX: 200,
      spawnY: 220,
      requiresInteract: true,
    },
  ],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawBarExteriorArea(ctx, t);

    // Freccia verso Piazza
    ctx.fillStyle = 'rgba(212,168,67,0.6)';
    ctx.beginPath();
    ctx.moveTo(200, 245);
    ctx.lineTo(205, 240);
    ctx.lineTo(195, 240);
    ctx.fill();
    ctx.font = 'bold 8px "Courier New", monospace';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.fillText('↓ PIAZZA', 200, 235);

    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BarExteriorArea;
} else if (typeof window !== 'undefined') {
  window.BarExteriorArea = BarExteriorArea;
}
