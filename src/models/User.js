import db from '../database.js';
import crypto from 'crypto';

class User {
  constructor(id = null, username, email, password_hash = null) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.password_hash = password_hash;
  }

  // Hash password
  static hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  // Create a new user
  static async create(userData) {
    try {
      const passwordHash = this.hashPassword(userData.password);
      
      const result = await db.runAsync(
        'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
        [userData.username, userData.email, passwordHash]
      );
      
      return new User(result.lastID, userData.username, userData.email);
    } catch (error) {
      if (error.message.includes('UNIQUE constraint failed')) {
        if (error.message.includes('username')) {
          throw new Error('Username already exists');
        } else if (error.message.includes('email')) {
          throw new Error('Email already exists');
        }
      }
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      const row = await db.getAsync('SELECT * FROM users WHERE username = ?', [username]);
      if (!row) {
        return null;
      }
      return new User(row.id, row.username, row.email, row.password_hash);
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const row = await db.getAsync('SELECT * FROM users WHERE email = ?', [email]);
      if (!row) {
        return null;
      }
      return new User(row.id, row.username, row.email, row.password_hash);
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  // Authenticate user
  static async authenticate(username, password) {
    try {
      const user = await this.findByUsername(username);
      if (!user) {
        return null;
      }

      const passwordHash = this.hashPassword(password);
      if (user.password_hash === passwordHash) {
        return new User(user.id, user.username, user.email);
      }

      return null;
    } catch (error) {
      throw new Error(`Error authenticating user: ${error.message}`);
    }
  }

  // Get user by ID
  static async getById(id) {
    try {
      const row = await db.getAsync('SELECT * FROM users WHERE id = ?', [id]);
      if (!row) {
        return null;
      }
      return new User(row.id, row.username, row.email);
    } catch (error) {
      throw new Error(`Error fetching user: ${error.message}`);
    }
  }
}

export default User; 