/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    STORY ENGINE (ES6+ CLASS)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Core story engine — ora classe che orchestra sotto-moduli specializzati.
 * Gestisce la logica narrativa, le condizioni e gli eventi di gioco.
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
          console.log(`[StoryEngine] NPC ${npcId} -> State triggered: ${trigger.states[i].id}`);
          return trigger.states[i].node;
        }
      }
    }
    return trigger.defaultNode || `${npcId}_s0`;
  }

  onDialogueStarted(npcId: string): void {
    statsManager.onTalkedTo(npcId);
  }

  onAreaVisited(areaId: string): void {
    statsManager.onAreaVisited(areaId);
  }

  onClueFound(): void {
    statsManager.onClueFound();
  }

  onPuzzleSolved(puzzleId: string): void {
    statsManager.onPuzzleSolved(puzzleId);
  }

  getStats(): any {
    const stats = statsManager.serialize();
    return {
      ...stats,
      talkedToCount: Object.keys(stats.talkedTo).length,
      visitedAreasCount: Object.keys(stats.visitedAreas).length
    };
  }

  /* ── CONDITION SYSTEM ── */

  checkCondition(condition: Condition | undefined): boolean {
    if (!condition) return true;

    const cm = (window as any).ChapterManager || (window as any).StoryManager?.chapters;
    const currentChapter = cm?.getCurrentChapterId?.() || null;

    // Chapter checks
    if (condition.chapter && currentChapter !== condition.chapter) return false;

    if (condition.chapterAtMost) {
      const chapters = (window as any).storyChapters;
      if (chapters) {
        const maxOrder = chapters[condition.chapterAtMost]?.order ?? 999;
        const currentOrder = (currentChapter && chapters[currentChapter]) ? chapters[currentChapter].order : -1;
        if (currentOrder > maxOrder) return false;
      }
    }

    if (condition.chapterAtLeast) {
      const chapters = (window as any).storyChapters;
      if (chapters) {
        const minOrder = chapters[condition.chapterAtLeast]?.order ?? 0;
        const currentOrder = (currentChapter && chapters[currentChapter]) ? chapters[currentChapter].order : -1;
        if (currentOrder < minOrder) return false;
      }
    }

    if (condition.hasFlag && !this.hasFlag(condition.hasFlag)) return false;
    if (condition.missingFlag && this.hasFlag(condition.missingFlag)) return false;

    const gs = (window as any).gameState;
    if (!gs) return true; // Safe fallback if engine not fully ready

    // Clue checks
    if (condition.hasClue && gs.cluesFound.indexOf(condition.hasClue) === -1) return false;
    if (condition.missingClue && gs.cluesFound.indexOf(condition.missingClue) !== -1) return false;
    if (condition.hasClues) {
      for (const c of condition.hasClues) {
        if (gs.cluesFound.indexOf(c) === -1) return false;
      }
    }
    if (condition.cluesMin && gs.cluesFound.length < condition.cluesMin) return false;
    if (condition.cluesMax && gs.cluesFound.length > condition.cluesMax) return false;
    
    if (condition.cluesFound === 'all') {
      const totalClues = (window as any).clues?.length || 9;
      if (gs.cluesFound.length < totalClues) return false;
    }

    if (typeof condition.cluesFound === 'number') {
      if (gs.cluesFound.length < condition.cluesFound) return false;
    }

    // Stats checks
    if (condition.talkedTo && !statsManager.hasTalkedTo(condition.talkedTo)) return false;
    if (condition.talkedToCount && (statsManager.getTalkedToCount() || 0) < condition.talkedToCount) return false;
    
    if (condition.talkedToAll) {
      for (const t of condition.talkedToAll) {
        if (!statsManager.hasTalkedTo(t)) return false;
      }
    }

    if (condition.visitedArea && !statsManager.hasVisitedArea(condition.visitedArea)) return false;

    // Check Hypotheses
    if (condition.hasHypothesis && gs.confirmedHypotheses.indexOf(condition.hasHypothesis) === -1) return false;
    if (condition.hasHypotheses) {
       for (const h of condition.hasHypotheses) {
          if (gs.confirmedHypotheses.indexOf(h) === -1) return false;
       }
    }

    // Check Trust Levels
    const trustAtLeast = condition.trustAtLeast || condition.trustMin;
    if (trustAtLeast) {
       for (const nid in trustAtLeast) {
          if ((gs.npcTrust[nid] || 0) < trustAtLeast[nid]) return false;
       }
    }
    const trustAtMost = condition.trustAtMost || condition.trustMax;
    if (trustAtMost) {
       for (const nid in trustAtMost) {
          if ((gs.npcTrust[nid] || 0) > trustAtMost[nid]) return false;
       }
    }

    // Puzzle checks
    if (condition.puzzleSolved) {
      const ps = Array.isArray(condition.puzzleSolved) ? condition.puzzleSolved : [condition.puzzleSolved];
      for (const p of ps) {
        if (!statsManager.stats.puzzlesSolved[p]) return false;
      }
    }
    
    if (condition.puzzlesSolved) {
      for (const p of condition.puzzlesSolved) {
        if (!statsManager.stats.puzzlesSolved[p]) return false;
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
        this.triggerEvent(eventId);
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
    const event = events ? events[eventId] as StoryEvent : null;
    if (event && typeof event.action === 'function') {
      event.action();
      console.log('[StoryEngine] Event triggered:', eventId);
    }
  }

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

  /* ── ENDING SYSTEM ── */

  determineEnding(): Ending | null {
    const endings = (window as any).storyEndingConditions;
    if (!endings) return null;
    
    const sortedEndings = Object.values(endings as Record<string, Ending>)
      .sort((a, b) => b.priority - a.priority);
      
    for (const ending of sortedEndings) {
      if (this.checkCondition(ending.conditions)) return ending;
    }
    return null;
  }

  /* ── ASSET REGISTRY (Pattern Service Locator) ── */
  
  private _assetRegistry: Map<string, any> = new Map();

  registerAsset(id: string, asset: any): void {
     this._assetRegistry.set(id, asset);
  }

  getAsset<T>(id: string): T | null {
     return this._assetRegistry.get(id) || null;
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

// Global export for legacy modules
if (typeof window !== 'undefined') {
  (window as any).storyEngine = storyEngine;
  (window as any).StoryEngine = storyEngine;
}

export default storyEngine;
export { storyEngine };
