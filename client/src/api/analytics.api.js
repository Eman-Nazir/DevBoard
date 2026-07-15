import axiosInstance from "./axiosInstance.js";

export const getProjectAnalyticsAPI = async ({ workspaceId, projectId }) => {
  const res = await axiosInstance.get(
    `/workspaces/${workspaceId}/projects/${projectId}/analytics`
  );
  return res.data;
};

export const getWorkspaceAnalyticsAPI = async (workspaceId) => {
  const res = await axiosInstance.get(`/workspaces/${workspaceId}/analytics`);
  return res.data;
};