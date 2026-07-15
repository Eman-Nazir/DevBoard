import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Loader2, Trash2, AlertTriangle } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance.js";
import useAuthStore from "../store/authStore.js";
import { useGetWorkspace, useDeleteWorkspace, useUpdateWorkspace } from "../hooks/useWorkspace.js";
import { queryKeys } from "../utils/queryKeys.js";

// ── Schemas ────────────────────────────────────────────────────────────────────
const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const workspaceSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  description: z.string().max(200).optional(),
});

// ── Section wrapper ────────────────────────────────────────────────────────────
const Section = ({ title, description, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
  >
    <div className="px-6 py-5 border-b border-gray-800">
      <h2 className="text-white font-medium text-sm">{title}</h2>
      {description && <p className="text-gray-500 text-xs mt-0.5">{description}</p>}
    </div>
    <div className="p-6">{children}</div>
  </motion.div>
);

// ── Input component ────────────────────────────────────────────────────────────
const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
    {children}
    {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
  </div>
);

const Input = ({ className = "", ...props }) => (
  <input
    className={`w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition ${className}`}
    {...props}
  />
);

// ── Page ───────────────────────────────────────────────────────────────────────
const SettingsPage = () => {
  const { workspaceId } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const avatarInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

  const { data: wsData } = useGetWorkspace(workspaceId);
  const { mutate: deleteWorkspace, isPending: deleting } = useDeleteWorkspace();
  const { mutate: updateWorkspace, isPending: updatingWs } = useUpdateWorkspace(workspaceId);

  // ── Profile form ─────────────────────────────────────────────────────────────
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || "" },
  });

  const { mutate: updateProfile, isPending: updatingProfile } = useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      formData.append("name", data.name);
      if (avatarFile) formData.append("avatar", avatarFile);
      const res = await axiosInstance.patch("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      const updatedUser = data.data.user;
      setUser(updatedUser);
      queryClient.setQueryData(queryKeys.auth.me(), updatedUser);
      setAvatarPreview(null);
      setAvatarFile(null);
      toast.success("Profile updated!");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update profile"),
  });

  // ── Password form ─────────────────────────────────────────────────────────────
  const passwordForm = useForm({ resolver: zodResolver(passwordSchema) });

  const { mutate: changePassword, isPending: changingPassword } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosInstance.patch("/auth/change-password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password changed successfully!");
      passwordForm.reset();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to change password"),
  });

  // ── Workspace form ────────────────────────────────────────────────────────────
  const wsForm = useForm({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: wsData?.workspace?.name || "",
      description: wsData?.workspace?.description || "",
    },
  });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2MB");
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleDeleteWorkspace = () => {
    if (!window.confirm(`Delete "${wsData?.workspace?.name}"? This will permanently delete all projects and tasks. This cannot be undone.`)) return;
    deleteWorkspace(workspaceId);
  };

  const avatarSrc = avatarPreview || user?.avatar;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-semibold text-white mb-1">Settings</h1>
        <p className="text-gray-400 text-sm">Manage your profile and workspace</p>
      </motion.div>

      {/* ── Profile section ────────────────────────────────────────────────────── */}
      <Section title="Your profile" description="Update your name and avatar">
        <form onSubmit={profileForm.handleSubmit(updateProfile)} className="space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-violet-600 flex items-center justify-center text-white text-xl font-semibold overflow-hidden">
                {avatarSrc ? (
                  <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0]?.toUpperCase()
                )}
              </div>
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-full flex items-center justify-center transition-colors"
              >
                <Camera size={11} className="text-gray-300" />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-white text-sm font-medium">{user?.name}</p>
              <p className="text-gray-500 text-xs">{user?.email}</p>
              {avatarPreview && (
                <p className="text-violet-400 text-xs mt-0.5">New avatar selected — save to apply</p>
              )}
            </div>
          </div>

          <Field label="Full name" error={profileForm.formState.errors.name?.message}>
            <Input
              {...profileForm.register("name")}
              placeholder="Your name"
            />
          </Field>

          <button
            type="submit"
            disabled={updatingProfile}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            {updatingProfile && <Loader2 size={14} className="animate-spin" />}
            {updatingProfile ? "Saving..." : "Save changes"}
          </button>
        </form>
      </Section>

      {/* ── Password section ───────────────────────────────────────────────────── */}
      <Section title="Change password" description="Use a strong password you don't use elsewhere">
        <form onSubmit={passwordForm.handleSubmit(changePassword)} className="space-y-4">
          <Field label="Current password" error={passwordForm.formState.errors.currentPassword?.message}>
            <Input
              {...passwordForm.register("currentPassword")}
              type="password"
              placeholder="••••••••"
            />
          </Field>
          <Field label="New password" error={passwordForm.formState.errors.newPassword?.message}>
            <Input
              {...passwordForm.register("newPassword")}
              type="password"
              placeholder="Min. 6 characters"
            />
          </Field>
          <Field label="Confirm new password" error={passwordForm.formState.errors.confirmPassword?.message}>
            <Input
              {...passwordForm.register("confirmPassword")}
              type="password"
              placeholder="••••••••"
            />
          </Field>
          <button
            type="submit"
            disabled={changingPassword}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
          >
            {changingPassword && <Loader2 size={14} className="animate-spin" />}
            {changingPassword ? "Changing..." : "Change password"}
          </button>
        </form>
      </Section>

      {/* ── Workspace section ──────────────────────────────────────────────────── */}
      {workspaceId && wsData?.workspace && (
        <>
          <Section title="Workspace settings" description="Update your workspace name and description">
            <form
              onSubmit={wsForm.handleSubmit((data) => updateWorkspace(data))}
              className="space-y-4"
            >
              <Field label="Workspace name" error={wsForm.formState.errors.name?.message}>
                <Input {...wsForm.register("name")} placeholder="Workspace name" />
              </Field>
              <Field label="Description" error={wsForm.formState.errors.description?.message}>
                <textarea
                  {...wsForm.register("description")}
                  rows={2}
                  placeholder="What is this workspace for?"
                  className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-600 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition resize-none"
                />
              </Field>
              <button
                type="submit"
                disabled={updatingWs}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"
              >
                {updatingWs && <Loader2 size={14} className="animate-spin" />}
                {updatingWs ? "Saving..." : "Save workspace"}
              </button>
            </form>
          </Section>

          {/* ── Danger zone ───────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 border border-red-900/50 rounded-xl overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-red-900/30">
              <h2 className="text-red-400 font-medium text-sm flex items-center gap-2">
                <AlertTriangle size={14} />
                Danger zone
              </h2>
              <p className="text-gray-500 text-xs mt-0.5">
                These actions are permanent and cannot be undone.
              </p>
            </div>
            <div className="p-6 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-white text-sm font-medium mb-0.5">Delete workspace</p>
                <p className="text-gray-500 text-xs">
                  Permanently deletes this workspace, all projects, and all tasks.
                </p>
              </div>
              <button
                onClick={handleDeleteWorkspace}
                disabled={deleting}
                className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 border border-red-600/30 text-red-400 font-medium px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50 flex-shrink-0"
              >
                {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                {deleting ? "Deleting..." : "Delete workspace"}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default SettingsPage;