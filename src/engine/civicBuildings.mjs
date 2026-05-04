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

/**
 * Disegna una chiesa con torre campanaria e vetrata
 */
export function drawChurch(ctx, x, y, width, height) {
  // Mura principali con pattern pietra
  if (window.drawBrickPattern) {
    window.drawBrickPattern(ctx, x, y + height * 0.3, width * 0.7, height * 0.7, C.wallTan);
  } else {
    ctx.fillStyle = C.wallTan;
    ctx.fillRect(x, y + height * 0.3, width * 0.7, height * 0.7);
  }

  // Tetto principale con tegole
  if (window.drawTileRoof) {
    window.drawTileRoof(ctx, x, y + height * 0.3, width * 0.7, C.roofSaddle);
  } else {
    ctx.fillStyle = C.roofSaddle;
    ctx.beginPath();
    ctx.moveTo(x - 5, y + height * 0.3);
    ctx.lineTo(x + width * 0.35, y);
    ctx.lineTo(x + width * 0.7 + 5, y + height * 0.3);
    ctx.closePath();
    ctx.fill();
  }

  // Torre
  var towerW = width * 0.25;
  var towerH = height * 0.8;
  var towerX = x + width * 0.7;
  var towerY = y + height * 0.2;

  if (window.drawBrickPattern) {
    window.drawBrickPattern(ctx, towerX, towerY, towerW, towerH, C.wallTan);
  } else {
    ctx.fillStyle = C.wallTan;
    ctx.fillRect(towerX, towerY, towerW, towerH);
  }

  // Tetto torre
  ctx.fillStyle = C.roofSaddle;
  ctx.beginPath();
  ctx.moveTo(towerX - 3, towerY);
  ctx.lineTo(towerX + towerW / 2, towerY - height * 0.15);
  ctx.lineTo(towerX + towerW + 3, towerY);
  ctx.closePath();
  ctx.fill();

  // Croce d'oro
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(towerX + towerW / 2, towerY - height * 0.15);
  ctx.lineTo(towerX + towerW / 2, towerY - height * 0.3);
  ctx.moveTo(towerX + towerW / 2 - 5, towerY - height * 0.25);
  ctx.lineTo(towerX + towerW / 2 + 5, towerY - height * 0.25);
  ctx.stroke();

  // Rosone (Vetrata)
  var centerX = x + width * 0.35;
  var centerY = y + height * 0.55;
  ctx.fillStyle = '#2A3047'; // Sfondo scuro vetrata
  ctx.beginPath();
  ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
  ctx.fill();

  // Colori vetrata
  var colors = ['#4169E1', '#FF6347', '#FFD700', '#32CD32'];
  for (var i = 0; i < 8; i++) {
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, 13, (i * Math.PI) / 4, ((i + 1) * Math.PI) / 4);
    ctx.fill();
  }
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
  ctx.stroke();

  // Portone principale
  ctx.fillStyle = C.doorWood;
  ctx.beginPath();
  ctx.roundRect(x + width * 0.25, y + height * 0.7, width * 0.2, height * 0.3, [10, 10, 0, 0]);
  ctx.fill();
}

/**
 * Disegna una casa residenziale con dettagli migliorati
 */
export function drawResidentialHouse(ctx, x, y, width, height, options) {
  options = options || {};
  var hasGarden = options.hasGarden !== false;
  var color = options.color || C.wallWheat;

  // Ombra
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fillRect(x + 5, y + height - 5, width, 10);

  // Mura
  ctx.fillStyle = color;
  ctx.fillRect(x + 10, y + 20, width - 20, height - 20);

  // Pattern mattoni leggero
  ctx.strokeStyle = 'rgba(0,0,0,0.05)';
  for (var j = 0; j < (height - 20) / 8; j++) {
    ctx.beginPath();
    ctx.moveTo(x + 10, y + 20 + j * 8);
    ctx.lineTo(x + width - 10, y + 20 + j * 8);
    ctx.stroke();
  }

  // Tetto
  if (window.drawTileRoof) {
    window.drawTileRoof(ctx, x + 10, y + 20, width - 20, C.roofSienna);
  } else {
    ctx.fillStyle = C.roofSienna;
    ctx.beginPath();
    ctx.moveTo(x + 5, y + 20);
    ctx.lineTo(x + width / 2, y);
    ctx.lineTo(x + width - 5, y + 20);
    ctx.closePath();
    ctx.fill();
  }

  // Camino
  ctx.fillStyle = C.wallBrick;
  ctx.fillRect(x + width - 35, y + 5, 10, 20);
  ctx.fillStyle = '#333';
  ctx.fillRect(x + width - 37, y + 5, 14, 3);

  // Finestre con persiane
  var winY = y + 45;
  var winW = 18;
  var winH = 24;

  function drawWindowWithShutters(wx, wy) {
    // Persiane (chiuse a metà o aperte)
    ctx.fillStyle = '#4E342E';
    ctx.fillRect(wx - 10, wy, 8, winH); // Sinistra
    ctx.fillRect(wx + winW + 2, wy, 8, winH); // Destra

    // Vetro
    ctx.fillStyle = C.glassSky;
    ctx.fillRect(wx, wy, winW, winH);
    ctx.strokeStyle = '#2A1A0A';
    ctx.lineWidth = 1;
    ctx.strokeRect(wx, wy, winW, winH);
    ctx.beginPath();
    ctx.moveTo(wx, wy + winH / 2);
    ctx.lineTo(wx + winW, wy + winH / 2);
    ctx.moveTo(wx + winW / 2, wy);
    ctx.lineTo(wx + winW / 2, wy + winH);
    ctx.stroke();
  }

  drawWindowWithShutters(x + 25, winY);
  drawWindowWithShutters(x + width - 43, winY);

  // Porta
  ctx.fillStyle = C.doorBrown;
  ctx.fillRect(x + width / 2 - 12, y + height - 35, 24, 35);
  ctx.fillStyle = C.gold;
  ctx.beginPath();
  ctx.arc(x + width / 2 + 6, y + height - 17, 2, 0, Math.PI * 2);
  ctx.fill();

  if (hasGarden) {
    ctx.fillStyle = C.grass;
    ctx.fillRect(x, y + height - 10, width, 15);
    var flowerColors = [C.flowerPink, C.flowerYellow, C.flowerTomato, C.flowerOrchid];
    for (var i = 0; i < 6; i++) {
      ctx.fillStyle = flowerColors[i % flowerColors.length];
      ctx.beginPath();
      ctx.arc(x + 10 + i * (width / 6), y + height - 5, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * Disegna la facciata di un negozio
 */
export function drawShopFront(ctx, x, y, width, height, options) {
  options = options || {};
  var shopType = options.type || 'general';
  var signText = options.signText || '';

  // Mura
  ctx.fillStyle = C.wallShop;
  ctx.fillRect(x, y + 15, width, height - 15);

  // Zoccolo pietra
  ctx.fillStyle = C.stoneDim;
  ctx.fillRect(x, y + height - 8, width, 8);

  // Vetrina grande
  ctx.fillStyle = '#1A2030';
  ctx.fillRect(x + 10, y + 35, width - 20, height * 0.5);
  ctx.fillStyle = C.glassLight;
  ctx.globalAlpha = 0.4;
  ctx.fillRect(x + 12, y + 37, width - 24, height * 0.5 - 4);
  ctx.globalAlpha = 1.0;

  // Riflesso vetrina
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.beginPath();
  ctx.moveTo(x + 15, y + 40);
  ctx.lineTo(x + 50, y + 40);
  ctx.lineTo(x + 20, y + height * 0.5 + 25);
  ctx.closePath();
  ctx.fill();

  // Tenda (Awning)
  var awningColors = {
    general: ['#FF6B6B', '#FFFFFF'],
    cafe: ['#8B4513', '#F5DEB3'],
    bookstore: ['#4169E1', '#FFD700'],
  };
  var colors = awningColors[shopType] || awningColors.general;
  var stripeW = 12;
  for (var i = 0; i < width / stripeW; i++) {
    ctx.fillStyle = colors[i % 2];
    ctx.beginPath();
    ctx.moveTo(x + i * stripeW, y + 15);
    ctx.lineTo(x + (i + 1) * stripeW, y + 15);
    ctx.lineTo(x + (i + 1) * stripeW, y + 35);
    ctx.quadraticCurveTo(x + i * stripeW + stripeW / 2, y + 40, x + i * stripeW, y + 35);
    ctx.fill();
  }

  // Porta del negozio
  ctx.fillStyle = C.doorWood;
  ctx.fillRect(x + width / 2 - 15, y + height - 45, 30, 45);
  ctx.fillStyle = C.glassLight;
  ctx.fillRect(x + width / 2 - 10, y + height - 40, 20, 15);

  if (signText) {
    // Insegna migliorata
    ctx.fillStyle = '#222';
    ctx.fillRect(x + width / 2 - 45, y - 5, 90, 22);
    ctx.strokeStyle = C.gold;
    ctx.lineWidth = 1;
    ctx.strokeRect(x + width / 2 - 43, y - 3, 86, 18);

    ctx.fillStyle = C.gold;
    ctx.font = "bold 9px 'Courier New', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(signText.toUpperCase(), x + width / 2, y + 10);
  }
}

window.BuildingRenderers = window.BuildingRenderers || {};
window.BuildingRenderers.drawChurch = drawChurch;
window.BuildingRenderers.drawResidentialHouse = drawResidentialHouse;
window.BuildingRenderers.drawShopFront = drawShopFront;
