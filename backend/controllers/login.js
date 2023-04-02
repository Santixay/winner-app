const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User.js");

const secret = process.env.SECRET;

module.exports = {
  login: async (req, res) => {
    let { password, email } = req.body;
    let user = await User.findOne({ email, validflag: true });
    if (user !== null) {
      bcrypt.compare(password, user.password, function (err, isLogin) {
        if (isLogin) {
          let defaultStation = {};
          user.stations.map((item) => {
            if (item.default) {
              defaultStation = item;
            }
          });
          // clear password before return to client
          user.password = "";
          var token = jwt.sign(
            { userId: user._id, email: email, role: user.role },
            secret,
            { expiresIn: "12h" }
          );
          res.status(200).json({
            status: "ok",
            message: "Login success.",
            token,
            user,
            defaultStation,
          });
        } else {
          res.status(401).json({ status: "error", message: "Email or password is invalid!" });
        }
      });
    } else {
      res.status(401).json({status: "error", message: "Email or password is invalid!" });
    }
  },
};
