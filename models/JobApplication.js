const mongoose = require("mongoose");

const jobAppSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  jobseeker: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobseekerProfile: { type: mongoose.Schema.Types.ObjectId, ref: "JobSeekerProfile", required: true },
  status: { type: String, enum: ["applied", "reviewed", "shortlisted", "rejected", "accepted"], default: "applied" },
  resume: String, // file
  coverLetter: String,
  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model("JobApplication", jobAppSchema);
