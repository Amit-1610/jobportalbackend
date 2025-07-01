const Student = require("../models/CollegeStudentProfile");
const College = require("../models/CollegeProfile");
const cloudinary = require("../utils/cloudinary");
const ApiError = require("../errors/ApiError");

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, createdBy: req.user._id, college: req.user.collegeProfileId || req.body.college };
    if (req.file) data.resume = (await cloudinary.uploader.upload(req.file.path, { folder: "student-resumes" })).secure_url;
    if (req.body.photoFile) data.photo = (await cloudinary.uploader.upload(req.body.photoFile, { folder: "student-photos" })).secure_url;
    const profile = await Student.create(data);
    req.app.get("io").emit("student:created", { id: profile._id });
    res.status(201).json({ success: true, profile });
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.registerAs === "college") filter.college = req.user.collegeProfileId;
    res.json({ success: true, profiles: await Student.find(filter).populate("college") });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const profile = await Student.findById(req.params.id).populate("college");
    if (!profile) return next(new ApiError(404, "Not found"));
    res.json({ success: true, profile });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updates = req.body;
    if (req.file) updates.resume = (await cloudinary.uploader.upload(req.file.path, { folder: "student-resumes" })).secure_url;
    if (req.body.photoFile) updates.photo = (await cloudinary.uploader.upload(req.body.photoFile, { folder: "student-photos" })).secure_url;
    const profile = await Student.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!profile) return next(new ApiError(404, "Not found"));
    req.app.get("io").emit("student:updated", { id: profile._id });
    res.json({ success: true, profile });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const profile = await Student.findByIdAndDelete(req.params.id);
    if (!profile) return next(new ApiError(404, "Not found"));
    req.app.get("io").emit("student:deleted", { id: profile._id });
    res.json({ success: true, message: "Deleted" });
  } catch (err) { next(err); }
};

exports.changeStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ['selected', 'not selected', 'pending', 'other'];
    if (!allowedStatuses.includes(status)) return next(new ApiError(400, "Invalid status"));
    const profile = await Student.findByIdAndUpdate(req.params.id, { selectionStatus: status }, { new: true });
    if (!profile) return next(new ApiError(404, "Not found"));
    req.app.get("io").emit("student:statusChanged", { id: profile._id, status });
    res.json({ success: true, profile });
  } catch (err) { next(err); }
};
