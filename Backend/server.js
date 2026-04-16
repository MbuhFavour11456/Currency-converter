// server.js — Our Backend Server

// Load environment variables from .env file
require("dotenv").config();

// Import the tools we need
const express = require("express");
const axios = require("axios");
const cors = require("cors");

// Create our Express app (this is our server)
const app = express();

// Middleware — these help our server understand incoming requests
app.use(cors());           // Allow frontend to talk to this backend
app.use(express.json());   // Allow the server to read JSON data

// Get our port and API key from the .env file
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.EXCHANGE_API_KEY;

// -----------------------------------------------
// OUR MAIN ROUTE — POST /convert
// The frontend will send requests to this route
// -----------------------------------------------
app.post("/convert", async (req, res) => {
  // 1. Get the data sent from the frontend
  const { amount, from, to } = req.body;

  // 2. Basic validation — make sure all fields are provided
  if (!amount || !from || !to) {
    return res.status(400).json({ error: "Please provide amount, from, and to." });
  }

  try {
    // 3. Call the ExchangeRate API to get the latest exchange rates
    const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${from}/${to}/${amount}`;
    const response = await axios.get(url);

    // 4. Extract the converted amount from the API response
    const convertedAmount = response.data.conversion_result;
    const rate = response.data.conversion_rate;

    // 5. Send the result back to the frontend as JSON
    res.json({
      from,
      to,
      amount,
      convertedAmount: convertedAmount.toFixed(2),
      rate: rate.toFixed(4),
    });

  } catch (error) {
    // If something goes wrong, send an error message
    console.error("Error fetching exchange rate:", error.message);
    res.status(500).json({ error: "Failed to fetch exchange rate. Check your API key." });
  }
});

// Start the server and listen on our port
app.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});