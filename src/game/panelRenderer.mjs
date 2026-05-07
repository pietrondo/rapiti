/** Rende l'inventario HTML */
export function renderInventory() {
  var content = document.getElementById('inventory-content');
  if (!content) return;
  content.innerHTML = '';

  var clues = window.gameState.cluesFound;
  if (clues.length === 0) {
    content.innerHTML =
      '<p style="text-align:center;color:#6b7b6b;padding:20px">Nessun oggetto raccolto.</p>';
    return;
  }

  for (var i = 0; i < clues.length; i++) {
    var id = clues[i];
    var name = window.t ? window.t(`clue.${id}.name`) : id;
    var desc = window.t ? window.t(`clue.${id}.desc`) : '';

    var item = document.createElement('div');
    item.className = 'inventory-item';
    item.style.cssText =
      'background:rgba(255,255,255,0.05);margin:8px;padding:10px;border:1px solid #444;border-radius:4px';

    var h3 = document.createElement('h3');
    h3.style.cssText = 'color:#d4a843;margin:0 0 4px 0';
    h3.textContent = name;

    var p = document.createElement('p');
    p.style.cssText = 'font-size:11px;margin:0;color:#aaa';
    p.textContent = desc;

    item.appendChild(h3);
    item.appendChild(p);
    content.appendChild(item);
  }
}

/** Rende il diario HTML */
export function renderJournal() {
  var content = document.getElementById('journal-content');
  if (!content) return;
  content.innerHTML = '';

  // ... Logica per le note del diario (da implementare se presenti)
  content.innerHTML =
    '<p style="text-align:center;color:#6b7b6b;padding:20px">Il diario di Maurizio contiene gli appunti dell\'indagine.</p>';
}

/** Apre il diario */
export function openJournal() {
  renderJournal();
  document.getElementById('journal-overlay').classList.add('active');
}

/** Apre l'inventario */
export function openInventory() {
  renderInventory();
  document.getElementById('inventory-overlay').classList.add('active');
}

/** Rende i livelli di fiducia NPC */
export function renderTrust() {
  var content = document.getElementById('trust-content');
  if (!content) return;
  content.innerHTML = '';

  var trust = window.gameState.npcTrust;
  var npcs = window.npcsData;

  for (var nid in trust) {
    var npc = npcs.find((n) => n.id === nid);
    var name = npc ? npc.name : nid;
    var value = trust[nid];

    var item = document.createElement('div');
    item.className = 'trust-item';
    item.style.cssText =
      'margin:12px;background:rgba(0,0,0,0.2);padding:10px;border-radius:4px;border-left:4px solid ' +
      (value >= 0 ? '#4CAF50' : '#F44336');

    var header = document.createElement('div');
    header.style.display = 'flex';
    header.style.justifyContent = 'space-between';

    var nameSpan = document.createElement('span');
    nameSpan.style.color = '#E8DCC8';
    nameSpan.style.fontWeight = 'bold';
    nameSpan.textContent = name;

    var trustSpan = document.createElement('span');
    trustSpan.style.color = '#D4A843';
    trustSpan.textContent = `Fiducia: ${value}`;

    header.appendChild(nameSpan);
    header.appendChild(trustSpan);

    var barBg = document.createElement('div');
    barBg.style.cssText = 'background:#222;height:4px;margin-top:6px;position:relative';

    var barFill = document.createElement('div');
    barFill.style.background = value >= 0 ? '#4CAF50' : '#F44336';
    barFill.style.height = '100%';
    barFill.style.width = `${Math.min(100, Math.abs(value) * 10)}%`;

    barBg.appendChild(barFill);
    item.appendChild(header);
    item.appendChild(barBg);
    content.appendChild(item);
  }
}

/** Apre il pannello fiducia e achievement */
export function openTrust() {
  renderTrust();
  renderAchievements();
  document.getElementById('trust-overlay').classList.add('active');
}

/** Rende gli achievement sbloccati */
export function renderAchievements() {
  var content = document.getElementById('achievement-content');
  if (!content) return;
  content.innerHTML = '';

  var gs = window.gameState;
  var clues = gs.cluesFound.length;
  var _puzzles = Object.values(gs.puzzlesSolved || {}).filter(Boolean).length;
  var npcTalked = Object.values(gs.npcStates || {}).filter((v) => v > 0).length;

  var achievements = [
    {
      id: 'first_clue',
      name: 'Primo Indizio',
      desc: 'Raccogli il tuo primo indizio',
      done: clues >= 1,
    },
    { id: 'all_clues', name: 'Collezionista', desc: 'Raccogli tutti gli indizi', done: clues >= 9 },
    {
      id: 'deduction',
      name: 'Deduzione',
      desc: 'Completa il pannello delle deduzioni',
      done: !!gs.puzzlesSolved?.deduction,
    },
    { id: 'talk_all', name: 'Diplomatico', desc: 'Parla con tutti gli NPC', done: npcTalked >= 6 },
    {
      id: 'secret',
      name: 'Verità Nascosta',
      desc: 'Scopri il finale segreto',
      done: !!(gs.endingUnlocked === 'secret'),
    },
  ];

  for (var i = 0; i < achievements.length; i++) {
    var a = achievements[i];
    var item = document.createElement('div');
    item.style.cssText =
      'margin:8px;padding:8px;border:1px solid ' +
      (a.done ? '#D4A843' : '#333') +
      ';border-radius:4px;background:' +
      (a.done ? 'rgba(212,168,67,0.08)' : 'rgba(0,0,0,0.2)');
    item.innerHTML =
      '<span style="color:' +
      (a.done ? '#D4A843' : '#555') +
      ';font-weight:bold">' +
      (a.done ? '★ ' : '☆ ') +
      a.name +
      '</span>' +
      '<br><span style="font-size:9px;color:' +
      (a.done ? '#A0A8B0' : '#444') +
      '">' +
      a.desc +
      '</span>';
    content.appendChild(item);
  }
}

/** Chiude pannelli aperti */
export function closePanels() {
  document.getElementById('journal-overlay').classList.remove('active');
  document.getElementById('inventory-overlay').classList.remove('active');
  document.getElementById('save-overlay').classList.remove('active');
  document.getElementById('settings-overlay').classList.remove('active');
  if (document.getElementById('trust-overlay'))
    document.getElementById('trust-overlay').classList.remove('active');

  if (['journal', 'inventory', 'save', 'settings', 'trust'].includes(window.gameState.gamePhase)) {
    window.gameState.gamePhase = 'playing';
  }
}

/** Aggiorna UI del pannello impostazioni */
export function updateSettingsUI() {
  const sm = window.settingsManager;
  if (!sm) return;

  document.getElementById('btn-toggle-fs').textContent = sm.get('fullscreen') ? 'ON' : 'OFF';
  document.getElementById('select-lang').value = sm.get('language');
  document.getElementById('btn-toggle-audio').textContent = sm.get('audioEnabled') ? 'ON' : 'OFF';
  document.getElementById('range-volume').value = sm.get('musicVolume');
  document.getElementById('btn-toggle-map').textContent = sm.get('miniMapEnabled') ? 'ON' : 'OFF';
}

/** Apre il menu impostazioni */
export function openSettings() {
  window.gameState.gamePhase = 'settings';
  updateSettingsUI();
  document.getElementById('settings-overlay').classList.add('active');
}
