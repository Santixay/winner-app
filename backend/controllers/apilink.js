const Apilink = require("../models/Apilink.js");

module.exports = {
  getApilinks: async (req, res) => {
    try {
      const apiLinks = await Apilink.find();
      res.status(200).json(apiLinks);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
