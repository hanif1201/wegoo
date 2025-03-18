// src/services/authService.js
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerRider = async (riderData) => {
  const response = await api.post("/auth/rider/register", riderData);

  if (response.data.token) {
    await AsyncStorage.setItem("token", response.data.token);
  }

  return response.data;
};

export const loginRider = async (credentials) => {
  const response = await api.post("/auth/rider/login", credentials);

  if (response.data.token) {
    await AsyncStorage.setItem("token", response.data.token);
  }

  return response.data;
};

export const logoutRider = async () => {
  await AsyncStorage.removeItem("token");
  // Add any other cleanup needed
};

export const getCurrentRider = async () => {
  try {
    const response = await api.get("/riders/me");
    return response.data;
  } catch (error) {
    console.error("Error getting current rider:", error);
    return null;
  }
};

export const updateRiderProfile = async (riderData) => {
  const response = await api.put("/riders/profile", riderData);
  return response.data;
};

export const uploadRiderDocument = async (documentData) => {
  const formData = new FormData();

  formData.append("type", documentData.type);
  formData.append("document", {
    uri: documentData.uri,
    name: documentData.filename || "document.jpg",
    type: documentData.mimetype || "image/jpeg",
  });

  const response = await api.post("/riders/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
