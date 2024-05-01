const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const { Server } = require("socket.io");
const { createServer } = require("http");
const cookieParser = require("cookie-parser");
const requestLogger = require("./middlewares/logger");
const errorHandler = require("./middlewares/errorHandler");
const { verifyAccessToken } = require("./middlewares/token");
const monitorTaskDeadline = require("./utils/monitorTaskDeadline");
const unknownRouteHandler = require("./middlewares/unknownRouteHandler");

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

const connectedUsers = {};

io.on("connection", (socket) => {
  console.log(`A new client ${socket.id} is now connected to this server`);

  socket.on("loggedIn", (userId) => (connectedUsers[userId] = socket.id));

  socket.on("disconnect", () => {
    const userId = Object.keys(connectedUsers).find(
      (key) => connectedUsers[key] === socket.id
    );
    if (userId) delete connectedUsers[userId];
    console.log(`The client ${socket.id} has disconnected from the server`);
  });
});

module.exports = { io, connectedUsers };

// Custom routes
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");
const publicRoutes = require("./routes/publicRoute");
const projectRoutes = require("./routes/projectRoute");

// Set the view engine to ejs
app.set("view engine", "ejs");

// Body parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// CORS middleware
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

// Logging middleware
app.use(requestLogger);

// Public Routes
app.use("/api", publicRoutes);

// Authentication Routes
app.use("/api/auth", authRoutes);

// Private Routes
app.use("/api/user/:userId", verifyAccessToken, [userRoutes, projectRoutes]);

// Unknown routes handling middleware
app.use("*", unknownRouteHandler);

// Error handling middleware
app.use(errorHandler);

const startApp = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI + "?retryWrites=true&w=majority"
    );
    console.log("Database connected successfully");

    httpServer.listen(process.env.PORT, () => {
      console.log("Server is running on port:", process.env.PORT);
    });

    await monitorTaskDeadline(io);
  } catch (error) {
    console.error("Database connection error:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  }
};

startApp();
