class QuizApplication {
  constructor() {
    this.state = {
      currentQuestion: 0,
      answers: new Map(),
      bookmarks: new Set(),
      startTime: null,
      examDuration: 45,
      totalQuestions: 50,
      studentName: "",
      isExamStarted: false,
      isExamSubmitted: false,
    };

    this.timer = {
      interval: null,
      remainingTime: 0,
    };

    this.elements = {};
    this.questions = [];

    this.init();
  }

  async init() {
    await this.setupLocalStorage();
    this.cacheElements();
    this.bindEvents();
    await this.loadTheme();
    this.setupQuestions();
    this.resetTimer();
  }

  // Use localStorage instead of IndexedDB for better compatibility
  async setupLocalStorage() {
    try {
      // Test if localStorage is available
      const test = "localStorage-test";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
    } catch (error) {
      console.warn("localStorage not available, using memory storage");
      this.useMemoryStorage = true;
      this.memoryStorage = {};
    }
  }

  setStorageItem(key, value) {
    if (this.useMemoryStorage) {
      this.memoryStorage[key] = value;
    } else {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error("Failed to save to localStorage:", error);
      }
    }
  }

  getStorageItem(key) {
    if (this.useMemoryStorage) {
      return this.memoryStorage[key];
    } else {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error("Failed to read from localStorage:", error);
        return null;
      }
    }
  }

  cacheElements() {
    // Screens
    this.elements.welcomeScreen = document.getElementById("welcomeScreen");
    this.elements.quizScreen = document.getElementById("quizScreen");
    this.elements.reviewScreen = document.getElementById("reviewScreen");
    this.elements.resultsScreen = document.getElementById("resultsScreen");

    // Welcome screen
    this.elements.examDuration = document.getElementById("examDuration");
    this.elements.questionCount = document.getElementById("questionCount");
    this.elements.studentName = document.getElementById("studentName");
    this.elements.startExamBtn = document.getElementById("startExamBtn");

    // Header
    this.elements.questionCounter = document.getElementById("questionCounter");
    this.elements.timerDisplay = document.getElementById("timerDisplay");
    this.elements.timerValue = document.getElementById("timerValue");
    this.elements.themeToggle = document.getElementById("themeToggle");

    // Quiz screen
    this.elements.mobileNavBtn = document.getElementById("mobileNavBtn");
    this.elements.questionSidebar = document.getElementById("questionSidebar");
    this.elements.closeSidebar = document.getElementById("closeSidebar");
    this.elements.sidebarOverlay = document.getElementById("sidebarOverlay");
    this.elements.questionGrid = document.getElementById("questionGrid");
    this.elements.questionNumber = document.getElementById("questionNumber");
    this.elements.questionText = document.getElementById("questionText");
    this.elements.optionsContainer =
      document.getElementById("optionsContainer");
    this.elements.bookmarkBtn = document.getElementById("bookmarkBtn");
    this.elements.clearBtn = document.getElementById("clearBtn");
    this.elements.prevBtn = document.getElementById("prevBtn");
    this.elements.nextBtn = document.getElementById("nextBtn");
    this.elements.reviewBtn = document.getElementById("reviewBtn");

    // Review screen
    this.elements.answeredCount = document.getElementById("answeredCount");
    this.elements.unansweredCount = document.getElementById("unansweredCount");
    this.elements.timeRemaining = document.getElementById("timeRemaining");
    this.elements.reviewGrid = document.getElementById("reviewGrid");
    this.elements.backToQuizBtn = document.getElementById("backToQuizBtn");
    this.elements.submitExamBtn = document.getElementById("submitExamBtn");

    // Results screen
    this.elements.scoreValue = document.getElementById("scoreValue");
    this.elements.resultsTitle = document.getElementById("resultsTitle");
    this.elements.resultsMessage = document.getElementById("resultsMessage");
    this.elements.correctAnswers = document.getElementById("correctAnswers");
    this.elements.incorrectAnswers =
      document.getElementById("incorrectAnswers");
    this.elements.skippedAnswers = document.getElementById("skippedAnswers");
    this.elements.totalTime = document.getElementById("totalTime");
    this.elements.retakeExamBtn = document.getElementById("retakeExamBtn");
    this.elements.downloadResultsBtn =
      document.getElementById("downloadResultsBtn");

    // Modal
    this.elements.modalOverlay = document.getElementById("modalOverlay");
    this.elements.modalTitle = document.getElementById("modalTitle");
    this.elements.modalMessage = document.getElementById("modalMessage");
    this.elements.modalCancel = document.getElementById("modalCancel");
    this.elements.modalConfirm = document.getElementById("modalConfirm");

    // Notification
    this.elements.notificationContainer = document.getElementById(
      "notificationContainer"
    );
  }

  bindEvents() {
    // Theme toggle
    if (this.elements.themeToggle) {
      this.elements.themeToggle.addEventListener("click", () =>
        this.toggleTheme()
      );
    }

    // Welcome screen
    if (this.elements.startExamBtn) {
      this.elements.startExamBtn.addEventListener("click", () =>
        this.startExam()
      );
    }

    // Mobile navigation
    if (this.elements.mobileNavBtn) {
      this.elements.mobileNavBtn.addEventListener("click", () =>
        this.openSidebar()
      );
    }
    if (this.elements.closeSidebar) {
      this.elements.closeSidebar.addEventListener("click", () =>
        this.closeSidebar()
      );
    }
    if (this.elements.sidebarOverlay) {
      this.elements.sidebarOverlay.addEventListener("click", () =>
        this.closeSidebar()
      );
    }

    // Navigation
    if (this.elements.prevBtn) {
      this.elements.prevBtn.addEventListener("click", () =>
        this.navigateQuestion(-1)
      );
    }
    if (this.elements.nextBtn) {
      this.elements.nextBtn.addEventListener("click", () =>
        this.navigateQuestion(1)
      );
    }

    // Question actions
    if (this.elements.bookmarkBtn) {
      this.elements.bookmarkBtn.addEventListener("click", () =>
        this.toggleBookmark()
      );
    }
    if (this.elements.clearBtn) {
      this.elements.clearBtn.addEventListener("click", () =>
        this.clearCurrentAnswer()
      );
    }

    // Review and submit
    if (this.elements.reviewBtn) {
      this.elements.reviewBtn.addEventListener("click", () =>
        this.showReviewScreen()
      );
    }
    if (this.elements.backToQuizBtn) {
      this.elements.backToQuizBtn.addEventListener("click", () =>
        this.showQuizScreen()
      );
    }
    if (this.elements.submitExamBtn) {
      this.elements.submitExamBtn.addEventListener("click", () =>
        this.submitExam()
      );
    }

    // Results actions
    if (this.elements.retakeExamBtn) {
      this.elements.retakeExamBtn.addEventListener("click", () =>
        this.retakeExam()
      );
    }
    if (this.elements.downloadResultsBtn) {
      this.elements.downloadResultsBtn.addEventListener("click", () =>
        this.downloadResults()
      );
    }

    // Modal
    if (this.elements.modalCancel) {
      this.elements.modalCancel.addEventListener("click", () =>
        this.hideModal()
      );
    }
    if (this.elements.modalOverlay) {
      this.elements.modalOverlay.addEventListener("click", (e) => {
        if (e.target === this.elements.modalOverlay) {
          this.hideModal();
        }
      });
    }

    // Delegated event listeners for grids
    if (this.elements.questionGrid) {
      this.elements.questionGrid.addEventListener("click", (e) => {
        const tile = e.target.closest(".question-tile");
        if (tile) {
          const index = Array.from(this.elements.questionGrid.children).indexOf(
            tile
          );
          this.goToQuestion(index);
          this.closeSidebar();
        }
      });
    }

    if (this.elements.reviewGrid) {
      this.elements.reviewGrid.addEventListener("click", (e) => {
        const item = e.target.closest(".review-item");
        if (item) {
          const index = Array.from(this.elements.reviewGrid.children).indexOf(
            item
          );
          this.goToQuestion(index);
          this.showScreen("quiz");
        }
      });
    }

    // Options container event delegation - FIXED
    if (this.elements.optionsContainer) {
      this.elements.optionsContainer.addEventListener("click", (e) => {
        const option = e.target.closest(".option");
        if (option) {
          const index = Array.from(
            this.elements.optionsContainer.children
          ).indexOf(option);
          this.selectOption(index);
        }
      });
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => this.handleKeyPress(e));

    // Prevent page unload during exam
    window.addEventListener("beforeunload", (e) => {
      if (this.state.isExamStarted && !this.state.isExamSubmitted) {
        e.preventDefault();
        e.returnValue =
          "You have an exam in progress. Are you sure you want to leave?";
      }
    });

    // Debounced resize handler
    this.handleResize = this.debounce(this.handleResize.bind(this), 100);
    window.addEventListener("resize", this.handleResize);
  }

  debounce(fn, ms) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), ms);
    };
  }

  setupQuestions() {
    try {
      if (!window.quizQuestions || !Array.isArray(window.quizQuestions)) {
        throw new Error("Invalid or missing quiz questions");
      }

      // Clean and sanitize questions
      this.questions = window.quizQuestions.map((q) => ({
        ...q,
        question: this.sanitizeText(q.question),
        options: q.options.map((opt) => this.sanitizeText(opt)),
      }));

      console.log("Loaded questions:", this.questions.length);
    } catch (error) {
      console.error("Failed to load questions:", error);
      this.showNotification(
        "danger",
        "Failed to load questions. Using fallback."
      );
      this.questions = this.getFallbackQuestions();
    }
  }

  // Simple text sanitization
  sanitizeText(text) {
    if (typeof text !== "string") return String(text);
    return text
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  getFallbackQuestions() {
    const topics = [
      "HTML",
      "CSS",
      "JavaScript",
      "Web Development",
      "Programming",
    ];
    const questions = [];

    for (let i = 1; i <= 50; i++) {
      const topic = topics[Math.floor(Math.random() * topics.length)];
      questions.push({
        id: i,
        question: `${topic} Question ${i}: Which of the following is correct about ${topic}?`,
        options: [
          `Option A for ${topic} question ${i}`,
          `Option B for ${topic} question ${i}`,
          `Option C for ${topic} question ${i}`,
          `Option D for ${topic} question ${i}`,
        ],
        correct: Math.floor(Math.random() * 4),
      });
    }

    return questions;
  }

  async loadTheme() {
    try {
      const theme = this.getStorageItem("quiz-theme") || "light";
      document.documentElement.setAttribute("data-theme", theme);
      if (this.elements.themeToggle) {
        this.elements.themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
      }
    } catch (error) {
      console.error("Failed to load theme:", error);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }

  async toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    const newTheme = currentTheme === "dark" ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", newTheme);
    if (this.elements.themeToggle) {
      this.elements.themeToggle.textContent = newTheme === "dark" ? "☀️" : "🌙";
    }

    this.setStorageItem("quiz-theme", newTheme);
    this.showNotification(
      "success",
      `${newTheme === "dark" ? "Dark" : "Light"} theme activated`
    );
  }

  resetTimer() {
    if (this.timer.interval) {
      clearInterval(this.timer.interval);
      this.timer.interval = null;
    }

    this.timer.remainingTime = 0;
    if (this.elements.timerValue) {
      this.elements.timerValue.textContent = "--:--";
    }
    if (this.elements.timerDisplay) {
      this.elements.timerDisplay.classList.remove("warning", "danger");
    }
    if (this.elements.questionCounter) {
      this.elements.questionCounter.textContent = "Ready to Start";
    }
  }

  async startExam() {
    try {
      // Get values with fallbacks
      this.state.examDuration = parseInt(
        this.elements.examDuration?.value || "45"
      );
      this.state.totalQuestions = parseInt(
        this.elements.questionCount?.value || "50"
      );
      this.state.studentName = this.sanitizeText(
        this.elements.studentName?.value?.trim() || "Anonymous"
      );

      if (this.state.totalQuestions > this.questions.length) {
        this.showNotification(
          "warning",
          `Only ${this.questions.length} questions available`
        );
        this.state.totalQuestions = this.questions.length;
      }

      // Shuffle and select questions
      this.questions = this.shuffleArray([...this.questions]).slice(
        0,
        this.state.totalQuestions
      );

      // Reset state
      this.state.isExamStarted = true;
      this.state.isExamSubmitted = false;
      this.state.startTime = new Date();
      this.state.currentQuestion = 0;
      this.state.answers.clear();
      this.state.bookmarks.clear();

      // Start timer
      this.timer.remainingTime = this.state.examDuration * 60;
      this.startTimer();

      // Setup UI
      this.generateQuestionGrid();
      this.showScreen("quiz");
      this.loadQuestion();

      this.showNotification("success", "Exam started! Good luck!");
    } catch (error) {
      console.error("Failed to start exam:", error);
      this.showNotification("danger", "Failed to start exam");
    }
  }

  startTimer() {
    if (this.timer.interval) {
      clearInterval(this.timer.interval);
    }

    this.timer.interval = setInterval(() => {
      this.timer.remainingTime--;
      this.updateTimerDisplay();

      if (this.timer.remainingTime <= 0) {
        this.handleTimeUp();
      }
    }, 1000);
  }

  updateTimerDisplay() {
    const minutes = Math.floor(this.timer.remainingTime / 60);
    const seconds = this.timer.remainingTime % 60;
    const timeString = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;

    if (this.elements.timerValue) {
      this.elements.timerValue.textContent = timeString;
    }

    if (this.elements.timerDisplay) {
      this.elements.timerDisplay.classList.remove("warning", "danger");

      if (this.timer.remainingTime <= 300) {
        // 5 minutes
        this.elements.timerDisplay.classList.add("danger");
      } else if (this.timer.remainingTime <= 600) {
        // 10 minutes
        this.elements.timerDisplay.classList.add("warning");
      }
    }
  }

  handleTimeUp() {
    this.stopTimer();
    this.showModal(
      "Time Up!",
      "The exam time has expired. Your exam will be submitted automatically.",
      () => this.forceSubmitExam()
    );
  }

  stopTimer() {
    if (this.timer.interval) {
      clearInterval(this.timer.interval);
      this.timer.interval = null;
    }
  }

  generateQuestionGrid() {
    if (!this.elements.questionGrid) return;

    this.elements.questionGrid.innerHTML = "";

    for (let i = 0; i < this.state.totalQuestions; i++) {
      const tile = document.createElement("button");
      tile.className = "question-tile";
      tile.textContent = i + 1;
      tile.setAttribute("aria-label", `Go to question ${i + 1}`);
      this.elements.questionGrid.appendChild(tile);
    }

    this.updateQuestionGrid();
  }

  updateQuestionGrid() {
    if (!this.elements.questionGrid) return;

    const tiles = this.elements.questionGrid.querySelectorAll(".question-tile");

    tiles.forEach((tile, index) => {
      tile.classList.remove("current", "answered", "bookmarked");

      if (index === this.state.currentQuestion) {
        tile.classList.add("current");
      }

      if (this.state.answers.has(index)) {
        tile.classList.add("answered");
      }

      if (this.state.bookmarks.has(index)) {
        tile.classList.add("bookmarked");
      }
    });
  }

  loadQuestion() {
    try {
      if (
        this.state.currentQuestion >= this.questions.length ||
        this.state.currentQuestion < 0
      ) {
        console.error("Invalid question index:", this.state.currentQuestion);
        return;
      }

      const question = this.questions[this.state.currentQuestion];

      // Update question display
      if (this.elements.questionNumber) {
        this.elements.questionNumber.textContent = `Question ${
          this.state.currentQuestion + 1
        }`;
      }
      if (this.elements.questionText) {
        this.elements.questionText.innerHTML = question.question;
      }
      if (this.elements.questionCounter) {
        this.elements.questionCounter.textContent = `Question ${
          this.state.currentQuestion + 1
        } of ${this.state.totalQuestions}`;
      }

      // Generate options - FIXED
      this.generateOptions(question.options);

      // Update UI states
      this.updateNavigationButtons();
      this.updateBookmarkButton();
      this.updateQuestionGrid();

      // Restore selected option if exists
      if (this.state.answers.has(this.state.currentQuestion)) {
        const selectedOption = this.state.answers.get(
          this.state.currentQuestion
        );
        this.selectOption(selectedOption, false);
      }
    } catch (error) {
      console.error("Failed to load question:", error);
      this.showNotification("danger", "Failed to load question");
    }
  }

  // FIXED: generateOptions method
  generateOptions(options) {
    if (!this.elements.optionsContainer) return;

    this.elements.optionsContainer.innerHTML = "";

    options.forEach((optionText, index) => {
      const option = document.createElement("div");
      option.className = "option";
      option.dataset.index = index;
      option.setAttribute("role", "button");
      option.setAttribute("tabindex", "0");
      option.setAttribute(
        "aria-label",
        `Option ${String.fromCharCode(65 + index)}: ${optionText}`
      );

      // Create radio button indicator
      const radio = document.createElement("div");
      radio.className = "option-radio";

      // Create option text
      const text = document.createElement("div");
      text.className = "option-text";
      text.innerHTML = `<strong>${String.fromCharCode(
        65 + index
      )}.</strong> ${optionText}`;

      // Append both to option
      option.appendChild(radio);
      option.appendChild(text);

      // Add keyboard support
      option.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this.selectOption(index);
        }
      });

      this.elements.optionsContainer.appendChild(option);
    });
  }

  selectOption(optionIndex, showFeedback = true) {
    try {
      if (!this.elements.optionsContainer) return;

      const currentQuestion = this.questions[this.state.currentQuestion];
      if (optionIndex < 0 || optionIndex >= currentQuestion.options.length) {
        console.error("Invalid option index:", optionIndex);
        return;
      }

      // Remove previous selection
      this.elements.optionsContainer
        .querySelectorAll(".option")
        .forEach((option) => {
          option.classList.remove("selected");
        });

      // Add selection to chosen option
      const selectedOption =
        this.elements.optionsContainer.children[optionIndex];
      if (selectedOption) {
        selectedOption.classList.add("selected");
      }

      // Save answer
      this.state.answers.set(this.state.currentQuestion, optionIndex);

      // Update UI
      this.updateQuestionGrid();
      this.updateNavigationButtons();

      if (showFeedback) {
        this.showNotification(
          "success",
          `Option ${String.fromCharCode(65 + optionIndex)} selected`
        );
      }

      // Save state
      this.saveExamState();
    } catch (error) {
      console.error("Error selecting option:", error);
      this.showNotification("danger", "Failed to save answer");
    }
  }

  navigateQuestion(direction) {
    const newQuestion = this.state.currentQuestion + direction;

    if (newQuestion >= 0 && newQuestion < this.state.totalQuestions) {
      this.goToQuestion(newQuestion);
    }
  }

  goToQuestion(questionIndex) {
    if (questionIndex >= 0 && questionIndex < this.state.totalQuestions) {
      this.state.currentQuestion = questionIndex;
      this.loadQuestion();
    }
  }

  toggleBookmark() {
    try {
      if (this.state.bookmarks.has(this.state.currentQuestion)) {
        this.state.bookmarks.delete(this.state.currentQuestion);
        this.showNotification("success", "Bookmark removed");
      } else {
        this.state.bookmarks.add(this.state.currentQuestion);
        this.showNotification("success", "Question bookmarked");
      }

      this.updateBookmarkButton();
      this.updateQuestionGrid();
      this.saveExamState();
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
      this.showNotification("danger", "Failed to toggle bookmark");
    }
  }

  updateBookmarkButton() {
    if (!this.elements.bookmarkBtn) return;

    if (this.state.bookmarks.has(this.state.currentQuestion)) {
      this.elements.bookmarkBtn.classList.add("active");
    } else {
      this.elements.bookmarkBtn.classList.remove("active");
    }
  }

  clearCurrentAnswer() {
    try {
      this.state.answers.delete(this.state.currentQuestion);

      if (this.elements.optionsContainer) {
        this.elements.optionsContainer
          .querySelectorAll(".option")
          .forEach((option) => {
            option.classList.remove("selected");
          });
      }

      this.updateQuestionGrid();
      this.updateNavigationButtons();
      this.showNotification("success", "Answer cleared");
      this.saveExamState();
    } catch (error) {
      console.error("Failed to clear answer:", error);
      this.showNotification("danger", "Failed to clear answer");
    }
  }

  updateNavigationButtons() {
    if (this.elements.prevBtn) {
      this.elements.prevBtn.disabled = this.state.currentQuestion === 0;
    }
    if (this.elements.nextBtn) {
      this.elements.nextBtn.disabled =
        this.state.currentQuestion === this.state.totalQuestions - 1;
    }
  }

  openSidebar() {
    if (this.elements.questionSidebar) {
      this.elements.questionSidebar.classList.add("open");
    }
    if (this.elements.sidebarOverlay) {
      this.elements.sidebarOverlay.classList.add("active");
    }
  }

  closeSidebar() {
    if (this.elements.questionSidebar) {
      this.elements.questionSidebar.classList.remove("open");
    }
    if (this.elements.sidebarOverlay) {
      this.elements.sidebarOverlay.classList.remove("active");
    }
  }

  showReviewScreen() {
    this.updateReviewStats();
    this.generateReviewGrid();
    this.showScreen("review");
  }

  updateReviewStats() {
    const answered = this.state.answers.size;
    const unanswered = this.state.totalQuestions - answered;

    if (this.elements.answeredCount) {
      this.elements.answeredCount.textContent = answered;
    }
    if (this.elements.unansweredCount) {
      this.elements.unansweredCount.textContent = unanswered;
    }

    if (this.elements.timeRemaining) {
      const minutes = Math.floor(this.timer.remainingTime / 60);
      const seconds = this.timer.remainingTime % 60;
      this.elements.timeRemaining.textContent = `${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
  }

  generateReviewGrid() {
    if (!this.elements.reviewGrid) return;

    this.elements.reviewGrid.innerHTML = "";

    for (let i = 0; i < this.state.totalQuestions; i++) {
      const item = document.createElement("button");
      item.className = "review-item";
      item.textContent = i + 1;
      item.setAttribute("aria-label", `Review question ${i + 1}`);

      if (this.state.answers.has(i)) {
        item.classList.add("answered");
      } else {
        item.classList.add("unanswered");
      }

      this.elements.reviewGrid.appendChild(item);
    }
  }

  showQuizScreen() {
    this.showScreen("quiz");
    this.loadQuestion();
  }

  submitExam() {
    const unanswered = this.state.totalQuestions - this.state.answers.size;

    if (unanswered > 0) {
      this.showModal(
        "Submit Exam?",
        `You have ${unanswered} unanswered questions. Are you sure you want to submit?`,
        () => this.forceSubmitExam()
      );
    } else {
      this.showModal(
        "Submit Exam?",
        "Are you sure you want to submit your exam? This action cannot be undone.",
        () => this.forceSubmitExam()
      );
    }
  }

  forceSubmitExam() {
    this.state.isExamSubmitted = true;
    this.stopTimer();
    this.calculateResults();
    this.showScreen("results");
    this.showNotification("success", "Exam submitted successfully!");
  }

  calculateResults() {
    let correct = 0;
    let incorrect = 0;
    let skipped = 0;

    for (let i = 0; i < this.state.totalQuestions; i++) {
      if (this.state.answers.has(i)) {
        const userAnswer = this.state.answers.get(i);
        const correctAnswer = this.questions[i].correct;

        if (userAnswer === correctAnswer) {
          correct++;
        } else {
          incorrect++;
        }
      } else {
        skipped++;
      }
    }

    const percentage = Math.round((correct / this.state.totalQuestions) * 100);
    const timeUsed = this.state.examDuration * 60 - this.timer.remainingTime;
    const timeUsedMinutes = Math.floor(timeUsed / 60);

    // Update results display
    if (this.elements.scoreValue) {
      this.elements.scoreValue.textContent = `${percentage}%`;
    }
    if (this.elements.correctAnswers) {
      this.elements.correctAnswers.textContent = correct;
    }
    if (this.elements.incorrectAnswers) {
      this.elements.incorrectAnswers.textContent = incorrect;
    }
    if (this.elements.skippedAnswers) {
      this.elements.skippedAnswers.textContent = skipped;
    }
    if (this.elements.totalTime) {
      this.elements.totalTime.textContent = `${timeUsedMinutes}m`;
    }

    // Set performance message
    let title, message;
    if (percentage >= 90) {
      title = "Excellent Performance!";
      message =
        "Outstanding work! You have demonstrated exceptional knowledge.";
    } else if (percentage >= 80) {
      title = "Great Job!";
      message = "Well done! You have a strong understanding of the material.";
    } else if (percentage >= 70) {
      title = "Good Work!";
      message = "Nice effort! You have a good grasp of the concepts.";
    } else if (percentage >= 60) {
      title = "Satisfactory Performance";
      message =
        "You passed! Consider reviewing the material for better understanding.";
    } else {
      title = "Keep Learning!";
      message =
        "Don't be discouraged. Learning is a journey - keep practicing!";
    }

    if (this.elements.resultsTitle) {
      this.elements.resultsTitle.textContent = title;
    }
    if (this.elements.resultsMessage) {
      this.elements.resultsMessage.textContent = message;
    }

    this.animateScore(percentage);
  }

  animateScore(targetPercentage) {
    if (!this.elements.scoreValue) return;

    let currentPercentage = 0;
    const increment = targetPercentage / 50;

    const animation = setInterval(() => {
      currentPercentage += increment;

      if (currentPercentage >= targetPercentage) {
        currentPercentage = targetPercentage;
        clearInterval(animation);
      }

      this.elements.scoreValue.textContent = `${Math.round(
        currentPercentage
      )}%`;
    }, 30);
  }

  retakeExam() {
    this.showModal(
      "Retake Exam?",
      "This will start a new exam and discard your current results.",
      () => {
        this.resetExamCompletely();
        this.showScreen("welcome");
      }
    );
  }

  async resetExamCompletely() {
    try {
      this.stopTimer();
      this.resetTimer();

      this.state = {
        currentQuestion: 0,
        answers: new Map(),
        bookmarks: new Set(),
        startTime: null,
        examDuration: 45,
        totalQuestions: 50,
        studentName: "",
        isExamStarted: false,
        isExamSubmitted: false,
      };

      // Clear saved state
      this.setStorageItem("quiz-exam-state", null);

      // Reset form values
      if (this.elements.examDuration) {
        this.elements.examDuration.value = "45";
      }
      if (this.elements.questionCount) {
        this.elements.questionCount.value = "50";
      }
      if (this.elements.studentName) {
        this.elements.studentName.value = "";
      }

      this.closeSidebar();
    } catch (error) {
      console.error("Failed to reset exam:", error);
      this.showNotification("danger", "Failed to reset exam");
    }
  }

  downloadResults() {
    try {
      const results = {
        studentName: this.state.studentName || "Anonymous",
        examDate: new Date().toLocaleDateString(),
        examTime: new Date().toLocaleTimeString(),
        totalQuestions: this.state.totalQuestions,
        correct: parseInt(this.elements.correctAnswers?.textContent || "0"),
        incorrect: parseInt(this.elements.incorrectAnswers?.textContent || "0"),
        skipped: parseInt(this.elements.skippedAnswers?.textContent || "0"),
        score: this.elements.scoreValue?.textContent || "0%",
        timeUsed: this.elements.totalTime?.textContent || "0m",
        examDuration: `${this.state.examDuration}m`,
      };

      const dataStr = JSON.stringify(results, null, 2);
      const dataBlob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(dataBlob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `quiz-results-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      this.showNotification("success", "Results downloaded!");
    } catch (error) {
      console.error("Failed to download results:", error);
      this.showNotification("danger", "Failed to download results");
    }
  }

  saveExamState() {
    if (this.state.isExamStarted && !this.state.isExamSubmitted) {
      try {
        const examState = {
          currentQuestion: this.state.currentQuestion,
          answers: Array.from(this.state.answers.entries()),
          bookmarks: Array.from(this.state.bookmarks),
          remainingTime: this.timer.remainingTime,
          startTime: this.state.startTime,
          examDuration: this.state.examDuration,
          totalQuestions: this.state.totalQuestions,
          studentName: this.state.studentName,
        };

        this.setStorageItem("quiz-exam-state", examState);
      } catch (error) {
        console.error("Failed to save exam state:", error);
      }
    }
  }

  async loadExamState() {
    try {
      const savedState = this.getStorageItem("quiz-exam-state");
      if (savedState) {
        this.state.currentQuestion = savedState.currentQuestion || 0;
        this.state.answers = new Map(savedState.answers || []);
        this.state.bookmarks = new Set(savedState.bookmarks || []);
        this.timer.remainingTime = savedState.remainingTime || 0;
        this.state.startTime = savedState.startTime
          ? new Date(savedState.startTime)
          : null;
        this.state.examDuration = savedState.examDuration || 45;
        this.state.totalQuestions = savedState.totalQuestions || 50;
        this.state.studentName = savedState.studentName || "";

        return true;
      }
    } catch (error) {
      console.error("Failed to load exam state:", error);
    }
    return false;
  }

  handleResize() {
    if (window.innerWidth >= 1024) {
      this.closeSidebar();
    }
  }

  showScreen(screenName) {
    // Hide all screens
    document.querySelectorAll(".screen").forEach((screen) => {
      screen.classList.remove("active");
    });

    // Show target screen
    const targetScreen = this.elements[`${screenName}Screen`];
    if (targetScreen) {
      targetScreen.classList.add("active");
    }

    // Special handling for welcome screen
    if (screenName === "welcome") {
      this.resetTimer();
    }
  }

  showModal(title, message, onConfirm) {
    if (!this.elements.modalOverlay) return;

    if (this.elements.modalTitle) {
      this.elements.modalTitle.textContent = title;
    }
    if (this.elements.modalMessage) {
      this.elements.modalMessage.textContent = message;
    }

    this.elements.modalOverlay.classList.add("active");

    // Remove existing event listeners and add new one
    if (this.elements.modalConfirm) {
      const newConfirmBtn = this.elements.modalConfirm.cloneNode(true);
      this.elements.modalConfirm.parentNode.replaceChild(
        newConfirmBtn,
        this.elements.modalConfirm
      );
      this.elements.modalConfirm = newConfirmBtn;

      this.elements.modalConfirm.addEventListener("click", () => {
        this.hideModal();
        if (onConfirm) onConfirm();
      });
    }
  }

  hideModal() {
    if (this.elements.modalOverlay) {
      this.elements.modalOverlay.classList.remove("active");
    }
  }

  showNotification(type, message) {
    if (!this.elements.notificationContainer) {
      console.log(`${type.toUpperCase()}: ${message}`);
      return;
    }

    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.setAttribute("role", "alert");
    notification.setAttribute("aria-live", "polite");

    const icons = {
      success: "✅",
      warning: "⚠️",
      danger: "❌",
      info: "ℹ️",
    };

    notification.innerHTML = `
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <span class="notification-text">${this.sanitizeText(message)}</span>
        `;

    this.elements.notificationContainer.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add("show"), 100);

    // Hide and remove notification
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 4000);
  }

  handleKeyPress(event) {
    if (this.elements.quizScreen?.classList.contains("active")) {
      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          if (!this.elements.prevBtn?.disabled) {
            this.navigateQuestion(-1);
          }
          break;
        case "ArrowRight":
          event.preventDefault();
          if (!this.elements.nextBtn?.disabled) {
            this.navigateQuestion(1);
          }
          break;
        case "1":
        case "2":
        case "3":
        case "4":
          event.preventDefault();
          const optionIndex = parseInt(event.key) - 1;
          if (this.elements.optionsContainer?.children[optionIndex]) {
            this.selectOption(optionIndex);
          }
          break;
        case "a":
        case "A":
          event.preventDefault();
          this.selectOption(0);
          break;
        case "b":
        case "B":
          event.preventDefault();
          this.selectOption(1);
          break;
        case "c":
        case "C":
          event.preventDefault();
          this.selectOption(2);
          break;
        case "d":
        case "D":
          event.preventDefault();
          this.selectOption(3);
          break;
        case "Escape":
          event.preventDefault();
          this.closeSidebar();
          break;
      }
    }

    // Global shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case "s":
          event.preventDefault();
          this.saveExamState();
          this.showNotification("success", "Progress saved");
          break;
      }
    }
  }

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Utility method for debugging
  getState() {
    return {
      currentQuestion: this.state.currentQuestion,
      totalQuestions: this.state.totalQuestions,
      answeredCount: this.state.answers.size,
      bookmarkedCount: this.state.bookmarks.size,
      remainingTime: this.timer.remainingTime,
      isExamStarted: this.state.isExamStarted,
      isExamSubmitted: this.state.isExamSubmitted,
    };
  }
}

// Initialize application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  try {
    window.quizApp = new QuizApplication();
    console.log("Quiz Application initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Quiz Application:", error);

    // Show fallback error message
    document.body.innerHTML = `
            <div style="display: flex; justify-content: center; align-items: center; height: 100vh; font-family: Arial, sans-serif;">
                <div style="text-align: center; padding: 2rem; background: #f8f9fa; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                    <h2 style="color: #dc3545; margin-bottom: 1rem;">⚠️ Application Error</h2>
                    <p style="color: #6c757d; margin-bottom: 1rem;">The quiz application failed to load properly.</p>
                    <button onclick="window.location.reload()" style="padding: 0.5rem 1rem; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Reload Page
                    </button>
                </div>
            </div>
        `;
  }
});
