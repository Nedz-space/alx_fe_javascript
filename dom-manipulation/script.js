// Array of quotes
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "Failure is not the opposite of success; it’s part of success.", category: "Wisdom" }
];

// Display area
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

// Function to show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available. Please add one!";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" <div class="category">(${quote.category})</div>`;
}

// Function to add a new quote dynamically
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText === "" || newCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Add to quotes array
  quotes.push({ text: newText, category: newCategory });

  // Clear input fields
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("New quote added successfully!");
}

// Function to dynamically create the Add Quote Form
function createAddQuoteForm() {
  const formContainer = document.createElement("div");
  formContainer.classList.add("form-container");

  const title = document.createElement("h3");
  title.textContent = "Add a New Quote";
  formContainer.appendChild(title);

  // Input for quote text
  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";
  formContainer.appendChild(quoteInput);

  // Input for category
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";
  formContainer.appendChild(categoryInput);

  // Add button
  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.addEventListener("click", addQuote);
  formContainer.appendChild(addBtn);

  // Append form to body (or anywhere else)
  document.body.appendChild(formContainer);
}

// Event Listeners
newQuoteBtn.addEventListener("click", showRandomQuote);

// Initialize app
showRandomQuote();
createAddQuoteForm(); // Build form dynamically
