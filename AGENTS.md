# Le Luci di San Celeste — Guida per Agenti

Gioco investigativo 2D ambientato nell'estate 1978. Recentemente migrato a un'architettura moderna basata su **PixiJS v8 (WebGL)** per la grafica del mondo e **Canvas 2D** per l'interfaccia utente (UI). Packaged con Tauri per desktop.

## Regole Fondamentali (MANDATORIE)

1. **DOCUMENTAZIONE PRIMA DI TUTTO**: Dopo OGNI singola modifica al codice, aggiornare MANDATORIAMENTE `AGENTS.md` e `ARCHITECTURE.md` per riflettere lo stato attuale. Non rimandare.
2. **PIXIJS V8**: Seguire sempre i pattern moderni di PixiJS v8 (`rect().fill()`, `Texture.from()`, `Asset.load()`). Evitare sintassi v7 o legacy (`beginFill`).
3. **USO TOOL SERENA**: Usare sempre i tool Serena MCP (`serena_find_symbol`, etc.) per navigare la codebase.
4. **TECNOLOGIE IBRIDE**: Comprendere che il rendering è diviso: PixiJS gestisce il mondo di gioco (WebGL), mentre Canvas 2D gestisce l'overlay UI e la mini-mappa.

## Tech Stack

- **Linguaggio**: TypeScript + ES Modules (`.ts`, `.mjs`)
- **Rendering Engine**: **PixiJS v8 (WebGL)** per sprite, background e filtri avanzati.
- **UI Rendering**: **Canvas 2D legacy** (#gameCanvas) posizionato SOPRA PixiJS per HUD, dialoghi e mini-mappa (Stacked Canvas architecture).
- **Shader & VFX**: Filtri CRT, Noise, ColorMatrix e Bloom via WebGL.
- **Build**: Vite + Tauri v2 (Windows/Linux).

## Modello Mentale

Il gioco è una **macchina a stati** (`gameState.gamePhase`) orchestrata dal `RenderManager`:

1. **PixiRenderer** (`pixiRenderer.ts`): Carica texture, sincronizza gli sprite dei personaggi con `gameState`, applica shader e gestisce i layer (bg, mid, fg, ui, weather).
2. **RenderManager** (`render/index.ts`): Decide se usare Pixi o Canvas 2D. Attualmente abilita Pixi per quasi tutte le fasi, pulendo il Canvas 2D per renderlo trasparente e mostrare il mondo WebGL sottostante.
3. **Stacked Layout**: `#pixi-canvas` (Z: 5) sotto, `#gameCanvas` (Z: 10, UI) sopra.

## Convenzioni di Codice

- **Variabili**: solo `var` (mai `let`/`const`), globali per `gameState`, dati e sistemi
- **`"use strict"`**: primo statement in ogni file `src/game/*.js`
- **Naming**: funzioni `camelCase`, dati `camelCase`, costanti `UPPER_SNAKE`
- **Lingua**: codice e nomi in inglese; UI e dialoghi NPC in italiano
- **Commenti**: box art ASCII `/* ═══ ... ═══ */` nei file dati
- **Canvas API**: `fillRect` per pixel art, `fillText` con `"Courier New"` monospace
- **Texture/Sprite**: generatori procedurali (SpriteGenerator, TextureGenerator) come fallback quando i PNG non sono disponibili
- **Variabili globali nei moduli `.mjs`**: tutti i riferimenti a variabili globali (`gameState`, `PALETTE`, `CANVAS_W/H`, `UIRenderer`, `SpriteManager`, `showToast`, `updateHUD`, `areas`, `npcsData`, `areaObjects`, `PF`, `drawVignette`, ecc.) devono usare il prefisso `window.`. I moduli `.mjs` caricati dinamicamente da Vite vengono code-splittati in chunk separati; senza `window.` generano `ReferenceError` a runtime.

## Struttura File

```
src/
  config.js              — PALETTE (12 colori), CANVAS_W/H, PLAYER_SPEED, gameState (tutti i campi)
  data/
    clues.js             — Array clues (9 indizi con id/name/area/desc), areaObjects (oggetti per area), cluesMap
    npcs.js              — npcsData (7 NPC con id/name/colors), dialogueNodes (albero dialoghi), dialogueEffects
    areas.js             — Aree con name/walkableTop/colliders/npcs/draw(), helper PF (engine.js), TextureGenerator
    puzzles.js           — registryData (4 sparizioni con anno/dettaglio)
  engine/
    spriteEngine.mjs     — Caricamento PNG, generazione procedurale sprite
    proceduralRenderer.mjs — Dispatcher rendering aree e edifici procedurali
    buildingRenderers.mjs — Edificio generico (facade), aggrega sotto-moduli
    civicBuildings.mjs   — Chiese, case residenziali, negozi
    industrialBuildings.mjs — Fabbriche, stazioni di polizia
    buildingDecorations.mjs — Fontane, lampioni
    index.ts             — Engine hub: SpriteEngine, ProceduralRenderer, BuildingRenderers
  story/
    storyChapters.mjs    — Capitoli della storia e obiettivi
    storyQuests.mjs      — Quest parallele e ricompense
    storyDialogues.mjs   — Trigger dialoghi NPC per stato
    storyEndings.mjs     — Condizioni per i finali
    storyEvents.mjs      — Eventi speciali one-shot
    storyAchievements.mjs — Obiettivi globali (achievements)
    chapterManager.mjs   — Gestione progressione capitoli
    questManager.mjs     — Gestione progressione quest
    storyEngine.mjs      — Facade che orchestra i sotto-moduli del motore narrativo
    dialogueSystem.mjs   — Determina nodi dialogo NPC per stato
    conditionSystem.mjs  — Valuta condizioni narrative (flag, indizi, capitoli, puzzle)
    eventSystem.mjs      — Eventi speciali one-shot
    endingSystem.mjs     — Determina il finale in base alle prove raccolte
    achievementSystem.mjs — Obiettivi globali
    flagManager.mjs      — Manager flag booleani
    statsManager.mjs     — Manager statistiche di gioco
    StoryManager.mjs     — Facade legacy che delega a ChapterManager, QuestManager, StoryEngine
    index.ts             — StoryManager ES6+ class e singleton
  data/
    clues.mjs            — Array clues, areaObjects, cluesMap
    npcData.mjs          — Dati visivi NPC (nome, colori)
    dialogueNodes.mjs    — Albero dialoghi NPC
    dialogueEffects.mjs  — Effetti applicati dopo scelte di dialogo
    areas.mjs            — Facade: re-export drawCommon.mjs + civicDraw.mjs
    drawCommon.mjs       — Primitive disegno condivise: getAreaTexture, drawLitWindow, drawTileRoof, drawWallTexture, drawVignette
    civicDraw.mjs        — Facciate edifici civili: drawMunicipioFacade, drawChurchFacade, drawBarFacade, drawPiazzaFountain, drawNoticeBoard, drawBench
    puzzles.mjs          — Dati puzzle
  render/
    spriteManager.mjs    — Gestione sprite e cache
    uiRenderer.mjs       — Primitive UI, pannelli, effetti visivi, title landscape, fade
    objectRenderer.mjs   — Icone oggetti interattivi
    mapRenderer.mjs      — Minimappa, indicatori uscite, nomi aree
    sceneRenderer.mjs    — Facade scene (aggrega sotto-moduli)
    prologueRenderer.mjs — Cutscene prologo scomparsa Elena
    introRenderer.mjs    — Titolo, slide intro, tutorial
    endingRenderer.mjs   — Schermata finale
    gameRenderer.mjs     — Facade: re-export areaRenderer + playerRenderer + hintRenderer
    areaRenderer.mjs     — Rendering area: NPCs, oggetti interattivi, exit markers
    playerRenderer.mjs   — Rendering player: sprite sheet, animazione, shadow
    hintRenderer.mjs     — Rendering hint interazione sopra target
    index.ts             — RenderManager ES6+ class e dispatcher
  game/
    engine.js            — SpriteEngine (caricamento PNG, generazione procedurale), PF (helper disegno: nightSky, mountains, building, lamp, tree, buildingDetailed)
    init.js              — initCanvas(), initEventListeners(), setupColorSwatches(), setupDragDrop(), setupRadio(), setupRegistry()
    audio.js             — initAudio(), startMusic(), toggleMusic(), updateMuteButton()
    customize.js         — openCustomize(), applyCustomization(), renderCustomizePreview() (EarthBound style), _lighten/_darken helpers (EarthBound style), _lighten/_darken helpers
    input.ts             — InputManager class: handleKeyDown/KeyUp (macchina a stati tasti), touch controls
    movement.ts          — updatePlayerPosition() (WASD + collider + NPC collision), resolveCollisions()
    render.js            — render() (dispatcher per gamePhase), renderTitle/IntroSlide/Tutorial, renderArea (NPC + oggetti + hint), renderPlayer (da sprite sheet), drawSprite (fallback), renderInteractionHint, renderEndingScreen, getOrCreatePlayerSheet() (cache con invalidazione colori), _lighten/_darken
    dialogue.js          — startDialogue() (state-based: npcId_s0/s1/s2), renderDialogueHTML(), selectDialogueChoice(), applyDialogueEffect(), closeDialogue()
    radio.js             — openRadioPuzzle(), setupRadio() (drag knob), updateRadioKnob() (static/interference/clear a 72 MHz)
    registry.js          — openRegistryPuzzle() (shuffle, drag pages to slots), checkRegistry() (ordine 1952→1969→1974→1978)
    scene.js             — openScenePuzzle() (3 select elements), checkScene() (lanterna→impronte→segni), determineEndingV2() (4 finali: military/alien/psychological/secret), showEndingOverlayV2()
    recorder.js          — openRecorderPuzzle() (cavi rosso/blu/verde + bobina + power), playRecorder() (bobina 2 + tutti cavi + power)
    deduction.js         — canOpenDeduction() (3 indizi richiesti), openDeduction() (drag clue to slots), checkDeduction() (posizione=mappa, data=registro, prova=tracce)
    transition.js        — checkAreaExits(), changeArea() (fade 100→0), updateFade()
    endings.js           — determineEnding() (v1: alien/human/ambiguous), showEndingOverlay()
    loop.ts              — GameLoop class (update + render + prologo auto-advance)
    prologueUpdater.ts   — updatePrologue() auto-advance cutscene scomparsa Elena
    effects.js           — ParticleSystem (fireflies, dust, sparkles), LightingSystem (area lights con flicker), ScreenShake, Vignette
    spriteGenerator.js   — generatePlayerSheet(colors) (32×32, 4 dir × 4 frame, colori dinamici), generateNPCSheet (32×32, 4 dir × 2 frame), generateBackground (8 aree), generateClueIcons
    textureGenerator.js  — generateBrickWall, generateWoodFloor, generateGrassTexture, generateStonePath, cache getOrCreateTexture()
```

**Nota**: Il progetto è in transizione da `.js` a `.mjs`/`.ts`. I moduli principali (`input.ts`, `loop.ts`, `store.ts`, `saveLoad.ts`, `render/index.ts`, `engine/index.ts`) usano classi ES6+ e tipi TypeScript. I moduli dati e rendering procedurali usano `.mjs` con `var` per compatibilità.

## Aree di Gioco

| Area ID | Nome | NPC presenti | Oggetti chiave |
|---------|------|--------------|----------------|
| `piazza` | Piazza del Borgo | Ruggeri, Valli, Gino, Anselmo | Lanterna rotta, porte per bar/archivio/cascina/municipio |
| `archivio` | Archivio Comunale | Neri | Registro 1861, Lettera censurata |
| `cascina` | Cascina dei Bellandi | Teresa, Gino | Simboli portone, Frammento, Diario Enzo, 3 elementi scena |
| `campo` | Campo delle Luci | — | Tracce circolari |
| `bar_interno` | Bar Centrale | Osvaldo | Radio (puzzle frequenza) |
| `municipio` | Ufficio del Sindaco | Ruggeri | — |
| `cascina_interno` | Stanza di Teresa | Teresa | — |
| `monte_ferro` | Stazione Radio Monte Ferro | — | Registratore (puzzle recorder) |

## Sistema di Progressione

Gli NPC hanno stati (0→1→2) che determinano il nodo di dialogo (`npcId_s0`/`s1`/`s2`):

- **Ruggeri** (sindaco): s1 quando trovi `lettera_censurata`, s2 quando puzzleSolved
- **Neri** (archivista): s1 quando trovi `registro_1861`, s2 quando puzzleSolved
- **Teresa**: s1 quando trovi `simboli_portone`, s2 speciale (dialogo corrotto "memoria instabile")
- **Valli** (capitano): s1 quando trovi `frammento`, s2 quando puzzleSolved
- **Anselmo**: s1 quando trovi `radio_audio` (tramite radio puzzle)

## Puzzle System

1. **Deduzione** (T): Drag 3 indizi in 3 slot. Soluzione: Mappa→Posizione, Registro→Data, Tracce→Prova fisica. Sblocca alla raccolta di `registro_1861 + mappa_campi + tracce_circolari`.
2. **Radio** (bar_interno): Trascina manopola a 72 MHz (target radio). Sblocca indizio `radio_audio` e dialogo Anselmo s1.
3. **Registry** (archivio): Ordina 4 fogli cronologicamente (1952→1969→1974→1978). Sblocca Neri s1 se non già attivo.
4. **Scene** (cascina): Ricostruisci evento con 3 select. Soluzione: Lanterna→Impronte→Segni. Sblocca Teresa s1.
5. **Recorder** (monte_ferro): Collega cavi rosso+blu+verde, seleziona bobina "TEST C — 1978", accendi. Sblocca indizio `registro_monte_ferro`.

## Sistema Ending

`determineEndingV2()` (in scene.js) calcola punteggi:
- **military**: `lettera_censurata` + `radio_audio` + `registro_1861`
- **alien**: `frammento` + `tracce_circolari` + `simboli_portone`
- **psychological**: meno di 2 indizi
- **secret** (vero finale): military ≥ 2 AND alien ≥ 3 AND ≥ 6 indizi totali

Trigger: raccogliere `tracce_circolari` al `campo` DOPO aver risolto la puzzle deduzione. Il `campo` è raggiungibile dai `giardini` solo quando lo StoryManager espone il flag `deduction_complete`.

## Effetti Ambientali

Il gioco utilizza un sistema dinamico di effetti visivi:

### ParticleSystem (`effects.js`)
- **Fireflies** (lucciole): piazza, campo, cascina — particelle gialle fluttuanti
- **Dust** (polvere): archivio, cascina_interno, fienile — particelle grigie lente
- **Sparkles** (scintille): raccolte indizi — esplosione dorata

### LightingSystem (`effects.js`)
- Luci dinamiche con flicker per ogni area
- **piazza**: 3 lampioni + 2 finestre
- **cascina**: luce calda finestra + lanterna esterna
- **fienile**: raggio di luce dal tetto
- **municipio**: luce fredda ufficio + lampada verde
- **bar_interno**: luci bancone
- **pozzo**: ripple animato sull'acqua

### Sprite Cache (`render.js`)
- `spriteCache.player` con invalidazione basata su `gameState.playerColors`
- `getOrCreatePlayerSheet()` rigenera sheet quando colori cambiano
- Cache resettata in `resetGame()` (loop.js)

## Note per Modifiche

- **Aggiungere NPC**: modificare `npcsData` + `dialogueNodes` in `src/data/npcs.mjs`, aggiungere a `area.npcs` in `src/data/areas.mjs`, colori default in `spriteGenerator.mjs._getDefaultNPCColors()`
- **Aggiungere area**: creare modulo in `src/areas/`, registrarlo in `src/main.js` e `src/areas/index.mjs`, aggiungere `areaObjects` se contiene oggetti interattivi, aggiornare `spriteGenerator.mjs.generateBackground()`/effetti se serve
- **Aggiungere indizio**: push in `clues` array, aggiungere `areaObject`, aggiornare `updateNPCStates()` se sblocca dialoghi
- **Modificare ending**: `determineEndingV2()` in `src/game/scene.mjs:92`
- **Modificare gameState**: `src/config.ts:30` (tutti i campi inizializzati qui e in `resetGame()` in `loop.ts:60`)
- **CSS**: `styles.css` — overlay, panel, pulsanti; font in `index.html` head
- **Texture/Sprite procedurali**: `textureGenerator.mjs` per background tile, `spriteGenerator.mjs` per personaggi
- **Effetti visivi**: `src/effects/ambient.mjs` — ParticleSystem, LightingSystem, ScreenShake, Vignette (singleton usati dal game loop); `src/effects/particles.mjs` — FireflySystem, DustSystem, SparkleSystem; `src/effects/lighting.mjs` — LightingSystem, TorchSystem, ShadowSystem
- **Il game loop**: `requestAnimationFrame` in `loop.ts:38`; tutto il rendering passa da `render()` in `render/index.ts:38`
- **Sprite player**: `generatePlayerSheet(colors)` in `spriteGenerator.mjs` accetta oggetto `colors` con chiavi `body`, `bodyLight`, `bodyDark`, `detail`, `head`, `legs`. La cache in `render.mjs` si invalida automaticamente quando `gameState.playerColors` cambia.
- **Minimappa**: `renderMiniMap()` in `render.mjs`, visibile durante il gameplay e nascondibile con `N` (`gameState.showMiniMap`).
- **Marker uscite**: `renderAreaExitMarkers()` in `render.mjs` evidenzia le soglie reali delle uscite; evitare cartelli posizionati nel cielo.
- **Campo delle Luci**: `src/areas/campo.mjs` è l'area finale canonica. `tracce_circolari` vive in `areaObjects.campo`; l'uscita dai `giardini` verso `campo` usa `requiresFlag: 'deduction_complete'` e viene filtrata da `transition.ts`.
- **Interazione oggetti**: `handleInteract()` in `src/game/init.mjs` unisce `area.objects` legacy e `window.areaObjects[currentArea]`, rispettando `requires`; oggetti `radio` e `recorder` aprono i rispettivi puzzle invece di essere raccolti come indizi.
- **Piazza**: helper dedicati in `civicDraw.mjs` (`drawMunicipioFacade`, `drawPiazzaFountain`, `drawBarFacade`, `drawNoticeBoard`, `drawBench`). Gli oggetti principali sono distribuiti su bacheca/fontana/panchina in `src/data/clues.mjs`.
- **Aree rifatte**: eccetto `piazze`, le scene principali usano helper `draw*Area()` in `areas.mjs` (`drawChurchArea`, `drawCemeteryArea`, `drawGardensArea`, `drawBarExteriorArea`, `drawResidentialArea`, `drawIndustrialArea`, `drawPoliceArea`) per mantenere layout e atmosfera coerenti.
- **Ottimizzazione codice**: `sceneRenderer.mjs` spezzato in helper dedicati e poi in moduli separati (`prologueRenderer.mjs`, `introRenderer.mjs`, `endingRenderer.mjs`); `uiRenderer.mjs` spezzato in `objectRenderer.mjs` e `mapRenderer.mjs`; `input.ts` con collisioni estratte in `movement.ts`; `proceduralRenderer.mjs` con dispatcher `buildingDetailed` convertito a mappa `_buildingRenderers`; `buildingRenderers.mjs` spezzato in `civicBuildings.mjs`, `industrialBuildings.mjs`, `buildingDecorations.mjs`; `npcs.mjs` spezzato in `npcData.mjs`, `dialogueNodes.mjs`, `dialogueEffects.mjs`; `areas.mjs` spezzato in `drawCommon.mjs` e `civicDraw.mjs`; `gameRenderer.mjs` spezzato in `areaRenderer.mjs`, `playerRenderer.mjs`, `hintRenderer.mjs`; `loop.ts` spezzato con `prologueUpdater.ts`.
- **Test**: `tests/renderer.test.mjs` copre `areaRenderer.mjs`, `playerRenderer.mjs`, `hintRenderer.mjs` con canvas mock (23 test).
- **Icona**: `icon.ico` (256x256, lanterna pixel-art) per build Tauri. Le icone in `src-tauri/icons/` vengono generate da `icon.ico` tramite `npx tauri icon`.
- **StoryManager refactoring**: `StoryManager.mjs` ridotto da 770 a ~250 righe come facade che delega a `ChapterManager`, `QuestManager`, `FlagManager` (nuovo in `flagManager.mjs`), `StatsManager` (nuovo in `statsManager.mjs`). Logica orchestrativa (condizioni, dialoghi, ending, eventi) rimane in `StoryManager`.
- **Inizializzazione in `main.js`**: le funzioni esposte globalmente dai moduli caricati dinamicamente (`initCanvas`, `initAudio`, `initEventListeners`, `initStoryManager`) devono essere accedute tramite `window.xxx`, non come variabili libere. In un modulo ES strict mode `typeof variabileNonDichiarata` restituisce `"undefined"` senza errore, causando il silenzioso skip dell'inizializzazione (bug bd `rapito-dagli-alieni-akg`). Test regressione in `tests/main.test.mjs`.
- **Funzioni globali usate da `input.ts`**: `input.ts` dichiara molte dipendenze con `declare function` senza importarle. Nel bundle Vite diventano variabili libere. Se non esistono su `window`, generano `TypeError` e bloccano l'input (bug bd `rapito-dagli-alieni-akg` — blocco tutorial). Fix: tutte le funzioni chiamate da `input.ts` devono essere esposte su `window` dai rispettivi moduli (`transition.ts`, `dialogue.mjs`, `deduction.mjs`, `radio.mjs`, `scene.mjs`, `recorder.mjs`, `customize.mjs`, `audio.mjs`, `init.mjs`). Le funzioni mancanti (`showToast`, `handleInteract`, `openJournal`, `openInventory`, `closePanels`) hanno stub in `init.mjs`.
- **Transition state bridge**: `src/game/transition.ts` usa `window.gameState`/`window.areas` quando disponibili e ricade sugli import TypeScript solo nei test o in isolamento. Questo evita che i cambi area modifichino una copia diversa dello stato rispetto al renderer durante la transizione `config.mjs` → `config.ts`.
- **PixiRenderer cinematic UI**: `src/render/pixiRenderer.ts` usa PixiJS v8 anche per titolo/prologo. `PIXI.Graphics`, `PIXI.Sprite` e `PIXI.Text` devono restare leaf object: per glow, core, sprite e testi correlati usare sempre un `PIXI.Container` wrapper. Non chiamare `addChild()` su `Graphics` o `Sprite` per evitare crash nelle schermate cinematiche (`_renderParallaxSky`, `_renderPrologue`). Le luci aliene del cielo parallasse sono animate tramite l'array tipizzato `alienLightNodes`, non leggendo direttamente `children` dal display object in cache; se `bg` viene svuotato, cielo, luci e montagne vengono riattaccati esplicitamente al layer.
- **CinematicRenderer** (`src/render/cinematicRenderer.ts`): gestisce tutte le schermate non-gameplay (titolo, intro slide, prologo cutscene, tutorial). `renderParallaxSky()` genera uno skybox condiviso contenente cielo notturno (gradiente `#020408→#1A1C20`), 100 stelle casuali, luna con alone blu/nucleo bianco e raggio di luce, sagoma edificio (`#202735`) con tetto (`#4F3428`), finestre illuminate (`#D4A843`), campo erboso a strisce alternate sul fondo (`#21351F`/`#2B4426`/`#1F2D1A`), luci aliene fluttuanti e montagne con parallasse. `renderPrologue()` ha una scena separata `pro_night_field` (cielo notturno + luna + montagne violette + erba ondulata con palo) per i primi due step, poi skybox cinematografico per gli altri. Include cerchi concentrici dorati (step≥4), frammento metallico grigio (step≥6), flash bianco (step≥7), e schermata finale bianca con titolo e sottotitolo della Prefettura (step 8). I sottotitoli narrativi (9 frasi) sono renderizzati su UI layer con sfondo nero semitrasparente. Elena è disegnata via `SpriteManager.getOrCreateNPCSheet('teresa')`. Tutorial renderizza pannello "TACCUINO OPERATIVO" con 8 controlli e obiettivo.
- **i18n defensive pattern**: tutte le chiamate a `window.t()` devono essere protette con `window.t ? window.t(key, params) : fallback`. Il pattern è già applicato in `deduction.mjs`, `init.mjs` e `areaRenderer.mjs`. `window.t` è definito in `src/i18n/index.mjs:90` come alias della funzione `t()`.
- **Map Editor (dev tool)**: attivabile con F12 durante il gioco. Carica dinamicamente `src/tools/mapEditor/editor.ts`. Overlay a schermo pieno con canvas 400×250, grid, anteprima area, strumenti per aggiungere/spostare collider/exits/NPC/areaObjects. Pannello proprietà editabile. Export JSON validato (file `areas-data.json`). I tipi e il validatore sono in `src/tools/mapEditor/types.ts` e `validator.ts` (36 test in `tests/mapEditor.test.ts`). Nessun impatto sul bundle packaged (dynamic import).
- **Cronologia canonica**: il presente narrativo è estate 1978 (`gameDate`, intro, prologo, registro, recorder e finali). Le date storiche note sono 1861, 1952, 1961, 1969, 1974 e 1978; non descrivere il fenomeno come ciclo matematico fisso. Usare la formula "ricorrenze irregolari" o "aperture" secondo `docs/storyline.md`.

## Sviluppo Locale

Per avviare il gioco in modalità sviluppo con hot-reload (Tauri):
```bash
npm run tauri dev
```

<!-- BEGIN BEADS INTEGRATION v:1 profile:full hash:f65d5d33 -->
## Issue Tracking with bd (beads)

**IMPORTANT**: This project uses **bd (beads)** for ALL issue tracking. Do NOT use markdown TODOs, task lists, or other tracking methods.

### Why bd?

- Dependency-aware: Track blockers and relationships between issues
- Git-friendly: Dolt-powered version control with native sync
- Agent-optimized: JSON output, ready work detection, discovered-from links
- Prevents duplicate tracking systems and confusion

### Quick Start

**Check for ready work:**

```bash
bd ready --json
```

**Create new issues:**

```bash
bd create "Issue title" --description="Detailed context" -t bug|feature|task -p 0-4 --json
bd create "Issue title" --description="What this issue is about" -p 1 --deps discovered-from:bd-123 --json
```

**Claim and update:**

```bash
bd update <id> --claim --json
bd update bd-42 --priority 1 --json
```

**Complete work:**

```bash
bd close bd-42 --reason "Completed" --json
```

### Issue Types

- `bug` - Something broken
- `feature` - New functionality
- `task` - Work item (tests, docs, refactoring)
- `epic` - Large feature with subtasks
- `chore` - Maintenance (dependencies, tooling)

### Priorities

- `0` - Critical (security, data loss, broken builds)
- `1` - High (major features, important bugs)
- `2` - Medium (default, nice-to-have)
- `3` - Low (polish, optimization)
- `4` - Backlog (future ideas)

### Workflow for AI Agents

1. **Check ready work**: `bd ready` shows unblocked issues
2. **Claim your task atomically**: `bd update <id> --claim`
3. **Work on it**: Implement, test, document
4. **Discover new work?** Create linked issue:
   - `bd create "Found bug" --description="Details about what was found" -p 1 --deps discovered-from:<parent-id>`
5. **Complete**: `bd close <id> --reason "Done"`

### Quality
- Use `--acceptance` and `--design` fields when creating issues
- Use `--validate` to check description completeness

### Lifecycle
- `bd defer <id>` / `bd supersede <id>` for issue management
- `bd stale` / `bd orphans` / `bd lint` for hygiene
- `bd human <id>` to flag for human decisions
- `bd formula list` / `bd mol pour <name>` for structured workflows

### Auto-Sync

bd automatically syncs via Dolt:

- Each write auto-commits to Dolt history
- Use `bd dolt push`/`bd dolt pull` for remote sync
- No manual export/import needed!

### Important Rules

- ✅ Use bd for ALL task tracking
- ✅ Always use `--json` flag for programmatic use
- ✅ Link discovered work with `discovered-from` dependencies
- ✅ Check `bd ready` before asking "what should I work on?"
- ❌ Do NOT create markdown TODO lists
- ❌ Do NOT use external issue trackers
- ❌ Do NOT duplicate tracking systems

For more details, see README.md and docs/QUICKSTART.md.

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds

<!-- END BEADS INTEGRATION -->
Use 'bd' for task tracking
