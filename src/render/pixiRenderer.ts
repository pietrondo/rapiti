/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    PIXI RENDERER (CORE ENGINE)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Engine principale WebGL basato su PixiJS v8.
 * Gestisce l'Application, i Layer (Stage), la cache delle texture e l'UI.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as PIXI from 'pixi.js';
import { CANVAS_W, CANVAS_H, gameState } from '../config.mjs';

class PixiRenderer {
  app: PIXI.Application | null = null;
  world: PIXI.Container | null = null;
  layers: Record<string, PIXI.Container> = {};
  sprites: Record<string, any> = {};
  crtFilter: any = null;
  
  // Cache per texture generate da primitive Canvas
  textureCache: Record<string, any> = {};
  
  // Pool di texture per animazioni
  playerTextures: PIXI.Texture[] = [];
  npcTextures: Record<string, PIXI.Texture[]> = {};
  
  // Riferimenti di stato
  lastArea: string | null = null;
  lastPhase: string | null = null;
  lastStep: number | null = null;

  async init() {
    this.app = new PIXI.Application();
    
    await this.app.init({
      width: CANVAS_W * 2, 
      height: CANVAS_H * 2,
      backgroundColor: 0x05070a,
      resolution: 1,
      antialias: false,
    });

    console.log(`[PixiRenderer] App initialized: ${this.app.renderer.type} renderer`);

    PIXI.AbstractRenderer.defaultOptions.roundPixels = true;
    
    const stack = document.getElementById('canvas-stack');
    if (stack) {
      stack.appendChild(this.app.canvas);
      this.app.canvas.id = 'pixi-canvas';
    }

    this.world = new PIXI.Container();
    this.app.stage.addChild(this.world);
    this.world.scale.set(2);

    this.layers.bg = new PIXI.Container();
    this.layers.mid = new PIXI.Container();
    this.layers.fg = new PIXI.Container();
    this.layers.weather = new PIXI.Container();
    this.layers.ui = new PIXI.Container();

    this.world.addChild(this.layers.bg);
    this.world.addChild(this.layers.mid);
    this.world.addChild(this.layers.fg);
    this.world.addChild(this.layers.weather);
    this.world.addChild(this.layers.ui);

    // CRT EFFECT OVERLAY (Custom Pixi v8)
    this._setupCRT();

    console.log('[PixiRenderer] Engine v8 inizializzato');
  }

  private _setupCRT() {
    const crt = new PIXI.Container();
    crt.zIndex = 1000;
    
    // Scanlines
    const scanlines = new PIXI.Graphics();
    for (let i = 0; i < CANVAS_H; i += 2) {
      scanlines.rect(0, i, CANVAS_W, 1).fill({ color: 0x000000, alpha: 0.1 });
    }
    crt.addChild(scanlines);

    // Vignette / Shadow
    const grad = new PIXI.Graphics();
    grad.rect(0, 0, CANVAS_W, CANVAS_H).fill({
      color: 0x000000,
      alpha: 0.05
    });
    crt.addChild(grad);

    this.world?.addChild(crt);
    this.sprites.ui_crt = crt;
  }

  generateTexture(id: string, drawFn: (ctx: CanvasRenderingContext2D) => void, w: number, h: number): PIXI.Texture {
    if (this.textureCache[id]) return this.textureCache[id];
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    drawFn(ctx);
    // PIXI v8: v8 pattern per canvas resource
    const texture = PIXI.Texture.from({ resource: canvas });
    this.textureCache[id] = texture;
    return texture;
  }

  _cleanupArea() {
    console.log('[PixiRenderer] Cleaning up area sprites');
    for (let key in this.sprites) {
      if (key.startsWith('npc_')) {
        this.layers.mid.removeChild(this.sprites[key]);
        delete this.sprites[key];
      }
    }
  }

  _cleanupUI() {
    console.log('[PixiRenderer] Cleaning up UI layers');
    this.layers.ui.removeChildren();
    this.layers.mid.removeChildren();
    this.layers.fg.removeChildren();
    for (let key in this.sprites) {
       if (key.startsWith('ui_')) delete this.sprites[key];
    }
    if (this.sprites.player) {
      this.layers.mid.addChild(this.sprites.player);
    }
  }

  setEnabled(active: boolean) {
    const legacy = document.getElementById('gameCanvas');
    const pixi = document.getElementById('pixi-canvas');
    if (!legacy || !pixi) return;
    
    if (active) {
      legacy.style.pointerEvents = 'none';
      pixi.style.visibility = 'visible';
    } else {
      legacy.style.pointerEvents = 'auto';
      pixi.style.visibility = 'hidden';
    }
  }

  render() {
    if (!this.app || !this.world) return;
    const ph = gameState.gamePhase;

    if (this.lastPhase !== ph) {
      console.log(`[PixiRenderer] Phase transition: ${this.lastPhase} -> ${ph}`);
      this._cleanupUI();
      this.layers.bg.removeChildren();
      this.lastPhase = ph;
    }

    switch (ph) {
      case 'title': this._renderTitle(); break;
      case 'intro': this._renderIntro(); break;
      case 'prologue_cutscene': this._renderPrologue(); break;
      case 'tutorial': this._renderTutorial(); break;
      case 'playing':
      case 'dialogue': this._renderGameplay(); break;
    }

    this._applyFilters();
  }

  private _renderParallaxSky(t: number) {
    if (!this.sprites.ui_sky) {
      const tex = this.generateTexture('cinematic_sky', (ctx) => {
        const g = ctx.createLinearGradient(0, 0, 0, 250);
        g.addColorStop(0, '#020408');
        g.addColorStop(1, '#0b0e1a');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 400, 250);
        
        // Stars
        ctx.fillStyle = '#fff';
        for (let i = 0; i < 100; i++) {
          ctx.globalAlpha = Math.random() * 0.5 + 0.2;
          ctx.fillRect(Math.random() * 400, Math.random() * 150, 1, 1);
        }
        ctx.globalAlpha = 1;
      }, 400, 250);
      this.sprites.ui_sky = new PIXI.Sprite(tex);
      this.layers.bg.addChildAt(this.sprites.ui_sky, 0);
    }

    // Alien Lights
    if (!this.sprites.ui_alien_lights) {
      const c = new PIXI.Container();
      for (let i = 0; i < 3; i++) {
        const l = new PIXI.Graphics();
        l.circle(0, 0, 8).fill({ color: 0xc8dcff, alpha: 0.6 });
        // Add glow
        const glow = new PIXI.Graphics();
        glow.circle(0, 0, 20).fill({ color: 0x88aaff, alpha: 0.2 });
        l.addChild(glow);
        l.x = 100 + i * 100; l.y = 50;
        c.addChild(l);
      }
      this.sprites.ui_alien_lights = c;
      this.layers.bg.addChild(c);
    }

    const lights = this.sprites.ui_alien_lights.children;
    lights.forEach((l: any, i: number) => {
      l.x += Math.sin(t + i) * 0.5;
      l.y += Math.cos(t * 0.5 + i) * 0.3;
      l.alpha = 0.4 + Math.sin(t * 2 + i) * 0.4;
    });

    // Mountains Parallax
    if (!this.sprites.ui_mtn_back) {
      const tex = this.generateTexture('mtn_back', (ctx) => {
        ctx.fillStyle = '#111824'; ctx.beginPath(); ctx.moveTo(0, 150); ctx.lineTo(80, 100); ctx.lineTo(180, 140); ctx.lineTo(300, 90); ctx.lineTo(400, 150); ctx.lineTo(400, 250); ctx.lineTo(0, 250); ctx.fill();
      }, 400, 250);
      this.sprites.ui_mtn_back = new PIXI.TilingSprite({ texture: tex, width: 800, height: 250 });
      this.layers.bg.addChild(this.sprites.ui_mtn_back);
    }
    if (!this.sprites.ui_mtn_front) {
      const tex = this.generateTexture('mtn_front', (ctx) => {
        ctx.fillStyle = '#0a0d16'; ctx.beginPath(); ctx.moveTo(0, 180); ctx.lineTo(120, 140); ctx.lineTo(250, 170); ctx.lineTo(350, 130); ctx.lineTo(400, 180); ctx.lineTo(400, 250); ctx.lineTo(0, 250); ctx.fill();
      }, 400, 250);
      this.sprites.ui_mtn_front = new PIXI.TilingSprite({ texture: tex, width: 800, height: 250 });
      this.layers.bg.addChild(this.sprites.ui_mtn_front);
    }

    this.sprites.ui_mtn_back.tilePosition.x = -t * 5;
    this.sprites.ui_mtn_front.tilePosition.x = -t * 12;
  }

  private _renderTitle() {
    const t = Date.now() * 0.001;
    this._renderParallaxSky(t);
    
    if (!this.sprites.ui_title_panel) {
       const panel = this._createPixelPanel(332, 90, 'BENVENUTO');
       panel.x = 34; panel.y = 140;
       this.sprites.ui_title_panel = panel;
       this.layers.ui.addChild(panel);
       
       const titleText = new PIXI.Text({
          text: 'LE LUCI\\nDI SAN CELESTE',
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
    
    this.sprites.ui_title_panel.y = 140 + Math.sin(t * 2) * 2;
    this._renderPrompt('Premi ENTER per iniziare', CANVAS_W / 2, 238);
  }

  private _renderIntro() {
     const slide = gameState.introSlide;

     if (this.lastStep !== slide) {
        // Animation transition logic
        const oldPanel = this.sprites.ui_intro_panel;
        if (oldPanel) {
           oldPanel.alpha -= 0.1;
           oldPanel.scale.set(1 + (1 - oldPanel.alpha) * 0.05);
           if (oldPanel.alpha <= 0) {
              this.layers.ui.removeChild(oldPanel);
              this.sprites.ui_intro_panel = null;
              this.lastStep = slide;
           }
           return; // Wait for fade out
        }
        this.lastStep = slide;
     }

     if (!this.sprites.ui_intro_panel) {
        const panel = this._createPixelPanel(352, 178, 'DOSSIER PREFETTURA');
        panel.x = 24; panel.y = 44;
        panel.alpha = 0; // Start faded out
        panel.pivot.set(176, 89); panel.x = CANVAS_W/2; panel.y = 44 + 89;
        this.sprites.ui_intro_panel = panel;
        this.layers.ui.addChild(panel);

        const introData = [
           { title: 'SAN CELESTE', text: 'Un piccolo borgo tra Parma e Piacenza.\\n800 anime, una piazza, un campanile, un bar.\\n\\nDa tre notti, strane luci appaiono\\nnel cielo sopra i campi a nord.\\nNon sono stelle. Non sono aerei.\\n\\nIl paese ha paura.' },
           { title: 'LE SPARIZIONI', text: 'Tre persone sono scomparse.\\nEnzo Bellandi, 19 anni.\\nEra uscito a guardare le luci.\\n\\nSua nonna Teresa\\nnon dorme più da tre giorni.\\n\\nLa Prefettura di Parma\\nha mandato il suo miglior uomo.' },
           { title: 'IL DETECTIVE', text: `Quell'uomo sei tu,\\n${gameState.playerName}.\\n\\nUn detective pragmatico, razionale,\\ncon un debole per il caffè\\ne un sesto senso per i misteri.\\n\\nFuori ti aspettano la piazza e la cascina.\\nE il Campo delle Luci.` },
           { title: "L'INCARICO", text: `"Detective ${gameState.playerName},\\nvada a San Celeste.\\nScopra cosa sta succedendo.\\nE torni con delle risposte."\\n\\nNon sai ancora che quelle risposte\\nti cambieranno per sempre.\\nLe luci sono tornate.\\nCome nel 1861. Come nel 1961.` }
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
           style: { fontFamily: 'monospace', fontSize: 11, fill: 0xE8DCC8, wordWrap: true, wordWrapWidth: 310, lineHeight: 16 }
        });
        bodyText.x = 20; bodyText.y = 45;
        panel.addChild(bodyText);
     }
     
     if (this.sprites.ui_intro_panel.alpha < 1) {
        this.sprites.ui_intro_panel.alpha += 0.05;
        this.sprites.ui_intro_panel.scale.set(1.05 - this.sprites.ui_intro_panel.alpha * 0.05);
     }
     
     const prompts = ['Premi ENTER per continuare', 'Premi ENTER per continuare', 'Premi ENTER per personalizzare', 'Premi ENTER per iniziare'];
     this._renderPrompt(prompts[slide] || 'Premi ENTER', CANVAS_W / 2, 238);
  }

  private _renderPrologue() {
     const step = gameState.prologueStep;
     const t = gameState.prologueTimer * 0.016;

     if (this.lastStep !== step) {
        this._cleanupUI();
        this.layers.bg.removeChildren();
        this.lastStep = step;
     }

     this._renderParallaxSky(t);

     if (step >= 2 && step <= 6) {
        if (!this.sprites.ui_pro_light) {
           const light = new PIXI.Graphics();
           light.circle(0, 0, 60).fill({ color: 0xC8DCFF, alpha: 0.4 });
           light.x = 200; light.y = 140;
           this.sprites.ui_pro_light = light;
           this.layers.mid.addChild(light);
        }
        if (this.sprites.ui_pro_light) {
           this.sprites.ui_pro_light.scale.set(1 + Math.sin(t * 5) * 0.2);
        }
     }

     if (step >= 1 && step <= 5) {
        if (!this.sprites.ui_pro_elena) {
           const sm = (window as any).SpriteManager;
           const sheet = sm.getOrCreateNPCSheet('teresa');
           const baseSource = PIXI.Texture.from({ resource: sheet }).source;
           const elenaTex = new PIXI.Texture({ 
             source: baseSource, 
             frame: new PIXI.Rectangle(0,0,32,32) 
           });
           const elena = new PIXI.Sprite(elenaTex);
           elena.anchor.set(0.5, 1);
           
           const glow = new PIXI.Graphics();
           glow.circle(0, 0, 10).fill({ color: 0xF0C15A, alpha: 0.3 });
           glow.y = -15; elena.addChild(glow);
           
           this.sprites.ui_pro_elena = elena;
           this.layers.mid.addChild(elena);
        }
        const e = this.sprites.ui_pro_elena as PIXI.Sprite;
        if (e) {
           e.x = step >= 5 ? 200 : 50 + (t * 22) % 150; e.y = 145;
           e.scale.x = Math.sin(t * 12) > 0 ? 1 : -1;
        }
     }

     if (step === 7) {
        if (!this.sprites.ui_pro_flash) {
           const f = new PIXI.Graphics(); 
           f.rect(0, 0, 400, 250).fill({ color: 0xFFFFFF });
           this.sprites.ui_pro_flash = f; 
           this.layers.fg.addChild(f);
        }
        if (this.sprites.ui_pro_flash) {
           this.sprites.ui_pro_flash.alpha = Math.min(1, t * 0.45);
        }
     }

     if (step === 8) {
        if (!this.sprites.ui_pro_final) {
           this._cleanupUI();
           const cont = new PIXI.Container();
           const bg = new PIXI.Graphics(); 
           bg.rect(0, 0, 400, 250).fill({ color: 0xFFFFFF });
           cont.addChild(bg);
           const title = new PIXI.Text({ text: 'LE LUCI DI SAN CELESTE', style: { fontFamily: 'monospace', fontSize: 20, fill: 0x0B0C12, fontWeight: 'bold' } });
           title.anchor.set(0.5); title.x = 200; title.y = 120;
           cont.addChild(title);
           this.sprites.ui_pro_final = cont; this.layers.ui.addChild(cont);
        }
     }
  }

  private _renderTutorial() {
     if (!this.sprites.ui_tut_panel) {
        const panel = this._createPixelPanel(340, 210, 'ISTRUZIONI');
        panel.x = 30; panel.y = 20;
        this.sprites.ui_tut_panel = panel;
        this.layers.ui.addChild(panel);
        
        const helpText = new PIXI.Text({
           text: 'WASD: Muovi\\nE: Interagisci\\nJ: Diario\\nI: Inventario\\nESC: Chiudi',
           style: { fontFamily: 'monospace', fontSize: 12, fill: 0xE8DCC8, lineHeight: 20 }
        });
        helpText.x = 60; helpText.y = 70;
        this.layers.ui.addChild(helpText);
     }
     this._renderPrompt('Premi ENTER per iniziare', CANVAS_W / 2, 235);
  }

  private _renderGameplay() {
    if (this.lastArea !== gameState.currentArea) {
      console.log(`[PixiRenderer] Area transition: ${this.lastArea} -> ${gameState.currentArea}`);
      this._cleanupArea();
      this.layers.bg.removeChildren(); // FIX: Forza pulizia BG al cambio area
      this.lastArea = gameState.currentArea;
    }
    this._syncBackground(); this._syncPlayer(); this._syncNPCs();
    this.layers.mid.children.sort((a, b) => a.y - b.y);
  }

  private _createPixelPanel(w: number, h: number, title?: string): PIXI.Container {
    const c = new PIXI.Container();
    const s = new PIXI.Graphics();
    s.rect(4, 5, w, h).fill({ color: 0x05060a, alpha: 0.4 });
    c.addChild(s);
    const b = new PIXI.Graphics();
    b.rect(0, 0, w, h).fill({ color: 0x15161B });
    c.addChild(b);
    const l = new PIXI.Graphics();
    l.rect(0, 0, w, h).stroke({ width: 2, color: 0xD4A843 });
    c.addChild(l);

    if (title) {
       const tb = new PIXI.Graphics();
       tb.rect(12, -6, title.length * 8 + 10, 12).fill({ color: 0xD4A843 });
       c.addChild(tb);
       const tt = new PIXI.Text({ text: title, style: { fontFamily: 'monospace', fontSize: 9, fill: 0x0B0C12 } });
       tt.x = 16; tt.y = -5; c.addChild(tt);
    }
    return c;
  }

  private _renderPrompt(text: string, x: number, y: number) {
    const key = `ui_prompt_${text}`;
    if (!this.sprites[key]) {
       const c = new PIXI.Container();
       const bg = new PIXI.Graphics();
       bg.rect(-80, -8, 160, 16).fill({ color: 0x000000, alpha: 0.6 });
       c.addChild(bg);
       const t = new PIXI.Text({ text, style: { fontFamily: 'monospace', fontSize: 10, fill: 0xE8DCC8 } });
       t.anchor.set(0.5); c.addChild(t);
       c.x = x; c.y = y; this.sprites[key] = c; this.layers.ui.addChild(c);
    }
    this.sprites[key].alpha = 0.5 + Math.sin(Date.now() * 0.004) * 0.4;
  }

  private _syncBackground() {
    const areaId = gameState.currentArea;
    const bgKey = `ui_bg_${areaId}`;

    if (!this.sprites[bgKey]) {
      const area = (window as any).areas[areaId];
      if (area?.draw) {
        console.log(`[PixiRenderer] Generating background for ${areaId}`);
        const tex = this.generateTexture(bgKey, (ctx) => area.draw(ctx, 0), CANVAS_W, CANVAS_H);
        const bg = new PIXI.Sprite(tex);
        this.sprites[bgKey] = bg;
      } else {
        console.warn(`[PixiRenderer] Area ${areaId} has no draw function!`);
      }
    }

    // Assicurati che sia nel layer corretto
    const bg = this.sprites[bgKey];
    if (bg && !this.layers.bg.children.includes(bg)) {
       console.log(`[PixiRenderer] Re-attaching background: ${bgKey}`);
       this.layers.bg.addChild(bg);
    }

    for (let k in this.sprites) {
       if (k.startsWith('ui_bg_')) {
          this.sprites[k].visible = (k === bgKey);
       }
    }
  }

  private _syncPlayer() {
    const p = gameState.player;
    const sm = (window as any).SpriteManager;
    const sheet = sm.getOrCreatePlayerSheet();
    
    if (!this.sprites.player || this.textureCache.playerSheet !== sheet) {
       console.log('[PixiRenderer] Updating player sprite textures');
       this.textureCache.playerSheet = sheet;
       this.playerTextures = [];
       const baseSource = PIXI.Texture.from({ resource: sheet }).source;
       
       for (let i = 0; i < 16; i++) {
          const row = Math.floor(i / 4);
          const col = i % 4;
          this.playerTextures.push(new PIXI.Texture({ 
             source: baseSource, 
             frame: new PIXI.Rectangle(col * 32, row * 32, 32, 32) 
          }));
       }
       if (!this.sprites.player) {
         this.sprites.player = new PIXI.Sprite(this.playerTextures[0]);
         this.sprites.player.anchor.set(0.5, 1);
         this.layers.mid.addChild(this.sprites.player);
       }
    }

    const s = this.sprites.player as PIXI.Sprite;
    s.x = p.x + 16; s.y = p.y + 16;
    const dir = { down: 0, up: 1, left: 2, right: 3 }[p.dir] || 0;
    const f = Math.floor(sm.animState.playerFrame || 0);
    s.texture = this.playerTextures[(dir * 4) + (f % 4)];
    
    if (p.discoveryJump > 0) {
      const pr = p.discoveryJump / 20;
      s.scale.y = 1 + Math.sin(pr * Math.PI) * 0.3; s.scale.x = 1 / s.scale.y;
    } else s.scale.set(1);
  }

  private _syncNPCs() {
    const area = (window as any).areas[gameState.currentArea];
    if (!area?.npcs) return;
    const sm = (window as any).SpriteManager;

    area.npcs.forEach((n: any) => {
      const key = `npc_${n.id}`;
      const sheet = sm.getOrCreateNPCSheet(n.id);
      if (!this.sprites[key] || this.textureCache[`npc_${n.id}`] !== sheet) {
        console.log(`[PixiRenderer] Creating/Updating NPC sprite: ${n.id}`);
        this.textureCache[`npc_${n.id}`] = sheet;
        const baseSource = PIXI.Texture.from({ resource: sheet }).source;
        const npcTex = new PIXI.Texture({
           source: baseSource,
           frame: new PIXI.Rectangle(0, 0, 32, 32)
        });
        this.npcTextures[n.id] = [npcTex];
        
        if (!this.sprites[key]) {
           const spr = new PIXI.Sprite(npcTex);
           spr.anchor.set(0.5, 1); this.layers.mid.addChild(spr); this.sprites[key] = spr;
        }
      }
      const s = this.sprites[key] as PIXI.Sprite;
      s.x = n.x; s.y = n.y;
      s.texture = this.npcTextures[n.id][0];
    });
  }

  private _applyFilters() {
    if (!this.world) return;
    const sm = (window as any).StoryManager;
    
    if (!this.world.filters || this.world.filters.length === 0) {
       this.world.filters = [new PIXI.NoiseFilter({ noise: 0.08 })];
    }

    if (sm?.hasFlag('near_lights')) {
       if (this.world.filters.length === 1) {
          this.world.filters.push(new PIXI.ColorMatrixFilter());
       }
       const f = this.world.filters[1] as PIXI.ColorMatrixFilter;
       f.hue(Math.sin(Date.now() * 0.005) * 45, true);
       
       // Glitch effect
       if (Math.random() > 0.9) {
          this.world.x = (Math.random() - 0.5) * 6;
          this.world.y = (Math.random() - 0.5) * 6;
       } else { this.world.x = 0; this.world.y = 0; }
    } else {
       if (this.world.filters.length > 1) this.world.filters.pop();
       this.world.x = 0; this.world.y = 0;
    }
    
    // Pulse and animate CRT scanlines
    if (this.sprites.ui_crt) {
      const t = Date.now() * 0.001;
      this.sprites.ui_crt.alpha = 0.7 + Math.sin(t * 10) * 0.1;
      this.sprites.ui_crt.children[0].y = (t * 20) % 2; // Subtle scanline movement
    }
  }
}

export const pixiRenderer = new PixiRenderer();
if (typeof window !== 'undefined') (window as any).pixiRenderer = pixiRenderer;
