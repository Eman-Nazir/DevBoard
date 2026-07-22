import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FolderKanban, Users,
  Settings, Plus, ChevronDown, LogOut, Menu, X,
} from "lucide-react";
import { useGetMyWorkspaces, useGetProjects } from "../../hooks/useWorkspace.js";
import { useLogout } from "../../hooks/useAuth.js";
import useAuthStore from "../../store/authStore.js";
import useUIStore from "../../store/uiStore.js";

const Sidebar = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    sidebarOpen, toggleSidebar, openModal, openWorkspaceSwitcher,
    mobileSidebarOpen, closeMobileSidebar,
  } = useUIStore();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const [workspacesOpen, setWorkspacesOpen] = useState(true);

  const { data: workspaces = [] } = useGetMyWorkspaces();
  const { data: projects = [] } = useGetProjects(workspaceId);

  const activeWorkspace = workspaces.find((w) => w._id === workspaceId);
  const isMac = typeof navigator !== "undefined" && navigator.platform?.toUpperCase().includes("MAC");

  const goTo = (path) => {
    navigate(path);
    closeMobileSidebar();
  };

  return (
    <>
      <AnimatePresence>
        {mobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileSidebar}
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 60 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={`
          fixed md:static inset-y-0 left-0 z-50
          h-screen bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden flex-shrink-0
          transition-transform duration-200 ease-in-out
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
      >
        {/* ── Header  */}
        <div className="flex items-center justify-between px-3 h-14 border-b border-gray-800 flex-shrink-0">
          <AnimatePresence>
            {(sidebarOpen || mobileSidebarOpen) && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center gap-2 overflow-hidden"
              >
                <div className="w-7 h-7 bg-violet-600 rounded-md flex items-center justify-center flex-shrink-0">
                  <LayoutDashboard size={14} className="text-white" />
                </div>
                <span className="text-white font-semibold text-sm tracking-tight whitespace-nowrap">
                  DevBoard
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Desktop collapse toggle — hidden on mobile */}
          <button
            onClick={toggleSidebar}
            className="hidden md:block p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex-shrink-0"
          >
            <Menu size={16} />
          </button>

          {/* Mobile close button — only visible inside the mobile drawer */}
          <button
            onClick={closeMobileSidebar}
            className="md:hidden p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex-shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Nav  */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {/* Dashboard */}
          <button
            onClick={() => goTo("/dashboard")}
            className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors text-left text-gray-400 hover:text-white hover:bg-gray-800`}
          >
            <LayoutDashboard size={16} className="flex-shrink-0" />
            <AnimatePresence>
              {(sidebarOpen || mobileSidebarOpen) && (
                <motion.span
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="whitespace-nowrap overflow-hidden"
                >
                  Dashboard
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {/* Workspaces list */}
          {(sidebarOpen || mobileSidebarOpen) && (
            <div className="pt-4">
              <button
                onClick={() => setWorkspacesOpen((prev) => !prev)}
                className="w-full flex items-center justify-between px-2.5 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider hover:text-gray-300 transition-colors"
              >
                <span>Workspaces</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${workspacesOpen ? "rotate-0" : "-rotate-90"}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {workspacesOpen && (
                  <motion.div
                    key="ws-list"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="mt-1 space-y-0.5 overflow-hidden"
                  >
                    {workspaces.map((ws) => (
                      <button
                        key={ws._id}
                        onClick={() => goTo(`/workspace/${ws._id}`)}
                        className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors text-left ${
                          workspaceId === ws._id
                            ? "bg-gray-800 text-white"
                            : "text-gray-400 hover:text-white hover:bg-gray-800"
                        }`}
                      >
                        <div className="w-5 h-5 rounded bg-violet-600/30 flex items-center justify-center text-violet-400 text-xs font-bold flex-shrink-0">
                          {ws.name[0].toUpperCase()}
                        </div>
                        <span className="truncate text-xs">{ws.name}</span>
                      </button>
                    ))}

                    <button
                      onClick={() => { openModal("createWorkspace"); closeMobileSidebar(); }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                      <Plus size={14} className="flex-shrink-0" />
                      <span className="text-xs">New workspace</span>
                    </button>

                    <button
                      onClick={() => { openWorkspaceSwitcher(); closeMobileSidebar(); }}
                      className="hidden md:flex w-full items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                      <span className="text-xs">Quick switch</span>
                      <kbd className="text-xs text-gray-600 bg-gray-800 border border-gray-700 rounded px-1.5 py-0.5">
                        {isMac ? "⌘K" : "Ctrl K"}
                      </kbd>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Active workspace projects */}
          {(sidebarOpen || mobileSidebarOpen) && workspaceId && projects.length > 0 && (
            <div className="pt-4">
              <p className="px-2.5 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider truncate">
                {activeWorkspace?.name || "Projects"}
              </p>
              <div className="mt-1 space-y-0.5">
                {projects.map((project) => (
                  <button
                    key={project._id}
                    onClick={() => goTo(`/workspace/${workspaceId}/project/${project._id}/kanban`)}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors text-left text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <FolderKanban size={14} className="flex-shrink-0" />
                    <span className="truncate text-xs">{project.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Workspace-level nav */}
          {(sidebarOpen || mobileSidebarOpen) && workspaceId && (
            <div className="pt-4 space-y-0.5 border-t border-gray-800 mt-2">
              <button
                onClick={() => goTo(`/workspace/${workspaceId}/members`)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors text-left text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Users size={15} className="flex-shrink-0" />
                <span className="text-xs">Members</span>
              </button>
              <button
                onClick={() => goTo(`/workspace/${workspaceId}/settings`)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors text-left text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <Settings size={15} className="flex-shrink-0" />
                <span className="text-xs">Settings</span>
              </button>
            </div>
          )}
        </div>

        {/* ── User footer  */}
        <div className="border-t border-gray-800 p-3 flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <AnimatePresence>
              {(sidebarOpen || mobileSidebarOpen) && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex-1 min-w-0"
                >
                  <p className="text-white text-xs font-medium truncate">{user?.name}</p>
                  <p className="text-gray-500 text-xs truncate">{user?.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {(sidebarOpen || mobileSidebarOpen) && (
                <motion.button
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  onClick={() => logout()}
                  disabled={loggingOut}
                  title="Logout"
                  className="p-1.5 rounded-md text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-colors disabled:opacity-50 flex-shrink-0"
                >
                  <LogOut size={14} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;