import Apilink from "../models/Apilink.js";

export const getApilinks = async (req, res) => {
  try {
    const apiLinks = await Apilink.find();
    res.status(200).json(apiLinks);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};
