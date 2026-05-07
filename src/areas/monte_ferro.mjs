/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: STAZIONE RADIO MONTE FERRO
 * Stazione radar/radio militare in cima alla collina — Antenne, nebbia, registratore
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.drawVignette */

export function drawMonteFerroArea(ctx, t) {
  var _PAL = window.PALETTE;

  // Cielo notturno stellato
  ctx.fillStyle = '#020408';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.fillStyle = '#E8DCC8';
  for (var s = 0; s < 40; s++) {
    ctx.globalAlpha = 0.1 + Math.random() * 0.3;
    ctx.fillRect(Math.random() * CANVAS_W, Math.random() * 100, 1, 1);
  }
  ctx.globalAlpha = 1;

  // Luna
  ctx.fillStyle = 'rgba(180,200,220,0.2)';
  ctx.beginPath();
  ctx.arc(60, 25, 30, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(220,235,255,0.5)';
  ctx.beginPath();
  ctx.arc(60, 25, 10, 0, Math.PI * 2);
  ctx.fill();

  // Terreno collinare (erba scura)
  var hill = ctx.createLinearGradient(0, 130, 0, CANVAS_H);
  hill.addColorStop(0, '#1A2416');
  hill.addColorStop(0.5, '#1E2C14');
  hill.addColorStop(1, '#151F10');
  ctx.fillStyle = hill;
  ctx.fillRect(0, 130, CANVAS_W, 120);

  // Montagne sullo sfondo
  ctx.fillStyle = '#0D1520';
  ctx.beginPath();
  ctx.moveTo(0, 130);
  ctx.lineTo(60, 80);
  ctx.lineTo(140, 110);
  ctx.lineTo(220, 70);
  ctx.lineTo(300, 100);
  ctx.lineTo(380, 60);
  ctx.lineTo(400, 120);
  ctx.lineTo(400, 130);
  ctx.lineTo(0, 130);
  ctx.fill();

  // Edificio stazione radio (centro-destra)
  ctx.fillStyle = '#1E2030';
  ctx.fillRect(240, 90, 70, 45);
  ctx.fillStyle = '#2A2D38';
  ctx.fillRect(245, 94, 60, 36);
  // Tetto piatto
  ctx.fillStyle = '#181A24';
  ctx.fillRect(235, 88, 80, 5);
  // Porta
  ctx.fillStyle = '#1A1C24';
  ctx.fillRect(262, 110, 26, 25);
  ctx.fillStyle = '#D4A843';
  ctx.fillRect(283, 120, 3, 3);
  // Finestrella
  ctx.fillStyle = '#89CFF0';
  ctx.globalAlpha = 0.3;
  ctx.fillRect(250, 100, 10, 8);
  ctx.globalAlpha = 1;
  ctx.fillStyle = '#1A1C20';
  ctx.strokeRect(250, 100, 10, 8);

  // Antenna radio (sinistra edificio)
  ctx.strokeStyle = '#4A5568';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(245, 88);
  ctx.lineTo(245, 20);
  ctx.stroke();
  // Puntali antenna
  ctx.strokeStyle = '#A0A8B0';
  ctx.lineWidth = 1;
  for (var ai = 0; ai < 3; ai++) {
    ctx.beginPath();
    ctx.moveTo(245, 30 + ai * 20);
    ctx.lineTo(230, 20 + ai * 20);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(245, 30 + ai * 20);
    ctx.lineTo(260, 20 + ai * 20);
    ctx.stroke();
  }
  // Luce rossa in cima
  var blip = 0.5 + Math.sin(t * 4) * 0.5;
  ctx.fillStyle = `rgba(255,60,60,${blip})`;
  ctx.beginPath();
  ctx.arc(245, 20, 3, 0, Math.PI * 2);
  ctx.fill();

  // Generatore (a terra, sinistra)
  ctx.fillStyle = '#3A3A42';
  ctx.fillRect(50, 125, 30, 18);
  ctx.fillStyle = '#4A4A52';
  ctx.fillRect(52, 127, 26, 14);
  ctx.fillStyle = '#2A2D35';
  ctx.fillRect(55, 130, 20, 8);
  // Cavi dal generatore
  ctx.strokeStyle = '#555';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(65, 143);
  ctx.lineTo(90, 165);
  ctx.lineTo(250, 135);
  ctx.stroke();

  // Baracca/quaglia (estrema sinistra)
  ctx.fillStyle = '#2E3020';
  ctx.fillRect(5, 110, 35, 30);
  ctx.fillStyle = '#3A3C2A';
  ctx.fillRect(8, 113, 29, 24);
  ctx.fillStyle = '#1C1E14';
  ctx.fillRect(2, 107, 41, 6);

  // Nebbia/nubi basse
  for (var m = 0; m < 5; m++) {
    var mx = ((t * 10 + m * 70) % (CANVAS_W + 60)) - 30;
    var ma = 0.06 + Math.sin(t * 1.5 + m) * 0.03;
    ctx.fillStyle = `rgba(140,160,180,${ma})`;
    ctx.fillRect(mx, 115 + m * 8, 50, 12);
    ctx.fillRect(mx + 20, 112 + m * 8, 40, 10);
  }

  // Erba/texture terreno
  for (var g = 0; g < 50; g++) {
    ctx.fillStyle = g % 3 === 0 ? '#1A2416' : '#121C0E';
    ctx.fillRect(g * 8, 175 + (g % 3) * 3, 5, 12 + (g % 3) * 4);
  }

  // Sentiero sterrato per la stazione
  ctx.fillStyle = '#252218';
  ctx.fillRect(175, 200, 50, 50);
  for (var st = 0; st < 5; st++) {
    ctx.fillRect(180 + st * 8, 202 + st * 4, 6, 3);
  }

  // Luce ambiente dalla stazione
  var amb = ctx.createRadialGradient(275, 110, 5, 275, 110, 150);
  amb.addColorStop(0, 'rgba(100,140,200,0.05)');
  amb.addColorStop(0.5, 'rgba(60,80,120,0.02)');
  amb.addColorStop(1, 'transparent');
  ctx.fillStyle = amb;
  ctx.fillRect(180, 40, 200, 180);
}

const MonteFerroArea = {
  name: 'Stazione Radio Monte Ferro',
  walkableTop: 90,
  colliders: [
    { x: 240, y: 90, w: 70, h: 45 }, // Edificio stazione
    { x: 5, y: 110, w: 35, h: 30 }, // Baracca
    { x: 50, y: 125, w: 30, h: 18 }, // Generatore
    { x: 245, y: 20, w: 4, h: 70 }, // Palo antenna
  ],
  npcs: [],
  exits: [{ dir: 'down', xRange: [180, 220], to: 'industriale', spawnX: 200, spawnY: 200 }],

  draw: (ctx) => {
    var t = Date.now() * 0.001;
    drawMonteFerroArea(ctx, t);
    window.drawVignette(ctx);
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = MonteFerroArea;
} else if (typeof window !== 'undefined') {
  window.MonteFerroArea = MonteFerroArea;
}
