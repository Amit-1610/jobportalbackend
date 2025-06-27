const College = require("../models/CollegeProfile");
const cloudinary = require("../utils/cloudinary");
const ApiError = require("../errors/ApiError");

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, user: req.user._id, fullName: req.user.fullName, email: req.user.email, phone: req.user.phone };
    if (req.file) data.logo = (await cloudinary.uploader.upload(req.file.path, { folder: "profiles" })).secure_url;
    const profile = await College.create(data);
    req.app.get("io").emit("college:created", { id: profile._id });
    res.status(201).json({ success: true, profile });
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => { try { res.json({ success: true, profiles: await College.find() }); } catch (err) { next(err); } };

exports.getById = async (req, res, next) => {
  try {
    const profile = await College.findById(req.params.id);
    if (!profile) return next(new ApiError(404, "Not found"));
    res.json({ success: true, profile });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updates = req.body;
    if (req.file) updates.logo = (await cloudinary.uploader.upload(req.file.path, { folder: "profiles" })).secure_url;
    const profile = await College.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!profile) return next(new ApiError(404, "Not found"));
    req.app.get("io").emit("college:updated", { id: profile._id });
    res.json({ success: true, profile });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const profile = await College.findByIdAndDelete(req.params.id);
    if (!profile) return next(new ApiError(404, "Not found"));
    req.app.get("io").emit("college:deleted", { id: profile._id });
    res.json({ success: true, message: "Deleted" });
  } catch (err) { next(err); }
};

exports.verify = async (req, res, next) => {
  try {
    const profile = await College.findById(req.params.id);
    if (!profile) return next(new ApiError(404, "Not found"));
    profile.isVerifiedByAdmin = true;
    await profile.save();
    req.app.get("io").emit("college:verified", { id: profile._id });
    res.json({ success: true, message: "Verified" });
  } catch (err) { next(err); }
};
