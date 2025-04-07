// src/services/rideService.js
import api from "./api";

export const getRides = async (page = 1, limit = 10, filters = {}) => {
  const response = await api.get("/admin/rides", {
    params: { page, limit, ...filters },
  });
  return response.data;
};

export const getRideById = async (rideId) => {
  const response = await api.get(`/admin/rides/${rideId}`);
  return response.data;
};

export const updateRideStatus = async (rideId, status) => {
  const response = await api.put(`/admin/rides/${rideId}/status`, { status });
  return response.data;
};

export const getRideStats = async (period = "week") => {
  try {
    const response = await api.get(`/admin/rides/stats?period=${period}`);
    console.log("Ride stats response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching ride stats:",
      error.response?.data || error.message
    );
    throw error;
  }
};
