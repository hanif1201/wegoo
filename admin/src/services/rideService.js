// src/services/rideService.js
import axios from "axios";
import { API_BASE_URL } from "../config/constants";

// Get rides with pagination and filters
export const getRides = async (page = 1, limit = 10, filters = {}) => {
  const response = await axios.get(`${API_BASE_URL}/admin/rides`, {
    params: { page, limit, ...filters },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  return response.data;
};

// Get a specific ride by ID
export const getRideById = async (rideId) => {
  const response = await axios.get(`${API_BASE_URL}/admin/rides/${rideId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  return response.data;
};

// Update ride status
export const updateRideStatus = async (rideId, status) => {
  const response = await axios.patch(
    `${API_BASE_URL}/admin/rides/${rideId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }
  );
  return response.data;
};

// Get ride statistics by period (day, week, month, year)
export const getRideStats = async (period = "week") => {
  const response = await axios.get(`${API_BASE_URL}/admin/rides/stats`, {
    params: { period },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  return response;
};
