import db from '../database.js';

class MovieNight {
  constructor(id = null, title, proposedMovies = []) {
    this.id = id;
    this.title = title;
    this.proposedMovies = proposedMovies;
  }

  // Create a new movie night
  static async create(movieNight) {
    try {
      const result = await db.runAsync(
        'INSERT INTO movie_nights (title) VALUES (?)',
        [movieNight.title]
      );
      
      return new MovieNight(result.lastID, movieNight.title);
    } catch (error) {
      throw new Error(`Error creating movie night: ${error.message}`);
    }
  }

  // Get all movie nights
  static async getAll() {
    try {
      const rows = await db.allAsync('SELECT * FROM movie_nights ORDER BY created_at DESC');
      const movieNights = [];
      
      for (const row of rows) {
        const proposedMovies = await this.getProposedMovies(row.id);
        movieNights.push(new MovieNight(row.id, row.title, proposedMovies));
      }
      
      return movieNights;
    } catch (error) {
      throw new Error(`Error fetching movie nights: ${error.message}`);
    }
  }

  // Get movie night by ID
  static async getById(id) {
    try {
      const row = await db.getAsync('SELECT * FROM movie_nights WHERE id = ?', [id]);
      if (!row) {
        return null;
      }
      
      const proposedMovies = await this.getProposedMovies(id);
      return new MovieNight(row.id, row.title, proposedMovies);
    } catch (error) {
      throw new Error(`Error fetching movie night: ${error.message}`);
    }
  }

  // Get proposed movies for a movie night
  static async getProposedMovies(movieNightId) {
    try {
      const rows = await db.allAsync(`
        SELECT m.* FROM movies m
        INNER JOIN movie_night_proposals mnp ON m.id = mnp.movie_id
        WHERE mnp.movie_night_id = ?
        ORDER BY mnp.created_at ASC
      `, [movieNightId]);
      
      return rows.map(row => ({
        id: row.id,
        title: row.title,
        year: row.year,
        reference_link: row.reference_link
      }));
    } catch (error) {
      throw new Error(`Error fetching proposed movies: ${error.message}`);
    }
  }

  // Add a movie to the proposed list
  static async addProposedMovie(movieNightId, movieId) {
    try {
      await db.runAsync(
        'INSERT INTO movie_night_proposals (movie_night_id, movie_id) VALUES (?, ?)',
        [movieNightId, movieId]
      );
      return true;
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        throw new Error('Movie is already proposed for this movie night');
      }
      throw new Error(`Error adding proposed movie: ${error.message}`);
    }
  }

  // Remove a movie from the proposed list
  static async removeProposedMovie(movieNightId, movieId) {
    try {
      const result = await db.runAsync(
        'DELETE FROM movie_night_proposals WHERE movie_night_id = ? AND movie_id = ?',
        [movieNightId, movieId]
      );
      return result.changes > 0;
    } catch (error) {
      throw new Error(`Error removing proposed movie: ${error.message}`);
    }
  }

}

export default MovieNight; 