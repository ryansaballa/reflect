// ==========================
// SETUP & DATA
// ==========================

const STORAGE_KEY = "learning-journal-entries";

const savedQuestions = JSON.parse(localStorage.getItem("journalQuestions")) || [];
const entries = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

let currentIndex = 0;

// Detect page
const isPromptsPage = document.getElementById("prompt-title");
const isEntriesPage = document.getElementById("entriesContainer");

// ==========================
// PROMPTS PAGE
// ==========================
if (isPromptsPage) {
    // Redirect if no questions
    if (!savedQuestions.length) {
        window.location.href = "prompt.html";
    }

    // Convert questions → prompts
    const prompts = savedQuestions.map((q) => ({
        title: typeof q === "string" ? q : q.question,
        body: "Write your reflection below:",
    }));

    // DOM elements
    const promptTitle = document.getElementById("prompt-title");
    const promptBody = document.getElementById("prompt-body");
    const entryBox = document.getElementById("entry");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const clearBtn = document.getElementById("clearBtn");
    const backBtn = document.getElementById("backBtn");
    const downloadBtn = document.getElementById("downloadBtn");
    const viewAllBtn = document.getElementById("viewAllBtn");
    const status = document.getElementById("status");
    const progressBar = document.getElementById("progress-bar");

    // ========== RENDER ==========
    function renderPrompt() {
        const prompt = prompts[currentIndex];

        promptTitle.textContent = prompt.title;
        promptBody.textContent = prompt.body;
        entryBox.value = entries[currentIndex]?.text || "";

        updateStatus();
    }

    // ========== SAVE ==========
    function saveEntry() {
        entries[currentIndex] = {
            text: entryBox.value.trim(),
            title: prompts[currentIndex].title,
            date: new Date().toLocaleString(),
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }

    // ========== UI STATUS ==========
    function updateStatus() {
        status.textContent = `Question ${currentIndex + 1} of ${prompts.length}`;
        prevBtn.disabled = currentIndex === 0;
        nextBtn.textContent = currentIndex === prompts.length - 1 ? "Finish" : "Next →";

        const progressPercent = ((currentIndex + 1) / prompts.length) * 100;
        progressBar.style.width = `${progressPercent}%`;
    }

    // ========== EVENTS ==========
    nextBtn?.addEventListener("click", () => {
        saveEntry();

        if (currentIndex < prompts.length - 1) {
            currentIndex++;
            renderPrompt();
        } else {
            alert("All prompts completed!");
        }
    });

    prevBtn?.addEventListener("click", () => {
        saveEntry();

        if (currentIndex > 0) {
            currentIndex--;
            renderPrompt();
        }
    });

    entryBox?.addEventListener("input", saveEntry);

    downloadBtn?.addEventListener("click", () => {
        saveEntry();

        const content = Object.values(entries)
            .map((e) => `# ${e.title}\n\n${e.date}\n\n${e.text}\n\n---\n`)
            .join("");

        const blob = new Blob([content], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "learning-journal.txt";
        a.click();

        URL.revokeObjectURL(url);
    });

    clearBtn?.addEventListener("click", () => {
        if (!confirm("All entries will be cleared. Continue?")) return;

        localStorage.removeItem(STORAGE_KEY);
        Object.keys(entries).forEach((key) => delete entries[key]);

        currentIndex = 0;
        entryBox.value = "";
        renderPrompt();
    });

    backBtn?.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    viewAllBtn?.addEventListener("click", () => {
        window.location.href = "entries.html";
    });

    // Initial render
    renderPrompt();
}

// ==========================
// ENTRIES PAGE
// ==========================
if (isEntriesPage) {
    const entriesContainer = document.getElementById("entriesContainer");

    if (!Object.keys(entries).length) {
        entriesContainer.innerHTML = "<p>No entries yet.</p>";
    } else {
        Object.values(entries)
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // newest first
            .forEach((entry) => {
                const div = document.createElement("div");

                div.innerHTML = `
                    <h3>${entry.title}</h3>
                    <p>${entry.text}</p>
                    <p><small>${entry.date}</small></p>
                    <hr/>
                `;

                entriesContainer.appendChild(div);
            });
    }
}
