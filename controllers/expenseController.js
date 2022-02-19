const Expense = require('../models/expenseModel');
const catchAsync = require('../utils/catchAsync');

// @desc get Expenses
// @route GET /api/v1/expenses
// @access public

exports.getExpenses = async (req, res, next) => {
  try {
    const expense = await Expense.find();

    return res.status(200).json({
      success: true,
      count: expense.length,
      data: expense,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc add Expenses
// @route POST /api/v1/expenses
// @access public

exports.addExpenses = async (req, res, next) => {
  try {
    const { text, amount, type, category, createdAt } = req.body;
    req.body.user = req.user.id;
    const expense = await Expense.create(req.body);
    res.status(201).json({
      success: true,
      data: expense,
    });
  } catch (err) {
    if (err.name == 'ValidationError') {
      const messages = Object.values(err.errors).map((val) => val.message);
      res.status(400).json({
        success: false,
        data: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        message: 'Server Error',
      });
    }
  }
};

// @desc delete Expenses
// @route DELETE /api/v1/expenses/:id
// @access public

exports.deleteExpenses = async (req, res, next) => {
  try {
    const expense = Expense.findById(req.params.id);
    if (!expense) {
      res.status(404).json({
        success: false,
        data: 'No such expense found !!',
      });
    }
    await expense.deleteOne();
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc update Expenses
// @route PATCH /api/v1/expenses/:id
// @access public

exports.updateExpenses = async (req, res, next) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // returns Updated Item
      runValidators: true, // checks Validators
    });
    if (!expense) {
      res.status(404).json({
        success: false,
        data: 'No such expense found !!',
      });
    }
    res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc get Expense
// @route GET /api/v1/expenses/:id
// @access public

exports.getOneExpense = async (req, res, next) => {
  try {
    const expense = await Expense.findById(req.params.id);

    return res.status(200).json({
      success: true,
      data: expense,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

// @desc get Expenses by Date
// @route GET /api/v1/expenses/date
// @access protected

exports.getExpensesByDate = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ user: req.user.id });
    const result = expenses.filter((expense) => {
      return (
        expense.createdAt.toISOString().substring(0, 10) === req.query.date
      );
    });
    res.status(200).json({
      success: true,
      data: result,
      length: result.length,
    });
  } catch (err) {
    res.status(404).json({
      success: false,
    });
  }
};
