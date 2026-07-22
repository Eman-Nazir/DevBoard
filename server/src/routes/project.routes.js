import { Router } from "express";
import {
  createProject,
  getProjects,
  getArchivedProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/project.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { checkRole } from "../middleware/role.middleware.js";
import { validateCreateProject } from "../validators/project.validator.js";


const router = Router({ mergeParams: true });

router.use(verifyJWT);

// Active projects
router.post("/", checkRole(["admin", "member"]), validateCreateProject, createProject);
router.get("/", checkRole(["admin", "member", "viewer"]), getProjects);

// Archived projects — must be before /:id route
router.get("/archived", checkRole(["admin", "member", "viewer"]), getArchivedProjects);

// Single project
router.get("/:id", checkRole(["admin", "member", "viewer"]), getProject);
router.patch("/:id", checkRole(["admin", "member"]), updateProject);
router.delete("/:id", checkRole(["admin"]), deleteProject);


export default router;




