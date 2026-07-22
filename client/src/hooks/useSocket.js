import { useEffect } from "react";
import { io } from "socket.io-client";
import useAuthStore from "../store/authStore.js";

let socketInstance = null;

export const useSocket = () => {
  const { accessToken } = useAuthStore();

  if (!socketInstance && accessToken) {
    socketInstance = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token: accessToken },
      transports: ["websocket"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    socketInstance.on("connect", () => {
      console.log("[Socket] Connected:", socketInstance.id);
    });

    socketInstance.on("connect_error", (err) => {
      console.error("[Socket] Connection error:", err.message);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
    });
  }

  return socketInstance;
};

export const useProjectSocket = (projectId, handlers) => {
  const socket = useSocket();

  useEffect(() => {
    if (!socket || !projectId) return;

    socket.emit("join:project", projectId);

    if (handlers.onTaskCreated) socket.on("task:created", handlers.onTaskCreated);
    if (handlers.onTaskUpdated) socket.on("task:updated", handlers.onTaskUpdated);
    if (handlers.onTaskMoved) socket.on("task:moved", handlers.onTaskMoved);
    if (handlers.onTaskDeleted) socket.on("task:deleted", handlers.onTaskDeleted);
    if (handlers.onTaskReordered) socket.on("task:reordered", handlers.onTaskReordered);
    //  presence — fired whenever someone joins/leaves this project room
    if (handlers.onPresenceUpdate) socket.on("presence:update", handlers.onPresenceUpdate);

    return () => {
      socket.emit("leave:project", projectId);
      socket.off("task:created");
      socket.off("task:updated");
      socket.off("task:moved");
      socket.off("task:deleted");
      socket.off("task:reordered");
      socket.off("presence:update");
    };
  }, [socket, projectId]);
};