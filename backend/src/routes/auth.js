const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const rateLimit = require('express-rate-limit');
const { User, Learner, Author } = require('../models/User');

const router = express.Router();

const sanitizeUser = (user) => ({
  id: user._id,
  email: user.email,
  displayName: user.displayName,
  role: user.role,
  level: user.level,
  avatar: user.profilePic,
  country: user.country,
});

const registerLimiter =
  process.env.NODE_ENV === 'test'
    ? (req, res, next) => next()
    : rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 5,
        message: {
          error:
            'Too many registration attempts from this IP, please try again later.',
        },
        standardHeaders: true,
        legacyHeaders: false,
      });

// 2. Login Rate Limiter
const loginLimiter =
  process.env.NODE_ENV === 'test'
    ? (req, res, next) => next()
    : rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 10,
        message: {
          error:
            'Too many login attempts from this IP, please try again later.',
        },
        standardHeaders: true,
        legacyHeaders: false,
      });

function signToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    },
  );
}

// POST /api/auth/register
router.post('/register', registerLimiter, async (req, res) => {
  try {
    const { email, password, displayName, authorInviteCode } = req.body;

    if (!email || !password || !displayName) {
      return res.status(400).json({
        error: 'email, password, displayName are all required',
      });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: 'password must be at least 8 characters long' });
    }
    if (displayName.length > 100) {
      return res.status(400).json({
        error: 'display name must be 100 characters or less',
      });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res
        .status(409)
        .json({ error: 'An account with that email already exists' });
    }

    const passwordHash = await User.hashPassword(password);

    let user;

    if (authorInviteCode) {
      if (
        !process.env.AUTHOR_SECRET_CODE ||
        process.env.AUTHOR_SECRET_CODE.length < 16
      ) {
        return res.status(500).json({
          error:
            'Server misconfiguration: Author registration is currently disabled.',
        });
      }

      const providedHash = crypto
        .createHash('sha256')
        .update(authorInviteCode)
        .digest();
      const secretHash = crypto
        .createHash('sha256')
        .update(process.env.AUTHOR_SECRET_CODE)
        .digest();

      if (crypto.timingSafeEqual(providedHash, secretHash)) {
        user = await Author.create({
          email: email.toLowerCase(),
          displayName,
          passwordHash,
        });
      } else {
        return res.status(400).json({ error: 'Invalid author code' });
      }
    } else {
      user = await Learner.create({
        email: email.toLowerCase(),
        displayName,
        passwordHash,
      });
    }

    const token = signToken(user);

    return res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.log({ err });
    return res.status(500).json({ error: 'Failed to register user' });
  }
});

// POST /api/auth/login
router.post('/login', loginLimiter, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user);

    return res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    console.log({ err });
    return res.status(500).json({ error: 'Failed to log in' });
  }
});

module.exports = router;
