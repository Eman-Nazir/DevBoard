import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCheck, Trash2, X } from "lucide-react";
import NotificationItem from "./NotificationItem.jsx";
import {
  useGetNotifications,
  useMarkAllAsRead,
  useClearReadNotifications,
} from "../../hooks/useNotifications.js";

const NotificationPanel = ({ onClose }) => {
  const panelRef = useRef(null);
  const { data, isLoading } = useGetNotifications(1);
  const { mutate: markAllRead, isPending: markingAll } = useMarkAllAsRead();
  const { mutate: clearRead, isPending: clearing } = useClearReadNotifications();

  const notifications = data?.notifications || [];
  const unreadCount = data?.unreadCount || 0;

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Bell size={14} className="text-gray-400" />
          <span className="text-white text-sm font-medium">Notifications</span>
          {unreadCount > 0 && (
            <span className="text-xs bg-violet-600 text-white px-1.5 py-0.5 rounded-full font-medium">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead()}
              disabled={markingAll}
              title="Mark all as read"
              className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <CheckCheck size={14} />
            </button>
          )}
          <button
            onClick={() => clearRead()}
            disabled={clearing}
            title="Clear read notifications"
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            <Trash2 size={14} />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-3 items-start animate-pulse">
                <div className="w-8 h-8 bg-gray-800 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 bg-gray-800 rounded w-full" />
                  <div className="h-2.5 bg-gray-800 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center mb-3">
              <Bell size={18} className="text-gray-600" />
            </div>
            <p className="text-gray-400 text-sm font-medium mb-1">All caught up</p>
            <p className="text-gray-600 text-xs">No notifications yet.</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem key={notification._id} notification={notification} />
          ))
        )}
      </div>

      {/* Footer — show only if there are notifications */}
      {notifications.length > 0 && data?.pagination?.hasMore && (
        <div className="border-t border-gray-800 px-4 py-2.5 text-center">
          <p className="text-xs text-gray-500">
            Showing {notifications.length} of {data.pagination.totalCount}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default NotificationPanel;