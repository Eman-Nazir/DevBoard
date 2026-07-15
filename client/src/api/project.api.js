import axiosInstance from "./axiosInstance.js";

export const createProjectAPI = async ({ workspaceId, data }) => {
  const res = await axiosInstance.post(`/workspaces/${workspaceId}/projects`, data);
  return res.data;
};

export const getProjectsAPI = async (workspaceId) => {
  const res = await axiosInstance.get(`/workspaces/${workspaceId}/projects`);
  return res.data;
};

// Fetch archived projects separately
export const getArchivedProjectsAPI = async (workspaceId) => {
  const res = await axiosInstance.get(`/workspaces/${workspaceId}/projects/archived`);
  return res.data;
};

export const getProjectAPI = async ({ projectId, workspaceId }) => {
  const res = await axiosInstance.get(`/workspaces/${workspaceId}/projects/${projectId}`);
  return res.data;
};

export const updateProjectAPI = async ({ id, workspaceId, data }) => {
  const res = await axiosInstance.patch(`/workspaces/${workspaceId}/projects/${id}`, data);
  return res.data;
};

export const deleteProjectAPI = async ({ id, workspaceId }) => {
  const res = await axiosInstance.delete(`/workspaces/${workspaceId}/projects/${id}`);
  return res.data;
};