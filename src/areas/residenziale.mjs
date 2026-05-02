/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: RESIDENZIALE
 * Quartiere Residenziale
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.PF, window.drawVignette */

export function drawResidentialArea(ctx, t) {
  window.PF.nightSky(ctx, 10);
  window.PF.mountains(ctx);

  ctx.fillStyle = window.PALETTE.oliveGreen;
  ctx.fillRect(0, 90, window.CANVAS_W, 160);

  // Case
  var houses = [
    { x: 20, y: 30, w: 80, h: 85, color: window.PALETTE.fadedBeige },
    { x: 160, y: 25, w: 80, h: 90, color: window.PALETTE.creamPaper },
    { x: 300, y: 35, w: 80, h: 80, color: window.PALETTE.fadedBeige },
  ];

  for (var i = 0; i < houses.length; i++) {
    var h = houses[i];
    ctx.fillStyle = h.color;
    ctx.fillRect(h.x, h.y, h.w, h.h);

    // Tetto
    ctx.fillStyle = window.PALETTE.burntOrange;
    ctx.beginPath();
    ctx.moveTo(h.x - 5, h.y);
    ctx.lineTo(h.x + h.w / 2, h.y - 20);
    ctx.lineTo(h.x + h.w + 5, h.y);
    ctx.fill();

    // Finestre con luce
    var glow = 0.5 + Math.sin(t * 2 + i) * 0.1;
    ctx.fillStyle = `rgba(212,168,67,${glow.toFixed(2)})`;
    ctx.fillRect(h.x + 15, h.y + 25, 20, 25);
    ctx.fillRect(h.x + h.w - 35, h.y + 25, 20, 25);

    // Porta
    ctx.fillStyle = window.PALETTE.earthBrown;
    ctx.fillRect(h.x + h.w / 2 - 10, h.y + h.h - 30, 20, 30);
  }

  // Strada
  ctx.fillStyle = window.PALETTE.stoneGrey;
  ctx.fillRect(175, 155, 50, 16);

  // Alberi
  window.PF.tree(ctx, 10, 150);
  window.PF.tree(ctx, 390, 140);

  // Lampioni
  window.PF.lamp(ctx, 120, 180);
  window.PF.lamp(ctx, 280, 180);
}

const ResidenzialeArea = {
  name: 'Quartiere Residenziale',
  walkableTop: 90,
  colliders: [
    { x: 20, y: 30, w: 80, h: 85 },
    { x: 160, y: 25, w: 80, h: 90 },
    { x: 300, y: 35, w: 80, h: 80 },
    { x: 175, y: 155, w: 50, h: 16 },
  ],
  npcs: [{ id: 'valli', x: 200, y: 180 }],
  exits: [
    { dir: 'up', xRange: [170, 230], to: 'piazze', spawnX: 200, spawnY: 188 },
    { dir: 'down', xRange: [170, 230], to: 'industriale', spawnX: 200, spawnY: 130 },
  ],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawResidentialArea(ctx, t);
    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ResidenzialeArea;
} else if (typeof window !== 'undefined') {
  window.ResidenzialeArea = ResidenzialeArea;
}
