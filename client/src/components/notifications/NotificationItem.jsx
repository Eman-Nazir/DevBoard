import { useNavigate } from "react-router-dom";
import { X, Bell, UserPlus, FolderPlus, MoveRight, CheckSquare } from "lucide-react";
import { timeAgo } from "../../utils/formatDate.js";
import { useMarkAsRead, useDeleteNotification } from "../../hooks/useNotifications.js";

const TYPE_ICON = {
  task_assigned: CheckSquare,
  task_moved: MoveRight,
  task_updated: CheckSquare,
  member_invited: UserPlus,
  member_removed: UserPlus,
  project_created: FolderPlus,
};

const TYPE_COLOR = {
  task_assigned: "text-violet-400 bg-violet-400/10",
  task_moved: "text-blue-400 bg-blue-400/10",
  task_updated: "text-amber-400 bg-amber-400/10",
  member_invited: "text-green-400 bg-green-400/10",
  member_removed: "text-red-400 bg-red-400/10",
  project_created: "text-teal-400 bg-teal-400/10",
};

const NotificationItem = ({ notification }) => {
  const navigate = useNavigate();
  const { mutate: markAsRead } = useMarkAsRead();
  const { mutate: deleteNotification } = useDeleteNotification();

  const Icon = TYPE_ICON[notification.type] || Bell;
  const colorClass = TYPE_COLOR[notification.type] || "text-gray-400 bg-gray-400/10";

  const handleClick = () => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    deleteNotification(notification._id);
  };

  return (
    <div
      onClick={handleClick}
      className={`
        group flex items-start gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3.5 cursor-pointer
        border-b border-gray-800 last:border-0 transition-colors
        hover:bg-gray-800/50 active:bg-gray-800/70
        ${!notification.isRead ? "bg-violet-600/5" : ""}
      `}
    >
      {/* Unread dot */}
      <div className="flex-shrink-0 mt-0.5">
        {!notification.isRead && (
          <div className="w-1.5 h-1.5 rounded-full bg-violet-500 mt-1.5" />
        )}
        {notification.isRead && <div className="w-1.5" />}
      </div>

      {/* Icon */}
      <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
        <Icon size={13} className="sm:hidden" />
        <Icon size={14} className="hidden sm:block" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-xs sm:text-xs leading-relaxed break-words ${notification.isRead ? "text-gray-400" : "text-gray-200"}`}>
          {notification.message}
        </p>
        <p className="text-gray-600 text-[11px] sm:text-xs mt-0.5">{timeAgo(notification.createdAt)}</p>
      </div>

      <button
        onClick={handleDelete}
        aria-label="Delete notification"
        className="
          opacity-100 sm:opacity-0 sm:group-hover:opacity-100
          p-1.5 sm:p-1 rounded text-gray-600 hover:text-gray-300
          hover:bg-gray-700 active:bg-gray-700 transition-all flex-shrink-0
        "
      >
        <X size={13} className="sm:hidden" />
        <X size={12} className="hidden sm:block" />
      </button>
    </div>
  );
};

export default NotificationItem;