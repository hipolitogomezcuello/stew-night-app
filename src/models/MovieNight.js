import db from '../database.js';

class MovieNight {
  constructor(title, id = null) {
    this.id = id;
    this.title = title;
  }

  // Create a new movie night
  static async create(title) {
    try {
      const result = await db.runAsync(
        'INSERT INTO movie_nights (title) VALUES (?)',
        [title]
      );
      
      return new MovieNight(title, result.lastID);
    } catch (error) {
      throw new Error(`Error creating movie night: ${error.message}`);
    }
  }

  // Get all movie nights
  static async getAll() {
    try {
      const rows = await db.allAsync('SELECT * FROM movie_nights ORDER BY created_at DESC');
      return rows.map(row => new MovieNight(row.title, row.id));
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
      return new MovieNight(row.title, row.id);
    } catch (error) {
      throw new Error(`Error fetching movie night: ${error.message}`);
    }
  }

}

export default MovieNight; 