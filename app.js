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

  // ── Tab navigation ─────────────────────────────────────────────────────────
    document.querySelectorAll('.sidebar-nav a[data-tab]').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const tab = link.dataset.tab;
        document.querySelectorAll('.sidebar-nav a').forEach(a => a.classList.remove('active'));
        link.classList.add('active');
        document.querySelectorAll('.section-panel').forEach(p => p.classList.remove('active'));
        document.getElementById('tab-' + tab).classList.add('active');
      });
    });
 
    // ── Toast ──────────────────────────────────────────────────────────────────
    const showToast = (msg, isError = false) => {
      const wrap = document.getElementById('toastWrap');
      const toast = document.createElement('div');
      toast.classList.add('toast');
      if (isError) toast.classList.add('error');
      toast.innerHTML = `<i class="fa-solid ${isError ? 'fa-circle-xmark' : 'fa-circle-check'}"></i> ${msg}`;
      wrap.appendChild(toast);
      setTimeout(() => toast.remove(), 3100);
    };
 
    // ── Profile ────────────────────────────────────────────────────────────────
    const updateSidebarInfo = () => {
      const first = document.getElementById('firstName').value.trim();
      const last  = document.getElementById('lastName').value.trim();
      const email = document.getElementById('emailField').value.trim();
      const initials = (first[0] || '') + (last[0] || '');
      document.getElementById('sidebarName').textContent = `${first} ${last}`;
      document.getElementById('sidebarEmail').textContent = email;
      document.getElementById('sidebarInitials').textContent = initials.toUpperCase();
      document.getElementById('profileAvatar').textContent = initials.toUpperCase();
    };
 
    const saveProfile = () => {
      updateSidebarInfo();
      showToast('Profile updated successfully');
    };
 
    const resetProfile = () => {
      document.getElementById('firstName').value = 'John';
      document.getElementById('lastName').value  = 'Doe';
      document.getElementById('emailField').value = 'john@example.com';
      updateSidebarInfo();
    };
 
    const handleAvatarUpload = (input) => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        ['sidebarInitials','profileAvatar'].forEach(id => {
          const el = document.getElementById(id);
          el.style.backgroundImage = `url(${e.target.result})`;
          el.style.backgroundSize = 'cover';
          el.textContent = '';
        });
      };
      reader.readAsDataURL(file);
    };
 
    // ── Password ───────────────────────────────────────────────────────────────
    const togglePw = (id, icon) => {
      const input = document.getElementById(id);
      const isText = input.type === 'text';
      input.type = isText ? 'password' : 'text';
      icon.classList.toggle('fa-eye', isText);
      icon.classList.toggle('fa-eye-slash', !isText);
    };
 
    const checkStrength = (val) => {
      const bar  = document.getElementById('strengthBar');
      const hint = document.getElementById('strengthHint');
      let score = 0;
      if (val.length >= 8)              score++;
      if (/[A-Z]/.test(val))            score++;
      if (/[0-9]/.test(val))            score++;
      if (/[^A-Za-z0-9]/.test(val))     score++;
 
      const levels = [
        { w: '0%',   bg: 'transparent', text: 'Use 8+ chars, uppercase, number & symbol' },
        { w: '25%',  bg: '#e05',        text: 'Weak — add more variety' },
        { w: '50%',  bg: '#f80',        text: 'Fair — keep going' },
        { w: '75%',  bg: '#fb0',        text: 'Good — almost there' },
        { w: '100%', bg: '#2ecc71',     text: 'Strong password!' },
      ];
      const level = val.length === 0 ? levels[0] : levels[score];
      bar.style.width = level.w;
      bar.style.background = level.bg;
      hint.textContent = level.text;
    };
 
    const changePassword = () => {
      const current  = document.getElementById('currentPw').value;
      const newPw    = document.getElementById('newPw').value;
      const confirm  = document.getElementById('confirmPw').value;
 
      if (!current) { showToast('Enter your current password', true); return; }
      if (newPw.length < 8) { showToast('Password must be at least 8 characters', true); return; }
      if (newPw !== confirm) { showToast('Passwords do not match', true); return; }
 
      // Clear fields
      ['currentPw','newPw','confirmPw'].forEach(id => document.getElementById(id).value = '');
      checkStrength('');
      showToast('Password updated successfully');
    };
 
    // ── Payment ────────────────────────────────────────────────────────────────
    let paymentMethods = [
      { id: 1, type: 'visa',       number: '4532 •••• •••• 8921', expiry: '08 / 26', holder: 'John Doe', isDefault: true  },
      { id: 2, type: 'mastercard', number: '5412 •••• •••• 3304', expiry: '03 / 25', holder: 'John Doe', isDefault: false },
    ];
 
    const cardIcons = {
      visa:       'fa-brands fa-cc-visa',
      mastercard: 'fa-brands fa-cc-mastercard',
      amex:       'fa-brands fa-cc-amex',
      discover:   'fa-brands fa-cc-discover',
      other:      'fa-solid fa-credit-card',
    };
 
    const detectCardType = (num) => {
      const n = num.replace(/\s/g, '');
      if (/^4/.test(n))          return 'visa';
      if (/^5[1-5]/.test(n))     return 'mastercard';
      if (/^3[47]/.test(n))      return 'amex';
      if (/^6011/.test(n))       return 'discover';
      return 'other';
    };
 
    const renderPaymentGrid = () => {
      const grid = document.getElementById('paymentGrid');
      grid.innerHTML = '';
 
      paymentMethods.forEach(card => {
        const div = document.createElement('div');
        div.classList.add('pay-card');
        if (card.isDefault) div.classList.add('default-card');
        div.innerHTML = `
          <div class="pay-card-top">
            <i class="${cardIcons[card.type] || cardIcons.other} card-type-icon"></i>
            ${card.isDefault ? '<span class="default-badge">Default</span>' : ''}
          </div>
          <div class="pay-card-number">${card.number}</div>
          <div class="pay-card-meta">
            <span>${card.holder}</span>
            <span>Exp ${card.expiry}</span>
          </div>
          <div class="pay-card-actions">
            ${!card.isDefault ? `<button class="btn-ghost" style="font-size:11px;padding:8px 14px;" onclick="setDefault(${card.id})">Set Default</button>` : ''}
            <button class="btn-danger" onclick="removeCard(${card.id})">Remove</button>
          </div>`;
        grid.appendChild(div);
      });
 
      // Add card placeholder
      const placeholder = document.createElement('div');
      placeholder.classList.add('add-card-placeholder');
      placeholder.onclick = () => toggleAddCardForm(true);
      placeholder.innerHTML = `<i class="fa-solid fa-plus"></i><span>Add New Card</span>`;
      grid.appendChild(placeholder);
    };
 
    const setDefault = (id) => {
      paymentMethods.forEach(c => c.isDefault = c.id === id);
      renderPaymentGrid();
      showToast('Default payment method updated');
    };
 
    const removeCard = (id) => {
      paymentMethods = paymentMethods.filter(c => c.id !== id);
      renderPaymentGrid();
      showToast('Card removed');
    };
 
    const toggleAddCardForm = (open) => {
      const form = document.getElementById('addCardForm');
      if (open) {
        form.classList.add('open');
        form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        form.classList.remove('open');
        resetCardForm();
      }
    };
 
    const resetCardForm = () => {
      ['cardName','cardNumber','cardExpiry','cardCvv','cardAddress'].forEach(id => {
        document.getElementById(id).value = '';
      });
      updatePreview();
    };
 
    const formatCardNumber = (input) => {
      let val = input.value.replace(/\D/g, '').substring(0, 16);
      input.value = val.replace(/(.{4})/g, '$1 ').trim();
    };
 
    const formatExpiry = (input) => {
      let val = input.value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 3) val = val.substring(0,2) + ' / ' + val.substring(2);
      input.value = val;
    };
 
    const updatePreview = () => {
      const name   = document.getElementById('cardName').value || 'YOUR NAME';
      const num    = document.getElementById('cardNumber').value || '';
      const expiry = document.getElementById('cardExpiry').value || 'MM / YY';
 
      // Fill number with bullets for missing digits
      const cleaned = num.replace(/\s/g,'');
      let display = '';
      for (let i = 0; i < 16; i++) {
        display += cleaned[i] ? cleaned[i] : '•';
        if ((i+1) % 4 === 0 && i < 15) display += ' ';
      }
 
      document.getElementById('previewNumber').textContent = display;
      document.getElementById('previewName').textContent   = name.toUpperCase();
      document.getElementById('previewExpiry').textContent = expiry;
 
      // Card type icon
      const type = detectCardType(num);
      document.getElementById('previewIcon').className = `${cardIcons[type]} ` + 'fa-2x';
      document.getElementById('previewIcon').style.color = 'var(--accent)';
    };
 
    const saveCard = () => {
      const name   = document.getElementById('cardName').value.trim();
      const num    = document.getElementById('cardNumber').value.trim();
      const expiry = document.getElementById('cardExpiry').value.trim();
      const cvv    = document.getElementById('cardCvv').value.trim();
 
      if (!name || !num || !expiry || !cvv) {
        showToast('Please fill in all card details', true); return;
      }
      if (num.replace(/\s/g,'').length < 16) {
        showToast('Enter a valid 16-digit card number', true); return;
      }
 
      const type = detectCardType(num);
      const masked = num.substring(0,4) + ' •••• •••• ' + num.slice(-4);
 
      paymentMethods.push({
        id: Date.now(),
        type,
        number: masked,
        expiry,
        holder: name,
        isDefault: paymentMethods.length === 0,
      });
 
      toggleAddCardForm(false);
      renderPaymentGrid();
      showToast('Card added successfully');
    };
 
    // ── Init ───────────────────────────────────────────────────────────────────
    renderPaymentGrid();

