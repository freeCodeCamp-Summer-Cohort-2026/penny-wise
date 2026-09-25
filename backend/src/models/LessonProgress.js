const mongoose = require('mongoose');

const pageResultSchema = new mongoose.Schema({
  pageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Page',
    required: true,
  },
  pageIndex: { type: Number, required: true, min: 0 },
  attempts: { type: Number, default: 0, min: 0 },
  firstAttemptCorrect: { type: Boolean, default: false },
  satisfied: { type: Boolean, default: false },
  lastAnswerHash: { type: String, default: null },
  submittedAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null },
});

const lessonProgressSchema = new mongoose.Schema(
  {
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    state: {
      type: String,
      enum: ['in_progress', 'completed'],
      default: 'in_progress',
      required: true,
    },
    currentPage: { type: Number, default: 0, min: 0 },
    score: { type: Number, default: 0, min: 0 },
    pageResults: { type: [pageResultSchema], default: [] },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date, default: null },
  },
  {
    collection: 'lessonProgresses',
    timestamps: true,
    optimisticConcurrency: true,
  },
);

lessonProgressSchema.index(
  { learner: 1, course: 1, lesson: 1 },
  { unique: true },
);

module.exports = mongoose.model('LessonProgress', lessonProgressSchema);
