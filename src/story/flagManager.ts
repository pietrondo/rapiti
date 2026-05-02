/**
 * ═══════════════════════════════════════════════════════════════════════════════
 *                    FLAG MANAGER (ES6+ CLASS)
 * ═══════════════════════════════════════════════════════════════════════════════
 *
 * Gestisce flag booleani di stato della narrazione.
 *
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export class FlagManager {
  flags: Record<string, any>;

  constructor() {
    this.flags = {};
  }

  init(): void {
    this.flags = {};
  }

  reset(): void {
    this.init();
  }

  setFlag(flagName: string, value: any = true): boolean {
    this.flags[flagName] = value;
    console.log('[FlagManager] Flag impostato:', flagName, value);
    return true;
  }

  getFlag(flagName: string): any {
    return this.flags[flagName] || false;
  }

  hasFlag(flagName: string): boolean {
    return !!this.flags[flagName];
  }

  clearFlag(flagName: string): boolean {
    delete this.flags[flagName];
    return true;
  }

  serialize(): Record<string, any> {
    return { ...this.flags };
  }

  deserialize(data: Record<string, any>): boolean {
    this.flags = data || {};
    return true;
  }
}

// Singleton instance
const flagManager = new FlagManager();

// Global export for retrocompatibility
if (typeof window !== 'undefined') {
  (window as any).FlagManager = flagManager;
}

export default flagManager;
