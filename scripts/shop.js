/* ========================================
   SHOP PAGE — shop.js
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── State ──────────────────────────────────────────────────────────────────
  let allProducts  = [];
  let filtered     = [];
  let CartItems    = [];
  let SavedItems   = [];

  let activeFilters = {
    category: 'all',
    price:    'all',
    size:     'all',
    color:    'all',
  };

  let sortMode    = 'default';
  let viewMode    = 'grid3';
  let currentPage = 1;
  const perPage   = 9;

  // ── DOM refs ────────────────────────────────────────────────────────────────
  const grid          = document.getElementById('productGrid');
  const resultsCount  = document.getElementById('resultsCount');
  const emptyState    = document.getElementById('emptyState');
  const paginationBar = document.getElementById('paginationBar');
  const sortSelect    = document.getElementById('sortSelect');
  const filterToggle  = document.getElementById('filterToggle');
  const sidebarInner  = document.getElementById('sidebarInner');
  const resetBtns     = document.querySelectorAll('#resetFilters, #resetFiltersInline');

  // Cart/saved refs
  const body         = document.body;
  const iconCart     = document.querySelector('.icon-cart');
  const closeCart    = document.querySelector('.cartTab .close');
  const openSaved    = document.querySelector('.open-saved');
  const closeSaved   = document.querySelector('.closeSaved');
  const moveAll      = document.querySelector('.moveAllToCart');
  const ListCartHTML = document.querySelector('.ListCart');
  const ListSavedHTML= document.querySelector('.ListSaved');

  // ── Cart/Saved panel toggles ────────────────────────────────────────────────
  iconCart?.addEventListener('click', () => {
    body.classList.toggle('showCart');
    body.classList.remove('showSaved');
  });
  closeCart?.addEventListener('click', () => body.classList.remove('showCart'));
  openSaved?.addEventListener('click', e => {
    e.preventDefault();
    body.classList.toggle('showSaved');
    body.classList.remove('showCart');
  });
  closeSaved?.addEventListener('click', () => body.classList.remove('showSaved'));

  moveAll?.addEventListener('click', () => {
    SavedItems.forEach(item => {
      const ex = CartItems.find(c => c.id == item.id);
      if (ex) ex.quantity++;
      else CartItems.push({ ...item, quantity: 1 });
    });
    SavedItems = [];
    renderCart(); renderSaved(); applyAndRender();
    body.classList.add('showCart');
    body.classList.remove('showSaved');
  });

  ListCartHTML?.addEventListener('click', e => {
    if (e.target.classList.contains('plus')) {
      const item = CartItems.find(i => i.id == e.target.dataset.id);
      if (item) { item.quantity++; renderCart(); }
    }
    if (e.target.classList.contains('minus')) {
      const idx = CartItems.findIndex(i => i.id == e.target.dataset.id);
      if (idx > -1) {
        CartItems[idx].quantity--;
        if (CartItems[idx].quantity <= 0) CartItems.splice(idx, 1);
        renderCart();
      }
    }
  });

  ListSavedHTML?.addEventListener('click', e => {
    if (e.target.classList.contains('addSavedToCart')) addToCart(e.target.dataset.id);
    if (e.target.classList.contains('removeSaved')) {
      SavedItems = SavedItems.filter(i => i.id != e.target.dataset.id);
      renderSaved(); applyAndRender();
    }
  });

  // ── Cart render ─────────────────────────────────────────────────────────────
  const renderCart = () => {
    if (!ListCartHTML) return;
    ListCartHTML.innerHTML = '';
    if (CartItems.length === 0) {
      ListCartHTML.innerHTML = '<p style="padding:20px;color:#aaa;">Your cart is empty.</p>';
    } else {
      CartItems.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = `
          <div class="image"><img src="${item.image || item.images?.[0]}" alt="${item.name}"></div>
          <div class="name">${item.name}</div>
          <div class="totalPrice">$${(item.price * item.quantity).toFixed(2)}</div>
          <div class="quantity">
            <span class="minus" data-id="${item.id}">-</span>
            <span class="value">${item.quantity}</span>
            <span class="plus" data-id="${item.id}">+</span>
          </div>`;
        ListCartHTML.appendChild(div);
      });
    }
    updateBadges();
  };

  // ── Saved render ────────────────────────────────────────────────────────────
  const renderSaved = () => {
    if (!ListSavedHTML) return;
    ListSavedHTML.innerHTML = '';
    if (SavedItems.length === 0) {
      ListSavedHTML.innerHTML = '<p style="padding:20px;color:#aaa;">No saved items yet.</p>';
    } else {
      SavedItems.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = `
          <div class="image"><img src="${item.image || item.images?.[0]}" alt="${item.name}"></div>
          <div class="name">${item.name}<br><small>$${item.price}</small></div>
          <div style="display:flex;flex-direction:column;gap:6px;align-items:center;">
            <button class="btn btn-sm btn-warning addSavedToCart" data-id="${item.id}" style="font-size:11px;padding:4px 6px;">Add</button>
            <i class="fa-solid fa-trash removeSaved" data-id="${item.id}" style="cursor:pointer;color:#e55;"></i>
          </div>`;
        ListSavedHTML.appendChild(div);
      });
    }
    updateBadges();
  };

  const updateBadges = () => {
    const cartTotal = CartItems.reduce((s, i) => s + i.quantity, 0);
    const cartBadge = document.querySelector('.icon-cart + .badge-count');
    if (cartBadge) cartBadge.textContent = cartTotal;

    const savedBadge = document.querySelector('.open-saved .badge-count');
    if (savedBadge) savedBadge.textContent = SavedItems.length;
  };

  const addToCart = (id) => {
    const product = allProducts.find(p => p.id == id);
    if (!product) return;
    const ex = CartItems.find(i => i.id == id);
    if (ex) ex.quantity++;
    else CartItems.push({ ...product, quantity: 1 });
    renderCart();
    body.classList.add('showCart');
    body.classList.remove('showSaved');
  };

  const toggleSave = (id) => {
    const product = allProducts.find(p => p.id == id);
    if (!product) return;
    const idx = SavedItems.findIndex(i => i.id == id);
    if (idx > -1) SavedItems.splice(idx, 1);
    else { SavedItems.push({ ...product }); body.classList.add('showSaved'); body.classList.remove('showCart'); }
    renderSaved();
    applyAndRender(); // refresh hearts
  };

  // ── Mobile sidebar toggle ───────────────────────────────────────────────────
  filterToggle?.addEventListener('click', () => {
    filterToggle.classList.toggle('open');
    sidebarInner.classList.toggle('open');
  });

  // ── Sort ────────────────────────────────────────────────────────────────────
  sortSelect?.addEventListener('change', () => {
    sortMode = sortSelect.value;
    currentPage = 1;
    applyAndRender();
  });

  // ── View toggle ─────────────────────────────────────────────────────────────
  document.querySelectorAll('.view-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      viewMode = btn.dataset.view;
      grid.className = `product-grid view-${viewMode}`;
    });
  });

  // ── Filter: category & price radios ────────────────────────────────────────
  document.querySelectorAll('.filter-radio').forEach(label => {
    label.addEventListener('click', () => {
      const filterKey = label.dataset.filter;
      const value     = label.dataset.value;

      document.querySelectorAll(`.filter-radio[data-filter="${filterKey}"]`)
        .forEach(l => l.classList.remove('active-radio'));
      label.classList.add('active-radio');

      activeFilters[filterKey] = value;
      currentPage = 1;
      applyAndRender();
    });
  });

  // ── Filter: size chips ──────────────────────────────────────────────────────
  document.querySelectorAll('.size-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.size-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.size = btn.dataset.size;
      currentPage = 1;
      applyAndRender();
    });
  });

  // ── Filter: color dots ──────────────────────────────────────────────────────
  document.querySelectorAll('.color-dot').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.color-dot').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.color = btn.dataset.color;
      currentPage = 1;
      applyAndRender();
    });
  });

  // ── Reset ───────────────────────────────────────────────────────────────────
  resetBtns.forEach(btn => {
    btn?.addEventListener('click', () => {
      activeFilters = { category: 'all', price: 'all', size: 'all', color: 'all' };

      document.querySelectorAll('.filter-radio').forEach(l => l.classList.remove('active-radio'));
      document.querySelectorAll('.filter-radio[data-value="all"]').forEach(l => l.classList.add('active-radio'));
      document.querySelectorAll('.size-chip').forEach(b => b.classList.remove('active'));
      document.querySelector('.size-chip[data-size="all"]')?.classList.add('active');
      document.querySelectorAll('.color-dot').forEach(b => b.classList.remove('active'));
      document.querySelector('.color-dot[data-color="all"]')?.classList.add('active');

      currentPage = 1;
      applyAndRender();
    });
  });

  // ── Filter + sort logic ─────────────────────────────────────────────────────
  const applyFilters = () => {
    filtered = allProducts.filter(p => {
      // Category
      if (activeFilters.category !== 'all' && p.category !== activeFilters.category) return false;

      // Price
      if (activeFilters.price === 'under200'  && p.price >= 200) return false;
      if (activeFilters.price === '200-300'   && (p.price < 200 || p.price > 300)) return false;
      if (activeFilters.price === 'over300'   && p.price <= 300) return false;

      // Size
      if (activeFilters.size !== 'all') {
        const sizes = (p.sizes || []).map(s => s.label);
        if (!sizes.includes(activeFilters.size)) return false;
      }

      // Color
      if (activeFilters.color !== 'all') {
        const colors = (p.colors || []).map(c => c.name.toLowerCase());
        if (!colors.some(c => c.includes(activeFilters.color))) return false;
      }

      return true;
    });

    // Sort
    if (sortMode === 'price-asc')  filtered.sort((a, b) => a.price - b.price);
    if (sortMode === 'price-desc') filtered.sort((a, b) => b.price - a.price);
    if (sortMode === 'name-asc')   filtered.sort((a, b) => a.name.localeCompare(b.name));
  };

  // ── Render grid ─────────────────────────────────────────────────────────────
  const renderGrid = () => {
    grid.innerHTML = '';
    grid.className = `product-grid view-${viewMode}`;

    const start = (currentPage - 1) * perPage;
    const page  = filtered.slice(start, start + perPage);

    if (page.length === 0) {
      emptyState.style.display = 'block';
      paginationBar.innerHTML  = '';
      return;
    }

    emptyState.style.display = 'none';

    page.forEach((product, i) => {
      const isSaved = SavedItems.some(s => s.id == product.id);
      const img     = product.images?.[0] || product.image || '';
      const img2    = product.images?.[1] || img;

      const card = document.createElement('div');
      card.classList.add('product-card');
      card.style.animationDelay = `${i * 60}ms`;

      card.innerHTML = `
        <a href="product.html?id=${product.id}" style="text-decoration:none;color:inherit;">
          <div class="card-img-wrap">
            <img src="${img}" alt="${product.name}"
                 onmouseover="this.src='${img2}'"
                 onmouseout="this.src='${img}'">
            ${product.badge ? `<span class="card-badge ${product.badge === 'Sale' ? 'sale' : ''}">${product.badge}</span>` : ''}
          </div>
        </a>
        <div class="card-actions">
          <button class="card-action-btn add-to-cart" data-id="${product.id}">Add to Cart</button>
          <button class="card-action-btn save-btn ${isSaved ? 'saved' : ''}" data-id="${product.id}">
            <i class="fa-${isSaved ? 'solid' : 'regular'} fa-heart"></i>
          </button>
        </div>
        <div class="card-body-nova">
          <div class="card-name">${product.name}</div>
          <div class="card-meta">
            <div class="card-stars">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-regular fa-star"></i>
            </div>
            <div class="card-price">
              ${product.oldPrice ? `<span class="old-price">$${product.oldPrice}</span>` : ''}
              $${product.price}
            </div>
          </div>
        </div>`;

      // Card button events
      card.querySelector('.add-to-cart').addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        addToCart(product.id);
      });

      card.querySelector('.save-btn').addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        toggleSave(product.id);
      });

      grid.appendChild(card);
    });

    renderPagination();
  };

  // ── Pagination ──────────────────────────────────────────────────────────────
  const renderPagination = () => {
    paginationBar.innerHTML = '';
    const totalPages = Math.ceil(filtered.length / perPage);
    if (totalPages <= 1) return;

    const prev = document.createElement('button');
    prev.classList.add('page-btn');
    prev.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
    prev.disabled  = currentPage === 1;
    prev.addEventListener('click', () => { currentPage--; renderGrid(); window.scrollTo(0,0); });
    paginationBar.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.classList.add('page-btn');
      if (i === currentPage) btn.classList.add('active');
      btn.textContent = i;
      btn.addEventListener('click', () => { currentPage = i; renderGrid(); window.scrollTo(0,0); });
      paginationBar.appendChild(btn);
    }

    const next = document.createElement('button');
    next.classList.add('page-btn');
    next.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
    next.disabled  = currentPage === totalPages;
    next.addEventListener('click', () => { currentPage++; renderGrid(); window.scrollTo(0,0); });
    paginationBar.appendChild(next);
  };

  // ── Results count ───────────────────────────────────────────────────────────
  const updateCount = () => {
    resultsCount.innerHTML = `Showing <strong>${filtered.length}</strong> product${filtered.length !== 1 ? 's' : ''}`;
  };

  const applyAndRender = () => {
    applyFilters();
    updateCount();
    renderGrid();
  };

  // ── Load products ───────────────────────────────────────────────────────────
  fetch('products.json')
    .then(r => r.json())
    .then(data => {
      allProducts = Array.isArray(data) ? data : [data];
      applyAndRender();
      renderCart();
      renderSaved();
    })
    .catch(err => {
      console.error('Could not load products.json:', err);
      grid.innerHTML = '<p style="padding:40px;color:#777;text-align:center;">Could not load products.</p>';
    });

}); // end DOMContentLoaded
