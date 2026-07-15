import { Router } from "express";
import { handleGithubWebhook } from "../controllers/webhook.controller.js";

const router = Router();

/**
 * POST /api/v1/webhooks/github
 *
 * Public endpoint — GitHub calls this directly (no JWT auth).
 * Security is handled inside the controller via X-Hub-Signature-256 verification.
 *
 * Setup in GitHub:
 * 1. Go to your repo → Settings → Webhooks → Add webhook
 * 2. Payload URL: https://your-domain.com/api/v1/webhooks/github
 * 3. Content type: application/json
 * 4. Secret: value of GITHUB_WEBHOOK_SECRET in your .env
 * 5. Events: push + pull_request
 */
router.post("/github", handleGithubWebhook);

export default router;