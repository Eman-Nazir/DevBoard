import { useState } from "react";
import { Bell, Plus } from "lucide-react";
import { useParams, useMatches } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import useAuthStore from "../../store/authStore.js";
import useUIStore from "../../store/uiStore.js";
import { useGetUnreadCount, useNotificationSocket } from "../../hooks/useNotifications.js";
import NotificationPanel from "../notifications/NotificationPanel.jsx";

const Topbar = () => {
  const { user } = useAuthStore();
  const { openModal } = useUIStore();
  const { workspaceId } = useParams();
  const matches = useMatches();
  const [notifOpen, setNotifOpen] = useState(false);

  const { data: unreadCount = 0 } = useGetUnreadCount();

  // Listen for real-time notifications — updates bell badge instantly
  useNotificationSocket();

  const title =
    [...matches].reverse().find((m) => m.handle?.title)?.handle?.title ||
    "DevBoard";

  return (
    <header className="h-14 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-5 flex-shrink-0">
      <h1 className="text-white font-medium text-sm">{title}</h1>

      <div className="flex items-center gap-2">
        {workspaceId && (
          <button
            onClick={() => openModal("createProject")}
            className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus size={13} />
            New Project
          </button>
        )}

        {/* Notification bell with real unread count */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((prev) => !prev)}
            className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-violet-600 text-white text-xs rounded-full flex items-center justify-center px-1 font-medium">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notifOpen && (
              <NotificationPanel onClose={() => setNotifOpen(false)} />
            )}
          </AnimatePresence>
        </div>

        {/* User avatar */}
        <div
          title={user?.name}
          className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-white text-xs font-semibold cursor-default"
        >
          {user?.name?.[0]?.toUpperCase()}
        </div>
      </div>
    </header>
  );
};

export default Topbar;