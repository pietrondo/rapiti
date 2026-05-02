/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    CHAPTER MANAGER (ES6+ CLASS)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Manages story chapters, objectives, and chapter progression.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { Chapter, Objective, SerializedChapters } from '../types.js';

export class ChapterManager {
  /** Current chapter ID */
  currentChapter: string | null;

  /** List of completed chapter IDs */
  completedChapters: string[];

  /** Completed objectives by chapter */
  completedObjectives: Record<string, string[]>;

  constructor() {
    this.currentChapter = null;
    this.completedChapters = [];
    this.completedObjectives = {};
  }

  init(): void {
    this.currentChapter = null;
    this.completedChapters = [];
    this.completedObjectives = {};
  }

  reset(): void {
    this.init();
  }

  /**
   * Start a chapter by ID
   * @param {string} chapterId - Chapter identifier
   * @returns {boolean} Success status
   */
  startChapter(chapterId: string): boolean {
    const chapters = (window as any).storyChapters;
    const chapter = chapters ? chapters[chapterId] : null;
    if (!chapter) {
      console.error('[ChapterManager] Chapter not found:', chapterId);
      return false;
    }

    this.currentChapter = chapterId;
    this.completedObjectives[chapterId] = [];

    console.log('[ChapterManager] Chapter started:', chapter.title);

    // Notify via toast if available
    if (typeof (window as any).showToast === 'function') {
      (window as any).showToast(`Capitolo: ${chapter.title}`);
    }

    return true;
  }

  /**
   * Complete current chapter and advance
   * @returns {boolean} Success status
   */
  completeCurrentChapter(): boolean {
    if (!this.currentChapter) return false;

    const chapters = (window as any).storyChapters;
    const chapter = chapters[this.currentChapter] as Chapter;
    this.completedChapters.push(this.currentChapter);

    // Execute completion actions
    if (chapter?.onComplete) {
      const sm = (window as any).StoryManager;
      if (chapter.onComplete.setFlag && sm) {
        sm.setFlag(chapter.onComplete.setFlag);
      }
      if (chapter.onComplete.unlockChapter) {
        this.startChapter(chapter.onComplete.unlockChapter);
      }
      if (chapter.onComplete.message && typeof (window as any).showToast === 'function') {
        (window as any).showToast(chapter.onComplete.message);
      }
    }

    console.log('[ChapterManager] Chapter completed:', this.currentChapter);
    return true;
  }

  isChapterCompleted(chapterId: string): boolean {
    return this.completedChapters.indexOf(chapterId) !== -1;
  }

  getCurrentChapter(): Chapter | null {
    const chapters = (window as any).storyChapters;
    return this.currentChapter && chapters ? chapters[this.currentChapter] : null;
  }

  getChapterData(): Chapter | null {
    return this.getCurrentChapter();
  }

  getCurrentChapterId(): string | null {
    return this.currentChapter;
  }

  isObjectiveCompleted(chapterId: string, objectiveId: string): boolean {
    const completed = this.completedObjectives[chapterId];
    return !!(completed && completed.indexOf(objectiveId) !== -1);
  }

  completeObjective(objectiveId: string): boolean {
    if (!this.currentChapter) return false;

    const chapters = (window as any).storyChapters;
    const chapter = chapters[this.currentChapter] as Chapter;
    if (!chapter?.objectives) return false;

    let objective: Objective | null = null;
    for (let i = 0; i < chapter.objectives.length; i++) {
      if (chapter.objectives[i].id === objectiveId) {
        objective = chapter.objectives[i];
        break;
      }
    }

    if (!objective) return false;

    // Add to completed list
    if (!this.completedObjectives[this.currentChapter]) {
      this.completedObjectives[this.currentChapter] = [];
    }

    if (this.completedObjectives[this.currentChapter].indexOf(objectiveId) === -1) {
      this.completedObjectives[this.currentChapter].push(objectiveId);
      console.log('[ChapterManager] Objective completed:', objective.description);

      // Check chapter completion
      this.checkChapterCompletion();
      return true;
    }

    return false;
  }

  checkChapterCompletion(): boolean {
    if (!this.currentChapter) return false;

    const chapters = (window as any).storyChapters;
    const chapter = chapters[this.currentChapter] as Chapter;
    if (!chapter?.requiredObjectives) return false;

    const completed = this.completedObjectives[this.currentChapter] || [];

    let allRequiredCompleted = true;
    for (let i = 0; i < chapter.requiredObjectives.length; i++) {
      if (completed.indexOf(chapter.requiredObjectives[i]) === -1) {
        allRequiredCompleted = false;
        break;
      }
    }

    if (allRequiredCompleted) {
      this.completeCurrentChapter();
      return true;
    }

    return false;
  }

  getCurrentObjectives(): any[] {
    if (!this.currentChapter) return [];

    const chapters = (window as any).storyChapters;
    const chapter = chapters[this.currentChapter] as Chapter;
    if (!chapter?.objectives) return [];

    const completed = this.completedObjectives[this.currentChapter] || [];
    const required = chapter.requiredObjectives || [];

    return chapter.objectives.map((obj) => ({
      id: obj.id,
      description: obj.description,
      completed: completed.indexOf(obj.id) !== -1,
      required: required.indexOf(obj.id) !== -1,
    }));
  }

  getChapterProgress(): number {
    if (!this.currentChapter) return 0;

    const chapters = (window as any).storyChapters;
    const chapter = chapters[this.currentChapter] as Chapter;
    if (!chapter?.objectives || chapter.objectives.length === 0) {
      return 100;
    }

    const completed = this.completedObjectives[this.currentChapter] || [];
    return Math.round((completed.length / chapter.objectives.length) * 100);
  }

  serialize(): SerializedChapters {
    return {
      currentChapter: this.currentChapter,
      completedChapters: [...this.completedChapters],
      completedObjectives: { ...this.completedObjectives },
    };
  }

  deserialize(data: SerializedChapters): boolean {
    if (!data) return false;

    this.currentChapter = data.currentChapter || null;
    this.completedChapters = data.completedChapters || [];
    this.completedObjectives = data.completedObjectives || {};

    return true;
  }
}

// Singleton instance
const chapterManager = new ChapterManager();

// Global export
if (typeof window !== 'undefined') {
  (window as any).ChapterManager = chapterManager;
}

export default chapterManager;
