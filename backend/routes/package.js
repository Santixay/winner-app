const express = require("express");

const {
  getPackages,
  getPackageDetailById,
  storePackage,
  deletePackage,
  patchPackage,
  getPackageDetailByTracking,
  getPackageListByStationAndDate,
  getSumPackagesForWhatsApp,
  getSumPackagesForDelivered,
} = require("../controllers/package.js");
const { authen }  = require("../middleware/authenticate.js");

const router = express.Router();

router.get("/list", authen, getPackages);
router.get("/id/:id", authen, getPackageDetailById);
router.post("/store", authen, storePackage);
router.patch("/patch", authen, patchPackage);
router.delete("/delete/:id", authen, deletePackage);
router.get("/tracking", getPackageDetailByTracking);
router.get("/list-by-station-and-date", authen, getPackageListByStationAndDate);
router.get("/sumpackages", authen, getSumPackagesForWhatsApp);
router.get("/sumpackages-delivered", authen, getSumPackagesForDelivered);

module.exports = router;
