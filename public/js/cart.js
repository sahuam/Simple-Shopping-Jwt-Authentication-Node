
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
  let cartList = document.getElementById("cart-list");
  if (data.items.length == 0) {
    const Message = document.createElement("p");
    const SubMessage = document.createElement("p");
    const anchor = document.createElement("a");
    Message.textContent = "No products in your cart";
    SubMessage.textContent = "Click here to go to ";
    anchor.textContent = "home page";
    anchor.href = "/home";
    SubMessage.appendChild(anchor);
    cartList.appendChild(Message);
    cartList.appendChild(SubMessage);
  } else {
    data.items.forEach(async (item) => {
      const product = await fetch("http://localhost:8600/products/" + item.id)
        .then((response) => response.json())
        .then((data) => data);

      const cart_item_container = document.createElement("div");
      const cart_item_name = document.createElement("p");
      const cart_item_price = document.createElement("p");
      const cart_item_img = document.createElement("img");
      const cart_item_button = document.createElement("button");
      const cart_item_info = document.createElement("div");

      cart_item_container.setAttribute("id", "cart_id_" + product.id);
      cart_item_container.setAttribute("class", "cart-item");
      cart_item_img.setAttribute("class", "cart-item-img");
      cart_item_name.setAttribute("class", "cart-item-name");
      cart_item_price.setAttribute("class", "cart-item-price");
      cart_item_button.setAttribute("class", "btn cart-remove-button");
      cart_item_info.setAttribute("class", "cart-item-info");

      cart_item_img.src = product.img;
      cart_item_name.textContent = product.name;
      cart_item_price.textContent = "Price : $ "+product.price;
      cart_item_button.textContent = "remove";

      cart_item_info.appendChild(cart_item_name);
      cart_item_info.appendChild(cart_item_price);
      cart_item_info.appendChild(cart_item_button);

      cart_item_container.appendChild(cart_item_img);
      cart_item_container.appendChild(cart_item_info);
      cartList.appendChild(cart_item_container);
    });
  }
}
