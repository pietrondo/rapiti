/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    QUEST MANAGER (ES6+ CLASS)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Manages quests, quest stages, rewards, and quest progression.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import type { Quest, Reward, Condition, SerializedQuests } from '../types.js';

export class QuestManager {
  /** Active quests by ID */
  activeQuests: Record<string, { id: string; currentStage: number; stagesCompleted: string[] }>;

  /** Completed quest IDs */
  completedQuests: string[];

  constructor() {
    this.activeQuests = {};
    this.completedQuests = [];
  }

  init(): void {
    this.activeQuests = {};
    this.completedQuests = [];
  }

  reset(): void {
    this.init();
  }

  /**
   * Activate quests for a chapter
   * @param {string} chapterId - Chapter to activate quests for
   */
  activateQuestsForChapter(chapterId: string): void {
    const quests = (window as any).storyQuests;
    if (!quests) return;

    for (const questId in quests) {
      const quest = quests[questId] as Quest;
      if (
        quest.chapter === chapterId &&
        !this.activeQuests[questId] &&
        this.completedQuests.indexOf(questId) === -1
      ) {
        this.activeQuests[questId] = {
          id: questId,
          currentStage: 0,
          stagesCompleted: [],
        };

        console.log('[QuestManager] Quest activated:', quest.title);
      }
    }
  }

  /**
   * Check progress of active quests
   * @param {Function} checkConditionFn - Condition checker function
   */
  checkQuestProgress(checkConditionFn: (c: Condition) => boolean): void {
    const quests = (window as any).storyQuests;
    for (const questId in this.activeQuests) {
      const quest = quests ? quests[questId] as Quest : null;
      const progress = this.activeQuests[questId];

      if (!quest?.stages || !progress) continue;

      const currentStage = quest.stages[progress.currentStage];
      if (!currentStage) continue;

      // Check if stage is completed
      if (checkConditionFn?.(currentStage.condition)) {
        // Apply reward
        if (currentStage.reward) {
          this.applyReward(currentStage.reward);
        }

        progress.stagesCompleted.push(currentStage.id);
        progress.currentStage++;

        console.log('[QuestManager] Quest stage completed:', currentStage.description);

        // Check quest completion
        if (progress.currentStage >= quest.stages.length) {
          this.completeQuest(questId);
        }
      }
    }
  }

  /**
   * Complete a quest
   * @param {string} questId - Quest to complete
   */
  completeQuest(questId: string): void {
    delete this.activeQuests[questId];
    this.completedQuests.push(questId);

    const quests = (window as any).storyQuests;
    const quest = quests ? quests[questId] as Quest : null;
    if (quest?.onComplete) {
      if (quest.onComplete.message && typeof (window as any).showToast === 'function') {
        (window as any).showToast(quest.onComplete.message);
      }
      if (quest.onComplete.reward) {
        this.applyReward(quest.onComplete.reward);
      }
    }

    console.log('[QuestManager] Quest completed:', questId);
  }

  /**
   * Get list of active quests with progress
   * @returns {Array} Active quest data
   */
  getActiveQuests(): any[] {
    const result = [];
    const quests = (window as any).storyQuests;

    for (const questId in this.activeQuests) {
      const quest = quests ? quests[questId] as Quest : null;
      const progress = this.activeQuests[questId];

      if (!quest || !progress) continue;

      const currentStageData = quest.stages[progress.currentStage];

      result.push({
        id: questId,
        title: quest.title,
        description: quest.description,
        currentStage: progress.currentStage,
        totalStages: quest.stages.length,
        currentStageDescription: currentStageData ? currentStageData.description : null,
        progress: Math.round((progress.currentStage / quest.stages.length) * 100),
      });
    }

    return result;
  }

  getCompletedQuests(): string[] {
    return [...this.completedQuests];
  }

  isQuestActive(questId: string): boolean {
    return !!this.activeQuests[questId];
  }

  isQuestCompleted(questId: string): boolean {
    return this.completedQuests.indexOf(questId) !== -1;
  }

  /**
   * Apply a reward
   * @param {Reward} reward - Reward configuration
   */
  applyReward(reward: Reward): void {
    if (!reward) return;

    const sm = (window as any).StoryManager;
    const gs = (window as any).gameState;

    // Set flag
    if (reward.setFlag && sm) {
      sm.setFlag(reward.setFlag);
    }

    // Update NPC state
    if (reward.updateNPCState && gs) {
      for (const npcId in reward.updateNPCState) {
        if (gs.npcStates) {
          gs.npcStates[npcId] = reward.updateNPCState[npcId];
        }
      }
    }

    // Give clue
    if (reward.giveClue && typeof (window as any).collectClue === 'function') {
      (window as any).collectClue(reward.giveClue);
    }

    // Clue hint — mostra un suggerimento diegetico al giocatore
    if (reward.giveClueHint) {
      const cluesMap = (window as any).cluesMap;
      const clueData = cluesMap?.[reward.giveClueHint];
      const hintName = clueData?.name || reward.giveClueHint;
      const areaName = clueData?.area ? (window as any).t?.(`area.${clueData.area}`) || clueData.area : 'un\'area';
      if (typeof (window as any).showToast === 'function') {
        if ((window as any).t) {
          (window as any).showToast('toast.clue_hint', { name: hintName, area: areaName });
        } else {
          (window as any).showToast(`Nuova pista: "${hintName}" — cerca in ${areaName}.`);
        }
      }
    }

    // Experience points
    if (reward.xp) {
      console.log('[QuestManager] XP earned:', reward.xp);
    }

    // Unlock area
    if (reward.unlockArea) {
      console.log('[QuestManager] Area unlocked:', reward.unlockArea);
    }

    // Custom action
    if (reward.action && typeof reward.action === 'function') {
      reward.action();
    }

    // Update Trust Levels
    if (reward.addTrust && gs) {
       for (const npcId in reward.addTrust) {
          gs.npcTrust[npcId] = (gs.npcTrust[npcId] || 0) + reward.addTrust[npcId];
          console.log('[QuestManager] Trust increased for', npcId, 'to', gs.npcTrust[npcId]);
       }
    }
    if (reward.subTrust && gs) {
       for (const npcId in reward.subTrust) {
          gs.npcTrust[npcId] = (gs.npcTrust[npcId] || 0) - reward.subTrust[npcId];
          console.log('[QuestManager] Trust decreased for', npcId, 'to', gs.npcTrust[npcId]);
       }
    }
    if (reward.setTrust && gs) {
       for (const npcId in reward.setTrust) {
          gs.npcTrust[npcId] = reward.setTrust[npcId];
          console.log('[QuestManager] Trust set for', npcId, 'to', gs.npcTrust[npcId]);
       }
    }
  }

  getQuestProgress(questId: string): number {
    const progress = this.activeQuests[questId];
    const quests = (window as any).storyQuests;
    const quest = quests ? quests[questId] as Quest : null;

    if (!progress || !quest?.stages) return 0;

    return Math.round((progress.currentStage / quest.stages.length) * 100);
  }

  getActiveQuestCount(): number {
    return Object.keys(this.activeQuests).length;
  }

  getCompletedQuestCount(): number {
    return this.completedQuests.length;
  }

  serialize(): SerializedQuests {
    return {
      activeQuests: { ...this.activeQuests },
      completedQuests: [...this.completedQuests],
    };
  }

  deserialize(data: SerializedQuests): boolean {
    if (!data) return false;

    this.activeQuests = data.activeQuests || {};
    this.completedQuests = data.completedQuests || [];

    return true;
  }
}

// Singleton instance
const questManager = new QuestManager();

// Global export
if (typeof window !== 'undefined') {
  (window as any).QuestManager = questManager;
}

export default questManager;
