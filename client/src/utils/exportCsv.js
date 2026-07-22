
const escapeCsvField = (value) => {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
};

export const exportTasksToCsv = (tasks, projectName = "tasks") => {
  const headers = ["Title", "Description", "Column", "Priority", "Assignees", "Labels", "Due Date", "Created At"];

  const rows = tasks.map((t) => [
    t.title,
    t.description,
    t.columnId,
    t.priority,
    t.assignees?.map((a) => a.name || a).join("; ") || "",
    t.labels?.join("; ") || "",
    t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "",
    t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvField).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${projectName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-tasks-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};