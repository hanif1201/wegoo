// src/store/slices/ridesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as rideService from "../../services/rideService";

export const fetchRides = createAsyncThunk(
  "rides/fetchRides",
  async ({ page, limit, filters }, { rejectWithValue }) => {
    try {
      return await rideService.getRides(page, limit, filters);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch rides" }
      );
    }
  }
);

export const fetchRideDetails = createAsyncThunk(
  "rides/fetchRideDetails",
  async (rideId, { rejectWithValue }) => {
    try {
      return await rideService.getRideById(rideId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch ride details" }
      );
    }
  }
);

export const updateRideStatus = createAsyncThunk(
  "rides/updateStatus",
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

export const fetchRideStats = createAsyncThunk(
  "rides/fetchStats",
  async (period = "week", { rejectWithValue }) => {
    try {
      const response = await rideService.getRideStats(period);
      return response; // Return entire response
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch ride statistics" }
      );
    }
  }
);

const ridesSlice = createSlice({
  name: "rides",
  initialState: {
    ridesList: {
      data: [],
      totalPages: 0,
      currentPage: 1,
      totalRides: 0,
    },
    currentRide: null,
    stats: null,
    isLoading: false,
    detailsLoading: false,
    error: null,
  },
  reducers: {
    clearRideError: (state) => {
      state.error = null;
    },
    clearCurrentRide: (state) => {
      state.currentRide = null;
    },
    setRideFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch rides list
      .addCase(fetchRides.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRides.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ridesList = {
          data: action.payload.data,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage,
          totalRides: action.payload.totalItems,
        };
      })
      .addCase(fetchRides.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch rides";
      })

      // Fetch ride details
      .addCase(fetchRideDetails.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchRideDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.currentRide = action.payload.data;
      })
      .addCase(fetchRideDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload?.message || "Failed to fetch ride details";
      })

      // Update ride status
      .addCase(updateRideStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateRideStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        if (
          state.currentRide &&
          state.currentRide._id === action.payload.data._id
        ) {
          state.currentRide = action.payload.data;
        }

        // Update in list if present
        const index = state.ridesList.data.findIndex(
          (ride) => ride._id === action.payload.data._id
        );
        if (index !== -1) {
          state.ridesList.data[index] = action.payload.data;
        }
      })
      .addCase(updateRideStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to update ride status";
      })

      // Fetch ride stats
      .addCase(fetchRideStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRideStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data; // This assumes the response has a data property
      })
      .addCase(fetchRideStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch ride statistics";
      });
  },
});

export const { clearRideError, clearCurrentRide, setRideFilter } =
  ridesSlice.actions;
export default ridesSlice.reducer;
