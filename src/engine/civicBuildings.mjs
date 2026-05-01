/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    CIVIC BUILDINGS MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Renderers per edifici civili: chiese, case residenziali, negozi.
 * Estratto da buildingRenderers.mjs per ridurre il God Object.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

var C = {
  wallTan: '#D2B48C',
  wallWheat: '#F5DEB3',
  wallShop: '#DEB887',
  wallBrick: '#8B4513',
  roofSaddle: '#8B4513',
  roofSienna: '#A0522D',
  glassSky: '#87CEEB',
  glassLight: '#ADD8E6',
  doorWood: '#4A3728',
  doorDark: '#2C1810',
  doorBrown: '#654321',
  gold: '#FFD700',
  stoneDim: '#696969',
  reflection: 'rgba(255, 255, 255, 0.3)',
  grass: '#228B22',
  flowerPink: '#FF69B4',
  flowerYellow: '#FFD700',
  flowerTomato: '#FF6347',
  flowerOrchid: '#DA70D6',
};

export function drawChurch(ctx, x, y, width, height) {
  ctx.fillStyle = C.wallTan;
  ctx.fillRect(x, y + height * 0.3, width * 0.7, height * 0.7);

  ctx.fillStyle = C.roofSaddle;
  ctx.beginPath();
  ctx.moveTo(x - 5, y + height * 0.3);
  ctx.lineTo(x + width * 0.35, y);
  ctx.lineTo(x + width * 0.7 + 5, y + height * 0.3);
  ctx.closePath();
  ctx.fill();

  var towerW = width * 0.25;
  var towerH = height * 0.8;
  var towerX = x + width * 0.7;
  var towerY = y + height * 0.2;
  ctx.fillStyle = C.wallTan;
  ctx.fillRect(towerX, towerY, towerW, towerH);

  ctx.fillStyle = C.roofSaddle;
  ctx.beginPath();
  ctx.moveTo(towerX - 3, towerY);
  ctx.lineTo(towerX + towerW / 2, towerY - height * 0.15);
  ctx.lineTo(towerX + towerW + 3, towerY);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = C.doorDark;
  ctx.fillRect(towerX + towerW * 0.25, towerY + height * 0.15, towerW * 0.5, height * 0.2);

  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(towerX + towerW / 2, towerY - height * 0.15);
  ctx.lineTo(towerX + towerW / 2, towerY - height * 0.25);
  ctx.moveTo(towerX + towerW / 2 - 5, towerY - height * 0.2);
  ctx.lineTo(towerX + towerW / 2 + 5, towerY - height * 0.2);
  ctx.stroke();

  ctx.fillStyle = '#4169E1';
  ctx.beginPath();
  ctx.arc(x + width * 0.35, y + height * 0.5, 15, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = C.doorWood;
  ctx.fillRect(x + width * 0.25, y + height * 0.7, width * 0.2, height * 0.3);
}

export function drawResidentialHouse(ctx, x, y, width, height, options) {
  options = options || {};
  var hasGarden = options.hasGarden !== false;
  var color = options.color || C.wallWheat;

  ctx.fillStyle = color;
  ctx.fillRect(x + 10, y + 20, width - 20, height - 20);

  ctx.fillStyle = C.roofSienna;
  ctx.beginPath();
  ctx.moveTo(x + 5, y + 20);
  ctx.lineTo(x + width / 2, y);
  ctx.lineTo(x + width - 5, y + 20);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = C.glassSky;
  ctx.fillRect(x + 20, y + 40, 20, 25);
  ctx.fillRect(x + width - 40, y + 40, 20, 25);

  ctx.strokeStyle = C.wallBrick;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 20, y + 40, 20, 25);
  ctx.strokeRect(x + width - 40, y + 40, 20, 25);

  ctx.fillStyle = C.doorBrown;
  ctx.fillRect(x + width / 2 - 12, y + height - 35, 24, 35);

  if (hasGarden) {
    ctx.fillStyle = C.grass;
    ctx.fillRect(x, y + height - 10, width, 15);
    var flowerColors = [C.flowerPink, C.flowerYellow, C.flowerTomato, C.flowerOrchid];
    for (var i = 0; i < 4; i++) {
      ctx.fillStyle = flowerColors[i % flowerColors.length];
      ctx.beginPath();
      ctx.arc(x + 15 + i * (width / 4), y + height - 5, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

export function drawShopFront(ctx, x, y, width, height, options) {
  options = options || {};
  var shopType = options.type || 'general';
  var signText = options.signText || '';

  ctx.fillStyle = C.wallShop;
  ctx.fillRect(x, y + 15, width, height - 15);

  ctx.fillStyle = C.glassLight;
  ctx.fillRect(x + 10, y + 30, width - 20, height * 0.5);

  ctx.fillStyle = C.reflection;
  ctx.beginPath();
  ctx.moveTo(x + 15, y + 35);
  ctx.lineTo(x + 40, y + 35);
  ctx.lineTo(x + 25, y + height * 0.5 + 20);
  ctx.lineTo(x + 15, y + height * 0.5 + 10);
  ctx.closePath();
  ctx.fill();

  var awningColors = {
    general: ['#FF6B6B', '#FFFFFF'],
    cafe: [C.wallBrick, C.wallWheat],
    bookstore: ['#4169E1', C.gold],
  };
  var colors = awningColors[shopType] || awningColors.general;
  var stripeW = 15;
  for (var i = 0; i < width / stripeW; i++) {
    ctx.fillStyle = colors[i % 2];
    ctx.fillRect(x + i * stripeW, y + 15, stripeW, 20);
  }

  ctx.fillStyle = C.doorWood;
  ctx.fillRect(x + width / 2 - 15, y + height - 45, 30, 45);

  if (signText) {
    ctx.fillStyle = C.doorDark;
    ctx.fillRect(x + width / 2 - 40, y - 5, 80, 20);
    ctx.fillStyle = C.gold;
    ctx.font = "10px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(signText.substring(0, 8), x + width / 2, y + 10);
  }
}

window.BuildingRenderers = window.BuildingRenderers || {};
window.BuildingRenderers.drawChurch = drawChurch;
window.BuildingRenderers.drawResidentialHouse = drawResidentialHouse;
window.BuildingRenderers.drawShopFront = drawShopFront;
