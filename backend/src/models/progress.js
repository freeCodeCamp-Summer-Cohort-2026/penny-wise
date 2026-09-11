const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const PROGRESS_STATES = ['not-started', 'in-progress', 'completed'];
const ITEM_TYPES = ['lesson', 'lab'];
const ResponseSchema = new Schema(
  {
    sectionId: { type: Schema.Types.ObjectId, required: true }, // _id of the interactive_section entry
    submitted: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false },
);

const ProgressSchema = new Schema({
  learner: { type: Schema.Types.ObjectId, ref: 'Learner', required: true },
  module: { type: Schema.Types.ObjectId, ref: 'Module', required: true },
  itemId: { type: Schema.Types.ObjectId, required: true },
  itemType: { type: String, enum: ITEM_TYPES, required: true },
  state: { type: String, enum: PROGRESS_STATES, default: 'not-started' },
  responses: [ResponseSchema],
  startedAt: Date,
  completedAt: Date,
});

ProgressSchema.index({ learner: 1, itemId: 1 }, { unique: true });

module.exports = model('Progress', ProgressSchema);
