/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: GIARDINI
 * Giardini Pubblici
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global PALETTE, CANVAS_W, CANVAS_H, PF, drawVignette */

function drawGardensArea(ctx, t) {
  PF.nightSky(ctx, 10);
  PF.mountains(ctx);

  ctx.fillStyle = PALETTE.oliveGreen;
  ctx.fillRect(0, 90, CANVAS_W, 160);

  // Aiuole
  ctx.fillStyle = PALETTE.darkForest;
  ctx.fillRect(25, 90, 25, 160);
  ctx.fillRect(375, 90, 25, 160);

  // Fontana centrale
  ctx.fillStyle = PALETTE.stoneGrey;
  ctx.fillRect(170, 155, 60, 18);
  ctx.fillStyle = '#6fa';
  ctx.globalAlpha = 0.6 + Math.sin(t * 3) * 0.2;
  ctx.fillRect(175, 160, 50, 8);
  ctx.globalAlpha = 1;

  // Alberi e arbusti
  PF.tree(ctx, 50, 130);
  PF.tree(ctx, 100, 180);
  PF.tree(ctx, 300, 140);
  PF.tree(ctx, 350, 190);

  // Fiori
  var flowers = [
    { x: 120, y: 150, c: '#ff6b6b' },
    { x: 140, y: 170, c: '#ffe66d' },
    { x: 260, y: 160, c: '#4ecdc4' },
    { x: 280, y: 180, c: '#ff6b6b' },
  ];

  for (var i = 0; i < flowers.length; i++) {
    var f = flowers[i];
    ctx.fillStyle = f.c;
    ctx.beginPath();
    ctx.arc(f.x, f.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Panchina
  ctx.fillStyle = PALETTE.greyBrown;
  ctx.fillRect(200, 200, 40, 8);
  ctx.fillRect(205, 208, 4, 10);
  ctx.fillRect(231, 208, 4, 10);

  PF.lamp(ctx, 80, 120);
  PF.lamp(ctx, 320, 120);
}

var GiardiniArea = {
  name: 'Giardini Pubblici',
  walkableTop: 90,
  colliders: [
    { x: 0, y: 90, w: 25, h: 160 },
    { x: 375, y: 90, w: 25, h: 160 },
    { x: 170, y: 155, w: 60, h: 18 },
  ],
  npcs: [{ id: 'anselmo', x: 120, y: 170 }],
  exits: [{ dir: 'right', xRange: [100, 140], to: 'piazze', spawnX: 40, spawnY: 125 }],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawGardensArea(ctx, t);
    drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GiardiniArea;
} else if (typeof window !== 'undefined') {
  window.GiardiniArea = GiardiniArea;
}
