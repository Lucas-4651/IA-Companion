// routes/commentRoutes.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const commentController = require('../controllers/commentController');

router.post('/', ensureAuthenticated, commentController.addCommentWithRating);
router.get('/:aiId', commentController.getCommentsForAI);

module.exports = router;
