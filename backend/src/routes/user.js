const express = require('express');
const { User, Learner, Author } = require('../models/User');
const { requireAuth, checkRole } = require('../middleware/auth');

const router = express.Router();

class RouteError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

router.put(
  '/',
  requireAuth,
  checkRole('learner', 'author'),
  async (req, res, next) => {
    try {
      const user = await Learner.findById(req.user.id);
      const author = await Author.findById(req.user.id);
      const role = req.user.role;
      if (!user) {
        if (!author) {
          return res.status(404).json({ error: 'Learner or Author not found' });
        }
      }

      const name =
        typeof req.body.displayName === 'string'
          ? req.body.displayName.trim()
          : '';

      const profilePic =
        typeof req.body.profilePic === 'string'
          ? req.body.profilePic.trim()
          : '';

      const country =
        typeof req.body.country === 'string' ? req.body.country.trim() : '';

      const email =
        typeof req.body.email === 'string'
          ? req.body.email.toLowerCase().trim()
          : '';

      if (email) {
        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing && existing.id !== req.user.id) {
          return res
            .status(409)
            .json({ error: 'An account with that email already exists' });
        }
      }

      const bio =
        role === 'author' && typeof req.body.bio === 'string'
          ? req.body.bio.trim()
          : '';

      const updatedAt = Date();

      if (role === 'learner') {
        if (name) {
          user.displayName = name;
        }
        if (user.profilePic !== profilePic) {
          user.profilePic = profilePic;
        }
        if (country) {
          user.country = country;
        }
        if (email) {
          user.email = email;
        }
        user.updatedAt = updatedAt;
      } else {
        if (name) {
          author.displayName = name;
        }
        if (author.profilePic !== profilePic) {
          author.profilePic = profilePic;
        }
        if (country) {
          author.country = country;
        }
        if (email) {
          author.email = email;
        }
        if (bio) {
          author.bio = bio;
        }
        author.updatedAt = updatedAt;
      }

      try {
        if (role === 'learner') {
          await user.save();
        } else {
          await author.save();
        }
      } catch (error) {
        if (error.name === 'VersionError') {
          throw new RouteError(
            409,
            'Activity changed on another device. Try again.',
          );
        }

        throw error;
      }

      if (role === 'learner') {
        return res.status(200).json({ user });
      } else {
        return res.status(200).json({ author });
      }
    } catch (err) {
      return next(err);
    }
  },
);

router.use((error, req, res, next) => {
  if (error instanceof RouteError) {
    return res.status(error.status).json({ error: error.message });
  }

  return next(error);
});

module.exports = router;
