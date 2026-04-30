export function canOpenDeduction() {
  var needed = ['registro_1861', 'mappa_campi', 'tracce_circolari'];
  for (var i = 0; i < needed.length; i++) {
    if (gameState.cluesFound.indexOf(needed[i]) < 0) return false;
  }
  return !gameState.puzzleSolved;
}

export function openDeduction() {
  gameState.previousPhase = 'playing';
  gameState.gamePhase = 'deduction';
  var cluesDiv = document.getElementById('deduction-clues');
  cluesDiv.innerHTML = '';
  var keyClues = ['registro_1861', 'mappa_campi', 'tracce_circolari'];
  for (var i = 0; i < keyClues.length; i++) {
    var c = cluesMap[keyClues[i]];
    var el = document.createElement('div');
    el.className = 'draggable-clue';
    el.textContent = c.name;
    el.draggable = true;
    el.setAttribute('data-clue-id', c.id);
    el.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', e.target.getAttribute('data-clue-id'));
    });
    cluesDiv.appendChild(el);
  }
  var slots = document.querySelectorAll('.deduction-slot');
  for (var s = 0; s < slots.length; s++) {
    var label =
      slots[s].getAttribute('data-slot') === 'posizione'
        ? 'Posizione'
        : slots[s].getAttribute('data-slot') === 'data'
          ? 'Data / Cronologia'
          : 'Prova fisica';
    slots[s].innerHTML = label;
    slots[s].classList.remove('filled');
    slots[s].removeAttribute('data-placed-clue');
  }
  document.getElementById('deduction-confirm').disabled = true;
  document.getElementById('deduction-overlay').classList.add('active');
}

export function closeDeduction() {
  document.getElementById('deduction-overlay').classList.remove('active');
  gameState.gamePhase = 'playing';
}

export function setupDragDrop() {
  var slots = document.querySelectorAll('.deduction-slot');
  for (var i = 0; i < slots.length; i++) {
    var slot = slots[i];
    slot.addEventListener('dragover', (e) => {
      e.preventDefault();
      var s = e.target.closest('.deduction-slot');
      if (s) s.classList.add('drag-over');
    });
    slot.addEventListener('dragleave', (e) => {
      var s = e.target.closest('.deduction-slot');
      if (s) s.classList.remove('drag-over');
    });
    slot.addEventListener('drop', (e) => {
      e.preventDefault();
      var s = e.target.closest('.deduction-slot');
      if (!s) return;
      s.classList.remove('drag-over');
      var clueId = e.dataTransfer.getData('text/plain');
      if (!clueId) return;
      var allSlots = document.querySelectorAll('.deduction-slot');
      for (var j = 0; j < allSlots.length; j++) {
        if (allSlots[j].getAttribute('data-placed-clue') === clueId) {
          allSlots[j].removeAttribute('data-placed-clue');
          allSlots[j].classList.remove('filled');
          var lbl =
            allSlots[j].getAttribute('data-slot') === 'posizione'
              ? 'Posizione'
              : allSlots[j].getAttribute('data-slot') === 'data'
                ? 'Data / Cronologia'
                : 'Prova fisica';
          allSlots[j].innerHTML = lbl;
        }
      }
      if (s.getAttribute('data-placed-clue')) {
        var oldId = s.getAttribute('data-placed-clue');
        s.removeAttribute('data-placed-clue');
      }
      var c = cluesMap[clueId];
      s.setAttribute('data-placed-clue', clueId);
      s.classList.add('filled');
      s.innerHTML = '✓ ' + c.name;
      updateDeductionConfirmButton();
    });
  }
}

export function updateDeductionConfirmButton() {
  var slots = document.querySelectorAll('.deduction-slot');
  var allFilled = true;
  for (var i = 0; i < slots.length; i++) {
    if (!slots[i].getAttribute('data-placed-clue')) {
      allFilled = false;
      break;
    }
  }
  document.getElementById('deduction-confirm').disabled = !allFilled;
}

export function checkDeduction() {
  var solution = { posizione: 'mappa_campi', data: 'registro_1861', prova: 'tracce_circolari' };
  var slots = document.querySelectorAll('.deduction-slot');
  var correct = true;
  for (var i = 0; i < slots.length; i++) {
    var slotType = slots[i].getAttribute('data-slot');
    var placed = slots[i].getAttribute('data-placed-clue');
    if (placed !== solution[slotType]) {
      correct = false;
      break;
    }
  }
  gameState.puzzleAttempts++;
  if (correct) {
    gameState.puzzleSolved = true;

    // Notifica StoryManager
    StoryManager.onPuzzleSolved('deduction');

    document.getElementById('deduction-overlay').classList.remove('active');
    gameState.gamePhase = 'playing';
    updateNPCStates();
    showToast('Ipotesi confermata! Torna al Campo delle Luci per la verifica finale.');
    updateHUD();
  } else {
    showToast('Ipotesi errata. Riprova a collegare gli indizi.');
    if (gameState.puzzleAttempts >= 3) {
      showToast("Suggerimento: parlane con l'Archivista Neri.");
    }
  }
}
