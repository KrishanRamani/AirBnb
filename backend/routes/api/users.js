const express = require('express');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const router = express.Router();

const validateSignup = [
  check('email')
    //.exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Invalid email'),
  //.withMessage('Invalid email'),
  check('firstname')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a firstname with at least 4 characters.'),
  check('lastname')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a lastname with at least 4 characters.'),
  check('firstname')
    .not()
    .isEmail()
    .withMessage('firstname cannot be an email.'),
  check('lastname')
    .not()
    .isEmail()
    .withMessage('lastname cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res, next) => {
    const { email, password, firstname, lastname } = req.body;
    const user = await User.signup({ email, firstname, lastname, password });
    const oldUser = await User.findOne({ where: { email } })
    if (oldUser) {
      const error = new Error("User already exists")
      error.status = 403;

      const errors = {
        email: "User with that email already exists"
      }
      error.errors = errors;
      return next(error);
    }
    await setTokenCookie(res, user);

    return res.json({
      user,
    });
  }
);


module.exports = router;

