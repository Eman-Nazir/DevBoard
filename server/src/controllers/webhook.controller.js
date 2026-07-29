import crypto from "crypto";
import { Project } from "../models/Project.model.js";
import { ActivityLog } from "../models/ActivityLog.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { io } from "../index.js";


const verifyGithubSignature = (req) => {
  const signature = req.headers["x-hub-signature-256"];

  if (!signature) {
    console.log("No GitHub signature header");
    return false;
  }

  console.log("Secret:", process.env.GITHUB_WEBHOOK_SECRET);

  const hmac = crypto.createHmac(
    "sha256",
    process.env.GITHUB_WEBHOOK_SECRET
  );

  const digest = "sha256=" + hmac.update(req.body).digest("hex");

  console.log("GitHub Signature :", signature);
  console.log("Calculated Digest:", digest);
  console.log("Secret:", process.env.GITHUB_WEBHOOK_SECRET);
console.log("GitHub Signature:", signature);
console.log("Calculated Digest:", digest);

  const signatureBuffer = Buffer.from(signature);
  const digestBuffer = Buffer.from(digest);

  if (signatureBuffer.length !== digestBuffer.length) {
    console.log("Length mismatch");
    return false;
  }

  return crypto.timingSafeEqual(signatureBuffer, digestBuffer);
};




// ─── GitHub Webhook Handler ──────────
const handleGithubWebhook = asyncHandler(async (req, res) => {
  console.log("=== GitHub webhook reached ===");

  // Verify GitHub signature first
  if (!verifyGithubSignature(req)) {
    console.log(" Signature verification failed");
    return res.status(401).json({
      success: false,
      message: "Invalid webhook signature",
    });
  }

  console.log(" Signature verified");

  const event = req.headers["x-github-event"];
  console.log("Event:", event);

  // req.body is a Buffer because we used express.raw()
  const payload = JSON.parse(req.body.toString());

  const repoUrl = payload.repository?.html_url;
  console.log("Repo URL:", repoUrl);

  if (!repoUrl) {
    console.log("No repository URL");
    return res.status(200).json(
      new ApiResponse(200, {}, "No repo URL in payload")
    );
  }

  console.log("Before Project.findOne()");

  const project = await Project.findOne({
    githubRepo: repoUrl,
  })
    .populate({
      path: "workspace",
      select: "_id owner",
    })
    .lean();

  console.log("After Project.findOne()");

  if (!project) {
    console.log("No linked project");
    return res.status(200).json(
      new ApiResponse(200, {}, "No project linked to this repo")
    );
  }

  console.log("Project found:", project._id);

  const actorId =
    project.createdBy ||
    project.workspace?.owner;

  console.log("Actor:", actorId);

  if (!actorId) {
    console.log("No actor found");
    return res.status(200).json(
      new ApiResponse(
        200,
        {},
        "No valid actor for this event, skipped logging"
      )
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
    console.log("Unhandled event:", event);

    return res.status(200).json(
      new ApiResponse(
        200,
        {},
        `Event ${event} acknowledged but not handled`
      )
    );
  }

  console.log("Before ActivityLog.create()");

  await ActivityLog.create({
    workspace: project.workspace._id,
    project: project._id,
    actor: actorId,
    action,
    meta,
  });

  console.log("After ActivityLog.create()");

  console.log("Before socket emit");

  io.to(`project:${project._id}`).emit("github:event", {
    event,
    meta,
  });

  console.log("After socket emit");

  console.log("Sending success response");

  return res.status(200).json(
    new ApiResponse(200, {}, "Webhook processed")
  );
});


export {
  handleGithubWebhook
};