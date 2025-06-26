const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authController");
const { protect } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");

// Registration, OTP, login
router.post("/register", authCtrl.register);
router.post("/verify-otp", authCtrl.verifyOtp);
router.post("/login", authCtrl.login);

// List users (for admin/superadmin dashboard)
router.get("/users", protect, allowRoles("superadmin", "admin", "subadmin"), authCtrl.listUsers);

// Activate/deactivate/verify employer, jobseeker, college, agency
router.put("/activate/:id", protect, allowRoles("superadmin", "admin", "subadmin"), authCtrl.activateAccount);
router.put("/deactivate/:id", protect, allowRoles("superadmin", "admin", "subadmin"), authCtrl.deactivateAccount);
router.put("/verify/:id", protect, allowRoles("superadmin", "admin", "subadmin"), authCtrl.verifyAccount);

// Assign work
router.post("/assign-work", protect, allowRoles("superadmin", "admin"), authCtrl.assignWork);

module.exports = router;
