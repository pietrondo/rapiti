/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    GAMEPLAY PIXI SYNC
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Synchronizes the PixiJS scene graph with the game state during gameplay.
 * Handles Background, Player, and NPC sprites.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as PIXI from 'pixi.js';
import { CANVAS_W, CANVAS_H, gameState } from '../config.ts';

export class GameplaySync {
  private parent: any;

  constructor(parent: any) {
    this.parent = parent;
  }

  syncGameplay() {
    if (this.parent.lastArea !== gameState.currentArea) {
      console.log(`[PixiRenderer] Area transition: ${this.parent.lastArea} -> ${gameState.currentArea}`);
      this.parent._cleanupArea();
      this.parent.layers.bg.removeChildren();
      this.parent.lastArea = gameState.currentArea;
    }
    this.syncBackground();
    this.syncPlayer();
    this.syncNPCs();
    this.parent.layers.mid.children.sort((a: any, b: any) => a.y - b.y);
  }

  syncBackground() {
    const areaId = gameState.currentArea;
    const bgKey = `ui_bg_${areaId}`;

    if (!this.parent.sprites[bgKey]) {
      const area = (window as any).areas[areaId];
      if (area?.draw) {
        console.log(`[PixiRenderer] Generating background for ${areaId}`);
        const tex = this.parent.generateTexture(bgKey, (ctx: CanvasRenderingContext2D) => area.draw(ctx, 0), CANVAS_W, CANVAS_H);
        const bg = new PIXI.Sprite(tex);
        this.parent.sprites[bgKey] = bg;
      } else {
        console.warn(`[PixiRenderer] Area ${areaId} has no draw function!`);
      }
    }

    const bg = this.parent.sprites[bgKey];
    if (bg && !this.parent.layers.bg.children.includes(bg)) {
       console.log(`[PixiRenderer] Re-attaching background: ${bgKey}`);
       this.parent.layers.bg.addChild(bg);
    }

    for (let k in this.parent.sprites) {
       if (k.startsWith('ui_bg_')) {
          this.parent.sprites[k].visible = (k === bgKey);
       }
    }
  }

  syncPlayer() {
    const p = gameState.player;
    const sm = (window as any).SpriteManager;
    const sheet = sm.getOrCreatePlayerSheet();
    
    if (!this.parent.sprites.player || this.parent.textureCache.playerSheet !== sheet) {
       console.log('[PixiRenderer] Updating player sprite textures');
       this.parent._cleanupPlayerTextures();
       this.parent.textureCache.playerSheet = sheet;
       this.parent.playerTextures = [];
       const baseSource = PIXI.Texture.from({ resource: sheet }).source;
       
       for (let i = 0; i < 16; i++) {
          const row = Math.floor(i / 4);
          const col = i % 4;
          this.parent.playerTextures.push(new PIXI.Texture({ 
             source: baseSource, 
             frame: new PIXI.Rectangle(col * 32, row * 32, 32, 32) 
          }));
       }
       if (!this.parent.sprites.player) {
         this.parent.sprites.player = new PIXI.Sprite(this.parent.playerTextures[0]);
         this.parent.sprites.player.anchor.set(0.5, 1);
         this.parent.layers.mid.addChild(this.parent.sprites.player);
       }
    }

    const s = this.parent.sprites.player as PIXI.Sprite;
    s.x = p.x + 16; s.y = p.y + 16;
    const dir = { down: 0, up: 1, left: 2, right: 3 }[p.dir] || 0;
    const f = Math.floor(sm.animState.playerFrame || 0);
    s.texture = this.parent.playerTextures[(dir * 4) + (f % 4)];
    
    if (p.discoveryJump != null && p.discoveryJump > 0) {
      const pr = p.discoveryJump / 20;
      s.scale.y = 1 + Math.sin(pr * Math.PI) * 0.3; s.scale.x = 1 / s.scale.y;
    } else s.scale.set(1);
  }

  syncNPCs() {
    const area = (window as any).areas[gameState.currentArea];
    if (!area?.npcs) return;
    const sm = (window as any).SpriteManager;

    area.npcs.forEach((n: any) => {
      const key = `npc_${n.id}`;
      const sheet = sm.getOrCreateNPCSheet(n.id);
      if (!this.parent.sprites[key] || this.parent.textureCache[`npc_${n.id}`] !== sheet) {
        console.log(`[PixiRenderer] Creating/Updating NPC sprite: ${n.id}`);
        this.parent._cleanupNPCTexture(n.id);
        this.parent.textureCache[`npc_${n.id}`] = sheet;
        const baseSource = PIXI.Texture.from({ resource: sheet }).source;
        const npcTex = new PIXI.Texture({
           source: baseSource,
           frame: new PIXI.Rectangle(0, 0, 32, 32)
        });
        this.parent.npcTextures[n.id] = [npcTex];
        
        if (!this.parent.sprites[key]) {
           const spr = new PIXI.Sprite(npcTex);
           spr.anchor.set(0.5, 1); this.parent.layers.mid.addChild(spr); this.parent.sprites[key] = spr;
        }
      }
      const s = this.parent.sprites[key] as PIXI.Sprite;
      s.x = n.x; s.y = n.y;
      s.texture = this.parent.npcTextures[n.id][0];
    });
  }
}
