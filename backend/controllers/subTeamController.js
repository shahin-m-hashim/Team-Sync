const {
  getSubTeam,
  setSubTeamIcon,
  setSubTeamDetails,
  removeSubTeamIcon,
  getSubTeamSettings,
  getSubTeamActivities,
  setSubTeamCollaborator,
  removeSubTeamCollaborator,
} = require("../services/subTeamService");

// GET Requests
const fetchSubTeam = async (req, res, next) => {
  try {
    const { subTeamId } = req.subTeam;
    const subTeam = await getSubTeam(subTeamId);
    res.status(200).json(subTeam);
  } catch (e) {
    next(e);
  }
};

const fetchSubTeamActivities = async (req, res, next) => {
  try {
    const { subTeamId } = req.subTeam;
    const activities = await getSubTeamActivities(subTeamId);
    res.status(200).json(activities);
  } catch (e) {
    next(e);
  }
};

// const fetchSubTeamTasks = async (req, res, next) => {
//   try {
//     const { userId } = req.user;
//     const { subTeamId } = req.subTeam;

//     const tasks = await getSubTeamTasks(subTeamId, userId);
//     res.status(200).json(tasks);
//   } catch (e) {
//     next(e);
//   }
// };

const fetchSubTeamSettings = async (req, res, next) => {
  try {
    const { subTeamId } = req.subTeam;

    const subTeamSettings = await getSubTeamSettings(subTeamId);
    res.status(200).json(subTeamSettings);
  } catch (e) {
    next(e);
  }
};

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

// DELETE Requests
const deleteSubTeamIcon = async (req, res, next) => {
  try {
    const { subTeamId } = req.subTeam;
    await removeSubTeamIcon(subTeamId);
    res.status(200).json({
      success: true,
      message: "Sub team icon deleted successfully",
    });
  } catch (e) {
    next(e);
  }
};

const kickSubTeamCollaborator = async (req, res, next) => {
  try {
    const { subTeamId, collaboratorUsername, role } = req.params;
    await removeSubTeamCollaborator(subTeamId, collaboratorUsername, role);
    res.status(200).json({
      success: true,
      message: "Sub team collaborator kicked successfully",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  fetchSubTeam,
  updateSubTeamIcon,
  deleteSubTeamIcon,
  updateSubTeamDetails,
  fetchSubTeamSettings,
  fetchSubTeamActivities,
  addSubTeamCollaborator,
  kickSubTeamCollaborator,
};
