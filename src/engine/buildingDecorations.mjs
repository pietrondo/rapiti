/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    BUILDING DECORATIONS MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Renderers per decorazioni urbane: fontane, lampioni.
 * Estratto da buildingRenderers.mjs per ridurre il God Object.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

var C = {
  concrete: '#A9A9A9',
  wallPolice: '#4682B4',
  stoneGray: '#808080',
  glassSky: '#87CEEB',
  glassLight: '#ADD8E6',
  doorDark: '#2C1810',
  lampOn: '#FFD700',
  lampOff: '#F5F5DC',
  waterSpout: 'rgba(135, 206, 235, 0.6)',
};

export function drawFountain(ctx, x, y, size) {
  ctx.fillStyle = C.concrete;
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.8, size, size * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = C.wallPolice;
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.75, size * 0.85, size * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = C.stoneGray;
  ctx.fillRect(x - size * 0.1, y + size * 0.3, size * 0.2, size * 0.5);

  ctx.fillStyle = C.concrete;
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.35, size * 0.4, size * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = C.glassSky;
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.33, size * 0.35, size * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = C.waterSpout;
  ctx.fillRect(x - 2, y, 4, size * 0.35);

  ctx.fillStyle = C.glassLight;
  for (var i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(x + (Math.random() - 0.5) * 20, y + size * 0.2 + i * 8, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function drawStreetLamp(ctx, x, y, isOn) {
  ctx.fillStyle = C.doorDark;
  ctx.fillRect(x - 2, y, 4, 50);

  ctx.fillStyle = C.doorDark;
  ctx.beginPath();
  ctx.moveTo(x - 8, y);
  ctx.lineTo(x + 8, y);
  ctx.lineTo(x + 6, y - 12);
  ctx.lineTo(x - 6, y - 12);
  ctx.closePath();
  ctx.fill();

  if (isOn) {
    ctx.fillStyle = C.lampOn;
    ctx.shadowColor = C.lampOn;
    ctx.shadowBlur = 15;
  } else {
    ctx.fillStyle = C.lampOff;
    ctx.shadowBlur = 0;
  }
  ctx.beginPath();
  ctx.arc(x, y - 6, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  if (isOn) {
    var gradient = ctx.createRadialGradient(x, y - 6, 5, x, y - 6, 40);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.4)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y - 6, 40, 0, Math.PI * 2);
    ctx.fill();
  }
}

window.BuildingRenderers = window.BuildingRenderers || {};
window.BuildingRenderers.drawFountain = drawFountain;
window.BuildingRenderers.drawStreetLamp = drawStreetLamp;
