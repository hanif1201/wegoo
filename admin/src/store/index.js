// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import usersReducer from "./slices/usersSlice";
import ridersReducer from "./slices/ridersSlice";
import ridesReducer from "./slices/ridesSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    riders: ridersReducer,
    rides: ridesReducer,
  },
});

export default store;
