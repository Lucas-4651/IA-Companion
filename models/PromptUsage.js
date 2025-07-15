// models/PromptUsage.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PromptUsage = sequelize.define('PromptUsage', {
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  promptId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  }
});

module.exports = PromptUsage;