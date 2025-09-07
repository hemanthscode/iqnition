export const state = {
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

export function resetState() {
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
}

export function setCurrentUser(name) {
  state.currentUser = name;
  state.startTime = new Date();
}

export function setUserAnswer(questionIndex, answerIndex) {
  state.userAnswers[questionIndex] = answerIndex;
  state.questionStates[questionIndex].answered = true;
}

export function setQuestionVisited(questionIndex) {
  state.questionStates[questionIndex].visited = true;
}
