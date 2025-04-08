import axios from "axios";

// Simple, direct URL without any string concatenation
const API_URL = "https://wegoo.onrender.com"; // Just this, nothing else

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add this to see exactly what URL is being used
api.interceptors.request.use(
  (config) => {
    console.log("Making request to:", config.baseURL + config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
