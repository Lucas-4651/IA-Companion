const { User } = require('../models');
const bcrypt = require('bcryptjs');

// Authentification client
exports.clientLoginForm = (req, res) => {
  res.render('auth/client-login', { error: req.query.error });
};

exports.clientLogin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await user.validPassword(password))) {
      return res.redirect('/auth/login?error=invalid');
    }
    
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    };
    
    res.redirect('/user/dashboard');
  } catch (error) {
    res.redirect('/auth/login?error=server');
  }
};

exports.clientRegisterForm = (req, res) => {
  res.render('auth/client-register', { error: req.query.error });
};



exports.clientRegister = async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;
  
  if (password !== confirmPassword) {
    return res.redirect('/auth/register?error=password');
  }
  
  try {
    const existingUser = await User.findOne({ where: { email } });
    
    if (existingUser) {
      return res.redirect('/auth/register?error=email');
    }
    
    const user = await User.create({
      username,
      email,
      password,
      isAdmin: false
    });
    
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      lastLogin: new Date(),
      isAdmin: user.isAdmin
    };
    
    res.redirect('/user/dashboard');
  } catch (error) {
    console.error(error);
    res.redirect('/auth/register?error=server');
  }
};

// Authentification admin
exports.adminLoginForm = (req, res) => {
  res.render('auth/admin-login', { error: req.query.error });
};

exports.adminLogin = async (req, res) => {
  const { email, password } = req.body;
  
  try {
    const user = await User.findOne({ where: { email } });
    
    if (!user || !(await user.validPassword(password))) {
      return res.redirect('/auth/admin/login?error=invalid');
    }
    
    // Vérifier que l'utilisateur est admin
    if (!user.isAdmin) {
      return res.redirect('/auth/admin/login?error=notadmin');
    }
    
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      isAdmin: true
    };
    
    res.redirect('/admin/dashboard');
  } catch (error) {
    res.redirect('/auth/admin/login?error=server');
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
