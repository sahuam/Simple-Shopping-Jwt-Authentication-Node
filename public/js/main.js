const hostname = "http://localhost:4000/";

function setLocalStorage(token, auth, user) {
  window.sessionStorage.setItem("token", token);
  window.sessionStorage.setItem("auth", auth);
  window.sessionStorage.setItem("user", user);
}

function logOut() {
  window.sessionStorage.clear();
  window.location = "http://localhost:4000/";
}

async function isTokenValid() {
  let tokenValid = await fetch("http://localhost:4000/validateToken", {
    method: "POST",
    headers: {
      "x-access-token": window.sessionStorage.getItem("token"),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    });
  console.log(tokenValid);
  //it will send {tokenValid:true/false, user: String, role: String, | msg: String (only if error occurs)}
  return tokenValid;
}

async function headerNavItem() {
  const headerNav = document.getElementById("header-navbar");
  const tokenData = await isTokenValid();
  console.log(tokenData);
  if (!tokenData.tokenValid) {
    const loginAnchor = document.createElement("button");
    loginAnchor.textContent = "Login";
    loginAnchor.onclick = () =>
      (window.location = "http://localhost:4000/login");
    loginAnchor.setAttribute("class", "btn btn-login");
    const registerAnchor = document.createElement("button");
    registerAnchor.textContent = "register";
    registerAnchor.onclick = () =>
      (window.location = "http://localhost:4000/register");
    registerAnchor.setAttribute("class", "btn btn-register");

    headerNav.appendChild(loginAnchor);
    headerNav.appendChild(registerAnchor);
  } else {
    console.log("header for login user");

    addNavsByRole(headerNav, tokenData.role);
    const logOutBtn = document.createElement("button");
    logOutBtn.textContent = "Log Out";
    logOutBtn.onclick = () => logOut();
    logOutBtn.setAttribute("class", "btn btn-logout");

    const displayUserName = document.createElement("a");
    displayUserName.setAttribute(
      "class",
      "header-navbar-links header-navbar-username"
    );
    displayUserName.textContent = window.sessionStorage.getItem("user");

    headerNav.appendChild(displayUserName);
    headerNav.appendChild(logOutBtn);
  }
}

//Add headers according to user role
// USER => read all PRODUCTS, r/w own CART and place and cancel an ORDER
// ADMIN => r/w any ORDER, r/w any PRODUCT, r/w any USER
function addNavsByRole(headerNav, role) {
  const USER_NAV_LIST = [
    ["my orders", "order.html"],
    ["my cart", "myCart.html"],
  ];
  const ADMIN_NAV_LIST = [
    ["user lists", "userList.html"],
    ["order lists", "orderList.html"],
    ["product lists", "productList.html"],
  ];
  USER_NAV_LIST.forEach((link) => {
    let navlink = document.createElement("a");
    navlink.setAttribute("class", "header-navbar-links");
    navlink.text = link[0];
    navlink.href = "./" + link[1];
    headerNav.appendChild(navlink);
  });
  if (role == "ADMIN") {
    ADMIN_NAV_LIST.forEach((link) => {
      let navlink = document.createElement("a");
      navlink.setAttribute("class", "header-navbar-links");
      navlink.text = link[0];
      navlink.href = "./admin/" + link[1];
      headerNav.appendChild(navlink);
    });
  }
}

//change frames according to navbar
function changeFrame(page) {
  var iframe = document.getElementById("iframe-main");
  iframe.setAttribute("src", "./" + page);
}

//fetching products
function getAllProducts() {
  const url = "http://localhost:4000";
  fetch(url + "/products", {
    method: "GET",
  })
    .then((res) => res.json())
    .then((data) => createProductElements(data))
    .catch((err) => console.err(err));
}

//create product elements in product list page
function createProductElements(products) {
  let productElement = document.getElementById("product-lists");

  if (products.length == 0) {
    const noProducts = document.createElement("p");
    noProducts.textContent = "No Products Available.";
    productElement.appendChild(noProducts);
  } else {
    products.forEach((product_data) => {
      const product = document.createElement("div");
      const product_name = document.createElement("p");
      const product_img = document.createElement("img");
      const product_price = document.createElement("p");
      const product_button = document.createElement("button");

      product.setAttribute("id", "product-item-" + product_data.id);
      product.setAttribute("class", "product-item");
      product_name.setAttribute("class", "product-item-name");
      product_img.setAttribute("class", "product-item-img");
      product_price.setAttribute("class", "product-item-price");
      product_button.setAttribute("id", "product-btn-" + product_data.id);
      product_button.setAttribute("class", "btn product-btn");

      product_name.textContent = product_data.name;
      product_img.src = product_data.img;
      product_price.textContent = product_data.price;
      product_button.textContent = "Add To Cart";
      product_button.onclick = () => addToCart(product_data.id);

      product.appendChild(product_img);
      product.appendChild(product_name);
      product.appendChild(product_price);
      product.appendChild(product_button);
      productElement.appendChild(product);
    });
  }
}

//add to cart
function addToCart(product_id) {
  const url = "http://localhost:4000";
  var auth = window.sessionStorage.getItem("auth") == "true" ? true : false;
  if (!auth) {
  } else {
    fetch(
      url +
        "/usercart/" +
        product_id +
        "/" +
        window.sessionStorage.getItem("user"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": window.sessionStorage.getItem("token"),
        },
      }
    )
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((er) => console.error(er));
  }
}
