const errorHandler = (error, req, res, next) => {
  console.error(error.stack); // Log the error stack

  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: error.message || "An unknown error occurred while signing up",
  });
};

module.exports = errorHandler;
