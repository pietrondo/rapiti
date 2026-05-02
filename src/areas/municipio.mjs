/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: MUNICIPIO (INTERNO)
 * Sala d'attesa e ufficio del Sindaco
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.drawWallTexture, window.drawVignette */

export function drawMunicipioInternoArea(ctx, t) {
  // Sfondo scuro elegante
  ctx.fillStyle = '#1A1410';
  ctx.fillRect(0, 0, window.CANVAS_W, window.CANVAS_H);

  // Mura con pannelli di legno (boiserie)
  if (window.drawWallTexture) {
    window.drawWallTexture(ctx, 0, 0, window.CANVAS_W, 140, '#4E342E', 'rgba(0,0,0,0.2)');
  }

  // Pavimento in marmo lucido
  ctx.fillStyle = '#2A2A2A';
  ctx.fillRect(0, 140, window.CANVAS_W, 110);
  ctx.fillStyle = '#333';
  for (var i = 0; i < 5; i++) {
    ctx.fillRect(i * 100, 140, 2, 110);
    ctx.fillRect(0, 140 + i * 30, window.CANVAS_W, 1);
  }

  // Scrivania del Sindaco
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(120, 60, 160, 45);
  ctx.fillStyle = '#5D4037';
  ctx.fillRect(125, 65, 150, 5); // Piano scrivania

  // Bandiera Italiana e Europea
  ctx.fillStyle = '#555';
  ctx.fillRect(80, 20, 2, 80); // Asta
  ctx.fillStyle = '#00853E'; ctx.fillRect(82, 22, 10, 20);
  ctx.fillStyle = '#FFF'; ctx.fillRect(92, 22, 10, 20);
  ctx.fillStyle = '#C83737'; ctx.fillRect(102, 22, 10, 20);

  // Quadro del Presidente (Pertini, 1978)
  ctx.fillStyle = '#2A1A0A';
  ctx.fillRect(200, 20, 30, 35);
  ctx.fillStyle = '#E8DCC8';
  ctx.fillRect(203, 23, 24, 29);
  ctx.fillStyle = '#444';
  ctx.beginPath(); ctx.arc(215, 35, 6, 0, Math.PI * 2); ctx.fill(); // Sagoma generica

  // Tappeto Rosso
  ctx.fillStyle = '#8B0000';
  ctx.fillRect(100, 140, 200, 110);

  // Luci calde
  var pulse = Math.sin(t * 1.5) * 0.05;
  var grad = ctx.createRadialGradient(200, 80, 20, 200, 80, 200);
  grad.addColorStop(0, `rgba(255, 220, 150, ${0.15 + pulse})`);
  grad.addColorStop(1, 'transparent');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, window.CANVAS_W, window.CANVAS_H);
}

const MunicipioArea = {
  name: 'Municipio — Interno',
  walkableTop: 140, // Abbassato per permettere di avvicinarsi alla scrivania
  colliders: [
    { x: 120, y: 60, w: 160, h: 45 }, // Scrivania
  ],
  npcs: [{ id: 'ruggeri', x: 200, y: 135 }], // Alzato leggermente (dietro scrivania)
  exits: [
    { dir: 'down', xRange: [0, 400], to: 'piazze', spawnX: 200, spawnY: 150 }
  ],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawMunicipioInternoArea(ctx, t);
    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MunicipioArea;
} else if (typeof window !== 'undefined') {
  window.MunicipioArea = MunicipioArea;
}

