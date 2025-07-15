// routes/admin.js

const express = require('express');
const router = express.Router();
const multer = require('multer');

// Configuration Multer pour le traitement en mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 🛡️ Middlewares
const { ensureAdminAuthenticated } = require('../middlewares/auth');
const { ensureAuthenticated, ensureAdmin } = require('../middlewares/auth');

// 🎮 Contrôleurs
const adminController = require('../controllers/adminController');
const promptController = require('../controllers/promptController');
const tipController = require('../controllers/tipController');

// ==================== 🔐 Dashboard & Gestion ====================
router.get('/dashboard', ensureAdminAuthenticated, adminController.dashboard);
router.get('/ais', ensureAdminAuthenticated, adminController.manageAIs);
router.get('/prompts', ensureAdminAuthenticated, adminController.managePrompts);
router.get('/tips', ensureAdminAuthenticated, adminController.manageTips);
router.get('/users', ensureAdminAuthenticated, adminController.manageUsers);
router.get('/comments', ensureAdminAuthenticated, adminController.manageComments);
router.get('/settings', ensureAdminAuthenticated, adminController.settings);

// ==================== 🗂️ Catégories ====================
router.get('/categories', ensureAdminAuthenticated, adminController.manageCategories);
router.post('/categories/add', ensureAdminAuthenticated, adminController.addCategory);

// ==================== 🤖 IA ====================
router.get('/ais/new', ensureAdminAuthenticated, adminController.showCreateAIForm);
router.post('/ai/create', ensureAdminAuthenticated, adminController.createAI);
router.post('/ai/:id/update', ensureAdminAuthenticated, adminController.updateAI);
router.post('/ai/:id/delete', ensureAdminAuthenticated, adminController.deleteAI);
router.post('/ai/:id/toggle-featured', ensureAdminAuthenticated, adminController.toggleFeatured);

router.post(
  '/ais/import', 
  ensureAdminAuthenticated, 
  upload.single('jsonFile'), // Doit correspondre au nom du champ
  adminController.importAIs
);

// routes/admin.js

// ... autres routes ...

// ==================== 💬 Prompt & Tip ====================
router.post('/prompt/create', ensureAdminAuthenticated, promptController.createPrompt);
router.post(
  '/prompts/import', 
  ensureAdminAuthenticated, 
  upload.single('jsonFile'), 
  adminController.importPrompts
);
router.post('/tip/create', ensureAdminAuthenticated, tipController.createTip);
router.post(
  '/tips/import', 
  ensureAdminAuthenticated, 
  upload.single('jsonFile'), 
  adminController.importTips  // Nouvelle route
);

// ... autres routes ...



module.exports = router;