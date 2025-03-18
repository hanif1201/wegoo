// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authService from "../../services/authService";

export const registerRider = createAsyncThunk(
  "auth/register",
  async (riderData, { rejectWithValue }) => {
    try {
      return await authService.registerRider(riderData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Registration failed" }
      );
    }
  }
);

export const loginRider = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      return await authService.loginRider(credentials);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Login failed" }
      );
    }
  }
);

export const logoutRider = createAsyncThunk("auth/logout", async () => {
  await authService.logoutRider();
});

export const fetchCurrentRider = createAsyncThunk(
  "auth/fetchCurrentRider",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentRider();
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch rider data" }
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      return await authService.updateRiderProfile(profileData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update profile" }
      );
    }
  }
);

export const uploadDocument = createAsyncThunk(
  "auth/uploadDocument",
  async (documentData, { rejectWithValue }) => {
    try {
      return await authService.uploadRiderDocument(documentData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to upload document" }
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    rider: null,
    token: null,
    isAuthenticated: false,
    isAvailable: false,
    isLoading: false,
    documentUploading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAvailability: (state, action) => {
      state.isAvailable = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerRider.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerRider.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.rider = action.payload.rider;
      })
      .addCase(registerRider.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Registration failed";
      })

      // Login
      .addCase(loginRider.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginRider.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.rider = action.payload.rider;
        state.isAvailable = action.payload.rider?.isAvailable || false;
      })
      .addCase(loginRider.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Login failed";
      })

      // Logout
      .addCase(logoutRider.fulfilled, (state) => {
        state.rider = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isAvailable = false;
      })

      // Fetch current rider
      .addCase(fetchCurrentRider.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentRider.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rider = action.payload.data;
        state.isAuthenticated = true;
        state.isAvailable = action.payload.data?.isAvailable || false;
      })
      .addCase(fetchCurrentRider.rejected, (state) => {
        state.isLoading = false;
        state.rider = null;
        state.isAuthenticated = false;
        state.isAvailable = false;
      })

      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rider = action.payload.data;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to update profile";
      })

      // Upload document
      .addCase(uploadDocument.pending, (state) => {
        state.documentUploading = true;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.documentUploading = false;
        // Update documents array in rider object
        if (state.rider) {
          state.rider.documents = action.payload.data.documents;
        }
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.documentUploading = false;
        state.error = action.payload?.message || "Failed to upload document";
      });
  },
});

export const { clearError, setAvailability } = authSlice.actions;
export default authSlice.reducer;
