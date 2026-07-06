const Product = require('../models/productModel');

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  const tag = req.query.tag;
  const category = req.query.category;
  
  let query = {};
  if (tag) {
    query.tags = tag;
  }
  if (category) {
    query.category = category;
  }

  const products = await Product.find(query);
  res.json(products);
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    category,
    stock,
    tags,
    originalPrice,
  } = req.body;

  const product = new Product({
    name,
    price,
    user: req.user._id,
    image,
    category,
    stock,
    numReviews: 0,
    description,
    tags,
    originalPrice,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
};
