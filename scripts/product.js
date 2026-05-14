document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get('id') || '1';

  const mainImage = document.getElementById('mainImage');
  const thumbnails = document.getElementById('thumbnails');
  const productName = document.getElementById('productName');
  const productPrice = document.getElementById('productPrice');
  const productDescription = document.getElementById('productDescription');
  const colorSection = document.getElementById('colorSection');
  const colorSwatches = document.getElementById('colorSwatches');
  const colorLabel = document.getElementById('colorLabel');
  const sizeSection = document.getElementById('sizeSection');
  const sizeBtns = document.getElementById('sizeBtns');
  const sizeLabel = document.getElementById('sizeLabel');
  const sizeError = document.getElementById('sizeError');
  const btnAddCart = document.getElementById('btnAddCart');
  const btnSave = document.getElementById('btnSave');
  const body = document.body;
  const iconCart = document.querySelector('.icon-cart');
  const closeCart = document.querySelector('.cartTab .close');
  const openSaved = document.querySelector('.open-saved');
  const closeSaved = document.querySelector('.closeSaved');
  const moveAllToCart = document.querySelector('.moveAllToCart');
  const listCart = document.querySelector('.ListCart');
  const listSaved = document.querySelector('.ListSaved');

  let product = null;
  let selectedSize = '';
  let cartItems = [];
  let savedItems = [];

  const imageFor = (item) => item.image || item.images?.[0] || '';

  const updateBadges = () => {
    const cartTotal = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.querySelector('.icon-cart')?.nextElementSibling;
    const savedBadge = document.querySelector('.open-saved span');
    if (cartBadge) cartBadge.textContent = cartTotal;
    if (savedBadge) savedBadge.textContent = savedItems.length;
  };

  const renderCart = () => {
    if (!listCart) return;
    listCart.innerHTML = '';

    if (cartItems.length === 0) {
      listCart.innerHTML = '<p style="padding:20px;color:#aaa;">Your cart is empty.</p>';
      updateBadges();
      return;
    }

    cartItems.forEach((item) => {
      const div = document.createElement('div');
      div.classList.add('item');
      div.innerHTML = `
        <div class="image"><img src="${imageFor(item)}" alt="${item.name}"></div>
        <div class="name">${item.name}</div>
        <div class="totalPrice">$${(item.price * item.quantity).toFixed(2)}</div>
        <div class="quantity">
          <span class="minus" data-id="${item.id}">-</span>
          <span class="value">${item.quantity}</span>
          <span class="plus" data-id="${item.id}">+</span>
        </div>`;
      listCart.appendChild(div);
    });

    updateBadges();
  };

  const renderSaved = () => {
    if (!listSaved) return;
    listSaved.innerHTML = '';

    if (savedItems.length === 0) {
      listSaved.innerHTML = '<p style="padding:20px;color:#aaa;">No saved items yet.</p>';
      updateBadges();
      return;
    }

    savedItems.forEach((item) => {
      const div = document.createElement('div');
      div.classList.add('item');
      div.innerHTML = `
        <div class="image"><img src="${imageFor(item)}" alt="${item.name}"></div>
        <div class="name">${item.name}<br><small>$${item.price}</small></div>
        <div style="display:flex;flex-direction:column;gap:6px;align-items:center;">
          <button class="btn btn-sm btn-warning addSavedToCart" data-id="${item.id}" style="font-size:11px;padding:4px 6px;">Add</button>
          <i class="fa-solid fa-trash removeSaved" data-id="${item.id}" style="cursor:pointer;color:#e55;"></i>
        </div>`;
      listSaved.appendChild(div);
    });

    updateBadges();
  };

  const addToCart = (item) => {
    const existing = cartItems.find((cartItem) => cartItem.id == item.id);
    if (existing) existing.quantity += 1;
    else cartItems.push({ ...item, quantity: 1 });

    renderCart();
    body.classList.add('showCart');
    body.classList.remove('showSaved');
  };

  const renderProduct = () => {
    const images = product.images?.length ? product.images : [product.image];

    productName.textContent = product.name;
    productPrice.textContent = `$${product.price}`;
    productDescription.textContent = product.description || 'Built for everyday adventures with durable materials and a clean NOVA finish.';

    mainImage.src = images[0];
    mainImage.alt = product.name;
    thumbnails.innerHTML = '';

    images.forEach((src, index) => {
      const thumb = document.createElement('img');
      thumb.className = `thumb${index === 0 ? ' active' : ''}`;
      thumb.src = src;
      thumb.alt = `${product.name} view ${index + 1}`;
      thumb.addEventListener('click', () => {
        mainImage.src = src;
        document.querySelectorAll('.thumb').forEach((item) => item.classList.remove('active'));
        thumb.classList.add('active');
      });
      thumbnails.appendChild(thumb);
    });

    if (product.colors?.length) {
      colorSection.style.display = 'block';
      colorSwatches.innerHTML = '';
      colorLabel.textContent = product.colors[0].name;

      product.colors.forEach((color, index) => {
        const swatch = document.createElement('button');
        swatch.className = `color-swatch${index === 0 ? ' active' : ''}`;
        swatch.style.background = color.hex;
        swatch.title = color.name;
        swatch.addEventListener('click', () => {
          colorLabel.textContent = color.name;
          document.querySelectorAll('.color-swatch').forEach((item) => item.classList.remove('active'));
          swatch.classList.add('active');
        });
        colorSwatches.appendChild(swatch);
      });
    }

    if (product.sizes?.length) {
      sizeSection.style.display = 'block';
      sizeBtns.innerHTML = '';

      product.sizes.forEach((size) => {
        const button = document.createElement('button');
        button.className = `size-btn${size.available ? '' : ' unavailable'}`;
        button.textContent = size.label;
        button.disabled = !size.available;
        button.addEventListener('click', () => {
          selectedSize = size.label;
          sizeLabel.textContent = selectedSize;
          sizeError.style.display = 'none';
          document.querySelectorAll('.size-btn').forEach((item) => item.classList.remove('active'));
          button.classList.add('active');
        });
        sizeBtns.appendChild(button);
      });
    }
  };

  iconCart?.addEventListener('click', () => {
    body.classList.toggle('showCart');
    body.classList.remove('showSaved');
  });

  closeCart?.addEventListener('click', () => body.classList.remove('showCart'));

  openSaved?.addEventListener('click', (event) => {
    event.preventDefault();
    body.classList.toggle('showSaved');
    body.classList.remove('showCart');
  });

  closeSaved?.addEventListener('click', () => body.classList.remove('showSaved'));

  listCart?.addEventListener('click', (event) => {
    if (event.target.classList.contains('plus')) {
      const item = cartItems.find((cartItem) => cartItem.id == event.target.dataset.id);
      if (item) item.quantity += 1;
    }

    if (event.target.classList.contains('minus')) {
      const index = cartItems.findIndex((cartItem) => cartItem.id == event.target.dataset.id);
      if (index > -1) {
        cartItems[index].quantity -= 1;
        if (cartItems[index].quantity <= 0) cartItems.splice(index, 1);
      }
    }

    renderCart();
  });

  listSaved?.addEventListener('click', (event) => {
    if (event.target.classList.contains('addSavedToCart')) {
      const item = savedItems.find((savedItem) => savedItem.id == event.target.dataset.id);
      if (item) addToCart(item);
    }

    if (event.target.classList.contains('removeSaved')) {
      savedItems = savedItems.filter((item) => item.id != event.target.dataset.id);
      btnSave?.classList.remove('saved');
      renderSaved();
    }
  });

  moveAllToCart?.addEventListener('click', () => {
    savedItems.forEach(addToCart);
    savedItems = [];
    btnSave?.classList.remove('saved');
    renderSaved();
  });

  btnAddCart?.addEventListener('click', () => {
    if (product.sizes?.length && !selectedSize) {
      sizeError.style.display = 'block';
      return;
    }

    addToCart({ ...product, selectedSize });
  });

  btnSave?.addEventListener('click', () => {
    const existing = savedItems.findIndex((item) => item.id == product.id);
    if (existing > -1) savedItems.splice(existing, 1);
    else savedItems.push(product);

    btnSave.classList.toggle('saved', existing === -1);
    renderSaved();
    body.classList.add('showSaved');
    body.classList.remove('showCart');
  });

  fetch('products.json')
    .then((response) => response.json())
    .then((products) => {
      product = products.find((item) => item.id == productId) || products[0];
      renderProduct();
      renderCart();
      renderSaved();
    })
    .catch((error) => {
      console.error('Could not load products.json:', error);
      productName.textContent = 'Product not found';
      productDescription.textContent = 'Please return to the shop and choose another product.';
    });
});
