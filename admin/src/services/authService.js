// src/services/authService.js
import api from "./api";

export const login = async (credentials) => {
  const response = await api.post("/auth/admin/login", credentials);

  if (response.data.token) {
    localStorage.setItem("adminToken", response.data.token);
  }

  return response.data;
};

export const logout = () => {
  localStorage.removeItem("adminToken");
};

export const getCurrentAdmin = async () => {
  try {
    const response = await api.get("/admin/me");
    return response.data;
  } catch (error) {
    console.error("Error getting current admin:", error);
    return null;
  }
};
