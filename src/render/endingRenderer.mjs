/* ═══════════════════════════════════════════════════════════════════════════════
   ENDING RENDERER
   Schermata finale
   ═══════════════════════════════════════════════════════════════════════════════ */

export function renderEndingScreen(ctx) {
  ctx.fillStyle = window.PALETTE.nightBlue;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  var t = Date.now() * 0.001;
  ctx.fillStyle = `${window.PALETTE.creamPaper}22`;
  for (var i = 0; i < 30; i++) {
    ctx.fillRect((i * 117) % CANVAS_W, (i * 53 + Math.sin(t + i) * 3) % CANVAS_H, 2, 2);
  }
}

window.SceneRenderer = window.SceneRenderer || {};
window.SceneRenderer.renderEndingScreen = renderEndingScreen;
