// backend/server.js
const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("Express backend is running!");
});

// API route to search books
app.get("/api/books", async (req, res) => {
  const { title } = req.query;

  if (!title) {
    return res.status(400).json({ error: "Title query is required" });
  }

  try {
    const response = await axios.get(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}`
    );

    // Return the full response to frontend
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// API route for autocomplete suggestions
app.get("/api/autocomplete", async (req, res) => {
  const { query } = req.query;
  
  if (!query || query.trim() === "") {
    return res.json({ suggestions: [] });
  }
  
  try {
    const response = await axios.get(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=5`
    );
    
    // Extract just the titles for autocomplete
    const suggestions = response.data.docs
      .slice(0, 5)
      .map(book => ({ 
        title: book.title,
        key: book.key
      }));
    
    res.json({ suggestions });
  } catch (error) {
    console.error("Error fetching suggestions:", error.message);
    res.status(500).json({ error: "Failed to fetch suggestions", suggestions: [] });
  }
});

// Optional: API route for favorites (MongoDB integration)
// This would be implemented if MongoDB is added to the project

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
