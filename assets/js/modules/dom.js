export const elements = {
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

export function initializeElements() {
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

export function showSection(sectionName) {
  try {
    elements.openingSection.classList.remove("active");
    elements.quizSection.classList.remove("active");
    elements.resultsSection.classList.remove("active");
    
    switch (sectionName) {
      case "opening":
        elements.openingSection.classList.add("active");
        break;
      case "quiz":
        elements.quizSection.classList.add("active");
        break;
      case "results":
        elements.resultsSection.classList.add("active");
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

export function showModal(message, onConfirm = null, title = "Notification") {
  try {
    elements.modalTitle.textContent = title;
    elements.modalMessage.textContent = message;
    elements.modalOverlay.classList.remove("hidden");
    
    const cancelClone = elements.modalCancel.cloneNode(true);
    const confirmClone = elements.modalConfirm.cloneNode(true);
    
    elements.modalCancel.parentNode.replaceChild(cancelClone, elements.modalCancel);
    elements.modalConfirm.parentNode.replaceChild(confirmClone, elements.modalConfirm);
    
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

export function updateDynamicContent() {
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
