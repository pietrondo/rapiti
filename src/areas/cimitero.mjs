/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: CIMITERO
 * Cimitero Comunale
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global PALETTE, CANVAS_W, CANVAS_H, PF, drawVignette */

export function drawCemeteryArea(ctx, t) {
  PF.nightSky(ctx, 16);
  PF.mountains(ctx);

  ctx.fillStyle = PALETTE.darkForest;
  ctx.fillRect(0, 80, CANVAS_W, 170);

  // Mura del cimitero
  ctx.fillStyle = PALETTE.stoneGrey;
  ctx.fillRect(0, 80, 30, 170);
  ctx.fillRect(370, 80, 30, 170);

  // Lapidi
  var tombstones = [
    { x: 60, y: 120, w: 20, h: 30 },
    { x: 100, y: 140, w: 18, h: 28 },
    { x: 150, y: 110, w: 22, h: 35 },
    { x: 200, y: 130, w: 20, h: 32 },
    { x: 250, y: 115, w: 18, h: 28 },
    { x: 300, y: 145, w: 20, h: 30 },
    { x: 80, y: 180, w: 20, h: 28 },
    { x: 130, y: 190, w: 22, h: 32 },
    { x: 280, y: 185, w: 18, h: 26 },
  ];

  for (var i = 0; i < tombstones.length; i++) {
    var ts = tombstones[i];
    ctx.fillStyle = '#5a5a5a';
    ctx.fillRect(ts.x, ts.y, ts.w, ts.h);
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(ts.x + 2, ts.y + 2, ts.w - 4, ts.h - 4);
  }

  // Alberi spettrali
  PF.tree(ctx, 50, 100);
  PF.tree(ctx, 350, 100);

  // Luce fredda
  var glow = 0.4 + Math.sin(t * 2) * 0.1;
  ctx.fillStyle = `rgba(100, 150, 200, ${glow})`;
  ctx.beginPath();
  ctx.arc(200, 100, 40, 0, Math.PI * 2);
  ctx.fill();

  PF.lamp(ctx, 200, 200);
}

const CimiteroArea = {
  name: 'Cimitero Comunale',
  walkableTop: 80,
  colliders: [
    { x: 0, y: 80, w: 30, h: 170 },
    { x: 370, y: 80, w: 30, h: 170 },
  ],
  npcs: [],
  exits: [{ dir: 'down', xRange: [170, 230], to: 'chiesa', spawnX: 200, spawnY: 210 }],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawCemeteryArea(ctx, t);
    drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CimiteroArea;
} else if (typeof window !== 'undefined') {
  window.CimiteroArea = CimiteroArea;
}
