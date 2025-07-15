const sequelize = require('../config/database');
require('../models');

(async () => {
  try {
    await sequelize.sync({ force: false }); // force: false pour ne PAS tout écraser
    console.log('✅ Database synced.');
    process.exit();
  } catch (err) {
    console.error('❌ Sync error:', err);
  }
})();