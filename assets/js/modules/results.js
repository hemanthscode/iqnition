// Results Module - CORRECTED VERSION
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
    
    // Delay chart creation to ensure Chart.js is loaded
    setTimeout(() => {
      createResultChart();
    }, 500);
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
    
    // Check if Chart.js is available
    if (!window.Chart) {
      console.error("Chart.js not loaded yet, retrying...");
      setTimeout(createResultChart, 1000);
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
    console.error("Error creating result chart:", error);
  }
}

export function downloadResults() {
  try {
    // Check if jsPDF is available
    if (!window.jspdf || !window.jspdf.jsPDF) {
      showModal("PDF library is still loading. Please try again in a moment.", null, "Download Error");
      return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const results = window.quizResults;
    const timeMinutes = Math.floor(results.timeTaken / 60);
    const timeSeconds = results.timeTaken % 60;
    
    const lineHeight = 7;
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
    doc.text(`- Status: ${results.passed ? "PASSED" : "NEEDS IMPROVEMENT"}`, 10, y);
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
      const correctText = `Correct Answer: ${correctLetter}. ${question.options[question.correct]}`;
      doc.setTextColor(0, 128, 0);
      const correctLines = doc.splitTextToSize(correctText, maxWidth);
      doc.text(correctLines, 10, y);
      y += correctLines.length * lineHeight + 3;
      
      doc.setTextColor(0, 0, 0);
      
      if (y > 270) {
        doc.addPage();
        y = 10;
      }
      
      const userAnswer = state.userAnswers[index];
      let userText;
      if (userAnswer !== undefined) {
        const userLetter = optionsLetters[userAnswer];
        const status = userAnswer === question.correct ? " (Correct)" : " (Incorrect)";
        userText = `Your Answer: ${userLetter}. ${question.options[userAnswer]}${status}`;
      } else {
        userText = "Your Answer: Not Attempted";
      }
      
      const userLines = doc.splitTextToSize(userText, maxWidth);
      doc.text(userLines, 10, y);
      y += userLines.length * lineHeight + 10;
    });
    
    doc.save(`IQnition-Results-${state.currentUser}-${new Date().toISOString().split("T")[0]}.pdf`);
  } catch (error) {
    console.error("Error downloading results:", error);
    showModal("Error: Failed to download results. Please ensure all libraries are loaded and try again.", null, "Download Error");
  }
}
