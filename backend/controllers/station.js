import Station from "../models/Station.js";

export const getStationList = async (req, res) => {
  try {
    const stations = await Station.find({
      id: { $nin: ["STD", "END"] },
    });
    res.status(200).json(stations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getFinalStationList = async (req, res) => {
  try {
    const stations = await Station.aggregate([{
      $match: { finalStation: true },
    }]);
    res.status(200).json(stations);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getSationDetailByStationId = async (req, res) => {
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
};
