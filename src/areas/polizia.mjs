/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: POLIZIA
 * Stazione di Polizia — Esterno
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.PF, window.drawVignette */

export function drawPoliceArea(ctx, t) {
  var _PAL = window.PALETTE;

  window.PF.nightSky(ctx, 12, t);
  window.PF.mountains(ctx);

  // Antenna radio sul tetto
  ctx.fillStyle = '#555';
  ctx.fillRect(180, 5, 2, 28);
  ctx.fillStyle = '#D4A843';
  ctx.fillRect(178, 4, 6, 2);

  // Bandiera Italiana
  ctx.fillStyle = '#666';
  ctx.fillRect(50, 10, 2, 50);
  ctx.fillStyle = '#00853E';
  ctx.fillRect(52, 12, 10, 13);
  ctx.fillStyle = '#FFF';
  ctx.fillRect(62, 12, 10, 13);
  ctx.fillStyle = '#C83737';
  ctx.fillRect(72, 12, 10, 13);

  // Asfalto
  ctx.fillStyle = '#2A2D33';
  ctx.fillRect(0, 90, CANVAS_W, 160);
  ctx.fillStyle = '#333840';
  for (var i = 0; i < 8; i++) {
    ctx.fillRect(i * 50, 90, 2, 160);
  }

  // Edificio stazione
  ctx.fillStyle = '#3A3D45';
  ctx.fillRect(80, 30, 240, 80);
  ctx.fillStyle = '#2D3047';
  ctx.fillRect(80, 30, 240, 5);

  // Insegna "STAZIONE POLIZIA"
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(120, 34, 160, 18);
  ctx.fillStyle = '#D4A843';
  ctx.font = 'bold 10px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('STAZIONE POLIZIA', 200, 47);
  ctx.textAlign = 'start';

  // Finestre illuminate
  var glow = 0.45 + Math.sin(t * 2) * 0.08;
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(100, 60, 36, 30);
  ctx.fillRect(156, 60, 36, 30);
  ctx.fillRect(212, 60, 36, 30);
  ctx.fillRect(268, 60, 36, 30);
  ctx.fillStyle = `rgba(160,190,230,${glow})`;
  ctx.fillRect(103, 63, 30, 24);
  ctx.fillRect(159, 63, 30, 24);
  ctx.fillRect(215, 63, 30, 24);
  ctx.fillRect(271, 63, 30, 24);
  ctx.fillStyle = '#444';
  ctx.fillRect(118, 63, 1, 24);
  ctx.fillRect(174, 63, 1, 24);
  ctx.fillRect(230, 63, 1, 24);
  ctx.fillRect(286, 63, 1, 24);

  // Portone principale
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(186, 60, 28, 50);
  ctx.fillStyle = '#4A5568';
  ctx.fillRect(188, 62, 24, 48);
  ctx.fillStyle = '#D4A843';
  ctx.fillRect(198, 86, 4, 4);

  // Auto di pattuglia
  ctx.fillStyle = '#1A365D';
  ctx.fillRect(250, 130, 70, 35);
  ctx.fillStyle = '#2A5080';
  ctx.fillRect(252, 132, 66, 7);
  ctx.fillStyle = '#E8DCC8';
  ctx.fillRect(255, 134, 16, 14);
  ctx.fillRect(296, 134, 16, 14);
  ctx.fillStyle = '#333';
  ctx.fillRect(255, 160, 14, 8);
  ctx.fillRect(298, 160, 14, 8);
  // Lampeggiante
  var flash = Math.sin(t * 8) > 0;
  ctx.fillStyle = flash ? '#FF3333' : '#3355FF';
  ctx.fillRect(280, 128, 10, 4);

  // Moto di pattuglia (Guzzi 850, 1978)
  ctx.fillStyle = '#1A365D';
  ctx.fillRect(310, 170, 40, 22);
  ctx.fillStyle = '#444';
  ctx.fillRect(310, 188, 8, 8);
  ctx.fillRect(342, 188, 8, 8);
  // Faro
  ctx.fillStyle = '#D4A843';
  ctx.fillRect(348, 174, 4, 4);

  // Recinzione e sbarra
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 100, 40, 3);
  ctx.fillRect(360, 100, 40, 3);
  ctx.fillStyle = '#D4A843';
  ctx.fillRect(0, 100, 40, 1);
  ctx.fillRect(360, 100, 40, 1);

  // Recinzione e sbarra
  ctx.fillStyle = '#333';
  ctx.fillRect(0, 100, 40, 3);
  ctx.fillRect(360, 100, 40, 3);
  ctx.fillStyle = '#D4A843';
  ctx.fillRect(0, 100, 40, 1);
  ctx.fillRect(360, 100, 40, 1);
  // Sbarra mobile (rossa/bianca)
  ctx.fillStyle = '#CC4444';
  ctx.fillRect(0, 98, 45, 3);
  ctx.fillStyle = '#FFF';
  ctx.fillRect(10, 98, 8, 3);
  ctx.fillRect(26, 98, 8, 3);

  // Cartello PARCHEGGIO
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(12, 115, 30, 12);
  ctx.fillStyle = '#A0A8B0';
  ctx.font = '5px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PARCHEGGIO', 27, 124);
  ctx.textAlign = 'start';

  // Cartello "DIVIETO DI SOSTA"
  ctx.fillStyle = '#CC4444';
  ctx.fillRect(348, 118, 28, 12);
  ctx.fillStyle = '#FFF';
  ctx.font = '4px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('DIVIETO', 362, 125);
  ctx.fillText('DI SOSTA', 362, 129);
  ctx.textAlign = 'start';

  // Lampioni
  window.PF.lamp(ctx, 50, 130);
  window.PF.lamp(ctx, 370, 120);

  // Freccia USCITA (verso industriale, in alto)
  ctx.fillStyle = 'rgba(212,168,67,0.5)';
  ctx.beginPath();
  ctx.moveTo(200, 5);
  ctx.lineTo(205, 12);
  ctx.lineTo(195, 12);
  ctx.fill();
}

const PoliziaArea = {
  name: 'Stazione di Polizia',
  walkableTop: 90,
  colliders: [
    { x: 80, y: 30, w: 240, h: 80 }, // Edificio
  ],
  npcs: [{ id: 'neri', x: 150, y: 155 }],
  exits: [{ dir: 'up', xRange: [170, 230], to: 'industriale', spawnX: 200, spawnY: 210 }],

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
