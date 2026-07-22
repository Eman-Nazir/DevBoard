import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "task_assigned",    // Someone assigned you to a task
        "task_moved",       // A task you are assigned to was moved
        "task_updated",     // A task you are assigned to was updated
        "member_invited",   // You were added to a workspace
        "member_removed",   // You were removed from a workspace
        "project_created",  // A new project was created in your workspace
        "workspace_ownership_transferred", // You became owner/admin after the previous owner account was deleted
      ],
    },
    message: {
      type: String,
      required: true,
      maxlength: 300,
    },
    // — frontend navigates here when notification is clicked
    link: {
      type: String,
      default: "/dashboard",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    // Context refs  optional for building rich notification UI
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      default: null,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      default: null,
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, isRead: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

export { Notification };