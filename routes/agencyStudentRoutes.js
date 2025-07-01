const router = require("express").Router();
const ctrl = require("../controllers/agencyStudentController");
const multer = require("../utils/multer"); // Multer config for multiple fields
const { protect } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");

// Accept multiple files in a single form submission
router.post(
  "/",
  protect,
  multer.fields([
    { name: "resume", maxCount: 1 },
    { name: "photo", maxCount: 1 },
    { name: "aadhaarScan", maxCount: 1 },
    { name: "qualificationCertificate", maxCount: 1 },
    { name: "skillCertificate", maxCount: 1 }
  ]),
  ctrl.create
);

router.get("/all", protect, allowRoles("admin", "superadmin", "subadmin", "agency"), ctrl.getAll);
router.get("/single/:id", protect, allowRoles("admin", "superadmin", "subadmin", "agency"), ctrl.getById);

router.put(
  "/update/:id",
  protect,
  multer.fields([
    { name: "resume", maxCount: 1 },
    { name: "photo", maxCount: 1 },
    { name: "aadhaarScan", maxCount: 1 },
    { name: "qualificationCertificate", maxCount: 1 },
    { name: "skillCertificate", maxCount: 1 }
  ]),
  ctrl.update
);

router.delete("/delete/:id", protect, ctrl.remove);

// Change selection status (admin, superadmin, subadmin)
router.put("/:id/status", protect, allowRoles("admin", "superadmin", "subadmin"), ctrl.changeStatus);

module.exports = router;
