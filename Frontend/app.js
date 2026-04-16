// app.js — Our Frontend JavaScript

// -----------------------------------------------
// LIST OF CURRENCIES
// -----------------------------------------------
const currencies = [
  "USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY",
  "INR", "NGN", "ZAR", "BRL", "MXN", "KES", "GHS", "EGP",
  "AED", "SAR", "SGD", "NZD", "SEK", "NOK", "DKK", "HKD"
];

// -----------------------------------------------
// GRAB ELEMENTS FROM THE HTML PAGE
// -----------------------------------------------
const amountInput = document.getElementById("amount");
const fromSelect  = document.getElementById("from");
const toSelect    = document.getElementById("to");
const convertBtn  = document.getElementById("convertBtn");
const swapBtn     = document.getElementById("swapBtn");
const resultDiv   = document.getElementById("result");

// -----------------------------------------------
// POPULATE THE CURRENCY DROPDOWNS
// -----------------------------------------------
function populateDropdowns() {
  currencies.forEach((currency) => {
    // Create an option for the "From" dropdown
    const optionFrom = document.createElement("option");
    optionFrom.value = currency;
    optionFrom.textContent = currency;
    fromSelect.appendChild(optionFrom);

    // Create an option for the "To" dropdown
    const optionTo = document.createElement("option");
    optionTo.value = currency;
    optionTo.textContent = currency;
    toSelect.appendChild(optionTo);
  });

  // Set default selections
  fromSelect.value = "USD"; // Default "From" currency
  toSelect.value   = "EUR"; // Default "To" currency
}

// -----------------------------------------------
// SWAP BUTTON — swaps the two selected currencies
// -----------------------------------------------
swapBtn.addEventListener("click", () => {
  const temp    = fromSelect.value;
  fromSelect.value = toSelect.value;
  toSelect.value   = temp;
});

// -----------------------------------------------
// CONVERT BUTTON — sends request to our backend
// -----------------------------------------------
convertBtn.addEventListener("click", async () => {
  const amount = amountInput.value;
  const from   = fromSelect.value;
  const to     = toSelect.value;

  // Basic validation
  if (!amount || amount <= 0) {
    showError("⚠️ Please enter a valid amount.");
    return;
  }

  if (from === to) {
    showError("⚠️ Please select two different currencies.");
    return;
  }

  // Show loading state
  convertBtn.textContent = "Converting...";
  convertBtn.classList.add("loading");
  convertBtn.disabled = true;

  try {
    // -------------------------------------------
    // THIS IS WHERE THE FRONTEND TALKS TO THE BACKEND
    // We send a POST request to our Node.js server
    // -------------------------------------------
    const response = await fetch("http://localhost:5000/convert", {
      method: "POST",                         // We are sending data
      headers: {
        "Content-Type": "application/json",   // We are sending JSON
      },
      body: JSON.stringify({ amount, from, to }), // The data we send
    });

    // Parse the response from the backend
    const data = await response.json();

    if (data.error) {
      showError(data.error);
    } else {
      showResult(data);
    }

  } catch (error) {
    // If the backend is not running or something went wrong
    showError("❌ Could not connect to the backend. Is the server running?");
    console.error("Error:", error);
  }

  // Reset button state
  convertBtn.textContent = "Convert";
  convertBtn.classList.remove("loading");
  convertBtn.disabled = false;
});

// -----------------------------------------------
// SHOW RESULT on the page
// -----------------------------------------------
function showResult(data) {
  resultDiv.innerHTML = `
    <div class="result-content">
      <div class="result-main">
        ${data.amount} ${data.from} = ${data.convertedAmount} ${data.to}
      </div>
      <div class="result-rate">
        1 ${data.from} = ${data.rate} ${data.to}
      </div>
    </div>
  `;
}

// -----------------------------------------------
// SHOW ERROR on the page
// -----------------------------------------------
function showError(message) {
  resultDiv.innerHTML = `<div class="result-error">${message}</div>`;
}

// -----------------------------------------------
// RUN ON PAGE LOAD
// -----------------------------------------------
populateDropdowns();