const {
  getProfilePic,
  setProfilePic,
  removeProfilePic,
  getBasicDetails,
  setBasicDetails,
  getPublicDetails,
  setPublicDetails,
} = require("../services/userService");

const fetchProfilePic = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const profilePic = await getProfilePic(userId);
    res.status(200).json({ success: true, data: profilePic });
  } catch (e) {
    next(e);
  }
};

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

const fetchBasicDetails = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const basicDetails = await getBasicDetails(userId);
    res.status(200).json({ success: true, data: basicDetails });
  } catch (e) {
    next(e);
  }
};

const updateBasicDetails = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { newBasicDetails } = req.body;
    const updatedBasicDetails = await setBasicDetails(userId, newBasicDetails);
    res.status(200).json({
      success: true,
      data: { updatedBasicDetails },
      message: "Basic details updated successfully",
    });
  } catch (e) {
    next(e);
  }
};

const fetchPublicDetails = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const publicDetails = await getPublicDetails(userId);
    res.status(200).json({ success: true, data: publicDetails });
  } catch (e) {
    next(e);
  }
};

const updatePublicDetails = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { newPublicDetails } = req.body;
    const updatedPublicDetails = await setPublicDetails(
      userId,
      newPublicDetails
    );
    res.status(200).json({
      success: true,
      data: {
        updatedPublicDetails,
      },
      message: "Public details updated successfully",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  fetchProfilePic,
  updateProfilePic,
  deleteProfilePic,
  fetchBasicDetails,
  updateBasicDetails,
  fetchPublicDetails,
  updatePublicDetails,
};
