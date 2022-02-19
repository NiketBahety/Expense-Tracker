const express = require('express');
const expenseController = require('../controllers/expenseController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(authController.protect, expenseController.getExpenses)
  .post(authController.protect, expenseController.addExpenses);

router
  .route('/date')
  .get(authController.protect, expenseController.getExpensesByDate);

router
  .route('/:id')
  .get(expenseController.getOneExpense)
  .patch(expenseController.updateExpenses)
  .delete(expenseController.deleteExpenses);
module.exports = router;
