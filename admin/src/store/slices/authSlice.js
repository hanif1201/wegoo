// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../services/authService";

export const loginAdmin = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.login(credentials);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

export const logoutAdmin = createAsyncThunk("auth/logout", async () => {
  authService.logout();
});

export const fetchCurrentAdmin = createAsyncThunk(
  "auth/fetchCurrentAdmin",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentAdmin();
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch admin data" }
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    admin: null,
    token: localStorage.getItem("adminToken"),
    isAuthenticated: !!localStorage.getItem("adminToken"),
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.admin = action.payload.admin;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Login failed";
      })

      // Logout
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.admin = null;
        state.token = null;
        state.isAuthenticated = false;
      })

      // Fetch current admin
      .addCase(fetchCurrentAdmin.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admin = action.payload.data;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentAdmin.rejected, (state) => {
        state.isLoading = false;
        state.admin = null;
        state.isAuthenticated = false;
        state.token = null;
        localStorage.removeItem("adminToken");
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
