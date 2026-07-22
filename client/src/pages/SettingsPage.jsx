import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { useGetWorkspace } from "../hooks/useWorkspace.js";
import ProfileSection from "../components/settings/ProfileSection.jsx";
import PasswordSection from "../components/settings/PasswordSection.jsx";
import WorkspaceSettingsSection from "../components/settings/WorkspaceSettingsSection.jsx";
import ActivityLogSection from "../components/settings/ActivityLogSection.jsx";
import DangerZoneSection from "../components/settings/DangerZoneSection.jsx";

const SettingsPage = () => {
  const { workspaceId } = useParams();
  const { data: wsData } = useGetWorkspace(workspaceId);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-0 space-y-5 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-xl sm:text-2xl font-semibold text-white mb-1">Settings</h1>
        <p className="text-gray-400 text-sm">Manage your profile and workspace</p>
      </motion.div>

      <ProfileSection />
      <PasswordSection />

      {workspaceId && wsData?.workspace && (
        <>
          <WorkspaceSettingsSection workspaceId={workspaceId} workspace={wsData.workspace} />
          <ActivityLogSection workspaceId={workspaceId} />
          <DangerZoneSection workspaceId={workspaceId} workspaceName={wsData.workspace.name} />
        </>
      )}
    </div>
  );
};

export default SettingsPage;