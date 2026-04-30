const registryData = [
  {year:'1952', detail:'Lena B. — 42 anni. Scomparsa il 12 luglio. Caso archiviato come "allontanamento volontario".'},
  {year:'1969', detail:'Marco F. — 28 anni. Scomparso il 3 agosto. Testimone: "una luce nel campo". Caso archiviato.'},
  {year:'1974', detail:'Pietro R. e Carla M. — due persone. Scomparsi nella stessa notte, 19 luglio. Nessuna traccia.'},
  {year:'1979', detail:'Enzo Bellandi — 19 anni. Scomparso il 25 luglio. Segni circolari nel terreno. Indagine in corso.'}
];

export function openRegistryPuzzle() {
  if (gameState.gamePhase !== 'playing') return;
  gameState.previousPhase = 'playing';
  gameState.gamePhase = 'registry';
  var pagesDiv = document.getElementById('registry-pages');
  pagesDiv.innerHTML = '';
  // Shuffle pages
  var indices = [0,1,2,3];
  for (var i = indices.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = indices[i]; indices[i] = indices[j]; indices[j] = tmp;
  }
  for (var i = 0; i < indices.length; i++) {
    var d = registryData[indices[i]];
    var el = document.createElement('div');
    el.className = 'registry-page';
    el.draggable = true;
    el.setAttribute('data-year', d.year);
    el.innerHTML = '<span class="reg-year">' + d.year + '</span><span class="reg-detail">' + d.detail + '</span>';
    el.addEventListener('dragstart', function(e) {
      e.dataTransfer.setData('text/plain', e.target.getAttribute('data-year'));
    });
    pagesDiv.appendChild(el);
  }
  // Reset slots
  var slots = document.querySelectorAll('.registry-slot');
  for (var s = 0; s < slots.length; s++) {
    slots[s].innerHTML = (s+1) + '° Scomparso';
    slots[s].classList.remove('filled');
    slots[s].removeAttribute('data-placed-year');
  }
  document.getElementById('registry-confirm').disabled = true;
  document.getElementById('registry-result').textContent = '';
  document.getElementById('registry-overlay').classList.add('active');
}

export function closeRegistryPuzzle() {
  document.getElementById('registry-overlay').classList.remove('active');
  gameState.gamePhase = 'playing';
}

export function setupRegistry() {
  var slots = document.querySelectorAll('.registry-slot');
  for (var i = 0; i < slots.length; i++) {
    var slot = slots[i];
    slot.addEventListener('dragover', function(e) {
      e.preventDefault();
      var s = e.target.closest('.registry-slot');
      if (s) s.classList.add('drag-over');
    });
    slot.addEventListener('dragleave', function(e) {
      var s = e.target.closest('.registry-slot');
      if (s) s.classList.remove('drag-over');
    });
    slot.addEventListener('drop', function(e) {
      e.preventDefault();
      var s = e.target.closest('.registry-slot');
      if (!s) return;
      s.classList.remove('drag-over');
      var year = e.dataTransfer.getData('text/plain');
      if (!year) return;
      // Free previous slot for this year
      var allSlots = document.querySelectorAll('.registry-slot');
      for (var j = 0; j < allSlots.length; j++) {
        if (allSlots[j].getAttribute('data-placed-year') === year) {
          allSlots[j].removeAttribute('data-placed-year');
          allSlots[j].classList.remove('filled');
          allSlots[j].innerHTML = (parseInt(allSlots[j].getAttribute('data-slot')) + 1) + '° Scomparso';
          var oldPage = document.querySelector('.registry-page[data-year="' + year + '"]');
          if (oldPage) { oldPage.classList.remove('placed'); oldPage.draggable = true; }
        }
      }
      // Free current slot if occupied
      if (s.getAttribute('data-placed-year')) {
        var oldY = s.getAttribute('data-placed-year');
        var oldP = document.querySelector('.registry-page[data-year="' + oldY + '"]');
        if (oldP) { oldP.classList.remove('placed'); oldP.draggable = true; }
      }
      var match = registryData.find(function(d) { return d.year === year; });
      s.setAttribute('data-placed-year', year);
      s.classList.add('filled');
      s.innerHTML = '<span class="reg-year">' + year + '</span><span class="reg-detail">' + match.detail + '</span>';
      var page = document.querySelector('.registry-page[data-year="' + year + '"]');
      if (page) { page.classList.add('placed'); page.draggable = false; }
      updateRegistryConfirmButton();
    });
  }
}

export function updateRegistryConfirmButton() {
  var slots = document.querySelectorAll('.registry-slot');
  var allFilled = true;
  for (var i = 0; i < slots.length; i++) {
    if (!slots[i].getAttribute('data-placed-year')) { allFilled = false; break; }
  }
  document.getElementById('registry-confirm').disabled = !allFilled;
}

export function checkRegistry() {
  var correctOrder = ['1952','1969','1974','1979'];
  var slots = document.querySelectorAll('.registry-slot');
  var correct = true;
  for (var i = 0; i < slots.length; i++) {
    if (slots[i].getAttribute('data-placed-year') !== correctOrder[i]) { correct = false; break; }
  }
  var result = document.getElementById('registry-result');
  if (correct) {
    result.textContent = '✓ Registro ricostruito! C\'è uno schema ciclico...';
    result.style.color = '#44cc44';
    gameState.radioSolved = true; // Reuse flag — indica che il puzzle registro è risolto
    document.getElementById('registry-confirm').disabled = true;
    
    // Notifica StoryManager
    if (typeof StoryManager !== 'undefined') {
      StoryManager.onPuzzleSolved('registry');
    }
    
    // Sblocca dialogo Neri stato 2
    if (gameState.npcStates.neri < 1) gameState.npcStates.neri = 1;
    showToast('Schema scoperto: le sparizioni seguono un ciclo. Neri vorrà parlarti.');
    setTimeout(function() { closeRegistryPuzzle(); }, 1500);
  } else {
    result.textContent = '✗ Ordine errato. Riprova.';
    result.style.color = '#cc4444';
  }
}
