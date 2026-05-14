AOS.init({
  offset: 120,
  delay: 0,
  duration: 900,
  easing: 'ease',
  once: false,
  mirror: false,
  anchorPlacement: 'top-bottom',
});

// ── DOM refs ──────────────────────────────────────────────────────────────────
let iconCart        = document.querySelector('.icon-cart');
let closeCart       = document.querySelector('.close');
let openSaved       = document.querySelector('.open-saved');
let closeSaved      = document.querySelector('.closeSaved');
let moveAllToCart   = document.querySelector('.moveAllToCart');
let body            = document.querySelector('body');
let ListProductHTML = document.querySelector('.ListProduct');
let ListCartHTML    = document.querySelector('.ListCart');
let ListSavedHTML   = document.querySelector('.ListSaved');

// ── State ─────────────────────────────────────────────────────────────────────
let ListProduct = [];
let CartItems   = [];
let SavedItems  = [];

// ── Toggle panels ─────────────────────────────────────────────────────────────
iconCart.addEventListener('click', () => {
  body.classList.toggle('showCart');
  body.classList.remove('showSaved');
});

closeCart.addEventListener('click', () => {
  body.classList.remove('showCart');
});

openSaved?.addEventListener('click', (e) => {
  e.preventDefault();
  body.classList.toggle('showSaved');
  body.classList.remove('showCart');
});

closeSaved?.addEventListener('click', () => {
  body.classList.remove('showSaved');
});

// ── Render product grid ───────────────────────────────────────────────────────
const addDataToHTML = () => {
  if (!ListProductHTML) return;
  ListProductHTML.innerHTML = '';

  ListProduct.forEach(product => {
    let isSaved = SavedItems.some(i => i.id == product.id);
    let col = document.createElement('div');
    col.classList.add('col-md-4');
    col.innerHTML = `
      <div class="card border-0 rounded-0 shadow h-100">
        <a href="product-detail.html?id=${product.id}">
          <img src="${product.image}" class="card-img-top rounded-0" alt="${product.name}" style="cursor:pointer;">
        </a>
        <div class="card-body my-3">
          <div class="row">
            <div class="col-10">
              <h4 class="card-title">${product.name}</h4>
              <p class="card-text">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </p>
            </div>
            <div class="col-2">
              <i class="fa-solid fa-heart fa-lg saveItem ${isSaved ? 'saved' : ''}"
                 data-id="${product.id}"
                 style="cursor:pointer"></i>
            </div>
            <div class="row align-items-center text-center">
              <div class="col-4">
                <h5>$${product.price}</h5>
              </div>
              <div class="col-8">
                <button class="btn btn-dark text-warning p-3 w-100 rounded-0 addCart"
                        data-id="${product.id}">
                  ADD TO CART
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    ListProductHTML.appendChild(col);
  });
};

// ── Render cart panel ─────────────────────────────────────────────────────────
const renderCart = () => {
  if (!ListCartHTML) return;
  ListCartHTML.innerHTML = '';

  if (CartItems.length === 0) {
    ListCartHTML.innerHTML = '<p style="padding:20px;color:#aaa;">Your cart is empty.</p>';
  } else {
    CartItems.forEach(item => {
      let div = document.createElement('div');
      div.classList.add('item');
      div.innerHTML = `
        <div class="image"><img src="${item.image}" alt="${item.name}"></div>
        <div class="name">${item.name}</div>
        <div class="totalPrice">$${(item.price * item.quantity).toFixed(2)}</div>
        <div class="quantity">
          <span class="minus" data-id="${item.id}">-</span>
          <span class="value">${item.quantity}</span>
          <span class="plus"  data-id="${item.id}">+</span>
        </div>`;
      ListCartHTML.appendChild(div);
    });
  }

  updateCartCount();
};

// ── Render saved panel ────────────────────────────────────────────────────────
const renderSaved = () => {
  if (!ListSavedHTML) return;
  ListSavedHTML.innerHTML = '';

  if (SavedItems.length === 0) {
    ListSavedHTML.innerHTML = '<p style="padding:20px;color:#aaa;">No saved items yet.</p>';
  } else {
    SavedItems.forEach(item => {
      let div = document.createElement('div');
      div.classList.add('item');
      div.innerHTML = `
        <div class="image"><img src="${item.image}" alt="${item.name}"></div>
        <div class="name">${item.name}<br><small>$${item.price}</small></div>
        <div style="display:flex;flex-direction:column;gap:6px;align-items:center;">
          <button class="btn btn-sm btn-warning addSavedToCart" data-id="${item.id}" style="font-size:11px;padding:4px 6px;white-space:nowrap;">
            Add to Cart
          </button>
          <i class="fa-solid fa-trash removeSaved" data-id="${item.id}" style="cursor:pointer;color:#e55;"></i>
        </div>`;
      ListSavedHTML.appendChild(div);
    });
  }

  updateSavedCount();
};

// ── Update badges ─────────────────────────────────────────────────────────────
const updateCartCount = () => {
  let total = CartItems.reduce((sum, item) => sum + item.quantity, 0);
  let badge = document.querySelector('.nav-link .icon-cart')?.nextElementSibling;
  if (badge) badge.textContent = total;
};

const updateSavedCount = () => {
  let badge = document.querySelector('.open-saved span');
  if (badge) badge.textContent = SavedItems.length;
};

// ── Add to cart ───────────────────────────────────────────────────────────────
const addToCart = (productId) => {
  let product = ListProduct.find(p => p.id == productId);
  if (!product) return;

  let existing = CartItems.find(item => item.id == productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    CartItems.push({ ...product, quantity: 1 });
  }

  renderCart();
  body.classList.add('showCart');
  body.classList.remove('showSaved');
};

// ── Toggle saved ──────────────────────────────────────────────────────────────
const toggleSaved = (productId) => {
  let product = ListProduct.find(p => p.id == productId);
  if (!product) return;

  let idx = SavedItems.findIndex(i => i.id == productId);
  if (idx > -1) {
    SavedItems.splice(idx, 1);
  } else {
    SavedItems.push({ ...product });
  }

  addDataToHTML();
  renderSaved();

  body.classList.add('showSaved');
  body.classList.remove('showCart');
};

// ── Remove from saved ─────────────────────────────────────────────────────────
const removeFromSaved = (productId) => {
  SavedItems = SavedItems.filter(i => i.id != productId);
  addDataToHTML();
  renderSaved();
};

// ── Move all saved → cart ─────────────────────────────────────────────────────
moveAllToCart?.addEventListener('click', () => {
  SavedItems.forEach(item => {
    let existing = CartItems.find(c => c.id == item.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      CartItems.push({ ...item, quantity: 1 });
    }
  });

  SavedItems = [];
  addDataToHTML();
  renderSaved();
  renderCart();

  body.classList.add('showCart');
  body.classList.remove('showSaved');
});

// ── Cart panel interactions ───────────────────────────────────────────────────
ListCartHTML?.addEventListener('click', (e) => {
  if (e.target.classList.contains('plus')) {
    let item = CartItems.find(i => i.id == e.target.dataset.id);
    if (item) { item.quantity += 1; renderCart(); }
  }
  if (e.target.classList.contains('minus')) {
    let idx = CartItems.findIndex(i => i.id == e.target.dataset.id);
    if (idx > -1) {
      CartItems[idx].quantity -= 1;
      if (CartItems[idx].quantity <= 0) CartItems.splice(idx, 1);
      renderCart();
    }
  }
});

// ── Saved panel interactions ──────────────────────────────────────────────────
ListSavedHTML?.addEventListener('click', (e) => {
  if (e.target.classList.contains('addSavedToCart')) {
    addToCart(e.target.dataset.id);
  }
  if (e.target.classList.contains('removeSaved')) {
    removeFromSaved(e.target.dataset.id);
  }
});

// ── Global click delegation ───────────────────────────────────────────────────
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('addCart')) {
    addToCart(e.target.dataset.id);
  }
  if (e.target.classList.contains('saveItem')) {
    toggleSaved(e.target.dataset.id);
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────
const initApp = () => {
  fetch('products.json')
    .then(res => res.json())
    .then(data => {
      ListProduct = Array.isArray(data) ? data : [data];
      addDataToHTML();
      renderCart();
      renderSaved();
    })
    .catch(err => console.error('Could not load products.json:', err));
};

initApp();