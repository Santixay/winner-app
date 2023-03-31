const Province = require("../models/location/Province.js");
const District = require("../models/location/District.js");
const Village = require("../models/location/Village.js");

module.exports = {
  getProvinces: async (req, res) => {
    try {
      const provinces = await Province.find();
      res.status(200).json(provinces);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  getRouteByProvinceID: async (req, res) => {
    try {
      const { id } = req.query;
      const province = await Province.findOne({ pr_id: id });
      if (province) {
        res.status(200).json(province.default_route);
      } else {
        res.status(204).json({ message: "data not found" });
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  getDistrics: async (req, res) => {
    try {
      const { pr_id } = req.query;
      console.log(pr_id);
      const districts = await District.find({ pr_id: pr_id }).exec();
      res.status(200).json(districts);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  getVillages: async (req, res) => {
    try {
      const { dt_id } = req.query;

      const villages = await Village.find({ dt_id: dt_id });
      res.status(200).json(villages);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
};
