/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    INDUSTRIAL BUILDINGS MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Renderers per edifici industriali e istituzionali: fabbriche, stazioni di polizia.
 * Estratto da buildingRenderers.mjs per ridurre il God Object.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

var C = {
  wallIndustrial: '#708090',
  wallPolice: '#4682B4',
  wallBrick: '#8B4513',
  roofDarkSlate: '#2F4F4F',
  glassSky: '#87CEEB',
  doorDark: '#2C1810',
  stoneDim: '#696969',
  stoneDark: '#4A4A4A',
  concrete: '#A9A9A9',
  concreteLight: '#D3D3D3',
  gold: '#FFD700',
  navy: '#000080',
  smoke: 'rgba(200, 200, 200, 0.5)',
};

export function drawIndustrialBuilding(ctx, x, y, width, height) {
  ctx.fillStyle = C.wallIndustrial;
  ctx.fillRect(x, y + 30, width, height - 30);

  ctx.fillStyle = C.roofDarkSlate;
  ctx.fillRect(x - 5, y + 20, width + 10, 15);

  ctx.fillStyle = C.doorDark;
  ctx.fillRect(x + 20, y + height - 50, 60, 50);

  ctx.strokeStyle = C.stoneDark;
  ctx.lineWidth = 2;
  for (var i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(x + 20, y + height - 50 + i * 12);
    ctx.lineTo(x + 80, y + height - 50 + i * 12);
    ctx.stroke();
  }

  ctx.fillStyle = C.glassSky;
  for (var row = 0; row < 3; row++) {
    ctx.fillRect(x + width - 50, y + 50 + row * 30, 35, 15);
  }

  var stackX = x + width - 30;
  var stackY = y - 20;
  ctx.fillStyle = C.wallBrick;
  ctx.fillRect(stackX, stackY, 20, 50);
  ctx.fillStyle = C.stoneDim;
  ctx.fillRect(stackX - 3, stackY, 26, 10);

  ctx.fillStyle = C.smoke;
  for (var s = 0; s < 3; s++) {
    ctx.beginPath();
    ctx.arc(stackX + 10, stackY - 10 - s * 15, 8 + s * 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawPoliceStation(ctx, x, y, width, height) {
  ctx.fillStyle = C.wallPolice;
  ctx.fillRect(x, y + 20, width, height - 20);

  ctx.fillStyle = C.roofDarkSlate;
  ctx.fillRect(x - 3, y + 15, width + 6, 10);

  ctx.fillStyle = C.concrete;
  for (var i = 0; i < 3; i++) {
    ctx.fillRect(x + 20 - i * 3, y + height - 15 + i * 5, width - 40 + i * 6, 5);
  }

  ctx.fillStyle = C.concreteLight;
  for (var c = 0; c < 2; c++) {
    ctx.fillRect(x + 25 + c * (width - 60), y + 35, 15, height - 55);
  }

  ctx.fillStyle = C.doorDark;
  ctx.fillRect(x + width / 2 - 20, y + height - 45, 40, 40);

  ctx.fillStyle = C.gold;
  ctx.fillRect(x + width / 2 - 30, y + 25, 60, 20);
  ctx.fillStyle = C.navy;
  ctx.font = "bold 10px 'Press Start 2P', monospace";
  ctx.textAlign = 'center';
  ctx.fillText('POLIZIA', x + width / 2, y + 38);

  ctx.fillStyle = C.navy;
  ctx.beginPath();
  ctx.moveTo(x + width / 2, y + 50);
  ctx.lineTo(x + width / 2 - 8, y + 55);
  ctx.lineTo(x + width / 2 - 5, y + 65);
  ctx.lineTo(x + width / 2 + 5, y + 65);
  ctx.lineTo(x + width / 2 + 8, y + 55);
  ctx.closePath();
  ctx.fill();
}

window.BuildingRenderers = window.BuildingRenderers || {};
window.BuildingRenderers.drawIndustrialBuilding = drawIndustrialBuilding;
window.BuildingRenderers.drawPoliceStation = drawPoliceStation;
