const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/userModel');
const Product = require('./models/productModel');
const Category = require('./models/categoryModel');
const Order = require('./models/orderModel');
const Testimonial = require('./models/testimonialModel');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const DUMMY_PRODUCTS = [
  { name: 'AeroFit Running Shoes', category: 'Footwear', price: 3499, originalPrice: 4999, rating: 4.5, numReviews: 218, stock: 24, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', description: 'High-performance running shoes for athletes.', tags: ['featured', 'bestseller'] },
  { name: 'Wireless Noise-Cancelling Headphones', category: 'Electronics', price: 5999, originalPrice: 8999, rating: 4.7, numReviews: 512, stock: 12, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', description: 'Immersive sound experience with active noise cancellation.', tags: ['featured', 'flash'] },
  { name: 'Minimalist Analog Watch', category: 'Accessories', price: 2199, originalPrice: 2999, rating: 4.3, numReviews: 96, stock: 40, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80', description: 'Elegant and simple design for every occasion.', tags: ['featured'] },
  { name: 'Everyday Canvas Backpack', category: 'Bags', price: 1799, originalPrice: 2499, rating: 4.6, numReviews: 340, stock: 55, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', description: 'Durable and spacious backpack for daily use.', tags: ['bestseller'] },
  { name: 'Smart Fitness Band', category: 'Electronics', price: 1999, originalPrice: 2799, rating: 4.2, numReviews: 187, stock: 8, image: 'https://images.unsplash.com/photo-1575311373937-64ec8f7f0d09?w=600&q=80', description: 'Track your health and fitness goals.', tags: ['flash'] },
  { name: 'Classic Denim Jacket', category: 'Fashion', price: 2599, originalPrice: 3499, rating: 4.4, numReviews: 145, stock: 30, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80', description: 'Timeless style with premium denim fabric.', tags: ['featured'] },
  { name: 'Ceramic Pour-Over Coffee Set', category: 'Home', price: 1299, originalPrice: 1699, rating: 4.8, numReviews: 76, stock: 18, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80', description: 'Brew the perfect cup of coffee at home.', tags: ['bestseller'] },
  { name: 'Portable Bluetooth Speaker', category: 'Electronics', price: 2499, originalPrice: 3999, rating: 4.5, numReviews: 289, stock: 5, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80', description: 'Powerful sound in a compact design.', tags: ['flash', 'bestseller'] },
];

const DUMMY_CATEGORIES = [
  { name: 'Electronics', icon: '📱' },
  { name: 'Fashion', icon: '👕' },
  { name: 'Footwear', icon: '👟' },
  { name: 'Home', icon: '🏠' },
  { name: 'Fitness', icon: '🏋️‍♂️' },
  { name: 'Accessories', icon: '🕶️' },
];

const DUMMY_TESTIMONIALS = [
  { name: 'Ananya Rao', role: 'Verified Buyer', text: 'The checkout process was so smooth and the product quality exceeded what I expected from the photos.' },
  { name: 'Karthik Iyer', role: 'Verified Buyer', text: 'Fast delivery and the packaging was excellent. Customer support helped me track my order without any hassle.' },
  { name: 'Meera Nair', role: 'Verified Buyer', text: 'Loved the variety of categories and the prices during the flash sale were unbeatable.' },
];

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Testimonial.deleteMany();

    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      isAdmin: true,
    });

    await Category.insertMany(DUMMY_CATEGORIES);
    await Testimonial.insertMany(DUMMY_TESTIMONIALS);

    const sampleProducts = DUMMY_PRODUCTS.map((product) => {
      return { ...product, user: adminUser._id };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await Category.deleteMany();
    await Testimonial.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
