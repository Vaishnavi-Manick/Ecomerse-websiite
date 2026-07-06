const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const testAPI = async () => {
  try {
    console.log('Testing GET /api/products...');
    const products = await axios.get(`${API_URL}/products`);
    console.log(`Success: Found ${products.data.length} products`);

    console.log('Testing GET /api/categories...');
    const categories = await axios.get(`${API_URL}/categories`);
    console.log(`Success: Found ${categories.data.length} categories`);

    console.log('Testing GET /api/testimonials...');
    const testimonials = await axios.get(`${API_URL}/testimonials`);
    console.log(`Success: Found ${testimonials.data.length} testimonials`);

    console.log('Testing POST /api/users/login...');
    const login = await axios.post(`${API_URL}/users/login`, {
      email: 'admin@example.com',
      password: 'password123'
    });
    console.log(`Success: Logged in as ${login.data.name}`);
    const token = login.data.token;

    console.log('Testing GET /api/users/profile...');
    const profile = await axios.get(`${API_URL}/users/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(`Success: Retrieved profile for ${profile.data.email}`);

    console.log('All basic tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('Test failed:');
    console.error(error.response ? error.response.data : error.message);
    process.exit(1);
  }
};

testAPI();
