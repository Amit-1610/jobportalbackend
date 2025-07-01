const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  employerProfile: { type: mongoose.Schema.Types.ObjectId, ref: "EmployerProfile", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: String },
  skillsRequired: [String],
  jobType: { type: String, enum: ["Full-Time", "Part-Time", "Internship", "Contract"], required: true },
  location: String,
  salary: String,
  category:{type: String, required: true },
  education: { type: String, required: true },
  openings: { type: Number, default: 1 },
  deadline: Date,
  isActive: { type: Boolean, default: true },
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobApplication" }],
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);
