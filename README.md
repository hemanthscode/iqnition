<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=200&section=header&text=IQnition&fontSize=50&animation=fadeIn" alt="Header" />
  
  [![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&pause=1000&color=36BCF7&center=true&vCenter=true&width=435&lines=Engage.+Learn.+Excel.;Interactive+Quiz+Platformy)](https://git.io/typing-svg)
  
  ![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Chart.js](https://img.shields.io/badge/chart.js-F5788D.svg?style=for-the-badge&logo=chart.js&logoColor=white) ![jsPDF](https://img.shields.io/badge/jsPDF-FF6B6B.svg?style=for-the-badge)
  
  ![GitHub stars](https://img.shields.io/github/stars/hemanthscode/iqnition?style=social) ![GitHub forks](https://img.shields.io/github/forks/hemanthscode/iqnition?style=social)
</div>

## 📚 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [File Structure](#file-structure)
- [Customization](#customization)
- [Browser Support](#browser-support)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## ✨ Overview

IQnition is a **dynamic, accessible, and responsive quiz platform** designed to elevate learning experiences, with a focus on UPSC General Knowledge assessments. Built with **vanilla HTML, CSS, and JavaScript**, it combines modern web practices, seamless usability, and robust performance to deliver an engaging and effective quiz-taking experience.

> **Why IQnition?** Adaptive question delivery, real-time analytics, and professional reporting make it ideal for learners and educators alike.

## 🚀 Features

### 🎯 Core Functionality

- **Adaptive Quiz Engine** 🧠: Configurable question generation with dynamic parameters.
- **Smart Timer System** ⏱️: Visual countdown with color-coded warnings and auto-submission.
- **Intelligent Navigation** 🗺️: Grid-based navigation with clear status indicators (answered, visited, remaining).
- **Real-time Progress Tracking** 📊: Live updates on quiz progress for better time management.
- **Comprehensive Results** 📈: Detailed analytics with doughnut charts and downloadable PDF reports.

### 🌟 User Experience

- **Responsive Design** 📱💻: Optimized for all devices—desktop, tablet, and mobile.
- **Accessibility Compliant** ♿: ARIA labels, keyboard navigation, and screen reader support.
- **Progressive Enhancement** 🌐: Graceful degradation for older browsers.
- **Visual Feedback** ✨: Smooth animations for state transitions and interactions.
- **Mobile-First Navigation** 📲: Collapsible sidebar with touch-friendly controls.

### 🔒 Security & Performance

- **CSRF Protection** 🔐: Token-based security for form submissions.
- **Input Sanitization** 🛡️: XSS prevention and robust data validation.
- **Error Handling** ⚠️: User-friendly error messages with graceful recovery.
- **Performance Optimized** ⚡: Minimal dependencies and efficient DOM manipulation.

## 📦 Installation

### Prerequisites

- Modern web browser (Chrome 70+, Firefox 65+, Safari 12+, Edge 80+)
- Local web server (e.g., Python's `http.server`, Node.js `serve`, or PHP server)

### Quick Start

1. **Clone the repository**:

   ```bash
   git clone https://github.com/hemanthscode/iqnition.git
   cd iqnition
   ```

2. **Serve the files**:

   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve .

   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**:
   ```
   http://localhost:8000
   ```

### Production Deployment

Upload all files to your web server. IQnition is a static application, requiring no server-side processing.

## 🎮 Usage

### Taking a Quiz

1. **Enter your name** on the welcome screen.
2. **Review quiz details** (question count, time limit, instructions).
3. **Click "Start Quiz"** to begin.
4. **Navigate questions** using:
   - Next/Previous buttons
   - Question navigation grid
   - Keyboard arrows (←/→)
   - Number keys (1-4) for answer selection
5. **Submit** manually or let the timer auto-submit.

### Navigation Features

- **Question Grid**:
  - 🟥 Gray: Not visited
  - 🟨 Yellow: Current question
  - 🟩 Green: Answered
  - 🟦 Blue: Visited but unanswered
- **Mobile Navigation**: Tap hamburger menu for touch-friendly controls.
- **Keyboard Shortcuts**: Arrow keys for navigation, number keys for answers.

### Results Analysis

- **Performance Metrics**: Breakdown of correct, incorrect, and unattempted questions.
- **Visual Chart**: Doughnut chart showing result distribution.
- **Score Calculation**: Percentage-based with pass/fail status.
- **PDF Export**: Detailed report with question breakdowns and answers.

## ⚙️ Configuration

### Quiz Settings

Modify `questions.js` to adjust quiz parameters:

```javascript
const QUIZ_CONFIG = {
  TOTAL_QUESTIONS: 20, // Number of questions
  TIME_LIMIT: 1200, // Time in seconds (20 minutes)
  QUESTIONS_PER_ROW_DESKTOP: 5, // Desktop navigation grid
  QUESTIONS_PER_ROW_MOBILE: 3, // Mobile navigation grid
  PASSING_SCORE: 60, // Passing percentage
  APP_NAME: "IQnition", // Application name
  TOPIC: "UPSC General Knowledge", // Quiz topic
};
```

### Adding Questions

Add to the `QUESTION_BANK` array in `questions.js`:

```javascript
{
  question: "Your question text here?",
  options: [
    "Option A",
    "Option B",
    "Option C",
    "Option D"
  ],
  correct: 0  // Index of correct answer (0-3)
}
```

### Styling Customization

Edit CSS variables in `styles.css`:

```css
:root {
  --bg-primary: #ffffff;
  --text-primary: #111827;
  --accent-start: #a78bfa;
  --accent-end: #6366f1;
}
```

## 📂 File Structure

```
iqnition/
├── index.html          # Main application markup
├── styles.css         # Application styles and themes
├── script.js          # Core application logic
├── questions.js       # Question bank and configuration
└── README.md          # Project documentation
```

### Key Components

- **index.html**: Semantic HTML with accessibility features.
- **styles.css**: Modern CSS with custom properties and responsive design.
- **script.js**: Modular JavaScript with state management and error handling.
- **questions.js**: Configurable question bank with validation.

## 🎨 Customization

### Themes

Create new themes by overriding CSS variables:

```css
/* Dark theme example */
[data-theme="dark"] {
  --bg-primary: #1f2937;
  --text-primary: #f9fafb;
  --bg-body: linear-gradient(to bottom right, #111827, #1f2937);
}
```

### Question Types

Supports multiple-choice questions with 4 options. Extensible architecture for additional question types.

### Localization

User-facing text in JavaScript files is easily modifiable for localization.

## 🌐 Browser Support

| Browser | Minimum Version |
| ------- | --------------- |
| Chrome  | 70+             |
| Firefox | 65+             |
| Safari  | 12+             |
| Edge    | 80+             |

### Required Features

- ES6+ JavaScript
- CSS Grid and Flexbox
- Fetch API
- LocalStorage/SessionStorage
- Canvas API (for charts)

## 🤝 Contributing

We welcome contributions! Follow these steps:

1. **Fork the repository**.
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make changes**:
   - Use semantic HTML5.
   - Follow BEM CSS methodology.
   - Add descriptive comments.
   - Test across browsers.
4. **Commit changes**:
   ```bash
   git commit -m 'Add amazing feature'
   ```
5. **Push to your branch**:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**.

### Development Guidelines

- Maintain semantic HTML5 structure.
- Use BEM for new CSS styles.
- Write clear commit messages.
- Test accessibility with screen readers.
- Ensure mobile responsiveness.

## 📄 License

Licensed under the MIT License. See the [LICENSE](https://github.com/hemanthscode/iqnition/blob/main/LICENSE) file for details.

## 🆘 Support

- **Report Bugs**: [GitHub Issues](https://github.com/hemanthscode/iqnition/issues)
- **Request Features**: [GitHub Issues](https://github.com/hemanthscode/iqnition/issues)
- **Documentation**: [GitHub Wiki](https://github.com/hemanthscode/iqnition/wiki)

---

<div align="center">
  <strong>Built with ❤️ for better learning experiences</strong>
  
  [![GitHub followers](https://img.shields.io/github/followers/hemanthscode?style=social)](https://github.com/hemanthscode)
</div>
