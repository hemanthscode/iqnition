// script.js - IQnition Application Logic

// Application State
const state = {
  currentUser: "",
  currentQuestion: 0,
  questions: [],
  userAnswers: {},
  questionStates: {},
  timeRemaining: 0,
  timerInterval: null,
  currentSection: "opening",
  startTime: null,
  endTime: null,
};

// DOM Elements Cache
const elements = {
  openingSection: null,
  quizSection: null,
  resultsSection: null,
  userName: null,
  totalQuestionsInfo: null,
  timeAllowedInfo: null,
  timer: null,
  currentQuestionDisplay: null,
  totalQuestionsDisplay: null,
  questionText: null,
  optionsContainer: null,
  navigationGrid: null,
  mobileNavigationGrid: null,
  mobileNavOverlay: null,
  prevBtn: null,
  nextBtn: null,
  resultName: null,
  resultIcon: null,
  resultStatus: null,
  totalQuestionsResult: null,
  correctCount: null,
  incorrectCount: null,
  notAttemptedCount: null,
  percentage: null,
  resultChart: null,
  modalOverlay: null,
  modalTitle: null,
  modalMessage: null,
  modalCancel: null,
  modalConfirm: null,
  quizTopic: null,
};

// Initialize DOM Elements
function initializeElements() {
  try {
    Object.keys(elements).forEach((key) => {
      elements[key] = document.getElementById(key);
      if (!elements[key]) {
        console.warn(`Missing DOM element: ${key}`);
      }
    });
    return true;
  } catch (error) {
    console.error("Error initializing DOM elements:", error);
    return false;
  }
}

// Modal Management
function showModal(message, onConfirm = null, title = "Notification") {
  try {
    elements.modalTitle.textContent = title;
    elements.modalMessage.textContent = message;
    elements.modalOverlay.classList.remove("hidden");

    const cancelClone = elements.modalCancel.cloneNode(true);
    const confirmClone = elements.modalConfirm.cloneNode(true);
    elements.modalCancel.parentNode.replaceChild(
      cancelClone,
      elements.modalCancel
    );
    elements.modalConfirm.parentNode.replaceChild(
      confirmClone,
      elements.modalConfirm
    );
    elements.modalCancel = cancelClone;
    elements.modalConfirm = confirmClone;

    elements.modalCancel.addEventListener("click", () => {
      elements.modalOverlay.classList.add("hidden");
    });

    if (onConfirm) {
      elements.modalConfirm.classList.remove("hidden");
      elements.modalConfirm.addEventListener("click", () => {
        elements.modalOverlay.classList.add("hidden");
        onConfirm();
      });
    } else {
      elements.modalConfirm.classList.add("hidden");
    }

    elements.modalOverlay.focus();
  } catch (error) {
    console.error("Error showing modal:", error);
  }
}

// Section Management
function showSection(sectionName) {
  try {
    elements.openingSection.classList.remove("active");
    elements.quizSection.classList.remove("active");
    elements.resultsSection.classList.remove("active");

    switch (sectionName) {
      case "opening":
        elements.openingSection.classList.add("active");
        state.currentSection = "opening";
        break;
      case "quiz":
        elements.quizSection.classList.add("active");
        state.currentSection = "quiz";
        break;
      case "results":
        elements.resultsSection.classList.add("active");
        state.currentSection = "results";
        break;
      default:
        console.error(`Invalid section name: ${sectionName}`);
        return false;
    }
    return true;
  } catch (error) {
    console.error("Error showing section:", error);
    return false;
  }
}

// Question Generation and Validation
function generateQuestions() {
  try {
    if (!QUESTION_BANK || QUESTION_BANK.length === 0) {
      console.error("Question bank is empty or invalid");
      showModal("Error: No questions available. Please contact support.");
      return false;
    }

    for (let i = 0; i < QUESTION_BANK.length; i++) {
      const q = QUESTION_BANK[i];
      if (
        !q.question ||
        !q.options ||
        !Array.isArray(q.options) ||
        q.options.length !== 4 ||
        typeof q.correct !== "number" ||
        q.correct < 0 ||
        q.correct >= 4 ||
        q.options.some((opt) => !opt || opt.trim() === "")
      ) {
        console.error(`Invalid question at index ${i}:`, q);
        showModal(
          "Error: Invalid question format detected. Please contact support."
        );
        return false;
      }
    }

    state.questions = QUESTION_BANK.map((question, index) => ({
      ...question,
      id: index,
    }));

    for (let i = 0; i < state.questions.length; i++) {
      state.questionStates[i] = { visited: false, answered: false };
    }

    return true;
  } catch (error) {
    console.error("Error generating questions:", error);
    showModal(
      "Error: Failed to generate questions. Please refresh and try again."
    );
    return false;
  }
}

// Dynamic UI Updates
function updateDynamicContent() {
  try {
    const totalQuestions = QUIZ_CONFIG.TOTAL_QUESTIONS;
    const timeMinutes = Math.floor(QUIZ_CONFIG.TIME_LIMIT / 60);

    elements.totalQuestionsInfo.textContent = totalQuestions;
    elements.timeAllowedInfo.textContent = timeMinutes;
    elements.totalQuestionsDisplay.textContent = totalQuestions;
    elements.totalQuestionsResult.textContent = totalQuestions;
    elements.quizTopic.textContent = `${QUIZ_CONFIG.TOPIC} Assessment`;
  } catch (error) {
    console.error("Error updating dynamic content:", error);
  }
}

// Application Initialization
function init() {
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

    console.log(
      `IQnition initialized successfully: ${
        QUIZ_CONFIG.TOTAL_QUESTIONS
      } questions, ${Math.floor(QUIZ_CONFIG.TIME_LIMIT / 60)} minutes`
    );
  } catch (error) {
    console.error("Error during initialization:", error);
    showModal(
      "Error: Failed to initialize quiz. Please refresh and try again."
    );
  }
}

// Event Listeners
function setupEventListeners() {
  try {
    window.addEventListener("beforeunload", (e) => {
      if (state.currentSection === "quiz") {
        e.preventDefault();
        e.returnValue =
          "Are you sure you want to leave? Your quiz progress will be lost.";
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
            if (
              optionIndex <
              state.questions[state.currentQuestion].options.length
            ) {
              selectOption(optionIndex);
            }
            break;
        }
      }
    });

    window.addEventListener(
      "resize",
      debounce(() => {
        if (state.currentSection === "quiz") {
          updateLayout();
        }
      }, 250)
    );

    elements.modalOverlay?.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        elements.modalOverlay.classList.add("hidden");
      }
    });
  } catch (error) {
    console.error("Error setting up event listeners:", error);
  }
}

// Utility function for debouncing
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Layout update for responsive design
function updateLayout() {
  try {
    const gridElements = document.querySelectorAll(
      "#navigationGrid, #mobileNavigationGrid"
    );
    gridElements.forEach((grid) => {
      if (grid) {
        grid.style.display = "none";
        grid.offsetHeight; // Trigger reflow
        grid.style.display = "grid";
      }
    });
  } catch (error) {
    console.error("Error updating layout:", error);
  }
}

// CSRF Protection Functions
function generateCsrfToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(36).padStart(2, "0")).join(
    ""
  );
}

function initializeCsrfToken() {
  const token = generateCsrfToken();
  sessionStorage.setItem("csrfToken", token);
  sessionStorage.setItem("csrfTokenTimestamp", Date.now().toString());
  return token;
}

function validateCsrfToken() {
  const formToken = document.getElementById("csrfToken").value;
  const sessionToken = sessionStorage.getItem("csrfToken");
  const timestamp = sessionStorage.getItem("csrfTokenTimestamp");
  const tokenAge = Date.now() - parseInt(timestamp || "0");
  const maxAge = 30 * 60 * 1000; // 30 minutes

  if (tokenAge > maxAge) {
    console.warn("CSRF token expired");
    return false;
  }
  return formToken === sessionToken;
}

// Sanitization Function
function sanitizeInput(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML.replace(/[<>]/g, "");
}

// Quiz Management Functions
function startQuiz() {
  try {
    const name = sanitizeInput(elements.userName.value.trim());
    if (!name || name.length < 2) {
      showModal(
        "Please enter a valid name (at least 2 characters)",
        null,
        "Invalid Name"
      );
      elements.userName.focus();
      return;
    }

    state.currentUser = name;
    state.startTime = new Date();

    if (!showSection("quiz")) {
      console.error("Failed to show quiz section");
      return;
    }

    startTimer();
    loadQuestion(0);
  } catch (error) {
    console.error("Error starting quiz:", error);
    showModal(
      "Error: Failed to start quiz. Please try again.",
      null,
      "Quiz Start Error"
    );
  }
}

function startTimer() {
  try {
    state.timerInterval = setInterval(() => {
      state.timeRemaining--;
      updateTimerDisplay();

      if (state.timeRemaining <= 0) {
        clearInterval(state.timerInterval);
        state.endTime = new Date();
        submitQuiz(true);
      }
    }, 1000);
  } catch (error) {
    console.error("Error starting timer:", error);
  }
}

function updateTimerDisplay() {
  try {
    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = state.timeRemaining % 60;
    elements.timer.textContent = `${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

    elements.timer.className =
      "px-6 py-3 rounded-xl font-mono font-bold text-lg shadow-md ";
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

// Navigation Grid Management
function createNavigationGrid() {
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

function createNavigationTile(index, isMobile = false) {
  try {
    const tile = document.createElement("button");
    tile.className = `${
      isMobile ? "w-10 h-10" : "w-8 h-8"
    } rounded-lg text-xs font-semibold transition-all tile-hover flex items-center justify-center shadow-sm tile-not-visited`;
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

function updateNavigationTile(index) {
  try {
    const tiles = document.querySelectorAll(`[id="tile-${index}"]`);
    const stateObj = state.questionStates[index];

    if (!stateObj) {
      console.warn(`Question state not found for index ${index}`);
      return;
    }

    tiles.forEach((tile) => {
      tile.classList.remove(
        "tile-not-visited",
        "tile-current",
        "tile-answered",
        "tile-visited"
      );

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

function updateAllNavigationTiles() {
  try {
    for (let i = 0; i < state.questions.length; i++) {
      updateNavigationTile(i);
    }
  } catch (error) {
    console.error("Error updating all navigation tiles:", error);
  }
}

// Question Management
function loadQuestion(index) {
  try {
    if (index < 0 || index >= state.questions.length) {
      showModal("Invalid question index. Please try again.", null, "Error");
      return;
    }

    state.currentQuestion = index;
    const question = state.questions[index];

    if (!question) {
      console.error(`Question not found at index: ${index}`);
      showModal(
        "Failed to load question. Please try again or contact support.",
        null,
        "Error"
      );
      return;
    }

    state.questionStates[index].visited = true;

    elements.currentQuestionDisplay.textContent = index + 1;
    elements.questionText.textContent = question.question;

    loadQuestionOptions(question, index);

    if (state.userAnswers[index] !== undefined) {
      selectOption(state.userAnswers[index], false);
    }

    updateAllNavigationTiles();
    updateControls();
    setupOptionKeyboardNavigation();
  } catch (error) {
    console.error(`Error loading question ${index}:`, error);
    showModal(
      "Failed to load question. Please try again or contact support.",
      null,
      "Error"
    );
  }
}

function loadQuestionOptions(question, questionIndex) {
  try {
    if (
      !elements.optionsContainer ||
      !question.options ||
      !Array.isArray(question.options)
    )
      return;

    const fragment = document.createDocumentFragment();
    const currentOptions = elements.optionsContainer.children;
    const optionCount = question.options.length;

    question.options.forEach((option, optionIndex) => {
      let button =
        currentOptions[optionIndex] || document.createElement("button");
      button.type = "button";
      button.className = "w-full text-left transition-all option-button";
      button.innerHTML = `
        <div class="flex items-start">
          <div class="w-6 h-6 border-2 border-slate-400 rounded-full mr-4 flex items-center justify-center transition-colors flex-shrink-0 mt-1">
            <div class="option-indicator" id="option-${optionIndex}"></div>
          </div>
          <span class="flex-1 leading-relaxed">${escapeHtml(option)}</span>
        </div>
      `;
      button.onclick = () => selectOption(optionIndex);
      button.setAttribute("aria-label", `Option ${optionIndex + 1}: ${option}`);
      button.setAttribute("role", "radio");
      button.setAttribute("aria-checked", "false");
      button.setAttribute(
        "aria-current",
        state.userAnswers[questionIndex] === optionIndex ? "true" : "false"
      );
      fragment.appendChild(button);
    });

    while (elements.optionsContainer.children.length > optionCount) {
      elements.optionsContainer.removeChild(
        elements.optionsContainer.lastChild
      );
    }
    elements.optionsContainer.innerHTML = "";
    elements.optionsContainer.appendChild(fragment);
  } catch (error) {
    console.error("Error loading question options:", error);
  }
}

function setupOptionKeyboardNavigation() {
  try {
    const options = elements.optionsContainer.querySelectorAll("button");
    options.forEach((option, index) => {
      option.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          selectOption(index);
        }
      });
    });
  } catch (error) {
    console.error("Error setting up option keyboard navigation:", error);
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function selectOption(optionIndex, animate = true) {
  try {
    document.querySelectorAll(".option-indicator").forEach((el) => {
      el.classList.remove("active");
      el.closest("button").classList.remove("option-selected");
      el.closest("button").setAttribute("aria-checked", "false");
      el.closest("button").setAttribute("aria-current", "false");
    });

    const selectedOption = document.getElementById(`option-${optionIndex}`);
    if (!selectedOption) {
      console.error(`Option indicator not found: ${optionIndex}`);
      return;
    }

    const button = selectedOption.closest("button");
    if (!button) {
      console.error("Button not found for option");
      return;
    }

    selectedOption.classList.add("active");
    button.classList.add("option-selected");
    button.setAttribute("aria-checked", "true");
    button.setAttribute("aria-current", "true");

    state.userAnswers[state.currentQuestion] = optionIndex;
    state.questionStates[state.currentQuestion].answered = true;

    updateNavigationTile(state.currentQuestion);
  } catch (error) {
    console.error(`Error selecting option ${optionIndex}:`, error);
  }
}

// Navigation Controls
function nextQuestion() {
  try {
    if (state.currentQuestion < state.questions.length - 1) {
      loadQuestion(state.currentQuestion + 1);
    }
  } catch (error) {
    console.error("Error navigating to next question:", error);
  }
}

function previousQuestion() {
  try {
    if (state.currentQuestion > 0) {
      loadQuestion(state.currentQuestion - 1);
    }
  } catch (error) {
    console.error("Error navigating to previous question:", error);
  }
}

function updateControls() {
  try {
    if (elements.prevBtn) {
      elements.prevBtn.disabled = state.currentQuestion === 0;
    }
    if (elements.nextBtn) {
      elements.nextBtn.style.display =
        state.currentQuestion === state.questions.length - 1 ? "none" : "flex";
    }
  } catch (error) {
    console.error("Error updating controls:", error);
  }
}

// Mobile Navigation
function toggleMobileNav() {
  try {
    if (elements.mobileNavOverlay) {
      elements.mobileNavOverlay.classList.toggle("hidden");
    }
  } catch (error) {
    console.error("Error toggling mobile navigation:", error);
  }
}

// Quiz Submission
function submitQuiz(autoSubmit = false) {
  try {
    const answeredCount = Object.keys(state.userAnswers).length;
    const totalQuestions = state.questions.length;

    if (!autoSubmit) {
      let message;
      if (answeredCount === 0) {
        message =
          "You haven't answered any questions yet. Are you sure you want to submit?";
      } else if (answeredCount < totalQuestions) {
        message = `You have answered ${answeredCount} out of ${totalQuestions} questions. Unanswered questions will be marked as incorrect. Are you sure you want to submit?`;
      } else {
        message = "Are you sure you want to submit your quiz?";
      }

      showModal(
        message,
        () => {
          if (state.timerInterval) {
            clearInterval(state.timerInterval);
          }
          if (!state.endTime) {
            state.endTime = new Date();
          }
          calculateResults();
          showResults();
        },
        "Confirm Submission"
      );
      return;
    }

    if (state.timerInterval) {
      clearInterval(state.timerInterval);
    }

    if (!state.endTime) {
      state.endTime = new Date();
    }

    calculateResults();
    showResults();
  } catch (error) {
    console.error("Error submitting quiz:", error);
    showModal(
      "Error: Failed to submit quiz. Please try again.",
      null,
      "Submission Error"
    );
  }
}

// Results Calculation
function calculateResults() {
  try {
    let correct = 0;
    let incorrect = 0;
    let notAttempted = 0;

    for (let i = 0; i < state.questions.length; i++) {
      if (state.userAnswers[i] === undefined) {
        notAttempted++;
      } else if (state.userAnswers[i] === state.questions[i].correct) {
        correct++;
      } else {
        incorrect++;
      }
    }

    const percentage = Math.round((correct / state.questions.length) * 100);
    const timeTaken = Math.floor((state.endTime - state.startTime) / 1000);

    window.quizResults = {
      correct,
      incorrect,
      notAttempted,
      percentage,
      timeTaken,
      totalQuestions: state.questions.length,
      passed: percentage >= QUIZ_CONFIG.PASSING_SCORE,
    };
  } catch (error) {
    console.error("Error calculating results:", error);
    window.quizResults = {
      correct: 0,
      incorrect: 0,
      notAttempted: state.questions.length,
      percentage: 0,
      timeTaken: 0,
      totalQuestions: state.questions.length,
      passed: false,
    };
  }
}

// Results Display
function showResults() {
  try {
    if (!showSection("results")) {
      console.error("Failed to show results section");
      return;
    }

    const results = window.quizResults;

    elements.resultName.textContent = state.currentUser;
    elements.correctCount.textContent = results.correct;
    elements.incorrectCount.textContent = results.incorrect;
    elements.notAttemptedCount.textContent = results.notAttempted;
    elements.percentage.textContent = `${results.percentage}%`;

    if (results.passed) {
      elements.resultIcon.className =
        "w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl";
      elements.resultStatus.textContent = "🎉 Congratulations! You Passed!";
      elements.resultStatus.className = "text-xl font-bold mt-3 text-green-600";
    } else {
      elements.resultIcon.className =
        "w-24 h-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl";
      elements.resultStatus.textContent =
        "📚 Keep Learning! You Can Do Better!";
      elements.resultStatus.className =
        "text-xl font-bold mt-3 text-orange-600";
    }

    createResultChart();
  } catch (error) {
    console.error("Error showing results:", error);
  }
}

function createResultChart() {
  try {
    if (!elements.resultChart) {
      console.error("Result chart element not found");
      return;
    }

    const ctx = elements.resultChart.getContext("2d");
    const results = window.quizResults;

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Correct", "Incorrect", "Not Attempted"],
        datasets: [
          {
            data: [results.correct, results.incorrect, results.notAttempted],
            backgroundColor: ["#10B981", "#EF4444", "#9CA3AF"],
            borderWidth: 3,
            borderColor: "#ffffff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 20,
              usePointStyle: true,
              font: {
                size: 14,
                weight: "bold",
              },
            },
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: (context) => {
                const label = context.label || "";
                const value = context.raw || 0;
                return `${label}: ${value} question${value !== 1 ? "s" : ""}`;
              },
            },
          },
        },
      },
    });
  } catch (error) {
    console.error("Error creating result chart:", error);
  }
}

// Utility Functions
function restartQuiz() {
  try {
    state.currentQuestion = 0;
    state.userAnswers = {};
    state.timeRemaining = QUIZ_CONFIG.TIME_LIMIT;
    state.currentSection = "opening";
    state.startTime = null;
    state.endTime = null;

    if (state.timerInterval) {
      clearInterval(state.timerInterval);
      state.timerInterval = null;
    }

    for (let i = 0; i < state.questions.length; i++) {
      state.questionStates[i] = { visited: false, answered: false };
    }

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

function downloadResults() {
  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const results = window.quizResults;
    const timeMinutes = Math.floor(results.timeTaken / 60);
    const timeSeconds = results.timeTaken % 60;
    const lineHeight = 7; // Standard line height for font size 12
    let y = 10;

    // Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("IQnition Quiz Results", 105, y, { align: "center" });
    y += 10 + lineHeight;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Student: ${state.currentUser}`, 10, y);
    y += lineHeight;
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, y);
    y += lineHeight;
    doc.text(`Time: ${new Date().toLocaleTimeString()}`, 10, y);
    y += 10;

    // Performance Summary
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Quiz Performance:", 10, y);
    y += lineHeight + 3;

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`- Total Questions: ${results.totalQuestions}`, 10, y);
    y += lineHeight;
    doc.text(`- Correct Answers: ${results.correct}`, 10, y);
    y += lineHeight;
    doc.text(`- Incorrect Answers: ${results.incorrect}`, 10, y);
    y += lineHeight;
    doc.text(`- Not Attempted: ${results.notAttempted}`, 10, y);
    y += lineHeight;
    doc.text(`- Final Score: ${results.percentage}%`, 10, y);
    y += lineHeight;
    doc.text(
      `- Status: ${results.passed ? "PASSED" : "NEEDS IMPROVEMENT"}`,
      10,
      y
    );
    y += lineHeight;
    doc.text(`- Time Taken: ${timeMinutes}m ${timeSeconds}s`, 10, y);
    y += lineHeight;
    doc.text(`Passing Score: ${QUIZ_CONFIG.PASSING_SCORE}%`, 10, y);
    y += 15;

    // Detailed Questions
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Detailed Questions and Answers:", 10, y);
    y += 10;

    const maxWidth = 190;
    const optionsLetters = ["A", "B", "C", "D"];

    state.questions.forEach((question, index) => {
      if (y > 260) {
        // Leave space for footer
        doc.addPage();
        y = 10;
      }

      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      const questionText = `Question ${index + 1}: ${question.question}`;
      const questionLines = doc.splitTextToSize(questionText, maxWidth);
      doc.text(questionLines, 10, y);
      y += questionLines.length * lineHeight + 3;

      doc.setFont("helvetica", "normal");
      question.options.forEach((option, optIndex) => {
        if (y > 270) {
          doc.addPage();
          y = 10;
        }
        const optionText = `${optionsLetters[optIndex]}. ${option}`;
        const optionLines = doc.splitTextToSize(optionText, 185);
        doc.text(optionLines, 15, y);
        y += optionLines.length * lineHeight;
      });

      if (y > 270) {
        doc.addPage();
        y = 10;
      }
      const correctLetter = optionsLetters[question.correct];
      const correctText = `Correct Answer: ${correctLetter}. ${
        question.options[question.correct]
      }`;
      doc.setTextColor(0, 128, 0); // Green
      const correctLines = doc.splitTextToSize(correctText, maxWidth);
      doc.text(correctLines, 10, y);
      y += correctLines.length * lineHeight + 3;
      doc.setTextColor(0, 0, 0); // Black

      if (y > 270) {
        doc.addPage();
        y = 10;
      }
      const userAnswer = state.userAnswers[index];
      let userText;
      if (userAnswer !== undefined) {
        const userLetter = optionsLetters[userAnswer];
        const status =
          userAnswer === question.correct ? " (Correct)" : " (Incorrect)";
        userText = `Your Answer: ${userLetter}. ${question.options[userAnswer]}${status}`;
      } else {
        userText = "Your Answer: Not Attempted";
      }
      const userLines = doc.splitTextToSize(userText, maxWidth);
      doc.text(userLines, 10, y);
      y += userLines.length * lineHeight + 10;
    });

    // Save the PDF
    doc.save(
      `IQnition-Results-${state.currentUser}-${
        new Date().toISOString().split("T")[0]
      }.pdf`
    );
  } catch (error) {
    console.error("Error downloading results:", error);
    showModal(
      "Error: Failed to download results. Please ensure jsPDF is loaded and try again.",
      null,
      "Download Error"
    );
  }
}

// Initialize when page loads
window.addEventListener("load", () => {
  try {
    init();
  } catch (error) {
    console.error("Error during page load initialization:", error);
    showModal(
      "Error: Failed to load quiz application. Please refresh the page.",
      null,
      "Initialization Error"
    );
  }
});

// Handle errors globally
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});
