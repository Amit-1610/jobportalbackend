const router = require("express").Router();
const jobSeekerCtrl = require("../controllers/jobSeekerController");
const multer = require("../utils/multer");
const { protect } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");

// CREATE profile
router.post("/", protect, multer.single("file"), jobSeekerCtrl.create);

// READ all profiles
router.get("/all", jobSeekerCtrl.getAll);

// READ one profile
router.get("/single/:id", jobSeekerCtrl.getById);

// UPDATE profile
router.put("/update/:id", protect, multer.single("file"), jobSeekerCtrl.update);

// DELETE profile
router.delete("/delete/:id", protect, jobSeekerCtrl.remove);

// VERIFY profile (only admin roles)
router.put("/:id/verify", protect, allowRoles("admin", "superadmin", "subadmin"), jobSeekerCtrl.verify);

module.exports = router;
