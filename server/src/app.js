import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import { errorMiddleware } from "./middleware/error.middleware.js";
import { apiLimiter } from "./middleware/rateLimiter.js";

import authRoutes from "./routes/auth.routes.js";
import workspaceRoutes from "./routes/workspace.routes.js";
import memberRoutes from "./routes/member.routes.js";
import projectRoutes from "./routes/project.routes.js";
import taskRoutes from "./routes/task.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import analyticsRoutes from "./routes/analytics.routes.js";
import webhookRoutes from "./routes/webhook.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

// ── Security 
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(apiLimiter);

// ── Body parsing 
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ── Logging ─────
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── Health check 
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "ok",
    message: "DevBoard API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ── Routes ──────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/workspaces", workspaceRoutes);
app.use("/api/v1/workspaces/:workspaceId/members", memberRoutes);
app.use("/api/v1/workspaces/:workspaceId/projects", projectRoutes);
app.use("/api/v1/workspaces/:workspaceId/projects/:projectId/tasks", taskRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1", analyticsRoutes);
app.use("/api/v1/webhooks", webhookRoutes); 
app.use("/api/v1/admin", adminRoutes); 
app.use("/api/v1/dashboard", dashboardRoutes);
// ── 404 handler ─
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ── Global error handler 
app.use(errorMiddleware);

export { app };