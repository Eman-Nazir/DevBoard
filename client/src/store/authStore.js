import { create } from "zustand";

const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),

  setAuth: (user, accessToken) => {
    localStorage.setItem("accessToken", accessToken);
    set({ user, accessToken, isAuthenticated: true });
  },

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem("accessToken");
    set({ user: null, accessToken: null, isAuthenticated: false });
  },
}));

window.addEventListener("auth:logout", () => {
  useAuthStore.getState().logout();
  if (!window.location.pathname.includes("/login")) {
    window.location.href = "/login";
  }
});

export default useAuthStore;