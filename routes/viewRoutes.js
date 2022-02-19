const express = require('express');
const viewController = require('../controllers/viewController');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/expenses')
  .get(authController.protect, viewController.getLandingPage);
router.route('/').get(authController.isLoggedIn, viewController.login);
router.route('/signup').get(viewController.signup);
module.exports = router;
