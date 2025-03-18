import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Use your actual API URL
const API_URL = "http://192.168.1.100:5000/api"; // Update with your server IP address

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach authorization token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 errors by redirecting to login
    if (error.response && error.response.status === 401) {
      // Handle authentication error
    }
    return Promise.reject(error);
  }
);

export default api;
