const router = require("express").Router();
const collegeCtrl = require("../controllers/collegeController");
const multer = require("../utils/multer");
const { protect } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");

router.post("/", protect, multer.single("file"), collegeCtrl.create);
router.get("/all", collegeCtrl.getAll);
router.get("/single/:id", collegeCtrl.getById);
router.put("/update/:id", protect, multer.single("file"), collegeCtrl.update);
router.delete("/delete/:id", protect, collegeCtrl.remove);
router.put("/:id/verify", protect, allowRoles("admin", "superadmin", "subadmin"), collegeCtrl.verify);

module.exports = router;
