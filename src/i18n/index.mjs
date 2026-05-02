/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * I18N ENGINE — Sistema di localizzazione
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import it from './locales/it.mjs';

var _currentLocale = 'it';
var _fallbackLocale = 'it';
var _locales = {
  it: it
};

function registerLocale(lang, dict) {
  _locales[lang] = dict;
}

function setLocale(lang) {
  if (_locales[lang]) {
    _currentLocale = lang;
    if (typeof window !== 'undefined' && window.gameState) {
      window.gameState.locale = lang;
    }
  }
}

function getLocale() {
  return _currentLocale;
}

function t(key, params) {
  var dict = _locales[_currentLocale] || _locales[_fallbackLocale] || {};
  var str = dict[key];
  if (str === undefined) {
    // Fallback
    str = (_locales[_fallbackLocale] || {})[key];
  }
  if (str === undefined) {
    return '[' + key + ']';
  }
  if (params && typeof params === 'object') {
    for (var k in params) {
      if (Object.prototype.hasOwnProperty.call(params, k)) {
        str = str.replace(new RegExp('\\{' + k + '\\}', 'g'), params[k]);
      }
    }
  }
  return str;
}

export { registerLocale, setLocale, getLocale, t };

if (typeof window !== 'undefined') {
  window.i18n = { registerLocale, setLocale, getLocale, t };
  window.t = t;
}
