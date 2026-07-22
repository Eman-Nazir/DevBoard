import { Project } from "../models/Project.model.js";
import { Task } from "../models/Task.model.js";
import { ActivityLog } from "../models/ActivityLog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { io } from "../index.js";

// ─── Create Project 
const createProject = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { name, description, githubRepo } = req.body;

  const project = await Project.create({
    name,
    description: description || "",
    githubRepo: githubRepo || "",
    workspace: workspaceId,
    createdBy: req.user._id,
  });

  await project.populate("createdBy", "name avatar");

  await ActivityLog.create({
    workspace: workspaceId,
    project: project._id,
    actor: req.user._id,
    action: "created_project",
    meta: { projectName: project.name },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { project }, "Project created successfully"));
});

// ─── Get Active Projects 
const getProjects = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const projects = await Project.find({ workspace: workspaceId, status: "active" })
    .populate("createdBy", "name avatar")
    .sort({ createdAt: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, { projects }, "Projects fetched successfully"));
});

// ─── Get Archived Projects 
const getArchivedProjects = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const projects = await Project.find({ workspace: workspaceId, status: "archived" })
    .populate("createdBy", "name avatar")
    .sort({ updatedAt: -1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, { projects }, "Archived projects fetched"));
});

// ─── Get Single Project 
const getProject = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const project = await Project.findOne({ _id: req.params.id, workspace: workspaceId })
    .populate("createdBy", "name avatar")
    .populate("workspace", "name")
    .lean();

  if (!project) throw new ApiError(404, "Project not found");

  return res
    .status(200)
    .json(new ApiResponse(200, { project }, "Project fetched successfully"));
});

// ─── Update Project also handles archive/unarchive
const updateProject = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { name, description, githubRepo, status } = req.body;

  const project = await Project.findOne({ _id: req.params.id, workspace: workspaceId });
  if (!project) throw new ApiError(404, "Project not found");

  if (name !== undefined) project.name = name;
  if (description !== undefined) project.description = description;
  if (githubRepo !== undefined) project.githubRepo = githubRepo;
  if (status !== undefined) {
    if (!["active", "archived"].includes(status)) {
      throw new ApiError(400, "Status must be active or archived");
    }
    project.status = status;
  }

  await project.save();
  await project.populate("createdBy", "name avatar");

  await ActivityLog.create({
    workspace: workspaceId,
    project: project._id,
    actor: req.user._id,
    action: "updated_project",
    meta: {
      updatedFields: Object.keys(req.body),
      status: project.status,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { project }, "Project updated successfully"));
});

// ─── Delete Project 
const deleteProject = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const project = await Project.findOne({ _id: req.params.id, workspace: workspaceId });
  if (!project) throw new ApiError(404, "Project not found");

  await ActivityLog.create({
    workspace: workspaceId,
    actor: req.user._id,
    action: "deleted_project",
    meta: { projectName: project.name, projectId: project._id },
  });

  await Promise.all([
    Project.findByIdAndDelete(project._id),
    Task.deleteMany({ project: project._id }),
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Project and all its tasks deleted successfully"));
});



export { createProject, getProjects, getArchivedProjects, getProject, updateProject, deleteProject };