export function sanitizeInput(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML.replace(/[<>]/g, "");
}

export function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export function debounce(func, wait) {
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

export function generateCsrfToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(36).padStart(2, "0")).join("");
}

export function initializeCsrfToken() {
  const token = generateCsrfToken();
  sessionStorage.setItem("csrfToken", token);
  sessionStorage.setItem("csrfTokenTimestamp", Date.now().toString());
  return token;
}

export function validateCsrfToken() {
  const formToken = document.getElementById("csrfToken").value;
  const sessionToken = sessionStorage.getItem("csrfToken");
  const timestamp = sessionStorage.getItem("csrfTokenTimestamp");
  const tokenAge = Date.now() - parseInt(timestamp || "0");
  const maxAge = 30 * 60 * 1000;
  
  if (tokenAge > maxAge) {
    console.warn("CSRF token expired");
    return false;
  }
  
  return formToken === sessionToken;
}

window.initializeCsrfToken = initializeCsrfToken;
window.validateCsrfToken = validateCsrfToken;
