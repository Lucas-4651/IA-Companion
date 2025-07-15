const { AI, Prompt, User, Comment, Favorite, Rating, Tip } = require('../models');

// Nouvelle méthode d'importation JSON
exports.importAIs = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucun fichier téléchargé' 
      });
    }

    const overwrite = req.body.overwrite === 'true';
    const fileContent = req.file.buffer.toString('utf-8');
    let aiList;

    try {
      aiList = JSON.parse(fileContent);
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: 'Format JSON invalide' 
      });
    }

    if (!Array.isArray(aiList)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Le fichier doit contenir un tableau d\'IA' 
      });
    }

    const results = {
      added: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
      errorDetails: []
    };

    for (const [index, aiData] of aiList.entries()) {
      try {
        // Validation minimale
        if (!aiData.name || !aiData.specialty) {
          throw new Error('Champs obligatoires manquants (name ou specialty)');
        }

        const [ai, created] = await AI.findOrCreate({
          where: { name: aiData.name },
          defaults: {
            name: aiData.name,
            specialty: aiData.specialty,
            description: aiData.description || 'Description non fournie',
            strengths: aiData.strengths || '',
            useCases: aiData.useCases || '',
            website: aiData.website || '',
            isFeatured: aiData.isFeatured || false
          }
        });

        if (created) {
          results.added++;
        } else if (overwrite) {
          await ai.update({
            specialty: aiData.specialty || ai.specialty,
            description: aiData.description || ai.description,
            strengths: aiData.strengths || ai.strengths,
            useCases: aiData.useCases || ai.useCases,
            website: aiData.website || ai.website,
            isFeatured: aiData.isFeatured || ai.isFeatured
          });
          results.updated++;
        } else {
          results.skipped++;
        }
      } catch (error) {
        results.errors++;
        results.errorDetails.push({
          index,
          name: aiData.name || 'N/A',
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: 'Importation terminée',
      ...results
    });

  } catch (error) {
    console.error('Erreur d\'importation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de l\'importation',
      error: error.message 
    });
  }
};

// ... autres méthodes existantes ...

exports.toggleFeatured = async (req, res) => {
  try {
    const ai = await AI.findByPk(req.params.id);
    if (!ai) return res.status(404).send('IA non trouvée');
    
    ai.isFeatured = !ai.isFeatured;
    await ai.save();
    
    res.json({ success: true, isFeatured: ai.isFeatured });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};


// Autres méthodes avec le paramètre currentPage
exports.manageAIs = async (req, res) => {
  try {
    const ais = await AI.findAll();
    res.render('admin/ais', {
      title: 'Gestion des IA',
      currentPage: 'ais',
      ais
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

exports.managePrompts = async (req, res) => {
  try {
    const prompts = await Prompt.findAll();
    res.render('admin/prompts', {
      title: 'Gestion des Prompts',
      currentPage: 'prompts',
      prompts
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

exports.manageTips = async (req, res) => {
  try {
    const tips = await Tip.findAll();
    res.render('admin/tips', {
      title: 'Gestion des Astuces',
      currentPage: 'tips',
      tips
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

exports.manageUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ['id', 'username', 'email', 'isAdmin', 'createdAt']
    });
    res.render('admin/users', {
      title: 'Gestion des Utilisateurs',
      currentPage: 'users',
      users
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

exports.manageComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        { model: User, attributes: ['username'] },
        { model: AI, attributes: ['name'] }
      ]
    });
    res.render('admin/comments', {
      title: 'Gestion des Commentaires',
      currentPage: 'comments',
      comments
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

exports.dashboard = async (req, res) => {
  try {
    const aiCount = await AI.count();
    const userCount = await User.count();
    const promptCount = await Prompt.count();
    const commentCount = await Comment.count();
    const tipCount = await Tip.count();
    
    // Données de test pour l'activité
    const activities = [
      { type: 'IA', description: 'Nouvelle IA ajoutée: DeepSeek Coder', date: new Date() },
      { type: 'Utilisateur', description: 'Nouvel utilisateur: John Doe', date: new Date(Date.now() - 86400000) },
      { type: 'Commentaire', description: 'Nouveau commentaire sur ChatGPT', date: new Date(Date.now() - 172800000) }
    ];
    
    res.render('admin/dashboard', {
      title: 'Tableau de bord',
      currentPage: 'dashboard',
      stats: { aiCount, userCount, promptCount, commentCount, tipCount },
      activities
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

// CRUD operations for AI
exports.createAI = async (req, res) => {
  try {
    const ai = await AI.create(req.body);
    res.redirect('/admin/ais');
  } catch (error) {
    console.error(error);
    res.redirect('/admin/ais?error=create');
  }
};

exports.updateAI = async (req, res) => {
  try {
    const ai = await AI.findByPk(req.params.id);
    if (!ai) return res.status(404).send('IA non trouvée');
    
    await ai.update(req.body);
    res.redirect('/admin/ais');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

exports.deleteAI = async (req, res) => {
  try {
    const ai = await AI.findByPk(req.params.id);
    if (!ai) return res.status(404).send('IA non trouvée');
    
    await ai.destroy();
    res.redirect('/admin/ais');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

exports.getUserFavorites = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: AI,
          attributes: ['id', 'name', 'description', 'specialty']
        }
      ]
    });
    
    res.render('user/favorites', { favorites });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};
exports.settings = async (req, res) => {
  try {
    res.render('admin/settings', {
      title: 'Paramètres',
      currentPage: 'settings'
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};
exports.showCreateAIForm = (req, res) => {
  res.render('admin/ai-new', {
    title: 'Créer une nouvelle IA',
    currentPage: 'ais'
  });
};

// controllers/adminController.js
exports.manageCategories = async (req, res) => {
  try {
    const categories = await Prompt.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('category')), 'category']
      ],
      order: [['category', 'ASC']]
    });
    
    res.render('admin/categories', {
      title: 'Gestion des Catégories',
      currentPage: 'categories',
      categories: categories.map(c => c.category)
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { category } = req.body;
    // Vérifier si la catégorie existe déjà
    const exists = await Prompt.findOne({ where: { category } });
    
    if (!exists) {
      // Créer un prompt vide pour la catégorie
      await Prompt.create({
        title: `Catégorie: ${category}`,
        content: 'Cette catégorie a été ajoutée par l\'administrateur',
        category,
        difficulty: 'Débutant'
      });
    }
    
    res.redirect('/admin/categories');
  } catch (error) {
    console.error(error);
    res.redirect('/admin/categories?error=add');
  }
};

// controllers/adminController.js
// controllers/adminController.js

// ... autres méthodes ...

// Nouvelle méthode pour l'import des astuces
exports.importTips = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucun fichier téléchargé' 
      });
    }

    const overwrite = req.body.overwrite === 'true';
    const fileContent = req.file.buffer.toString('utf-8');
    let tipList;

    try {
      tipList = JSON.parse(fileContent);
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: 'Format JSON invalide' 
      });
    }

    if (!Array.isArray(tipList)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Le fichier doit contenir un tableau d\'astuces' 
      });
    }

    const results = {
      added: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
      errorDetails: []
    };

    for (const [index, tipData] of tipList.entries()) {
      try {
        // Validation minimale
        if (!tipData.title || !tipData.content) {
          throw new Error('Champs obligatoires manquants (title ou content)');
        }

        // Normaliser la catégorie
        const category = tipData.category ? tipData.category.trim().toLowerCase() : 'non-categorise';

        // Options pour findOrCreate
        const where = { title: tipData.title };
        const defaults = {
          title: tipData.title,
          content: tipData.content,
          category: category
        };

        const [tip, created] = await Tip.findOrCreate({
          where: where,
          defaults: defaults
        });

        if (created) {
          results.added++;
        } else if (overwrite) {
          await tip.update(defaults);
          results.updated++;
        } else {
          results.skipped++;
        }
      } catch (error) {
        results.errors++;
        results.errorDetails.push({
          index,
          title: tipData.title || 'N/A',
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: 'Importation terminée',
      ...results
    });

  } catch (error) {
    console.error('Erreur d\'importation des astuces:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de l\'importation',
      error: error.message 
    });
  }
};

// ... autres méthodes ...

// Nouvelle méthode pour l'import des prompts
exports.importPrompts = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aucun fichier téléchargé' 
      });
    }

    const overwrite = req.body.overwrite === 'true';
    const fileContent = req.file.buffer.toString('utf-8');
    let promptList;

    try {
      promptList = JSON.parse(fileContent);
    } catch (error) {
      return res.status(400).json({ 
        success: false, 
        message: 'Format JSON invalide' 
      });
    }

    if (!Array.isArray(promptList)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Le fichier doit contenir un tableau de prompts' 
      });
    }

    const results = {
      added: 0,
      updated: 0,
      skipped: 0,
      errors: 0,
      errorDetails: []
    };

    for (const [index, promptData] of promptList.entries()) {
      try {
        // Validation minimale
        if (!promptData.title || !promptData.content) {
          throw new Error('Champs obligatoires manquants (title ou content)');
        }

        // Normaliser la catégorie
        const category = promptData.category ? promptData.category.trim().toLowerCase() : 'non-categorise';

        // Options pour findOrCreate
        const where = { title: promptData.title };
        const defaults = {
          title: promptData.title,
          content: promptData.content,
          category: category,
          difficulty: promptData.difficulty || 'Débutant'
        };

        const [prompt, created] = await Prompt.findOrCreate({
          where: where,
          defaults: defaults
        });

        if (created) {
          results.added++;
        } else if (overwrite) {
          await prompt.update(defaults);
          results.updated++;
        } else {
          results.skipped++;
        }
      } catch (error) {
        results.errors++;
        results.errorDetails.push({
          index,
          title: promptData.title || 'N/A',
          error: error.message
        });
      }
    }

    res.json({
      success: true,
      message: 'Importation terminée',
      ...results
    });

  } catch (error) {
    console.error('Erreur d\'importation des prompts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Erreur serveur lors de l\'importation',
      error: error.message 
    });
  }
};