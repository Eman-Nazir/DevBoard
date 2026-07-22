import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  getPlatformStatsAPI,
  getAllUsersAPI,
  getAllWorkspacesAPI,
  getAllProjectsAPI,
  getAdminLogsAPI,
  deleteUserAPI,
} from "../api/admin.api.js";

export const useGetPlatformStats = () => {
  return useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => {
      const data = await getPlatformStatsAPI();
      return data.data;
    },
    staleTime: 60 * 1000,
  });
};

export const useGetAllProjects = () => {
  const [page, setPage] = useState(1);
  const query = useQuery({
    queryKey: ["admin", "projects", page],
    queryFn: async () => {
      const data = await getAllProjectsAPI({ page });
      return data.data;
    },
    staleTime: 30 * 1000,
  });
  return { ...query, page, setPage };
};

export const useGetAllUsers = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const query = useQuery({
    queryKey: ["admin", "users", page, search],
    queryFn: async () => {
      const data = await getAllUsersAPI({ page, search });
      return data.data;
    },
    staleTime: 30 * 1000,
    keepPreviousData: true,
  });

  return { ...query, page, setPage, search, setSearch };
};

export const useGetAllWorkspaces = () => {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["admin", "workspaces", page],
    queryFn: async () => {
      const data = await getAllWorkspacesAPI({ page });
      return data.data;
    },
    staleTime: 30 * 1000,
  });

  return { ...query, page, setPage };
};

export const useGetAdminLogs = () => {
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: ["admin", "logs", page],
    queryFn: async () => {
      const data = await getAdminLogsAPI({ page });
      return data.data;
    },
    staleTime: 15 * 1000,
  });

  return { ...query, page, setPage };
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserAPI,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "logs"] });
      toast.success("User deleted");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to delete user"),
  });
};