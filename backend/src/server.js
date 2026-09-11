const mongoose = require('mongoose');
require('dotenv').config();
const { connectDB } = require('./config/db');
const { createApp } = require('./app');

async function main() {
  await connectDB();
  console.log('Connected to MongoDB');
  const app = createApp();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
