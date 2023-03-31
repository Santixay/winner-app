const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../models/User.js");

const saltRounds = 10;

module.exports = {
  getUsers: async (req, res) => {
    try {
      const { search } = req.query;
      const users = await User.find({
        $or: [
          { name: { $regex: new RegExp(search, "i") } },
          { email: { $regex: new RegExp(search, "i") } },
        ],
      }).select(["-password"]);
      res.status(200).json(users);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  getUserId: async (req, res) => {
    try {
      const { id } = req.params;
      const users = await User.findById(id).select(["-password"]);
      res.status(200).json({ users: users });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  storeUser: async (req, res) => {
    try {
      // console.log("store user")
      let {
        name,
        email,
        password,
        whatsapp,
        role = "user",
        stations,
        remark = "",
      } = req.body;

      bcrypt.hash(password, saltRounds, function (err, hash) {
        // Store hash in your password DB.
        User.create(
          {
            name,
            email,
            whatsapp,
            role,
            password: hash,
            stations,
            remark,
            validflag: true,
          },
          (error) => {
            if (error) {
              res.status(400).json({ message: error.message });
              return;
            }
            res
              .status(200)
              .json({ status: 200, message: "User has been created." });
          }
        );
      });
      return;
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      User.deleteOne({ _id: id }, (error, user) => {
        if (error) {
          res.status(400).json({ message: error.message });
          return;
        }
        res.status(200).json({ user, message: "User has been deleted." });
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  patchUser: async (req, res) => {
    try {
      const { password, validflag } = req.body;
      console.log(validflag);
      if (password) {
        const hashPassword = await bcrypt.hash(password, saltRounds);
        User.updateOne(
          { _id: req.body._id },
          {
            $set: {
              password: hashPassword,
            },
          },
          (error, user) => {
            if (error) {
              res.status(400).json({ message: error.message });
              return;
            }
            res
              .status(200)
              .json({ status: 200, user, message: "User has been updated." });
          }
        );
      } else {
        User.updateOne(
          { _id: req.body._id },
          {
            $set: {
              name: req.body.name,
              email: req.body.email,
              whatsapp: req.body.whatsapp,
              password: req.body.password,
              role: req.body.role,
              stations: req.body.stations,
              status: req.body.status,
              remark: req.body.remark,
              validflag: validflag,
            },
          },
          (error, user) => {
            if (error) {
              res.status(400).json({ message: error.message });
              return;
            }
            res
              .status(200)
              .json({ status: 200, user, message: "User has been updated." });
          }
        );
      }
    } catch (error) {
      res.status(404).json({ message: "No user found", error });
    }
  },
};
