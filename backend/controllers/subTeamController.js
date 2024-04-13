const {
  // createTask,
  setSubTeamIcon,
  setSubTeamDetails,
  setSubTeamCollaborator,
} = require("../services/subTeamService");

// POST REQUESTS
const addSubTeamCollaborator = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { username, role, subTeamId } = req.subTeam;
    await setSubTeamCollaborator(userId, subTeamId, username, role);
    res.status(200).json({
      success: true,
      message: `User ${username} added successfully to sub team ${subTeamId} as a ${role}`,
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      const customError = new Error("ValidationError");
      customError.errors = e.errors;
      next(customError);
    } else {
      next(e);
    }
  }
};

// PATCH REQUESTS
const updateSubTeamDetails = async (req, res, next) => {
  try {
    const { subTeamId } = req.subTeam;
    const { newSubTeamDetails } = req.body;
    await setSubTeamDetails(subTeamId, newSubTeamDetails);
    res.status(200).json({
      success: true,
      message: "sub team details updated successfully",
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      const customError = new Error("ValidationError");
      customError.errors = e.errors;
      next(customError);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      next(new Error("subTeamAlreadyExists"));
    }
    next(e);
  }
};

const updateSubTeamIcon = async (req, res, next) => {
  try {
    const { subTeamId } = req.subTeam;
    const { newSubTeamIcon } = req.body;
    const updatedSubTeamIcon = await setSubTeamIcon(subTeamId, newSubTeamIcon);
    res.status(200).json({ updatedSubTeamIcon });
  } catch (e) {
    if (e.name === "ValidationError") {
      const customError = new Error("ValidationError");
      customError.errors = e.errors;
      next(customError);
    } else {
      next(e);
    }
  }
};

module.exports = {
  updateSubTeamIcon,
  updateSubTeamDetails,
  addSubTeamCollaborator,
};
