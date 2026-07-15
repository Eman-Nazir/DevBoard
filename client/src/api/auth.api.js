import axiosInstance from "./axiosInstance.js";

export const registerAPI = async (data) => {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
};

export const loginAPI = async (data) => {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
};

export const logoutAPI = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

export const getMeAPI = async () => {
  const response = await axiosInstance.get("/auth/me");
  return response.data;
};