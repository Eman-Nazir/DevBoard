import { create } from "zustand";

const useUIStore = create((set) => ({
  sidebarOpen: true,        
  mobileSidebarOpen: false, 
  activeModal: null,
  workspaceSwitcherOpen: false,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (val) => set({ sidebarOpen: val }),

  toggleMobileSidebar: () => set((state) => ({ mobileSidebarOpen: !state.mobileSidebarOpen })),
  openMobileSidebar: () => set({ mobileSidebarOpen: true }),
  closeMobileSidebar: () => set({ mobileSidebarOpen: false }),

  openModal: (name) => set({ activeModal: name }),
  closeModal: () => set({ activeModal: null }),

  toggleWorkspaceSwitcher: () =>
    set((state) => ({ workspaceSwitcherOpen: !state.workspaceSwitcherOpen })),
  openWorkspaceSwitcher: () => set({ workspaceSwitcherOpen: true }),
  closeWorkspaceSwitcher: () => set({ workspaceSwitcherOpen: false }),
}));

export default useUIStore;