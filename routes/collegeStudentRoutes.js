const router = require("express").Router();
const ctrl = require("../controllers/collegeStudentController");
const multer = require("../utils/multer"); // Use same config as for CollegeProfile
const { protect } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");

// Add Student
router.post("/", protect, multer.single("resume"), ctrl.create);

// Get all students (Admin/subadmin/superadmin: all, College: only own students)
router.get("/all", protect, allowRoles("admin", "superadmin", "subadmin", "college"), ctrl.getAll);

// Get one student
router.get("/single/:id", protect, allowRoles("admin", "superadmin", "subadmin", "college"), ctrl.getById);

// Update student
router.put("/update/:id", protect, multer.single("resume"), ctrl.update);

// Delete student
router.delete("/delete/:id", protect, ctrl.remove);

// Change selection status (only admin, superadmin, subadmin)
router.put("/:id/status", protect, allowRoles("admin", "superadmin", "subadmin"), ctrl.changeStatus);

module.exports = router;
