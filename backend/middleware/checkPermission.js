const Role = require("../models/Role.js");

module.exports = {
  checkPermission: async (req, res, next) => {
    try {
      // console.log("########## CheckPermission ################");
      // console.log(req.method,req.baseUrl, req.authResult.role )
      const { role } = req.authResult;
      const permission = await Role.find({
        role: role,
        "permission.method": req.method,
        "permission.path": req.baseUrl,
      }).count();

      // console.log("Role Count = ", permission);
      if (permission === 0) {
        return res.status(403).json({
          errors: [
            {
              title: "Unauthorized",
              detail: "Permission Unauthorized.",
              errorMessage: "You don't have Permission",
            },
          ],
        });
      }
      return next();
    } catch (err) {
      res.status(403).json({
        errors: [
          {
            title: "Unauthorized",
            detail: "Permission Unauthorized.",
            errorMessage: err.message,
          },
        ],
      });
    }
  },
};
