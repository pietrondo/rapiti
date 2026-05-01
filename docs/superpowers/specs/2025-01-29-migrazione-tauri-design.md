# Design: Migrazione da Electron a Tauri

## Data
2025-01-29

## Contesto
Il progetto "Le Luci di San Celeste" è un gioco investigativo 2D in HTML5 Canvas + JavaScript vanilla, attualmente impacchettato con Electron per Windows desktop. La codebase usa ES Modules (`.mjs`, `.ts`) con Vite come bundler frontend.

## Problema Attuale
1. **Bug**: `electron-main.js` usa `require()` (CommonJS), ma `package.json` ha `"type": "module"`. Questo causa `ReferenceError: require is not defined in ES module scope` al runtime Electron.
2. **Obiettivo**: Migrare completamente da Electron a Tauri, rimuovendo tutte le dipendenze Electron.

## Approccio Scelto: Migrazione Diretta (Approccio A)

Non modifichiamo il codice di gioco (frontend). Aggiungiamo Tauri come wrapper, rimuoviamo Electron.

## Architettura Post-Migrazione

```
rapito-dagli-alieni/
├── src/                    # Frontend (invariato)
├── src-tauri/              # Nuovo: progetto Tauri (Rust)
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   ├── src/main.rs
│   ├── icons/
│   └── build.rs
├── index.html              # Entry point frontend (invariato)
├── vite.config.ts          # Config Vite (aggiungere base: './')
├── package.json            # Rimosse dipendenze Electron, aggiunte @tauri-apps/cli
└── ...
```

## Dettagli Tecnici

### 1. Configurazione Tauri (`tauri.conf.json`)
- **beforeBuildCommand**: `npm run build`
- **beforeDevCommand**: `npm run dev`
- **distDir**: `../dist`
- **devPath**: `http://localhost:5173`
- **Window**: width 900, height 620, resizable false, title "Le Luci di San Celeste"
- **Icon**: `icon.ico` (Windows) / `icon.png` (Linux)

### 2. Vite Config
Aggiungere `base: './'` in `vite.config.ts` per garantire che i path relativi funzionino correttamente quando serviti dal webview Tauri in produzione.

### 3. Package.json
- Rimuovere: `electron`, `electron-builder`, script `start`, `build:electron`, `build:portable`
- Aggiungere: `@tauri-apps/cli` come devDependency
- Aggiornare script `build`: `tauri build`, `dev`: `tauri dev`
- Rimuovere chiave `build` (electron-builder config)
- Rimuovere `main` e `type: module` (opzionale, ma consigliato per evitare conflitti con Tauri CLI che usa CommonJS)

### 4. Rust Backend (`src-tauri/src/main.rs`)
Boilerplate standard Tauri. Nessun comando custom necessario.

```rust
fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### 5. Dipendenze da Rimuovere
- `electron`
- `electron-builder`
- `@types/node` (se non usata altrove)

## Piattaforme Target
- **Windows**: `.exe` (NSIS installer) + `.msi`. Possibile anche formato portable tramite configurazione NSIS in `tauri.conf.json`.
- **Linux**: `.AppImage` (portable) + `.deb` (Debian/Ubuntu).

## Rischio: Codebase ES Modules
Attualmente `package.json` ha `"type": "module"`. Il frontend usa ES Modules. Tauri CLI (Node.js) funziona indipendentemente da questo flag. Non dovrebbero esserci conflitti.

## Testing
1. `npm run tauri dev` → finestra si apre, gioco parte, audio funziona, input funziona
2. `npm run tauri build` → build per Windows e Linux completata senza errori
3. Installer/executable generato si avvia correttamente

## Prerequisiti
- **Rust toolchain** installato (`rustup` + `cargo`).
- **Tauri v2**: useremo la versione 2 della CLI e del framework, che ha una struttura di configurazione leggermente diversa dalla v1.

## Note Aggiuntive
- Il codice di gioco in `src/` **non viene modificato**.
- L'eventuale uso di `window.require` o API Node.js nel frontend deve essere verificato e rimosso (non dovrebbe esserci, dato `nodeIntegration: false`).
- La musica (`music/UFO Sighting Loop.mp3`) e gli asset devono essere inclusi nel build Vite (già inclusi in `dist/`).
- Il flag `"type": "module"` in `package.json` può essere mantenuto; non interferisce con Tauri CLI v2.
- I path in `tauri.conf.json` sono relativi alla cartella `src-tauri/`.
