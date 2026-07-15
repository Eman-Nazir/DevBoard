import axiosInstance from "./axiosInstance.js";

export const getNotificationsAPI = async ({ page = 1, limit = 20 } = {}) => {
  const res = await axiosInstance.get(`/notifications?page=${page}&limit=${limit}`);
  return res.data;
};

export const getUnreadCountAPI = async () => {
  const res = await axiosInstance.get("/notifications/unread-count");
  return res.data;
};

export const markAsReadAPI = async (id) => {
  const res = await axiosInstance.patch(`/notifications/${id}/read`);
  return res.data;
};

export const markAllAsReadAPI = async () => {
  const res = await axiosInstance.patch("/notifications/read-all");
  return res.data;
};

export const deleteNotificationAPI = async (id) => {
  const res = await axiosInstance.delete(`/notifications/${id}`);
  return res.data;
};

export const clearReadNotificationsAPI = async () => {
  const res = await axiosInstance.delete("/notifications/clear-read");
  return res.data;
};