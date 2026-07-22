import { Member } from "../models/Member.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const checkRole = (allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    const workspaceId = req.params.workspaceId || req.params.id;

    if (!workspaceId) {
      throw new ApiError(400, "Workspace ID is required");
    }

    const member = await Member.findOne({
      workspace: workspaceId,
      user: req.user._id,
    }).lean();

    if (!member) {
      throw new ApiError(403, "You are not a member of this workspace");
    }

    if (!allowedRoles.includes(member.role)) {
      throw new ApiError(
        403,
        `Access denied. Required: ${allowedRoles.join(" or ")}`
      );
    }

    req.member = member;
    req.memberRole = member.role;
    next();
  });
};

export { checkRole };