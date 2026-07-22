import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Camera, Loader2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import axiosInstance from "../../api/axiosInstance.js";
import useAuthStore from "../../store/authStore.js";
import { queryKeys } from "../../utils/queryKeys.js";
import Section from "../ui/Section.jsx";
import Field from "../ui/Field.jsx";
import Input from "../ui/Input.jsx";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
});

const ProfileSection = () => {
  const { user, setUser } = useAuthStore();
  const queryClient = useQueryClient();
  const avatarInputRef = useRef(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);

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

  const avatarSrc = avatarPreview || user?.avatar;

  return (
    <Section title="Your profile" description="Update your name and avatar">
      <form onSubmit={profileForm.handleSubmit(updateProfile)} className="space-y-5">
        <div className="flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap">
          <div className="relative flex-shrink-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-violet-600 flex items-center justify-center text-white text-lg sm:text-xl font-semibold overflow-hidden">
              {avatarSrc ? (
                <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name?.[0]?.toUpperCase()
              )}
            </div>
            <button
              type="button"
              onClick={() => avatarInputRef.current?.click()}
              aria-label="Change avatar"
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-700 hover:bg-gray-600 active:bg-gray-600 border border-gray-600 rounded-full flex items-center justify-center transition-colors"
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
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">{user?.name}</p>
            <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            {avatarPreview && (
              <p className="text-violet-400 text-xs mt-0.5">New avatar selected — save to apply</p>
            )}
          </div>
        </div>

        <Field label="Full name" error={profileForm.formState.errors.name?.message}>
          <Input {...profileForm.register("name")} placeholder="Your name" />
        </Field>

        <button
          type="submit"
          disabled={updatingProfile}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 active:bg-violet-500 disabled:opacity-50 text-white font-medium px-4 py-2.5 sm:py-2 rounded-lg text-sm transition-colors"
        >
          {updatingProfile && <Loader2 size={14} className="animate-spin" />}
          {updatingProfile ? "Saving..." : "Save changes"}
        </button>
      </form>
    </Section>
  );
};

export default ProfileSection;