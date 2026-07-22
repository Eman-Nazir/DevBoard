import { Outlet } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import WorkspaceSwitcherModal from "./WorkspaceSwitcherModal.jsx";
import useUIStore from "../../store/uiStore.js";
import { useWorkspaceSwitcherShortcut } from "../../hooks/useWorkspaceSwitcherShortcut.js";
import CreateWorkspaceModal from "../../pages/modals/CreateWorkspaceModal.jsx";
import CreateProjectModal from "../../pages/modals/CreateProjectModal.jsx";

const DashboardLayout = () => {
  const { activeModal, closeModal, workspaceSwitcherOpen, closeWorkspaceSwitcher } = useUIStore();

  useWorkspaceSwitcherShortcut();

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <AnimatePresence>
        {activeModal === "createWorkspace" && (
          <CreateWorkspaceModal onClose={closeModal} />
        )}
        {activeModal === "createProject" && (
          <CreateProjectModal onClose={closeModal} />
        )}
        {workspaceSwitcherOpen && (
          <WorkspaceSwitcherModal onClose={closeWorkspaceSwitcher} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;