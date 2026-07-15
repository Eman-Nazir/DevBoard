import { Router } from "express";
import {
  createWorkspace,
  getMyWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  inviteMember,
  joinByInviteCode,
  getActivityLog,
} from "../controllers/workspace.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";
import {
  validateCreateWorkspace,
  validateUpdateWorkspace,
  validateInviteMember,
} from "../validators/workspace.validator.js";

const router = Router();

router.use(verifyJWT); // All workspace routes require authentication

// ── Public workspace actions ───────────────────────────────────────────────────
router.post("/", validateCreateWorkspace, createWorkspace);
router.get("/", getMyWorkspaces);
router.post("/join/:code", joinByInviteCode);

// ── Workspace-specific actions (role-checked) ──────────────────────────────────
router.get("/:id", checkRole(["admin", "member", "viewer"]), getWorkspace);
router.patch("/:id", checkRole(["admin"]), validateUpdateWorkspace, updateWorkspace);
router.delete("/:id", deleteWorkspace); // Owner-only check is inside the controller
router.post("/:id/invite", checkRole(["admin"]), validateInviteMember, inviteMember);
router.get("/:id/activity", checkRole(["admin", "member", "viewer"]), getActivityLog);

export default router;