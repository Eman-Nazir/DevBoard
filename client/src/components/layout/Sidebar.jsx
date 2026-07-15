import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, FolderKanban, Users,
  Settings, Plus, ChevronDown, LogOut, Menu,
} from "lucide-react";
import { useGetMyWorkspaces, useGetProjects } from "../../hooks/useWorkspace.js";
import { useLogout } from "../../hooks/useAuth.js";
import useAuthStore from "../../store/authStore.js";
import useUIStore from "../../store/uiStore.js";

const Sidebar = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { sidebarOpen, toggleSidebar, openModal } = useUIStore();
  const { mutate: logout, isPending: loggingOut } = useLogout();
  const [workspacesOpen, setWorkspacesOpen] = useState(true);

  const { data: workspaces = [] } = useGetMyWorkspaces();
  const { data: projects = [] } = useGetProjects(workspaceId);

  const activeWorkspace = workspaces.find((w) => w._id === workspaceId);

  return (
    <motion.aside
      animate={{ width: sidebarOpen ? 240 : 60 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-screen bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden flex-shrink-0"
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-3 h-14 border-b border-gray-800 flex-shrink-0">
        <AnimatePresence>
          {sidebarOpen && (
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
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 transition-colors flex-shrink-0"
        >
          <Menu size={16} />
        </button>
      </div>

      {/* ── Nav ────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
              isActive
                ? "bg-violet-600/20 text-violet-400"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`
          }
        >
          <LayoutDashboard size={16} className="flex-shrink-0" />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="whitespace-nowrap overflow-hidden"
              >
                Dashboard
              </motion.span>
            )}
          </AnimatePresence>
        </NavLink>

        {/* Workspaces list */}
        {sidebarOpen && (
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
                      onClick={() => navigate(`/workspace/${ws._id}`)}
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
                    onClick={() => openModal("createWorkspace")}
                    className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
                  >
                    <Plus size={14} className="flex-shrink-0" />
                    <span className="text-xs">New workspace</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Active workspace projects */}
        {sidebarOpen && workspaceId && projects.length > 0 && (
          <div className="pt-4">
            <p className="px-2.5 py-1 text-xs font-medium text-gray-500 uppercase tracking-wider truncate">
              {activeWorkspace?.name || "Projects"}
            </p>
            <div className="mt-1 space-y-0.5">
              {projects.map((project) => (
                <NavLink
                  key={project._id}
                  to={`/workspace/${workspaceId}/project/${project._id}/kanban`}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-violet-600/20 text-violet-400"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`
                  }
                >
                  <FolderKanban size={14} className="flex-shrink-0" />
                  <span className="truncate text-xs">{project.name}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Workspace-level nav */}
        {sidebarOpen && workspaceId && (
          <div className="pt-4 space-y-0.5 border-t border-gray-800 mt-2">
            <NavLink
              to={`/workspace/${workspaceId}/members`}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-violet-600/20 text-violet-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`
              }
            >
              <Users size={15} className="flex-shrink-0" />
              <span className="text-xs">Members</span>
            </NavLink>
            <NavLink
              to={`/workspace/${workspaceId}/settings`}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-violet-600/20 text-violet-400"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`
              }
            >
              <Settings size={15} className="flex-shrink-0" />
              <span className="text-xs">Settings</span>
            </NavLink>
          </div>
        )}
      </div>

      {/* ── User footer ─────────────────────────────────────────────── */}
      <div className="border-t border-gray-800 p-3 flex-shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <AnimatePresence>
            {sidebarOpen && (
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
            {sidebarOpen && (
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
  );
};

export default Sidebar;