"use strict";

/* ═══════════════════════════════════════════════════════════════════════════════
   BUILDING RENDERERS
   Renderers dettagliati per edifici stile EarthBound
   ═══════════════════════════════════════════════════════════════════════════════ */

var BuildingRenderers = {
  /** Municipio — orologio, stemma, gradini, persiane, crepe, bandiera */
  drawMunicipio: function(ctx, x, y, w, h, t) {
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
    ctx.fillRect(x+w/2-1, y-5, 2, 4);
    ctx.fillRect(x+w/2-2, y-4, 4, 2);
    
    // Stemma sopra portone
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+w/2-6, y+8, 12, 10);
    ctx.fillStyle = PALETTE.burntOrange;
    ctx.fillRect(x+w/2-4, y+10, 8, 6);
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.fillRect(x+w/2-1, y+11, 2, 4);
    
    // Portone centrale con vetri
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x+w/2-8, y+h-30, 16, 28);
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+w/2-6, y+h-28, 12, 24);
    ctx.fillStyle = 'rgba(100,140,200,0.4)';
    ctx.fillRect(x+w/2-4, y+h-26, 4, 10);
    ctx.fillRect(x+w/2, y+h-26, 4, 10);
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
      var persianeAperte = (wi % 2 === 1);
      var persianaSwing = Math.sin(t*0.5 + wi)*0.5;
      
      if(!persianeAperte) {
        ctx.fillStyle = '#4A5568';
        ctx.fillRect(win.x-3, win.y, 3, win.h);
        ctx.fillRect(win.x+win.w, win.y, 3, win.h);
        ctx.fillStyle = '#3A4558';
        ctx.fillRect(win.x-2, win.y+2, 1, win.h-4);
        ctx.fillRect(win.x+win.w+1, win.y+2, 1, win.h-4);
      } else {
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
      
      ctx.fillStyle = PALETTE.nightBlue;
      ctx.fillRect(win.x, win.y, win.w, win.h);
      var lightPulse = 0.6 + Math.sin(t*2 + wi)*0.2;
      ctx.fillStyle = 'rgba(212,168,67,' + lightPulse.toFixed(2) + ')';
      ctx.fillRect(win.x+2, win.y+2, win.w-4, win.h-4);
      ctx.fillStyle = PALETTE.earthBrown;
      ctx.fillRect(win.x, win.y, win.w, 2);
      ctx.fillRect(win.x, win.y, 2, win.h);
      ctx.fillRect(win.x+win.w-2, win.y, 2, win.h);
      ctx.fillRect(win.x, win.y+win.h-2, win.w, 2);
      ctx.fillRect(win.x+win.w/2-1, win.y, 2, win.h);
      ctx.fillRect(win.x, win.y+win.h/2-1, win.w, 2);
    }
    
    // Balcone
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+w/2-10, y+h-34, 20, 3);
    for(var ri=0; ri<5; ri++) {
      ctx.fillRect(x+w/2-9+ri*4, y+h-40, 1, 7);
    }
    ctx.fillRect(x+w/2-10, y+h-40, 20, 2);
    
    // Bandiera italiana
    ctx.fillStyle = '#008000';
    ctx.fillRect(x+w+2, y+10, 4, 12);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x+w+6, y+10, 4, 12);
    ctx.fillStyle = '#CC0000';
    ctx.fillRect(x+w+10, y+10, 4, 12);
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+w+1, y+8, 2, 16);
  },

  /** Bar — tenda a righe con onde animate, sedie, insegna, lavagna, fiori */
  drawBar: function(ctx, x, y, w, h, t) {
    ctx.fillStyle = PALETTE.fadedBeige;
    ctx.fillRect(x, y, w, h);
    
    for(var i=0; i<18; i++) {
      var tx = x + (i*13)%w;
      var ty = y + (i*11)%(h-10);
      ctx.fillStyle = (i%3===0) ? 'rgba(180,168,138,0.3)' : 'rgba(160,148,118,0.2)';
      ctx.fillRect(tx, ty, 2, 2);
    }
    
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x-2, y-4, w+4, 6);
    
    var signPulse = 0.7 + Math.sin(t*3)*0.3;
    ctx.fillStyle = '#CC0000';
    ctx.fillRect(x+w/2-20, y-14, 40, 12);
    ctx.fillStyle = 'rgba(204,0,0,0.3)';
    ctx.fillRect(x+w/2-22, y-16, 44, 16);
    ctx.fillStyle = 'rgba(255,255,255,' + signPulse.toFixed(2) + ')';
    ctx.fillRect(x+w/2-18, y-12, 36, 8);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 7px "Courier New",monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BAR', x+w/2, y-5);
    ctx.textAlign = 'start';
    
    for(var si=0; si<8; si++) {
      var waveOff = Math.sin(t*2 + si*0.6)*3;
      ctx.fillStyle = (si % 2 === 0) ? '#CC0000' : '#FFFFFF';
      ctx.fillRect(x+6+si*5, y+h-20+waveOff, 5, 14);
    }
    
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x+w/2-6, y+h-18, 12, 16);
    ctx.fillStyle = 'rgba(100,140,200,0.3)';
    ctx.fillRect(x+w/2-4, y+h-16, 8, 12);
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.fillRect(x+w/2+2, y+h-10, 2, 2);
    
    ctx.fillStyle = PALETTE.nightBlue;
    ctx.fillRect(x+4, y+8, 12, 10);
    ctx.fillStyle = 'rgba(212,168,67,0.5)';
    ctx.fillRect(x+6, y+10, 8, 6);
    ctx.fillStyle = 'rgba(232,220,200,0.4)';
    ctx.fillRect(x+4, y+8, 12, 4);
    
    ctx.fillStyle = PALETTE.slateGrey;
    for(var ci=0; ci<3; ci++) {
      var chairX = x + 8 + ci*14;
      var chairY = y + h + 2;
      ctx.fillRect(chairX, chairY, 8, 2);
      ctx.fillRect(chairX, chairY-5, 1, 6);
      ctx.fillRect(chairX+7, chairY-5, 1, 6);
      ctx.fillRect(chairX, chairY-6, 8, 1);
      ctx.fillRect(chairX+2, chairY+2, 1, 4);
      ctx.fillRect(chairX+5, chairY+2, 1, 4);
    }
    
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+w-18, y+h-16, 12, 14);
    ctx.fillStyle = PALETTE.creamPaper;
    ctx.fillRect(x+w-16, y+h-14, 8, 10);
    ctx.fillStyle = PALETTE.nightBlue;
    ctx.fillRect(x+w-15, y+h-13, 6, 1);
    ctx.fillRect(x+w-15, y+h-11, 5, 1);
    ctx.fillRect(x+w-15, y+h-9, 6, 1);
    ctx.fillRect(x+w-15, y+h-7, 4, 1);
    
    ctx.fillStyle = PALETTE.burntOrange;
    ctx.fillRect(x+2, y+h-10, 8, 8);
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x+3, y+h-8, 6, 4);
    for(var fi=0; fi<3; fi++) {
      ctx.fillStyle = '#CC3333';
      ctx.fillRect(x+3+fi*2, y+h-12+Math.sin(t+fi)*1, 2, 2);
      ctx.fillStyle = PALETTE.darkForest;
      ctx.fillRect(x+2+fi*2, y+h-10, 1, 2);
      ctx.fillRect(x+5+fi*2, y+h-10, 1, 2);
    }
  },

  /** Cascina — grondaia, fiori, portone legno, muretto, crepe, dettagli */
  drawCascina: function(ctx, x, y, w, h, t) {
    ctx.fillStyle = PALETTE.greyBrown;
    ctx.fillRect(x, y, w, h);
    
    for(var i=0; i<35; i++) {
      var tx = x + (i*19)%w;
      var ty = y + (i*17)%(h-10);
      var stoneSize = 4 + (i%3)*2;
      ctx.fillStyle = (i%2===0) ? PALETTE.fadedBeige : PALETTE.earthBrown;
      ctx.fillRect(tx, ty, stoneSize, stoneSize-2);
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(tx, ty+stoneSize-2, stoneSize, 1);
      
      if(i % 8 === 0) {
        ctx.fillStyle = '#3A2A1A';
        ctx.fillRect(tx, ty, 1, 6 + (i%3)*3);
      }
    }
    
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x-2, y-3, w+4, 4);
    ctx.fillRect(x+w-4, y-3, 3, h);
    
    ctx.fillStyle = PALETTE.burntOrange;
    ctx.fillRect(x-4, y-8, w+8, 8);
    for(var ti=0; ti<w+8; ti+=4) {
      ctx.fillRect(x-4+ti, y-8, 3, 2);
      ctx.fillRect(x-2+ti, y-6, 3, 2);
    }
    
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+w-20, y-16, 10, 12);
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x+w-22, y-18, 14, 4);
    
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x+w/2-10, y+h-28, 20, 26);
    ctx.fillStyle = PALETTE.slateGrey;
    for(var pi=0; pi<4; pi++) {
      ctx.fillRect(x+w/2-8+pi*5, y+h-26, 4, 22);
    }
    ctx.fillStyle = PALETTE.alumGrey;
    ctx.fillRect(x+w/2-8, y+h-24, 2, 2);
    ctx.fillRect(x+w/2+6, y+h-24, 2, 2);
    ctx.fillRect(x+w/2-8, y+h-8, 2, 2);
    ctx.fillRect(x+w/2+6, y+h-8, 2, 2);
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.fillRect(x+w/2+4, y+h-16, 3, 3);
    
    var winPositions = [
      {x: x+8, y: y+10, w: 12, h: 10},
      {x: x+w-20, y: y+10, w: 12, h: 10}
    ];
    
    for(var wi=0; wi<winPositions.length; wi++) {
      var win = winPositions[wi];
      ctx.fillStyle = PALETTE.nightBlue;
      ctx.fillRect(win.x, win.y, win.w, win.h);
      var pulse = 0.5 + Math.sin(t*1.5 + wi*2)*0.3;
      ctx.fillStyle = 'rgba(212,168,67,' + pulse.toFixed(2) + ')';
      ctx.fillRect(win.x+2, win.y+2, win.w-4, win.h-4);
      ctx.fillStyle = PALETTE.earthBrown;
      ctx.fillRect(win.x, win.y, win.w, 2);
      ctx.fillRect(win.x, win.y, 2, win.h);
      ctx.fillRect(win.x+win.w-2, win.y, 2, win.h);
      ctx.fillRect(win.x, win.y+win.h-2, win.w, 2);
      
      if(wi === 0) {
        ctx.fillStyle = PALETTE.burntOrange;
        ctx.fillRect(win.x-2, win.y+win.h+2, 16, 4);
        ctx.fillStyle = PALETTE.earthBrown;
        ctx.fillRect(win.x, win.y+win.h+2, 12, 2);
        for(var fi=0; fi<5; fi++) {
          var fx = win.x + 2 + fi*2;
          var fy = win.y+win.h-2 + Math.sin(t+fi)*1;
          ctx.fillStyle = '#CC3333';
          ctx.fillRect(fx, fy, 2, 2);
          ctx.fillStyle = PALETTE.darkForest;
          ctx.fillRect(fx-1, fy+2, 1, 2);
          ctx.fillRect(fx+2, fy+2, 1, 2);
        }
      }
    }
    
    ctx.fillStyle = PALETTE.alumGrey;
    ctx.fillRect(x-2, y+h, w+4, 4);
    ctx.fillStyle = PALETTE.slateGrey;
    for(var mi=0; mi<w+4; mi+=6) {
      ctx.fillStyle = (mi%12===0) ? PALETTE.greyBrown : PALETTE.slateGrey;
      ctx.fillRect(x-2+mi, y+h, 5, 4);
    }
  },

  /** Fienile — porta legno, finestrella, paglia, attrezzi, crepe */
  drawFienile: function(ctx, x, y, w, h, t) {
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x, y, w, h);
    
    ctx.fillStyle = PALETTE.slateGrey;
    for(var i=0; i<w; i+=6) {
      ctx.fillRect(x+i, y, 1, h);
    }
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    for(var i=0; i<w; i+=6) {
      ctx.fillRect(x+i+1, y, 2, h);
    }
    
    ctx.fillStyle = PALETTE.burntOrange;
    ctx.fillRect(x-3, y-6, w+6, 8);
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x-3, y-8, w+6, 3);
    
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+w/2-12, y+h-30, 24, 28);
    ctx.fillStyle = PALETTE.earthBrown;
    for(var pi=0; pi<4; pi++) {
      ctx.fillRect(x+w/2-10+pi*6, y+h-28, 5, 24);
    }
    ctx.fillStyle = PALETTE.alumGrey;
    ctx.fillRect(x+w/2-10, y+h-26, 20, 2);
    ctx.fillRect(x+w/2-10, y+h-10, 20, 2);
    ctx.fillRect(x+w/2-10, y+h-18, 20, 2);
    ctx.fillStyle = PALETTE.lanternYel;
    ctx.fillRect(x+w/2-2, y+h-16, 4, 4);
    
    ctx.fillStyle = PALETTE.nightBlue;
    ctx.fillRect(x+w/2-6, y+8, 12, 8);
    var faintLight = 0.2 + Math.sin(t)*0.1;
    ctx.fillStyle = 'rgba(212,168,67,' + faintLight.toFixed(2) + ')';
    ctx.fillRect(x+w/2-4, y+10, 8, 4);
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+w/2-6, y+8, 12, 1);
    ctx.fillRect(x+w/2-6, y+15, 12, 1);
    for(var bi=0; bi<3; bi++) {
      ctx.fillRect(x+w/2-4+bi*4, y+8, 1, 8);
    }
    
    ctx.fillStyle = PALETTE.lanternYel;
    for(var hi=0; hi<10; hi++) {
      var hx = x + w + 4 + (hi%3)*4;
      var hy = y + h - 6 - Math.floor(hi/3)*3;
      ctx.fillRect(hx, hy, 3, 2);
    }
    ctx.fillStyle = PALETTE.creamPaper;
    ctx.fillRect(x+w+6, y+h-10, 6, 4);
    ctx.fillRect(x+w+4, y+h-8, 10, 2);
    
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x+4, y+10, 2, 20);
    ctx.fillRect(x+2, y+8, 6, 2);
    ctx.fillRect(x+2, y+6, 1, 3);
    ctx.fillRect(x+5, y+6, 1, 3);
    ctx.fillRect(x+12, y+12, 2, 18);
    ctx.fillStyle = PALETTE.alumGrey;
    ctx.fillRect(x+10, y+10, 6, 3);
  },

  /** Cabina telefonica — telefono, cartello, luce, crepe, vetro */
  drawCabina: function(ctx, x, y, w, h, t) {
    ctx.fillStyle = PALETTE.burntOrange;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(x+4, y+8, 1, 12);
    ctx.fillRect(x+w-6, y+12, 1, 8);
    
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x-2, y-3, w+4, 5);
    
    ctx.fillStyle = 'rgba(100,140,200,0.4)';
    ctx.fillRect(x+2, y+2, w-4, h-4);
    
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(x+4, y+h/2-4, 10, 8);
    ctx.fillStyle = PALETTE.nightBlue;
    ctx.fillRect(x+6, y+h/2-6, 6, 3);
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x+8, y+h/2-3, 1, 4);
    
    ctx.fillStyle = PALETTE.creamPaper;
    ctx.fillRect(x+w/2-12, y+4, 24, 8);
    ctx.fillStyle = PALETTE.nightBlue;
    ctx.font = 'bold 5px "Courier New",monospace';
    ctx.textAlign = 'center';
    ctx.fillText('TEL.', x+w/2, y+10);
    ctx.textAlign = 'start';
    
    var lightOn = 0.6 + Math.sin(t*2)*0.2;
    ctx.fillStyle = 'rgba(212,168,67,' + lightOn.toFixed(2) + ')';
    ctx.fillRect(x+4, y+4, w-8, h-8);
  },

  /** Pozzo — secchio e corda oscillanti, muschio, acqua */
  drawPozzo: function(ctx, x, y, w, h, t) {
    ctx.fillStyle = PALETTE.alumGrey;
    ctx.fillRect(x, y, w, h);
    
    for(var i=0; i<14; i++) {
      var tx = x + (i*11)%w;
      var ty = y + (i*9)%(h-4);
      ctx.fillStyle = (i%2===0) ? PALETTE.slateGrey : PALETTE.greyBrown;
      ctx.fillRect(tx, ty, 4, 3);
    }
    
    ctx.fillStyle = PALETTE.darkForest;
    for(var mi=0; mi<10; mi++) {
      var mx = x + (mi*7)%w;
      ctx.fillRect(mx, y, 3, 2 + (mi%2));
      ctx.fillRect(mx, y+h-3, 2, 2);
    }
    
    ctx.fillStyle = PALETTE.nightBlue;
    ctx.fillRect(x+4, y+4, w-8, h-8);
    
    var waterPulse = 0.3 + Math.sin(t*2)*0.1;
    ctx.fillStyle = 'rgba(100,120,160,' + waterPulse.toFixed(2) + ')';
    ctx.fillRect(x+6, y+6, w-12, h-12);
    
    for(var ri=0; ri<3; ri++) {
      var rippleY = y + 8 + Math.sin(t*1.5 + ri*2)*3;
      var rippleW = 4 + Math.sin(t*1.2 + ri)*2;
      var rippleX = x + 8 + ri*8;
      ctx.fillStyle = 'rgba(140,160,200,0.25)';
      ctx.fillRect(rippleX - rippleW/2, rippleY, rippleW, 1);
    }
    
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(x-2, y-8, w+4, 4);
    ctx.fillRect(x-2, y-10, 3, 6);
    ctx.fillRect(x+w-1, y-10, 3, 6);
    ctx.fillRect(x-2, y-10, w+4, 3);
    
    var swingAngle = Math.sin(t*1.5)*3;
    var bucketX = x + w/2 + swingAngle;
    var bucketY = y + 2;
    ctx.fillStyle = PALETTE.creamPaper;
    ctx.fillRect(bucketX-1, y-8, 1, bucketY-y+10);
    ctx.fillRect(bucketX+1, y-8, 1, bucketY-y+10);
    ctx.fillStyle = PALETTE.slateGrey;
    ctx.fillRect(bucketX-3, bucketY, 7, 5);
    ctx.fillStyle = PALETTE.earthBrown;
    ctx.fillRect(bucketX-2, bucketY+1, 5, 3);
    ctx.fillStyle = PALETTE.alumGrey;
    ctx.fillRect(bucketX-2, bucketY-1, 5, 1);
  }
};

// Export for global access
window.BuildingRenderers = BuildingRenderers;
