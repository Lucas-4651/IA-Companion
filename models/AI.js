const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AI = sequelize.define('AI', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  specialty: {
    type: DataTypes.STRING,
    allowNull: false
  },
  strengths: {
    type: DataTypes.TEXT
  },
  useCases: {
    type: DataTypes.TEXT
  },
  website: {
    type: DataTypes.STRING
  },
  isFeatured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
});

module.exports = AI;