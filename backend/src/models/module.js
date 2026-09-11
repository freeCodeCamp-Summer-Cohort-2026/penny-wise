const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const LESSON_STATES = ['draft', 'published', 'archived'];
const LAB_STEP_STATES = ['save', 'spend', 'earn'];

const InteractiveSectionWithinLessonSchema = new mongoose.Schema({
  question: { type: String, required: true },
  image: { type: String, required: true },
  answer: { type: String, required: true },
});

const LessonSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  state: { type: String, enum: LESSON_STATES, default: 'draft' },
  interactive_section: {
    type: [InteractiveSectionWithinLessonSchema],
  },
});

const LabStepSchema = new Schema({
  type: {
    type: String,
    enum: LAB_STEP_STATES,
    required: true,
  },
  task: { type: String, required: true },
  image: { type: String, required: true },
  choices: { type: [String] },
});

const LabSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  intro: { type: String, required: true },
  state: { type: String, enum: LESSON_STATES, default: 'draft' },
  steps: [LabStepSchema],
});

const ModuleSchema = new Schema({
  name: { type: String },
  description: { type: String },
  icon: { type: String },
  lessons: [LessonSchema],
  labs: [LabSchema],
});

module.exports = model('Module', ModuleSchema);
