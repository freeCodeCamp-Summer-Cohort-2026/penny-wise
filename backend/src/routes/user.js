// const crypto = require('crypto');
const express = require('express');
// const mongoose = require('mongoose');
// const { User, Learner, Author } = require('../models/User');
const Learner = require('../models/User');

// const { requireAuth, optionalAuth, checkRole } = require('../middleware/auth');
const { requireAuth, checkRole } = require('../middleware/auth');

const router = express.Router();

class RouteError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

router.put('/', requireAuth, checkRole('learner'), async (req, res, next) => {
  try {
    const user = await Learner.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Learner not found' });
    }
    const name =
      typeof req.body.displayName === 'string'
        ? req.body.displayName.trim()
        : '';
    const country =
      typeof req.body.country === 'string' ? req.body.country.trim() : '';

    if (name) {
      user.displayName = name;
    }
    if (country) {
      user.country = country;
    }

    const updatedAt = Date();
    user.updatedAt = updatedAt;

    return res.status(201).json({ user });
  } catch (err) {
    return next(err);
  }
});

/*
const asyncRoute = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};
*/

router.use((error, req, res, next) => {
  if (error instanceof RouteError) {
    return res.status(error.status).json({ error: error.message });
  }

  return next(error);
});

module.exports = router;
