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
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

export default initializeDatabase; 