/* ══════════════════════════════════════════════════════════════
   STORY QUESTS — Quest Parallele
   ══════════════════════════════════════════════════════════════ */

const storyQuests = {
  /* ── Quest: Il Mistero di Anselmo ── */
  anselmo_mystery: {
    id: 'anselmo_mystery',
    title: 'Il Mistero di Anselmo',
    description: 'Anselmo ha visto qualcosa nel 1952. Scopri cosa sa.',
    chapter: 'investigation',
    stages: [
      {
        id: 'meet_anselmo',
        description: 'Parla con Anselmo nei Giardini',
        condition: { talkedTo: 'anselmo' },
        reward: { setFlag: 'anselmo_met' },
      },
      {
        id: 'solve_radio',
        description: 'Risolvi il puzzle della Radio per sbloccare i suoi ricordi',
        condition: { puzzleSolved: 'radio' },
        reward: { setFlag: 'anselmo_remembering' },
      },
      {
        id: 'hear_story',
        description: 'Riascolta Anselmo dopo aver risolto la radio',
        condition: { talkedTo: 'anselmo', hasFlag: 'anselmo_remembering' },
        reward: { giveClueHint: 'cronaca_parrocchiale', setFlag: 'anselmo_quest_complete', addTrust: { anselmo: 20 } },
      },
    ],
    onComplete: {
      xp: 50,
      message: 'Hai aiutato Anselmo a ricordare. Ti ha suggerito di cercare tra le cronache parrocchiali.',
    },
  },

  /* ── Quest: I Simboli della Cascina ── */
  cascina_symbols: {
    id: 'cascina_symbols',
    title: 'I Simboli della Cascina',
    description: 'Teresa ha trovato strani simboli. Scopri cosa significano.',
    chapter: 'deepening',
    stages: [
      {
        id: 'talk_teresa_symbols',
        description: 'Parla con Teresa dei simboli',
        condition: { talkedTo: 'teresa', hasClue: 'simboli_portone' },
        reward: { setFlag: 'teresa_symbols_discussed' },
      },
      {
        id: 'find_scene_elements',
        description: 'Trova tutti gli elementi della scena',
        condition: { hasClue: 'scena_segni' },
        reward: { setFlag: 'scene_elements_complete' },
      },
      {
        id: 'solve_scene',
        description: 'Risolvi il puzzle della scena',
        condition: { puzzleSolved: 'scene' },
        reward: { giveClue: 'diario_enzo', setFlag: 'cascina_quest_complete', addTrust: { teresa: 25 } },
      },
    ],
    onComplete: {
      xp: 75,
      message: 'Hai decifrato i simboli. Il diario di Enzo conferma i tuoi sospetti.',
    },
  },

  /* ── Quest: Il Registro degli Archivi ── */
  archive_registry: {
    id: 'archive_registry',
    title: 'Il Registro degli Archivi',
    description: 'Riordina il registro delle sparizioni per scoprire il pattern.',
    chapter: 'investigation',
    stages: [
      {
        id: 'access_registry',
        description: "Accedi al registro nell'Archivio",
        condition: { visitedArea: 'chiesa', talkedTo: 'neri' },
        reward: { setFlag: 'registry_accessed' },
      },
      {
        id: 'solve_registry',
        description: "Ricostruisci l'ordine cronologico",
        condition: { puzzleSolved: 'registry' },
        reward: { giveClue: 'lettera_censurata', setFlag: 'registry_solved', updateNPCState: { neri: 1 }, addTrust: { neri: 15 } },
      },
    ],
    onComplete: {
      xp: 50,
      message: 'Il pattern è chiaro. Neri ti ha consegnato una lettera militare che teneva nascosta.',
    },
  },

  /* ── Quest: Il Registratore di Monte Ferro ── */
  monte_ferro_recorder: {
    id: 'monte_ferro_recorder',
    title: 'Il Registratore di Monte Ferro',
    description: 'Ripara il registratore per ascoltare il messaggio del 1978.',
    chapter: 'deepening',
    stages: [
      {
        id: 'find_recorder',
        description: 'Trova il registratore nella Zona Industriale',
        condition: { visitedArea: 'industriale' },
        reward: { setFlag: 'recorder_found' },
      },
      {
        id: 'solve_recorder',
        description: 'Collega correttamente i cavi',
        condition: { puzzleSolved: 'recorder' },
        reward: { giveClue: 'registro_monte_ferro', setFlag: 'recorder_quest_complete' },
      },
    ],
    onComplete: {
      xp: 100,
      message: 'Hai ascoltato il messaggio. Il Nastro 4 contiene le coordinate finali.',
    },
  },
  /* ── Quest: La Ricetta di Osvaldo ── */
  osvaldo_delivery: {
    id: 'osvaldo_delivery',
    title: 'La Ricetta di Osvaldo',
    description: 'Osvaldo ha bisogno di menta selvatica dai Giardini.',
    chapter: 'investigation',
    stages: [
      {
        id: 'collect_menta',
        description: 'Trova la menta nei Giardini',
        condition: { hasClue: 'menta' },
        reward: { setFlag: 'menta_collected' },
      },
      {
        id: 'deliver_menta',
        description: 'Consegna la menta a Osvaldo',
        condition: { talkedTo: 'osvaldo', hasFlag: 'menta_collected' },
        reward: { giveClueHint: 'radio_audio', setFlag: 'osvaldo_quest_complete', addTrust: { osvaldo: 20 } },
      },
    ],
    onComplete: {
      xp: 40,
      message:
        'Osvaldo è felice. Ti ha svelato che la radio del bar intercetta strane frequenze.',
    },
  },

  /* ── Quest: La Lettera Perduta ── */
  gino_lost_mail: {
    id: 'gino_lost_mail',
    title: 'La Lettera Perduta',
    description: 'Gino ha perso una raccomandata nel Cimitero.',
    chapter: 'investigation',
    stages: [
      {
        id: 'find_letter',
        description: 'Cerca la busta gialla nel Cimitero',
        condition: { hasClue: 'lettera_gino' },
        reward: { setFlag: 'letter_found' },
      },
      {
        id: 'deliver_letter',
        description: 'Riporta la lettera a Gino',
        condition: { talkedTo: 'gino', hasFlag: 'letter_found' },
        reward: { giveClueHint: 'registro_comunale', setFlag: 'gino_quest_complete', addTrust: { gino: 15 } },
      },
    ],
    onComplete: {
      xp: 30,
      message: 'Gino ti ringrazia. Ti ha confidato che al Municipio alcuni registri sono spariti.',
    },
  },
};

if (typeof window !== 'undefined') {
  window.storyQuests = storyQuests;
}
