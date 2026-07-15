import { Member } from "../models/Member.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * RBAC middleware — checks the user's role in a workspace.
 *
 * Requires workspaceId to be explicitly available as:
 *   req.params.workspaceId  (nested routes: /workspaces/:workspaceId/...)
 *   req.params.id           (workspace direct routes: /workspaces/:id)
 *
 * Also attaches req.member so controllers can use it without a second DB call.
 */
const checkRole = (allowedRoles) => {
  return asyncHandler(async (req, res, next) => {
    // Explicit lookup — never guess from body
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

    // Attach to req — controllers use this instead of another DB query
    req.member = member;
    req.memberRole = member.role;
    next();
  });
};

export { checkRole };