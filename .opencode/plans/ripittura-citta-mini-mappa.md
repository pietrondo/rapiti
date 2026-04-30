# Riprogettare la Cittadina con Mini-Mappa di Navigazione

## Overview
Replace all 8 existing areas with a new town layout featuring 8 fresh areas with directional navigation (no fast-travel). Each area has unique pixel-art visuals, atmospheric details, and clear directional signage.

## Files to Modify

### 1. `src/data/areas.js` — Replace all 8 areas
Replace the entire file with the new areas definition:
- **piazze** (center hub) — Fontana, panchine, lampioni, gatto, mappa_town
- **chiesa** — Vetrate colorate, campanile, banco confessionale, acquasantiera
- **cimitero** — Cipressi, lapidi, mausoleo, nebbia, vialetto
- **giardini** — Prato, fontana piccola, aiola fiori, alberi ornamentali, farfalla
- **bar_exterior** — Insegna luminosa, tavolini, finestre illuminate, strada
- **residenziale** — 3 case con balconi, stendibiancheria, giardini
- **polizia** — Insegna POLIZIA, finestre con sbarre, auto pattuglia con lampeggianti

### 2. `src/data/clues.js` — Update areaObjects references
- Add `mappa_town` object to `piazze` in `areaObjects`
- Remove old area object references (`lanterna_rotta`, `registro_1861`, etc.)
- Add new clues for new areas

### 3. `src/config.js` — Update gameState references
- Update `currentArea` default to `'piazze'`
- Update NPC states to reference new NPC IDs
- Remove old area references

### 4. `src/data/npcs.js` — Update NPC definitions
- Add `don_pietro` NPC for chiesa
- Reassign NPCs to correct areas (anselmo→giardini, neri→polizia, valli→residenziale, ruggeri→piazze, osvaldo→bar_exterior, teresa→chiesa)
- Update dialogue node references

### 5. `src/game/render.js` — Update render dispatcher
- Update `renderArea()` to use new area IDs
- Ensure `areas['piazze']` is the starting area (not `'piazza'`)

### 6. `src/game/transition.js` — Update fade/callback references
- Update `changeArea()` references to use new IDs

### 7. `src/game/effects.js` — Update lighting/particle references
- Update `ParticleSystem` firefly areas to include: `piazze`, `giardini`, `residenziale`
- Update `ParticleSystem` dust areas to include: `chiesa`, `cimitero`, `polizia`

### 8. `src/game/spriteGenerator.js` — Update background references
- Update texture cache references

## Area Layout (Spatial)
```
                [CIMITERO]
                   │
                [CHIESA]
                   │
  [GIARDINI] ── [PIAZZE] ── [BAR]
                   │
             [RESIDENZIALE]
                   │
            [INDUSTRIALE]
                   │
              [POLIZIA]
```

## NPC Placement
| Area | NPCs |
|------|------|
| piazze | ruggeri, gino |
| chiesa | don_pietro |
| cimitero | — |
| giardini | anselmo |
| bar_exterior | osvaldo |
| residenziale | valli |
| industriale | — |
| polizia | neri |

## Key Mechanics
- Each area has 2-4 directional exits (up/down/left/right)
- Player walks to edge to trigger area transition
- `drawExitSign()` labels each exit with destination name
- Vignette effect on all areas
- Particle system + lighting effects per area

## Execution Order
1. Write new `src/data/areas.js` (all 8 areas)
2. Update `src/data/clues.js` — add new areaObjects
3. Update `src/data/npcs.js` — add don_pietro, reassign NPCs
4. Update `src/config.js` — fix currentArea default
5. Update `src/game/effects.js` — new area particle/lighting config
6. Update `src/game/render.js` — ensure renderArea uses new IDs
7. Update `src/game/transition.js` — verify compatibility
8. Test: `npm start` and walk all 8 areas
