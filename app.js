/* =========================================================
   APP.JS
   Global behavior shared by every page: navbar interactions,
   scroll-to-top, page loader, newsletter forms, and (when the
   relevant containers are present) the home page's dynamic
   sections. Depends on utils.js and cart.js being loaded first.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  hidePageLoader();
  initNavbarScrollEffect();
  initMobileNav();
  initAccountDropdown();
  initScrollToTopButton();
  initSmoothAnchorScroll();
  initNewsletterForms();
  initWishlistDelegation();
  initAddToCartDelegation();

  // Home-page-only sections — these no-op safely on other pages
  // because they each check for their container before doing work.
  renderHomeCategories();
  renderHomeProductRail('#featuredProductsGrid', 'featured');
  renderHomeProductRail('#bestSellerProductsGrid', 'bestseller');
  renderFlashSale();
  renderTestimonials();
});

/* ---------------------------------------------------------
   PAGE LOADER
   --------------------------------------------------------- */
function hidePageLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) return;
  // Small delay so the spinner is perceptible even on fast loads,
  // and so dynamically-injected content above has a moment to paint.
  setTimeout(() => loader.classList.add('hidden'), 350);
}

/* ---------------------------------------------------------
   NAVBAR — sticky shadow on scroll
   --------------------------------------------------------- */
function initNavbarScrollEffect() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 8);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------------------------------------------------------
   NAVBAR — mobile hamburger panel
   --------------------------------------------------------- */
function initMobileNav() {
  const toggle = document.querySelector('.navbar-toggle');
  const panel = document.querySelector('.mobile-nav');
  if (!toggle || !panel) return;

  const closeMenu = () => {
    toggle.classList.remove('open');
    panel.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  const openMenu = () => {
    toggle.classList.add('open');
    panel.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  toggle.addEventListener('click', () => {
    const isOpen = panel.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  panel.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

  // Close on escape for keyboard users
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}

/* ---------------------------------------------------------
   NAVBAR — account dropdown
   --------------------------------------------------------- */
function initAccountDropdown() {
  const wrapper = document.querySelector('.navbar-account');
  const dropdown = document.querySelector('.account-dropdown');
  if (!wrapper || !dropdown) return;

  const trigger = wrapper.querySelector('.icon-btn');

  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdown.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!wrapper.contains(e.target)) dropdown.classList.remove('show');
  });
}

/* ---------------------------------------------------------
   SCROLL-TO-TOP BUTTON
   --------------------------------------------------------- */
function initScrollToTopButton() {
  let btn = document.querySelector('.scroll-top-btn');
  if (!btn) {
    btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.setAttribute('aria-label', 'Scroll back to top');
    btn.innerHTML = '&#8593;';
    document.body.appendChild(btn);
  }

  window.addEventListener(
    'scroll',
    () => {
      btn.classList.toggle('visible', window.scrollY > 480);
    },
    { passive: true }
  );

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------------------------------------------------------
   SMOOTH SCROLL for in-page anchor links (e.g. "#categories")
   --------------------------------------------------------- */
function initSmoothAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ---------------------------------------------------------
   NEWSLETTER FORMS (home section + footer) — dummy submit
   --------------------------------------------------------- */
function initNewsletterForms() {
  document.querySelectorAll('.newsletter-form, .footer-newsletter-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && !/^\S+@\S+\.\S+$/.test(input.value)) {
        Utils.showToast('Please enter a valid email address.', 'error');
        return;
      }
      Utils.showToast('Subscribed! Watch your inbox for deals.', 'success');
      form.reset();
    });
  });
}

/* ---------------------------------------------------------
   WISHLIST — event delegation so it works on dynamically
   rendered product cards too
   --------------------------------------------------------- */
function initWishlistDelegation() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.product-card-wishlist');
    if (!btn) return;
    btn.classList.toggle('active');
    const name = btn.closest('.product-card')?.querySelector('.product-card-name')?.textContent?.trim() || 'Item';
    Utils.showToast(
      btn.classList.contains('active') ? `Added "${name}" to wishlist` : `Removed "${name}" from wishlist`,
      'success'
    );
  });
}

/* ---------------------------------------------------------
   ADD TO CART — event delegation
   --------------------------------------------------------- */
function initAddToCartDelegation() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (!btn) return;
    const productId = btn.dataset.productId;
    if (!productId) return;

    const originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span>';

    Utils.getProductById(productId)
      .then((product) => Cart.addToCart(product, 1))
      .then(() => {
        Utils.showToast('Added to cart', 'success');
      })
      .catch(() => {
        Utils.showToast('Could not add item to cart', 'error');
      })
      .finally(() => {
        btn.disabled = false;
        btn.innerHTML = originalContent;
      });
  });
}

/* ---------------------------------------------------------
   HOME — category strip
   --------------------------------------------------------- */
function renderHomeCategories() {
  const container = document.querySelector('#categoryStrip');
  if (!container) return;

  Utils.getCategories().then((categories) => {
    container.innerHTML = categories
      .map(
        (cat) => `
        <a href="products.html?category=${encodeURIComponent(cat.name)}" class="category-pill">
          <span class="cat-icon">${cat.icon}</span>
          <span>${cat.name}</span>
        </a>`
      )
      .join('');
  });
}

/* ---------------------------------------------------------
   HOME — reusable product rail renderer (Featured / Best Sellers)
   --------------------------------------------------------- */
function renderHomeProductRail(selector, tag) {
  const container = document.querySelector(selector);
  if (!container) return;

  container.innerHTML = renderSkeletonCards(4);

  Utils.getProducts(tag).then((products) => {
    container.innerHTML = products.slice(0, 4).map((p) => buildProductCardHTML(p)).join('');
  });
}

/**
 * Shared markup for a single product card — used on Home, and later
 * reused as-is by products.js on the Products listing page.
 */
function buildProductCardHTML(product) {
  const discount = Utils.calcDiscountPercent(product.originalPrice, product.price);
  const stock = Utils.stockStatus(product.stock);
  const stockBadge =
    stock === 'out'
      ? '<span class="badge badge-danger">Out of stock</span>'
      : stock === 'low'
      ? `<span class="badge badge-warning">Only ${product.stock} left</span>`
      : '<span class="badge badge-success">In stock</span>';

  return `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-card-media">
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" loading="lazy" width="400" height="400">
        </a>
        <div class="product-card-badges">
          ${discount > 0 ? `<span class="badge badge-brand">${discount}% OFF</span>` : ''}
        </div>
        <button class="product-card-wishlist" aria-label="Add ${product.name} to wishlist">&#9825;</button>
        <a href="product.html?id=${product.id}" class="product-card-quickview">Quick View</a>
      </div>
      <div class="product-card-body">
        <span class="product-card-category">${product.category}</span>
        <h3 class="product-card-name"><a href="product.html?id=${product.id}">${product.name}</a></h3>
        <div class="stars" aria-label="Rated ${product.rating} out of 5">
          ${Utils.renderStars(product.rating)} <span class="rating-count">(${product.reviews})</span>
        </div>
        <div class="product-card-price-row">
          <span class="price-current">${Utils.formatCurrency(product.price)}</span>
          ${product.originalPrice ? `<span class="price-original">${Utils.formatCurrency(product.originalPrice)}</span>` : ''}
        </div>
        <div class="stock-badge-row">${stockBadge}</div>
        <div class="product-card-footer">
          <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}" ${stock === 'out' ? 'disabled' : ''}>Add to Cart</button>
          <a href="product.html?id=${product.id}" class="btn btn-secondary">View</a>
        </div>
      </div>
    </article>`;
}

/**
 * A lightweight pulse skeleton shown while dummy "network" data loads,
 * so the layout doesn't jump once real cards render in.
 */
function renderSkeletonCards(count) {
  return Array.from({ length: count })
    .map(
      () => `
      <div class="card" style="height:340px;overflow:hidden;">
        <div style="height:60%;background:#EEF2F7;"></div>
        <div style="padding:16px;">
          <div style="height:12px;width:40%;background:#EEF2F7;border-radius:4px;margin-bottom:10px;"></div>
          <div style="height:16px;width:80%;background:#EEF2F7;border-radius:4px;margin-bottom:10px;"></div>
          <div style="height:16px;width:50%;background:#EEF2F7;border-radius:4px;"></div>
        </div>
      </div>`
    )
    .join('');
}

/* ---------------------------------------------------------
   HOME — Flash Sale section with live countdown timer
   --------------------------------------------------------- */
function renderFlashSale() {
  const container = document.querySelector('#flashSaleGrid');
  if (!container) return;

  container.innerHTML = renderSkeletonCards(4);

  Utils.getProducts('flash').then((products) => {
    container.innerHTML = products
      .slice(0, 4)
      .map((p) => {
        const discount = Utils.calcDiscountPercent(p.originalPrice, p.price);
        const soldPercent = Math.max(15, 100 - p.stock * 4); // dummy "almost sold out" visual
        return `
        <div style="position:relative;">
          ${discount > 0 ? `<span class="discount-ribbon">${discount}% OFF</span>` : ''}
          ${buildProductCardHTML(p)}
          <div class="stock-progress">
            <div class="stock-progress-bar"><div class="stock-progress-bar-fill" style="width:${soldPercent}%;"></div></div>
            <div class="stock-progress-label">${p.stock} items left — going fast</div>
          </div>
        </div>`;
      })
      .join('');
  });

  initFlashSaleCountdown();
}

/**
 * Countdown timer ticking down to a fixed point (here: 6 hours from
 * page load) purely for front-end demonstration purposes.
 */
function initFlashSaleCountdown() {
  const timerEl = document.querySelector('#flashSaleTimer');
  if (!timerEl) return;

  const endTime = Date.now() + 1000 * 60 * 60 * 6; // 6 hours from now

  const hoursEl = timerEl.querySelector('[data-unit="hours"]');
  const minsEl = timerEl.querySelector('[data-unit="minutes"]');
  const secsEl = timerEl.querySelector('[data-unit="seconds"]');

  function tick() {
    const remaining = Math.max(0, endTime - Date.now());
    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);

    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(s).padStart(2, '0');

    if (remaining > 0) requestAnimationFrame(() => setTimeout(tick, 1000));
  }
  tick();
}

/* ---------------------------------------------------------
   HOME — testimonials
   --------------------------------------------------------- */
function renderTestimonials() {
  const container = document.querySelector('#testimonialGrid');
  if (!container) return;

  Utils.getTestimonials().then((testimonials) => {
    container.innerHTML = testimonials
      .map(
        (t) => `
        <div class="testimonial-card">
          <div class="testimonial-quote-mark">&#8220;</div>
          <p class="testimonial-text">${t.text}</p>
          <div class="testimonial-author">
            <div class="testimonial-avatar">${t.name.charAt(0)}</div>
            <div>
              <div class="testimonial-author-name">${t.name}</div>
              <div class="testimonial-author-role">${t.role}</div>
            </div>
          </div>
        </div>`
      )
      .join('');
  });
}
