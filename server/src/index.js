import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { app } from "./app.js";
import { connectDB } from "./db/connectDB.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: process.env.CLIENT_URL, credentials: true },
});

// ─── Socket.io auth middleware — verify JWT on every connection 
io.use((socket, next) => {
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.headers?.authorization?.replace("Bearer ", "");

  if (!token) {
    return next(new Error("Authentication required"));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.userId = decoded._id;
    next();
  } catch {
    next(new Error("Invalid token"));
  }
});

const projectPresence = new Map(); 
const addPresence = (projectId, userId) => {
  if (!projectPresence.has(projectId)) projectPresence.set(projectId, new Map());
  const counts = projectPresence.get(projectId);
  counts.set(userId, (counts.get(userId) || 0) + 1);
};

const removePresence = (projectId, userId) => {
  const counts = projectPresence.get(projectId);
  if (!counts) return;
  const next = (counts.get(userId) || 1) - 1;
  if (next <= 0) {
    counts.delete(userId);
  } else {
    counts.set(userId, next);
  }
  if (counts.size === 0) projectPresence.delete(projectId);
};

const broadcastPresence = (projectId) => {
  const counts = projectPresence.get(projectId);
  const userIds = counts ? Array.from(counts.keys()) : [];
  io.to(`project:${projectId}`).emit("presence:update", userIds);
};

// ─── Socket.io events ─────────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id} (user: ${socket.userId})`);

  const joinedProjects = new Set();

  socket.join(`user:${socket.userId}`);

  socket.on("join:project", (projectId) => {
    socket.join(`project:${projectId}`);
    joinedProjects.add(projectId);
    addPresence(projectId, socket.userId);
    broadcastPresence(projectId);
  });

  socket.on("leave:project", (projectId) => {
    socket.leave(`project:${projectId}`);
    joinedProjects.delete(projectId);
    removePresence(projectId, socket.userId);
    broadcastPresence(projectId);
  });

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
    // Clean up presence for every project this socket was viewing
    for (const projectId of joinedProjects) {
      removePresence(projectId, socket.userId);
      broadcastPresence(projectId);
    }
  });
});

export { io };

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
});