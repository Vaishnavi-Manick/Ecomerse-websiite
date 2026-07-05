/* =========================================================
   CART.JS
   In-memory cart state (no localStorage per project spec).

   INTEGRATION NOTE:
   Each function mirrors a future REST endpoint. Right now they
   mutate the local `cartState` array; later, swap the body for
   an authenticated fetch() to the corresponding endpoint and
   keep the same function signatures so no calling code changes.
     addToCart      -> POST   /api/cart
     removeFromCart -> DELETE /api/cart/:productId
     updateQuantity -> PATCH  /api/cart/:productId
     getCart        -> GET    /api/cart
   ========================================================= */

/**
 * cartState item shape: { productId, name, price, image, quantity }
 * Seeded with a couple of dummy items so Cart/Checkout pages have
 * something to render out of the box during development.
 */
let cartState = [
  { productId: 'p02', name: 'Wireless Noise-Cancelling Headphones', price: 5999, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80', quantity: 1 },
  { productId: 'p04', name: 'Everyday Canvas Backpack', price: 1799, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80', quantity: 2 },
];

function addToCart(product, quantity = 1) {
  const existing = cartState.find((item) => item.productId === product.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    cartState.push({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
    });
  }
  renderCartCount();
  return Promise.resolve(cartState);
}

function removeFromCart(productId) {
  cartState = cartState.filter((item) => item.productId !== productId);
  renderCartCount();
  return Promise.resolve(cartState);
}

function updateQuantity(productId, quantity) {
  const item = cartState.find((i) => i.productId === productId);
  if (item) item.quantity = Math.max(1, quantity);
  renderCartCount();
  return Promise.resolve(cartState);
}

function getCart() {
  return Promise.resolve(cartState);
}

function getCartCount() {
  return cartState.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartTotal() {
  return cartState.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

/**
 * Sync the little count bubble on the navbar cart icon across all pages.
 */
function renderCartCount() {
  const count = getCartCount();
  document.querySelectorAll('.cart-count-bubble').forEach((el) => {
    el.textContent = count;
    el.style.display = count > 0 ? 'flex' : 'none';
  });
}

// Keep the navbar badge accurate as soon as the DOM is ready on every page.
document.addEventListener('DOMContentLoaded', renderCartCount);

window.Cart = {
  addToCart,
  removeFromCart,
  updateQuantity,
  getCart,
  getCartCount,
  getCartTotal,
  renderCartCount,
};
