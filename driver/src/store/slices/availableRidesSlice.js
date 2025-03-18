// src/store/slices/availableRidesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as rideService from "../../services/rideService";

export const fetchAvailableRides = createAsyncThunk(
  "availableRides/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await rideService.getAvailableRides();
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch available rides" }
      );
    }
  }
);

const availableRidesSlice = createSlice({
  name: "availableRides",
  initialState: {
    rides: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearAvailableRides: (state) => {
      state.rides = [];
    },
    addAvailableRide: (state, action) => {
      // Check if ride already exists
      const exists = state.rides.some(
        (ride) => ride._id === action.payload._id
      );
      if (!exists) {
        state.rides.push(action.payload);
      }
    },
    removeAvailableRide: (state, action) => {
      state.rides = state.rides.filter((ride) => ride._id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAvailableRides.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAvailableRides.fulfilled, (state, action) => {
        state.isLoading = false;
        state.rides = action.payload.data;
      })
      .addCase(fetchAvailableRides.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch available rides";
      });
  },
});

export const { clearAvailableRides, addAvailableRide, removeAvailableRide } =
  availableRidesSlice.actions;
export default availableRidesSlice.reducer;
