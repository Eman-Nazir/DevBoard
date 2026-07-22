import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useGetProject, useGetMembers, useUpdateProject } from "./useWorkspace.js";
import { useGetTasks } from "./useTask.js";
import { useProjectSocket } from "./useSocket.js";
import { queryKeys } from "../utils/queryKeys.js";
import useAuthStore from "../store/authStore.js";

export const useKanbanPageData = (workspaceId, projectId) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const [taskFilter, setTaskFilter] = useState("all"); 
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [onlineUserIds, setOnlineUserIds] = useState([]);

  const { data: project, isLoading: projectLoading } = useGetProject(projectId, workspaceId);
  const { data: tasks = [], isLoading: tasksLoading } = useGetTasks(workspaceId, projectId);
  const { data: members = [], isLoading: membersLoading } = useGetMembers(workspaceId);
  const { mutate: updateProject, isPending: archiving } = useUpdateProject(workspaceId, projectId);

  const myMember = members.find((m) => m.user?._id === user?._id);
  const myRole = membersLoading ? null : (myMember?.role || "viewer");
  const canEdit = myRole === "admin" || myRole === "member";

  // ── Derived task data 
  const isMine = (t) => t.assignees?.some((a) => (a._id || a) === user?._id);
  let filteredTasks = taskFilter === "mine" ? tasks.filter(isMine) : tasks;
  if (priorityFilter !== "all") {
    filteredTasks = filteredTasks.filter((t) => t.priority === priorityFilter);
  }
  if (searchQuery.trim()) {
    const q = searchQuery.trim().toLowerCase();
    filteredTasks = filteredTasks.filter((t) => t.title?.toLowerCase().includes(q));
  }
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.columnId === "done").length;
  const completionPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const myTasksCount = tasks.filter(isMine).length;

  // ── Online presence — who else is viewing this project right now 
  const onlineUserIdStrings = onlineUserIds.map(String);
  const onlineMembers = members.filter((m) => {
    const memberId = String(m.user?._id || "");
    return onlineUserIdStrings.includes(memberId) && memberId !== String(user?._id || "");
  });

  // ── Real-time socket handlers 
  useProjectSocket(projectId, {
    onTaskCreated: ({ task }) => {
      queryClient.setQueryData(
        queryKeys.tasks.byProject(projectId),
        (old = []) => (old.some((t) => t._id === task._id) ? old : [...old, task])
      );
    },
    onTaskUpdated: ({ task }) => {
      queryClient.setQueryData(
        queryKeys.tasks.byProject(projectId),
        (old = []) => old.map((t) => (t._id === task._id ? task : t))
      );
    },
    onTaskMoved: ({ taskId, toColumn, order }) => {
      queryClient.setQueryData(
        queryKeys.tasks.byProject(projectId),
        (old = []) => old.map((t) => (t._id === taskId ? { ...t, columnId: toColumn, order } : t))
      );
    },
    onTaskDeleted: ({ taskId }) => {
      queryClient.setQueryData(
        queryKeys.tasks.byProject(projectId),
        (old = []) => old.filter((t) => t._id !== taskId)
      );
    },
    onTaskReordered: ({ tasks: updates }) => {
      const orderMap = Object.fromEntries(updates.map((u) => [u.id, u.order]));
      queryClient.setQueryData(
        queryKeys.tasks.byProject(projectId),
        (old = []) => old.map((t) => (orderMap[t._id] !== undefined ? { ...t, order: orderMap[t._id] } : t))
      );
    },
    onPresenceUpdate: (userIds) => {
      setOnlineUserIds(userIds);
    },
  });

  // ── Archive action 
  const handleArchive = () => {
    if (!window.confirm("Archive this project? It will be hidden but not deleted.")) return;
    updateProject(
      { status: "archived" },
      {
        onSuccess: () => {
          toast.success("Project archived");
          navigate(`/workspace/${workspaceId}`);
        },
      }
    );
  };

  return {
    project,
    projectLoading,
    tasksLoading,
    membersLoading,
    tasks: filteredTasks,
    allTasks: tasks,
    totalTasks,
    doneTasks,
    completionPct,
    myTasksCount,
    myRole,
    canEdit,
    taskFilter,
    setTaskFilter,
    priorityFilter,
    setPriorityFilter,
    searchQuery,
    setSearchQuery,
    onlineMembers,
    archiving,
    handleArchive,
  };
};