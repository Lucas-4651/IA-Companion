const { Favorite, Comment, AI } = require('../models');

exports.dashboard = async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    // Compter les favoris
    const favoritesCount = await Favorite.count({ where: { userId } });
    
    // Compter les commentaires
    const commentsCount = await Comment.count({ where: { userId } });
    
    // Solution temporaire pour promptUsage (à remplacer par votre logique réelle)
    const promptUsage = 0; // Valeur par défaut
    
    // Compter les interactions IA distinctes
    const aiInteractions = await Comment.count({ 
      where: { userId },
      distinct: true,
      col: 'aiId'
    });

    // Récupérer les 5 dernières activités
    const recentComments = await Comment.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [{
        model: AI,
        attributes: ['name']
      }]
    });

    const recentActivity = recentComments.map(comment => ({
      type: 'comment',
      message: `Commentaire sur ${comment.AI.name}`,
      date: comment.createdAt
    }));

    // Récupérer la dernière connexion (exemple)
    const lastLogin = req.session.user.lastLogin || new Date();

    res.render('user/dashboard', {
      user: req.session.user,
      favoritesCount,
      commentsCount,
      promptUsage,
      aiInteractions,
      recentActivity,
      lastLogin: lastLogin.toLocaleString(),
      location: 'Paris, FR', // Exemple
      badges: [
        { name: 'Explorateur', icon: 'fas fa-compass', description: 'A exploré 5 IA différentes' }
      ],
      suggestions: [
        { text: 'Essayez ChatGPT', icon: 'fas fa-comment', link: '/ai/chatgpt' }
      ],
      emailNotifications: true,
      pushNotifications: false,
      newsletter: true
    });
  } catch (error) {
    console.error('Erreur dashboard:', error);
    res.status(500).send('Erreur serveur');
  }
};