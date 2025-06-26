const express = require('express');
const router = express.Router()
const {authMiddleware , requireSignin} = require('../controllers/auth')
const {read , publicProfile} = require('../controllers/user')

router.get('/profile' , requireSignin , authMiddleware ,read);
//public user profile

router.get('/user/:username'  , publicProfile);
router.put('/user/update' ,  requireSignin , authMiddleware ,  )

module.exports = router

