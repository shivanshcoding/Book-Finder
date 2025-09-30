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
  const { title, author, subject, isbn, year, language } = req.query;

  // Check if at least one search parameter is provided
  if (!title && !author && !subject && !isbn) {
    return res.status(400).json({ error: "At least one search parameter is required" });
  }

  try {
    let apiUrl = 'https://openlibrary.org/search.json?';
    
    // Add primary search parameter
    if (title) {
      apiUrl += `title=${encodeURIComponent(title)}`;
    } else if (author) {
      apiUrl += `author=${encodeURIComponent(author)}`;
    } else if (subject) {
      apiUrl += `subject=${encodeURIComponent(subject)}`;
    } else if (isbn) {
      apiUrl += `isbn=${encodeURIComponent(isbn)}`;
    }
    
    // Add filters if provided
    if (year) {
      apiUrl += `&first_publish_year=${year}`;
    }
    if (language) {
      apiUrl += `&language=${language}`;
    }
    
    const response = await axios.get(apiUrl);

    // Return the full response to frontend
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching books:", error.message);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

// API route for autocomplete suggestions
app.get("/api/autocomplete", async (req, res) => {
  const { query, type = "title" } = req.query;
  
  if (!query || query.trim() === "") {
    return res.json({ suggestions: [] });
  }
  
  try {
    let apiUrl;
    
    // Build API URL based on search type
    switch(type) {
      case "author":
        apiUrl = `https://openlibrary.org/search/authors.json?q=${encodeURIComponent(query)}&limit=5`;
        break;
      case "subject":
        apiUrl = `https://openlibrary.org/search.json?subject=${encodeURIComponent(query)}&limit=5`;
        break;
      case "isbn":
        apiUrl = `https://openlibrary.org/search.json?isbn=${encodeURIComponent(query)}&limit=5`;
        break;
      case "title":
      default:
        apiUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}&limit=5`;
    }
    
    const response = await axios.get(apiUrl);
    
    let suggestions = [];
    
    // Process response based on search type
    if (type === "author" && response.data.docs) {
      suggestions = response.data.docs
        .slice(0, 5)
        .map(author => ({
          key: author.key || `author-${Math.random().toString(36).substring(2, 10)}`,
          title: author.name,
          type: "author",
          author: author.name
        }));
    } else if (response.data.docs) {
      suggestions = response.data.docs
        .slice(0, 5)
        .map(book => ({
          key: book.key || `book-${Math.random().toString(36).substring(2, 10)}`,
          title: book.title,
          type: type,
          author: book.author_name ? book.author_name[0] : undefined,
          cover_i: book.cover_i,
          year: book.first_publish_year
        }));
    }
    
    res.json({ suggestions, type });
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
