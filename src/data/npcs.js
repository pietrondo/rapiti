/* ══════════════════════════════════════════════════════════════
   NPC DATA, DIALOGHI, EFFETTI
   ══════════════════════════════════════════════════════════════ */

/** Dati visivi NPC */
var npcsData = [
  { id:'ruggeri', name:'Sindaco Ruggeri', colors:{body:'#5C5C5C',head:'#D4A84B',legs:'#3D3025',detail:'#2D3047'}, details:[] },
  { id:'teresa', name:'Teresa Bellandi', colors:{body:'#6B4E3D',head:'#D4A84B',legs:'#3D3025',detail:'#8B7355'}, details:[] },
  { id:'neri', name:'Archivista Neri', colors:{body:'#8B7D6B',head:'#D4A84B',legs:'#3D3025',detail:'#A0A8B0'}, details:[] },
  { id:'valli', name:'Capitano Valli', colors:{body:'#4A5568',head:'#D4A84B',legs:'#2D3047',detail:'#3D5A3C'}, details:[] },
  { id:'osvaldo', name:'Osvaldo il Barista', colors:{body:'#8B7D6B',head:'#D4A84B',legs:'#3D3025',detail:'#B8A88A'}, details:[] },
  { id:'gino', name:'Gino il Postino', colors:{body:'#5C7A4B',head:'#D4A84B',legs:'#3D3025',detail:'#A0A8B0'}, details:[] },
  { id:'anselmo', name:'Anselmo il Vecchio', colors:{body:'#6B5B4F',head:'#D4A84B',legs:'#3D3025',detail:'#5C5C5C'}, details:[] }
];

/** Albero dialoghi — tutti i nodi di conversazione */
var dialogueNodes = {
  /* ── SINDACO RUGGERI ── */
  ruggeri_s0: {
    text: 'Benvenuto a San Celeste, ispettore. Sono il sindaco Ruggeri. La situazione è sotto controllo... solo superstizioni popolari.',
    choices: [
      { text: 'Mi parli delle luci nel cielo.', next: 'ruggeri_s0_luci' },
      { text: 'Ci sono stati altri casi di sparizione?', next: 'ruggeri_s0_casi' },
      { text: 'Lei cosa pensa, sindaco?', next: 'ruggeri_s0_pensa' }
    ]
  },
  ruggeri_s0_luci: { text: 'Fandonie. Contadini che hanno bevuto troppo vino e scambiato un elicottero per... non so cosa. Non abbiamo tempo per queste sciocchezze.' },
  ruggeri_s0_casi: {
    text: 'Mah... nel 1861, a sentir le storie dei vecchi, due persone sparirono. Ma furono temporali forti quell\'anno. Forse annegati nel fiume. Chieda all\'archivista Neri, se proprio vuole.',
    effect: { hint: 'archivio' }
  },
  ruggeri_s0_pensa: { text: 'Penso che lei stia perdendo tempo, ispettore. La prefettura ha di meglio da fare che inseguire leggende. Ma faccia pure il suo lavoro.' },

  ruggeri_s1: {
    text: 'Quella lettera militare... non doveva trovarsi negli archivi comunali. Ci sono cose di cui è meglio non parlare.',
    choices: [
      { text: 'Che cosa nasconde, sindaco?', next: 'ruggeri_s1_nasconde' },
      { text: 'La lettera coinvolge l\'esercito?', next: 'ruggeri_s1_esercito' },
      { text: 'Lei sapeva delle sparizioni del \'61?', next: 'ruggeri_s1_sapeva' }
    ]
  },
  ruggeri_s1_nasconde: { text: 'Io proteggo questo paese, ispettore. Certe cose è meglio lasciarle stare. Non è il momento di scavare.' },
  ruggeri_s1_esercito: { text: '...Parli con il Capitano Valli. Era di stanza qui nel \'61. Lui sa più di me su certe... operazioni. Ma non le dirà niente se non ha qualcosa in mano.' },
  ruggeri_s1_sapeva: { text: 'Sapevo. Ma non potevo dire nulla. Ordini dall\'alto. Era per il bene comune, almeno così ci dissero.' },

  ruggeri_s2: {
    text: 'Dunque ha risolto il rompicapo. Vada al campo, ispettore. E qualunque cosa trovi laggiù... si ricordi che a volte la verità fa più paura di una bugia.',
    choices: [
      { text: 'Cosa troverò al Campo delle Luci?', next: 'ruggeri_s2_campo' },
      { text: 'Grazie, sindaco. Andrò a vedere.', next: 'ruggeri_s2_vai' }
    ]
  },
  ruggeri_s2_campo: { text: 'Non lo so con certezza. Ma so che ogni 116 anni qualcosa accade lì. Nel 1861, nel 1745... La storia si ripete.' },
  ruggeri_s2_vai: { text: 'Buona fortuna, ispettore. E che Dio l\'accompagni.' },

  /* ── TERESA BELLANDI ── */
  teresa_s0: {
    text: 'Sant\'Antonio ci protegga! Ha visto anche lei le luci? Erano sopra i campi, silenziose... Mio nipote Enzo è uscito a guardare e non è più tornato!',
    choices: [
      { text: 'Cosa ha visto esattamente quella notte?', next: 'teresa_s0_visto' },
      { text: 'Suo nipote: quand\'è successo?', next: 'teresa_s0_enzo' },
      { text: 'Si calmi, signora. Mi racconti con calma.', next: 'teresa_s0_calma' }
    ]
  },
  teresa_s0_visto: { text: 'Sfere di luce, grosse come automobili, fluttuavano sopra il campo a nord. Mio nonno diceva che nel 1861 fu uguale. Le stesse luci. Lo stesso silenzio.' },
  teresa_s0_enzo: { text: 'Tre notti fa. Enzo era un ragazzo curioso. Disse: "Nonna, vado a vedere". Non l\'ho più rivisto. La sua stanza è ancora come l\'ha lasciata...' },
  teresa_s0_calma: { text: 'Come posso stare calma? Mio nipote è sparito nel nulla! E nessuno mi crede! Dicono che sono pazza, che me lo sono immaginato... Ma io le ho viste, le luci.' },

  teresa_s1: {
    text: 'Quei segni sul portone... Sono apparsi la notte delle luci. Non erano lì prima. È un messaggio, lo so.',
    choices: [
      { text: 'Ha idea di chi possa averli fatti?', next: 'teresa_s1_chi' },
      { text: 'Ha trovato altro vicino alla cascina?', next: 'teresa_s1_altro', effect: { giveClue: 'frammento' } },
      { text: 'Enzo aveva un diario?', next: 'teresa_s1_diario' }
    ]
  },
  teresa_s1_chi: { text: 'Nessuno del paese sa fare cose del genere. E non sono simboli cristiani, glielo assicuro. Li ho mostrati al parroco. È impallidito e se n\'è andato.' },
  teresa_s1_altro: { text: 'Sì... ho trovato questo per terra, vicino al pozzo. Era freddo come il ghiaccio, anche se era piena estate. Lo prenda, magari serve alla sua indagine.' },
  teresa_s1_diario: {
    text: 'Il diario di Enzo? Sì, lo teneva sempre con sé. È sul comodino nella sua stanza. Ma io... io non ho il coraggio di leggerlo. Lo faccia lei.',
    effect: { giveClueHint: 'diario_enzo' }
  },

  teresa_s2: {
    text: 'Enzo scriveva di luci e cerchi nel grano. Diceva che "loro" sarebbero tornati dopo 116 anni. Io non so se siano angeli o demoni. Ma lei lo scoprirà.',
    choices: [
      { text: 'Troverò la verità, glielo prometto.', next: 'teresa_s2_promessa' },
      { text: 'Cosa intende con "loro"?', next: 'teresa_s2_loro' }
    ]
  },
  teresa_s2_promessa: { text: 'Grazie, ispettore. Qualunque cosa trovi... mi dica solo se Enzo è vivo. È tutto quello che chiedo.' },
  teresa_s2_loro: { text: 'Quelli che vengono dal cielo. Mio nonno li chiamava "i visitatori". Diceva che non sono cattivi... ma nemmeno buoni. Sono solo... diversi.' },

  /* ── ARCHIVISTA NERI ── */
  neri_s0: {
    text: 'Un investigatore della prefettura? Finalmente qualcuno di razionale in questo paese di superstiziosi. Io sono Neri, l\'archivista. Come posso aiutarla?',
    choices: [
      { text: 'Cosa sa delle sparizioni del 1861?', next: 'neri_s0_1861' },
      { text: 'Ci sono documenti militari negli archivi?', next: 'neri_s0_militari' },
      { text: 'Lei crede alle luci nel cielo?', next: 'neri_s0_luci' }
    ]
  },
  neri_s0_1861: { text: 'Registrate, sì. Due persone: un uomo e una donna. Mai ritrovati. Ma guardi che quell\'anno ci furono temporali violentissimi. Potrebbero essere annegati nel fiume.' },
  neri_s0_militari: { text: 'Abbiamo solo atti comunali. Anche se... in un fondo chiuso c\'è una busta gialla, mai protocollata. Con un timbro che non ho mai visto. Strana, molto strana.' },
  neri_s0_luci: { text: 'Fenomeni atmosferici. Gas di palude. Inversioni termiche. Niente di soprannaturale. La scienza spiega tutto, ispettore. O quasi tutto.' },

  neri_s1: {
    text: 'Forse mi sbagliavo. Ho confrontato le date: 1861 e 1977. Esattamente 116 anni di differenza. Non può essere una coincidenza.',
    choices: [
      { text: 'Cosa significa il ciclo di 116 anni?', next: 'neri_s1_ciclo' },
      { text: 'Ha trovato la lettera di cui parlava?', next: 'neri_s1_lettera', effect: { giveClue: 'lettera_censurata' } },
      { text: 'Ha una mappa dei terreni a nord?', next: 'neri_s1_mappa', effect: { giveClueHint: 'mappa_campi' } }
    ]
  },
  neri_s1_ciclo: { text: 'Non ne ho idea. Ma ho controllato: nel 1861 ci furono "temporali magnetici". E guarda caso, anche tre giorni fa gli aghi delle bussole impazzivano. C\'è uno schema.' },
  neri_s1_lettera: { text: 'L\'ho trovata. È del Ministero della Difesa, datata 1961 — un anno strano, a metà del ciclo. Parla di "recupero materiali non terrestri". È censurata quasi tutta. La legga lei.' },
  neri_s1_mappa: { text: 'Certo, la mappa catastale del 1890. Mostra tutti i terreni agricoli. Il campo a nord era chiamato "Podere Sant\'Elmo" — curioso, no? Sant\'Elmo è il patrono dei marinai... e dei fuochi fatui.' },

  neri_s2: {
    text: 'Vada al campo e porti prove scientifiche. Se quello che sospetto è vero... non siamo soli nell\'universo. E non lo siamo mai stati.',
    choices: [
      { text: 'Pensa davvero che siano extraterrestri?', next: 'neri_s2_extra' },
      { text: 'Andrò al campo. Grazie, Neri.', next: 'neri_s2_thanks' }
    ]
  },
  neri_s2_extra: { text: 'Non so cosa siano. Ma qualcosa torna ogni 116 anni, e lascia tracce che la nostra scienza non sa spiegare. Forse la risposta non è nei libri. Forse è là fuori.' },
  neri_s2_thanks: { text: 'Buona fortuna, ispettore. E mi raccomando: annoti tutto. La documentazione è l\'unica arma contro l\'ignoranza.' },

  /* ── CAPITANO VALLI ── */
  valli_s0: {
    text: 'Investigatore. Non ho niente da dirle. Buonasera.',
    choices: [
      { text: 'Aspetti, capitano. Ho bisogno del suo aiuto.', next: 'valli_s0_aspetta' }
    ]
  },
  valli_s0_aspetta: { text: 'Ho detto che non ho niente da dire. Cerchi altrove.' },

  valli_s1: {
    text: 'Quel frammento metallico... dove l\'ha trovato? È identico a quello che recuperammo nel \'61. Io c\'ero. Ero un soldato semplice, di guardia al perimetro.',
    choices: [
      { text: 'Cosa accadde esattamente nel 1961?', next: 'valli_s1_accadde' },
      { text: 'Era un\'astronave? Un velivolo militare?', next: 'valli_s1_cosa' },
      { text: 'Perché non ha mai parlato prima d\'ora?', next: 'valli_s1_perche' }
    ]
  },
  valli_s1_accadde: { text: 'Un oggetto precipitò nei campi. Non era un aereo. L\'esercito lo recuperò in una notte. Ci dissero che era un satellite russo, ma... non lo era. Non era umano.' },
  valli_s1_cosa: { text: 'Non lo so cosa fosse. Ma il metallo era freddo, leggerissimo. E la forma... non aveva giunture, non aveva rivetti. Era come se fosse stato... cresciuto, non costruito.' },
  valli_s1_perche: { text: 'Minacce. Dissero che se parlavo, sparivo anch\'io. Come i due del 1861. Non ho mai avuto il coraggio... fino ad ora.' },

  valli_s2: {
    text: 'Questa volta non starò zitto. L\'accompagno al campo. Deve vedere con i suoi occhi. Forse è il momento che la verità venga a galla.',
    choices: [
      { text: 'Andiamo, capitano.', next: 'valli_s2_andiamo' },
      { text: 'Cosa devo aspettarmi di trovare?', next: 'valli_s2_cosa' }
    ]
  },
  valli_s2_andiamo: { text: 'Ci vediamo al campo. Non abbia paura. Qualunque cosa siano... sono tornati per un motivo.' },
  valli_s2_cosa: { text: 'Non lo so. Spero risposte. Forse anche Enzo. Forse tutti quelli che sono spariti. O forse solo altre domande.' },

  /* ── OSVALDO IL BARISTA ── */
  osvaldo_s0: {
    text: 'Ah, Detective Maurizio! Il famoso investigatore! Un caffè? O preferisce una grappa? Qui dentro è il terzo caffè, fuori è già l\'ottavo. Io dico: sono i russi. O forse gli americani che fingono di essere russi. O forse...',
    choices: [
      {text:'Cosa ne pensa delle luci?', next:'osvaldo_luci'},
      {text:'Ha visto qualcosa di strano?', next:'osvaldo_strano'},
      {text:'Un caffè, grazie.', next:'osvaldo_caffe'}
    ]
  },
  osvaldo_luci: {text:'Le luci? Ma quali luci! Sarà mica la televisione che fa brutti scherzi. Mia moglie dice che sono gli extraterrestri. Io dico che sono i bergamaschi. Quelli sono capaci di tutto.'},
  osvaldo_strano: {text:'Strano? Mah... ieri ho visto Gino il postino che correva in mutande. Ma quello è normale per Gino. Ah, una cosa: la fontana in piazza perde acqua da 14 anni e nessuno la ripara. Questo sì che è strano.'},
  osvaldo_caffe: {text:'Ecco a lei. 200 lire. Scherzo, offre la casa. Sa, con tutto questo casino delle luci, i clienti scappano. Restano solo i vecchi. E Gino. Gino non paga mai.'},

  /* ── GINO IL POSTINO ── */
  gino_s0: {
    text:'Buongiorno, Detective! Gino, postino! Ho una lettera per lei! ...Ah no, è una multa. Divieto di sosta. La Fiat 500 blu è la sua? No, è del sindaco. Allora la multa non è sua. Però poteva esserlo. Comunque! Voci di paese!',
    choices:[
      {text:'Che voci girano?', next:'gino_voci'},
      {text:'Ha visto qualcosa la notte delle luci?', next:'gino_luci'},
      {text:'Lei crede agli alieni?', next:'gino_alieni'}
    ]
  },
  gino_voci: {text:'La signora Iole, quella del terzo piano... no, non c\'\u00e8 un terzo piano a San Celeste. Quella del piano terra! Dice di aver visto le luci mentre stendeva i panni. Dice che sembravano... come dire... grosse polpette luminose. Io non ci ho capito niente.'},
  gino_luci: {text:'Io quella notte dormivo. Ho il sonno pesante, sa? Mia moglie dice che neanche i bombardamenti mi svegliano. Però ho trovato questo per terra vicino alla cascina.'},
  gino_alieni: {text:'Alieni? Ma no! Se fossero alieni ci avrebbero già mangiato. O forse... forse sono alieni gentili. Alieni che vengono in vacanza. San Celeste è bella anche per loro, no? Cioè, se uno viene da Marte, magari apprezza il nostro lambrusco.'},

  /* ── ANSELMO ── */
  anselmo_s0: {
    text: '*Un vecchio seduto sulla panchina ti guarda con occhi stanchi.* Buonasera. Lei è il forestiero che tutti aspettavano. Io sono Anselmo. Vivo qui da 82 anni. Ho visto cose...',
    choices: [
      {text: 'Che genere di cose, Anselmo?', next:'anselmo_s0_cose'},
      {text: 'Lei sa qualcosa delle luci?', next:'anselmo_s0_luci'},
      {text: 'Piacere, Anselmo. Buonasera.', next:'anselmo_s0_piacere'}
    ]
  },
  anselmo_s0_cose: {text:'Cose che non si possono spiegare. Mia moglie, Lena... sparì nel 1952. Dissero che era scappata. Ma io so che non è vero. Era nel campo quella notte. Poi più niente. Come inghiottita dalla terra.'},
  anselmo_s0_luci: {text:'Luci... sì, le ho viste. Ma non vengono dal cielo. Vengono da sotto. Dal terreno. Come se qualcosa fosse sepolto laggiù. Mia nonna diceva che questi campi sono... speciali. Antichi.'},
  anselmo_s0_piacere: {text:'Buonasera a lei. Stia attento, forestiero. Questo paese ha un cuore gentile ma una memoria lunga. E i segreti... i segreti restano.'},

  anselmo_s1: {
    text: 'Ha sentito la radio? Quella voce... "...non guardare quando si ferma..." Io quella frase la conosco. La diceva Lena. Sempre. Ogni volta che vedeva le luci. "Quando si ferma, non guardare, Anselmo. Non guardare mai."',
    choices: [
      {text: 'Lei sa cosa significa?', next:'anselmo_s1_significa'},
      {text: 'C\'entra col 1952?', next:'anselmo_s1_1952'},
      {text: 'Lena ha mai detto altro?', next:'anselmo_s1_altro'}
    ]
  },
  anselmo_s1_significa: {text:'Non lo so. Ma so che ogni 5-7 anni le luci tornano. E ogni volta qualcuno sparisce. 1952, 1969, 1974... e ora il 1979. È un ciclo. Vada all\'archivio. Guardi i registri. Forse lei è più bravo di me a capire.'},
  anselmo_s1_1952: {text:'Nel 1952 c\'erano già. Esattamente uguali a oggi. Io lo dissi ai carabinieri. Mi presero per matto. Chiusero il caso in 3 giorni. "Annegamento accidentale". Ma il fiume è a 15 chilometri da qui.'},
  anselmo_s1_altro: {text:'Diceva che il terreno "respirava". Che sentiva un tono, un ronzio, prima che le luci apparissero. Io non le ho mai creduto. Forse avrei dovuto.'}
};

/** Effetti dei dialoghi applicati dopo la scelta */
var dialogueEffects = {
  hint_archivio: function() { showToast('Il Sindaco ha parlato dell\'Archivio Comunale.'); },
  give_frammento: function() {
    if(gameState.cluesFound.indexOf('frammento')===-1){
      gameState.cluesFound.push('frammento');
      updateHUD();
      showToast('Hai raccolto: Frammento metallico freddo');
    }
  },
  hint_diario_enzo: function() {
    var obj=areaObjects.cascina.find(function(o){return o.id==='diario_enzo';});
    if(obj)obj.requires=null;
    showToast('Teresa ha detto che il diario è nella stanza di Enzo.');
  },
  give_lettera: function() {
    if(gameState.cluesFound.indexOf('lettera_censurata')===-1){
      gameState.cluesFound.push('lettera_censurata');
      updateHUD();
      showToast('Hai raccolto: Lettera militare censurata');
    }
  },
  hint_mappa: function() { showToast('Neri ha una mappa. Forse è al Campo delle Luci?'); }
};
