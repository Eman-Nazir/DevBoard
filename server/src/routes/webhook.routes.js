import { Router } from "express";
import { handleGithubWebhook } from "../controllers/webhook.controller.js";

const router = Router();


//   POST /api/v1/webhooks/github
 
router.post("/github", handleGithubWebhook);

export default router;