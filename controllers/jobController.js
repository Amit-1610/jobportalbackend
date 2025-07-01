const Job = require("../models/Job");
const JobApplication = require("../models/JobApplication");
const Employer = require("../models/EmployerProfile");
const JobSeekerProfile = require("../models/JobSeekerProfile");
const ApiError = require("../errors/ApiError");
const cloudinary = require("../utils/cloudinary");

// Create Job (employer only)
exports.create = async (req, res, next) => {
  try {
    if (req.user.registerAs !== "employer") return next(new ApiError(403, "Only employers can post jobs"));
    const { title, description, requirements, skillsRequired, jobType, location, salary, education,openings, category, deadline } = req.body;
    const employerProfile = await Employer.findOne({ user: req.user._id });
    if (!employerProfile) return next(new ApiError(404, "Employer profile not found"));
    const job = await Job.create({
      employer: req.user._id,
      employerProfile: employerProfile._id,
      title, description, requirements, skillsRequired, jobType, location, category, education,salary, openings, deadline
    });
    res.status(201).json({ success: true, job });
  } catch (err) { next(err); }
};

// List all jobs (public)
exports.list = async (req, res, next) => {
  try {
    const jobs = await Job.find({ isActive: true }).populate("employerProfile applicants");
    res.json({ success: true, jobs });
  } catch (err) { next(err); }
};

// Get job by id (public)
exports.getById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id).populate("employerProfile");
    if (!job) return next(new ApiError(404, "Job not found"));
    res.json({ success: true, job });
  } catch (err) { next(err); }
};

// Apply to job (jobseeker only)
exports.apply = async (req, res, next) => {
  try {
    if (req.user.registerAs !== "jobseeker") return next(new ApiError(403, "Only jobseekers can apply"));
    const { jobId, coverLetter } = req.body;
    const job = await Job.findById(jobId);
    if (!job) return next(new ApiError(404, "Job not found"));
    if (!job.isActive) return next(new ApiError(400, "Job is not active"));
    const jobseekerProfile = await JobSeekerProfile.findOne({ user: req.user._id });
    if (!jobseekerProfile) return next(new ApiError(404, "Jobseeker profile not found"));
    const alreadyApplied = await JobApplication.findOne({ job: jobId, jobseeker: req.user._id });
    if (alreadyApplied) return next(new ApiError(409, "Already applied"));
    let resume = jobseekerProfile.resume;
    if (req.file) resume = (await cloudinary.uploader.upload(req.file.path, { folder: "applications" })).secure_url;
    const application = await JobApplication.create({
      job: jobId,
      jobseeker: req.user._id,
      jobseekerProfile: jobseekerProfile._id,
      resume,
      coverLetter
    });
    job.applicants.push(application._id);
    await job.save();
    req.app.get("io").emit("job:applied", { jobId, applicationId: application._id });
    res.status(201).json({ success: true, application });
  } catch (err) { next(err); }
};

// List applications for a job (employer and admin roles)
exports.listApplicationsForJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return next(new ApiError(404, "Job not found"));
    if (req.user.registerAs === "employer" && String(job.employer) !== String(req.user._id)) {
      return next(new ApiError(403, "Not authorized"));
    }
    const applications = await JobApplication.find({ job: job._id }).populate("jobseekerProfile");
    res.json({ success: true, applications });
  } catch (err) { next(err); }
};

// List all applications (admin dashboard)
exports.listAllApplications = async (req, res, next) => {
  try {
    if (!["admin", "superadmin", "subadmin"].includes(req.user.registerAs)) {
      return next(new ApiError(403, "Not authorized"));
    }
    const applications = await JobApplication.find().populate("job jobseekerProfile");
    res.json({ success: true, applications });
  } catch (err) { next(err); }
};

// Update status of application (employer and admin roles)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const application = await JobApplication.findById(req.params.id).populate("job");
    if (!application) return next(new ApiError(404, "Application not found"));
    if (
      req.user.registerAs === "employer" &&
      String(application.job.employer) !== String(req.user._id)
    ) {
      return next(new ApiError(403, "Not authorized"));
    }
    application.status = status;
    await application.save();
    req.app.get("io").emit("job:applicationStatusUpdated", { applicationId: application._id, status });
    res.json({ success: true, application });
  } catch (err) { next(err); }
};

// Deactivate job (employer and admin)
exports.deactivateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return next(new ApiError(404, "Job not found"));
    if (
      req.user.registerAs === "employer" &&
      String(job.employer) !== String(req.user._id)
    ) {
      return next(new ApiError(403, "Not authorized"));
    }
    job.isActive = false;
    await job.save();
    req.app.get("io").emit("job:deactivated", { jobId: job._id });
    res.json({ success: true, message: "Job deactivated" });
  } catch (err) { next(err); }
};

// Activate job (employer and admin)
exports.activateJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return next(new ApiError(404, "Job not found"));
    if (
      req.user.registerAs === "employer" &&
      String(job.employer) !== String(req.user._id)
    ) {
      return next(new ApiError(403, "Not authorized"));
    }
    job.isActive = true;
    await job.save();
    req.app.get("io").emit("job:activated", { jobId: job._id });
    res.json({ success: true, message: "Job activated" });
  } catch (err) { next(err); }
};
