const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = 9876;
const WINDOW_SIZE = 10;

const AUTH_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3NTEwMDU4LCJpYXQiOjE3MTc1MDk3NTgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjY1NmE2Mjg0LTBjZjgtNGExZS05ZGNhLTlhZjY5MWM2YzcyYSIsInN1YiI6ImFheXVzaDAwMjYuYmUyMUBjaGl0a2FyYS5lZHUuaW4ifSwiY29tcGFueU5hbWUiOiJhYXl1c2htYXJ0IiwiY2xpZW50SUQiOiI2NTZhNjI4NC0wY2Y4LTRhMWUtOWRjYS05YWY2OTFjNmM3MmEiLCJjbGllbnRTZWNyZXQiOiJNQ2NGZkxWVHh0bm5RVGdoIiwib3duZXJOYW1lIjoiQWF5dXNoIiwib3duZXJFbWFpbCI6ImFheXVzaDAwMjYuYmUyMUBjaGl0a2FyYS5lZHUuaW4iLCJyb2xsTm8iOiIyMTEwOTkwMDI2In0.QRLXzIdeqYH9mne54_Y8p0gOsDbhI3HOINg_REzCDWU";

const STORE = {
  p: [],
  f: [],
  e: [],
  r: [],
};

const API_URLS = {
  p: "http://20.244.56.144/test/primes",
  f: "http://20.244.56.144/test/fibo",
  e: "http://20.244.56.144/test/even",
  r: "http://20.244.56.144/test/rand",
};

app.use(cors());

const fetchNumbers = async (url) => {
  try {
    const response = await axios.get(url, {
      timeout: 500,
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
      },
    });
    return response.data.numbers || [];
  } catch (error) {
    console.error(
      "Error fetching numbers:",
      error.response ? error.response.data : error.message
    );
    return [];
  }
};

const updateStore = (numbers, key) => {
  const prevState = [...STORE[key]];

  numbers.forEach((number) => {
    if (!STORE[key].includes(number)) {
      if (STORE[key].length >= WINDOW_SIZE) {
        STORE[key].shift(); // Remove the oldest number
      }
      STORE[key].push(number);
    }
  });

  return prevState;
};

const calculateAverage = (numbers) => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return parseFloat((sum / numbers.length).toFixed(2));
};

app.get("/numbers/:id", async (req, res) => {
  const { id } = req.params;

  if (!API_URLS[id]) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  console.log(`Fetching numbers for ID: ${id}`);
  const numbers = await fetchNumbers(API_URLS[id]);
  console.log(`Fetched numbers: ${numbers}`);

  const prevState = updateStore(numbers, id);
  const currState = STORE[id];
  const avg = calculateAverage(currState);

  console.log(`Previous State: ${prevState}`);
  console.log(`Current State: ${currState}`);
  console.log(`Average: ${avg}`);

  res.json({
    windowPrevState: prevState,
    windowCurrState: currState,
    numbers: numbers,
    avg: avg,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
