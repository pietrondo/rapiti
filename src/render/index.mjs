/* ═══════════════════════════════════════════════════════════════════════════════
   RENDER MODULE - Index
   Entry point per il sistema di rendering, dispatcher principale
   ═══════════════════════════════════════════════════════════════════════════════ */

export function render(ctx) {
  ctx.save();
  ctx.scale(2, 2);
  ctx.imageSmoothingEnabled = false;

  // Applica screen shake
  ScreenShake.apply(ctx);

  var ph = gameState.gamePhase;

  if (ph === 'title') {
    SceneRenderer.renderTitle(ctx);
  } else if (ph === 'prologue_cutscene') {
    SceneRenderer.renderPrologueCutscene(ctx);
  } else if (ph === 'intro') {
    SceneRenderer.renderIntroSlide(ctx);
  } else if (ph === 'prologue') {
    SceneRenderer.renderPrologue(ctx);
  } else if (ph === 'tutorial') {
    SceneRenderer.renderTutorial(ctx);
  } else if (
    ph === 'playing' ||
    ph === 'dialogue' ||
    ph === 'journal' ||
    ph === 'inventory' ||
    ph === 'deduction'
  ) {
    GameRenderer.renderArea(ctx);
    GameRenderer.renderPlayer(ctx);
    GameRenderer.renderInteractionHint(ctx);
    // Effetti visivi avanzati
    LightingSystem.draw(ctx, gameState.player.x, gameState.player.y);
    ParticleSystem.draw(ctx);
    Vignette.draw(ctx, CANVAS_W, CANVAS_H);
    if (gameState.showMiniMap) UIRenderer.renderMiniMap(ctx);
  } else if (ph === 'ending') {
    SceneRenderer.renderEndingScreen(ctx);
  }
  if (ph === 'customize') {
    SceneRenderer.renderTitle(ctx);
  }
  if (gameState.fadeDir !== 0) UIRenderer.renderFade(ctx);

  ctx.restore();
}

// Export for global access
window.RenderModule = {
  render: render,
};
