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
  const response = await api.get(`/admin/ride-stats?period=${period}`);
  return response.data;
};
