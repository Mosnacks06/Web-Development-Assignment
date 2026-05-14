/* ========================================
   ACCOUNT PAGE — account.js
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const $  = (id) => document.getElementById(id);
  const $$ = (sel) => document.querySelectorAll(sel);

  const showToast = (msg, isError = false) => {
    const toast = document.createElement('div');
    toast.classList.add('toast');
    if (isError) toast.classList.add('error');
    toast.innerHTML = `<i class="fa-solid ${isError ? 'fa-circle-xmark' : 'fa-circle-check'}"></i> ${msg}`;
    $('toastWrap').appendChild(toast);
    setTimeout(() => toast.remove(), 3100);
  };

  // Cart and saved drawers
  const body = document.body;
  const iconCart = document.querySelector('.icon-cart');
  const closeCart = document.querySelector('.cartTab .close');
  const openSaved = document.querySelector('.open-saved');
  const closeSaved = document.querySelector('.closeSaved');
  const listCart = document.querySelector('.ListCart');
  const listSaved = document.querySelector('.ListSaved');

  if (listCart) {
    listCart.innerHTML = '<p style="padding:20px;color:#aaa;">Your cart is empty.</p>';
  }

  if (listSaved) {
    listSaved.innerHTML = '<p style="padding:20px;color:#aaa;">No saved items yet.</p>';
  }

  iconCart?.addEventListener('click', (event) => {
    event.preventDefault();
    body.classList.toggle('showCart');
    body.classList.remove('showSaved');
  });

  closeCart?.addEventListener('click', () => {
    body.classList.remove('showCart');
  });

  openSaved?.addEventListener('click', (event) => {
    event.preventDefault();
    body.classList.toggle('showSaved');
    body.classList.remove('showCart');
  });

  closeSaved?.addEventListener('click', () => {
    body.classList.remove('showSaved');
  });

  // ── Tab switching ─────────────────────────────────────────────────────────────
  $$('.sidebar-nav a[data-tab]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const tabId = link.dataset.tab;

      $$('.sidebar-nav a').forEach(a => a.classList.remove('active'));
      link.classList.add('active');

      $$('.section-panel').forEach(p => p.classList.remove('active'));

      const panel = $('tab-' + tabId);
      void panel.offsetWidth; // force reflow so animation re-fires
      panel.classList.add('active');
    });
  });

  // ── PROFILE ───────────────────────────────────────────────────────────────────
  const updateSidebarInfo = () => {
    const first    = $('firstName').value.trim();
    const last     = $('lastName').value.trim();
    const email    = $('emailField').value.trim();
    const initials = (first[0] || '') + (last[0] || '');

    $('sidebarName').textContent     = `${first} ${last}`;
    $('sidebarEmail').textContent    = email;
    $('sidebarInitials').textContent = initials.toUpperCase();

    const avatar = $('profileAvatar');
    if (!avatar.style.backgroundImage) {
      avatar.textContent = initials.toUpperCase();
    }
  };

  $('saveProfileBtn').addEventListener('click', () => {
    updateSidebarInfo();
    showToast('Profile updated successfully');
  });

  $('discardProfileBtn').addEventListener('click', () => {
    $('firstName').value  = 'John';
    $('lastName').value   = 'Doe';
    $('emailField').value = 'john@example.com';
    updateSidebarInfo();
  });

  $('uploadPhotoBtn').addEventListener('click', () => $('avatarInput').click());

  $('avatarInput').addEventListener('change', function () {
    const file = this.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      ['sidebarInitials', 'profileAvatar'].forEach(id => {
        const el = $(id);
        el.style.backgroundImage    = `url(${e.target.result})`;
        el.style.backgroundSize     = 'cover';
        el.style.backgroundPosition = 'center';
        el.textContent              = '';
      });
    };
    reader.readAsDataURL(file);
  });

  // ── PASSWORD ──────────────────────────────────────────────────────────────────
  $$('.toggle-pw').forEach(icon => {
    icon.addEventListener('click', () => {
      const input  = $(icon.dataset.target);
      const isText = input.type === 'text';
      input.type   = isText ? 'password' : 'text';
      icon.classList.toggle('fa-eye',       isText);
      icon.classList.toggle('fa-eye-slash', !isText);
    });
  });

  $('newPw').addEventListener('input', function () {
    const val  = this.value;
    const bar  = $('strengthBar');
    const hint = $('strengthHint');
    let score  = 0;

    if (val.length >= 8)            score++;
    if (/[A-Z]/.test(val))          score++;
    if (/[0-9]/.test(val))          score++;
    if (/[^A-Za-z0-9]/.test(val))   score++;

    const levels = [
      { w: '0%',   bg: 'transparent', text: 'Use 8+ chars, uppercase, number & symbol' },
      { w: '25%',  bg: '#e05',        text: 'Weak — add more variety' },
      { w: '50%',  bg: '#f80',        text: 'Fair — keep going' },
      { w: '75%',  bg: '#fb0',        text: 'Good — almost there' },
      { w: '100%', bg: '#2ecc71',     text: 'Strong password!' },
    ];

    const level       = val.length === 0 ? levels[0] : levels[score];
    bar.style.width   = level.w;
    bar.style.background = level.bg;
    hint.textContent  = level.text;
  });

  $('changePasswordBtn').addEventListener('click', () => {
    const current = $('currentPw').value;
    const newPw   = $('newPw').value;
    const confirm = $('confirmPw').value;

    if (!current)          return showToast('Enter your current password', true);
    if (newPw.length < 8)  return showToast('Password must be at least 8 characters', true);
    if (newPw !== confirm) return showToast('Passwords do not match', true);

    ['currentPw', 'newPw', 'confirmPw'].forEach(id => $(id).value = '');
    $('newPw').dispatchEvent(new Event('input')); // reset strength bar
    showToast('Password updated successfully');
  });

  // ── PAYMENT ───────────────────────────────────────────────────────────────────
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
    if (/^4/.test(n))      return 'visa';
    if (/^5[1-5]/.test(n)) return 'mastercard';
    if (/^3[47]/.test(n))  return 'amex';
    if (/^6011/.test(n))   return 'discover';
    return 'other';
  };

  const renderPaymentGrid = () => {
    const grid = $('paymentGrid');
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
          ${!card.isDefault
            ? `<button class="btn-ghost set-default-btn" data-id="${card.id}" style="font-size:11px;padding:8px 14px;">Set Default</button>`
            : ''}
          <button class="btn-danger remove-card-btn" data-id="${card.id}">Remove</button>
        </div>`;

      grid.appendChild(div);
    });

    // Add card placeholder
    const placeholder = document.createElement('div');
    placeholder.classList.add('add-card-placeholder');
    placeholder.id = 'addCardPlaceholder';
    placeholder.innerHTML = `<i class="fa-solid fa-plus"></i><span>Add New Card</span>`;
    grid.appendChild(placeholder);

    // Attach events to dynamically created buttons
    $$('.set-default-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        paymentMethods.forEach(c => c.isDefault = c.id === id);
        renderPaymentGrid();
        showToast('Default payment method updated');
      });
    });

    $$('.remove-card-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        paymentMethods = paymentMethods.filter(c => c.id !== id);
        renderPaymentGrid();
        showToast('Card removed');
      });
    });

    $('addCardPlaceholder').addEventListener('click', () => toggleAddCardForm(true));
  };

  const toggleAddCardForm = (open) => {
    const form = $('addCardForm');
    if (open) {
      form.classList.add('open');
      form.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      form.classList.remove('open');
      ['cardName', 'cardNumber', 'cardExpiry', 'cardCvv', 'cardAddress'].forEach(id => $(id).value = '');
      updatePreview();
    }
  };

  const updatePreview = () => {
    const name   = $('cardName').value   || 'YOUR NAME';
    const num    = $('cardNumber').value || '';
    const expiry = $('cardExpiry').value || 'MM / YY';

    const cleaned = num.replace(/\s/g, '');
    let display = '';
    for (let i = 0; i < 16; i++) {
      display += cleaned[i] ? cleaned[i] : '•';
      if ((i + 1) % 4 === 0 && i < 15) display += ' ';
    }

    $('previewNumber').textContent = display;
    $('previewName').textContent   = name.toUpperCase();
    $('previewExpiry').textContent = expiry;

    const icon = $('previewIcon');
    icon.className   = `${cardIcons[detectCardType(num)]} fa-2x`;
    icon.style.color = 'var(--accent)';
  };

  // Live card preview listeners
  $('cardName').addEventListener('input',   updatePreview);
  $('cardExpiry').addEventListener('input', updatePreview);

  $('cardNumber').addEventListener('input', function () {
    let val = this.value.replace(/\D/g, '').substring(0, 16);
    this.value = val.replace(/(.{4})/g, '$1 ').trim();
    updatePreview();
  });

  $('cardExpiry').addEventListener('input', function () {
    let val = this.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) val = val.substring(0, 2) + ' / ' + val.substring(2);
    this.value = val;
    updatePreview();
  });

  $('saveCardBtn').addEventListener('click', () => {
    const name   = $('cardName').value.trim();
    const num    = $('cardNumber').value.trim();
    const expiry = $('cardExpiry').value.trim();
    const cvv    = $('cardCvv').value.trim();

    if (!name || !num || !expiry || !cvv)
      return showToast('Please fill in all card details', true);
    if (num.replace(/\s/g, '').length < 16)
      return showToast('Enter a valid 16-digit card number', true);

    const masked = num.substring(0, 4) + ' •••• •••• ' + num.slice(-4);
    paymentMethods.push({
      id:        Date.now(),
      type:      detectCardType(num),
      number:    masked,
      expiry,
      holder:    name,
      isDefault: paymentMethods.length === 0,
    });

    toggleAddCardForm(false);
    renderPaymentGrid();
    showToast('Card added successfully');
  });

  $('cancelCardBtn').addEventListener('click', () => toggleAddCardForm(false));

  // ── ORDERS ────────────────────────────────────────────────────────────────────
  const mockOrders = [
    {
      id: 'NOV-20482', date: 'May 3, 2026', status: 'delivered', total: 570,
      items: [
        { name: 'Cool Jacket',   variant: 'Midnight Black / L', qty: 1, price: 350 },
        { name: 'Alpine Hoodie', variant: 'Charcoal / M',       qty: 1, price: 220 },
      ],
    },
    {
      id: 'NOV-19831', date: 'Apr 18, 2026', status: 'shipped', total: 180,
      items: [
        { name: 'Trail Vest', variant: 'Rust / S', qty: 1, price: 180 },
      ],
    },
    {
      id: 'NOV-18540', date: 'Mar 29, 2026', status: 'delivered', total: 700,
      items: [
        { name: 'Cool Jacket', variant: 'Forest Green / M', qty: 2, price: 350 },
      ],
    },
    {
      id: 'NOV-17203', date: 'Feb 11, 2026', status: 'cancelled', total: 220,
      items: [
        { name: 'Alpine Hoodie', variant: 'Ecru / XL', qty: 1, price: 220 },
      ],
    },
  ];

  const renderOrders = () => {
    const list = $('ordersList');
    list.innerHTML = '';

    mockOrders.forEach(order => {
      const card = document.createElement('div');
      card.classList.add('order-card');

      const itemsHTML = order.items.map(item => `
        <div class="order-item">
          <div class="order-item-img"><i class="fa-solid fa-shirt"></i></div>
          <div class="order-item-info">
            <div class="order-item-name">${item.name}</div>
            <div class="order-item-meta">${item.variant} &nbsp;·&nbsp; Qty ${item.qty}</div>
          </div>
          <div class="order-item-price">$${item.price * item.qty}</div>
        </div>`).join('');

      const reorderBtn = order.status === 'delivered'
        ? `<button class="btn-ghost" style="font-size:12px;padding:8px 16px;">Reorder</button>` : '';
      const trackBtn = order.status === 'shipped'
        ? `<button class="btn-ghost" style="font-size:12px;padding:8px 16px;"><i class="fa-solid fa-truck"></i> Track</button>` : '';

      card.innerHTML = `
        <div class="order-header">
          <div>
            <div class="order-header-label">Order</div>
            <div class="order-header-value">#${order.id}</div>
          </div>
          <div>
            <div class="order-header-label">Date</div>
            <div class="order-header-value">${order.date}</div>
          </div>
          <div>
            <div class="order-header-label">Status</div>
            <span class="order-status ${order.status}">${order.status}</span>
          </div>
          <i class="fa-solid fa-chevron-down order-chevron"></i>
        </div>
        <div class="order-body">
          ${itemsHTML}
          <div class="order-footer">
            <div style="display:flex;gap:10px;">${reorderBtn}${trackBtn}</div>
            <div class="order-total">Total &nbsp;<span>$${order.total}</span></div>
          </div>
        </div>`;

      // Toggle expand on header click — pure event listener, no onclick
      card.querySelector('.order-header').addEventListener('click', () => {
        card.classList.toggle('open');
      });

      list.appendChild(card);
    });
  };

  // ── PREFERENCES ──────────────────────────────────────────────────────────────

  // Helper: read a toggle's stored state and apply it on page load
  const initToggle = (btnId, storageKey, onCallback, offCallback) => {
    const btn = $(btnId);
    if (!btn) return;
    const stored = localStorage.getItem(storageKey) === 'true';
    if (stored) { btn.classList.add('on'); btn.setAttribute('aria-checked', 'true'); onCallback?.(); }
    btn.addEventListener('click', () => {
      const isOn = btn.classList.toggle('on');
      btn.setAttribute('aria-checked', isOn);
      localStorage.setItem(storageKey, isOn);
      isOn ? onCallback?.() : offCallback?.();
    });
  };

  // Dark mode
  initToggle(
    'darkModeToggle',
    'nova-theme',
    () => { document.documentElement.setAttribute('data-theme', 'dark'); localStorage.setItem('nova-theme', 'dark'); },
    () => { document.documentElement.removeAttribute('data-theme');       localStorage.setItem('nova-theme', 'light'); }
  );

  // Sync toggle visual to current theme on page load
  const darkBtn = $('darkModeToggle');
  if (darkBtn && document.documentElement.getAttribute('data-theme') === 'dark') {
    darkBtn.classList.add('on');
    darkBtn.setAttribute('aria-checked', 'true');
  }

  // Reduce motion
  initToggle(
    'reduceMotionToggle',
    'nova-reduce-motion',
    () => document.body.classList.add('reduce-motion'),
    () => document.body.classList.remove('reduce-motion')
  );

  // Notification toggles (stored only, no side effects needed)
  ['orderNotifToggle', 'newArrivalsToggle', 'promoToggle'].forEach(id => {
    initToggle(id, `nova-notif-${id}`, null, null);
  });

  // Region selects — restore saved values
  ['currencySelect', 'languageSelect'].forEach(id => {
    const el = $(id);
    if (!el) return;
    const saved = localStorage.getItem(`nova-${id}`);
    if (saved) el.value = saved;
  });

  $('savePrefsBtn')?.addEventListener('click', () => {
    const currency = $('currencySelect')?.value;
    const language = $('languageSelect')?.value;
    if (currency) localStorage.setItem('nova-currencySelect', currency);
    if (language) localStorage.setItem('nova-languageSelect', language);
    showToast('Preferences saved');
  });

  // ── Init ──────────────────────────────────────────────────────────────────────
  // Contact form
  $('sendContactBtn')?.addEventListener('click', () => {
    const email = $('contactEmail').value.trim();
    const message = $('contactMessage').value.trim();

    if (!email) return showToast('Enter your email address', true);
    if (!email.includes('@')) return showToast('Enter a valid email address', true);
    if (!message) return showToast('Tell us why you need to contact us', true);

    $('contactMessage').value = '';
    showToast('Message sent successfully');
  });

  $('clearContactBtn')?.addEventListener('click', () => {
    $('contactEmail').value = '';
    $('contactMessage').value = '';
  });

  renderPaymentGrid();
  renderOrders();

}); // end DOMContentLoaded
