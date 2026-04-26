/* ═════════ AREE — PIXEL ART ATMOSFERICO ═════════
   Stile: silhouettes pulite, luci calde, contrasto forte.
   Usa PF helper da engine.js per elementi ricorrenti.
   ══════════════════════════════════════════════════ */

var areas = {

  /* ── PIAZZA DEL BORGO ── */
  piazza: {
    name: 'Piazza del Borgo',
    walkableTop: 105,
    colliders: [
      {x:150, y:42, w:100, h:78},
      {x:76,  y:158, w:48, h:28},
      {x:26,  y:133, w:58, h:62},
      {x:262, y:162, w:26, h:32}
    ],
    npcs: [
      { id: 'ruggeri', x: 230, y: 135 },
      { id: 'valli', x: 320, y: 195 },
      { id: 'gino', x: 110, y: 195 },
      { id: 'anselmo', x: 290, y: 195 }
    ],
    exits: [],
    draw: function(ctx) {
      PF.nightSky(ctx, 14);
      // Luna grande
      ctx.fillStyle = PALETTE.lanternYel; ctx.beginPath(); ctx.arc(340, 22, 14, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = PALETTE.nightBlue; ctx.beginPath(); ctx.arc(346, 18, 10, 0, Math.PI*2); ctx.fill();
      PF.mountains(ctx);
      // Municipio
      PF.building(ctx, 150, 42, 100, 80, 2);
      ctx.fillStyle = 'rgba(212,168,67,0.12)'; ctx.fillRect(152, 44, 96, 76);
      // Fontana
      ctx.fillStyle = PALETTE.alumGrey; ctx.fillRect(78, 168, 44, 14);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(88, 158, 24, 14);
      ctx.fillStyle = PALETTE.violetBlue; ctx.fillRect(91, 161, 18, 4);
      // Bar
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(30, 140, 46, 50);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(28, 136, 50, 6);
      ctx.fillStyle = '#CC0000'; ctx.fillRect(32, 144, 42, 14);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(36, 164, 10, 16);
      ctx.font = '8px "Courier New",monospace'; ctx.fillStyle = '#FFFFFF'; ctx.fillText('BAR', 42, 155);
      // Fiat 500
      ctx.fillStyle = PALETTE.alumGrey; ctx.fillRect(340, 175, 36, 16);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(345, 163, 26, 14);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(350, 167, 8, 6); ctx.fillRect(365, 167, 8, 6);
      // Lampioni
      PF.lamp(ctx, 56, 148);
      PF.lamp(ctx, 333, 143);
      // Cabina
      ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(260, 160, 14, 24);
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(263, 163, 8, 16);
      // Albero
      PF.tree(ctx, 270, 170);
      // Pavimentazione
      ctx.fillStyle = PALETTE.greyBrown; ctx.fillRect(0, 185, CANVAS_W, 65);
      for (var r=0; r<6; r++) for (var c=0; c<14; c++) ctx.fillRect(c*30+(r%2)*15, 190+r*10, 26, 4);
      // Gatto
      ctx.fillStyle = '#E8913A'; ctx.fillRect(112, 154, 8, 5); ctx.fillRect(115, 151, 4, 3);
      // Cartelli uscita
      drawExitSign(ctx, 170, 4, 'ARCHIVIO');
      drawExitSign(ctx, 348, 153, 'CASCINA');
      // Vignetta
      drawVignette(ctx);
    }
  },

  /* ── ARCHIVIO COMUNALE ── */
  archivio: {
    name: 'Archivio Comunale',
    walkableTop: 8,
    colliders: [
      {x:12, y:35, w:88, h:175},
      {x:302, y:35, w:88, h:175},
      {x:135, y:165, w:130, h:40}
    ],
    npcs: [{ id: 'neri', x: 200, y: 145 }],
    exits: [],
    draw: function(ctx) {
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(0,0,CANVAS_W,8);
      ctx.fillStyle = PALETTE.greyBrown;
      for(var t=0;t<8;t++){ctx.fillRect(t*50+2,204,46,4);if(t<7)ctx.fillRect(t*50+27,208,42,4);}
      // Scaffali
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(15,40,80,170); ctx.fillRect(305,40,80,170);
      ctx.fillStyle = PALETTE.slateGrey;
      for(var s=0;s<5;s++){ctx.fillRect(15,45+s*38,80,4);ctx.fillRect(305,45+s*38,80,4);}
      // Libri colorati
      var bC=[PALETTE.burntOrange,PALETTE.darkForest,PALETTE.violetBlue,PALETTE.greyBrown,PALETTE.nightBlue];
      for(var b=0;b<12;b++){
        ctx.fillStyle=bC[b%5];ctx.fillRect(20+(b%3)*24,52+Math.floor(b/3)*38,14,24);
        ctx.fillStyle=bC[(b+1)%5];ctx.fillRect(312+(b%3)*24,52+Math.floor(b/3)*38,14,24);
      }
      // Scrivania con lampada
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(140,170,120,14);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(145,184,10,36); ctx.fillRect(245,184,10,36);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(260,150,4,14);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(254,138,16,12);
      // Alone lampada
      ctx.fillStyle = 'rgba(212,168,67,0.15)'; ctx.beginPath(); ctx.arc(262,162,28,0,Math.PI*2); ctx.fill();
      // Finestre con vetri scuri
      for(var f=0;f<2;f++){
        var fx=120+f*110;
        ctx.fillStyle=PALETTE.nightBlue;ctx.fillRect(fx,30,50,60);
        ctx.fillStyle=PALETTE.earthBrown;ctx.fillRect(fx-2,28,54,4);ctx.fillRect(fx-2,88,54,4);ctx.fillRect(fx+22,28,4,64);
      }
      drawExitSign(ctx, 170, CANVAS_H-18, 'PIAZZA');
      drawVignette(ctx);
    }
  },

  /* ── CASCINA BELLANDI ── */
  cascina: {
    name: 'Cascina dei Bellandi',
    walkableTop: 100,
    colliders: [
      {x:197, y:38, w:150, h:105},
      {x:39,  y:155, w:50, h:50},
      {x:332, y:58, w:72, h:100},
      {x:0,   y:70, w:38, h:95},
      {x:365, y:80, w:35, h:85}
    ],
    npcs: [
      { id: 'teresa', x: 120, y: 175 },
      { id: 'gino', x: 340, y: 200 }
    ],
    exits: [],
    draw: function(ctx) {
      PF.nightSky(ctx, 16);
      ctx.fillStyle = PALETTE.lanternYel; ctx.beginPath(); ctx.arc(50, 35, 16, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = PALETTE.nightBlue; ctx.beginPath(); ctx.arc(56, 30, 12, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(212,168,67,0.08)'; ctx.beginPath(); ctx.arc(50, 35, 30, 0, Math.PI*2); ctx.fill();
      // Campi — orizzonte basso
      ctx.fillStyle = PALETTE.oliveGreen; ctx.fillRect(0, 100, CANVAS_W, 150);
      ctx.fillStyle = PALETTE.darkForest; ctx.fillRect(0, 98, CANVAS_W, 4);
      // Sentiero
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(180, 98, 40, 152);
      // Cascina — grande silhouette
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(200, 45, 144, 95);
      ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(198, 38, 148, 10);
      // Portone con simboli
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(250, 72, 40, 68);
      if(gameState.cluesFound.indexOf('simboli_portone')===-1){
        ctx.fillStyle = PALETTE.lanternYel;
        ctx.fillRect(256,82,3,5);ctx.fillRect(268,80,4,3);ctx.fillRect(276,86,3,4);
        ctx.fillRect(260,96,4,3);ctx.fillRect(272,92,3,5);
      }
      // Finestre calde
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(215, 58, 18, 22); ctx.fillRect(310, 58, 18, 22);
      // Pozzo
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(50, 165, 28, 34);
      ctx.fillStyle = PALETTE.greyBrown; ctx.fillRect(42, 160, 44, 8);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(55, 170, 18, 12);
      // Fienile
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(340, 70, 55, 80);
      ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(335, 62, 65, 10);
      // Alberi
      PF.tree(ctx, 20, 95);
      PF.tree(ctx, 375, 90);
      // Spaventapasseri
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(320, 120, 3, 20);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(318, 118, 7, 6);
      ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(316, 116, 11, 4);
      // Erba a ciuffi
      ctx.fillStyle = PALETTE.darkForest;
      for(var g=0;g<CANVAS_W;g+=18) ctx.fillRect(g, 99, 3, 5+(g*7)%3);
      drawExitSign(ctx, 4, 143, 'PIAZZA');
      drawExitSign(ctx, 168, 84, 'CAMPO');
      drawVignette(ctx);
    }
  },

  /* ── CAMPO DELLE LUCI ── */
  campo: {
    name: 'Campo delle Luci',
    walkableTop: 85,
    colliders: [
      {x:5, y:85, w:25, h:160},
      {x:370, y:85, w:25, h:160}
    ],
    npcs: [],
    exits: [],
    draw: function(ctx) {
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      ctx.fillStyle = PALETTE.creamPaper;
      for(var i=0;i<18;i++){ctx.fillRect(15+(i*67)%CANVAS_W,4+(i*31)%50,(i%3===0)?2:1,(i%3===0)?2:1);}
      // Luci nel cielo (animate)
      var t=Date.now()*0.001;
      for(var l=0;l<5;l++){
        var lx=60+(l*70),ly=10+(l*8)+Math.sin(t+l)*6;
        ctx.fillStyle='rgba(212,168,67,0.4)';ctx.beginPath();ctx.arc(lx,ly,7+Math.sin(t*2+l)*2,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=PALETTE.creamPaper;ctx.beginPath();ctx.arc(lx,ly,3,0,Math.PI*2);ctx.fill();
      }
      // Nebbia bassa
      ctx.fillStyle='rgba(45,48,71,0.35)';ctx.fillRect(0,70,CANVAS_W,45);
      // Colline
      ctx.fillStyle=PALETTE.darkForest;ctx.fillRect(0,100,CANVAS_W,35);
      ctx.fillStyle=PALETTE.oliveGreen;ctx.fillRect(0,115,CANVAS_W,140);
      // Erba alta
      ctx.fillStyle=PALETTE.darkForest;
      for(var g=0;g<CANVAS_W;g+=7){var wv=Math.sin(g*0.05+t*2)*3;ctx.fillRect(g,112+wv,3,8+Math.abs(wv));}
      // Tracce circolari (3 anelli)
      var pulse=Math.sin(t*3)*0.2+0.5;
      for(var c=0;c<3;c++){
        ctx.strokeStyle='rgba(212,168,67,'+(0.3+c*0.2).toFixed(2)+')';
        ctx.beginPath();ctx.arc(195,165,16+c*16+Math.sin(t*2+c)*2,0,Math.PI*2);ctx.stroke();
      }
      // Luce dal terreno (centro)
      ctx.fillStyle='rgba(200,220,255,'+(0.12+pulse*0.1).toFixed(2)+')';
      ctx.beginPath();ctx.arc(195,165,10+Math.sin(t*2)*4,0,Math.PI*2);ctx.fill();
      // Edicola votiva
      var shx=350, shy=155;
      ctx.fillStyle=PALETTE.greyBrown;ctx.fillRect(shx,shy,14,18);
      ctx.fillStyle=PALETTE.slateGrey;ctx.fillRect(shx-2,shy-4,18,6);
      ctx.fillStyle=PALETTE.lanternYel;ctx.fillRect(shx+5,shy+2,4,6);
      // Pioppi (sagome sottili)
      ctx.fillStyle=PALETTE.earthBrown;ctx.fillRect(12,90,4,140);ctx.fillRect(380,90,4,140);
      ctx.fillStyle=PALETTE.darkForest;ctx.beginPath();ctx.arc(14,80,10,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(382,80,10,0,Math.PI*2);ctx.fill();
      // Vignetta pesante (atmosfera)
      ctx.fillStyle='rgba(0,0,0,0.2)';ctx.fillRect(0,0,25,CANVAS_H);ctx.fillRect(CANVAS_W-25,0,25,CANVAS_H);
      ctx.fillRect(0,0,CANVAS_W,15);ctx.fillRect(0,CANVAS_H-15,CANVAS_W,15);
      drawExitSign(ctx, 165, CANVAS_H-18, 'CASCINA');
    }
  },

  /* ── BAR INTERNO ── */
  bar_interno: {
    name: 'Bar Centrale',
    walkableTop: 8,
    colliders: [
      {x:5, y:38, w:135, h:50},
      {x:270, y:120, w:35, h:50}
    ],
    npcs: [{ id: 'osvaldo', x: 120, y: 175 }],
    exits: [],
    draw: function(ctx) {
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(0,0,CANVAS_W,8);
      ctx.fillStyle = PALETTE.greyBrown;
      for(var r=0;r<5;r++)for(var c=0;c<8;c++)ctx.fillRect(c*50+(r%2)*25,190+r*10,46,8);
      // Bancone
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(10,70,120,14);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(14,38,112,36);
      // Bottiglie
      ctx.fillStyle='#44AA44';ctx.fillRect(80,62,4,10);
      ctx.fillStyle='#AA4444';ctx.fillRect(86,60,4,12);
      ctx.fillStyle='#D4A843';ctx.fillRect(102,58,3,14);
      // Sgabelli
      ctx.fillStyle=PALETTE.slateGrey;ctx.fillRect(50,185,4,18);ctx.fillRect(70,185,4,18);
      // Caffè
      ctx.fillStyle=PALETTE.alumGrey;ctx.fillRect(30,50,16,22);
      // Jukebox
      ctx.fillStyle=PALETTE.earthBrown;ctx.fillRect(280,120,28,48);
      ctx.fillStyle=PALETTE.lanternYel;ctx.fillRect(284,124,20,14);
      // Lampada
      ctx.fillStyle=PALETTE.slateGrey;ctx.fillRect(198,10,4,6);
      ctx.fillStyle=PALETTE.lanternYel;ctx.fillRect(192,15,16,4);
      ctx.fillStyle='rgba(212,168,67,0.12)';ctx.beginPath();ctx.arc(200,25,50,0,Math.PI*2);ctx.fill();
      // Insegna
      ctx.fillStyle='#CC0000';ctx.fillRect(148,68,104,16);
      ctx.font='11px "Courier New",monospace';ctx.fillStyle='#FFFFFF';ctx.fillText('BAR CENTRALE', 158, 80);
      drawExitSign(ctx, 170, CANVAS_H-18, 'PIAZZA');
      drawVignette(ctx);
    }
  },

  /* ── MUNICIPIO INTERNO ── */
  municipio: {
    name: 'Municipio — Ufficio del Sindaco',
    walkableTop: 8,
    colliders: [
      {x:20, y:130, w:120, h:50},
      {x:260, y:0, w:140, h:200}
    ],
    npcs: [{ id: 'ruggeri', x: 200, y: 155 }],
    exits: [],
    draw: function(ctx) {
      // Ufficio anni 70
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      ctx.fillStyle = PALETTE.greyBrown; ctx.fillRect(0,200,CANVAS_W,50);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(0,0,CANVAS_W,8);
      // Scrivania sindaco
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(140,120,180,16);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(145,136,8,64); ctx.fillRect(305,136,8,64);
      // Poltrona dietro scrivania
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(210,100,60,30);
      ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(215,95,50,25);
      // Foto Presidente sul muro
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(60,20,30,36);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(64,24,22,28);
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(68,28,14,16);
      // Bandiera
      ctx.fillStyle = '#009246'; ctx.fillRect(100,20,2,30);
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(102,20,2,30);
      ctx.fillStyle = '#CE2B37'; ctx.fillRect(104,20,2,30);
      // Finestra
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(320,25,50,60);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(318,23,54,4); ctx.fillRect(318,83,54,4);
      ctx.fillRect(342,23,4,64);
      // Lampada scrivania
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(155,106,4,16);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(148,96,18,12);
      ctx.fillStyle = 'rgba(212,168,67,0.12)'; ctx.beginPath(); ctx.arc(157,126,28,0,Math.PI*2); ctx.fill();
      // Telefono
      ctx.fillStyle = '#1A1C20'; ctx.fillRect(170,126,12,6);
      // Cartella "RISERVATO"
      ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(280,124,22,14);
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(282,127,18,2);
      drawExitSign(ctx, 170, CANVAS_H-18, 'PIAZZA');
      drawVignette(ctx);
    }
  },

  /* ── CASCINA INTERNO ── */
  cascina_interno: {
    name: 'Cascina — Stanza di Teresa',
    walkableTop: 8,
    colliders: [
      {x:10, y:120, w:120, h:60},
      {x:280, y:60, w:25, h:110}
    ],
    npcs: [{ id: 'teresa', x: 120, y: 175 }],
    exits: [],
    draw: function(ctx) {
      // Stanza calda, intima
      ctx.fillStyle = PALETTE.greyBrown; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(0,0,CANVAS_W,8);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(0,200,CANVAS_W,50);
      // Letto
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(20,130,100,18);
      ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(22,110,96,22);
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(26,114,88,14);
      // Cuscino
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(28,134,30,10);
      // Comodino
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(130,134,16,30);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(134,140,8,6); // lumino
      // Finestra
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(300,30,50,50);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(298,28,54,4); ctx.fillRect(298,78,54,4);
      ctx.fillRect(322,28,4,54);
      // Luna dalla finestra
      ctx.fillStyle = PALETTE.lanternYel+'44'; ctx.beginPath(); ctx.arc(330,45,8,0,Math.PI*2); ctx.fill();
      // Sedia
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(270,150,20,24);
      ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(272,146,16,6);
      // Foto di Enzo sul muro
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(200,40,20,26);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(203,43,14,14);
      ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(203,38,14,6);
      // Tappeto
      ctx.fillStyle = PALETTE.burntOrange+'88'; ctx.fillRect(30,165,260,8);
      // Crocifisso al muro
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(194,12,2,20);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(190,16,10,2);
      // Luce calda diffusa
      ctx.fillStyle = 'rgba(212,168,67,0.06)'; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      // Statua Sant'Antonio
      ctx.fillStyle = PALETTE.greyBrown; ctx.fillRect(10,106,14,20);
      ctx.fillStyle = PALETTE.creamPaper; ctx.beginPath(); ctx.arc(17,100,6,0,Math.PI*2); ctx.fill();
      drawExitSign(ctx, 170, CANVAS_H-18, 'CASCINA');
      drawVignette(ctx);
    }
  },

  monte_ferro: {
    name: 'Stazione Radio Monte Ferro',
    walkableTop: 8,
    colliders: [{x:18,y:105,w:165,h:25},{x:238,y:20,w:158,h:175}],
    npcs: [],
    exits: [],
    draw: function(ctx) {
      ctx.fillStyle = PALETTE.violetBlue; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(0,185,CANVAS_W,65);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(0,0,CANVAS_W,5);
      // Antenna
      ctx.fillStyle = PALETTE.alumGrey; ctx.fillRect(340,5,5,95);
      for(var at=0;at<4;at++){ctx.fillRect(333+at*3,15+at*18,20,2);}
      // Edificio
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(240,20,148,168);
      // Finestra sbarrata
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(260,46,30,32);
      ctx.fillStyle = PALETTE.alumGrey;
      for(var fb=0;fb<5;fb++){ctx.fillRect(261,48+fb*7,28,2);}
      // Registratore
      ctx.fillStyle = PALETTE.alumGrey; ctx.fillRect(30,90,42,28);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(36,98,30,12);
      ctx.fillStyle = PALETTE.earthBrown; ctx.beginPath();ctx.arc(42,104,5,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(60,104,5,0,Math.PI*2);ctx.fill();
      var pulse=Math.sin(Date.now()*0.005)*0.4+0.6;
      ctx.fillStyle='rgba(204,0,0,'+pulse.toFixed(2)+')';ctx.fillRect(46,88,4,4);
      // Scrivania
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(18,118,168,12);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(24,130,5,55);ctx.fillRect(170,130,5,55);
      // Cavi
      ctx.strokeStyle=PALETTE.alumGrey+'88';ctx.beginPath();ctx.moveTo(50,118);ctx.lineTo(50,185);
      ctx.moveTo(40,118);ctx.lineTo(10,185);ctx.stroke();
      // Armadietto + bobine
      ctx.fillStyle = PALETTE.alumGrey; ctx.fillRect(382,125,16,55);
      ctx.fillStyle = PALETTE.earthBrown;ctx.fillRect(200,55,10,10);ctx.fillRect(215,52,10,10);ctx.fillRect(208,65,10,10);
      ctx.fillStyle = 'rgba(100,140,200,0.10)';ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      drawExitSign(ctx, 170, CANVAS_H-18, 'CAMPO');
      drawVignette(ctx);
    }
  }
};

/* ── Helper condivisi ── */

function drawExitSign(ctx, x, y, label) {
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.fillRect(x, y, label.length * 8 + 8, 14);
  ctx.fillStyle = PALETTE.nightBlue;
  ctx.fillRect(x + 2, y + 2, label.length * 8 + 4, 10);
  ctx.font = '8px "Courier New",monospace';
  ctx.fillStyle = PALETTE.creamPaper;
  ctx.fillText(label, x + 4, y + 12);
}

function drawVignette(ctx) {
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fillRect(0, 0, 14, CANVAS_H);
  ctx.fillRect(CANVAS_W - 14, 0, 14, CANVAS_H);
  ctx.fillRect(0, 0, CANVAS_W, 8);
  ctx.fillRect(0, CANVAS_H - 8, CANVAS_W, 8);
}
