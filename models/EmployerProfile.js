const mongoose = require("mongoose");
const userFields = {
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: String, email: String, phone: String,
  registerAs: { type: String, enum: ["employer"], default: "employer" },
  isVerifiedByAdmin: { type: Boolean, default: false }
};

const schema = new mongoose.Schema({
  ...userFields,
  companyName: String, organizationType: String, industry: String,
  companySize: String, yearEstablished: String, logo: String,
  legal: { officialEmail: String, contactNumber: String, address: String, gstin: String, cin: String, panCard: String, license: String },
  contactPerson: { name: String, designation: String, mobile: String, email: String },
  description: String, website: String, social: [String]
}, { timestamps: true });

module.exports = mongoose.model("EmployerProfile", schema);
