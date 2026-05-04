/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: GIARDINI
 * Giardini Pubblici
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.PF, window.drawVignette */

export function drawGardensArea(ctx, t) {
  window.PF.nightSky(ctx, 10);
  window.PF.mountains(ctx);

  ctx.fillStyle = window.PALETTE.oliveGreen;
  ctx.fillRect(0, 90, window.CANVAS_W, 160);

  // Aiuole
  ctx.fillStyle = window.PALETTE.darkForest;
  ctx.fillRect(25, 90, 25, 160);
  ctx.fillRect(375, 90, 25, 160);

  // Fontana centrale
  ctx.fillStyle = window.PALETTE.stoneGrey;
  ctx.fillRect(170, 155, 60, 18);
  ctx.fillStyle = '#6fa';
  ctx.globalAlpha = 0.6 + Math.sin(t * 3) * 0.2;
  ctx.fillRect(175, 160, 50, 8);
  ctx.globalAlpha = 1;

  // Alberi e arbusti
  window.PF.tree(ctx, 50, 130);
  window.PF.tree(ctx, 100, 180);
  window.PF.tree(ctx, 300, 140);
  window.PF.tree(ctx, 350, 190);

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

  // Menta Selvatica (Indizio Missione)
  if (window.gameState.cluesFound.indexOf('menta') === -1) {
    ctx.fillStyle = '#6fa';
    ctx.beginPath();
    ctx.arc(280, 190, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2d5a27';
    ctx.fillRect(278, 190, 4, 2);
  }

  // Panchina
  ctx.fillStyle = window.PALETTE.greyBrown;
  ctx.fillRect(200, 200, 40, 8);
  ctx.fillRect(205, 208, 4, 10);
  ctx.fillRect(231, 208, 4, 10);

  window.PF.lamp(ctx, 80, 120);
  window.PF.lamp(ctx, 320, 120);
}

const GiardiniArea = {
  name: 'Giardini Pubblici',
  walkableTop: 90,
  colliders: [{ x: 170, y: 155, w: 60, h: 18 }],
  npcs: [{ id: 'anselmo', x: 120, y: 170 }],
  exits: [
    { dir: 'right', xRange: [100, 160], to: 'piazze', spawnX: 45, spawnY: 175 },
    {
      dir: 'left',
      xRange: [135, 205],
      to: 'campo',
      spawnX: 350,
      spawnY: 170,
      requiresFlag: 'deduction_complete',
    },
  ],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawGardensArea(ctx, t);

    // Freccia verso Piazza
    ctx.fillStyle = 'rgba(212,168,67,0.6)';
    ctx.beginPath();
    ctx.moveTo(395, 175);
    ctx.lineTo(390, 180);
    ctx.lineTo(390, 170);
    ctx.fill();
    ctx.font = 'bold 8px "Courier New", monospace';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'right';
    ctx.fillText('PIAZZA →', 385, 178);
    ctx.textAlign = 'left';
    ctx.fillText('← CAMPO', 14, 178);

    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GiardiniArea;
} else if (typeof window !== 'undefined') {
  window.GiardiniArea = GiardiniArea;
}
