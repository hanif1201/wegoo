// src/services/userService.js
import api from "./api";

export const getUsers = async (page = 1, limit = 10, search = "") => {
  const response = await api.get("/admin/users", {
    params: { page, limit, search },
  });
  return response.data;
};

export const getUserById = async (userId) => {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
};

export const updateUserStatus = async (userId, status) => {
  const response = await api.put(`/admin/users/${userId}/status`, { status });
  return response.data;
};

export const getUserStats = async () => {
  const response = await api.get("/admin/user-stats");
  return response.data;
};
