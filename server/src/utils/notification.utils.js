import { Notification } from "../models/Notification.model.js";
import { io } from "../index.js";


const createNotification = async ({
  recipientId,
  actorId,
  type,
  message,
  link = "/dashboard",
  workspaceId = null,
  projectId = null,
  taskId = null,
}) => {
  try {
    // Never notify yourself
    if (recipientId.toString() === actorId.toString()) return;

    const notification = await Notification.create({
      recipient: recipientId,
      actor: actorId,
      type,
      message,
      link,
      workspace: workspaceId,
      project: projectId,
      task: taskId,
    });

    // Populate actor for the socket payload
    await notification.populate("actor", "name avatar");

    // Emit to recipient  personal room  they see it instantly
    io.to(`user:${recipientId}`).emit("notification:new", { notification });
  } catch (error) {
    // Silent fail — log but never crash the parent request
    console.error("[Notification] Failed to create:", error.message);
  }
};

export { createNotification };