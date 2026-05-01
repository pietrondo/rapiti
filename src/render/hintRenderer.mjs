/* ═══════════════════════════════════════════════════════════════════════════════
   HINT RENDERER
   Rendering interaction hint above targets
   ═══════════════════════════════════════════════════════════════════════════════ */

/* global PALETTE */

export function renderInteractionHint(ctx) {
  var t = gameState.interactionTarget;
  if (!t) return;
  var px = gameState.player.x + gameState.player.w / 2;
  var py = gameState.player.y - 16;
  var label = '???';
  if (t.type === 'npc') label = 'Parla';
  else if (t.type === 'object') label = 'Raccogli';
  else if (t.type === 'door') label = 'Entra / Esci';
  else if (t.type === 'radio') label = 'Accendi Radio';
  else if (t.type === 'recorder') label = 'Usa Registratore';
  else if (t.type === 'scene') label = 'Esamina';
  else if (t.type === 'gatto') label = 'Accarezza';
  ctx.font = '8px "Courier New",monospace';
  var text = `[E] ${label}`;
  var w = ctx.measureText(text).width + 18;
  ctx.fillStyle = 'rgba(8,9,14,0.86)';
  ctx.fillRect(px - w / 2, py - 13, w, 16);
  ctx.strokeStyle = 'rgba(212,168,67,0.75)';
  ctx.strokeRect(px - w / 2 + 1, py - 12, w - 2, 14);
  ctx.fillStyle = 'rgba(212,168,67,0.24)';
  ctx.fillRect(px - 3, py + 5, 6, 5);
  ctx.fillStyle = PALETTE.lanternYel;
  ctx.textAlign = 'center';
  ctx.fillText(text, px, py - 2);
  ctx.textAlign = 'start';
}
