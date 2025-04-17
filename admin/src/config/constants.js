// src/config/constants.js

// API URL based on environment
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// User status constants
export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

// Rider status constants
export const RIDER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  PENDING_VERIFICATION: "pending_verification",
};

// Ride status constants
export const RIDE_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  STARTED: "started",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Document verification status
export const DOCUMENT_STATUS = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
};
