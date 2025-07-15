const { Prompt } = require('../models');
const sequelize = require('../config/database'); // Ajoutez cette ligne
exports.promptGeneratorPage = async (req, res) => {
  try {
    const popularPrompts = await Prompt.findAll({
      order: [['usageCount', 'DESC']],
      limit: 10
    });
    
    // Récupérer les catégories distinctes existantes
    const categories = await Prompt.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('category')), 'category']
      ],
      order: [['category', 'ASC']]
    });
    
    res.render('prompts/generator', { 
      popularPrompts,
      categories: categories.map(c => c.category) // Transformer en tableau simple
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

exports.generatePrompt = async (req, res) => {
  try {
    const { category, difficulty } = req.body;
    
    const prompt = await Prompt.findOne({
      where: { category, difficulty },
      order: sequelize.random()
    });
    
    if (!prompt) {
      return res.status(404).json({ error: 'Aucun prompt trouvé' });
    }
    
    // Increment usage count
    await prompt.increment('usageCount');
    
    res.json(prompt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.createPrompt = async (req, res) => {
  try {
    const prompt = await Prompt.create(req.body);
    res.status(201).json(prompt);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getAllPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.findAll();
    res.json(prompts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
exports.createPrompt = async (req, res) => {
  try {
    const { title, content, category, difficulty } = req.body;
    await Prompt.create({ title, content, category, difficulty });
    res.redirect('/admin/prompts');
  } catch (error) {
    console.error(error);
    res.redirect('/admin/prompts?error=create');
  }
};