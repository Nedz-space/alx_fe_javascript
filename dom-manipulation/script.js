// ============================
// Dynamic Quote Generator
// ============================

let quotes = [];

// Load from Local Storage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  quotes = storedQuotes ? JSON.parse(storedQuotes) : [];
}

// Save to Local Storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Create add-quote form
function createAddQuoteForm() {
  const form = document.getElementById("addQuoteForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const text = document.getElementById("quoteText").value;
    const author = document.getElementById("quoteAuthor").value;
    const category = document.getElementById("quoteCategory").value;

    if (text && author && category) {
      quotes.push({ text, author, category });
      saveQuotes();
      populateCategories();
      displayQuotes(quotes);
      form.reset();
    }
  });
}

// Display quotes
function displayQuotes(quotesToDisplay) {
  const list = document.getElementById("quoteList");
  list.innerHTML = "";
  quotesToDisplay.forEach((q) => {
    const li = document.createElement("li");
    li.textContent = `"${q.text}" — ${q.author} [${q.category}]`;
    list.appendChild(li);
  });
}

// Populate categories
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map((q) => q.category))];

  select.innerHTML = "";
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
    select.appendChild(option);
  });

  // Restore last selected
  const lastCategory = localStorage.getItem("lastCategory");
  if (lastCategory && categories.includes(lastCategory)) {
    select.value = lastCategory;
    filterQuotes();
  }
}

// Filter by category
function filterQuotes() {
  const category = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", category);
  if (category === "all") {
    displayQuotes(quotes);
  } else {
    const filtered = quotes.filter((q) => q.category === category);
    displayQuotes(filtered);
  }
}

// Export to JSON
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import from JSON
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    displayQuotes(quotes);
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// ============================
// Server Sync
// ============================

async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    const serverQuotes = data.slice(0, 5).map((post) => ({
      text: post.title,
      author: "Server",
      category: "general",
    }));

    quotes = [...serverQuotes, ...quotes];
    saveQuotes();
    populateCategories();
    displayQuotes(quotes);

    console.log("✅ Quotes synced from server!");
  } catch (error) {
    console.error("❌ Error fetching quotes:", error);
  }
}

async function pushQuotesToServer() {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ✅ required header
      },
      body: JSON.stringify(quotes),
    });
    console.log("✅ Quotes pushed to server!");
  } catch (error) {
    console.error("❌ Error pushing quotes:", error);
  }
}

// NEW FUNCTION — required by tests
async function syncQuotes() {
  await fetchQuotesFromServer();
  await pushQuotesToServer();
  console.log("🔄 Full sync complete!");
}

// ============================
// Initialize
// ============================
document.addEventListener("DOMContentLoaded", () => {
  loadQuotes();
  createAddQuoteForm();
  populateCategories();
  displayQuotes(quotes);

  // Optional: auto-sync every 30s
  setInterval(syncQuotes, 30000);
});
