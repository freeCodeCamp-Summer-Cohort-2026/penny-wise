const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const path = require('path');

const { Image } = require('../models/Image');
const { User } = require('../models/User');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB, well under MongoDB's 16 MB document limit
// SVG is left out on purpose: it can carry scripts.
const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

class RouteError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

// Files are kept in memory and written straight to MongoDB: no disk folder to
// keep in sync, and nothing is lost when a container restarts.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_IMAGE_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      return cb(null, true);
    }
    return cb(
      new RouteError(415, 'Only PNG, JPEG, GIF or WebP images are allowed'),
    );
  },
});

function serializeImage(image) {
  return {
    _id: image._id,
    name: image.name,
    contentType: image.contentType,
    size: image.size,
    createdAt: image.createdAt,
  };
}

function sendImage(res, image) {
  if (!image) {
    throw new RouteError(404, 'Image not found');
  }

  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  res.set('X-Content-Type-Options', 'nosniff');
  res.type(
    image.contentType || path.extname(image.name) || 'application/octet-stream',
  );
  res.send(image.imageData);
}

// GET /api/images -> metadata only (imageData is select: false)
// Learners see their own images; authors see everything not owned by a learner
// (author-owned images plus legacy images with no owner).
router.get('/', requireAuth, async (req, res) => {
  let filter;

  if (req.user.role === 'author') {
    // Authors are few, so an $in on their ids stays small, unlike a $nin over
    // every learner. distinct() returns only the ids, not whole user documents.
    const authorIds = await User.distinct('_id', { role: { $ne: 'learner' } });
    filter = { $or: [{ owner: { $in: authorIds } }, { owner: null }] };
  } else {
    filter = { owner: req.user.id };
  }

  const images = await Image.find(filter)
    .select('name contentType size createdAt')
    .sort({ createdAt: -1 })
    .lean();

  res.json({ images: images.map(serializeImage) });
});

// GET /api/images/uploads/:fileName -> legacy URLs from the old disk flow
router.get('/uploads/:fileName', async (req, res) => {
  const image = await Image.findOne({ path: req.params.fileName }).select(
    '+imageData',
  );
  sendImage(res, image);
});

// GET /api/images/:id/file -> the image bytes, usable directly in <img src>
router.get('/:id/file', async (req, res) => {
  if (!mongoose.isObjectIdOrHexString(req.params.id)) {
    throw new RouteError(400, 'Invalid image id');
  }

  const image = await Image.findById(req.params.id).select('+imageData');
  sendImage(res, image);
});

// POST /api/images/upload (multipart/form-data, field name "image")
router.post(
  '/upload',
  requireAuth,
  upload.single('image'),
  async (req, res) => {
    if (!req.file) {
      throw new RouteError(400, 'No file uploaded');
    }

    const image = await Image.create({
      name: req.file.originalname,
      contentType: req.file.mimetype,
      size: req.file.size,
      owner: req.user.id,
      imageData: req.file.buffer,
    });

    res.status(201).json({
      message: 'Image uploaded successfully',
      image: serializeImage(image),
    });
  },
);

// Express 5 forwards errors thrown in async handlers here automatically.
router.use((error, req, res, next) => {
  if (error instanceof RouteError) {
    return res.status(error.status).json({ error: error.message });
  }

  if (error instanceof multer.MulterError) {
    const status = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    const message =
      error.code === 'LIMIT_FILE_SIZE'
        ? 'Image must be 2 MB or smaller'
        : error.message;
    return res.status(status).json({ error: message });
  }

  return next(error);
});

module.exports = router;
