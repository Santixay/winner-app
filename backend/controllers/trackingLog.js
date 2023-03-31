const TrackingLog = require("../models/TrackingLog.js");

module.exports = {
  storeTrackingLog: async (req, res) => {
    try {
      TrackingLog.create(req.body, (error, trackingLog) => {
        if (error) {
          res.status(400).json({ message: error.message });
          return;
        }
        res.status(200).json({
          status: 200,
          trackingLog,
          message: "Tracking number logged successfully.",
        });
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  getTrackingLog: async (req, res) => {
    try {
      // sort should look like this: { "field": "userId", "sort": "desc"}
      const { page = 0, pageSize = 50, sort = null, search = "" } = req.query;

      // formatted sort should look like { userId: -1 }
      const generateSort = () => {
        const sortParsed = JSON.parse(sort);
        const sortFormatted = {
          [sortParsed.field]: sortParsed.sort === "asc" ? 1 : -1,
        };

        return sortFormatted;
      };
      const sortFormatted = Boolean(sort) ? generateSort() : {};

      const response = await TrackingLog.find({
        $or: [
          { tracking: { $regex: new RegExp(search, "i") } },
          { station: { $regex: new RegExp(search, "i") } },
          { actionByUser: { $regex: new RegExp(search, "i") } },
        ],
      })
        .sort(sortFormatted)
        .skip(page * pageSize)
        .limit(pageSize);
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },

  getTrackingLogByTrackingNumber: async (req, res) => {
    const { tracking } = req.query;
    if (tracking) {
      const trackingLog = await TrackingLog.find({
        $and: [
          { tracking: tracking },
          // filter only validflag === true
          { validflag: true },
        ],
      }).sort({ createdAt: -1 });
      if (trackingLog.length > 0) {
        res.status(200).json(trackingLog);
      } else {
        res.status(204).json({ message: "data not found" });
      }
    } else {
      res.status(404).json({ message: " 'tracking' is required!" });
    }
  },
};
