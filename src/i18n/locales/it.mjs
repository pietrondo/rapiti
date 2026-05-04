/**
 * DIZIONARIO ITALIANO (it)
 * San Celeste - Un'indagine pixel art (1978)
 */
export default {
  // UI Generica
  'ui.back': 'Indietro',
  'ui.close': 'Chiudi',
  'ui.continue': 'Continua',
  'ui.confirm': 'Conferma',
  'ui.loading': 'Caricamento...',
  'ui.day': 'Giorno',
  'ui.night': 'Notte',
  'ui.journal': '📓 Diario',
  'ui.inventory': '🎒 Inventario',
  'ui.deduction': '🔬 Pannello di Deduzione',
  'ui.radio': '📻 Radio — Sintonizzazione',
  'ui.registry': '📋 Ricostruisci il Registro',
  'ui.save': '💾 Salvataggi',
  'ui.export_json': 'Esporta JSON',
  'ui.import_json': 'Importa JSON',
  'ui.settings': '⚙️ Impostazioni',
  'ui.map': 'Mappa',
  'ui.theory': 'Teoria',
  'ui.mute_toggle': 'Musica ON/OFF',
  'ui.no_connections': 'Nessun collegamento trovato',
  'ui.drag_clue': 'Trascina Indizio',

  // HUD
  'hud.area': 'Area: {area}',
  'hud.clues': 'Indizi: {found}/{total}',
  'hud.clues_short': '{found}/{total}',
  'hud.help': 'WASD Muovi | E Interagisci',

  // Aree
  'area.piazze': 'Piazza del Borgo',
  'area.municipio': 'Municipio',
  'area.chiesa': 'Chiesa di San Celeste',
  'area.bar_exterior': 'Esterno Bar Central',
  'area.bar_interno': 'Bar Central',
  'area.cimitero': 'Cimitero Vecchio',
  'area.giardini': 'Giardini Pubblici',
  'area.residenziale': 'Quartiere Residenziale',
  'area.industriale': 'Zona Industriale',
  'area.campo': 'Campo delle Luci',
  'area.polizia': 'Stazione Carabinieri',

  // NPC Nomi
  'npc.ruggeri': 'Sindaco Ruggeri',
  'npc.teresa': 'Teresa Bellandi',
  'npc.osvaldo': 'Osvaldo il Barista',
  'npc.gino': 'Gino il Postino',
  'npc.don_pietro': 'Don Pietro',
  'npc.neri': 'Archivista Neri',
  'npc.valli': 'Capitano Valli',
  'npc.anselmo': 'Vecchio Anselmo',

  // Quest
  'quest.anselmo_mystery.title': 'Il Mistero di Anselmo',
  'quest.anselmo_mystery.desc': 'Anselmo ha visto qualcosa nel 1952. Scopri cosa sa.',
  'quest.cascina_symbols.title': 'I Simboli della Cascina',
  'quest.cascina_symbols.desc': 'Teresa ha trovato strani simboli. Scopri cosa significano.',
  'quest.archive_registry.title': 'Il Registro degli Archivi',
  'quest.archive_registry.desc': 'Riordina il registro delle sparizioni per scoprire il pattern.',
  'quest.monte_ferro_recorder.title': 'Il Registratore di Monte Ferro',
  'quest.monte_ferro_recorder.desc': 'Ripara il registratore per ascoltare il messaggio del 1978.',
  'quest.osvaldo_delivery.title': 'La Ricetta di Osvaldo',
  'quest.osvaldo_delivery.desc': 'Osvaldo ha bisogno di menta selvatica dai Giardini.',
  'quest.gino_lost_mail.title': 'La Lettera Perduta',
  'quest.gino_lost_mail.desc': 'Gino ha perso una raccomandata nel Cimitero.',
  'clue.registro_1861.name': 'Registro del 1861',
  'clue.registro_1861.desc':
    'Un vecchio registro polveroso. Due persone scomparse nel 1861. Le date coincidono con forti temporali magnetici.',
  'clue.mappa_campi.name': 'Mappa catastale dei campi',
  'clue.mappa_campi.desc':
    'Mappa del 1890. Il Campo delle Luci è segnato come "Podere Sant\'Elmo".',
  'clue.frammento.name': 'Frammento metallico freddo',
  'clue.frammento.desc':
    'Un frammento di metallo argentato, innaturalmente freddo al tatto. La superficie è liscia come vetro.',
  'clue.simboli_portone.name': 'Simboli incisi sul portone',
  'clue.simboli_portone.desc':
    'Simboli comparsi la notte delle luci. Formano un pattern circolare... come una costellazione.',
  'clue.lanterna_rotta.name': 'Lanterna rotta',
  'clue.lanterna_rotta.desc': 'Trovata vicino alla fontana. Apparteneva a Elena?',
  'clue.diario_enzo.name': 'Diario di Enzo Bellandi',
  'clue.diario_enzo.desc':
    'Il diario del nipote di Teresa. "Le luci sono tornate. Sono uguali a quelle del nonno."',
  'clue.tracce_circolari.name': 'Tracce circolari nel terreno',
  'clue.tracce_circolari.desc':
    'Cerchi perfetti nel terreno, erba piegata in senso orario. Il terreno è vetrificato ai bordi.',
  'clue.lettera_censurata.name': 'Lettera militare censurata',
  'clue.lettera_censurata.desc':
    'Ministero della Difesa, 1961. "Operazione Sirio — recupero materiali non terrestri."',
  'clue.radio_audio.name': 'Registrazione radio — voce disturbata',
  'clue.radio_audio.desc':
    'Una voce filtrata dalle interferenze: "...non guardare... quando si ferma...".',
  'clue.registro_monte_ferro.name': 'Nastro registrato — Monte Ferro',
  'clue.registro_monte_ferro.desc':
    '"Test fase tre... interferenza non prevista... risposta non classificabile...".',
  'clue.giornale_1952.name': 'Ritaglio di giornale del 1952',
  'clue.giornale_1952.desc': 'Un articolo ingiallito: "Sparizione misteriosa alla cascina Bellandi. Le autorità brancolano nel buio".',
  'clue.cronaca_parrocchiale.name': 'Cronaca parrocchiale del 1861',
  'clue.cronaca_parrocchiale.desc': '"I Visitatori della Mietitura sono tornati. Il cielo arde di un azzurro innaturale".',
  'clue.verbale_carabinieri.name': 'Verbale Carabinieri 1974',
  'clue.verbale_carabinieri.desc': 'Rapporto di pattuglia: "Avvistate sfere luminose sopra il bosco. Interferenze radio impediscono le comunicazioni".',
  'clue.appunti_enzo_2.name': 'Appunti stropicciati di Enzo',
  'clue.appunti_enzo_2.desc': 'Disegni di costellazioni e una parola ripetuta: "Apertura". Segna una data: 21 Luglio.',
  'clue.registro_comunale.name': 'Registro Comunale Censito',
  'clue.registro_comunale.desc': 'Mancano diverse pagine tra il 1960 e il 1962. Qualcuno ha cercato di nascondere dei dati.',
  'clue.nastro_monte_ferro_2.name': 'Nastro Monte Ferro — Sequenza 4',
  'clue.nastro_monte_ferro_2.desc': '"Coordinate sintonizzate... il segnale risponde... pronti per l\'impulso finale".',

  'clue.menta.name': 'Menta Selvatica',
  'clue.menta.desc': 'Un mazzetto di menta selvatica profumatissima. Cresce solo vicino ai cerchi nel grano dei Giardini.',
  'clue.lettera_gino.name': 'Lettera smarrita di Gino',
  'clue.lettera_gino.desc': 'Una busta gialla con timbro postale. Gino l\'ha persa durante il giro di consegne.',
  'clue.testim_tracce.name': 'Testimonianza sulle tracce',
  'clue.testim_tracce.desc': '"Ho visto le impronte quella notte. Non erano di un uomo. Erano... diverse."',
  'object.gatto_piazze': 'Gatto randagio',

  // Ipotesi
  'hypo.esperimento_militare.name': 'Operazione Radar 1961',
  'hypo.esperimento_militare.desc': 'Le luci del 1961 erano parte di un esperimento radar coperto dal Ministero.',
  'hypo.rapimento_ciclico.name': 'Il Patto del Silenzio',
  'hypo.rapimento_ciclico.desc': 'Le sparizioni seguono ricorrenze irregolari, sempre più ravvicinate. Enzo non è il primo.',
  'hypo.tecnologia_aliena.name': 'Relitto Extraterrestre',
  'hypo.tecnologia_aliena.desc': 'Il metallo e i cerchi nel grano indicano una presenza non umana.',
  'hypo.falle_dimensionali.name': 'Il Ciclo della Mietitura',
  'hypo.falle_dimensionali.desc': 'Le cronache antiche e gli appunti di Enzo coincidono: le luci non "vengono", ma si "aprono" in date precise.',
  'hypo.complotto_comunale.name': 'Infiltrazione Istituzionale',
  'hypo.complotto_comunale.desc': 'Il Comune ha attivamente rimosso dati sulle sparizioni per coprire l\'Operazione Sirius.',
  'hypo.segnale_risposta.name': 'Contatto Radio Attivo',
  'hypo.segnale_risposta.desc': 'I nastri di Monte Ferro confermano che stavano inviando un segnale. La radio del bar ha captato la risposta.',

  // Dialoghi - Ruggeri
  'dialogue.ruggeri_s0.text':
    'Benvenuto a San Celeste, ispettore. Sono il sindaco Ruggeri. La situazione è sotto controllo... solo superstizioni popolari.',
  'dialogue.ruggeri_s0.choice1': 'Mi parli delle luci nel cielo.',
  'dialogue.ruggeri_s0.choice2': 'Ci sono stati altri casi di sparizione?',
  'dialogue.ruggeri_s0.choice3': 'Lei cosa pensa, sindaco?',
  'dialogue.ruggeri_s0_luci.text':
    'Fandonie. Contadini che hanno bevuto troppo vino e scambiato un elicottero per... non so cosa. Non abbiamo tempo per queste sciocchezze.',
  'dialogue.ruggeri_s0_casi.text':
    "Mah... nel 1861, a sentir le storie dei vecchi, due persone sparirono. Ma furono temporali forti quell'anno. Forse annegati nel fiume. Chieda all'archivista Neri, se proprio vuole.",
  'dialogue.ruggeri_s0_pensa.text':
    'Penso che lei stia perdendo tempo, ispettore. La prefettura ha di meglio da fare che inseguire leggende. Ma faccia pure il suo lavoro.',

  // Dialoghi - Teresa
  'dialogue.teresa_s0.text':
    "Sant'Antonio ci protegga! Ha visto anche lei le luci? Erano sopra i campi, silenziose... Mio nipote Enzo è uscito a guardare e non è più tornato!",
  'dialogue.teresa_s0.choice1': 'Cosa ha visto esattamente quella notte?',
  'dialogue.teresa_s0.choice2': "Suo nipote: quand'è successo?",
  'dialogue.teresa_s0.choice3': 'Si calmi, signora. Mi racconti con calma.',
  'dialogue.teresa_s0_visto.text':
    'Sfere di luce, grosse come automobili, fluttuavano sopra il campo a nord. Mio nonno diceva che nel 1861 fu uguale. Le stesse luci. Lo stesso silenzio.',
  'dialogue.teresa_s0_enzo.text':
    'Tre notti fa. Enzo era un ragazzo curioso. Disse: "Nonna, vado a vedere". Non l\'ho più rivisto. La sua stanza è ancora come l\'ha lasciata...',
  'dialogue.teresa_s0_calma.text':
    'Come posso stare calma? Mio nipote è sparito nel nulla! E nessuno mi crede! Dicono che sono pazza, che me lo sono immaginato... Ma io le ho viste, le luci.',

  // Dialoghi - Neri
  'dialogue.neri_s0.text':
    "Un investigatore della prefettura? Finalmente qualcuno di razionale in questo paese di superstiziosi. Io sono Neri, l'archivista. Come posso aiutarla?",
  'dialogue.neri_s0.choice1': 'Cosa sa delle sparizioni del 1861?',
  'dialogue.neri_s0.choice2': 'Ci sono stati documenti militari negli archivi?',
  'dialogue.neri_s0.choice3': 'Lei crede alle luci nel cielo?',

  // Dialoghi - Anselmo
  'dialogue.anselmo_s0.text':
    '*Un vecchio seduto sulla panchina ti guarda con occhi stanchi.* Buonasera. Lei è il forestiero che tutti aspettavano. Io sono Anselmo. Vivo qui da 82 anni. Ho visto cose...',
  'dialogue.anselmo_s0.choice1': 'Che genere di cose, Anselmo?',
  'dialogue.anselmo_s0.choice2': 'Lei sa qualcosa delle luci?',
  'dialogue.anselmo_s0.choice3': 'Piacere, Anselmo. Buonasera.',

  // Toast
  'toast.clue_found': 'Nuovo indizio: {name}',
  'toast.puzzle_solved': 'Puzzle risolto!',
  'toast.minimap_shown': 'Minimappa visibile',
  'toast.minimap_hidden': 'Minimappa nascosta',
  'toast.new_hypothesis': 'Nuova Ipotesi',
  'toast.deduction_complete': 'Tutti i pezzi del puzzle combaciano. La verità è vicina.',
  'toast.hypothesis_exists': 'Hai già formulato questa ipotesi.',
  'toast.no_logic_link': 'Nessun collegamento logico evidente tra questi indizi.',

  // Nuovi Nodi Espansione
  'dialogue.ruggeri_s5_complotto.text': 'Siete arrivato a frugare nei registri comunali? Ispettore, vi consiglio di non scavare troppo a fondo. Certe omissioni sono state fatte per il bene del paese, per evitare il panico.',
  'dialogue.ruggeri_s5_complotto.choice1': 'Il Progetto Sirius non era per il bene del paese.',
  'dialogue.ruggeri_s5_complotto.choice2': 'Cosa state nascondendo esattamente?',
  'dialogue.ruggeri_s5_sirio.text': 'Sirius... quel nome non dovrebbe essere sulla bocca di un civile. Se sapete questo, allora sapete che non posso aiutarvi oltre. Fate attenzione a dove camminate di notte.',
  'dialogue.valli_s3_segnale.text': 'Quindi avete trovato i nastri. Sì, eravamo noi a trasmettere. Ma non ci aspettavamo una risposta. Quello che è arrivato da lassù... ha mandato in corto circuito l\'intera stazione radar.',
  'dialogue.valli_s3_segnale.choice1': 'Perché continuate a negare l\'evidenza?',
  'dialogue.valli_s3_segnale.choice2': 'Enzo è stato preso a causa vostra?',
  'dialogue.valli_s3_negazione.text': 'Non nego nulla. Ordini superiori. "Procurare il silenzio", questo era il mio compito. Ma Enzo... Enzo non doveva essere lì.',
  'dialogue.valli_s3_colpa.text': 'La colpa è un lusso che non mi permetto, Ispettore. Abbiamo giocato con frequenze che non comprendevamo. Ora il segnale è aperto.',
  'dialogue.don_pietro_s2_falle.text': 'Le cronache del 1861 parlavano della "Mietitura". Gli antichi sapevano che il cielo si apre quando la terra è pronta. Voi la chiamate scienza, io lo chiamo il Giorno del Giudizio.',
  'dialogue.don_pietro_s2_falle.choice1': 'Come si ferma questo ciclo?',
  'dialogue.don_pietro_s2_falle.choice2': 'Enzo è ancora vivo?',
  'dialogue.don_pietro_s2_fermare.text': 'Non si ferma il mare con le mani, né il cielo con le preghiere di chi non crede. Si può solo testimoniare.',
  'dialogue.don_pietro_s2_enzo.text': 'Egli è nella luce ora. O forse la luce è in lui. Preghiamo per la sua anima, Ispettore.',
  'dialogue.teresa_s3_ciclo.text': 'I segni sul portone... Enzo li aveva disegnati identici nel suo diario. Egli sapeva che le luci lo avrebbero chiamato. È il ciclo che si ripete, come diceva mio nonno.',

  // Nuovi Nodi Trust-Gated
  'dialogue.neri_s3_confessione.text': 'Va bene, Maurizio. Avete vinto. Ero io il consulente scientifico del Progetto Sirius nel \'61. Pensavamo di poter controllare l\'apertura. Ma abbiamo solo attirato la loro attenzione.',
  'dialogue.neri_s3_confessione.choice1': 'Perché me lo dite solo ora?',
  'dialogue.neri_s3_confessione.choice2': 'Cosa possiamo fare per chiudere la falla?',
  'dialogue.neri_s3_perche.text': 'Perché vedo in voi la stessa curiosità che mi ha rovinato. Non fate i miei stessi errori.',
  'dialogue.neri_s3_falla.text': 'Non si può chiudere. Si può solo aspettare che il ciclo finisca. Ma portate questo con voi, vi aiuterà a capire le frequenze.',
  'dialogue.osvaldo_s3_fiducia.text': 'Ispettore, vi siete comportato bene con me. Vi darò una cosa che ho trovato dietro il bancone anni fa. È una chiave con un simbolo che ho visto solo nel Campo delle Luci.',
  'dialogue.gino_s3_testimone.text': 'Quella notte del \'74... ero io di pattuglia per le consegne notturne. Ho visto una sfera scendere sopra la chiesa. Non era un aereo. Si muoveva come... come se il tempo non esistesse.',
  'dialogue.don_pietro_s3_segreto.text': 'Sotto l\'altare c\'è una cripta che risale al 1600. Lì sono conservati i resti di chi "partì" durante la Grande Mietitura. Se volete sapere la verità, dovete guardare nel passato.',
};
