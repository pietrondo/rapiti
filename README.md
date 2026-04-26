# rapiti

Le Luci di San Celeste — gioco investigativo 2D in HTML5 Canvas.

## Gioco
Avventura investigativa ambientata nell'estate 1978 in un borgo immaginario tra Parma e Piacenza. Il Detective Maurizio indaga su misteriose luci nel cielo e persone scomparse.

## Come giocare
Apri `index.html` nel browser.

## Comandi
- WASD / Frecce — Movimento
- E — Interagisci / Parla / Raccogli
- J — Diario
- I — Inventario
- T — Pannello Teoria (quando disponibile)
- M — Musica ON/OFF
- ESC — Chiudi pannelli

## Sviluppo
Gioco completo in HTML5 Canvas + CSS + JavaScript vanilla. Nessuna dipendenza esterna.

```
src/
  config.js     — Palette, costanti, gameState
  data/
    clues.js    — Indizi e oggetti interattivi
    npcs.js     — Personaggi e dialoghi
    areas.js    — Mappe 2D procedurali
  game/
    init.js     — Inizializzazione canvas/eventi
    audio.js    — Sistema audio/musica
    input.js    — Input tastiera e movimento
    render.js   — Rendering canvas
    dialogue.js — Sistema dialoghi
    ui.js       — Diario, inventario, deduzione, finali
    transition.js — Cambio area
    loop.js     — Game loop e utility
    boot.js     — Avvio
```
