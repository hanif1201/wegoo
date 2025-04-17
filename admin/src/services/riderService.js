// src/services/riderService.js
import axios from "axios";
import { API_BASE_URL } from "../config/constants";

// Get riders with pagination and search
export const getRiders = async (page = 1, limit = 10, search = "") => {
  const response = await axios.get(`${API_BASE_URL}/admin/riders`, {
    params: { page, limit, search },
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  return response.data;
};

// Get a specific rider by ID
export const getRiderById = async (riderId) => {
  const response = await axios.get(`${API_BASE_URL}/admin/riders/${riderId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  return response.data;
};

// Update rider status (active/inactive/suspended)
export const updateRiderStatus = async (riderId, status) => {
  const response = await axios.patch(
    `${API_BASE_URL}/admin/riders/${riderId}/status`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }
  );
  return response.data;
};

// Verify rider document
export const verifyRiderDocument = async (
  riderId,
  documentId,
  verificationStatus
) => {
  const response = await axios.patch(
    `${API_BASE_URL}/admin/riders/${riderId}/documents/${documentId}`,
    { verificationStatus },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }
  );
  return response.data;
};

// Get rider statistics
export const getRiderStats = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/riders/stats`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  return response.data;
};
