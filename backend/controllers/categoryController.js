const Category = require('../models/categoryModel');

// @desc    Fetch all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = async (req, res) => {
  const { name, icon } = req.body;

  const category = new Category({
    name,
    icon,
  });

  const createdCategory = await category.save();
  res.status(201).json(createdCategory);
};

module.exports = {
  getCategories,
  createCategory,
};
