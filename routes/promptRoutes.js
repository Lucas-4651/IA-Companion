const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const promptController = require('../controllers/promptController');

router.get('/', promptController.promptGeneratorPage);
router.post('/generate', ensureAuthenticated, promptController.generatePrompt);

module.exports = router;