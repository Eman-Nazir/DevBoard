
import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    targetType: {
      type: String,
      enum: ["User", "Workspace", "Project", "Task"],
      required: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    meta: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

adminLogSchema.index({ admin: 1, createdAt: -1 });
adminLogSchema.index({ createdAt: -1 });

const AdminLog = mongoose.model("AdminLog", adminLogSchema);

export { AdminLog };