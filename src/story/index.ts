/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                         STORY MANAGER (ES6+ CLASS)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Central narrative management system with ES6+ class syntax.
 * Combines: ChapterManager, QuestManager, StoryEngine
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { 
  Chapter, 
  Quest, 
  Condition, 
  Reward, 
  StoryEvent, 
  Ending, 
  SerializedChapters, 
  SerializedQuests, 
  SerializedEngine,
  GameStats
} from '../types.js';

import chapterManager from './chapterManager.js';
import questManager from './questManager.js';
import storyEngine from './storyEngine.js';

class StoryManager {
  /** Submodules */
  chapters = chapterManager;
  quests = questManager;
  engine = storyEngine;

  /** Version info */
  version = '3.5.0-ts';
  buildDate = new Date().toISOString();

  // ═══════════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════════

  init(): void {
    this.chapters.init();
    this.quests.init();
    this.engine.init();

    // Start from first chapter
    this.chapters.startChapter('intro');

    console.log(`[StoryManager] Initialized v${this.version}`);
  }

  reset(): void {
    this.chapters.reset();
    this.quests.reset();
    this.engine.reset();
    this.chapters.startChapter('intro');
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CHAPTER MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  startChapter(chapterId: string): boolean {
    return this.chapters.startChapter(chapterId);
  }

  completeCurrentChapter(): boolean {
    return this.chapters.completeCurrentChapter();
  }

  isChapterCompleted(chapterId: string): boolean {
    return this.chapters.isChapterCompleted(chapterId);
  }

  getCurrentChapter(): Chapter | null {
    return this.chapters.getCurrentChapter();
  }

  getChapterData(): Chapter | null {
    return this.chapters.getChapterData();
  }

  completeObjective(objectiveId: string): boolean {
    return this.chapters.completeObjective(objectiveId);
  }

  isObjectiveCompleted(chapterId: string, objectiveId: string): boolean {
    return this.chapters.isObjectiveCompleted(chapterId, objectiveId);
  }

  getCurrentObjectives(): any[] {
    return this.chapters.getCurrentObjectives();
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // QUEST MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  activateQuestsForChapter(chapterId: string): void {
    this.quests.activateQuestsForChapter(chapterId);
  }

  checkQuestProgress(): void {
    this.quests.checkQuestProgress((condition: Condition) => this.engine.checkCondition(condition));
  }

  completeQuest(questId: string): boolean {
    return this.quests.completeQuest(questId);
  }

  getActiveQuests(): any[] {
    return this.quests.getActiveQuests();
  }

  applyReward(reward: Reward): void {
    this.quests.applyReward(reward);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // FLAG MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  setFlag(flagName: string, value: any = true): void {
    this.engine.setFlag(flagName, value);
    this.checkEvents();
  }

  getFlag(flagName: string): any {
    return this.engine.getFlag(flagName);
  }

  hasFlag(flagName: string): boolean {
    return this.engine.hasFlag(flagName);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // DIALOGUE SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════

  getDialogueNodeForNPC(npcId: string): string {
    return this.engine.getDialogueNodeForNPC(npcId);
  }

  onDialogueStarted(npcId: string): void {
    this.engine.onDialogueStarted(npcId);
    this.checkObjectivesForEvent('talkedTo', npcId);
    this.checkQuestProgress();
    this.checkEvents();
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CONDITION SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════

  checkCondition(condition: Condition): boolean {
    return this.engine.checkCondition(condition);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // EVENT SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════

  checkEvents(): void {
    this.engine.checkEvents();
  }

  triggerEvent(eventId: string): void {
    this.engine.triggerEvent(eventId);
  }

  wasEventTriggered(eventId: string): boolean {
    return this.engine.wasEventTriggered(eventId);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ENDING SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════

  determineEnding(): Ending | null {
    return this.engine.determineEnding();
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // STATISTICS TRACKING
  // ═══════════════════════════════════════════════════════════════════════════════

  onAreaVisited(areaId: string): void {
    this.engine.onAreaVisited(areaId);
    this.checkObjectivesForEvent('visitedArea', areaId);
    this.checkQuestProgress();
    this.checkEvents();
  }

  onClueFound(clueId: string): void {
    this.engine.onClueFound();
    this.checkObjectivesForEvent('cluesFound', clueId);
    this.checkQuestProgress();
    this.checkEvents();
  }

  onPuzzleSolved(puzzleId: string): void {
    this.engine.onPuzzleSolved(puzzleId);
    this.checkQuestProgress();
    this.checkEvents();
  }

  getStats(): GameStats {
    return this.engine.getStats();
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // OBJECTIVE CHECKING HELPER
  // ═══════════════════════════════════════════════════════════════════════════════

  checkObjectivesForEvent(eventType: string, target: string): void {
    if (!this.chapters.currentChapter) return;

    const chapters = (window as any).storyChapters;
    const chapter = chapters?.[this.chapters.currentChapter] as Chapter;
    if (!chapter?.objectives) return;

    // Mission logic: Set flags based on clue collection
    if (eventType === 'cluesFound') {
       if (target === 'menta') this.engine.setFlag('menta_collected', true);
       if (target === 'lettera_gino') this.engine.setFlag('lettera_found', true);
    }

    for (const obj of chapter.objectives) {
      if (obj.condition) {
        if (eventType === 'talkedTo' && obj.condition.talkedTo === target) {
          this.completeObjective(obj.id);
        }
        if (eventType === 'visitedArea' && obj.condition.visitedArea === target) {
          this.completeObjective(obj.id);
        }
        if (eventType === 'talkedToCount' && obj.condition.talkedToCount) {
          const count = this.engine.getStats().talkedToCount || 0;
          if (count >= obj.condition.talkedToCount) {
            this.completeObjective(obj.id);
          }
        }
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // SERIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════════

  serialize(): { chapters: SerializedChapters; quests: SerializedQuests; engine: SerializedEngine } {
    return {
      chapters: this.chapters.serialize(),
      quests: this.quests.serialize(),
      engine: this.engine.serialize(),
    };
  }

  deserialize(data: { chapters?: SerializedChapters; quests?: SerializedQuests; engine?: SerializedEngine }): boolean {
    if (!data) return false;

    if (data.chapters) this.chapters.deserialize(data.chapters);
    if (data.quests) this.quests.deserialize(data.quests);
    if (data.engine) this.engine.deserialize(data.engine);

    return true;
  }
}

// Singleton instance
const storyManager = new StoryManager();

// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export function initStoryManager(): void {
  storyManager.init();
}

export function resetStoryManager(): void {
  storyManager.reset();
}

// Global exports
if (typeof window !== 'undefined') {
  (window as any).StoryManager = storyManager;
  (window as any).initStoryManager = initStoryManager;
  (window as any).resetStoryManager = resetStoryManager;
}

export { StoryManager, storyManager };
export default storyManager;
