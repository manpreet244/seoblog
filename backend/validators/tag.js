
const check = require('express-validator').check;
exports.tagValidator = [
    check("name")
        .not()
        .isEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3, max: 32 })
        .withMessage('Name must be between 3 to 32 characters'),
    
];