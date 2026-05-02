/* ══════════════════════════════════════════════════════════════
   DIALOGUE NODES — Albero di conversazione NPC
   ══════════════════════════════════════════════════════════════ */

var dialogueNodes = {
  /* ── SINDACO RUGGERI ── */
  ruggeri_s0: {
    text: 'Benvenuto a San Celeste, ispettore. Sono il sindaco Ruggeri. La situazione è sotto controllo... solo superstizioni popolari. Ha sentito alla radio? "Gianna Gianna" di Rino Gaetano... quella sì che è musica, non queste storie di dischi volanti.',
    choices: [
      { text: 'Mi parli delle luci nel cielo.', next: 'ruggeri_s0_luci', effect: { subTrust: { ruggeri: 5 } } },
      { text: 'Bellissimo pezzo. Lei segue il festival?', next: 'ruggeri_s0_lore', effect: { addTrust: { ruggeri: 10 } } },
      { text: 'Ci sono stati altri casi di sparizione?', next: 'ruggeri_s0_casi' },
    ],
  },
  ruggeri_s0_lore: {
    text: 'Certo! E l\'Argentina che vince i Mondiali? Una vergogna per il calcio, ma che spettacolo. Mi piace la gente che apprezza la cultura, non come quei matti che gridano all\'alieno ogni volta che vedono un riflesso.',
  },
  ruggeri_s0_luci: {
    text: 'Ancora con queste fandonie. Contadini che hanno bevuto troppo vino. Non abbiamo tempo per queste sciocchezze, Maurizio.',
  },
  ruggeri_s0_casi: {
    text: "Mah... nel 1861, a sentir le storie dei vecchi, due persone sparirono. Ma furono temporali forti quell'anno. Forse annegati nel fiume. Chieda all'archivista Neri, se proprio vuole.",
    effect: { hint: 'chiesa' },
  },

  ruggeri_s1: {
    text: 'Quella lettera militare... non doveva trovarsi negli archivi comunali. Ci sono cose di cui è meglio non parlare.',
    choices: [
      { text: 'Che cosa nasconde, sindaco?', next: 'ruggeri_s1_nasconde' },
      { text: "La lettera coinvolge l'esercito?", next: 'ruggeri_s1_esercito' },
      { text: "Lei sapeva delle sparizioni del '61?", next: 'ruggeri_s1_sapeva' },
    ],
  },
  ruggeri_s1_nasconde: {
    text: 'Io proteggo questo paese, ispettore. Certe cose è meglio lasciarle stare. Non è il momento di scavare.',
  },
  ruggeri_s1_esercito: {
    text: "...Parli con il Capitano Valli. Era di stanza qui nel '61. Lui sa più di me su certe... operazioni. Ma non le dirà niente se non ha qualcosa in mano.",
  },
  ruggeri_s1_sapeva: {
    text: "Sapevo. Ma non potevo dire nulla. Ordini dall'alto. Era per il bene comune, almeno così ci dissero.",
  },

  /* ── TERESA BELLANDI ── */
  teresa_s0: {
    text: "Sant'Antonio ci protegga! Ha visto anche lei le luci? Erano sopra i campi, silenziose... Mio nipote Enzo è uscito a guardare e non è più tornato!",
    choices: [
      { text: 'Cosa ha visto esattamente quella notte?', next: 'teresa_s0_visto' },
      { text: "Suo nipote: quand'è successo?", next: 'teresa_s0_enzo' },
      { text: 'Si calmi, signora. Mi racconti con calma.', next: 'teresa_s0_calma', effect: { addTrust: { teresa: 10 } } },
    ],
  },
  teresa_s0_visto: {
    text: 'Sfere di luce, grosse come automobili, fluttuavano sopra il campo a nord. Mio nonno diceva che nel 1861 fue uguale. Le stesse luci. Lo stesso silenzio.',
  },
  teresa_s0_enzo: {
    text: 'Tre notti fa. Enzo era un ragazzo curioso. Disse: "Nonna, vado a vedere". Non l\'ho più rivisto. La sua stanza è ancora come l\'ha lasciata...',
  },
  teresa_s0_calma: {
    text: 'Come posso stare calma? Mio nipote è sparito nel nulla! E nessuno mi crede! Dicono che sono pazza, che me lo sono immaginato... Ma io le ho viste, le luci.',
  },

  teresa_s1: {
    text: 'Quei segni sul portone... Sono apparsi la notte delle luci. Non erano lì prima. È un messaggio, lo so.',
    choices: [
      { text: 'Ha idea di chi possa averli fatti?', next: 'teresa_s1_chi' },
      {
        text: 'Ha trovato altro vicino alla cascina?',
        next: 'teresa_s1_altro',
        effect: { giveClue: 'frammento' },
      },
      { text: 'Enzo aveva un diario?', next: 'teresa_s1_diario' },
    ],
  },

  /* ── ARCHIVISTA NERI ── */
  neri_s0: {
    text: "Un investigatore della prefettura? Finalmente qualcuno di razionale in questo paese di superstiziosi. Io sono Neri, l'archivista. Come posso aiutarla?",
    choices: [
      { text: 'Cosa sa delle sparizioni del 1861?', next: 'neri_s0_1861' },
      { text: 'Ci sono documenti militari negli archivi?', next: 'neri_s0_militari', effect: { addTrust: { neri: 5 } } },
      { text: 'Lei crede alle luci nel cielo?', next: 'neri_s0_luci', effect: { subTrust: { neri: 10 } } },
    ],
  },
  neri_s0_1861: {
    text: "Registrate, sì. Due persone: un uomo e una donna. Mai ritrovati. Ma guardi che quell'anno ci furono temporali violentissimi. Potrebbero essere annegati nel fiume.",
  },

  /* ── OSVALDO IL BARISTA ── */
  osvaldo_s0: {
    text: "Ah, Detective! Un caffè? O preferisce una grappa? Qui dentro è il terzo caffè, fuori è già l'ottavo. Io dico: sono i russi. O forse gli americani. Senta, se mi fa un favore, le dirò cosa ho visto davvero l'altra notte.",
    choices: [
      { text: 'Che genere di favore?', next: 'osvaldo_mission_start' },
      { text: 'Cosa ne pensa delle luci?', next: 'osvaldo_luci' },
      { text: 'Un caffè, grazie.', next: 'osvaldo_caffe', effect: { addTrust: { osvaldo: 5 } } },
    ],
  },
  osvaldo_mission_start: {
    text: 'Il mio fornitore di menta selvatica non è passato. Cresce solo vicino alle tracce nei Giardini. Se me ne porta un mazzetto, le offro il segreto del mio amaro... e un indizio che scotta.',
    effect: { setFlag: 'osvaldo_mission_active' }
  },
  osvaldo_luci: {
    text: 'Le luci? Ma quali luci! Sarà mica la televisione che fa brutti scherzi. Mia moglie dice che sono gli extraterrestri. Io dico che sono i bergamaschi. Quelli sono capaci di tutto.',
  },
  osvaldo_caffe: {
    text: 'Ecco a lei. 200 lire. Scherzo, offre la casa. Sa, con tutto questo casino delle luci, i clienti scappano. Restano solo i vecchi. E Gino. Gino non paga mai.',
  },

  osvaldo_s1: {
    text: 'Ma questa è menta selvatica vera! Profumatissima. Grazie, Detective! Mi ha svoltato la serata. Senta, per sdebitarmi le dico una cosa: l\'altra notte, quando le luci erano forti, la radio del bar ha iniziato a emettere un ronzio strano, alla stessa frequenza di quelle sfere...',
    choices: [
      { text: 'Interessante. Mi parli della radio.', next: 'osvaldo_s1_radio', effect: { addTrust: { osvaldo: 15 } } },
      { text: 'Sono felice di averla aiutata.', next: 'osvaldo_s1_grazie' },
    ],
  },
  osvaldo_s1_radio: {
    text: 'È lì nell\'angolo. Di solito prende solo musica, ma quella notte sembrava... sintonizzata su qualcosa che non era di questo mondo. Provi a darci un\'occhiata.',
  },
  osvaldo_s1_grazie: {
    text: 'Grazie a lei! Torni quando vuole per un amaro. Offre Osvaldo!',
  },

  /* ── GINO IL POSTINO ── */
  gino_s0: {
    text: 'Buongiorno, Detective! Gino, postino! Sa che l\'altro giorno ho consegnato una lettera indirizzata a "I Visitatori del Cielo"? Roba da matti. Comunque, ho perso una raccomandata importante vicino al Cimitero... se la trova, le faccio vedere una cosa interessante.',
    choices: [
      { text: 'La aiuterò a cercarla.', next: 'gino_mission_start' },
      { text: 'Lei crede agli alieni?', next: 'gino_alieni' },
      { text: 'Piacere, Gino.', next: 'gino_piacere', effect: { addTrust: { gino: 5 } } },
    ],
  },
  gino_mission_start: {
    text: 'Grazie! È una busta gialla, dev\'essere caduta tra le lapidi. Io lì di notte non ci entro mica, dicono che le luci abbiano risvegliato chi dorme...',
    effect: { setFlag: 'gino_mission_active' }
  },
  gino_alieni: {
    text: 'Alieni? Ma no! Se fossero alieni ci avrebbero già mangiato. O forse... forse sono alieni gentili. Alieni che vengono in vacanza. San Celeste è bella anche per loro, no? Cioè, se uno viene da Marte, magari apprezza il nostro lambrusco.',
  },
  gino_piacere: {
    text: 'Piacere mio! Lei ha l\'aria di uno che ne ha viste tante. Mi ricordi un attore di quei polizieschi che fanno in TV... come si chiama... quello con la sigla "Discoring"? Vabbè, non importa.',
  },

  gino_s1: {
    text: 'La mia raccomandata! L\'ha trovata! Detective, lei è un angelo. Credevo di averla persa per sempre. Per ringraziarla, ecco... ho trovato questo tra la posta smarrita mesi fa. Sembra roba dell\'esercito.',
    choices: [
      { text: 'Roba dell\'esercito? Mi faccia vedere.', next: 'gino_s1_esercito', effect: { giveClue: 'lettera_censurata', addTrust: { gino: 20 } } },
      { text: 'Non si preoccupi, Gino. Buon lavoro.', next: 'gino_s1_lavoro' },
    ],
  },
  gino_s1_esercito: {
    text: 'Eccola. Era nel fango, vicino alla stazione. Parla di esperimenti... o recuperi... boh. Io non so leggere bene il linguaggio dei generali.',
  },
  gino_s1_lavoro: {
    text: 'Anche a lei! E stia attento, che qui a San Celeste le ombre si allungano in fretta.',
  },

  /* ── ANSELMO ── */
  anselmo_s0: {
    text: '*Un vecchio seduto sulla panchina ti guarda con occhi stanchi.* Buonasera. Lei è il forestiero che tutti aspettavano. Io sono Anselmo. Vivo qui da 82 anni. Ho visto cose...',
    choices: [
      { text: 'Che genere di cose, Anselmo?', next: 'anselmo_s0_cose', effect: { addTrust: { anselmo: 10 } } },
      { text: 'Lei sa qualcosa delle luci?', next: 'anselmo_s0_luci' },
      { text: 'Piacere, Anselmo. Buonasera.', next: 'anselmo_s0_piacere' },
    ],
  },
  anselmo_s0_cose: {
    text: 'Cose che non si possono spiegare. Mia moglie, Lena... sparì nel 1952. Dissero che era scappata. Ma io so che non è vero. Era nel campo quella notte. Poi più niente. Come inghiottita dalla terra.',
  },
};

if (typeof window !== 'undefined') {
  window.dialogueNodes = dialogueNodes;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dialogueNodes;
}
