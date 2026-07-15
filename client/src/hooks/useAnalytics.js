import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../utils/queryKeys.js";
import { getProjectAnalyticsAPI, getWorkspaceAnalyticsAPI } from "../api/analytics.api.js";

export const useGetProjectAnalytics = (workspaceId, projectId) => {
  return useQuery({
    queryKey: queryKeys.analytics.project(projectId),
    queryFn: async () => {
      const data = await getProjectAnalyticsAPI({ workspaceId, projectId });
      return data.data;
    },
    enabled: !!workspaceId && !!projectId,
    staleTime: 2 * 60 * 1000, // 2 min — analytics don't need to be instant
  });
};

export const useGetWorkspaceAnalytics = (workspaceId) => {
  return useQuery({
    queryKey: queryKeys.analytics.workspace(workspaceId),
    queryFn: async () => {
      const data = await getWorkspaceAnalyticsAPI(workspaceId);
      return data.data;
    },
    enabled: !!workspaceId,
    staleTime: 2 * 60 * 1000,
  });
};