/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: CIMITERO
 * Cimitero Comunale
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.PF, window.drawVignette */

export function drawCemeteryArea(ctx, t) {
  window.PF.nightSky(ctx, 16, t);
  window.PF.mountains(ctx);

  ctx.fillStyle = window.PALETTE.darkForest;
  ctx.fillRect(0, 80, window.CANVAS_W, 170);
  
  // Pattern erba scura nel cimitero
  if (window.drawWallTexture) {
    window.drawWallTexture(ctx, 0, 80, window.CANVAS_W, 170, window.PALETTE.darkForest, 'rgba(0,0,0,0.1)');
  }

  // Mura del cimitero (Pietra)
  if (window.drawBrickPattern) {
    window.drawBrickPattern(ctx, 0, 80, 35, 170, window.PALETTE.stoneGrey);
    window.drawBrickPattern(ctx, 365, 80, 35, 170, window.PALETTE.stoneGrey);
  } else {
    ctx.fillStyle = window.PALETTE.stoneGrey;
    ctx.fillRect(0, 80, 30, 170);
    ctx.fillRect(370, 80, 30, 170);
  }

  // Lapidi migliorate
  var tombstones = [
    { x: 60, y: 120, w: 20, h: 30, type: 'rounded' },
    { x: 100, y: 140, w: 18, h: 28, type: 'flat' },
    { x: 150, y: 110, w: 22, h: 35, type: 'cross' },
    { x: 200, y: 130, w: 20, h: 32, type: 'rounded' },
    { x: 250, y: 115, w: 18, h: 28, type: 'flat' },
    { x: 300, y: 145, w: 20, h: 30, type: 'rounded' },
    { x: 80, y: 180, w: 20, h: 28, type: 'flat' },
    { x: 130, y: 190, w: 22, h: 32, type: 'cross' },
    { x: 280, y: 185, w: 18, h: 26, type: 'rounded' },
  ];

  for (var i = 0; i < tombstones.length; i++) {
    var ts = tombstones[i];
    ctx.fillStyle = '#5a5a5a';
    
    if (ts.type === 'cross') {
      ctx.fillRect(ts.x + ts.w/2 - 4, ts.y, 8, ts.h);
      ctx.fillRect(ts.x, ts.y + 8, ts.w, 8);
    } else if (ts.type === 'rounded') {
      ctx.beginPath();
      ctx.roundRect(ts.x, ts.y, ts.w, ts.h, [8, 8, 0, 0]);
      ctx.fill();
    } else {
      ctx.fillRect(ts.x, ts.y, ts.w, ts.h);
    }
    
    // Dettagli muschio/erosione
    ctx.fillStyle = 'rgba(0,50,0,0.2)';
    ctx.fillRect(ts.x + 2, ts.y + ts.h - 6, ts.w - 4, 4);
  }

  // Busta Gialla di Gino (Indizio Missione)
  if (window.gameState.cluesFound.indexOf('lettera_gino') === -1) {
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(100, 220, 16, 12);
    ctx.strokeStyle = '#DAA520';
    ctx.lineWidth = 1;
    ctx.strokeRect(100, 220, 16, 12);
    // Sigillo ceralacca
    ctx.fillStyle = '#CC4444';
    ctx.fillRect(106, 224, 4, 4);
  }

  // Alberi spettrali (usano il nuovo renderer)
  window.PF.tree(ctx, 50, 105);
  window.PF.tree(ctx, 350, 105);
  window.PF.tree(ctx, 160, 160);

  // Nebbia bassa (placeholder per hya task)
  var glow = 0.4 + Math.sin(t * 1.5) * 0.1;
  ctx.fillStyle = `rgba(120, 150, 180, ${glow * 0.3})`;
  ctx.fillRect(0, 180, window.CANVAS_W, 70);

  window.PF.lamp(ctx, 200, 190, t);
}

const CimiteroArea = {
  name: 'Cimitero Comunale',
  walkableTop: 80,
  colliders: [],
  npcs: [],
  exits: [{ dir: 'down', xRange: [170, 230], to: 'chiesa', spawnX: 200, spawnY: 210 }],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawCemeteryArea(ctx, t);
    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CimiteroArea;
} else if (typeof window !== 'undefined') {
  window.CimiteroArea = CimiteroArea;
}
