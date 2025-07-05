import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { initializeDatabase } from "./scripts/initDatabase.js";
import MovieNight from "./models/MovieNight.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Stew Night API is running!");
});

// POST endpoint to create a new movie night
app.post("/movie-nights", async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const movieNight = await MovieNight.create(title);
    res.status(201).json(movieNight);
  } catch (error) {
    console.error("Error creating movie night:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET endpoint to retrieve all movie nights
app.get("/movie-nights", async (req, res) => {
  try {
    const movieNights = await MovieNight.getAll();
    res.json(movieNights);
  } catch (error) {
    console.error("Error fetching movie nights:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET endpoint to retrieve a specific movie night by ID
app.get("/movie-nights/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const movieNight = await MovieNight.getById(id);
    
    if (!movieNight) {
      return res.status(404).json({ error: "Movie night not found" });
    }
    
    res.json(movieNight);
  } catch (error) {
    console.error("Error fetching movie night:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3000;

// Initialize database and start server
const startServer = async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer(); 