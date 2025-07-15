const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const commentController = require('../controllers/commentController');

// Corriger les routes
router.post('/add', ensureAuthenticated, commentController.addComment);
router.post('/rate', ensureAuthenticated, commentController.addRating);
router.get('/:aiId', commentController.getCommentsForAI); // Nouvelle route pour récupérer les commentaires

module.exports = router;