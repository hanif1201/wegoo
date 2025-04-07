// src/store/slices/usersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as userService from "../../services/userService";

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async ({ page, limit, search }, { rejectWithValue }) => {
    try {
      return await userService.getUsers(page, limit, search);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch users" }
      );
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  "users/fetchUserDetails",
  async (userId, { rejectWithValue }) => {
    try {
      return await userService.getUserById(userId);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch user details" }
      );
    }
  }
);

export const updateUserStatus = createAsyncThunk(
  "users/updateStatus",
  async ({ userId, status }, { rejectWithValue }) => {
    try {
      return await userService.updateUserStatus(userId, status);
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to update user status" }
      );
    }
  }
);

export const fetchUserStats = createAsyncThunk(
  "users/fetchStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await userService.getUserStats();
      return response; // Return the entire response
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Failed to fetch user statistics" }
      );
    }
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: {
    usersList: {
      data: [],
      totalPages: 0,
      currentPage: 1,
      totalUsers: 0,
    },
    currentUser: null,
    stats: null,
    isLoading: false,
    detailsLoading: false,
    error: null,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch users list
      .addCase(fetchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.usersList = {
          data: action.payload.data,
          totalPages: action.payload.totalPages,
          currentPage: action.payload.currentPage,
          totalUsers: action.payload.totalItems,
        };
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch users";
      })

      // Fetch user details
      .addCase(fetchUserDetails.pending, (state) => {
        state.detailsLoading = true;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.currentUser = action.payload.data;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload?.message || "Failed to fetch user details";
      })

      // Update user status
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        if (
          state.currentUser &&
          state.currentUser._id === action.payload.data._id
        ) {
          state.currentUser = action.payload.data;
        }

        // Update in list if present
        const index = state.usersList.data.findIndex(
          (user) => user._id === action.payload.data._id
        );
        if (index !== -1) {
          state.usersList.data[index] = action.payload.data;
        }
      })

      // Fetch user stats
      .addCase(fetchUserStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload; // Store the entire response
      })
      .addCase(fetchUserStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch user statistics";
      });
  },
});

export const { clearUserError, clearCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;
