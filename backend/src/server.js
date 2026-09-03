const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

//Connect to MongoDB
const db_user = process.env.MONGODB_INIT_USER;
const db_password = process.env.MONGODB_INIT_PASSWORD;
if (!db_user || !db_password) {
  console.error('MONGODB_INIT_USER and/or MONGODB_INIT_PASSWORD are not set or .env file is missing.');
  process.exit(1);
}
const database_uri = `mongodb://localhost:27010/pennywise_db?`;

mongoose
  .connect(database_uri, {
    authSource: 'admin',
    user: db_user,
    pass: db_password,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
