console.log('Loading IQnition...');

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

Promise.all([
  loadScript('./node_modules/chart.js/dist/chart.min.js'),
  loadScript('./node_modules/jspdf/dist/jspdf.umd.min.js')
]).then(() => {
  console.log('External libraries loaded successfully');
  initializeApp();
}).catch(error => {
  console.error('Error loading libraries:', error);
  initializeApp();
});

import { state, resetState, setCurrentUser } from './modules/state.js';
import { elements, initializeElements, showSection, showModal, updateDynamicContent } from './modules/dom.js';
import { generateQuestions, loadQuestion, nextQuestion, previousQuestion, selectOption } from './modules/quiz.js';
import { createNavigationGrid, toggleMobileNav } from './modules/navigation.js';
import { startTimer, stopTimer } from './modules/timer.js';
import { calculateResults, showResults, downloadResults } from './modules/results.js';
import { sanitizeInput, debounce, initializeCsrfToken, validateCsrfToken } from './modules/utils.js';

window.initializeCsrfToken = initializeCsrfToken;
window.validateCsrfToken = validateCsrfToken;

function initializeApp() {
  try {
    if (!initializeElements()) {
      console.error("Failed to initialize DOM elements");
      return;
    }
    
    if (!generateQuestions()) {
      console.error("Failed to generate questions");
      return;
    }
    
    state.timeRemaining = QUIZ_CONFIG.TIME_LIMIT;
    updateDynamicContent();
    createNavigationGrid();
    showSection("opening");
    setupEventListeners();
    setupGlobalFunctions();
    
    console.log(`IQnition initialized successfully: ${QUIZ_CONFIG.TOTAL_QUESTIONS} questions, ${Math.floor(QUIZ_CONFIG.TIME_LIMIT / 60)} minutes`);
    
    if (document.getElementById('csrfToken')) {
      document.getElementById('csrfToken').value = initializeCsrfToken();
    }
    
  } catch (error) {
    console.error("Error during initialization:", error);
    showModal("Error: Failed to initialize quiz. Please refresh and try again.");
  }
}

function setupGlobalFunctions() {
  window.startQuiz = startQuiz;
  window.submitQuiz = submitQuiz;
  window.restartQuiz = restartQuiz;
  window.downloadResults = downloadResults;
  window.nextQuestion = nextQuestion;
  window.previousQuestion = previousQuestion;
  window.toggleMobileNav = toggleMobileNav;
  window.showModal = showModal;
}

function setupEventListeners() {
  try {
    window.addEventListener("beforeunload", (e) => {
      if (state.currentSection === "quiz") {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave? Your quiz progress will be lost.";
        return e.returnValue;
      }
    });
    
    document.addEventListener("keydown", (e) => {
      if (state.currentSection === "quiz") {
        switch (e.key) {
          case "ArrowLeft":
            e.preventDefault();
            previousQuestion();
            break;
          case "ArrowRight":
            e.preventDefault();
            nextQuestion();
            break;
          case "1":
          case "2":
          case "3":
          case "4":
            e.preventDefault();
            const optionIndex = parseInt(e.key) - 1;
            if (optionIndex < state.questions[state.currentQuestion].options.length) {
              selectOption(optionIndex);
            }
            break;
        }
      }
    });
    
    window.addEventListener("resize", debounce(() => {
      if (state.currentSection === "quiz") {
        updateLayout();
      }
    }, 250));
    
    elements.modalOverlay?.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        elements.modalOverlay.classList.add("hidden");
      }
    });
  } catch (error) {
    console.error("Error setting up event listeners:", error);
  }
}

function updateLayout() {
  try {
    const gridElements = document.querySelectorAll("#navigationGrid, #mobileNavigationGrid");
    gridElements.forEach((grid) => {
      if (grid) {
        grid.style.display = "none";
        grid.offsetHeight;
        grid.style.display = "grid";
      }
    });
  } catch (error) {
    console.error("Error updating layout:", error);
  }
}

function startQuiz() {
  try {
    const name = sanitizeInput(elements.userName.value.trim());
    if (!name || name.length < 2) {
      showModal("Please enter a valid name (at least 2 characters)", null, "Invalid Name");
      elements.userName.focus();
      return;
    }
    
    setCurrentUser(name);
    
    if (!showSection("quiz")) {
      console.error("Failed to show quiz section");
      return;
    }
    
    startTimer();
    loadQuestion(0);
  } catch (error) {
    console.error("Error starting quiz:", error);
    showModal("Error: Failed to start quiz. Please try again.", null, "Quiz Start Error");
  }
}

function submitQuiz(autoSubmit = false) {
  try {
    const answeredCount = Object.keys(state.userAnswers).length;
    const totalQuestions = state.questions.length;
    
    if (!autoSubmit) {
      let message;
      if (answeredCount === 0) {
        message = "You haven't answered any questions yet. Are you sure you want to submit?";
      } else if (answeredCount < totalQuestions) {
        message = `You have answered ${answeredCount} out of ${totalQuestions} questions. Unanswered questions will be marked as incorrect. Are you sure you want to submit?`;
      } else {
        message = "Are you sure you want to submit your quiz?";
      }
      
      showModal(message, () => {
        stopTimer();
        if (!state.endTime) {
          state.endTime = new Date();
        }
        calculateResults();
        showResults();
      }, "Confirm Submission");
      return;
    }
    
    stopTimer();
    if (!state.endTime) {
      state.endTime = new Date();
    }
    calculateResults();
    showResults();
  } catch (error) {
    console.error("Error submitting quiz:", error);
    showModal("Error: Failed to submit quiz. Please try again.", null, "Submission Error");
  }
}

function restartQuiz() {
  try {
    resetState();
    
    if (elements.mobileNavOverlay) {
      elements.mobileNavOverlay.classList.add("hidden");
    }
    
    if (elements.userName) {
      elements.userName.value = "";
    }
    
    showSection("opening");
  } catch (error) {
    console.error("Error restarting quiz:", error);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeApp, 100);
  });
} else {
  setTimeout(initializeApp, 100);
}

window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});
