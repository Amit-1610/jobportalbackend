const JobSeeker = require("../models/JobSeekerProfile");
const cloudinary = require("../utils/cloudinary");
const ApiError = require("../errors/ApiError");

// CREATE
exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, user: req.user._id, fullName: req.user.fullName, email: req.user.email, phone: req.user.phone };
    if (req.files) {
      if (req.files.profilePhoto)
        data.profilePhoto = (await cloudinary.uploader.upload(req.files.profilePhoto[0].path, { folder: "profiles" })).secure_url;
      if (req.files.aadhaar)
        data["idDocs"] = { aadhaar: (await cloudinary.uploader.upload(req.files.aadhaar[0].path, { folder: "profiles" })).secure_url };
      if (req.files.resume)
        data.resume = (await cloudinary.uploader.upload(req.files.resume[0].path, { folder: "profiles" })).secure_url;
    }
    const profile = await JobSeeker.create(data);
    req.app.get("io").emit("jobseeker:created", { id: profile._id });
    res.status(201).json({ success: true, profile });
  } catch (err) { next(err); }
};

// GET ALL
exports.getAll = async (req, res, next) => { try { res.json({ success: true, profiles: await JobSeeker.find() }); } catch (err) { next(err); } };

// GET BY ID
exports.getById = async (req, res, next) => {
  try {
    const profile = await JobSeeker.findById(req.params.id);
    if (!profile) return next(new ApiError(404, "Not found"));
    res.json({ success: true, profile });
  } catch (err) { next(err); }
};

// UPDATE
exports.update = async (req, res, next) => {
  try {
    const updates = req.body;
    if (req.files) {
      if (req.files.profilePhoto)
        updates.profilePhoto = (await cloudinary.uploader.upload(req.files.profilePhoto[0].path, { folder: "profiles" })).secure_url;
      if (req.files.aadhaar)
        updates["idDocs"] = { aadhaar: (await cloudinary.uploader.upload(req.files.aadhaar[0].path, { folder: "profiles" })).secure_url };
      if (req.files.resume)
        updates.resume = (await cloudinary.uploader.upload(req.files.resume[0].path, { folder: "profiles" })).secure_url;
    }
    const profile = await JobSeeker.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!profile) return next(new ApiError(404, "Not found"));
    req.app.get("io").emit("jobseeker:updated", { id: profile._id });
    res.json({ success: true, profile });
  } catch (err) { next(err); }
};

// DELETE
exports.remove = async (req, res, next) => {
  try {
    const profile = await JobSeeker.findByIdAndDelete(req.params.id);
    if (!profile) return next(new ApiError(404, "Not found"));
    req.app.get("io").emit("jobseeker:deleted", { id: profile._id });
    res.json({ success: true, message: "Deleted" });
  } catch (err) { next(err); }
};

// VERIFY
exports.verify = async (req, res, next) => {
  try {
    const profile = await JobSeeker.findById(req.params.id);
    if (!profile) return next(new ApiError(404, "Not found"));
    profile.isVerifiedByAdmin = true;
    await profile.save();
    req.app.get("io").emit("jobseeker:verified", { id: profile._id });
    res.json({ success: true, message: "Verified" });
  } catch (err) { next(err); }
};
