import { Router } from "express";
import {
  getMembers,
  updateMemberRole,
  removeMember,
} from "../controllers/member.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";

const router = Router({ mergeParams: true }); // inherit :workspaceId from parent

router.use(verifyJWT);

// GET /workspaces/:workspaceId/members — all roles can view
router.get("/", checkRole(["admin", "member", "viewer"]), getMembers);

// PATCH /workspaces/:workspaceId/members/:userId — only admins can change roles
router.patch("/:userId", checkRole(["admin"]), updateMemberRole);

// DELETE /workspaces/:workspaceId/members/:userId
// admin → can remove anyone | member/viewer → can only remove themselves (enforced in controller)
router.delete("/:userId", checkRole(["admin", "member", "viewer"]), removeMember);

export default router;