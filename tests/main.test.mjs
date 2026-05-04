import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from '@jest/globals';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mainPath = path.resolve(__dirname, '../src/main.js');

describe('main.js integration', () => {
  it('should access init functions via window, not as free variables', () => {
    const src = fs.readFileSync(mainPath, 'utf-8');
    // In ES module strict mode, free variables like initEventListeners
    // evaluate to undefined with typeof, so the initialization block
    // silently skips. They must be accessed via window.xxx.
    expect(src).toContain('window.initCanvas');
    expect(src).toContain('window.initAudio');
    expect(src).toContain('window.initEventListeners');
    expect(src).toContain('window.initStoryManager');
    expect(src).toContain('window.resetGame');
    // Ensure the old broken pattern is gone
    expect(src).not.toMatch(/typeof\s+initEventListeners\s*===\s*['"]function['"]/);
    expect(src).not.toMatch(/typeof\s+initAudio\s*===\s*['"]function['"]/);
    expect(src).not.toMatch(/typeof\s+initStoryManager\s*===\s*['"]function['"]/);
  });
});
