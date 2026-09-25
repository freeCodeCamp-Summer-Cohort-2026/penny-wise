const mongoose = require('mongoose');

const briefLessonImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    alt: {
      type: String,
      required: true,
      trim: true,
    },
    caption: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const briefLessonSectionSchema = new mongoose.Schema(
  {
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    body: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: briefLessonImageSchema,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const briefLessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    kicker: {
      type: String,
      trim: true,
    },
    readTimeMinutes: {
      type: Number,
      min: 1,
      default: 3,
    },
    introduction: {
      type: String,
      required: true,
      trim: true,
    },
    heroImage: {
      type: briefLessonImageSchema,
      required: true,
    },
    sections: {
      type: [briefLessonSectionSchema],
      required: true,
      validate: {
        validator: (sections) => sections.length > 0,
        message: 'A brief lesson needs at least one section',
      },
    },
    takeaway: {
      type: String,
      trim: true,
    },
  },
  { _id: false },
);

const lessonSchema = new mongoose.Schema(
  {
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    experience: {
      type: Number,
      default: 10,
    },
    pages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Page' }],
    estimatedDurationOfCompletionInMinutes: {
      type: Number,
      default: 15,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxLength: [400, 'Description cannot exceed 400 characters'],
    },
    briefLesson: {
      type: briefLessonSchema,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Lesson', lessonSchema);
