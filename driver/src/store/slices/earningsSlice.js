// src/store/slices/earningsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as rideService from "../../services/rideService";

export const fetchEarnings = createAsyncThunk(
  "earnings/fetch",
  async (period, { rejectWithValue }) => {
    try {
      return await rideService.getEarningsSummary(period);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch earnings" }
      );
    }
  }
);

const earningsSlice = createSlice({
  name: "earnings",
  initialState: {
    summary: null,
    transactions: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearEarningsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEarnings.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchEarnings.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload.data.summary;
        state.transactions = action.payload.data.transactions || [];
      })
      .addCase(fetchEarnings.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch earnings";
      });
  },
});

export const { clearEarningsError } = earningsSlice.actions;
export default earningsSlice.reducer;
