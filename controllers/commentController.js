const { Comment, Rating, User } = require('../models');

exports.addComment = async (req, res) => {
  try {
    const { aiId, content } = req.body;
    const userId = req.session.user.id;
    
    const comment = await Comment.create({ 
      content, 
      userId, 
      aiId 
    });
    
    // Populate user data for response
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        attributes: ['id', 'username']
      }]
    });
    
    res.status(201).json(commentWithUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.addRating = async (req, res) => {
  try {
    const { aiId, value } = req.body;
    const userId = req.session.user.id;
    
    const [rating, created] = await Rating.findOrCreate({
      where: { userId, aiId },
      defaults: { value }
    });
    
    if (!created) {
      rating.value = value;
      await rating.save();
    }
    
    // Calculate new average rating
    const ratings = await Rating.findAll({ where: { aiId } });
    const averageRating = ratings.reduce((acc, curr) => acc + curr.value, 0) / ratings.length;
    
    res.json({ 
      rating, 
      averageRating: averageRating.toFixed(1),
      ratingsCount: ratings.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
// Ajouter cette méthode
exports.getCommentsForAI = async (req, res) => {
  try {
    const { aiId } = req.params;
    
    const comments = await Comment.findAll({
      where: { aiId },
      include: [{
        model: User,
        attributes: ['id', 'username']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};