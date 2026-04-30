/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: PIAZZE
 * Piazza del Paese - Centro hub del gioco
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global PALETTE, CANVAS_W, CANVAS_H, PF, TextureGenerator, drawVignette */

const areaTextures = {};

export function getAreaTexture(type) {
  if (!areaTextures[type]) {
    areaTextures[type] = TextureGenerator.getOrCreateTexture(type, 400, 250);
  }
  return areaTextures[type];
}

// Helper functions per piazze
export function drawMunicipioFacade(ctx, x, y, w, h, t) {
  var windowGlow = 0.6 + Math.sin(t * 2) * 0.1;
  ctx.fillStyle = PALETTE.uiBg;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = PALETTE.greyBrown;
  ctx.fillRect(x + 5, y + h - 10, w - 10, 10);
  ctx.fillStyle = PALETTE.darkForest;
  ctx.beginPath();
  ctx.moveTo(x + w/2, y);
  ctx.lineTo(x + w, y + 30);
  ctx.lineTo(x, y + 30);
  ctx.fill();
  ctx.fillStyle = PALETTE.lanternYel;
  for (var i = 0; i < 3; i++) {
    for (var j = 0; j < 2; j++) {
      ctx.globalAlpha = windowGlow;
      ctx.fillRect(x + 20 + i * 40, y + 40 + j * 25, 15, 18);
      ctx.globalAlpha = 1;
    }
  }
  ctx.fillStyle = PALETTE.accent;
  ctx.fillRect(x + w/2 - 12, y + h - 35, 24, 30);
}

export function drawPiazzaFountain(ctx, x, y, t) {
  ctx.fillStyle = PALETTE.stoneGrey;
  ctx.fillRect(x - 15, y + 10, 42, 18);
  ctx.fillStyle = PALETTE.darkForest;
  ctx.beginPath();
  ctx.moveTo(x - 20, y + 10);
  ctx.lineTo(x + 32, y + 10);
  ctx.lineTo(x + 6, y - 15);
  ctx.fill();
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.globalAlpha = 0.8;
  ctx.fillRect(x + 2, y - 12, 8, 8);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#6fa';
  ctx.globalAlpha = 0.6 + Math.sin(t * 3) * 0.2;
  ctx.fillRect(x - 10, y + 15, 32, 8);
  ctx.globalAlpha = 1;
}

export function drawBarFacade(ctx, x, y, w, h, t) {
  ctx.fillStyle = PALETTE.uiBg;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = PALETTE.greyBrown;
  ctx.fillRect(x, y + h - 8, w, 8);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.globalAlpha = 0.7 + Math.sin(t * 2.5) * 0.1;
  ctx.fillRect(x + 8, y + 15, 18, 22);
  ctx.fillRect(x + 44, y + 15, 18, 22);
  ctx.globalAlpha = 1;
  ctx.fillStyle = PALETTE.accent;
  ctx.fillRect(x + 26, y + h - 28, 18, 24);
}

export function drawNoticeBoard(ctx, x, y, t) {
  ctx.fillStyle = PALETTE.greyBrown;
  ctx.fillRect(x, y, 28, 38);
  ctx.fillStyle = '#dcb';
  ctx.fillRect(x + 3, y + 4, 22, 24);
  ctx.fillStyle = '#333';
  for (var i = 0; i < 4; i++) {
    ctx.fillRect(x + 5, y + 7 + i * 6, 18, 1);
  }
}

export function drawBench(ctx, x, y) {
  ctx.fillStyle = PALETTE.greyBrown;
  ctx.fillRect(x, y, 36, 10);
  ctx.fillRect(x + 4, y + 10, 4, 12);
  ctx.fillRect(x + 28, y + 10, 4, 12);
}

const PiazzeArea = {
  name: 'Piazza del Paese',
  walkableTop: 105,
  colliders: [
    {x:125, y:48, w:150, h:86},
    {x:182, y:145, w:42, h:28},
    {x:302, y:112, w:70, h:56},
    {x:82,  y:136, w:36, h:34}
  ],
  npcs: [],
  exits: [
    {dir:'up',   xRange:[168,232], to:'chiesa',        spawnX:200, spawnY:210},
    {dir:'down', xRange:[170,230], to:'residenziale',  spawnX:200, spawnY:132},
    {dir:'left', xRange:[100,140], to:'giardini',      spawnX:360, spawnY:125},
    {dir:'right',xRange:[122,176], to:'bar_exterior',  spawnX:40,  spawnY:145}
  ],
  
  draw: function(ctx) {
    PF.nightSky(ctx, 14);
    ctx.fillStyle = PALETTE.lanternYel; 
    ctx.beginPath(); 
    ctx.arc(340, 22, 14, 0, Math.PI*2); 
    ctx.fill();
    ctx.fillStyle = PALETTE.nightBlue; 
    ctx.beginPath(); 
    ctx.arc(346, 18, 10, 0, Math.PI*2); 
    ctx.fill();
    PF.mountains(ctx);
    var t = Date.now() * 0.001;
    ctx.fillStyle = PALETTE.oliveGreen;
    ctx.fillRect(0, 104, CANVAS_W, 146);
    ctx.fillStyle = PALETTE.darkForest;
    ctx.fillRect(0, 102, CANVAS_W, 4);

    var stoneTex = getAreaTexture('stone');
    ctx.drawImage(stoneTex, 0, 0, CANVAS_W, 120, 0, 130, CANVAS_W, 120);
    ctx.fillStyle = 'rgba(139,125,107,0.88)';
    ctx.fillRect(0, 130, CANVAS_W, 120);
    ctx.fillStyle = 'rgba(74,85,104,0.32)';
    for (var r=0; r<10; r++) {
      for (var c=0; c<15; c++) {
        ctx.fillRect(c*29+(r%2)*14, 136+r*11, 24, 3);
      }
    }

    ctx.fillStyle = PALETTE.greyBrown;
    ctx.beginPath();
    ctx.moveTo(170, 134); ctx.lineTo(230, 134); ctx.lineTo(258, 250); ctx.lineTo(142, 250); ctx.fill();
    ctx.fillStyle = 'rgba(232,220,200,0.14)';
    ctx.beginPath();
    ctx.moveTo(195, 134); ctx.lineTo(205, 134); ctx.lineTo(220, 250); ctx.lineTo(180, 250); ctx.fill();

    drawMunicipioFacade(ctx, 125, 48, 150, 86, t);
    drawPiazzaFountain(ctx, 182, 145, t);
    drawBarFacade(ctx, 302, 112, 70, 56, t);
    drawNoticeBoard(ctx, 82, 136, t);
    drawBench(ctx, 260, 166);
    PF.lamp(ctx, 48, 142);
    PF.lamp(ctx, 198, 138);
    PF.lamp(ctx, 352, 142);
    PF.tree(ctx, 36, 142);
    PF.tree(ctx, 292, 150);
    drawVignette(ctx);
  }
};

// Esporta
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PiazzeArea;
} else if (typeof window !== 'undefined') {
  window.PiazzeArea = PiazzeArea;
}
