import { Notification } from "../models/Notification.model.js";
import { io } from "../index.js";

/**
 * createNotification
 *
 * Creates a notification document and immediately emits it
 * to the recipient's personal socket room (user:userId).
 *
 * Used by task.controller, workspace.controller, member.controller.
 * Never throws — notification failure should never break the main action.
 *
 * @param {object} params
 * @param {string} params.recipientId  - User who receives the notification
 * @param {string} params.actorId      - User who triggered the action
 * @param {string} params.type         - Notification type enum value
 * @param {string} params.message      - Human-readable message
 * @param {string} params.link         - Frontend deep link
 * @param {string} [params.workspaceId]
 * @param {string} [params.projectId]
 * @param {string} [params.taskId]
 */
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

    // Emit to recipient's personal room — they see it instantly
    io.to(`user:${recipientId}`).emit("notification:new", { notification });
  } catch (error) {
    // Silent fail — log but never crash the parent request
    console.error("[Notification] Failed to create:", error.message);
  }
};

export { createNotification };