const express = require('express');
const router = express.Router()
const {requireSignin , adminMiddleware } = require('../controllers/auth')
const {runValidation} = require('../validators')
const { tagValidator } = require('../validators/tag');
const { create, list, read, remove } = require('../controllers/tag');


router.post('/tag', tagValidator, runValidation, requireSignin, adminMiddleware, create);
router.get('/tags', requireSignin, adminMiddleware, list);
router.get('/tag/:slug', requireSignin, adminMiddleware, read);
router.delete('/tag/:slug', requireSignin, adminMiddleware, remove);
module.exports = router;