/* =========================================================
   UTILS.JS
   Shared helper functions + dummy data source.

   INTEGRATION NOTE FOR BACKEND HAND-OFF:
   Every function under "DATA ACCESS LAYER" below returns a
   Promise, even though it currently just resolves with local
   dummy data. When the Node.js + Express + MongoDB API is
   ready, swap the function body for a `fetch('/api/...')`
   call and nothing that calls these functions has to change.
   ========================================================= */

/* ---------------------------------------------------------
   DUMMY DATA
   --------------------------------------------------------- */

const DUMMY_PRODUCTS = [
  { id: 'p01', name: 'AeroFit Running Shoes', category: 'Footwear', price: 3499, originalPrice: 4999, rating: 4.5, reviews: 218, stock: 24, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80', badge: 'bestseller', tags: ['featured', 'bestseller'] },
  { id: 'p02', name: 'Wireless Noise-Cancelling Headphones', category: 'Electronics', price: 5999, originalPrice: 8999, rating: 4.7, reviews: 512, stock: 12, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', badge: 'flash', tags: ['featured', 'flash'] },
  { id: 'p03', name: 'Minimalist Analog Watch', category: 'Accessories', price: 2199, originalPrice: 2999, rating: 4.3, reviews: 96, stock: 40, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&q=80', badge: '', tags: ['featured'] },
  { id: 'p04', name: 'Everyday Canvas Backpack', category: 'Bags', price: 1799, originalPrice: 2499, rating: 4.6, reviews: 340, stock: 55, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', badge: 'bestseller', tags: ['bestseller'] },
  { id: 'p05', name: 'Smart Fitness Band', category: 'Electronics', price: 1999, originalPrice: 2799, rating: 4.2, reviews: 187, stock: 8, image: 'https://images.unsplash.com/photo-1575311373937-64ec8f7f0d09?w=600&q=80', badge: 'flash', tags: ['flash'] },
  { id: 'p06', name: 'Classic Denim Jacket', category: 'Fashion', price: 2599, originalPrice: 3499, rating: 4.4, reviews: 145, stock: 30, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80', badge: '', tags: ['featured'] },
  { id: 'p07', name: 'Ceramic Pour-Over Coffee Set', category: 'Home', price: 1299, originalPrice: 1699, rating: 4.8, reviews: 76, stock: 18, image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80', badge: '', tags: ['bestseller'] },
  { id: 'p08', name: 'Portable Bluetooth Speaker', category: 'Electronics', price: 2499, originalPrice: 3999, rating: 4.5, reviews: 289, stock: 5, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80', badge: 'flash', tags: ['flash', 'bestseller'] },
  { id: 'p09', name: 'Leather Bifold Wallet', category: 'Accessories', price: 899, originalPrice: 1299, rating: 4.1, reviews: 63, stock: 60, image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&q=80', badge: '', tags: [] },
  { id: 'p10', name: 'Sunset Polarized Sunglasses', category: 'Accessories', price: 1599, originalPrice: 2199, rating: 4.4, reviews: 132, stock: 44, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80', badge: '', tags: ['featured'] },
  { id: 'p11', name: 'Performance Yoga Mat', category: 'Fitness', price: 1099, originalPrice: 1499, rating: 4.6, reviews: 210, stock: 33, image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600&q=80', badge: '', tags: ['bestseller'] },
  { id: 'p12', name: 'Insulated Steel Water Bottle', category: 'Home', price: 699, originalPrice: 999, rating: 4.7, reviews: 401, stock: 70, image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80', badge: '', tags: ['bestseller', 'featured'] },
];

const DUMMY_CATEGORIES = [
  { id: 'c1', name: 'Electronics', icon: '\u{1F4F1}' },
  { id: 'c2', name: 'Fashion', icon: '\u{1F455}' },
  { id: 'c3', name: 'Footwear', icon: '\u{1F45F}' },
  { id: 'c4', name: 'Home', icon: '\u{1F3E1}' },
  { id: 'c5', name: 'Fitness', icon: '\u{1F3CB}' },
  { id: 'c6', name: 'Accessories', icon: '\u{1F576}' },
];

const DUMMY_TESTIMONIALS = [
  { id: 't1', name: 'Ananya Rao', role: 'Verified Buyer', text: 'The checkout process was so smooth and the product quality exceeded what I expected from the photos. Definitely shopping here again.' },
  { id: 't2', name: 'Karthik Iyer', role: 'Verified Buyer', text: 'Fast delivery and the packaging was excellent. Customer support helped me track my order without any hassle at all.' },
  { id: 't3', name: 'Meera Nair', role: 'Verified Buyer', text: 'Loved the variety of categories and the prices during the flash sale were unbeatable. My go-to store now.' },
];

/* ---------------------------------------------------------
   FORMATTING HELPERS
   --------------------------------------------------------- */

/**
 * Format a number as Indian Rupee currency, e.g. 3499 -> "\u20b93,499"
 */
function formatCurrency(amount) {
  return '\u20B9' + Number(amount).toLocaleString('en-IN');
}

/**
 * Build a star-rating string of filled/empty stars for a given rating (0-5).
 * Returns an HTML string; caller is responsible for inserting it safely.
 */
function renderStars(rating) {
  const full = Math.round(rating);
  let html = '';
  for (let i = 0; i < 5; i++) {
    html += i < full ? '\u2605' : '<span class="star-empty">\u2605</span>';
  }
  return html;
}

/**
 * Compute the discount percentage between an original and current price.
 */
function calcDiscountPercent(originalPrice, price) {
  if (!originalPrice || originalPrice <= price) return 0;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Debounce helper — used by search inputs to avoid firing on every keystroke.
 */
function debounce(fn, delay = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Simple stock-level helper for badges: 'out' | 'low' | 'in'
 */
function stockStatus(stock) {
  if (stock <= 0) return 'out';
  if (stock <= 10) return 'low';
  return 'in';
}

/* ---------------------------------------------------------
   DATA ACCESS LAYER (dummy now, swap for fetch() later)
   --------------------------------------------------------- */

/**
 * Fetch all products, optionally filtered by a tag (e.g. 'featured', 'bestseller', 'flash').
 * Backend equivalent: GET /api/products?tag=featured
 */
function getProducts(tag) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = tag ? DUMMY_PRODUCTS.filter((p) => p.tags.includes(tag)) : DUMMY_PRODUCTS;
      resolve(data);
    }, 250); // simulated network latency
  });
}

/**
 * Fetch a single product by id.
 * Backend equivalent: GET /api/products/:id
 */
function getProductById(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const product = DUMMY_PRODUCTS.find((p) => p.id === id);
      product ? resolve(product) : reject(new Error('Product not found'));
    }, 200);
  });
}

/**
 * Fetch all categories.
 * Backend equivalent: GET /api/categories
 */
function getCategories() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(DUMMY_CATEGORIES), 150);
  });
}

/**
 * Fetch testimonials.
 * Backend equivalent: GET /api/testimonials
 */
function getTestimonials() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(DUMMY_TESTIMONIALS), 150);
  });
}

/* ---------------------------------------------------------
   TOAST NOTIFICATIONS
   --------------------------------------------------------- */

/**
 * Show a toast notification. type: 'success' | 'error' | 'info'
 */
function showToast(message, type = 'success', duration = 2600) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '\u2713', error: '\u2715', info: 'i' };

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type] || icons.info}</span>
    <span class="toast-message"></span>
  `;
  toast.querySelector('.toast-message').textContent = message;

  container.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

/* ---------------------------------------------------------
   EXPORTS (attached to window so any page can use them
   without a bundler / module system)
   --------------------------------------------------------- */
window.Utils = {
  formatCurrency,
  renderStars,
  calcDiscountPercent,
  debounce,
  stockStatus,
  getProducts,
  getProductById,
  getCategories,
  getTestimonials,
  showToast,
};
