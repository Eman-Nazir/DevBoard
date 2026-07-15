import { Member } from "../models/Member.model.js";
import { Workspace } from "../models/Workspace.model.js";
import { ActivityLog } from "../models/ActivityLog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─── Get All Members ───────────────────────────────────────────────────────────
const getMembers = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const members = await Member.find({ workspace: workspaceId })
    .populate("user", "name email avatar createdAt")
    .populate("invitedBy", "name")
    .sort({ createdAt: 1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, { members }, "Members fetched successfully"));
});

// ─── Update Member Role ────────────────────────────────────────────────────────
const updateMemberRole = asyncHandler(async (req, res) => {
  const { workspaceId, userId } = req.params;
  const { role } = req.body;

  if (!["admin", "member", "viewer"].includes(role)) {
    throw new ApiError(400, "Role must be admin, member, or viewer");
  }

  // Prevent changing the workspace owner's role
  const workspace = await Workspace.findById(workspaceId).lean();
  if (!workspace) throw new ApiError(404, "Workspace not found");

  if (workspace.owner.toString() === userId) {
    throw new ApiError(403, "Cannot change the workspace owner's role");
  }

  // Prevent an admin from demoting themselves if they're the only admin
  if (req.user._id.toString() === userId && role !== "admin") {
    const adminCount = await Member.countDocuments({
      workspace: workspaceId,
      role: "admin",
    });
    if (adminCount <= 1) {
      throw new ApiError(400, "Cannot demote the only admin. Promote another member first.");
    }
  }

  const member = await Member.findOneAndUpdate(
    { workspace: workspaceId, user: userId },
    { role },
    { new: true }
  )
    .populate("user", "name email avatar")
    .lean();

  if (!member) throw new ApiError(404, "Member not found");

  await ActivityLog.create({
    workspace: workspaceId,
    actor: req.user._id,
    action: "updated_member_role",
    meta: { targetUserId: userId, newRole: role },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { member }, "Member role updated successfully"));
});

// ─── Remove Member ─────────────────────────────────────────────────────────────
const removeMember = asyncHandler(async (req, res) => {
  const { workspaceId, userId } = req.params;

  const workspace = await Workspace.findById(workspaceId).lean();
  if (!workspace) throw new ApiError(404, "Workspace not found");

  // Owner can never be removed
  if (workspace.owner.toString() === userId) {
    throw new ApiError(403, "The workspace owner cannot be removed");
  }

  const isRemovingSelf = req.user._id.toString() === userId;

  // Non-admins can only remove themselves (leave workspace)
  if (!isRemovingSelf && req.memberRole !== "admin") {
    throw new ApiError(403, "Only admins can remove other members");
  }

  const deleted = await Member.findOneAndDelete({
    workspace: workspaceId,
    user: userId,
  });

  if (!deleted) throw new ApiError(404, "Member not found in this workspace");

  await ActivityLog.create({
    workspace: workspaceId,
    actor: req.user._id,
    action: isRemovingSelf ? "left_workspace" : "removed_member",
    meta: { targetUserId: userId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, isRemovingSelf ? "You have left the workspace" : "Member removed successfully"));
});

export { getMembers, updateMemberRole, removeMember };