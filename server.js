require('dotenv').config();
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/database');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  store: new SequelizeStore({ db: sequelize }),
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 }
}));

// Pass user data to all views
// server.js (dans le middleware qui passe les variables aux vues)
app.use((req, res, next) => {
  res.locals.user = req.session.user || null; // Garantit que user est toujours défini
  next();
});

// Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/user', require('./routes/userRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/ai', require('./routes/aiRoutes'));
app.use('/prompts', require('./routes/promptRoutes'));
app.use('/favorites', require('./routes/favoriteRoutes'));
app.use('/comments', require('./routes/commentRoutes'));
app.use('/tips', require('./routes/tipRoutes'));
app.use('/categories', require('./routes/categoryRoutes'));
// À ajouter juste après la synchronisation de la base
// server.js (remplacez la partie synchronisation)
sequelize.sync({ force: false }).then(async () => {
  console.log('Database synced!');
  
  // Créer un utilisateur admin
  const { User } = require('./models');
  try {
    const admin = await User.findOne({ where: { email: 'admin@example.com' }});
    if (!admin) {
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'adminpassword', // Serahaché automatiquement
        isAdmin: true
      });
      console.log('Admin user created');
    }
  } catch (error) {
    console.error('Error creating admin:', error);
  }

  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}).catch(err => {
  console.error('Database sync error:', err);
});


// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { error: err.message });
});