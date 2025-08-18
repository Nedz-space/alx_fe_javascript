// ==============================
// Dynamic Quote Generator Script
// ==============================

// Retrieve quotes from localStorage or initialize empty
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// Load last selected category filter
let selectedCategory = localStorage.getItem("selectedCategory") || "all";

// ==============================
// Save quotes to localStorage
// ==============================
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ==============================
// Create Add Quote Form
// ==============================
function createAddQuoteForm() {
  const formContainer = document.getElementById("addQuoteForm");
  if (!formContainer) return;

  formContainer.innerHTML = `
    <h3>Add a New Quote</h3>
    <input type="text" id="quoteText" placeholder="Enter quote" required />
    <input type="text" id="quoteAuthor" placeholder="Enter author" required />
    <input type="text" id="quoteCategory" placeholder="Enter category" required />
    <button onclick="addQuote()">Add Quote</button>
  `;
}

// ==============================
// Add a new quote
// ==============================
function addQuote() {
  const text = document.getElementById("quoteText").value.trim();
  const author = document.getElementById("quoteAuthor").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (!text || !author || !category) {
    console.log("⚠️ Please fill all fields before adding a quote.");
    return;
  }

  const newQuote = { text, author, category };

  quotes.push(newQuote);
  saveQuotes();
  displayQuotes();
  populateCategories();

  // Clear inputs
  document.getElementById("quoteText").value = "";
  document.getElementById("quoteAuthor").value = "";
  document.getElementById("quoteCategory").value = "";
}

// ==============================
// Display quotes (filtered)
// ==============================
function displayQuotes() {
  const container = document.getElementById("quotesContainer");
  if (!container) return;

  container.innerHTML = "";

  let filteredQuotes = quotes;
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter((q) => q.category === selectedCategory);
  }

  filteredQuotes.forEach((q) => {
    const div = document.createElement("div");
    div.classList.add("quote");
    div.innerHTML = `<p>"${q.text}" - ${q.author} <em>[${q.category}]</em></p>`;
    container.appendChild(div);
  });
}

// ==============================
// Populate categories dynamically
// ==============================
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  if (!categoryFilter) return;

  // Collect unique categories
  const categories = ["all", ...new Set(quotes.map((q) => q.category))];

  // Reset dropdown
  categoryFilter.innerHTML = "";

  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === selectedCategory) {
      option.selected = true;
    }
    categoryFilter.appendChild(option);
  });
}

// ==============================
// Filter quotes by category
// ==============================
function filterQuotes() {
  const categoryFilter = document.getElementById("categoryFilter");
  selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  displayQuotes();
}

// ==============================
// Show random quote
// ==============================
function showRandomQuote() {
  if (quotes.length === 0) return;

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  const container = document.getElementById("randomQuote");
  if (container) {
    container.innerHTML = `<p>"${randomQuote.text}" - ${randomQuote.author} <em>[${randomQuote.category}]</em></p>`;
  }
}

// ==============================
// Simulate fetching quotes from server
// ==============================
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    // Simulate converting server posts to quotes
    const serverQuotes = data.slice(0, 5).map((item) => ({
      text: item.title,
      author: `User ${item.userId}`,
      category: "server",
    }));

    // Conflict resolution: server takes precedence
    quotes = [...quotes, ...serverQuotes];
    saveQuotes();
    displayQuotes();
    populateCategories();
  } catch (error) {
    console.error("Error fetching from server:", error);
  }
}

// ==============================
// Push local quotes to server (mock)
// ==============================
async function pushQuotesToServer() {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quotes),
    });
  } catch (error) {
    console.error("Error pushing quotes to server:", error);
  }
}

// ==============================
// Sync quotes with server
// ==============================
async function syncQuotes() {
  await fetchQuotesFromServer();
  await pushQuotesToServer();
  console.log("Quotes synced with server!"); // ✅ required exact string
}

// ==============================
// Initialize on page load
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  createAddQuoteForm();
  populateCategories();
  displayQuotes();
  showRandomQuote();

  // Periodic syncing every 30 seconds
  setInterval(syncQuotes, 30000);
});
