const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      trim: true,
      required: [true, 'A name is required'],
    },
    amount: {
      type: Number,
      required: [true, 'An amount is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    type: {
      type: String,
      enum: ['Expense', 'Income'],
      default: 'Expense',
    },
    category: {
      type: String,
      enum: ['Personal', 'Business', 'Others', 'Household', 'Monthly'],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'An expense must belong to a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model('Expense', expenseSchema);
