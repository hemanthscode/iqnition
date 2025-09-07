import { state } from './state.js';
import { elements, showSection, showModal } from './dom.js';

export function calculateResults() {
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

export function showResults() {
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
      elements.resultIcon.className = "w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl";
      elements.resultStatus.textContent = "🎉 Congratulations! You Passed!";
      elements.resultStatus.className = "text-xl font-bold mt-3 text-green-600";
    } else {
      elements.resultIcon.className = "w-24 h-24 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl";
      elements.resultStatus.textContent = "📚 Keep Learning! You Can Do Better!";
      elements.resultStatus.className = "text-xl font-bold mt-3 text-orange-600";
    }
    
    setTimeout(createResultChart, 1000);
  } catch (error) {
    console.error("Error showing results:", error);
  }
}

export function createResultChart() {
  try {
    if (!elements.resultChart) {
      console.error("Result chart element not found");
      return;
    }
    
    if (!window.Chart) {
      console.warn("Chart.js not loaded yet, will show results without chart");
      return;
    }
    
    const ctx = elements.resultChart.getContext("2d");
    const results = window.quizResults;
    
    new window.Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Correct", "Incorrect", "Not Attempted"],
        datasets: [{
          data: [results.correct, results.incorrect, results.notAttempted],
          backgroundColor: ["#10B981", "#EF4444", "#9CA3AF"],
          borderWidth: 3,
          borderColor: "#ffffff",
        }],
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
    console.warn("Could not create chart, continuing without it:", error);
  }
}

export function downloadResults() {
  try {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      showModal("PDF library not available. Results cannot be downloaded at this time.", null, "Download Error");
      return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const results = window.quizResults;
    const timeMinutes = Math.floor(results.timeTaken / 60);
    const timeSeconds = results.timeTaken % 60;
    
    const lineHeight = 7;
    let y = 10;
    
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
    doc.text(`- Status: ${results.passed ? "PASSED" : "NEEDS IMPROVEMENT"}`, 10, y);
    y += lineHeight;
    doc.text(`- Time Taken: ${timeMinutes}m ${timeSeconds}s`, 10, y);
    y += lineHeight;
    doc.text(`Passing Score: ${QUIZ_CONFIG.PASSING_SCORE}%`, 10, y);
    
    doc.save(`IQnition-Results-${state.currentUser}-${new Date().toISOString().split("T")[0]}.pdf`);
  } catch (error) {
    console.error("Error downloading results:", error);
    showModal("Error: Failed to download results. Please try again later.", null, "Download Error");
  }
}
