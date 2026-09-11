const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Module = require('./models/module');

function createApp() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(morgan('combined'));

  app.get('/', (req, res) => {
    res.send('Hello World');
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/modules', async (req, res, next) => {
    try {
      const modules = await Module.find({}).sort({ _id: 1 }).lean();
      res.json({ modules });
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
