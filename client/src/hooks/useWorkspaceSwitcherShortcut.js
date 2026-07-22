import { useEffect } from "react";
import useUIStore from "../store/uiStore.js";

export const useWorkspaceSwitcherShortcut = () => {
  const toggleWorkspaceSwitcher = useUIStore((s) => s.toggleWorkspaceSwitcher);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isShortcut = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k";
      if (isShortcut) {
        e.preventDefault();
        toggleWorkspaceSwitcher();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleWorkspaceSwitcher]);
};