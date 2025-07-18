import express from "express";
import Movie from "../models/Movie.js";

const router = express.Router();

// POST endpoint to create a new movie
router.post("/", async (req, res) => {
  try {
    const { title, year, reference_link } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const movie = await Movie.create(req.body);
    res.status(201).json(movie);
  } catch (error) {
    console.error("Error creating movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET endpoint to retrieve all movies
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.getAll();
    res.json(movies);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET endpoint to retrieve a specific movie by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.getById(id);
    
    if (!movie) {
      return res.status(404).json({ error: "Movie not found" });
    }
    
    res.json(movie);
  } catch (error) {
    console.error("Error fetching movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE endpoint to delete a movie by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Movie.deleteById(id);
    
    if (!deleted) {
      return res.status(404).json({ error: "Movie not found" });
    }
    
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    console.error("Error deleting movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router; 