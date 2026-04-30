/* ═══════════════════════════════════════════════════════════════════════════════
   RENDER MODULE - Compatibility Layer
   Questo file ora importa dai moduli in src/render/ per mantenere compatibilita'
   ═══════════════════════════════════════════════════════════════════════════════ */

// Re-export from modules for backward compatibility
var spriteCache = SpriteManager
  ? SpriteManager.spriteCache
  : { player: null, playerColors: null, npcs: {} };
var animState = SpriteManager
  ? SpriteManager.animState
  : { playerFrame: 0, playerTimer: 0, isMoving: false, lastX: 0, lastY: 0 };
var VISUAL = UIRenderer
  ? UIRenderer.VISUAL
  : {
      ink: '#0B0C12',
      panel: '#15161B',
      panel2: '#222631',
      gold: '#D4A843',
      amber: '#F0C15A',
      paper: '#E8DCC8',
      rust: '#C4956A',
      signal: '#91B7FF',
      danger: '#CC4444',
    };

// Delegate to modules
function getOrCreatePlayerSheet() {
  return SpriteManager.getOrCreatePlayerSheet();
}
function _lighten(hex, amount) {
  return SpriteManager.lighten(hex, amount);
}
function _darken(hex, amount) {
  return SpriteManager.darken(hex, amount);
}
function getOrCreateNPCSheet(npcId) {
  return SpriteManager.getOrCreateNPCSheet(npcId);
}

function fillGradientRect(ctx, x, y, w, h, topColor, bottomColor) {
  return UIRenderer.fillGradientRect(ctx, x, y, w, h, topColor, bottomColor);
}
function drawPixelPanel(ctx, x, y, w, h, title) {
  return UIRenderer.drawPixelPanel(ctx, x, y, w, h, title);
}
function drawFilmGrain(ctx) {
  return UIRenderer.drawFilmGrain(ctx);
}
function drawPrompt(ctx, text, x, y) {
  return UIRenderer.drawPrompt(ctx, text, x, y);
}
function drawTitleLandscape(ctx, t) {
  return UIRenderer.drawTitleLandscape(ctx, t);
}
function drawObjectIcon(ctx, o) {
  return UIRenderer.drawObjectIcon(ctx, o);
}
function getAreaShortName(areaId) {
  return UIRenderer.getAreaShortName(areaId);
}
function drawArrow(ctx, dir, x, y) {
  return UIRenderer.drawArrow(ctx, dir, x, y);
}
function renderAreaExitMarkers(ctx, area) {
  return UIRenderer.renderAreaExitMarkers(ctx, area);
}
function renderMiniMap(ctx) {
  return UIRenderer.renderMiniMap(ctx);
}
function drawMapLink(ctx, nodes, ox, oy, a, b) {
  return UIRenderer.drawMapLink(ctx, nodes, ox, oy, a, b);
}
function renderFade(ctx) {
  return UIRenderer.renderFade(ctx);
}

function renderPrologueCutscene(ctx) {
  return SceneRenderer.renderPrologueCutscene(ctx);
}
function renderTitle(ctx) {
  return SceneRenderer.renderTitle(ctx);
}
function renderIntroSlide(ctx) {
  return SceneRenderer.renderIntroSlide(ctx);
}
function renderPrologue(ctx) {
  return SceneRenderer.renderPrologue(ctx);
}
function renderTutorial(ctx) {
  return SceneRenderer.renderTutorial(ctx);
}
function renderEndingScreen(ctx) {
  return SceneRenderer.renderEndingScreen(ctx);
}

function renderArea(ctx) {
  return GameRenderer.renderArea(ctx);
}
function renderPlayer(ctx) {
  return GameRenderer.renderPlayer(ctx);
}
function drawSprite(ctx, cx, cy, colors, details, type, dir) {
  return GameRenderer.drawSprite(ctx, cx, cy, colors, details, type, dir);
}
function renderInteractionHint(ctx) {
  return GameRenderer.renderInteractionHint(ctx);
}

// Main render dispatcher - delegates to RenderModule
function render(ctx) {
  return RenderModule.render(ctx);
}
