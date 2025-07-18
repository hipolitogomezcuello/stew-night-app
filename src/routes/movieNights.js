import express from "express";
import MovieNight from "../models/MovieNight.js";

const router = express.Router();

// POST endpoint to create a new movie night
router.post("/", async (req, res) => {
  try {
    const { title } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const movieNight = await MovieNight.create(req.body);
    res.status(201).json(movieNight);
  } catch (error) {
    console.error("Error creating movie night:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET endpoint to retrieve all movie nights
router.get("/", async (req, res) => {
  try {
    const movieNights = await MovieNight.getAll();
    res.json(movieNights);
  } catch (error) {
    console.error("Error fetching movie nights:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET endpoint to retrieve a specific movie night by ID
router.get("/:id", async (req, res) => {
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

export default router; 