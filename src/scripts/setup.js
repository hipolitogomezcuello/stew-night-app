import { initializeDatabase } from './initDatabase.js';

// Run database initialization
const setup = async () => {
  console.log('Setting up database...');
  await initializeDatabase();
  console.log('Database setup complete!');
  process.exit(0);
};

setup().catch((error) => {
  console.error('Database setup failed:', error);
  process.exit(1);
}); 