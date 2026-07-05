/* =========================================================
   SEARCH.JS
   Navbar search: live suggestions dropdown + submit handling.
   On the Products page, products.js takes over filtering the
   grid itself; here we only handle the navbar's own input.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.navbar-search, .mobile-nav .navbar-search').forEach(initSearchBar);
});

function initSearchBar(searchBar) {
  const input = searchBar.querySelector('input');
  const form = searchBar.querySelector('form') || searchBar;
  const button = searchBar.querySelector('button');
  if (!input) return;

  let suggestionsEl = searchBar.querySelector('.search-suggestions');
  if (!suggestionsEl) {
    suggestionsEl = document.createElement('div');
    suggestionsEl.className = 'search-suggestions';
    searchBar.appendChild(suggestionsEl);
  }

  const handleInput = Utils.debounce(() => {
    const query = input.value.trim().toLowerCase();
    if (query.length < 2) {
      suggestionsEl.classList.remove('show');
      suggestionsEl.innerHTML = '';
      return;
    }

    Utils.getProducts().then((products) => {
      const matches = products.filter((p) => p.name.toLowerCase().includes(query)).slice(0, 5);

      if (matches.length === 0) {
        suggestionsEl.innerHTML = `<div class="suggestion-item text-muted">No products found for "${escapeHtml(input.value)}"</div>`;
      } else {
        suggestionsEl.innerHTML = matches
          .map(
            (p) => `
            <a href="product.html?id=${p.id}" class="suggestion-item">
              <span>${p.name}</span>
              <span class="muted">${Utils.formatCurrency(p.price)}</span>
            </a>`
          )
          .join('');
      }
      suggestionsEl.classList.add('show');
    });
  }, 250);

  input.addEventListener('input', handleInput);

  input.addEventListener('focus', () => {
    if (input.value.trim().length >= 2) suggestionsEl.classList.add('show');
  });

  document.addEventListener('click', (e) => {
    if (!searchBar.contains(e.target)) suggestionsEl.classList.remove('show');
  });

  const submitSearch = (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;
    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
  };

  if (form.tagName === 'FORM') form.addEventListener('submit', submitSearch);
  if (button) button.addEventListener('click', submitSearch);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
