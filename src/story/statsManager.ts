/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    STATS MANAGER (ES6+ CLASS)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Traccia statistiche di gioco: NPC parlati, aree visitate, indizi, puzzle.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { GameStats } from '../types.js';

export class StatsManager {
  stats: GameStats;

  constructor() {
    this.stats = this._getDefaultStats();
  }

  private _getDefaultStats(): GameStats {
    return {
      talkedTo: {},
      visitedAreas: {},
      cluesFound: 0,
      puzzlesSolved: {},
      totalPlayTime: 0,
    };
  }

  init(): void {
    this.stats = this._getDefaultStats();
  }

  reset(): void {
    this.init();
  }

  onTalkedTo(npcId: string): void {
    this.stats.talkedTo[npcId] = true;
  }

  onAreaVisited(areaId: string): void {
    this.stats.visitedAreas[areaId] = true;
  }

  onClueFound(): void {
    this.stats.cluesFound++;
  }

  onPuzzleSolved(puzzleId: string): void {
    this.stats.puzzlesSolved[puzzleId] = true;
  }

  hasTalkedTo(npcId: string): boolean {
    return !!this.stats.talkedTo[npcId];
  }

  hasVisitedArea(areaId: string): boolean {
    return !!this.stats.visitedAreas[areaId];
  }

  hasSolvedPuzzle(puzzleId: string): boolean {
    return !!this.stats.puzzlesSolved[puzzleId];
  }

  getTalkedToCount(): number {
    return Object.keys(this.stats.talkedTo).length;
  }

  serialize(): GameStats {
    return { ...this.stats };
  }

  deserialize(data: GameStats): boolean {
    this.stats = data || this._getDefaultStats();
    return true;
  }
}

// Singleton instance
const statsManager = new StatsManager();

// Global export for retrocompatibility
if (typeof window !== 'undefined') {
  (window as any).StatsManager = statsManager;
}

export default statsManager;
