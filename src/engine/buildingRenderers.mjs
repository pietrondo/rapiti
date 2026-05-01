/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    BUILDING RENDERERS MODULE
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Helper functions for drawing detailed building facades and architectural
 * elements. Used by area rendering systems for consistent building aesthetics.
 *
 * This module is part of the modular engine system extracted from engine.js
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* ── COSTANTI COLORI ARCHITETTONICI ── */
var C = {
  // Muri
  wallBrick: '#8B4513',
  wallTan: '#D2B48C',
  wallWheat: '#F5DEB3',
  wallShop: '#DEB887',
  wallIndustrial: '#708090',
  wallPolice: '#4682B4',

  // Tetti
  roofBrown: '#654321',
  roofSienna: '#A0522D',
  roofDarkSlate: '#2F4F4F',
  roofSaddle: '#8B4513',

  // Vetri
  glassSky: '#87CEEB',
  glassLight: '#ADD8E6',

  // Porte e legno
  doorWood: '#4A3728',
  doorDark: '#2C1810',
  doorBrown: '#654321',

  // Metalli e oro
  gold: '#FFD700',
  goldMetallic: '#D4AF37',

  // Pietra e cemento
  stoneDim: '#696969',
  stoneDark: '#4A4A4A',
  stoneGray: '#808080',
  concrete: '#A9A9A9',
  concreteLight: '#D3D3D3',

  // Colori speciali
  navy: '#000080',
  royalBlue: '#4169E1',
  slate: '#708090',

  // Vegetazione
  grass: '#228B22',
  flowerPink: '#FF69B4',
  flowerYellow: '#FFD700',
  flowerTomato: '#FF6347',
  flowerOrchid: '#DA70D6',

  // Luce
  lampOn: '#FFD700',
  lampOff: '#F5F5DC',

  // Riflessi e trasparenze
  reflection: 'rgba(255, 255, 255, 0.3)',
  smoke: 'rgba(200, 200, 200, 0.5)',
  waterSpout: 'rgba(135, 206, 235, 0.6)',
};

/**
 * Draw a detailed building facade with architectural elements
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Building width
 * @param {number} height - Building height
 * @param {Object} options - Building options
 */
export function drawBuildingDetailed(ctx, x, y, width, height, options) {
  options = options || {};
  var wallColor = options.wallColor || C.wallBrick;
  var roofColor = options.roofColor || C.roofBrown;
  var windowColor = options.windowColor || C.glassSky;
  var doorColor = options.doorColor || C.doorWood;
  var style = options.style || 'classic'; // classic, modern, rustic

  // Building body
  ctx.fillStyle = wallColor;
  ctx.fillRect(x, y, width, height);

  // Roof
  ctx.fillStyle = roofColor;
  ctx.beginPath();
  ctx.moveTo(x - 5, y);
  ctx.lineTo(x + width / 2, y - height * 0.2);
  ctx.lineTo(x + width + 5, y);
  ctx.closePath();
  ctx.fill();

  // Windows
  var windowRows = Math.floor(height / 40);
  var windowCols = Math.floor(width / 30);
  var windowW = 15;
  var windowH = 20;
  var startX = x + 10;
  var startY = y + 20;

  ctx.fillStyle = windowColor;
  for (var row = 0; row < windowRows; row++) {
    for (var col = 0; col < windowCols; col++) {
      var wx = startX + col * 25;
      var wy = startY + row * 35;
      if (wx + windowW < x + width - 10 && wy + windowH < y + height - 30) {
        ctx.fillRect(wx, wy, windowW, windowH);
        // Window frame
        ctx.strokeStyle = C.doorWood;
        ctx.lineWidth = 2;
        ctx.strokeRect(wx, wy, windowW, windowH);
      }
    }
  }

  // Door
  var doorW = 25;
  var doorH = 40;
  var doorX = x + width / 2 - doorW / 2;
  var doorY = y + height - doorH;
  ctx.fillStyle = doorColor;
  ctx.fillRect(doorX, doorY, doorW, doorH);

  // Door details
  ctx.fillStyle = C.gold;
  ctx.fillRect(doorX + doorW - 5, doorY + doorH / 2, 3, 3); // Handle

  // Architectural details based on style
  if (style === 'classic') {
    // Cornice
    ctx.fillStyle = C.goldMetallic;
    ctx.fillRect(x - 2, y + height * 0.15, width + 4, 5);
  } else if (style === 'rustic') {
    // Stone accents
    ctx.fillStyle = C.stoneDim;
    for (var i = 0; i < 5; i++) {
      ctx.fillRect(x + i * (width / 5), y + height - 15, 10, 10);
    }
  }
}

/**
 * Draw a church with bell tower
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Church width
 * @param {number} height - Church height
 */
export function drawChurch(ctx, x, y, width, height) {
  // Main church body
  ctx.fillStyle = C.wallTan;
  ctx.fillRect(x, y + height * 0.3, width * 0.7, height * 0.7);

  // Church roof (triangular)
  ctx.fillStyle = C.roofSaddle;
  ctx.beginPath();
  ctx.moveTo(x - 5, y + height * 0.3);
  ctx.lineTo(x + width * 0.35, y);
  ctx.lineTo(x + width * 0.7 + 5, y + height * 0.3);
  ctx.closePath();
  ctx.fill();

  // Bell tower
  var towerW = width * 0.25;
  var towerH = height * 0.8;
  var towerX = x + width * 0.7;
  var towerY = y + height * 0.2;
  ctx.fillStyle = C.wallTan;
  ctx.fillRect(towerX, towerY, towerW, towerH);

  // Tower roof
  ctx.fillStyle = C.roofSaddle;
  ctx.beginPath();
  ctx.moveTo(towerX - 3, towerY);
  ctx.lineTo(towerX + towerW / 2, towerY - height * 0.15);
  ctx.lineTo(towerX + towerW + 3, towerY);
  ctx.closePath();
  ctx.fill();

  // Bell opening
  ctx.fillStyle = C.doorDark;
  ctx.fillRect(towerX + towerW * 0.25, towerY + height * 0.15, towerW * 0.5, height * 0.2);

  // Cross on top
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(towerX + towerW / 2, towerY - height * 0.15);
  ctx.lineTo(towerX + towerW / 2, towerY - height * 0.25);
  ctx.moveTo(towerX + towerW / 2 - 5, towerY - height * 0.2);
  ctx.lineTo(towerX + towerW / 2 + 5, towerY - height * 0.2);
  ctx.stroke();

  // Rose window
  ctx.fillStyle = C.royalBlue;
  ctx.beginPath();
  ctx.arc(x + width * 0.35, y + height * 0.5, 15, 0, Math.PI * 2);
  ctx.fill();

  // Main door
  ctx.fillStyle = C.doorWood;
  ctx.fillRect(x + width * 0.25, y + height * 0.7, width * 0.2, height * 0.3);
}

/**
 * Draw a residential house with garden
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - House width
 * @param {number} height - House height
 * @param {Object} options - House options
 */
export function drawResidentialHouse(ctx, x, y, width, height, options) {
  options = options || {};
  var hasGarden = options.hasGarden !== false;
  var color = options.color || C.wallWheat;

  // House body
  ctx.fillStyle = color;
  ctx.fillRect(x + 10, y + 20, width - 20, height - 20);

  // Roof
  ctx.fillStyle = C.roofSienna;
  ctx.beginPath();
  ctx.moveTo(x + 5, y + 20);
  ctx.lineTo(x + width / 2, y);
  ctx.lineTo(x + width - 5, y + 20);
  ctx.closePath();
  ctx.fill();

  // Windows
  ctx.fillStyle = C.glassSky;
  ctx.fillRect(x + 20, y + 40, 20, 25);
  ctx.fillRect(x + width - 40, y + 40, 20, 25);

  // Window frames
  ctx.strokeStyle = C.wallBrick;
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 20, y + 40, 20, 25);
  ctx.strokeRect(x + width - 40, y + 40, 20, 25);

  // Door
  ctx.fillStyle = C.doorBrown;
  ctx.fillRect(x + width / 2 - 12, y + height - 35, 24, 35);

  // Garden
  if (hasGarden) {
    ctx.fillStyle = C.grass;
    ctx.fillRect(x, y + height - 10, width, 15);

    // Flowers
    var flowerColors = [C.flowerPink, C.flowerYellow, C.flowerTomato, C.flowerOrchid];
    for (var i = 0; i < 4; i++) {
      ctx.fillStyle = flowerColors[i % flowerColors.length];
      ctx.beginPath();
      ctx.arc(x + 15 + i * (width / 4), y + height - 5, 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

/**
 * Draw a shop/store front
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Shop width
 * @param {number} height - Shop height
 * @param {Object} options - Shop options
 */
export function drawShopFront(ctx, x, y, width, height, options) {
  options = options || {};
  var shopType = options.type || 'general'; // general, cafe, bookstore
  var signText = options.signText || '';

  // Shop body
  ctx.fillStyle = C.wallShop;
  ctx.fillRect(x, y + 15, width, height - 15);

  // Large display window
  ctx.fillStyle = C.glassLight;
  ctx.fillRect(x + 10, y + 30, width - 20, height * 0.5);

  // Window reflection
  ctx.fillStyle = C.reflection;
  ctx.beginPath();
  ctx.moveTo(x + 15, y + 35);
  ctx.lineTo(x + 40, y + 35);
  ctx.lineTo(x + 25, y + height * 0.5 + 20);
  ctx.lineTo(x + 15, y + height * 0.5 + 10);
  ctx.closePath();
  ctx.fill();

  // Awning
  var awningColors = {
    general: ['#FF6B6B', '#FFFFFF'],
    cafe: [C.wallBrick, C.wallWheat],
    bookstore: [C.royalBlue, C.gold],
  };
  var colors = awningColors[shopType] || awningColors.general;
  var stripeW = 15;
  for (var i = 0; i < width / stripeW; i++) {
    ctx.fillStyle = colors[i % 2];
    ctx.fillRect(x + i * stripeW, y + 15, stripeW, 20);
  }

  // Door
  ctx.fillStyle = C.doorWood;
  ctx.fillRect(x + width / 2 - 15, y + height - 45, 30, 45);

  // Sign
  if (signText) {
    ctx.fillStyle = C.doorDark;
    ctx.fillRect(x + width / 2 - 40, y - 5, 80, 20);
    ctx.fillStyle = C.gold;
    ctx.font = "10px 'Press Start 2P', monospace";
    ctx.textAlign = 'center';
    ctx.fillText(signText.substring(0, 8), x + width / 2, y + 10);
  }
}

/**
 * Draw an industrial building/factory
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Building width
 * @param {number} height - Building height
 */
export function drawIndustrialBuilding(ctx, x, y, width, height) {
  // Main factory building
  ctx.fillStyle = C.wallIndustrial;
  ctx.fillRect(x, y + 30, width, height - 30);

  // Roof
  ctx.fillStyle = C.roofDarkSlate;
  ctx.fillRect(x - 5, y + 20, width + 10, 15);

  // Large industrial door
  ctx.fillStyle = C.doorDark;
  ctx.fillRect(x + 20, y + height - 50, 60, 50);

  // Door details (panels)
  ctx.strokeStyle = C.stoneDark;
  ctx.lineWidth = 2;
  for (var i = 1; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(x + 20, y + height - 50 + i * 12);
    ctx.lineTo(x + 80, y + height - 50 + i * 12);
    ctx.stroke();
  }

  // Windows (industrial style - horizontal bands)
  ctx.fillStyle = C.glassSky;
  for (var row = 0; row < 3; row++) {
    ctx.fillRect(x + width - 50, y + 50 + row * 30, 35, 15);
  }

  // Smokestack
  var stackX = x + width - 30;
  var stackY = y - 20;
  ctx.fillStyle = C.wallBrick;
  ctx.fillRect(stackX, stackY, 20, 50);
  ctx.fillStyle = C.stoneDim;
  ctx.fillRect(stackX - 3, stackY, 26, 10);

  // Smoke
  ctx.fillStyle = C.smoke;
  for (var s = 0; s < 3; s++) {
    ctx.beginPath();
    ctx.arc(stackX + 10, stackY - 10 - s * 15, 8 + s * 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Draw a police station
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} width - Building width
 * @param {number} height - Building height
 */
export function drawPoliceStation(ctx, x, y, width, height) {
  // Main building
  ctx.fillStyle = C.wallPolice;
  ctx.fillRect(x, y + 20, width, height - 20);

  // Roof
  ctx.fillStyle = C.roofDarkSlate;
  ctx.fillRect(x - 3, y + 15, width + 6, 10);

  // Steps
  ctx.fillStyle = C.concrete;
  for (var i = 0; i < 3; i++) {
    ctx.fillRect(x + 20 - i * 3, y + height - 15 + i * 5, width - 40 + i * 6, 5);
  }

  // Columns
  ctx.fillStyle = C.concreteLight;
  for (var c = 0; c < 2; c++) {
    ctx.fillRect(x + 25 + c * (width - 60), y + 35, 15, height - 55);
  }

  // Main door
  ctx.fillStyle = C.doorDark;
  ctx.fillRect(x + width / 2 - 20, y + height - 45, 40, 40);

  // Police sign
  ctx.fillStyle = C.gold;
  ctx.fillRect(x + width / 2 - 30, y + 25, 60, 20);
  ctx.fillStyle = C.navy;
  ctx.font = "bold 10px 'Press Start 2P', monospace";
  ctx.textAlign = 'center';
  ctx.fillText('POLIZIA', x + width / 2, y + 38);

  // Shield emblem
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

/**
 * Draw a fountain
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {number} size - Fountain size
 */
export function drawFountain(ctx, x, y, size) {
  // Base
  ctx.fillStyle = C.concrete;
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.8, size, size * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Water basin
  ctx.fillStyle = C.wallPolice;
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.75, size * 0.85, size * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Central pillar
  ctx.fillStyle = C.stoneGray;
  ctx.fillRect(x - size * 0.1, y + size * 0.3, size * 0.2, size * 0.5);

  // Top basin
  ctx.fillStyle = C.concrete;
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.35, size * 0.4, size * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Water in top basin
  ctx.fillStyle = C.glassSky;
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.33, size * 0.35, size * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Water spout
  ctx.fillStyle = C.waterSpout;
  ctx.fillRect(x - 2, y, 4, size * 0.35);

  // Water droplets
  ctx.fillStyle = C.glassLight;
  for (var i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.arc(x + (Math.random() - 0.5) * 20, y + size * 0.2 + i * 8, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Draw a street lamp
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - X position
 * @param {number} y - Y position
 * @param {boolean} isOn - Whether lamp is lit
 */
export function drawStreetLamp(ctx, x, y, isOn) {
  // Pole
  ctx.fillStyle = C.doorDark;
  ctx.fillRect(x - 2, y, 4, 50);

  // Lamp head
  ctx.fillStyle = C.doorDark;
  ctx.beginPath();
  ctx.moveTo(x - 8, y);
  ctx.lineTo(x + 8, y);
  ctx.lineTo(x + 6, y - 12);
  ctx.lineTo(x - 6, y - 12);
  ctx.closePath();
  ctx.fill();

  // Light bulb
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

  // Light glow
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

// Export for both module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    drawBuildingDetailed: drawBuildingDetailed,
    drawChurch: drawChurch,
    drawResidentialHouse: drawResidentialHouse,
    drawShopFront: drawShopFront,
    drawIndustrialBuilding: drawIndustrialBuilding,
    drawPoliceStation: drawPoliceStation,
    drawFountain: drawFountain,
    drawStreetLamp: drawStreetLamp,
  };
}
