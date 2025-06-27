const User = require("../models/User")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../services/otpMailer");
const generateOTP = require("../utils/otp");
const ApiError = require("../errors/ApiError");



// Register new user
function generateRegisterEmail({ fullName, otp, registerAs }) {
  return `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f6f8fa; padding: 40px 0;">
      <table style="max-width: 520px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px #e1e4e8;">
        <tr>
          <td style="padding: 24px 32px 0 32px;">
            <img src="https://gajananskilltech.com/assets/logo.png" alt="Gajanan Skill Tech" style="height: 48px; margin-bottom: 20px;" />
            <h2 style="color: #235390; font-size: 1.4em;">Welcome to Gajanan Skill Tech!</h2>
            <p style="font-size: 1.05em; color: #232323;">Hi <strong>${fullName}</strong>,</p>
            <p style="font-size: 1em; color: #3a3a3a;">
              Thank you for registering as <strong>${registerAs}</strong> with Gajanan Skill Tech.
              To complete your registration, please verify your email address using the One-Time Password (OTP) below.
            </p>
            <div style="margin: 28px 0; text-align: center;">
              <span style="display: inline-block; font-size: 2em; color: #fff; background: #235390; padding: 16px 38px; border-radius: 8px; letter-spacing: 8px; font-weight: bold;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 1em; color: #555;">
              <strong>Note:</strong> This OTP is valid for <b>10 minutes</b>.<br/>
              If you didn't request this, please ignore this email.
            </p>
            <p style="margin-top: 36px; color: #888;">Best wishes,<br/><strong>Team Gajanan Skill Tech</strong></p>
          </td>
        </tr>
        <tr>
          <td style="padding: 12px 32px 24px 32px; text-align: center;">
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin-bottom: 12px;">
            <small style="color: #a0aec0;">&copy; ${new Date().getFullYear()} Gajanan Skill Tech. All rights reserved.</small>
          </td>
        </tr>
      </table>
    </div>
  `;
}

exports.register = async (req, res, next) => {
  try {
    const { fullName, email, phone, password, registerAs, acceptTerms } = req.body;
    if (!fullName || !email || !phone || !password || !registerAs)
      return next(new ApiError(400, "All fields required"));
    if (!acceptTerms) return next(new ApiError(400, "Terms must be accepted"));

    let user = await User.findOne({ $or: [{ email }, { phone }] });
    if (user) return next(new ApiError(409, "Email or phone already exists"));

    const hashedPwd = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpire = Date.now() + 10 * 60 * 1000;

    user = new User({
      fullName,
      email,
      phone,
      password: hashedPwd,
      registerAs,
      otp,
      otpExpire,
      acceptTerms // <-- Now storing the acceptTerms field
    });
    await user.save();

    // --- send the email using the new HTML template ---
    await sendMail(
      email,
      "OTP Verification - Gajanan Skill Tech",
      generateRegisterEmail({ fullName, otp, registerAs })
    );

    res
      .status(201)
      .json({ success: true, message: "User registered. OTP sent to email." });
  } catch (err) {
    next(err);
  }
};



// Verify OTP
exports.verifyOtp = async (req, res, next) => {
  try {
    const { otp } = req.body;
    // Find the user with this OTP and check it hasn't expired
    const user = await User.findOne({ otp, otpExpire: { $gt: Date.now() } });
    if (!user)
      return next(new ApiError(400, "Invalid or expired OTP"));

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.json({ success: true, message: "OTP verified. You can now login." });
  } catch (err) {
    next(err);
  }
};


// Login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) return next(new ApiError(400, "Invalid credentials"));

    // Add verification checks
    if (!user.isVerified) return next(new ApiError(403, "Please verify your email."));
    if (!user.isActive) return next(new ApiError(403, "Account is deactivated."));

    const match = await bcrypt.compare(password, user.password);
    if (!match) return next(new ApiError(400, "Invalid credentials"));

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, registerAs: user.registerAs },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Cookie options
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "development",
      sameSite: "strict",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    };

    // Set token in cookie and send response
    res
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        token,
        message: "Login successful",
        user: {
          id: user._id,
          registerAs: user.registerAs,
          fullName: user.fullName,
          email: user.email,
          phone: user.phone,
          isActive: user.isActive,
          token,
        },
      });

  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ success: true, message: "Logged out successfully" });
};



// List all users (with optional filters, for admin dashboard)
exports.listUsers = async (req, res, next) => {
  try {
    const { registerAs } = req.query; // e.g. ?registerAs=employer
    let filter = {};
    if (registerAs) filter.registerAs = registerAs;
    const users = await User.find(filter).select('-password');
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};

// Activate user (admin, superadmin, subadmin)
exports.activateAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(new ApiError(404, "User not found"));

    // Only employer, jobseeker, college, agency can be activated by admin roles
    if (!["employer", "jobseeker", "college", "agency"].includes(user.registerAs)) {
      return next(new ApiError(403, "Cannot activate this account type."));
    }

    user.isActive = true;
    await user.save();
    res.json({ success: true, message: "Account activated." });
  } catch (err) {
    next(err);
  }
};

// Deactivate user (admin, superadmin, subadmin)
exports.deactivateAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(new ApiError(404, "User not found"));

    if (!["employer", "jobseeker", "college", "agency"].includes(user.registerAs)) {
      return next(new ApiError(403, "Cannot deactivate this account type."));
    }

    user.isActive = false;
    await user.save();
    res.json({ success: true, message: "Account deactivated." });
  } catch (err) {
    next(err);
  }
};

// Verify user (admin, superadmin, subadmin)
exports.verifyAccount = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(new ApiError(404, "User not found"));

    if (!["employer", "jobseeker", "college", "agency"].includes(user.registerAs)) {
      return next(new ApiError(403, "Cannot verify this account type."));
    }

    user.isVerifiedByAdmin = true;
    await user.save();

    res.json({ success: true, message: "Account verified by admin." });
  } catch (err) {
    next(err);
  }
};

// Assign work to subadmin/admin
exports.assignWork = async (req, res, next) => {
  try {
    const { userId, assignToId } = req.body; // assignToId = admin/subadmin id
    const user = await User.findById(userId);
    const assignToUser = await User.findById(assignToId);
    if (!user) return next(new ApiError(404, "User to assign not found"));
    if (!assignToUser) return next(new ApiError(404, "Assignee user not found"));

    user.assignedTo = assignToId;
    await user.save();
    res.json({ success: true, message: "Work assigned." });
  } catch (err) {
    next(err);
  }
};


exports.updatePassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword) {
      return next(new ApiError(400, "New password is required"));
    }

    const user = await User.findById(req.user.id);

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    const io = req.app.get("io");
    io.emit("user:passwordChanged", {
      userId: user._id,
      message: "User changed their password"
    });

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    next(err);
  }
};


exports.updateFullName = async (req, res, next) => {
  try {
    const { fullName } = req.body;
    if (!fullName) return next(new ApiError(400, "Full name is required"));

    const user = await User.findByIdAndUpdate(req.user.id, { fullName }, { new: true });

    const io = req.app.get("io");
    io.emit("user:updateFullName", {
      userId: user._id,
      fullName: user.fullName
    });

    res.json({ success: true, message: "Full name updated successfully", user });
  } catch (err) {
    next(err);
  }
};


exports.updatePhone = async (req, res, next) => {
  try {
    const { phone } = req.body;
    if (!phone) return next(new ApiError(400, "Phone number is required"));

    const existingUser = await User.findOne({ phone });
    if (existingUser && existingUser.id !== req.user.id) {
      return next(new ApiError(409, "Phone number already in use"));
    }

    const user = await User.findByIdAndUpdate(req.user.id, { phone }, { new: true });

    const io = req.app.get("io");
    io.emit("user:updatePhone", {
      userId: user._id,
      phone: user.phone
    });

    res.json({ success: true, message: "Phone number updated successfully", user });
  } catch (err) {
    next(err);
  }
};


exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return next(new ApiError(404, "User not found"));
    res.json({ success: true, user });
  } catch (err) {
    next(err);
  }
}

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (err) {
    next(err);
  }
};