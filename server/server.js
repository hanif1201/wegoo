// Update your server.js file
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http"); // Add this
const socketio = require("socket.io"); // Add this
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize app
const app = express();
const server = http.createServer(app); // Create HTTP server
const io = socketio(server, {
  cors: {
    origin: "*", // Allow all origins in development
    methods: ["GET", "POST"],
  },
}); // Initialize Socket.io

// Middleware
app.use(express.json());
// app.use(cors());
app.use(
  cors({
    origin: [
      "https://wegoo-sepia.vercel.app/api", // Your Render frontend URL
      "http://localhost:3000/api", // Keep for local development
    ],
    credentials: true,
  })
);
app.use((req, res, next) => {
  console.log("Incoming request:", {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body,
  });
  next();
});
app.use(helmet());
app.use(morgan("dev"));

// Define routes
app.get("/", (req, res) => {
  res.send("Rider App API Running");
});

// // Add this before the admin routes in server.js
// app.use("/api/admin", (req, res, next) => {
//   console.log("Admin route accessed:", req.method, req.path);
//   console.log("Auth header:", req.headers.authorization);
//   next();
// });

// app.use("/api/auth/admin", (req, res, next) => {
//   console.log("Admin auth route accessed:", req.method, req.path);
//   console.log("Auth header:", req.headers.authorization);
//   next();
// });
// Add this BEFORE your routes
app.use((req, res, next) => {
  // Log all requests
  // console.log(`🔍 Request: ${req.method} ${req.path}`);

  // Log when response is sent
  res.on("finish", () => {
    // console.log(`📤 Response: ${res.statusCode} ${req.method} ${req.path}`);
  });

  next();
});
// API routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/rides", require("./routes/rides"));
app.use("/api/auth/admin", require("./routes/admin"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/auth", require("./routes/auth"));
// app.use("/api/users", require("./routes/user"));
// Add additional routes here as they are created

// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send("Server Error");
// });

// Modify your error handler
app.use((err, req, res, next) => {
  // console.error("❌ Error details:", {
  //   message: err.message,
  //   stack: err.stack,
  //   status: err.status || 500,
  //   path: req.path,
  //   method: req.method,
  //   headers: req.headers,
  // });

  res.status(err.status || 500).json({
    error: err.message || "Server Error",
    path: req.path,
  });
});

// Set up socket.io connection handler
io.on("connection", (socket) => {
  // console.log(`New WebSocket connection: ${socket.id}`);

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
