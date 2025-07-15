const AI = require('../models/AI');
const sequelize = require('../config/database');
const fs = require('fs');

async function seed() {
  try {
    await sequelize.sync(); // Assure que la table existe

    const rawData = fs.readFileSync('data/ai_list.json'); // <-- Ton fichier JSON ici
    const aiList = JSON.parse(rawData);

    for (const ai of aiList) {
      await AI.create({
        name: ai.name,
        description: ai.description,
        specialty: ai.specialty,
        strengths: ai.strengths,
        useCases: ai.useCases,
        website: ai.website,
        isFeatured: ai.isFeatured || false
      });
    }

    console.log('✅  Toutes les IA ont été insérées avec succès.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error);
    process.exit(1);
  }
}

seed();