
const ACTION_DOTS = {
  created: "bg-green-500",
  invited: "bg-blue-500",
  joined: "bg-blue-500",
  updated: "bg-yellow-500",
  deleted: "bg-red-500",
  removed: "bg-red-500",
  left: "bg-gray-500",
  moved: "bg-violet-500",
  completed: "bg-emerald-500",
  archived: "bg-orange-500",
  github: "bg-indigo-500",
};

export const getDotColor = (action = "") => {
  const key = Object.keys(ACTION_DOTS).find((k) => action.includes(k));
  return ACTION_DOTS[key] || "bg-gray-500";
};

const formatColumnName = (id = "") => id.replace(/-/g, " ");

export const describeActivity = (log) => {
  const actor = log.actor?.name || "Someone";
  const { action, meta = {} } = log;

  switch (action) {
    //  Workspace 
    case "created_workspace":
      return `${actor} created the workspace`;
    case "updated_workspace":
      return `${actor} updated the workspace${meta.name ? ` name to "${meta.name}"` : ""}`;
    case "invited_member":
      return `${actor} invited ${meta.invitedEmail || "someone"}${meta.role ? ` as ${meta.role}` : ""}`;

    //  Members 
    case "updated_member_role":
      return `${actor} changed a member's role to ${meta.newRole || "a new role"}`;
    case "removed_member":
      return `${actor} removed a member from the workspace`;
    case "left_workspace":
      return `${actor} left the workspace`;

    //  Projects ─
    case "created_project":
      return `${actor} created project "${meta.projectName}"`;
    case "updated_project":
      if (meta.updatedFields?.includes("status")) {
        return meta.status === "archived"
          ? `${actor} archived the project`
          : `${actor} restored the project`;
      }
      return `${actor} updated the project`;

    //  Tasks 
    case "created_task":
      return `${actor} created task "${meta.taskTitle}"`;
    case "updated_task":
      return `${actor} updated task "${meta.taskTitle}"`;
    case "moved_task":
      return `${actor} moved "${meta.taskTitle}" from ${formatColumnName(meta.fromColumn)} to ${formatColumnName(meta.toColumn)}`;
    case "deleted_task":
      return `${actor} deleted task "${meta.taskTitle}"`;

    //  GitHub webhook events 
    case "github_push":
      return `GitHub: ${meta.pusher || "Someone"} pushed ${meta.commitCount || 0} commit(s) to ${meta.branch || "a branch"}`;
    case "github_pr":
      return `GitHub: PR #${meta.prNumber} ${meta.prState || "updated"} by ${meta.author || "someone"} — "${meta.prTitle || ""}"`;

    default:
      return `${actor} ${action.replace(/_/g, " ")}`;
  }
};