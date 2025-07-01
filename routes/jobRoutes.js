const express = require("express");
const router = express.Router();
const jobCtrl = require("../controllers/jobController");
const multer = require("../utils/multer");
const { protect } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");

// Create job (employer)
router.post("/create", protect, allowRoles("employer"), jobCtrl.create);

// List jobs (all)
router.get("/all", jobCtrl.list);

// Get single job
router.get("/single/:id", jobCtrl.getById);

// Apply to job (jobseeker)
router.post("/apply", protect, allowRoles("jobseeker"), multer.single("file"), jobCtrl.apply);

// List applications for a job (employer + admins)
router.get(
  "/:id/applications",
  protect,
  allowRoles("employer", "admin", "superadmin", "subadmin"),
  jobCtrl.listApplicationsForJob
);

// List all applications (admin dashboard)
router.get(
  "/applications/all",
  protect,
  allowRoles("admin", "superadmin", "subadmin"),
  jobCtrl.listAllApplications
);

// Update application status (employer + admins)
router.put(
  "/applications/:id/status",
  protect,
  allowRoles("employer", "admin", "superadmin", "subadmin"),
  jobCtrl.updateApplicationStatus
);

// Deactivate job (employer + admins)
router.put(
  "/deactivate/:id",
  protect,
  allowRoles("employer", "admin", "superadmin", "subadmin"),
  jobCtrl.deactivateJob
);

// Activate job (employer + admins)
router.put(
  "/activate/:id",
  protect,
  allowRoles("employer", "admin", "superadmin", "subadmin"),
  jobCtrl.activateJob
);

module.exports = router;
