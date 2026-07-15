import { Router } from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  moveTask,
  reorderTasks,
  deleteTask,
} from "../controllers/task.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";
import { validateCreateTask, validateMoveTask } from "../validators/task.validator.js";

const router = Router({ mergeParams: true }); // inherit workspaceId + projectId from parent

router.use(verifyJWT);

// GET  /workspaces/:workspaceId/projects/:projectId/tasks
router.get("/", checkRole(["admin", "member", "viewer"]), getTasks);

// POST /workspaces/:workspaceId/projects/:projectId/tasks
router.post("/", checkRole(["admin", "member"]), validateCreateTask, createTask);

// GET  /workspaces/:workspaceId/projects/:projectId/tasks/:id
router.get("/:id", checkRole(["admin", "member", "viewer"]), getTask);

// PATCH /workspaces/:workspaceId/projects/:projectId/tasks/:id
router.patch("/:id", checkRole(["admin", "member"]), updateTask);

// PATCH /workspaces/:workspaceId/projects/:projectId/tasks/:id/move
router.patch("/:id/move", checkRole(["admin", "member"]), validateMoveTask, moveTask);

// PATCH /workspaces/:workspaceId/projects/:projectId/tasks/reorder
router.patch("/reorder", checkRole(["admin", "member"]), reorderTasks);

// DELETE /workspaces/:workspaceId/projects/:projectId/tasks/:id
router.delete("/:id", checkRole(["admin"]), deleteTask);

export default router;