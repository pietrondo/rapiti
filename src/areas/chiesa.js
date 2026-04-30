"use strict";

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: CHIESA
 * Chiesa di San Celeste
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global PALETTE, CANVAS_W, CANVAS_H, PF, drawVignette */

function drawChurchArea(ctx, t) {
  PF.nightSky(ctx, 12);
  PF.mountains(ctx);
  
  ctx.fillStyle = PALETTE.darkForest;
  ctx.fillRect(0, 100, CANVAS_W, 150);
  
  var churchX = 140;
  var churchY = 20;
  var churchW = 120;
  var churchH = 120;
  
  ctx.fillStyle = PALETTE.uiBg;
  ctx.fillRect(churchX, churchY + 40, churchW, churchH - 40);
  
  ctx.fillStyle = PALETTE.stoneGrey;
  ctx.beginPath();
  ctx.moveTo(churchX + churchW/2, churchY);
  ctx.lineTo(churchX + churchW, churchY + 40);
  ctx.lineTo(churchX, churchY + 40);
  ctx.fill();
  
  var windowGlow = 0.5 + Math.sin(t * 1.5) * 0.1;
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.globalAlpha = windowGlow;
  ctx.fillRect(churchX + 20, churchY + 60, 20, 30);
  ctx.fillRect(churchX + 80, churchY + 60, 20, 30);
  ctx.globalAlpha = 1;
  
  ctx.fillStyle = PALETTE.accent;
  ctx.fillRect(churchX + 50, churchY + 100, 20, 40);
  
  ctx.fillStyle = PALETTE.greyBrown;
  ctx.fillRect(churchX, churchY + 140, churchW, 20);
  
  PF.lamp(ctx, 80, 180);
  PF.lamp(ctx, 320, 180);
  PF.tree(ctx, 40, 170);
  PF.tree(ctx, 360, 170);
}

var ChiesaArea = {
  name: 'Chiesa di San Celeste',
  walkableTop: 100,
  colliders: [
    {x:140, y:20, w:120, h:120},
    {x:140, y:140, w:120, h:20}
  ],
  npcs: [
    { id: 'don_pietro', x: 200, y: 180 }
  ],
  exits: [
    {dir:'up',   xRange:[170,230], to:'cimitero',      spawnX:200, spawnY:112},
    {dir:'down', xRange:[170,230], to:'piazze',        spawnX:200, spawnY:188}
  ],
  
  draw: function(ctx) {
    var t = Date.now() * 0.001;
    drawChurchArea(ctx, t);
    drawVignette(ctx);
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChiesaArea;
} else if (typeof window !== 'undefined') {
  window.ChiesaArea = ChiesaArea;
}
