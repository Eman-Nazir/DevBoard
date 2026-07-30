import crypto from "crypto";
import { Project } from "../models/Project.model.js";
import { ActivityLog } from "../models/ActivityLog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { io } from "../index.js";

const verifyGithubSignature = (req) => {
  const signature = req.headers["x-hub-signature-256"];

  if (!signature) {
    return false;
  }

  const hmac = crypto.createHmac("sha256", process.env.GITHUB_WEBHOOK_SECRET);
  const digest = "sha256=" + hmac.update(req.body).digest("hex");

  const signatureBuffer = Buffer.from(signature);
  const digestBuffer = Buffer.from(digest);

  if (signatureBuffer.length !== digestBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(signatureBuffer, digestBuffer);
};

// ─── GitHub Webhook Handler ──────────
const handleGithubWebhook = asyncHandler(async (req, res) => {
  if (!verifyGithubSignature(req)) {
    return res.status(401).json({
      success: false,
      message: "Invalid webhook signature",
    });
  }

  const event = req.headers["x-github-event"];

  // req.body is a Buffer because we used express.raw()
  const payload = JSON.parse(req.body.toString());

  const repoUrl = payload.repository?.html_url;

  if (!repoUrl) {
    return res.status(200).json(new ApiResponse(200, {}, "No repo URL in payload"));
  }

  const project = await Project.findOne({ githubRepo: repoUrl })
    .populate({ path: "workspace", select: "_id owner" })
    .lean();

  if (!project) {
    return res.status(200).json(new ApiResponse(200, {}, "No project linked to this repo"));
  }

  const actorId = project.createdBy || project.workspace?.owner;

  if (!actorId) {
    return res.status(200).json(
      new ApiResponse(200, {}, "No valid actor for this event, skipped logging")
    );
  }

  let action = null;
  let meta = {};

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
  } else if (event === "pull_request") {
    const pr = payload.pull_request;

    action = "github_pr";
    meta = {
      prTitle: pr?.title,
      prState: payload.action,
      prNumber: pr?.number,
      author: pr?.user?.login,
      repoName: payload.repository?.name,
    };
  } else {
    return res.status(200).json(
      new ApiResponse(200, {}, `Event ${event} acknowledged but not handled`)
    );
  }

  await ActivityLog.create({
    workspace: project.workspace._id,
    project: project._id,
    actor: actorId,
    action,
    meta,
  });

  io.to(`project:${project._id}`).emit("github:event", { event, meta });

  return res.status(200).json(new ApiResponse(200, {}, "Webhook processed"));
});

export { handleGithubWebhook };