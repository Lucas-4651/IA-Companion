// models/PromptFavorite.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PromptFavorite = sequelize.define('PromptFavorite', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Users', key: 'id' }
  },
  prompt: {
    type: DataTypes.TEXT,
    allowNull: false
  }
}, {
  indexes: [
    { unique: true, fields: ['userId', 'prompt'] }
  ]
});

module.exports = PromptFavorite;
