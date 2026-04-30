/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * AREAS MODULE - Index
 * Aggrega tutte le aree di gioco
 * ═══════════════════════════════════════════════════════════════════════════════
 */

/* global PiazzeArea, ChiesaArea, CimiteroArea, GiardiniArea, BarExteriorArea, ResidenzialeArea, IndustrialeArea, PoliziaArea */

// Importa le aree (per browser, saranno caricate separatamente)
var Areas = {
  // Aree di gioco
  piazze: typeof PiazzeArea !== 'undefined' ? PiazzeArea : null,
  chiesa: typeof ChiesaArea !== 'undefined' ? ChiesaArea : null,
  cimitero: typeof CimiteroArea !== 'undefined' ? CimiteroArea : null,
  giardini: typeof GiardiniArea !== 'undefined' ? GiardiniArea : null,
  bar_exterior: typeof BarExteriorArea !== 'undefined' ? BarExteriorArea : null,
  residenziale: typeof ResidenzialeArea !== 'undefined' ? ResidenzialeArea : null,
  industriale: typeof IndustrialeArea !== 'undefined' ? IndustrialeArea : null,
  polizia: typeof PoliziaArea !== 'undefined' ? PoliziaArea : null,

  // Helper per ottenere un'area
  get: function (areaId) {
    return this[areaId] || null;
  },

  // Lista di tutte le aree
  getAll: function () {
    return [
      this.piazze,
      this.chiesa,
      this.cimitero,
      this.giardini,
      this.bar_exterior,
      this.residenziale,
      this.industriale,
      this.polizia,
    ].filter((a) => a !== null);
  },

  // Inizializza tutte le aree
  init: function () {
    var all = this.getAll();
    for (var i = 0; i < all.length; i++) {
      if (all[i] && all[i].init) {
        all[i].init();
      }
    }
    return this;
  },
};

// Esporta
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Areas;
} else if (typeof window !== 'undefined') {
  window.Areas = Areas;
}
