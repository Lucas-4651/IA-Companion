const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const favoriteController = require('../controllers/favoriteController');

// Corriger la route (supprimer :aiId)
router.post('/toggle', ensureAuthenticated, favoriteController.toggleFavorite);

module.exports = router;