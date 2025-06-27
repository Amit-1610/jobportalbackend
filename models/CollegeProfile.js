const mongoose = require("mongoose");
const userFields = {
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: String, email: String, phone: String,
  registerAs: { type: String, enum: ["college"], default: "college" },
  isVerifiedByAdmin: { type: Boolean, default: false }
};

const schema = new mongoose.Schema({
  ...userFields,
  institutionName: String, institutionType: String, yearEstablished: String, logo: String,
  accreditation: [String],
  legal: { officialEmail: String, contactNumber: String, address: String, recognitionCert: String, panNumber: String },
  placementContact: { officerName: String, designation: String, email: String, mobile: String },
  coursesOffered: [String], placementStats: String, website: String, social: [String]
}, { timestamps: true });

module.exports = mongoose.model("CollegeProfile", schema);
