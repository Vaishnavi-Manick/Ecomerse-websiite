const Testimonial = require('../models/testimonialModel');

// @desc    Fetch all testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res) => {
  const testimonials = await Testimonial.find({});
  res.json(testimonials);
};

// @desc    Create a testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
const createTestimonial = async (req, res) => {
  const { name, role, text } = req.body;

  const testimonial = new Testimonial({
    name,
    role,
    text,
  });

  const createdTestimonial = await testimonial.save();
  res.status(201).json(createdTestimonial);
};

module.exports = {
  getTestimonials,
  createTestimonial,
};
