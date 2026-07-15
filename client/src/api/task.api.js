import axiosInstance from "./axiosInstance.js";

const base = (workspaceId, projectId) =>
  `/workspaces/${workspaceId}/projects/${projectId}/tasks`;

export const getTasksAPI = async ({ workspaceId, projectId }) => {
  const res = await axiosInstance.get(base(workspaceId, projectId));
  return res.data;
};

export const createTaskAPI = async ({ workspaceId, projectId, data }) => {
  const res = await axiosInstance.post(base(workspaceId, projectId), data);
  return res.data;
};

export const getTaskAPI = async ({ workspaceId, projectId, taskId }) => {
  const res = await axiosInstance.get(`${base(workspaceId, projectId)}/${taskId}`);
  return res.data;
};

export const updateTaskAPI = async ({ workspaceId, projectId, taskId, data }) => {
  const res = await axiosInstance.patch(
    `${base(workspaceId, projectId)}/${taskId}`,
    data
  );
  return res.data;
};

export const moveTaskAPI = async ({ workspaceId, projectId, taskId, columnId, order }) => {
  const res = await axiosInstance.patch(
    `${base(workspaceId, projectId)}/${taskId}/move`,
    { columnId, order }
  );
  return res.data;
};

export const reorderTasksAPI = async ({ workspaceId, projectId, tasks }) => {
  const res = await axiosInstance.patch(
    `${base(workspaceId, projectId)}/reorder`,
    { tasks }
  );
  return res.data;
};

export const deleteTaskAPI = async ({ workspaceId, projectId, taskId }) => {
  const res = await axiosInstance.delete(
    `${base(workspaceId, projectId)}/${taskId}`
  );
  return res.data;
};