/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREA: MUNICIPIO (INTERNO)
 * Sala d'attesa e ufficio del Sindaco
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.PALETTE, window.CANVAS_W, window.CANVAS_H, window.drawWallTexture, window.drawVignette */

export function drawMunicipioInternoArea(ctx, t) {
  var PAL = window.PALETTE;

  // Sfondo elegante
  ctx.fillStyle = '#1A1410';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // Parete superiore con pannelli boiserie
  ctx.fillStyle = '#2E1F18';
  ctx.fillRect(0, 0, CANVAS_W, 130);
  for (var p = 0; p < 8; p++) {
    ctx.fillStyle = p % 2 === 0 ? '#38261E' : '#2E1F18';
    ctx.fillRect(p * 50, 0, 50, 130);
    ctx.strokeStyle = '#1A1410';
    ctx.lineWidth = 1;
    ctx.strokeRect(p * 50 + 2, 2, 46, 126);
  }

  // Finestra con vista notte e luna
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(280, 15, 50, 60);
  ctx.fillStyle = '#D4A843';
  ctx.beginPath();
  ctx.arc(312, 30, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(150,180,220,0.12)';
  ctx.beginPath();
  ctx.arc(312, 30, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#4A3428';
  ctx.lineWidth = 3;
  ctx.strokeRect(280, 15, 50, 60);
  ctx.beginPath(); ctx.moveTo(305, 15); ctx.lineTo(305, 75); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(280, 45); ctx.lineTo(330, 45); ctx.stroke();

  // Libreria a sinistra
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(10, 15, 70, 110);
  for (var r = 0; r < 5; r++) {
    ctx.fillStyle = '#5D4037';
    ctx.fillRect(12, 20 + r * 22, 66, 3);
    var books = 4 + (r % 3);
    for (var b = 0; b < books; b++) {
      var bh = 14 + (r * 3) % 6;
      var bc = ['#6B4E3D', '#8B7355', '#5C7A4B', '#A0A8B0', '#4A5568', '#C4956A'][r % 6];
      ctx.fillStyle = bc;
      ctx.fillRect(14 + b * 14, 25 + r * 22 - bh, 10, bh);
    }
  }

  // Scrivania del Sindaco (più dettagliata)
  ctx.fillStyle = '#3E2723';
  ctx.fillRect(110, 65, 180, 50);
  ctx.fillStyle = '#4E342E';
  ctx.fillRect(112, 70, 176, 5);
  // Cassetti
  ctx.fillStyle = '#2E1F18';
  ctx.fillRect(115, 78, 50, 34);
  ctx.fillRect(235, 78, 50, 34);
  ctx.fillStyle = '#D4A843';
  ctx.fillRect(137, 88, 6, 6);
  ctx.fillRect(257, 88, 6, 6);
  // Calamaio e penna
  ctx.fillStyle = '#1A1C20';
  ctx.fillRect(195, 62, 10, 8);
  ctx.fillStyle = '#E8DCC8';
  ctx.fillRect(208, 63, 2, 8);
  // Documenti sulla scrivania
  ctx.fillStyle = '#E8DCC8';
  ctx.fillRect(220, 63, 30, 4);
  ctx.fillRect(225, 59, 25, 4);
  ctx.fillRect(222, 67, 28, 3);
  ctx.fillStyle = '#A0A8B0';
  ctx.fillRect(222, 59, 3, 12);

  // Sedia dietro la scrivania
  ctx.fillStyle = '#1A1410';
  ctx.fillRect(185, 40, 30, 30);
  ctx.fillStyle = '#4E342E';
  ctx.fillRect(193, 30, 14, 15);

  // Bandiera Italiana
  ctx.fillStyle = '#555';
  ctx.fillRect(92, 8, 2, 90);
  ctx.fillStyle = '#00853E'; ctx.fillRect(94, 10, 12, 22);
  ctx.fillStyle = '#FFF'; ctx.fillRect(106, 10, 12, 22);
  ctx.fillStyle = '#C83737'; ctx.fillRect(118, 10, 12, 22);

  // Quadro incorniciato (Sandro Pertini, 1978)
  ctx.fillStyle = '#4E342E';
  ctx.fillRect(195, 8, 38, 44);
  ctx.fillStyle = '#E8DCC8';
  ctx.fillRect(199, 12, 30, 36);
  ctx.fillStyle = '#444';
  ctx.beginPath();
  ctx.arc(214, 28, 8, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#888';
  ctx.fillRect(208, 35, 12, 4);
  ctx.fillRect(210, 40, 8, 3);

  // Attaccapanni
  ctx.fillStyle = '#4E342E';
  ctx.fillRect(370, 20, 4, 110);
  ctx.fillRect(362, 20, 20, 4);
  ctx.fillStyle = '#5C5C5C';
  ctx.fillRect(360, 25, 15, 20);
  ctx.fillStyle = '#8B7D6B';
  ctx.fillRect(378, 30, 10, 18);

  // Pavimento in marmo a scacchiera
  for (var row = 0; row < 4; row++) {
    for (var col = 0; col < 8; col++) {
      ctx.fillStyle = (row + col) % 2 === 0 ? '#2A2A2A' : '#353535';
      ctx.fillRect(col * 50, 135 + row * 29, 50, 29);
    }
  }
  ctx.strokeStyle = '#1A1A1A';
  ctx.lineWidth = 1;
  for (var r2 = 0; r2 < 5; r2++) {
    ctx.beginPath(); ctx.moveTo(0, 135 + r2 * 29); ctx.lineTo(400, 135 + r2 * 29); ctx.stroke();
  }

  // Tappeto Rosso
  ctx.fillStyle = '#7A0000';
  ctx.fillRect(100, 155, 200, 95);
  ctx.fillStyle = '#8B0000';
  ctx.fillRect(104, 159, 192, 87);
  ctx.fillStyle = '#9B1111';
  ctx.fillRect(160, 160, 80, 16);
  ctx.fillStyle = '#D4A843';
  ctx.fillRect(196, 162, 8, 12);

  // Lampada da scrivania (luce calda)
  var pulse = Math.sin(t * 1.5) * 0.04;
  ctx.fillStyle = '#4A5568';
  ctx.fillRect(260, 45, 4, 20);
  ctx.fillStyle = '#D4A843';
  ctx.beginPath();
  ctx.arc(262, 45, 5, Math.PI, 0);
  ctx.fill();
  var lampGlow = ctx.createRadialGradient(262, 55, 5, 262, 55, 80);
  lampGlow.addColorStop(0, `rgba(255,220,150,${0.2 + pulse})`);
  lampGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = lampGlow;
  ctx.fillRect(200, 0, 200, 140);

  // Luce ambientale calda
  var ambGlow = ctx.createRadialGradient(200, 100, 30, 200, 100, 250);
  ambGlow.addColorStop(0, `rgba(255,210,140,${0.08 + pulse})`);
  ambGlow.addColorStop(1, 'transparent');
  ctx.fillStyle = ambGlow;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
}

const MunicipioArea = {
  name: 'Municipio — Interno',
  walkableTop: 140,
  colliders: [
    { x: 110, y: 65, w: 180, h: 50 }, // Scrivania
    { x: 10, y: 15, w: 70, h: 110 }, // Libreria
  ],
  npcs: [{ id: 'ruggeri', x: 200, y: 135 }], // Alzato leggermente (dietro scrivania)
  exits: [{ dir: 'down', xRange: [0, 400], to: 'piazze', spawnX: 200, spawnY: 150 }],

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
