const Employer = require("../models/EmployerProfile");
const cloudinary = require("../utils/cloudinary");
const ApiError = require("../errors/ApiError");

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, user: req.user._id, fullName: req.user.fullName, email: req.user.email, phone: req.user.phone };
    if (req.files) {
      if (req.files.logo)
        data.logo = (await cloudinary.uploader.upload(req.files.logo[0].path, { folder: "profiles" })).secure_url;
      if (req.files.panCard)
        data["idDocs"] = { panCard: (await cloudinary.uploader.upload(req.files.panCard[0].path, { folder: "profiles" })).secure_url };
      if (req.files.license)
        data.license = (await cloudinary.uploader.upload(req.files.license[0].path, { folder: "profiles" })).secure_url;
    }
    const profile = await Employer.create(data);
    req.app.get("io").emit("employer:created", { id: profile._id });
    res.status(201).json({ success: true, profile });
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => { try { res.json({ success: true, profiles: await Employer.find() }); } catch (err) { next(err); } };

exports.getById = async (req, res, next) => {
  try {
    const profile = await Employer.findById(req.params.id);
    if (!profile) return next(new ApiError(404, "Not found"));
    res.json({ success: true, profile });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updates = req.body;
    if (req.files) {
      if (req.files.logo)
        data.logo = (await cloudinary.uploader.upload(req.files.logo[0].path, { folder: "profiles" })).secure_url;
      if (req.files.panCard)
        data["idDocs"] = { panCard: (await cloudinary.uploader.upload(req.files.panCard[0].path, { folder: "profiles" })).secure_url };
      if (req.files.license)
        data.license = (await cloudinary.uploader.upload(req.files.license[0].path, { folder: "profiles" })).secure_url;
    }
    const profile = await Employer.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!profile) return next(new ApiError(404, "Not found"));
    req.app.get("io").emit("employer:updated", { id: profile._id });
    res.json({ success: true, profile });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const profile = await Employer.findByIdAndDelete(req.params.id);
    if (!profile) return next(new ApiError(404, "Not found"));
    req.app.get("io").emit("employer:deleted", { id: profile._id });
    res.json({ success: true, message: "Deleted" });
  } catch (err) { next(err); }
};

exports.verify = async (req, res, next) => {
  try {
    const profile = await Employer.findById(req.params.id);
    if (!profile) return next(new ApiError(404, "Not found"));
    profile.isVerifiedByAdmin = true;
    await profile.save();
    req.app.get("io").emit("employer:verified", { id: profile._id });
    res.json({ success: true, message: "Verified" });
  } catch (err) { next(err); }
};
