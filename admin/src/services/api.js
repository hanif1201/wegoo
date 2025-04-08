// src/services/api.js
import axios from "axios";

// First, let's log the current environment
console.log("Current NODE_ENV:", process.env.NODE_ENV);

// Fixed API URL with /api path
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://wegoo.onrender.com/api"
    : "http://localhost:5000/api";

// Log the selected API URL to check what's being used
console.log("Selected API_URL:", API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Log each request for debugging
api.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.baseURL + config.url);

    const token = localStorage.getItem("adminToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
