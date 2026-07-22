import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useUpdateWorkspace } from "../../hooks/useWorkspace.js";
import Section from "../ui/Section.jsx";
import Field from "../ui/Field.jsx";
import Input from "../ui/Input.jsx";

const workspaceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  description: z.string().max(200).optional(),
});

const WorkspaceSettingsSection = ({ workspaceId, workspace }) => {
  const { mutate: updateWorkspace, isPending: updatingWs } = useUpdateWorkspace(workspaceId);

  const wsForm = useForm({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: workspace?.name || "",
      description: workspace?.description || "",
    },
  });

  return (
    <Section title="Workspace settings" description="Update your workspace name and description">
      <form onSubmit={wsForm.handleSubmit((data) => updateWorkspace(data))} className="space-y-4">
        <Field label="Workspace name" error={wsForm.formState.errors.name?.message}>
          <Input {...wsForm.register("name")} placeholder="Workspace name" />
        </Field>
        <Field label="Description" error={wsForm.formState.errors.description?.message}>
          <textarea
            {...wsForm.register("description")}
            rows={2}
            placeholder="What is this workspace for?"
            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition resize-none"
            style={{ fontSize: "16px" }}
          />
        </Field>
        <button
          type="submit"
          disabled={updatingWs}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-500 disabled:opacity-50 text-white font-medium px-4 py-2.5 sm:py-2 rounded-lg text-sm transition-colors"
        >
          {updatingWs && <Loader2 size={14} className="animate-spin" />}
          {updatingWs ? "Saving..." : "Save workspace"}
        </button>
      </form>
    </Section>
  );
};

export default WorkspaceSettingsSection;