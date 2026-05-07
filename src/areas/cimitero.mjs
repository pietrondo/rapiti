/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: CIMITERO
 * Cimitero Comunale — Atmosfera gotica, nebbia, lapidi antiche
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.PF, window.drawVignette */

export function drawCemeteryArea(ctx, t) {
  var _PAL = window.PALETTE;

  // Cielo notturno cupo
  ctx.fillStyle = '#06090F';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Stelle fioche
  ctx.fillStyle = '#E8DCC8';
  for (var s = 0; s < 30; s++) {
    ctx.globalAlpha = 0.15 + Math.random() * 0.2;
    ctx.fillRect(Math.random() * CANVAS_W, Math.random() * 60, 1, 1);
  }
  ctx.globalAlpha = 1;

  // Luna velata
  ctx.fillStyle = 'rgba(180,200,220,0.2)';
  ctx.beginPath();
  ctx.arc(60, 20, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(220,235,255,0.5)';
  ctx.beginPath();
  ctx.arc(60, 20, 10, 0, Math.PI * 2);
  ctx.fill();

  // Terreno erba scura
  ctx.fillStyle = '#1A2416';
  ctx.fillRect(0, 75, CANVAS_W, 175);

  // Mura di cinta in pietra
  ctx.fillStyle = '#2A2D35';
  ctx.fillRect(0, 75, 18, 175);
  ctx.fillRect(CANVAS_W - 18, 75, 18, 175);
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(0, 75, 18, 2);
  ctx.fillRect(CANVAS_W - 18, 75, 18, 2);

  // Cancello in ferro battuto (centro in alto)
  ctx.strokeStyle = '#1A1C20';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#2A2D35';
  ctx.fillRect(175, 72, 50, 8);
  for (var gx = 180; gx < 220; gx += 6) {
    ctx.beginPath();
    ctx.moveTo(gx, 75);
    ctx.lineTo(gx + 3, 65);
    ctx.stroke();
  }
  ctx.fillStyle = '#D4A843';
  ctx.fillRect(196, 68, 8, 2);

  // Lapidi con nomi e date
  var graves = [
    { x: 50, y: 105, w: 22, h: 34, name: 'ROSSI', year: '1901' },
    { x: 100, y: 120, w: 18, h: 28, name: 'BIANCHI', year: '1923' },
    { x: 160, y: 98, w: 24, h: 38, name: 'FERRARI', year: '1889' },
    { x: 230, y: 115, w: 18, h: 30, name: 'MORETTI', year: '1945' },
    { x: 290, y: 108, w: 20, h: 32, name: 'COLOMBO', year: '1912' },
    { x: 70, y: 165, w: 16, h: 24, name: 'RICCI', year: '1958' },
    { x: 140, y: 170, w: 18, h: 28, name: 'GRECO', year: '1936' },
    { x: 250, y: 162, w: 20, h: 30, name: 'ESPOSITO', year: '1961' },
    { x: 320, y: 155, w: 16, h: 26, name: 'RUSSO', year: '1940' },
  ];

  for (var i = 0; i < graves.length; i++) {
    var g = graves[i];
    ctx.fillStyle = '#4A4A50';
    ctx.beginPath();
    ctx.roundRect(g.x, g.y, g.w, g.h, [g.w / 3, g.w / 3, 0, 0]);
    ctx.fill();
    ctx.fillStyle = '#5A5A60';
    ctx.fillRect(g.x + 2, g.y + 2, g.w - 4, g.h - 4);
    // Muschio
    ctx.fillStyle = 'rgba(20,40,10,0.4)';
    ctx.fillRect(g.x + 2, g.y + g.h - 8, g.w - 4, 6);
    // Nome e anno
    ctx.fillStyle = 'rgba(180,170,160,0.7)';
    ctx.font = '5px "Courier New",monospace';
    ctx.textAlign = 'center';
    ctx.fillText(g.name, g.x + g.w / 2, g.y + 10);
    ctx.fillText(g.year, g.x + g.w / 2, g.y + 18);
    ctx.textAlign = 'start';
  }

  // Mausoleo Famiglia Bellandi
  ctx.fillStyle = '#2E2E35';
  ctx.fillRect(280, 75, 50, 55);
  ctx.fillStyle = '#353540';
  ctx.beginPath();
  ctx.moveTo(275, 75);
  ctx.lineTo(305, 50);
  ctx.lineTo(335, 75);
  ctx.fill();
  // Porta mausoleo
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(295, 100, 20, 30);
  ctx.beginPath();
  ctx.arc(305, 115, 10, Math.PI, 0);
  ctx.fill();
  // Iscrizione
  ctx.fillStyle = '#D4A843';
  ctx.font = '5px "Courier New",monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BELLANDI', 305, 88);
  ctx.fillText('1861 - 1978', 305, 96);
  ctx.textAlign = 'start';

  // Cipressi
  function drawCypress(cx, cy, ch) {
    ctx.fillStyle = '#1A2411';
    ctx.fillRect(cx - 3, cy, 6, ch);
    ctx.fillStyle = '#1F2E12';
    ctx.beginPath();
    ctx.moveTo(cx, cy - ch * 0.6);
    ctx.lineTo(cx + 8, cy + ch * 0.3);
    ctx.lineTo(cx - 8, cy + ch * 0.3);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(cx, cy - ch * 0.3);
    ctx.lineTo(cx + 10, cy + ch * 0.5);
    ctx.lineTo(cx - 10, cy + ch * 0.5);
    ctx.fill();
  }
  drawCypress(35, 85, 50);
  drawCypress(55, 95, 40);
  drawCypress(365, 85, 55);
  drawCypress(345, 100, 40);

  // Lanterne con luce tremolante
  var f1 = 0.5 + Math.sin(t * 6) * 0.2;
  var f2 = 0.5 + Math.sin(t * 6 + 2) * 0.2;
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(118, 195, 4, 20);
  ctx.fillRect(278, 195, 4, 20);
  ctx.fillStyle = `rgba(255,200,100,${f1})`;
  ctx.beginPath();
  ctx.arc(120, 194, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `rgba(255,200,100,${f2})`;
  ctx.beginPath();
  ctx.arc(280, 194, 5, 0, Math.PI * 2);
  ctx.fill();
  // Alone lanterne
  ctx.fillStyle = `rgba(255,200,100,${f1 * 0.15})`;
  ctx.beginPath();
  ctx.arc(120, 194, 25, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `rgba(255,200,100,${f2 * 0.15})`;
  ctx.beginPath();
  ctx.arc(280, 194, 25, 0, Math.PI * 2);
  ctx.fill();

  // Nebbia ground-level
  var fog = 0.35 + Math.sin(t * 0.8) * 0.1;
  var fogGrad = ctx.createLinearGradient(0, 160, 0, CANVAS_H);
  fogGrad.addColorStop(0, 'transparent');
  fogGrad.addColorStop(0.6, `rgba(160,180,200,${fog * 0.3})`);
  fogGrad.addColorStop(1, `rgba(160,180,200,${fog * 0.5})`);
  ctx.fillStyle = fogGrad;
  ctx.fillRect(0, 160, CANVAS_W, 90);

  // Nebbia fluttuante
  for (var m = 0; m < 4; m++) {
    var mx = ((t * 15 + m * 80) % (CANVAS_W + 80)) - 40;
    var ma = 0.08 + Math.sin(t * 2 + m) * 0.04;
    ctx.fillStyle = `rgba(180,190,210,${ma})`;
    ctx.fillRect(mx, 170 + m * 12, 60, 20);
  }
}

const CimiteroArea = {
  name: 'Cimitero Comunale',
  walkableTop: 80,
  colliders: [],
  npcs: [],
  exits: [{ dir: 'down', xRange: [170, 230], to: 'chiesa', spawnX: 200, spawnY: 210 }],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawCemeteryArea(ctx, t);
    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = CimiteroArea;
} else if (typeof window !== 'undefined') {
  window.CimiteroArea = CimiteroArea;
}
