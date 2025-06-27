const router = require("express").Router();
const agencyCtrl = require("../controllers/agencyController");
const multer = require("../utils/multer");
const { protect } = require("../middlewares/auth");
const { allowRoles } = require("../middlewares/roles");

// NOTE: Agency profile doesn’t include file upload currently
router.post("/", protect, agencyCtrl.create);
router.get("/all", agencyCtrl.getAll);
router.get("/single/:id", agencyCtrl.getById);
router.put("/update/:id", protect, agencyCtrl.update);
router.delete("/delete/:id", protect, agencyCtrl.remove);
router.put("/:id/verify", protect, allowRoles("admin", "superadmin", "subadmin"), agencyCtrl.verify);

module.exports = router;
