/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: CASCINA INTERNO
 * Stanza di Teresa — Luce calda, icone sacre, letto, comodino
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.drawVignette */

export function drawCascinaInternoArea(ctx, t) {
  var _PAL = window.PALETTE;

  // Sfondo caldo
  ctx.fillStyle = '#1C1610';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Pareti in intonaco crepato
  ctx.fillStyle = '#2A241C';
  ctx.fillRect(0, 0, CANVAS_W, 120);
  for (var p = 0; p < 8; p++) {
    ctx.fillStyle = p % 2 === 0 ? '#2A241C' : '#302820';
    ctx.fillRect(p * 50, 0, 50, 120);
    ctx.strokeStyle = '#1C1610';
    ctx.lineWidth = 1;
    ctx.strokeRect(p * 50 + 1, 1, 48, 118);
  }

  // Finestra con tenda (fondo)
  ctx.fillStyle = '#1A2840';
  ctx.fillRect(170, 15, 60, 45);
  ctx.strokeStyle = '#3E2723';
  ctx.lineWidth = 2;
  ctx.strokeRect(170, 15, 60, 45);
  // Croce sulla finestra
  ctx.beginPath();
  ctx.moveTo(200, 15);
  ctx.lineTo(200, 60);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(170, 37);
  ctx.lineTo(230, 37);
  ctx.stroke();
  // Tenda
  ctx.fillStyle = '#8B7D6B';
  ctx.fillRect(168, 13, 64, 10);
  ctx.fillStyle = '#6B5B4F';
  ctx.fillRect(168, 50, 32, 12);
  ctx.fillRect(200, 50, 32, 12);

  // Letto (destra)
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(300, 55, 80, 55);
  ctx.fillStyle = '#5D4037';
  ctx.fillRect(302, 57, 76, 8);
  // Coperte
  ctx.fillStyle = '#8B7D6B';
  ctx.fillRect(305, 65, 70, 40);
  ctx.fillStyle = '#6B5B4F';
  ctx.fillRect(310, 70, 60, 30);
  // Cuscino
  ctx.fillStyle = '#E8DCC8';
  ctx.fillRect(305, 58, 30, 10);

  // Comodino (vicino al letto)
  ctx.fillStyle = '#4E342E';
  ctx.fillRect(290, 75, 10, 30);
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(288, 75, 14, 3);
  // Candela sul comodino
  var flicker = 0.5 + Math.sin(t * 7) * 0.25;
  ctx.fillStyle = '#E8DCC8';
  ctx.fillRect(294, 70, 2, 6);
  ctx.fillStyle = `rgba(255,200,100,${flicker})`;
  ctx.beginPath();
  ctx.arc(295, 68, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `rgba(255,180,80,${flicker * 0.2})`;
  ctx.beginPath();
  ctx.arc(295, 68, 15, 0, Math.PI * 2);
  ctx.fill();

  // Icona sacra al muro
  ctx.fillStyle = '#D4A843';
  ctx.fillRect(40, 15, 20, 28);
  ctx.fillStyle = '#4A3428';
  ctx.fillRect(42, 17, 16, 24);
  ctx.fillStyle = '#D4A843';
  ctx.font = '8px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('☧', 50, 33);
  ctx.textAlign = 'start';

  // Sedia vicino al letto
  ctx.fillStyle = '#4E342E';
  ctx.fillRect(280, 85, 14, 20);
  ctx.fillRect(276, 85, 22, 3);
  ctx.fillRect(276, 100, 22, 5);

  // Cassapanca (sinistra)
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(80, 85, 50, 30);
  ctx.fillStyle = '#4E342E';
  ctx.fillRect(82, 88, 46, 5);
  ctx.fillStyle = '#D4A843';
  ctx.fillRect(95, 97, 20, 2);

  // Foto incorniciata sulla cassapanca
  ctx.fillStyle = '#A0A8B0';
  ctx.fillRect(105, 75, 14, 12);
  ctx.fillStyle = '#E8DCC8';
  ctx.fillRect(107, 77, 10, 8);

  // Pavimento in assi di legno
  for (var row = 0; row < 5; row++) {
    for (var col = 0; col < 10; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? '#2A1F15' : '#35281C';
      ctx.fillRect(col * 40 + (row % 2) * 20, 120 + row * 26, 38, 26);
    }
  }

  // Tappeto tessuto (centro stanza)
  ctx.fillStyle = 'rgba(139,125,107,0.3)';
  ctx.fillRect(140, 140, 120, 50);
  ctx.fillStyle = 'rgba(180,160,140,0.2)';
  ctx.fillRect(150, 148, 100, 34);
  // Pattern geometrico tappeto
  ctx.fillStyle = 'rgba(212,168,67,0.15)';
  ctx.fillRect(155, 153, 90, 1);
  ctx.fillRect(155, 163, 90, 1);
  ctx.fillRect(155, 173, 90, 1);
  ctx.fillRect(180, 148, 1, 34);
  ctx.fillRect(220, 148, 1, 34);

  // Luce calda ambiente
  var amb = ctx.createRadialGradient(295, 68, 5, 295, 68, 300);
  amb.addColorStop(0, `rgba(255,180,80,${0.1 + Math.sin(t * 3) * 0.03})`);
  amb.addColorStop(0.4, 'rgba(200,120,50,0.04)');
  amb.addColorStop(1, 'transparent');
  ctx.fillStyle = amb;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

const CascinaInternoArea = {
  name: 'Stanza di Teresa',
  walkableTop: 55,
  colliders: [
    { x: 300, y: 55, w: 80, h: 55 }, // Letto
    { x: 80, y: 85, w: 50, h: 30 }, // Cassapanca
    { x: 280, y: 85, w: 36, h: 20 }, // Sedia+comodino
  ],
  npcs: [{ id: 'teresa', x: 200, spawnY: 160 }],
  exits: [{ dir: 'down', xRange: [175, 225], to: 'cascina', spawnX: 300, spawnY: 140 }],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawCascinaInternoArea(ctx, t);
    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CascinaInternoArea;
} else if (typeof window !== 'undefined') {
  window.CascinaInternoArea = CascinaInternoArea;
}
