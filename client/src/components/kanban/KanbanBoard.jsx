import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates, arrayMove } from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import KanbanColumn from "./KanbanColumn.jsx";
import TaskCard from "./TaskCard.jsx";
import TaskModal from "./TaskModal.jsx";
import AddTaskForm from "./AddTaskForm.jsx";
import { useMoveTask, useReorderTasks } from "../../hooks/useTask.js";

const KanbanBoard = ({ project, tasks, workspaceId, projectId, canEdit = true }) => {
  const [activeTask, setActiveTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [addingToColumn, setAddingToColumn] = useState(null);

  const { mutate: moveTask } = useMoveTask(workspaceId, projectId);
  const { mutate: reorderTasks } = useReorderTasks(workspaceId, projectId);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: canEdit ? 8 : Infinity },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getColumnTasks = useCallback(
    (columnId) =>
      tasks.filter((t) => t.columnId === columnId).sort((a, b) => a.order - b.order),
    [tasks]
  );

  const findColumnOfTask = useCallback(
    (taskId) => tasks.find((t) => t._id === taskId)?.columnId,
    [tasks]
  );

  const handleDragStart = ({ active }) => {
    if (!canEdit) return;
    const task = tasks.find((t) => t._id === active.id);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null);
    if (!over || !canEdit) return;

    const activeTaskId = active.id;
    const overId = over.id;
    const sourceColumnId = findColumnOfTask(activeTaskId);
    const targetColumnId =
      findColumnOfTask(overId) ||
      (project.columns.find((c) => c.id === overId) ? overId : null);

    if (!sourceColumnId || !targetColumnId) return;
    if (activeTaskId === overId) return;

    if (sourceColumnId !== targetColumnId) {
      const targetColumnTasks = getColumnTasks(targetColumnId);
      const overIndex = targetColumnTasks.findIndex((t) => t._id === overId);
      const newOrder = overIndex === -1 ? targetColumnTasks.length : overIndex;
      moveTask({ taskId: activeTaskId, columnId: targetColumnId, order: newOrder });
      return;
    }

    const columnTasks = getColumnTasks(sourceColumnId);
    const oldIndex = columnTasks.findIndex((t) => t._id === activeTaskId);
    const newIndex = columnTasks.findIndex((t) => t._id === overId);
    if (oldIndex === newIndex) return;
    const reordered = arrayMove(columnTasks, oldIndex, newIndex);
    const updates = reordered.map((task, index) => ({ id: task._id, order: index }));
    reorderTasks(updates);
  };

  const handleDragCancel = () => setActiveTask(null);

  return (
    <>
      {!canEdit && (
        <div className="mb-4 flex items-center gap-2 bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs px-4 py-2.5 rounded-xl">
          <span>👁</span>
          <span>You are a <strong>Viewer</strong> — you can see everything but cannot create or move tasks.</span>
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        
        <div className="flex gap-3 sm:gap-5 h-full overflow-x-auto pb-4 pr-3 sm:pr-4 snap-x snap-mandatory sm:snap-none scroll-px-3 sm:scroll-px-4 no-scrollbar">
          {project.columns
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((column) => {
              const columnTasks = getColumnTasks(column.id);
              return (
                <div
                  key={column.id}
                  className="flex flex-col w-[min(78vw,300px)] sm:w-72 flex-shrink-0 snap-start"
                >
                  <KanbanColumn
                    column={column}
                    tasks={columnTasks}
                    activeId={activeTask?._id}
                    onAddTask={(colId) =>
                      setAddingToColumn(addingToColumn === colId ? null : colId)
                    }
                    onEditTask={setEditingTask}
                    canEdit={canEdit}
                  />
                  <AnimatePresence>
                    {addingToColumn === column.id && canEdit && (
                      <div className="mt-2">
                        <AddTaskForm
                          workspaceId={workspaceId}
                          projectId={projectId}
                          columnId={column.id}
                          onClose={() => setAddingToColumn(null)}
                        />
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
        </div>

        <DragOverlay>
          {activeTask && (
            <div className="rotate-2 scale-105">
              <TaskCard task={activeTask} onClick={() => {}} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <AnimatePresence>
        {editingTask && (
          <TaskModal
            task={editingTask}
            workspaceId={workspaceId}
            projectId={projectId}
            onClose={() => setEditingTask(null)}
            canEdit={canEdit}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default KanbanBoard;