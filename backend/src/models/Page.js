const mongoose = require('mongoose');

const pageSchema = new mongoose.Schema(
  {
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Lesson',
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
    },
    audioUrl: {
      type: String,
    },
    incorrectMessage: {
      type: String,
    },
  },
  {
    discriminatorKey: 'type',
    collection: 'pages',
  }
);

const Page = mongoose.model('Page', pageSchema);

const MultipleChoicePage = Page.discriminator(
  'multiple_choice',
  new mongoose.Schema({
    options: [
      {
        answerText: { type: String, required: true },
        isCorrect: { type: Boolean, default: false },
      },
    ],
  })
);

const MatchingPage = Page.discriminator(
  'matching',
  new mongoose.Schema({
    pairs: [
      {
        word: {
          type: String,
          required: [true, 'A word is required'],
          trim: true,
        },
        definition: {
          type: String,
          required: [true, 'A definition is required'],
          trim: true,
        },
      },
    ],
  })
);

const BudgetingPage = Page.discriminator(
  'budgeting',
  new mongoose.Schema({
    startingAmount: { type: Number, required: true, min: 0 },
    targetSavings: { type: Number, default: 0 },
    availableItems: [
      {
        name: { type: String, required: true },
        cost: { type: Number, required: true, min: 0 },
      },
    ],
  })
);

const WantsNeedsPage = Page.discriminator(
  'wants_needs',
  new mongoose.Schema({
    itemsToSort: [
      {
        name: { type: String, required: true },
        correctCategory: {
          type: String,
          enum: ['want', 'need'],
          required: true,
        },
      },
    ],
  })
);

module.exports = {
  Page,
  MultipleChoicePage,
  MatchingPage,
  BudgetingPage,
  WantsNeedsPage,
};
