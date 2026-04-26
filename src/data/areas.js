/* ══════════════════════════════════════════════════════════════
   AREE DI GIOCO — 4 aree con rendering procedurale
   ══════════════════════════════════════════════════════════════ */

var areas = {
  piazza: {
    name: 'Piazza del Borgo',
    walkableTop: 20,
    colliders: [
      {x:153, y:42, w:94, h:78},  // Municipio
      {x:78,  y:158, w:48, h:28},  // Fontana
      {x:30,  y:133, w:58, h:62},  // Bar Centrale
      {x:262, y:162, w:26, h:32}   // Albero + cabina
    ],
    npcs: [
      { id: 'ruggeri', x: 230, y: 135 },
      { id: 'valli', x: 320, y: 195 },
      { id: 'gino', x: 110, y: 195 }
    ],
    exits: [
      { dir: 'up', xRange: [170, 230], to: 'archivio', spawnX: 195, spawnY: 210, label: 'Archivio Comunale' },
      { dir: 'right', xRange: [0, 60], to: 'cascina', spawnX: 40, spawnY: 160, label: 'Cascina Bellandi' }
    ],
    draw: function(ctx) {
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.fillStyle = PALETTE.creamPaper;
      for(var s=0; s<32; s++){ var sx=(s*67+13)%CANVAS_W, sy=(s*41+7)%60, ss=(s%3===0)?2:1; ctx.fillRect(sx,sy,ss,ss); }
      ctx.fillStyle = PALETTE.violetBlue;
      ctx.beginPath(); ctx.moveTo(0,90); ctx.lineTo(60,60); ctx.lineTo(150,75); ctx.lineTo(220,50); ctx.lineTo(300,70); ctx.lineTo(400,85); ctx.lineTo(400,100); ctx.lineTo(0,100); ctx.fill();
      ctx.fillStyle = PALETTE.creamPaper;
      ctx.beginPath(); ctx.moveTo(57,62); ctx.lineTo(60,60); ctx.lineTo(64,62); ctx.fill();
      ctx.beginPath(); ctx.moveTo(147,72); ctx.lineTo(150,75); ctx.lineTo(154,73); ctx.fill();
      ctx.beginPath(); ctx.moveTo(216,52); ctx.lineTo(220,50); ctx.lineTo(225,53); ctx.fill();
      ctx.beginPath(); ctx.moveTo(296,68); ctx.lineTo(300,70); ctx.lineTo(305,68); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(157,57,90,65);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(155,55,90,65);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(162,62,26,36); ctx.fillRect(210,62,26,36);
      ctx.fillStyle = '#4A7A3A'; ctx.fillRect(160,60,6,40); ctx.fillRect(186,60,6,40); ctx.fillRect(208,60,6,40); ctx.fillRect(234,60,6,40);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(188,50,14,20);
      ctx.fillStyle = '#4A7A3A'; ctx.fillRect(186,48,4,24); ctx.fillRect(200,48,4,24);
      ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(155,45,90,12);
      ctx.fillStyle = PALETTE.creamPaper; ctx.beginPath(); ctx.arc(200,39,8,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = PALETTE.nightBlue; ctx.beginPath(); ctx.arc(200,39,6,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle = PALETTE.creamPaper; ctx.beginPath(); ctx.moveTo(200,39); ctx.lineTo(200,35); ctx.stroke(); ctx.beginPath(); ctx.moveTo(200,39); ctx.lineTo(203,39); ctx.stroke(); ctx.strokeStyle = '#000';
      ctx.fillStyle = '#009246'; ctx.fillRect(197,25,2,10); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(199,25,2,10); ctx.fillStyle = '#CE2B37'; ctx.fillRect(201,25,2,10);
      ctx.fillStyle = PALETTE.alumGrey; ctx.fillRect(198,20,1,23);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(160,118,86,3); ctx.fillStyle = PALETTE.greyBrown; ctx.fillRect(164,114,78,6); ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(168,110,70,6);
      ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(82,172,40,14);
      ctx.fillStyle = PALETTE.alumGrey; ctx.fillRect(80,170,40,12); ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(90,160,20,12); ctx.fillStyle = PALETTE.violetBlue; ctx.fillRect(93,163,14,6);
      ctx.fillStyle = 'rgba(180,220,255,0.4)';
      for(var wj=0; wj<5; wj++){ ctx.fillRect(96+wj*2, 160, 1, 4); ctx.fillRect(97+wj*2, 156, 1, 4); }
      ctx.fillStyle = 'rgba(180,200,220,0.12)'; ctx.beginPath(); ctx.ellipse(100,180,16,4,0,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(37,142,42,48);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(32,140,42,48); ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(30,136,46,8);
      ctx.fillStyle = '#FF2222'; ctx.fillRect(36,144,34,12); ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(38,146,30,8);
      ctx.font = '8px "Courier New",monospace'; ctx.fillStyle = '#FF4444'; ctx.fillText('BAR', 42, 153);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(42,164,16,20); ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(53,168,3,3);
      ctx.fillStyle = PALETTE.creamPaper+'88'; ctx.fillRect(38,148,10,10);
      ctx.fillStyle = PALETTE.greyBrown; ctx.fillRect(62,176,10,2); ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(61,174,12,3);
      ctx.fillStyle = PALETTE.lanternYel; ctx.beginPath(); ctx.arc(65,172,6,0,Math.PI,false); ctx.fill();
      ctx.fillStyle = PALETTE.greyBrown; ctx.fillRect(76,178,10,2); ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(75,176,12,3);
      ctx.fillStyle = PALETTE.burntOrange; ctx.beginPath(); ctx.arc(79,174,5,0,Math.PI,false); ctx.fill();
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(36,169,12,14); ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(38,171,8,2); ctx.fillRect(38,174,8,2);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(58,155,4,30);
      var gl1 = ctx.createRadialGradient(60,170,2,60,170,30); gl1.addColorStop(0,'rgba(212,168,67,0.22)'); gl1.addColorStop(1,'rgba(212,168,67,0)');
      ctx.fillStyle = gl1; ctx.beginPath(); ctx.arc(60,170,30,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(56,150,8,8);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(335,148,4,30);
      var gl2 = ctx.createRadialGradient(337,163,2,337,163,28); gl2.addColorStop(0,'rgba(212,168,67,0.22)'); gl2.addColorStop(1,'rgba(212,168,67,0)');
      ctx.fillStyle = gl2; ctx.beginPath(); ctx.arc(337,163,28,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(333,143,8,8);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(266,180,4,18);
      ctx.fillStyle = PALETTE.darkForest; ctx.beginPath(); ctx.arc(268,170,9,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(262,166,7,0,Math.PI*2); ctx.fill(); ctx.beginPath(); ctx.arc(274,167,8,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = PALETTE.greyBrown; ctx.fillRect(0,185,CANVAS_W,65);
      ctx.fillStyle = PALETTE.earthBrown;
      for(var r=0;r<8;r++){for(var c=0;c<14;c++){ctx.fillRect(c*30+(r%2)*15,188+r*8,26,5);}}
      ctx.fillStyle = PALETTE.oliveGreen;
      for(var gp=0; gp<22; gp++){ var gx=(gp*53+22)%CANVAS_W, gy=190+(gp*29)%45; ctx.fillRect(gx,gy,1,2); ctx.fillRect(gx+1,gy+1,2,1); }
      var cx=94, cy=153;
      ctx.fillStyle='#E8913A'; ctx.fillRect(cx,cy,8,5); ctx.beginPath(); ctx.arc(cx+4,cy-1,3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx+1,cy-1); ctx.lineTo(cx,cy-5); ctx.lineTo(cx+3,cy-1); ctx.fill();
      ctx.beginPath(); ctx.moveTo(cx+7,cy-1); ctx.lineTo(cx+8,cy-5); ctx.lineTo(cx+5,cy-1); ctx.fill();
      ctx.fillStyle=PALETTE.nightBlue; ctx.fillRect(cx+8,cy+1,6,1);
      ctx.fillStyle='#44FF44'; ctx.fillRect(cx+3,cy-2,1,1); ctx.fillRect(cx+5,cy-2,1,1);
      ctx.font = '6px "Courier New",monospace'; ctx.fillStyle = PALETTE.greyBrown;
      ctx.fillText('Fontana in restauro dal 1964',82,166);
      ctx.fillText('RUGGERI - dal 1963',155,120);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(170,6,60,14);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(172,8,56,10);
      ctx.font = '8px "Courier New",monospace'; ctx.fillStyle = PALETTE.creamPaper; ctx.fillText('ARCHIVIO',174,16);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(350,155,50,14);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(352,157,46,10);
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillText('CASCINA',353,165);
      ctx.fillStyle='rgba(0,0,0,0.15)'; ctx.fillRect(0,0,18,CANVAS_H); ctx.fillRect(CANVAS_W-18,0,18,CANVAS_H); ctx.fillRect(0,0,CANVAS_W,14); ctx.fillRect(0,CANVAS_H-14,CANVAS_W,14);
    }
  },

  archivio: {
    name: 'Archivio Comunale',
    walkableTop: 8,
    colliders: [
      {x:12, y:35, w:88, h:175},   // Scaffale sinistro
      {x:302, y:35, w:88, h:175},  // Scaffale destro
      {x:135, y:165, w:130, h:40}  // Scrivania area
    ],
    npcs: [
      { id: 'neri', x: 200, y: 145 }
    ],
    exits: [
      { dir: 'down', xRange: [170, 230], to: 'piazza', spawnX: 195, spawnY: 40, label: 'Piazza del Borgo' }
    ],
    draw: function(ctx) {
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(0,0,CANVAS_W,8);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(0,200,CANVAS_W,50);
      ctx.fillStyle = PALETTE.greyBrown;
      for(var t=0; t<10; t++){ ctx.fillRect(t*40+2,202,36,4); if(t<9) ctx.fillRect(t*40+20,206,32,4); }
      ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(17,42,80,170); ctx.fillRect(307,42,80,170);
      ctx.fillStyle = PALETTE.earthBrown;
      ctx.fillRect(15,40,80,170); ctx.fillRect(305,40,80,170);
      ctx.fillStyle = PALETTE.greyBrown; ctx.fillRect(13,40,84,4); ctx.fillRect(303,40,84,4);
      ctx.fillStyle = PALETTE.slateGrey;
      for(var s=0;s<5;s++){ctx.fillRect(15,45+s*38,80,4);ctx.fillRect(305,45+s*38,80,4);}
      var bookColors = [PALETTE.burntOrange,PALETTE.darkForest,PALETTE.violetBlue,PALETTE.greyBrown,PALETTE.nightBlue];
      for(var b=0;b<12;b++){
        var bx=20+(b%3)*24, by=52+Math.floor(b/3)*38;
        ctx.fillStyle=bookColors[b%5];ctx.fillRect(bx,by,12,24);
        ctx.fillStyle=PALETTE.creamPaper;ctx.fillRect(bx+2,by+2,2,6);
        if(b%4===1){ctx.save();ctx.translate(bx+6,by+12);ctx.rotate(0.12);ctx.fillStyle=bookColors[(b+2)%5];ctx.fillRect(-6,-12,12,24);ctx.restore();}
        ctx.fillStyle=bookColors[(b+1)%5];ctx.fillRect(312+(b%3)*24,52+Math.floor(b/3)*38,12,24);
        ctx.fillStyle=PALETTE.creamPaper;ctx.fillRect(314+(b%3)*24,54+Math.floor(b/3)*38,2,6);
        if((b+1)%4===0){ctx.save();ctx.translate(318+(b%3)*24,64+Math.floor(b/3)*38);ctx.rotate(-0.1);ctx.fillStyle=bookColors[b%5];ctx.fillRect(-6,-12,12,24);ctx.restore();}
      }
      ctx.strokeStyle='rgba(200,200,200,0.25)';ctx.lineWidth=0.5;
      ctx.beginPath();ctx.moveTo(19,46);ctx.lineTo(29,56);ctx.stroke();
      ctx.beginPath();ctx.moveTo(19,46);ctx.lineTo(35,50);ctx.stroke();
      ctx.beginPath();ctx.moveTo(91,46);ctx.lineTo(81,56);ctx.stroke();
      ctx.beginPath();ctx.moveTo(91,46);ctx.lineTo(75,50);ctx.stroke();
      ctx.beginPath();ctx.moveTo(309,46);ctx.lineTo(319,56);ctx.stroke();
      ctx.beginPath();ctx.moveTo(309,46);ctx.lineTo(325,50);ctx.stroke();
      ctx.beginPath();ctx.moveTo(381,46);ctx.lineTo(371,56);ctx.stroke();
      ctx.beginPath();ctx.moveTo(381,46);ctx.lineTo(365,50);ctx.stroke();
      ctx.strokeStyle='#000';ctx.lineWidth=1;
      ctx.fillStyle = 'rgba(0,0,0,0.2)'; ctx.fillRect(142,186,120,16);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(140,184,120,14);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(145,190,10,30); ctx.fillRect(245,190,10,30);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(150,178,6,7); ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(149,182,8,2);
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(162,179,14,10);
      ctx.fillStyle = PALETTE.greyBrown; ctx.fillRect(164,181,10,1); ctx.fillRect(165,183,8,1); ctx.fillRect(166,185,6,1);
      ctx.fillStyle = PALETTE.greyBrown; ctx.fillRect(202,175,7,9); ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(201,175,9,2);
      ctx.strokeStyle='rgba(200,200,200,0.4)'; ctx.beginPath(); ctx.moveTo(205,174); ctx.lineTo(205,170); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(203,173); ctx.lineTo(202,169); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(207,173); ctx.lineTo(208,169); ctx.stroke(); ctx.strokeStyle='#000';
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(230,178,1,8); ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(229,177,3,2);
      ctx.fillStyle = PALETTE.alumGrey; ctx.fillRect(260,150,4,18); ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(254,138,16,14);
      ctx.fillStyle='rgba(212,168,67,0.08)'; ctx.beginPath(); ctx.moveTo(258,138); ctx.lineTo(200,190); ctx.lineTo(320,190); ctx.closePath(); ctx.fill();
      ctx.fillStyle=PALETTE.lanternYel+'33'; ctx.beginPath(); ctx.arc(262,165,25,0,Math.PI*2); ctx.fill();
      for(var win=0;win<2;win++){
        var wx=win===0?120:230;
        ctx.fillStyle=PALETTE.nightBlue; ctx.fillRect(wx,30,48,58);
        ctx.fillStyle=PALETTE.earthBrown; ctx.fillRect(wx+22,30,4,58); ctx.fillRect(wx,56,48,4);
        ctx.strokeStyle=PALETTE.earthBrown; ctx.lineWidth=2; ctx.strokeRect(wx-2,28,52,62); ctx.strokeStyle='#000'; ctx.lineWidth=1;
      }
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(185,25,28,34);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(187,27,24,20);
      ctx.fillStyle = PALETTE.creamPaper; ctx.beginPath(); ctx.arc(199,33,6,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(190,47,18,10);
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(100,40,12,16);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(102,42,8,2);
      for(var cal=0;cal<4;cal++){ctx.fillStyle=PALETTE.greyBrown;ctx.fillRect(102,46+cal*3,8,1);}
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(330,42,50,34);
      ctx.fillStyle = PALETTE.oliveGreen; ctx.fillRect(334,46,18,12);
      ctx.fillStyle = PALETTE.violetBlue; ctx.fillRect(354,50,22,8);
      ctx.strokeStyle = PALETTE.earthBrown; ctx.strokeRect(330,42,50,34); ctx.strokeStyle='#000';
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillRect(98,178,8,12);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(102,180,4,4);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.beginPath(); ctx.arc(104,176,4,0,Math.PI*2); ctx.fill();
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(100,170,8,3); ctx.fillRect(102,168,6,3);
      ctx.fillStyle = '#CE2B37'; ctx.fillRect(100,179,8,2);
      var gx=180, gy=200;
      ctx.fillStyle='#444'; ctx.fillRect(gx,gy,8,5); ctx.beginPath(); ctx.arc(gx+4,gy-1,3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(gx+1,gy-1); ctx.lineTo(gx,gy-5); ctx.lineTo(gx+3,gy-1); ctx.fill();
      ctx.beginPath(); ctx.moveTo(gx+7,gy-1); ctx.lineTo(gx+8,gy-5); ctx.lineTo(gx+5,gy-1); ctx.fill();
      ctx.fillStyle='#44FF44'; ctx.fillRect(gx+3,gy-2,1,1); ctx.fillRect(gx+5,gy-2,1,1);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(170,CANVAS_H-18,55,14);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(172,CANVAS_H-16,51,10);
      ctx.font = '8px "Courier New",monospace';
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillText('PIAZZA',174,CANVAS_H-8);
      ctx.fillStyle='rgba(0,0,0,0.15)'; ctx.fillRect(0,0,18,CANVAS_H); ctx.fillRect(CANVAS_W-18,0,18,CANVAS_H); ctx.fillRect(0,0,CANVAS_W,12); ctx.fillRect(0,CANVAS_H-12,CANVAS_W,12);
    }
  },

  cascina: {
    name: 'Cascina dei Bellandi',
    walkableTop: 22,
    colliders: [
      {x:197, y:38, w:150, h:105}, // Cascina edificio
      {x:39,  y:155, w:50, h:50},  // Pozzo
      {x:332, y:58, w:72, h:100},  // Fienile
      {x:0,   y:70, w:38, h:95},   // Albero sinistro
      {x:365, y:80, w:35, h:85}    // Albero destro
    ],
    npcs: [
      { id: 'teresa', x: 120, y: 175 },
      { id: 'gino', x: 340, y: 200 }
    ],
    exits: [
      { dir: 'left', xRange: [0, 30], to: 'piazza', spawnX: 360, spawnY: 160, label: 'Piazza del Borgo' },
      { dir: 'up', xRange: [160, 240], to: 'campo', spawnX: 195, spawnY: 210, label: 'Campo delle Luci' }
    ],
    draw: function(ctx) {
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      ctx.fillStyle = PALETTE.creamPaper;
      for(var s=0;s<22;s++){var sx=(s*83+25)%CANVAS_W,sy=8+(s*29)%55,ss=s%3===0?2:1;ctx.fillRect(sx,sy,ss,ss);}
      var mx=50, my=32;
      ctx.fillStyle='rgba(212,168,67,0.12)';ctx.beginPath();ctx.arc(mx,my,20,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(212,168,67,0.06)';ctx.beginPath();ctx.arc(mx,my,26,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=PALETTE.lanternYel;ctx.beginPath();ctx.arc(mx,my,14,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=PALETTE.nightBlue;ctx.beginPath();ctx.arc(mx+3,my-2,10,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(180,140,60,0.4)';ctx.beginPath();ctx.arc(mx+2,my-5,3,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(180,140,60,0.3)';ctx.beginPath();ctx.arc(mx-3,my+4,2,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(180,140,60,0.35)';ctx.beginPath();ctx.arc(mx+4,my+6,2.5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle = PALETTE.oliveGreen; ctx.fillRect(0,100,CANVAS_W,150);
      ctx.fillStyle = PALETTE.darkForest; ctx.fillRect(0,100,CANVAS_W,6);
      var tm=Date.now()*0.001;
      for(var wl=0;wl<CANVAS_W;wl+=8){
        ctx.fillRect(wl,104+Math.sin(wl*0.15+tm*2)*3,4,2);
        ctx.fillRect(wl+2,112+Math.sin(wl*0.13+tm*1.7)*3,4,2);
        ctx.fillRect(wl,120+Math.sin(wl*0.17+tm*2.2)*2,4,2);
      }
      ctx.fillStyle = PALETTE.oliveGreen; ctx.fillRect(180,100,40,150);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(190,100,20,150);
      ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.fillRect(202,52,140,90);
      ctx.fillStyle = PALETTE.fadedBeige; ctx.fillRect(200,50,140,90);
      ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(200,42,140,10);
      for(var tile=0;tile<20;tile++){ ctx.fillStyle='#B88550'; ctx.beginPath();ctx.arc(205+tile*7,43,4,Math.PI,0,false);ctx.fill(); }
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(280,38,12,20); ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(278,56,16,4);
      ctx.fillStyle='rgba(150,150,150,0.3)';
      for(var sm=0;sm<3;sm++){ var smx=286+Math.sin(tm*2+sm)*3, smy=34-sm*8+Math.sin(tm+sm)*2; ctx.beginPath();ctx.arc(smx,smy,4-sm*0.5,0,Math.PI*2);ctx.fill(); }
      ctx.fillStyle=PALETTE.darkForest; ctx.fillRect(200,60,8,14);ctx.fillRect(200,78,6,10);ctx.fillRect(202,92,8,12);ctx.fillRect(200,108,5,8);ctx.fillRect(200,120,7,10);
      ctx.fillStyle=PALETTE.oliveGreen; ctx.fillRect(202,65,4,10);ctx.fillRect(201,80,5,8);ctx.fillRect(203,95,5,10);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(250,78,36,62);
      ctx.fillStyle = PALETTE.earthBrown; ctx.beginPath();ctx.arc(268,78,18,Math.PI,0,false);ctx.fill();
      ctx.fillStyle = PALETTE.alumGrey; ctx.fillRect(254,88,2,10);ctx.fillRect(280,88,2,10); ctx.fillRect(256,94,6,2);ctx.fillRect(274,94,6,2);
      if(gameState.cluesFound.indexOf('simboli_portone')===-1){
        ctx.fillStyle = PALETTE.lanternYel;
        ctx.fillRect(256,88,3,5);ctx.fillRect(266,86,2,5);ctx.fillRect(274,90,4,2);
        ctx.fillRect(258,100,5,3);ctx.fillRect(272,98,3,4);
        ctx.fillRect(260,112,2,5);ctx.fillRect(270,108,4,3);ctx.fillRect(278,114,2,5);
      }
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(215,65,16,20); ctx.fillRect(310,65,16,20);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(213,63,20,4); ctx.fillRect(213,83,20,4); ctx.fillRect(308,63,20,4); ctx.fillRect(308,83,20,4);
      ctx.fillStyle = PALETTE.slateGrey; ctx.fillRect(50,165,28,34);
      ctx.fillStyle = PALETTE.greyBrown; ctx.fillRect(42,160,44,8);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(55,170,18,12);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(340,70,55,80); ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(335,62,65,10);
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(345,68,6,80); ctx.fillRect(385,68,6,80);
      ctx.fillStyle = PALETTE.burntOrange; ctx.fillRect(150,180,3,3);ctx.fillRect(160,185,3,3);
      ctx.strokeStyle = PALETTE.earthBrown;ctx.beginPath();ctx.arc(115,178,6,0,Math.PI*2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(115,178);ctx.lineTo(115,172);ctx.stroke();ctx.beginPath();ctx.moveTo(115,178);ctx.lineTo(121,178);ctx.stroke();ctx.strokeStyle='#000';
      var scx=65, scy=140;
      ctx.fillStyle=PALETTE.earthBrown;ctx.fillRect(scx+3,scy+16,2,16);ctx.fillRect(scx,scy+10,8,1);
      ctx.fillStyle=PALETTE.fadedBeige;ctx.fillRect(scx-2,scy+2,12,10);
      ctx.fillStyle=PALETTE.creamPaper;ctx.beginPath();ctx.arc(scx+4,scy-2,5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=PALETTE.slateGrey;ctx.beginPath();ctx.arc(scx+4,scy+2,6,Math.PI,0,false);ctx.fill();
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(8,75,20,50);
      ctx.fillStyle = PALETTE.darkForest; ctx.beginPath();ctx.arc(18,70,12,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(10,65,10,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(26,68,10,0,Math.PI*2);ctx.fill();
      ctx.fillStyle = PALETTE.earthBrown; ctx.fillRect(370,85,16,50);
      ctx.fillStyle = PALETTE.darkForest; ctx.beginPath();ctx.arc(378,80,12,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(370,75,10,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(386,78,10,0,Math.PI*2);ctx.fill();
      var gx=55, gy=210;
      ctx.fillStyle='#6B4E3D'; ctx.fillRect(gx,gy,8,5); ctx.beginPath(); ctx.arc(gx+4,gy-1,3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(gx+1,gy-1); ctx.lineTo(gx,gy-5); ctx.lineTo(gx+3,gy-1); ctx.fill();
      ctx.beginPath(); ctx.moveTo(gx+7,gy-1); ctx.lineTo(gx+8,gy-5); ctx.lineTo(gx+5,gy-1); ctx.fill();
      ctx.fillStyle=PALETTE.lanternYel; ctx.fillRect(gx+3,gy-2,1,1); ctx.fillRect(gx+5,gy-2,1,1);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(4,140,45,14);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(6,142,41,10);
      ctx.font = '8px "Courier New",monospace';
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillText('PIAZZA',7,150);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(170,85,48,14);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(172,87,44,10);
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillText('CAMPO',173,95);
      ctx.fillStyle='rgba(0,0,0,0.15)'; ctx.fillRect(0,0,18,CANVAS_H);ctx.fillRect(CANVAS_W-18,0,18,CANVAS_H); ctx.fillRect(0,0,CANVAS_W,12);ctx.fillRect(0,CANVAS_H-12,CANVAS_W,12);
    }
  },

  campo: {
    name: 'Campo delle Luci',
    walkableTop: 80,
    colliders: [
      {x:5,   y:85,  w:25, h:160},  // Pioppi sx
      {x:370, y:85,  w:25, h:160}   // Pioppi dx
    ],
    npcs: [],
    exits: [
      { dir: 'down', xRange: [160, 240], to: 'cascina', spawnX: 195, spawnY: 160, label: 'Cascina Bellandi' }
    ],
    draw: function(ctx) {
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
      ctx.fillStyle = PALETTE.creamPaper;
      for(var s=0;s<60;s++){var sx=(s*53+13)%CANVAS_W,sy=8+(s*31)%55,ss=s%4===0?2:1;ctx.fillRect(sx,sy,ss,ss);}
      var t=Date.now()*0.001;
      for(var l=0;l<5;l++){
        var lx=60+(l*70), ly=10+(l*8)+Math.sin(t+l)*6;
        ctx.fillStyle=PALETTE.lanternYel+'11';
        ctx.beginPath();ctx.ellipse(lx,ly-Math.sin(t*0.5+l)*3,4,10,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=PALETTE.lanternYel+'66';
        ctx.beginPath();ctx.arc(lx,ly,6+Math.sin(t*2+l)*2,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=PALETTE.creamPaper;
        ctx.beginPath();ctx.arc(lx,ly,3,0,Math.PI*2);ctx.fill();
      }
      ctx.fillStyle='rgba(160,168,176,0.08)';ctx.fillRect(0,55,CANVAS_W,22);
      ctx.fillStyle='rgba(160,168,176,0.05)';ctx.fillRect(0,72,CANVAS_W,18);
      ctx.fillStyle = PALETTE.darkForest; ctx.fillRect(0,100,CANVAS_W,40);
      ctx.fillStyle = PALETTE.oliveGreen; ctx.fillRect(0,115,CANVAS_W,140);
      for(var pp=0;pp<3;pp++){
        var px=[30,200,370][pp], ptop=[80,75,78][pp];
        ctx.fillStyle=PALETTE.earthBrown;ctx.fillRect(px-3,ptop+30,6,45);
        ctx.fillStyle=PALETTE.greyBrown;ctx.fillRect(px-2,ptop+35,2,18);ctx.fillRect(px+1,ptop+42,3,14);
        ctx.fillStyle=PALETTE.darkForest;
        ctx.beginPath();ctx.ellipse(px,ptop+12,9,28,0,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.ellipse(px,ptop+5,7,22,0.1,0,Math.PI*2);ctx.fill();
        ctx.fillStyle=PALETTE.oliveGreen;
        for(var pl=0;pl<6;pl++){ctx.fillRect(px-4+pl*2,ptop+pl*3+Math.sin(t*3+pl)*2,2,1);}
      }
      ctx.fillStyle=PALETTE.lanternYel+'33'; ctx.beginPath();ctx.arc(195,165,42,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(195,165,35,0,Math.PI*2);ctx.fillStyle=PALETTE.oliveGreen;ctx.fill();
      ctx.fillStyle=PALETTE.lanternYel+'55'; ctx.beginPath();ctx.arc(195,165,35,0,Math.PI*2);ctx.lineWidth=2;ctx.stroke();ctx.lineWidth=1;
      ctx.fillStyle=PALETTE.lanternYel+'22'; ctx.beginPath();ctx.arc(240,172,15,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=PALETTE.oliveGreen;ctx.beginPath();ctx.arc(240,172,13,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(240,172,15,0,Math.PI*2);ctx.fillStyle=PALETTE.lanternYel+'33';ctx.lineWidth=1;ctx.stroke();
      ctx.fillStyle=PALETTE.creamPaper+'15';
      for(var a=0;a<36;a++){ var rad=a*Math.PI/18; ctx.fillRect(195+Math.cos(rad)*28-1,165+Math.sin(rad)*28-1,3,3); }
      ctx.fillStyle='rgba(160,140,80,0.2)';
      for(var a2=0;a2<24;a2++){ var rad2=a2*Math.PI/12; ctx.fillRect(195+Math.cos(rad2)*20-1,165+Math.sin(rad2)*20,2,1); }
      ctx.fillStyle='rgba(160,168,176,0.15)';ctx.beginPath();ctx.arc(195,165,12,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='rgba(200,210,220,0.08)';ctx.beginPath();ctx.arc(193,163,8,0,Math.PI*2);ctx.fill();
      var shx=330, shy=155;
      ctx.fillStyle=PALETTE.greyBrown;ctx.fillRect(shx,shy,16,20);
      ctx.fillStyle=PALETTE.slateGrey;ctx.fillRect(shx-2,shy-4,20,6);
      ctx.fillStyle=PALETTE.alumGrey;ctx.fillRect(shx+6,shy-10,4,8);ctx.fillRect(shx+5,shy-9,6,2);
      ctx.fillStyle=PALETTE.lanternYel;ctx.fillRect(shx+6,shy+4,2,4);
      ctx.fillStyle='rgba(255,200,100,0.5)';ctx.beginPath();ctx.arc(shx+7,shy+3,3+Math.sin(t*4)*0.5,0,Math.PI*2);ctx.fill();
      ctx.fillStyle=PALETTE.burntOrange;ctx.fillRect(shx+3,shy+10,3,2);ctx.fillRect(shx+10,shy+12,3,2);
      ctx.fillStyle=PALETTE.oliveGreen;ctx.fillRect(shx+7,shy+8,3,1);
      var gx=315, gy=168;
      ctx.fillStyle='#C0C0C0'; ctx.fillRect(gx,gy,8,5); ctx.beginPath(); ctx.arc(gx+4,gy-1,3,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.moveTo(gx+1,gy-1); ctx.lineTo(gx,gy-5); ctx.lineTo(gx+3,gy-1); ctx.fill();
      ctx.beginPath(); ctx.moveTo(gx+7,gy-1); ctx.lineTo(gx+8,gy-5); ctx.lineTo(gx+5,gy-1); ctx.fill();
      ctx.fillStyle='#44FF44'; ctx.fillRect(gx+3,gy-2,1,1); ctx.fillRect(gx+5,gy-2,1,1);
      ctx.fillStyle='rgba(0,0,0,0.18)'; ctx.fillRect(0,0,20,CANVAS_H);ctx.fillRect(CANVAS_W-20,0,20,CANVAS_H); ctx.fillRect(0,0,CANVAS_W,15);ctx.fillRect(0,CANVAS_H-15,CANVAS_W,15);
      ctx.fillStyle = PALETTE.lanternYel; ctx.fillRect(165,CANVAS_H-18,55,14);
      ctx.fillStyle = PALETTE.nightBlue; ctx.fillRect(167,CANVAS_H-16,51,10);
      ctx.font = '8px "Courier New",monospace';
      ctx.fillStyle = PALETTE.creamPaper; ctx.fillText('CASCINA',168,CANVAS_H-8);
    }
  }
};
