import { create } from "zustand";


const useWorkspaceStore = create((set) => ({
  activeWorkspaceId: null,
  setActiveWorkspaceId: (id) => set({ activeWorkspaceId: id }),
  clearActiveWorkspace: () => set({ activeWorkspaceId: null }),
}));

export default useWorkspaceStore;