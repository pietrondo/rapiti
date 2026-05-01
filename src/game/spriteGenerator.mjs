/**
 * Sprite Generator — generazione procedurale sprite sheet player/NPC
 * Fallback quando i PNG non sono disponibili
 */

function _createCanvas(w, h) {
  var c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  var ctx = c.getContext('2d');
  ctx.imageSmoothingEnabled = false;
  return { canvas: c, ctx: ctx };
}

function _drawPixelRect(ctx, x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}

/**
 * Genera sprite sheet player 128×128 (4 dir × 4 frame, 32×32 ciascuno)
 * @param {Object} colors
 * @returns {HTMLCanvasElement}
 */
function generatePlayerSheet(colors) {
  colors = colors || {};
  var body = colors.body || '#8B7355';
  var bodyLight = colors.bodyLight || '#A59375';
  var bodyDark = colors.bodyDark || '#6B5335';
  var detail = colors.detail || '#2D3047';
  var detailLight = colors.detailLight || '#4D5067';
  var legs = colors.legs || '#4A3728';
  var head = colors.head || '#F5DEB3';
  var headShadow = colors.headShadow || '#D5BE93';

  var size = 128; // 4x4 grid of 32x32
  var _c = _createCanvas(size, size);
  var ctx = _c.ctx;

  for (var row = 0; row < 4; row++) {
    for (var col = 0; col < 4; col++) {
      var ox = col * 32;
      var oy = row * 32;
      var frame = col;

      // Legs offset per animazione
      var legOffset = (frame % 2 === 0) ? 0 : 2;

      // Direction: 0=down, 1=left, 2=right, 3=up
      var dir = row;
      var isSide = (dir === 1 || dir === 2);
      var isBack = (dir === 3);

      // Head
      _drawPixelRect(ctx, ox + 12, oy + 4, 8, 8, head);
      _drawPixelRect(ctx, ox + 13, oy + 5, 6, 6, headShadow);

      // Hat / detail top
      if (!isBack) {
        _drawPixelRect(ctx, ox + 11, oy + 2, 10, 3, detail);
        _drawPixelRect(ctx, ox + 10, oy + 3, 12, 1, detailLight);
      } else {
        _drawPixelRect(ctx, ox + 11, oy + 3, 10, 2, detail);
      }

      // Body
      _drawPixelRect(ctx, ox + 11, oy + 12, 10, 10, body);
      _drawPixelRect(ctx, ox + 12, oy + 13, 8, 8, bodyLight);
      _drawPixelRect(ctx, ox + 13, oy + 14, 6, 6, bodyDark);

      // Detail (tie / scarf / button)
      if (!isBack) {
        _drawPixelRect(ctx, ox + 15, oy + 14, 2, 4, detail);
      }

      // Arms
      if (isSide) {
        var armX = (dir === 1) ? ox + 8 : ox + 20;
        _drawPixelRect(ctx, armX, oy + 13, 3, 7, body);
        _drawPixelRect(ctx, armX, oy + 20, 3, 2, headShadow); // hand
      } else {
        _drawPixelRect(ctx, ox + 9, oy + 13, 3, 7, body);
        _drawPixelRect(ctx, ox + 20, oy + 13, 3, 7, body);
      }

      // Legs
      if (isSide) {
        var legX = (dir === 1) ? ox + 12 + legOffset : ox + 16 - legOffset;
        _drawPixelRect(ctx, legX, oy + 22, 3, 8, legs);
        _drawPixelRect(ctx, legX + 4, oy + 22, 3, 8, legs);
      } else {
        _drawPixelRect(ctx, ox + 12 + legOffset, oy + 22, 3, 8, legs);
        _drawPixelRect(ctx, ox + 17 - legOffset, oy + 22, 3, 8, legs);
      }

      // Shoes
      _drawPixelRect(ctx, ox + 11, oy + 29, 4, 2, '#1A1C20');
      _drawPixelRect(ctx, ox + 17, oy + 29, 4, 2, '#1A1C20');
    }
  }

  return _c.canvas;
}

/**
 * Genera sprite sheet NPC 128×64 (4 dir × 2 frame, 32×32 ciascuno)
 * @param {Object} npcData
 * @returns {HTMLCanvasElement}
 */
function generateNPCSheet(npcData) {
  npcData = npcData || {};
  var colors = npcData.colors || {};
  var body = colors.body || '#6B4E3D';
  var head = colors.head || '#F5DEB3';
  var detail = colors.detail || '#3D5A3C';

  var sizeW = 128; // 4 cols x 32
  var sizeH = 64;  // 2 rows x 32
  var _c = _createCanvas(sizeW, sizeH);
  var ctx = _c.ctx;

  for (var row = 0; row < 2; row++) {
    for (var col = 0; col < 4; col++) {
      var ox = col * 32;
      var oy = row * 32;
      var frame = col;
      var legOffset = (frame % 2 === 0) ? 0 : 2;
      var dir = row; // 0=down, 1=left, 2=right, 3=up... ma solo 2 righe! -> 0=front, 1=back
      var isBack = (dir === 1);

      // Head
      _drawPixelRect(ctx, ox + 12, oy + 4, 8, 8, head);

      // Hair / hat
      if (!isBack) {
        _drawPixelRect(ctx, ox + 11, oy + 2, 10, 3, detail);
      } else {
        _drawPixelRect(ctx, ox + 11, oy + 3, 10, 3, detail);
      }

      // Body
      _drawPixelRect(ctx, ox + 11, oy + 12, 10, 10, body);

      // Legs
      _drawPixelRect(ctx, ox + 12 + legOffset, oy + 22, 3, 8, '#4A3728');
      _drawPixelRect(ctx, ox + 17 - legOffset, oy + 22, 3, 8, '#4A3728');

      // Shoes
      _drawPixelRect(ctx, ox + 11, oy + 29, 4, 2, '#1A1C20');
      _drawPixelRect(ctx, ox + 17, oy + 29, 4, 2, '#1A1C20');
    }
  }

  return _c.canvas;
}

/**
 * Genera background procedurale per un'area
 * @param {string} areaId
 * @param {Object} areaData
 * @returns {HTMLCanvasElement|null}
 */
function generateBackground(areaId, areaData) {
  var w = typeof CANVAS_W !== 'undefined' ? CANVAS_W : 400;
  var h = typeof CANVAS_H !== 'undefined' ? CANVAS_H : 250;

  var _c = _createCanvas(w, h);
  var ctx = _c.ctx;

  // Sky
  ctx.fillStyle = PALETTE ? PALETTE.nightBlue : '#1a1c2c';
  ctx.fillRect(0, 0, w, h);

  // Ground
  ctx.fillStyle = PALETTE ? PALETTE.earthBrown : '#5c4033';
  ctx.fillRect(0, h - 40, w, 40);

  // Simple building silhouettes based on area
  if (areaId === 'piazza' || areaId === 'municipio') {
    ctx.fillStyle = '#2D3047';
    ctx.fillRect(50, h - 100, 60, 60);
    ctx.fillRect(120, h - 80, 50, 40);
  } else if (areaId === 'cascina' || areaId === 'cascina_interno') {
    ctx.fillStyle = '#6B4E3D';
    ctx.fillRect(80, h - 90, 80, 50);
  } else if (areaId === 'campo') {
    ctx.fillStyle = '#3D5A3C';
    for (var i = 0; i < w; i += 20) {
      ctx.fillRect(i, h - 50, 3, 20);
    }
  }

  return _c.canvas;
}

/**
 * Genera icone per gli indizi
 * @param {Array} clues
 * @returns {HTMLCanvasElement}
 */
function generateClueIcons(clues) {
  clues = clues || [];
  var size = 32 * clues.length || 32;
  var _c = _createCanvas(size, 32);
  var ctx = _c.ctx;

  for (var i = 0; i < clues.length; i++) {
    var ox = i * 32;
    var oy = 0;
    // Simple icon: a small document / magnifying glass shape
    ctx.fillStyle = '#d4a843';
    ctx.fillRect(ox + 6, oy + 4, 20, 24); // document shape
    ctx.fillStyle = '#1a1c20';
    ctx.fillRect(ox + 9, oy + 8, 14, 2);
    ctx.fillRect(ox + 9, oy + 12, 10, 2);
    ctx.fillRect(ox + 9, oy + 16, 12, 2);
  }

  return _c.canvas;
}

var SpriteGenerator = {
  generatePlayerSheet: generatePlayerSheet,
  generateNPCSheet: generateNPCSheet,
  generateBackground: generateBackground,
  generateClueIcons: generateClueIcons,
};

window.SpriteGenerator = SpriteGenerator;
