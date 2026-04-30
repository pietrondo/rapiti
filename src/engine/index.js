"use strict";

/* ═══════════════════════════════════════════════════════════════════════════════
   ENGINE MODULE - Index
   Entry point per il sistema di rendering engine
   ═══════════════════════════════════════════════════════════════════════════════ */

// Modules are loaded via separate script tags in order:
// 1. spriteEngine.js - SpriteEngine
// 2. proceduralRenderer.js - PF
// 3. buildingRenderers.js - BuildingRenderers

// This file serves as a compatibility layer and exports nothing new
// All functionality is available via global window.SpriteEngine, window.PF, window.BuildingRenderers

// Re-export for consistency with module pattern
window.EngineModule = {
  SpriteEngine: window.SpriteEngine,
  PF: window.PF,
  BuildingRenderers: window.BuildingRenderers
};
