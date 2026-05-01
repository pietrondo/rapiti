# Le Luci di San Celeste — Guida per Agenti

Gioco investigativo 2D in HTML5 Canvas + JavaScript vanilla, ambientato nell'estate 1978 in un borgo immaginario tra Parma e Piacenza. Packaged con Electron per Windows desktop.

## Regole Fondamentali

1. **Dopo ogni modifica al codice**, aggiornare la documentazione pertinente (AGENTS.md, ARCHITECTURE.md, e/o memorie Serena).
2. **Usare sempre i tool Serena MCP** (`serena_find_symbol`, `serena_search_for_pattern`, `serena_get_symbols_overview`, etc.) per navigare e comprendere il codice prima di modificarlo.
3. Seguire le convenzioni di codice della codebase (vedi sezione "Convenzioni di Codice").

## Comandi

| Comando | Descrizione |
|---------|-------------|
| `npm start` | Avvia il gioco in Electron (finestra 900×620) |
| `npm run build` | Build installer NSIS via electron-builder |
| Apri `index.html` nel browser | Modalità sviluppo rapida |

## Tech Stack

- **Linguaggio**: TypeScript + ES Modules (`.ts`, `.mjs`), nessuna dipendenza runtime
- **Rendering**: Canvas 2D (400×250 logico → 800×500 display, pixel-art crisp)
- **Stile**: `"use strict"` in moduli legacy, classi ES6+ in nuovi moduli; `var` in `.mjs`, `const`/`let` in `.ts`
- **Build**: Vite + electron-builder per Windows (target portable x64)
- **Font**: Press Start 2P + VT323 (Google Fonts)
- **Musica**: `music/UFO Sighting Loop.mp3`, autoplay con fallback

## Modello Mentale

Il gioco è una **macchina a stati** (`gameState.gamePhase`) con queste fasi:

1. **title** — Schermata titolo, attende ENTER
2. **prologue_cutscene** — Cutscene animata della scomparsa di Elena (auto-avanza)
3. **intro** — Slide narrative (4 slide, ENTER per avanzare)
4. **customize** — Personalizzazione detective (nome, colori cappotto/dettaglio)
5. **tutorial** — Istruzioni comandi, attende ENTER
6. **playing** — Gioco principale: movimento, interazione, dialoghi, puzzle
7. **ending** — Finale, attende ENTER per restart

Durante `playing`, fasi sovrapposte: `dialogue`, `journal`, `inventory`, `deduction`, `radio`, `scene`, `recorder`.

**Game loop**: `requestAnimationFrame(gameLoop)` → update (movimento, collisioni, effetti) → render (canvas + sovrapposizioni HTML).

## Convenzioni di Codice

- **Variabili**: solo `var` (mai `let`/`const`), globali per `gameState`, dati e sistemi
- **`"use strict"`**: primo statement in ogni file `src/game/*.js`
- **Naming**: funzioni `camelCase`, dati `camelCase`, costanti `UPPER_SNAKE`
- **Lingua**: codice e nomi in inglese; UI e dialoghi NPC in italiano
- **Commenti**: box art ASCII `/* ═══ ... ═══ */` nei file dati
- **Canvas API**: `fillRect` per pixel art, `fillText` con `"Courier New"` monospace
- **Texture/Sprite**: generatori procedurali (SpriteGenerator, TextureGenerator) come fallback quando i PNG non sono disponibili

## Struttura File

```
src/
  config.js              — PALETTE (12 colori), CANVAS_W/H, PLAYER_SPEED, gameState (tutti i campi)
  data/
    clues.js             — Array clues (9 indizi con id/name/area/desc), areaObjects (oggetti per area), cluesMap
    npcs.js              — npcsData (7 NPC con id/name/colors), dialogueNodes (albero dialoghi), dialogueEffects
    areas.js             — Aree (8) con name/walkableTop/colliders/npcs/draw(), helper PF (engine.js), TextureGenerator
    puzzles.js           — registryData (4 sparizioni con anno/dettaglio)
  game/
    engine.js            — SpriteEngine (caricamento PNG, generazione procedurale), PF (helper disegno: nightSky, mountains, building, lamp, tree, buildingDetailed)
    init.js              — initCanvas(), initEventListeners(), setupColorSwatches(), setupDragDrop(), setupRadio(), setupRegistry()
    audio.js             — initAudio(), startMusic(), toggleMusic(), updateMuteButton()
    customize.js         — openCustomize(), applyCustomization(), renderCustomizePreview() (EarthBound style), _lighten/_darken helpers (EarthBound style), _lighten/_darken helpers
    input.js             — handleKeyDown() (macchina a stati tasti), updatePlayerPosition() (WASD + collider + NPC collision), checkInteractions(), collectClue(), openJournal/Inventory, closePanels
    render.js            — render() (dispatcher per gamePhase), renderTitle/IntroSlide/Tutorial, renderArea (NPC + oggetti + hint), renderPlayer (da sprite sheet), drawSprite (fallback), renderInteractionHint, renderEndingScreen, getOrCreatePlayerSheet() (cache con invalidazione colori), _lighten/_darken
    dialogue.js          — startDialogue() (state-based: npcId_s0/s1/s2), renderDialogueHTML(), selectDialogueChoice(), applyDialogueEffect(), closeDialogue()
    radio.js             — openRadioPuzzle(), setupRadio() (drag knob), updateRadioKnob() (static/interference/clear a 72 MHz)
    registry.js          — openRegistryPuzzle() (shuffle, drag pages to slots), checkRegistry() (ordine 1952→1979)
    scene.js             — openScenePuzzle() (3 select elements), checkScene() (lanterna→impronte→segni), determineEndingV2() (4 finali: military/alien/psychological/secret), showEndingOverlayV2()
    recorder.js          — openRecorderPuzzle() (cavi rosso/blu/verde + bobina + power), playRecorder() (bobina 2 + tutti cavi + power)
    deduction.js         — canOpenDeduction() (3 indizi richiesti), openDeduction() (drag clue to slots), checkDeduction() (posizione=mappa, data=registro, prova=tracce)
    transition.js        — checkAreaExits(), changeArea() (fade 100→0), updateFade()
    endings.js           — determineEnding() (v1: alien/human/ambiguous), showEndingOverlay()
    loop.js              — gameLoop() (update + render + prologo auto-advance), rectCollision(), showToast(), updateHUD(), resetGame(), window.onload (bootstrap + ending trigger)
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
| `campo` | Campo delle Luci | — | Mappa campi, Tracce circolari |
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
3. **Registry** (archivio): Ordina 4 fogli cronologicamente (1952→1969→1974→1979). Sblocca Neri s1 se non già attivo.
4. **Scene** (cascina): Ricostruisci evento con 3 select. Soluzione: Lanterna→Impronte→Segni. Sblocca Teresa s1.
5. **Recorder** (monte_ferro): Collega cavi rosso+blu+verde, seleziona bobina "TEST C — 1979", accendi. Sblocca indizio `registro_monte_ferro`.

## Sistema Ending

`determineEndingV2()` (in scene.js) calcola punteggi:
- **military**: `lettera_censurata` + `radio_audio` + `registro_1861`
- **alien**: `frammento` + `tracce_circolari` + `simboli_portone`
- **psychological**: meno di 2 indizi
- **secret** (vero finale): military ≥ 2 AND alien ≥ 3 AND ≥ 6 indizi totali

Trigger: raccogliere `tracce_circolari` al campo DOPO aver risolto il puzzle deduzione.

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
- **Aggiungere area**: creare entry in `areas` + `areaObjects` + `spriteGenerator.mjs.generateBackground()` + `lightingSystem.setupAreaLights()`
- **Aggiungere indizio**: push in `clues` array, aggiungere `areaObject`, aggiornare `updateNPCStates()` se sblocca dialoghi
- **Modificare ending**: `determineEndingV2()` in `src/game/scene.mjs:92`
- **Modificare gameState**: `src/config.ts:30` (tutti i campi inizializzati qui e in `resetGame()` in `loop.ts:60`)
- **CSS**: `styles.css` — overlay, panel, pulsanti; font in `index.html` head
- **Texture/Sprite procedurali**: `textureGenerator.mjs` per background tile, `spriteGenerator.mjs` per personaggi
- **Effetti visivi**: `effects.mjs` — ParticleSystem, LightingSystem, ScreenShake, Vignette
- **Il game loop**: `requestAnimationFrame` in `loop.ts:38`; tutto il rendering passa da `render()` in `render/index.ts:38`
- **Sprite player**: `generatePlayerSheet(colors)` in `spriteGenerator.mjs` accetta oggetto `colors` con chiavi `body`, `bodyLight`, `bodyDark`, `detail`, `head`, `legs`. La cache in `render.mjs` si invalida automaticamente quando `gameState.playerColors` cambia.
- **Minimappa**: `renderMiniMap()` in `render.mjs`, visibile durante il gameplay e nascondibile con `N` (`gameState.showMiniMap`).
- **Marker uscite**: `renderAreaExitMarkers()` in `render.mjs` evidenzia le soglie reali delle uscite; evitare cartelli posizionati nel cielo.
- **Piazza**: helper dedicati in `areas.mjs` (`drawMunicipioFacade`, `drawPiazzaFountain`, `drawBarFacade`, `drawNoticeBoard`, `drawBench`). Gli oggetti principali sono distribuiti su bacheca/fontana/panchina in `src/data/clues.mjs`.
- **Aree rifatte**: eccetto `piazze`, le scene principali usano helper `draw*Area()` in `areas.mjs` (`drawChurchArea`, `drawCemeteryArea`, `drawGardensArea`, `drawBarExteriorArea`, `drawResidentialArea`, `drawIndustrialArea`, `drawPoliceArea`) per mantenere layout e atmosfera coerenti.
- **Ottimizzazione codice**: `sceneRenderer.mjs` spezzato in helper dedicati (`_drawNightField`, `_drawGroundLight`, `_drawConcentricCircles`, `_drawElena`, `_drawFragment`, `_drawWhiteFlash`, `_drawTitleOnWhite`, `_drawSubtitles`); `input.ts` con collisioni estratte in `_resolveCollisions()`; `proceduralRenderer.mjs` con dispatcher `buildingDetailed` convertito a mappa `_buildingRenderers`.
- **StoryManager refactoring**: `StoryManager.mjs` ridotto da 770 a ~250 righe come facade che delega a `ChapterManager`, `QuestManager`, `FlagManager` (nuovo in `flagManager.mjs`), `StatsManager` (nuovo in `statsManager.mjs`). Logica orchestrativa (condizioni, dialoghi, ending, eventi) rimane in `StoryManager`.

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
