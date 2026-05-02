# Le Luci di San Celeste

Un'avventura investigativa ambientata nell'estate del 1978 in un borgo immaginario tra Parma e Piacenza. Il Detective Maurizio indaga su misteriose luci nel cielo e inquietanti sparizioni.

## 🚀 Tecnologie & Engine
Il gioco è stato recentemente migrato da un sistema Canvas 2D a un'architettura moderna e performante:
- **Rendering Engine**: [PixiJS v8](https://pixijs.com/) (WebGL) per grafica accelerata e shader avanzati.
- **Linguaggio**: Migrazione totale a **TypeScript** per un codice robusto e type-safe.
- **Build Tool**: [Vite](https://vitejs.dev/) per uno sviluppo rapido e asset ottimizzati.
- **Desktop App**: [Tauri v2](https://tauri.app/) per la distribuzione come applicazione nativa Windows (.exe).
- **Localizzazione**: Sistema **i18n** integrato per una facile traduzione e gestione dei testi.

## 🎨 Caratteristiche Grafiche (WebGL)
- **VFX Avanzati**: Filtri CRT vintage, distorsioni "Alien Glitch", illuminazione globale e ombre dinamiche.
- **Atmosfera Dinamica**: Ciclo Giorno/Notte completo con luci urbane che si accendono al tramonto.
- **Ambiente Vivo**: Sistema di particelle per nebbia volumetrica, fumo industriale, lucciole e foglie cadenti.
- **Pixel Art Coerente**: Sistema `CharacterArtist` per sprite 16-bit sincronizzati tra personalizzazione e gameplay.
- **Stacked Canvas**: Interfaccia UI 2D nitida posizionata sopra il mondo di gioco WebGL.

## 🎮 Gameplay & Interazione
- **Investigazione**: Raccogli indizi e collegali sulla **Bacheca del Detective** (Corkboard style) per risolvere il caso.
- **Movimento Ibrido**: Supporto completo per **Keyboard (WASD)** e **Mouse/Touch** con pathfinding automatico.
- **Mini-mappa Dinamica**: Traccia la posizione degli NPC e gli obiettivi attivi in tempo reale.
- **Audio Design**: Effetti sonori procedurali (passi su diverse superfici, feedback indizi) e colonna sonora loopable.

## ⌨️ Comandi
- **WASD / Frecce** — Movimento
- **Mouse Click** — Muovi verso destinazione
- **E** — Interagisci / Parla / Raccogli
- **J** — Diario
- **I** — Inventario
- **T** — Pannello Deduzione (Bacheca)
- **N** — Mostra/Nascondi Mini-mappa
- **M** — Musica ON/OFF
- **ESC** — Chiudi pannelli / Menu

## 📁 Struttura del Progetto
```
src/
  areas/        — Definizione logica e grafica delle location
  data/         — Database indizi, NPC, dialoghi e puzzle
  effects/      — Sistemi particellari, luci e animazioni globali
  engine/       — Moduli di rendering procedurale per edifici e decorazioni
  game/         — Logica core (input, loop, salvataggio, audio)
  i18n/         — Motore di localizzazione e dizionari (it.mjs)
  render/       — Manager PixiJS e renderizzatori specializzati
  story/        — Gestione narrativa (Capitoli, Quest, Flag, Statistiche)
src-tauri/      — Sorgenti per la versione desktop nativa (Rust)
tests/          — Suite di test automatizzati (Jest)
```

## 🛠️ Sviluppo
Per avviare il progetto in locale o generare una build:

```bash
# Installa le dipendenze
npm install

# Avvia in modalità sviluppo
npm run dev

# Esegui i test di regressione
npm test

# Genera build Web
npm run build

# Genera l'eseguibile nativo (Windows)
npm run tauri build
```
