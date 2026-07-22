import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      default: "",
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    columnId: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    assignees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    labels: [
      {
        type: String,
        trim: true,
        maxlength: 30,
      },
    ],
    dueDate: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// ── Indexes 
taskSchema.index({ project: 1, columnId: 1, order: 1 });
taskSchema.index({ workspace: 1, createdAt: -1 });
taskSchema.index({ assignees: 1 });
taskSchema.index({ dueDate: 1 });

taskSchema.pre("save", async function () {
  if (!this.isModified("columnId")) return;

  if (this.columnId === "done" && !this.completedAt) {
    this.completedAt = new Date();
  } else if (this.columnId !== "done") {
    this.completedAt = null;
  }
});

const Task = mongoose.model("Task", taskSchema);

export { Task };