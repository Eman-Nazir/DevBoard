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

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    if (mq.matches) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, []);

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-40 sm:hidden"
        onClick={onClose}
        aria-hidden="true"
      />

      <motion.div
        ref={panelRef}
        initial={{ opacity: 0, y: -8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.97 }}
        transition={{ duration: 0.15 }}
        role="dialog"
        aria-label="Notifications"
        className="
          fixed inset-x-0 bottom-0 z-50 w-full
          max-h-[85vh] rounded-t-2xl
          sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-full sm:mt-2
          sm:w-80 md:w-96
          sm:max-h-[28rem] sm:rounded-xl
          bg-gray-900 border border-gray-800
          shadow-2xl shadow-black/50 overflow-hidden
          flex flex-col
        "
      >
        <div className="flex justify-center pt-2 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-gray-700" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Bell size={14} className="text-gray-400 flex-shrink-0" />
            <span className="text-white text-sm font-medium truncate">Notifications</span>
            {unreadCount > 0 && (
              <span className="text-xs bg-violet-600 text-white px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                disabled={markingAll}
                title="Mark all as read"
                aria-label="Mark all as read"
                className="p-2 sm:p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800 active:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <CheckCheck size={14} />
              </button>
            )}
            <button
              onClick={() => clearRead()}
              disabled={clearing}
              title="Clear read notifications"
              aria-label="Clear read notifications"
              className="p-2 sm:p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800 active:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Trash2 size={14} />
            </button>
            <button
              onClick={onClose}
              aria-label="Close notifications"
              className="p-2 sm:p-1.5 rounded-md text-gray-500 hover:text-gray-300 hover:bg-gray-800 active:bg-gray-800 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {isLoading ? (
            <div className="p-4 space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-3 items-start animate-pulse">
                  <div className="w-8 h-8 bg-gray-800 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-1.5 min-w-0">
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
          <div className="border-t border-gray-800 px-4 py-2.5 text-center flex-shrink-0">
            <p className="text-xs text-gray-500">
              Showing {notifications.length} of {data.pagination.totalCount}
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default NotificationPanel;