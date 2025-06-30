const express = require('express');
const router = express.Router()
const {contactForm} = require('../controllers/form')
const {runValidation} = require('../validators')
const {contactFormValidator} = require('../validators/form');

//only admin well be able to create category
router.post('/contact' , contactFormValidator , runValidation  , contactForm )

module.exports = router

