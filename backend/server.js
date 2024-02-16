const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const requestLoger = require("./middlewares/logger");
const unknownRouteHandler = require("./middlewares/unknownRouteHandler");

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

// Route for root path
app.get("/", (req, res) => res.send("Hello World"));

// Unknown routes handling middleware
app.use("*", unknownRouteHandler);

const startApp = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Database connected successfully");
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port:", process.env.PORT);
    });
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

startApp();
