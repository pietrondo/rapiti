/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: CAMPO
 * Campo delle Luci - area finale delle tracce circolari
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.PF, window.drawVignette */

export function drawCampoArea(ctx, t) {
  window.PF.nightSky(ctx, 8);
  window.PF.mountains(ctx);

  ctx.fillStyle = '#223018';
  ctx.fillRect(0, 84, window.CANVAS_W, window.CANVAS_H - 84);

  ctx.fillStyle = '#2f451f';
  for (var row = 0; row < 8; row++) {
    var y = 96 + row * 18;
    ctx.fillRect(0, y, window.CANVAS_W, 4);
  }

  ctx.strokeStyle = 'rgba(212,168,67,0.32)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(206, 156, 58, 24, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.ellipse(206, 156, 34, 13, 0, 0, Math.PI * 2);
  ctx.stroke();

  var glow = 0.18 + Math.sin(t * 2.4) * 0.08;
  ctx.fillStyle = `rgba(130,190,255,${glow})`;
  ctx.beginPath();
  ctx.ellipse(206, 156, 64, 30, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#89a66c';
  for (var i = 0; i < 70; i++) {
    var x = (i * 37) % window.CANVAS_W;
    var y2 = 98 + ((i * 19) % 132);
    ctx.fillRect(x, y2, 2, 8);
  }

  ctx.fillStyle = 'rgba(180,220,255,0.5)';
  ctx.beginPath();
  ctx.arc(206, 156, 3, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(212,168,67,0.6)';
  ctx.beginPath();
  ctx.moveTo(395, 172);
  ctx.lineTo(390, 177);
  ctx.lineTo(390, 167);
  ctx.fill();
  ctx.font = 'bold 8px "Courier New", monospace';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'right';
  ctx.fillText('GIARDINI →', 385, 175);
}

const CampoArea = {
  name: 'Campo delle Luci',
  walkableTop: 88,
  colliders: [],
  npcs: [{ id: 'teresa', x: 210, y: 160 }],
  exits: [{ dir: 'right', xRange: [135, 200], to: 'giardini', spawnX: 35, spawnY: 170 }],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawCampoArea(ctx, t);
    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CampoArea;
} else if (typeof window !== 'undefined') {
  window.CampoArea = CampoArea;
}
