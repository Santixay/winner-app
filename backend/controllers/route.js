import Route from "../models/Route.js";

export const getRouteDetail = async (req, res) => {
  try {
    const { id } = req.query;
    const route = await Route.findOne({ id: id });
    if (route) {
      res.status(200).json(route);
    } else {
      res.status(204).json({ message: "data not found" });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getRouteList = async (req, res) => {
  try {
    const route = await Route.find();
    if (route.length === 0) {
      res.status(204).json({ message: "data not found" });
    } else {
      res.status(200).json(route);
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
