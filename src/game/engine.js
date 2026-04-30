/* ═══════════ SPRITE ENGINE — PNG + Procedural Fallback + Generator ═══════════
   Carica PNG, li cache, li disegna su canvas con scaling pixel-art.
   Se un PNG non è caricato, usa il SpriteGenerator procedurale.
   ══════════════════════════════════════════════════════════════ */

var SpriteEngine = {
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

  /** Verifica se un'immagine è caricata */
  has: function(name) { return !!this.images[name] || !!this.sheets[name] || !!this.generated[name]; },

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
  },

  /** Edificio dettagliato stile EarthBound */
  buildingDetailed: function(ctx, x, y, w, h, type, animTime) {
    animTime = animTime || 0;
    
    switch(type) {
      case 'municipio':
        this._drawMunicipio(ctx, x, y, w, h, animTime);
        break;
      case 'bar':
        this._drawBar(ctx, x, y, w, h, animTime);
        break;
      case 'cascina':
        this._drawCascina(ctx, x, y, w, h, animTime);
        break;
      case 'fienile':
        this._drawFienile(ctx, x, y, w, h, animTime);
        break;
      case 'cabina':
        this._drawCabina(ctx, x, y, w, h, animTime);
        break;
      case 'pozzo':
        this._drawPozzo(ctx, x, y, w, h, animTime);
        break;
      default:
        this.building(ctx, x, y, w, h, 2);
    }
  },

  /** Municipio — orologio, stemma, gradini, persiane, crepe, bandiera */
  _drawMunicipio: function(ctx, x, y, w, h, t) {
    // Base intonaco
    ctx.fillStyle = PALETTE.fadedBeige;
    ctx.fillRect(x, y, w, h);
    
    // Texture intonaco variata con crepe
    for(var i=0; i<25; i++) {
      var tx = x + (i*17)%w;
      var ty = y + (i*13)%(h-20);
      ctx.fillStyle = (i%2===0) ? 'rgba(180,168,138,0.3)' : 'rgba(160,148,118,0.2)';
      ctx.fillRect(tx, ty, 3, 2);
      
      // Crepe occasionali
      if(i % 7 === 0) {
        ctx.fillStyle = '#5A4A3A';
        ctx.fillRect(tx, ty, 1, 8);
      }
    }
    
    // Cornice tetto
    ctx.fillStyle = PALETTE.burntOrange;
    ctx.fillRect(x-2, y-6, w+4, 8);
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x-2, y-8, w+4, 3);
    
    // Orologio sul tetto
    ctx.fillStyle = PALETTE.creamPaper;
    ctx.beginPath(); ctx.arc(x+w/2, y-4, 5, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = PALETTE.nightBlue;
    ctx.fillRect(x+w/2-1, y-5, 2, 4); // lancetta ore
    ctx.fillRect(x+w/2-2, y-4, 4, 2); // lancetta minuti
    
    // Stemma sopra portone
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+w/2-6, y+8, 12, 10);
    ctx.fillStyle = PALETTE.burntOrange;
    ctx.fillRect(x+w/2-4, y+10, 8, 6);
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.fillRect(x+w/2-1, y+11, 2, 4); // stemma araldico
    
    // Portone centrale con vetri
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x+w/2-8, y+h-30, 16, 28);
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+w/2-6, y+h-28, 12, 24);
    // Vetri portone
    ctx.fillStyle = 'rgba(100,140,200,0.4)';
    ctx.fillRect(x+w/2-4, y+h-26, 4, 10);
    ctx.fillRect(x+w/2, y+h-26, 4, 10);
    // Maniglia
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.fillRect(x+w/2+2, y+h-18, 2, 2);
    
    // Gradini in pietra
    ctx.fillStyle = PALETTE.alumGrey;
    ctx.fillRect(x+w/2-14, y+h-2, 28, 2);
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+w/2-12, y+h-4, 24, 2);
    ctx.fillStyle = PALETTE.greyBrown;
    ctx.fillRect(x+w/2-10, y+h-6, 20, 2);
    
    // Finestre con persiane animate
    var winPositions = [
      {x: x+8, y: y+12, w: 10, h: 14},
      {x: x+22, y: y+12, w: 10, h: 14},
      {x: x+w-28, y: y+12, w: 10, h: 14},
      {x: x+w-42, y: y+12, w: 10, h: 14}
    ];
    
    for(var wi=0; wi<winPositions.length; wi++) {
      var win = winPositions[wi];
      // Persiane (alcune aperte, alcune chiuse, animazione leggera)
      var persianeAperte = (wi % 2 === 1);
      var persianaSwing = Math.sin(t*0.5 + wi)*0.5;
      
      if(!persianeAperte) {
        ctx.fillStyle = '#4A5568';
        ctx.fillRect(win.x-3, win.y, 3, win.h);
        ctx.fillRect(win.x+win.w, win.y, 3, win.h);
        // Dettaglio persiana
        ctx.fillStyle = '#3A4558';
        ctx.fillRect(win.x-2, win.y+2, 1, win.h-4);
        ctx.fillRect(win.x+win.w+1, win.y+2, 1, win.h-4);
      } else {
        // Persiane aperte con oscillazione
        ctx.save();
        ctx.translate(win.x-3, win.y+win.h/2);
        ctx.rotate(persianaSwing * 0.1);
        ctx.fillStyle = '#4A5568';
        ctx.fillRect(-1, -win.h/2, 3, win.h);
        ctx.restore();
        
        ctx.save();
        ctx.translate(win.x+win.w+3, win.y+win.h/2);
        ctx.rotate(-persianaSwing * 0.1);
        ctx.fillStyle = '#4A5568';
        ctx.fillRect(-1, -win.h/2, 3, win.h);
        ctx.restore();
      }
      
      // Vetro finestra
      ctx.fillStyle = PALETTE.nightBlue;
      ctx.fillRect(win.x, win.y, win.w, win.h);
      // Luce calda interna
      var lightPulse = 0.6 + Math.sin(t*2 + wi)*0.2;
      ctx.fillStyle = 'rgba(212,168,67,' + lightPulse.toFixed(2) + ')';
      ctx.fillRect(win.x+2, win.y+2, win.w-4, win.h-4);
      // Telaio
      ctx.fillStyle = PALETTE.earthBrown;
      ctx.fillRect(win.x, win.y, win.w, 2);
      ctx.fillRect(win.x, win.y, 2, win.h);
      ctx.fillRect(win.x+win.w-2, win.y, 2, win.h);
      ctx.fillRect(win.x, win.y+win.h-2, win.w, 2);
      // Centro croce
      ctx.fillRect(win.x+win.w/2-1, win.y, 2, win.h);
      ctx.fillRect(win.x, win.y+win.h/2-1, win.w, 2);
    }
    
    // Balcone (sopra portone)
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+w/2-10, y+h-34, 20, 3);
    // Ringhiera
    for(var ri=0; ri<5; ri++) {
      ctx.fillRect(x+w/2-9+ri*4, y+h-40, 1, 7);
    }
    ctx.fillRect(x+w/2-10, y+h-40, 20, 2);
    
    // Bandiera italiana (destra dell'edificio)
    ctx.fillStyle = '#008000'; // Verde
    ctx.fillRect(x+w+2, y+10, 4, 12);
    ctx.fillStyle = '#FFFFFF'; // Bianco
    ctx.fillRect(x+w+6, y+10, 4, 12);
    ctx.fillStyle = '#CC0000'; // Rosso
    ctx.fillRect(x+w+10, y+10, 4, 12);
    // Asta bandiera
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+w+1, y+8, 2, 16);
  },

  /** Bar — tenda a righe con onde animate, sedie, insegna, lavagna, fiori */
  _drawBar: function(ctx, x, y, w, h, t) {
    // Base muro
    ctx.fillStyle = PALETTE.fadedBeige;
    ctx.fillRect(x, y, w, h);
    
    // Texture muro
    for(var i=0; i<18; i++) {
      var tx = x + (i*13)%w;
      var ty = y + (i*11)%(h-10);
      ctx.fillStyle = (i%3===0) ? 'rgba(180,168,138,0.3)' : 'rgba(160,148,118,0.2)';
      ctx.fillRect(tx, ty, 2, 2);
    }
    
    // Cornice tetto
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x-2, y-4, w+4, 6);
    
    // Insegna "BAR" luminosa con pulsazione neon
    var signPulse = 0.7 + Math.sin(t*3)*0.3;
    ctx.fillStyle = '#CC0000';
    ctx.fillRect(x+w/2-20, y-14, 40, 12);
    // Alone luminoso
    ctx.fillStyle = 'rgba(204,0,0,0.3)';
    ctx.fillRect(x+w/2-22, y-16, 44, 16);
    ctx.fillStyle = 'rgba(255,255,255,' + signPulse.toFixed(2) + ')';
    ctx.fillRect(x+w/2-18, y-12, 36, 8);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 7px "Courier New",monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BAR', x+w/2, y-5);
    ctx.textAlign = 'start';
    
    // Tenda a righe sopra ingresso con onde animate
    for(var si=0; si<8; si++) {
      var waveOff = Math.sin(t*2 + si*0.6)*3;
      if(si % 2 === 0) {
        ctx.fillStyle = '#CC0000';
      } else {
        ctx.fillStyle = '#FFFFFF';
      }
      ctx.fillRect(x+6+si*5, y+h-20+waveOff, 5, 14);
    }
    
    // Portone/Vetrina
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x+w/2-6, y+h-18, 12, 16);
    // Vetro
    ctx.fillStyle = 'rgba(100,140,200,0.3)';
    ctx.fillRect(x+w/2-4, y+h-16, 8, 12);
    // Maniglia
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.fillRect(x+w/2+2, y+h-10, 2, 2);
    
    // Finestra laterale con tenda leggera
    ctx.fillStyle = PALETTE.nightBlue;
    ctx.fillRect(x+4, y+8, 12, 10);
    // Luce interna
    ctx.fillStyle = 'rgba(212,168,67,0.5)';
    ctx.fillRect(x+6, y+10, 8, 6);
    // Tenda
    ctx.fillStyle = 'rgba(232,220,200,0.4)';
    ctx.fillRect(x+4, y+8, 12, 4);
    
    // Sedie fuori (3 sedie con schienale)
    ctx.fillStyle = PALETTE.slateGrey;
    for(var ci=0; ci<3; ci++) {
      var chairX = x + 8 + ci*14;
      var chairY = y + h + 2;
      // Sedile
      ctx.fillRect(chairX, chairY, 8, 2);
      // Schienale
      ctx.fillRect(chairX, chairY-5, 1, 6);
      ctx.fillRect(chairX+7, chairY-5, 1, 6);
      ctx.fillRect(chairX, chairY-6, 8, 1);
      // Gambe
      ctx.fillRect(chairX+2, chairY+2, 1, 4);
      ctx.fillRect(chairX+5, chairY+2, 1, 4);
    }
    
    // Lavagna menu fuori
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+w-18, y+h-16, 12, 14);
    ctx.fillStyle = PALETTE.creamPaper;
    ctx.fillRect(x+w-16, y+h-14, 8, 10);
    // Testo lavagna (righe leggibili)
    ctx.fillStyle = PALETTE.nightBlue;
    ctx.fillRect(x+w-15, y+h-13, 6, 1);
    ctx.fillRect(x+w-15, y+h-11, 5, 1);
    ctx.fillRect(x+w-15, y+h-9, 6, 1);
    ctx.fillRect(x+w-15, y+h-7, 4, 1);
    
    // Vaso fiori lato porta
    ctx.fillStyle = PALETTE.burntOrange;
    ctx.fillRect(x+2, y+h-10, 8, 8);
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x+3, y+h-8, 6, 4);
    // Fiori
    for(var fi=0; fi<3; fi++) {
      ctx.fillStyle = '#CC3333';
      ctx.fillRect(x+3+fi*2, y+h-12+Math.sin(t+fi)*1, 2, 2);
      ctx.fillStyle = PALETTE.darkForest;
      ctx.fillRect(x+2+fi*2, y+h-10, 1, 2);
    }
  },

  /** Cascina — grondaia, fiori, portone legno, muretto, crepe, dettagli */
  _drawCascina: function(ctx, x, y, w, h, t) {
    // Base muro pietra
    ctx.fillStyle = PALETTE.greyBrown;
    ctx.fillRect(x, y, w, h);
    
    // Texture pietra con variazioni e crepe
    for(var i=0; i<35; i++) {
      var tx = x + (i*19)%w;
      var ty = y + (i*17)%(h-10);
      var stoneSize = 4 + (i%3)*2;
      ctx.fillStyle = (i%2===0) ? PALETTE.fadedBeige : PALETTE.earthBrown;
      ctx.fillRect(tx, ty, stoneSize, stoneSize-2);
      // Ombra pietra
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(tx, ty+stoneSize-2, stoneSize, 1);
      
      // Crepe occasionali
      if(i % 8 === 0) {
        ctx.fillStyle = '#3A2A1A';
        ctx.fillRect(tx, ty, 1, 6 + (i%3)*3);
      }
    }
    
    // Grondaia
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x-2, y-3, w+4, 4);
    // Pluviale
    ctx.fillRect(x+w-4, y-3, 3, h);
    
    // Tetto tegole con dettaglio
    ctx.fillStyle = PALETTE.burntOrange;
    ctx.fillRect(x-4, y-8, w+8, 8);
    // Tegole dettagli
    ctx.fillStyle = PALETTE.earthBrown;
    for(var ti=0; ti<w+8; ti+=4) {
      ctx.fillRect(x-4+ti, y-8, 3, 2);
      ctx.fillRect(x-2+ti, y-6, 3, 2);
    }
    // Camino con fumo animato
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+w-20, y-16, 10, 12);
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x+w-22, y-18, 14, 4);
    
    // Portone in legno con assi e dettagli
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x+w/2-10, y+h-28, 20, 26);
    // Assi legno
    ctx.fillStyle = PALETTE.slateGrey;
    for(var pi=0; pi<4; pi++) {
      ctx.fillRect(x+w/2-8+pi*5, y+h-26, 4, 22);
    }
    // Ferramenta
    ctx.fillStyle = PALETTE.alumGrey;
    ctx.fillRect(x+w/2-8, y+h-24, 2, 2);
    ctx.fillRect(x+w/2+6, y+h-24, 2, 2);
    ctx.fillRect(x+w/2-8, y+h-8, 2, 2);
    ctx.fillRect(x+w/2+6, y+h-8, 2, 2);
    // Maniglia ferro
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.fillRect(x+w/2+4, y+h-16, 3, 3);
    
    // Finestre con luci calde pulsanti
    var winPositions = [
      {x: x+8, y: y+10, w: 12, h: 10},
      {x: x+w-20, y: y+10, w: 12, h: 10}
    ];
    
    for(var wi=0; wi<winPositions.length; wi++) {
      var win = winPositions[wi];
      ctx.fillStyle = PALETTE.nightBlue;
      ctx.fillRect(win.x, win.y, win.w, win.h);
      // Luce calda pulsante
      var pulse = 0.5 + Math.sin(t*1.5 + wi*2)*0.3;
      ctx.fillStyle = 'rgba(212,168,67,' + pulse.toFixed(2) + ')';
      ctx.fillRect(win.x+2, win.y+2, win.w-4, win.h-4);
      // Telaio
      ctx.fillStyle = PALETTE.earthBrown;
      ctx.fillRect(win.x, win.y, win.w, 2);
      ctx.fillRect(win.x, win.y, 2, win.h);
      ctx.fillRect(win.x+win.w-2, win.y, 2, win.h);
      ctx.fillRect(win.x, win.y+win.h-2, win.w, 2);
      
      // Fiori ai balconi (gerani)
      if(wi === 0) {
        // Vaso
        ctx.fillStyle = PALETTE.burntOrange;
        ctx.fillRect(win.x-2, win.y+win.h+2, 16, 4);
        // Terra
        ctx.fillStyle = PALETTE.earthBrown;
        ctx.fillRect(win.x, win.y+win.h+2, 12, 2);
        // Gerani rossi
        for(var fi=0; fi<5; fi++) {
          var fx = win.x + 2 + fi*2;
          var fy = win.y+win.h-2 + Math.sin(t+fi)*1;
          ctx.fillStyle = '#CC3333';
          ctx.fillRect(fx, fy, 2, 2);
          // Foglie
          ctx.fillStyle = PALETTE.darkForest;
          ctx.fillRect(fx-1, fy+2, 1, 2);
          ctx.fillRect(fx+2, fy+2, 1, 2);
        }
      }
    }
    
    // Muretto in pietra attorno (base) con variazioni
    ctx.fillStyle = PALETTE.alumGrey;
    ctx.fillRect(x-2, y+h, w+4, 4);
    ctx.fillStyle = PALETTE.slateGrey;
    for(var mi=0; mi<w+4; mi+=6) {
      ctx.fillStyle = (mi%12===0) ? PALETTE.greyBrown : PALETTE.slateGrey;
      ctx.fillRect(x-2+mi, y+h, 5, 4);
    }
  },

  /** Fienile — porta legno, finestrella, paglia, attrezzi, crepe */
  _drawFienile: function(ctx, x, y, w, h, t) {
    // Base legno
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x, y, w, h);
    
    // Assi legno verticali con variazioni
    ctx.fillStyle = PALETTE.slateGrey;
    for(var i=0; i<w; i+=6) {
      ctx.fillRect(x+i, y, 1, h);
    }
    // Ombre assi
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    for(var i=0; i<w; i+=6) {
      ctx.fillRect(x+i+1, y, 2, h);
    }
    
    // Tetto
    ctx.fillStyle = PALETTE.burntOrange;
    ctx.fillRect(x-3, y-6, w+6, 8);
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x-3, y-8, w+6, 3);
    
    // Porta grande in legno con assi orizzontali
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+w/2-12, y+h-30, 24, 28);
    // Assi porta
    ctx.fillStyle = PALETTE.earthBrown;
    for(var pi=0; pi<4; pi++) {
      ctx.fillRect(x+w/2-10+pi*6, y+h-28, 5, 24);
    }
    // Ferramenta porta
    ctx.fillStyle = PALETTE.alumGrey;
    ctx.fillRect(x+w/2-10, y+h-26, 20, 2);
    ctx.fillRect(x+w/2-10, y+h-10, 20, 2);
    ctx.fillRect(x+w/2-10, y+h-18, 20, 2);
    // Chiavistello
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.fillRect(x+w/2-2, y+h-16, 4, 4);
    
    // Finestrella in alto con inferriata
    ctx.fillStyle = PALETTE.nightBlue;
    ctx.fillRect(x+w/2-6, y+8, 12, 8);
    // Luce fioca interna
    var faintLight = 0.2 + Math.sin(t)*0.1;
    ctx.fillStyle = 'rgba(212,168,67,' + faintLight.toFixed(2) + ')';
    ctx.fillRect(x+w/2-4, y+10, 8, 4);
    // Inferriata
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+w/2-6, y+8, 12, 1);
    ctx.fillRect(x+w/2-6, y+15, 12, 1);
    for(var bi=0; bi<3; bi++) {
      ctx.fillRect(x+w/2-4+bi*4, y+8, 1, 8);
    }
    
    // Paglia/fieno ammucchiato fuori
    ctx.fillStyle = PALETTE.lanternYel;
    for(var hi=0; hi<10; hi++) {
      var hx = x + w + 4 + (hi%3)*4;
      var hy = y + h - 6 - Math.floor(hi/3)*3;
      ctx.fillRect(hx, hy, 3, 2);
    }
    // Some di paglia
    ctx.fillStyle = PALETTE.creamPaper;
    ctx.fillRect(x+w+6, y+h-10, 6, 4);
    ctx.fillRect(x+w+4, y+h-8, 10, 2);
    
    // Attrezzi appesi (forca e pala)
    ctx.fillStyle = PALETTE.earthBrown;
    // Manico forca
    ctx.fillRect(x+4, y+10, 2, 20);
    // Denti forca
    ctx.fillRect(x+2, y+8, 6, 2);
    ctx.fillRect(x+2, y+6, 1, 3);
    ctx.fillRect(x+5, y+6, 1, 3);
    // Manico pala
    ctx.fillRect(x+12, y+12, 2, 18);
    // Pala
    ctx.fillStyle = PALETTE.alumGrey;
    ctx.fillRect(x+10, y+10, 6, 3);
  },

  /** Cabina telefonica — telefono, cartello, luce, crepe, vetro */
  _drawCabina: function(ctx, x, y, w, h, t) {
    // Struttura cabina
    ctx.fillStyle = PALETTE.burntOrange;
    ctx.fillRect(x, y, w, h);
    
    // Crepe e usura
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(x+4, y+8, 1, 12);
    ctx.fillRect(x+w-6, y+12, 1, 8);
    
    // Tetto
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x-2, y-3, w+4, 5);
    
    // Vetro
    ctx.fillStyle = 'rgba(100,140,200,0.4)';
    ctx.fillRect(x+2, y+2, w-4, h-4);
    
    // Telefono interno
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+4, y+h/2-4, 10, 8);
    // Ricevitore
    ctx.fillStyle = PALETTE.nightBlue;
    ctx.fillRect(x+6, y+h/2-6, 6, 3);
    // Cavo
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x+8, y+h/2-3, 1, 4);
    
    // Cartello "TEL."
    ctx.fillStyle = PALETTE.creamPaper;
    ctx.fillRect(x+w/2-12, y+4, 24, 8);
    ctx.fillStyle = PALETTE.nightBlue;
    ctx.font = 'bold 5px "Courier New",monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TEL.', x+w/2, y+10);
    ctx.textAlign = 'start';
    
    // Luce interna
    var lightOn = 0.6 + Math.sin(t*2)*0.2;
    ctx.fillStyle = 'rgba(212,168,67,' + lightOn.toFixed(2) + ')';
    ctx.fillRect(x+4, y+4, w-8, h-8);
  },

  /** Pozzo — secchio e corda oscillanti, muschio, acqua */
  _drawPozzo: function(ctx, x, y, w, h, t) {
    // Base pietra
    ctx.fillStyle = PALETTE.alumGrey;
    ctx.fillRect(x, y, w, h);
    
    // Texture pietra con variazioni
    for(var i=0; i<14; i++) {
      var tx = x + (i*11)%w;
      var ty = y + (i*9)%(h-4);
      ctx.fillStyle = (i%2===0) ? PALETTE.slateGrey : PALETTE.greyBrown;
      ctx.fillRect(tx, ty, 4, 3);
    }
    
    // Muschio sui bordi
    ctx.fillStyle = PALETTE.darkForest;
    for(var mi=0; mi<10; mi++) {
      var mx = x + (mi*7)%w;
      ctx.fillRect(mx, y, 3, 2 + (mi%2));
      ctx.fillRect(mx, y+h-3, 2, 2);
    }
    
    // Apertura acqua
    ctx.fillStyle = PALETTE.nightBlue;
    ctx.fillRect(x+4, y+4, w-8, h-8);
    
    // Acqua con riflesso animato
    var waterPulse = 0.3 + Math.sin(t*2)*0.1;
    ctx.fillStyle = 'rgba(100,120,160,' + waterPulse.toFixed(2) + ')';
    ctx.fillRect(x+6, y+6, w-12, h-12);
    
    // Ripple animati sull'acqua
    for(var ri=0; ri<3; ri++) {
      var rippleY = y + 8 + Math.sin(t*1.5 + ri*2)*3;
      var rippleW = 4 + Math.sin(t*1.2 + ri)*2;
      var rippleX = x + 8 + ri*8;
      ctx.fillStyle = 'rgba(140,160,200,0.25)';
      ctx.fillRect(rippleX - rippleW/2, rippleY, rippleW, 1);
    }
    
    // Struttura sopra (travi)
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x-2, y-8, w+4, 4);
    ctx.fillRect(x-2, y-10, 3, 6);
    ctx.fillRect(x+w-1, y-10, 3, 6);
    // Trave trasversale
    ctx.fillRect(x-2, y-10, w+4, 3);
    
    // Secchio e corda oscillanti
    var swingAngle = Math.sin(t*1.5)*3;
    var bucketX = x + w/2 + swingAngle;
    var bucketY = y + 2;
    // Corda
    ctx.fillStyle = PALETTE.creamPaper;
    ctx.fillRect(bucketX-1, y-8, 1, bucketY-y+10);
    ctx.fillRect(bucketX+1, y-8, 1, bucketY-y+10);
    // Secchio
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(bucketX-3, bucketY, 7, 5);
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(bucketX-2, bucketY+1, 5, 3);
    // Manico secchio
    ctx.fillStyle = PALETTE.alumGrey;
    ctx.fillRect(bucketX-2, bucketY-1, 5, 1);
  }
};
