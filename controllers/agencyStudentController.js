const Student = require("../models/AgencyStudentProfile");
const cloudinary = require("../utils/cloudinary");
const ApiError = require("../errors/ApiError");

// Utility for file upload (generalized)
async function handleUpload(file, folder) {
  return file ? (await cloudinary.uploader.upload(file.path, { folder })).secure_url : undefined;
}

exports.create = async (req, res, next) => {
  try {
    const data = { ...req.body, createdBy: req.user._id, agency: req.user.agencyProfileId || req.body.agency };

    // File uploads (for resume, photo, aadhaarScan, certificates, etc.)
    if (req.files && req.files.resume) data.resume = await handleUpload(req.files.resume[0], "agency-student-resumes");
    if (req.files && req.files.photo) data.photo = await handleUpload(req.files.photo[0], "agency-student-photos");
    if (req.files && req.files.aadhaarScan) data.aadhaarScan = await handleUpload(req.files.aadhaarScan[0], "agency-student-docs");
    if (req.files && req.files.qualificationCertificate) data.qualificationCertificate = await handleUpload(req.files.qualificationCertificate[0], "agency-student-docs");
    if (req.files && req.files.skillCertificate) data.skillCertificate = await handleUpload(req.files.skillCertificate[0], "agency-student-docs");

    const profile = await Student.create(data);
    req.app.get("io").emit("agencyStudent:created", { id: profile._id });
    res.status(201).json({ success: true, profile });
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const filter = {};
    if (req.user.registerAs === "agency") filter.agency = req.user.agencyProfileId;
    res.json({ success: true, profiles: await Student.find(filter).populate("agency") });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const profile = await Student.findById(req.params.id).populate("agency");
    if (!profile) return next(new ApiError(404, "Not found"));
    res.json({ success: true, profile });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const updates = req.body;

    // File uploads (same logic as create)
    if (req.files && req.files.resume) updates.resume = await handleUpload(req.files.resume[0], "agency-student-resumes");
    if (req.files && req.files.photo) updates.photo = await handleUpload(req.files.photo[0], "agency-student-photos");
    if (req.files && req.files.aadhaarScan) updates.aadhaarScan = await handleUpload(req.files.aadhaarScan[0], "agency-student-docs");
    if (req.files && req.files.qualificationCertificate) updates.qualificationCertificate = await handleUpload(req.files.qualificationCertificate[0], "agency-student-docs");
    if (req.files && req.files.skillCertificate) updates.skillCertificate = await handleUpload(req.files.skillCertificate[0], "agency-student-docs");

    const profile = await Student.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!profile) return next(new ApiError(404, "Not found"));
    req.app.get("io").emit("agencyStudent:updated", { id: profile._id });
    res.json({ success: true, profile });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const profile = await Student.findByIdAndDelete(req.params.id);
    if (!profile) return next(new ApiError(404, "Not found"));
    req.app.get("io").emit("agencyStudent:deleted", { id: profile._id });
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
    req.app.get("io").emit("agencyStudent:statusChanged", { id: profile._id, status });
    res.json({ success: true, profile });
  } catch (err) { next(err); }
};
