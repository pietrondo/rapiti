/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    BUILDING DECORATIONS MODULE (bd)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Renderers per decorazioni urbane: fontane, lampioni, panchine, cestini.
 * Estratto da buildingRenderers.mjs per ridurre il God Object.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

var C = {
  concrete: '#A9A9A9',
  concreteDark: '#808080',
  wallPolice: '#4682B4',
  stoneGray: '#808080',
  glassSky: '#87CEEB',
  glassLight: '#ADD8E6',
  doorDark: '#2C1810',
  lampOn: '#FFD700',
  lampOff: '#F5F5DC',
  waterSpout: 'rgba(135, 206, 235, 0.7)',
  waterDeep: 'rgba(70, 130, 180, 0.5)',
  wood: '#5D4037',
  woodDark: '#3E2723',
  metal: '#455A64',
  metalDark: '#263238',
};

/**
 * Disegna una fontana circolare con acqua animata
 */
export function drawFountain(ctx, x, y, size, animTime) {
  animTime = animTime || 0;
  
  // Ombra a terra
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.85, size * 1.1, size * 0.4, 0, 0, Math.PI * 2);
  ctx.fill();

  // Base di cemento
  var baseGrad = ctx.createLinearGradient(x - size, y, x + size, y);
  baseGrad.addColorStop(0, C.concreteDark);
  baseGrad.addColorStop(0.5, C.concrete);
  baseGrad.addColorStop(1, C.concreteDark);
  
  ctx.fillStyle = baseGrad;
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.8, size, size * 0.3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Vasca interna (acqua)
  ctx.fillStyle = C.waterDeep;
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.75, size * 0.85, size * 0.25, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pilastro centrale
  var pillarGrad = ctx.createLinearGradient(x - size * 0.1, y, x + size * 0.1, y);
  pillarGrad.addColorStop(0, C.concreteDark);
  pillarGrad.addColorStop(1, C.concrete);
  ctx.fillStyle = pillarGrad;
  ctx.fillRect(x - size * 0.1, y + size * 0.3, size * 0.2, size * 0.5);

  // Vasca superiore
  ctx.fillStyle = baseGrad;
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.35, size * 0.4, size * 0.15, 0, 0, Math.PI * 2);
  ctx.fill();

  // Acqua nella vasca superiore
  ctx.fillStyle = C.glassSky;
  ctx.beginPath();
  ctx.ellipse(x, y + size * 0.33, size * 0.35, size * 0.12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Getto d'acqua centrale
  var spoutH = size * 0.35;
  var spoutW = 4 + Math.sin(animTime * 5) * 1;
  ctx.fillStyle = C.waterSpout;
  ctx.fillRect(x - spoutW/2, y, spoutW, spoutH);

  // Spruzzi animati
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  for (var i = 0; i < 6; i++) {
    var phase = animTime * 4 + i;
    var ox = Math.sin(phase) * (size * 0.6);
    var oy = size * 0.7 + Math.cos(phase * 0.7) * 5;
    ctx.beginPath();
    ctx.arc(x + ox, y + oy, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Disegna un lampione con alone di luce migliorato
 */
export function drawStreetLamp(ctx, x, y, isOn, animTime) {
  animTime = animTime || 0;
  
  // Palo con gradiente per dare volume
  var poleGrad = ctx.createLinearGradient(x - 2, y, x + 2, y);
  poleGrad.addColorStop(0, '#121212');
  poleGrad.addColorStop(0.5, '#333333');
  poleGrad.addColorStop(1, '#121212');
  ctx.fillStyle = poleGrad;
  ctx.fillRect(x - 2, y, 4, 50);

  // Testa del lampione
  ctx.fillStyle = '#1A1A1A';
  ctx.beginPath();
  ctx.moveTo(x - 10, y);
  ctx.lineTo(x + 10, y);
  ctx.lineTo(x + 8, y - 14);
  ctx.lineTo(x - 8, y - 14);
  ctx.closePath();
  ctx.fill();

  if (isOn) {
    var flicker = Math.sin(animTime * 15) * 0.05;
    ctx.fillStyle = C.lampOn;
    ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
    ctx.shadowBlur = 15 + flicker * 50;
  } else {
    ctx.fillStyle = C.lampOff;
    ctx.shadowBlur = 0;
  }
  
  // Lampadina
  ctx.beginPath();
  ctx.arc(x, y - 6, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  if (isOn) {
    // Alone di luce radiale
    var pulse = 1.0 + Math.sin(animTime * 10) * 0.05;
    var gradient = ctx.createRadialGradient(x, y - 6, 5, x, y - 6, 60 * pulse);
    gradient.addColorStop(0, 'rgba(255, 215, 0, 0.5)');
    gradient.addColorStop(0.4, 'rgba(255, 215, 0, 0.15)');
    gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y - 6, 60 * pulse, 0, Math.PI * 2);
    ctx.fill();
    
    // Effetto "lens flare" piccolo
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.arc(x, y - 6, 2, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Disegna una panchina del parco
 */
export function drawParkBench(ctx, x, y, width) {
  width = width || 40;
  var height = 20;
  
  // Gambe (metallo)
  ctx.fillStyle = C.metalDark;
  ctx.fillRect(x, y + height - 10, 4, 10);
  ctx.fillRect(x + width - 4, y + height - 10, 4, 10);
  
  // Seduta (legno)
  var woodGrad = ctx.createLinearGradient(x, y, x, y + 10);
  woodGrad.addColorStop(0, C.wood);
  woodGrad.addColorStop(1, C.woodDark);
  
  ctx.fillStyle = woodGrad;
  for (var i = 0; i < 3; i++) {
    ctx.fillRect(x - 2, y + 8 + i * 4, width + 4, 3);
  }
  
  // Schienale
  for (var j = 0; j < 2; j++) {
    ctx.fillRect(x - 2, y + j * 4, width + 4, 3);
  }
  
  // Supporti metallici laterali
  ctx.strokeStyle = C.metal;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + height - 5);
  ctx.moveTo(x + width, y);
  ctx.lineTo(x + width, y + height - 5);
  ctx.stroke();
}

/**
 * Disegna un cestino dei rifiuti urbano
 */
export function drawTrashCan(ctx, x, y) {
  // Ombra
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.beginPath();
  ctx.ellipse(x + 6, y + 18, 8, 3, 0, 0, Math.PI * 2);
  ctx.fill();

  // Corpo
  var metalGrad = ctx.createLinearGradient(x, y, x + 12, y);
  metalGrad.addColorStop(0, C.metalDark);
  metalGrad.addColorStop(0.5, C.metal);
  metalGrad.addColorStop(1, C.metalDark);
  
  ctx.fillStyle = metalGrad;
  ctx.fillRect(x, y + 4, 12, 14);
  
  // Coperchio
  ctx.fillStyle = C.metalDark;
  ctx.beginPath();
  ctx.moveTo(x - 2, y + 4);
  ctx.lineTo(x + 14, y + 4);
  ctx.lineTo(x + 10, y);
  ctx.lineTo(x + 2, y);
  ctx.closePath();
  ctx.fill();
  
  // Dettagli strisce
  ctx.strokeStyle = 'rgba(0,0,0,0.3)';
  ctx.lineWidth = 1;
  for (var i = 1; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(x + i * 4, y + 5);
    ctx.lineTo(x + i * 4, y + 17);
    ctx.stroke();
  }
}

window.BuildingRenderers = window.BuildingRenderers || {};
window.BuildingRenderers.drawFountain = drawFountain;
window.BuildingRenderers.drawStreetLamp = drawStreetLamp;
window.BuildingRenderers.drawParkBench = drawParkBench;
window.BuildingRenderers.drawTrashCan = drawTrashCan;
