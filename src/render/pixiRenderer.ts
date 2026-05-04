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
import { CANVAS_W, CANVAS_H, gameState } from '../config.ts';
import { CinematicRenderer } from './cinematicRenderer.ts';
import { GameplaySync } from './gameplaySync.ts';

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

  // Sub-renderers
  private cinematic: CinematicRenderer;
  private gameplay: GameplaySync;

  constructor() {
    this.cinematic = new CinematicRenderer(this);
    this.gameplay = new GameplaySync(this);
  }

  async init() {
    this.app = new PIXI.Application();
    
    await this.app.init({
      width: CANVAS_W * 2, 
      height: CANVAS_H * 2,
      backgroundColor: 0x05070a,
      resolution: 1,
      antialias: false,
    });

    if (this.app.renderer) {
       console.log(`[PixiRenderer] App initialized: ${this.app.renderer.type} renderer`);
    } else {
       console.log('[PixiRenderer] App initialized (renderer pending)');
    }

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
    
    const scanlines = new PIXI.Graphics();
    for (let i = 0; i < CANVAS_H; i += 3) {
      scanlines.rect(0, i, CANVAS_W, 1.5).fill({ color: 0x000000, alpha: 0.15 });
    }
    crt.addChild(scanlines);

    const vignette = new PIXI.Graphics();
    vignette.rect(0, 0, CANVAS_W, CANVAS_H).fill({ color: 0x000000, alpha: 0.02 });
    
    const corners = new PIXI.Graphics();
    corners.rect(0, 0, 40, 40).fill({ color: 0x000000, alpha: 0.3 });
    corners.rect(CANVAS_W-40, 0, 40, 40).fill({ color: 0x000000, alpha: 0.3 });
    corners.rect(0, CANVAS_H-40, 40, 40).fill({ color: 0x000000, alpha: 0.3 });
    corners.rect(CANVAS_W-40, CANVAS_H-40, 40, 40).fill({ color: 0x000000, alpha: 0.3 });
    crt.addChild(vignette);
    crt.addChild(corners);

    this.world?.addChild(crt);
    this.sprites.ui_crt = crt;
  }

  generateTexture(id: string, drawFn: (ctx: CanvasRenderingContext2D) => void, w: number, h: number): PIXI.Texture {
    if (this.textureCache[id]) return this.textureCache[id];
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    drawFn(ctx);
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
      case 'title': this.cinematic.renderTitle(); break;
      case 'intro': this.cinematic.renderIntro(); break;
      case 'prologue_cutscene': this.cinematic.renderPrologue(); break;
      case 'tutorial': this.cinematic.renderTutorial(); break;
      case 'playing':
      case 'dialogue': this.gameplay.syncGameplay(); break;
    }

    this._applyFilters();
  }

  _createPixelPanel(w: number, h: number, title?: string): PIXI.Container {
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

  _renderPrompt(text: string, x: number, y: number) {
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
       
       if (Math.random() > 0.9) {
          this.world.x = (Math.random() - 0.5) * 6;
          this.world.y = (Math.random() - 0.5) * 6;
       } else { this.world.x = 0; this.world.y = 0; }
    } else {
       if (this.world.filters.length > 1) this.world.filters.pop();
       this.world.x = 0; this.world.y = 0;
    }
    
    if (this.sprites.ui_crt) {
      const t = Date.now() * 0.001;
      this.sprites.ui_crt.alpha = 0.7 + Math.sin(t * 10) * 0.1;
      this.sprites.ui_crt.children[0].y = (t * 20) % 3;
    }
  }

  // Public sync methods for manual calls if needed
  syncState() {
    this.gameplay.syncGameplay();
  }
}

export const pixiRenderer = new PixiRenderer();
if (typeof window !== 'undefined') (window as any).pixiRenderer = pixiRenderer;

