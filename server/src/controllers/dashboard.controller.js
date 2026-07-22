import { Member } from "../models/Member.model.js";
import { ActivityLog } from "../models/ActivityLog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── Get recent activity across ALL of the current user workspaces 
const getMyActivity = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;

  // Find every workspace this user is CURRENTLY a member of
  const memberships = await Member.find({ user: req.user._id }).select("workspace").lean();
  const workspaceIds = memberships.map((m) => m.workspace);

  const logs = await ActivityLog.find({
    $or: [
      { workspace: { $in: workspaceIds } },
      { actor: req.user._id },
    ],
  })
    .populate("actor", "name avatar")
    .populate("workspace", "name")
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, { logs }, "Activity fetched successfully"));
});

export { getMyActivity };