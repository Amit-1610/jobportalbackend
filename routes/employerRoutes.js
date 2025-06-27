const router = require("express").Router();
const employerCtrl = require("../controllers/employerController");
const multer = require("../utils/multer");
const { protect } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");

router.post("/", protect, multer.single("file"), employerCtrl.create);
router.get("/all", employerCtrl.getAll);
router.get("/single/:id", employerCtrl.getById);
router.put("/update/:id", protect, multer.single("file"), employerCtrl.update);
router.delete("/delete/:id", protect, employerCtrl.remove);
router.put("/:id/verify", protect, allowRoles("admin", "superadmin", "subadmin"), employerCtrl.verify);

module.exports = router;
