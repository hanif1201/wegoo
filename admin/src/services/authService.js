// src/services/authService.js
import api from "./api";

export const login = async (credentials) => {
  try {
    // Path depends on your route structure in backend:
    // Option 1: If admin routes are in auth.js with admin prefix
    const response = await api.post("/auth/admin/login", credentials);

    // Option 2: If admin routes are in admin.js without admin prefix
    // const response = await api.post("/admin/login", credentials);

    if (response.data && response.data.token) {
      localStorage.setItem("adminToken", response.data.token);
    }

    return response.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getCurrentAdmin = async () => {
  try {
    const response = await api.get("/admin/me");
    return response.data;
  } catch (error) {
    console.error("Error getting current admin:", error);
    localStorage.removeItem("adminToken"); // Clear token on auth error
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem("adminToken");
};
