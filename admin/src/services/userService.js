// src/services/userService.js
import axios from "axios";
import { API_BASE_URL } from "../config/constants";

// Get users with pagination and search
export const getUsers = async (page = 1, limit = 10, search = "") => {
  const response = await axios.get(`${API_BASE_URL}/admin/users`, {
    params: { page, limit, search },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  return response.data;
};

// Get a specific user by ID
export const getUserById = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/admin/users/${userId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  return response.data;
};

// Update user status (active/inactive)
export const updateUserStatus = async (userId, status) => {
  const response = await axios.patch(
    `${API_BASE_URL}/admin/users/${userId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }
  );
  return response.data;
};

// Get user statistics
export const getUserStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/users/stats`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  return response;
};
