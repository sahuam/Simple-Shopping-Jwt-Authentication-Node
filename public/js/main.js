const hostname = "http://localhost:4000/";

function setLocalStorage(token, auth, user) {
  if (auth) {
    window.sessionStorage.setItem("token", token);
    window.sessionStorage.setItem("auth", auth);
    window.sessionStorage.setItem("user", user);
  } else {
    window.sessionStorage.setItem("token", "");
    window.sessionStorage.setItem("auth", false);
    window.sessionStorage.setItem("user", "");
  }
}

function logOut() {
  window.sessionStorage.clear();
  window.location = "http://localhost:4000/";
}

async function tokenInfo() {
  console.log("tokenInfo()");
  let token_info = await fetch("http://localhost:4000/validateToken", {
    method: "GET",
    headers: {
      "x-access-token": window.sessionStorage.getItem("token"),
    },
  })
    .then((resp) => resp.json())
    .then((data) => data);

  console.log("tokenInfo() - info : ", token_info);
  //it will send {tokenValid:true/false, user: String, role: String, | msg: String (only if error occurs)}
  return token_info;
}

//Header Related Functions

async function headerNavItem() {
  const headerNav = document.getElementById("header-navbar");
  const isTokenValid =
    window.sessionStorage.getItem("auth") == "true" ? true : false;
  console.log("headerNav() - isTokenValid :", isTokenValid);
  if (!isTokenValid) {
    console.log("headerNav() - Login|Register");
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
    console.log("headerNav() - Nav Links");
    let token_info = await tokenInfo();
    console.log("headerNav() - Nav Links - token info :", token_info);
    addNavsByRole(headerNav, token_info.role);
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
  console.log("adding nav links by role", role);
  const USER_NAV_LIST = [
    ["my orders", "myOrder"],
    ["my cart", "myCart"],
  ];
  const ADMIN_NAV_LIST = [
    ["user lists", "userList"],
    ["order lists", "orderList"],
    ["product lists", "productList"],
  ];
  USER_NAV_LIST.forEach((link) => {
    let navlink = document.createElement("a");
    navlink.setAttribute("class", "header-navbar-links");
    navlink.text = link[0];
    navlink.href = link[1];
    headerNav.appendChild(navlink);
  });
  if (role == "ADMIN") {
    ADMIN_NAV_LIST.forEach((link) => {
      let navlink = document.createElement("a");
      navlink.setAttribute("class", "header-navbar-links");
      navlink.text = link[0];
      navlink.href = link[1];
      headerNav.appendChild(navlink);
    });
  }
}

//change frames according to navbar
function changeFrame(page) {
  var iframe = document.getElementById("iframe-main");
  iframe.setAttribute("src", "./" + page);
}

