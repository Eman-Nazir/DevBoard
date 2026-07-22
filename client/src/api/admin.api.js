import axiosInstance from "./axiosInstance.js";

export const getPlatformStatsAPI = async () => {
  const res = await axiosInstance.get("/admin/stats");
  return res.data;
};

export const getAllUsersAPI = async ({ page = 1, search = "" } = {}) => {
  const res = await axiosInstance.get(`/admin/users?page=${page}&search=${search}`);
  return res.data;
};

export const getAllWorkspacesAPI = async ({ page = 1 } = {}) => {
  const res = await axiosInstance.get(`/admin/workspaces?page=${page}`);
  return res.data;
};

export const getAllProjectsAPI = async ({ page = 1 } = {}) => {
  const res = await axiosInstance.get(`/admin/projects?page=${page}`);
  return res.data;
};

export const getAdminLogsAPI = async ({ page = 1 } = {}) => {
  const res = await axiosInstance.get(`/admin/logs?page=${page}`);
  return res.data;
};

export const deleteUserAPI = async (userId) => {
  const res = await axiosInstance.delete(`/admin/users/${userId}`);
  return res.data;
};