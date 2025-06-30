const { check } = require('express-validator');

exports.contactFormValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name is required'),

  check('email')
    .isEmail()
    .withMessage('Must be a valid email'),

  check('message')
    .isLength({ min: 20 })
    .withMessage('Message must be at least 20 characters long.'),
];
