const { Favorite, AI } = require('../models');

exports.toggleFavorite = async (req, res) => {
  try {
    const { aiId } = req.body; // Prendre aiId du body, pas des params
    const userId = req.session.user.id;
    
    const existing = await Favorite.findOne({ 
      where: { userId, aiId } 
    });
    
    if (existing) {
      await existing.destroy();
      return res.json({ isFavorite: false });
    }
    
    await Favorite.create({ userId, aiId });
    res.json({ isFavorite: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getUserFavorites = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const favorites = await Favorite.findAll({
      where: { userId },
      include: [{
        model: AI,
        attributes: ['id', 'name', 'description', 'specialty']
      }]
    });
    
    res.render('user/favorites', { favorites });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
};