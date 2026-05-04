# Project Instructions for AI Agents

This file provides instructions and context for AI coding agents working on this project.

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
<!-- END BEADS INTEGRATION -->


## Build & Test

```bash
npm install     # Install dependencies
npm test        # Run all tests
npm run dev     # Start Vite dev server
npm run build   # Build for production
```

## Image Generation

If you need to generate images for the project, use the following API:

```bash
curl https://api.openadapter.in/v1/images/generations \
  -H "Authorization: Bearer sk-cv-5ad57af700a5459aa35c157faed9e96a" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "qwen-image-2512",
    "prompt": "A serene mountain lake at sunset with vibrant colors",
    "n": 1,
    "size": "1024x1024"
  }'
```

*Note: Keep the authorization header and model unchanged. Modify the prompt and size as needed.*

## Architecture Overview

*   **Single Source of Truth:** `src/config.ts` is the authoritative source for `gameState`. `src/config.mjs` is a compatibility proxy.
*   **Authoritative Narrative Engine:** `src/story/index.ts` (`StoryManager`) orchestrates chapters, quests, and flags.
*   **Unified Objects:** All interactive objects are defined in `src/data/clues.mjs` (`areaObjects`).
*   **Safe UI:** Avoid `innerHTML`. Use `textContent` and DOM construction.
*   **Hybrid Rendering:** PixiJS v8 for world/menus, Canvas 2D for HUD/Mini-map.

## Conventions & Patterns
...
