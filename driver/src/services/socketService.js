// src/services/socketService.js
import io from "socket.io-client";
import { store } from "../store";
import { updateCurrentRide } from "../store/slices/rideSlice";
import {
  addAvailableRide,
  removeAvailableRide,
} from "../store/slices/availableRidesSlice";

let socket = null;

export const initSocket = (riderId, token) => {
  // Use your actual server URL
  socket = io("http://192.168.1.100:5000", {
    transports: ["websocket"],
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: Infinity,
  });

  // Connection events
  socket.on("connect", () => {
    console.log("Socket connected");

    // Authenticate as rider
    socket.emit("riderConnect", { riderId, token });
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("error", (error) => {
    console.error("Socket error:", error);
  });

  // Ride request events
  socket.on("newRideRequest", (data) => {
    console.log("New ride request:", data);
    // Add the new ride request to the available rides list
    store.dispatch(addAvailableRide(data));
  });

  socket.on("rideUnavailable", (data) => {
    console.log("Ride no longer available:", data);
    // Remove the ride from available rides
    store.dispatch(removeAvailableRide(data.rideId));
  });

  // Ride status events
  socket.on("rideStatusUpdated", (data) => {
    console.log("Ride status updated:", data);
    // Update current ride in Redux store
    const currentRide = store.getState().ride.currentRide;
    if (currentRide && currentRide._id === data.rideId) {
      store.dispatch(
        updateCurrentRide({
          ...currentRide,
          status: data.status,
          [data.status === "in-progress" ? "pickupTime" : "dropoffTime"]:
            data.timestamp,
        })
      );
    }
  });

  // Chat events
  socket.on("newMessage", (data) => {
    console.log("New message received:", data);
    // Handle new chat message
  });

  socket.on("errorMessage", (data) => {
    console.error("Socket error message:", data.message);
  });

  return socket;
};

export const closeSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

// Emit events
export const toggleRiderAvailability = (riderId, isAvailable) => {
  if (socket) {
    socket.emit("toggleAvailability", { riderId, isAvailable });
  }
};

export const acceptRideRequest = (rideId, riderId) => {
  if (socket) {
    socket.emit("acceptRide", { rideId, riderId });
  }
};

export const updateRiderLocation = (riderId, coordinates) => {
  if (socket) {
    socket.emit("updateLocation", {
      type: "rider",
      id: riderId,
      coordinates,
    });
  }
};

export const updateRideStatusSocket = (rideId, status, location) => {
  if (socket) {
    socket.emit("updateRideStatus", { rideId, status, location });
  }
};

export const sendMessage = (rideId, sender, message) => {
  if (socket) {
    socket.emit("sendMessage", { rideId, sender, message });
  }
};
