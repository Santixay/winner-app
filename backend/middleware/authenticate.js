const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const secret = process.env.SECRET;

module.exports = {
  authen: async (req, res, next) => {
    try {
      // console.log(req.headers);
      const token = req.headers.authorization.split(" ")[1];
      if (typeof token !== "string") {
        throw new Error("Request token is invalid.");
      }
      var authResult = jwt.verify(token, secret);
      req.authResult = authResult;
      // console.log('########## Authenticate #################')
      // console.log(req.authResult);
      next();
    } catch (err) {
      res.status(403).json({
        status: "error",
        message: err.message,
        errors: [
          {
            title: "Unauthorized",
            detail: "Authentication credentials invalid",
            errorMessage: err.message,
          },
        ],
      });
    }
  },
};
