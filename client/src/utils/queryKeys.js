
export const queryKeys = {
  // Auth
  auth: {
    me: () => ["auth", "me"],
  },

  // Workspaces
  workspaces: {
    all: () => ["workspaces"],
    detail: (id) => ["workspaces", id],
    members: (workspaceId) => ["workspaces", workspaceId, "members"],
    activity: (workspaceId) => ["workspaces", workspaceId, "activity"],
  },

  // Projects
  projects: {
    byWorkspace: (workspaceId) => ["projects", "workspace", workspaceId],
    detail: (id) => ["projects", id],
  },

  // Tasks
  tasks: {
    byProject: (projectId) => ["tasks", "project", projectId],
    detail: (id) => ["tasks", id],
  },

  // Notifications
  notifications: {
    all: () => ["notifications"],
    unreadCount: () => ["notifications", "unread-count"],
  },

  // Analytics
  analytics: {
    project: (projectId) => ["analytics", "project", projectId],
    workspace: (workspaceId) => ["analytics", "workspace", workspaceId],
  },
};