# ARCHITECTURE.md — Le Luci di San Celeste

## Panoramica

Gioco investigativo 2D single-player a pixel art, vanilla JavaScript su Canvas HTML5 + Electron. Single-page application: un `index.html` carica script JS in ordine di dipendenza e orchestra tutto via `gameState` globale.

## Story System (Nuovo)

Il gioco ora utilizza un **StoryManager centralizzato** per gestire la narrazione in modo modulare ed espandibile.

### Architettura Story-Driven

```
┌─────────────────────────────────────────────────────────────┐
│                    StoryManager (Singleton)                 │
├─────────────────────────────────────────────────────────────┤
│  • Gestione Capitoli    • Quest Parallele                   │
│  • StoryFlags           • Trigger Dialoghi                  │
│  • Eventi Speciali      • Sistema Ending                    │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│ storyData.js  │    │  dialogue.js  │    │   scene.js    │
│ (Dati puri)   │    │ (Usa StoryMgr)│    │ (Ending v2)   │
└───────────────┘    └───────────────┘    └───────────────┘
```

### File del Sistema Story

| File | Scopo |
|------|-------|
| `src/story/storyData.js` | Dati narrativi: capitoli, quest, trigger dialoghi, condizioni ending |
| `src/story/StoryManager.js` | Logica di gestione: progressione, flag, eventi |

### Capitoli della Storia

```
intro ──▶ investigation ──▶ deepening ──▶ deduction_phase ──▶ finale
```

Ogni capitolo ha:
- **Obiettivi** da completare (alcuni richiesti, altri opzionali)
- **Quest parallele** che si attivano automaticamente
- **OnComplete actions**: sblocca prossimo capitolo, setta flag, mostra messaggi

### StoryFlags vs npcStates

Il sistema legacy usava `gameState.npcStates` (0/1/2) hardcoded. Ora:

```javascript
// Vecchio sistema (hardcoded)
gameState.npcStates = { ruggeri: 0, teresa: 0, ... }

// Nuovo sistema (dinamico)
StoryManager.flags = {
  'intro_complete': true,
  'anselmo_remembering': true,
  'teresa_symbols_discussed': false,
  ...
}
```

I flag sono **dinamici** — nuovi episodi possono aggiungerne senza modificare il codice.

### Trigger Dialoghi

In `storyData.js`, ogni NPC ha uno schema di stati:

```javascript
storyDialogueTriggers = {
  'ruggeri': {
    states: [
      { condition: { chapterAtMost: 'intro' }, node: 'ruggeri_s0' },
      { condition: { hasClue: 'lettera_censurata' }, node: 'ruggeri_s1' },
      { condition: { hasFlag: 'deduction_complete' }, node: 'ruggeri_s2' }
    ],
    defaultNode: 'ruggeri_s0'
  }
}
```

Il `dialogue.js` chiama `StoryManager.getDialogueNodeForNPC(npcId)` per determinare quale nodo mostrare.

### Condizioni Supportate

```javascript
// Esempi di condizioni in storyData.js
{ chapter: 'investigation' }           // Capitolo esatto
{ chapterAtLeast: 'deepening' }        // Capitolo o successivo
{ hasFlag: 'intro_complete' }          // Flag attivo
{ hasClue: 'registro_1861' }           // Possiede indizio
{ cluesMin: 3 }                        // Almeno N indizi
{ talkedTo: 'teresa' }                 // Parlato con NPC
{ puzzleSolved: 'radio' }              // Puzzle risolto
{ visitedArea: 'chiesa' }              // Area visitata
```

### Aggiungere un Nuovo Episodio

1. **Aggiungi capitoli** in `storyData.js` → `storyChapters`
2. **Aggiungi quest** in `storyData.js` → `storyQuests`
3. **Aggiungi trigger** in `storyData.js` → `storyDialogueTriggers`
4. **Aggiungi nodi dialogo** in `npcs.js` → `dialogueNodes`
5. **Aggiungi indizi** in `clues.js` → `clues` e `areaObjects`
6. **Aggiungi aree** in `areas.js` → `areas`

Non è necessario modificare `StoryManager.js` — tutta la logica è data-driven!

---

## Panoramica Tecnica Legacy

Gioco investigativo 2D single-player a pixel art, vanilla JavaScript su Canvas HTML5 + Electron.

## State Machine

```
title ──ENTER──▶ prologue_cutscene ──auto──▶ intro ──ENTER──▶ customize ──"Inizia l'Indagine"──▶ intro(slide3) ──ENTER──▶ tutorial ──ENTER──▶ playing ──triggerEnding()──▶ ending ──ENTER──▶ resetGame() → title
```

Sottostati durante `playing` (precedence e `previousPhase` salvati per il ritorno):
```
playing ◀──▶ dialogue (ESC chiude)
playing ◀──▶ journal (ESC/J chiude)
playing ◀──▶ inventory (ESC/I chiude)
playing ◀──▶ deduction (ESC chiude, conferma torna a playing)
playing ◀──▶ radio (ESC chiude)
playing ◀──▶ scene (ESC chiude)
playing ◀──▶ recorder (ESC chiude)
```

## Flusso Dati

```
                    ┌──────────────┐
                    │  gameState   │ (oggetto globale, definito in config.js)
                    │  currentArea │   player{x,y,w,h,dir,frame}
                    │  gamePhase   │   cluesFound[], npcStates{}, npcTrust{}
                    │  keys{}      │   playerName, playerColors, musicEnabled
                    │  puzzleSolved│   radioFrequency, radioTarget, radioSolved
                    │  fadeAlpha   │   message/messageTimer, dialogueNpcId
                    │  endingType  │   screenShake, introSlide, prologueStep
                    └──────┬───────┘
                           │
          ┌────────────────┼──────────────────┐
          ▼                ▼                   ▼
    ┌──────────┐    ┌─────────────┐    ┌──────────────┐
    │ input.js │    │  loop.js    │    │  render.js   │
    │ (keydown │    │ (gameLoop)  │    │ (Canvas)     │
    │  keyup)  │    │ updateFade  │    │ + overlay    │
    └────┬─────┘    │ updateHUD   │    │ HTML         │
         │          └──────┬──────┘    └──────────────┘
         ▼                 ▼
    updatePlayerPosition() ParticleSystem.update()
    checkInteractions()    LightingSystem.update()
    collectClue()          ScreenShake.update()
    startDialogue()
    changeArea()
```

- **Canvas rendering**: `ctx.scale(2,2)` con `imageSmoothingEnabled = false` per pixel-art nitido
- **Overlay HTML**: pannelli (`.overlay` + `.panel` + `classList.add('active')`) gestiscono journal, inventory, deduction, radio, registry, scene, recorder, customize, ending
- **Audio**: `<audio id="bg-music">` in `index.html`, controllato da `audio.js`
- **Art direction condivisa**: `render.js` contiene helper visuali (`drawPixelPanel`, `drawTitleLandscape`, `drawObjectIcon`, `drawPrompt`, `drawFilmGrain`) per mantenere coerenti schermate, marker oggetti e hint; `styles.css` applica cornice CRT, scanline, pannelli e controlli puzzle.

## Aree e Connessioni

```
                        ┌──────────────┐
                        │   municipio  │ (ufficio sindaco)
                        └──────┬───────┘
                               │ door_municipio
                               ▼
    ┌──────────┐  door_archivio  ┌──────────┐  door_cascina  ┌──────────┐
    │ archivio │◀──────────────▶│  piazza   │───────────────▶│ cascina  │
    └──────────┘                └────┬─────┘                └────┬─────┘
                                    │ door_bar                   │
                                    ▼                            │ door_campo
                              ┌──────────┐                       ▼
                              │bar_interno│                ┌──────────┐  door_monte_ferro  ┌─────────────┐
                              └──────────┘                │  campo   │──────────────────▶│ monte_ferro │
                                                          └──────────┘                   └─────────────┘
                                                                  │ door_cascina_int
                                                                  ▼
                                                          ┌────────────────┐
                                                          │cascina_interno │
                                                          └────────────────┘
```

8 aree, ciascuna con:
- `walkableTop` — limite superiore (non si cammina in cielo)
- `colliders[]` — rettangoli di collisione (edifici)
- `npcs[]` — posizioni NPC nell'area
- `draw(ctx)` — funzione di disegno (usa helper `PF` da engine.js e texture procedurali)

## Sistema di Interazione

```
handleInteract()
    │
    ├─ type: 'npc'      → startDialogue(npcId)
    ├─ type: 'object'   → collectClue(obj)
    ├─ type: 'door'     → changeArea(toArea, spawnX, spawnY)
    ├─ type: 'radio'    → openRadioPuzzle()
    ├─ type: 'recorder' → openRecorderPuzzle()
    ├─ type: 'scene'    → collectClue + openScenePuzzle() se 3 elementi scena raccolti
    └─ type: 'gatto'    → showToast('Miao...')
```

**Raggio interazione**: `rectCollision(px-8, py-8, 16, 16, o.x-4, o.y-4, o.w+8, o.h+8)` per oggetti, `abs(px - npc.x) < 20 && abs(py - npc.y) < 20` per NPC.

**Hint interazione**: `renderInteractionHint()` mostra `[E] Parla/Raccogli/Entra...` sopra il giocatore.

## Sistema Dialoghi

Albero dei dialoghi basato su chiavi `npcId_s{state}` in `dialogueNodes` (npcs.js):
- **Stato 0**: dialogo iniziale
- **Stato 1**: dopo che l'indizio trigger è stato trovato
- **Stato 2**: dopo che il puzzle deduzione è risolto (per Teresa: dialogo corrotto `teresa_s2_memory` con `memoryCorrupt: true`)
- Osvaldo e Gino: sempre `_s0`, non cambiano stato

**Scelta dialogo**: `selectDialogueChoice(index)` → applica effetti (`giveClue`, `giveClueHint`, `hint`) → naviga a `ch.next` o chiude.

**Effetti disponibili**: `give_frammento`, `hint_diario_enzo`, `give_lettera`, `hint_mappa`, `hint_archivio`.

## Sistema Ending

Due implementazioni coesistono (scene.js ha la V2 più recente):

**V2** (`determineEndingV2()` in `scene.js:92`):
- Punteggio militare: `lettera_censurata`(2) + `radio_audio`(1) + `registro_1861`(1)
- Punteggio alieno: `frammento`(2) + `tracce_circolari`(2) + `simboli_portone`(1)
- Punteggio psicologico: `8 - cluesFound.length` (meno indizi = più probabile)
- Segreto: military≥2 AND alien≥3 AND clues≥6

**V1** (`determineEnding()` in `endings.js:3`): più semplice, alien/human/ambiguous.

**Trigger**: `collectClue()` è override in `loop.js:104` — se raccogli `tracce_circolari` al campo dopo `puzzleSolved`, chiama `triggerEnding()` dopo 2.5s.

## Sistema Rendering

**Pipeline**:
1. `render(ctx)` → `ctx.save()`, `ctx.scale(2,2)`, `ScreenShake.apply(ctx)`
2. Dispatch per `gamePhase` → funzione render specifica
3. Durante `playing`: `renderArea()` → `renderPlayer()` → `renderInteractionHint()` → `LightingSystem.draw()` → `ParticleSystem.draw()` → `Vignette.draw()`
4. `renderFade()` per transizioni area
5. `ctx.restore()`

**UI canvas e marker**:
- `drawPixelPanel()` disegna pannelli pixel-art usati da titolo, intro e tutorial.
- `drawPrompt()` uniforma i prompt lampeggianti.
- `drawObjectIcon()` sostituisce i marker circolari generici con miniature per mappa, lanterna, registri, lettere, simboli, frammento e tracce.
- `renderMiniMap()` disegna una mini-mappa del borgo durante il gameplay; il tasto `N` la mostra/nasconde tramite `gameState.showMiniMap`.
- `renderAreaExitMarkers()` evidenzia le soglie reali delle uscite con frecce e nome destinazione, separando la navigazione dai cartelli scenografici.
- NPC, player e hint interazione usano ombre più morbide, targhette bordate e glow coerenti con la palette notturna.

**Piazza hub**:
- `areas.js` usa helper dedicati (`drawMunicipioFacade`, `drawPiazzaFountain`, `drawBarFacade`, `drawNoticeBoard`, `drawBench`) per rendere la piazza più leggibile come snodo centrale.
- Gli oggetti `mappa_campi`, `lanterna_rotta` e `gatto_piazze` sono posizionati rispettivamente su bacheca, fontana e panchina.

**Scene area v2**:
- Tutte le aree eccetto `piazze` delegano a helper di scena completi: `drawChurchArea`, `drawCemeteryArea`, `drawGardensArea`, `drawBarExteriorArea`, `drawResidentialArea`, `drawIndustrialArea`, `drawPoliceArea`.
- Gli helper compongono cielo, terreno, percorso principale, edificio/landmark, props ambientali e luci. Le soglie e gli spawn restano dati nelle entry `exits`.

**Sprite rendering**:
- Player: da `SpriteGenerator.generatePlayerSheet()` (canvas 128×128, 4 dir × 4 frame)
- NPC: da `SpriteGenerator.generateNPCSheet()` (canvas 64×128, 4 dir × 2 frame)
- Fallback: `drawSprite()` con `fillRect` diretti
- Cache: `spriteCache = { player: null, npcs: {} }` in `render.js`

**Background rendering**:
- Primario: PNG da `assets/backgrounds/` via `SpriteEngine.loadBG()`
- Fallback: `SpriteGenerator.generateBackground()` procedurale
- Texture: `TextureGenerator.getOrCreateTexture()` per brick, wood, grass, stone

## Effetti Visivi

- **ParticleSystem**: particelle con lifecycle (life, vx, vy, gravity, friction). Tipi: firefly (lucciole gialle pulsanti), dust (polvere interna), sparkle (scintille alla raccolta indizio). Max 200 particelle. Create al cambio area e alla raccolta indizi.
- **LightingSystem**: luci ambiente per area con flicker casuale. Disegnate con `globalCompositeOperation = 'screen'` e gradiente radiale.
- **ScreenShake**: offset casuale decrescente, attivato da `collectClue()` con intensità 2, durata 8 frame.
- **Vignette**: gradiente radiale nero trasparente ai bordi con `globalCompositeOperation = 'multiply'`.
- **CRT shell CSS**: `#game-container::before/::after` aggiungono scanline, vignettatura e lieve separazione cromatica sopra canvas e HUD, senza intercettare input.

## Electron Packaging

`electron-main.js`: finestra 900×620 non ridimensionabile, centrata. Carica `index.html`. `package.json` configura electron-builder per Windows portable (target `portable`, arch `x64`). No code signing (`sign: null`).

## Pattern Architetturali

- **Global state**: `gameState` è l'unica fonte di verità, mutato direttamente da tutti i moduli
- **Data-driven design**: aree, NPC, indizi, dialoghi sono dati dichiarativi; il codice è generico
- **Procedural fallback**: tutti gli asset visivi hanno un generatore procedurale se i PNG non sono caricati
- **Dependency order**: gli `<script>` in `index.html` definiscono l'ordine di caricamento — `config.js` primo, `loop.js` ultimo (bootstrap)
- **No module system**: tutto è globale; `window.onload` in `loop.js` è l'entry point
