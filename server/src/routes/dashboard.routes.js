import { Router } from "express";
import { getMyActivity } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// GET /api/v1/dashboard/activity
router.get("/activity", getMyActivity);

export default router;