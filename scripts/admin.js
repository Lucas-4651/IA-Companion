require('dotenv').config();
const sequelize = require('../config/database');
const { User } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connected to DB');

    const admin = await User.findOne({ where: { email: 'admin@example.com' }});
    if (!admin) {
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: 'adminpassword',
        isAdmin: true
      });
      console.log('✅ Admin created!');
    } else {
      console.log('🟢 Admin already exists.');
    }

    await sequelize.close();
  } catch (e) {
    console.error('❌ Error:', e);
  }
})();