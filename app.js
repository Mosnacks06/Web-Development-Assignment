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

      // Bootstrap column
      newProduct.classList.add('col-md-4');

      newProduct.innerHTML = `
      
      <div class="card border-0 rounded-0 shadow h-100">

        <img src="${vproduct.image}" class="card-img-top rounded-0">

        <div class="card-body my-3">

          <div class="row">

            <div class="col-10">
              <h4 class="card-title">${vproduct.name}</h4>

              <p class="card-text">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </p>
            </div>

            <div class="col-2">
              <i class="fa-solid fa-heart fa-lg"></i>
            </div>

            <div class="row align-items-center text-center">

              <div class="col-4">
                <h5>$${vproduct.price}</h5>
              </div>

              <div class="col-8">
                <button 
                  class="btn btn-dark text-warning p-3 w-100 rounded-0 addCart"
                  data-id="${vproduct.id}"
                >
                  ADD TO CART
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
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

