import { Outlet, useParams } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";
import useUIStore from "../../store/uiStore.js";
import CreateWorkspaceModal from "../../pages/modals/CreateWorkspaceModal.jsx";
import CreateProjectModal from "../../pages/modals/CreateProjectModal.jsx";

const DashboardLayout = () => {
  const { activeModal, closeModal } = useUIStore();

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
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;