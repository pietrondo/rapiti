"use strict";

/* ══════════════════════════════════════════════════════════════
   SCENE INVESTIGATION PUZZLE — Cascina
   ══════════════════════════════════════════════════════════════ */

var sceneElements = [
  { id: 'scena_lanterna', name: 'Lanterna rotta', desc: 'Caduta a terra, vetro rotto. Qualcuno l\'ha lasciata cadere di corsa.' },
  { id: 'scena_impronte', name: 'Impronte nel fango', desc: 'Impronte che girano in cerchio, poi tornano indietro. Movimento circolare.' },
  { id: 'scena_segni', name: 'Segni nel terreno', desc: 'Cerchi perfetti nel grano. Il centro è sprofondato di qualche centimetro.' }
];

var sceneFound = [];
var sceneSolved = false;

function openScenePuzzle() {
  if (gameState.gamePhase !== 'playing') return;
  gameState.previousPhase = 'playing';
  gameState.gamePhase = 'scene';

  // Popola elementi trovati
  var foundDiv = document.getElementById('scene-elements');
  foundDiv.innerHTML = '';
  sceneFound = [];
  for (var i = 0; i < sceneElements.length; i++) {
    if (gameState.cluesFound.indexOf(sceneElements[i].id) >= 0) {
      sceneFound.push(sceneElements[i]);
      var el = document.createElement('div');
      el.style.cssText = 'color:#44cc44;font-size:12px;margin:4px 0';
      el.textContent = '✓ ' + sceneElements[i].name;
      foundDiv.appendChild(el);
    }
  }

  // Popola select
  var selects = ['scene-slot1', 'scene-slot2', 'scene-slot3'];
  for (var s = 0; s < selects.length; s++) {
    var sel = document.getElementById(selects[s]);
    sel.innerHTML = '<option value="">---</option>';
    for (var e = 0; e < sceneFound.length; e++) {
      var opt = document.createElement('option');
      opt.value = sceneFound[e].id;
      opt.textContent = sceneFound[e].name;
      sel.appendChild(opt);
    }
    sel.addEventListener('change', updateSceneConfirm);
  }

  document.getElementById('scene-confirm').disabled = true;
  document.getElementById('scene-result').textContent = '';
  document.getElementById('scene-overlay').classList.add('active');
}

function closeScenePuzzle() {
  document.getElementById('scene-overlay').classList.remove('active');
  gameState.gamePhase = 'playing';
}

function updateSceneConfirm() {
  var s1 = document.getElementById('scene-slot1').value;
  var s2 = document.getElementById('scene-slot2').value;
  var s3 = document.getElementById('scene-slot3').value;
  document.getElementById('scene-confirm').disabled = !(s1 && s2 && s3);
}

function checkScene() {
  var s1 = document.getElementById('scene-slot1').value;
  var s2 = document.getElementById('scene-slot2').value;
  var s3 = document.getElementById('scene-slot3').value;
  // Soluzione: Lanterna = partenza, Impronte = movimento, Segni = arrivo
  var correct = (s1 === 'scena_lanterna' && s2 === 'scena_impronte' && s3 === 'scena_segni');
  var result = document.getElementById('scene-result');
  if (correct) {
    sceneSolved = true;
    result.textContent = '✓ Elena non stava scappando. Stava tornando verso qualcosa.';
    result.style.color = '#44cc44';
    document.getElementById('scene-confirm').disabled = true;
    showToast('Scena ricostruita! Parla con Teresa nella stanza della cascina.');
    
    // Notifica StoryManager
    StoryManager.onPuzzleSolved('scene');
    
    // Sblocca Teresa state 1 (retrocompatibilità)
    if (gameState.npcStates.teresa < 1) gameState.npcStates.teresa = 1;
    
    setTimeout(function() { closeScenePuzzle(); }, 1500);
  } else {
    result.textContent = '✗ Ricostruzione errata. Riprova.';
    result.style.color = '#cc4444';
  }
}

/* ══════════════════════════════════════════════════════════════
   ENDINGS v2 — 4 finali con sistema connessione
   ══════════════════════════════════════════════════════════════ */

function determineEndingV2() {
  // Usa StoryManager per determinare il finale
  if (typeof StoryManager !== 'undefined' && StoryManager.determineEnding) {
    var ending = StoryManager.determineEnding();
    return ending ? ending.id : 'psychological';
  }
  
  // Fallback al vecchio sistema se StoryManager non è disponibile
  var cf = gameState.cluesFound;
  var militaryScore = 0, alienScore = 0, psychScore = 0, secretEligible = false;

  if (cf.indexOf('lettera_censurata') >= 0) militaryScore += 2;
  if (cf.indexOf('radio_audio') >= 0) militaryScore += 1;
  if (cf.indexOf('registro_1861') >= 0) militaryScore += 1;

  if (cf.indexOf('frammento') >= 0) alienScore += 2;
  if (cf.indexOf('tracce_circolari') >= 0) alienScore += 2;
  if (cf.indexOf('simboli_portone') >= 0) alienScore += 1;

  psychScore = 8 - cf.length;

  if (militaryScore >= 2 && alienScore >= 3 && cf.length >= 6) {
    secretEligible = true;
  }

  if (secretEligible) return 'secret';
  if (alienScore > militaryScore && alienScore > 3) return 'alien';
  if (militaryScore > alienScore && militaryScore > 3) return 'military';
  if (psychScore >= 5 || cf.length < 2) return 'psychological';
  if (alienScore >= militaryScore) return 'alien';
  return 'military';
}

function triggerEnding() {
  gameState.endingType = determineEndingV2();
  gameState.previousPhase = gameState.gamePhase;
  gameState.gamePhase = 'ending';
  showEndingOverlayV2();
}

function showEndingOverlayV2() {
  var et = gameState.endingType;
  var name = gameState.playerName || 'Maurizio';
  var endings = {
    military: {
      title: 'Finale: Esperimento FUORI CONTROLLO',
      text: 'I droni del Progetto SIRIO. Esperimenti radio militari iniziati nel 1961 e mai fermati. La lettera censurata è la prova.\n\nLe luci? Riflessi dei velivoli sperimentali sulle nuvole basse. Le sparizioni? Testimoni "ricollocati" con nuove identità.\n\nIl Capitano Valli confessa. Il Ministero insabbia. Ma il tuo rapporto è già partito per Roma.\n\n"Esperimenti militari non autorizzati su civili. Chiedo l\'intervento della magistratura."\n— ' + name
    },
    alien: {
      title: 'Finale: NON SONO SOLI',
      text: 'Il frammento metallico è tecnologia non umana. I cerchi nel grano sono tracce di atterraggio. I simboli sulla cascina... un messaggio che nessuno ha ancora decifrato.\n\nIl ciclo di 116 anni è reale. Nel 1861 come nel 1979. Qualcosa torna. Qualcosa osserva.\n\nMentre scrivi il rapporto, la radio nella tua tasca emette un suono che non hai mai sentito prima.\n\n"Non posso spiegare razionalmente ciò che ho visto. Allego prove fisiche."\n— ' + name
    },
    psychological: {
      title: 'Finale: ISTERIA COLLETTIVA',
      text: 'Nessuna prova concreta. Testimonianze contraddittorie. La suggestione ha fatto il resto.\n\nSan Celeste è un paese di anziani e superstizioni. Le luci erano probabilmente fuochi fatui o riflessi atmosferici. Le sparizioni? Persone che se ne sono andate per conto loro.\n\nIl caso viene archiviato. Ma mentre lasci il paese, una luce nel retrovisore... no, sarà stato un lampione.\n\n"Caso n. 79-034. Archiviato per insufficienza di prove."\n— ' + name
    },
    secret: {
      title: 'Finale: NON È ARRIVATO. È STATO APERTO.',
      text: 'Hai capito tutto.\n\nIl fenomeno esisteva PRIMA dei test militari. Nel 1952, nel 1969, nel 1974. I militari del Progetto SIRIO hanno provato a studiarlo. Controllarlo. E hanno solo peggiorato le cose.\n\n"Non è arrivato. È stato aperto."\n\nQualcosa era già qui. Sotto San Celeste. I test radio hanno aperto una porta che doveva restare chiusa.\n\nRegistri il rapporto. Ti fermi. La radio nella stanza vuota si accende da sola.\n\nVoce: "...non dovevi guardare quando si ferma..."\n\nSilenzio.\n\nBuio.\n\nFine.\n— ' + name
    }
  };
  var e = endings[et];
  document.getElementById('ending-title').textContent = e.title;
  document.getElementById('ending-text').innerHTML = e.text.replace(/\n/g, '<br>');
  document.getElementById('ending-overlay').classList.add('active');
}
