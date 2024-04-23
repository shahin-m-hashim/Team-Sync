const {
  setSubTeamIcon,
  setSubTeamGuide,
  setSubTeamLeader,
  getSubTeamDetails,
  removeSubTeamIcon,
  setSubTeamDetails,
  getSubTeamMembers,
  createSubTeamMember,
  getSubTeamActivities,
  setSubTeamActivities,
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
    const { userId } = req.user;
    const { subTeamId } = req.params;
    const activities = await getSubTeamActivities(userId, subTeamId);
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
const addSubTeamMember = async (req, res, next) => {
  try {
    const { subTeamId } = req.params;
    const { username } = req.body;
    await createSubTeamMember(subTeamId, username);
    res.status(200).json({
      success: true,
      message: `User ${username} added successfully to sub team ${subTeamId} as a member`,
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

const updateSubTeamLeader = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { username } = req.body;
    const { subTeamId } = req.params;
    await setSubTeamLeader(subTeamId, userId, username);
    res.status(200).json({
      success: true,
      message: "Sub team leader updated successfully",
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      const customError = new Error("ValidationError");
      customError.errors = e.errors;
      next(customError);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      next(new Error("TeamAlreadyExists"));
    }
    next(e);
  }
};

const updateSubTeamGuide = async (req, res, next) => {
  try {
    const { username } = req.body;
    const { subTeamId } = req.params;
    await setSubTeamGuide(subTeamId, username);
    res.status(200).json({
      success: true,
      message: "Sub team guide updated successfully",
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      const customError = new Error("ValidationError");
      customError.errors = e.errors;
      next(customError);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      next(new Error("TeamAlreadyExists"));
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
  addSubTeamMember,
  updateSubTeamIcon,
  deleteSubTeamIcon,
  updateSubTeamGuide,
  fetchSubTeamDetails,
  fetchSubTeamMembers,
  updateSubTeamLeader,
  updateSubTeamDetails,
  fetchSubTeamActivities,
  handleSubTeamActivities,
  kickSubTeamCollaborator,
};
