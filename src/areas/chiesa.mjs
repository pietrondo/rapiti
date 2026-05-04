/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: CHIESA
 * Chiesa di San Celeste — Interno Gotico-Rurale 1978
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.drawVignette */

export function drawChurchArea(ctx, t) {
  var PAL = window.PALETTE;

  // Sfondo interno scuro
  ctx.fillStyle = '#0E1016';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Pareti in pietra
  ctx.fillStyle = '#2A2D35';
  ctx.fillRect(0, 0, CANVAS_W, 130);
  for (var p = 0; p < 8; p++) {
    ctx.fillStyle = p % 2 === 0 ? '#333840' : '#2A2D35';
    ctx.fillRect(p * 50, 0, 50, 130);
    ctx.strokeStyle = '#1A1C20';
    ctx.lineWidth = 1;
    ctx.strokeRect(p * 50 + 2, 2, 46, 126);
  }

  // Vetrate gotiche (finestre colorate)
  var glow1 = 0.45 + Math.sin(t * 1.5) * 0.12;
  var glow2 = 0.45 + Math.sin(t * 1.5 + 1) * 0.12;
  function drawVetrata(vx, vy, vw, vh, hue, glow) {
    ctx.fillStyle = '#1A1C20';
    ctx.fillRect(vx, vy, vw, vh);
    ctx.fillStyle = `rgba(${hue},${glow * 0.6})`;
    ctx.beginPath();
    ctx.arc(vx + vw/2, vy + 8, 8, 0, Math.PI, true);
    ctx.fill();
    ctx.fillStyle = `rgba(${hue + 30},${glow * 0.4})`;
    ctx.fillRect(vx + 5, vy + 18, vw - 10, vh - 22);
    ctx.strokeStyle = '#2A2D35';
    ctx.lineWidth = 2;
    ctx.strokeRect(vx, vy, vw, vh);
    ctx.beginPath(); ctx.moveTo(vx + vw/2, vy); ctx.lineTo(vx + vw/2, vy + vh); ctx.stroke();
  }
  drawVetrata(30, 15, 35, 55, 200, glow1);       // Blu
  drawVetrata(95, 15, 35, 55, 180, glow2);       // Ciano
  drawVetrata(335, 15, 35, 55, 220, glow2);       // Viola
  drawVetrata(270, 15, 35, 55, 200, glow1);       // Blu

  // Rosone centrale (sopra l'altare)
  ctx.fillStyle = `rgba(212,168,67,${0.35 + Math.sin(t * 2) * 0.1})`;
  ctx.beginPath();
  ctx.arc(200, 25, 20, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1A1C20';
  ctx.lineWidth = 2; ctx.stroke();
  for (var r = 0; r < 8; r++) {
    ctx.beginPath();
    ctx.moveTo(200, 25);
    ctx.lineTo(200 + Math.cos(r * Math.PI / 4) * 20, 25 + Math.sin(r * Math.PI / 4) * 20);
    ctx.stroke();
  }

  // Altare con croce
  ctx.fillStyle = '#2E1F18';
  ctx.fillRect(160, 45, 80, 55);
  ctx.fillStyle = '#4E342E';
  ctx.fillRect(163, 48, 74, 4);
  // Croce
  ctx.fillStyle = '#8B7355';
  ctx.fillRect(197, 15, 6, 35);
  ctx.fillRect(188, 22, 24, 4);
  // Candele sull'altare
  var flicker1 = 0.6 + Math.sin(t * 7) * 0.2;
  var flicker2 = 0.6 + Math.sin(t * 7 + 2) * 0.2;
  ctx.fillStyle = '#E8DCC8';
  ctx.fillRect(173, 38, 3, 10);
  ctx.fillRect(224, 38, 3, 10);
  ctx.fillStyle = `rgba(255,200,100,${flicker1})`;
  ctx.beginPath(); ctx.arc(174, 36, 3, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = `rgba(255,200,100,${flicker2})`;
  ctx.beginPath(); ctx.arc(225, 36, 3, 0, Math.PI * 2); ctx.fill();
  // Tovaglia altare
  ctx.fillStyle = '#E8DCC8';
  ctx.fillRect(162, 50, 76, 8);
  ctx.fillStyle = '#D4A843';
  ctx.fillRect(166, 51, 68, 1);

  // Banchi in legno (navata)
  for (var b = 0; b < 4; b++) {
    var bx = 100 + b * 60;
    ctx.fillStyle = '#3E2723';
    ctx.fillRect(bx, 110, 40, 20);
    ctx.fillStyle = '#4E342E';
    ctx.fillRect(bx, 110, 40, 3);
    ctx.fillStyle = '#2E1F18';
    ctx.fillRect(bx, 125, 40, 5);
  }

  // Acquasantiera (sinistra)
  ctx.fillStyle = '#455A64';
  ctx.fillRect(18, 110, 16, 18);
  ctx.fillStyle = '#37474F';
  ctx.fillRect(20, 112, 12, 14);
  ctx.fillStyle = '#89CFF0';
  ctx.fillRect(22, 116, 8, 6);

  // Confessionale (destra)
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(340, 50, 40, 55);
  ctx.fillStyle = '#2E1F18';
  ctx.fillRect(344, 54, 14, 47);
  ctx.fillRect(362, 54, 14, 47);
  ctx.fillStyle = '#D4A843';
  ctx.fillRect(357, 70, 6, 10);

  // Pavimento in pietra
  for (var row = 0; row < 5; row++) {
    for (var col = 0; col < 10; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? '#37474F' : '#455A64';
      ctx.fillRect(col * 40 + (row % 2) * 20, 130 + row * 24, 38, 24);
    }
  }

  // Luce calda ambientale (candele + rosone)
  var amb = ctx.createRadialGradient(200, 80, 20, 200, 80, 300);
  amb.addColorStop(0, `rgba(255,210,140,${0.08 + Math.sin(t * 1.5) * 0.02})`);
  amb.addColorStop(0.5, 'rgba(200,150,80,0.03)');
  amb.addColorStop(1, 'transparent');
  ctx.fillStyle = amb;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Luce rosone dall'alto
  var rose = ctx.createRadialGradient(200, 25, 5, 200, 25, 100);
  rose.addColorStop(0, `rgba(212,168,67,${0.12 + Math.sin(t * 2) * 0.04})`);
  rose.addColorStop(1, 'transparent');
  ctx.fillStyle = rose;
  ctx.fillRect(100, 0, 200, 130);
}

const ChiesaArea = {
  name: 'Chiesa di San Celeste',
  walkableTop: 60,
  colliders: [
    { x: 170, y: 55, w: 60, h: 50 }, // Altare (centrale, lascia passaggio ai lati)
    { x: 120, y: 110, w: 160, h: 22 }, // Banchi (blocco centrale navata)
  ],
  npcs: [{ id: 'don_pietro', x: 215, y: 160 }],
  exits: [
    { dir: 'up', xRange: [30, 80], to: 'cimitero', spawnX: 200, spawnY: 112 },
    { dir: 'down', xRange: [150, 250], to: 'piazze', spawnX: 200, spawnY: 155 },
  ],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawChurchArea(ctx, t);
    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ChiesaArea;
} else if (typeof window !== 'undefined') {
  window.ChiesaArea = ChiesaArea;
}
