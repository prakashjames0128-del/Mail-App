import app, { connectToDatabase } from './index.js';

export default async function handler(req, res) {
  try {
    await connectToDatabase();
    app(req, res);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    res.status(500).json({ message: 'The database is unavailable.' });
  }
}
