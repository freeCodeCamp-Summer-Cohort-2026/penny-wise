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

function updateUserFields(user, name, profilePic, country, email) {
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
  user.updatedAt = String(new Date());

  return user;
}

function updateAuthorFields(author, name, profilePic, country, email, bio) {
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
  author.updatedAt = String(new Date());

  return author;
}

function trimmedString({ value, lower = false }) {
  if (typeof value === 'string') {
    if (lower) {
      return value.toLowerCase();
    } else {
      return value;
    }
  }
  return '';
}

router.put(
  '/',
  requireAuth,
  checkRole('learner', 'author'),
  async (req, res, next) => {
    try {
      let user = await Learner.findById(req.user.id);
      let author = await Author.findById(req.user.id);
      const role = req.user.role;

      if (!user) {
        if (!author) {
          return res.status(404).json({ error: 'Learner or Author not found' });
        }
      }

      const name = trimmedString({ value: req.body.displayName });

      const profilePic = trimmedString({ value: req.body.profilePic });

      const country = trimmedString({ value: req.body.country });

      const email = trimmedString({ value: req.body.email, lower: true });

      if (email) {
        const existing = await User.findOne({ email: email.toString() });
        if (existing && existing.id !== req.user.id) {
          return res
            .status(409)
            .json({ error: 'An account with that email already exists' });
        }
      }

      try {
        if (role === 'learner') {
          user = updateUserFields(user, name, profilePic, country, email);
          await user.save();
        } else {
          const bio = trimmedString({ value: req.body.bio });
          author = updateAuthorFields(
            author,
            name,
            profilePic,
            country,
            email,
            bio
          );
          await author.save();
        }
      } catch (error) {
        if (error.name === 'VersionError') {
          throw new RouteError(
            409,
            'Activity changed on another device. Try again.'
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
  }
);

router.use((error, req, res, next) => {
  if (error instanceof RouteError) {
    return res.status(error.status).json({ error: error.message });
  }

  return next(error);
});

module.exports = router;
