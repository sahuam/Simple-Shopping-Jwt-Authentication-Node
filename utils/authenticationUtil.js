const jwt = require("jsonwebtoken");
const getTokenInfo = (token) => {
  console.log("get Token Info");
  const tokenData = jwt.verify(token, "MY_SECRET_TOKEN", (err, decoded) => {
    console.log("gettokeninfo()", decoded);
    if (err) {
      return {
        tokenValid: false,
        user: "",
        role: "",
        msg: err,
      };
    } else {
      return {
        tokenValid: true,
        user: decoded.user,
        role: decoded.role,
      };
    }
  });
  console.log("verified data : ", tokenData);
  return tokenData;
};
module.exports = { getTokenInfo };
