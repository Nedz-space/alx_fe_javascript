// ==========================
// Dynamic Quote Generator
// ==========================

// Global array of quotes (initialized from localStorage)
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// Load last selected category from localStorage
let lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";

// ==========================
// Utility Functions
// ==========================

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display quotes in the UI
function displayQuotes(filteredCategory = "all") {
  const quotesContainer = document.getElementById("quotesList");
  quotesContainer.innerHTML = "";

  let filteredQuotes = quotes;

  if (filteredCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === filteredCategory);
  }

  if (filteredQuotes.length === 0) {
    quotesContainer.innerHTML = "<p>No quotes available for this category.</p>";
    return;
  }

  filteredQuotes.forEach((quote, index) => {
    const quoteItem = document.createElement("div");
    quoteItem.className = "quote-item";
    quoteItem.innerHTML = `
      <p>"${quote.text}"</p>
      <small>- ${quote.author} [${quote.category}]</small>
      <button onclick="removeQuote(${index})">Remove</button>
    `;
    quotesContainer.appendChild(quoteItem);
  });
}

// Remove a quote
function removeQuote(index) {
  quotes.splice(index, 1);
  saveQuotes();
  populateCategories(); // refresh dropdown if needed
  displayQuotes(document.getElementById("categoryFilter").value);
}

// ==========================
// Adding Quotes
// ==========================
function createAddQuoteForm() {
  const form = document.getElementById("addQuoteForm");
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const text = document.getElementById("quoteText").value.trim();
    const author = document.getElementById("quoteAuthor").value.trim();
    const category = document.getElementById("quoteCategory").value.trim();

    if (text && author && category) {
      const newQuote = { text, author, category };
      quotes.push(newQuote);
      saveQuotes();
      populateCategories();
      displayQuotes(document.getElementById("categoryFilter").value);
      form.reset();
    }
  });
}

// ==========================
// Category Filtering
// ==========================

// Populate categories dynamically
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");

  // Get unique categories
  const categories = [...new Set(quotes.map(q => q.category))];

  // Reset options
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected filter if exists
  if (lastSelectedCategory) {
    categoryFilter.value = lastSelectedCategory;
  }
}

// Filter quotes based on category
function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  lastSelectedCategory = selectedCategory;
  localStorage.setItem("selectedCategory", selectedCategory);
  displayQuotes(selectedCategory);
}

// ==========================
// Server Sync & Conflict Resolution
// ==========================

// Fetch quotes from server (mock API)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) {
      throw new Error("Failed to fetch quotes from server");
    }

    const serverData = await response.json();

    // Map server data into our quote structure
    const serverQuotes = serverData.slice(0, 10).map(item => ({
      text: item.title,
      author: `User ${item.userId}`,
      category: "General"
    }));

    // Conflict resolution: Server takes precedence
    quotes = serverQuotes;
    saveQuotes();
    populateCategories();
    displayQuotes(document.getElementById("categoryFilter").value);

    console.log("Quotes synced from server successfully");
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}

// Optional: Push new quotes to server (simulation only)
async function pushQuotesToServer(newQuote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      body: JSON.stringify(newQuote),
      headers: { "Content-type": "application/json; charset=UTF-8" }
    });

    const result = await response.json();
    console.log("Quote pushed to server:", result);
  } catch (error) {
    console.error("Error pushing quote to server:", error);
  }
}

// ==========================
// Initialize Application
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  createAddQuoteForm();
  populateCategories();
  displayQuotes(lastSelectedCategory);
  fetchQuotesFromServer(); // initial sync

  // Periodic sync every 30 seconds
  setInterval(fetchQuotesFromServer, 30000);
});
