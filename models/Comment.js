const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Comment = sequelize.define('Comment', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  aiId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'AIs',
      key: 'id'
    }
  }
});

module.exports = Comment;