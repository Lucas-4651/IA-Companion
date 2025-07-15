const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.get('/', aiController.getAllAIs);
router.get('/:id', aiController.getAIDetails);

module.exports = router;