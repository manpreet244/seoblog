const express = require('express');
const router = express.Router()
const {create , list , read , remove} = require('../controllers/category')
const {runValidation} = require('../validators')
const { categoryValidator } = require('../validators/category');
const { requireSignin , adminMiddleware } = require('../controllers/auth');

//only admin well be able to create category
router.post('/category' , categoryValidator , runValidation , requireSignin ,adminMiddleware , create )
//get all categories
router.get('/categories' , requireSignin ,adminMiddleware ,list)
//get single category
router.get('/categories/:slug' ,requireSignin ,adminMiddleware , read)
//delete category
router.delete('/categories/:slug' ,requireSignin ,adminMiddleware , remove)



module.exports = router

