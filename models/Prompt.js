const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Prompt = sequelize.define('Prompt', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  category: {
    type: DataTypes.STRING,
    set(value) {
      this.setDataValue(
        'category',
        value.trim().toLowerCase()
      );
    }
  },
  difficulty: {
    type: DataTypes.ENUM('Débutant', 'Intermédiaire', 'Avancé'),
    defaultValue: 'Débutant'
  },
  usageCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = Prompt;