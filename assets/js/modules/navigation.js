import { state } from './state.js';
import { elements } from './dom.js';
import { loadQuestion } from './quiz.js';

export function createNavigationGrid() {
  try {
    if (!elements.navigationGrid || !elements.mobileNavigationGrid) {
      console.error("Navigation grid elements not found");
      return;
    }
    
    elements.navigationGrid.innerHTML = "";
    elements.mobileNavigationGrid.innerHTML = "";
    
    const totalQuestions = QUIZ_CONFIG.TOTAL_QUESTIONS;
    const desktopCols = QUIZ_CONFIG.QUESTIONS_PER_ROW_DESKTOP;
    const mobileCols = QUIZ_CONFIG.QUESTIONS_PER_ROW_MOBILE;
    
    elements.navigationGrid.className = `grid gap-2 grid-cols-${desktopCols}`;
    elements.mobileNavigationGrid.className = `grid gap-3 grid-cols-${mobileCols}`;
    
    for (let i = 0; i < totalQuestions; i++) {
      const tile = createNavigationTile(i);
      const mobileTile = createNavigationTile(i, true);
      
      if (tile && mobileTile) {
        elements.navigationGrid.appendChild(tile);
        elements.mobileNavigationGrid.appendChild(mobileTile);
      }
    }
  } catch (error) {
    console.error("Error creating navigation grid:", error);
  }
}

export function createNavigationTile(index, isMobile = false) {
  try {
    const tile = document.createElement("button");
    tile.className = `${isMobile ? "w-10 h-10" : "w-8 h-8"} rounded-lg text-xs font-semibold transition-all tile-hover flex items-center justify-center shadow-sm tile-not-visited`;
    tile.textContent = index + 1;
    tile.onclick = () => {
      loadQuestion(index);
      if (isMobile) toggleMobileNav();
    };
    tile.id = `tile-${index}`;
    tile.setAttribute("aria-label", `Go to question ${index + 1}`);
    tile.type = "button";
    
    return tile;
  } catch (error) {
    console.error(`Error creating navigation tile ${index}:`, error);
    return null;
  }
}

export function updateNavigationTile(index) {
  try {
    const tiles = document.querySelectorAll(`[id="tile-${index}"]`);
    const stateObj = state.questionStates[index];
    
    if (!stateObj) {
      console.warn(`Question state not found for index ${index}`);
      return;
    }
    
    tiles.forEach((tile) => {
      tile.classList.remove("tile-not-visited", "tile-current", "tile-answered", "tile-visited");
      
      if (index === state.currentQuestion) {
        tile.classList.add("tile-current");
        tile.setAttribute("aria-current", "true");
      } else if (stateObj.answered) {
        tile.classList.add("tile-answered");
        tile.setAttribute("aria-current", "false");
      } else if (stateObj.visited) {
        tile.classList.add("tile-visited");
        tile.setAttribute("aria-current", "false");
      } else {
        tile.classList.add("tile-not-visited");
        tile.setAttribute("aria-current", "false");
      }
    });
  } catch (error) {
    console.error(`Error updating navigation tile ${index}:`, error);
  }
}

export function updateAllNavigationTiles() {
  try {
    for (let i = 0; i < state.questions.length; i++) {
      updateNavigationTile(i);
    }
  } catch (error) {
    console.error("Error updating all navigation tiles:", error);
  }
}

export function toggleMobileNav() {
  try {
    if (elements.mobileNavOverlay) {
      elements.mobileNavOverlay.classList.toggle("hidden");
    }
  } catch (error) {
    console.error("Error toggling mobile navigation:", error);
  }
}
