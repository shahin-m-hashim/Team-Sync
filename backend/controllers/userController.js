const {
  removeAccount,
  getUserDetails,
  setProfilePic,
  removeProfilePic,
  setPrimaryDetails,
  setSecondaryDetails,
} = require("../services/userService");

// FETCH REQUESTS
const fetchUserDetails = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const userDetails = await getUserDetails(userId);
    res.status(200).json(userDetails);
  } catch (e) {
    next(e);
  }
};

// PATCH REQUESTS
const updateProfilePic = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { newProfilePic } = req.body;
    const updatedProfilePic = await setProfilePic(userId, newProfilePic);
    res.status(200).json({ updatedProfilePic });
  } catch (e) {
    next(e);
  }
};

const updatePrimaryDetails = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { newPrimaryDetails } = req.body;
    await setPrimaryDetails(userId, newPrimaryDetails);
    res.status(200).json({
      success: true,
      message: "Primary details updated successfully",
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      const customError = new Error("ValidationError");
      customError.errors = e.errors;
      next(customError);
    }
    next(e);
  }
};

const updateSecondaryDetails = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { newSecondaryDetails } = req.body;
    const updatedSecondaryDetails = await setSecondaryDetails(
      userId,
      newSecondaryDetails
    );
    res.status(200).json({
      success: true,
      message: "Secondary details updated successfully",
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      const customError = new Error("ValidationError");
      customError.errors = e.errors;
      next(customError);
    }
    next(e);
  }
};

// DELETE REQUESTS
const deleteProfilePic = async (req, res, next) => {
  try {
    const { userId } = req.user;
    await removeProfilePic(userId);
    res.status(200).json({
      success: true,
      message: "Profile picture deleted successfully",
    });
  } catch (e) {
    next(e);
  }
};

const deleteAccount = async (req, res, next) => {
  try {
    res.clearCookie("accJwt");
    res.clearCookie("refJwt");
    const { userId } = req.user;
    await removeAccount(userId);
    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  deleteAccount,
  updateProfilePic,
  deleteProfilePic,
  fetchUserDetails,
  updatePrimaryDetails,
  updateSecondaryDetails,
};
