// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import rideReducer from "./slices/rideSlice";
import availableRidesReducer from "./slices/availableRidesSlice";
import earningsReducer from "./slices/earningsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    ride: rideReducer,
    availableRides: availableRidesReducer,
    earnings: earningsReducer,
  },
});

export default store;
