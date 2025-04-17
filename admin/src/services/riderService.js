// src/services/riderService.js
import api from "./api";

export const getRiders = async (page = 1, limit = 10, search = "") => {
  const response = await api.get("/admin/riders", {
    params: { page, limit, search },
  });
  return response.data;
};

export const getRiderById = async (riderId) => {
  const response = await api.get(`/admin/riders/${riderId}`);
  return response.data;
};

export const updateRiderStatus = async (riderId, status) => {
  const response = await api.put(`/admin/riders/${riderId}/status`, { status });
  return response.data;
};

export const verifyRiderDocument = async (
  riderId,
  documentId,
  verificationStatus
) => {
  const response = await api.put(
    `/admin/riders/${riderId}/documents/${documentId}`,
    {
      verificationStatus,
    }
  );
  return response.data;
};

export const getRiderStats = async () => {
  const response = await api.get("/admin/rider-stats");
  return response.data;
};
