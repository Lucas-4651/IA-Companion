const express = require('express');
const router = express.Router();
const { 
  ensureClientAuthenticated, 
  ensureAdminAuthenticated,
  redirectIfAdmin,
  redirectIfClient
} = require('../middlewares/auth');
const userController = require('../controllers/userController');
const adminController = require('../controllers/adminController');
const authController = require('../controllers/authController');
const aiController = require('../controllers/aiController');
const tipController = require('../controllers/tipController');


// Routes client
router.get('/user/dashboard', ensureClientAuthenticated, userController.dashboard);
// ... autres routes client ...

// Routes admin
router.get('/admin/dashboard', ensureAdminAuthenticated, adminController.dashboard);
// ... autres routes admin ...

// Routes d'authentification
router.get('/auth/login', redirectIfClient, authController.clientLoginForm);
router.get('/auth/admin/login', redirectIfAdmin, authController.adminLoginForm);

router.get('/', async (req, res) => {
  try {
    const featuredAIs = await aiController.getFeaturedAIs();
    const latestTips = await tipController.getLatestTips();
    res.render('index', { 
      featuredAIs, 
      latestTips,
      user: req.session.user 
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { error: 'Server error' });
  }
});

module.exports = router;