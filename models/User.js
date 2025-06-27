const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  registerAs: {
    type: String,
    enum: ['employer', 'jobseeker', 'college', 'agency', 'superadmin', 'admin', 'subadmin'],
    required: true,
  },
  otp: String,
  otpExpire: Date,
  isVerified: { type: Boolean, default: false }, 
  acceptTerms: {type: Boolean, default: false},       // Email/OTP verification
  isActive: { type: Boolean, default: true },           // Deactivate by admin/superadmin
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
