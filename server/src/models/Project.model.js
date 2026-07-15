import mongoose from "mongoose";

const columnSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  order: { type: Number, required: true },
  color: { type: String, default: "#6366f1" },
});

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
      default: "",
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
    },
    githubRepo: {
      type: String,
      default: "",
    },
    columns: {
      type: [columnSchema],
      default: [
        { id: "todo", title: "Todo", order: 0, color: "#6366f1" },
        { id: "in-progress", title: "In Progress", order: 1, color: "#f59e0b" },
        { id: "in-review", title: "In Review", order: 2, color: "#3b82f6" },
        { id: "done", title: "Done", order: 3, color: "#10b981" },
      ],
    },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);

export { Project };