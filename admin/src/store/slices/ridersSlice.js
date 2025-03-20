// src/store/slices/ridersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as riderService from "../../services/riderService";

export const fetchRiders = createAsyncThunk(
  "riders/fetchRiders",
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      return await riderService.getRiders(page, limit, search);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch riders" }
      );
    }
  }
);

export const fetchRiderDetails = createAsyncThunk(
  "riders/fetchRiderDetails",
  async (riderId, { rejectWithValue }) => {
    try {
      return await riderService.getRiderById(riderId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch rider details" }
      );
    }
  }
);

export const updateRiderStatus = createAsyncThunk(
  "riders/updateStatus",
  async ({ riderId, status }, { rejectWithValue }) => {
    try {
      return await riderService.updateRiderStatus(riderId, status);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update rider status" }
      );
    }
  }
);

export const verifyRiderDocument = createAsyncThunk(
  "riders/verifyDocument",
  async ({ riderId, documentId, verificationStatus }, { rejectWithValue }) => {
    try {
      return await riderService.verifyRiderDocument(
        riderId,
        documentId,
        verificationStatus
      );
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to verify document" }
      );
    }
  }
);

export const fetchRiderStats = createAsyncThunk(
  "riders/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      return await riderService.getRiderStats();
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch rider statistics" }
      );
    }
  }
);

const ridersSlice = createSlice({
  name: "riders",
  initialState: {
    ridersList: {
      data: [],
      totalPages: 0,
      currentPage: 1,
      totalRiders: 0,
    },
    currentRider: null,
    stats: null,
    isLoading: false,
    detailsLoading: false,
    error: null,
  },
  reducers: {
    clearRiderError: (state) => {
      state.error = null;
    },
    clearCurrentRider: (state) => {
      state.currentRider = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch riders list
      .addCase(fetchRiders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchRiders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ridersList = {
          data: action.payload.data,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage,
          totalRiders: action.payload.totalItems,
        };
      })
      .addCase(fetchRiders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch riders";
      })

      // Fetch rider details
      .addCase(fetchRiderDetails.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchRiderDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.currentRider = action.payload.data;
      })
      .addCase(fetchRiderDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch rider details";
      })

      // Update rider status
      .addCase(updateRiderStatus.fulfilled, (state, action) => {
        if (
          state.currentRider &&
          state.currentRider._id === action.payload.data._id
        ) {
          state.currentRider = action.payload.data;
        }

        // Update in list if present
        const index = state.ridersList.data.findIndex(
          (rider) => rider._id === action.payload.data._id
        );
        if (index !== -1) {
          state.ridersList.data[index] = action.payload.data;
        }
      })
      .addCase(updateRiderStatus.rejected, (state, action) => {
        state.error =
          action.payload?.message || "Failed to update rider status";
      })

      // Verify rider document
      .addCase(verifyRiderDocument.fulfilled, (state, action) => {
        if (
          state.currentRider &&
          state.currentRider._id === action.payload.data._id
        ) {
          state.currentRider = action.payload.data;
        }

        // Update in list if present
        const index = state.ridersList.data.findIndex(
          (rider) => rider._id === action.payload.data._id
        );
        if (index !== -1) {
          state.ridersList.data[index] = action.payload.data;
        }
      })
      .addCase(verifyRiderDocument.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to verify document";
      })

      // Fetch rider stats
      .addCase(fetchRiderStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchRiderStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.data;
      })
      .addCase(fetchRiderStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch rider statistics";
      });
  },
});

export const { clearRiderError, clearCurrentRider } = ridersSlice.actions;
export default ridersSlice.reducer;
