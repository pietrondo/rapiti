/**
 * Procedural Sprite Generator
 * Genera sprite sheet in pixel art 8-bit direttamente su canvas
 * Usato come fallback quando gli asset PNG non sono disponibili
 */

const SpriteGenerator = {
  FRAME_SIZE: 32,
  
  // Palette colori per il detective (stile EarthBound)
  PALETTE: {
    SKIN: '#F5C6A0',
    SKIN_SHADOW: '#D4A47A',
    COAT: '#3A4A6B',
    COAT_LIGHT: '#4D5F8A',
    COAT_DARK: '#2A3550',
    HAT: '#2A3550',
    HAT_LIGHT: '#3A4A6B',
    HAIR: '#4A3020',
    HAIR_LIGHT: '#5A4030',
    PANTS: '#2A3040',
    SHOES: '#1A1510',
    SHOES_LIGHT: '#2A2015',
    EYE: '#1A1A2A',
    EYE_WHITE: '#FFFFFF',
    TIE: '#8B1A1A',
    TIE_LIGHT: '#A02020',
    SHIRT: '#E8E0D0',
    SHIRT_SHADOW: '#D0C8B8',
    MOUTH: '#A07060',
    COLLAR: '#F0E8D8',
  },

  /**
   * Genera sprite sheet del player con colori personalizzati
   * @param {Object} colors - {body, bodyLight, bodyDark, detail, detailLight, legs, head, headShadow}
   * @returns {HTMLCanvasElement} Canvas 128x128 con tutti i frame
   */
  generatePlayerSheet(colors) {
    const canvas = document.createElement('canvas');
    const size = this.FRAME_SIZE * 4; // 4 frame per riga = 128
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;
    
    // Merge custom colors with palette defaults
    const c = colors || {};
    const coat = c.body || this.PALETTE.COAT;
    const coatLight = c.bodyLight || this._lighten(coat, 0.15);
    const coatDark = c.bodyDark || this._darken(coat, 0.2);
    const hat = c.detail || this.PALETTE.HAT;
    const hatLight = c.detailLight || this._lighten(hat, 0.15);
    const skin = c.head || this.PALETTE.SKIN;
    const skinShadow = c.headShadow || this._darken(skin, 0.15);
    const pants = c.legs || this.PALETTE.PANTS;
    
    const directions = ['down', 'up', 'left', 'right'];
    
    directions.forEach((dir, dirIndex) => {
      for (let frame = 0; frame < 4; frame++) {
        const ox = frame * this.FRAME_SIZE;
        const oy = dirIndex * this.FRAME_SIZE;
        this._drawPlayerFrame(ctx, ox, oy, dir, frame, {
          coat, coatLight, coatDark, hat, hatLight, skin, skinShadow, pants
        });
      }
    });
    
    return canvas;
  },
  
  /**
   * Schiarisce un colore hex
   */
  _lighten(hex, amount) {
    var r = parseInt(hex.slice(1,3), 16);
    var g = parseInt(hex.slice(3,5), 16);
    var b = parseInt(hex.slice(5,7), 16);
    r = Math.min(255, Math.round(r + (255 - r) * amount));
    g = Math.min(255, Math.round(g + (255 - g) * amount));
    b = Math.min(255, Math.round(b + (255 - b) * amount));
    return '#' + r.toString(16).padStart(2,'0') + g.toString(16).padStart(2,'0') + b.toString(16).padStart(2,'0');
  },
  
  /**
   * Scurisce un colore hex
   */
  _darken(hex, amount) {
    var r = parseInt(hex.slice(1,3), 16);
    var g = parseInt(hex.slice(3,5), 16);
    var b = parseInt(hex.slice(5,7), 16);
    r = Math.max(0, Math.round(r * (1 - amount)));
    g = Math.max(0, Math.round(g * (1 - amount)));
    b = Math.max(0, Math.round(b * (1 - amount)));
    return '#' + r.toString(16).padStart(2,'0') + g.toString(16).padStart(2,'0') + b.toString(16).padStart(2,'0');
  },

  /**
   * Disegna un singolo frame del player (stile EarthBound 32×32)
   */
  _drawPlayerFrame(ctx, ox, oy, direction, frame, colors) {
    const f = this.FRAME_SIZE; // 32
    const c = colors || this.PALETTE;
    
    // === Animazione camminata ===
    let legFrame = frame; // 0,1,2,3
    let legOffsetX = [0, 2, 0, -2][legFrame];
    let legOffsetY = [0, -1, 0, -1][legFrame];
    let bodyBob = (frame % 2 === 0) ? 0 : 1;
    let armSwing = [0, 3, 0, -3][legFrame];
    
    ctx.save();
    ctx.translate(ox, oy + bodyBob);
    
    // === CAPELLO (fedora) — stile EarthBound, tesa larga ===
    // Tesa del cappello
    ctx.fillStyle = c.hat;
    ctx.fillRect(8, 2, 16, 3); // tesa orizzontale
    // Cupola
    ctx.fillRect(11, -2, 10, 5);
    // Piega cupola
    ctx.fillStyle = c.hatLight;
    ctx.fillRect(13, -1, 6, 3);
    // Fascia
    ctx.fillStyle = c.coatLight;
    ctx.fillRect(11, 2, 10, 1);
    
    // === TESTA (proporzioni chibi, grande) ===
    // Base pelle
    ctx.fillStyle = c.skin;
    ctx.fillRect(10, 4, 12, 10);
    // Ombra sotto cappello
    ctx.fillStyle = c.skinShadow;
    ctx.fillRect(10, 4, 12, 2);
    
    // Faccia (variabile per direzione)
    switch (direction) {
      case 'down':
        // Occhi EarthBound (grandi, espressivi)
        ctx.fillStyle = this.PALETTE.EYE_WHITE;
        ctx.fillRect(12, 7, 3, 3);
        ctx.fillRect(17, 7, 3, 3);
        // Iris
        ctx.fillStyle = this.PALETTE.EYE;
        ctx.fillRect(13, 8, 2, 2);
        ctx.fillRect(18, 8, 2, 2);
        // Sopracciglie
        ctx.fillStyle = this.PALETTE.HAIR;
        ctx.fillRect(12, 6, 3, 1);
        ctx.fillRect(17, 6, 3, 1);
        // Bocca
        ctx.fillStyle = this.PALETTE.MOUTH;
        ctx.fillRect(14, 11, 4, 1);
        // Ombra mento
        ctx.fillStyle = c.skinShadow;
        ctx.fillRect(13, 12, 6, 2);
        break;
        
      case 'up':
        // Schiena — capelli visibili
        ctx.fillStyle = this.PALETTE.HAIR;
        ctx.fillRect(10, 4, 12, 6);
        ctx.fillStyle = this.PALETTE.HAIR_LIGHT;
        ctx.fillRect(11, 5, 10, 4);
        // Collo
        ctx.fillStyle = c.skinShadow;
        ctx.fillRect(13, 10, 6, 2);
        break;
        
      case 'left':
        // Vista laterale sinistra — un occhio
        ctx.fillStyle = this.PALETTE.EYE_WHITE;
        ctx.fillRect(10, 7, 3, 3);
        ctx.fillStyle = this.PALETTE.EYE;
        ctx.fillRect(11, 8, 2, 2);
        ctx.fillStyle = this.PALETTE.HAIR;
        ctx.fillRect(10, 6, 3, 1);
        // Bocca di profilo
        ctx.fillStyle = this.PALETTE.MOUTH;
        ctx.fillRect(11, 11, 2, 1);
        // Capelli lato
        ctx.fillRect(10, 4, 2, 6);
        break;
        
      case 'right':
        // Vista laterale destra — un occhio
        ctx.fillStyle = this.PALETTE.EYE_WHITE;
        ctx.fillRect(19, 7, 3, 3);
        ctx.fillStyle = this.PALETTE.EYE;
        ctx.fillRect(20, 8, 2, 2);
        ctx.fillStyle = this.PALETTE.HAIR;
        ctx.fillRect(19, 6, 3, 1);
        ctx.fillStyle = this.PALETTE.MOUTH;
        ctx.fillRect(21, 11, 2, 1);
        ctx.fillRect(20, 4, 2, 6);
        break;
    }
    
    // === COLLO / CAMICIA ===
    ctx.fillStyle = this.PALETTE.SHIRT;
    ctx.fillRect(13, 14, 6, 3);
    ctx.fillStyle = this.PALETTE.SHIRT_SHADOW;
    ctx.fillRect(14, 15, 4, 2);
    // Colletto
    ctx.fillStyle = this.PALETTE.COLLAR;
    ctx.fillRect(12, 14, 3, 2);
    ctx.fillRect(17, 14, 3, 2);
    // Cravatta
    ctx.fillStyle = this.PALETTE.TIE;
    ctx.fillRect(15, 14, 2, 4);
    ctx.fillStyle = this.PALETTE.TIE_LIGHT;
    ctx.fillRect(15, 14, 2, 2);
    
    // === CORPO (impermeabile trenchcoat) ===
    // Base impermeabile
    ctx.fillStyle = c.coat;
    ctx.fillRect(10, 17, 12, 8);
    // Ombra lato
    ctx.fillStyle = c.coatDark;
    ctx.fillRect(10, 17, 2, 8);
    // Luce lato
    ctx.fillStyle = c.coatLight;
    ctx.fillRect(18, 17, 2, 8);
    // Bottoni
    ctx.fillStyle = c.coatLight;
    ctx.fillRect(15, 18, 2, 1);
    ctx.fillRect(15, 20, 2, 1);
    ctx.fillRect(15, 22, 2, 1);
    // Bavero
    ctx.fillStyle = c.coatLight;
    ctx.fillRect(11, 17, 3, 2);
    ctx.fillRect(18, 17, 3, 2);
    // Tasche
    ctx.fillStyle = c.coatDark;
    ctx.fillRect(11, 21, 3, 3);
    ctx.fillRect(18, 21, 3, 3);
    
    // === BRACCIA ===
    // Braccio sinistro (oscilla con camminata)
    ctx.fillStyle = c.coat;
    ctx.fillRect(7, 17 + armSwing, 3, 8);
    ctx.fillStyle = c.coatDark;
    ctx.fillRect(7, 17 + armSwing, 1, 8);
    // Mano
    ctx.fillStyle = c.skin;
    ctx.fillRect(7, 24 + armSwing, 3, 2);
    
    // Braccio destro (oscilla opposto)
    ctx.fillStyle = c.coat;
    ctx.fillRect(22, 17 - armSwing, 3, 8);
    ctx.fillStyle = c.coatLight;
    ctx.fillRect(24, 17 - armSwing, 1, 8);
    ctx.fillStyle = c.skin;
    ctx.fillRect(22, 24 - armSwing, 3, 2);
    
    // === GAMBE ===
    // Gamba sinistra
    ctx.fillStyle = c.pants;
    ctx.fillRect(11, 25, 4, 5 + legOffsetY);
    ctx.fillRect(11 + legOffsetX, 29 + legOffsetY, 4, 2);
    // Ombra piega
    ctx.fillStyle = c.coatDark;
    ctx.fillRect(11, 25, 1, 5 + legOffsetY);
    
    // Gamba destra
    ctx.fillStyle = c.pants;
    ctx.fillRect(17, 25, 4, 5 - legOffsetY);
    ctx.fillRect(17 - legOffsetX, 29 - legOffsetY, 4, 2);
    ctx.fillStyle = c.coatDark;
    ctx.fillRect(17, 25, 1, 5 - legOffsetY);
    
    // === SCARPE ===
    ctx.fillStyle = this.PALETTE.SHOES;
    ctx.fillRect(10 + legOffsetX, 30 + legOffsetY, 5, 2);
    ctx.fillRect(17 - legOffsetX, 30 - legOffsetY, 5, 2);
    ctx.fillStyle = this.PALETTE.SHOES_LIGHT;
    ctx.fillRect(11 + legOffsetX, 30 + legOffsetY, 3, 1);
    ctx.fillRect(18 - legOffsetX, 30 - legOffsetY, 3, 1);
    
    ctx.restore();
  },

  /**
   * Genera sprite sheet per un NPC (stile EarthBound 32×32)
   * @param {Object} npcData - Dati NPC da npcs.js
   * @returns {HTMLCanvasElement}
   */
  generateNPCSheet(npcData) {
    const canvas = document.createElement('canvas');
    const f = this.FRAME_SIZE; // 32
    canvas.width = f * 2; // 2 frame
    canvas.height = f * 4; // 4 direzioni
    const ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;
    
    const colors = npcData.spriteColors || this._getDefaultNPCColors(npcData.id);
    
    const directions = ['down', 'up', 'left', 'right'];
    
    directions.forEach((dir, dirIndex) => {
      for (let frame = 0; frame < 2; frame++) {
        const ox = frame * f;
        const oy = dirIndex * f;
        this._drawNPCFrame(ctx, ox, oy, dir, frame, colors, npcData);
      }
    });
    
    return canvas;
  },

  /**
   * Colori default per NPC se non specificati
   */
  _getDefaultNPCColors(npcId) {
    var presets = {
      ruggeri:  { body: '#5C5C5C', bodyLight: '#7A7A7A', bodyDark: '#4A4A4A', head: '#F5C6A0', legs: '#3D3025', detail: '#2D3047', accent: '#8B1A1A' },
      teresa:   { body: '#6B4E3D', bodyLight: '#8B6E5D', bodyDark: '#5B3E2D', head: '#F5C6A0', legs: '#3D3025', detail: '#8B7355', accent: '#C4956A' },
      neri:     { body: '#8B7D6B', bodyLight: '#A59785', bodyDark: '#7B6D5B', head: '#F5C6A0', legs: '#3D3025', detail: '#A0A8B0', accent: '#4A5568' },
      valli:    { body: '#4A5568', bodyLight: '#5A6578', bodyDark: '#3A4558', head: '#F5C6A0', legs: '#2D3047', detail: '#3D5A3C', accent: '#D4A843' },
      osvaldo:  { body: '#8B7D6B', bodyLight: '#A59785', bodyDark: '#7B6D5B', head: '#F5C6A0', legs: '#3D3025', detail: '#B8A88A', accent: '#44AA44' },
      gino:     { body: '#5C7A4B', bodyLight: '#7C9A6B', bodyDark: '#4C6A3B', head: '#F5C6A0', legs: '#3D3025', detail: '#A0A8B0', accent: '#D4A843' },
      anselmo:  { body: '#6B5B4F', bodyLight: '#8B7B6F', bodyDark: '#5B4B3F', head: '#F5C6A0', legs: '#3D3025', detail: '#5C5C5C', accent: '#8B7D6B' },
    };
    return presets[npcId] || { body: '#8B7355', bodyLight: '#A59375', bodyDark: '#7B6345', head: '#F5C6A0', legs: '#4A4A4A', detail: '#6B5335', accent: '#D4A843' };
  },

  /**
   * Proprietà corporee per NPC (variazioni fisiche)
   */
  _getNPCBodyProps(npcId) {
    var presets = {
      ruggeri:  { bodyW: 12, bodyH: 9, headY: 3, legH: 5, shoeW: 5, thick: 0 },
      teresa:   { bodyW: 13, bodyH: 8, headY: 5, legH: 4, shoeW: 5, thick: 1 },
      neri:     { bodyW: 11, bodyH: 8, headY: 4, legH: 5, shoeW: 5, thick: 0 },
      valli:    { bodyW: 13, bodyH: 9, headY: 3, legH: 5, shoeW: 5, thick: 1 },
      osvaldo:  { bodyW: 12, bodyH: 8, headY: 4, legH: 5, shoeW: 5, thick: 1 },
      gino:     { bodyW: 11, bodyH: 7, headY: 5, legH: 4, shoeW: 5, thick: 0 },
      anselmo:  { bodyW: 10, bodyH: 7, headY: 5, legH: 4, shoeW: 4, thick: 0 },
    };
    return presets[npcId] || { bodyW: 12, bodyH: 8, headY: 4, legH: 5, shoeW: 5, thick: 0 };
  },

  /**
   * Disegna un frame NPC (stile EarthBound 32×32)
   */
  _drawNPCFrame(ctx, ox, oy, direction, frame, colors, npcData) {
    const f = this.FRAME_SIZE; // 32

    // === Variazioni corporee per NPC ===
    var npcProps = this._getNPCBodyProps(npcData.id);

    // === Animazione camminata ===
    var legSwing = [0, 2, 0, -2][frame % 4];
    var armSwing = [0, 3, 0, -3][frame % 4];
    var bodyBob = (frame % 2 === 0) ? 0 : 1;

    ctx.save();
    ctx.translate(ox, oy + bodyBob);

    // === CAPELLO / COPRICAPO (specifico per NPC) ===
    if (npcData.id === 'ruggeri') {
      // Cappello elegante sindaco
      ctx.fillStyle = colors.detail;
      ctx.fillRect(10, 0, 12, 2); // tesa
      ctx.fillRect(12, -2, 8, 3); // cupola
    } else if (npcData.id === 'teresa') {
      // Scialle/cappello da nonna
      ctx.fillStyle = colors.detail;
      ctx.fillRect(9, 2, 14, 3);
      ctx.fillRect(10, 4, 12, 2); // laterali
    } else if (npcData.id === 'valli') {
      // Cappello militare
      ctx.fillStyle = colors.body;
      ctx.fillRect(9, 0, 14, 2);
      ctx.fillRect(11, -2, 10, 3);
      ctx.fillStyle = colors.accent;
      ctx.fillRect(14, -1, 4, 2); // distintivo
    } else if (npcData.id === 'gino') {
      // Berretto da postino
      ctx.fillStyle = colors.body;
      ctx.fillRect(10, 1, 12, 2);
      ctx.fillRect(12, -1, 8, 3);
      ctx.fillStyle = colors.detail;
      ctx.fillRect(10, 2, 12, 1);
    } else if (npcData.id === 'anselmo') {
      // Cappello largo da vecchio
      ctx.fillStyle = colors.detail;
      ctx.fillRect(7, 1, 18, 2);
      ctx.fillRect(10, -1, 12, 3);
    }
    
    // === TESTA (chibi, grande) ===
    ctx.fillStyle = colors.head;
    ctx.fillRect(10, 4, 12, 10);
    // Ombra
    ctx.fillStyle = '#D4A47A';
    ctx.fillRect(10, 4, 12, 2);
    
    // === FACCIA ===
    switch (direction) {
      case 'down':
        // Occhi EarthBound
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(12, 7, 3, 3);
        ctx.fillRect(17, 7, 3, 3);
        ctx.fillStyle = '#1A1A2A';
        ctx.fillRect(13, 8, 2, 2);
        ctx.fillRect(18, 8, 2, 2);
        // Sopracciglie
        ctx.fillStyle = colors.detail;
        ctx.fillRect(12, 6, 3, 1);
        ctx.fillRect(17, 6, 3, 1);
        // Bocca
        ctx.fillStyle = '#A07060';
        ctx.fillRect(14, 11, 4, 1);
        
        // Dettagli specifici NPC
        if (npcData.id === 'ruggeri') {
          // Occhiali
          ctx.fillStyle = '#333';
          ctx.fillRect(11, 7, 5, 1);
          ctx.fillRect(16, 7, 5, 1);
          ctx.fillRect(15, 7, 2, 1);
        } else if (npcData.id === 'neri') {
          // Pince-nez
          ctx.fillStyle = '#8B8B00';
          ctx.fillRect(11, 8, 5, 1);
          ctx.fillRect(16, 8, 5, 1);
        } else if (npcData.id === 'osvaldo') {
          // Baffi
          ctx.fillStyle = '#5A4030';
          ctx.fillRect(12, 10, 8, 1);
        } else if (npcData.id === 'anselmo') {
          // Rughe
          ctx.fillStyle = '#C4A480';
          ctx.fillRect(12, 5, 8, 1);
          ctx.fillRect(12, 6, 8, 1);
        }
        break;
        
      case 'up':
        // Schiena
        if (npcData.id === 'teresa') {
          ctx.fillStyle = colors.detail;
          ctx.fillRect(10, 4, 12, 6); // scialle
        } else {
          ctx.fillStyle = colors.head;
          ctx.fillRect(10, 4, 12, 6);
        }
        break;
        
      case 'left':
        // Profilo sinistro
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(10, 7, 3, 3);
        ctx.fillStyle = '#1A1A2A';
        ctx.fillRect(11, 8, 2, 2);
        ctx.fillStyle = '#A07060';
        ctx.fillRect(11, 11, 2, 1);
        break;
        
      case 'right':
        // Profilo destro
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(19, 7, 3, 3);
        ctx.fillStyle = '#1A1A2A';
        ctx.fillRect(20, 8, 2, 2);
        ctx.fillStyle = '#A07060';
        ctx.fillRect(21, 11, 2, 1);
        break;
    }
    
    // === CORPO (con shading 3-tone e variazioni NPC) ===
    var bw = npcProps.bodyW;
    var bh = npcProps.bodyH;
    var bx = 16 - bw / 2;
    var by = 17;
    ctx.fillStyle = colors.body;
    ctx.fillRect(bx, by, bw, bh);
    // Ombra laterale
    ctx.fillStyle = colors.bodyDark;
    ctx.fillRect(bx, by, 2, bh);
    // Luce laterale
    ctx.fillStyle = colors.bodyLight;
    ctx.fillRect(bx + bw - 2, by, 2, bh);
    // Ombra inferiore
    ctx.fillStyle = colors.bodyDark;
    ctx.fillRect(bx, by + bh - 1, bw, 1);
    
    // Dettagli specifici NPC sul corpo
    if (npcData.id === 'ruggeri') {
      // Cravatta
      ctx.fillStyle = colors.accent;
      ctx.fillRect(15, 17, 2, 4);
    } else if (npcData.id === 'osvaldo') {
      // Grembiule
      ctx.fillStyle = '#E8E0D0';
      ctx.fillRect(11, 19, 10, 6);
    } else if (npcData.id === 'valli') {
      // Spalline
      ctx.fillStyle = colors.accent;
      ctx.fillRect(10, 17, 3, 2);
      ctx.fillRect(19, 17, 3, 2);
    } else if (npcData.id === 'gino') {
      // Borsa
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(18, 18, 5, 5);
    } else if (npcData.id === 'anselmo') {
      // Giaccone vecchio
      ctx.fillStyle = colors.detail;
      ctx.fillRect(10, 17, 12, 1);
    }
    
    // === BRACCIA (con animazione oscilazione) ===
    ctx.fillStyle = colors.body;
    ctx.fillRect(7, by + armSwing, 3, 7);
    ctx.fillRect(22, by - armSwing, 3, 7);
    // Mani
    ctx.fillStyle = colors.head;
    ctx.fillRect(7, by + 6 + armSwing, 3, 2);
    ctx.fillRect(22, by + 6 - armSwing, 3, 2);
    
    // === GAMBE (con animazione camminata) ===
    var legY = by + bh;
    var lh = npcProps.legH;
    ctx.fillStyle = colors.legs;
    ctx.fillRect(11, legY, 4, lh + legSwing / 2);
    ctx.fillRect(17, legY, 4, lh - legSwing / 2);
    // Ombra piega
    ctx.fillStyle = colors.bodyDark;
    ctx.fillRect(11, legY, 1, lh + legSwing / 2);
    ctx.fillRect(17, legY, 1, lh - legSwing / 2);
    // Piedi (suola + tomaia)
    ctx.fillStyle = '#1A1510';
    ctx.fillRect(10, legY + lh + legSwing / 2, npcProps.shoeW, 2);
    ctx.fillRect(17, legY + lh - legSwing / 2, npcProps.shoeW, 2);
    ctx.fillStyle = '#2A2015';
    ctx.fillRect(11, legY + lh + legSwing / 2, 3, 1);
    ctx.fillRect(18, legY + lh - legSwing / 2, 3, 1);
    
    // Bastone per Anselmo
    if (npcData.id === 'anselmo') {
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(6, 15, 2, 16);
      ctx.fillRect(5, 14, 4, 2);
    }
    
    ctx.restore();
  },

  /**
   * Genera background procedurale per un'area
   * @param {string} areaId - ID area
   * @param {Object} areaData - Dati area da areas.js
   * @returns {HTMLCanvasElement} Canvas 400x250
   */
  generateBackground(areaId, areaData) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 250;
    const ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;
    
    // Sfondo base
    const skyColors = {
      piazze: ['#1a1a2e', '#16213e', '#0f3460'],
      chiesa: ['#1a1a2e', '#16213e', '#0f3460'],
      cimitero: ['#0a0a1a', '#1a1a2a', '#0a1a2a'],
      giardini: ['#1a2a1a', '#2a3a2a', '#1a3a1a'],
      bar_exterior: ['#2a1a0a', '#3a2a1a', '#4a3a2a'],
      residenziale: ['#1a1a2e', '#2a2a3e', '#3a3a4e'],
      industriale: ['#2d1b0e', '#3d2b1e', '#4d3b2e'],
      polizia: ['#0a0a1a', '#1a1a2a', '#2a2a3a']
    };
    
    const colors = skyColors[areaId] || ['#1a1a2e', '#16213e', '#0f3460'];
    
    // Gradiente cielo
    const gradient = ctx.createLinearGradient(0, 0, 0, 250);
    gradient.addColorStop(0, colors[0]);
    gradient.addColorStop(0.5, colors[1]);
    gradient.addColorStop(1, colors[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 250);
    
    // Disegna elementi specifici per area
    switch (areaId) {
      case 'piazze':
        this._drawPiazza(ctx);
        break;
    }
    
    return canvas;
  },

  _drawPiazza(ctx) {
    // Cielo notturno con gradiente profondo
    var skyGrad = ctx.createLinearGradient(0, 0, 0, 120);
    skyGrad.addColorStop(0, '#0a0a1a');
    skyGrad.addColorStop(0.5, '#151530');
    skyGrad.addColorStop(1, '#1a1a3a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 400, 120);
    
    // Stelle con scintillio
    ctx.fillStyle = '#FFFFFF';
    for (var i = 0; i < 60; i++) {
      var sx = (i * 67 + 13) % 400;
      var sy = (i * 31 + 7) % 100;
      var brightness = (i * 7) % 3 === 0 ? 2 : 1;
      ctx.globalAlpha = 0.3 + ((i * 13) % 7) * 0.1;
      ctx.fillRect(sx, sy, brightness, brightness);
    }
    ctx.globalAlpha = 1;
    
    // Luna crescente
    ctx.fillStyle = '#FFE4B5';
    ctx.beginPath(); ctx.arc(340, 25, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#0a0a1a';
    ctx.beginPath(); ctx.arc(345, 22, 11, 0, Math.PI * 2); ctx.fill();
    
    // Edifici sullo sfondo (layer lontano)
    ctx.fillStyle = '#1a1a2a';
    ctx.fillRect(10, 15, 90, 110);
    ctx.fillRect(110, 25, 70, 100);
    ctx.fillRect(190, 20, 80, 105);
    ctx.fillRect(280, 18, 100, 107);
    ctx.fillRect(390, 22, 10, 103);
    
    // Dettagli edifici (gronde, cornici)
    ctx.fillStyle = '#252535';
    ctx.fillRect(10, 15, 90, 3);
    ctx.fillRect(110, 25, 70, 3);
    ctx.fillRect(190, 20, 80, 3);
    ctx.fillRect(280, 18, 100, 3);
    
    // Campane e dettagli architettonici
    ctx.fillStyle = '#2a2a3a';
    ctx.fillRect(50, 5, 15, 12); // campanello
    ctx.fillRect(330, 8, 12, 12); // campanello
    
    // Finestre illuminate (luci calde)
    ctx.fillStyle = '#FFAA44';
    // Edificio 1
    ctx.fillRect(25, 35, 10, 12);
    ctx.fillRect(50, 35, 10, 12);
    ctx.fillRect(25, 60, 10, 12);
    ctx.fillRect(50, 60, 10, 12);
    ctx.fillRect(25, 85, 10, 12);
    // Edificio 2
    ctx.fillRect(125, 45, 8, 10);
    ctx.fillRect(145, 45, 8, 10);
    ctx.fillRect(125, 70, 8, 10);
    // Edificio 3
    ctx.fillRect(205, 40, 10, 12);
    ctx.fillRect(230, 40, 10, 12);
    ctx.fillRect(205, 65, 10, 12);
    ctx.fillRect(230, 65, 10, 12);
    // Edificio 4
    ctx.fillRect(295, 38, 10, 12);
    ctx.fillRect(320, 38, 10, 12);
    ctx.fillRect(350, 38, 10, 12);
    ctx.fillRect(295, 63, 10, 12);
    ctx.fillRect(320, 63, 10, 12);
    
    // Luce calda delle finestre (alone)
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#FFAA44';
    ctx.fillRect(23, 33, 14, 16);
    ctx.fillRect(48, 33, 14, 16);
    ctx.fillRect(123, 43, 12, 14);
    ctx.fillRect(203, 38, 14, 16);
    ctx.fillRect(293, 36, 14, 16);
    ctx.globalAlpha = 1;
    
    // Pavimentazione ciottoli (layer vicino)
    ctx.fillStyle = '#2a2a3a';
    ctx.fillRect(0, 120, 400, 130);
    
    // Ciottoli individuali con variazioni
    var stoneColors = ['#3a3a4a', '#353545', '#3f3f4f', '#333343'];
    for (var y = 122; y < 250; y += 8) {
      for (var x = 0; x < 400; x += 12) {
        var offset = (Math.floor(y / 8) % 2) * 6;
        ctx.fillStyle = stoneColors[(x + y) % 4];
        ctx.fillRect(x + offset, y, 10, 6);
        // Bordo ciottolo
        ctx.fillStyle = '#252535';
        ctx.fillRect(x + offset, y + 6, 10, 1);
      }
    }
    
    // Fontana centrale con acqua
    ctx.fillStyle = '#4a5a6a';
    ctx.fillRect(170, 100, 60, 60);
    ctx.fillStyle = '#3a4a5a';
    ctx.fillRect(172, 102, 56, 56);
    ctx.fillStyle = '#2a4a6a';
    ctx.fillRect(180, 110, 40, 40);
    ctx.fillStyle = '#3a6a9a';
    ctx.fillRect(190, 120, 20, 20);
    
    // Riflessi acqua
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#5a8aba';
    ctx.fillRect(192, 122, 4, 4);
    ctx.fillRect(200, 126, 3, 3);
    ctx.globalAlpha = 1;
    
    // Pilastro fontana
    ctx.fillStyle = '#5a6a7a';
    ctx.fillRect(197, 115, 6, 10);
    
    // Lampioni con luce
    this._drawLampPost(ctx, 60, 80);
    this._drawLampPost(ctx, 200, 85);
    this._drawLampPost(ctx, 340, 82);
    
    // Nebbia bassa
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#8888aa';
    for (var n = 0; n < 8; n++) {
      var nx = (n * 55 + Date.now() * 0.001) % 420 - 10;
      ctx.fillRect(nx, 110 + (n % 3) * 15, 40, 8);
    }
    ctx.globalAlpha = 1;
  },
  
  _drawLampPost(ctx, x, y) {
    // Palo
    ctx.fillStyle = '#2a2a3a';
    ctx.fillRect(x, y, 3, 40);
    // Lanterna
    ctx.fillStyle = '#3a3a4a';
    ctx.fillRect(x - 3, y - 5, 9, 8);
    // Luce
    ctx.fillStyle = '#FFAA44';
    ctx.fillRect(x - 1, y - 3, 5, 4);
    // Alone luminoso
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#FFAA44';
    ctx.beginPath();
    ctx.arc(x + 1, y, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.08;
    ctx.beginPath();
    ctx.arc(x + 1, y + 10, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  },

  _drawArchivio(ctx) {
    // Pareti con carta da parati scura
    ctx.fillStyle = '#2a1a0a';
    ctx.fillRect(0, 0, 400, 100);
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(0, 0, 400, 5);
    ctx.fillStyle = '#4a3a2a';
    ctx.fillRect(0, 95, 400, 5);
    
    // Pavimento legno invecchiato
    ctx.fillStyle = '#2a1a0a';
    ctx.fillRect(0, 100, 400, 150);
    for (var y = 100; y < 250; y += 20) {
      ctx.fillStyle = '#3a2a1a';
      ctx.fillRect(0, y, 400, 18);
      ctx.fillStyle = '#2a1a0a';
      ctx.fillRect(0, y + 18, 400, 2);
      // Venature
      ctx.fillStyle = '#352515';
      for (var x = 0; x < 400; x += 80) {
        ctx.fillRect(x + (y % 40), y + 2, 30, 14);
      }
    }
    
    // Scaffali a parete (sinistro)
    ctx.fillStyle = '#4a3a2a';
    ctx.fillRect(10, 10, 120, 180);
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(15, 15, 110, 170);
    
    // Ripiani
    ctx.fillStyle = '#6a5a4a';
    for (var rs = 0; rs < 6; rs++) {
      ctx.fillRect(15, 30 + rs * 28, 110, 3);
    }
    
    // Libri colorati sugli scaffali
    var bookColors = ['#8B0000', '#006400', '#00008B', '#8B8B00', '#4B0082', '#8B4513', '#2F4F4F'];
    for (var shelf = 0; shelf < 6; shelf++) {
      for (var i = 0; i < 9; i++) {
        ctx.fillStyle = bookColors[(shelf * 9 + i) % bookColors.length];
        var bx = 20 + i * 12;
        var by = 18 + shelf * 28;
        var bh = 20 + (i % 3) * 3;
        ctx.fillRect(bx, by, 10, bh);
        // Dorso libro
        ctx.fillStyle = bookColors[(shelf * 9 + i) % bookColors.length] + 'AA';
        ctx.fillRect(bx + 1, by + 2, 8, bh - 4);
        // Titolo
        ctx.fillStyle = '#F5F5DC';
        ctx.fillRect(bx + 2, by + 4, 6, 3);
      }
    }
    
    // Scaffali a parete (destro)
    ctx.fillStyle = '#4a3a2a';
    ctx.fillRect(270, 10, 120, 180);
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(275, 15, 110, 170);
    
    ctx.fillStyle = '#6a5a4a';
    for (var rd = 0; rd < 6; rd++) {
      ctx.fillRect(275, 30 + rd * 28, 110, 3);
    }
    
    for (var shelf2 = 0; shelf2 < 6; shelf2++) {
      for (var i2 = 0; i2 < 9; i2++) {
        ctx.fillStyle = bookColors[(shelf2 * 9 + i2 + 3) % bookColors.length];
        var bx2 = 280 + i2 * 12;
        var by2 = 18 + shelf2 * 28;
        var bh2 = 20 + (i2 % 3) * 3;
        ctx.fillRect(bx2, by2, 10, bh2);
        ctx.fillStyle = bookColors[(shelf2 * 9 + i2 + 3) % bookColors.length] + 'AA';
        ctx.fillRect(bx2 + 1, by2 + 2, 8, bh2 - 4);
      }
    }
    
    // Scrivania centrale
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(140, 140, 120, 70);
    ctx.fillStyle = '#6a5a4a';
    ctx.fillRect(145, 145, 110, 60);
    // Top scrivania
    ctx.fillStyle = '#7a6a5a';
    ctx.fillRect(140, 140, 120, 5);
    
    // Oggetti sulla scrivania
    // Pratica/file
    ctx.fillStyle = '#F5F5DC';
    ctx.fillRect(155, 155, 20, 15);
    ctx.fillStyle = '#E8E0D0';
    ctx.fillRect(156, 156, 18, 13);
    // Testo pratica
    ctx.fillStyle = '#333333';
    ctx.fillRect(158, 158, 14, 2);
    ctx.fillRect(158, 162, 14, 1);
    ctx.fillRect(158, 165, 10, 1);
    
    // Macchina da scrivere
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(220, 158, 30, 18);
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(222, 160, 26, 14);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(225, 162, 20, 8);
    
    // Lampada da scrivania
    ctx.fillStyle = '#2a2a2a';
    ctx.fillRect(270, 150, 3, 15);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(265, 148, 14, 6);
    // Luce
    ctx.fillStyle = '#FFAA44';
    ctx.fillRect(267, 154, 10, 3);
    // Alone luminoso
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = '#FFAA44';
    ctx.beginPath();
    ctx.arc(272, 165, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.08;
    ctx.beginPath();
    ctx.arc(272, 175, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // Sedie
    ctx.fillStyle = '#4a3a2a';
    ctx.fillRect(160, 215, 15, 20);
    ctx.fillRect(230, 215, 15, 20);
    
    // Mappa al muro
    ctx.fillStyle = '#D4A84B';
    ctx.fillRect(150, 10, 100, 60);
    ctx.fillStyle = '#C4983B';
    ctx.fillRect(152, 12, 96, 56);
    // Dettagli mappa
    ctx.fillStyle = '#2a4a2a';
    ctx.fillRect(160, 20, 30, 20);
    ctx.fillRect(200, 30, 25, 15);
    ctx.fillStyle = '#4a6a8a';
    ctx.fillRect(170, 45, 20, 15);
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(210, 20, 15, 10);
    // Bordo mappa
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(150, 10, 100, 2);
    ctx.fillRect(150, 68, 100, 2);
  },

  _drawCascina(ctx) {
    // Cielo serale
    var skyGrad = ctx.createLinearGradient(0, 0, 0, 150);
    skyGrad.addColorStop(0, '#1a1a3a');
    skyGrad.addColorStop(0.5, '#2a2a4a');
    skyGrad.addColorStop(1, '#3a3a5a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 400, 150);
    
    // Stelle
    ctx.fillStyle = '#FFFFFF';
    for (var i = 0; i < 40; i++) {
      ctx.globalAlpha = 0.2 + (i % 5) * 0.15;
      ctx.fillRect((i * 61 + 10) % 400, (i * 29 + 5) % 120, 1, 1);
    }
    ctx.globalAlpha = 1;
    
    // Colline lontane
    ctx.fillStyle = '#1a2a1a';
    ctx.beginPath();
    ctx.moveTo(0, 130);
    ctx.quadraticCurveTo(100, 80, 200, 110);
    ctx.quadraticCurveTo(300, 90, 400, 120);
    ctx.lineTo(400, 150);
    ctx.lineTo(0, 150);
    ctx.fill();
    
    // Alberi sullo sfondo
    ctx.fillStyle = '#0f1f0f';
    for (var t = 0; t < 8; t++) {
      var tx = t * 55 + 10;
      ctx.fillRect(tx, 100, 8, 50);
      ctx.fillRect(tx - 5, 95, 18, 15);
      ctx.fillRect(tx - 3, 88, 14, 10);
    }
    
    // Erba con variazioni
    ctx.fillStyle = '#1a3a1a';
    ctx.fillRect(0, 140, 400, 110);
    var grassColors = ['#1a3a1a', '#1f3f1f', '#153515', '#1e3e1e'];
    for (var gy = 140; gy < 250; gy += 4) {
      for (var gx = 0; gx < 400; gx += 6) {
        ctx.fillStyle = grassColors[(gx + gy) % 4];
        ctx.fillRect(gx, gy, 4, 3);
      }
    }
    
    // Sentiero di ghiaia
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(170, 180, 60, 70);
    ctx.fillStyle = '#4a4a4a';
    for (var s = 0; s < 30; s++) {
      ctx.fillRect(172 + (s * 7) % 56, 182 + (s * 11) % 66, 4, 3);
    }
    
    // Cascina principale
    ctx.fillStyle = '#6a5a4a';
    ctx.fillRect(100, 50, 200, 130);
    ctx.fillStyle = '#7a6a5a';
    ctx.fillRect(105, 55, 190, 120);
    
    // Texture muro (mattoni)
    ctx.fillStyle = '#6a5a4a';
    for (var by = 55; by < 175; by += 10) {
      for (var bx = 105; bx < 295; bx += 20) {
        if ((by + bx) % 40 === 0) {
          ctx.fillStyle = '#655545';
          ctx.fillRect(bx, by, 18, 8);
        }
      }
    }
    
    // Tetto in tegole
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(90, 30, 220, 25);
    ctx.fillStyle = '#9B5523';
    for (var ty = 30; ty < 55; ty += 5) {
      for (var tx = 90; tx < 310; tx += 10) {
        ctx.fillRect(tx + (ty % 2) * 5, ty, 8, 4);
      }
    }
    
    // Camino con fumo
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(250, 10, 20, 30);
    ctx.fillStyle = '#6a6a6a';
    ctx.globalAlpha = 0.3;
    for (var sm = 0; sm < 5; sm++) {
      ctx.fillRect(252 + sm * 3, 5 - sm * 8, 8 + sm * 2, 6);
    }
    ctx.globalAlpha = 1;
    
    // Porta principale
    ctx.fillStyle = '#4a3a2a';
    ctx.fillRect(180, 100, 40, 70);
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(183, 103, 34, 64);
    // Maniglia
    ctx.fillStyle = '#8B8B00';
    ctx.fillRect(208, 135, 4, 4);
    // Architrave
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(178, 98, 44, 5);
    
    // Finestre illuminate
    ctx.fillStyle = '#FFAA44';
    ctx.fillRect(130, 80, 25, 25);
    ctx.fillRect(245, 80, 25, 25);
    // Inferriate
    ctx.fillStyle = '#4a3a2a';
    ctx.fillRect(142, 80, 2, 25);
    ctx.fillRect(130, 92, 25, 2);
    ctx.fillRect(257, 80, 2, 25);
    ctx.fillRect(245, 92, 25, 2);
    // Aloni luce
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = '#FFAA44';
    ctx.fillRect(125, 75, 35, 35);
    ctx.fillRect(240, 75, 35, 35);
    ctx.globalAlpha = 1;
    
    // Fiori ai lati della porta
    ctx.fillStyle = '#FF69B4';
    ctx.fillRect(175, 160, 3, 3);
    ctx.fillRect(222, 160, 3, 3);
    ctx.fillStyle = '#FF1493';
    ctx.fillRect(173, 165, 3, 3);
    ctx.fillRect(224, 165, 3, 3);
  },

  _drawCampo(ctx) {
    // Cielo notturno profondo
    var skyGrad = ctx.createLinearGradient(0, 0, 0, 150);
    skyGrad.addColorStop(0, '#050510');
    skyGrad.addColorStop(0.5, '#0a0a20');
    skyGrad.addColorStop(1, '#0f0f2a');
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, 400, 150);
    
    // Stelle dense
    ctx.fillStyle = '#FFFFFF';
    for (var i = 0; i < 80; i++) {
      var sx = (i * 53 + 17) % 400;
      var sy = (i * 29 + 3) % 130;
      ctx.globalAlpha = 0.2 + ((i * 11) % 8) * 0.08;
      ctx.fillRect(sx, sy, (i % 5 === 0) ? 2 : 1, (i % 5 === 0) ? 2 : 1);
    }
    ctx.globalAlpha = 1;
    
    // Via Lattea
    ctx.globalAlpha = 0.05;
    ctx.fillStyle = '#AABBCC';
    ctx.beginPath();
    ctx.moveTo(0, 30);
    ctx.quadraticCurveTo(100, 20, 200, 40);
    ctx.quadraticCurveTo(300, 60, 400, 35);
    ctx.lineTo(400, 55);
    ctx.quadraticCurveTo(300, 80, 200, 60);
    ctx.quadraticCurveTo(100, 40, 0, 50);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    // Luna
    ctx.fillStyle = '#FFE4B5';
    ctx.beginPath(); ctx.arc(320, 30, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#050510';
    ctx.beginPath(); ctx.arc(326, 26, 13, 0, Math.PI * 2); ctx.fill();
    
    // Montagne lontane
    ctx.fillStyle = '#0a0a1a';
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(50, 100);
    ctx.lineTo(120, 120);
    ctx.lineTo(200, 80);
    ctx.lineTo(280, 110);
    ctx.lineTo(350, 90);
    ctx.lineTo(400, 130);
    ctx.lineTo(400, 150);
    ctx.fill();
    
    // Terreno con erba
    ctx.fillStyle = '#0f1a0f';
    ctx.fillRect(0, 150, 400, 100);
    
    // File di grano con profondità
    for (var row = 0; row < 12; row++) {
      var rowY = 155 + row * 8;
      var scale = 0.5 + (row / 12) * 0.5;
      ctx.fillStyle = '#1a2a1a';
      for (var col = 0; col < 40; col++) {
        var colX = col * 12 + (row % 2) * 6;
        var height = 6 + scale * 8;
        ctx.fillRect(colX, rowY - height, 3, height);
        // Spiga
        ctx.fillStyle = '#2a3a1a';
        ctx.fillRect(colX, rowY - height - 2, 3, 3);
        ctx.fillStyle = '#1a2a1a';
      }
    }
    
    // Lucciole animate con movimento organico
    ctx.fillStyle = '#FFFF88';
    for (var f = 0; f < 25; f++) {
      var fx = (f * 47 + Math.sin(Date.now() * 0.001 + f) * 10) % 400;
      var fy = 160 + (f * 31) % 80 + Math.cos(Date.now() * 0.0008 + f * 2) * 5;
      var blink = Math.sin(Date.now() * 0.005 + f * 3) > 0 ? 1 : 0;
      if (blink) {
        ctx.globalAlpha = 0.6 + Math.sin(Date.now() * 0.003 + f) * 0.3;
        ctx.fillRect(fx, fy, 2, 2);
        // Alone
        ctx.globalAlpha = 0.15;
        ctx.fillRect(fx - 1, fy - 1, 4, 4);
      }
    }
    ctx.globalAlpha = 1;
    
    // Sentiero di terra
    ctx.fillStyle = '#1a1510';
    ctx.fillRect(180, 150, 30, 100);
    ctx.fillStyle = '#252015';
    ctx.fillRect(182, 150, 26, 100);
  },

  _drawBar(ctx) {
    // Pareti con carta da parati
    ctx.fillStyle = '#3a2a1a';
    ctx.fillRect(0, 0, 400, 100);
    ctx.fillStyle = '#4a3a2a';
    ctx.fillRect(0, 0, 400, 5);
    // Bordura
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(0, 95, 400, 5);
    
    // Pavimento legno invecchiato
    ctx.fillStyle = '#2a1a0a';
    ctx.fillRect(0, 100, 400, 150);
    for (var y = 100; y < 250; y += 16) {
      ctx.fillStyle = '#3a2a1a';
      ctx.fillRect(0, y, 400, 14);
      ctx.fillStyle = '#2a1a0a';
      ctx.fillRect(0, y + 14, 400, 2);
      // Venature legno
      ctx.fillStyle = '#352515';
      for (var x = 0; x < 400; x += 60 + (y % 30)) {
        ctx.fillRect(x, y + 2, 20, 10);
      }
    }
    
    // Scaffale dietro il bancone
    ctx.fillStyle = '#4a3a2a';
    ctx.fillRect(20, 10, 360, 80);
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(25, 15, 350, 70);
    
    // Ripiani
    ctx.fillStyle = '#6a5a4a';
    ctx.fillRect(25, 35, 350, 3);
    ctx.fillRect(25, 60, 350, 3);
    
    // Bottiglie colorate sugli scaffali
    var bottleColors = ['#8B0000', '#006400', '#8B8B00', '#4B0082', '#FF6600', '#006666'];
    for (var shelf = 0; shelf < 3; shelf++) {
      for (var i = 0; i < 15; i++) {
        ctx.fillStyle = bottleColors[(shelf * 15 + i) % bottleColors.length];
        var bx = 30 + i * 23;
        var by = 18 + shelf * 25;
        ctx.fillRect(bx, by, 8, 18);
        // Collo bottiglia
        ctx.fillStyle = bottleColors[(shelf * 15 + i) % bottleColors.length] + 'AA';
        ctx.fillRect(bx + 2, by - 4, 4, 5);
        // Etichetta
        ctx.fillStyle = '#F5F5DC';
        ctx.fillRect(bx + 1, by + 8, 6, 5);
      }
    }
    
    // Bicchieri sul ripiano
    ctx.fillStyle = '#AADDFF';
    ctx.globalAlpha = 0.5;
    for (var g = 0; g < 6; g++) {
      ctx.fillRect(30 + g * 60, 72, 6, 10);
      ctx.fillRect(31 + g * 60, 73, 4, 8);
    }
    ctx.globalAlpha = 1;
    
    // Bancone principale
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(30, 120, 340, 80);
    ctx.fillStyle = '#6a5a4a';
    ctx.fillRect(35, 125, 330, 70);
    // Top bancone
    ctx.fillStyle = '#7a6a5a';
    ctx.fillRect(30, 120, 340, 5);
    
    // Poggia-bicchieri sul bancone
    ctx.fillStyle = '#8a7a6a';
    for (var p = 0; p < 5; p++) {
      ctx.fillRect(80 + p * 65, 140, 12, 2);
    }
    
    // Macchina del caffe'
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(320, 130, 25, 30);
    ctx.fillStyle = '#5a5a5a';
    ctx.fillRect(322, 132, 21, 26);
    ctx.fillStyle = '#FFAA44';
    ctx.fillRect(328, 138, 8, 6);
    
    // Luci pendenti con alone
    for (var l = 0; l < 4; l++) {
      var lx = 80 + l * 90;
      // Cavo
      ctx.fillStyle = '#2a2a2a';
      ctx.fillRect(lx, 0, 1, 25);
      // Paralume
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(lx - 6, 25, 14, 8);
      // Luce
      ctx.fillStyle = '#FFAA44';
      ctx.fillRect(lx - 3, 33, 8, 4);
      // Alone luminoso
      ctx.globalAlpha = 0.12;
      ctx.fillStyle = '#FFAA44';
      ctx.beginPath();
      ctx.arc(lx, 50, 25, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 0.05;
      ctx.beginPath();
      ctx.arc(lx, 70, 35, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    
    // Tavolini
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(60, 180, 30, 30);
    ctx.fillRect(200, 190, 30, 30);
    ctx.fillRect(320, 185, 30, 30);
    // Sedie
    ctx.fillStyle = '#4a3a2a';
    ctx.fillRect(55, 215, 10, 15);
    ctx.fillRect(95, 215, 10, 15);
    ctx.fillRect(195, 225, 10, 15);
    ctx.fillRect(235, 225, 10, 15);
    
    // Poster sul muro
    ctx.fillStyle = '#F5F5DC';
    ctx.fillRect(150, 15, 30, 40);
    ctx.fillStyle = '#8B0000';
    ctx.fillRect(152, 17, 26, 8);
    ctx.fillStyle = '#006400';
    ctx.fillRect(152, 27, 26, 8);
    ctx.fillStyle = '#00008B';
    ctx.fillRect(152, 37, 26, 8);
  },

  _drawMunicipio(ctx) {
    // Pavimento marmo
    ctx.fillStyle = '#4a4a5a';
    for (let y = 0; y < 250; y += 32) {
      for (let x = 0; x < 400; x += 32) {
        ctx.fillRect(x, y, 30, 30);
        ctx.fillStyle = '#5a5a6a';
        ctx.fillRect(x + 1, y + 1, 28, 28);
        ctx.fillStyle = '#4a4a5a';
      }
    }
    
    // Bandiera italiana
    ctx.fillStyle = '#008B00';
    ctx.fillRect(100, 30, 30, 60);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(130, 30, 30, 60);
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(160, 30, 30, 60);
    
    // Stemma
    ctx.fillStyle = '#8B8B00';
    ctx.fillRect(250, 40, 80, 80);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(260, 50, 60, 60);
  },

  _drawCascinaInterno(ctx) {
    // Pareti
    ctx.fillStyle = '#4a3a2a';
    ctx.fillRect(0, 0, 400, 250);
    
    // Travi
    ctx.fillStyle = '#3a2a1a';
    for (let x = 0; x < 400; x += 80) {
      ctx.fillRect(x, 0, 10, 250);
    }
    
    // Tavolo
    ctx.fillStyle = '#5a4a3a';
    ctx.fillRect(120, 120, 160, 80);
    
    // Sedie
    ctx.fillStyle = '#4a3a2a';
    ctx.fillRect(100, 140, 20, 40);
    ctx.fillRect(280, 140, 20, 40);
  },

  _drawMonteFerro(ctx) {
    // Cielo notturno
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, 400, 250);
    
    // Stelle
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < 50; i++) {
      ctx.fillRect(Math.random() * 400, Math.random() * 150, 1, 1);
    }
    
    // Montagne
    ctx.fillStyle = '#1a1a2a';
    ctx.beginPath();
    ctx.moveTo(0, 250);
    ctx.lineTo(100, 80);
    ctx.lineTo(200, 150);
    ctx.lineTo(300, 60);
    ctx.lineTo(400, 250);
    ctx.fill();
    
    // Miniera
    ctx.fillStyle = '#2a2a3a';
    ctx.fillRect(250, 100, 60, 80);
    ctx.fillStyle = '#1a1a2a';
    ctx.fillRect(270, 120, 20, 60);
  },

  /**
   * Genera spritesheet icone indizi
   * @param {Array} clues - Array di oggetti indizio
   * @returns {HTMLCanvasElement}
   */
  generateClueIcons(clues) {
    const canvas = document.createElement('canvas');
    const f = this.FRAME_SIZE;
    canvas.width = f * clues.length;
    canvas.height = f;
    const ctx = canvas.getContext('2d');
    
    ctx.imageSmoothingEnabled = false;
    
    const iconColors = {
      registro: '#8B4513',
      mappa: '#DAA520',
      frammento: '#696969',
      simboli: '#4B0082',
      lanterna: '#FFD700',
      diario: '#8B0000',
      tracce: '#2E8B57',
      lettera: '#F5F5DC',
      radio: '#4682B4',
      nastro: '#DC143C'
    };
    
    clues.forEach((clue, index) => {
      const ox = index * f;
      const color = iconColors[clue.id] || '#888888';
      
      // Sfondo
      ctx.fillStyle = '#2a2a3a';
      ctx.fillRect(ox, 0, f, f);
      
      // Icona base (cerchio con simbolo)
      ctx.fillStyle = color;
      ctx.fillRect(ox + 3, 3, 10, 10);
      
      // Bordo
      ctx.fillStyle = '#4a4a5a';
      ctx.fillRect(ox + 2, 2, 12, 1);
      ctx.fillRect(ox + 2, 13, 12, 1);
      ctx.fillRect(ox + 2, 2, 1, 12);
      ctx.fillRect(ox + 13, 2, 1, 12);
      
      // Simbolo interno
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(ox + 6, 6, 4, 4);
    });
    
    return canvas;
  }
};

// Esporta per uso globale
if (typeof window !== 'undefined') {
  window.SpriteGenerator = SpriteGenerator;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = SpriteGenerator;
}
