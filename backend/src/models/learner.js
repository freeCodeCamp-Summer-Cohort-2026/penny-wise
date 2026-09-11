const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require('unique-names-generator');
const generateRandomUsernameConfig = {
  dictionaries: [adjectives, colors, animals],
  separator: '-',
  style: 'lowerCase',
  length: 3,
};
// e.g. "quiet-yellow-falcon"

const learnerSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      default: () => uniqueNamesGenerator(generateRandomUsernameConfig),
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

learnerSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.passwordHash);
};

learnerSchema.statics.hashPassword = function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
};

learnerSchema.methods.toJSON = function toJSON() {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('Learner', learnerSchema);
