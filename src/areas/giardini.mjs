/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: GIARDINI
 * Giardini Pubblici — Oasi di pace nel borgo
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.PF, window.drawVignette */

export function drawGardensArea(ctx, t) {
  var _PAL = window.PALETTE;

  window.PF.nightSky(ctx, 10);
  window.PF.mountains(ctx);

  // Prato base
  ctx.fillStyle = '#253815';
  ctx.fillRect(0, 90, CANVAS_W, 160);

  // Sentieri di ghiaia
  ctx.fillStyle = '#5A5045';
  ctx.fillRect(0, 148, CANVAS_W, 8);
  ctx.fillRect(0, 198, CANVAS_W, 6);
  ctx.fillStyle = '#6A6055';
  for (var g = 0; g < 40; g++) {
    ctx.fillRect(g * 10 + 3, 149, 4, 2);
  }

  // Aiuole laterali
  ctx.fillStyle = '#1A2A0E';
  ctx.fillRect(0, 90, 20, 160);
  ctx.fillRect(CANVAS_W - 20, 90, 20, 160);

  // Fontana centrale (più dettagliata)
  ctx.fillStyle = '#455A64';
  ctx.fillRect(175, 145, 50, 12); // Base
  ctx.fillStyle = '#546E7A';
  ctx.fillRect(180, 145, 40, 3);
  ctx.fillStyle = '#37474F';
  ctx.fillRect(195, 130, 10, 15); // Colonna
  ctx.fillRect(190, 128, 20, 4); // Capitello
  // Acqua
  var waterAlpha = 0.4 + Math.sin(t * 4) * 0.15;
  ctx.fillStyle = `rgba(130,200,220,${waterAlpha})`;
  ctx.fillRect(180, 152, 40, 6);
  // Gocce
  for (var d = 0; d < 4; d++) {
    var dy = (t * 30 + d * 20) % 20;
    var da = 0.3 + Math.sin(t * 5 + d) * 0.1;
    ctx.fillStyle = `rgba(180,220,240,${da})`;
    ctx.fillRect(194 + d * 4 - 2, 125 + dy, 2, 3);
  }

  // Statua in pietra (ninfa)
  ctx.fillStyle = '#78909C';
  ctx.fillRect(70, 100, 8, 40);
  ctx.fillStyle = '#90A4AE';
  ctx.fillRect(66, 105, 16, 8);
  ctx.fillStyle = '#B0BEC5';
  ctx.beginPath();
  ctx.arc(74, 98, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillRect(68, 90, 4, 10);

  // Alberi e arbusti decorativi
  window.PF.tree(ctx, 30, 118);
  window.PF.tree(ctx, 360, 125);
  window.PF.tree(ctx, 140, 200);
  window.PF.tree(ctx, 310, 195);

  // Cespugli fioriti
  function drawBush(bx, by, hue) {
    ctx.fillStyle = '#2A3A1A';
    ctx.fillRect(bx, by, 14, 10);
    ctx.fillStyle = `hsl(${hue},70%,60%)`;
    ctx.beginPath();
    ctx.arc(bx + 7, by + 3, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bx + 3, by + 5, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bx + 11, by + 5, 4, 0, Math.PI * 2);
    ctx.fill();
  }
  drawBush(45, 155, 0);
  drawBush(85, 180, 40);
  drawBush(320, 160, 300);
  drawBush(360, 182, 20);

  // Aiuole fiorite
  var flowers = [
    { x: 110, y: 140, c: '#FF6B6B' },
    { x: 130, y: 150, c: '#FFE66D' },
    { x: 260, y: 142, c: '#4ECDC4' },
    { x: 280, y: 152, c: '#FF6B6B' },
    { x: 115, y: 165, c: '#A78BFA' },
    { x: 275, y: 168, c: '#FFE66D' },
  ];
  for (var fi = 0; fi < flowers.length; fi++) {
    var f = flowers[fi];
    ctx.fillStyle = f.c;
    ctx.beginPath();
    ctx.arc(f.x, f.y, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5C7A4B';
    ctx.fillRect(f.x - 1, f.y + 3, 2, 3);
  }

  // Panchina in ferro + Anselmo
  ctx.fillStyle = '#2A2A2A';
  ctx.fillRect(220, 165, 44, 3); // Seduta
  ctx.fillRect(222, 168, 3, 14); // Gamba SX
  ctx.fillRect(242, 163, 3, 19); // Gamba schienale
  ctx.fillRect(259, 168, 3, 14); // Gamba DX
  ctx.fillStyle = '#3A3A3A';
  ctx.fillRect(222, 156, 40, 3); // Schienale
  // Anselmo seduto
  ctx.fillStyle = '#6B5B4F';
  ctx.fillRect(230, 147, 8, 16);
  ctx.fillStyle = '#D4A843';
  ctx.fillRect(231, 145, 6, 4);
  ctx.fillStyle = '#3D3025';
  ctx.fillRect(231, 158, 3, 6);
  ctx.fillRect(236, 158, 3, 6);
  // Bastone
  ctx.fillStyle = '#8B7D6B';
  ctx.fillRect(239, 140, 2, 14);

  // Menta Selvatica
  if (window.gameState.cluesFound.indexOf('menta') === -1) {
    var mintPulse = 0.5 + Math.sin(t * 4) * 0.3;
    ctx.fillStyle = `rgba(100,220,150,${mintPulse})`;
    ctx.beginPath();
    ctx.arc(260, 192, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2D5A27';
    ctx.fillRect(258, 190, 4, 2);
  }

  // Lampioni
  window.PF.lamp(ctx, 38, 140);
  window.PF.lamp(ctx, 362, 160);
}

const GiardiniArea = {
  name: 'Giardini Pubblici',
  walkableTop: 90,
  colliders: [
    { x: 175, y: 130, w: 50, h: 10 }, // Fontana (colonna)
    { x: 70, y: 90, w: 14, h: 50 }, // Statua
    { x: 220, y: 156, w: 44, h: 3 }, // Panchina
  ],
  npcs: [{ id: 'anselmo', x: 235, y: 155 }],
  exits: [
    { dir: 'right', xRange: [100, 160], to: 'piazze', spawnX: 45, spawnY: 175 },
    {
      dir: 'left',
      xRange: [135, 205],
      to: 'campo',
      spawnX: 350,
      spawnY: 170,
      requiresFlag: 'deduction_complete',
    },
    { dir: 'up', xRange: [180, 220], to: 'cascina', spawnX: 200, spawnY: 200 },
  ],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawGardensArea(ctx, t);

    ctx.fillStyle = 'rgba(212,168,67,0.6)';
    ctx.beginPath();
    ctx.moveTo(395, 175);
    ctx.lineTo(390, 180);
    ctx.lineTo(390, 170);
    ctx.fill();
    ctx.font = 'bold 8px "Courier New", monospace';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'right';
    ctx.fillText('PIAZZA →', 385, 178);
    ctx.textAlign = 'left';
    ctx.fillText('← CAMPO', 14, 178);

    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = GiardiniArea;
} else if (typeof window !== 'undefined') {
  window.GiardiniArea = GiardiniArea;
}
