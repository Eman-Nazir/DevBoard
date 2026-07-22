import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const superAdminOnly = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+isSuperAdmin");

  if (!user || !user.isSuperAdmin) {
    throw new ApiError(403, "Access denied — Super Admin only");
  }

  next();
});

export { superAdminOnly };