/* ═══════════════════════════════════════════════════════════════════════════════
   ENGINE MODULE - Compatibility Layer
   Questo file ora importa dai moduli in src/engine/ per mantenere compatibilita'
   ═══════════════════════════════════════════════════════════════════════════════ */

// SpriteEngine, PF, e BuildingRenderers sono caricati dai moduli in src/engine/
// Questo file serve solo come compatibility layer per codice legacy

// Re-export globals for any legacy code that expects them here
// All functionality is provided by:
// - window.SpriteEngine (from src/engine/spriteEngine.js)
// - window.PF (from src/engine/proceduralRenderer.js)
// - window.BuildingRenderers (from src/engine/buildingRenderers.js)

// No additional code needed - modules export to window.* directly
