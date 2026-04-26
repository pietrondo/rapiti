"use strict";

/* ══════════════════════════════════════════════════════════════
   SEZIONE 8: DIARIO E INVENTARIO
   ══════════════════════════════════════════════════════════════ */

function openJournal() {
  if (gameState.gamePhase !== 'playing') return;
  gameState.previousPhase = 'playing';
  gameState.gamePhase = 'journal';
  var content = document.getElementById('journal-content');
  content.innerHTML = '';
  for (var i = 0; i < clues.length; i++) {
    var c = clues[i];
    var found = gameState.cluesFound.indexOf(c.id) >= 0;
    var div = document.createElement('div');
    div.className = 'clue-item' + (found ? ' found' : '');
    div.innerHTML = '<strong>' + (found ? '✓ ' : '? ') + c.name + '</strong>' +
      '<div class="clue-status">' + (found ? 'RACCOLTO' : 'Non ancora trovato') + '</div>' +
      (found ? '<div style="margin-top:4px;font-size:12px;color:#a0a8b0">' + c.desc + '</div>' : '');
    content.appendChild(div);
  }
  document.getElementById('journal-overlay').classList.add('active');
}

function closeJournal() {
  document.getElementById('journal-overlay').classList.remove('active');
  gameState.gamePhase = 'playing';
}

function openInventory() {
  if (gameState.gamePhase !== 'playing') return;
  gameState.previousPhase = 'playing';
  gameState.gamePhase = 'inventory';
  var content = document.getElementById('inventory-content');
  content.innerHTML = '';
  var foundClues = clues.filter(function(c) { return gameState.cluesFound.indexOf(c.id) >= 0; });
  if (foundClues.length === 0) {
    content.innerHTML = '<p style="color:#6b7b6b;text-align:center">Nessun oggetto raccolto.</p>';
  } else {
    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(3,1fr);gap:8px';
    for (var i = 0; i < foundClues.length; i++) {
      var item = document.createElement('div');
      item.style.cssText = 'background:#2d3047;border:1px solid #d4a843;padding:8px;text-align:center;font-size:11px';
      item.textContent = foundClues[i].name;
      grid.appendChild(item);
    }
    content.appendChild(grid);
  }
  document.getElementById('inventory-overlay').classList.add('active');
}

function closeInventory() {
  document.getElementById('inventory-overlay').classList.remove('active');
  gameState.gamePhase = 'playing';
}

function closePanels() {
  if (gameState.gamePhase === 'journal') closeJournal();
  if (gameState.gamePhase === 'inventory') closeInventory();
}

/* ══════════════════════════════════════════════════════════════
   SEZIONE 9: DEDUZIONE (ENIGMA)
   ══════════════════════════════════════════════════════════════ */

function canOpenDeduction() {
  var needed = ['registro_1861', 'mappa_campi', 'tracce_circolari'];
  for (var i = 0; i < needed.length; i++) {
    if (gameState.cluesFound.indexOf(needed[i]) < 0) return false;
  }
  return !gameState.puzzleSolved;
}

function openDeduction() {
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
    el.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', e.target.getAttribute('data-clue-id'));
    });
    cluesDiv.appendChild(el);
  }
  var slots = document.querySelectorAll('.deduction-slot');
  for (var s = 0; s < slots.length; s++) {
    var label = slots[s].getAttribute('data-slot') === 'posizione' ? 'Posizione' :
      slots[s].getAttribute('data-slot') === 'data' ? 'Data / Cronologia' : 'Prova fisica';
    slots[s].innerHTML = label;
    slots[s].classList.remove('filled');
    slots[s].removeAttribute('data-placed-clue');
  }
  document.getElementById('deduction-confirm').disabled = true;
  document.getElementById('deduction-overlay').classList.add('active');
}

function closeDeduction() {
  document.getElementById('deduction-overlay').classList.remove('active');
  gameState.gamePhase = 'playing';
}

function setupDragDrop() {
  var slots = document.querySelectorAll('.deduction-slot');
  for (var i = 0; i < slots.length; i++) {
    var slot = slots[i];
    slot.addEventListener('dragover', function(e) {
      e.preventDefault();
      var s = e.target.closest('.deduction-slot');
      if (s) s.classList.add('drag-over');
    });
    slot.addEventListener('dragleave', function(e) {
      var s = e.target.closest('.deduction-slot');
      if (s) s.classList.remove('drag-over');
    });
    slot.addEventListener('drop', function(e) {
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
          var lbl = allSlots[j].getAttribute('data-slot') === 'posizione' ? 'Posizione' :
            allSlots[j].getAttribute('data-slot') === 'data' ? 'Data / Cronologia' : 'Prova fisica';
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

function updateDeductionConfirmButton() {
  var slots = document.querySelectorAll('.deduction-slot');
  var allFilled = true;
  for (var i = 0; i < slots.length; i++) {
    if (!slots[i].getAttribute('data-placed-clue')) { allFilled = false; break; }
  }
  document.getElementById('deduction-confirm').disabled = !allFilled;
}

function checkDeduction() {
  var solution = { posizione: 'mappa_campi', data: 'registro_1861', prova: 'tracce_circolari' };
  var slots = document.querySelectorAll('.deduction-slot');
  var correct = true;
  for (var i = 0; i < slots.length; i++) {
    var slotType = slots[i].getAttribute('data-slot');
    var placed = slots[i].getAttribute('data-placed-clue');
    if (placed !== solution[slotType]) { correct = false; break; }
  }
  gameState.puzzleAttempts++;
  if (correct) {
    gameState.puzzleSolved = true;
    document.getElementById('deduction-overlay').classList.remove('active');
    gameState.gamePhase = 'playing';
    updateNPCStates();
    showToast('Ipotesi confermata! Torna al Campo delle Luci per la verifica finale.');
    updateHUD();
  } else {
    showToast('Ipotesi errata. Riprova a collegare gli indizi.');
    if (gameState.puzzleAttempts >= 3) {
      showToast('Suggerimento: parlane con l\'Archivista Neri.');
    }
  }
}

/* ══════════════════════════════════════════════════════════════
   SEZIONE 11: FINALI
   ══════════════════════════════════════════════════════════════ */

function determineEnding() {
  var cf = gameState.cluesFound;
  var alienScore = 0, humanScore = 0;
  var alienClues = ['registro_1861', 'mappa_campi', 'frammento', 'simboli_portone', 'tracce_circolari'];
  var humanClues = ['lettera_censurata', 'lanterna_rotta', 'diario_enzo'];
  for (var i = 0; i < alienClues.length; i++) { if (cf.indexOf(alienClues[i]) >= 0) alienScore++; }
  for (var j = 0; j < humanClues.length; j++) { if (cf.indexOf(humanClues[j]) >= 0) humanScore++; }
  if (cf.length < 3) return 'ambiguous';
  if (alienScore > humanScore) return 'alien';
  if (humanScore > alienScore) return 'human';
  return 'ambiguous';
}

function triggerEnding() {
  gameState.endingType = determineEnding();
  gameState.previousPhase = gameState.gamePhase;
  gameState.gamePhase = 'ending';
  showEndingOverlay();
}

function showEndingOverlay() {
  var et = gameState.endingType;
  var name = gameState.playerName || 'Maurizio';
  var endings = {
    alien: {
      title: 'Finale: Loro Sono Tornati',
      text: 'Il cielo si illumina. Luci silenziose scendono sul campo. Le tracce circolari pulsano di una luce azzurra. Il frammento metallico nella tua tasca vibra, sempre più forte.\n\n' +
        'Il ciclo di 116 anni è reale. Nel 1861 come nel 1978, entità non umane visitano San Celeste. I simboli sulla cascina sono il loro messaggio. Le persone scomparse non sono morte — sono state "raccolte".\n\n' +
        'Tra le luci vedi una figura familiare: Enzo, il nipote di Teresa. Sorride. Ti guarda. Poi svanisce. Le luci si allontanano nel cielo, lasciando il campo nel silenzio.\n\n' +
        '"Non posso spiegare razionalmente ciò che ho visto. Allego prove fisiche. La Prefettura valuti."\n' +
        '— ' + name + '\n\n' +
        'Mentre chiudi il taccuino, il frammento metallico smette di vibrare. È caldo, adesso. Forse per la prima volta.'
    },
    human: {
      title: 'Finale: Esperimento SIRIO',
      text: 'Al campo trovi detriti meccanici. Non sono alieni. Sono droni sperimentali. Progetto SIRIO, Aeronautica Militare, testato in segreto dal 1961.\n\n' +
        'La lettera censurata è la prova definitiva. Il Capitano Valli confessa: era una guardia del perimetro. Le persone scomparse? Contadini che si sono avvicinati troppo, "ricollocati" con nuove identità.\n\n' +
        'La lanterna rotta è di un drone precipitato. Il diario di Enzo parla di "uomini in tuta scura", non alieni. Il Ministero della Difesa ha usato la superstizione popolare come copertura per testare velivoli sperimentali sui civili ignari.\n\n' +
        '"Esperimenti militari non autorizzati su territorio civile. Coinvolgo la magistratura. Il caso San Celeste non è un mistero — è un crimine."\n' +
        '— ' + name
    },
    ambiguous: {
      title: 'Finale: Rapporto Incompleto',
      text: 'Arrivi al campo. Vedi qualcosa — forse luci, forse riflessi di lampioni lontani sulle nuvole basse. Non puoi determinare cosa sia.\n\n' +
        'Forse gas di palude, come dice Neri. Forse un fenomeno atmosferico raro. Forse altro.\n\n' +
        'Non hai elementi sufficienti. Scrivi il rapporto: "Caso n. 78-034. Raccomando ulteriori indagini." Il caso viene archiviato.\n\n' +
        'Mentre lasci San Celeste, guardi il cielo e ti chiedi: e se fossero davvero loro? E se tornassero?\n\n' +
        'Sul fascicolo, un timbro: "Riapertura prevista — 2093."\n' +
        '— ' + name + '\n\n' +
        'Forse Osvaldo aveva ragione. Forse erano i bergamaschi.'
    }
  };
  var e = endings[et];
  document.getElementById('ending-title').textContent = e.title;
  document.getElementById('ending-text').innerHTML = e.text.replace(/\n/g, '<br>');
  document.getElementById('ending-overlay').classList.add('active');
}
