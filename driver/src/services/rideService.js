// src/services/rideService.js
import api from "./api";

export const getAvailableRides = async () => {
  const response = await api.get("/rides/available");
  return response.data;
};

export const acceptRide = async (rideId) => {
  const response = await api.put(`/rides/${rideId}/accept`);
  return response.data;
};

export const updateRideStatus = async (rideId, status) => {
  const response = await api.put(`/rides/${rideId}/status`, { status });
  return response.data;
};

export const getRiderRideHistory = async () => {
  const response = await api.get("/rides/rider-history");
  return response.data;
};

export const getRideDetails = async (rideId) => {
  const response = await api.get(`/rides/${rideId}`);
  return response.data;
};

export const rateRide = async (rideId, ratingData) => {
  const response = await api.post(`/rides/${rideId}/rate`, ratingData);
  return response.data;
};

export const getEarningsSummary = async (period = "week") => {
  const response = await api.get(`/riders/earnings?period=${period}`);
  return response.data;
};
