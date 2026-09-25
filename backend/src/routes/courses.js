const express = require('express');
const Course = require('../models/Course');
const { Author } = require('../models/User');
require('../models/Lesson');
require('../models/Page');
const { requireAuth, optionalAuth, checkRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, checkRole('author'), async (req, res, next) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';

    if (!name) {
      return res.status(400).json({ error: 'Course name is required' });
    }

    const author = await Author.findById(req.user.id);
    if (!author) {
      return res.status(404).json({ error: 'Author not found' });
    }

    const course = await Course.create({
      creatorId: req.user.id,
      name,
      lessons: [],
      published: false,
    });

    if (!author.coursesMade.some((courseId) => courseId.equals(course._id))) {
      author.coursesMade.push(course._id);
      try {
        await author.save();
      } catch (err) {
        await Course.findByIdAndDelete(course._id);
        return next(err);
      }
    }

    return res.status(201).json({ course });
  } catch (err) {
    return next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const courses = await Course.find({ published: true })
      .populate({ path: 'lessons', populate: { path: 'pages' } })
      .lean();
    res.json({ courses });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
