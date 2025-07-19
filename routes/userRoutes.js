const express       = require('express');
const multer        = require('multer');
const path          = require('path');
const bcrypt        = require('bcrypt');
const { ensureAuthenticated } = require('../middlewares/auth');
const { User, Comment, ChatMessage } = require('../models');
const webpush       = require('web-push');

const router = express.Router();

/* ---------- AVATAR UPLOAD ---------- */
const storage = multer.diskStorage({
  destination: './public/uploads/avatars',
  filename: (req, file, cb) => cb(null, `${req.session.user.id}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

/* ---------- DASHBOARD ---------- */
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
  const user = await User.findByPk(req.session.user.id);
  const favoritesCount = await user.countFavorites();
  const commentsCount    = await Comment.count({ where: { userId: user.id } });
  const lastLogin        = user.lastLogin ? user.lastLogin.toLocaleString('fr-FR') : 'Jamais';
  res.render('dashboard', { user, favoritesCount, commentsCount, lastLogin });
});
// routes/userRoutes.js
router.post('/settings/username', ensureAuthenticated, async (req, res) => {
  const { username } = req.body;
  const user = await User.findByPk(req.session.user.id);
  user.username = username;
  await user.save();
  res.json({ ok: true });
});

router.post('/settings/password', ensureAuthenticated, async (req, res) => {
  const { password } = req.body;
  const user = await User.findByPk(req.session.user.id);
  user.password = await bcrypt.hash(password, 12);
  await user.save();
  res.json({ ok: true });
});

/* ---------- SETTINGS ---------- */
router.get('/settings', ensureAuthenticated, (req, res) => res.render('user/settings', { user: req.session.user }));
router.post('/settings', ensureAuthenticated, async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findByPk(req.session.user.id);
  if (username) user.username = username;
  if (password) user.password = await bcrypt.hash(password, 12);
  await user.save();
  req.session.user = user.toJSON();
  res.redirect('/dashboard');
});


router.post('/settings/avatar', ensureAuthenticated, upload.single('avatar'), async (req, res) => {
  if (!req.file) {                       // 1. sécurité
    return res.status(400).json({ error: 'Aucun fichier' });
  }
  const user = await User.findByPk(req.session.user.id);
  user.avatar = `/uploads/avatars/${req.file.filename}`;
  await user.save();
  res.json({ avatar: user.avatar });
});

/* ---------- WEB-PUSH ---------- */
router.post('/push/subscribe', ensureAuthenticated, async (req, res) => {
  await User.update({ pushSubscription: JSON.stringify(req.body) }, { where: { id: req.session.user.id } });
  res.sendStatus(201);
});

/* ---------- WEBSOCKET CHAT ---------- */
router.get('/chat/history', ensureAuthenticated, async (req, res) => {
  const msgs = await ChatMessage.findAll({ order: [['createdAt', 'ASC']], limit: 50 });
  res.json(msgs);
});

// routes/userRoutes.js
router.delete('/settings/avatar', ensureAuthenticated, async (req, res) => {
  const user = await User.findByPk(req.session.user.id);
  user.avatar = null;
  await user.save();
  res.json({ avatar: '/img/default.png' });
});


module.exports = router;
