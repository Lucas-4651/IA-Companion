const { Tip } = require('../models');

exports.createTip = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    await Tip.create({ title, content, category });
    res.redirect('/admin/tips');
  } catch (error) {
    console.error(error);
    res.redirect('/admin/tips?error=create');
  }
};

exports.getAllTips = async (req, res) => {
  try {
    const tips = await Tip.findAll();
    res.render('tips/index', { tips }); // Rendre une vue au lieu de JSON
  } catch (error) {
    res.status(500).render('error', { error: 'Erreur serveur' });
  }
};
exports.getLatestTips = async () => {
  try {
    return await Tip.findAll({
      order: [['createdAt', 'DESC']],
      limit: 3
    });
  } catch (error) {
    console.error(error);
    return [];
  }
};