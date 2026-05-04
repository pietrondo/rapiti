/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    CINEMATIC PIXI RENDERER
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Handles non-gameplay scenes: Title, Intro, Prologue, and Tutorial.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as PIXI from 'pixi.js';
import { CANVAS_W, CANVAS_H, gameState } from '../config.ts';

export class CinematicRenderer {
  private parent: any;
  private alienLightNodes: PIXI.Container[] = [];

  constructor(parent: any) {
    this.parent = parent;
  }

  renderTitle() {
    const t = Date.now() * 0.001;
    this.renderParallaxSky(t);
    
    if (!this.parent.sprites.ui_title_panel) {
       const panel = this.parent._createPixelPanel(332, 90, 'BENVENUTO');
       panel.x = 34; panel.y = 140;
       this.parent.sprites.ui_title_panel = panel;
       this.parent.layers.ui.addChild(panel);
       
       const titleText = new PIXI.Text({
          text: 'LE LUCI\nDI SAN CELESTE',
          style: { fontFamily: 'monospace', fontSize: 26, fill: 0xD4A843, align: 'center', fontWeight: 'bold' }
       });
       titleText.anchor.set(0.5); titleText.x = 332 / 2; titleText.y = 35;
       panel.addChild(titleText);

       const subtitleText = new PIXI.Text({
          text: 'Italia Settentrionale / Estate 1978',
          style: { fontFamily: 'monospace', fontSize: 10, fill: 0xC4956A, align: 'center' }
       });
       subtitleText.anchor.set(0.5); subtitleText.x = 332 / 2; subtitleText.y = 70;
       panel.addChild(subtitleText);
    }
    
    this.parent.sprites.ui_title_panel.y = 140 + Math.sin(t * 2) * 2;
    this.parent._renderPrompt('Premi ENTER per iniziare', CANVAS_W / 2, 238);
  }

  renderIntro() {
     const slide = gameState.introSlide;

     if (this.parent.lastStep !== slide) {
        const oldPanel = this.parent.sprites.ui_intro_panel;
        if (oldPanel) {
           oldPanel.alpha -= 0.1;
           oldPanel.scale.set(1 + (1 - oldPanel.alpha) * 0.05);
           if (oldPanel.alpha <= 0) {
              this.parent.layers.ui.removeChild(oldPanel);
              this.parent.sprites.ui_intro_panel = null;
              this.parent.lastStep = slide;
           }
           return;
        }
        this.parent.lastStep = slide;
     }

     if (!this.parent.sprites.ui_intro_panel) {
         const panel = this.parent._createPixelPanel(352, 195, 'DOSSIER PREFETTURA');
         panel.x = 24; panel.y = 44;
         panel.alpha = 0;
         panel.pivot.set(176, 97); panel.x = CANVAS_W/2; panel.y = 44 + 97;
        this.parent.sprites.ui_intro_panel = panel;
        this.parent.layers.ui.addChild(panel);

         const t = (window as any).t || ((k: string) => k);
         const playerName = gameState.playerName || 'Maurizio';
         const introData = [
            { title: t('cinematic.intro.1.title'), text: t('cinematic.intro.1.text') },
            { title: t('cinematic.intro.2.title'), text: t('cinematic.intro.2.text') },
            { title: t('cinematic.intro.3.title'), text: t('cinematic.intro.3.text', { name: playerName }) },
            { title: t('cinematic.intro.4.title'), text: t('cinematic.intro.4.text', { name: playerName }) }
         ];

        const data = introData[slide] || introData[0];
        
        const titleText = new PIXI.Text({
           text: data.title,
           style: { fontFamily: 'monospace', fontSize: 16, fill: 0xD4A843, fontWeight: 'bold' }
        });
        titleText.x = 20; titleText.y = 15;
        panel.addChild(titleText);

        const bodyText = new PIXI.Text({
           text: data.text,
           style: { fontFamily: 'monospace', fontSize: 10, fill: 0xE8DCC8, wordWrap: true, wordWrapWidth: 310, lineHeight: 14 }
        });
        bodyText.x = 20; bodyText.y = 45;
        panel.addChild(bodyText);
     }
     
     if (this.parent.sprites.ui_intro_panel.alpha < 1) {
        this.parent.sprites.ui_intro_panel.alpha += 0.05;
        this.parent.sprites.ui_intro_panel.scale.set(1.05 - this.parent.sprites.ui_intro_panel.alpha * 0.05);
     }
     
     const prompts = ['Premi ENTER per continuare', 'Premi ENTER per continuare', 'Premi ENTER per personalizzare', 'Premi ENTER per iniziare'];
     this.parent._renderPrompt(prompts[slide] || 'Premi ENTER', CANVAS_W / 2, 238);
  }

  renderPrologue() {
     const step = gameState.prologueStep;
     const t = gameState.prologueTimer * 0.016;

     if (this.parent.lastStep !== step) {
        this.parent._cleanupUI();
        this.parent.layers.bg.removeChildren();
        this.parent.layers.mid.removeChildren();
        this.parent.lastStep = step;
     }

     if (step <= 1) {
        if (!this.parent.sprites.ui_pro_night) {
           const tex = this.parent.generateTexture('pro_night_field', (ctx: CanvasRenderingContext2D) => {
              ctx.fillStyle = '#1A1C20';
              ctx.fillRect(0, 0, 400, 250);
              ctx.fillStyle = '#E8DCC8';
              [30,80,140,200,260,310,360,50,120,180,340,380].forEach((x,i) => {
                ctx.fillRect(x, 8+((i*23)%40), 1+((i*3)%2), 1+((i*7)%2));
              });
              ctx.fillStyle = '#D4A843';
              ctx.beginPath();
              ctx.arc(60, 25, 12, 0, Math.PI*2);
              ctx.fill();
              ctx.fillStyle = '#2D3047';
              ctx.beginPath();
              ctx.moveTo(0,80); ctx.lineTo(50,50); ctx.lineTo(130,65); ctx.lineTo(200,45);
              ctx.lineTo(300,60); ctx.lineTo(400,78); ctx.lineTo(400,90); ctx.lineTo(0,90);
              ctx.fill();
              ctx.fillStyle = '#5C7A4B';
              ctx.fillRect(0, 95, 400, 155);
              ctx.fillStyle = '#3D5A3C';
              for (let g2 = 0; g2 < 400; g2 += 6) {
                const wave = Math.sin(g2 * 0.05 + t * 3) * 4;
                ctx.fillRect(g2, 93 + wave, 3, 20 + Math.abs(wave));
              }
              ctx.fillStyle = '#6B5B4F';
              ctx.fillRect(180, 90, 40, 160);
           }, 400, 250);
           const bg = new PIXI.Sprite(tex);
           this.parent.sprites.ui_pro_night = bg;
           this.parent.layers.bg.addChildAt(bg, 0);
        }
        if (this.parent.sprites.ui_pro_night && !this.parent.layers.bg.children.includes(this.parent.sprites.ui_pro_night)) {
           this.parent.layers.bg.addChildAt(this.parent.sprites.ui_pro_night, 0);
        }
     } else {
        this.renderParallaxSky(t);
     }

     if (step >= 2) {
        if (!this.parent.sprites.ui_pro_light) {
           const lightGroup = new PIXI.Container();
           const outer = new PIXI.Graphics();
           outer.circle(0, 0, 50).fill({ color: 0xCCDDFF, alpha: 0.3 });
           const inner = new PIXI.Graphics();
           inner.circle(0, 0, 20).fill({ color: 0xFFFFFF, alpha: 0.5 });
           const rays = new PIXI.Graphics();
           rays.rect(-1, -30, 2, 60).fill({ color: 0xCCDDFF, alpha: 0.2 });
           rays.rect(-5, -20, 10, 40).fill({ color: 0xCCDDFF, alpha: 0.15 });
           lightGroup.addChild(outer, inner, rays);
           lightGroup.x = 200; lightGroup.y = 130;
           this.parent.sprites.ui_pro_light = lightGroup;
           this.parent.layers.mid.addChild(lightGroup);
        }
        const light = this.parent.sprites.ui_pro_light as PIXI.Container;
        if (light) {
           const pulse = 1 + Math.sin(t * 4) * 0.25;
           light.children[0].scale.set(pulse, pulse);
           light.children[1].scale.set(1 + Math.sin(t * 2) * 0.3, 1 + Math.sin(t * 2) * 0.3);
           light.alpha = Math.min(1, (step - 2) * 0.3 + 0.5 + Math.sin(t * 3) * 0.2);
        }
     }

     if (step >= 4) {
        if (!this.parent.sprites.ui_pro_circles) {
           const circles = new PIXI.Graphics();
           circles.x = 200; circles.y = 130;
           this.parent.sprites.ui_pro_circles = circles;
           this.parent.layers.mid.addChild(circles);
        }
        const circles = this.parent.sprites.ui_pro_circles as PIXI.Graphics;
        if (circles) {
           circles.clear();
           const alpha = Math.min(1, (step - 4) * 0.4 + Math.sin(t * 2) * 0.1);
           circles.circle(0, 0, 15 + Math.sin(t * 3) * 3).stroke({ width: 2, color: 0xD4A843, alpha: alpha });
           circles.circle(0, 0, 33 + Math.sin(t * 3 + 1) * 3).stroke({ width: 2, color: 0xD4A843, alpha: alpha });
           circles.circle(0, 0, 51 + Math.sin(t * 3 + 2) * 3).stroke({ width: 2, color: 0xD4A843, alpha: alpha });
           for (let a = 0; a < 24; a++) {
              const rad = (a * Math.PI) / 12;
              for (let r = 0; r < 3; r++) {
                 const rv = 20 + r * 16;
                 circles.rect(Math.cos(rad) * rv - 1, Math.sin(rad) * rv - 1, 3, 2).fill({ color: 0x5C7A4B, alpha: 0.67 });
              }
           }
        }
     }

     if (step >= 1 && step <= 5) {
        if (!this.parent.sprites.ui_pro_elena) {
           const sm = (window as any).SpriteManager;
           const sheet = sm.getOrCreateNPCSheet('teresa');
           const baseSource = PIXI.Texture.from({ resource: sheet }).source;
           const elenaTex = new PIXI.Texture({ 
             source: baseSource, 
             frame: new PIXI.Rectangle(0,0,32,32) 
           });
           const elenaGroup = new PIXI.Container();
           const shadow = new PIXI.Graphics();
           shadow.ellipse(8, 24, 4, 2).fill({ color: 0x000000, alpha: 0.3 });
           const elena = new PIXI.Sprite(elenaTex);
           elena.anchor.set(0.5, 1);
           elena.y = 24;

           const glow = new PIXI.Graphics();
           glow.circle(0, 0, 10).fill({ color: 0xF0C15A, alpha: 0.3 });
           glow.y = -5;
           elenaGroup.addChild(shadow, elena, glow);

           this.parent.sprites.ui_pro_elena = elenaGroup;
           this.parent.layers.mid.addChild(elenaGroup);
        }
        const e = this.parent.sprites.ui_pro_elena as PIXI.Container;
        if (e) {
           e.x = step >= 5 ? 200 : 50 + (t * 22) % 150; e.y = 115;
           e.scale.x = Math.sin(t * 12) > 0 ? 1 : -1;
        }
     } else if (step >= 6 && this.parent.sprites.ui_pro_elena?.parent) {
        this.parent.sprites.ui_pro_elena.parent.removeChild(this.parent.sprites.ui_pro_elena);
        delete this.parent.sprites.ui_pro_elena;
     }

     if (step >= 6) {
        if (!this.parent.sprites.ui_pro_fragment) {
           const frag = new PIXI.Graphics();
           frag.rect(196, 132, 6, 4).fill({ color: 0xA0A8B0 });
           frag.rect(197, 131, 4, 2).fill({ color: 0xE8DCC8, alpha: 0.53 });
           this.parent.sprites.ui_pro_fragment = frag;
           this.parent.layers.mid.addChild(frag);
        }
     }

     if (step >= 7) {
        if (!this.parent.sprites.ui_pro_flash) {
           const f = new PIXI.Graphics(); 
           f.rect(0, 0, 400, 250).fill({ color: 0xFFFFFF });
           f.alpha = 0;
           this.parent.sprites.ui_pro_flash = f; 
           this.parent.layers.fg.addChild(f);
        }
        if (this.parent.sprites.ui_pro_flash) {
           this.parent.sprites.ui_pro_flash.alpha = Math.min(0.9, (step - 7) * 0.3 + gameState.prologueTimer * 0.0012);
        }
     }

      if (step === 8) {
         if (!this.parent.sprites.ui_pro_final) {
            this.parent._cleanupUI();
            const cont = new PIXI.Container();
            const bg = new PIXI.Graphics(); 
            bg.rect(0, 0, 400, 250).fill({ color: 0xFFFFFF });
            cont.addChild(bg);
            const tFinal = (window as any).t || ((k: string) => k);
            const title = new PIXI.Text({ text: tFinal('prologue.final.title'), style: { fontFamily: 'monospace', fontSize: 20, fill: 0x0B0C12, fontWeight: 'bold' } });
            title.anchor.set(0.5); title.x = 200; title.y = 120;
            cont.addChild(title);
            const subtitle = new PIXI.Text({ text: tFinal('prologue.final.subtitle'), style: { fontFamily: 'monospace', fontSize: 11, fill: 0x4A5568 } });
           subtitle.anchor.set(0.5); subtitle.x = 200; subtitle.y = 142;
           cont.addChild(subtitle);
           this.parent.sprites.ui_pro_final = cont; this.parent.layers.ui.addChild(cont);
        }
     }

      const tSub = (window as any).t || ((k: string) => k);
      const subtitleTexts = [
        tSub('prologue.sub.0'),
        tSub('prologue.sub.1'),
        '',
        tSub('prologue.sub.3'),
        '',
        tSub('prologue.sub.5'),
        tSub('prologue.sub.6'),
        tSub('prologue.sub.7'),
        tSub('prologue.sub.8'),
        '',
      ];
     const txt = step < subtitleTexts.length ? subtitleTexts[step] : '';
     if (txt && step < 8) {
        const subKey = `ui_pro_sub_${step}`;
        if (!this.parent.sprites[subKey]) {
           const subC = new PIXI.Container();
           const subBg = new PIXI.Graphics();
           subBg.rect(0, 0, 300, 22).fill({ color: 0x000000, alpha: 0.55 });
           subC.addChild(subBg);
           const subT = new PIXI.Text({ text: txt, style: { fontFamily: 'monospace', fontSize: 9, fill: 0xE8DCC8 } });
           subT.anchor.set(0.5, 0); subT.x = 150; subT.y = 4;
           subC.addChild(subT);
           subC.x = 50; subC.y = 210;
           this.parent.sprites[subKey] = subC;
           this.parent.layers.ui.addChild(subC);
        }
     }

      if (step === 8 && !this.parent.sprites.ui_pro_prompt) {
        const t2 = (window as any).t || ((k: string) => k);
        this.parent._renderPrompt(t2('prologue.prompt.wait'), 200, 238);
        this.parent.sprites.ui_pro_prompt = true;
     }
  }

  renderTutorial() {
     if (!this.parent.sprites.ui_tut_panel) {
        const panel = this.parent._createPixelPanel(340, 220, 'TACCUINO OPERATIVO');
        panel.x = 30; panel.y = 15;
        this.parent.sprites.ui_tut_panel = panel;
        this.parent.layers.ui.addChild(panel);

        const t = (window as any).t || ((k: string) => k);

        const headerText = new PIXI.Text({
            text: t('tutorial.header'),
            style: { fontFamily: 'monospace', fontSize: 16, fill: 0xD4A843, fontWeight: 'bold' }
        });
        headerText.anchor.set(0.5); headerText.x = 170; headerText.y = 30;
        panel.addChild(headerText);

        const controls = [
            { key: 'WASD', desc: t('tutorial.ctrl.wasd'), icon: true },
            { key: 'E', desc: t('tutorial.ctrl.interact') },
            { key: 'J', desc: t('tutorial.ctrl.journal') },
            { key: 'I', desc: t('tutorial.ctrl.inventory') },
            { key: 'T', desc: t('tutorial.ctrl.deduction') },
            { key: 'N', desc: t('tutorial.ctrl.minimap') },
            { key: 'M', desc: t('tutorial.ctrl.music') },
            { key: 'ESC', desc: t('tutorial.ctrl.close') },
         ];

        const tutY = 55;
        const spacing = 15;
        controls.forEach((c, i) => {
           const row = new PIXI.Container();
           row.y = tutY + i * spacing;

           if (c.icon) {
              // Disegna tasti WASD come keycaps
              const keys = ['W', 'A', 'S', 'D'];
              const positions = [[16, 0], [4, 8], [16, 8], [28, 8]];
              positions.forEach((pos, ki) => {
                 const kc = new PIXI.Graphics();
                 kc.rect(pos[0], pos[1] - 2, 10, 10).fill({ color: 0x2A2D35 });
                 kc.rect(pos[0], pos[1] - 2, 10, 10).stroke({ width: 1, color: 0x4A5568 });
                 const kt = new PIXI.Text({
                    text: keys[ki],
                    style: { fontFamily: 'monospace', fontSize: 7, fill: 0xD4A843 }
                 });
                 kt.x = pos[0] + 2; kt.y = pos[1] - 2;
                 row.addChild(kc);
                 row.addChild(kt);
              });
           } else {
              const keyBg = new PIXI.Graphics();
              keyBg.rect(0, -5, c.key.length * 7 + 8, 11).fill({ color: 0xD4A843, alpha: 0.16 });
              row.addChild(keyBg);
              const keyText = new PIXI.Text({
                 text: c.key,
                 style: { fontFamily: 'monospace', fontSize: 10, fill: 0xD4A843 }
              });
              keyText.x = 5; keyText.y = -5;
              row.addChild(keyText);
           }

           const descText = new PIXI.Text({
              text: c.desc,
              style: { fontFamily: 'monospace', fontSize: 10, fill: 0xE8DCC8 }
           });
           descText.x = 100; descText.y = -5;
           row.addChild(descText);

           panel.addChild(row);
        });

        const objKey = new PIXI.Text({
            text: t('tutorial.objective.label'),
            style: { fontFamily: 'monospace', fontSize: 10, fill: 0xD4A843, fontWeight: 'bold' }
        });
        objKey.x = 25; objKey.y = 182;
        panel.addChild(objKey);

        const objText = new PIXI.Text({
            text: t('tutorial.objective.text'),
            style: { fontFamily: 'monospace', fontSize: 10, fill: 0xE8DCC8 }
        });
        objText.x = 100; objText.y = 182;
        panel.addChild(objText);
     }
      this.parent._renderPrompt(t('tutorial.prompt.start'), CANVAS_W / 2, 240);
  }

  renderParallaxSky(t: number) {
    if (!this.parent.sprites.ui_sky) {
      const tex = this.parent.generateTexture('cinematic_sky', (ctx: CanvasRenderingContext2D) => {
        const g = ctx.createLinearGradient(0, 0, 0, 250);
        g.addColorStop(0, '#020408');
        g.addColorStop(1, '#1A1C20');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 400, 250);
        
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 100; i++) {
          ctx.globalAlpha = Math.random() * 0.5 + 0.2;
          ctx.fillRect(Math.random() * 400, Math.random() * 150, 1, 1);
        }
        ctx.globalAlpha = 1;

        ctx.fillStyle = 'rgba(100,140,200,0.18)';
        ctx.beginPath();
        ctx.arc(60, 25, 34, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'rgba(200,220,255,0.7)';
        ctx.beginPath();
        ctx.arc(60, 25, 12, 0, Math.PI * 2);
        ctx.fill();
        const beamGrad = ctx.createLinearGradient(60, 25, 60, 180);
        beamGrad.addColorStop(0, 'rgba(200,220,255,0.08)');
        beamGrad.addColorStop(1, 'rgba(200,220,255,0)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(30, 25);
        ctx.lineTo(90, 25);
        ctx.lineTo(140, 180);
        ctx.lineTo(0, 180);
        ctx.fill();

        ctx.fillStyle = '#202735';
        ctx.fillRect(280, 48, 80, 102);
        ctx.fillRect(290, 40, 60, 12);
        ctx.fillStyle = '#4F3428';
        ctx.beginPath();
        ctx.moveTo(280, 52);
        ctx.lineTo(315, 28);
        ctx.lineTo(350, 52);
        ctx.fill();
        ctx.fillStyle = '#131722';
        ctx.fillRect(312, 12, 6, 20);
        ctx.fillStyle = '#D4A843';
        ctx.globalAlpha = 0.7;
        ctx.fillRect(300, 65, 6, 8);
        ctx.fillRect(312, 65, 6, 8);
        ctx.fillRect(324, 65, 6, 10);
        ctx.fillRect(300, 85, 6, 8);
        ctx.fillRect(318, 85, 6, 8);
        ctx.fillRect(330, 85, 6, 8);
        ctx.fillRect(306, 105, 6, 8);
        ctx.fillRect(320, 105, 6, 8);
        ctx.globalAlpha = 1;

        ctx.fillStyle = '#21351F';
        for (let g = 0; g < 20; g++) {
          ctx.fillRect(g * 40, 186, 20, 4);
          ctx.fillRect(g * 40 + 20, 190, 20, 4);
        }
        ctx.fillStyle = '#2B4426';
        for (let g = 0; g < 20; g++) {
          ctx.fillRect(g * 40 + 10, 188, 20, 4);
          ctx.fillRect(g * 40 + 30, 192, 20, 4);
        }
        ctx.fillStyle = '#1F2D1A';
        for (let g = 0; g < 20; g++) {
          ctx.fillRect(g * 40, 194, 40, 6);
          ctx.fillRect(g * 40 + 10, 200, 30, 6);
        }
      }, 400, 250);
      this.parent.sprites.ui_sky = new PIXI.Sprite(tex);
      this.parent.layers.bg.addChildAt(this.parent.sprites.ui_sky, 0);
    }

    if (this.parent.sprites.ui_sky && !this.parent.layers.bg.children.includes(this.parent.sprites.ui_sky)) {
      this.parent.layers.bg.addChildAt(this.parent.sprites.ui_sky, 0);
    }

    if (
      !this.parent.sprites.ui_alien_lights ||
      this.parent.sprites.ui_alien_lights.destroyed ||
      this.alienLightNodes.length !== 3
    ) {
      if (this.parent.sprites.ui_alien_lights?.parent) {
        this.parent.sprites.ui_alien_lights.parent.removeChild(this.parent.sprites.ui_alien_lights);
      }
      const c = new PIXI.Container();
      const lights: PIXI.Container[] = [];
      for (let i = 0; i < 3; i++) {
        const light = new PIXI.Container();
        const glow = new PIXI.Graphics();
        glow.circle(0, 0, 20).fill({ color: 0x88aaff, alpha: 0.2 });
        const core = new PIXI.Graphics();
        core.circle(0, 0, 8).fill({ color: 0xc8dcff, alpha: 0.6 });
        light.addChild(glow, core);
        light.x = 100 + i * 100; light.y = 50;
        c.addChild(light);
        lights.push(light);
      }
      this.parent.sprites.ui_alien_lights = c;
      this.alienLightNodes = lights;
      this.parent.layers.bg.addChild(c);
    } else if (!this.parent.layers.bg.children.includes(this.parent.sprites.ui_alien_lights)) {
      this.parent.layers.bg.addChild(this.parent.sprites.ui_alien_lights);
    }

    this.alienLightNodes.forEach((l: PIXI.Container, i: number) => {
      l.x += Math.sin(t + i) * 0.5;
      l.y += Math.cos(t * 0.5 + i) * 0.3;
      l.alpha = 0.4 + Math.sin(t * 2 + i) * 0.4;
    });

    if (!this.parent.sprites.ui_mtn_back) {
      const tex = this.parent.generateTexture('mtn_back', (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = '#111824'; ctx.beginPath(); ctx.moveTo(0, 150); ctx.lineTo(80, 100); ctx.lineTo(180, 140); ctx.lineTo(300, 90); ctx.lineTo(400, 150); ctx.lineTo(400, 250); ctx.lineTo(0, 250); ctx.fill();
      }, 400, 250);
      this.parent.sprites.ui_mtn_back = new PIXI.TilingSprite({ texture: tex, width: 800, height: 250 });
      this.parent.layers.bg.addChild(this.parent.sprites.ui_mtn_back);
    }
    if (this.parent.sprites.ui_mtn_back && !this.parent.layers.bg.children.includes(this.parent.sprites.ui_mtn_back)) {
      this.parent.layers.bg.addChild(this.parent.sprites.ui_mtn_back);
    }
    if (!this.parent.sprites.ui_mtn_front) {
      const tex = this.parent.generateTexture('mtn_front', (ctx: CanvasRenderingContext2D) => {
        ctx.fillStyle = '#0a0d16'; ctx.beginPath(); ctx.moveTo(0, 180); ctx.lineTo(120, 140); ctx.lineTo(250, 170); ctx.lineTo(350, 130); ctx.lineTo(400, 180); ctx.lineTo(400, 250); ctx.lineTo(0, 250); ctx.fill();
      }, 400, 250);
      this.parent.sprites.ui_mtn_front = new PIXI.TilingSprite({ texture: tex, width: 800, height: 250 });
      this.parent.layers.bg.addChild(this.parent.sprites.ui_mtn_front);
    }
    if (this.parent.sprites.ui_mtn_front && !this.parent.layers.bg.children.includes(this.parent.sprites.ui_mtn_front)) {
      this.parent.layers.bg.addChild(this.parent.sprites.ui_mtn_front);
    }

    this.parent.sprites.ui_mtn_back.tilePosition.x = -t * 5;
    this.parent.sprites.ui_mtn_front.tilePosition.x = -t * 12;
  }
}
