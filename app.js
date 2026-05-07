AOS.init({
  // Settings that can be overridden on per-element basis, by `data-aos-*` attributes:
  offset: 120, // offset (in px) from the original trigger point
  delay: 0, // values from 0 to 3000, with step 50ms
  duration: 900, // values from 0 to 3000, with step 50ms
  easing: 'ease', // default easing for AOS animations
  once: false, // whether animation should happen only once - while scrolling down
  mirror: false, // whether elements should animate out while scrolling past them
  anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation

});

let iconCart = document.querySelector('.icon-cart');
let closeCart = document.querySelector('.close');
let body = document.querySelector('body');
let ListProductHTML = document.querySelector('.ListProduct');

let ListProduct = [];

iconCart.addEventListener('click', () => {
  body.classList.toggle('showCart');
});

closeCart.addEventListener('click', () => {
  body.classList.remove('showCart');
});

const addDataToHTML = () => {
  ListProductHTML.innerHTML = '';

  if (ListProduct.length > 0) {
    ListProduct.forEach(vproduct => {
      let newProduct = document.createElement('div');
      newProduct.classList.add('item');

      newProduct.innerHTML = `
        <img src="${vproduct.image}">
        <h5>${vproduct.name}</h5>
        <p>$${vproduct.price}</p>
        <button class="addCart">Add to Cart</button>
      `;

      ListProductHTML.appendChild(newProduct);
    });
  }
};

if (ListProductHTML) {
  ListProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;

    if (positionClick.classList.contains('addCart')) {
      alert('Added to cart');
    }
  });
}

const initApp = () => {
  fetch('products.json')
    .then(response => response.json())
    .then(data => {
      ListProduct = data;
      addDataToHTML();
    });
};

initApp();