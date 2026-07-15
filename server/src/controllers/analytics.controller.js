import mongoose from "mongoose";
import { Task } from "../models/Task.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ── Helpers ────────────────────────────────────────────────────────────────────
const toObjectId = (id) => new mongoose.Types.ObjectId(id);
const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

// ─── Project Analytics ─────────────────────────────────────────────────────────
const getProjectAnalytics = asyncHandler(async (req, res) => {
  const { projectId, workspaceId } = req.params;

  // Run all aggregations in parallel — single DB round trip
  const [
    tasksByStatus,
    tasksByPriority,
    burndownData,
    overdueTasks,
    memberVelocity,
  ] = await Promise.all([

    // Tasks grouped by column (status)
    Task.aggregate([
      {
        $match: {
          project: toObjectId(projectId),
          workspace: toObjectId(workspaceId),
        },
      },
      { $group: { _id: "$columnId", count: { $sum: 1 } } },
    ]),

    // Tasks grouped by priority
    Task.aggregate([
      { $match: { project: toObjectId(projectId) } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]),

    // Burndown — tasks created vs completed per day, last 14 days
    Task.aggregate([
      {
        $match: {
          project: toObjectId(projectId),
          createdAt: { $gte: daysAgo(14) },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          created: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $ne: ["$completedAt", null] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    // Overdue tasks — not done, past due date
    Task.countDocuments({
      project: toObjectId(projectId),
      columnId: { $ne: "done" },
      dueDate: { $lt: new Date(), $ne: null },
    }),

    // Velocity per member — completed tasks per assignee
    Task.aggregate([
      {
        $match: {
          project: toObjectId(projectId),
          columnId: "done",
          assignees: { $exists: true, $ne: [] },
        },
      },
      { $unwind: "$assignees" },
      {
        $group: {
          _id: "$assignees",
          completedTasks: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          name: "$user.name",
          avatar: "$user.avatar",
          completedTasks: 1,
        },
      },
      { $sort: { completedTasks: -1 } },
      { $limit: 10 },
    ]),
  ]);

  const totalTasks = tasksByStatus.reduce((sum, s) => sum + s.count, 0);
  const doneTasks = tasksByStatus.find((s) => s._id === "done")?.count || 0;
  const completionRate =
    totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        summary: { totalTasks, doneTasks, completionRate, overdueTasks },
        tasksByStatus,
        tasksByPriority,
        burndownData,
        memberVelocity,
      },
      "Project analytics fetched"
    )
  );
});

// ─── Workspace Analytics ───────────────────────────────────────────────────────
const getWorkspaceAnalytics = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  const [projectStats, tasksByPriority, recentActivity, weeklyCreated] =
    await Promise.all([

      // Tasks per project with completion rates
      Task.aggregate([
        { $match: { workspace: toObjectId(workspaceId) } },
        {
          $group: {
            _id: "$project",
            total: { $sum: 1 },
            done: {
              $sum: { $cond: [{ $eq: ["$columnId", "done"] }, 1, 0] },
            },
          },
        },
        {
          $lookup: {
            from: "projects",
            localField: "_id",
            foreignField: "_id",
            as: "project",
          },
        },
        { $unwind: { path: "$project", preserveNullAndEmpty: true } },
        {
          $project: {
            projectName: "$project.name",
            total: 1,
            done: 1,
            completionRate: {
              $cond: [
                { $gt: ["$total", 0] },
                {
                  $round: [
                    { $multiply: [{ $divide: ["$done", "$total"] }, 100] },
                    0,
                  ],
                },
                0,
              ],
            },
          },
        },
        { $sort: { total: -1 } },
      ]),

      // Priority distribution across workspace
      Task.aggregate([
        { $match: { workspace: toObjectId(workspaceId) } },
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]),

      // Tasks created per day — last 7 days
      Task.aggregate([
        {
          $match: {
            workspace: toObjectId(workspaceId),
            createdAt: { $gte: daysAgo(7) },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),

      // Total tasks created this week
      Task.countDocuments({
        workspace: toObjectId(workspaceId),
        createdAt: { $gte: daysAgo(7) },
      }),
    ]);

  const totalTasks = projectStats.reduce((sum, p) => sum + p.total, 0);
  const totalDone = projectStats.reduce((sum, p) => sum + p.done, 0);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        summary: {
          totalProjects: projectStats.length,
          totalTasks,
          totalDone,
          weeklyCreated,
          overallCompletion:
            totalTasks > 0 ? Math.round((totalDone / totalTasks) * 100) : 0,
        },
        projectStats,
        tasksByPriority,
        recentActivity,
      },
      "Workspace analytics fetched"
    )
  );
});

export { getProjectAnalytics, getWorkspaceAnalytics };