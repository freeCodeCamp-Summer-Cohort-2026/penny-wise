const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const baseOptions = {
  discriminatorKey: 'role',
  collection: 'users',
  timestamps: true,
};

const userSchema = new mongoose.Schema(
  {
    displayName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: { type: String, required: true },
    profilePic: {
      type: String,
      default: () =>
        `https://api.dicebear.com/10.x/avataaars/svg?seed=${crypto.randomUUID()}`,
    },
    country: { type: String, trim: true },
  },
  baseOptions,
);

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

userSchema.statics.hashPassword = function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
};

userSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);

const Learner = User.discriminator(
  'learner',
  new mongoose.Schema({
    coursesEnrolled: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    level: { type: Number, default: 1, min: 1 },
    experience: { type: Number, default: 0, min: 0 },
    currentLives: { type: Number, default: 5, min: 0 },

    completedLessons: [
      {
        lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' },
        score: { type: Number, default: 0 },
        completedAt: { type: Date, default: Date.now },
      },
    ],
  }),
);

const Author = User.discriminator(
  'author',
  new mongoose.Schema({
    coursesMade: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    bio: { type: String, trim: true, maxlength: 500 },
  }),
);

module.exports = { User, Learner, Author };
