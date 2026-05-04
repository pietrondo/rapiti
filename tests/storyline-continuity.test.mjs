import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from '@jest/globals';

const root = process.cwd();

const narrativeFiles = [
  'AGENTS.md',
  'ARCHITECTURE.md',
  'docs/storyline.md',
  'src/data/puzzles.mjs',
  'src/data/clues.mjs',
  'src/data/dialogueNodes.mjs',
  'src/game/registry.mjs',
  'src/game/recorder.mjs',
  'src/game/scene.mjs',
  'src/game/endings.mjs',
  'src/render/prologueRenderer.mjs',
  'src/render/introRenderer.mjs',
  'src/render/pixiRenderer.ts',
  'src/story/storyChapters.mjs',
  'src/story/storyQuests.mjs',
];

function readProjectFile(file) {
  return fs.readFileSync(path.join(root, file), 'utf8');
}

describe('storyline continuity', () => {
  it('uses 1978 as the current investigation year', () => {
    const offenders = narrativeFiles.filter((file) => readProjectFile(file).includes('1979'));
    expect(offenders).toEqual([]);
  });

  it('keeps the registry disappearance order aligned to the canon timeline', () => {
    const registry = readProjectFile('src/game/registry.mjs');
    expect(registry).toContain("var correctOrder = ['1952', '1969', '1974', '1978'];");
  });

  it('documents irregular recurrences instead of a fixed numeric cycle', () => {
    const forbiddenPatterns = [/116 anni/i, /60 anni/i, /vent.?anni/i];
    const offenders = [];

    for (const file of narrativeFiles) {
      const text = readProjectFile(file);
      for (const pattern of forbiddenPatterns) {
        if (pattern.test(text)) offenders.push(`${file}: ${pattern}`);
      }
    }

    expect(offenders).toEqual([]);
  });
});
