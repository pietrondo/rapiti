/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: CASCINA DEI BELLANDI
 * Cascina — Esterno rurale, portone con simboli, aia
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.drawVignette, window.PF */

export function drawCascinaArea(ctx, t) {
  var _PAL = window.PALETTE;

  // Cielo rurale (crepuscolo)
  var skyGrad = ctx.createLinearGradient(0, 0, 0, 200);
  skyGrad.addColorStop(0, '#0D1525');
  skyGrad.addColorStop(0.5, '#1A2840');
  skyGrad.addColorStop(1, '#2A3A50');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Stelle
  ctx.fillStyle = '#E8DCC8';
  for (var s = 0; s < 25; s++) {
    ctx.globalAlpha = 0.15 + Math.random() * 0.25;
    ctx.fillRect(Math.random() * CANVAS_W, Math.random() * 70, 1, 1);
  }
  ctx.globalAlpha = 1;

  // Luna crescente
  ctx.fillStyle = 'rgba(180,200,220,0.2)';
  ctx.beginPath();
  ctx.arc(320, 30, 28, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(220,235,255,0.5)';
  ctx.beginPath();
  ctx.arc(316, 28, 12, 0, Math.PI * 2);
  ctx.fill();

  // Terreno
  ctx.fillStyle = '#1E2C14';
  ctx.fillRect(0, 70, CANVAS_W, 180);

  // Strada sterrata
  ctx.fillStyle = '#3A3028';
  ctx.fillRect(160, 70, 60, 180);
  for (var st = 0; st < 15; st++) {
    ctx.fillStyle = st % 3 === 0 ? '#4A3C30' : '#363028';
    ctx.fillRect(165 + ((st * 8) % 50), 72 + st * 12, 6, 3);
  }

  // Cascina (edificio principale a destra)
  ctx.fillStyle = '#3A2E25';
  ctx.fillRect(230, 20, 140, 90);
  ctx.fillStyle = '#4F3428';
  ctx.fillRect(235, 24, 130, 82);
  // Tetto
  ctx.fillStyle = '#5C3A2E';
  ctx.beginPath();
  ctx.moveTo(225, 25);
  ctx.lineTo(300, -5);
  ctx.lineTo(375, 25);
  ctx.fill();
  ctx.strokeStyle = '#3A2015';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(225, 25);
  ctx.lineTo(300, -5);
  ctx.lineTo(375, 25);
  ctx.stroke();
  // Portone con simboli
  ctx.fillStyle = '#2E1F18';
  ctx.fillRect(275, 50, 50, 60);
  ctx.beginPath();
  ctx.arc(300, 80, 24, Math.PI, 0);
  ctx.fill();
  // Simboli sul portone (dorati, incisi)
  var symAlpha = 0.45 + Math.sin(t * 1.5) * 0.12;
  ctx.fillStyle = `rgba(212,168,67,${symAlpha})`;
  ctx.font = '14px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('⊕', 300, 70);
  ctx.fillText('⊜', 300, 88);
  ctx.textAlign = 'start';
  // Finestre illuminate
  ctx.fillStyle = '#D4A843';
  ctx.globalAlpha = 0.5 + Math.sin(t * 3) * 0.15;
  ctx.fillRect(250, 40, 12, 14);
  ctx.fillRect(338, 40, 12, 14);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(251, 41, 10, 12);
  ctx.fillRect(339, 41, 10, 12);

  // Fienile (sinistra)
  ctx.fillStyle = '#2E251D';
  ctx.fillRect(10, 30, 55, 70);
  ctx.fillStyle = '#3D2E22';
  ctx.fillRect(14, 34, 47, 62);
  ctx.fillStyle = '#4F3428';
  ctx.beginPath();
  ctx.moveTo(5, 30);
  ctx.lineTo(37, 8);
  ctx.lineTo(70, 30);
  ctx.fill();
  // Porta fienile aperta
  ctx.fillStyle = '#1A1815';
  ctx.fillRect(30, 50, 20, 40);

  // Albero secolare (sinistra)
  ctx.fillStyle = '#2A1F15';
  ctx.fillRect(368, 50, 10, 55);
  ctx.fillStyle = '#1A2E12';
  ctx.beginPath();
  ctx.arc(373, 45, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2B4426';
  ctx.beginPath();
  ctx.arc(363, 35, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.arc(383, 38, 16, 0, Math.PI * 2);
  ctx.fill();

  // Pozzo (davanti)
  ctx.fillStyle = '#4A4A50';
  ctx.fillRect(170, 140, 28, 16);
  ctx.fillStyle = '#3A3A40';
  ctx.fillRect(172, 142, 24, 12);
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(178, 144, 12, 8);
  // Tettoia pozzo
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(165, 130, 38, 5);
  ctx.fillStyle = '#5C3A2E';
  ctx.beginPath();
  ctx.moveTo(165, 130);
  ctx.lineTo(184, 118);
  ctx.lineTo(203, 130);
  ctx.fill();
  // Ripple nell'acqua
  var ripple = Math.sin(t * 4) * 2;
  ctx.fillStyle = `rgba(140,180,220,${0.3 + Math.sin(t * 3) * 0.1})`;
  ctx.fillRect(182, 148 + ripple, 4, 2);

  // Palo della luce
  ctx.fillStyle = '#2A2D35';
  ctx.fillRect(385, 28, 4, 85);
  ctx.fillStyle = `rgba(255,200,100,${0.4 + Math.sin(t * 5) * 0.2})`;
  ctx.beginPath();
  ctx.arc(387, 28, 6, 0, Math.PI * 2);
  ctx.fill();

  // Erba/texture terreno
  for (var g = 0; g < 50; g++) {
    ctx.fillStyle = g % 3 === 0 ? '#2B3A20' : '#1E2C14';
    ctx.fillRect(g * 8, 190 + (g % 3) * 3, 5, 12 + (g % 3) * 4);
  }

  // Luce ambiente calda dalla cascina
  var amb = ctx.createRadialGradient(300, 60, 10, 300, 60, 200);
  amb.addColorStop(0, `rgba(255,200,120,${0.08 + Math.sin(t * 2) * 0.02})`);
  amb.addColorStop(0.5, 'rgba(200,130,60,0.03)');
  amb.addColorStop(1, 'transparent');
  ctx.fillStyle = amb;
  ctx.fillRect(150, 0, 250, 200);
}

const CascinaArea = {
  name: 'Cascina dei Bellandi',
  walkableTop: 70,
  colliders: [
    { x: 230, y: 20, w: 140, h: 90 }, // Cascina edificio
    { x: 10, y: 30, w: 55, h: 70 }, // Fienile
    { x: 368, y: 50, w: 10, h: 55 }, // Albero
    { x: 170, y: 130, w: 28, h: 26 }, // Pozzo
    { x: 385, y: 28, w: 4, h: 85 }, // Palo luce
  ],
  npcs: [],
  exits: [
    { dir: 'down', xRange: [170, 230], to: 'giardini', spawnX: 200, spawnY: 200 },
    {
      dir: 'up',
      xRange: [280, 320],
      to: 'cascina_interno',
      spawnX: 200,
      spawnY: 200,
      requiresInteract: true,
    },
    { dir: 'left', xRange: [0, 40], to: 'fienile', spawnX: 350, spawnY: 130 },
  ],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawCascinaArea(ctx, t);
    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CascinaArea;
} else if (typeof window !== 'undefined') {
  window.CascinaArea = CascinaArea;
}
