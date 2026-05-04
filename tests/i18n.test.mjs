/**
 * Tests for I18N Module and Localizations
 */

import { describe, expect, it } from '@jest/globals';
import itDict from '../src/i18n/locales/it.mjs';
import enDict from '../src/i18n/locales/en.mjs';

describe('I18N Localization', () => {
  it('should have the same keys in IT and EN dictionaries', () => {
    const itKeys = Object.keys(itDict).sort();
    const enKeys = Object.keys(enDict).sort();

    // Check for missing keys in EN
    const missingInEn = itKeys.filter(k => !enKeys.includes(k));
    // Check for missing keys in IT
    const missingInIt = enKeys.filter(k => !itKeys.includes(k));

    if (missingInEn.length > 0) {
      console.warn('Keys missing in EN dictionary:', missingInEn);
    }
    if (missingInIt.length > 0) {
      console.warn('Keys missing in IT dictionary:', missingInIt);
    }

    expect(missingInEn).toEqual([]);
    expect(missingInIt).toEqual([]);
  });

  it('should have non-empty values for all keys', () => {
    Object.entries(itDict).forEach(([key, value]) => {
      expect(value).not.toBe('');
    });
    Object.entries(enDict).forEach(([key, value]) => {
      expect(value).not.toBe('');
    });
  });
});
