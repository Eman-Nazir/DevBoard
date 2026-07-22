import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import KanbanBoard from "../components/kanban/KanbanBoard.jsx";
import KanbanPageHeader from "../components/kanban/KanbanPageHeader.jsx";
import KanbanPageSkeleton from "../components/kanban/KanbanPageSkeleton.jsx";
import ProjectNotFound from "../components/kanban/ProjectNotFound.jsx";
import { useKanbanPageData } from "../hooks/useKanbanPageData.js";
import { exportTasksToCsv } from "../utils/exportCsv.js";

const KanbanPage = () => {
  const { workspaceId, projectId } = useParams();

  const {
    project, projectLoading, tasksLoading, membersLoading,
    tasks, allTasks, totalTasks, doneTasks, completionPct, myTasksCount,
    myRole, canEdit, taskFilter, setTaskFilter,
    priorityFilter, setPriorityFilter, searchQuery, setSearchQuery,
    onlineMembers, archiving, handleArchive,
  } = useKanbanPageData(workspaceId, projectId);

  if (projectLoading || tasksLoading || membersLoading) return <KanbanPageSkeleton />;
  if (!project) return <ProjectNotFound />;

  return (
    <div className="h-full flex flex-col -m-4 sm:-m-6">
      <KanbanPageHeader
        project={project}
        workspaceId={workspaceId}
        projectId={projectId}
        myRole={myRole}
        archiving={archiving}
        onArchive={handleArchive}
        completionPct={completionPct}
        doneTasks={doneTasks}
        totalTasks={totalTasks}
        taskFilter={taskFilter}
        setTaskFilter={setTaskFilter}
        myTasksCount={myTasksCount}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onlineMembers={onlineMembers}
        onExportCsv={() => exportTasksToCsv(allTasks, project.name)}
      />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 min-h-0 overflow-x-auto overflow-y-hidden overscroll-x-contain p-3 sm:p-6"
      >
        <KanbanBoard
          project={project}
          tasks={tasks}
          workspaceId={workspaceId}
          projectId={projectId}
          canEdit={canEdit}
        />
      </motion.div>
    </div>
  );
};

export default KanbanPage;