const Station = require("../models/Station.js");

module.exports = {
  getStationList: async (req, res) => {
    try {
      const stations = await Station.find({
        id: { $nin: ["STD", "END"] },
      });
      res.status(200).json(stations);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
  getFinalStationList: async (req, res) => {
    try {
      const stations = await Station.aggregate([
        {
          $match: { finalStation: true },
        },
      ]);
      res.status(200).json(stations);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  getSationDetailByStationId: async (req, res) => {
    try {
      const { id } = req.query;
      const stationDetail = await Station.findOne({ id: id });
      if (stationDetail === null) {
        res.status(204).json({ message: "station not found" });
      } else {
        res.status(200).json(stationDetail);
      }
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
};
