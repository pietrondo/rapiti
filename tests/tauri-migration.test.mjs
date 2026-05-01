/**
 * Tests per verificare la migrazione a Tauri e prevenire regressioni
 */

import { beforeEach, describe, expect, it } from '@jest/globals';
import fs from 'fs';
import path from 'path';

const ROOT = process.cwd();

function readFile(relPath) {
  return fs.readFileSync(path.join(ROOT, relPath), 'utf-8');
}

function fileExists(relPath) {
  return fs.existsSync(path.join(ROOT, relPath));
}

describe('Tauri Migration Sanity Checks', () => {
  describe('package.json', () => {
    let pkg;
    beforeEach(() => {
      pkg = JSON.parse(readFile('package.json'));
    });

    it('should NOT contain electron dependency', () => {
      const deps = { ...pkg.dependencies, ...pkg.devDependencies };
      expect(deps).not.toHaveProperty('electron');
      expect(deps).not.toHaveProperty('electron-builder');
    });

    it('should NOT contain electron scripts', () => {
      const scripts = Object.values(pkg.scripts || {});
      expect(scripts.some(s => s.includes('electron'))).toBe(false);
    });

    it('should NOT contain electron-builder config', () => {
      expect(pkg).not.toHaveProperty('build');
    });

    it('should contain @tauri-apps/cli devDependency', () => {
      expect(pkg.devDependencies).toHaveProperty('@tauri-apps/cli');
    });
  });

  describe('Electron artifacts removed', () => {
    it('should NOT have electron-main.cjs', () => {
      expect(fileExists('electron-main.cjs')).toBe(false);
    });

    it('should NOT have electron-main.js', () => {
      expect(fileExists('electron-main.js')).toBe(false);
    });
  });

  describe('Required game modules exist', () => {
    it('should have spriteGenerator.mjs', () => {
      expect(fileExists('src/game/spriteGenerator.mjs')).toBe(true);
    });
  });

  describe('Global exports for dynamic module loading', () => {
    it('init.mjs should expose functions on window', () => {
      var content = readFile('src/game/init.mjs');
      expect(content).toContain('window.initCanvas = initCanvas');
      expect(content).toContain('window.initEventListeners = initEventListeners');
    });

    it('audio.mjs should expose functions on window', () => {
      var content = readFile('src/game/audio.mjs');
      expect(content).toContain('window.initAudio = initAudio');
      expect(content).toContain('window.startMusic = startMusic');
    });

    it('customize.mjs should expose functions on window', () => {
      var content = readFile('src/game/customize.mjs');
      expect(content).toContain('window.applyCustomization = applyCustomization');
      expect(content).toContain('window.renderCustomizePreview = renderCustomizePreview');
    });

    it('main.js should start gameLoop via window.gameLoop.start()', () => {
      var content = readFile('src/main.js');
      expect(content).toContain('window.gameLoop.start()');
      expect(content).toContain('window.renderManager.init(ctx)');
    });
  });

  describe('Tauri configuration', () => {
    let config;
    beforeEach(() => {
      config = JSON.parse(readFile('src-tauri/tauri.conf.json'));
    });

    it('should have valid tauri.conf.json', () => {
      expect(config).toBeDefined();
    });

    it('should have productName', () => {
      expect(config.productName).toBe('Le Luci di San Celeste');
    });

    it('should have identifier', () => {
      expect(config.identifier).toBe('it.sanceleste.luci');
    });

    it('should have windows config', () => {
      expect(Array.isArray(config.app?.windows)).toBe(true);
      expect(config.app.windows.length).toBeGreaterThan(0);
    });

    it('should have bundle targets for Windows and Linux', () => {
      const targets = config.bundle?.targets || [];
      expect(targets).toContain('nsis');
      expect(targets).toContain('msi');
      expect(targets).toContain('deb');
      expect(targets).toContain('appimage');
    });

    it('should have icon paths', () => {
      expect(Array.isArray(config.bundle?.icon)).toBe(true);
      expect(config.bundle.icon.length).toBeGreaterThan(0);
    });
  });

  describe('src/main.js module loading', () => {
    let mainJs;
    beforeEach(() => {
      mainJs = readFile('src/main.js');
    });

    it('should use import.meta.glob for dynamic modules', () => {
      expect(mainJs).toContain('import.meta.glob');
    });

    it('should NOT use absolute src/ paths in loadModule calls', () => {
      expect(mainJs).not.toMatch(/loadModule\('src\//);
    });

    it('should use relative ./ paths in loadModule calls', () => {
      expect(mainJs).toMatch(/loadModule\('\./);
    });
  });

  describe('src/data/areas.mjs imports', () => {
    let areasMjs;
    beforeEach(() => {
      areasMjs = readFile('src/data/areas.mjs');
    });

    it('should NOT import missing ./civicDraw.mjs', () => {
      expect(areasMjs).not.toContain("from './civicDraw.mjs'");
    });

    it('should NOT import missing ./drawCommon.mjs', () => {
      expect(areasMjs).not.toContain("from './drawCommon.mjs'");
    });

    it('should import from ../render/ path', () => {
      expect(areasMjs).toContain("from '../render/civicDraw.mjs'");
      expect(areasMjs).toContain("from '../render/drawCommon.mjs'");
    });
  });

  describe('src/engine/proceduralRenderer.mjs safety', () => {
    let procRenderer;
    beforeEach(() => {
      procRenderer = readFile('src/engine/proceduralRenderer.mjs');
    });

    it('should NOT access BuildingRenderers without typeof check', () => {
      // Must not have bare "BuildingRenderers.drawSomething" without guard
      expect(procRenderer).not.toMatch(/[^\w]BuildingRenderers\.draw\w+/);
    });

    it('should import side-effect modules to init window.BuildingRenderers', () => {
      expect(procRenderer).toContain("import './buildingRenderers.mjs'");
      expect(procRenderer).toContain("import './civicBuildings.mjs'");
    });
  });

  describe('AGENTS.md documentation', () => {
    let agentsMd;
    beforeEach(() => {
      agentsMd = readFile('AGENTS.md');
    });

    it('should mention Tauri in description', () => {
      expect(agentsMd.toLowerCase()).toContain('tauri');
    });

    it('should NOT mention Electron as packaging tool', () => {
      expect(agentsMd.toLowerCase()).not.toContain('electron');
    });

    it('should list tauri dev command', () => {
      expect(agentsMd).toContain('tauri dev');
    });
  });
});
