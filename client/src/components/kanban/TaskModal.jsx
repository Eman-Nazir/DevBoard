import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { X, Trash2 } from "lucide-react";
import { useUpdateTask, useDeleteTask } from "../../hooks/useTask.js";
import { useGetMembers } from "../../hooks/useWorkspace.js";
import { PRIORITY_COLORS } from "../../utils/constants.js";
import { formatDate } from "../../utils/formatDate.js";
import { cn } from "../../utils/cn.js";

const PRIORITIES = ["low", "medium", "high", "urgent"];

const TaskModal = ({ task, workspaceId, projectId, onClose, canEdit = true }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : ""
  );
  const [labelInput, setLabelInput] = useState("");
  const [labels, setLabels] = useState(task.labels || []);
  const [assigneeIds, setAssigneeIds] = useState(
    task.assignees?.map((a) => a._id || a) || []
  );
  const [isDirty, setIsDirty] = useState(false);

  const { mutate: updateTask, isPending: saving } = useUpdateTask(workspaceId, projectId);
  const { mutate: deleteTask, isPending: deleting } = useDeleteTask(workspaceId, projectId);
  const { data: members = [] } = useGetMembers(workspaceId);

  useEffect(() => {
    setIsDirty(
      title !== task.title ||
      description !== (task.description || "") ||
      priority !== task.priority ||
      JSON.stringify(labels) !== JSON.stringify(task.labels || []) ||
      JSON.stringify([...assigneeIds].sort()) !==
        JSON.stringify([...(task.assignees?.map((a) => a._id || a) || [])].sort())
    );
  }, [title, description, priority, labels, assigneeIds]);

  const handleSave = () => {
    if (!title.trim() || !canEdit) return;
    updateTask(
      { taskId: task._id, data: { title: title.trim(), description, priority, labels, assignees: assigneeIds, dueDate: dueDate || null } },
      { onSuccess: onClose }
    );
  };

  const handleDelete = () => {
    if (!canEdit) return;
    if (!window.confirm("Delete this task permanently?")) return;
    deleteTask(task._id, { onSuccess: onClose });
  };

  const handleAddLabel = (e) => {
    if (e.key === "Enter" && labelInput.trim() && canEdit) {
      e.preventDefault();
      if (!labels.includes(labelInput.trim())) setLabels([...labels, labelInput.trim()]);
      setLabelInput("");
    }
  };

  const toggleAssignee = (userId) => {
    if (!canEdit) return;
    setAssigneeIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.18 }}
        className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-2xl z-10 max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", PRIORITY_COLORS[priority])}>
              {priority}
            </span>
            <span className="text-gray-600 text-xs">by {task.createdBy?.name}</span>
            {!canEdit && (
              <span className="text-xs bg-amber-400/10 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded-full">
                View only
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {canEdit && (
              <button onClick={handleDelete} disabled={deleting}
                className="p-1.5 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <Trash2 size={15} />
              </button>
            )}
            <button onClick={onClose}
              className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <textarea
            value={title}
            onChange={(e) => canEdit && setTitle(e.target.value)}
            readOnly={!canEdit}
            className={cn(
              "w-full bg-transparent text-white text-xl font-semibold resize-none focus:outline-none placeholder-gray-700 leading-snug",
              !canEdit && "cursor-default"
            )}
            placeholder="Task title"
            rows={2}
          />

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => canEdit && setDescription(e.target.value)}
              readOnly={!canEdit}
              placeholder={canEdit ? "Add a description..." : "No description"}
              rows={4}
              className={cn(
                "w-full bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-600 rounded-lg px-3.5 py-2.5 resize-none focus:outline-none transition",
                canEdit && "focus:border-violet-500 focus:ring-1 focus:ring-violet-500",
                !canEdit && "cursor-default opacity-70"
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Priority</label>
              <div className="flex gap-1.5">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    onClick={() => canEdit && setPriority(p)}
                    disabled={!canEdit}
                    className={cn(
                      "flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors border capitalize",
                      priority === p ? `${PRIORITY_COLORS[p]} border-current` : "text-gray-600 border-gray-800",
                      canEdit && priority !== p && "hover:border-gray-700",
                      !canEdit && "cursor-default"
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => canEdit && setDueDate(e.target.value)}
                readOnly={!canEdit}
                className={cn(
                  "w-full bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-2 focus:outline-none transition",
                  canEdit && "focus:border-violet-500",
                  !canEdit && "cursor-default opacity-70"
                )}
              />
            </div>
          </div>

          {/* Assignees */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
              Assignees
              {assigneeIds.length > 0 && (
                <span className="ml-2 text-violet-400 normal-case font-normal">
                  {assigneeIds.length} selected
                </span>
              )}
            </label>
            <div className="flex flex-wrap gap-2">
              {members.map((m) => {
                const uid = m.user?._id;
                const isAssigned = assigneeIds.includes(uid);
                return (
                  <button
                    key={uid}
                    onClick={() => toggleAssignee(uid)}
                    disabled={!canEdit}
                    title={m.user?.name}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all border",
                      isAssigned
                        ? "bg-violet-600/15 text-violet-300 border-violet-500/40 ring-1 ring-violet-500/30"
                        : "text-gray-400 border-gray-800 bg-gray-800/50",
                      canEdit && !isAssigned && "hover:border-gray-600 hover:text-white hover:bg-gray-800",
                      !canEdit && "cursor-default"
                    )}
                  >
                    {/* Avatar — photo or initials */}
                    <div className="relative flex-shrink-0">
                      <div className={cn(
                        "w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold overflow-hidden border-2",
                        isAssigned ? "border-violet-500" : "border-gray-700"
                      )}>
                        {m.user?.avatar ? (
                          <img
                            src={m.user.avatar}
                            alt={m.user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={cn(
                            "w-full h-full flex items-center justify-center",
                            isAssigned ? "bg-violet-600" : "bg-gray-700"
                          )}>
                            {m.user?.name?.[0]?.toUpperCase()}
                          </div>
                        )}
                      </div>
                      {/* Checkmark overlay when assigned */}
                      {isAssigned && (
                        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-violet-500 rounded-full flex items-center justify-center border border-gray-900">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1.5 4L3 5.5L6.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Name + role */}
                    <div className="text-left">
                      <p className={cn("font-medium leading-none mb-0.5", isAssigned ? "text-violet-300" : "text-gray-300")}>
                        {m.user?.name}
                      </p>
                      <p className="text-gray-600 text-xs leading-none capitalize">{m.role}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Assigned avatars summary row */}
            {assigneeIds.length > 0 && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-800">
                <div className="flex -space-x-2">
                  {members
                    .filter((m) => assigneeIds.includes(m.user?._id))
                    .slice(0, 5)
                    .map((m) => (
                      <div
                        key={m.user?._id}
                        title={m.user?.name}
                        className="w-7 h-7 rounded-full border-2 border-gray-900 overflow-hidden bg-violet-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                      >
                        {m.user?.avatar ? (
                          <img src={m.user.avatar} alt={m.user.name} className="w-full h-full object-cover" />
                        ) : (
                          m.user?.name?.[0]?.toUpperCase()
                        )}
                      </div>
                    ))}
                </div>
                <p className="text-gray-500 text-xs">
                  {assigneeIds.length === 1
                    ? `${members.find((m) => assigneeIds.includes(m.user?._id))?.user?.name} will be notified`
                    : `${assigneeIds.length} people will be notified`}
                </p>
              </div>
            )}
          </div>

          {/* Labels */}
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-2">Labels</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {labels.map((label) => (
                <span key={label} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-300 border border-violet-500/20">
                  {label}
                  {canEdit && (
                    <button onClick={() => setLabels(labels.filter((l) => l !== label))} className="hover:text-red-400 transition-colors">
                      <X size={10} />
                    </button>
                  )}
                </span>
              ))}
            </div>
            {canEdit && (
              <input
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                onKeyDown={handleAddLabel}
                placeholder="Type label + Enter"
                className="w-full bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-violet-500 transition"
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-800 flex-shrink-0">
          <p className="text-gray-600 text-xs">
            {task.completedAt ? `Completed ${formatDate(task.completedAt)}` : `Updated ${formatDate(task.updatedAt)}`}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm transition-colors">
              {canEdit ? "Cancel" : "Close"}
            </button>
            {canEdit && (
              <button
                onClick={handleSave}
                disabled={!isDirty || saving || !title.trim()}
                className="px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors"
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TaskModal;