/* ══════════════════════════════════════════════════════════════
   NPC DATA — Dati visivi dei personaggi
   ══════════════════════════════════════════════════════════════ */

var npcsData = [
  {
    id: 'ruggeri',
    name: 'Sindaco Ruggeri',
    colors: { body: '#5C5C5C', head: '#D4A84B', legs: '#3D3025', detail: '#2D3047' },
    details: [],
  },
  {
    id: 'teresa',
    name: 'Teresa Bellandi',
    colors: { body: '#6B4E3D', head: '#D4A84B', legs: '#3D3025', detail: '#8B7355' },
    details: [],
  },
  {
    id: 'neri',
    name: 'Archivista Neri',
    colors: { body: '#8B7D6B', head: '#D4A84B', legs: '#3D3025', detail: '#A0A8B0' },
    details: [],
  },
  {
    id: 'valli',
    name: 'Capitano Valli',
    colors: { body: '#4A5568', head: '#D4A84B', legs: '#2D3047', detail: '#3D5A3C' },
    details: [],
  },
  {
    id: 'osvaldo',
    name: 'Osvaldo il Barista',
    colors: { body: '#8B7D6B', head: '#D4A84B', legs: '#3D3025', detail: '#B8A88A' },
    details: [],
  },
  {
    id: 'gino',
    name: 'Gino il Postino',
    colors: { body: '#5C7A4B', head: '#D4A84B', legs: '#3D3025', detail: '#A0A8B0' },
    details: [],
  },
  {
    id: 'anselmo',
    name: 'Anselmo il Vecchio',
    colors: { body: '#6B5B4F', head: '#D4A84B', legs: '#3D3025', detail: '#5C5C5C' },
    details: [],
  },
  {
    id: 'don_pietro',
    name: 'Don Pietro',
    colors: { body: '#1A1C20', head: '#D4A84B', legs: '#3D3025', detail: '#E8DCC8' },
    details: [],
  },
];

if (typeof window !== 'undefined') {
  window.npcsData = npcsData;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = npcsData;
}

export default npcsData;
