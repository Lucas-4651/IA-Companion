// controllers/commentController.js
const { Comment, Rating, User } = require('../models');

exports.addCommentWithRating = async (req, res) => {
  try {
    const { aiId, content, rating } = req.body;
    const userId = req.session.user.id;

    if (!content || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Champs invalides' });
    }

    // 1) Crée le commentaire
    const comment = await Comment.create({ content, userId, aiId });

    // 2) Crée ou met à jour la note
    const [ratingObj, created] = await Rating.findOrCreate({
      where: { userId, aiId },
      defaults: { value: rating }
    });
    if (!created) {
      ratingObj.value = rating;
      await ratingObj.save();
    }

    // 3) Recalcule la moyenne
    const allRatings = await Rating.findAll({ where: { aiId } });
    const averageRating = allRatings.reduce((a, r) => a + r.value, 0) / allRatings.length;

    // 4) Renvoie le commentaire enrichi
    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{ model: User, attributes: ['id', 'username'] }]
    });

    res.status(201).json({
      comment: commentWithUser,
      averageRating: parseFloat(averageRating.toFixed(1)),
      ratingsCount: allRatings.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

// --- le reste inchangé ---
exports.getCommentsForAI = async (req, res) => {
  try {
    const { aiId } = req.params;
    const comments = await Comment.findAll({
      where: { aiId },
      include: [{ model: User, attributes: ['id', 'username'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
