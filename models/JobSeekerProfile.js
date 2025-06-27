const mongoose = require("mongoose");
const userFields = {
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: String, email: String, phone: String,
  registerAs: { type: String, enum: ["jobseeker"], default: "jobseeker" },
  isVerifiedByAdmin: { type: Boolean, default: false }
};

const schema = new mongoose.Schema({
  ...userFields,
  dob: Date, gender: String, profilePhoto: String,
  address: { permanent: String, current: String },
  idDocs: { aadhaar: String },
  panNumber: String, jobTitle: String, experience: String,
  skills: [String], industry: String,
  employmentHistory: [{ company: String, position: String, duration: String }],
  jobTypePreferences: [String],
  education: [{
    qualification: String, institution: String, degree: String,
    graduationYear: String, percentage: String
  }],
  resume: String, social: { linkedIn: String, github: String }
}, { timestamps: true });

module.exports = mongoose.model("JobSeekerProfile", schema);
