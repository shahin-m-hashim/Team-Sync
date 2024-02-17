const getEntireUserDetails = require("../services/userService");

const primaryDetails = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      user: req.user,
    });
  } catch (e) {
    next(e);
  }
};

const entireDetails = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const user = await getEntireUserDetails(userId);
    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      user,
    });
  } catch (e) {
    if (e.message === "UserNotFound") {
      return res.status(404).json({
        success: false,
        error: e.message,
        message: "User not found, please check the user id and try again",
      });
    }
    next(e);
  }
};

module.exports = { primaryDetails, entireDetails };
