// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http");
const socketio = require("socket.io");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize app
const app = express();
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());

// Correct CORS configuration
app.use(
  cors({
    origin: [
      "https://wegoo-sepia.vercel.app", // Remove /api
      "http://localhost:3000", // Remove /api
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Added methods
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"], // Added allowed headers
  })
);

// Handle OPTIONS preflight requests
app.options("*", cors());

// Debug middleware for incoming requests
app.use((req, res, next) => {
  console.log("Incoming request:", {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body,
  });
  next();
});

// Security and logging middleware
app.use(helmet());
app.use(morgan("dev"));

// Basic health check endpoint
app.get("/", (req, res) => {
  res.send("Rider App API Running");
});

// General request logging middleware
app.use((req, res, next) => {
  // Log when response is sent
  res.on("finish", () => {
    // console.log(`📤 Response: ${res.statusCode} ${req.method} ${req.path}`);
  });
  next();
});

// API routes - fixed to remove duplicates
app.use("/api/auth", require("./routes/auth"));
app.use("/api/rides", require("./routes/rides"));
app.use("/api/admin", require("./routes/admin"));

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    error: err.message || "Server Error",
    path: req.path,
  });
});

// Set up socket.io connection handler
io.on("connection", (socket) => {
  // Pass socket to the socket handler
  require("./socket")(io, socket);

  socket.on("disconnect", () => {
    // console.log(`WebSocket disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app; // For testing
