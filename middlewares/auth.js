const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../errors/ApiError");

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return next(new ApiError(401, "No token provided"));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) return next(new ApiError(401, "User does not exist"));
    next();
  } catch (err) {
    next(new ApiError(401, "Token invalid or expired"));
  }
};
