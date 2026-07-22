import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance.js";
import Section from "../ui/Section.jsx";
import Field from "../ui/Field.jsx";
import Input from "../ui/Input.jsx";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "Must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const PasswordSection = () => {
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

  return (
    <Section title="Change password" description="Use a strong password you don't use elsewhere">
      <form onSubmit={passwordForm.handleSubmit(changePassword)} className="space-y-4">
        <Field label="Current password" error={passwordForm.formState.errors.currentPassword?.message}>
          <Input {...passwordForm.register("currentPassword")} type="password" placeholder="••••••••" />
        </Field>
        <Field label="New password" error={passwordForm.formState.errors.newPassword?.message}>
          <Input {...passwordForm.register("newPassword")} type="password" placeholder="Min. 6 characters" />
        </Field>
        <Field label="Confirm new password" error={passwordForm.formState.errors.confirmPassword?.message}>
          <Input {...passwordForm.register("confirmPassword")} type="password" placeholder="••••••••" />
        </Field>
        <button
          type="submit"
          disabled={changingPassword}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-500 disabled:opacity-50 text-white font-medium px-4 py-2.5 sm:py-2 rounded-lg text-sm transition-colors"
        >
          {changingPassword && <Loader2 size={14} className="animate-spin" />}
          {changingPassword ? "Changing..." : "Change password"}
        </button>
      </form>
    </Section>
  );
};

export default PasswordSection;