import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { initializeDatabase } from "./scripts/initDatabase.js";
import movieNightsRouter from "./routes/movieNights.js";
import moviesRouter from "./routes/movies.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(express.static('src/public'));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + '/src/public/index.html');
});

app.get("/admin", (req, res) => {
  res.sendFile(process.cwd() + '/src/public/admin.html');
});

// Use route modules
app.use("/api/movie-nights", movieNightsRouter);
app.use("/api/movies", moviesRouter);

const PORT = process.env.PORT || 3000;

// Initialize database and start server
const startServer = async () => {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer(); 
