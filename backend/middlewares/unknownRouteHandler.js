const unknownRouteHandler = (req, res, err) => {
  console.log("Unknown Route Requested");
  res.status(404).json({
    success: false,
    message: "Looks like, the page you are looking for doesn't exist",
    error: {
      message: err.message || "Not Found",
    },
  });
};

module.exports = unknownRouteHandler;
