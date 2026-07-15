import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerAPI, loginAPI, logoutAPI, getMeAPI } from "../api/auth.api.js";
import useAuthStore from "../store/authStore.js";
import { queryKeys } from "../utils/queryKeys.js";

export const useRegister = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerAPI,
    onSuccess: (data) => {
      const { user, accessToken } = data.data;
      setAuth(user, accessToken);
      queryClient.setQueryData(queryKeys.auth.me(), user);
      toast.success(`Welcome to DevBoard, ${user.name.split(" ")[0]}!`);
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Registration failed");
    },
  });
};

export const useLogin = () => {
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginAPI,
    onSuccess: (data) => {
      const { user, accessToken } = data.data;
      setAuth(user, accessToken);
      queryClient.setQueryData(queryKeys.auth.me(), user);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);

      // Super Admin goes to /admin, everyone else goes to /dashboard
      if (user.isSuperAdmin === true) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Invalid email or password");
    },
  });
};

export const useLogout = () => {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutAPI,
    onSettled: () => {
      logout();
      queryClient.clear();
      toast.success("Logged out successfully");
      navigate("/login");
    },
  });
};

export const useGetMe = () => {
  const { isAuthenticated, setUser, logout } = useAuthStore();

  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const data = await getMeAPI();
      setUser(data.data.user);
      return data.data.user;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
    retry: false,
    onError: () => {
      logout();
    },
  });
};