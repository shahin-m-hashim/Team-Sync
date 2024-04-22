const {
  setSubTeamIcon,
  getSubTeamDetails,
  setSubTeamDetails,
  removeSubTeamIcon,
  getSubTeamMembers,
  getSubTeamActivities,
  setSubTeamActivities,
  setSubTeamCollaborator,
  removeSubTeamCollaborator,
} = require("../services/subTeamService");

// GET Requests
const fetchSubTeamDetails = async (req, res, next) => {
  try {
    const { subTeamId } = req.params;
    const subTeam = await getSubTeamDetails(subTeamId);
    res.status(200).json(subTeam);
  } catch (e) {
    next(e);
  }
};

const fetchSubTeamActivities = async (req, res, next) => {
  try {
    const { subTeamId } = req.params;
    const activities = await getSubTeamActivities(subTeamId);
    res.status(200).json(activities);
  } catch (e) {
    next(e);
  }
};

const fetchSubTeamMembers = async (req, res, next) => {
  try {
    const { subTeamId } = req.params;
    const { subTeamMembers } = await getSubTeamMembers(subTeamId);
    res.status(200).json(subTeamMembers);
  } catch (e) {
    next(e);
  }
};

// const fetchSubTeamTasks = async (req, res, next) => {
//   try {
//     const { userId } = req.user;
//     const { subTeamId } = req.params;

//     const tasks = await getSubTeamTasks(subTeamId, userId);
//     res.status(200).json(tasks);
//   } catch (e) {
//     next(e);
//   }
// };

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
    const { subTeamId } = req.params;
    const { updatedSubTeamDetails } = req.body;
    await setSubTeamDetails(subTeamId, updatedSubTeamDetails);
    res.status(200).json({
      success: true,
      message: "Sub team details updated successfully",
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

const handleSubTeamActivities = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { subTeamId } = req.params;

    await setSubTeamActivities(userId, subTeamId);
    res.status(200).json({
      success: true,
      message: "Sub team activities updated successfully",
    });
  } catch (e) {
    next(e);
  }
};

const updateSubTeamIcon = async (req, res, next) => {
  try {
    const { subTeamId } = req.params;
    const { updatedSubTeamIcon } = req.body;

    console.log(updatedSubTeamIcon);

    await setSubTeamIcon(subTeamId, updatedSubTeamIcon);
    res
      .status(200)
      .json({ success: true, message: "Sub team icon updated successfully" });
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
    const { subTeamId } = req.params;
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
  updateSubTeamIcon,
  deleteSubTeamIcon,
  fetchSubTeamDetails,
  fetchSubTeamMembers,
  updateSubTeamDetails,
  fetchSubTeamActivities,
  addSubTeamCollaborator,
  handleSubTeamActivities,
  kickSubTeamCollaborator,
};
