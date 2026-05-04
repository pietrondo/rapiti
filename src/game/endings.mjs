/**
 * ══════════════════════════════════════════════════════════════
 *                    ENDING SYSTEM (Unified)
 * ══════════════════════════════════════════════════════════════
 */

/* global window.gameState, window.StoryManager, window.storyEndingConditions */

export function determineEnding() {
  if (window.StoryManager?.determineEnding) {
    const ending = window.StoryManager.determineEnding();
    return ending ? ending.id : 'psychological';
  }
  return 'psychological';
}

export function triggerEnding() {
  window.gameState.endingType = determineEnding();
  window.gameState.previousPhase = window.gameState.gamePhase;
  window.gameState.gamePhase = 'ending';
  showEndingOverlay();
}

/** Rende l'overlay del finale con testi dinamici e varianti */
export function showEndingOverlay() {
  const et = window.gameState.endingType || 'psychological';
  const name = window.gameState.playerName || 'Maurizio';
  const data = window.storyEndingConditions?.[et];
  
  if (!data) {
     console.error('[Endings] No data found for ending type:', et);
     return;
  }

  const titleEl = document.getElementById('ending-title');
  if (titleEl) {
    titleEl.textContent = `Finale: ${data.title}`;
  }

  const textEl = document.getElementById('ending-text');
  if (textEl) {
    textEl.textContent = '';
    
    // Testo principale
    const mainText = data.description.replace(/Maurizio/g, name);
    mainText.split('\n').forEach((line, i) => {
      if (i > 0) textEl.appendChild(document.createElement('br'));
      textEl.appendChild(document.createTextNode(line));
    });

    // Aggiungi varianti (epiloghi)
    let epilogueText = '';
    if (data.variants) {
       for (const v of data.variants) {
          if (window.StoryManager?.engine?.checkCondition(v.condition)) {
             epilogueText += `\n\n${v.text}`;
          }
       }
    } else if (data.variant) {
       if (window.StoryManager?.engine?.checkCondition(data.variant.condition || data.variant)) {
          epilogueText += `\n\n${data.variant.text}`;
       }
    }

    if (epilogueText) {
       epilogueText.split('\n').forEach(line => {
          textEl.appendChild(document.createElement('br'));
          textEl.appendChild(document.createTextNode(line));
       });
    }

    // Firma
    textEl.appendChild(document.createElement('br'));
    textEl.appendChild(document.createElement('br'));
    const signature = document.createElement('i');
    signature.textContent = `— ${name}`;
    textEl.appendChild(signature);
  }

  const overlay = document.getElementById('ending-overlay');
  if (overlay) {
    overlay.classList.add('active');
  }
}

