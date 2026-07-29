import { Router } from "express";
import { handleGithubWebhook } from "../controllers/webhook.controller.js";

const router = Router();

router.use((req, res, next) => {
  console.log("Webhook route hit:", req.method, req.originalUrl);
  next();
});

router.post("/github", handleGithubWebhook);

export default router;