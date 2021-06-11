const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { default: axios } = require("axios");
const { getTokenInfo } = require("./utils/authenticationUtil");
const jwt = require("jsonwebtoken");

app.use(cors());

app.set("view engine", "html");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//root path
app.get("/", (req, res) => {
  res.sendFile("public/index.html");
});

//login page path
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
});

//login form  path
app.post("/login", async (req, res) => {
  try {
    const form = req.body;
    console.log(
      "client => username:" +
        form.loginUsername +
        ";password:" +
        form.loginPassword
    );
    const response = await axios.get("http://localhost:8600/users");
    const user = response.data.filter((user) => {
      if (user.name == form.loginUsername) {
        if (user.password == form.loginPassword) {
          return user;
        }
      }
    });
    console.log("db =>  user", user[0]);
    if (!user) {
      return res.json({
        token: null,
        user: null,
        auth: false,
        msg: "Invalid username and password",
      });
    } else {
      const token = jwt.sign(
        { user: user[0].name, role: user[0].role },
        "MY_SECRET_TOKEN",
        { expiresIn: 1800 }
      );
      return res.json({
        token: token,
        user: user[0].name,
        auth: true,
        msg: "Login successfull",
      });
    }
  } catch (e) {
    res.json({
      token: null,
      user: null,
      auth: false,
      msg: "Internal Server Error",
    });
  }
});

//register page path
app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
});

//regsiter form path
app.post("/register", (req, res) => {
  res.send(req.body);
});

//home page path
app.get("/home", (req, res) => {
  res.sendFile(__dirname + "/public/home.html");
});

//fetch product lists
app.get("/products", (req, res) => {
  axios
    .get("http://localhost:8600/products")
    .then((response) => response.data)
    .then((data) => res.json(data))
    .catch((err) => res.json([]));
});

//add a product to cart
app.post("/usercart/:id/:user", async (req, res) => {
  try {
    const prod_id = Number.parseInt(req.params.id);
    const username = req.params.user;
    console.log(prod_id, username);
    axios
      .get("http://localhost:8600/Cart")
      .then((resp) => resp.data)
      .then((data) => {
        const carts = data.filter((user) => user.name == username);
        console.log(carts);
        return JSON.stringify(carts);
      })
      .then((carts) => {
        const cart = JSON.parse(carts);
        if (cart.length == 0) {
          console.log("new cart");
          axios.post(`http://localhost:8600/Cart`, {
            name: username,
            items: [{ id: prod_id }],
          });
        } else {
          console.log("cart exists");
          axios
            .put(`http://localhost:8600/Cart/${cart[0].id}`, {
              id: cart[0].id,
              name: cart[0].name,
              items: [...JSON.parse(carts)[0].items, { id: prod_id }],
            })
            .then((resp) => resp.data)
            .catch((err) => {
              throw err;
            });
        }
      })
      .catch((err) => {
        throw err;
      });

    res.json({ msg: "trying to add!" });
  } catch (e) {
    res.json({ errorMsg: e.toString() });
  }
});

app.get("/validateToken", (req, res) => {
  console.log("validate token");
  const token = req.headers["x-access-token"];
  let tokenInfo = {};
  if (!token) {
    console.log("no token found.");
    tokenInfo = {
      tokenValid: false,
      user: "",
      role: "",
      msg: "token not found",
    };
  }
  tokenInfo = getTokenInfo(token);
  console.log(tokenInfo);
  res.status(200).send(tokenInfo);
});

MyCartController = require("./controllers/user/MyCart");

app.use("/myCart", MyCartController);

app.listen(4000, () => console.log("Server is up at 4000."));

module.exports = app;
