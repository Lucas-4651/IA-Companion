// models/Tip.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Tip = sequelize.define('Tip', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    set(value) {
      // Détecter et formater les listes numérotées
      if (value.match(/\d\)\s/g)) {
        const items = value.split(/\d\)\s/).slice(1);
        const formatted = items.map((item, i) => 
          `${i+1}) ${item.trim()}`
        ).join('\n');
        this.setDataValue('content', formatted);
      } else {
        this.setDataValue('content', value);
      }
    }
  },
  category: {
    type: DataTypes.STRING,
    set(value) {
      this.setDataValue('category', value ? value.trim().toLowerCase() : null);
    }
  }
});

module.exports = Tip;