// models/index.js
const AI = require('./AI');
const User = require('./User');
const Comment = require('./Comment');
const Favorite = require('./Favorite');
const Prompt = require('./Prompt');
const Rating = require('./Rating');
const Tip = require('./Tip');

// models/index.js

// ... autres modèles ...

// Définir les associations
AI.hasMany(Favorite, { foreignKey: 'aiId' });
Favorite.belongsTo(AI, { foreignKey: 'aiId' });

User.hasMany(Favorite, { foreignKey: 'userId' });
Favorite.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Comment, { foreignKey: 'userId' }); // Ajouté
Comment.belongsTo(User, { foreignKey: 'userId' }); // Ajouté

AI.hasMany(Comment, { foreignKey: 'aiId' });
Comment.belongsTo(AI, { foreignKey: 'aiId' });

User.hasMany(Rating, { foreignKey: 'userId' });
Rating.belongsTo(User, { foreignKey: 'userId' });

// Export des modèles avec associations
module.exports = {
  AI,
  User,
  Comment,
  Favorite,
  Prompt,
  Rating,
  Tip
};