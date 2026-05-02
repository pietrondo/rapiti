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
  var artist = window.SpriteManager.artist;
  var _c = _createCanvas(128, 128);
  var ctx = _c.ctx;

  for (var row = 0; row < 4; row++) {
    for (var col = 0; col < 4; col++) {
      var ox = col * 32;
      var oy = row * 32;
      var headBob = (col % 2 === 0) ? 0 : 1;
      var dir = ['down', 'up', 'left', 'right'][row];
      var opt = { type: 'player' };

      artist.drawHat(ctx, ox, oy + headBob, dir, colors, opt);
      artist.drawHead(ctx, ox, oy + 6 + headBob, colors, opt);
      artist.drawEyes(ctx, ox, oy + 6 + headBob, dir, opt);
      artist.drawBody(ctx, ox, oy + 17, dir, colors, opt);

      // Gambe e Piedi (ancora locali per semplicità di animazione frame)
      var legY = oy + 26;
      var l1Offset = (col === 1) ? -2 : (col === 3) ? 2 : 0;
      var l2Offset = (col === 1) ? 2 : (col === 3) ? -2 : 0;
      var legs = colors.legs || '#4A3728';

      artist.drawPixelRect(ctx, ox + 11, legY + l1Offset/2, 4, 5, legs);
      artist.drawPixelRect(ctx, ox + 17, legY + l2Offset/2, 4, 5, legs);
      artist.drawPixelRect(ctx, ox + 10, legY + 4 + l1Offset/2, 5, 2, '#1A1510');
      artist.drawPixelRect(ctx, ox + 17, legY + 4 + l2Offset/2, 5, 2, '#1A1510');
    }
  }
  return _c.canvas;
}

/**
 * Genera sprite sheet NPC 128×128
 * @param {Object} npcData
 * @returns {HTMLCanvasElement}
 */
function generateNPCSheet(npcData) {
  var artist = window.SpriteManager.artist;
  var colors = npcData.colors || {};
  var _c = _createCanvas(128, 128);
  var ctx = _c.ctx;

  for (var row = 0; row < 4; row++) {
    for (var col = 0; col < 4; col++) {
      var ox = col * 32;
      var oy = row * 32;
      var headBob = (col % 2 === 0) ? 0 : 1;
      var dir = ['down', 'up', 'left', 'right'][row];
      var opt = { id: npcData.id, type: 'npc' };

      artist.drawHat(ctx, ox, oy + headBob, dir, colors, opt);
      artist.drawHead(ctx, ox, oy + 6 + headBob, colors, opt);
      artist.drawEyes(ctx, ox, oy + 6 + headBob, dir, opt);
      artist.drawBody(ctx, ox, oy + 17, dir, colors, opt);

      var legY = oy + 26;
      var legOffset = (col % 2 === 0) ? 0 : 2;
      var legs = colors.legs || '#3D3025';
      artist.drawPixelRect(ctx, ox + 12 + legOffset, legY, 3, 7, legs);
      artist.drawPixelRect(ctx, ox + 17 - legOffset, legY, 3, 7, legs);
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
  var w = typeof window.CANVAS_W !== 'undefined' ? window.CANVAS_W : 400;
  var h = typeof window.CANVAS_H !== 'undefined' ? window.CANVAS_H : 250;

  var _c = _createCanvas(w, h);
  var ctx = _c.ctx;

  // Sky
  ctx.fillStyle = window.PALETTE ? window.PALETTE.nightBlue : '#1a1c2c';
  ctx.fillRect(0, 0, w, h);

  // Ground
  ctx.fillStyle = window.PALETTE ? window.PALETTE.earthBrown : '#5c4033';
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
