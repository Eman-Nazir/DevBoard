import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * superAdminOnly — middleware that runs AFTER verifyJWT.
 * Checks isSuperAdmin flag on the user document.
 * Only the platform owner can access /admin routes.
 */
const superAdminOnly = asyncHandler(async (req, res, next) => {
  // Re-fetch user with isSuperAdmin selected (it has select:false on schema)
  const user = await User.findById(req.user._id).select("+isSuperAdmin");

  if (!user || !user.isSuperAdmin) {
    throw new ApiError(403, "Access denied — Super Admin only");
  }

  next();
});

export { superAdminOnly };