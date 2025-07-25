const {check} = require("express-validator")
//  check('name') Looks in req.body by Default
exports.userSignUpValidator =[
    check("name").not().isEmpty().withMessage('Name is required'),
    check("email").isEmail().withMessage("Email is required"),
    check("password").isLength({min : 6}).withMessage("Password must be atleast 6 characters long")


]


exports.userSignInValidator =[
    check("email").isEmail().withMessage("Email is required"),
    check("password").isLength({min : 6}).withMessage("Password must be atleast 6 characters long")


]


exports.forgotPasswordValidator =[
    check("email").isEmail().not().isEmpty()
    .withMessage("Email is required"),
]
exports.resetPasswordValidator =[
    
    check("newPassword")
    .isLength({min : 6}).withMessage("Password must be atleast 6 characters long")


]
