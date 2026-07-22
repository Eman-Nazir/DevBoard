import { Router } from "express";
import {
  getProjectAnalytics,
  getWorkspaceAnalytics,
} from "../controllers/analytics.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";

const router = Router();

router.use(verifyJWT);


// GET /api/v1/workspaces/:workspaceId/projects/:projectId/analytics
router.get(
  "/workspaces/:workspaceId/projects/:projectId/analytics",
  checkRole(["admin", "member", "viewer"]),
  getProjectAnalytics
);

// GET /api/v1/workspaces/:workspaceId/analytics
router.get(
  "/workspaces/:workspaceId/analytics",
  checkRole(["admin", "member", "viewer"]),
  getWorkspaceAnalytics
);

export default router;