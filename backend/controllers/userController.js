const primaryDetails = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message || "An unknown error occurred while signing up",
    });
  }
};

module.exports = primaryDetails;
