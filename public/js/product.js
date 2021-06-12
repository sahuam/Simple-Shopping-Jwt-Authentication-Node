
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
    window.location.href="/login"
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