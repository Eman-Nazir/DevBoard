import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryKeys } from "../utils/queryKeys.js";
import {
  getTasksAPI,
  createTaskAPI,
  updateTaskAPI,
  moveTaskAPI,
  reorderTasksAPI,
  deleteTaskAPI,
} from "../api/task.api.js";

//  Get all tasks for a project ──
export const useGetTasks = (workspaceId, projectId) => {
  return useQuery({
    queryKey: queryKeys.tasks.byProject(projectId),
    queryFn: async () => {
      const data = await getTasksAPI({ workspaceId, projectId });
      return data.data.tasks;
    },
    enabled: !!workspaceId && !!projectId,
    staleTime: 30 * 1000,
  });
};

//  Create task 
export const useCreateTask = (workspaceId, projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => createTaskAPI({ workspaceId, projectId, data }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tasks.byProject(projectId),
      });
      toast.success("Task created");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to create task"),
  });
};

//  Update task 
export const useUpdateTask = (workspaceId, projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, data }) =>
      updateTaskAPI({ workspaceId, projectId, taskId, data }),
    onSuccess: (data) => {
      const updated = data.data.task;
      queryClient.setQueryData(
        queryKeys.tasks.byProject(projectId),
        (old = []) => old.map((t) => (t._id === updated._id ? updated : t))
      );
      toast.success("Task updated");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to update task"),
  });
};

//  Move task optimistic update with rollback ─
export const useMoveTask = (workspaceId, projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ taskId, columnId, order }) =>
      moveTaskAPI({ workspaceId, projectId, taskId, columnId, order }),
    onMutate: async ({ taskId, columnId, order }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.tasks.byProject(projectId),
      });
      const previous = queryClient.getQueryData(
        queryKeys.tasks.byProject(projectId)
      );
      queryClient.setQueryData(
        queryKeys.tasks.byProject(projectId),
        (old = []) =>
          old.map((t) =>
            t._id === taskId ? { ...t, columnId, order } : t
          )
      );
      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.tasks.byProject(projectId),
          context.previous
        );
      }
      toast.error("Failed to move task");
    },
  });
};

//  Reorder tasks optimistic update with rollback ──
export const useReorderTasks = (workspaceId, projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tasks) =>
      reorderTasksAPI({ workspaceId, projectId, tasks }),
    onMutate: async (tasks) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.tasks.byProject(projectId),
      });
      const previous = queryClient.getQueryData(
        queryKeys.tasks.byProject(projectId)
      );
      const orderMap = Object.fromEntries(tasks.map((t) => [t.id, t.order]));
      queryClient.setQueryData(
        queryKeys.tasks.byProject(projectId),
        (old = []) =>
          old.map((t) =>
            orderMap[t._id] !== undefined
              ? { ...t, order: orderMap[t._id] }
              : t
          )
      );
      return { previous };
    },
    onError: (err, _, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          queryKeys.tasks.byProject(projectId),
          context.previous
        );
      }
    },
  });
};

//  Delete task 
export const useDeleteTask = (workspaceId, projectId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId) =>
      deleteTaskAPI({ workspaceId, projectId, taskId }),
    onSuccess: (_, taskId) => {
      queryClient.setQueryData(
        queryKeys.tasks.byProject(projectId),
        (old = []) => old.filter((t) => t._id !== taskId)
      );
      toast.success("Task deleted");
    },
    onError: (err) =>
      toast.error(err.response?.data?.message || "Failed to delete task"),
  });
};