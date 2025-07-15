const { AI, Favorite, Comment, Rating } = require('../models');

exports.getAllAIs = async (req, res) => {
  try {
    const ais = await AI.findAll();

    // 🔁 Extraire dynamiquement toutes les spécialités uniques
    const specialties = [...new Set(ais.map(ai => ai.specialty).filter(Boolean))];

    res.render('ai/catalog', {
      ais,
      specialties,       // 🔥 Ajouté ici !
      user: req.session.user // Pour le bouton favoris
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};
exports.getAIDetails = async (req, res) => {
  try {
    const ai = await AI.findByPk(req.params.id);
    
    if (!ai) {
      return res.status(404).send('IA non trouvée');
    }
    
    // Check if current user has favorited this AI
    let isFavorite = false;
    if (req.session.user) {
      const favorite = await Favorite.findOne({
        where: {
          userId: req.session.user.id,
          aiId: ai.id
        }
      });
      isFavorite = !!favorite;
    }
    
    // Get comments
    const comments = await Comment.findAll({
      where: { aiId: ai.id },
      include: ['User']
    });
    
    // Get ratings
    const ratings = await Rating.findAll({ 
      where: { aiId: ai.id }
    });
    
    // Calculate average rating
    const averageRating = ratings.length > 0 
      ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length
      : 0;
    
    res.render('ai/details', { 
      ai, 
      isFavorite,
      comments,
      averageRating: averageRating.toFixed(1),
      ratingsCount: ratings.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};

exports.getFeaturedAIs = async () => {
  try {
    return await AI.findAll({
      where: { isFeatured: true },
      limit: 3
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};