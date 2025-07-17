// routes/promptFavorite.js
const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../middlewares/auth');
const PromptFavorite = require('../models/PromptFavorite');

router.post('/toggle-prompt', ensureAuthenticated, async (req, res) => {
  const { prompt } = req.body;
  const userId = req.user.id;

  const exists = await PromptFavorite.findOne({ where: { userId, prompt } });
  if (exists) {
    await PromptFavorite.destroy({ where: { userId, prompt } });
    return res.json({ favorited: false });
  } else {
    await PromptFavorite.create({ userId, prompt });
    return res.json({ favorited: true });
  }
});

module.exports = router;
