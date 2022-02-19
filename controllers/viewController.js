const Expense = require('../models/expenseModel');

exports.getLandingPage = async (req, res, next) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort(
      'createdAt'
    );
    let inc = 0,
      exp = 0,
      total;

    expenses.forEach((val) => {
      if (val.type == 'Income') inc = inc + val.amount;
      if (val.type == 'Expense') exp = exp + val.amount;
    });

    total = inc - exp;
    res.status(200).render('base', {
      expenses,
      inc,
      exp,
      total,
      title: 'Expense Tracker',
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
};

exports.login = async (req, res) => {
  if (!res.locals.user) {
    res.status(200).render('login', {
      title: 'Login',
      user: '401',
    });
  } else {
    res.status(200).render('login', {
      title: 'Login',
      user: '200',
    });
  }
};

exports.signup = (req, res, next) => {
  res.status(200).render('signup', {
    title: 'SignUp',
  });
};
