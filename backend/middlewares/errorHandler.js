const errorHandler = (error, req, res, next) => {
  console.error(error.stack); // Log the error stack

  switch (error.message) {
    case "UserNotFound":
      return res.status(404).json({
        success: false,
        error: error.message,
        message: "User not found",
      });
    default:
      res.status(500).json({
        success: false,
        error: "Internal Server Error",
        message: error.message || "An unknown error occurred",
      });
  }
};

module.exports = errorHandler;
