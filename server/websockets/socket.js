const socketio = require("socket.io");

let io;

const setupSocketIO = (server) => {
  io = socketio(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected");

    // Join user-specific room
    socket.on("join_user", (userId) => {
      socket.join(`user_${userId}`);
    });

    // Join driver-specific room
    socket.on("join_driver", (driverId) => {
      socket.join(`driver_${driverId}`);
    });

    // Update driver location
    socket.on("update_location", (data) => {
      // Broadcast to relevant rooms
      if (data.rideId) {
        io.to(`ride_${data.rideId}`).emit("driver_location", data);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  return io;
};

// Export the socket.io instance
module.exports = setupSocketIO;

// Export getter for io instance
module.exports.getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
