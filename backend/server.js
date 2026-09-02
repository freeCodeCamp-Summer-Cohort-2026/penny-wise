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
const database_uri = `mongodb://${db_user}:${db_password}@localhost:27010/pennywise_db?authSource=admin`;

mongoose
  .connect(database_uri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
