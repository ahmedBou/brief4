//1 Variables

const cartBtn = document.querySelector(".cart-btn");
const closeCartBtn = document.querySelector(".close-cart");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const productsDOM = document.querySelector(".products-center");
// const btns = document.querySelectorAll(".bag-btn");
// console.log(btns);  => NodeList(0)

//2 main cart , were gonna placing information getting info from the
// local storage
let cart = [];
let buttonsDOM = [];
//3 gettings the products from json or contentful
class Products {
  // there is no need to setup a constructor
  // the key with async await is that it will always return
  //  the promise, so await keyword will gonna be waiting till
  // the promise is settled and then wil return a result
  async getProducts() {
    try {
      let result = await fetch("products.json");
      // instead of simple result return me the data using
      // the json method that we have on a fetch, so wait when
      // when i finish with a result that holding the values,
      // so we get data in json format
      let data = await result.json();
      // return result;
      // return data;
      let products = data.items;
      products = products.map(item => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

//4 display products: this class will be responsible for getting
// all the items that are being returned from the products and
// displaying them or manipulating something or getting them from
// display products: everything gonna display on the screen
class UI {
  // we're gonna call this method once we get the products
  displayProducts(products) {
    // console.log(products);
    let result = "";
    products.forEach(product => {
      // template literal
      result += `
         <!-- single product -->
        <article class="product">
          <div class="img-container">
            <img src= ${product.image}
             alt="product" 
             class="product-img"
              />
            <button class="bag-btn" data-id=${product.id}>
              <i class="fas fa-shopping-cart"></i>
              add to cart
            </button>
          </div>
          <h3>${product.title}</h3>
          <h4>$${product.price}</h4>
        </article>
        <!--end of single discounts -->
        `;
    });
    // so we're getting the information first from getProducts()
    // in eventlistener and then we use ui.displayProducts method
    // we're we get our products we're we get an array and we loop over the array above
    // forEach in every item in array we add to our result, finnaly
    // we just set the property below to result, so this gonna show us
    // al the products in he browser
    productsDOM.innerHTML = result;
  }
  getBagButtons() {
    const buttons = [...document.querySelectorAll(".bag-btn")];
    buttonsDOM = buttons;
    // console.log(buttons);
    buttons.forEach(button => {
      let id = button.dataset.id;
      //   console.log(id);
      // we use the find method and find me this item there is in the cart
      // wherever the item i have in the cart get me a callback fct and
      // then within this fct pass the argument, and if the item.id that i have

      let inCart = cart.find(item => item.id === id);
      if (inCart) {
        button.innerText = "In Cart";
        button.disabled = true;
      } //else {
      button.addEventListener("click", event => {
        //   console.log(event);
        event.target.innerText = "In Cart";
        event.target.disabled = true;
        //  get product from products
        // let cartItem = Storage.getProduct(id);
        // console.log(cartItem);
        let cartItem = { ...Storage.getProduct(id), amount: 1 };
        // console.log(cartItem);

        // add product to the cart
        cart = [...cart, cartItem];
        // console.log(cart);

        // save the cart in the local storage
        Storage.saveCart(cart);
        // set cart values
        this.setCartValues(cart);
        // display cart item
        this.addCartItem(cartItem);
        // show the cart
        this.showCart();
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
    // console.log(cartTotal, cartItems);
  }
  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = ` 
        <img src=${item.image} alt="product" />
        <div>
            <h4>${item.title}</h4>
            <h5>$${item.title}</h5>
            <span class="remove-item" data-id=${item.id}>
            remove</span>
        </div>
        <div>
            <i class="fas fa-chevron-up" id=${item.id}></i>
            <p class="item-amount">${item.amount}</p>
            <i class="fas fa-chevron-down" data-id=${item.id}></i>
        </div>
      `;
    cartContent.appendChild(div);
    // console.log(cartContent);
  }
  showCart() {
    cartOverlay.classList.add("transparentBcg");
    cartDOM.classList.add("showCart");
  }
  setupAPP() {
    cart = Storage.getCart();
    this.setCartValues(cart);
    this.populateCart(cart);
    cartBtn.addEventListener("click", this.showCart);
    closeCartBtn.addEventListener("click", this.hideCart);
  }
  populateCart(cart) {
    cart.forEach(item => this.addCartItem(item));
  }
  hideCart() {
    cartOverlay.classList.remove("transparentBcg");
    cartDOM.classList.remove("showCart");
  }
  cartLogic() {
    //   clear cart button
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });
    // cart fonctionality
    cartContent.addEventListener("click", event => {
      //   console.log(event.target);
      if (event.target.classList.contains("remove-item")) {
        let removeItem = event.target;
        // console.log(removeItem);
        let id = removeItem.dataset.id;
        // console.log(removeItem.parentElement.parentElement);
        cartContent.removeChild(removeItem.parentElement.parentElement);
        this.removeItem(id);
      } else if (event.target.classList.contains("fa-chevron-up")) {
        let addAmount = event.target;
        let id = addAmount.id;
        // console.log(addAmount);
        let tempItem = cart.find(item => item.id === id);
        // console.log(tempItem);

        tempItem.amount += 1;
        Storage.saveCart(cart);
        this.setCartValues(cart);
        addAmount.nextElementSibling.innerText = tempItem.amount;
      } else if (event.target.classList.contains("fa-chevron-down")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find(item => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.setCartValues(cart);
          lowerAmount.previousElementSibling.innerHTML = tempItem.amount;
        } else {
          cartContent.removeChild(lowerAmount.parentElement.parentElement);
          this.removeItem(id);
        }
      }
    });
  }
  clearCart() {
    //console.log(this);
    let cartItems = cart.map(item => item.id);
    // console.log(cartItems);
    cartItems.forEach(id => this.removeItem(id));
    console.log(cartContent.children);

    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
    this.hideCart();
  }
  removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = `<i class="fas fa-shopping-cart">
      </i>add to cart`;
  }
  getSingleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id);
  }
}
//5 local storage: dealing with local storage
// when i want single information about single productimage, price..)
// i'm just get retrieve and remove it from local storage
// why i keep my cart information in local storage, when i refresh
// still get my information
class Storage {
  // we can use a static method without instanciating the class,
  // in the ui class i will reuse them so that way i don't need
  // to create instance to access this particular method
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id === id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}
//6  here we're gonna to kick things off with the eventlistner
// once the content loaded
document.addEventListener("DOMContentLoaded", () => {
  // create two instances of UI and products
  const ui = new UI();
  const products = new Products();
  // setup app
  ui.setupAPP();
  // get all products
  // i'm going to write product which is my instance, and say
  // then once we have the products returning by getProducts then we
  // gonna run our method that is in ui class
  // we have .then we're getting back the products, then we writing
  // the displayProduct displaying the products and then we have
  // Storage(static) to save the products
  products
    .getProducts()
    .then(products => {
      ui.displayProducts(products);
      // we don't need to create an instance, i can use the class
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
