/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    MAP EDITOR — DEV OVERLAY
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Overlay interattivo per modificare aree. Attivabile con F12.
 * Stile coerente con il gioco: font monospace, palette PALETTE, pannelli pixel.
 * Dynamic import — nessun impatto sul bundle packaged.
 */

import { validateExportData, type ValidationResult } from './validator.ts';
import type {
  AreaDef,
  AreaObjectDef,
  ColliderDef,
  ExitDef,
  EditorExportData,
  NpcSpawnDef,
} from './types.ts';

const CANVAS_W = 400;
const CANVAS_H = 250;
const SCALE = 2;

// Palette gioco
const G = { ink: '#0B0C12', panel: '#15161B', gold: '#D4A843', paper: '#E8DCC8', rust: '#C4956A', bg: '#080A13', dark: '#1A1C20' };

let active = false;
let currentArea = 'piazze';
let tool: 'select' | 'collider' | 'exit' | 'npc' | 'object' = 'select';
let selectedIndex = -1;
let dragItem: any = null;
let dragOX = 0, dragOY = 0;

let areas: Record<string, AreaDef> = {};
let areaObjects: Record<string, AreaObjectDef[]> = {};
let npcData: { id: string; name: string }[] = [];

let overlay: HTMLDivElement | null = null;
let canvas: HTMLCanvasElement | null = null;
let c2d: CanvasRenderingContext2D | null = null;

function loadData() {
  const w = window as any;
  areas = {}; areaObjects = {}; npcData = [];
  if (!w.areas) return;
  const ids = typeof w.areas.getIds === 'function' ? w.areas.getIds() : Object.keys(w.areas);
  for (const id of ids) {
    const a = w.areas.get ? w.areas.get(id) : w.areas[id];
    if (!a) continue;
    areas[id] = {
      name: a.name || id,
      walkableTop: a.walkableTop || 0,
      colliders: (a.colliders || []).map((c: any) => ({ x: c.x, y: c.y, w: c.w, h: c.h })),
      exits: (a.exits || []).map((e: any) => ({
        to: e.to, dir: e.dir, xRange: [...(e.xRange || [0, 0])] as [number, number],
        spawnX: e.spawnX, spawnY: e.spawnY, requiresInteract: e.requiresInteract, requiresFlag: e.requiresFlag,
      })),
      npcs: (a.npcs || []).map((n: any) => ({ id: n.id, x: n.x, y: n.y })),
    };
  }
  if (w.areaObjects) {
    for (const [aid, objs] of Object.entries(w.areaObjects) as [string, any[]][]) {
      areaObjects[aid] = objs.map((o: any) => ({
        id: o.id, x: o.x, y: o.y, w: o.w || 20, h: o.h || 20,
        type: o.type || 'clue', requires: o.requires, drawHint: o.drawHint,
      }));
    }
  }
  npcData = (w.npcsData || []).map((n: any) => ({ id: n.id, name: n.name }));
}

function allItems(a: AreaDef): any[] {
  return [...a.colliders, ...a.exits, ...a.npcs, ...(areaObjects[currentArea] || [])];
}

function hit(x: number, y: number, item: any): boolean {
  return x >= item.x - 2 && x <= item.x + (item.w || 8) + 2 && y >= item.y - 2 && y <= item.y + (item.h || 8) + 2;
}

function render() {
  if (!c2d || !canvas) return;
  const area = areas[currentArea];
  if (!area) return;
  const w = CANVAS_W * SCALE, h = CANVAS_H * SCALE;
  c2d.clearRect(0, 0, w, h);
  c2d.save();
  c2d.scale(SCALE, SCALE);

  // Grid
  c2d.fillStyle = '#0a0a12';
  c2d.fillRect(0, 0, CANVAS_W, CANVAS_H);
  c2d.strokeStyle = '#181825';
  c2d.lineWidth = 0.5;
  for (let x = 0; x < CANVAS_W; x += 20) { c2d.beginPath(); c2d.moveTo(x, 0); c2d.lineTo(x, CANVAS_H); c2d.stroke(); }
  for (let y = 0; y < CANVAS_H; y += 20) { c2d.beginPath(); c2d.moveTo(0, y); c2d.lineTo(CANVAS_W, y); c2d.stroke(); }

  // Area preview
  if (typeof (area as any).draw === 'function') {
    try { (area as any).draw(c2d); } catch (e) { c2d.fillStyle = '#333'; c2d.fillRect(0, 0, CANVAS_W, CANVAS_H); }
  }

  // Colliders (red)
  const objs = areaObjects[currentArea] || [];
  area.colliders.forEach((c, i) => drawBox(c2d!, c.x, c.y, c.w, c.h, 'rgba(255,68,68,0.25)', '#ff4444', i, 0));
  area.exits.forEach((e, i) => {
    const ci = area.colliders.length;
    const x0 = e.xRange[0], x1 = e.xRange[1];
    const y0 = e.dir === 'up' ? 0 : e.dir === 'down' ? CANVAS_H - 10 : x0;
    const ew = e.dir === 'up' || e.dir === 'down' ? x1 - x0 : 10;
    const eh = e.dir === 'up' || e.dir === 'down' ? 10 : x1 - x0;
    const ex = e.dir === 'left' ? -6 : e.dir === 'right' ? CANVAS_W - 4 : x0;
    const ey = e.dir === 'left' || e.dir === 'right' ? x0 : y0;
    drawBox(c2d!, ex, ey, ew, eh, 'rgba(68,136,255,0.25)', '#4488ff', i, ci);
    c2d!.fillStyle = '#4488ff'; c2d!.font = '7px monospace';
    c2d!.fillText('→' + e.to, ex + 2, ey + 8);
  });
  area.npcs.forEach((n, i) => {
    const ci = area.colliders.length + area.exits.length;
    drawBox(c2d!, n.x - 4, n.y - 10, 10, 12, 'rgba(68,255,68,0.25)', '#44ff44', i, ci);
    c2d!.fillStyle = '#44ff44'; c2d!.font = '7px monospace';
    c2d!.fillText(n.id, n.x - 4, n.y - 13);
  });
  objs.forEach((o, i) => {
    const ci = area.colliders.length + area.exits.length + area.npcs.length;
    drawBox(c2d!, o.x, o.y, o.w, o.h, 'rgba(255,170,0,0.25)', '#ffaa00', i, ci);
  });

  if (area.walkableTop > 0) {
    c2d!.strokeStyle = 'rgba(255,255,255,0.15)';
    c2d!.setLineDash([4, 8]); c2d!.beginPath(); c2d!.moveTo(0, area.walkableTop); c2d!.lineTo(CANVAS_W, area.walkableTop); c2d!.stroke();
    c2d!.setLineDash([]);
  }
  c2d.restore();
  updateStatus();
}

function drawBox(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string, stroke: string, i: number, offset: number) {
  c.fillStyle = fill; c.fillRect(x, y, w, h);
  c.strokeStyle = selectedIndex === offset + i ? '#fff' : stroke;
  c.lineWidth = selectedIndex === offset + i ? 2 : 1;
  c.strokeRect(x, y, w, h);
  if (selectedIndex === offset + i) {
    c.fillStyle = '#fff';
    c.fillRect(x + w - 3, y - 3, 5, 5);
    c.fillRect(x - 3, y + h - 3, 5, 5);
  }
}

function updateStatus() {
  const el = document.getElementById('me-status');
  if (!el) return;
  const a = areas[currentArea]; if (!a) return;
  el.textContent = `${a.name} | C:${a.colliders.length} E:${a.exits.length} N:${a.npcs.length} O:${(areaObjects[currentArea]||[]).length} | ${tool}`;
}

function updatePropPanel(item: any, idx: number) {
  const pp = document.getElementById('me-prop-content');
  if (!pp) return;
  const a = areas[currentArea]; if (!a) return;
  const cLen = a.colliders.length, eLen = a.exits.length, nLen = a.npcs.length;
  const objs = areaObjects[currentArea] || [];
  let arr: any[], typeName: string;
  if (idx < cLen) { arr = a.colliders; typeName = 'Collider'; }
  else if (idx < cLen + eLen) { arr = a.exits; typeName = 'Exit'; }
  else if (idx < cLen + eLen + nLen) { arr = a.npcs; typeName = 'NPC'; }
  else { arr = objs; typeName = 'AreaObject'; }

  let html = `<div style="color:${G.gold};margin-bottom:6px">${typeName} #${idx - (idx < cLen ? 0 : idx < cLen + eLen ? cLen : idx < cLen + eLen + nLen ? cLen + eLen : cLen + eLen + nLen)}</div>`;
  for (const [k, v] of Object.entries(item)) {
    if (k === 'xRange' && Array.isArray(v)) {
      html += `<div class="me-row"><span>${k}[0]</span><input data-k="${k}" data-i="0" value="${v[0]}"></div>`;
      html += `<div class="me-row"><span>${k}[1]</span><input data-k="${k}" data-i="1" value="${v[1]}"></div>`;
    } else {
      html += `<div class="me-row"><span>${k}</span><input data-k="${k}" value="${typeof v === 'boolean' ? v : v ?? ''}"></div>`;
    }
  }
  html += `<button id="me-prop-del" style="margin-top:6px;background:#442222;color:${G.paper};border:1px solid ${G.gold};padding:3px 8px;font:10px monospace;cursor:pointer">Elimina</button>`;
  pp.innerHTML = html;

  document.getElementById('me-prop-del')?.addEventListener('click', () => {
    selectedIndex = idx;
    deleteSelected();
  });
  pp.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('change', () => {
      const k = (inp as HTMLElement).dataset.k!;
      const i = (inp as HTMLElement).dataset.i;
      let nv: any = (inp as HTMLInputElement).value;
      if (typeof item[k] === 'number') nv = parseFloat((inp as HTMLInputElement).value) || 0;
      if (typeof item[k] === 'boolean') nv = (inp as HTMLInputElement).value === 'true';
      if (i !== undefined && Array.isArray(item[k])) item[k][parseInt(i)] = parseFloat((inp as HTMLInputElement).value) || 0;
      else item[k] = nv;
      render();
    });
  });
}

function deleteSelected() {
  const a = areas[currentArea]; if (!a) return;
  const cLen = a.colliders.length, eLen = a.exits.length, nLen = a.npcs.length;
  const objs = areaObjects[currentArea] || [];
  if (selectedIndex < cLen) a.colliders.splice(selectedIndex, 1);
  else if (selectedIndex < cLen + eLen) a.exits.splice(selectedIndex - cLen, 1);
  else if (selectedIndex < cLen + eLen + nLen) a.npcs.splice(selectedIndex - cLen - eLen, 1);
  else { objs.splice(selectedIndex - cLen - eLen - nLen, 1); areaObjects[currentArea] = objs; }
  selectedIndex = -1;
  render();
}

function exportJSON() {
  const data: EditorExportData = { version: '1.0.0', areas, areaObjects, npcsData: npcData };
  const result: ValidationResult = validateExportData(data);
  if (!result.valid) {
    const msg = result.errors.map(e => `[${e.area}] ${e.field}: ${e.message}`).join('\n');
    const toast = document.getElementById('me-toast'); if (toast) { toast.textContent = 'ERRORI: ' + result.errors.length; toast.style.color = '#cc4444'; setTimeout(() => toast.textContent = '', 3000); }
    console.warn('Validation errors:\n' + msg);
    return;
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'areas-data.json'; a.click();
  URL.revokeObjectURL(url);
  const toast = document.getElementById('me-toast'); if (toast) { toast.textContent = 'Export OK'; toast.style.color = '#44cc44'; setTimeout(() => toast.textContent = '', 2000); }
}

function setupCanvas() {
  if (!canvas) return;
  canvas.addEventListener('mousedown', (e) => {
    const cx = e.offsetX / SCALE, cy = e.offsetY / SCALE;
    const a = areas[currentArea]; if (!a) return;
    e.stopPropagation();

    if (tool === 'select') {
      const items = allItems(a);
      for (let i = items.length - 1; i >= 0; i--) {
        if (hit(cx, cy, items[i])) {
          selectedIndex = i; dragItem = JSON.parse(JSON.stringify(items[i]));
          dragOX = cx; dragOY = cy; render(); updatePropPanel(items[i], i); return;
        }
      }
      selectedIndex = -1; render(); return;
    }
    if (tool === 'collider') { a.colliders.push({ x: Math.round(cx), y: Math.round(cy), w: 40, h: 30 }); selectedIndex = a.colliders.length - 1; }
    else if (tool === 'exit') { a.exits.push({ to: 'piazze', dir: 'down', xRange: [Math.round(cx) - 20, Math.round(cx) + 20], spawnX: 200, spawnY: 188 }); selectedIndex = a.colliders.length + a.exits.length - 1; }
    else if (tool === 'npc') { a.npcs.push({ id: npcData[0]?.id || 'unknown', x: Math.round(cx), y: Math.round(cy) }); selectedIndex = a.colliders.length + a.exits.length + a.npcs.length - 1; }
    else if (tool === 'object') { const objs = areaObjects[currentArea] || []; objs.push({ id: 'obj_' + Date.now(), x: Math.round(cx), y: Math.round(cy), w: 20, h: 20, type: 'clue' }); areaObjects[currentArea] = objs; selectedIndex = a.colliders.length + a.exits.length + a.npcs.length + objs.length - 1; }
    render();
  });

  canvas.addEventListener('mousemove', (e) => {
    if (!dragItem) return;
    const dx = e.offsetX / SCALE - dragOX, dy = e.offsetY / SCALE - dragOY;
    const items = allItems(areas[currentArea]!);
    const item = items[selectedIndex];
    if (!item) return;
    item.x = Math.max(0, Math.min(CANVAS_W - ((item.w as number) || 1), (dragItem.x || 0) + dx));
    item.y = Math.max(0, Math.min(CANVAS_H - ((item.h as number) || 1), (dragItem.y || 0) + dy));
    if (dragItem.w !== undefined && e.shiftKey) {
      item.w = Math.max(5, dragItem.w + dx);
      item.h = Math.max(5, dragItem.h + dy);
    }
    render();
  });

  canvas.addEventListener('mouseup', () => { dragItem = null; });

  document.addEventListener('keydown', (ev) => {
    if (!active) return;
    if (ev.key === 'Delete' || ev.key === 'Backspace') { deleteSelected(); ev.preventDefault(); }
    if (ev.key === 'Escape') closeEditor();
  });
}

export function openEditor() {
  if (active) return;
  if (overlay) { overlay.style.display = 'flex'; active = true; loadData(); render(); return; }
  active = true;
  loadData();

  overlay = document.createElement('div');
  overlay.id = 'map-editor-overlay';
  overlay.innerHTML = `
<div class="me-toolbar">
  <span class="me-title">MAP EDITOR</span>
  <select id="me-area"></select>
  <span class="me-sep">|</span>
  <button class="me-tbtn" data-t="select">Sel</button>
  <button class="me-tbtn" data-t="collider">Coll</button>
  <button class="me-tbtn" data-t="exit">Exit</button>
  <button class="me-tbtn" data-t="npc">NPC</button>
  <button class="me-tbtn" data-t="object">Obj</button>
  <span style="flex:1"></span>
  <span id="me-toast" style="font-size:10px;margin-right:8px"></span>
  <button class="me-tbtn me-export" id="me-export">Export</button>
  <button class="me-tbtn me-close" id="me-close">X</button>
</div>
<div class="me-main">
  <div class="me-canvas-wrap"><canvas id="me-canvas" width="${CANVAS_W*SCALE}" height="${CANVAS_H*SCALE}"></canvas></div>
  <div class="me-props"><div class="me-prop-title">PROPRIETÀ</div><div id="me-prop-content">Seleziona un elemento</div></div>
</div>
<div id="me-status"></div>`;
  document.body.appendChild(overlay);

  canvas = document.getElementById('me-canvas') as HTMLCanvasElement;
  c2d = canvas.getContext('2d')!;
  setupCanvas();

  const sel = document.getElementById('me-area') as HTMLSelectElement;
  for (const id of Object.keys(areas)) { const o = document.createElement('option'); o.value = id; o.textContent = areas[id].name; sel.appendChild(o); }
  sel.value = currentArea;
  sel.addEventListener('change', () => { currentArea = sel.value; selectedIndex = -1; render(); });

  document.querySelectorAll('.me-tbtn[data-t]').forEach(b => b.addEventListener('click', (ev) => {
    tool = (b as HTMLElement).dataset.t as typeof tool;
    selectedIndex = -1; render();
    document.querySelectorAll('.me-tbtn[data-t]').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
  }));
  document.getElementById('me-export')!.addEventListener('click', exportJSON);
  document.getElementById('me-close')!.addEventListener('click', closeEditor);

  // Stop game input propagation
  overlay.addEventListener('keydown', (e) => e.stopPropagation());
  overlay.addEventListener('keyup', (e) => e.stopPropagation());
  overlay.addEventListener('mousedown', (e) => e.stopPropagation());
  overlay.addEventListener('click', (e) => e.stopPropagation());

  render();
}

export function closeEditor() {
  active = false;
  if (overlay) overlay.style.display = 'none';
}

export function toggleEditor() { active ? closeEditor() : openEditor(); }

if (typeof window !== 'undefined') {
  (window as any).toggleEditor = toggleEditor;
  (window as any).openEditor = openEditor;
  (window as any).closeEditor = closeEditor;
}
