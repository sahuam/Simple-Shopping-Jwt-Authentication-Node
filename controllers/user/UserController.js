const express = require("express");
const router = express.Router();

const { default: axios } = require("axios");
const config = require("../../config");
const jwt = require("jsonwebtoken");


router.post("/login", (req, res) => {
  var { name, password } = req.body;
  axios
    .get(config.db.url + "/users")
    .then((res) => res.data)
    .then((data) => {
      data.forEach((user) => {
        if (user.name === name) {
          if (user.password === password) {
            const token = jwt.sign({ name: name }, config.jwt.secret, {
              expiresIn: 1800,
            });
            console.log("logged in successs");
            res.cookie("token", token);
            res.cookie("name", name);
            res.cookie("auth", true);
            res.redirect("/");
          } else {
            console.log("invalid password");
            res.cookie("token", "");
            res.cookie("name", "");
            res.cookie("auth", false);
            res.status(401).redirect("/");
          }
        }
      });
    })
    .catch((err) => res.status(500).redirect("/"));
});

module.exports = router;