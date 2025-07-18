import db from '../database.js';

class Movie {
  constructor(id = null, title, year, reference_link) {
    this.id = id;
    this.title = title;
    this.year = year;
    this.reference_link = reference_link;
  }

  // Create a new movie
  static async create(movie) {
    try {
      const result = await db.runAsync(
        'INSERT INTO movies (title, year, reference_link) VALUES (?, ?, ?)',
        [movie.title, movie.year, movie.reference_link]
      );
      
      return new Movie(result.lastID, movie.title, movie.year, movie.reference_link);
    } catch (error) {
      throw new Error(`Error creating movie: ${error.message}`);
    }
  }

  // Get all movies
  static async getAll() {
    try {
      const rows = await db.allAsync('SELECT * FROM movies ORDER BY created_at DESC');
      return rows.map(row => new Movie(row.id, row.title, row.year, row.reference_link));
    } catch (error) {
      throw new Error(`Error fetching movies: ${error.message}`);
    }
  }

  // Get movie by ID
  static async getById(id) {
    try {
      const row = await db.getAsync('SELECT * FROM movies WHERE id = ?', [id]);
      if (!row) {
        return null;
      }
      return new Movie(row.id, row.title, row.year, row.reference_link);
    } catch (error) {
      throw new Error(`Error fetching movie: ${error.message}`);
    }
  }
}

export default Movie; 