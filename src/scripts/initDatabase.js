import db from '../database.js';

// Initialize database schema
export const initializeDatabase = async () => {
  try {
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS movie_nights (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS movies (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        year INTEGER,
        reference_link TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS movie_night_proposals (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        movie_night_id INTEGER NOT NULL,
        movie_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (movie_night_id) REFERENCES movie_nights (id) ON DELETE CASCADE,
        FOREIGN KEY (movie_id) REFERENCES movies (id) ON DELETE CASCADE,
        UNIQUE(movie_night_id, movie_id)
      )
    `);
    
    await db.runAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default initializeDatabase; 