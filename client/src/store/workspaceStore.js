import { create } from "zustand";

/**
 * workspaceStore — UI state only.
 * Server state (workspace data, projects) lives in React Query cache.
 * This store only tracks which workspace is currently "active" in the UI
 * and the collapsed state of the sidebar workspace list.
 */
const useWorkspaceStore = create((set) => ({
  activeWorkspaceId: null,
  setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),
  clearActiveWorkspace: () => set({ activeWorkspaceId: null }),
}));

export default useWorkspaceStore;