const ApiError = require("../errors/ApiError");

exports.allowRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.registerAs)) {
    return next(new ApiError(403, "Forbidden: insufficient rights"));
  }
  next();
};
