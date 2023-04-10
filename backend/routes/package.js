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
  getPackagesByCustomerId,
  getPackagesSumByStatus,
} = require("../controllers/package.js");

const router = express.Router();

router.get("/customer",  getPackagesByCustomerId);
router.get("/list",  getPackages);
router.get("/id/:id",  getPackageDetailById);
router.post("/store",  storePackage);
router.patch("/patch",  patchPackage);
router.delete("/delete/:id",  deletePackage);
router.get("/tracking", getPackageDetailByTracking);
router.get("/list-by-station-and-date",  getPackageListByStationAndDate);
router.get("/sumpackages",  getSumPackagesForWhatsApp);
router.get("/sumpackages-delivered",  getSumPackagesForDelivered);
router.get('/sum-by-status', getPackagesSumByStatus)

module.exports = router;
