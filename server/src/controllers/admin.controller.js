import { User } from "../models/User.model.js";
import { Workspace } from "../models/Workspace.model.js";
import { Project } from "../models/Project.model.js";
import { Task } from "../models/Task.model.js";
import { Member } from "../models/Member.model.js";
import { AdminLog } from "../models/AdminLog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createNotification } from "../utils/notification.utils.js";

// ─── Platform Stats 
const getPlatformStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const sevenDaysAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
  const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsersThisWeek,
    newUsersThisMonth,
    totalWorkspaces,
    activeWorkspaces,
    totalProjects,
    totalTasks,
    completedTasks,
    userGrowth,
    tasksByPriority,
    tasksByColumn,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Workspace.countDocuments(),
    Workspace.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Project.countDocuments(),
    Task.countDocuments(),
    Task.countDocuments({ completedAt: { $ne: null } }),
    User.aggregate([
      { $match: { createdAt: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Task.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $group: { _id: "$columnId", count: { $sum: 1 } } },
    ]),
  ]);

  const topWorkspacesByTasks = await Task.aggregate([
    { $group: { _id: "$workspace", taskCount: { $sum: 1 } } },
    { $sort: { taskCount: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: "workspaces",
        localField: "_id",
        foreignField: "_id",
        as: "workspace",
      },
    },
    { $unwind: "$workspace" },
    { $project: { name: "$workspace.name", taskCount: 1 } },
  ]);

  const completionRate = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  return res.status(200).json(
    new ApiResponse(200, {
      stats: {
        totalUsers,
        newUsersThisWeek,
        newUsersThisMonth,
        totalWorkspaces,
        activeWorkspaces,
        totalProjects,
        totalTasks,
        completedTasks,
        completionRate,
      },
      userGrowth,
      tasksByPriority,
      tasksByColumn,
      topWorkspaces: topWorkspacesByTasks,
    }, "Platform stats fetched successfully")
  );
});

// ─── All Users (paginated + search) 
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const search = req.query.search || "";

  const filter = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const [users, totalCount] = await Promise.all([
    User.find(filter)
      .select("name email avatar createdAt isSuperAdmin")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    User.countDocuments(filter),
  ]);

  const usersWithCounts = await Promise.all(
    users.map(async (u) => {
      const workspaceCount = await Member.countDocuments({ user: u._id });
      return { ...u, workspaceCount };
    })
  );

  return res.status(200).json(
    new ApiResponse(200, {
      users: usersWithCounts,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        hasMore: page * limit < totalCount,
      },
    }, "Users fetched successfully")
  );
});

// ─── All Workspaces (paginated) 
const getAllWorkspaces = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  const [workspaces, totalCount] = await Promise.all([
    Workspace.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Workspace.countDocuments(),
  ]);

  const workspacesWithCounts = await Promise.all(
    workspaces.map(async (ws) => {
      const [projectCount, memberCount] = await Promise.all([
        Project.countDocuments({ workspace: ws._id }),
        Member.countDocuments({ workspace: ws._id }),
      ]);
      return { ...ws, memberCount, projectCount };
    })
  );

  return res.status(200).json(
    new ApiResponse(200, {
      workspaces: workspacesWithCounts,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        hasMore: page * limit < totalCount,
      },
    }, "Workspaces fetched successfully")
  );
});

// ─── All Projects  
const getAllProjects = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;

  const [projects, totalCount] = await Promise.all([
    Project.find()
      .populate("workspace", "name")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Project.countDocuments(),
  ]);

  const projectsWithCounts = await Promise.all(
    projects.map(async (p) => {
      const taskCount = await Task.countDocuments({ project: p._id });
      return { ...p, taskCount };
    })
  );

  return res.status(200).json(
    new ApiResponse(200, {
      projects: projectsWithCounts,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        hasMore: page * limit < totalCount,
      },
    }, "Projects fetched successfully")
  );
});

// ─── Delete User with full cascade cleanup
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");
  if (user.isSuperAdmin) throw new ApiError(403, "Cannot delete a Super Admin account");

  const affectedWorkspaces = [];

  // ── 1. Handle workspaces this user OWNS 
  const ownedWorkspaces = await Workspace.find({ owner: id });

  for (const workspace of ownedWorkspaces) {
    const nextOwner = await Member.findOne({
      workspace: workspace._id,
      user: { $ne: id },
      role: "admin",
    }).sort({ createdAt: 1 });

    if (nextOwner) {
      // Transfer ownership to the next admin 
      workspace.owner = nextOwner.user;
      await workspace.save();
      affectedWorkspaces.push({ workspaceId: workspace._id, name: workspace.name, outcome: "ownership_transferred", newOwner: nextOwner.user });

      await createNotification({
        recipientId: nextOwner.user,
        actorId: req.user._id,
        type: "workspace_ownership_transferred",
        message: `You are now the owner of "${workspace.name}" after its previous owner's account was removed.`,
        link: `/workspace/${workspace._id}`,
        workspaceId: workspace._id,
      }).catch(() => {}); 
    } else {
      const anyOtherMember = await Member.findOne({
        workspace: workspace._id,
        user: { $ne: id },
      }).sort({ createdAt: 1 });

      if (anyOtherMember) {
        anyOtherMember.role = "admin";
        await anyOtherMember.save();
        workspace.owner = anyOtherMember.user;
        await workspace.save();
        affectedWorkspaces.push({ workspaceId: workspace._id, name: workspace.name, outcome: "member_promoted_to_owner", newOwner: anyOtherMember.user });

        await createNotification({
          recipientId: anyOtherMember.user,
          actorId: req.user._id,
          type: "workspace_ownership_transferred",
          message: `You've been promoted to admin and owner of "${workspace.name}" after its previous owner's account was removed.`,
          link: `/workspace/${workspace._id}`,
          workspaceId: workspace._id,
        }).catch(() => {}); 
      } else {
        await Project.deleteMany({ workspace: workspace._id });
        await Task.deleteMany({ workspace: workspace._id });
        await Member.deleteMany({ workspace: workspace._id });
        await Workspace.findByIdAndDelete(workspace._id);
        affectedWorkspaces.push({ workspaceId: workspace._id, name: workspace.name, outcome: "workspace_deleted" });
      }
    }
  }

  // ── 2. Remove their membership from workspaces they do not own 
  await Member.deleteMany({ user: id });

  // ── 3. Unassign them from any tasks don't delete the tasks
  await Task.updateMany(
    { assignees: id },
    { $pull: { assignees: id } }
  );

  // ── 4. Log the action before the user record disappears 
  await AdminLog.create({
    admin: req.user._id,
    action: "deleted_user",
    targetType: "User",
    targetId: user._id,
    meta: {
      deletedUserName: user.name,
      deletedUserEmail: user.email,
      affectedWorkspaces,
    },
  });

  // ── 5. Finally, delete the user account itself 
  await User.findByIdAndDelete(id);

  return res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
});

// ─── Get Admin Action Log (paginated) 
const getAdminLogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 20;

  const [logs, totalCount] = await Promise.all([
    AdminLog.find()
      .populate("admin", "name email avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    AdminLog.countDocuments(),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      logs,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        hasMore: page * limit < totalCount,
      },
    }, "Admin logs fetched successfully")
  );
});

// ─── Update User (name/email only — never password, never super admin) 
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");
  if (user.isSuperAdmin) throw new ApiError(403, "Cannot edit a Super Admin account");

  const before = { name: user.name, email: user.email };

  if (name !== undefined) {
    if (!name.trim()) throw new ApiError(400, "Name cannot be empty");
    user.name = name.trim();
  }
  if (email !== undefined) {
    if (!email.trim()) throw new ApiError(400, "Email cannot be empty");
    const existing = await User.findOne({ email: email.trim(), _id: { $ne: id } });
    if (existing) throw new ApiError(409, "That email is already in use by another account");
    user.email = email.trim();
  }

  await user.save();

  await AdminLog.create({
    admin: req.user._id,
    action: "updated_user",
    targetType: "User",
    targetId: user._id,
    meta: { before, after: { name: user.name, email: user.email } },
  });

  return res.status(200).json(
    new ApiResponse(200, {
      user: { _id: user._id, name: user.name, email: user.email, avatar: user.avatar },
    }, "User updated successfully")
  );
});

// ─── Update Workspace (name/description) 
const updateWorkspace = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;

  const workspace = await Workspace.findById(id);
  if (!workspace) throw new ApiError(404, "Workspace not found");

  const before = { name: workspace.name, description: workspace.description };

  if (name !== undefined) {
    if (!name.trim()) throw new ApiError(400, "Workspace name cannot be empty");
    workspace.name = name.trim();
  }
  if (description !== undefined) {
    workspace.description = description;
  }

  await workspace.save();

  await AdminLog.create({
    admin: req.user._id,
    action: "updated_workspace",
    targetType: "Workspace",
    targetId: workspace._id,
    meta: { before, after: { name: workspace.name, description: workspace.description } },
  });

  return res.status(200).json(
    new ApiResponse(200, { workspace }, "Workspace updated successfully")
  );
});

// ─── Delete Workspace 
const deleteWorkspace = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const workspace = await Workspace.findById(id);
  if (!workspace) throw new ApiError(404, "Workspace not found");

  const [memberCount, projectCount, taskCount] = await Promise.all([
    Member.countDocuments({ workspace: id }),
    Project.countDocuments({ workspace: id }),
    Task.countDocuments({ workspace: id }),
  ]);

  // Log BEFORE deleting, so theres a permanent record of what was destroyed
  await AdminLog.create({
    admin: req.user._id,
    action: "deleted_workspace",
    targetType: "Workspace",
    targetId: workspace._id,
    meta: {
      workspaceName: workspace.name,
      ownerId: workspace.owner,
      membersRemoved: memberCount,
      projectsRemoved: projectCount,
      tasksRemoved: taskCount,
    },
  });

  await Promise.all([
    Project.deleteMany({ workspace: id }),
    Task.deleteMany({ workspace: id }),
    Member.deleteMany({ workspace: id }),
    Workspace.findByIdAndDelete(id),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {}, "Workspace and all its contents deleted successfully")
  );
});

// ─── Update Project (name/description/status) 
const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;

  const project = await Project.findById(id);
  if (!project) throw new ApiError(404, "Project not found");

  const before = { name: project.name, description: project.description, status: project.status };

  if (name !== undefined) {
    if (!name.trim()) throw new ApiError(400, "Project name cannot be empty");
    project.name = name.trim();
  }
  if (description !== undefined) project.description = description;
  if (status !== undefined) {
    if (!["active", "archived"].includes(status)) {
      throw new ApiError(400, "Status must be active or archived");
    }
    project.status = status;
  }

  await project.save();

  await AdminLog.create({
    admin: req.user._id,
    action: "updated_project",
    targetType: "Project",
    targetId: project._id,
    meta: { before, after: { name: project.name, description: project.description, status: project.status } },
  });

  return res.status(200).json(
    new ApiResponse(200, { project }, "Project updated successfully")
  );
});

// ─── Delete Project 
const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id);
  if (!project) throw new ApiError(404, "Project not found");

  const taskCount = await Task.countDocuments({ project: id });

  await AdminLog.create({
    admin: req.user._id,
    action: "deleted_project",
    targetType: "Project",
    targetId: project._id,
    meta: {
      projectName: project.name,
      workspaceId: project.workspace,
      tasksRemoved: taskCount,
    },
  });

  await Promise.all([
    Task.deleteMany({ project: id }),
    Project.findByIdAndDelete(id),
  ]);

  return res.status(200).json(
    new ApiResponse(200, {}, "Project and all its tasks deleted successfully")
  );
});

export {
  getPlatformStats,
  getAllUsers,
  getAllWorkspaces,
  getAllProjects,
  deleteUser,
  updateUser,
  updateWorkspace,
  deleteWorkspace,
  updateProject,
  deleteProject,
  getAdminLogs,
};