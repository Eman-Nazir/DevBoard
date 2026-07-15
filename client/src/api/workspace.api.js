import axiosInstance from "./axiosInstance.js";

export const createWorkspaceAPI = async (data) => {
  const res = await axiosInstance.post("/workspaces", data);
  return res.data;
};

export const getMyWorkspacesAPI = async () => {
  const res = await axiosInstance.get("/workspaces");
  return res.data;
};

export const getWorkspaceAPI = async (id) => {
  const res = await axiosInstance.get(`/workspaces/${id}`);
  return res.data;
};

export const updateWorkspaceAPI = async ({ id, data }) => {
  const res = await axiosInstance.patch(`/workspaces/${id}`, data);
  return res.data;
};

export const deleteWorkspaceAPI = async (id) => {
  const res = await axiosInstance.delete(`/workspaces/${id}`);
  return res.data;
};

export const inviteMemberAPI = async ({ workspaceId, data }) => {
  const res = await axiosInstance.post(`/workspaces/${workspaceId}/invite`, data);
  return res.data;
};

export const joinByInviteCodeAPI = async (code) => {
  const res = await axiosInstance.post(`/workspaces/join/${code}`);
  return res.data;
};

export const getActivityLogAPI = async (workspaceId) => {
  const res = await axiosInstance.get(`/workspaces/${workspaceId}/activity`);
  return res.data;
};

export const getMembersAPI = async (workspaceId) => {
  const res = await axiosInstance.get(`/workspaces/${workspaceId}/members`);
  return res.data;
};

export const updateMemberRoleAPI = async ({ workspaceId, userId, role }) => {
  const res = await axiosInstance.patch(
    `/workspaces/${workspaceId}/members/${userId}`,
    { role }
  );
  return res.data;
};

export const removeMemberAPI = async ({ workspaceId, userId }) => {
  const res = await axiosInstance.delete(
    `/workspaces/${workspaceId}/members/${userId}`
  );
  return res.data;
};