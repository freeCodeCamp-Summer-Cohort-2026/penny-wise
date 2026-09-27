const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const coursesRouter = require('./routes/courses');
const countriesRouter = require('./routes/countries');
const authRoutes = require('./routes/auth');
const mongoose = require('mongoose');
const studio = require('@mongoosejs/studio/express');

const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

function createApp() {
  const app = express();
  app.use(express.json());
  app.use(
    cors({
      origin: clientOrigin,
      credentials: true,
    }),
  );
  app.use(cookieParser());
  app.use(morgan('dev'));

  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/courses', coursesRouter);
  app.use('/api/countries', countriesRouter);

  const connectionURI = process.env.MONGODB_URI;

  const connection = mongoose.createConnection(connectionURI);
  // 3. Mount Mongoose Studio UI and API handlers
  // Note: Wrap the setup in an async context or mount via a custom wrapper route since studio() returns a Promise
  app.use('/studio', async (req, res, next) => {
    try {
      const studioMiddleware = await studio('/studio/api', connection, {
        bindIp: '127.0.0.1,192.168.4.182',
      });
      studioMiddleware(req, res, next);
    } catch (err) {
      next(err);
    }
  });

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}

module.exports = { createApp };
