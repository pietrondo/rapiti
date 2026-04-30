/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: POLIZIA
 * Stazione di Polizia
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global PALETTE, CANVAS_W, CANVAS_H, PF, drawVignette */

export function drawPoliceArea(ctx, t) {
  PF.nightSky(ctx, 12);
  PF.mountains(ctx);

  ctx.fillStyle = PALETTE.oliveGreen;
  ctx.fillRect(0, 95, CANVAS_W, 155);

  // Edificio polizia
  ctx.fillStyle = PALETTE.uiBg;
  ctx.fillRect(100, 25, 200, 95);

  // Tetto
  ctx.fillStyle = PALETTE.greyBrown;
  ctx.beginPath();
  ctx.moveTo(95, 25);
  ctx.lineTo(200, 5);
  ctx.lineTo(305, 25);
  ctx.fill();

  // Insegna
  ctx.fillStyle = '#1a365d';
  ctx.fillRect(130, 35, 140, 20);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 10px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('POLIZIA', 200, 48);
  ctx.textAlign = 'start';

  // Finestre
  var glow = 0.5 + Math.sin(t * 1.8) * 0.1;
  ctx.fillStyle = `rgba(130,160,220,${glow.toFixed(2)})`;
  ctx.fillRect(120, 65, 40, 30);
  ctx.fillRect(180, 65, 40, 30);
  ctx.fillRect(240, 65, 40, 30);

  // Porta
  ctx.fillStyle = PALETTE.earthBrown;
  ctx.fillRect(185, 90, 30, 30);

  // Auto polizia
  ctx.fillStyle = '#1a365d';
  ctx.fillRect(280, 140, 60, 35);
  ctx.fillStyle = '#fff';
  ctx.fillRect(285, 145, 20, 15);
  ctx.fillRect(315, 145, 20, 15);
  ctx.fillStyle = '#333';
  ctx.fillRect(285, 170, 12, 8);
  ctx.fillRect(323, 170, 12, 8);

  // Lampeggiante
  var flash = Math.sin(t * 8) > 0;
  ctx.fillStyle = flash ? '#f00' : '#00f';
  ctx.fillRect(295, 135, 8, 5);
  ctx.fillRect(315, 135, 8, 5);

  // Recinzione
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 140, 60, 35);
  ctx.fillRect(340, 140, 60, 35);

  // Alberi
  PF.tree(ctx, 50, 130);
  PF.tree(ctx, 350, 130);

  // Lampioni
  PF.lamp(ctx, 80, 180);
  PF.lamp(ctx, 320, 180);
}

const PoliziaArea = {
  name: 'Stazione di Polizia',
  walkableTop: 95,
  colliders: [
    { x: 100, y: 25, w: 200, h: 95 },
    { x: 280, y: 140, w: 60, h: 35 },
  ],
  npcs: [{ id: 'neri', x: 200, y: 175 }],
  exits: [{ dir: 'up', xRange: [170, 230], to: 'industriale', spawnX: 200, spawnY: 210 }],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawPoliceArea(ctx, t);
    drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PoliziaArea;
} else if (typeof window !== 'undefined') {
  window.PoliziaArea = PoliziaArea;
}
