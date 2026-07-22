
import { Router } from "express";
import {
  getPlatformStats,
  getAllUsers,
  getAllWorkspaces,
  getAllProjects,
  deleteUser,
  getAdminLogs,
} from "../controllers/admin.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { superAdminOnly } from "../middleware/superAdmin.middleware.js";

const router = Router();

router.use(verifyJWT, superAdminOnly);

router.get("/stats", getPlatformStats);
router.get("/users", getAllUsers);
router.get("/workspaces", getAllWorkspaces);
router.get("/projects", getAllProjects);
router.get("/logs", getAdminLogs);
router.delete("/users/:id", deleteUser);

export default router;