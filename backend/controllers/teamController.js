const {
  assignTask,
  setTeamIcon,
  setTeamGuide,
  getTeamTasks,
  setTeamLeader,
  getTeamDetails,
  removeTeamIcon,
  setTeamDetails,
  getTeamMembers,
  createTeamMember,
  getTeamActivities,
  setTeamActivities,
  removeTeamCollaborator,
} = require("../services/teamService");

// GET Requests
const fetchTeamDetails = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const project = await getTeamDetails(teamId);
    res.status(200).json(project);
  } catch (e) {
    next(e);
  }
};

const fetchTeamActivities = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { teamId } = req.params;
    const activities = await getTeamActivities(userId, teamId);
    res.status(200).json(activities);
  } catch (e) {
    next(e);
  }
};

const fetchTeamMembers = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { members } = await getTeamMembers(teamId);

    console.log(members);

    res.status(200).json(members);
  } catch (e) {
    next(e);
  }
};

const fetchTeamTasks = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const tasks = await getTeamTasks(teamId);
    res.status(200).json(tasks);
  } catch (e) {
    next(e);
  }
};

// POST REQUESTS
const addTeamMember = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { username } = req.body;
    await createTeamMember(teamId, username);
    res.status(200).json({
      success: true,
      message: `User ${username} added successfully to team ${teamId} as a member`,
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

const addTask = async (req, res, next) => {
  try {
    const { task } = req.body;
    const { userId } = req.user;
    const { teamId } = req.params;
    const taskId = await assignTask(userId, teamId, task);
    res.status(201).json({
      success: true,
      message: `New task ${taskId} created and assigned successfully`,
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      const customError = new Error("ValidationError");
      customError.errors = e.errors;
      next(customError);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      next(new Error("TaskAlreadyExists"));
    }
    next(e);
  }
};

// PATCH REQUESTS
const updateTeamDetails = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { updatedTeamDetails } = req.body;
    await setTeamDetails(teamId, updatedTeamDetails);
    res.status(200).json({
      success: true,
      message: "Team details updated successfully",
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

const updateTeamLeader = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { teamId } = req.params;
    const { username } = req.body;
    await setTeamLeader(teamId, userId, username);
    res.status(200).json({
      success: true,
      message: "Team leader updated successfully",
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

const updateTeamGuide = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { username } = req.body;
    await setTeamGuide(teamId, username);
    res.status(200).json({
      success: true,
      message: "Team guide updated successfully",
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

const handleTeamActivities = async (req, res, next) => {
  try {
    const { userId } = req.user;
    const { teamId } = req.params;

    await setTeamActivities(userId, teamId);
    res.status(200).json({
      success: true,
      message: "Team activities updated successfully",
    });
  } catch (e) {
    next(e);
  }
};

const updateTeamIcon = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { updatedTeamIcon } = req.body;
    await setTeamIcon(teamId, updatedTeamIcon);
    res
      .status(200)
      .json({ success: true, message: "Team icon updated successfully" });
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
const deleteTeamIcon = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    await removeTeamIcon(teamId);
    res.status(200).json({
      success: true,
      message: "Team icon deleted successfully",
    });
  } catch (e) {
    next(e);
  }
};

const kickTeamCollaborator = async (req, res, next) => {
  try {
    const { teamId, collaboratorUsername, role } = req.params;
    await removeTeamCollaborator(teamId, collaboratorUsername, role);
    res.status(200).json({
      success: true,
      message: "Team Collaborator kicked successfully",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  addTask,
  addTeamMember,
  updateTeamIcon,
  deleteTeamIcon,
  fetchTeamTasks,
  updateTeamGuide,
  fetchTeamDetails,
  fetchTeamMembers,
  updateTeamLeader,
  updateTeamDetails,
  fetchTeamActivities,
  handleTeamActivities,
  kickTeamCollaborator,
};
