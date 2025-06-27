const Agency = require("../models/AgencyProfile");
const ApiError = require("../errors/ApiError");

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, user: req.user._id, fullName: req.user.fullName, email: req.user.email, phone: req.user.phone };
    const profile = await Agency.create(data);
    req.app.get("io").emit("agency:created", { id: profile._id });
    res.status(201).json({ success: true, profile });
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => { try { res.json({ success: true, profiles: await Agency.find() }); } catch (err) { next(err); } };

exports.getById = async (req, res, next) => {
  try {
    const profile = await Agency.findById(req.params.id);
    if (!profile) return next(new ApiError(404, "Not found"));
    res.json({ success: true, profile });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const profile = await Agency.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!profile) return next(new ApiError(404, "Not found"));
    req.app.get("io").emit("agency:updated", { id: profile._id });
    res.json({ success: true, profile });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const profile = await Agency.findByIdAndDelete(req.params.id);
    if (!profile) return next(new ApiError(404, "Not found"));
    req.app.get("io").emit("agency:deleted", { id: profile._id });
    res.json({ success: true, message: "Deleted" });
  } catch (err) { next(err); }
};

exports.verify = async (req, res, next) => {
  try {
    const profile = await Agency.findById(req.params.id);
    if (!profile) return next(new ApiError(404, "Not found"));
    profile.isVerifiedByAdmin = true;
    await profile.save();
    req.app.get("io").emit("agency:verified", { id: profile._id });
    res.json({ success: true, message: "Verified" });
  } catch (err) { next(err); }
};
