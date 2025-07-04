const express = require('express');
const router = express.Router()
const {create , list , listSearch, listByUser , listAllBlogsCategoriesTags , listRelated ,read , remove , update , photo} = require('../controllers/blog')
const {requireSignin , authMiddleware ,adminMiddleware  , canUpdateDeleteBlog} = require('../controllers/auth')

router.post('/blog',requireSignin , adminMiddleware, create)
router.get('/blogs' , list);
router.post('/blogs-categories-tags' , listAllBlogsCategoriesTags);
router.get('/blog/:slug' , read);
router.delete('/blog/:slug' , requireSignin , adminMiddleware, remove);
router.put('/blog/:slug' , requireSignin , adminMiddleware, update);
router.get('/blog/photo/:slug' , photo)
router.get('/blogs/search' , listSearch)
router.post('/blogs/related' , listRelated)

//auth user blog crud
router.get('/:username/blogs' , listByUser);
router.post('/user/blog',requireSignin , authMiddleware, create)
router.delete('/user/blog/:slug' , requireSignin , authMiddleware, canUpdateDeleteBlog,remove);
router.put('/user/blog/:slug' , requireSignin , authMiddleware, canUpdateDeleteBlog,update);

module.exports = router