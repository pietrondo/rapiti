/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    PARALLAX SKY RENDERER
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Standalone parallax skybox with procedural textures.
 * Used by title and prologue cinematic scenes.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import * as PIXI from 'pixi.js';

export function renderParallaxSky(t: number, parent: any, alienLightNodes: PIXI.Container[]): void {
  if (!parent.sprites.ui_sky) {
    const tex = parent.generateTexture('cinematic_sky', (ctx: CanvasRenderingContext2D) => {
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
    parent.sprites.ui_sky = new PIXI.Sprite(tex);
    parent.layers.bg.addChildAt(parent.sprites.ui_sky, 0);
  }

  if (parent.sprites.ui_sky && !parent.layers.bg.children.includes(parent.sprites.ui_sky)) {
    parent.layers.bg.addChildAt(parent.sprites.ui_sky, 0);
  }

  if (
    !parent.sprites.ui_alien_lights ||
    parent.sprites.ui_alien_lights.destroyed ||
    alienLightNodes.length !== 3
  ) {
    if (parent.sprites.ui_alien_lights?.parent) {
      parent.sprites.ui_alien_lights.parent.removeChild(parent.sprites.ui_alien_lights);
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
    parent.sprites.ui_alien_lights = c;
    alienLightNodes.length = 0;
    alienLightNodes.push(...lights);
    parent.layers.bg.addChild(c);
  } else if (!parent.layers.bg.children.includes(parent.sprites.ui_alien_lights)) {
    parent.layers.bg.addChild(parent.sprites.ui_alien_lights);
  }

  alienLightNodes.forEach((l: PIXI.Container, i: number) => {
    l.x += Math.sin(t + i) * 0.5;
    l.y += Math.cos(t * 0.5 + i) * 0.3;
    l.alpha = 0.4 + Math.sin(t * 2 + i) * 0.4;
  });

  if (!parent.sprites.ui_mtn_back) {
    const tex = parent.generateTexture('mtn_back', (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = '#111824'; ctx.beginPath(); ctx.moveTo(0, 150); ctx.lineTo(80, 100); ctx.lineTo(180, 140); ctx.lineTo(300, 90); ctx.lineTo(400, 150); ctx.lineTo(400, 250); ctx.lineTo(0, 250); ctx.fill();
    }, 400, 250);
    parent.sprites.ui_mtn_back = new PIXI.TilingSprite({ texture: tex, width: 800, height: 250 });
    parent.layers.bg.addChild(parent.sprites.ui_mtn_back);
  }
  if (parent.sprites.ui_mtn_back && !parent.layers.bg.children.includes(parent.sprites.ui_mtn_back)) {
    parent.layers.bg.addChild(parent.sprites.ui_mtn_back);
  }
  if (!parent.sprites.ui_mtn_front) {
    const tex = parent.generateTexture('mtn_front', (ctx: CanvasRenderingContext2D) => {
      ctx.fillStyle = '#0a0d16'; ctx.beginPath(); ctx.moveTo(0, 180); ctx.lineTo(120, 140); ctx.lineTo(250, 170); ctx.lineTo(350, 130); ctx.lineTo(400, 180); ctx.lineTo(400, 250); ctx.lineTo(0, 250); ctx.fill();
    }, 400, 250);
    parent.sprites.ui_mtn_front = new PIXI.TilingSprite({ texture: tex, width: 800, height: 250 });
    parent.layers.bg.addChild(parent.sprites.ui_mtn_front);
  }
  if (parent.sprites.ui_mtn_front && !parent.layers.bg.children.includes(parent.sprites.ui_mtn_front)) {
    parent.layers.bg.addChild(parent.sprites.ui_mtn_front);
  }

  parent.sprites.ui_mtn_back.tilePosition.x = -t * 5;
  parent.sprites.ui_mtn_front.tilePosition.x = -t * 12;
}
