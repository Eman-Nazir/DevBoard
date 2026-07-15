import mongoose from "mongoose";
import crypto from "crypto";

const workspaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Workspace name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
      default: "",
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    inviteCode: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Use async — no next() parameter needed in modern Mongoose
workspaceSchema.pre("save", async function () {
  if (!this.isNew) return;

  this.slug =
    this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") +
    "-" +
    Date.now();

  this.inviteCode = crypto.randomBytes(6).toString("hex");
});

const Workspace = mongoose.model("Workspace", workspaceSchema);

export { Workspace };