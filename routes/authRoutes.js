const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes client
router.get('/login', authController.clientLoginForm);
router.post('/login', authController.clientLogin);
router.get('/register', authController.clientRegisterForm);
router.post('/register', authController.clientRegister);

// Routes admin
router.get('/admin/login', authController.adminLoginForm);
router.post('/admin/login', authController.adminLogin);

// Logout commun
router.get('/logout', authController.logout);

module.exports = router;