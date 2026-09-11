const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const countrySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
});

module.exports = model('Country', countrySchema);
