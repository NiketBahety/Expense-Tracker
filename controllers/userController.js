const catchAsync = require('../utils/catchAsync');
const appError = require('../utils/appError');
const User = require('../models/userModel');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    data: {
      users,
    },
  });
});
