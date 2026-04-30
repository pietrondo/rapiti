/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: BAR EXTERIOR
 * Bar - Esterno
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global PALETTE, CANVAS_W, CANVAS_H, PF, drawVignette */

export function drawBarExteriorArea(ctx, t) {
  PF.nightSky(ctx, 11);
  PF.mountains(ctx);

  ctx.fillStyle = PALETTE.oliveGreen;
  ctx.fillRect(0, 100, CANVAS_W, 150);

  // Edificio bar
  ctx.fillStyle = PALETTE.uiBg;
  ctx.fillRect(82, 34, 236, 96);

  // Tetto
  ctx.fillStyle = PALETTE.burntOrange;
  ctx.beginPath();
  ctx.moveTo(78, 34);
  ctx.lineTo(200, 10);
  ctx.lineTo(322, 34);
  ctx.fill();

  // Insegna neon
  var neon = 0.62 + Math.sin(t * 4) * 0.28;
  ctx.fillStyle = 'rgba(110,18,18,0.72)';
  ctx.fillRect(120, 40, 160, 25);
  ctx.fillStyle = 'rgba(220,54,42,' + neon.toFixed(2) + ')';
  ctx.fillRect(124, 44, 152, 17);
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.font = 'bold 11px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BAR SAN CELESTE', 200, 55);
  ctx.textAlign = 'start';

  // Finestre
  var glow1 = 0.42 + Math.sin(t * 2) * 0.12;
  var glow2 = 0.42 + Math.sin(t * 2 + 1) * 0.12;

  ctx.fillStyle = PALETTE.nightBlue;
  ctx.fillRect(112, 70, 34, 42);
  ctx.fillRect(226, 70, 34, 42);

  ctx.fillStyle = 'rgba(212,168,67,' + glow1.toFixed(2) + ')';
  ctx.fillRect(115, 73, 28, 36);
  ctx.fillStyle = 'rgba(212,168,67,' + glow2.toFixed(2) + ')';
  ctx.fillRect(229, 73, 28, 36);

  // Porta
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.fillRect(185, 100, 30, 30);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.fillRect(210, 115, 3, 3);

  // Tavolini esterni
  ctx.fillStyle = PALETTE.greyBrown;
  ctx.fillRect(112, 150, 34, 24);
  ctx.fillRect(226, 150, 34, 24);

  // Albero
  PF.tree(ctx, 302, 138);

  // Lampioni
  PF.lamp(ctx, 50, 120);
  PF.lamp(ctx, 350, 120);
}

const BarExteriorArea = {
  name: 'Bar — Esterno',
  walkableTop: 100,
  colliders: [
    { x: 82, y: 34, w: 236, h: 96 },
    { x: 112, y: 150, w: 34, h: 24 },
    { x: 226, y: 150, w: 34, h: 24 },
    { x: 302, y: 138, w: 24, h: 34 },
  ],
  npcs: [{ id: 'osvaldo', x: 280, y: 175 }],
  exits: [{ dir: 'left', xRange: [122, 176], to: 'piazze', spawnX: 360, spawnY: 145 }],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawBarExteriorArea(ctx, t);
    drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BarExteriorArea;
} else if (typeof window !== 'undefined') {
  window.BarExteriorArea = BarExteriorArea;
}
