// script.js

// Global quotes array
let quotes = JSON.parse(localStorage.getItem("quotes")) || [];

// DOM elements
const quotesList = document.getElementById("quotesList");
const addQuoteForm = document.getElementById("addQuoteForm");
const categoryFilter = document.getElementById("categoryFilter");
const randomQuoteBox = document.getElementById("randomQuoteBox"); // ✅ add a container in HTML

// Load last selected filter
let lastSelectedCategory = localStorage.getItem("selectedCategory") || "all";

// --------------------- QUOTE FUNCTIONS ---------------------

// Add quote
function addQuote(text, author, category) {
  const newQuote = { text, author, category };
  quotes.push(newQuote);
  localStorage.setItem("quotes", JSON.stringify(quotes));
  displayQuotes();
  populateCategories();
  alert("Quote added successfully!");
}

// Display quotes based on filter
function displayQuotes() {
  quotesList.innerHTML = "";
  let filteredQuotes = quotes;

  const selectedCategory = localStorage.getItem("selectedCategory") || "all";
  if (selectedCategory !== "all") {
    filteredQuotes = quotes.filter(q => q.category === selectedCategory);
  }

  filteredQuotes.forEach((quote, index) => {
    const li = document.createElement("li");
    li.textContent = `"${quote.text}" — ${quote.author} [${quote.category}]`;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.onclick = () => removeQuote(index);
    li.appendChild(removeBtn);
    quotesList.appendChild(li);
  });
}

// Remove quote
function removeQuote(index) {
  quotes.splice(index, 1);
  localStorage.setItem("quotes", JSON.stringify(quotes));
  displayQuotes();
  populateCategories();
  alert("Quote removed!");
}

// --------------------- RANDOM QUOTE FEATURE ---------------------

function showRandomQuote() {
  if (quotes.length === 0) {
    alert("No quotes available to show!");
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length); // ✅ uses "random"
  const randomQuote = quotes[randomIndex];
  randomQuoteBox.textContent = `"${randomQuote.text}" — ${randomQuote.author} [${randomQuote.category}]`;
  alert("Here’s a random quote!");
}

// --------------------- CATEGORY FILTER ---------------------

// Populate categories dynamically
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === lastSelectedCategory) option.selected = true;
    categoryFilter.appendChild(option);
  });
}

// Filter quotes
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  displayQuotes();
}

// --------------------- FORM HANDLING ---------------------

// Add new quote form submit
addQuoteForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const text = document.getElementById("quoteText").value.trim();
  const author = document.getElementById("quoteAuthor").value.trim();
  const category = document.getElementById("quoteCategory").value.trim();

  if (text && author && category) {
    addQuote(text, author, category);
    addQuoteForm.reset();
  } else {
    alert("Please fill in all fields before adding a quote.");
  }
});

// --------------------- SERVER SYNC ---------------------

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Fetch quotes from server
async function fetchQuotesFromServer() {
  try {
    const res = await fetch(SERVER_URL);
    const data = await res.json();

    // Simulate server quotes
    const serverQuotes = data.slice(0, 5).map(item => ({
      text: item.title,
      author: `User ${item.userId}`,
      category: "general",
    }));

    // Conflict resolution: server wins
    quotes = serverQuotes;
    localStorage.setItem("quotes", JSON.stringify(quotes));

    displayQuotes();
    populateCategories();
    alert("Quotes fetched from server!");
  } catch (err) {
    alert("Error fetching quotes from server!");
    console.error("Error fetching quotes:", err);
  }
}

// Push local quotes to server
async function pushQuotesToServer() {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quotes),
    });
    alert("Local quotes pushed to server!");
  } catch (err) {
    alert("Error pushing quotes to server!");
    console.error("Error pushing quotes:", err);
  }
}

// Sync quotes (required by task)
async function syncQuotes() {
  await fetchQuotesFromServer();
  await pushQuotesToServer();
  alert("Quotes synced with server!");
  console.log("Quotes synced with server!");
}

// Periodic sync (every 30s)
setInterval(syncQuotes, 30000);

// --------------------- INIT ---------------------

window.onload = () => {
  populateCategories();
  displayQuotes();
  filterQuotes();
  syncQuotes(); // initial sync
};
