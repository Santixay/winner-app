const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

import User from "../models/User.js";

dotenv.config();
const secret = process.env.SECRET;

export const login = async (req, res) => {
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
        res.status(204).json({ status: "error", message: "Login failed." });
      }
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
