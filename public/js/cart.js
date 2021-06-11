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
//Get Cart Items
async function getCartItems() {
  const url = "http://localhost:4000/myCart/getProducts";
  const data = await fetch(url, {
    headers: {
      "x-access-token": window.sessionStorage.getItem("token"),
    },
  })
    .then((response) => response.json())
    .then((data) => data);

  console.log(data);
  return data;
}

//display cart items in the page
async function addCartItemsToDisplay() {
  let data = await getCartItems();
  let items = JSON.stringify(data.items);
  let cartList = document.getElementById("cart-list");

  if (!items) {
    const p = document.createElement("p");
    p.textContent = "no products in cart";
    cartList.appendChild(p);
  } else {
    data.items.forEach(async (item) => {
      const product = await fetch("http://localhost:8600/products/" + item.id)
        .then((response) => response.json())
        .then((data) => data);

      const cart_prd_container = document.createElement("div");
      const cart_prd_name = document.createElement("p");
      const cart_prd_price = document.createElement("p");
      const cart_prd_img = document.createElement("img");
      const cart_prd_button = document.createElement("button");

      cart_prd_container.setAttribute("id", "cart_id_" + product.id);
      cart_prd_img.setAttribute("class", "cart-img");
      cart_prd_name.setAttribute("class", "cart-name");
      cart_prd_price.setAttribute("class", "cart-price");
      cart_prd_button.setAttribute("class", "btn cart-remove-button");

      cart_prd_img.src = product.img;
      cart_prd_name.textContent = product.name;
      cart_prd_price.textContent = product.price;
      cart_prd_button.textContent = "remove";

      cart_prd_container.appendChild(cart_prd_img);
      cart_prd_container.appendChild(cart_prd_name);
      cart_prd_container.appendChild(cart_prd_price);
      cart_prd_container.appendChild(cart_prd_button);
      cartList.appendChild(cart_prd_container);
    });
  }
}
