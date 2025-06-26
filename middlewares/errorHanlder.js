const ApiError = require('../errors/ApiError');

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ success: false, message: err.message });
  }
  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "Duplicate value error: " + Object.keys(err.keyValue).join(", ") });
  }
  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({ success: false, message: err.message });
  }
  // Fallback
  res.status(500).json({ success: false, message: err.message || "Internal server error" });
};

module.exports = errorHandler;