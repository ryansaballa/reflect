// script.js

const prompts = [
  {
    title: "Reflect on today's learning",
    body: "What did you learn today? What surprised you the most?"
  },
  {
    title: "Challenges faced",
    body: "What difficulties did you encounter and how did you respond?"
  },
  {
    title: "Action plan",
    body: "What will you do next to build on what you learned?"
  }
];

const STORAGE_KEY = "learning-journal-entries";
let entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

const promptTitle = document.getElementById("prompt-title");
const promptBody = document.getElementById("prompt-body");
const entryBox = document.getElementById("entry");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const downloadBtn = document.getElementById("downloadBtn");
const status = document.getElementById("status");
const progressBar = document.getElementById("progress-bar");

let currentIndex = 0;

// Load the first prompt
renderPrompt();

// Update displayed prompt
function renderPrompt() {
  const prompt = prompts[currentIndex];
  promptTitle.textContent = prompt.title;
  promptBody.textContent = prompt.body;
  entryBox.value = entries[currentIndex]?.text || "";
  updateStatus();
}

// Save entry to localStorage
function saveEntry() {
  const text = entryBox.value.trim();
  entries[currentIndex] = {
    text,
    title: prompts[currentIndex].title,
    date: new Date().toLocaleString()
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// Show current progress
function updateStatus() {
  status.textContent = `Question ${currentIndex + 1} of ${prompts.length}`;
  prevBtn.disabled = currentIndex === 0;
  nextBtn.textContent = currentIndex === prompts.length - 1 ? "Finish" : "Next →";

  // Update progress bar width
  const progressPercent = ((currentIndex + 1) / prompts.length) * 100;
  progressBar.style.width = `${progressPercent}%`;
}


// Navigation
nextBtn.addEventListener("click", () => {
  saveEntry();
  if (currentIndex < prompts.length - 1) {
    currentIndex++;
    renderPrompt();
  } else {
    alert("All prompts completed!");
  }
});

prevBtn.addEventListener("click", () => {
  saveEntry();
  if (currentIndex > 0) {
    currentIndex--;
    renderPrompt();
  }
});

// Auto-save when typing
entryBox.addEventListener("input", () => {
  saveEntry();
});

// Download all entries
downloadBtn.addEventListener("click", () => {
  saveEntry();
  const all = Object.values(entries)
    .map(e => `# ${e.title}\n\n${e.date}\n\n${e.text}\n\n---\n`)
    .join("");
  const blob = new Blob([all], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "learning-journal.txt";
  a.click();
  URL.revokeObjectURL(url);
});
