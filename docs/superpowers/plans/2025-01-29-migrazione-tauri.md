# Migrazione da Electron a Tauri — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrare il gioco "Le Luci di San Celeste" da Electron a Tauri v2, rimuovendo completamente Electron e le sue dipendenze, e configurando build per Windows e Linux.

**Architecture:** Il frontend (HTML5 Canvas + JS vanilla) rimane invariato. Tauri wrappa il build Vite in un'applicazione desktop. Il backend Rust è il boilerplate standard senza comandi custom.

**Tech Stack:** Tauri v2 (Rust), Vite, Node.js, npm

---

## File Structure Map

| File | Action | Purpose |
|------|--------|---------|
| `package.json` | Modify | Rimuove Electron, aggiunge `@tauri-apps/cli`, aggiorna scripts |
| `vite.config.js` | No change | Già configurato con `base: './'` |
| `src-tauri/Cargo.toml` | Create | Progetto Rust con dipendenze Tauri v2 |
| `src-tauri/build.rs` | Create | Build script per Tauri |
| `src-tauri/src/main.rs` | Create | Entry point Rust (boilerplate) |
| `src-tauri/tauri.conf.json` | Create | Configurazione Tauri v2 (finestra, bundle, build) |
| `src-tauri/icons/*` | Create | Icone generate da `icon.ico` esistente |
| `electron-main.cjs` | Delete | File Electron ormai inutile |

---

### Task 1: Aggiornare package.json

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Modificare package.json**

Rimuovere le dipendenze Electron, `electron-builder`, e gli script relativi. Aggiungere `@tauri-apps/cli`. Aggiornare `build` e `dev`.

```json
{
  "name": "le-luci-di-san-celeste",
  "version": "1.0.0",
  "description": "Le Luci di San Celeste - Un'indagine pixel art",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "tauri": "tauri",
    "lint": "biome check src/",
    "lint:fix": "biome check --write src/",
    "format": "biome format --write src/",
    "check": "biome check --write src/",
    "test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
  },
  "devDependencies": {
    "@biomejs/biome": "2.4.13",
    "@jest/globals": "^30.3.0",
    "@types/jest": "^30.0.0",
    "@types/node": "^25.6.0",
    "jest": "^30.3.0",
    "jest-environment-jsdom": "^30.3.0",
    "ts-jest": "^29.4.9",
    "typescript": "^6.0.3",
    "vite": "^5.0.0",
    "@tauri-apps/cli": "^2.0.0-beta"
  }
}
```

Nota: rimuovere anche la chiave `"build"` (config electron-builder) e la chiave `"main"`.

- [ ] **Step 2: Verificare package.json**

Confermare che non ci siano riferimenti a `electron`, `electron-builder`, `electron-main.cjs`.

- [ ] **Step 3: Commit**

```bash
git add package.json
git commit -m "chore: remove Electron, add Tauri CLI dependencies"
```

---

### Task 2: Creare src-tauri/Cargo.toml

**Files:**
- Create: `src-tauri/Cargo.toml`

- [ ] **Step 1: Scrivere Cargo.toml**

```toml
[package]
name = "le-luci-di-san-celeste"
version = "1.0.0"
description = "Le Luci di San Celeste"
authors = ["Pietro"]
edition = "2021"

[build-dependencies]
tauri-build = { version = "2.0.0-beta", features = [] }

[dependencies]
tauri = { version = "2.0.0-beta", features = [] }

[features]
default = [ "custom-protocol" ]
custom-protocol = [ "tauri/custom-protocol" ]
```

- [ ] **Step 2: Commit**

```bash
git add src-tauri/Cargo.toml
git commit -m "chore: add Tauri Cargo.toml"
```

---

### Task 3: Creare src-tauri/build.rs

**Files:**
- Create: `src-tauri/build.rs`

- [ ] **Step 1: Scrivere build.rs**

```rust
fn main() {
    tauri_build::build()
}
```

- [ ] **Step 2: Commit**

```bash
git add src-tauri/build.rs
git commit -m "chore: add Tauri build.rs"
```

---

### Task 4: Creare src-tauri/src/main.rs

**Files:**
- Create: `src-tauri/src/main.rs`

- [ ] **Step 1: Creare directory e file**

```rust
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

- [ ] **Step 2: Commit**

```bash
git add src-tauri/src/main.rs
git commit -m "chore: add Tauri main.rs entry point"
```

---

### Task 5: Creare src-tauri/tauri.conf.json

**Files:**
- Create: `src-tauri/tauri.conf.json`

- [ ] **Step 1: Scrivere tauri.conf.json**

```json
{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "Le Luci di San Celeste",
  "version": "1.0.0",
  "identifier": "it.sanceleste.luci",
  "build": {
    "beforeDevCommand": "npm run dev",
    "beforeBuildCommand": "npm run build",
    "frontendDist": "../dist",
    "devUrl": "http://localhost:3000"
  },
  "app": {
    "windows": [
      {
        "title": "Le Luci di San Celeste",
        "width": 900,
        "height": 620,
        "resizable": false,
        "center": true
      }
    ]
  },
  "bundle": {
    "active": true,
    "targets": ["nsis", "msi", "deb", "appimage"],
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ]
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src-tauri/tauri.conf.json
git commit -m "chore: add Tauri configuration"
```

---

### Task 6: Generare icone Tauri

**Files:**
- Create: `src-tauri/icons/*`
- Source: `icon.ico`

- [ ] **Step 1: Installare dipendenze npm**

```bash
npm install
```

Expected: installazione completata senza errori.

- [ ] **Step 2: Generare icone da icon.ico**

```bash
npx tauri icon icon.ico --output src-tauri/icons
```

Expected: output simile a `icons generated successfully` in `src-tauri/icons/`.

- [ ] **Step 3: Verificare icone generate**

Confermare che `src-tauri/icons/icon.ico` esista insieme ai vari PNG.

- [ ] **Step 4: Commit**

```bash
git add src-tauri/icons
git commit -m "chore: add Tauri app icons"
```

---

### Task 7: Rimuovere file Electron residui

**Files:**
- Delete: `electron-main.cjs`

- [ ] **Step 1: Rimuovere electron-main.cjs**

```bash
git rm electron-main.cjs
```

- [ ] **Step 2: Commit**

```bash
git commit -m "chore: remove Electron main process file"
```

---

### Task 8: Verificare ambiente di sviluppo Tauri

**Files:**
- Test: avvio applicazione

- [ ] **Step 1: Verificare installazione Rust**

```bash
rustc --version
cargo --version
```

Expected: versioni stampate (es. `rustc 1.75.0`)

- [ ] **Step 2: Avviare Tauri in modalità sviluppo**

```bash
npx tauri dev
```

Expected: compilazione Rust, apertura finestra 900×620, gioco caricato correttamente, audio funzionante, input WASD funzionante.

- [ ] **Step 3: Chiudere e commit**

```bash
git commit --allow-empty -m "test: verify Tauri dev mode works"
```

---

### Task 9: Build di produzione

**Files:**
- Test: build artifact

- [ ] **Step 1: Eseguire build produzione**

```bash
npx tauri build
```

Expected: build completata. Output in:
- Windows: `src-tauri/target/release/bundle/nsis/*.exe`, `src-tauri/target/release/bundle/msi/*.msi`
- Linux: `src-tauri/target/release/bundle/deb/*.deb`, `src-tauri/target/release/bundle/appimage/*.AppImage`

- [ ] **Step 2: Verificare artifact**

Confermare la presenza degli installer/eseguibili nelle cartelle sopra indicate.

- [ ] **Step 3: Commit finale**

```bash
git commit --allow-empty -m "chore: Tauri production build verified"
```

---

## Self-Review Checklist

- [x] Spec coverage: ogni sezione del design (config Tauri, package.json, build, icone, rimozione Electron) è coperta da un task.
- [x] Placeholder scan: nessun "TBD", "TODO", o step senza codice/comando specifico.
- [x] Type consistency: i nomi file e le configurazioni sono coerenti in tutto il piano.
- [x] File paths: tutti i path sono relativi alla root del progetto e specificati esattamente.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2025-01-29-migrazione-tauri.md`. Two execution options:

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration
**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach?
