const express = require("express");
const router = express.Router();

const { default: axios } = require("axios");
const config = require("../../config");
const jwt = require("jsonwebtoken");
const { getTokenInfo } = require("../../utils/authenticationUtil");
router.get("/", (req, res) => {
  console.log(config.publicDir);
  res.sendFile(config.publicDir + "/public/myCart.html");
});

router.get("/getProducts", (req, res) => {
  const token = req.headers["x-access-token"];
  const tokenInfo = getTokenInfo(token);
  if (!tokenInfo.tokenValid) {
    res.send(tokenInfo);
  } else {
    axios
      .get("http://localhost:8600/Cart")
      .then((response) => response.data)
      .then((data) => data.filter((user) => user.name == tokenInfo.user))
      .then((cart) => res.send({ items: cart[0].items }))
      .catch((err) => console.error(err));
    //res.send({ msg: "sending cart products" });
  }
});

module.exports = router;
