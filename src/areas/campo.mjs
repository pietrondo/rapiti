/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: CAMPO
 * Campo delle Luci — Area finale, cerchi nel grano, atmosfera mistica
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.PF, window.drawVignette */

export function drawCampoArea(ctx, t) {
  var PAL = window.PALETTE;

  // Cielo mistico (violaceo)
  var skyGrad = ctx.createLinearGradient(0, 0, 0, 90);
  skyGrad.addColorStop(0, '#0A0818');
  skyGrad.addColorStop(1, '#1A1430');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, CANVAS_W, 90);

  // Stelle brillanti
  ctx.fillStyle = '#E8DCC8';
  for (var s = 0; s < 50; s++) {
    ctx.globalAlpha = 0.2 + Math.random() * 0.6;
    ctx.fillRect(Math.random() * CANVAS_W, Math.random() * 70, 1 + Math.random(), 1 + Math.random());
  }
  ctx.globalAlpha = 1;

  // Luci aliene nel cielo (3 sfere pulsanti)
  for (var al = 0; al < 3; al++) {
    var ax = 120 + al * 90;
    var ay = 25 + Math.sin(t * 1.5 + al) * 10;
    var aa = 0.3 + Math.sin(t * 3 + al * 2) * 0.25;
    ctx.fillStyle = `rgba(150,200,255,${aa * 0.3})`;
    ctx.beginPath(); ctx.arc(ax, ay, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `rgba(200,230,255,${aa * 0.6})`;
    ctx.beginPath(); ctx.arc(ax, ay, 7, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `rgba(255,255,255,${aa})`;
    ctx.beginPath(); ctx.arc(ax, ay, 3, 0, Math.PI * 2); ctx.fill();
  }

  // Montagne scure
  ctx.fillStyle = '#0E0A18';
  ctx.beginPath();
  ctx.moveTo(0, 90); ctx.lineTo(80, 58); ctx.lineTo(180, 72); ctx.lineTo(300, 50); ctx.lineTo(400, 85); ctx.lineTo(400, 90); ctx.lineTo(0, 90);
  ctx.fill();

  // Campo di grano
  ctx.fillStyle = '#1E2E10';
  ctx.fillRect(0, 88, CANVAS_W, CANVAS_H - 88);

  // Strisce di grano ondeggianti
  for (var row = 0; row < 12; row++) {
    var ry = 92 + row * 12;
    var wave = Math.sin(t * 2 + row * 0.7) * 3;
    ctx.fillStyle = row % 3 === 0 ? '#3A5020' : '#2E4018';
    ctx.fillRect(0, ry + wave, CANVAS_W, 4);
  }

  // Steli di grano
  ctx.fillStyle = '#89A66C';
  for (var i = 0; i < 80; i++) {
    var gx = (i * 43 + 10) % CANVAS_W;
    var gy = 95 + ((i * 17) % 130);
    var sway = Math.sin(t * 3 + gx * 0.04) * 2;
    ctx.fillRect(gx + sway, gy, 1, 6);
    ctx.fillRect(gx + sway - 1, gy + 1, 2, 1);
  }

  // CERCHI NEL GRANO (animati, pulsanti)
  var circlePulse = 0.6 + Math.sin(t * 2.5) * 0.2;
  // Alone esterno
  ctx.fillStyle = `rgba(130,190,255,${circlePulse * 0.25})`;
  ctx.beginPath();
  ctx.ellipse(206, 156, 62 + Math.sin(t * 3) * 3, 26 + Math.sin(t * 2) * 2, 0, 0, Math.PI * 2);
  ctx.fill();
  // Cerchio esterno
  ctx.strokeStyle = `rgba(212,168,67,${circlePulse * 0.5})`;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(206, 156, 58, 24, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Cerchio medio
  ctx.strokeStyle = `rgba(212,168,67,${circlePulse * 0.6})`;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(206, 156, 34, 13, 0, 0, Math.PI * 2);
  ctx.stroke();
  // Cerchio interno
  ctx.strokeStyle = `rgba(255,220,150,${circlePulse * 0.7})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.ellipse(206, 156, 16, 6, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Punto centrale luminoso
  var coreGlow = 0.4 + Math.sin(t * 4) * 0.2;
  ctx.fillStyle = `rgba(200,220,255,${coreGlow})`;
  ctx.beginPath();
  ctx.arc(206, 156, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `rgba(255,255,255,${coreGlow + 0.2})`;
  ctx.beginPath();
  ctx.arc(206, 156, 2, 0, Math.PI * 2);
  ctx.fill();

  // Particelle dorate fluttuanti
  for (var p = 0; p < 15; p++) {
    var px = 160 + Math.sin(t * 2 + p * 0.8) * 50;
    var py = 130 + Math.cos(t * 1.5 + p * 0.6) * 40;
    var pa = 0.2 + Math.sin(t * 3 + p) * 0.15;
    ctx.fillStyle = `rgba(255,220,100,${pa})`;
    ctx.beginPath(); ctx.arc(px, py, 1.5, 0, Math.PI * 2); ctx.fill();
  }

  // Freccia uscita
  ctx.fillStyle = 'rgba(212,168,67,0.5)';
  ctx.beginPath();
  ctx.moveTo(395, 172); ctx.lineTo(390, 177); ctx.lineTo(390, 167); ctx.fill();
  ctx.font = 'bold 8px "Courier New", monospace';
  ctx.fillStyle = '#FFF';
  ctx.textAlign = 'right';
  ctx.fillText('GIARDINI →', 385, 175);
}

const CampoArea = {
  name: 'Campo delle Luci',
  walkableTop: 88,
  colliders: [],
  npcs: [{ id: 'teresa', x: 210, y: 180 }],
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
