/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    STORY ENGINE (ES6+ CLASS)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Core story engine — ora classe che orchestra sotto-moduli specializzati.
 * Mantiene API retrocompatibile al 100%.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { Condition, StoryEvent, Ending, GameStats, SerializedEngine } from '../types.js';
import flagManager from './flagManager.js';
import statsManager from './statsManager.js';

export class StoryEngine {
  triggeredEvents: string[];
  unlockedAchievements: string[];

  constructor() {
    this.triggeredEvents = [];
    this.unlockedAchievements = [];
  }

  init(): void {
    this.triggeredEvents = [];
    this.unlockedAchievements = [];
    flagManager.init();
    statsManager.init();
  }

  reset(): void {
    this.init();
  }

  /* ── FLAG MANAGEMENT ── */

  setFlag(flagName: string, value: any = true): boolean {
    return flagManager.setFlag(flagName, value);
  }

  getFlag(flagName: string): any {
    return flagManager.getFlag(flagName);
  }

  hasFlag(flagName: string): boolean {
    return flagManager.hasFlag(flagName);
  }

  clearFlag(flagName: string): boolean {
    return flagManager.clearFlag(flagName);
  }

  getAllFlags(): Record<string, any> {
    return flagManager.serialize();
  }

  /* ── DIALOGUE SYSTEM ── */

  getDialogueNodeForNPC(npcId: string): string {
    const triggers = (window as any).storyDialogueTriggers;
    const trigger = triggers ? triggers[npcId] : null;
    if (!trigger) return `${npcId}_s0`;
    
    if (trigger.states) {
      for (let i = 0; i < trigger.states.length; i++) {
        if (this.checkCondition(trigger.states[i].condition)) {
          return trigger.states[i].node;
        }
      }
    }
    return trigger.defaultNode || `${npcId}_s0`;
  }

  onDialogueStarted(npcId: string): void {
    statsManager.onTalkedTo(npcId);
  }

  /* ── CONDITION SYSTEM ── */

  checkCondition(condition: Condition | undefined): boolean {
    if (!condition) return true;

    if (condition.chapter) {
      const cm = (window as any).ChapterManager;
      if (cm && cm.getCurrentChapterId() !== condition.chapter) return false;
    }

    if (condition.hasFlag && !this.hasFlag(condition.hasFlag)) return false;
    if (condition.missingFlag && this.hasFlag(condition.missingFlag)) return false;

    const gs = (window as any).gameState;
    if (condition.hasClue && gs) {
      if (gs.cluesFound.indexOf(condition.hasClue) === -1) return false;
    }
    if (condition.missingClue && gs) {
      if (gs.cluesFound.indexOf(condition.missingClue) !== -1) return false;
    }
    if (condition.hasClues && gs) {
      for (let i = 0; i < condition.hasClues.length; i++) {
        if (gs.cluesFound.indexOf(condition.hasClues[i]) === -1) return false;
      }
    }
    if (condition.cluesMin && gs) {
      if (gs.cluesFound.length < condition.cluesMin) return false;
    }
    if (condition.cluesMax && gs) {
      if (gs.cluesFound.length > condition.cluesMax) return false;
    }
    if (condition.cluesFound === 'all' && gs) {
      const totalClues = (window as any).clues ? (window as any).clues.length : 9;
      if (gs.cluesFound.length < totalClues) return false;
    }
    if (typeof condition.cluesFound === 'number' && gs) {
      if (gs.cluesFound.length < condition.cluesFound) return false;
    }

    if (condition.talkedTo && !statsManager.hasTalkedTo(condition.talkedTo)) return false;
    if (condition.talkedToCount) {
      if (statsManager.getTalkedToCount() < condition.talkedToCount) return false;
    }
    if (condition.talkedToAll) {
      for (let j = 0; j < condition.talkedToAll.length; j++) {
        if (!statsManager.hasTalkedTo(condition.talkedToAll[j])) return false;
      }
    }

    const stats = statsManager.stats;
    if (condition.puzzleSolved) {
      const ps = Array.isArray(condition.puzzleSolved) ? condition.puzzleSolved : [condition.puzzleSolved];
      for (const p of ps) {
        if (!stats.puzzlesSolved[p]) return false;
      }
    }
    if (condition.puzzlesSolved) {
      for (let k = 0; k < condition.puzzlesSolved.length; k++) {
        if (!stats.puzzlesSolved[condition.puzzlesSolved[k]]) return false;
      }
    }

    if (condition.visitedArea && !statsManager.hasVisitedArea(condition.visitedArea)) return false;

    // Check Trust Levels
    if (condition.trustMin && gs) {
       for (const npcId in condition.trustMin) {
          if ((gs.npcTrust[npcId] || 0) < condition.trustMin[npcId]) return false;
       }
    }
    if (condition.trustMax && gs) {
       for (const npcId in condition.trustMax) {
          if ((gs.npcTrust[npcId] || 0) > condition.trustMax[npcId]) return false;
       }
    }

    return true;
  }

  /* ── EVENT SYSTEM ── */

  checkEvents(): void {
    const events = (window as any).storyEvents;
    if (!events) return;
    
    for (const eventId in events) {
      const event = events[eventId] as StoryEvent;
      if (event.once && this.triggeredEvents.indexOf(eventId) !== -1) continue;
      if (this.checkCondition(event.trigger)) {
        this.triggeredEvents.push(eventId);
        if (typeof event.action === 'function') event.action();
        console.log('[StoryEngine] Event triggered:', eventId);
      }
    }
  }

  wasEventTriggered(eventId: string): boolean {
    return this.triggeredEvents.indexOf(eventId) !== -1;
  }

  triggerEvent(eventId: string): void {
    if (this.triggeredEvents.indexOf(eventId) === -1) {
      this.triggeredEvents.push(eventId);
    }
    const events = (window as any).storyEvents;
    if (!events) return;
    const event = events[eventId] as StoryEvent;
    if (event && typeof event.action === 'function') event.action();
  }

  /* ── ENDING SYSTEM ── */

  determineEnding(): Ending | null {
    const endings = (window as any).storyEndingConditions;
    if (!endings) {
      return {
        id: 'psychological',
        title: 'Fine Ambigua',
        description: 'La verità rimane nascosta.',
        priority: 0,
        conditions: {}
      };
    }
    const sortedEndings: Ending[] = [];
    for (const endingId in endings) {
      sortedEndings.push(endings[endingId]);
    }
    sortedEndings.sort((a, b) => b.priority - a.priority);
    for (let i = 0; i < sortedEndings.length; i++) {
      if (this.checkCondition(sortedEndings[i].conditions)) {
        return sortedEndings[i];
      }
    }
    return endings.psychological || sortedEndings[0];
  }

  /* ── STATISTICS TRACKING ── */

  onAreaVisited(areaId: string): void {
    statsManager.onAreaVisited(areaId);
  }

  onClueFound(): void {
    statsManager.onClueFound();
  }

  onPuzzleSolved(puzzleId: string): void {
    statsManager.onPuzzleSolved(puzzleId);
    const gs = (window as any).gameState;
    if (gs) {
      if (puzzleId === 'deduction') gs.puzzleSolved = true;
      if (puzzleId === 'radio') gs.radioSolved = true;
    }
  }

  getStats(): GameStats {
    return statsManager.serialize();
  }

  /* ── ACHIEVEMENTS ── */

  unlockAchievement(achievementId: string): boolean {
    if (this.unlockedAchievements.indexOf(achievementId) === -1) {
      this.unlockedAchievements.push(achievementId);
      console.log('[StoryEngine] Achievement unlocked:', achievementId);
      return true;
    }
    return false;
  }

  hasAchievement(achievementId: string): boolean {
    return this.unlockedAchievements.indexOf(achievementId) !== -1;
  }

  getUnlockedAchievements(): string[] {
    return [...this.unlockedAchievements];
  }

  /* ── SERIALIZATION ── */

  serialize(): SerializedEngine {
    return {
      flags: flagManager.serialize(),
      triggeredEvents: [...this.triggeredEvents],
      stats: statsManager.serialize(),
      unlockedAchievements: [...this.unlockedAchievements],
    };
  }

  deserialize(data: SerializedEngine): boolean {
    if (!data) return false;
    flagManager.deserialize(data.flags);
    this.triggeredEvents = data.triggeredEvents || [];
    statsManager.deserialize(data.stats);
    this.unlockedAchievements = data.unlockedAchievements || [];
    return true;
  }
}

// Singleton instance
const storyEngine = new StoryEngine();

// Global export
if (typeof window !== 'undefined') {
  (window as any).StoryEngine = storyEngine;
}

export default storyEngine;
