import axios from "axios";

// Use your actual API URL
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-render-backend-url.onrender.com"
    : "http://localhost:5000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Improved error handling in interceptor
api.interceptors.response.use(
  (response) => {
    // Ensure response always has a data property
    return {
      ...response,
      data: response.data || null,
    };
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error("Response error:", error.response);
      return Promise.reject({
        data: error.response.data || null,
        status: error.response.status,
        message: error.response.statusText,
      });
    } else if (error.request) {
      // Request was made but no response received
      console.error("Request error:", error.request);
      return Promise.reject({
        data: null,
        status: 500,
        message: "No response received from server",
      });
    } else {
      // Something else went wrong
      console.error("Error:", error.message);
      return Promise.reject({
        data: null,
        status: 500,
        message: error.message || "Unknown error occurred",
      });
    }
  }
);

export default api;
