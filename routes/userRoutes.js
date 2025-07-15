const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
console.log('ensureAuthenticated:', ensureAuthenticated);
const userController = require('../controllers/userController');
const favoriteController = require('../controllers/favoriteController');


router.get('/dashboard', ensureAuthenticated, userController.dashboard);
router.get('/favorites', ensureAuthenticated, favoriteController.getUserFavorites);



module.exports = router;