/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    SETTINGS MANAGER (TypeScript)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Manages game settings: audio, language, fullscreen, and UI preferences.
 * Persists to localStorage and applies changes immediately.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import { gameState } from '../config';

export interface GameSettings {
  language: 'it' | 'en';
  musicVolume: number;
  sfxVolume: number;
  audioEnabled: boolean;
  fullscreen: boolean;
  miniMapEnabled: boolean;
}

const DEFAULT_SETTINGS: GameSettings = {
  language: 'it',
  musicVolume: 0.7,
  sfxVolume: 0.8,
  audioEnabled: true,
  fullscreen: false,
  miniMapEnabled: true,
};

class SettingsManager {
  private settings: GameSettings;

  constructor() {
    this.settings = { ...DEFAULT_SETTINGS };
  }

  /** Load settings from localStorage */
  load(): void {
    try {
      const stored = localStorage.getItem('sanceleste_settings');
      if (stored) {
        this.settings = { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('[Settings] Failed to load settings:', e);
    }
  }

  /** Save settings to localStorage */
  save(): void {
    try {
      localStorage.setItem('sanceleste_settings', JSON.stringify(this.settings));
    } catch (e) {
      console.error('[Settings] Failed to save settings:', e);
    }
  }

  /** Apply all settings to the game engine */
  apply(): void {
    // 1. Language
    if ((window as any).i18n) {
      (window as any).i18n.setLocale(this.settings.language);
    }

    // 2. Audio
    if ((window as any).audioManager) {
      (window as any).audioManager.setEnabled(this.settings.audioEnabled);
      (window as any).audioManager.setVolume(this.settings.musicVolume);
    }
    gameState.musicEnabled = this.settings.audioEnabled;

    // 3. Fullscreen (only if changed and triggered by user event)
    // Application of fullscreen usually needs to happen during the event handler.
    
    // 4. UI Preferences
    gameState.showMiniMap = this.settings.miniMapEnabled;
    
    console.log('[Settings] Applied:', this.settings);
  }

  get<K extends keyof GameSettings>(key: K): GameSettings[K] {
    return this.settings[key];
  }

  set<K extends keyof GameSettings>(key: K, value: GameSettings[K]): void {
    this.settings[key] = value;
    this.save();
    this.apply();
  }

  toggleFullscreen(): void {
    this.settings.fullscreen = !this.settings.fullscreen;
    
    if (this.settings.fullscreen) {
      document.documentElement.requestFullscreen?.().catch(() => {
        this.settings.fullscreen = false;
      });
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
    
    this.save();
  }

  syncWithDOM(): void {
     const fs = !!document.fullscreenElement;
     if (this.settings.fullscreen !== fs) {
        this.settings.fullscreen = fs;
        this.save();
     }
  }
}

export const settingsManager = new SettingsManager();
if (typeof window !== 'undefined') {
  (window as any).settingsManager = settingsManager;
  
  // Update state on external fullscreen changes
  document.addEventListener('fullscreenchange', () => {
    settingsManager.syncWithDOM();
  });
}

export default settingsManager;
