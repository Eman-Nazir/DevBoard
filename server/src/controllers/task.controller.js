import { Task } from "../models/Task.model.js";
import { Project } from "../models/Project.model.js";
import { ActivityLog } from "../models/ActivityLog.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { io } from "../index.js";
import { createNotification } from "../utils/notification.utils.js";

// ─── Create Task ───────────────────────────────────────────────────────────────
const createTask = asyncHandler(async (req, res) => {
  const { projectId, workspaceId } = req.params;
  const { title, description, columnId, priority, assignees, labels, dueDate } = req.body;

  // Verify the columnId exists in this project
  const project = await Project.findById(projectId).lean();
  if (!project) throw new ApiError(404, "Project not found");

  const validColumn = project.columns.find((c) => c.id === columnId);
  if (!validColumn) {
    throw new ApiError(400, `Column "${columnId}" does not exist in this project`);
  }

  // Auto-set order to end of column
  const lastTask = await Task.findOne({ project: projectId, columnId })
    .sort({ order: -1 })
    .lean();
  const order = lastTask ? lastTask.order + 1 : 0;

  const task = await Task.create({
    title,
    description: description || "",
    project: projectId,
    workspace: workspaceId,
    columnId,
    order,
    priority: priority || "medium",
    assignees: assignees || [],
    labels: labels || [],
    dueDate: dueDate || null,
    createdBy: req.user._id,
  });

  await task.populate([
    { path: "createdBy", select: "name avatar" },
    { path: "assignees", select: "name avatar" },
  ]);

  // Emit to all users viewing this project in real time
  io.to(`project:${projectId}`).emit("task:created", { task });

  // Notify every assignee (skip self-assignment)
  if (task.assignees?.length > 0) {
    const notifyPromises = task.assignees.map((assignee) =>
      createNotification({
        recipientId: assignee._id,
        actorId: req.user._id,
        type: "task_assigned",
        message: `${req.user.name} assigned you to "${task.title}"`,
        link: `/workspace/${workspaceId}/project/${projectId}/kanban`,
        workspaceId,
        projectId,
        taskId: task._id,
      })
    );
    await Promise.allSettled(notifyPromises); // allSettled — never crash on notification failure
  }

  await ActivityLog.create({
    workspace: workspaceId,
    project: projectId,
    actor: req.user._id,
    action: "created_task",
    meta: { taskId: task._id, taskTitle: task.title, columnId },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, { task }, "Task created successfully"));
});

// ─── Get All Tasks for a Project ──────────────────────────────────────────────
const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const tasks = await Task.find({ project: projectId })
    .populate("assignees", "name avatar")
    .populate("createdBy", "name avatar")
    .sort({ columnId: 1, order: 1 })
    .lean();

  return res
    .status(200)
    .json(new ApiResponse(200, { tasks }, "Tasks fetched successfully"));
});

// ─── Get Single Task ──────────────────────────────────────────────────────────
const getTask = asyncHandler(async (req, res) => {
  const { projectId, id } = req.params;

  const task = await Task.findOne({ _id: id, project: projectId })
    .populate("assignees", "name avatar email")
    .populate("createdBy", "name avatar")
    .lean();

  if (!task) throw new ApiError(404, "Task not found");

  return res
    .status(200)
    .json(new ApiResponse(200, { task }, "Task fetched successfully"));
});

// ─── Update Task ───────────────────────────────────────────────────────────────
const updateTask = asyncHandler(async (req, res) => {
  const { projectId, workspaceId, id } = req.params;
  const { title, description, priority, assignees, labels, dueDate } = req.body;

  const task = await Task.findOne({ _id: id, project: projectId });
  if (!task) throw new ApiError(404, "Task not found");

  // Track who was already assigned before the update
  const previousAssigneeIds = task.assignees.map((a) => a.toString());

  if (title !== undefined) task.title = title;
  if (description !== undefined) task.description = description;
  if (priority !== undefined) task.priority = priority;
  if (assignees !== undefined) task.assignees = assignees;
  if (labels !== undefined) task.labels = labels;
  if (dueDate !== undefined) task.dueDate = dueDate || null;

  await task.save();
  await task.populate([
    { path: "assignees", select: "name avatar" },
    { path: "createdBy", select: "name avatar" },
  ]);

  // Emit update to all project viewers
  io.to(`project:${projectId}`).emit("task:updated", { task });

  // Notify only NEWLY added assignees (not those already assigned)
  if (assignees !== undefined) {
    const newAssigneeIds = task.assignees
      .map((a) => a._id.toString())
      .filter((id) => !previousAssigneeIds.includes(id));

    if (newAssigneeIds.length > 0) {
      const notifyPromises = newAssigneeIds.map((assigneeId) =>
        createNotification({
          recipientId: assigneeId,
          actorId: req.user._id,
          type: "task_assigned",
          message: `${req.user.name} assigned you to "${task.title}"`,
          link: `/workspace/${workspaceId}/project/${projectId}/kanban`,
          workspaceId,
          projectId,
          taskId: task._id,
        })
      );
      await Promise.allSettled(notifyPromises);
    }
  }

  await ActivityLog.create({
    workspace: workspaceId,
    project: projectId,
    actor: req.user._id,
    action: "updated_task",
    meta: { taskId: task._id, taskTitle: task.title, updatedFields: Object.keys(req.body) },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { task }, "Task updated successfully"));
});

// ─── Move Task (change column) ─────────────────────────────────────────────────
const moveTask = asyncHandler(async (req, res) => {
  const { projectId, workspaceId, id } = req.params;
  const { columnId, order } = req.body;

  // Verify column exists in project
  const project = await Project.findById(projectId).lean();
  if (!project) throw new ApiError(404, "Project not found");

  const validColumn = project.columns.find((c) => c.id === columnId);
  if (!validColumn) {
    throw new ApiError(400, `Column "${columnId}" does not exist in this project`);
  }

  const task = await Task.findOne({ _id: id, project: projectId });
  if (!task) throw new ApiError(404, "Task not found");

  const fromColumn = task.columnId;
  task.columnId = columnId;
  task.order = order;
  await task.save(); // pre-save hook sets completedAt automatically

  io.to(`project:${projectId}`).emit("task:moved", {
    taskId: id,
    fromColumn,
    toColumn: columnId,
    order,
  });

  // Notify assignees when task is moved to done
  if (columnId === "done" && task.assignees?.length > 0) {
    const notifyPromises = task.assignees.map((assigneeId) =>
      createNotification({
        recipientId: assigneeId,
        actorId: req.user._id,
        type: "task_moved",
        message: `${req.user.name} marked "${task.title}" as done`,
        link: `/workspace/${workspaceId}/project/${projectId}/kanban`,
        workspaceId,
        projectId,
        taskId: task._id,
      })
    );
    await Promise.allSettled(notifyPromises);
  }

  await ActivityLog.create({
    workspace: workspaceId,
    project: projectId,
    actor: req.user._id,
    action: "moved_task",
    meta: {
      taskId: task._id,
      taskTitle: task.title,
      fromColumn,
      toColumn: columnId,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, { task }, "Task moved successfully"));
});

// ─── Reorder Tasks (bulk update within same column) ────────────────────────────
const reorderTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { tasks } = req.body;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    throw new ApiError(400, "tasks array is required");
  }

  // Single DB round trip for all reorders via bulkWrite
  const bulkOps = tasks.map(({ id, order }) => ({
    updateOne: {
      filter: { _id: id, project: projectId },
      update: { $set: { order } },
    },
  }));

  await Task.bulkWrite(bulkOps);

  io.to(`project:${projectId}`).emit("task:reordered", { tasks });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Tasks reordered successfully"));
});

// ─── Delete Task ──────────────────────────────────────────────────────────────
const deleteTask = asyncHandler(async (req, res) => {
  const { projectId, workspaceId, id } = req.params;

  const task = await Task.findOneAndDelete({ _id: id, project: projectId });
  if (!task) throw new ApiError(404, "Task not found");

  io.to(`project:${projectId}`).emit("task:deleted", { taskId: id });

  await ActivityLog.create({
    workspace: workspaceId,
    project: projectId,
    actor: req.user._id,
    action: "deleted_task",
    meta: { taskTitle: task.title, columnId: task.columnId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Task deleted successfully"));
});

export {
  createTask,
  getTasks,
  getTask,
  updateTask,
  moveTask,
  reorderTasks,
  deleteTask,
};