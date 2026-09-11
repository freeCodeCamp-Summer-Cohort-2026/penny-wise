const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const WALLET_TYPES = ['immediate', 'long-term'];

const WalletSchema = new Schema({
  learner: {
    type: Schema.Types.ObjectId,
    ref: 'Learner',
    required: true,
  },
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  country: {
    type: Schema.Types.ObjectId,
    ref: 'Country',
    required: true,
  },
  denominations: {
    type: Schema.Types.ObjectId,
    ref: 'Money',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: WALLET_TYPES,
  },
});

module.exports = model('Wallet', WalletSchema);
