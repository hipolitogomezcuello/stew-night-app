import db from '../database.js';

class MovieNight {
  constructor(id = null, title) {
    this.id = id;
    this.title = title;
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
      return rows.map(row => new MovieNight(row.id, row.title));
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
      return new MovieNight(row.id, row.title);
    } catch (error) {
      throw new Error(`Error fetching movie night: ${error.message}`);
    }
  }

}

export default MovieNight; 