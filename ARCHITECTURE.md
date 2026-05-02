# ARCHITECTURE.md — Le Luci di San Celeste

## Regola Aurea (MANDATORIA)
**AGGIORNAMENTO DOCUMENTAZIONE**: Questo file e `AGENTS.md` devono essere aggiornati dopo OGNI modifica significativa al codice. La coerenza tra documentazione e implementazione è la massima priorità.

## Panoramica

Gioco investigativo 2D ambientato nel 1978. L'architettura è passata da un sistema Canvas 2D puro a un **Sistema Ibrido PixiJS/Canvas**. Il gioco è una Single Page Application (SPA) orchestrata da un `gameState` globale e packaged via Tauri.

## Sistema di Rendering Ibrido (Stacked Canvas)

Il gioco utilizza due motori di rendering simultaneamente per massimizzare performance e compatibilità:

1.  **Mondo di Gioco (PixiJS v8)**: Gestisce il rendering accelerato in WebGL di background, sprite (player/NPC), effetti particellari e filtri post-processing (CRT, Noise).
2.  **Interfaccia Utente (Canvas 2D legacy)**: Un overlay trasparente posizionato sopra PixiJS che gestisce HUD, finestre di dialogo, mini-mappa e indicatori di interazione.

### Stack di Canvas (z-index)

```
┌───────────────────────────────────────────────┐
│ #gameCanvas (Z-Index: 10) - UI / Overlay      │ ◀── Canvas 2D (Trasparente)
├───────────────────────────────────────────────┤
│ #pixi-canvas (Z-Index: 5) - Mondo / WebGL     │ ◀── PixiJS v8
└───────────────────────────────────────────────┘
```

### Orchestrazione (`RenderManager`)

Il `RenderManager` (`src/render/index.ts`) decide quale motore attivare in base alla `gamePhase`:
- **Pixi Attivo**: Pulisce il Canvas 2D ad ogni frame (`clearRect`) rendendolo trasparente, permettendo alla grafica WebGL di brillare attraverso l'interfaccia.
- **Pixi Disattivato**: Fallback automatico al rendering Canvas 2D completo (es. menu iniziali o aree non ancora migrate).

## Story System

Il gioco utilizza un **StoryManager centralizzato** per gestire la narrazione in modo modulare ed espandibile.

### Architettura Story-Driven

```
intro ──▶ investigation ──▶ deepening ──▶ deduction_phase ──▶ finale
```

| File | Scopo |
|------|-------|
| `src/story/storyChapters.mjs` | Capitoli della storia e obiettivi |
| `src/story/storyQuests.mjs` | Quest parallele e ricompense (Trust System) |
| `src/story/storyDialogues.mjs` | Trigger dialoghi NPC per stato |
| `src/story/StoryManager.ts` | Orchestrazione core: flag, quest, capitoli |

## Trust System (Sistema di Fiducia)

Implementato per gestire le relazioni con gli NPC. Le scelte nei dialoghi influenzano il valore `gameState.npcTrust`.
- **Condizioni**: `trustMin`, `trustMax` nelle quest e nei dialoghi.
- **Premi**: `addTrust`, `subTrust`, `setTrust` come ricompense.

## State Machine

```
title ──ENTER──▶ prologue_cutscene ──auto──▶ intro ──ENTER──▶ customize ──ENTER──▶ tutorial ──ENTER──▶ playing ──triggerEnding()──▶ ending
```

## Aree e Connessioni (Mappa Logica)

```
                        ┌──────────────┐
                        │   municipio  │ (ufficio sindaco)
                        └──────┬───────┘
                               │ door_municipio (E)
                               ▼
    ┌──────────┐  door_archivio  ┌──────────┐  door_cascina  ┌──────────┐
    │ archivio │◀──────────────▶│  piazza   │───────────────▶│ cascina  │
    └──────────┘                └────┬─────┘                └────┬─────┘
                                    │ door_bar (E)               │
                                    ▼                            │ door_campo
                              ┌──────────┐                       ▼
                              │bar_interno│                ┌──────────┐
                              └──────────┘                │  campo   │
                                                          └──────────┘
```

## Sistema di Interazione

`handleInteract()` (in `init.mjs`) gestisce:
1.  **Uscite Interattive**: Porte che richiedono il tasto **'E'** (Municipio, Bar).
2.  **NPC**: Avvio dialoghi basati su stato e fiducia.
3.  **Oggetti**: Raccolta indizi e trigger di puzzle (Radio, Registratore).

## Pipeline di Rendering (Dettaglio)

1.  **Pixi Sync**: `pixiRenderer.render()` sincronizza gli sprite con le coordinate del `gameState`.
2.  **Shader**: Applicazione di filtri `Noise` e `ColorMatrix` (Alien Glitch) via WebGL.
3.  **Legacy Draw**: `RenderManager` disegna su `gameCanvas` elementi UI che richiedono precisione vettoriale o che non sono ancora stati migrati a sprite Pixi.
