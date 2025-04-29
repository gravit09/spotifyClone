import { User } from "../models/user.models.js";

const isAllowed = async (req, res) => {
  const { role } = req;
  if (role !== "admin") {
    return res.status(200).json({
      message: "valid",
      role: false,
      success: true,
    });
  } else {
    return res.status(200).json({
      message: "valid",
      role: true,
      success: true,
    });
  }
};

const adminMiddleWare = async (req, res, next) => {
  const { role } = req;
  if (role !== "admin") {
    return res.status(403).json({
      message: "Access denied. Admin privileges required.",
      success: false,
    });
  }
  next();
};

export { isAllowed, adminMiddleWare };
