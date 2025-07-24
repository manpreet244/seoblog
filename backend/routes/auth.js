const express = require("express");
const router = express.Router();

const {
  signup,
  signinUser,          
  signinAdmin,         
  signout,
  requireSignin,
  forgotPassword,
  resetPassword
} = require("../controllers/auth");

const { runValidation } = require("../validators");
const {
  userSignUpValidator,
  userSignInValidator,
  forgotPasswordValidator,
  resetPasswordValidator
} = require("../validators/auth");

router.post("/signup", userSignUpValidator, runValidation, signup);


router.post(
  "/signin",
  userSignInValidator,
  runValidation,
  signinUser
);


router.post(
  "/admin/signin",
  userSignInValidator,   
  runValidation,
  signinAdmin
);

router.get("/signout", signout);


router.get("/secret", requireSignin, (req, res) => {
  res.json({ user: req.user });
});
router.put('/forgot-password', forgotPasswordValidator, runValidation, forgotPassword);
router.put('/reset-password', resetPasswordValidator, runValidation, resetPassword);

module.exports = router;
