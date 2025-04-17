import api from "./api";

export const login = async (credentials) => {
  try {
    const response = await api.post("/admin/login", credentials);
    if (response.data?.token) {
      localStorage.setItem("adminToken", response.data.token);
    }
    return response.data;
  } catch (error) {
    console.error("Login service error:", error);
    throw error;
  }
};

export const getCurrentAdmin = async () => {
  try {
    const response = await api.get("/admin/me");
    return response.data;
  } catch (error) {
    console.error("Get admin error:", error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem("adminToken");
};
