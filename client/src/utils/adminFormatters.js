
export const PRIORITY_COLORS = {
  low: "bg-green-500",
  medium: "bg-yellow-500",
  high: "bg-orange-500",
  urgent: "bg-red-500",
};

export const COLUMN_COLORS = {
  todo: "bg-indigo-500",
  "in-progress": "bg-amber-500",
  "in-review": "bg-blue-500",
  done: "bg-emerald-500",
};

export const COLUMN_LABELS = {
  todo: "Todo",
  "in-progress": "In Progress",
  "in-review": "In Review",
  done: "Done",
};

export const formatColumnName = (id = "") => id.replace(/-/g, " ");

//  Admin action log 
const OUTCOME_LABELS = {
  ownership_transferred: "ownership transferred to another admin",
  member_promoted_to_owner: "a member was promoted to owner",
  workspace_deleted: "workspace deleted (no other members)",
};

export const describeAdminLog = (log) => {
  const admin = log.admin?.name || "An admin";
  const { action, meta = {} } = log;

  switch (action) {
    case "deleted_user": {
      const affected = meta.affectedWorkspaces || [];
      if (affected.length === 0) {
        return `${admin} deleted user ${meta.deletedUserName || ""} (${meta.deletedUserEmail || "unknown email"})`;
      }
      const details = affected
        .map((w) => `"${w.name}" — ${OUTCOME_LABELS[w.outcome] || w.outcome}`)
        .join("; ");
      return `${admin} deleted user ${meta.deletedUserName || ""} (${meta.deletedUserEmail || "unknown email"}). ${affected.length} workspace${affected.length > 1 ? "s" : ""} affected: ${details}`;
    }
    default:
      return `${admin} ${action.replace(/_/g, " ")}`;
  }
};