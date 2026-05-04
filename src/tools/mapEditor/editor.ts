/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    MAP EDITOR — DEV OVERLAY
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Overlay interattivo per ispezionare e modificare aree, collider, exits, NPC
 * e oggetti interattivi. Attivabile con F12 durante il gioco.
 *
 * Carica dati da window.areas, window.areaObjects, window.npcsData.
 * Modifiche in-memory fino all'export.
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

interface EditorState {
  active: boolean;
  currentArea: string;
  tool: 'select' | 'collider' | 'exit' | 'npc' | 'object';
  selectedIndex: number;
  dragActive: boolean;
  dragStartX: number;
  dragStartY: number;
  dragOrigItem: ColliderDef | ExitDef | NpcSpawnDef | AreaObjectDef | null;
  areas: Record<string, AreaDef>;
  areaObjects: Record<string, AreaObjectDef[]>;
  npcsData: { id: string; name: string }[];
}

const state: EditorState = {
  active: false,
  currentArea: 'piazze',
  tool: 'select',
  selectedIndex: -1,
  dragActive: false,
  dragStartX: 0,
  dragStartY: 0,
  dragOrigItem: null,
  areas: {},
  areaObjects: {},
  npcsData: [],
};

const CANVAS_W = 400;
const CANVAS_H = 250;
const SCALE = 2;

let overlayEl: HTMLDivElement | null = null;
let canvasEl: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let propPanel: HTMLDivElement | null = null;

/** Inizializza e mostra l'overlay editor */
export function openEditor() {
  if (overlayEl) {
    overlayEl.style.display = 'flex';
    state.active = true;
    _loadRuntimeData();
    _render();
    return;
  }

  state.active = true;
  _buildOverlay();
  _loadRuntimeData();
  _render();
  _setupEvents();
}

/** Chiude l'overlay editor */
export function closeEditor() {
  state.active = false;
  if (overlayEl) overlayEl.style.display = 'none';
}

/** Toggle editor */
export function toggleEditor() {
  if (state.active) closeEditor();
  else openEditor();
}

function _loadRuntimeData() {
  const w = window as any;

  state.areas = {};
  if (w.areas) {
    const ids = typeof w.areas.getIds === 'function' ? w.areas.getIds() : Object.keys(w.areas);
    for (const id of ids) {
      const a = w.areas.get ? w.areas.get(id) : w.areas[id];
      if (!a) continue;
      state.areas[id] = {
        name: a.name || id,
        walkableTop: a.walkableTop || 0,
        colliders: (a.colliders || []).map((c: any) => ({ x: c.x, y: c.y, w: c.w, h: c.h })),
        exits: (a.exits || []).map((e: any) => ({
          to: e.to, dir: e.dir, xRange: [...(e.xRange || [0, 0])] as [number, number],
          spawnX: e.spawnX, spawnY: e.spawnY,
          requiresInteract: e.requiresInteract, requiresFlag: e.requiresFlag,
        })),
        npcs: (a.npcs || []).map((n: any) => ({ id: n.id, x: n.x, y: n.y })),
      };
    }
  }

  state.areaObjects = {};
  if (w.areaObjects) {
    for (const [areaId, objects] of Object.entries(w.areaObjects)) {
      state.areaObjects[areaId] = (objects as any[]).map((o: any) => ({
        id: o.id, x: o.x, y: o.y, w: o.w || 20, h: o.h || 20,
        type: o.type || 'clue', requires: o.requires, drawHint: o.drawHint,
      }));
    }
  }

  state.npcsData = (w.npcsData || []).map((n: any) => ({ id: n.id, name: n.name }));
}

function _buildOverlay() {
  overlayEl = document.createElement('div');
  overlayEl.id = 'map-editor-overlay';
  overlayEl.innerHTML = `
    <div id="me-toolbar">
      <span class="me-title">MAP EDITOR</span>
      <span id="me-area-label">Area: </span>
      <select id="me-area-select"></select>
      <button class="me-btn" data-tool="select" id="me-btn-select">Sel</button>
      <button class="me-btn" data-tool="collider" id="me-btn-collider">Collider</button>
      <button class="me-btn" data-tool="exit" id="me-btn-exit">Exit</button>
      <button class="me-btn" data-tool="npc" id="me-btn-npc">NPC</button>
      <button class="me-btn" data-tool="object" id="me-btn-object">Obj</button>
      <span style="margin-left:auto"></span>
      <button class="me-btn me-export" id="me-btn-export">Export JSON</button>
      <button class="me-btn me-close" id="me-btn-close">X</button>
    </div>
    <div id="me-main">
      <div id="me-canvas-wrap">
        <canvas id="me-canvas" width="${CANVAS_W * SCALE}" height="${CANVAS_H * SCALE}"></canvas>
      </div>
      <div id="me-props">
        <h4>PROPRIETA'</h4>
        <div id="me-prop-content">Seleziona un elemento</div>
      </div>
    </div>
    <div id="me-status"></div>
  `;
  document.body.appendChild(overlayEl);

  canvasEl = document.getElementById('me-canvas') as HTMLCanvasElement;
  ctx = canvasEl.getContext('2d')!;
  propPanel = document.getElementById('me-prop-content') as HTMLDivElement;

  const areaSelect = document.getElementById('me-area-select') as HTMLSelectElement;
  areaSelect.addEventListener('change', () => {
    state.currentArea = areaSelect.value;
    state.selectedIndex = -1;
    _render();
  });

  document.getElementById('me-btn-close')!.addEventListener('click', closeEditor);
  document.getElementById('me-btn-export')!.addEventListener('click', _exportJSON);

  document.querySelectorAll('.me-btn[data-tool]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.tool = (btn as HTMLElement).dataset.tool as EditorState['tool'];
      state.selectedIndex = -1;
      _render();
      _updateToolButtons();
    });
  });
}

function _setupEvents() {
  if (!canvasEl) return;

  canvasEl.addEventListener('mousedown', (e) => {
    const canvasX = e.offsetX / SCALE;
    const canvasY = e.offsetY / SCALE;
    const area = state.areas[state.currentArea];
    if (!area) return;

    if (state.tool === 'select') {
      const items = _getCurrentItems(area);
      for (let i = items.length - 1; i >= 0; i--) {
        if (_hitTest(items[i], canvasX, canvasY)) {
          state.selectedIndex = i;
          state.dragActive = true;
          state.dragStartX = canvasX;
          state.dragStartY = canvasY;
          state.dragOrigItem = JSON.parse(JSON.stringify(items[i]));
          _render();
          _updatePropPanel(items[i], i);
          return;
        }
      }
      state.selectedIndex = -1;
      _render();
      return;
    }

    if (state.tool === 'collider') {
      const c: ColliderDef = { x: Math.round(canvasX), y: Math.round(canvasY), w: 40, h: 30 };
      area.colliders.push(c);
      state.selectedIndex = area.colliders.length - 1;
      _render();
      return;
    }
    if (state.tool === 'exit') {
      const ex: ExitDef = { to: 'piazze', dir: 'down', xRange: [Math.round(canvasX) - 20, Math.round(canvasX) + 20], spawnX: 200, spawnY: 188 };
      area.exits.push(ex);
      state.selectedIndex = area.exits.length - 1;
      _render();
      return;
    }
    if (state.tool === 'npc') {
      const n: NpcSpawnDef = { id: state.npcsData[0]?.id || 'unknown', x: Math.round(canvasX), y: Math.round(canvasY) };
      area.npcs.push(n);
      state.selectedIndex = area.npcs.length - 1;
      _render();
      return;
    }
    if (state.tool === 'object') {
      const list = state.areaObjects[state.currentArea] || [];
      const o: AreaObjectDef = { id: `obj_${Date.now()}`, x: Math.round(canvasX), y: Math.round(canvasY), w: 20, h: 20, type: 'clue' };
      list.push(o);
      state.areaObjects[state.currentArea] = list;
      state.selectedIndex = list.length - 1;
      _render();
      return;
    }
  });

  canvasEl.addEventListener('mousemove', (e) => {
    if (!state.dragActive || !state.dragOrigItem) return;
    const dx = e.offsetX / SCALE - state.dragStartX;
    const dy = e.offsetY / SCALE - state.dragStartY;
    const orig = state.dragOrigItem as any;

    if (state.tool === 'select') {
      const items = _getCurrentItems(state.areas[state.currentArea]!);
      const item = items[state.selectedIndex];
      if (item) {
        item.x = Math.max(0, Math.min(CANVAS_W - ((item as any).w || 1), (orig.x || 0) + dx));
        item.y = Math.max(0, Math.min(CANVAS_H - ((item as any).h || 1), (orig.y || 0) + dy));
        if ((orig as ColliderDef).w !== undefined && e.shiftKey) {
          (item as ColliderDef).w = Math.max(5, (orig as ColliderDef).w + dx);
          (item as ColliderDef).h = Math.max(5, (orig as ColliderDef).h + dy);
        }
      }
    }
    _render();
  });

  canvasEl.addEventListener('mouseup', () => {
    state.dragActive = false;
    state.dragOrigItem = null;
  });

  document.addEventListener('keydown', (e) => {
    if (!state.active) return;
    if (e.key === 'Delete' || e.key === 'Backspace') {
      _deleteSelected();
      e.preventDefault();
    }
    if (e.key === 'Escape') {
      closeEditor();
    }
  });
}

function _getCurrentItems(area: AreaDef): any[] {
  const objects = state.areaObjects[state.currentArea] || [];
  return [...area.colliders, ...area.exits, ...area.npcs, ...objects];
}

function _hitTest(item: any, x: number, y: number): boolean {
  return x >= item.x - 2 && x <= item.x + (item.w || 8) + 2 && y >= item.y - 2 && y <= item.y + (item.h || 8) + 2;
}

function _deleteSelected() {
  const area = state.areas[state.currentArea];
  if (!area) return;
  const cLen = area.colliders.length;
  const eLen = area.exits.length;
  const nLen = area.npcs.length;
  const objects = state.areaObjects[state.currentArea] || [];
  const oLen = objects.length;
  let idx = state.selectedIndex;

  if (idx < cLen) { area.colliders.splice(idx, 1); }
  else if (idx < cLen + eLen) { area.exits.splice(idx - cLen, 1); }
  else if (idx < cLen + eLen + nLen) { area.npcs.splice(idx - cLen - eLen, 1); }
  else if (idx < cLen + eLen + nLen + oLen) {
    objects.splice(idx - cLen - eLen - nLen, 1);
    state.areaObjects[state.currentArea] = objects;
  }
  state.selectedIndex = -1;
  _render();
}

function _updateToolButtons() {
  document.querySelectorAll('.me-btn[data-tool]').forEach(b => {
    b.classList.toggle('active', (b as HTMLElement).dataset.tool === state.tool);
  });
}

function _render() {
  if (!ctx || !canvasEl) return;
  const area = state.areas[state.currentArea];
  if (!area) return;

  const w = window as any;
  ctx.clearRect(0, 0, CANVAS_W * SCALE, CANVAS_H * SCALE);
  ctx.save();
  ctx.scale(SCALE, SCALE);

  ctx.fillStyle = '#111';
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  ctx.strokeStyle = '#1a1a2e';
  ctx.lineWidth = 0.5;
  for (let x = 0; x < CANVAS_W; x += 20) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, CANVAS_H); ctx.stroke();
  }
  for (let y = 0; y < CANVAS_H; y += 20) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(CANVAS_W, y); ctx.stroke();
  }

  if (typeof area.draw === 'function') area.draw(ctx);

  area.colliders.forEach((c, i) => _drawRect(ctx!, c.x, c.y, c.w, c.h, '#ff444466', '#ff4444', i, 0));
  area.exits.forEach((e, i) => {
    const x = e.xRange[0];
    const y = e.xRange[1];
    ctx!.fillStyle = '#4488ff44';
    ctx!.strokeStyle = '#4488ff';
    ctx!.lineWidth = 1;
    if (e.dir === 'up' || e.dir === 'down') {
      ctx!.fillRect(x, e.dir === 'up' ? 0 : CANVAS_H - 10, e.xRange[1] - e.xRange[0], 10);
      ctx!.strokeRect(x, e.dir === 'up' ? 0 : CANVAS_H - 10, e.xRange[1] - e.xRange[0], 10);
    } else {
      ctx!.fillRect(e.dir === 'left' ? 0 : CANVAS_W - 10, x, 10, e.xRange[1] - e.xRange[0]);
      ctx!.strokeRect(e.dir === 'left' ? 0 : CANVAS_W - 10, x, 10, e.xRange[1] - e.xRange[0]);
    }
    if (state.selectedIndex === area.colliders.length + i) {
      ctx!.strokeStyle = '#fff'; ctx!.lineWidth = 2;
      ctx!.strokeRect(e.dir === 'up' ? x - 2 : e.dir === 'down' ? x - 2 : e.dir === 'left' ? CANVAS_W - 14 : -6,
        e.dir === 'up' ? -3 : e.dir === 'down' ? CANVAS_H - 13 : x - 2,
        e.dir === 'up' || e.dir === 'down' ? (e.xRange[1] - e.xRange[0]) + 4 : 14,
        e.dir === 'up' || e.dir === 'down' ? 16 : (e.xRange[1] - e.xRange[0]) + 4);
    }
    ctx!.fillStyle = '#4488ff';
    ctx!.font = '7px monospace';
    ctx!.fillText(`→${e.to}`, x + 4, (e.dir === 'up' ? 8 : e.dir === 'down' ? CANVAS_H - 2 : y + 8));
  });
  area.npcs.forEach((n, i) => {
    ctx!.fillStyle = '#44ff4466';
    ctx!.fillRect(n.x - 4, n.y - 10, 10, 12);
    ctx!.strokeStyle = '#44ff44';
    ctx!.lineWidth = 1;
    ctx!.strokeRect(n.x - 4, n.y - 10, 10, 12);
    ctx!.fillStyle = '#44ff44';
    ctx!.font = '7px monospace';
    ctx!.fillText(n.id, n.x - 4, n.y - 12);
    if (state.selectedIndex === area.colliders.length + area.exits.length + i) {
      ctx!.strokeStyle = '#fff'; ctx!.lineWidth = 2;
      ctx!.strokeRect(n.x - 6, n.y - 12, 14, 16);
    }
  });
  const objects = state.areaObjects[state.currentArea] || [];
  objects.forEach((o, i) => {
    _drawRect(ctx!, o.x, o.y, o.w, o.h, '#ffaa0066', '#ffaa00', i, area.colliders.length + area.exits.length + area.npcs.length);
  });

  if (area.walkableTop > 0) {
    ctx!.strokeStyle = '#ffffff22';
    ctx!.setLineDash([4, 8]);
    ctx!.beginPath(); ctx!.moveTo(0, area.walkableTop); ctx!.lineTo(CANVAS_W, area.walkableTop); ctx!.stroke();
    ctx!.setLineDash([]);
  }

  ctx.restore();

  _updateAreaSelect();
  _updateStatus();
}

function _drawRect(c: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill: string, stroke: string, i: number, offset: number) {
  c.fillStyle = fill;
  c.fillRect(x, y, w, h);
  c.strokeStyle = state.selectedIndex === offset + i ? '#ffffff' : stroke;
  c.lineWidth = state.selectedIndex === offset + i ? 2 : 1;
  c.strokeRect(x, y, w, h);
  if (state.selectedIndex === offset + i) {
    c.fillStyle = '#fff';
    c.fillRect(x + w - 3, y - 3, 6, 6);
    c.fillRect(x - 3, y + h - 3, 6, 6);
  }
}

function _updateAreaSelect() {
  const sel = document.getElementById('me-area-select') as HTMLSelectElement;
  if (!sel) return;
  const current = sel.value;
  sel.innerHTML = '';
  for (const id of Object.keys(state.areas)) {
    const opt = document.createElement('option');
    opt.value = id;
    opt.textContent = state.areas[id].name;
    if (id === current) opt.selected = true;
    sel.appendChild(opt);
  }
  document.getElementById('me-area-label')!.textContent = `${Object.keys(state.areas).length} aree`;
}

function _updateStatus() {
  const el = document.getElementById('me-status');
  if (!el) return;
  const area = state.areas[state.currentArea];
  if (!area) return;
  el.textContent = `${area.name} | C:${area.colliders.length} E:${area.exits.length} N:${area.npcs.length} O:${(state.areaObjects[state.currentArea]||[]).length} | Tool: ${state.tool}`;
}

function _updatePropPanel(item: any, index: number) {
  if (!propPanel) return;
  const area = state.areas[state.currentArea];
  if (!area) return;

  let html = `<div class="me-prop-row"><b>Tipo:</b> `;
  const cLen = area.colliders.length;
  const eLen = area.exits.length;
  const nLen = area.npcs.length;
  const objects = state.areaObjects[state.currentArea] || [];

  let arr: any[], prefix: string, typeName: string;
  if (index < cLen) { arr = area.colliders; prefix = 'c'; typeName = 'Collider'; }
  else if (index < cLen + eLen) { arr = area.exits; prefix = 'e'; typeName = 'Exit'; }
  else if (index < cLen + eLen + nLen) { arr = area.npcs; prefix = 'n'; typeName = 'NPC'; }
  else { arr = objects; prefix = 'o'; typeName = 'AreaObject'; }

  const localIdx = index - (index < cLen ? 0 : index < cLen + eLen ? cLen : index < cLen + eLen + nLen ? cLen + eLen : cLen + eLen + nLen);
  html += `${typeName} #${localIdx}</div>`;

  for (const [key, val] of Object.entries(item)) {
    if (key === 'xRange' && Array.isArray(val)) {
      html += `<div class="me-prop-row"><span>${key}[0]</span> <input data-key="${key}" data-idx="0" value="${val[0]}" style="width:50px"></div>`;
      html += `<div class="me-prop-row"><span>${key}[1]</span> <input data-key="${key}" data-idx="1" value="${val[1]}" style="width:50px"></div>`;
    } else {
      html += `<div class="me-prop-row"><span>${key}</span> <input data-key="${key}" value="${typeof val === 'boolean' ? val : val ?? ''}" style="width:${typeof val === 'boolean' ? '30px' : '80px'}"></div>`;
    }
  }

  html += `<button class="me-btn" style="margin-top:8px;background:#cc4444" id="me-prop-delete">Elimina</button>`;
  propPanel.innerHTML = html;

  document.getElementById('me-prop-delete')?.addEventListener('click', () => {
    state.selectedIndex = index;
    _deleteSelected();
  });

  propPanel.querySelectorAll('input').forEach(inp => {
    inp.addEventListener('change', () => {
      const key = inp.dataset.key!;
      const idx = inp.dataset.idx;
      let newVal: any = inp.value;
      if (typeof item[key] === 'number') newVal = parseFloat(inp.value) || 0;
      if (typeof item[key] === 'boolean') newVal = inp.value === 'true';
      if (idx !== undefined && Array.isArray(item[key])) {
        item[key][parseInt(idx)] = parseFloat(inp.value) || 0;
      } else {
        item[key] = newVal;
      }
      _render();
    });
  });
}

function _exportJSON() {
  const data: EditorExportData = {
    version: '1.0.0',
    areas: state.areas,
    areaObjects: state.areaObjects,
    npcsData: state.npcsData,
  };

  const result: ValidationResult = validateExportData(data);
  if (!result.valid) {
    alert('ERRORI DI VALIDAZIONE:\n\n' + result.errors.map(e => `[${e.area}] ${e.field}: ${e.message}`).join('\n'));
    return;
  }

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'areas-data.json';
  a.click();
  URL.revokeObjectURL(url);
}

if (typeof window !== 'undefined') {
  (window as any).toggleEditor = toggleEditor;
  (window as any).openEditor = openEditor;
  (window as any).closeEditor = closeEditor;
}
