/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * I18N ENGINE — Sistema di localizzazione
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import en from './locales/en.mjs';
import it from './locales/it.mjs';

var _currentLocale = 'it';
var _fallbackLocale = 'it';
var _locales = {
  it: it,
  en: en,
};

function registerLocale(lang, dict) {
  _locales[lang] = dict;
}

function setLocale(lang) {
  if (_locales[lang]) {
    _currentLocale = lang;
    if (typeof window !== 'undefined') {
      if (window.gameState) window.gameState.locale = lang;
      document.documentElement.lang = lang;
      applyStaticTranslations();
    }
  }
}

/** Applica traduzioni agli elementi con data-i18n */
function applyStaticTranslations() {
  if (typeof document === 'undefined') return;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    const translation = t(key);
    if (translation !== `[${key}]`) {
      // Se è un input o ha un placeholder, traduciamo quello? No, data-i18n-placeholder
      el.textContent = translation;
    }
  });

  document.querySelectorAll('[data-i18n-title]').forEach((el) => {
    const key = el.getAttribute('data-i18n-title');
    const translation = t(key);
    if (translation !== `[${key}]`) {
      el.title = translation;
    }
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    const key = el.getAttribute('data-i18n-placeholder');
    const translation = t(key);
    if (translation !== `[${key}]`) {
      el.placeholder = translation;
    }
  });
}

function getLocale() {
  return _currentLocale;
}

function t(key, params) {
  var dict = _locales[_currentLocale] || _locales[_fallbackLocale] || {};
  var str = dict[key];
  if (str === undefined) {
    // Fallback
    str = _locales[_fallbackLocale]?.[key];
  }
  if (str === undefined) {
    return `[${key}]`;
  }
  if (params && typeof params === 'object') {
    for (var k in params) {
      if (Object.hasOwn(params, k)) {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), params[k]);
      }
    }
  }
  return str;
}

export { getLocale, registerLocale, setLocale, t };

if (typeof window !== 'undefined') {
  window.i18n = { registerLocale, setLocale, getLocale, t };
  window.t = t;
}
