const express = require('express');
const router = express.Router()
const {signup , signin} = require('../controllers/auth')
const {runValidation} = require('../validators')
const {userSignUpValidator , userSignInValidator} = require('../validators/auth');

router.post('/signup', userSignUpValidator , runValidation ,signup)
router.post('/signin', userSignInValidator , runValidation ,signin)
module.exports = router

