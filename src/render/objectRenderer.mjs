/* ═══════════════════════════════════════════════════════════════════════════════
   OBJECT RENDERER
   Icone degli oggetti interattivi raccolti
   ═══════════════════════════════════════════════════════════════════════════════ */

var VISUAL = {
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

export function drawObjectIcon(ctx, o) {
  var cx = Math.round(o.x + o.w / 2);
  var cy = Math.round(o.y + o.h / 2);
  var pulse = Math.sin(Date.now() * 0.005) * 0.25 + 0.55;
  ctx.fillStyle = `rgba(212,168,67,${(pulse * 0.22).toFixed(2)})`;
  ctx.beginPath();
  ctx.arc(cx, cy, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(232,220,200,0.18)';
  ctx.beginPath();
  ctx.arc(cx, cy, 7 + Math.sin(Date.now() * 0.006) * 2, 0, Math.PI * 2);
  ctx.fill();

  if (o.id === 'mappa_campi') {
    ctx.fillStyle = '#CDBB86';
    ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.fillStyle = '#8B7355';
    ctx.fillRect(o.x + 2, o.y + 3, o.w - 4, 1);
    ctx.fillRect(o.x + 4, o.y + 7, o.w - 6, 1);
    ctx.fillStyle = '#3D5A3C';
    ctx.fillRect(o.x + 3, o.y + 9, 5, 3);
  } else if (o.id === 'lanterna_rotta') {
    ctx.fillStyle = window.PALETTE.lanternYel;
    ctx.fillRect(o.x + 3, o.y, 5, 7);
    ctx.fillStyle = window.PALETTE.alumGrey;
    ctx.fillRect(o.x, o.y + 7, 10, 2);
    ctx.fillRect(o.x + 9, o.y + 4, 3, 2);
    ctx.fillStyle = VISUAL.danger;
    ctx.fillRect(o.x + 1, o.y + 9, 2, 1);
    ctx.fillRect(o.x + 8, o.y + 9, 2, 1);
  } else if (o.id === 'registro_1861' || o.id === 'diario_enzo') {
    ctx.fillStyle = o.id === 'registro_1861' ? '#6B3F2A' : '#7A2323';
    ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.fillStyle = window.PALETTE.creamPaper;
    ctx.fillRect(o.x + 3, o.y + 3, o.w - 6, 2);
    ctx.fillStyle = window.PALETTE.lanternYel;
    ctx.fillRect(o.x + 2, o.y, 2, o.h);
  } else if (o.id === 'lettera_censurata') {
    ctx.fillStyle = window.PALETTE.creamPaper;
    ctx.fillRect(o.x, o.y, o.w, o.h);
    ctx.fillStyle = '#1A1C20';
    ctx.fillRect(o.x + 2, o.y + 3, o.w - 4, 2);
    ctx.fillRect(o.x + 2, o.y + 8, o.w - 7, 1);
    ctx.fillStyle = VISUAL.danger;
    ctx.fillRect(o.x + o.w - 5, o.y + 2, 3, 3);
  } else if (o.id === 'simboli_portone') {
    ctx.strokeStyle = VISUAL.signal;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = window.PALETTE.creamPaper;
    ctx.fillRect(cx - 1, cy - 8, 2, 16);
    ctx.fillRect(cx - 8, cy - 1, 16, 2);
  } else if (o.id === 'frammento') {
    ctx.fillStyle = '#C8D0DA';
    ctx.fillRect(o.x + 1, o.y, 7, 3);
    ctx.fillRect(o.x, o.y + 3, 9, 3);
    ctx.fillRect(o.x + 2, o.y + 6, 5, 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(o.x + 2, o.y + 1, 4, 1);
  } else if (o.id === 'tracce_circolari') {
    ctx.strokeStyle = window.PALETTE.lanternYel;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 20, 10, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 12, 6, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    ctx.fillStyle = window.PALETTE.lanternYel;
    ctx.fillRect(cx - 4, cy - 4, 8, 8);
  }
  ctx.lineWidth = 1;
}

window.UIRenderer = window.UIRenderer || {};
window.UIRenderer.drawObjectIcon = drawObjectIcon;
