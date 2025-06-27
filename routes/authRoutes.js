const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/authController");
const { protect } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");

// Registration, OTP, login
router.post("/register", authCtrl.register);
router.post("/verify-otp", authCtrl.verifyOtp);
router.post("/login", authCtrl.login);
router.post("/log-out", protect, authCtrl.logout);

router.get("/single/:id", protect, authCtrl.getUserById);
router.get("/all", protect, authCtrl.getUsers);

// List users (for admin/superadmin dashboard)
router.get(
  "/users",
  protect,
  allowRoles("superadmin", "admin", "subadmin"),
  authCtrl.listUsers
);

// Activate/deactivate/verify employer, jobseeker, college, agency
router.put(
  "/activate/:id",
  protect,
  allowRoles("superadmin", "admin", "subadmin"),
  authCtrl.activateAccount
);
router.put(
  "/deactivate/:id",
  protect,
  allowRoles("superadmin", "admin", "subadmin"),
  authCtrl.deactivateAccount
);
router.put(
  "/verify/:id",
  protect,
  allowRoles("superadmin", "admin", "subadmin"),
  authCtrl.verifyAccount
);

// Assign work
router.post(
  "/assign-work",
  protect,
  allowRoles("superadmin", "admin"),
  authCtrl.assignWork
);

// Update user info routes
router.put("/update-password", protect, authCtrl.updatePassword);
router.put("/update-fullname", protect, authCtrl.updateFullName);
router.put("/update-phone", protect, authCtrl.updatePhone);

module.exports = router;
