# 💱 Currency Converter

A full-stack currency converter app built with:
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js + Express
- **API**: ExchangeRate-API

## How It Works
1. User enters an amount and selects currencies on the frontend
2. Frontend sends a POST request to the Node.js backend
3. Backend calls the ExchangeRate API to get live rates
4. Backend returns the converted amount to the frontend
5. Frontend displays the result

## How to Run

### Backend
```bash
cd backend
npm install
node server.js