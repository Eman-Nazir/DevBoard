import crypto from "crypto";
import { Project } from "../models/Project.model.js";
import { ActivityLog } from "../models/ActivityLog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { io } from "../index.js";

/**
 * Verifies the GitHub webhook signature (X-Hub-Signature-256 header).
 * This prevents anyone from sending fake webhook payloads to your endpoint.
 */
const verifyGithubSignature = (req) => {
  const signature = req.headers["x-hub-signature-256"];
  if (!signature) return false;

  const hmac = crypto.createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET);
  const digest = "sha256=" + hmac.update(JSON.stringify(req.body)).digest("hex");

  // timingSafeEqual prevents timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
};

// ─── GitHub Webhook Handler ────────────────────────────────────────────────────
const handleGithubWebhook = asyncHandler(async (req, res) => {
  // Verify signature first — reject anything that doesn't match
  if (!verifyGithubSignature(req)) {
    return res.status(401).json({ success: false, message: "Invalid webhook signature" });
  }

  const event = req.headers["x-github-event"];
  const payload = req.body;

  // Find the project linked to this GitHub repo
  const repoUrl = payload.repository?.html_url;
  if (!repoUrl) {
    return res.status(200).json(new ApiResponse(200, {}, "No repo URL in payload"));
  }

  const project = await Project.findOne({ githubRepo: repoUrl })
    .populate("workspace", "_id")
    .lean();

  if (!project) {
    // No project linked to this repo — acknowledge and ignore
    return res.status(200).json(new ApiResponse(200, {}, "No project linked to this repo"));
  }

  let action = null;
  let meta = {};

  // ── Handle push events ─────────────────────────────────────────────────────
  if (event === "push") {
    const branch = payload.ref?.replace("refs/heads/", "");
    const commits = payload.commits || [];
    const pusher = payload.pusher?.name || "Unknown";

    action = "github_push";
    meta = {
      branch,
      commitCount: commits.length,
      pusher,
      message: commits[0]?.message || "",
      repoName: payload.repository?.name,
    };
  }

  // ── Handle pull_request events ─────────────────────────────────────────────
  else if (event === "pull_request") {
    const pr = payload.pull_request;
    action = "github_pr";
    meta = {
      prTitle: pr?.title,
      prState: payload.action, // opened, closed, merged
      prNumber: pr?.number,
      author: pr?.user?.login,
      repoName: payload.repository?.name,
    };
  }

  // Unhandled event type — acknowledge and skip
  else {
    return res.status(200).json(new ApiResponse(200, {}, `Event ${event} acknowledged but not handled`));
  }

  // Save to activity log
  await ActivityLog.create({
    workspace: project.workspace._id,
    project: project._id,
    actor: project.createdBy || project.workspace._id,
    action,
    meta,
  });

  // Emit to all users viewing this project in real time
  io.to(`project:${project._id}`).emit("github:event", { event, meta });

  return res.status(200).json(new ApiResponse(200, {}, "Webhook processed"));
});

export { handleGithubWebhook };