const mongoose = require("mongoose");
const userFields = {
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fullName: String, email: String, phone: String,
  registerAs: { type: String, enum: ["agency"], default: "agency" },
  isVerifiedByAdmin: { type: Boolean, default: false }
};

const schema = new mongoose.Schema({
  ...userFields,
  organizationName: String, organizationType: String,
  pan: String, tan: String, gst: String, centersLocation: String,
  projectName: String, 
  organizationAddress: String, placementCount: String,
  trade: String, otherInfo: String
}, { timestamps: true });

module.exports = mongoose.model("AgencyProfile", schema);
