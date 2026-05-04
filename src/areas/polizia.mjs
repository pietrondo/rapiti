/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: POLIZIA
 * Stazione di Polizia — Interno
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.PF, window.drawVignette */

export function drawPoliceArea(ctx, t) {
  var PAL = window.PALETTE;

  // Parete interna
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Muri
  ctx.fillStyle = '#2A2D35';
  ctx.fillRect(0, 0, CANVAS_W, 115);
  for (var p = 0; p < 8; p++) {
    ctx.fillStyle = p % 2 === 0 ? '#333840' : '#2A2D35';
    ctx.fillRect(p * 50, 0, 50, 115);
    ctx.strokeStyle = '#1A1C20';
    ctx.lineWidth = 1;
    ctx.strokeRect(p * 50 + 2, 2, 46, 111);
  }

  // Bacheca con avvisi
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(10, 10, 60, 80);
  ctx.fillStyle = '#E8DCC8';
  ctx.fillRect(14, 14, 52, 34);
  ctx.fillRect(14, 52, 52, 34);
  ctx.fillStyle = '#666';
  ctx.fillRect(18, 18, 44, 8);
  ctx.fillRect(18, 56, 40, 6);
  ctx.fillStyle = '#444';
  ctx.fillRect(18, 30, 30, 4);
  ctx.fillRect(18, 66, 35, 4);

  // Mappa sulla parete
  ctx.fillStyle = '#8B7D6B';
  ctx.fillRect(280, 15, 70, 50);
  ctx.fillStyle = '#E8DCC8';
  ctx.fillRect(284, 19, 62, 42);
  ctx.fillStyle = '#5C7A4B';
  ctx.fillRect(288, 26, 25, 18);
  ctx.fillStyle = '#4A5568';
  ctx.fillRect(320, 30, 22, 10);

  // Scrivania centrale
  ctx.fillStyle = '#4A5568';
  ctx.fillRect(140, 55, 120, 45);
  ctx.fillStyle = '#5C6A7E';
  ctx.fillRect(142, 60, 116, 4);
  // Documenti
  ctx.fillStyle = '#E8DCC8';
  ctx.fillRect(155, 50, 35, 5);
  ctx.fillRect(160, 46, 25, 4);
  ctx.fillStyle = '#A0A8B0';
  ctx.fillRect(240, 55, 8, 12);
  // Telefono
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(250, 52, 12, 8);

  // Sedia dietro scrivania
  ctx.fillStyle = '#2D3047';
  ctx.fillRect(188, 30, 24, 30);
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(194, 20, 12, 15);

  // Schedario metallico
  ctx.fillStyle = '#A0A8B0';
  ctx.fillRect(340, 20, 40, 80);
  for (var d = 0; d < 4; d++) {
    ctx.fillStyle = '#8B9098';
    ctx.fillRect(342, 22 + d * 18, 36, 3);
    ctx.fillStyle = '#D4A843';
    ctx.fillRect(374, 26 + d * 18, 4, 4);
  }

  // Orologio a muro
  ctx.fillStyle = '#E8DCC8';
  ctx.beginPath();
  ctx.arc(170, 18, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1A1C20';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(169, 13, 2, 5);
  ctx.fillRect(167, 17, 2, 2);

  // Pavimento in linoleum
  for (var row = 0; row < 5; row++) {
    for (var col = 0; col < 8; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? '#3A3D45' : '#444850';
      ctx.fillRect(col * 50, 115 + row * 27, 50, 27);
    }
  }

  // Luci fluorescenti
  var flicker = 0.85 + Math.sin(t * 5) * 0.08;
  ctx.fillStyle = `rgba(200,220,255,${flicker * 0.12})`;
  ctx.fillRect(0, 0, CANVAS_W, 115);
  ctx.fillStyle = '#E8DCC8';
  ctx.fillRect(80, 2, 60, 3);
  ctx.fillRect(260, 2, 60, 3);

  // Porta d'uscita (in basso al centro)
  ctx.fillStyle = '#2E1F18';
  ctx.fillRect(184, 96, 32, 24);
  ctx.fillStyle = '#4A5568';
  ctx.fillRect(186, 98, 28, 22);
  ctx.fillStyle = '#D4A843';
  ctx.fillRect(210, 108, 4, 4);
  ctx.fillStyle = 'rgba(212,168,67,0.5)';
  ctx.font = '6px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('USCITA', 200, 94);
  ctx.textAlign = 'start';

  // Insegna stazione
  ctx.fillStyle = '#1a365d';
  ctx.fillRect(120, 38, 160, 16);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 10px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('STAZIONE POLIZIA', 200, 50);
  ctx.textAlign = 'start';
}

const PoliziaArea = {
  name: 'Stazione di Polizia',
  walkableTop: 115,
  colliders: [
    { x: 140, y: 55, w: 120, h: 45 }, // Scrivania
    { x: 340, y: 20, w: 40, h: 80 }, // Schedario
    { x: 10, y: 10, w: 60, h: 80 }, // Bacheca
  ],
  npcs: [{ id: 'neri', x: 160, y: 140 }],
  exits: [{ dir: 'down', xRange: [170, 230], to: 'industriale', spawnX: 200, spawnY: 130 }],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawPoliceArea(ctx, t);
    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PoliziaArea;
} else if (typeof window !== 'undefined') {
  window.PoliziaArea = PoliziaArea;
}
