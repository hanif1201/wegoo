import axios from "axios";

// Use your actual API URL
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://https://wegoo.onrender.com" // Replace with your actual Render URL
    : "http://localhost:5000";

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
