const jwt = require("jsonwebtoken");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");

module.exports = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      next(new ApiError("Tidak ada token", 401));
    }

    const token = bearerToken.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      next(new ApiError("Token tidak valid", 401));
    }

    const user = await User.findByPk(decoded.id, {
      include: ["Auth"],
    });

    req.user = user;

    next();
  } catch (error) {
    next(new ApiError(error.message, 401));
  }
};
