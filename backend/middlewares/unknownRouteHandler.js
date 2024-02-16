const unknownRouteHandler = (req, res, err) => {
  console.log("Unknown Route Requested");
  res.status(404).json({
    success: false,
    message: "Looks like, the page you are looking for doesn't exist",
    error: {
      errorCode: err.code || 404,
      errorMessage: err.message || "Not Found",
    },
  });
};

module.exports = unknownRouteHandler;
