import { state } from './state.js';
import { elements } from './dom.js';

export function startTimer() {
  try {
    state.timerInterval = setInterval(() => {
      state.timeRemaining--;
      updateTimerDisplay();
      
      if (state.timeRemaining <= 0) {
        clearInterval(state.timerInterval);
        state.endTime = new Date();
        window.submitQuiz(true);
      }
    }, 1000);
  } catch (error) {
    console.error("Error starting timer:", error);
  }
}

export function updateTimerDisplay() {
  try {
    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = state.timeRemaining % 60;
    
    elements.timer.textContent = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    
    elements.timer.className = "px-6 py-3 rounded-xl font-mono font-bold text-lg shadow-md ";
    
    if (state.timeRemaining <= 300) {
      elements.timer.className += "timer-critical";
    } else if (state.timeRemaining <= 600) {
      elements.timer.className += "timer-warning";
    } else {
      elements.timer.className += "timer-normal";
    }
  } catch (error) {
    console.error("Error updating timer display:", error);
  }
}

export function stopTimer() {
  if (state.timerInterval) {
    clearInterval(state.timerInterval);
    state.timerInterval = null;
  }
}
