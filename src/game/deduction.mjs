/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    DEDUCTION BOARD SYSTEM (Investigation Board)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Sistema di lavagna investigativa interattiva.
 * Permette di combinare indizi per sbloccare ipotesi narrative.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global window.gameState, window.cluesMap, window.hypotheses, window.StoryManager, window.showToast */

export function canOpenDeduction() {
  if (window.gameState.puzzleSolved || window.gameState.puzzlesSolved?.deduction) return false;

  var requiredClues = ['registro_1861', 'mappa_campi', 'tracce_circolari'];
  var found = window.gameState.cluesFound || [];
  for (var i = 0; i < requiredClues.length; i++) {
    if (found.indexOf(requiredClues[i]) === -1) return false;
  }
  return true;
}

export function openDeduction() {
  window.gameState.previousPhase = 'playing';
  window.gameState.gamePhase = 'deduction';

  renderDeductionClues();
  renderHypothesisLog();
  resetDeductionSlots();

  document.getElementById('deduction-overlay').classList.add('active');
  console.log('[Deduction] Board opened');
}

export function closeDeduction() {
  document.getElementById('deduction-overlay').classList.remove('active');
  window.gameState.gamePhase = 'playing';
}

/** Rende la lista degli indizi trascinabili */
function renderDeductionClues() {
  const cluesDiv = document.getElementById('deduction-clues');
  if (!cluesDiv) return;
  cluesDiv.innerHTML = '';

  const found = window.gameState.cluesFound;
  found.forEach((clueId) => {
    const c = window.cluesMap[clueId];
    if (!c) return;

    const el = document.createElement('div');
    el.className = 'draggable-clue';

    const titleEl = document.createElement('div');
    titleEl.style.fontWeight = 'bold';
    titleEl.style.marginBottom = '4px';
    titleEl.textContent = window.t ? window.t(`clue.${clueId}.name`) : c.name;

    const descEl = document.createElement('div');
    descEl.style.fontSize = '9px';
    descEl.style.opacity = '0.7';
    const rawDesc = window.t ? window.t(`clue.${clueId}.desc`) : c.desc;
    descEl.textContent = `${rawDesc.substring(0, 40)}...`;

    el.appendChild(titleEl);
    el.appendChild(descEl);

    el.style.cssText =
      'background:rgba(212,168,67,0.1); border:1px solid #d4a843; padding:8px; margin-bottom:8px; border-radius:3px; cursor:grab; font-size:10px; color:#e8dcc8; transition:transform 0.1s;';
    el.draggable = true;
    el.setAttribute('data-clue-id', c.id);

    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData(
        'text/plain',
        e.target.closest('.draggable-clue').getAttribute('data-clue-id')
      );
      el.style.opacity = '0.5';
    });
    el.addEventListener('dragend', () => {
      el.style.opacity = '1';
    });

    cluesDiv.appendChild(el);
  });
}

/** Rende il log delle ipotesi confermate */
function renderHypothesisLog() {
  const logDiv = document.getElementById('hypothesis-list');
  if (!logDiv) return;
  logDiv.innerHTML = '';

  const confirmed = window.gameState.confirmedHypotheses || [];
  if (confirmed.length === 0) {
    logDiv.innerHTML =
      `<div style="font-style:italic;color:#666;text-align:center;margin-top:20px;">${window.t ? window.t('ui.no_connections') : 'Nessun collegamento trovato'}</div>`;
    return;
  }

  confirmed.forEach((hypoId) => {
    const h = window.hypotheses.find((item) => item.id === hypoId);
    if (!h) return;

    const el = document.createElement('div');
    el.style.cssText =
      'background:rgba(76,175,80,0.1); border-left:3px solid #4CAF50; padding:8px; margin-bottom:10px; border-radius:2px;';

    const titleEl = document.createElement('div');
    titleEl.style.color = '#4CAF50';
    titleEl.style.fontWeight = 'bold';
    titleEl.style.marginBottom = '3px';
    const hypoName = window.t ? window.t(`hypo.${hypoId}.name`) : h.name;
    titleEl.textContent = `✓ ${hypoName}`;

    const descEl = document.createElement('div');
    descEl.style.fontSize = '9px';
    descEl.style.color = '#aaa';
    descEl.textContent = window.t ? window.t(`hypo.${hypoId}.desc`) : h.desc;

    el.appendChild(titleEl);
    el.appendChild(descEl);
    logDiv.appendChild(el);
  });
}

/** Reset degli slot di lavoro */
function resetDeductionSlots() {
  const slots = document.querySelectorAll('.deduction-slot');
  slots.forEach((slot) => {
    slot.innerHTML =
      '<span style="opacity:0.3;text-transform:uppercase;letter-spacing:1px;">Trascina Indizio</span>';
    slot.style.background = 'rgba(0,0,0,0.2)';
    slot.classList.remove('filled');
    slot.removeAttribute('data-placed-clue');
  });
  document.getElementById('deduction-confirm').disabled = true;
}

/** Setup Drag & Drop */
export function setupDragDrop() {
  const slots = document.querySelectorAll('.deduction-slot');
  const confirmBtn = document.getElementById('deduction-confirm');

  slots.forEach((slot) => {
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
      slot.style.background = 'rgba(212,168,67,0.15)';
      slot.style.borderColor = '#fff';
    });

    slot.addEventListener('dragleave', (_e) => {
      slot.style.background = slot.classList.contains('filled')
        ? 'rgba(212,168,67,0.1)'
        : 'rgba(0,0,0,0.2)';
      slot.style.borderColor = '#d4a843';
    });

    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      const clueId = e.dataTransfer.getData('text/plain');
      const clue = window.cluesMap[clueId];
      if (!clue) return;

      // Se l'indizio è già in un altro slot, puliscilo
      slots.forEach((s) => {
        if (s.getAttribute('data-placed-clue') === clueId) {
          s.innerHTML = `<span style="opacity:0.3;">${window.t ? window.t('ui.drag_clue') : 'Trascina Indizio'}</span>`;
          s.classList.remove('filled');
          s.removeAttribute('data-placed-clue');
          s.style.background = 'rgba(0,0,0,0.2)';
        }
      });

      const name = window.t ? window.t(`clue.${clueId}.name`) : clue.name;
      slot.innerHTML = `<div style="font-weight:bold;color:#d4a843">${name}</div>`;
      slot.setAttribute('data-placed-clue', clueId);
      slot.classList.add('filled');
      slot.style.background = 'rgba(212,168,67,0.1)';

      updateDeductionConfirmButton();
    });
  });

  confirmBtn.addEventListener('click', checkDeduction);
}

function updateDeductionConfirmButton() {
  const slots = document.querySelectorAll('.deduction-slot.filled');
  document.getElementById('deduction-confirm').disabled = slots.length < 2;
}

/** Verifica se la combinazione di indizi forma un'ipotesi */
export function checkDeduction() {
  const slots = document.querySelectorAll('.deduction-slot');
  const clueIds = Array.from(slots)
    .map((s) => s.getAttribute('data-placed-clue'))
    .filter((id) => id !== null);

  if (clueIds.length < 2) return;

  // Cerca un'ipotesi che contenga ENTRAMBI gli indizi
  const foundHypo = window.hypotheses.find((h) => {
    return h.clues.includes(clueIds[0]) && h.clues.includes(clueIds[1]);
  });

  window.gameState.puzzleAttempts++;

  if (foundHypo) {
    if (window.gameState.confirmedHypotheses.indexOf(foundHypo.id) === -1) {
      window.gameState.confirmedHypotheses.push(foundHypo.id);
      const hypoName = window.t ? window.t(`hypo.${foundHypo.id}.name`) : foundHypo.name;
      window.showToast(`${window.t ? window.t('toast.new_hypothesis') : 'Nuova Ipotesi'}: ${hypoName}`);
      console.log(`[Deduction] Hypothesis confirmed: ${foundHypo.id}`);

      // Sblocca flag o eventi
      window.gameState.npcTrust.anselmo += 10;
      if (window.gameState.confirmedHypotheses.length >= 3) {
        window.gameState.puzzlesSolved.deduction = true;
        window.gameState.puzzleSolved = true; // Mantieni per retrocompatibilità temporanea
        window.StoryManager.onPuzzleSolved('deduction');
        window.showToast(window.t ? window.t('toast.deduction_complete') : 'Tutti i pezzi del puzzle combaciano. La verità è vicina.');
      }
    } else {
      window.showToast(window.t ? window.t('toast.hypothesis_exists') : 'Hai già formulato questa ipotesi.');
    }

    renderHypothesisLog();
    resetDeductionSlots();
  } else {
    window.showToast(window.t ? window.t('toast.no_logic_link') : 'Nessun collegamento logico evidente tra questi indizi.');
    // Visivamente resetta gli slot con un flash rosso
    slots.forEach((s) => {
      s.style.borderColor = '#f44';
      setTimeout(() => {
        s.style.borderColor = '#d4a843';
      }, 500);
    });
  }
}

// Global exports
if (typeof window !== 'undefined') {
  window.canOpenDeduction = canOpenDeduction;
  window.openDeduction = openDeduction;
  window.closeDeduction = closeDeduction;
  window.checkDeduction = checkDeduction;
  window.setupDragDrop = setupDragDrop;
}
