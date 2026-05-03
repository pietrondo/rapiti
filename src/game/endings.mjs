export function determineEnding() {
  var cf = window.gameState.cluesFound;
  var alienScore = 0,
    humanScore = 0;
  var alienClues = [
    'registro_1861',
    'mappa_campi',
    'frammento',
    'simboli_portone',
    'tracce_circolari',
  ];
  var humanClues = ['lettera_censurata', 'lanterna_rotta', 'diario_enzo'];
  for (var i = 0; i < alienClues.length; i++) {
    if (cf.indexOf(alienClues[i]) >= 0) alienScore++;
  }
  for (var j = 0; j < humanClues.length; j++) {
    if (cf.indexOf(humanClues[j]) >= 0) humanScore++;
  }
  if (cf.length < 3) return 'ambiguous';
  if (alienScore > humanScore) return 'alien';
  if (humanScore > alienScore) return 'human';
  return 'ambiguous';
}

export function triggerEnding() {
  window.gameState.endingType = determineEnding();
  window.gameState.previousPhase = window.gameState.gamePhase;
  window.gameState.gamePhase = 'ending';
  showEndingOverlay();
}

export function showEndingOverlay() {
  var et = window.gameState.endingType;
  var name = window.gameState.playerName || 'Maurizio';
  var endings = {
    alien: {
      title: 'Finale: Loro Sono Tornati',
      text:
        'Il cielo si illumina. Luci silenziose scendono sul campo. Le tracce circolari pulsano di una luce azzurra. Il frammento metallico nella tua tasca vibra, sempre più forte.\n\n' +
        'La ricorrenza è reale. Nel 1861 come nel 1978, entità non umane visitano San Celeste quando qualcosa apre la strada. I simboli sulla cascina sono il loro messaggio. Le persone scomparse non sono morte — sono state "raccolte".\n\n' +
        'Tra le luci vedi una figura familiare: Enzo, il nipote di Teresa. Sorride. Ti guarda. Poi svanisce. Le luci si allontanano nel cielo, lasciando il campo nel silenzio.\n\n' +
        '"Non posso spiegare razionalmente ciò che ho visto. Allego prove fisiche. La Prefettura valuti."\n' +
        '— ' +
        name +
        '\n\n' +
        'Mentre chiudi il taccuino, il frammento metallico smette di vibrare. È caldo, adesso. Forse per la prima volta.',
    },
    human: {
      title: 'Finale: Esperimento SIRIO',
      text:
        'Al campo trovi detriti meccanici. Non sono alieni. Sono droni sperimentali. Progetto SIRIO, Aeronautica Militare, testato in segreto dal 1961.\n\n' +
        'La lettera censurata è la prova definitiva. Il Capitano Valli confessa: era una guardia del perimetro. Le persone scomparse? Contadini che si sono avvicinati troppo, "ricollocati" con nuove identità.\n\n' +
        'La lanterna rotta è di un drone precipitato. Il diario di Enzo parla di "uomini in tuta scura", non alieni. Il Ministero della Difesa ha usato la superstizione popolare come copertura per testare velivoli sperimentali sui civili ignari.\n\n' +
        '"Esperimenti militari non autorizzati su territorio civile. Coinvolgo la magistratura. Il caso San Celeste non è un mistero — è un crimine."\n' +
        '— ' +
        name,
    },
    ambiguous: {
      title: 'Finale: Rapporto Incompleto',
      text:
        'Arrivi al campo. Vedi qualcosa — forse luci, forse riflessi di lampioni lontani sulle nuvole basse. Non puoi determinare cosa sia.\n\n' +
        'Forse gas di palude, come dice Neri. Forse un fenomeno atmosferico raro. Forse altro.\n\n' +
        'Non hai elementi sufficienti. Scrivi il rapporto: "Caso n. 78-034. Raccomando ulteriori indagini." Il caso viene archiviato.\n\n' +
        'Mentre lasci San Celeste, guardi il cielo e ti chiedi: e se fossero davvero loro? E se tornassero?\n\n' +
        'Sul fascicolo, un timbro: "Riapertura prevista — 2093."\n' +
        '— ' +
        name +
        '\n\n' +
        'Forse Osvaldo aveva ragione. Forse erano i bergamaschi.',
    },
  };
  var e = endings[et];
  document.getElementById('ending-title').textContent = e.title;
  document.getElementById('ending-text').innerHTML = e.text.replace(/\n/g, '<br>');
  document.getElementById('ending-overlay').classList.add('active');
}
