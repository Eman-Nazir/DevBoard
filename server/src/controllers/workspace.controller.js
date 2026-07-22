import { Workspace } from "../models/Workspace.model.js";
import { Member } from "../models/Member.model.js";
import { Project } from "../models/Project.model.js";
import { Task } from "../models/Task.model.js";
import { ActivityLog } from "../models/ActivityLog.model.js";
import { User } from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/sendEmail.js";

// Note: workspace membership/role checks are handled by the checkRole
// middleware at the route level (see workspace.routes.js) which attaches
// req.member and req.memberRole Controllers below use those directly
// instead of re-querying the Member collection

// ─── Create Workspace 
const createWorkspace = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) throw new ApiError(400, "Workspace name is required");

  const workspace = await Workspace.create({
    name,
    description,
    owner: req.user._id,
  });

  // Creator becomes admin member automatically
  await Member.create({
    workspace: workspace._id,
    user: req.user._id,
    role: "admin",
    invitedBy: req.user._id,
  });

  await ActivityLog.create({
    workspace: workspace._id,
    actor: req.user._id,
    action: "created_workspace",
    meta: { workspaceName: workspace.name },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { workspace }, "Workspace created successfully"));
});

// ─── Get All Workspaces for current user 
const getMyWorkspaces = asyncHandler(async (req, res) => {
  const memberships = await Member.find({ user: req.user._id })
    .populate("workspace")
    .sort({ createdAt: -1 });

  const workspaces = memberships
    .filter((m) => m.workspace)
    .map((m) => ({
      ...m.workspace.toObject(),
      role: m.role,
    }));

  return res
    .status(200)
    .json(new ApiResponse(200, { workspaces }, "Workspaces fetched successfully"));
});

// ─── Get Single Workspace 
const getWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id).populate(
    "owner",
    "name email avatar"
  );

  if (!workspace) throw new ApiError(404, "Workspace not found");

  // req.member is attached by the checkRole middleware on this route
  return res
    .status(200)
    .json(new ApiResponse(200, { workspace, role: req.memberRole }, "Workspace fetched"));
});

// ─── Update Workspace 
const updateWorkspace = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const workspace = await Workspace.findById(req.params.id);
  if (!workspace) throw new ApiError(404, "Workspace not found");


  if (name) workspace.name = name;
  if (description !== undefined) workspace.description = description;

  await workspace.save();

  await ActivityLog.create({
    workspace: workspace._id,
    actor: req.user._id,
    action: "updated_workspace",
    meta: { name: workspace.name },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { workspace }, "Workspace updated successfully"));
});

// ─── Delete Workspace 
const deleteWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);
  if (!workspace) throw new ApiError(404, "Workspace not found");

  if (workspace.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the workspace owner can delete it");
  }

  // Snapshot counts before anything is deleted, for the log entry
  const [projectCount, memberCount] = await Promise.all([
    Project.countDocuments({ workspace: workspace._id }),
    Member.countDocuments({ workspace: workspace._id }),
  ]);


  await ActivityLog.create({
    workspace: workspace._id,
    actor: req.user._id,
    action: "deleted_workspace",
    meta: {
      workspaceName: workspace.name,
      projectCount,
      memberCount,
    },
  });


  await Promise.all([
    Workspace.findByIdAndDelete(workspace._id),
    Member.deleteMany({ workspace: workspace._id }),
    Project.deleteMany({ workspace: workspace._id }),
    Task.deleteMany({ workspace: workspace._id }),
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Workspace deleted successfully"));
});

// ─── Invite Member by Email 
const inviteMember = asyncHandler(async (req, res) => {
  const { email, role = "member" } = req.body;
  const workspaceId = req.params.id;

  if (!email) throw new ApiError(400, "Email is required");

  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new ApiError(404, "Workspace not found");


  const invitedUser = await User.findOne({ email });
  if (!invitedUser) {
    throw new ApiError(404, "No user found with this email. They must register first.");
  }

  const existingMember = await Member.findOne({
    workspace: workspaceId,
    user: invitedUser._id,
  });

  if (existingMember) {
    throw new ApiError(409, "This user is already a member of this workspace");
  }

  await Member.create({
    workspace: workspaceId,
    user: invitedUser._id,
    role,
    invitedBy: req.user._id,
  });

  await ActivityLog.create({
    workspace: workspaceId,
    actor: req.user._id,
    action: "invited_member",
    meta: { invitedEmail: email, role },
  });

  // Send invite email (non-blocking)
  await sendEmail({
    to: email,
    subject: `You've been invited to ${workspace.name} on DevBoard`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto">
        <h2>You've been invited!</h2>
        <p><strong>${req.user.name}</strong> has added you to <strong>${workspace.name}</strong> on DevBoard as a <strong>${role}</strong>.</p>
        <a href="${process.env.CLIENT_URL}/dashboard" style="display:inline-block;background:#7c3aed;color:white;padding:10px 20px;border-radius:8px;text-decoration:none;margin-top:12px">
          Go to DevBoard
        </a>
      </div>
    `,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, `${invitedUser.name} has been added to the workspace`));
});

// ─── Join by Invite Code 
const joinByInviteCode = asyncHandler(async (req, res) => {
  const { code } = req.params;

  const workspace = await Workspace.findOne({ inviteCode: code });
  if (!workspace) throw new ApiError(404, "Invalid invite code");

  const existingMember = await Member.findOne({
    workspace: workspace._id,
    user: req.user._id,
  });

  if (existingMember) {
    return res
      .status(200)
      .json(new ApiResponse(200, { workspace }, "You are already a member"));
  }

  await Member.create({
    workspace: workspace._id,
    user: req.user._id,
    role: "member",
    invitedBy: workspace.owner,
  });

  await ActivityLog.create({
    workspace: workspace._id,
    actor: req.user._id,
    action: "joined_workspace",
    meta: {},
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { workspace }, "Joined workspace successfully"));
});

// ─── Get Activity Log ──────────────────────────────────────────────────────────
const getActivityLog = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);
  if (!workspace) throw new ApiError(404, "Workspace not found");


  const logs = await ActivityLog.find({ workspace: req.params.id })
    .populate("actor", "name avatar")
    .sort({ createdAt: -1 })
    .limit(50);

  return res
    .status(200)
    .json(new ApiResponse(200, { logs }, "Activity log fetched"));
});

export {
  createWorkspace,
  getMyWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  inviteMember,
  joinByInviteCode,
  getActivityLog,
};