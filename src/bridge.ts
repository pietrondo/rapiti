/**
 * Typed Bridge — Window.* API Facade
 * Fornisce accesso tipizzato alle API globali durante la migrazione .mjs -> .ts.
 * Uso: import { showToast, StoryManager, areas } from '../bridge';
 */

import type { Area, ClueItem, AreaObject } from './types.js';

export const StoryManager: any = (window as any).StoryManager;
export const storyChapters: Record<string, any> | undefined = (window as any).storyChapters;
export const storyQuests: Record<string, any> | undefined = (window as any).storyQuests;
export const storyEvents: Record<string, any> | undefined = (window as any).storyEvents;
export const storyDialogueTriggers: Record<string, any> | undefined = (window as any).storyDialogueTriggers;
export const storyEndingConditions: Record<string, any> | undefined = (window as any).storyEndingConditions;

export const clues: ClueItem[] | undefined = (window as any).clues;
export const cluesMap: Record<string, ClueItem> | undefined = (window as any).cluesMap;
export const hypotheses: any[] | undefined = (window as any).hypotheses;
export const npcsData: any[] | undefined = (window as any).npcsData;
export const dialogueNodes: Record<string, any> | undefined = (window as any).dialogueNodes;
export const dialogueEffects: Record<string, any> | undefined = (window as any).dialogueEffects;
export const areas: Record<string, Area> | undefined = (window as any).areas;
export const areaObjects: Record<string, AreaObject[]> | undefined = (window as any).areaObjects;

export function bridgeShowToast(msg: string, params?: any): void {
  if ((window as any).showToast) (window as any).showToast(msg, params);
}

export function bridgeUpdateHUD(): void {
  if ((window as any).updateHUD) (window as any).updateHUD();
}

export function bridgeCollectClue(clue: string | { id: string }): void {
  if ((window as any).collectClue) (window as any).collectClue(clue);
}

export function bridgeUpdateNPCStates(): void {
  if ((window as any).updateNPCStates) (window as any).updateNPCStates();
}

export function bridgePlaySFX(sfx: string): void {
  if ((window as any).playSFX) (window as any).playSFX(sfx);
}

export function bridgeT(key: string, params?: any): string {
  if ((window as any).t) return (window as any).t(key, params);
  return key;
}

export const pixiRenderer: any = (window as any).pixiRenderer;
export const renderManager: any = (window as any).renderManager;
export const SpriteManager: any = (window as any).SpriteManager;
export const ParticleSystem: any = (window as any).ParticleSystem;
export const LightingSystem: any = (window as any).LightingSystem;
export const ScreenShake: any = (window as any).ScreenShake;
export const i18n: any = (window as any).i18n;
