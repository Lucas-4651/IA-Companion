// scripts/seedPrompts.js

const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');
const Prompt = require('../models/Prompt');

async function seedPrompts() {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../prompts_2000_unique.json'), 'utf8');
    const prompts = JSON.parse(data);

    await sequelize.sync({ force: false }); // Tu peux mettre `true` si tu veux reset la table

    for (const prompt of prompts) {
      await Prompt.create(prompt);
    }

    console.log('✅ Prompts bien injectés dans la DB SQLite.');
    process.exit();
  } catch (err) {
    console.error('❌ Erreur lors du seed:', err);
    process.exit(1);
  }
}

seedPrompts();