/** Rende i tasti di salvataggio nel menu */
export function renderSaveSlots() {
  var container = document.getElementById('save-slots-container');
  if (!container) return;
  container.innerHTML = '';

  var saves = window.saveLoad.getAllSaves();

  saves.forEach((s) => {
    var slotEl = document.createElement('div');
    slotEl.className = `save-slot${s.exists ? '' : ' empty'}${s.slot === 'autosave' ? ' autosave' : ''}`;

    var info = document.createElement('div');
    info.className = 'slot-info';

    var name = document.createElement('div');
    name.className = 'slot-name';
    var icon = s.slot === 'autosave' ? '🕒 ' : '💾 ';
    var label = s.slot === 'autosave' ? 'Autosave' : `Slot ${s.slot.replace('slot', '')}`;
    name.textContent =
      icon + (s.exists ? s.meta?.name || label : `Slot ${s.slot.replace('slot', '')} (Vuoto)`);
    if (s.slot === 'autosave' && !s.exists) return;

    var meta = document.createElement('div');
    meta.className = 'slot-meta';
    if (s.exists) {
      var date = new Date(s.timestamp).toLocaleString();
      var areaName = s.meta?.area || 'Area sconosciuta';
      var pct = s.meta?.completionPct;
      var pctStr = pct !== undefined ? ` | ${pct}% completato` : '';
      meta.textContent = `${areaName} — ${date}${pctStr}`;
    } else {
      meta.textContent = 'Nessun dato salvato';
    }

    info.appendChild(name);
    info.appendChild(meta);

    var actions = document.createElement('div');
    actions.className = 'slot-actions';

    if (s.slot !== 'autosave') {
      var saveBtn = document.createElement('button');
      saveBtn.className = 'btn-slot';
      saveBtn.textContent = 'SALVA';
      saveBtn.onclick = (e) => {
        e.stopPropagation();
        handleSave(s.slot);
      };
      actions.appendChild(saveBtn);
    }

    if (s.exists) {
      var loadBtn = document.createElement('button');
      loadBtn.className = 'btn-slot';
      loadBtn.textContent = 'CARICA';
      loadBtn.onclick = (e) => {
        e.stopPropagation();
        handleLoad(s.slot);
      };
      actions.appendChild(loadBtn);

      if (s.slot !== 'autosave') {
        var delBtn = document.createElement('button');
        delBtn.className = 'btn-slot delete';
        delBtn.textContent = 'ELIMINA';
        delBtn.onclick = (e) => {
          e.stopPropagation();
          handleDelete(s.slot);
        };
        actions.appendChild(delBtn);
      }
    }

    slotEl.appendChild(info);
    slotEl.appendChild(actions);
    container.appendChild(slotEl);
  });
}

export function handleSave(slot) {
  if (window.saveLoad.hasSave(slot)) {
    if (!confirm('Sovrascrivere il salvataggio esistente?')) return;
  }
  window.saveLoad.save(slot);
  renderSaveSlots();
}

export function handleLoad(slot) {
  if (window.saveLoad.load(slot)) {
    window.closePanels();
    window.updateHUD();
    if (window.pixiRenderer) window.pixiRenderer.syncState?.();
  }
}

export function handleDelete(slot) {
  if (confirm('Eliminare definitivamente questo salvataggio?')) {
    window.saveLoad.deleteSave(slot);
    renderSaveSlots();
  }
}

/** Apre il menu salvataggi */
export function openSaveMenu() {
  window.gameState.gamePhase = 'save';
  renderSaveSlots();
  document.getElementById('save-overlay').classList.add('active');
}
