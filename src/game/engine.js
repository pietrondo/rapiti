/* ═══════════ SPRITE ENGINE — PNG + Procedural Fallback ═══════════
   Carica PNG, li cache, li disegna su canvas con scaling pixel-art.
   Se un PNG non è caricato, usa un fallback procedurale.
   ══════════════════════════════════════════════════════════════ */

var SpriteEngine = {
  images: {},
  sheets: {},
  totalToLoad: 0,
  loadedCount: 0,
  allLoaded: false,

  /** Registra un background PNG da caricare */
  loadBG: function(name, src) {
    this.totalToLoad++;
    var img = new Image();
    var self = this;
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
    var img = new Image();
    var self = this;
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

  /** Disegna un background (riempie il canvas 400x250) */
  drawBG: function(ctx, name, alpha) {
    alpha = alpha || 1;
    var img = this.images[name];
    if (img) {
      if (alpha < 1) { ctx.globalAlpha = alpha; ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H); ctx.globalAlpha = 1; }
      else { ctx.drawImage(img, 0, 0, CANVAS_W, CANVAS_H); }
      return true;
    }
    return false; // caller deve usare fallback procedurale
  },

  /** Disegna uno sprite da spritesheet (frame singolo) */
  drawFrame: function(ctx, sheetName, frameIndex, x, y, w, h, flipX) {
    var sheet = this.sheets[sheetName];
    if (!sheet) return false;
    var col = frameIndex % sheet.cols;
    var row = Math.floor(frameIndex / sheet.cols);
    var sx = col * sheet.fw, sy = row * sheet.fh;
    if (flipX) {
      ctx.save();
      ctx.translate(x + w, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(sheet.img, sx, sy, sheet.fw, sheet.fh, 0, y, w, h);
      ctx.restore();
    } else {
      ctx.drawImage(sheet.img, sx, sy, sheet.fw, sheet.fh, x, y, w, h);
    }
    return true;
  },

  /** Disegna un'immagine singola (non spritesheet) a coordinate */
  drawImg: function(ctx, name, x, y, w, h) {
    var img = this.images[name];
    if (img) { ctx.drawImage(img, x, y, w || img.width, h || img.height); return true; }
    return false;
  },

  /** Verifica se un'immagine è caricata */
  has: function(name) { return !!this.images[name] || !!this.sheets[name]; },

  /** Restituisce progresso caricamento 0-1 */
  progress: function() {
    return this.totalToLoad > 0 ? this.loadedCount / this.totalToLoad : 1;
  }
};

/* ═══════════ PROCEDURAL FALLBACK RENDERER ═══════════
   Usato quando i PNG non sono ancora caricati. Stile pixel-art pulito.
   ══════════════════════════════════════════════════════════════ */

var PF = {
  /** Sfondo cielo notturno con stelle + luna */
  nightSky: function(ctx, stars) {
    ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
    ctx.fillStyle = PALETTE.creamPaper;
    for (var i = 0; i < (stars || 14); i++) {
      ctx.fillRect(15+(i*79)%CANVAS_W, 5+(i*27)%50, (i%3===0)?2:1, (i%3===0)?2:1);
    }
  },

  /** Montagne sullo sfondo */
  mountains: function(ctx) {
    ctx.fillStyle = PALETTE.violetBlue;
    ctx.beginPath(); ctx.moveTo(0,90); ctx.lineTo(60,60); ctx.lineTo(150,75);
    ctx.lineTo(220,50); ctx.lineTo(300,70); ctx.lineTo(400,85);
    ctx.lineTo(400,100); ctx.lineTo(0,100); ctx.fill();
  },

  /** Edificio semplice */
  building: function(ctx, x, y, w, h, windows) {
    ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = PALETTE.fadedBeige;
    for (var i = 0; i < (windows || 2); i++) {
      var wx = x + 7 + i * 18, wy = y + 8;
      ctx.fillRect(wx, wy, 8, 16);
      ctx.fillStyle = PALETTE.lanternYel;
      ctx.fillRect(wx + 2, wy + 2, 4, 6);
      ctx.fillStyle = PALETTE.fadedBeige;
    }
    ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(x, y - 8, w, 8);
  },

  /** Lampione con alone */
  lamp: function(ctx, x, y) {
    ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(x, y, 3, 22);
    ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(x-2, y-6, 7, 7);
    ctx.fillStyle = 'rgba(212,168,67,0.15)';
    ctx.beginPath(); ctx.arc(x+1, y+12, 18, 0, Math.PI*2); ctx.fill();
  },

  /** Albero stilizzato */
  tree: function(ctx, x, y) {
    ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(x-1, y, 3, 14);
    ctx.fillStyle = PALETTE.darkForest;
    ctx.beginPath(); ctx.arc(x, y-6, 7, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x-5, y-3, 5, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(x+5, y-3, 5, 0, Math.PI*2); ctx.fill();
  }
};
