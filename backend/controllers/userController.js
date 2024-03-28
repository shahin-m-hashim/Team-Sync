const {
  removeAccount,
  setProfilePic,
  removeProfilePic,
  getPrimaryDetails,
  setPrimaryDetails,
  getSecondaryDetails,
  setSecondaryDetails,
} = require("../services/userService");

// FETCH REQUESTS
const fetchPrimaryDetails = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const PrimaryDetails = await getPrimaryDetails(userId);
    res.status(200).json({ success: true, data: PrimaryDetails });
  } catch (e) {
    next(e);
  }
};

const fetchSecondaryDetails = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const SecondaryDetails = await getSecondaryDetails(userId);
    res.status(200).json({ success: true, data: SecondaryDetails });
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
    res.status(200).json({
      success: true,
      data: { updatedProfilePic },
      message: "Profile picture updated successfully",
    });
  } catch (e) {
    next(e);
  }
};

const updatePrimaryDetails = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { newPrimaryDetails } = req.body;
    const updatedPrimaryDetails = await setPrimaryDetails(
      userId,
      newPrimaryDetails
    );
    res.status(200).json({
      success: true,
      data: { updatedPrimaryDetails },
      message: "Basic details updated successfully",
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
      data: {
        updatedSecondaryDetails,
      },
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
  fetchPrimaryDetails,
  updatePrimaryDetails,
  fetchSecondaryDetails,
  updateSecondaryDetails,
};
