const {
  setInvitation,
  createProject,
  removeAccount,
  setProfilePic,
  getUserDetails,
  getAllUserTeams,
  removeProfilePic,
  setPrimaryDetails,
  setContactDetails,
  setSecurityDetails,
  getAllUserProjects,
  getAllUserSubTeams,
  setSecondaryDetails,
  getAllUserInvitations,
  getAllUserNotifications,
} = require("../services/userService");

// POST REQUESTS
const addProject = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { projectDetails } = req.body;
    const projectId = await createProject(userId, projectDetails);
    console.log(`New project ${projectId} is created for user ${userId}`);
    res.status(201).json({
      success: true,
      message: "Project created successfully",
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      const customError = new Error("ValidationError");
      customError.errors = e.errors;
      next(customError);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      next(new Error("ProjectAlreadyExists"));
    }
    next(e);
  }
};

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

const fetchAllUserProjects = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const projects = await getAllUserProjects(userId);
    res.status(200).json(projects);
  } catch (e) {
    next(e);
  }
};

const fetchAllUserTeams = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const teams = await getAllUserTeams(userId);
    res.status(200).json(teams);
  } catch (e) {
    next(e);
  }
};

const fetchAllUserSubTeams = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const subTeams = await getAllUserSubTeams(userId);
    res.status(200).json(subTeams);
  } catch (e) {
    next(e);
  }
};

const fetchAllUserInvitations = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const invitations = await getAllUserInvitations(userId);
    res.status(200).json(invitations);
  } catch (e) {
    next(e);
  }
};

const fetchAllUserNotifications = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const notifications = await getAllUserNotifications(userId);
    res.status(200).json(notifications);
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
    if (e.name === "ValidationError") {
      const customError = new Error("ValidationError");
      customError.errors = e.errors;
      next(customError);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      next(new Error("UserAlreadyExists"));
    }
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
    await setSecondaryDetails(userId, newSecondaryDetails);
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

const updateContactDetails = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { newContactDetails } = req.body;
    await setContactDetails(userId, newContactDetails);
    res.status(200).json({
      success: true,
      message: "Contact details updated successfully",
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

const updateSecurityDetails = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { newSecurityDetails } = req.body;
    await setSecurityDetails(userId, newSecurityDetails);
    res.status(200).json({
      success: true,
      message: "Security details updated successfully",
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

const handleInvitation = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { inviteId, status } = req.params;

    await setInvitation(userId, inviteId, status);

    res.status(200).json({
      success: true,
      message: "Invitation handled successfully",
    });
  } catch (e) {
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
  const { userId } = req.user;
  const { password } = req.body;
  try {
    await removeAccount(userId, password);
    res.clearCookie("accJwt");
    res.clearCookie("refJwt");
    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addProject,
  deleteAccount,
  updateProfilePic,
  handleInvitation,
  deleteProfilePic,
  fetchUserDetails,
  fetchAllUserTeams,
  fetchAllUserSubTeams,
  fetchAllUserProjects,
  updatePrimaryDetails,
  updateContactDetails,
  updateSecurityDetails,
  updateSecondaryDetails,
  fetchAllUserInvitations,
  fetchAllUserNotifications,
};
