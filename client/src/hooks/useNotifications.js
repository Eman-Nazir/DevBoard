import { useQuery, useMutation, useQueryClient, keepPreviousData } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { queryKeys } from "../utils/queryKeys.js";
import { useSocket } from "./useSocket.js";
import {
  getNotificationsAPI,
  getUnreadCountAPI,
  markAsReadAPI,
  markAllAsReadAPI,
  deleteNotificationAPI,
  clearReadNotificationsAPI,
} from "../api/notification.api.js";

// ─── Get notifications (paginated) ────────────────────────────────────────────
export const useGetNotifications = (page = 1) => {
  return useQuery({
    queryKey: [...queryKeys.notifications.all(), page],
    queryFn: async () => {
      const data = await getNotificationsAPI({ page, limit: 20 });
      return data.data;
    },
    staleTime: 30 * 1000,
    placeholderData: keepPreviousData, // v5 syntax — keeps old data while fetching next page
  });
};

// ─── Get unread count (for bell badge) ────────────────────────────────────────
export const useGetUnreadCount = () => {
  return useQuery({
    queryKey: queryKeys.notifications.unreadCount(),
    queryFn: async () => {
      const data = await getUnreadCountAPI();
      return data.data.unreadCount;
    },
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000, // Poll every 60s as socket fallback
  });
};

// ─── Socket listener — real-time new notifications ────────────────────────────
export const useNotificationSocket = () => {
  const socket = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = ({ notification }) => {
      // Add to top of the cached notification list
      queryClient.setQueryData(
        [...queryKeys.notifications.all(), 1],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            notifications: [notification, ...old.notifications],
            unreadCount: old.unreadCount + 1,
          };
        }
      );

      // Increment bell badge
      queryClient.setQueryData(
        queryKeys.notifications.unreadCount(),
        (old = 0) => old + 1
      );

      // Show toast
      toast(notification.message, {
        icon: "🔔",
        duration: 4000,
        style: {
          background: "#1f2937",
          color: "#f9fafb",
          border: "1px solid #374151",
          borderRadius: "10px",
          fontSize: "13px",
        },
      });
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [socket, queryClient]);
};

// ─── Mark single as read ──────────────────────────────────────────────────────
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAsReadAPI,
    onSuccess: (_, id) => {
      queryClient.setQueryData(
        [...queryKeys.notifications.all(), 1],
        (old) => {
          if (!old) return old;
          const wasUnread = old.notifications.find((n) => n._id === id && !n.isRead);
          return {
            ...old,
            notifications: old.notifications.map((n) =>
              n._id === id ? { ...n, isRead: true } : n
            ),
            unreadCount: wasUnread
              ? Math.max(0, old.unreadCount - 1)
              : old.unreadCount,
          };
        }
      );
      queryClient.setQueryData(
        queryKeys.notifications.unreadCount(),
        (old = 0) => Math.max(0, old - 1)
      );
    },
  });
};

// ─── Mark all as read ─────────────────────────────────────────────────────────
export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markAllAsReadAPI,
    onSuccess: () => {
      queryClient.setQueryData(
        [...queryKeys.notifications.all(), 1],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            notifications: old.notifications.map((n) => ({ ...n, isRead: true })),
            unreadCount: 0,
          };
        }
      );
      queryClient.setQueryData(queryKeys.notifications.unreadCount(), 0);
    },
    onError: () => toast.error("Failed to mark all as read"),
  });
};

// ─── Delete single notification ───────────────────────────────────────────────
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNotificationAPI,
    onSuccess: (_, id) => {
      queryClient.setQueryData(
        [...queryKeys.notifications.all(), 1],
        (old) => {
          if (!old) return old;
          const deleted = old.notifications.find((n) => n._id === id);
          return {
            ...old,
            notifications: old.notifications.filter((n) => n._id !== id),
            unreadCount:
              deleted && !deleted.isRead
                ? Math.max(0, old.unreadCount - 1)
                : old.unreadCount,
          };
        }
      );
    },
  });
};

// ─── Clear all read notifications ─────────────────────────────────────────────
export const useClearReadNotifications = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: clearReadNotificationsAPI,
    onSuccess: () => {
      queryClient.setQueryData(
        [...queryKeys.notifications.all(), 1],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            notifications: old.notifications.filter((n) => !n.isRead),
          };
        }
      );
      toast.success("Read notifications cleared");
    },
    onError: () => toast.error("Failed to clear notifications"),
  });
};