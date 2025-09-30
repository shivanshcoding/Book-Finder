const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Example route
app.get("/", (req, res) => {
  res.send("Express backend is running!");
});

// Example API endpoint (for books if needed)
app.get("/api/books", (req, res) => {
  const query = req.query.title;
  res.json({ message: `You searched for "${query}"` });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
