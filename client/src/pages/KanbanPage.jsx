import { useParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, LayoutGrid, BarChart2, Kanban, Archive, User, Users } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import KanbanBoard from "../components/kanban/KanbanBoard.jsx";
import { useGetProject, useGetWorkspace, useUpdateProject, useGetMembers } from "../hooks/useWorkspace.js";
import { useGetTasks } from "../hooks/useTask.js";
import { useProjectSocket } from "../hooks/useSocket.js";
import { queryKeys } from "../utils/queryKeys.js";
import useAuthStore from "../store/authStore.js";
import { cn } from "../utils/cn.js";

const KanbanPage = () => {
  const { workspaceId, projectId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  // ── Filter state — "all" or "mine" ────────────────────────────────────────
  const [taskFilter, setTaskFilter] = useState("all");

  const { data: project, isLoading: projectLoading } = useGetProject(projectId, workspaceId);
  const { data: tasks = [], isLoading: tasksLoading } = useGetTasks(workspaceId, projectId);
  const { data: members = [] } = useGetMembers(workspaceId);
  const { mutate: updateProject, isPending: archiving } = useUpdateProject(workspaceId, projectId);

  // Get current user's role
  const myMember = members.find((m) => m.user?._id === user?._id);
  const myRole = myMember?.role || "viewer";
  const canEdit = myRole === "admin" || myRole === "member";

  // Filter tasks based on selected filter
  const filteredTasks = taskFilter === "mine"
    ? tasks.filter((t) =>
        t.assignees?.some((a) => (a._id || a) === user?._id)
      )
    : tasks;

  // ── Real-time socket handlers ──────────────────────────────────────────────
  useProjectSocket(projectId, {
    onTaskCreated: ({ task }) => {
      queryClient.setQueryData(
        queryKeys.tasks.byProject(projectId),
        (old = []) => {
          const exists = old.some((t) => t._id === task._id);
          return exists ? old : [...old, task];
        }
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
        (old = []) =>
          old.map((t) =>
            t._id === taskId ? { ...t, columnId: toColumn, order } : t
          )
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
        (old = []) =>
          old.map((t) =>
            orderMap[t._id] !== undefined ? { ...t, order: orderMap[t._id] } : t
          )
      );
    },
  });

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

  // ── Loading ────────────────────────────────────────────────────────────────
  if (projectLoading || tasksLoading) {
    return (
      <div className="h-full flex flex-col -m-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div className="h-7 w-48 bg-gray-800 rounded-lg animate-pulse" />
          <div className="h-8 w-28 bg-gray-800 rounded-lg animate-pulse" />
        </div>
        <div className="flex gap-5 p-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-72 flex-shrink-0">
              <div className="h-6 w-24 bg-gray-800 rounded animate-pulse mb-3" />
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-20 bg-gray-800/60 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <LayoutGrid size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">Project not found</p>
        </div>
      </div>
    );
  }

  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.columnId === "done").length;
  const completionPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
  const myTasksCount = tasks.filter((t) =>
    t.assignees?.some((a) => (a._id || a) === user?._id)
  ).length;

  return (
    <div className="h-full flex flex-col -m-6">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-shrink-0 border-b border-gray-800"
      >
        {/* Top row */}
        <div className="flex items-center justify-between px-6 py-3 gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <h1 className="text-white font-semibold text-base truncate">{project.name}</h1>
              {project.description && (
                <p className="text-gray-500 text-xs truncate">{project.description}</p>
              )}
            </div>
            {project.githubRepo && (
              <a
                href={project.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gray-500 hover:text-gray-300 text-xs transition-colors flex-shrink-0"
              >
                <GitBranch size={13} />
                <span className="hidden sm:block">
                  {project.githubRepo.replace("https://github.com/", "")}
                </span>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Progress */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-24 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionPct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="h-full bg-violet-500 rounded-full"
                />
              </div>
              <span className="text-gray-500 text-xs whitespace-nowrap">
                {doneTasks}/{totalTasks} done
              </span>
            </div>

            {/* Role badge */}
            <span className={cn(
              "text-xs px-2.5 py-1 rounded-full font-medium border",
              myRole === "admin" ? "text-violet-400 bg-violet-400/10 border-violet-400/20" :
              myRole === "member" ? "text-blue-400 bg-blue-400/10 border-blue-400/20" :
              "text-gray-400 bg-gray-400/10 border-gray-400/20"
            )}>
              {myRole}
            </span>

            {/* Archive — admin only */}
            {myRole === "admin" && (
              <button
                onClick={handleArchive}
                disabled={archiving}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-500 hover:text-amber-400 hover:bg-amber-400/10 border border-gray-800 hover:border-amber-400/20 transition-all"
              >
                <Archive size={13} />
                <span className="hidden sm:block">Archive</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab row + filter toggle */}
        <div className="flex items-center justify-between px-6 pb-0">
          {/* Kanban / Analytics tabs */}
          <div className="flex items-center gap-1">
            <Link
              to={`/workspace/${workspaceId}/project/${projectId}/kanban`}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 border-violet-500 text-violet-400"
            >
              <Kanban size={14} />
              Kanban
            </Link>
            <Link
              to={`/workspace/${workspaceId}/project/${projectId}/analytics`}
              className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 border-transparent text-gray-500 hover:text-gray-300 transition-colors"
            >
              <BarChart2 size={14} />
              Analytics
            </Link>
          </div>

          {/* My Tasks / All Tasks filter */}
          <div className="flex items-center gap-1 mb-1 bg-gray-800/60 rounded-lg p-1">
            <button
              onClick={() => setTaskFilter("all")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                taskFilter === "all"
                  ? "bg-gray-700 text-white"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              <Users size={12} />
              All tasks
              <span className="bg-gray-600 text-gray-300 px-1.5 py-0.5 rounded-full text-xs">
                {totalTasks}
              </span>
            </button>
            <button
              onClick={() => setTaskFilter("mine")}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                taskFilter === "mine"
                  ? "bg-violet-600/30 text-violet-400"
                  : "text-gray-500 hover:text-gray-300"
              )}
            >
              <User size={12} />
              My tasks
              <span className={cn(
                "px-1.5 py-0.5 rounded-full text-xs",
                taskFilter === "mine"
                  ? "bg-violet-600/40 text-violet-300"
                  : "bg-gray-600 text-gray-300"
              )}>
                {myTasksCount}
              </span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Board ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 overflow-hidden p-6"
      >
        <KanbanBoard
          project={project}
          tasks={filteredTasks}
          workspaceId={workspaceId}
          projectId={projectId}
          canEdit={canEdit}
        />
      </motion.div>
    </div>
  );
};

export default KanbanPage;