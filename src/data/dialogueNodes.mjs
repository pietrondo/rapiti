/* ══════════════════════════════════════════════════════════════
   DIALOGUE NODES — Albero di conversazione NPC
   ══════════════════════════════════════════════════════════════ */

var dialogueNodes = {
  /* ── SINDACO RUGGERI ── */
  ruggeri_s0: {
    text: 'Benvenuto a San Celeste, ispettore. Sono il sindaco Ruggeri. La situazione è sotto controllo... solo superstizioni popolari. Ha sentito alla radio? "Gianna Gianna" di Rino Gaetano... quella sì che è musica, non queste storie di dischi volanti.',
    choices: [
      {
        text: 'Mi parli delle luci nel cielo.',
        next: 'ruggeri_s0_luci',
        effect: { subTrust: { ruggeri: 5 } },
      },
      {
        text: 'Bellissimo pezzo. Lei segue il festival?',
        next: 'ruggeri_s0_lore',
        effect: { addTrust: { ruggeri: 10 } },
      },
      { text: 'Ci sono stati altri casi di sparizione?', next: 'ruggeri_s0_casi' },
    ],
  },
  ruggeri_s0_lore: {
    text: "Certo! E l'Argentina che vince i Mondiali? Una vergogna per il calcio, ma che spettacolo. Mi piace la gente che apprezza la cultura, non come quei matti che gridano all'alieno ogni volta che vedono un riflesso.",
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

  /* -- TRUST BRANCH -- */
  ruggeri_s1_trust: {
    text: "Maurizio, lei mi sembra un uomo d'onore. Le dirò la verità su quella lettera. L'esercito non stava cercando alieni. Stavano testando nuovi radar sperimentali proprio qui. Le 'luci' erano interferenze... o almeno così ci hanno giurato.",
    choices: [
      { text: 'Ne è proprio sicuro, sindaco?', next: 'ruggeri_s1_trust_sure' },
      { text: 'Grazie per la sincerità.', next: 'ruggeri_s1_trust_thanks' },
    ],
  },
  ruggeri_s1_trust_sure: {
    text: 'No. Non ne sono sicuro. Per questo ho tenuto quella lettera. Se scopre altro... venga da me prima di fare rapporto alla Prefettura.',
  },
  ruggeri_s1_trust_thanks: {
    text: 'Si fidi, ispettore. In questo paese le pareti hanno orecchie. Stia attento a quello che scrive nei suoi verbali.',
  },

  /* -- MISTRUST BRANCH -- */
  ruggeri_s1_mistrust: {
    text: "Ancor lei? Le ho detto che quella lettera è un falso, o robaccia burocratica senza valore. Se continua a importunare le autorità cittadine, sarò costretto a chiamare Parma per farla rimuovere dall'incarico.",
    choices: [
      {
        text: 'Non mi minacci, sindaco.',
        next: 'ruggeri_s1_mistrust_threat',
        effect: { subTrust: { ruggeri: 10 } },
      },
      { text: 'Mi scusi. Proseguirò altrove.', next: 'ruggeri_s1_mistrust_exit' },
    ],
  },
  ruggeri_s1_mistrust_threat: {
    text: 'Non è una minaccia, Maurizio. È una promessa. Lei sta sprecando soldi pubblici dietro a fantasmi. Vada a dormire.',
  },
  ruggeri_s1_mistrust_exit: {
    text: 'Saggia decisione. Se vuole un caffè, vada da Osvaldo. Ma non torni qui a parlare di lettere segrete.',
  },

  /* -- HYPOTHESIS BRANCH -- */
  ruggeri_s3_esperimento: {
    text: "Quindi ha collegato i punti... Monte Ferro e la lettera del '61. Sì, Maurizio. Non erano alieni. Era un progetto chiamato 'Occhio di Perseo'. Un radar a impulsi che... beh, ha avuto effetti collaterali sulla popolazione locale. Ma se lo dice in giro, non l'ha saputo da me.",
    choices: [
      { text: 'E Elena? E Enzo?', next: 'ruggeri_s3_spariti' },
      {
        text: 'Capisco. Manterrò il segreto.',
        next: 'ruggeri_s3_segreto',
        effect: { addTrust: { ruggeri: 30 } },
      },
    ],
  },
  ruggeri_s3_spariti: {
    text: 'Il radar... a volte apriva delle... falle. Non so dove siano finiti, ma non sono su questo pianeta, Maurizio. O almeno non in questa dimensione.',
  },
  ruggeri_s3_segreto: { text: 'È la scelta migliore. Per lei, e per San Celeste.' },

  /* -- CORRUPTION BRANCH -- */
  ruggeri_s4_corruzione: {
    text: "Maurizio, lei è un uomo intelligente. Troppo intelligente per il suo bene. Questa storia del radar... se finisce sui giornali, San Celeste morirà. Ma se lei chiude il dossier ora... diciamo per 'mancanza di prove'... la Prefettura riceverà un ottimo rapporto su di lei. E io le darò 5 milioni di lire per le sue 'spese di trasferta'.",
    choices: [
      {
        text: 'Accetto il patto. Il caso è chiuso.',
        next: 'ruggeri_s4_accetta',
        effect: { setFlag: 'ending_corruzione', triggerEnding: true },
      },
      {
        text: 'La mia integrità non ha prezzo, sindaco.',
        next: 'ruggeri_s4_rifiuta',
        effect: { subTrust: { ruggeri: 50 } },
      },
    ],
  },
  ruggeri_s4_accetta: {
    text: 'Sapevo che avremmo trovato un accordo. Vada pure a Parma. Le manderò i documenti necessari.',
  },
  ruggeri_s4_rifiuta: {
    text: 'Peggio per lei. Da questo momento, lei è un estraneo in questo paese. E gli estranei tendono a sparire quando le luci tornano.',
  },

  /* ── TERESA BELLANDI ── */
  teresa_s0: {
    text: "Sant'Antonio ci protegga! Ha visto anche lei le luci? Erano sopra i campi, silenziose... Mio nipote Enzo è uscito a guardare e non è più tornato! Proprio come accadde a mia sorella Elena molti anni fa...",
    choices: [
      { text: 'Sua sorella Elena? Quando è successo?', next: 'teresa_s0_elena' },
      { text: 'Cosa ha visto esattamente quella notte?', next: 'teresa_s0_visto' },
      {
        text: 'Si calmi, signora. Mi racconti con calma.',
        next: 'teresa_s0_calma',
        effect: { addTrust: { teresa: 10 } },
      },
    ],
  },
  teresa_s0_elena: {
    text: "Era il 1961. Elena aveva solo otto anni. Uscì nel campo durante un temporale... ma non pioveva. C'era solo questo ronzio elettrico. Non la rivedemmo mai più. Il sindaco disse che era caduta nel fiume, ma io so che le luci se l'hanno presa.",
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
      {
        text: 'Ci sono documenti militari negli archivi?',
        next: 'neri_s0_militari',
        effect: { addTrust: { neri: 5 } },
      },
      {
        text: 'Lei crede alle luci nel cielo?',
        next: 'neri_s0_luci',
        effect: { subTrust: { neri: 10 } },
      },
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
    effect: { setFlag: 'osvaldo_mission_active' },
  },
  osvaldo_luci: {
    text: 'Le luci? Ma quali luci! Sarà mica la televisione che fa brutti scherzi. Mia moglie dice che sono gli extraterrestri. Io dico che sono i bergamaschi. Quelli sono capaci di tutto.',
  },
  osvaldo_caffe: {
    text: 'Ecco a lei. 200 lire. Scherzo, offre la casa. Sa, con tutto questo casino delle luci, i clienti scappano. Restano solo i vecchi. E Gino. Gino non paga mai.',
  },

  osvaldo_s1: {
    text: "Ma questa è menta selvatica vera! Profumatissima. Grazie, Detective! Mi ha svoltato la serata. Senta, per sdebitarmi le dico una cosa: l'altra notte, quando le luci erano forti, la radio del bar ha iniziato a emettere un ronzio strano, alla stessa frequenza di quelle sfere...",
    choices: [
      {
        text: 'Interessante. Mi parli della radio.',
        next: 'osvaldo_s1_radio',
        effect: { addTrust: { osvaldo: 15 } },
      },
      { text: 'Sono felice di averla aiutata.', next: 'osvaldo_s1_grazie' },
    ],
  },
  osvaldo_s1_radio: {
    text: "È lì nell'angolo. Di solito prende solo musica, ma quella notte sembrava... sintonizzata su qualcosa che non era di questo mondo. Provi a darci un'occhiata.",
  },
  osvaldo_s1_grazie: {
    text: 'Grazie a lei! Torni quando vuole per un amaro. Offre Osvaldo!',
  },

  /* ── GINO IL POSTINO ── */
  gino_s0: {
    text: 'Buongiorno, Detective! Gino, postino! Sa che l\'altro giorno ho consegnato una letter indirizzata a "I Visitatori del Cielo"? Roba da matti. Comunque, ho perso una raccomandata importante vicino al Cimitero... se la trova, le faccio vedere una cosa interessante.',
    choices: [
      { text: 'La aiuterò a cercarla.', next: 'gino_mission_start' },
      { text: 'Lei crede agli alieni?', next: 'gino_alieni' },
      { text: 'Piacere, Gino.', next: 'gino_piacere', effect: { addTrust: { gino: 5 } } },
    ],
  },
  gino_mission_start: {
    text: "Grazie! È una busta gialla, dev'essere caduta tra le lapidi. Io lì di notte non ci entro mica, dicono che le luci abbiano risvegliato chi dorme...",
    effect: { setFlag: 'gino_mission_active' },
  },
  gino_alieni: {
    text: 'Alieni? Ma no! Se fossero alieni ci avrebbero già mangiato. O forse... forse sono alieni gentili. Alieni che vengono in vacanza. San Celeste è bella anche per loro, no? Cioè, se uno viene da Marte, magari apprezza il nostro lambrusco.',
  },
  gino_piacere: {
    text: 'Piacere mio! Lei ha l\'aria di uno che ne ha viste tante. Mi ricordi un attore di quei polizieschi che fanno in TV... come si chiama... quello con la sigla "Discoring"? Vabbè, non importa.',
  },

  gino_s1: {
    text: "La mia raccomandata! L'ha trovata! Detective, lei è un angelo. Credevo di averla persa per sempre. Per ringraziarla, ecco... ho trovato questo tra la posta smarrita mesi fa. Sembra roba dell'esercito.",
    choices: [
      {
        text: "Roba dell'esercito? Mi faccia vedere.",
        next: 'gino_s1_esercito',
        effect: { giveClue: 'lettera_censurata', addTrust: { gino: 20 } },
      },
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
      {
        text: 'Che genere di cose, Anselmo?',
        next: 'anselmo_s0_cose',
        effect: { addTrust: { anselmo: 10 } },
      },
      { text: 'Lei sa qualcosa delle luci?', next: 'anselmo_s0_luci' },
      { text: 'Piacere, Anselmo. Buonasera.', next: 'anselmo_s0_piacere' },
    ],
  },
  anselmo_s0_cose: {
    text: 'Cose che non si possono spiegare. Mia moglie, Lena... sparì nel 1952. Dissero che era scappata. Ma io so che non è vero. Era nel campo quella notte. Poi più niente. Come inghiottita dalla terra.',
  },

  anselmo_s2_lore: {
    text: "*Anselmo ti guarda fisso, abbassando la voce.* Lena non è l'unica, Maurizio. Le date non sono regolari, ma tornano sempre quando le luci si fanno vicine. Il Sindaco e quelli prima di lui hanno sempre coperto tutto. C'è un patto tra questo paese e... ciò che vive oltre le stelle.",
    choices: [
      { text: 'Un patto? Di che tipo?', next: 'anselmo_s2_patto' },
      { text: 'Chi altro sa di questa storia?', next: 'anselmo_s2_chi' },
    ],
  },
  anselmo_s2_patto: {
    text: 'Un patto di silenzio in cambio di prosperità. Ma stavolta qualcosa è andato storto. Le luci sono troppo vicine. Troppo affamate.',
  },
  anselmo_s2_chi: {
    text: 'Valli sa. Quel vecchio militare ha visto le stesse cose che ho visto io. Ma lui ha un fucile, e io solo una panchina.',
  },

  /* -- HYPOTHESIS BRANCH -- */
  anselmo_s3_tecnologia: {
    text: "*Anselmo tocca il frammento metallico con dita tremanti.* Questo... questo viene da lassù. E i cerchi nel Campo... Maurizio, stanno preparando un atterraggio in grande stile. Non è più un rapimento isolato. È un'invasione silenziosa.",
    choices: [
      { text: 'Cosa possiamo fare?', next: 'anselmo_s3_fare' },
      {
        text: 'Devo avvertire la Prefettura.',
        next: 'anselmo_s3_prefet',
        effect: { subTrust: { anselmo: 15 } },
      },
    ],
  },
  anselmo_s3_fare: {
    text: 'Niente. Solo guardare le stelle e sperare che si dimentichino di noi. Come fecero nel 1861.',
  },
  anselmo_s3_prefet: {
    text: 'I burocrati di Parma rideranno di lei. E poi... loro sono già ovunque. Anche in Prefettura.',
  },

  /* ── DON PIETRO ── */
  don_pietro_s0: {
    text: "Pace a te, figliolo. Sei qui per le luci? Preghiamo che non siano segni dell'Apocalisse. Il mondo è cambiato molto dal 1970, troppa superbia.",
    choices: [
      { text: 'Lei cosa pensa delle sparizioni?', next: 'don_pietro_s0_spariti' },
      { text: 'Don Pietro, ha visto qualcosa di strano in chiesa?', next: 'don_pietro_s0_chiesa' },
    ],
  },
  don_pietro_s0_spariti: {
    text: 'Le anime che vagano senza guida si perdono facilmente. Enzo era un buon ragazzo, ma cercava risposte dove non avrebbe dovuto.',
  },
  don_pietro_s0_chiesa: {
    text: 'Solo il silenzio di Dio. Ma a volte, nel silenzio, si sentono rumori che non appartengono a questa terra.',
  },

  don_pietro_s1: {
    text: "Le ricorrenze di cui parli... 1861, 1952, 1961... sono scritte nelle cronache parrocchiali non ufficiali. I miei predecessori le chiamavano 'I Visitatori della Mietitura'. Non seguono il calendario: seguono l'apertura.",
    choices: [
      { text: 'È un castigo divino?', next: 'don_pietro_s1_castigo' },
      {
        text: 'Posso vedere queste cronache?',
        next: 'don_pietro_s1_cronache',
        effect: { giveClue: 'cronaca_parrocchiale' },
      },
    ],
  },
  don_pietro_s1_castigo: {
    text: 'Dio permette il male per metterci alla prova. Ma questi non sono demoni, Maurizio. Sono... collezionisti.',
  },
  don_pietro_s1_cronache: {
    text: 'Tieni. Ma fai attenzione. La verità è un peso che non tutti riescono a sopportare.',
  },

  /* ── NUOVI NODI ESPANSIONE ── */

  ruggeri_s5_complotto: {
    text: 'Siete arrivato a frugare nei registri comunali? Ispettore, vi consiglio di non scavare troppo a fondo. Certe omissioni sono state fatte per il bene del paese, per evitare il panico.',
    choices: [
      { text: 'Il Progetto Sirius non era per il bene del paese.', next: 'ruggeri_s5_sirio' },
      { text: 'Cosa state nascondendo esattamente?', next: 'ruggeri_s0_pensa' },
    ],
  },
  ruggeri_s5_sirio: {
    text: 'Sirius... quel nome non dovrebbe essere sulla bocca di un civile. Se sapete questo, allora sapete che non posso aiutarvi oltre. Fate attenzione a dove camminate di notte.',
  },

  valli_s3_segnale: {
    text: 'Quindi avete trovato i nastri. Sì, eravamo noi a trasmettere. Ma non ci aspettavamo una risposta. Quello che è arrivato da lassù... ha mandato in corto circuito l\'intera stazione radar.',
    choices: [
      { text: 'Perché continuate a negare l\'evidenza?', next: 'valli_s3_negazione' },
      { text: 'Enzo è stato preso a causa vostra?', next: 'valli_s3_colpa' },
    ],
  },
  valli_s3_negazione: {
    text: 'Non nego nulla. Ordini superiori. "Procurare il silenzio", questo era il mio compito. Ma Enzo... Enzo non doveva essere lì.',
  },
  valli_s3_colpa: {
    text: 'La colpa è un lusso che non mi permetto, Ispettore. Abbiamo giocato con frequenze che non comprendevamo. Ora il segnale è aperto.',
  },

  don_pietro_s2_falle: {
    text: 'Le cronache del 1861 parlavano della "Mietitura". Gli antichi sapevano che il cielo si apre quando la terra è pronta. Voi la chiamate scienza, io lo chiamo il Giorno del Giudizio.',
    choices: [
      { text: 'Come si ferma questo ciclo?', next: 'don_pietro_s2_fermare' },
      { text: 'Enzo è ancora vivo?', next: 'don_pietro_s2_enzo' },
    ],
  },
  don_pietro_s2_fermare: {
    text: 'Non si ferma il mare con le mani, né il cielo con le preghiere di chi non crede. Si può solo testimoniare.',
  },
  don_pietro_s2_enzo: {
    text: 'Egli è nella luce ora. O forse la luce è in lui. Preghiamo per la sua anima, Ispettore.',
  },

  /* ── NUOVI NODI TRUST-GATED ── */

  neri_s3_confessione: {
    text: 'Va bene, Maurizio. Avete vinto. Ero io il consulente scientifico del Progetto Sirius nel \'61. Pensavamo di poter controllare l\'apertura. Ma abbiamo solo attirato la loro attenzione.',
    choices: [
      { text: 'Perché me lo dite solo ora?', next: 'neri_s3_perche' },
      { text: 'Cosa possiamo fare per chiudere la falla?', next: 'neri_s3_falla' },
    ],
  },
  neri_s3_perche: {
    text: 'Perché vedo in voi la stessa curiosità che mi ha rovinato. Non fate i miei stessi errori.',
  },
  neri_s3_falla: {
    text: 'Non si può chiudere. Si può solo aspettare che il ciclo finisca. Ma portate questo con voi, vi aiuterà a capire le frequenze.',
    effect: { giveClue: 'radio_audio' },
  },

  osvaldo_s3_fiducia: {
    text: 'Ispettore, vi siete comportato bene con me. Vi darò una cosa che ho trovato dietro il bancone anni fa. È una chiave con un simbolo che ho visto solo nel Campo delle Luci.',
    effect: { giveClue: 'simboli_portone' },
  },

  gino_s3_testimone: {
    text: 'Quella notte del \'74... ero io di pattuglia per le consegne notturne. Ho visto una sfera scendere sopra la chiesa. Non era un aereo. Si muoveva come... come se il tempo non esistesse.',
  },

  don_pietro_s3_segreto: {
    text: 'Sotto l\'altare c\'è una cripta che risale al 1600. Lì sono conservati i resti di chi "partì" durante la Grande Mietitura. Se volete sapere la verità, dovete guardare nel passato.',
  },

  teresa_s3_ciclo: {
    text: 'I segni sul portone... Enzo li aveva disegnati identici nel suo diario. Egli sapeva che le luci lo avrebbero chiamato. È il ciclo che si ripete, come diceva mio nonno.',
  },
};

if (typeof window !== 'undefined') {
  window.dialogueNodes = dialogueNodes;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = dialogueNodes;
}
