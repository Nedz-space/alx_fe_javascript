// ---------------------------
// QUOTE STORAGE MANAGEMENT
// ---------------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { id: 1, text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { id: 2, text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { id: 3, text: "Failure is not the opposite of success; it’s part of success.", category: "Wisdom" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ---------------------------
// SERVER SIMULATION
// ---------------------------
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Fake server

// Fetch quotes from server (simulation)
async function fetchServerQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    // Simulate converting server posts into quotes
    const serverQuotes = serverData.slice(0, 5).map(post => ({
      id: post.id,
      text: post.title,
      category: "Server"
    }));

    resolveConflicts(serverQuotes);
  } catch (error) {
    console.error("Error fetching server quotes:", error);
  }
}

// Post new quote to server (mock)
async function postQuoteToServer(quote) {
  try {
    await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote),
    });
    console.log("Quote synced to server:", quote);
  } catch (error) {
    console.error("Error syncing quote:", error);
  }
}

// ---------------------------
// CONFLICT RESOLUTION
// ---------------------------
function resolveConflicts(serverQuotes) {
  let updated = false;

  serverQuotes.forEach(serverQuote => {
    const localQuote = quotes.find(q => q.id === serverQuote.id);

    if (!localQuote) {
      // New quote from server → add to local
      quotes.push(serverQuote);
      updated = true;
    } else if (localQuote.text !== serverQuote.text) {
      // Conflict → server takes precedence
      localQuote.text = serverQuote.text;
      localQuote.category = serverQuote.category;
      updated = true;

      notifyUser(`Conflict resolved for quote ID ${serverQuote.id}. Server version applied.`);
    }
  });

  if (updated) {
    saveQuotes();
    populateCategories();
  }
}

// ---------------------------
// USER NOTIFICATIONS
// ---------------------------
function notifyUser(message) {
  const note = document.createElement("div");
  note.style.background = "#ffef96";
  note.style.padding = "10px";
  note.style.margin = "10px";
  note.style.border = "1px solid #ccc";
  note.textContent = message;

  document.body.prepend(note);

  setTimeout(() => note.remove(), 5000);
}

// ---------------------------
// ADD QUOTE (SYNCED)
// ---------------------------
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  const newQuote = { id: Date.now(), text: newText, category: newCategory };
  quotes.push(newQuote);
  saveQuotes();

  populateCategories();
  postQuoteToServer(newQuote); // Sync with server

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("New quote added and syncing with server!");
}

// ---------------------------
// PERIODIC SYNC
// ---------------------------
setInterval(fetchServerQuotes, 10000); // Every 10 seconds

// ---------------------------
// REST OF PREVIOUS FUNCTIONS
// ---------------------------
// showRandomQuote, createAddQuoteForm, populateCategories, filterQuotes, 
// exportToJsonFile, importFromJsonFile remain as in Task 2
