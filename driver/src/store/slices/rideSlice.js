// src/store/slices/rideSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as rideService from "../../services/rideService";

export const acceptRide = createAsyncThunk(
  "ride/accept",
  async (rideId, { rejectWithValue }) => {
    try {
      return await rideService.acceptRide(rideId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to accept ride" }
      );
    }
  }
);

export const updateRideStatus = createAsyncThunk(
  "ride/updateStatus",
  async ({ rideId, status }, { rejectWithValue }) => {
    try {
      return await rideService.updateRideStatus(rideId, status);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update ride status" }
      );
    }
  }
);

export const fetchRideDetails = createAsyncThunk(
  "ride/fetchDetails",
  async (rideId, { rejectWithValue }) => {
    try {
      return await rideService.getRideDetails(rideId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch ride details" }
      );
    }
  }
);

export const fetchRideHistory = createAsyncThunk(
  "ride/fetchHistory",
  async (_, { rejectWithValue }) => {
    try {
      return await rideService.getRiderRideHistory();
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch ride history" }
      );
    }
  }
);

export const rateRide = createAsyncThunk(
  "ride/rate",
  async ({ rideId, ratingData }, { rejectWithValue }) => {
    try {
      return await rideService.rateRide(rideId, ratingData);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to rate ride" }
      );
    }
  }
);

const rideSlice = createSlice({
  name: "ride",
  initialState: {
    currentRide: null,
    rideHistory: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearRideError: (state) => {
      state.error = null;
    },
    updateCurrentRide: (state, action) => {
      state.currentRide = action.payload;
    },
    clearCurrentRide: (state) => {
      state.currentRide = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Accept Ride
      .addCase(acceptRide.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(acceptRide.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRide = action.payload.data;
      })
      .addCase(acceptRide.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to accept ride";
      })

      // Update Ride Status
      .addCase(updateRideStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRideStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRide = action.payload.data;
      })
      .addCase(updateRideStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to update ride status";
      })

      // Fetch Ride Details
      .addCase(fetchRideDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRideDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRide = action.payload.data;
      })
      .addCase(fetchRideDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch ride details";
      })

      // Fetch Ride History
      .addCase(fetchRideHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRideHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rideHistory = action.payload.data;
      })
      .addCase(fetchRideHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch ride history";
      })

      // Rate Ride
      .addCase(rateRide.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(rateRide.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(rateRide.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to rate ride";
      });
  },
});

export const { clearRideError, updateCurrentRide, clearCurrentRide } =
  rideSlice.actions;
export default rideSlice.reducer;
