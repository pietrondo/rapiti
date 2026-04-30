/* ═══════════════════════════════════════════════════════════════════════════════
   SPRITE ENGINE
   Caricamento PNG, cache, generazione procedurale fallback
   ═══════════════════════════════════════════════════════════════════════════════ */

const SpriteEngine = {
  images: {},
  sheets: {},
  generated: {},
  totalToLoad: 0,
  loadedCount: 0,
  allLoaded: false,

  /** Registra un background PNG da caricare */
  loadBG: function(name, src) {
    this.totalToLoad++;
    var self = this;
    var img = new Image();
    img.onload = function() {
      self.images[name] = img;
      self.loadedCount++;
      if (self.loadedCount >= self.totalToLoad) self.allLoaded = true;
    };
    img.onerror = function() {
      self.loadedCount++;
      if (self.loadedCount >= self.totalToLoad) self.allLoaded = true;
    };
    img.src = src;
  },

  /** Registra uno spritesheet (griglia di frame) */
  loadSheet: function(name, src, frameW, frameH, cols, rows) {
    this.totalToLoad++;
    var self = this;
    var img = new Image();
    img.onload = function() {
      self.sheets[name] = { img: img, fw: frameW, fh: frameH, cols: cols, rows: rows };
      self.loadedCount++;
      if (self.loadedCount >= self.totalToLoad) self.allLoaded = true;
    };
    img.onerror = function() {
      self.loadedCount++;
      if (self.loadedCount >= self.totalToLoad) self.allLoaded = true;
    };
    img.src = src;
  },

  /** Genera e cache uno sprite procedurale (player) */
  generatePlayer: function() {
    if (!this.generated.player) {
      this.generated.player = SpriteGenerator.generatePlayerSheet();
    }
    return this.generated.player;
  },

  /** Genera e cache uno sprite procedurale per un NPC */
  generateNPC: function(npcData) {
    var key = 'npc_' + npcData.id;
    if (!this.generated[key]) {
      this.generated[key] = SpriteGenerator.generateNPCSheet(npcData);
    }
    return this.generated[key];
  },

  /** Genera e cache un background procedurale */
  generateBG: function(areaId, areaData) {
    var key = 'bg_' + areaId;
    if (!this.generated[key]) {
      this.generated[key] = SpriteGenerator.generateBackground(areaId, areaData);
    }
    return this.generated[key];
  },

  /** Genera e cache spritesheet icone indizi */
  generateClueIcons: function(clues) {
    if (!this.generated.clueIcons) {
      this.generated.clueIcons = SpriteGenerator.generateClueIcons(clues);
    }
    return this.generated.clueIcons;
  },

  /** Disegna un background (PNG o procedurale) */
  drawBG: function(ctx, areaId, areaData, alpha) {
    alpha = alpha || 1;
    var img = this.images[areaId];
    if (img) {
      if (alpha < 1) { ctx.globalAlpha = alpha; ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H); ctx.globalAlpha = 1; }
      else { ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H); }
      return true;
    }
    // Fallback: usa generatore procedurale
    var gen = this.generateBG(areaId, areaData);
    if (gen) {
      if (alpha < 1) { ctx.globalAlpha = alpha; ctx.drawImage(gen, 0, 0); ctx.globalAlpha = 1; }
      else { ctx.drawImage(gen, 0, 0); }
      return true;
    }
    return false;
  },

  /** Disegna uno sprite da spritesheet (PNG o procedurale) */
  drawFrame: function(ctx, sheetName, frameIndex, x, y, w, h, flipX) {
    var sheet = this.sheets[sheetName];
    if (!sheet) return false;
    var img = sheet.img;
    var fw = sheet.fw, fh = sheet.fh;
    var col = frameIndex % sheet.cols;
    var row = Math.floor(frameIndex / sheet.cols);
    var sx = col * fw, sy = row * fh;
    if (flipX) {
      ctx.save();
      ctx.translate(x + w, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, sx, sy, fw, fh, 0, y, w, h);
      ctx.restore();
    } else {
      ctx.drawImage(img, sx, sy, fw, fh, x, y, w, h);
    }
    return true;
  },

  /** Disegna un'immagine singola (non spritesheet) a coordinate */
  drawImg: function(ctx, name, x, y, w, h) {
    var img = this.images[name];
    if (img) { ctx.drawImage(img, x, y, w || img.width, h || img.height); return true; }
    return false;
  },

  /** Verifica se un'immagine e' caricata */
  has: function(name) { return !!this.images[name] || !!this.sheets[name] || !!this.generated[name]; },

  /** Restituisce progresso caricamento 0-1 */
  progress: function() {
    return this.totalToLoad > 0 ? this.loadedCount / this.totalToLoad : 1;
  }
};

// Export for global access
window.SpriteEngine = SpriteEngine;
