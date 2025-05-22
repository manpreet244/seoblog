const express = require('express');
const router = express.Router()
const {signup , signin , signout , requireSignin} = require('../controllers/auth')
const {runValidation} = require('../validators')
const {userSignUpValidator , userSignInValidator} = require('../validators/auth');

router.post('/signup', userSignUpValidator , runValidation ,signup)
router.post('/signin', userSignInValidator , runValidation ,signin)
router.get('/signout' , signout);
//test
// for testing, /secret rourte , get token by signins in
//use that token in headers
router.get('/secret' , requireSignin ,  (req , res) => {
    res.json({
        user : req.user
    })
});

module.exports = router

