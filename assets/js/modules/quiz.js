import { state, setUserAnswer, setQuestionVisited } from './state.js';
import { elements, showModal } from './dom.js';
import { updateNavigationTile, updateAllNavigationTiles } from './navigation.js';
import { escapeHtml } from './utils.js';

export function generateQuestions() {
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
        showModal("Error: Invalid question format detected. Please contact support.");
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
    showModal("Error: Failed to generate questions. Please refresh and try again.");
    return false;
  }
}

export function loadQuestion(index) {
  try {
    if (index < 0 || index >= state.questions.length) {
      showModal("Invalid question index. Please try again.", null, "Error");
      return;
    }
    
    state.currentQuestion = index;
    const question = state.questions[index];
    
    if (!question) {
      console.error(`Question not found at index: ${index}`);
      showModal("Failed to load question. Please try again or contact support.", null, "Error");
      return;
    }
    
    setQuestionVisited(index);
    
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
    showModal("Failed to load question. Please try again or contact support.", null, "Error");
  }
}

export function loadQuestionOptions(question, questionIndex) {
  try {
    if (!elements.optionsContainer || !question.options || !Array.isArray(question.options)) return;
    
    const fragment = document.createDocumentFragment();
    const currentOptions = elements.optionsContainer.children;
    const optionCount = question.options.length;
    
    question.options.forEach((option, optionIndex) => {
      let button = currentOptions[optionIndex] || document.createElement("button");
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
      button.setAttribute("aria-current", state.userAnswers[questionIndex] === optionIndex ? "true" : "false");
      
      fragment.appendChild(button);
    });
    
    while (elements.optionsContainer.children.length > optionCount) {
      elements.optionsContainer.removeChild(elements.optionsContainer.lastChild);
    }
    
    elements.optionsContainer.innerHTML = "";
    elements.optionsContainer.appendChild(fragment);
  } catch (error) {
    console.error("Error loading question options:", error);
  }
}

export function selectOption(optionIndex, animate = true) {
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
    
    setUserAnswer(state.currentQuestion, optionIndex);
    updateNavigationTile(state.currentQuestion);
  } catch (error) {
    console.error(`Error selecting option ${optionIndex}:`, error);
  }
}

export function nextQuestion() {
  try {
    if (state.currentQuestion < state.questions.length - 1) {
      loadQuestion(state.currentQuestion + 1);
    }
  } catch (error) {
    console.error("Error navigating to next question:", error);
  }
}

export function previousQuestion() {
  try {
    if (state.currentQuestion > 0) {
      loadQuestion(state.currentQuestion - 1);
    }
  } catch (error) {
    console.error("Error navigating to previous question:", error);
  }
}

export function updateControls() {
  try {
    if (elements.prevBtn) {
      elements.prevBtn.disabled = state.currentQuestion === 0;
    }
    if (elements.nextBtn) {
      elements.nextBtn.style.display = state.currentQuestion === state.questions.length - 1 ? "none" : "flex";
    }
  } catch (error) {
    console.error("Error updating controls:", error);
  }
}

export function setupOptionKeyboardNavigation() {
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
