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

import type { Chapter, Quest, Condition, Reward, StoryEvent, Ending, SerializedChapters, SerializedQuests, SerializedEngine } from '../types.js';

class StoryManager {
  /** Chapter management submodule */
  chapters: any;

  /** Quest management submodule */
  quests: any;

  /** Core story engine submodule */
  engine: any;

  /** Version info */
  version: string;
  buildDate: string;

  constructor() {
    this.chapters = typeof ChapterManager !== 'undefined' ? ChapterManager : null;
    this.quests = typeof QuestManager !== 'undefined' ? QuestManager : null;
    this.engine = typeof StoryEngine !== 'undefined' ? StoryEngine : null;

    this.version = '3.0.0-es6';
    this.buildDate = new Date().toISOString();
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Initialize all story subsystems
   */
  init(): void {
    this.chapters?.init();
    this.quests?.init();
    this.engine?.init();

    // Start from first chapter
    this.chapters?.startChapter('intro');

    console.log(`[StoryManager] Initialized v${this.version}`);
  }

  /**
   * Reset all story state
   */
  reset(): void {
    this.chapters?.reset();
    this.quests?.reset();
    this.engine?.reset();

    // Restart from intro
    this.chapters?.startChapter('intro');
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CHAPTER MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  startChapter(chapterId: string): boolean {
    return this.chapters?.startChapter(chapterId) ?? false;
  }

  completeCurrentChapter(): boolean {
    return this.chapters?.completeCurrentChapter() ?? false;
  }

  isChapterCompleted(chapterId: string): boolean {
    return this.chapters?.isChapterCompleted(chapterId) ?? false;
  }

  getCurrentChapter(): unknown {
    return this.chapters?.getCurrentChapter() ?? null;
  }

  getChapterData(): unknown {
    return this.chapters?.getChapterData() ?? null;
  }

  completeObjective(objectiveId: string): boolean {
    return this.chapters?.completeObjective(objectiveId) ?? false;
  }

  isObjectiveCompleted(chapterId: string, objectiveId: string): boolean {
    return this.chapters?.isObjectiveCompleted(chapterId, objectiveId) ?? false;
  }

  getCurrentObjectives(): unknown[] {
    return this.chapters?.getCurrentObjectives() ?? [];
  }

  checkChapterCompletion(): boolean {
    return this.chapters?.checkChapterCompletion() ?? false;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // QUEST MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  activateQuestsForChapter(chapterId: string): void {
    this.quests?.activateQuestsForChapter(chapterId);
  }

  checkQuestProgress(): void {
    if (this.quests && this.engine) {
      this.quests.checkQuestProgress((condition: Condition) => this.engine.checkCondition(condition));
    }
  }

  completeQuest(questId: string): boolean {
    return this.quests?.completeQuest(questId) ?? false;
  }

  getActiveQuests(): unknown[] {
    return this.quests?.getActiveQuests() ?? [];
  }

  applyReward(reward: Reward): void {
    this.quests?.applyReward(reward);
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // FLAG MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  setFlag(flagName: string, value: unknown): void {
    this.engine?.setFlag(flagName, value);
    this.checkEvents();
  }

  getFlag(flagName: string): unknown {
    return this.engine?.getFlag(flagName);
  }

  hasFlag(flagName: string): boolean {
    return this.engine?.hasFlag(flagName) ?? false;
  }

  clearFlag(flagName: string): boolean {
    return this.engine?.clearFlag(flagName) ?? false;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // DIALOGUE SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════

  getDialogueNodeForNPC(npcId: string): string {
    return this.engine?.getDialogueNodeForNPC(npcId) ?? `${npcId}_s0`;
  }

  onDialogueStarted(npcId: string): void {
    this.engine?.onDialogueStarted(npcId);
    this.checkObjectivesForEvent('talkedTo', npcId);
    this.checkQuestProgress();
    this.checkEvents();
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // CONDITION SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════

  checkCondition(condition: Condition): boolean {
    return this.engine?.checkCondition(condition) ?? true;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // EVENT SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════

  checkEvents(): void {
    this.engine?.checkEvents();
  }

  triggerEvent(eventId: string): void {
    this.engine?.triggerEvent(eventId);
  }

  wasEventTriggered(eventId: string): boolean {
    return this.engine?.wasEventTriggered(eventId) ?? false;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ENDING SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════════

  determineEnding(): unknown {
    return this.engine?.determineEnding() ?? null;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // STATISTICS TRACKING
  // ═══════════════════════════════════════════════════════════════════════════════

  onAreaVisited(areaId: string): void {
    this.engine?.onAreaVisited(areaId);
    this.checkObjectivesForEvent('visitedArea', areaId);
    this.checkQuestProgress();
    this.checkEvents();
  }

  onClueFound(clueId: string): void {
    this.engine?.onClueFound(clueId);
    this.checkObjectivesForEvent('cluesFound', clueId);
    this.checkQuestProgress();
    this.checkEvents();
  }

  onPuzzleSolved(puzzleId: string): void {
    this.engine?.onPuzzleSolved(puzzleId);
    this.checkQuestProgress();
    this.checkEvents();
  }

  getStats(): unknown {
    return this.engine?.getStats() ?? {};
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // OBJECTIVE CHECKING HELPER
  // ═══════════════════════════════════════════════════════════════════════════════

  checkObjectivesForEvent(eventType: string, target: string): void {
    if (!this.chapters?.currentChapter) return;

    const chapter = storyChapters?.[this.chapters.currentChapter];
    if (!chapter?.objectives) return;

    for (const obj of chapter.objectives) {
      if (obj.condition) {
        if (eventType === 'talkedTo' && obj.condition.talkedTo === target) {
          this.completeObjective(obj.id);
        }
        if (eventType === 'talkedToCount' && obj.condition.talkedToCount) {
          const count = Object.keys(this.engine?.stats?.talkedTo ?? {}).length;
          if (count >= obj.condition.talkedToCount) {
            this.completeObjective(obj.id);
          }
        }
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // ACHIEVEMENTS
  // ═══════════════════════════════════════════════════════════════════════════════

  unlockAchievement(achievementId: string): boolean {
    return this.engine?.unlockAchievement(achievementId) ?? false;
  }

  hasAchievement(achievementId: string): boolean {
    return this.engine?.hasAchievement(achievementId) ?? false;
  }

  getUnlockedAchievements(): string[] {
    return this.engine?.getUnlockedAchievements() ?? [];
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // SERIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════════

  serialize(): { chapters: SerializedChapters; quests: SerializedQuests; engine: SerializedEngine } {
    return {
      chapters: this.chapters?.serialize() ?? {},
      quests: this.quests?.serialize() ?? {},
      engine: this.engine?.serialize() ?? {},
    };
  }

  deserialize(data: { chapters?: SerializedChapters; quests?: SerializedQuests; engine?: SerializedEngine }): boolean {
    if (!data) return false;

    this.chapters?.deserialize(data.chapters);
    this.quests?.deserialize(data.quests);
    this.engine?.deserialize(data.engine);

    return true;
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // UTILITY
  // ═══════════════════════════════════════════════════════════════════════════════

  /**
   * Get complete story status summary
   */
  getStatus(): Record<string, unknown> {
    return {
      currentChapter: this.chapters?.getCurrentChapterId() ?? null,
      chapterProgress: this.chapters?.getChapterProgress() ?? 0,
      objectives: this.getCurrentObjectives(),
      activeQuests: this.getActiveQuests(),
      completedQuests: this.quests?.getCompletedQuestCount() ?? 0,
      flags: this.engine?.getAllFlags() ?? {},
      stats: this.getStats(),
      achievements: this.getUnlockedAchievements(),
    };
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SINGLETON INSTANCE
// ═══════════════════════════════════════════════════════════════════════════════

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
  window.StoryManager = storyManager;
  window.initStoryManager = initStoryManager;
  window.resetStoryManager = resetStoryManager;
}

export { StoryManager, storyManager };
export default storyManager;
