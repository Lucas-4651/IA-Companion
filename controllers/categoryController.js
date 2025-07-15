// controllers/categoryController.js
const { Prompt } = require('../models');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Prompt.findAll({
      attributes: [
        [sequelize.fn('DISTINCT', sequelize.col('category')), 'category']
      ],
      order: [['category', 'ASC']]
    });
    
    const categoryList = categories.map(c => c.category);
    res.json(categoryList);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};