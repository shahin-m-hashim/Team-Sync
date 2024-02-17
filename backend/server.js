const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const requestLoger = require("./middlewares/logger");

// Custom middlewares
const errorHandler = require("./middlewares/errorHandler");
const unknownRouteHandler = require("./middlewares/unknownRouteHandler");

const { verifyToken, refreshToken } = require("./middlewares/auth");

// custom routes
const authRoutes = require("./routes/authRoute");
const userRoutes = require("./routes/userRoute");

const app = express();

// Body parser middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser middleware
app.use(cookieParser());

// CORS middleware
app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));

// Custom middleware for logging request paths
app.use(requestLoger);

// Authentication Routes
app.use("/auth", authRoutes);

// Protected Routes
app.use("/api", verifyToken, userRoutes);
app.use("/refresh", refreshToken, verifyToken, userRoutes);

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
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port:", process.env.PORT);
    });
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
