import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { queryKeys } from "../utils/queryKeys.js";
import {
  createWorkspaceAPI, getMyWorkspacesAPI, getWorkspaceAPI,
  updateWorkspaceAPI, deleteWorkspaceAPI, inviteMemberAPI,
  getMembersAPI, updateMemberRoleAPI, removeMemberAPI,
} from "../api/workspace.api.js";
import {
  createProjectAPI, getProjectsAPI, getProjectAPI,
  updateProjectAPI, deleteProjectAPI, getArchivedProjectsAPI,
} from "../api/project.api.js";


//  Workspaces ─
export const useGetMyWorkspaces = () => {
  return useQuery({
    queryKey: queryKeys.workspaces.all(),
    queryFn: async () => {
      const data = await getMyWorkspacesAPI();
      return data.data.workspaces;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useGetWorkspace = (id) => {
  return useQuery({
    queryKey: queryKeys.workspaces.detail(id),
    queryFn: async () => {
      const data = await getWorkspaceAPI(id);
      return data.data; 
    },
    enabled: !!id,
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: createWorkspaceAPI,
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.workspaces.all(), (old = []) => [
        { ...data.data.workspace, role: "admin" },
        ...old,
      ]);
      toast.success("Workspace created!");
      navigate(`/workspace/${data.data.workspace._id}`);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to create workspace"),
  });
};

export const useUpdateWorkspace = (id) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateWorkspaceAPI({ id, data }),
    onSuccess: (data) => {
      const updated = data.data.workspace;
      // Update both caches
      queryClient.setQueryData(queryKeys.workspaces.detail(id), (old) =>
        old ? { ...old, workspace: updated } : old
      );
      queryClient.setQueryData(queryKeys.workspaces.all(), (old = []) =>
        old.map((w) => (w._id === id ? { ...w, ...updated } : w))
      );
      toast.success("Workspace updated!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update"),
  });
};

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: deleteWorkspaceAPI,
    onSuccess: (_, id) => {
      queryClient.setQueryData(queryKeys.workspaces.all(), (old = []) =>
        old.filter((w) => w._id !== id)
      );
      queryClient.removeQueries({ queryKey: queryKeys.workspaces.detail(id) });
      toast.success("Workspace deleted");
      navigate("/dashboard");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete"),
  });
};

//  Members ─
export const useGetMembers = (workspaceId) => {
  return useQuery({
    queryKey: queryKeys.workspaces.members(workspaceId),
    queryFn: async () => {
      const data = await getMembersAPI(workspaceId);
      return data.data.members;
    },
    enabled: !!workspaceId,
  });
};

export const useInviteMember = (workspaceId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => inviteMemberAPI({ workspaceId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.members(workspaceId) });
      toast.success("Member invited successfully!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Invite failed"),
  });
};

export const useUpdateMemberRole = (workspaceId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, role }) => updateMemberRoleAPI({ workspaceId, userId, role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.members(workspaceId) });
      toast.success("Role updated!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update role"),
  });
};

export const useRemoveMember = (workspaceId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userId) => removeMemberAPI({ workspaceId, userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.workspaces.members(workspaceId) });
      toast.success("Member removed");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to remove member"),
  });
};

//  Projects 
export const useGetProjects = (workspaceId) => {
  return useQuery({
    queryKey: queryKeys.projects.byWorkspace(workspaceId),
    queryFn: async () => {
      const data = await getProjectsAPI(workspaceId);
      return data.data.projects;
    },
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useGetProject = (projectId, workspaceId) => {
  return useQuery({
    queryKey: queryKeys.projects.detail(projectId),
    queryFn: async () => {
      const data = await getProjectAPI({ projectId, workspaceId });
      return data.data.project;
    },
    enabled: !!projectId && !!workspaceId,
  });
};

export const useCreateProject = (workspaceId) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: (data) => createProjectAPI({ workspaceId, data }),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.projects.byWorkspace(workspaceId), (old = []) => [
        data.data.project,
        ...old,
      ]);
      toast.success("Project created!");
      navigate(`/workspace/${workspaceId}/project/${data.data.project._id}/kanban`);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to create project"),
  });
};

export const useUpdateProject = (workspaceId, projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => updateProjectAPI({ id: projectId, workspaceId, data }),
    onSuccess: (data) => {
      const updated = data.data.project;

      queryClient.setQueryData(queryKeys.projects.detail(projectId), updated);

      if (updated.status === "archived") {
        queryClient.setQueryData(
          queryKeys.projects.byWorkspace(workspaceId),
          (old = []) => old.filter((p) => p._id !== projectId)
        );
        // Add to archived list
        queryClient.setQueryData(
          [...queryKeys.projects.byWorkspace(workspaceId), "archived"],
          (old = []) => [updated, ...old.filter((p) => p._id !== projectId)]
        );
      } else if (updated.status === "active") {
        // Add back to active list
        queryClient.setQueryData(
          queryKeys.projects.byWorkspace(workspaceId),
          (old = []) => [updated, ...old.filter((p) => p._id !== projectId)]
        );
        // Remove from archived list
        queryClient.setQueryData(
          [...queryKeys.projects.byWorkspace(workspaceId), "archived"],
          (old = []) => old.filter((p) => p._id !== projectId)
        );
      } else {
        // Regular update — just update in place
        queryClient.setQueryData(
          queryKeys.projects.byWorkspace(workspaceId),
          (old = []) => old.map((p) => (p._id === projectId ? updated : p))
        );
      }
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update project"),
  });
};

export const useDeleteProject = (workspaceId) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ({ id, workspaceId: wid }) => deleteProjectAPI({ id, workspaceId: wid }),
    onSuccess: (_, variables) => {
      queryClient.setQueryData(queryKeys.projects.byWorkspace(workspaceId), (old = []) =>
        old.filter((p) => p._id !== variables.id)
      );
      queryClient.removeQueries({ queryKey: queryKeys.projects.detail(variables.id) });
      toast.success("Project deleted");
      navigate(`/workspace/${workspaceId}`);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete project"),
  });
};

//  Archived Projects 
export const useGetArchivedProjects = (workspaceId) => {
  return useQuery({
    queryKey: [...queryKeys.projects.byWorkspace(workspaceId), "archived"],
    queryFn: async () => {
      const data = await getArchivedProjectsAPI(workspaceId);
      return data.data.projects;
    },
    enabled: !!workspaceId,
  });
};

export const useUnarchiveProject = (workspaceId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (projectId) =>
      updateProjectAPI({ id: projectId, workspaceId, data: { status: "active" } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.byWorkspace(workspaceId) });
      queryClient.invalidateQueries({ queryKey: [...queryKeys.projects.byWorkspace(workspaceId), "archived"] });
      toast.success("Project restored!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to restore project"),
  });
};