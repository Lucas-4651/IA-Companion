exports.ensureClientAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};

exports.ensureAdminAuthenticated = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    return next();
  }
  res.redirect('/auth/admin/login');
};

exports.redirectIfAdmin = (req, res, next) => {
  if (req.session.user && req.session.user.isAdmin) {
    return res.redirect('/admin/dashboard');
  }
  next();
};

exports.redirectIfClient = (req, res, next) => {
  if (req.session.user && !req.session.user.isAdmin) {
    return res.redirect('/user/dashboard');
  }
  next();
};

exports.ensureAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/auth/login');
};