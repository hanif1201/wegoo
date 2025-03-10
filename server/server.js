const dotenv = require("dotenv");
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const setupSocketIO = require("./websockets/socket");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
setupSocketIO(server);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
